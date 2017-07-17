<template>
  <div class="edit-list page">
    <div v-if="selectedList" style="display: flex; flex-flow: column; height: 100%">
      <md-toolbar>
        <h2 class="md-title" v-text="`Editing: ${selectedList.name}`" style="flex: 1"></h2>
        <md-button>Discard Changes</md-button>
        <md-button>Save</md-button>
      </md-toolbar>
      <split-pane :default-percent='40' split="vertical" style="flex-grow: 1">
        <section slot="paneL">
          <search :list="'scenarios'" :itemKey="'internalID'"
                  :display="'name'"
                  :filter="filterSearch"
                  @item-clicked="item => addScenario(item)"></search>
        </section>
        <section slot="paneR">
          <div v-if="selectedList.draft.length === 0" class="empty-list">
            <h1>Click scenarios to add them to the list.</h1>
          </div>
          <div v-if="selectedList.draft.length > 0">
            <md-list>
              <md-list-item v-for="s in selectedList.draft" :key="s.internalID" @click="removeScenario(s)">
                <span v-html="s.name"></span>
                <md-divider></md-divider>
              </md-list-item>
            </md-list>
          </div>
        </section>
      </split-pane>
    </div>
  </div>
</template>

<script>
  import SplitPane from 'vue-splitpane'
  import Search from '../components/Search'
  import draggable from 'vuedraggable'

  export default {
    components: {SplitPane, Search, draggable},
    name: 'editlist',
    props: ['id'],
    computed: {
      selectedList: function () {
        let lists = this.$store.state.queueLists
        for (let i = 0; i < lists.length; i++) {
          let l = lists[i]
          if (l.internalID === this.id) {
            for (let a = 0; a < l.list.length; a++) {
              l.draft.push(l.list[a])
            }
            return l
          }
        }
        return null
      }
    },
    methods: {
      addScenario (item) {
        this.selectedList.draft.push(item)
      },
      removeScenario (item) {
        let index = -1
        for (let i = 0; i < this.selectedList.draft.length; i++) {
          let s = this.selectedList.draft[i]
          if (s.internalID === item.internalID) {
            index = i
          }
        }
        if (index !== -1) {
          this.selectedList.draft.splice(index, 1)
        }
      },
      filterSearch (item) {
        for (let i = 0; i < this.selectedList.draft.length; i++) {
          let s = this.selectedList.draft[i]
          if (s.internalID === item.internalID) {
            return false
          }
        }
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .edit-list {
    .empty-list {
      text-align: center;
      margin-top: 50px;
    }
  }
</style>
