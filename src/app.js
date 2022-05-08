const express = require('express')
const logger = require('./lib/logger.js')
const requestLogger = require('pino-http')
const { v4: generateNewUuid } = require('uuid')
const Responder = require('./lib/responder.js')
const routes = require('./routes')
const config = require('./config.js')

const initApp = (deps) => {
  const { requestLogger, routes, responder, basePath, version } = deps

  const app = express()

  app.use((req, res, next) => {
    requestLogger(req, res)
    return next()
  })

  app.use(
    express.json({
      limit: '10mb',
    })
  )

  app.use(responder.initializeResponse)

  const commonRouterDeps = {
    ResponsefulError: responder.ResponsefulError,
  }

  routes.forEach(({ defaultPath, router, deps: routerDeps }) => {
    app.use(
      `${basePath}/${version}/${defaultPath}`,
      router({
        ...commonRouterDeps,
        ...routerDeps,
      })
    )
  })

  app.use(responder.handleError)
  app.use(responder.sendResponse)

  return app
}

module.exports = initApp({
  routes,
  requestLogger: requestLogger({
    logger: logger({
      tag: 'request_logs',
    }),
    genReqId: function (req) {
      req.id = generateNewUuid()
      return req.id
    },
  }),
  responder: Responder({
    errorLogger: logger({
      tag: 'error_logs',
    }),
  }),
  basePath: '/api',
  version: config.getCurrVer(),
})
