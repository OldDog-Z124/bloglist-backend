const api = require('./utils/api')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const { initialBlogs } = require('./utils/test-data')
const { blogsInDb, nonExistingId, nonExistingBlog } = require('./utils/test-helper')

const route = '/api/blogs'

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
}, 10000)

describe(`GET ${route}`, () => {
  test('succeeded with status 200 and concent-type is json and returned right number of blogs', async () => {
    await api
      .get(route)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('succeeded with id property of returned blog is unique identifier', async () => {
    const response = await api.get(route)

    expect(response.body[0].id).toBeDefined()
  })
})

describe(`POST ${route}`, () => {
  test('succeeded with status 201 and content-type is json and created a new blog. if a valid blog', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: '3D in CSS',
      author: 'BRAD WOODS',
      url: 'https://garden.bradwoods.io/notes/css/3d',
      likes: 0
    }

    await api
      .post(route)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  })

  test('succeeded with status 201 and content-type is json and created a new blog and default value of blog likes is 0. if a blog that lacks the likes property', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: '3D in CSS',
      author: 'BRAD WOODS',
      url: 'https://garden.bradwoods.io/notes/css/3d'
    }

    const response = await api
      .post(route)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    expect(response.body.likes).toBe(0)
  })

  test('failed with status 400 and content-type is json and not created a new blog. if a blog that lacks the title property', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      author: 'BRAD WOODS',
      url: 'https://garden.bradwoods.io/notes/css/3d',
      likes: 0
    }

    const response = await api
      .post(route)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(response.body).toEqual({
      ValidationError: 'Blog validation failed: title: Path `title` is required.'
    })
  })

  test('failed with status 400 and content-type is json and not created a new blog. if a blog that lacks the url property', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: '3D in CSS',
      author: 'BRAD WOODS',
      likes: 0
    }

    const response = await api
      .post(route)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(response.body).toEqual({
      ValidationError: 'Blog validation failed: url: Path `url` is required.'
    })
  })
})

describe(`DELETE ${route}`, () => {
  test('succeeded with status 204 and delete the blog. if a valid id of blog', async () => {
    const blogsAtStart = await blogsInDb()
    const blog = blogsAtStart[0]

    await api
      .delete(`${route}/${blog.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(blogsAtEnd).not.toContainEqual(blog)
  })

  test('succeeded with status 204 and not delete the blog. if a unvalid id of blog', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .delete(`${route}/${await nonExistingId()}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe(`PUT ${route}`, () => {
  test('succeeded with status 200 and content-type is json and updated the blog. if a valid id of blog', async () => {
    const blogsAtStart = await blogsInDb()
    const blog = blogsAtStart[0]
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: 124
    }

    const response = await api
      .put(`${route}/${blog.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = (await Blog.findById(blog.id)).toJSON()

    expect(updatedBlog).toEqual({ ...newBlog, id: blog.id })
    expect(response.body).toEqual({ ...newBlog, id: blog.id })
  })

  test('succeeded with status 404. if a unvalid id of blog', async () => {
    const blog = await nonExistingBlog()
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: 124
    }
    const response = await api
      .put(`${route}/${blog.id}`)
      .send(newBlog)
      .expect(404)

    const blogsAtEnd = await blogsInDb()
    const ids = blogsAtEnd.map(blog => blog.id)

    expect(ids).not.toContain(blog.id)
    expect(response.body).toEqual({})
  })
})

afterAll(async () => {
  mongoose.connection.close()
})
