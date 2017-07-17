/**
 * Created by Scott Haley on 3/26/2017.
 */

const fs = require('fs')
const path = require('path')
const co = require('co')
const config = require('./config')
const monk = require('monk')
const guid = require('guid')

module.exports = (() => {
  let db = null

  if (config.mongo) {
    db = monk(config.mongo.host)
  }

  const saveData = (data, collection) => {
    return co(function *() {
      if (db) {
        let table = db.get(collection)
        let doc = yield table.findOne({user: 'global'})
        if (doc) {
          return yield table.findOneAndUpdate({user: 'global'}, {$set: {value: data}})
        } else {
          return yield table.insert({user: 'global', value: data})
        }
      } else {
        let filePath = path.join(process.cwd(), `${collection}.cornichon`)
        fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'))
      }
    })
  }

  const retrieveData = (collection, defaultData) => {
    return co(function *() {
      if (db) {
        let table = db.get(collection)
        let doc = yield table.findOne({user: 'global'})
        if (doc) {
          return doc.value
        } else {
          yield saveData(defaultData || {}, collection)
          return defaultData || {}
        }
      } else {
        let filePath = path.join(process.cwd(), `${collection}.cornichon`)
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, defaultData ? JSON.stringify(defaultData, null, '\t') : '{}')
          return defaultData || {}
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
      }
    })
  }

  const updateHistory = (scenarioID, jobID, result) => {
    return co(function *() {
      let table = db.get('history')
      let key = `value.reports.${jobID}.list.${scenarioID}.result`
      console.log({$set: {[key]: result}})
      return table.findOneAndUpdate({user: 'global'}, {$set: {[key]: result}})
      // let history = yield retrieveData('history')
      // for (let i = 0; i < history.reports.length; i++) {
      //   let report = history.reports[i]
      //   if (report.jobID === jobID) {
      //     for (let a = 0; a < report.list.length; a++) {
      //       let s = report.list[a]
      //       if (s.scenarioID === scenarioID) {
      //         s.result = result
      //         saveData(history, 'history')
      //         return history
      //       }
      //     }
      //   }
      // }
      // return null
    })
  }

  const getUsageData = () => {
    return retrieveData('usage')
  }

  const getOutlineLists = () => {
    return retrieveData('outlines')
  }

  const createOutlineList = (data) => {
    return co(function *() {
      let outlineLists = yield getOutlineLists()
      let signature = data.signature.join('.')
      if (!outlineLists[signature]) {
        outlineLists[signature] = {}
      }
      outlineLists[signature][data.name] = data.list
      yield saveData(outlineLists, 'outlines')
      return outlineLists
    })
  }

  const getQueueLists = () => {
    return retrieveData('queues', [])
  }

  const createQueueList = (data) => {
    return co(function *() {
      let queueLists = yield getQueueLists()
      data.internalID = guid.raw()
      queueLists.push(data)
      yield saveData(queueLists, 'queues')
      return queueLists
    })
  }

  const updateQueueList = (data) => {
    return co(function *() {
      let queueLists = yield getQueueLists()
      for (let i = 0; i < queueLists.length; i++) {
        let l = queueLists[i]
        if (l.internalID === data.internalID) {
          l.name = data.name
          l.list = data.list
          break
        }
      }
      yield saveData(queueLists, 'queues')
      return queueLists
    })
  }

  const deleteQueueList = (internalID) => {
    return co(function *() {
      let queueLists = yield getQueueLists()
      let index = -1
      for (let i = 0; i < queueLists.length; i++) {
        let l = queueLists[i]
        if (l.internalID === internalID) {
          index = i
          break
        }
      }
      if (index !== -1) {
        queueLists.splice(index, 1)
      }
      yield saveData(queueLists, 'queues')
      return queueLists
    })
  }

  const saveSettings = settings => {
    return co(function *() {
      saveData(settings, 'settings')
    })
  }

  const getSettings = () => {
    return retrieveData('settings', {
      custom: {
        'Setup Command': '',
        'Code Style': 'material',
        'Profiles': {}
      }
    })
  }

  const saveUsage = usage => {
    return co(function *() {
      yield saveData(usage, 'usage')
    })
  }

  const updateUsage = (cornichonID, usage) => {
    return co(function *() {
      let usageData = yield getUsageData()
      usageData[cornichonID] = usage
      yield saveUsage(usageData)
    })
  }

  const getUsage = cornichonID => {
    return co(function *() {
      let usageData = yield getUsageData()
      return usageData[cornichonID]
    })
  }

  return {
    updateUsage,
    getUsage,
    getOutlineLists,
    createOutlineList,
    getQueueLists,
    createQueueList,
    updateQueueList,
    deleteQueueList,
    saveSettings,
    getSettings,
    updateHistory,
    saveData,
    retrieveData
  }
})()
