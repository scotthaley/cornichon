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

  require('./watchFileChange')(() => {
    io.emit('refresh')
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
    res.send(true)
  })

  app.post('/openFile', (req, res) => {
    require('open')(req.body.path)
    res.send(true)
  })

  io.on('connect', (socket) => {
    socket.on('runScenario', (data) => {
      let internalID = data.internalID
      let envVars = cornichon.getSettings().custom.envVars
      for (let i in envVars) {
        let e = envVars[i]
        process.env[e.name] = e.value
      }
      cucumber.runScenario(internalID, data.outlineRow).then((result) => {
        result.scenario = internalID
        for (let i in result.stepResults) {
          delete result.stepResults[i].step.scenario
          if (data.outlineRow && result.stepResults[i].step) {
            let name = result.stepResults[i].step.name
            if (name) {
              Object.keys(data.outlineRow).forEach(function (column) {
                name = name.replace(RegExp(`<${column}>`, 'g'), data.outlineRow[column])
              })
              result.stepResults[i].step.name = name
            }
          }
        }
        socket.emit('runScenario', result)
      })
    })

    socket.on('tags', () => {
      socket.emit('tags', cucumber.tags)
    })

    socket.on('features', () => {
      socket.emit('features', cucumber.features)
    })

    socket.on('supportcode', () => {
      socket.emit('supportcode', cucumber.supportCode)
    })

    socket.on('scenarios', () => {
      socket.emit('scenarios', cucumber.scenarios)
    })

    socket.on('settings', () => {
      socket.emit('settings', cornichon.getSettings())
    })

    socket.on('saveSettings', (settings) => {
      cornichon.saveSettings(settings)
      socket.emit('saveSettings', true)
    })

    socket.on('outlineLists', () => {
      socket.emit('outlineLists', cornichon.getOutlineLists())
    })

    socket.on('createOutlineList', (data) => {
      let newLists = cornichon.createOutlineList(data)
      socket.emit('createOutlineList', newLists)
    })

    socket.on('queueLists', () => {
      socket.emit('queueLists', cornichon.getQueueLists())
    })

    socket.on('createQueueList', (data) => {
      let newLists = cornichon.createQueueList(data)
      socket.emit('createQueueList', newLists)
    })
  })

  server.listen(8088, () => {
    console.log('http://localhost:8088')
    let settings = cornichon.getSettings()
    let setupCommand = settings.custom['Setup Command'].replace(/(?:\r\n|\r|\n)/g, ' && ')
    if (setupCommand !== '') {
      require('child_process').exec(setupCommand, (e, stdout, stderr) => {
        console.log('Setup Command:', stdout)
        if (stderr) {
          console.log('Setup Command Error:', stderr)
        }
      })
    }
    if (process.env.DEBUG !== 'true') {
      require('open')('http://localhost:8088', 'chrome')
    }
  })
}
