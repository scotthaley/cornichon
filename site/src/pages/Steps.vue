<template>
  <div class="steps page">
    <split-pane :default-percent='30' split="vertical">
      <section slot="paneL">
        <search :list="'steps'" :itemKey="'cornichonID'" :display="'html'" v-model="selected"></search>
      </section>
      <section slot="paneR">
        <div class="selected-step" v-if="selectedStep">
          <div class="selected-step-header">
            <h1 v-html="selectedStep.html"></h1>
            <md-divider></md-divider>
          </div>
          <div class="selected-step-content">
            <h1>Usage <md-icon class="usage-edit" @click.native="editUsage()">create</md-icon></h1>
            <span v-if="!edittingUsage" v-html="usageMarkdown"></span>
            <div v-if="edittingUsage">
              <codemirror v-model="usageDraft" :options="usageEditorOptions"></codemirror>
              <div class="usage-buttons">
                <md-button class="md-raised md-warn" @click="edittingUsage = false">Cancel</md-button>
                <md-button class="md-raised md-primary" @click="saveUsage()">Save</md-button>
              </div>
            </div>
            <md-divider></md-divider>
            <h1>Features</h1>
            <div class="features">
              <feature-view v-for="f in selectedStep.features" :key="f.internalID" :featureID="f.internalID"></feature-view>
            </div>
            <md-divider></md-divider>
            <h1>Code</h1>
            <div class="code-codemirror">
              <codemirror v-model="selectedStep.code" :options="codeEditorOptions"></codemirror>
            </div>
            <md-divider></md-divider>
            <h1>Scenarios</h1>
            <scenario-view v-for="s in selectedStep.scenarios" :key="s.internalID" :scenarioID="s.internalID"></scenario-view>
          </div>
        </div>
      </section>
    </split-pane>
  </div>
</template>

<script>
  import SplitPane from 'vue-splitpane'
  import MdInputContainer from '../../node_modules/vue-material/src/components/mdInputContainer/mdInputContainer'
  import MdDivider from '../../node_modules/vue-material/src/components/mdDivider/mdDivider'
  import { codemirror } from 'vue-codemirror-lite'
  import ScenarioView from '../components/ScenarioView'
  import FeatureView from '../components/FeatureView'
  import Search from '../components/Search'
  const marked = require('marked')

  export default {
    name: 'steps',
    components: {
      Search,
      FeatureView,
      ScenarioView,
      MdDivider,
      MdInputContainer,
      SplitPane,
      codemirror
    },
    data () {
      return {
        selected: null,
        edittingUsage: false,
        usageDraft: ''
      }
    },
    computed: {
      usageEditorOptions: function () {
        return {
          mode: 'GFM',
          theme: this.$store.state.settings.custom['Code Style'] || 'material',
          lineNumbers: true
        }
      },
      codeEditorOptions: function () {
        return {
          mode: 'javascript',
          theme: this.$store.state.settings.custom['Code Style'] || 'material',
          lineNumbers: true,
          readOnly: true,
          firstLineNumber: this.selectedStep.line - 1,
          viewportMargin: Infinity
        }
      },
      selectedStep: function () {
        let allsteps = this.$store.state.steps
        for (let i = 0; i < allsteps.length; i++) {
          if (allsteps[i].cornichonID === this.selected) {
            return allsteps[i]
          }
        }
        return null
      },
      usageMarkdown: function () {
        if (this.selectedStep) {
          return marked(this.selectedStep.usage)
        }
      }
    },
    methods: {
      editUsage: function () {
        this.edittingUsage = true
        this.usageDraft = this.selectedStep.usage
      },
      saveUsage: function () {
        this.edittingUsage = false
        this.selectedStep.usage = this.usageDraft
        this.$store.dispatch('update_usage', {cornichonID: this.selectedStep.cornichonID, markdown: this.usageDraft})
      }
    }
  }
</script>

<style lang="scss">
  .steps {
    .selected-step {
      text-align: left;
      padding: 15px;
      line-height: 1.7;
      display: flex;
      flex-flow: column;
      height: 100%;

      .selected-step-content {
        flex-grow: 1;
        overflow: auto;
      }
    }

    .usage-edit:hover {
      color: #4c81c9;
      cursor: pointer;
    }

    .usage-buttons {
      text-align: right;
      margin-bottom: 10px;
    }

    .CodeMirror {
      height: 200px;
      margin-bottom: 20px;
    }

    .code-codemirror .CodeMirror {
      height: auto;
    }

    .features {
      margin-bottom: 20px;
    }
  }
</style>
