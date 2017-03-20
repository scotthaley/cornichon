<template>
  <div class="resultcard" ref="card">
    <span><pre><code class="gherkin">{{ pattern }}</code></pre></span>
  </div>
</template>

<script>
  const $ = require('jquery')

  export default {
    name: 'resultcard',
    props: ['pattern'],
    mounted () {
      var hljs = require('highlightjs')
      $(this.$refs.card).find('pre code').each(function (i, block) {
        hljs.highlightBlock(block)
      })
    }
  }
</script>

<style scoped>
  .resultcard {
    margin-top: 20px;
    padding: 20px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
  }

  pre {
    margin: 0;
  }
</style>
