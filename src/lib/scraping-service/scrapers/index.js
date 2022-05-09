const tigerDirectScraper = require('./tigerDirectScraper.js')

const Scrapers = (scraperList) => {
  return scraperList.reduce((obj, { url, validateUrl, scrape }) => {
    obj[url] = {
      validateUrl,
      scrape,
    }
    return obj
  }, {})
}

module.exports = Scrapers([tigerDirectScraper])
