require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT

const config = {
  MONGODB_URI, PORT
}

module.exports = config
