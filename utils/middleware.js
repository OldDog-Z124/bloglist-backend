const morgan = require('morgan')
const { isEmpty } = require('./commonFunctions')

function requestLogger () {
  morgan.token('data', function (request, response) {
    if (isEmpty(request.body)) return ' '
    return `\n${request.body}\n`
  })

  const tinyx = ':method :url :status :res[content-length] - :response-time ms :data'

  return morgan(tinyx)
}

const middleware = {
  requestLogger
}

module.exports = middleware
