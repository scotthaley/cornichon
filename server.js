/**
 * Created by Scott Haley on 3/17/2017.
 */

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const cucumber = require('./cucumber')
cucumber.init()

const cornichon = require('./cornichon')

module.exports = () => {
  let app = express()
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use('/static', express.static(path.join(__dirname, './site/dist/static/')))

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './site/dist/index.html'))
  })

  app.get('/features', (req, res) => {
    res.send(cucumber.features)
  })

  app.get('/supportcode', (req, res) => {
    res.send(cucumber.supportCode)
  })

  app.post('/updateUsage', (req, res) => {
    cornichon.updateUsage(req.body.cornichonID, req.body.markdown)
    cucumber.init()
    res.send(true)
  })

  app.listen(8088, () => {
    console.log('http://localhost:8088')
    if (process.env.DEBUG !== 'true') {
      require('open')('http://localhost:8088', 'chrome')
    }
  })
}
