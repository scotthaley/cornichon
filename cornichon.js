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
        console.log('collection:', collection, 'length:', doc)
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
          console.log('collection:', collection, 'doc:', doc)
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
      console.log('usage:', usageData)
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
    saveSettings,
    getSettings,
    saveData,
    retrieveData
  }
})()
