const { default: mongoose } = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { initialUsers } = require('./utils/test-data')
const { usersWithPasswordToHash } = require('./utils/test-helper')
const api = require('./utils/api')
const config = require('../utils/config')

const route = '/api/login'

beforeEach(async () => {
  await User.deleteMany({})
  const users = await usersWithPasswordToHash(initialUsers)
  await User.insertMany(users)
}, 10000)

describe(`POST ${route}`, () => {
  test('secceeded with status 200 and returned token. if a valid user', async () => {
    const userForLogin = {
      username: 'goudaner',
      password: 'chifan'
    }

    const user = await User.findOne({ username: userForLogin.username })

    const response = await api
      .post(route)
      .send(userForLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.token
    const decodedToken = jwt.verify(token, config.SECRET)

    expect(decodedToken).toEqual(
      expect.objectContaining({
        username: user.username,
        id: user._id.toString()
      })
    )
  })

  test('faild with status 401. user who username is invalid', async () => {
    const userForLogin = {
      username: 'xxx',
      password: 'xxx'
    }

    const response = await api
      .post(route)
      .send(userForLogin)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({
      name: 'LoginError',
      message: 'invalid username or password'
    })
  })

  test('faild with status 401. user who password is wrong', async () => {
    const userForLogin = {
      username: 'goudaner',
      password: 'xxx'
    }

    const response = await api
      .post(route)
      .send(userForLogin)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({
      name: 'LoginError',
      message: 'invalid username or password'
    })
  })
})

afterAll(async () => {
  mongoose.connection.close()
})
