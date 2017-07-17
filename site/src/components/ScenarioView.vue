<template>
  <div class="scenario-view">
    <table>
      <tr v-for="(line, index) in lines">
        <td><span class="line-number" v-text="index + startLine"></span></td>
        <td><span v-html="line"></span></td>
      </tr>
    </table>
  </div>
</template>

<script>
  const htmlencode = require('htmlencode').htmlEncode

  export default {
    name: 'scenario-view',
    props: ['scenarioID', 'highlightStep'],
    computed: {
      scenario: function () {
        for (let i = 0; i < this.$store.state.scenarios.length; i++) {
          let s = this.$store.state.scenarios[i]
          if (s.internalID === this.scenarioID) {
            return s
          }
        }
        return null
      },
      startLine: function () {
        return this.scenario.line
      },
      lines: function () {
        let l = []
        if (this.scenario) {
          l.push(`<span class="keyword-2">${this.scenario.keyword}</span>: ${this.scenario.name}`)
          for (let i = 0; i < this.scenario.steps.length; i++) {
            let step = this.scenario.steps[i]
            let name = htmlencode(step.name)
            name = name.replace(/(&lt;[^&]*&gt;)/g, '<span class="keyword-2">$1</span>')
            l.push(`<span class="indent"><span class="keyword-1">${step.keyword}</span> ${name}</span>`)
          }
        }
        return l
      }
    }
  }
</script>

<style lang="scss">
  .scenario-view {
    font-family: Menlo, Monaco, Consolas, monospace;
    font-size: 14px;
    color: white;
    background-color: #263338;
    padding: 5px;
    line-height: 1.3;

    +.scenario-view {
      padding-top: 15px;
    }
  }

  .line-number {
    display: inline-block;
    min-width: 20px;
    color: #507e7c;
  }

  .indent {
    display: inline-block;
    margin-left: 30px;
  }
</style>
