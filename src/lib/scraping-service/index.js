const scrapers = require('./scrapers')

const ScrapingService = (deps) => {
  const { scrapers } = deps

  return {
    fromUrl: function (url) {
      return scrapers[url] ?? null
    },
  }
}

module.exports = ScrapingService({
  scrapers,
})
