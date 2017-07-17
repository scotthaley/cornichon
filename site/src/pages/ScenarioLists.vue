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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .buttons {
    text-align: right;

    &.center {
      text-align: center;
    }
  }

  .empty-list {
    text-align: center;
    margin-top: 50px;
  }
</style>
