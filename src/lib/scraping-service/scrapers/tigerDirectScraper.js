const puppeteer = require('puppeteer')
const getLogger = require('../../logger.js')

const ScrapingUtils = (deps) => {
  const { logger, siteName, siteUrl } = deps

  const getScrapingResponse = (isSuccessful, data, error) => {
    return {
      isSuccessful,
      data,
      error,
    }
  }

  const validateUrl = (urlObj) => {
    if (typeof urlObj.params['EdpNo'] !== 'string') {
      return {
        isValidated: false,
        error: {
          message: 'EdpNo is not present in URL',
        },
      }
    }
    return {
      isValidated: true,
      error: null,
    }
  }

  const scrape = async ({ url, traceId }) => {
    try {
      logger.info({
        msg: 'Scraping init',
        traceId,
        siteName,
        url,
      })

      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        devtools: process.env.NODE_ENV === 'debug',
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
        ],
      })
      const page = await browser.newPage()
      await page.goto(url)
      const result = await page.evaluate(() => {
        // debugger;

        const getScrapingResponse = (isSuccessful, data, error) => {
          return {
            isSuccessful,
            data,
            error,
          }
        }

        try {
          const errorContainerDomNode = document.querySelector('.errors')

          if (errorContainerDomNode) {
            const scrapedMessage = errorContainerDomNode.querySelector(
              '.container > .error-message > h1'
            )
            return getScrapingResponse(false, null, {
              message: 'Product reviews not found on page',
              scrapedText: scrapedMessage?.innerText ?? '',
            })
          }

          const getDataFromContentNode = (domNode) => {
            const blockQuoteDomNode = domNode.querySelector('blockquote')
            return [...blockQuoteDomNode.children].reduce(
              (obj, childDomNode) => {
                obj[childDomNode.tagName === 'P' ? 'text' : 'title'] =
                  childDomNode.innerText
                return obj
              },
              {}
            )
          }

          const getDataFromMetaNode = (domNode) => {
            const itemReviewDomNode = domNode.querySelector('.itemReview')
            const reviewerDomNode = domNode.querySelector('.reviewer')

            const itemReviewChildren = [...itemReviewDomNode.children]

            const ratingInfoParsed = {}
            for (let i = 1; i < itemReviewChildren.length; i += 2) {
              ratingInfoParsed[
                [itemReviewChildren[i - 1].innerText.trim().toLowerCase()]
              ] = itemReviewChildren[i].innerText.trim()
            }

            const reviewerChildren = [...reviewerDomNode.children]
            const reviewrInfoParsed = {}
            for (let i = 1; i < reviewerChildren.length; i += 2) {
              reviewrInfoParsed[
                [reviewerChildren[i - 1].innerText.trim().toLowerCase()]
              ] = reviewerChildren[i].innerText.trim()
            }

            return {
              rating: ratingInfoParsed['overall'],
              reviewer: reviewrInfoParsed['reviewer:'],
              date: reviewrInfoParsed['date:'],
            }
          }

          const productInfoDomNode = document.querySelector('#ProductReview')

          const productDescContainerDomNode = productInfoDomNode.querySelector(
            '#ProductReview > .pdp-specs-info > .pdp-info > h1'
          )
          const description = productDescContainerDomNode.innerText

          const reviewsNodeList = document.querySelectorAll('div.review')
          const reviewList = [...reviewsNodeList].map((reviewDomNode) => {
            const { reviewMetaDomNode, reviewContentDomNode } = [
              ...reviewDomNode.children,
            ].reduce((obj, domNode, i) => {
              obj[i === 0 ? 'reviewMetaDomNode' : 'reviewContentDomNode'] =
                domNode
              return obj
            }, {})

            const { text, title } = getDataFromContentNode(reviewContentDomNode)

            const { reviewer, date, rating } =
              getDataFromMetaNode(reviewMetaDomNode)

            return {
              reviewer,
              date,
              rating,
              title,
              text,
            }
          })

          return getScrapingResponse(
            true,
            {
              description,
              reviews: reviewList,
            },
            null
          )
        } catch (e) {
          //   return {
          //       isSuccessful: false,
          //       data: null,
          //       error: e,
          //   }
          return getScrapingResponse(false, null, {
            name: e.name,
            message: e.message,
            stack: e.stack,
          })
        }
      })

      console.log(result)
      await browser.close()

      return result
    } catch (e) {
      const errData = {
        name: e.name,
        message: e.message,
        stack: e.stack,
      }
      logger.error({
        traceId,
        siteName,
        url,
        error: errData,
      })

      return getScrapingResponse(false, null, errData)
    }
  }

  return {
    url: siteUrl,
    scrape,
    validateUrl,
  }
}

module.exports = ScrapingUtils({
  logger: getLogger({
    tag: 'scraping_logs',
  }),
  siteName: 'TigerDirect',
  siteUrl:
    'https://www.tigerdirect.com/applications/SearchTools/item-details.asp',
})