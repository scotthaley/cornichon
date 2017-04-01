/**
 * Created by Scott Haley on 3/19/2017.
 */

const cucumber = require('cucumber')
const ScenarioFilter = cucumber.ScenarioFilter
const FeatureParser = cucumber.FeatureParser
const Cli = cucumber.Cli

const cucumberHelper = require('./cucumber.helper')
const cornichon = require('./cornichon')

const fs = require('fs')
const co = require('co')

var beautify = require('js-beautify').js_beautify

const cucumberExpression = require('cucumber-expressions')

module.exports = (() => {
  let features = null
  let supportCode = null
  let scenarios = null

  const init = function () {
    const _this = this
    this.cli = getCli()
    getFeatures(this.cli).then(f => {
      _this.features = f
      _this.scenarios = getScenarios(_this.features)
      return getSupportCode(_this.cli, _this.features)
    }).then(c => {
      _this.supportCode = c
    })
  }

  const getCli = () => {
    const cli = new Cli({
      argv: process.argv,
      cwd: process.cwd(),
      stdout: process.stdout
    })
    return cli
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
        mappedFeatures.push(mappedFeature(features[f], true))
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
        let scenario = feature.scenarios[s]
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

  const getSupportCode = (cli, features) => {
    return co(function* () {
      const configuration = yield cli.getConfiguration()
      let supportCode = cli.getSupportCodeLibrary(configuration.supportCodePaths)
      let supportCodeMapped = []
      for (let i in supportCode.stepDefinitions) {
        let stepDef = supportCode.stepDefinitions[i]
        stepDef.expression = new cucumberExpression.CucumberExpression(stepDef.pattern, [], supportCode.parameterTypeRegistry)
        stepDef.code = beautify(stepDef.code.toString(), {indent_size: 4})
        // needs to happen after stepDef.code is set, before stripping ID
        stepDef.cornichonID = cucumberHelper.getStepID(stepDef)
        // remove ID from function code
        stepDef.code = stepDef.code.replace(/\/\* ?{cornichon: [0-9]+} ?\*\//, '')
        stepDef.code = stepDef.code.replace(/ ?{cornichon: [0-9]+}/, '')
        stepDef.keyword = cucumberHelper.getStepKeyword(stepDef)
        stepDef.usage = cornichon.getUsage(stepDef.cornichonID) || 'No usage information provided.'
        stepDef.uri = stepDef.uri.replace(/^.*\\features\\/, 'features\\')
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
              if (stepDef.expression.match(step.name)) {
                includeFeature = true
                includeScenario = true
              }
            }
            if (includeScenario) {
              stepDef.scenarios.push(mappedScenario(scenario, stepDef))
            }
          }
          if (includeFeature) {
            stepDef.features.push(mappedFeature(feature))
          }
        }
        stepDef.fullName = `${stepDef.keyword} ${stepDef.pattern}`
        supportCodeMapped.push(stepDef)
      }
      return supportCodeMapped
    }).catch(e => {
      console.log(e)
    })
  }

  const mappedFeature = (feature, includeScenarios) => {
    let f = {
      name: feature.name,
      uri: feature.uri.replace(/^.*\\features\\/, 'features\\'),
      tags: feature.tags,
      line: feature.line,
      keyword: feature.keyword,
      description: feature.description ? feature.description.trim() : ''
    }

    if (includeScenarios) {
      f.scenarios = []
      for (let s = 0; s < feature.scenarios.length; s++) {
        f.scenarios.push(mappedScenario(feature.scenarios[s]))
      }
    }
    return f
  }

  const mappedScenario = (scenario, stepDef) => {
    let steps = []
    for (let st in scenario.steps) {
      steps.push(mappedStep(scenario.steps[st], stepDef))
    }
    return {
      name: scenario.name,
      line: scenario.line,
      tags: scenario.tags,
      uri: scenario.uri.replace(/^.*\\features\\/, 'features\\'),
      keyword: scenario.keyword,
      description: scenario.description ? scenario.description.trim() : '',
      steps
    }
  }

  const mappedStep = (step, stepDef) => {
    let stepMatch = stepDef ? stepDef.expression.match(step.name) : null
    return {
      name: step.name,
      currentStep: stepMatch != null,
      uri: step.uri.replace(/^.*\\features\\/, 'features\\'),
      keyword: step.keyword
    }
  }

  return {
    init,
    features,
    supportCode,
    scenarios
  }
})()
