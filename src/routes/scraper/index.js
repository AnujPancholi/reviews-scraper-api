const express = require('express')
const { body, validationResult } = require('express-validator')
const ScrapingService = require('../../lib/scraping-service')

const ScraperRouter = (deps) => {
  const { ResponsefulError } = deps
  const router = express.Router()

  router.post(
    '/scrape',
    body('url').isURL().withMessage('Invalid URL'),
    (req, res, next) => {
      const validationErrors = validationResult(req)

      if (!validationErrors.isEmpty()) {
        const validationError = validationErrors.array()[0]
        return next(new ResponsefulError(validationError.msg, 400))
      }

      const urlObj = new URL(req.body.url)

      req.sanitizedUrlArgs = {
        url: `${urlObj.origin}${urlObj.pathname}`.toLowerCase(),
        params: ((paramsMap) => {
          const paramsObj = {}
          paramsMap.forEach((value, key) => {
            paramsObj[key] = value
          })
          return paramsObj
        })(urlObj.searchParams),
        href: urlObj.href,
      }

      return next()
    },
    async (req, res, next) => {
      try {
        const scrapingParams = req.sanitizedUrlArgs
        const scraper = ScrapingService.fromUrl(scrapingParams.url)

        if (!scraper) {
          throw new ResponsefulError('Scraper not found for target site', 404)
        }

        const scraperUrlValidation = scraper.validateUrl(req.sanitizedUrlArgs)
        if (!scraperUrlValidation.isValidated) {
          throw new ResponsefulError(
            scraperUrlValidation?.error?.message ?? 'Scraper validation failed',
            400
          )
        }

        const scrapingResult = await scraper.scrape({
          url: scrapingParams.href,
          traceId: req.id,
        })

        if (!scrapingResult.isSuccessful) {
          throw new ResponsefulError(
            `Scraping failed with error "${scrapingResult.error.message}"`,
            500
          )
        }

        res.builder.setCode(200).setData(scrapingResult.data).build()
        return next()
      } catch (e) {
        next(e)
      }
    }
  )

  return router
}

module.exports = {
  Router: ScraperRouter,
  deps: {},
}
