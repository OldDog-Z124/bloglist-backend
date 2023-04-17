const { request } = require('express')
const { tokenExtractor } = require('../utils/middleware')
const { nonExistingId } = require('./utils/test-helper')
const Blog = require('../models/blog')

describe('middleware', () => {
  test('tokenExtractor', async () => {
    request.headers.authorization = 'Bearer xxx'
    tokenExtractor(request, null, null)

    expect(request.token).toBe('xxx')
  })
})

describe('ohter', () => {
  test('should contain important value in object', () => {
    const object = {
      username: 'goudaner',
      id: '643bef75b54745192eca956f',
      iat: 1681649527,
      exp: 1681649707
    }

    expect(object).toEqual(
      expect.objectContaining({
        id: '643bef75b54745192eca956f',
        username: 'goudaner'
      })
    )
  })

  test('use an invalid id to find out if the blog is null', async () => {
    const blog = await Blog.findById(await nonExistingId())
    expect(blog).toBe(null)
  }, 100000)
})
