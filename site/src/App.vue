<template>
  <div id="app">
    <topbar></topbar>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import topbar from './components/TopBar'

  export default {
    components: {topbar},
    name: 'app',
    mounted () {
      this.$store.dispatch('refresh_data')
    }
  }
</script>

<style>
  #app {
    display: flex;
    flex-flow: column;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }

  .content {
    position: relative;
    flex-grow: 1;
  }

  .page {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .page section {
    height: 100%;
    overflow: auto;
  }

  html, body {
    margin: 0;
    height: 100%;
  }

  .keyword-1 {
    color: #1d75b3;
  }

  .keyword-2 {
    color: #a98fc9;
  }
</style>
