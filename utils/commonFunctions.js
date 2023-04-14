function isEmpty (object) {
  if (Object.keys(object).length === 0) return true
  return false
}

module.exports = {
  isEmpty
}
