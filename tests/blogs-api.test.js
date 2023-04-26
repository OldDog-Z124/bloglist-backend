const api = require('./utils/api')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const { initialBlogs, initialUsers } = require('./utils/test-data')
const { blogsInDb, nonExistingId, nonExistingBlog, usersWithPasswordToHash } = require('./utils/test-helper')
const User = require('../models/user')

const route = '/api/blogs'

async function login (username = 'goudaner', password = 'chifan') {
  const userForLogin = {
    username,
    password
  }
  const loginResponse = await api
    .post('/api/login')
    .send(userForLogin)

  return loginResponse
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const users = await usersWithPasswordToHash(initialUsers)
  await User.insertMany(users)

  const user = await User.findOne({ username: 'root' })

  const blogsForSave = initialBlogs.map(blog => ({ ...blog, user: user._id }))
  const blogs = await Blog.insertMany(blogsForSave)

  user.blogs = user.blogs.concat(blogs.map(blog => blog._id))
  await user.save()
}, 20000)

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
    const loginResponse = await login()

    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: '3D in CSS',
      author: 'BRAD WOODS',
      url: 'https://garden.bradwoods.io/notes/css/3d',
      likes: 0
    }

    await api
      .post(route)
      .set('authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  })

  test('succeeded with status 201 and content-type is json and created a new blog and default value of blog likes is 0. if a blog that lacks the likes property', async () => {
    const loginResponse = await login()

    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: '3D in CSS',
      author: 'BRAD WOODS',
      url: 'https://garden.bradwoods.io/notes/css/3d'
    }

    const response = await api
      .post(route)
      .set('authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    expect(response.body.likes).toBe(0)
  })

  test('failed with status 400 and content-type is json and not created a new blog. if a blog that lacks the title property', async () => {
    const loginResponse = await login()

    const blogsAtStart = await blogsInDb()
    const newBlog = {
      author: 'BRAD WOODS',
      url: 'https://garden.bradwoods.io/notes/css/3d',
      likes: 0
    }

    const response = await api
      .post(route)
      .set('authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(response.body).toEqual({
      name: 'ValidationError',
      message: 'Blog validation failed: title: Path `title` is required.'
    })
  })

  test('failed with status 400 and content-type is json and not created a new blog. if a blog that lacks the url property', async () => {
    const loginResponse = await login()

    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: '3D in CSS',
      author: 'BRAD WOODS',
      likes: 0
    }

    const response = await api
      .post(route)
      .set('authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(response.body).toEqual({
      name: 'ValidationError',
      message: 'Blog validation failed: url: Path `url` is required.'
    })
  })

  test('failed with status 401. if no login user', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: '3D in CSS',
      author: 'BRAD WOODS',
      likes: 0
    }

    const response = await api
      .post(route)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(response.body).toEqual({
      name: 'AuthorizationError',
      message: 'unauthorization operation'
    })
  })
})

describe(`DELETE ${route}`, () => {
  test('succeeded with status 204 and delete the blog. if a valid id of blog', async () => {
    const loginResponse = await login('root', '123456')

    const blogsAtStart = await blogsInDb()
    const blog = blogsAtStart[0]

    await api
      .delete(`${route}/${blog.id}`)
      .set('authorization', `Bearer ${loginResponse.body.token}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(blogsAtEnd).not.toContainEqual(blog)
  })

  test('succeeded with status 204 and not delete the blog. if a unvalid id of blog', async () => {
    const loginResponse = await login('root', '123456')

    const blogsAtStart = await blogsInDb()

    await api
      .delete(`${route}/${await nonExistingId()}`)
      .set('authorization', `Bearer ${loginResponse.body.token}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('faild with status 401. if login user is not user for create blog', async () => {
    const loginResponse = await login('goudaner', 'chifan')

    const blogsAtStart = await blogsInDb()
    const blog = blogsAtStart[0]

    const response = await api
      .delete(`${route}/${blog.id}`)
      .set('authorization', `Bearer ${loginResponse.body.token}`)
      .expect(401)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(response.body).toEqual({
      name: 'AuthorizationError',
      message: 'unauthorization operation'
    })
  })

  test('faild with status 401. if no logged in user', async () => {
    const blogsAtStart = await blogsInDb()
    const blog = blogsAtStart[0]

    const response = await api
      .delete(`${route}/${blog.id}`)
      .expect(401)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(response.body).toEqual({
      name: 'AuthorizationError',
      message: 'unauthorization operation'
    })
  })
})

describe(`PUT ${route}`, () => {
  test('succeeded with status 200 and content-type is json and updated the blog. if a valid id of blog', async () => {
    const loginResponse = await login('root', '123456')

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
      .set('authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = (await Blog.findById(blog.id).populate('user', { username: 1, name: 1 })).toJSON()

    expect(updatedBlog).toEqual({ ...newBlog, id: blog.id, user: { id: blog.user.toString(), name: loginResponse.body.name, username: loginResponse.body.username } })
    expect(response.body).toEqual({ ...newBlog, id: blog.id, user: { id: blog.user.toString(), name: loginResponse.body.name, username: loginResponse.body.username } })
  })

  test('faild with status 404. if a unvalid id of blog', async () => {
    const loginResponse = await login('root', '123456')

    const blog = await nonExistingBlog()
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: 124
    }
    const response = await api
      .put(`${route}/${blog.id}`)
      .set('authorization', `Bearer ${loginResponse.body.token}`)
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
