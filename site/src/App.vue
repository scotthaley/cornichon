<template>
  <div id="app">
    <sidebar></sidebar>
    <div class="content" ref="content">
      <div v-if="currentPage === 'Steps' || currentPage === 'Scenarios' || currentPage === 'Features'">
        <searchbar v-show="currentPage === 'Steps'" v-model="search"
                   v-bind:placeholders="placeholders.supportcode"></searchbar>
        <searchbar v-show="currentPage === 'Features'" v-model="search"
                   v-bind:placeholders="placeholders.features"></searchbar>
        <searchbar v-show="currentPage === 'Scenarios'" v-model="search"
                   v-bind:placeholders="placeholders.scenarios"></searchbar>
        <div class="utility-bar" v-if="currentPage !== 'Settings'">
          <refinements></refinements>
        </div>
        <searchresults v-bind:search="search"></searchresults>
      </div>
      <settings v-if="currentPage === 'Settings'"></settings>
      <queue-runner v-if="currentPage === 'Queue'"></queue-runner>
    </div>
    <scenario-queue v-if="currentPage === 'Steps' || currentPage === 'Scenarios' || currentPage === 'Features'"></scenario-queue>
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
  import scenarioQueue from './components/ScenarioQueue'
  import settings from './components/Settings'
  import queueRunner from './components/QueueRunner'

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
      scenarioQueue,
      settings,
      queueRunner
    },
    data () {
      return {
        search: ''
      }
    },
    computed: {
      placeholders: function () {
        return this.$store.state.placeholders
      },
      currentPage: function () {
        return this.$store.state.currentPage
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

  .buttons {
    margin-top: 10px;
    width: 100%;
    text-align: right;

    button {
      cursor: pointer;
      background-color: #263238;
      color: white;
      padding: 10px;
      width: 150px;
      border: none;

      &:hover {
        color: #8be9fd;
      }
    }
  }
</style>
