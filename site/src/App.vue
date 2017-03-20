<template>
  <div id="app">
    <searchbar></searchbar>
    <searchresults></searchresults>
  </div>
</template>

<script>
import Hello from './components/Hello'
import searchbar from './components/SearchBar'
import searchresults from './components/SearchResults'

export default {
  name: 'app',
  components: {
    Hello,
    searchbar,
    searchresults
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 32px;
}
</style>
