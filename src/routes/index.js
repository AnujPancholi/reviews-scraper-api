const PingRouter = require('./ping')

module.exports = [
  {
    defaultPath: 'ping',
    router: PingRouter.Router,
    deps: PingRouter.deps,
  },
]
