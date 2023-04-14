const express = require('express')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const statesRouter = require('./controllers/states')

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger())

app.use('/api/states', statesRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
