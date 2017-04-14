<template>
 <pre><code class="gherkin" v-html="scenario.markup"></code></pre>
</template>

<script>
export default {
  name: 'codeblock',
  props: ['scenario'],
  data () {
    return {}
  }
}
</script>
