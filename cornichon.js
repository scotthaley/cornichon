/**
 * Created by Scott Haley on 3/26/2017.
 */

const fs = require('fs')
const path = require('path')

module.exports = (() => {
  const saveData = (data, table) => {
    let filePath = path.join(process.cwd(), `${table}.cornichon`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'))
  }

  const retrieveData = (table, defaultData) => {
    let filePath = path.join(process.cwd(), `${table}.cornichon`)
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, defaultData ? JSON.stringify(defaultData, null, '\t') : '{}')
      return defaultData || {}
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  const getUsageData = () => {
    return retrieveData('usage')
  }

  const getOutlineLists = () => {
    return retrieveData('outlines')
  }

  const createOutlineList = (data) => {
    let outlineLists = getOutlineLists()
    let signature = data.signature.join('.')
    if (!outlineLists[signature]) {
      outlineLists[signature] = {}
    }
    outlineLists[signature][data.name] = data.list
    saveData(outlineLists, 'outlines')
    return outlineLists
  }

  const getQueueLists = () => {
    return retrieveData('queues')
  }

  const createQueueList = (data) => {
    let queueLists = getQueueLists()
    queueLists[data.name] = data.list
    saveData(queueLists, 'queues')
    return queueLists
  }

  const saveSettings = settings => {
    saveData(settings, 'settings')
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
    saveData(usage, 'usage')
  }

  const updateUsage = (cornichonID, usage) => {
    let usageData = getUsageData()
    usageData[cornichonID] = usage
    saveUsage(usageData)
  }

  const getUsage = cornichonID => {
    let usageData = getUsageData()
    return usageData[cornichonID]
  }

  return {
    updateUsage,
    getUsage,
    getOutlineLists,
    createOutlineList,
    getQueueLists,
    createQueueList,
    saveSettings,
    getSettings
  }
})()
