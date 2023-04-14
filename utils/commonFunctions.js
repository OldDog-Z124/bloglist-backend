function isEmpty (object) {
  if (Object.keys(object) === 0) return true
  return false
}

module.exports = {
  isEmpty
}
