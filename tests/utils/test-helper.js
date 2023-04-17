const Blog = require('../../models/blog')
const bcrypt = require('bcrypt')
const User = require('../../models/user')

async function blogsInDb () {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

async function nonExistingId () {
  const blog = new Blog({
    title: '3D in CSS',
    author: 'BRAD WOODS',
    url: 'https://garden.bradwoods.io/notes/css/3d',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

async function nonExistingBlog () {
  const blog = new Blog({
    title: '3D in CSS',
    author: 'BRAD WOODS',
    url: 'https://garden.bradwoods.io/notes/css/3d',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog.toJSON()
}

async function usersWithPasswordToHash (users) {
  const newUsers = users.map(async user => {
    const { username, name, password } = user
    const passwordHash = await bcrypt.hash(password, 10)
    return { username, name, passwordHash }
  })

  return await Promise.all(newUsers)
}

async function usersInDb () {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

function getIds (objects) {
  return objects.map(o => o.id)
}

module.exports = {
  blogsInDb,
  nonExistingId,
  nonExistingBlog,
  usersWithPasswordToHash,
  usersInDb,
  getIds
}
