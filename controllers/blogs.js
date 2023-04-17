const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({
      name: 'AuthorizationError',
      message: 'unauthorization operation'
    })
  }

  const { title, author, url, likes } = request.body

  const blog = new Blog({ title, author, url, likes, user: user._id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({
      name: 'AuthorizationError',
      message: 'unauthorization operation'
    })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(204).end()
  }

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({
      name: 'AuthorizationError',
      message: 'unauthorization operation'
    })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({
      name: 'AuthorizationError',
      message: 'unauthorization operation'
    })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({
      name: 'AuthorizationError',
      message: 'unauthorization operation'
    })
  }

  const { title, author, url, likes } = request.body
  const blogForUpdate = { title, author, url, likes }

  const returnedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blogForUpdate,
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(returnedBlog)
})

module.exports = blogsRouter
