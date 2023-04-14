const statesRouter = require('express').Router()

const Blog = require('../models/blog')

statesRouter.get('/clear', async (request, response) => {
  await Blog.deleteMany({})
  response.status(204).end()
})

statesRouter.get('/initialization', async (request, response) => {
  const blogs = [
    {
      title: 'Example',
      author: 'example',
      url: 'https://www.example.com/',
      likes: 0
    },
    {
      title: 'My Website',
      author: 'goudaner',
      url: 'https://olddog-z124.neocities.org/',
      likes: 0
    }
  ]
  await Blog.deleteMany({})
  const result = await Blog.insertMany(blogs)
  response.status(201).send(result)
})

module.exports = statesRouter
