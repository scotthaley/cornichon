<template>
  <div class="edit-list page">
    <div v-if="selectedList" style="display: flex; flex-flow: column; height: 100%">
      <md-toolbar>
        <h2 class="md-title" v-text="`Editing: ${selectedList.name}`" style="flex: 1"></h2>
        <md-button @click="discard()">Discard Changes</md-button>
        <md-button @click="save()">Save</md-button>
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
              <md-list-item v-for="s in selectedList.draft" :key="s.internalID" class="vertical-list">
                <div style="display: flex; flex-flow: row; flex: 1; position: relative; align-items: center; justify-content: space-between; width: 100%">
                  <span v-html="s.name"></span>
                  <md-button @click="removeScenario(s)"><md-icon>close</md-icon></md-button>
                </div>
                <!--<div v-if="s.table" style="flex-grow: 1; width: 100%">-->
                  <!--<table>-->
                    <!--<tr v-for="">-->

                    <!--</tr>-->
                  <!--</table>-->
                <!--</div>-->
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
    data () {
      return {
        selectedList: null
      }
    },
    mounted () {
      let lists = this.$store.state.queueLists
      for (let i = 0; i < lists.length; i++) {
        let l = lists[i]
        if (l.internalID === this.id) {
          for (let a = 0; a < l.list.length; a++) {
            l.draft.push(l.list[a])
          }
          this.selectedList = l
          break
        }
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
      },
      discard () {
        this.$store.dispatch('discard_draft', this.selectedList.internalID)
        this.$router.push('/Scenario-Lists')
      },
      save () {
        this.$store.dispatch('save_draft', this.selectedList)
        this.$router.push('/Scenario-Lists')
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

<style lang="scss">
  .vertical-list {
    .md-list-item-container {
      flex-flow: column;
    }
  }
</style>
