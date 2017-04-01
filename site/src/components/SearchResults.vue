<template>
  <div id="searchresults" ref="container">
    <div v-if="sidebarData.searchMode === 'Steps'" v-for="result in filteredSupportCode">
      <resultcard v-bind:step="result"></resultcard>
    </div>
    <div v-if="sidebarData.searchMode === 'Features'" v-for="result in filteredFeatures">
      <resultcard v-bind:feature="result"></resultcard>
    </div>
    <div v-if="sidebarData.searchMode === 'Scenarios'" v-for="result in filteredScenarios">
      <resultcard v-bind:scenario="result"></resultcard>
    </div>
  </div>
</template>

<script>
  import resultcard from './ResultCard'

  const fuzzy = require('fuzzy')

  export default {
    name: 'searchresults',
    props: ['value', 'search', 'sidebarData', 'supportCode', 'features', 'scenarios'],
    components: {
      resultcard
    },
    computed: {
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
          if (fuzzy.test(this.search, feature.name)) {
            filter.push(feature)
          }
        }
        return filter
      },
      filteredScenarios: function () {
        let filter = []
        for (let s in this.scenarios) {
          let scenario = this.scenarios[s]
          if (fuzzy.test(this.search, scenario.name)) {
            filter.push(scenario)
          }
        }
        return filter
      }
    }
  }
</script>

<style scoped>
#searchresults {

}
</style>
