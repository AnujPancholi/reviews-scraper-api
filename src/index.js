const app = require('./app.js')
const config = require('./config.js')
const logger = require('./lib/logger.js')

const startServer = ({ serverStartLogger, anomalyLogger, config, app }) => {
  app.listen(config.getPort(), () => {
    serverStartLogger.info({
      msg: `Server listening on ${config.getPort()}`,
    })
  })

  process.on('uncaughtException', (error) => {
    anomalyLogger.error(error)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, promise) => {
    anomalyLogger.error({
      reason,
      promise,
    })
    process.exit(1)
  })
}

startServer({
  serverStartLogger: logger({
    tag: 'server_logs',
  }),
  anomalyLogger: logger({
    tag: 'uncaught_error_logs',
  }),
  config,
  app,
})
