const morgan = require('morgan')
const { isEmpty } = require('./common-functions')
const logger = require('./logger')

function requestLogger () {
  morgan.token('data', function (request, response) {
    if (isEmpty(request.body)) return ' '
    return `\n${JSON.stringify(request.body, null, 2)}`
  })

  const tinyx = ':method :url :status :res[content-length] - :response-time ms :data'

  return morgan(tinyx)
}

function unknownEndpoint (request, response) {
  response.status(404).json({ error: 'unknown endpoint' })
}

function errorHandler (error, request, response, next) {
  switch (error.name) {
    case 'ValidationError':
      response.status(400).json({ [error.name]: error.message })
      break
    default:
      logger.error(`${error.name}: ${error.message}`)
      response.status(500).json({ [error.name]: error.message })
      next(error)
  }
}

const middleware = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}

module.exports = middleware
