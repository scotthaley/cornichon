<template>
  <div class="features page">
    <split-pane :default-percent='30' split="vertical">
      <section slot="paneL">
        <search :list="'features'" :itemKey="'internalID'" :display="'name'" v-model="selected"></search>
      </section>
      <section slot="paneR">
        <div class="selected-features" v-if="selectedFeature">
          <div class="selected-features-header">
            <h1 v-html="`<span class='keyword-1'>${selectedFeature.keyword}</span>: ${selectedFeature.name}`"></h1>
            <md-divider></md-divider>
          </div>
          <div class="selected-features-content">
            <h1>Steps</h1>
            <scenario-view v-for="s in selectedFeature.scenarios" :key="s.internalID" :scenarioID="s.internalID"></scenario-view>
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
    name: 'features',
    components: {SplitPane, Search, ScenarioView, FeatureView},
    data () {
      return {
        selected: ''
      }
    },
    computed: {
      selectedFeature: function () {
        let features = this.$store.state.features
        for (let i = 0; i < features.length; i++) {
          if (features[i].internalID === this.selected) {
            return features[i]
          }
        }
        return null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .selected-features {
    text-align: left;
    padding: 15px;
    line-height: 1.7;
    display: flex;
    flex-flow: column;
    height: 100%;

    .selected-features-content {
      flex-grow: 1;
      overflow: auto;
    }
  }
</style>

