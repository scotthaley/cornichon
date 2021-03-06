<template>
  <div class="resultcard" ref="card" v-bind:class="{ modal }">
    <div v-if="step">
      <div class="wrapper" @click="toggleCard">
        <div class="label">
          <pre><code class="gherkin header" ref="header" v-html="stepTitle"></code></pre>
        </div>
      </div>
      <div class="content" v-if="open">
        <span class="uri" v-text="step.uri" v-on:click="openFile(step.uri_full)"></span>
        <div class="usage" ref="usage">
          <h1 class="first">Usage<i ref="editusage" class="edit-usage fa fa-pencil fa-1x" @click="usageOpen = true"></i>
          </h1>
          <div ref="marked" class="marked" v-html="usageHTML"></div>
          <codemirror class="codemirror_usage" v-if="usageOpen" :value="step.usage" @updated="updateUsage"
                      @cancel="cancelUsage"></codemirror>
        </div>
        <h1>Code</h1>
        <codemirror class="codemirror" v-model="step.code"
                    :options="{ readOnly: true, mode: 'javascript', firstLineNumber: step.line }"></codemirror>
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
      <div class="wrapper" @click="toggleCard">
        <div class="label">
          <pre><code class="gherkin header" ref="header" v-text="featureTitle"></code></pre>
        </div>
      </div>
      <div class="content" v-if="open">
        <span class="uri" v-text="feature.uri" v-on:click="openFile(feature.uri_full)"></span>
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
      <div class="wrapper" @click="toggleCard">
        <div class="label">
          <pre><code class="gherkin header" ref="header" v-html="scenarioTitle"></code></pre>
        </div>
        <i v-if="!scenario_queued" @click.stop="queueScenario()" class="fa fa-plus add"></i>
        <i v-if="scenario_queued" @click.stop="removeScenarioFromQueue()" class="fa fa-times remove"></i>
      </div>
      <div class="content" v-if="open">
        <span class="uri" v-text="scenario.uri" v-on:click="openFile(scenario.uri_full)"></span>
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
    data () {
      return {
        openToggled: false,
        usageOpen: false
      }
    },
    watch: {
      'step': function () {
        this.openToggled = false
        setTimeout(this.codeHighlight, 50)
      },
      'feature': function () {
        this.openToggled = false
        setTimeout(this.codeHighlight, 50)
      },
      'scenario': function () {
        this.openToggled = false
        setTimeout(this.codeHighlight, 50)
      }
    },
    methods: {
      toggleCard: function () {
        if (this.modal) {
          return
        }
        if (this.open) {
          this.$store.dispatch('CLOSE_CARD', this.id)
        } else {
          this.$store.dispatch('OPEN_CARD', this.id)
        }
        setTimeout(this.codeHighlight, 50)
      },
      codeHighlight: function () {
        $(this.$refs.card).find('pre code').each(function (i, block) {
          hljs.highlightBlock(block)
        })
      },
      updateUsage: function (markdown) {
        $.post('/updateUsage', {markdown, cornichonID: this.step.cornichonID}, null, 'json')
        this.usageOpen = false
        this.step.usage = markdown
        setTimeout(this.codeHighlight, 50)
      },
      cancelUsage: function () {
        this.usageOpen = false
      },
      openFile: function (path) {
        path = path.replace(/\\/g, '/')
        $.post('/openFile', {path}, null, 'json')
      },
      runScenario: function (internalID) {
        $.post('/runScenario', {internalID}, null, 'json')
      },
      queueScenario: function () {
        this.$store.dispatch('QUEUE_SCENARIO', this.scenario)
      },
      removeScenarioFromQueue: function () {
        this.$store.dispatch('REMOVE_SCENARIO_FROM_QUEUE', this.scenario.internalID)
      }
    },
    computed: {
      id: function () {
        if (this.step) {
          return this.step.cornichonID
        } else if (this.scenario) {
          return this.scenario.internalID
        } else if (this.feature) {
          return this.feature.internalID
        }
      },
      scenario_queued: function () {
        for (let i in this.$store.state.scenario_queue) {
          if (this.$store.state.scenario_queue[i].scenario.internalID === this.scenario.internalID) {
            return true
          }
        }
        return false
      },
      open: function () {
        return this.$store.state.open_cards.includes(this.id) || this.modal
      },
      usageHTML: function () {
        return marked(this.step.usage)
      },
      featureTitle: function () {
        let featureTitle = this.feature ? `${this.feature.keyword}: ${this.feature.name}` : ''
        return featureTitle
      },
      stepTitle: function () {
        let stepTitle = this.step ? `${this.step.keyword} ${this.step.pattern}` : ''
        stepTitle = stepTitle.replace(/({[^}]*})/g, `<span class="hljs-string">$1</span>`)
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
            mappedS += `<span ${this.$options._scopeId} class="uri" data-uri=${s.uri_full}>${s.uri}</span>\n`
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
            let undefinedText = step.cornichonID ? '' : `<span ${this.$options._scopeId} class="und-step">No step definition found</span>`
            let undefinedClass = step.cornichonID ? '' : 'und-step'
            if (step.currentStep) {
              mappedS += `\n<span ${this.$options._scopeId} class="step currentStep ${undefinedClass}" data-id="${step.cornichonID}"><span ${this.$options._scopeId} class="marker"></span>${escape(step.keyword + ' ' + step.name)}${undefinedText}</span>`
            } else {
              mappedS += `\n<span ${this.$options._scopeId} class="step ${undefinedClass}" data-id="${step.cornichonID}">${escape(step.keyword + ' ' + step.name)}${undefinedText}</span>`
            }
          }
          if (s.table) {
            mappedS += `\n\n<table ${this.$options._scopeId}><tr>`
            for (let a in s.table) {
              mappedS += `<th ${this.$options._scopeId}>${a}</th>`
            }
            mappedS += '</tr>'
            for (let a = 0; a < s.table[Object.keys(s.table)[0]].length; a++) {
              mappedS += `<tr ${this.$options._scopeId}>`
              for (let b in s.table) {
                mappedS += `<td ${this.$options._scopeId}>${s.table[b][a]}</td>`
              }
              mappedS += '</tr>'
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

      $(this.$refs.card).on('click', '.step:not(.currentStep), .scenario, .feature', function (e) {
        let $el = $(e.target).closest('[data-id]')
        eventBus.emit('details', $el.data('id').toString())
      })

      $(this.$refs.card).on('click', '.uri', function (e) {
        _this.openFile($(this).attr('data-uri'))
      })

      $(this.$refs.card).on('click', '.tag', function (e) {
        eventBus.emit('refinement.tag', $(e.target).closest('.tag').text())
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

    &.modal {
      padding-bottom: 5px;
    }

    .content {
      margin: 20px;
      font-size: 18px;
    }

    .wrapper {
      position: relative;
      display: flex;

      .label {
        flex-grow: 1;
      }

      i {
        color: #999;
        cursor: pointer;
        width: 60px;
        background-color: #eaeef3;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          color: #eaeef3;
          background-color: #2e383c;
        }

        &.remove {
          color: #dd4444;

          &:hover {
            color: #2e383c;
            background-color: #dd4444;
          }
        }
      }
    }

    .header {
      &:not(.modal) {
        cursor: pointer;
      }
    }

    .usage {
      &:not(.open) {
        /*.codemirror_usage {*/
        /*display: none;*/
        /*}*/
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

      .und-step {
        font-size: 0.8em;
        padding-left: 1em;
        color: #6b7186;
      }

      &:hover:not(.currentStep):not(.und-step) {
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
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    code .uri {
      display: inline;
      font-size: 12px;
      color: #6b7186;
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

    table {
      margin-left: 1em;
      border-collapse: collapse;
      border-spacing: 0;

      th, td {
        border: 1px solid #00193a;
        padding: 2px 7px;
        min-width: 100px;
      }

      th {
        text-align: center;
      }
    }
  }
</style>
