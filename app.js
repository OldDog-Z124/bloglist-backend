const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('express-async-errors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const statesRouter = require('./controllers/states')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/states', statesRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
