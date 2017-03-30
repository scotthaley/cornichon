<template>
  <div class="resultcard" ref="card">
    <div v-if="step">
      <pre><code class="gherkin header" ref="header" v-html="stepTitle"></code></pre>
      <div class="content">
        <div class="usage" ref="usage">
          <h1>Usage<i ref="editusage" class="edit-usage fa fa-pencil fa-1x"></i></h1>
          <div ref="marked" class="marked" v-html="usageHTML"></div>
          <codemirror class="codemirror_usage" v-bind:value="step.usage" v-on:updated="updateUsage"
                      v-on:cancel="cancelUsage"></codemirror>
        </div>
        <h1>Code</h1>
        <pre><code class="javascript" v-html="step.code"></code></pre>
        <h1>Scenarios</h1>
        <pre><code class="gherkin" v-html="mappedScenarios"></code></pre>
      </div>
    </div>

    <div v-if="feature">
      <pre><code class="gherkin header" ref="header" v-text="featureTitle"></code></pre>
      <div class="content">
        <span class="uri" v-text="feature.uri"></span>
        <h1>Description</h1>
        <span v-html="feature.description"></span>
        <h1>Tags</h1>
        <span v-for="tag in feature.tags" class="tag" v-text="tag.name"></span>
        <h1>Scenarios</h1>
        <pre><code class="gherkin" v-html="mappedScenarios"></code></pre>
      </div>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')
  const escape = require('escape-html')
  const hljs = require('highlightjs')
  const marked = require('marked')

  import codemirror from './CodeMirror'

  export default {
    name: 'resultcard',
    props: ['step', 'feature'],
    components: {
      codemirror
    },
    watch: {
      'stepTitle': function () {
        $(this.$refs.card).removeClass('open')
        setTimeout(this.codeHighlight, 50)
      },
      'featureTitle': function () {
        $(this.$refs.card).removeClass('open')
        setTimeout(this.codeHighlight, 50)
      }
    },
    methods: {
      codeHighlight: function () {
        $(this.$refs.card).find('pre code').each(function (i, block) {
          hljs.highlightBlock(block)
        })
      },
      updateUsage: function (markdown) {
        $.post('http://localhost:8088/updateUsage', {markdown, cornichonID: this.step.cornichonID}, null, 'json')
        $(this.$refs.usage).removeClass('open')
        this.step.usage = markdown
        setTimeout(this.codeHighlight, 50)
      },
      cancelUsage: function () {
        $(this.$refs.usage).removeClass('open')
      }
    },
    computed: {
      usageHTML: function () {
        return marked(this.step.usage)
      },
      featureTitle: function () {
        let featureTitle = this.feature ? `${this.feature.keyword} ${this.feature.name}` : ''
        return featureTitle
      },
      stepTitle: function () {
        let stepTitle = this.step ? `${this.step.keyword} ${this.step.pattern}` : ''
        stepTitle = stepTitle.replace(/({.*})/g, `<span class="hljs-string">$1</span>`)
        return stepTitle
      },
      mappedScenarios: function () {
        let mappedScenarios = ''
        let source
        if (this.step) {
          source = this.step.scenarios
        } else if (this.feature) {
          source = this.feature.scenarios
        }
        for (let i in source) {
          let s = source[i]
          if (this.step) {
            mappedScenarios += `<div ${this.$options._scopeId} class="uri">${s.uri}</div>`
          }
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

      $(this.$refs.editusage).click(function () {
        $(_this.$refs.usage).addClass('open')
      })
    }
  }
</script>

<style lang="scss" scoped>
  .resultcard {
    margin-top: 30px;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);
    font-size: 24px;
    text-align: left;

    &.open {
      padding-bottom: 5px;

      .content {
        display: block;
      }
    }

    .content {
      display: none;
      margin: 20px;
      font-size: 18px;
    }

    .header {
      cursor: pointer;
    }

    .usage {
      &:not(.open) {
        .codemirror_usage {
          display: none;
        }
        &:hover {
          .edit-usage {
            display: inline;
          }
        }
      }
      &.open {
        .marked {
          display: none;
        }
      }
      .edit-usage {
        margin-left: 20px;
        display: none;
        cursor: pointer;

        &:hover {
          color: cornflowerblue;
        }
      }
    }

    .currentStep {
      display: inline-block;
      width: 100%;
      background-color: darkslategray;
    }

    .tag {
      padding: 7px;
      background-color: #2c3e50;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      color: white;
      cursor: pointer;

      &:hover {
        color: #8be9fd;
      }
    }

    .uri {
      display: block;
      color: darkslategrey;
      font-size: 14px;
      margin-top: -10px;
    }

    code .uri {
      font-size: 14px;
      color: lightgray;
      margin-bottom: 10px;
      margin-top: 0;
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
  }
</style>
