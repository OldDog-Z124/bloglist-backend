const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list-helper')

const zeroBlogs = []

const oneBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }
]

const manyBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

describe('dummy', () => {
  test('dummy return one', () => {
    const blogs = []

    const result = dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('totalLikes', () => {
  test('when list is empty, equals zero', () => {
    const result = totalLikes(zeroBlogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(oneBlog)
    expect(result).toBe(7)
  })

  test('when list has many blogs, equals the sum of them all', () => {
    const result = totalLikes(manyBlogs)
    expect(result).toBe(36)
  })
})

describe('favoriteBlog', () => {
  test('when list is empty, equals null', () => {
    const result = favoriteBlog(zeroBlogs)
    expect(result).toBe(null)
  })

  test('when list has only one blog, equals to that blog', () => {
    const result = favoriteBlog(oneBlog)
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('when list has many blogs, equals to the most liked blog', () => {
    const result = favoriteBlog(manyBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('mostBlogs', () => {
  test('when list is empty, equals null', () => {
    const result = mostBlogs(zeroBlogs)
    expect(result).toBe(null)
  })

  test('when list has only one blog, equals to that blog', () => {
    const result = mostBlogs(oneBlog)
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('when list has many blogs, equals to the author with most blog', () => {
    const result = mostBlogs(manyBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('mostLikes', () => {
  test('when list is empty, equals null', () => {
    const result = mostLikes(zeroBlogs)
    expect(result).toBe(null)
  })

  test('when list has only one blog, equals to that blog', () => {
    const result = mostLikes(oneBlog)
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('when list has many blogs, equals to the author with most likes', () => {
    const result = mostLikes(manyBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})
