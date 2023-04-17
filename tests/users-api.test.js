const { default: mongoose } = require('mongoose')
const User = require('../models/user')
const { initialUsers } = require('./utils/test-data')
const { usersWithPasswordToHash, usersInDb, getIds } = require('./utils/test-helper')
const api = require('./utils/api')

const route = '/api/users'

beforeEach(async () => {
  await User.deleteMany({})
  const users = await usersWithPasswordToHash(initialUsers)
  await User.insertMany(users)
}, 10000)

describe(`GET ${route}`, () => {
  test('succeeded with status 200 and concent-type is json and returned right number of users', async () => {
    await api
      .get(route)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(initialUsers.length)
  })
})

describe(`POST ${route}`, () => {
  test('succeeded with status 201 and content-type is json and created a new user. if a valid user', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'xiaozhao',
      name: 'xiaozhao',
      password: '123456'
    }

    const response = await api
      .post(route)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(getIds(usersAtEnd)).toContain(response.body.id)
  })

  test('failed with status 400 and content-type is json and not created a new user. if a user that lacks the username property', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      name: 'xiaozhao',
      password: '123456'
    }

    const response = await api
      .post(route)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(response.body).toEqual({
      name: 'ValidationError',
      message: 'User validation failed: username: Path `username` is required.'
    })
  })

  test('failed with status 400 and content-type is json and not created a new user. if a user that lacks the password property', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'xiaozhao',
      name: 'xiaozhao'
    }

    const response = await api
      .post(route)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(response.body).toEqual({
      name: 'ValidationError',
      message: 'User validation failed: password: Path `password` is required.'
    })
  })

  test('failed with status 400 and content-type is json and not created a new user. if already exists username of user', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'goudaner',
      name: 'goudaner',
      password: 'chifan'
    }

    const response = await api
      .post(route)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(response.body).toEqual({
      name: 'ValidationError',
      message: `User validation failed: username: Error, expected \`username\` to be unique. Value: \`${newUser.username}\``
    })
  })

  test('failed with status 400 and content-type is json and not created a new user. if username length of user less than 3', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'x',
      name: 'x',
      password: '123456'
    }

    const response = await api
      .post(route)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(response.body).toEqual({
      name: 'ValidationError',
      message: `User validation failed: username: Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3).`
    })
  })

  test('failed with status 400 and content-type is json and not created a new user. if password length of user less than 3', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'xiaozhao',
      name: 'xiaozhao',
      password: 'x'
    }

    const response = await api
      .post(route)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(response.body).toEqual({
      name: 'ValidationError',
      message: `User validation failed: password: Path \`password\` (\`${newUser.password}\`) is shorter than the minimum allowed length (3).`
    })
  })
})

afterAll(async () => {
  mongoose.connection.close()
})
