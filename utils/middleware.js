const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const { isEmpty } = require('./common-functions')
const logger = require('./logger')
const User = require('../models/user')
const config = require('./config')

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
  const errorObject = {
    name: error.name,
    message: error.message
  }

  switch (error.name) {
    case 'CastError':
    case 'ValidationError':
      response.status(400).json({ ...errorObject })
      break
    case 'TokenExpiredError':
    case 'JsonWebTokenError':
      response.status(401).json({ ...errorObject, message: 'invalid token' })
      break
    default:
      logger.error(`${error.name}: ${error.message}`)
      response.status(500).json({ ...errorObject })
      next(error)
  }
}

function tokenExtractor (request, response, next) {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

async function userExtractor (request, response, next) {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const user = await User.findById(decodedToken.id)
    request.user = user
  } else {
    request.user = null
  }

  next()
}

const middleware = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}

module.exports = middleware
