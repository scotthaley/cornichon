<template>
  <div class="scenarios page">
    <split-pane :default-percent='30' split="vertical">
      <section slot="paneL">
        <search :list="'scenarios'" :itemKey="'internalID'" :display="'name'" v-model="selected"></search>
      </section>
      <section slot="paneR">
        <div class="selected-scenario" v-if="selectedScenario">
          <div class="selected-scenario-header">
            <h1 v-html="`<span class='keyword-1'>${selectedScenario.keyword}</span>: ${selectedScenario.name}`"></h1>
            <md-divider></md-divider>
          </div>
          <div class="selected-scenario-content">
            <h1>Steps</h1>
            <scenario-view :scenarioID="selectedScenario.internalID"></scenario-view>
            <md-divider></md-divider>
            <h1>Features</h1>
            <div class="features">
              <feature-view :featureID="selectedScenario.feature.internalID"></feature-view>
            </div>
            <md-divider></md-divider>
          </div>
        </div>
      </section>
    </split-pane>
  </div>
</template>

<script>
  import SplitPane from 'vue-splitpane'
  import Search from '../components/Search'
  import ScenarioView from '../components/ScenarioView'
  import FeatureView from '../components/FeatureView'

  export default {
    name: 'scenarios',
    components: {SplitPane, Search, ScenarioView, FeatureView},
    data () {
      return {
        selected: ''
      }
    },
    computed: {
      selectedScenario: function () {
        let scenarios = this.$store.state.scenarios
        for (let i = 0; i < scenarios.length; i++) {
          if (scenarios[i].internalID === this.selected) {
            return scenarios[i]
          }
        }
        return null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .selected-scenario {
    text-align: left;
    padding: 15px;
    line-height: 1.7;
    display: flex;
    flex-flow: column;
    height: 100%;

    .selected-scenario-content {
      flex-grow: 1;
      overflow: auto;
    }
  }
</style>
