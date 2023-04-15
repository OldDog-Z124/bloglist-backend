const Blog = require('../../models/blog')

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

module.exports = {
  blogsInDb,
  nonExistingId,
  nonExistingBlog
}
