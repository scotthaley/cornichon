<template>
  <div id="searchresults" ref="container">
    <div v-for="result in filteredSupportCode">
      <resultcard v-bind:pattern="result.pattern" v-bind:code="result.code"
                  v-bind:scenarios="result.scenarios" v-bind:keyword="result.keywords[0]"></resultcard>
    </div>
  </div>
</template>

<script>
  import resultcard from './ResultCard'

  const $ = require('jquery')
  const fuzzy = require('fuzzy')

  export default {
    name: 'searchresults',
    props: ['search'],
    components: {
      resultcard
    },
    data () {
      return {
        supportCode: {}
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
          console.log(json)
        })
      $.get('http://localhost:8088/supportcode')
        .done(function (json) {
          _this.updateSupportCode(json)
        })
    },
    methods: {
      updateSupportCode: function (supportCode) {
        console.log(supportCode)
        this.supportCode = supportCode
      }
    }
  }
</script>

<style scoped>
#searchresults {

}
</style>
