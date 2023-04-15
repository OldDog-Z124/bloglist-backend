const lodash = require('lodash')

function dummy (blogs) {
  return 1
}

function totalLikes (blogs) {
  return blogs.reduce(
    (total, blog) => total + blog.likes,
    0
  )
}

function favoriteBlog (blogs) {
  if (blogs.length === 0) return null

  let favorite = blogs[0]
  for (const blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  }

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

function mostBlogs (blogs) {
  if (blogs.length === 0) return null

  const blogCountList = lodash.countBy(blogs, 'author')

  const topAuthor = Object.keys(blogCountList).reduce((top, item) => {
    return blogCountList[top] > blogCountList[item] ? top : item
  })

  return {
    author: topAuthor,
    blogs: blogCountList[topAuthor]
  }
}

function mostLikes (blogs) {
  if (blogs.length === 0) return null

  const likesCountList = lodash
    .chain(blogs)
    .groupBy('author')
    .map((blogs, author) => ({
      author,
      likes: lodash.sumBy(blogs, 'likes')
    }))
    .value()

  return lodash.maxBy(likesCountList, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
