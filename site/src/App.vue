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
        <scenario-queue></scenario-queue>
      </div>
      <searchresults v-bind:search="search" v-bind:sidebarData="sidebarData"></searchresults>
    </div>
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
    },
    mounted () {
      eventBus.on('details', function () {
        $('body').css('overflow', 'hidden')
      })
      eventBus.on('details-closed', function () {
        $('body').css('overflow', 'auto')
      })
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

    .utility-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .2em .5em 0;
    }
  }
</style>
