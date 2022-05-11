module.exports = {
  getPort: () => {
    return process.env.PORT ?? 3001
  },
  getCurrVer: () => {
    return process.env.VERSION ?? 'v0.1'
  },
  getBrowserBinPath: () => {
    return process.env.CHROME_BIN ?? '/usr/bin/google-chrome'
  },
}
