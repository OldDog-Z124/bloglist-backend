const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('express-async-errors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const statesRouter = require('./controllers/states')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger())

app.use('/api/states', statesRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
