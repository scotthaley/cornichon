<template>
  <div class="scenario-lists page">
    <split-pane :default-percent='30' split="vertical">
      <section slot="paneL">
        <div class="buttons">
          <md-button id="new-list" @click="openDialog('new-list-dialog')">New List</md-button>
        </div>
        <md-divider></md-divider>
        <search :list="'queueLists'" :itemKey="'internalID'" :display="'name'" v-model="selected"></search>
      </section>
      <section slot="paneR">
        <div v-if="selectedList">
          <div v-if="selectedList.list.length === 0" class="empty-list">
            <h1>This list is empty. Add some scenarios?</h1>
            <md-button class="md-raised md-primary" @click="editList()">Edit List</md-button>
          </div>
          <div v-if="selectedList.list.length !== 0">
            <div style="display: flex; flex-flow: row; margin-bottom: 20px;">
              <div style="flex-grow: 1">
                <md-button class="md-raised md-primary" @click="runList()">Queue List</md-button>
              </div>
              <div>
                <md-button class="md-raised md-warn" @click="openDialog('delete-list-dialog')">Delete List</md-button>
                <md-button class="md-raised" id="delete-list" @click="editList()">Edit List</md-button>
              </div>
            </div>
            <md-divider></md-divider>
            <md-list>
              <md-list-item v-for="s in selectedList.list" :key="s.internalID">
                <span v-html="`<span class='keyword-1'>${s.keyword}</span>: ${s.name}`"></span>
                <md-divider></md-divider>
              </md-list-item>
            </md-list>
          </div>
        </div>
      </section>
    </split-pane>

    <md-dialog md-open-from="#new-list" md-close-to="#new-list" ref="new-list-dialog">
      <md-dialog-title>Create New List</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <label>List Title</label>
          <md-input v-model="newListName"></md-input>
        </md-input-container>
        <div class="buttons center">
          <md-button class="md-warn" @click="closeDialog('new-list-dialog')">Cancel</md-button>
          <md-button class="md-primary" @click="createList()">Create</md-button>
        </div>
      </md-dialog-content>
    </md-dialog>

    <md-dialog md-open-from="#delete-list" ref="delete-list-dialog">
      <md-dialog-title>Are you sure you want to delete this list?</md-dialog-title>
      <md-dialog-content v-if="selectedList">
        <span>{{selectedList.name}}</span>
        <div style="margin-top: 15px;" class="buttons center">
          <md-button class="md-warn" @click="closeDialog('delete-list-dialog')">Cancel</md-button>
          <md-button class="md-primary" @click="deleteList()">Delete</md-button>
        </div>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
  import SplitPane from 'vue-splitpane'
  import Search from '../components/Search'

  export default {
    name: 'scenario-lists',
    components: {
      SplitPane,
      Search
    },
    data () {
      return {
        selected: '',
        newListName: ''
      }
    },
    computed: {
      selectedList: function () {
        let lists = this.$store.state.queueLists
        for (let i = 0; i < lists.length; i++) {
          let l = lists[i]
          if (l.internalID === this.selected) {
            return l
          }
        }
        return null
      }
    },
    methods: {
      openDialog (ref) {
        this.$refs[ref].open()
      },
      closeDialog (ref) {
        this.$refs[ref].close()
      },
      createList () {
        this.$store.dispatch('create_scenario_list', this.newListName)
        this.newListName = ''
        this.closeDialog('new-list-dialog')
      },
      editList () {
        this.$router.push(`/EditList/${this.selected}`)
      },
      deleteList () {
        this.$store.dispatch('delete_scenario_list', this.selected)
        this.closeDialog('delete-list-dialog')
      },
      runList () {
        let scenariosToRun = {}
        let list = this.selectedList.list
        for (let i = 0; i < list.length; i++) {
          if (list[i].table) {
            for (let t = 0; t < list[i].table.length; t++) {
              let job = {
                scenario: list[i],
                outlineRow: list[i].table[t],
                outlineRowIndex: t,
                scenarioID: `scenario-${i}-${t}`
              }
              scenariosToRun[job.scenarioID] = job
            }
          } else {
            let job = {
              scenario: list[i],
              scenarioID: `scenario-${i}`
            }
            scenariosToRun[job.scenarioID] = job
          }
        }

        this.$store.dispatch('queue_started', {list: scenariosToRun, name: this.selectedList.name}).then(jobID => {
          Object.keys(scenariosToRun).forEach(scenarioID => {
            scenariosToRun[scenarioID].jobID = jobID
            this.$store.dispatch('run_scenario', scenariosToRun[scenarioID])
          })
//          for (let i = 0; i < scenariosToRun.length; i++) {
//            scenariosToRun[i].jobID = jobID
//            this.$store.dispatch('run_scenario', scenariosToRun[i])
//          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .buttons {
    text-align: right;

    &.top {
      padding-bottom: 20px;
    }

    &.center {
      text-align: center;
    }
  }

  .empty-list {
    text-align: center;
    margin-top: 50px;
  }
</style>
