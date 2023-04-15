const { isEmpty } = require('../utils/common-functions')

describe('isEmpty', () => {
  test('of empty object is true', () => {
    const result = isEmpty({})
    expect(result).toBe(true)
  })

  test('of nonempty object is false', () => {
    const result = isEmpty({ name: 'goudaner' })
    expect(result).toBe(false)
  })
})
