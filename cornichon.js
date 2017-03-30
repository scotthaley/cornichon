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
    getUsage
  }
})()
