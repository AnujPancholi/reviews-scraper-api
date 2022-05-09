const PingRouter = require('./ping')
const ScraperRouter = require('./scraper')

module.exports = [
  {
    defaultPath: 'ping',
    router: PingRouter.Router,
    deps: PingRouter.deps,
  },
  {
    defaultPath: 'scraper',
    router: ScraperRouter.Router,
    deps: ScraperRouter.deps,
  },
]
