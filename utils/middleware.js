const morgan = require('morgan')
const { isEmpty } = require('./commonFunctions')

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

const middleware = {
  requestLogger,
  unknownEndpoint
}

module.exports = middleware
