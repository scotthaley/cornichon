<template>
  <div id="detailsview" ref="main">
    <div class="content" ref="content">
      <resultcard v-bind:modal="true" v-bind:step="step" v-bind:scenario="scenario"
                  v-bind:feature="feature"></resultcard>
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
        feature: null
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
      }
    },
    mounted () {
      const _this = this
      eventBus.on('details', function (id) {
        _this.showDetails(id)
      })

      $(this.$refs.overlay).click(function () {
        _this.hideModal()
      })
    },
    methods: {
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
      showStep: function (id) {
        for (let s in this.supportCode) {
          let step = this.supportCode[s]
          if (step.cornichonID === id) {
            this.step = step
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
    }
  }
</style>
