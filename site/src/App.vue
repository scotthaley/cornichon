<template>
  <div id="app">
    <sidebar v-model="sidebarData"></sidebar>
    <div class="content">
      <searchbar v-model="search"></searchbar>
      <searchresults v-bind:search="search" v-bind:sidebarData="sidebarData"></searchresults>
    </div>
  </div>
</template>

<script>
  import Hello from './components/Hello'
  import searchbar from './components/SearchBar'
  import searchresults from './components/SearchResults'
  import sidebar from './components/SideBar'

  export default {
    name: 'app',
    components: {
      Hello,
      searchbar,
      searchresults,
      sidebar
    },
    data () {
      return {
        search: '',
        sidebarData: {}
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
