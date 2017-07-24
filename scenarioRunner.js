const cucumber = require('./cucumber')
const cornichon = require('./cornichon')
let job = JSON.parse(process.env.JOB)

cucumber.init(job.profile).then(() => {
  let _internalID = job.internalID
  let _outlineRowIndex = job.outlineRowIndex
  let _jobID = job.jobID
  let _scenarioID = job.scenarioID
  let _outlineRow = job.outlineRow

  cucumber.runScenario(_internalID, _outlineRow).then((result) => {
    result.scenario = _internalID
    for (let i in result.stepResults) {
      delete result.stepResults[i].step.scenario
      if (_outlineRow && result.stepResults[i].step) {
        result.outlineRowIndex = _outlineRowIndex
        let name = result.stepResults[i].step.name
        if (name) {
          Object.keys(_outlineRow).forEach(function (column) {
            name = name.replace(RegExp(`<${column}>`, 'g'), _outlineRow[column])
          })
          result.stepResults[i].step.name = name
        }
      }
    }
    cornichon.updateHistory(_scenarioID, _jobID, result).then(() => {
      process.exit()
    })
  })
})

