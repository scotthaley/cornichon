
const path = require('path')

let config = {
  mongo: {
    host: 'mongodb://127.0.0.1:27017/cornichon'
  },
  port: 80,
  host: 'localhost',
  parallel: 1
}
try {
  let filePath = path.join(process.cwd(), 'cornichon-config.js')
  config = require(filePath)
} catch (e) {
  console.log('Error loading config file. Using default options.')
}
module.exports = config
