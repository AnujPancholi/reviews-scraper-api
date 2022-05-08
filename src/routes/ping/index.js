const express = require('express')
const PingRouter = (deps) => {
  const { ResponsefulError } = deps

  const pingRouter = express.Router()

  pingRouter.get('/', (req, res, next) => {
    try {
      res.builder
        .setCode(200)
        .setData({
          result: {
            message: 'pong',
          },
          error: null,
        })
        .build()
    } catch (e) {
      return next(e)
    }
    return next()
  })

  return pingRouter
}

module.exports = {
  Router: PingRouter,
  deps: {},
}
