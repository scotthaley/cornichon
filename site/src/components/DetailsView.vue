<template>
  <div id="detailsview" ref="main">
    <div class="content" ref="content">
      <resultcard v-if="!results" v-bind:modal="true" v-bind:step="step" v-bind:scenario="scenario"
                  v-bind:feature="feature"></resultcard>
      <div v-if="results" class="results">
        <div class="header">
          <h1>Scenario: "{{resultScenario.name}}"</h1>
          <i v-if="results.status === 'passed'" class="success fa fa-check-circle"></i>
          <i v-if="results.status !== 'passed'" class="error fa fa-times-circle"></i>
        </div>
        <div class="steps">
          <div class="step" v-for="step in resultSteps">
            <span v-if="step.stepDefinition" :class="step.status">{{step.step.name}}</span>
            <i v-if="step.status === 'passed'" class="success fa fa-check-circle"></i>
            <i v-if="step.status === 'undefined'" class="undefined fa fa-question-circle"></i>
            <i v-if="step.status === 'failed'" class="error fa fa-times-circle"></i>
          </div>
        </div>
        <div class="status">
          <div v-if="results.status === 'passed'" class="success">
            <span>{{resultSteps.length}} steps completed in {{results.duration}} milliseconds</span>
          </div>
          <div v-if="results.status !== 'passed'" class="error">
            <span>Scenario did not complete</span>
          </div>
        </div>
      </div>
    </div>
    <div class="overlay" ref="overlay"></div>
  </div>
</template>

<script>
  const $ = require('jquery')
  const eventBus = require('@/eventBus')

  import resultcard from './ResultCard'

  export default {
    name: 'detailsview',
    components: {
      resultcard
    },
    data () {
      return {
        step: null,
        scenario: null,
        feature: null,
        results: null
      }
    },
    computed: {
      supportCode: function () {
        return this.$store.state.supportcode
      },
      features: function () {
        return this.$store.state.features
      },
      scenarios: function () {
        return this.$store.state.scenarios
      },
      resultScenario: function () {
        return this.getScenarioByID(this.results.scenario)
      },
      resultSteps: function () {
        if (!this.results) {
          return []
        }
        let steps = []
        for (let i in this.results.stepResults) {
          let s = this.results.stepResults[i]
          if (s.stepDefinition && s.stepDefinition.pattern) {
            steps.push(s)
          }
        }
        return steps
      }
    },
    mounted () {
      const _this = this
      eventBus.on('details', function (id, data) {
        if (id === 'results') {
          _this.showScenarioResults(data)
        } else {
          _this.showDetails(id)
        }
      })

      $(this.$refs.overlay).click(function () {
        _this.hideModal()
      })
    },
    methods: {
      getScenarioByID: function (id) {
        for (let s in this.scenarios) {
          let scenario = this.scenarios[s]
          if (scenario.internalID === id) {
            return scenario
          }
        }
      },
      showDetails: function (id) {
        const _this = this
        setTimeout(function () {
          _this.$refs.content.scrollTop = 0
        }, 50)
        if (id.indexOf('feature-') !== -1) {
          this.showFeature(id)
        } else if (id.indexOf('scenario-') !== -1) {
          this.showScenario(id)
        } else {
          this.showStep(id)
        }
      },
      showScenarioResults: function (results) {
        this.step = null
        this.scenario = null
        this.feature = null
        this.results = results
        this.showModal()
      },
      showStep: function (id) {
        for (let s in this.supportCode) {
          let step = this.supportCode[s]
          if (step.cornichonID === id) {
            this.step = step
            this.results = null
            this.scenario = null
            this.feature = null
            this.showModal()
            return
          }
        }
      },
      showFeature: function (id) {
        for (let f in this.features) {
          let feature = this.features[f]
          if (feature.internalID === id) {
            this.feature = feature
            this.step = null
            this.results = null
            this.scenario = null
            this.showModal()
            return
          }
        }
      },
      showScenario: function (id) {
        for (let s in this.scenarios) {
          let scenario = this.scenarios[s]
          if (scenario.internalID === id) {
            this.scenario = scenario
            this.step = null
            this.feature = null
            this.results = null
            this.showModal()
            return
          }
        }
      },
      showModal: function () {
        $(this.$refs.main).css('display', 'block')
      },
      hideModal: function () {
        $(this.$refs.main).css('display', 'none')
        eventBus.emit('details-closed')
      }
    }
  }
</script>

<style lang="scss" scoped>
  #detailsview {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;

    .overlay {
      top: 0;
      background-color: black;
      opacity: 0.8;
      width: 100%;
      height: 100%;
      z-index: 999;
    }

    .content {
      position: absolute;
      z-index: 9999;
      top: 10%;
      left: 10%;
      width: 80%;
      height: 80%;
      background-color: white;
      overflow: auto;
      border: 2px solid white;
      padding: 0;

      .results {
        background-color: #2c3e50;
        width: 100%;
        height: 100%;
        text-align: left;

        .header {
          padding: 10px;
          width: 100%;
          border-bottom: 1px solid white;
          box-sizing: border-box;

          i {
            float: right;
            font-size: 32px;
          }
        }

        i {
          color: #42b983;
          &.error {
            color: #dd4444;
          }
          &.undefined {
            color: darkorange;
          }
          font-size: 22px;
        }

        .step {
          span {
            font-size: 20px;
            padding: 10px;
            color: #dd4444;
            &.passed {
              color: #42b983;
            }
            &.undefined {
              color: darkorange;
            }
            &.skipped {
              color: #6b7186;
            }
          }
        }

        .status {
          margin-top: 10px;
          color: white;
          border-top: 1px solid white;
          font-size: 16px;
          padding: 10px;

          color: #dd4444;
          .success {
            color: #42b983;
          }
        }

        h1 {
          font-size: 32px;
          margin: 0;
          color: white;
          background-color: transparent;
          width: auto;
          display: inline-block;
        }
      }
    }
  }
</style>
