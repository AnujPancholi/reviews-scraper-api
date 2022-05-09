const Responder = (deps = {}) => {
  const { errorLogger } = deps

  const getDefaultResponse = () => {
    return {
      code: 404,
      data: {
        result: null,
        error: {
          message: 'ROUTE_NOT_FOUND',
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  class ResponsefulError extends Error {
    constructor(message, code = 500, headers = {}) {
      super()
      this.name = 'ResponsefulError'
      this.message = message
      this.response = {
        code,
        headers,
        data: {
          result: null,
          error: {
            message: message,
          },
        },
      }
    }
  }

  const getResponseBuilder = () => {
    let _response = getDefaultResponse()

    return {
      setCode: function (code) {
        _response.code = code
        return this
      },
      setData: function (data) {
        _response.data = data
        return this
      },
      setHeaders: function (headers) {
        _response.headers = headers
        return this
      },
      build: function () {
        Object.freeze(_response)
        return _response
      },
    }
  }

  const initializeResponse = (req, res, next) => {
    res.builder = getResponseBuilder()
    return next()
  }

  const handleError = (error, req, res, next) => {
    errorLogger.error({
      traceId: req.id ?? null,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    })
    if (error instanceof ResponsefulError) {
      res.builder = getResponseBuilder()
        .setCode(error.response.code)
        .setHeaders(error.response.headers)
        .setData(error.response.data)
    } else {
      res.builder = getResponseBuilder()
        .setCode(500)
        .setHeaders()
        .setData({
          result: null,
          error: {
            message: 'Internal server error',
          },
        })
    }

    return next()
  }

  const sendResponse = (req, res) => {
    const response = res.builder.build()
    res.set(response.headers)
    return res.status(response.code).send(response.data)
  }

  return {
    initializeResponse,
    handleError,
    sendResponse,
    ResponsefulError,
  }
}

module.exports = Responder
