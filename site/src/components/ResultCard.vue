<template>
  <div class="resultcard" ref="card" v-bind:class="{ modal }">
    <div v-if="step">
      <pre><code class="gherkin header" ref="header" v-html="stepTitle"></code></pre>
      <div class="content">
        <div class="usage" ref="usage">
          <h1 class="first">Usage<i ref="editusage" class="edit-usage fa fa-pencil fa-1x"></i></h1>
          <div ref="marked" class="marked" v-html="usageHTML"></div>
          <codemirror class="codemirror_usage" v-bind:value="step.usage" v-on:updated="updateUsage"
                      v-on:cancel="cancelUsage"></codemirror>
        </div>
        <h1>Code</h1>
        <pre><code class="javascript" v-html="step.code"></code></pre>
        <h1>Features</h1>
        <div v-for="feature in mappedFeatures">
          <pre><code class="gherkin" v-html="feature"></code></pre>
        </div>
        <h1>Scenarios</h1>
        <div v-for="scenario in mappedScenarios">
          <pre><code class="gherkin" v-html="scenario"></code></pre>
        </div>
      </div>
    </div>

    <div v-if="feature">
      <pre><code class="gherkin header" ref="header" v-text="featureTitle"></code></pre>
      <div class="content">
        <span class="uri" v-text="feature.uri"></span>
        <div v-if="feature.description != ''">
          <h1>Description</h1>
          <div v-html="feature.description.replace(/(?:\r\n|\r|\n)/g, '<br />')"></div>
        </div>
        <div v-if="feature.tags.length > 0">
          <h1>Tags</h1>
          <span v-for="tag in feature.tags" class="tag" v-text="tag.name"></span>
        </div>
        <h1>Scenarios</h1>
        <div v-for="scenario in mappedScenarios">
          <pre><code class="gherkin" v-html="scenario"></code></pre>
        </div>
      </div>
    </div>

    <div v-if="scenario">
      <pre><code class="gherkin header" ref="header" v-text="scenarioTitle"></code></pre>
      <div class="content">
        <span class="uri" v-text="scenario.uri"></span>
        <div v-if="scenario.description != ''">
          <h1>Description</h1>
          <div v-html="scenario.description.replace(/(?:\r\n|\r|\n)/g, '<br />')"></div>
        </div>
        <div v-if="scenario.tags.length > 0">
          <h1>Tags</h1>
          <span v-for="tag in scenario.tags" class="tag" v-text="tag.name"></span>
        </div>
        <h1>Features</h1>
        <div v-for="feature in mappedFeatures">
          <pre><code class="gherkin" v-html="feature"></code></pre>
        </div>
        <h1>Full Scenario</h1>
        <div v-for="scenario in mappedScenarios">
          <pre><code class="gherkin" v-html="scenario"></code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')
  const escape = require('escape-html')
  const hljs = require('highlightjs')
  const marked = require('marked')
  const eventBus = require('@/eventBus')

  import codemirror from './CodeMirror'

  export default {
    name: 'resultcard',
    props: ['step', 'feature', 'scenario', 'modal'],
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
      },
      'scenarioTitle': function () {
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
        let featureTitle = this.feature ? `${this.feature.keyword}: ${this.feature.name}` : ''
        return featureTitle
      },
      stepTitle: function () {
        let stepTitle = this.step ? `${this.step.keyword} ${this.step.pattern}` : ''
        stepTitle = stepTitle.replace(/({.*})/g, `<span class="hljs-string">$1</span>`)
        return stepTitle
      },
      scenarioTitle: function () {
        let scenarioTitle = this.scenario ? `${this.scenario.keyword}: ${this.scenario.name}` : ''
        return scenarioTitle
      },
      mappedFeatures: function () {
        let mappedFeatures = []
        let source = null
        if (this.step) {
          source = this.step.features
        } else if (this.scenario) {
          source = [this.scenario.feature]
        }
        if (source) {
          for (let i in source) {
            let f = source[i]
            let mappedF = ''
            mappedF += `<span ${this.$options._scopeId} class="feature" data-id="${f.internalID}">${escape(f.keyword)}: ${escape(f.name)}</span>`
            mappedF += `\n<div ${this.$options._scopeId} class="feature-description">${escape(f.description)}</div>`
            mappedFeatures.push(mappedF)
          }
        }
        return mappedFeatures
      },
      mappedScenarios: function () {
        let mappedScenarios = []
        let source
        if (this.step) {
          source = this.step.scenarios
        } else if (this.feature) {
          source = this.feature.scenarios
        } else if (this.scenario) {
          source = [this.scenario, ...this.scenario.otherScenarios]
        }
        for (let i in source) {
          let s = source[i]
          let mappedS = ''
          if (this.step) {
            mappedS += `<span ${this.$options._scopeId} class="uri">${s.uri}</span>\n`
          }
          for (let t in s.tags) {
            let tag = s.tags[t]
            mappedS += `${escape(tag.name)} `
          }
          if (s.tags.length > 0) {
            mappedS += '\n'
          }
          mappedS += `<span ${this.$options._scopeId} class="scenario" data-id="${s.internalID}">${escape(s.keyword)}: ${escape(s.name)}</span>`
          for (let st in s.steps) {
            let step = s.steps[st]
            if (step.currentStep) {
              mappedS += `\n<span ${this.$options._scopeId} class="step currentStep" data-id="${step.cornichonID}"><span ${this.$options._scopeId} class="marker"></span>${escape(step.keyword + ' ' + step.name)}</span>`
            } else {
              mappedS += `\n<span ${this.$options._scopeId} class="step" data-id="${step.cornichonID}">${escape(step.keyword + ' ' + step.name)}</span>`
            }
          }
          mappedScenarios.push(mappedS)
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

      $(this.$refs.card).on('click', '.step:not(.currentStep), .scenario, .feature', function (e) {
        let $el = $(e.target).closest('[data-id]')
        eventBus.emit('details', $el.data('id').toString())
      })
    }
  }
</script>

<style lang="scss" scoped>
  .resultcard {
    &:not(.modal) {
      margin-top: 30px;
      box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);
    }
    font-size: 24px;
    text-align: left;

    &.open, &.modal {
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
      &:not(.modal) {
        cursor: pointer;
      }
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

    .scenario {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .step {
      display: inline-block;
      padding: 0 1.5em;
      margin: 0 -0.5em;

      &:hover:not(.currentStep) {
        text-decoration: underline;
        cursor: pointer;
      }

      span.marker {
        position: absolute;
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        margin-top: 7px;
        margin-left: -18px;
        background-color: #42b983;
      }
    }

    .feature {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .feature-description {
      padding-top: 1em;
      padding-left: 1.5em;
      font-size: 0.8em;
    }

    .tag {
      padding: 7px;
      background-color: #2c3e50;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      margin-right: 5px;

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
      display: inline;
      font-size: 12px;
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
      margin: 15px 0 10px;
      border-bottom: 3px solid #E6E6E6;
      line-height: 1.5;

      &.first {
        margin-top: 10px;
      }
    }

    pre {
      margin: 0;
    }

    code {
      line-height: 1.4;
    }
  }
</style>
