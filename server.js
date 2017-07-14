/**
 * Created by Scott Haley on 3/17/2017.
 */

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const co = require('co')
const path = require('path')
const guid = require('guid')
const kue = require('kue')
kue.app.listen(8080)
const scenarioQueue = kue.createQueue()

const cucumber = require('./cucumber')
cucumber.init()

const cornichon = require('./cornichon')

module.exports = () => {
  let app = express()
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))

  scenarioQueue.process('scenario', 5, (job, done) => {
    let data = job.data.data
    console.log('scenario started:', data)
    cucumber.runScenario(data.internalID, data.outlineRow).then((result) => {
      result.scenario = data.internalID
      for (let i in result.stepResults) {
        delete result.stepResults[i].step.scenario
        if (data.outlineRow && result.stepResults[i].step) {
          result.outlineRowIndex = data.outlineRowIndex
          let name = result.stepResults[i].step.name
          if (name) {
            Object.keys(data.outlineRow).forEach(function (column) {
              name = name.replace(RegExp(`<${column}>`, 'g'), data.outlineRow[column])
            })
            result.stepResults[i].step.name = name
          }
        }
      }
      // socket.emit('runScenario', result)
      done()
    })
  })

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
    cucumber.init()
    res.send(true)
  })

  app.post('/openFile', (req, res) => {
    require('open')(req.body.path)
    res.send(true)
  })

  io.on('connect', (socket) => {
    socket.on('runScenario', (data) => {
      co(function *() {
        // let internalID = data.internalID
        let settings = yield cornichon.getSettings()
        let envVars = settings.custom.envVars
        for (let i in envVars) {
          let e = envVars[i]
          process.env[e.name] = e.value
        }
        scenarioQueue.create('scenario', {
          title: `${data.jobID} - ${data.scenarioID}`,
          data
        }).save(err => {
          if (err) {
            console.log(err)
          }
        })
        // cucumber.runScenario(internalID, data.outlineRow).then((result) => {
        //   result.scenario = internalID
        //   for (let i in result.stepResults) {
        //     delete result.stepResults[i].step.scenario
        //     if (data.outlineRow && result.stepResults[i].step) {
        //       result.outlineRowIndex = data.outlineRowIndex
        //       let name = result.stepResults[i].step.name
        //       if (name) {
        //         Object.keys(data.outlineRow).forEach(function (column) {
        //           name = name.replace(RegExp(`<${column}>`, 'g'), data.outlineRow[column])
        //         })
        //         result.stepResults[i].step.name = name
        //       }
        //     }
        //   }
        //   socket.emit('runScenario', result)
        // })
      })
    })

    socket.on('queueStarted', (data) => {
      co(function *() {
        let history = yield cornichon.retrieveData('history')
        if (!history.reports) {
          history = {reports: []}
        }
        data.jobID = guid.raw()
        history.reports.push(data)
        yield cornichon.saveData(history, 'history')
        socket.emit('queueStarted', data.jobID)
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
      cornichon.getSettings().then(settings => {
        socket.emit('settings', settings)
      })
    })

    socket.on('saveSettings', (settings) => {
      cornichon.saveSettings(settings).then(() => {
        socket.emit('saveSettings', true)
      })
    })

    socket.on('outlineLists', () => {
      cornichon.getOutlineLists().then(lists => {
        socket.emit('outlineLists', lists)
      })
    })

    socket.on('createOutlineList', (data) => {
      cornichon.createOutlineList(data).then(newLists => {
        socket.emit('createOutlineList', newLists)
      })
    })

    socket.on('queueLists', () => {
      cornichon.getQueueLists().then(lists => {
        socket.emit('queueLists', lists)
      })
    })

    socket.on('createQueueList', (data) => {
      cornichon.createQueueList(data).then(newLists => {
        socket.emit('createQueueList', newLists)
      })
    })

    socket.on('setProfile', (profile) => {
      cucumber.init(profile)
        .then(() => {
          socket.emit('setProfile')
          socket.emit('refresh')
        })
    })
  })

  server.listen(80, () => {
    console.log('listening...')
    cornichon.getSettings().then(settings => {
      let setupCommand = settings.custom['Setup Command'].replace(/(?:\r\n|\r|\n)/g, ' && ')
      if (setupCommand !== '') {
        require('child_process').exec(setupCommand, (e, stdout, stderr) => {
          console.log('Setup Command:', stdout)
          if (stderr) {
            console.log('Setup Command Error:', stderr)
          }
        })
      }
      // if (process.env.DEBUG !== 'true') {
      //   require('open')('http://localhost:8088', 'chrome')
      // }
    })
  })
}
