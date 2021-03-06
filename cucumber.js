/**
 * Created by Scott Haley on 3/19/2017.
 */

const cucumber = require('cucumber')
const ScenarioFilter = cucumber.ScenarioFilter
const FeatureParser = cucumber.FeatureParser
const Cli = cucumber.Cli
const path = require('path')

const cucumberDir = path.parse(require.resolve('cucumber')).dir

const cucumberHelper = require('./cucumber.helper')
const ScenarioRunner = require(`${cucumberDir}/runtime/scenario_runner.js`).default
const EventBroadcaster = require(`${cucumberDir}/runtime/event_broadcaster.js`).default

const cornichon = require('./cornichon')

const fs = require('fs')
const co = require('co')

const beautify = require('js-beautify').js_beautify
const stripIndent = require('strip-indent')

const cucumberExpression = require('cucumber-expressions')

module.exports = (() => {
  let supportCode = null
  let scenarios = null
  let scenarioMap = []
  let fullScenarioMap = {}
  let scenarioIDMap = {}
  let features = null
  let featureMap = []
  let tags = []
  let cID = 100
  let cli = null

  const init = async function (profile) {
    const _this = this
    this.cli = getCli()
    cucumber.clearSupportCodeFns()
    let settings = await cornichon.getSettings()

    if (profile) {
      let envVars = settings.custom.Profiles[profile].envVars
      for (let i in envVars) {
        let e = envVars[i]
        process.env[e.name] = e.value
      }
    }

    supportCode = []
    scenarios = []
    scenarioMap = []
    fullScenarioMap = {}
    features = []
    featureMap = []
    tags = []

    this.features = await getFeatures(this.cli)
    this.tags = getTags(_this.features)
    this.scenarios = getScenarios(_this.features)
    this.supportCode = await getSupportCode(this.cli, this.features)
  }

  const getCli = () => {
    const cli = new Cli({
      argv: process.argv,
      cwd: process.cwd(),
      stdout: process.stdout
    })
    return cli
  }

  const getTags = (features) => {
    let tags = []

    function addTags (tagArr) {
      tagArr.forEach(function (tag) {
        if (tags.indexOf(tag.name) < 0) {
          tags.push(tag.name)
        }
      })
    }

    function tagSearch (features) {
      features.forEach(function (obj) {
        for (var key in obj) {
          if (key === 'tags' && obj[key].length) addTags(obj[key])
          else if (typeof obj[key] === 'object' && obj[key].length) {
            tagSearch(obj[key])
          } else if (typeof obj[key] === 'object') {
            if (obj[key]['tags'] && obj[key]['tags'].length) { addTags(obj[key]['tags']) }
          }
        }
      })
    }
    tagSearch(features)
    return tags
  }

  const getFeatures = (cli) => {
    return co(function* () {
      const configuration = yield cli.getConfiguration()
      const scenarioFilter = new ScenarioFilter(configuration.scenarioFilterOptions)
      let resolveFeatures = []
      for (var i = 0; i < configuration.featurePaths.length; i++) {
        resolveFeatures.push((function (featurePath) {
          return co(function* () {
            const source = yield new Promise((resolve) => {
              fs.readFile(featurePath, (err, data) => {
                if (err) {
                  console.log(err.stack)
                }
                resolve(data.toString())
              })
            })
            return FeatureParser.parse({scenarioFilter, source, uri: featurePath})
          })
        })(configuration.featurePaths[i]))
      }
      let features = yield Promise.all(resolveFeatures)
      let mappedFeatures = []
      for (let f = 0; f < features.length; f++) {
        if (features[f]) {
          mappedFeatures.push(mappedFeature(features[f], features, true))
        }
      }
      return mappedFeatures
    }).catch(e => {
      console.log(e)
    })
  }

  const getScenarios = (features) => {
    let scenarios = []
    for (let f = 0; f < features.length; f++) {
      let feature = features[f]
      for (let s = 0; s < feature.scenarios.length; s++) {
        let scenario = Object.assign({}, feature.scenarios[s])
        let shouldInclude = true
        for (let b = 0; b < scenarios.length; b++) {
          let foundScenario = scenarios[b]
          if (foundScenario.name === scenario.name && foundScenario.feature.name === feature.name && foundScenario.feature.uri === feature.uri) {
            shouldInclude = false
            foundScenario.otherScenarios.push(scenario)
            break
          }
        }
        if (!shouldInclude) {
          continue
        }
        let featureDef = Object.assign({}, feature)
        delete featureDef.scenarios
        scenario.feature = featureDef
        scenario.otherScenarios = []
        scenarios.push(scenario)
      }
    }
    return scenarios
  }

  const identifySteps = (stepDef, features, supportCode) => {
    for (let f = 0; f < features.length; f++) {
      let feature = features[f]
      for (let sc = 0; sc < feature.scenarios.length; sc++) {
        let scenario = feature.scenarios[sc]
        for (let s = 0; s < scenario.steps.length; s++) {
          let step = scenario.steps[s]
          if (stepDef.expression.match(step.pattern)) {
            step.cornichonID = stepDef.cornichonID
            step.pattern = stepDef.pattern
          }
        }
      }
    }

    for (let sc = 0; sc < supportCode.length; sc++) {
      let sCode = supportCode[sc]
      for (let sc = 0; sc < sCode.scenarios.length; sc++) {
        let scenario = sCode.scenarios[sc]
        for (let s = 0; s < scenario.steps.length; s++) {
          let step = scenario.steps[s]
          if (stepDef.expression.match(step.pattern)) {
            step.cornichonID = stepDef.cornichonID
          }
        }
      }
    }
  }

  const getSupportCode = (cli, features) => {
    return co(function* () {
      const configuration = yield cli.getConfiguration()
      for (let i in configuration.supportCodePaths) {
        delete require.cache[configuration.supportCodePaths[i]]
      }
      let supportCode = cli.getSupportCodeLibrary(configuration.supportCodePaths)
      let supportCodeMapped = []
      for (let i in supportCode.stepDefinitions) {
        let stepDef = supportCode.stepDefinitions[i]
        stepDef.expression = new cucumberExpression.CucumberExpression(stepDef.pattern, [], supportCode.parameterTypeRegistry)
        stepDef.uri_full = stepDef.uri
        stepDef.uri = stepDef.uri.replace(/^.*\\features\\/, 'features\\')
        stepDef.code = beautify(stepDef.code.toString(), {indent_size: 4})
        // needs to happen after stepDef.code is set, before stripping ID
        stepDef.cornichonID = cucumberHelper.getStepID(stepDef)
        // remove ID from function code
        stepDef.code = stepDef.code.replace(/\/\* ?{cornichon: .*\w} ?\*\//, '')
        stepDef.code = stepDef.code.replace(/ ?{cornichon: .*\w}/, '')
        stepDef.keyword = cucumberHelper.getStepKeyword(stepDef)
        stepDef.usage = yield cornichon.getUsage(stepDef.cornichonID)
        stepDef.usage = stepDef.usage || 'No usage information provided.'
        stepDef.features = []
        stepDef.scenarios = []
        for (let f in features) {
          let feature = features[f]
          let includeFeature = false
          for (let s in feature.scenarios) {
            let scenario = feature.scenarios[s]
            let includeScenario = false
            for (let st in scenario.steps) {
              let step = scenario.steps[st]
              if (stepDef.expression.match(step.pattern)) {
                includeFeature = true
                includeScenario = true
              }
            }
            if (includeScenario) {
              stepDef.scenarios.push(mappedScenario(scenario, stepDef, features))
            }
          }
          if (includeFeature) {
            stepDef.features.push(mappedFeature(feature, features))
          }
        }
        stepDef.fullName = `${stepDef.keyword} ${stepDef.pattern}`
        supportCodeMapped.push(stepDef)
      }
      for (let sd = 0; sd < supportCodeMapped.length; sd++) {
        identifySteps(supportCodeMapped[sd], features, supportCodeMapped)
      }
      return supportCodeMapped
    }).catch(e => {
      console.log(e)
    })
  }

  const getFeatureID = (feature) => {
    for (let f = 0; f < featureMap.length; f++) {
      let testF = featureMap[f]
      if (feature.name === testF.name && feature.uri === testF.uri && feature.line === testF.line && testF.internalID) {
        return testF.internalID
      }
    }
    let fmap = Object.assign({}, feature)
    fmap.internalID = `feature-${cID++}`
    featureMap.push(fmap)
    return fmap.internalID
  }

  const mappedFeature = (feature, features, includeScenarios) => {
    let f = {
      name: feature.name,
      uri: feature.uri.replace(/^.*\\features\\/, 'features\\'),
      uri_full: feature.uri_full || feature.uri,
      tags: feature.tags,
      line: feature.line,
      keyword: feature.keyword,
      description: feature.description ? stripIndent(feature.description) : '',
      internalID: feature.internalID || getFeatureID(feature)
    }

    if (includeScenarios) {
      f.scenarios = []
      let foundScenarios = []
      for (let s = 0; s < feature.scenarios.length; s++) {
        let mScenario = mappedScenario(feature.scenarios[s], null, features)
        if (foundScenarios.indexOf(mScenario.internalID) === -1) {
          foundScenarios.push(mScenario.internalID)
          f.scenarios.push(mScenario)
        } else {
          for (let fs in f.scenarios) {
            let foundScenario = f.scenarios[fs]
            if (foundScenario.internalID === mScenario.internalID) {
              mapScenarioOutline(foundScenario)
              break
            }
          }
        }
      }
    }
    return f
  }

  const getScenarioID = (scenario) => {
    for (let s = 0; s < scenarioMap.length; s++) {
      let testS = scenarioMap[s]
      if (scenario.name === testS.name && scenario.uri === testS.uri && testS.internalID) {
        return testS.internalID
      }
    }
    let smap = Object.assign({}, scenario)
    smap.internalID = `scenario-${cID++}`
    scenarioMap.push(smap)
    return smap.internalID
  }

  const mapScenarioOutline = (scenario) => {
    scenario.keyword = 'Scenario Outline'
    let table = cucumberHelper.getTable(scenario)
    cucumberHelper.fixScenarioOutline(scenario, table)
    scenario.table = table
  }

  const mappedScenario = (scenario, stepDef) => {
    let steps = []
    let internalID = scenario.internalID || getScenarioID(scenario)
    fullScenarioMap[internalID] = fullScenarioMap[internalID] || Object.assign({}, scenario)

    for (let st in scenario.steps) {
      if (scenario.steps[st]) {
        steps.push(mappedStep(scenario.steps[st], stepDef))
      }
    }
    let mScenario = {
      name: scenario.name,
      line: scenario.line,
      tags: scenario.tags,
      uri: scenario.uri.replace(/^.*\\features\\/, 'features\\'),
      uri_full: scenario.uri_full || scenario.uri,
      keyword: scenario.keyword,
      description: scenario.description ? scenario.description.trim() : '',
      steps,
      internalID
    }
    scenarioIDMap[internalID] = mScenario
    return mScenario
  }

  const mappedStep = (step, stepDef) => {
    let stepMatch = stepDef ? stepDef.expression.match(step.pattern) : null

    let mStep = {
      pattern: step.pattern || step.name,
      name: step.name,
      currentStep: stepMatch != null,
      line: step.line,
      uri: step.uri.replace(/^.*\\features\\/, 'features\\'),
      uri_full: step.uri_full || step.uri,
      keyword: step.keyword.trim()
    }
    return mStep
  }

  async function runScenario (internalID, outlineRow) {
    const cli = this.cli
    const configuration = await cli.getConfiguration()
    const supportCodeLibrary = cli.getSupportCodeLibrary(configuration.supportCodePaths)
    const {formatters} = await cli.getFormatters({
      formatOptions: configuration.formatOptions,
      formats: configuration.formats,
      supportCodeLibrary
    })

    const eventBroadcaster = new EventBroadcaster({
      listenerDefaultTimeout: supportCodeLibrary.defaultTimeout,
      listeners: formatters.concat(supportCodeLibrary.listeners)
    })

    let scenario = Object.assign({}, fullScenarioMap[internalID])
    if (outlineRow) {
      let mScenario = scenarioIDMap[internalID]
      for (let i in scenario.steps) {
        let mappedStep = mScenario.steps[parseInt(i)]
        scenario.steps[i].name = mappedStep.name
        Object.keys(outlineRow).forEach(function (column) {
          scenario.steps[i].name = scenario.steps[i].name.replace(new RegExp(`<${column}>`, 'g'), outlineRow[column])
        })
      }
    }

    const scenarioRunner = new ScenarioRunner({
      eventBroadcaster,
      options: {},
      scenario,
      supportCodeLibrary
    })

    return scenarioRunner.run()
  }

  return {
    init,
    tags,
    features,
    supportCode,
    scenarios,
    runScenario,
    cli
  }
})()
