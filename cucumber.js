/**
 * Created by Scott Haley on 3/19/2017.
 */

const cucumber = require('cucumber');
// console.log(cucumber);
const ScenarioFilter = cucumber.ScenarioFilter;
const FeatureParser = cucumber.FeatureParser;
const Cli = cucumber.Cli;

const fs = require('fs');
const co = require('co');

var beautify = require('js-beautify').js_beautify;

const cucumberExpression = require('cucumber-expressions');

module.exports = (() => {
  let features = null;
  let supportCode = null;

  const init = function() {
    const _this = this;
    this.cli = getCli();
    getFeatures(this.cli).then(f => {
      _this.features = f;
      return getSupportCode(_this.cli, _this.features)
    }).then(c => {
      _this.supportCode = c;
    });
  }

  const getCli = () => {
    const cli = new Cli({
      argv: process.argv,
      cwd: process.cwd(),
      stdout: process.stdout
    });
    return cli;
  }

  const getFeatures = (cli) => {
    return co(function* () {
      const configuration = yield cli.getConfiguration();
      const scenarioFilter = new ScenarioFilter(configuration.scenarioFilterOptions);
      let resolveFeatures = [];
      for (var i = 0; i < configuration.featurePaths.length; i++) {
        resolveFeatures.push((function(featurePath) {
          return co(function* () {
            const source = yield new Promise((resolve) => {
              fs.readFile(featurePath, (err, data) => {
                resolve(data.toString());
              });
            });
            return FeatureParser.parse({scenarioFilter, source, uri: featurePath});
          });
        })(configuration.featurePaths[i]));
      }
      let features = yield Promise.all(resolveFeatures);
      return features;
    }).catch(e => {
      console.log(e);
    });
  }

  const getSupportCode = (cli, features) => {
    return co(function* () {
      const configuration = yield cli.getConfiguration();
      let supportCode = cli.getSupportCodeLibrary(configuration.supportCodePaths);
      let supportCodeMapped = [];
      for (let i in supportCode.stepDefinitions) {
        let rule = supportCode.stepDefinitions[i];
        rule.expression = new cucumberExpression.CucumberExpression(rule.pattern, [], supportCode.parameterTypeRegistry);
        rule.code = beautify(rule.code.toString(), { indent_size: 4 });
        rule.keywords = [];
        rule.features = [];
        rule.scenarios = [];
        for (let f in features) {
          let feature = features[f];
          let includeFeature = false
          for (let s in feature.scenarios) {
            let scenario = feature.scenarios[s];
            let includeScenario = false;
            for (let st in scenario.steps) {
              let step = scenario.steps[st];
              if (rule.expression.match(step.name)) {
                includeFeature = true;
                includeScenario = true;
                rule.keywords.push(step.keyword);
              }
            }
            if (includeScenario) {
              rule.scenarios.push(mappedScenario(scenario));
            }
          }
          if (includeFeature) {
            rule.features.push(mappedFeature(feature));
          }
        }
        rule.fullName = rule.keywords[0] + rule.pattern;
        supportCodeMapped.push(rule);
      }
      return supportCodeMapped;
    }).catch(e => {
      console.log(e);
    });
  }

  const mappedFeature = (feature) => {
    return {
      name: feature.name,
      uri: feature.uri,
      tags: feature.tags,
      line: feature.line,
      keyword: feature.keyword,
      description: feature.description ? feature.description.trim() : ''
    }
  }

  const mappedScenario = (scenario) => {
    let steps = [];
    for (let st in scenario.steps) {
      steps.push(mappedStep(scenario.steps[st]));
    }
    return {
      name: scenario.name,
      line: scenario.line,
      tags: scenario.tags,
      uri: scenario.uri,
      keyword: scenario.keyword,
      description: scenario.description ? scenario.description.trim() : '',
      steps
    }
  }

  const mappedStep = (step) => {
    return {
      name: step.name,
      uri: step.uri,
      keyword: step.keyword
    }
  }

  return {
    init,
    features,
    supportCode
  }
})();