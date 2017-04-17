<template>
  <div id="app">
    <sidebar v-model="sidebarData"></sidebar>
    <div class="content" ref="content">
      <searchbar v-show="sidebarData.searchMode === 'Steps'" v-model="search"
                 v-bind:placeholders="placeholders.supportcode"></searchbar>
      <searchbar v-show="sidebarData.searchMode === 'Features'" v-model="search"
                 v-bind:placeholders="placeholders.features"></searchbar>
      <searchbar v-show="sidebarData.searchMode === 'Scenarios'" v-model="search"
                 v-bind:placeholders="placeholders.scenarios"></searchbar>
      <div class="utility-bar">
        <refinements></refinements>
      </div>
      <searchresults v-bind:search="search" v-bind:sidebarData="sidebarData"></searchresults>
    </div>
    <scenario-queue></scenario-queue>
    <detailsview></detailsview>
  </div>
</template>

<script>
  import Hello from './components/Hello'
  import searchbar from './components/SearchBar'
  import searchresults from './components/SearchResults'
  import sidebar from './components/SideBar'
  import detailsview from './components/DetailsView'
  import refinements from './components/Refinements'
  import scenarioQueue from './components/ScenarioQueue.vue'

  const $ = require('jquery')
  const eventBus = require('@/eventBus')

  export default {
    name: 'app',
    components: {
      Hello,
      searchbar,
      searchresults,
      sidebar,
      detailsview,
      refinements,
      scenarioQueue
    },
    data () {
      return {
        search: '',
        sidebarData: {}
      }
    },
    computed: {
      placeholders: function () {
        return this.$store.state.placeholders
      }
    },
    beforeMount () {
      this.$store.dispatch('FETCH', 'tags')
      this.$store.dispatch('FETCH', 'supportcode')
      this.$store.dispatch('FETCH', 'features')
      this.$store.dispatch('FETCH', 'scenarios')
      this.$store.dispatch('FETCH', 'settings')
    },
    mounted () {
      eventBus.on('details', function () {
        $('body').css('overflow', 'hidden')
      })
      eventBus.on('details-closed', function () {
        $('body').css('overflow', 'auto')
      })

      let socket = io.connect('http://localhost:8088')
      let _this = this

      socket.on('features', (json) => {
        _this.updateFeatures(json)
      })

      socket.on('supportcode', (json) => {
        _this.updateSupportCode(json)
      })

      socket.on('scenarios', (json) => {
        _this.updateScenarios(json)
      })

      socket.on('connect', () => {
        socket.emit('features')
        socket.emit('supportcode')
        socket.emit('scenarios')
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

<style lang="scss">
  body {
    margin: 0;
    min-height: 100vh;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 32px;
    display: flex;
    height: 100%;
    min-height: 100vh;
    .content {
      flex: 1 1;
      padding: 0 .5em 3em;
    }

    .utility-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    code.header {
      white-space: normal;
    }
  }
</style>
