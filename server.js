/**
 * Created by Scott Haley on 3/17/2017.
 */

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const co = require('co')
const path = require('path')
const guid = require('guid')
const engines = require('consolidate')
const { spawn } = require('child_process')
const kue = require('kue')
kue.app.listen(8088)
const scenarioQueue = kue.createQueue()

const cucumber = require('./cucumber')
cucumber.init()

const cornichon = require('./cornichon')

module.exports = () => {
  let app = express()
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.engine('html', engines.mustache)
  app.set('view engine', 'html')

  scenarioQueue.process('scenario', config.parallel, (job, done) => {
    let data = job.data.data
    console.log('scenario started:', data)

    let env = Object.assign({}, process.env)
    env.JOB = JSON.stringify(data)

    let ls = spawn('node', [`${path.join(__dirname, '/scenarioRunner.js')}`], {env})

    ls.stdout.on('data', data => {
      console.log('stdout:', data.toString('utf8'))
    })

    ls.stderr.on('data', data => {
      console.log('stderr:', data.toString('utf8'))
    })

    ls.on('close', code => {
      console.log('Scenario finished with code:', code)
      done()
    })
    // cucumber.runScenario(data.internalID, data.outlineRow).then((result) => {
    //   result.scenario = data.internalID
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
    //   cornichon.updateHistory(data.scenarioID, data.jobID, result)
    //   // socket.emit('runScenario', result)
    //   done()
    // })
  })

  let server = require('http').createServer(app)
  let io = require('socket.io')(server)

  // Don't need this for hosted version
  // require('./watchFileChange')(() => {
  //   io.emit('refresh')
  // })

  app.use('/static', express.static(path.join(__dirname, './site/dist/static/')))

  app.get('/', (req, res) => {
    res.render(path.join(__dirname, './site/dist/index.html'), {ioConfig: config, ioConfigStringified: JSON.stringify(config)})
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
        let settings = yield cornichon.getSettings()
        console.log(data.profile)
        console.log(settings)
        scenarioQueue.create('scenario', {
          title: `${settings.Profiles[data.profile].name} - ${data.jobID} - ${data.scenarioID}`,
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

    socket.on('history', () => {
      co(function *() {
        let history = yield cornichon.retrieveData('history')
        socket.emit('history', history)
      })
    })

    socket.on('queueStarted', (data) => {
      co(function *() {
        let history = yield cornichon.retrieveData('history')
        if (!history.reports) {
          history = {reports: {}}
        }
        data.jobID = guid.raw()
        data.title = `${data.name} - ${Date.now().toString()}`
        history.reports[data.jobID] = data
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

    socket.on('updateUsage', (usage) => {
      cornichon.updateUsage(usage.cornichonID, usage.markdown).then(() => {
        return cucumber.init()
      }).then(() => {
        socket.emit('updateUsage', {steps: cucumber.supportCode, features: cucumber.features, scenarios: cucumber.scenarios})
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

    socket.on('updateQueueList', (data) => {
      cornichon.updateQueueList(data).then(newLists => {
        socket.emit('updateQueueList', newLists)
      })
    })

    socket.on('deleteQueueList', (data) => {
      cornichon.deleteQueueList(data).then(newLists => {
        socket.emit('deleteQueueList', newLists)
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

  server.listen(config.port, () => {
    console.log('listening on port: ', config.port)
    cornichon.getSettings().then(settings => {
      if (settings['Setup Command']) {
        let setupCommand = settings['Setup Command'].replace(/(?:\r\n|\r|\n)/g, ' && ')
        if (setupCommand !== '') {
          require('child_process').exec(setupCommand, (e, stdout, stderr) => {
            console.log('Setup Command:', stdout)
            if (stderr) {
              console.log('Setup Command Error:', stderr)
            }
          })
        }
      }
      // if (process.env.DEBUG !== 'true') {
      //   require('open')('http://localhost:8088', 'chrome')
      // }
    })
  })
}
