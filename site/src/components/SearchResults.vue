<template>
  <div id="searchresults" ref="container">
    <div v-if="sidebarData.searchMode == 'Steps'" v-for="result in filteredSupportCode">
      <resultcard v-bind:step="result"></resultcard>
    </div>
    <div v-if="sidebarData.searchMode == 'Features'" v-for="result in features">
      <resultcard v-bind:feature="result"></resultcard>
    </div>
  </div>
</template>

<script>
  import resultcard from './ResultCard'

  const $ = require('jquery')
  const fuzzy = require('fuzzy')

  export default {
    name: 'searchresults',
    props: ['search', 'sidebarData'],
    components: {
      resultcard
    },
    data () {
      return {
        supportCode: [],
        features: []
      }
    },
    computed: {
      filteredSupportCode: function () {
        let filter = []
        for (let f in this.$data.supportCode) {
          let sCode = this.$data.supportCode[f]
          if (fuzzy.test(this.search, sCode.fullName)) {
            filter.push(sCode)
          }
        }
        return filter
      }
    },
    mounted () {
      const _this = this
      $.get('http://localhost:8088/features')
        .done(function (json) {
          _this.updateFeatures(json)
        })
      $.get('http://localhost:8088/supportcode')
        .done(function (json) {
          _this.updateSupportCode(json)
        })
    },
    methods: {
      updateSupportCode: function (supportCode) {
        this.supportCode = supportCode
      },
      updateFeatures: function (features) {
        this.features = features
      }
    }
  }
</script>

<style scoped>
#searchresults {

}
</style>
