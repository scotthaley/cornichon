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

  let server = require('http').createServer(app);
  let io = require('socket.io')(server);

  const watchFileChange = require('./watchFileChange')(() => {
    io.emit('features', cucumber.features)
    io.emit('supportcode', cucumber.supportCode)
    io.emit('scenarios', cucumber.scenarios)
  })

  app.use('/static', express.static(path.join(__dirname, './site/dist/static/')))

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './site/dist/index.html'))
  })

  app.get('/features', (req, res) => {
    res.send(cucumber.features)
  })

  app.get('/tags', (req,res) => {
    res.send(cucumber.tags)
  })

  app.get('/supportcode', (req, res) => {
    res.send(cucumber.supportCode)
  })

  app.get('/scenarios', (req, res) => {
    res.send(cucumber.scenarios)
  })

  app.post('/runScenario', (req, res) => {
    cucumber.runScenario(req.body.internalID)
  })

  app.post('/updateUsage', (req, res) => {
    cornichon.updateUsage(req.body.cornichonID, req.body.markdown)
    cucumber.init()
    res.send(true)
  })

  app.post('/openFile', (req, res) => {
    require('opn')(req.body.path)
    res.send(true)
  })

  io.on('connect', (socket) => {
    socket.on('tags', () => {
      socket.emit('tags', cucumber.tags)
    })

    socket.on('features', () => {
      socket.emit('features', cucumber.features)
    })

    socket.on('supportcode', () => {
      console.log(cucumber.supportCode)
      socket.emit('supportcode', cucumber.supportCode)
    })

    socket.on('scenarios', () => {
      socket.emit('scenarios', cucumber.scenarios)
    })

    socket.on('saveSettings', (settings) => {
      cornichon.saveSettings(settings)
    })
  })

  server.listen(8088, () => {
    console.log('http://localhost:8088')
    if (process.env.DEBUG !== 'true') {
      require('open')('http://localhost:8088', 'chrome')
    }
  })
}
