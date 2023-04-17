const statesRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, initialUsers } = require('../tests/utils/test-data')
const { usersWithPasswordToHash } = require('../tests/utils/test-helper')

statesRouter.get('/clear', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  response.status(204).end()
})

statesRouter.get('/initialization', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const users = await usersWithPasswordToHash(initialUsers)
  await User.insertMany(users)

  const user = await User.findOne({ username: 'root' })

  const blogsForSave = initialBlogs.map(blog => ({ ...blog, user: user._id }))
  const blogs = await Blog.insertMany(blogsForSave)

  user.blogs = user.blogs.concat(blogs.map(blog => blog._id))
  await user.save()

  response.status(201).send({
    users: await User.find({}),
    blogs: await Blog.find({})
  })
})

module.exports = statesRouter
