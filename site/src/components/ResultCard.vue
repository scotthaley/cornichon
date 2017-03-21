<template>
  <div class="resultcard" ref="card">
    <pre><code class="gherkin header" ref="header">{{ keyword }}{{ pattern }}</code></pre>
    <div class="content">
      <h1>Usage</h1>
      <h1>Code</h1>
      <pre><code class="javascript">{{ code }}</code></pre>
      <h1>Scenarios</h1>
      <pre><code class="gherkin" v-html="mappedScenarios"></code></pre>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')

  export default {
    name: 'resultcard',
    props: ['keyword', 'pattern', 'code', 'scenarios'],
    data () {
      let mappedScenarios = ''
      for (let i in this.scenarios) {
        let s = this.scenarios[i]
        for (let t in s.tags) {
          let tag = s.tags[t]
          mappedScenarios += `${tag.name} `
        }
        mappedScenarios += `\n${s.keyword} ${s.name}`
        for (let st in s.steps) {
          let step = s.steps[st]
          console.log(step.name, this.pattern)
          if (step.name === this.pattern) {
            mappedScenarios += `\n<span style="display: inline-block; width: 100%; background-color: darkslategray">&#8195;&#8195;${step.keyword + step.name}</span>`
          } else {
            mappedScenarios += `\n&#8195;&#8195;${step.keyword + step.name}`
          }
        }
      }
      return {
        mappedScenarios
      }
    },
    mounted () {
      var _this = this
      var hljs = require('highlightjs')
      $(this.$refs.card).find('pre code').each(function (i, block) {
        hljs.highlightBlock(block)
      })

      $(this.$refs.header).click(function () {
        $(_this.$refs.card).toggleClass('open')
      })
    }
  }
</script>

<style scoped>
  .resultcard {
    margin-top: 20px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
    font-size: 24px;
    text-align: left;
  }

  .resultcard.open {
    padding-bottom: 5px;
  }

  .header {
    cursor: pointer;
  }

  h1 {
    display: inline-block;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    font-size: 24px;
    margin: 10px 0;
    border-bottom: 3px solid #E6E6E6;
    line-height: 1.5;
  }

  pre {
    margin: 0;
  }

  code {
    line-height: 1.4;
  }

  .content {
    display: none;
    margin: 20px;
    font-size: 18px;
  }

  .open .content {
    display: block;
  }
</style>
