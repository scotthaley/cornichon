<template>
  <div class="history page">
    <split-pane :default-percent='30' split="vertical">
      <section slot="paneL">
        <search :list="'history'" :itemKey="'jobID'" :display="'title'" v-model="selected"></search>
      </section>
      <section slot="paneR">
        <div v-if="selectedReport">
          <md-list>
            <md-list-item v-for="s in selectedReport.list" :key="s.scenarioID">
              <div style="display: flex; flex-direction: row; flex: 1">
                <div style="flex: 1;" v-html="`<span class='keyword-1'>${s.scenario.keyword}</span>: ${s.scenario.name}`"></div>
                <md-icon v-if="s.result.status === 'passed'" style="color: #00C506">check</md-icon>
                <md-icon v-if="s.result.status === 'failed'" style="color: #C53B47">close</md-icon>
                <md-icon v-if="s.result.status === 'undefined'" style="color: #C3C54F">help_outline</md-icon>
              </div>
              <md-divider></md-divider>
            </md-list-item>
          </md-list>
        </div>
      </section>
    </split-pane>
  </div>
</template>

<script>
  import SplitPane from 'vue-splitpane'
  import Search from '../components/Search'

  export default {
    name: 'history',
    components: {SplitPane, Search},
    data () {
      return {
        selected: ''
      }
    },
    computed: {
      selectedReport () {
        let reports = this.$store.state.history
        for (let i = 0; i < reports.length; i++) {
          if (reports[i].jobID === this.selected) {
            return reports[i]
          }
        }
        return null
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
