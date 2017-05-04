<template>
  <div id="searchresults" ref="container">
    <div v-if="currentPage === 'Steps'" v-for="result in filteredSupportCode">
      <resultcard v-bind:step="result"></resultcard>
    </div>
    <div v-if="currentPage === 'Features'" v-for="result in filteredFeatures">
      <resultcard v-bind:feature="result"></resultcard>
    </div>
    <div v-if="currentPage === 'Scenarios'" v-for="result in filteredScenarios">
      <resultcard v-bind:scenario="result"></resultcard>
    </div>
  </div>
</template>

<script>
  import resultcard from './ResultCard'

  const fuzzy = require('fuzzy')
  const eventBus = require('@/eventBus')

  export default {
    name: 'searchresults',
    props: ['value', 'search'],
    components: {
      resultcard
    },
    data () {
      return {
        refinementData: {}
      }
    },
    mounted () {
      const _this = this
      eventBus.on('refinement.data', function (data) {
        _this.refinementData = data
      })
    },
    computed: {
      currentPage: function () {
        return this.$store.state.currentPage
      },
      features: function () {
        return this.$store.state.features
      },
      supportCode: function () {
        return this.$store.state.supportcode
      },
      scenarios: function () {
        return this.$store.state.scenarios
      },
      filteredSupportCode: function () {
        let filter = []
        for (let f in this.supportCode) {
          let sCode = this.supportCode[f]
          if (fuzzy.test(this.search, sCode.fullName)) {
            filter.push(sCode)
          }
        }
        return filter
      },
      filteredFeatures: function () {
        let filter = []
        for (let f in this.features) {
          let feature = this.features[f]
          if (!fuzzy.test(this.search, feature.name)) {
            continue
          }
          if (this.refinementData.tags && this.refinementData.tags.length > 0) {
            if (!this.tagMatchesSource(feature)) {
              continue
            }
          }
          filter.push(feature)
        }
        return filter
      },
      filteredScenarios: function () {
        let filter = []
        for (let s in this.scenarios) {
          let scenario = this.scenarios[s]
          if (!fuzzy.test(this.search, scenario.name)) {
            continue
          }
          if (this.refinementData.tags && this.refinementData.tags.length > 0) {
            if (!this.tagMatchesSource(scenario)) {
              continue
            }
          }
          filter.push(scenario)
        }
        return filter
      }
    },
    methods: {
      tagMatchesSource: function (source) {
        let foundTag = false
        for (let t in this.refinementData.tags) {
          let tag = this.refinementData.tags[t]
          for (let st in source.tags) {
            if (tag === source.tags[st].name) {
              foundTag = true
              break
            }
          }
          if (foundTag) {
            break
          }
        }
        return foundTag
      }
    }
  }
</script>
