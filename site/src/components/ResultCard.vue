<template>
  <div class="resultcard" ref="card">
    <pre><code class="gherkin header" ref="header" v-html="stepTitle"></code></pre>
    <div class="content">
      <h1>Usage</h1>
      <h1>Code</h1>
      <pre><code class="javascript" v-html="code"></code></pre>
      <h1>Scenarios</h1>
      <pre><code class="gherkin" v-html="mappedScenarios"></code></pre>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')
  const escape = require('escape-html')
  const hljs = require('highlightjs')

  export default {
    name: 'resultcard',
    props: ['keyword', 'pattern', 'code', 'scenarios'],
    watch: {
      'stepTitle': function () {
        $(this.$refs.card).removeClass('open')
        setTimeout(this.codeHighlight, 50)
      }
    },
    methods: {
      codeHighlight: function () {
        $(this.$refs.card).find('pre code').each(function (i, block) {
          hljs.highlightBlock(block)
        })
      }
    },
    computed: {
      stepTitle: function () {
        let stepTitle = `${this.keyword} ${this.pattern}`
        stepTitle = stepTitle.replace(/({.*})/g, `<span class="hljs-string">$1</span>`)
        return stepTitle
      },
      mappedScenarios: function () {
        let mappedScenarios = ''
        for (let i in this.scenarios) {
          let s = this.scenarios[i]
          mappedScenarios += `<div ${this.$options._scopeId} class="uri">${s.uri}</div>`
          for (let t in s.tags) {
            let tag = s.tags[t]
            mappedScenarios += `${escape(tag.name)} `
          }
          mappedScenarios += `\n${escape(s.keyword)} ${escape(s.name)}`
          for (let st in s.steps) {
            let step = s.steps[st]
            if (step.currentStep) {
              mappedScenarios += `\n<div ${this.$options._scopeId} class="currentStep">&#8195;&#8195;${escape(step.keyword + step.name)}</div>`
            } else {
              mappedScenarios += `\n&#8195;&#8195;${escape(step.keyword + step.name)}`
            }
          }
        }
        return mappedScenarios
      }
    },
    mounted () {
      this.codeHighlight()

      var _this = this
      $(this.$refs.header).click(function () {
        $(_this.$refs.card).toggleClass('open')
      })
    }
  }
</script>

<style scoped>
  .resultcard {
    margin-top: 30px;
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.3);
    font-size: 24px;
    text-align: left;
  }

  .resultcard.open {
    padding-bottom: 5px;
  }

  .header {
    cursor: pointer;
  }

  .currentStep {
    display: inline-block;
    width: 100%;
    background-color: darkslategray;
  }

  .uri {
    font-size: 14px;
    color: lightgray;
    margin-bottom: 10px;
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
