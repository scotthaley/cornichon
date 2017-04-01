<template>
  <div id="app">
    <sidebar v-model="sidebarData"></sidebar>
    <div class="content" ref="content">
      <searchbar v-show="sidebarData.searchMode === 'Steps'" v-model="search"
                 v-bind:placeholders="placeholders.Steps"></searchbar>
      <searchbar v-show="sidebarData.searchMode === 'Features'" v-model="search"
                 v-bind:placeholders="placeholders.Features"></searchbar>
      <searchbar v-show="sidebarData.searchMode === 'Scenarios'" v-model="search"
                 v-bind:placeholders="placeholders.Scenarios"></searchbar>
      <searchresults v-model="placeholderData" v-bind:search="search" v-bind:sidebarData="sidebarData"
                     v-bind:supportCode="supportCode" v-bind:features="features"
                     v-bind:scenarios="scenarios"></searchresults>
    </div>
    <detailsview v-bind:supportCode="supportCode" v-bind:features="features" v-bind:scenarios="scenarios"></detailsview>
  </div>
</template>

<script>
  import Hello from './components/Hello'
  import searchbar from './components/SearchBar'
  import searchresults from './components/SearchResults'
  import sidebar from './components/SideBar'
  import detailsview from './components/DetailsView'

  const $ = require('jquery')
  const eventBus = require('@/eventBus')

  export default {
    name: 'app',
    components: {
      Hello,
      searchbar,
      searchresults,
      sidebar,
      detailsview
    },
    data () {
      return {
        search: '',
        sidebarData: {},
        placeholderData: {},
        supportCode: [],
        features: [],
        scenarios: [],
        placeholders: {}
      }
    },
    computed: {},
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
      $.get('http://localhost:8088/scenarios')
        .done(function (json) {
          _this.updateScenarios(json)
        })

      eventBus.on('details', function () {
        $('body').css('overflow', 'hidden')
      })
      eventBus.on('details-closed', function () {
        $('body').css('overflow', 'auto')
      })
    },
    methods: {
      updateSupportCode: function (supportCode) {
        this.supportCode = supportCode
        this.placeholders['Steps'] = []
        for (let s in this.supportCode) {
          this.placeholders['Steps'].push(this.supportCode[s].fullName + '...')
        }
      },
      updateFeatures: function (features) {
        this.features = features
        this.placeholders['Features'] = []
        for (let f in this.features) {
          this.placeholders['Features'].push(this.features[f].name + '...')
        }
      },
      updateScenarios: function (scenarios) {
        this.scenarios = scenarios
        this.placeholders['Scenarios'] = []
        for (let s in this.scenarios) {
          this.placeholders['Scenarios'].push(this.scenarios[s].name + '...')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 32px;

    .content {
      padding-left: 160px;
    }
  }
</style>
