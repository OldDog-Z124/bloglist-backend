const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI)

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
