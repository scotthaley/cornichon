/**
 * Created by Scott Haley on 3/26/2017.
 */

const fs = require('fs')
const path = require('path')

module.exports = (() => {
  const getUsageData = () => {
    let usagePath = path.join(process.cwd(), 'usage.cornichon')
    if (!fs.existsSync(usagePath)) {
      fs.writeFileSync(usagePath, '{}')
      return {}
    }
    return JSON.parse(fs.readFileSync(usagePath, 'utf8'))
  }

  const saveSettings = settings => {
    let settingsPath = path.join(process.cwd(), 'settings.cornichon')
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, '\t'))
  }

  const getSettings = () => {
    let settingsPath = path.join(process.cwd(), 'settings.cornichon')
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
    }
    return {
      custom: {
        'Setup Command': ''
      }
    }
  }

  const saveUsage = usage => {
    let usagePath = path.join(process.cwd(), 'usage.cornichon')
    fs.writeFileSync(usagePath, JSON.stringify(usage, null, '\t'))
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
    saveSettings,
    getSettings
  }
})()
