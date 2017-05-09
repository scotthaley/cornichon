<template>
  <div class="queue-item" :class="{locked}">
    <div class="header">
      <div v-if="typeof index !== 'undefined'" class="index"><span>{{ index + 1 }}.</span></div>
      <div class="label">
        <span @click="showDetails()" class="display">{{ scenario.scenario.name }}</span>
      </div>
      <div class="status" v-if="locked">
      <span v-if="!scenario.table && scenario.lastResult.status !== 'running' && scenario.lastResult.status !== 'queued'" class="results"
            @click="openResults()">View Results</span>
        <span v-if="!scenario.table" class="icon">
          <spinner v-if="stepStatus === 'running'"></spinner>
          <span v-if="stepStatus === 'passed'"><i class="fa fa-check"></i></span>
          <span v-if="stepStatus === 'failed'"><i class="fa fa-times"></i></span>
          <span v-if="stepStatus === 'undefined'"><i class="fa fa-question"></i></span>
        </span>
      </div>
      <div class="remove" v-if="!locked" @click="removeScenario()">
        <span><i class="fa fa-times"></i></span>
      </div>
    </div>
    <div v-if="scenario.table && !locked" class="expand">
      <div class="table">
        <table>
          <tr>
            <th v-for="header in table.headers">{{ header }}</th>
          </tr>
          <tr v-for="(row, rowIndex) in table.rows">
            <td v-for="(cell, key) in row"><input v-model="table.rows[rowIndex][key]" @change="updateTable()"/></td>
            <td class="delete-row"><span @click="clearRow(rowIndex)"><i class="fa fa-times"></i></span></td>
          </tr>
        </table>
        <button class="green" @click="addRow()">New Row</button>
        <button class="red" @click="clearRows()">Clear Rows</button>
        <span v-if="createList">
          <span v-for="(value, header) in includeHeaders" class="header-check">
            <label :for="`${header}-check`">{{ header }}</label>
            <input type="checkbox" :id="`${header}-check`" v-model="includeHeaders[header]"/>
          </span>
        </span>
        <input v-if="createList" v-model="newOutlineListName" placeholder="List Name"/>
        <button :class="{green: createList}" @click="saveOutlineList()">Save List</button>
        <select v-model="loadListName">
          <option disabled value="">Select a list to load...</option>
          <option v-for="lName in outlineListNames" :value="lName">{{ lName }}</option>
        </select>
        <button v-if="loadListName !== ''" @click="loadList()">Load List</button>
      </div>
    </div>
    <div v-if="scenario.table && locked" class="outline-items">
      <div class="table">
        <table>
          <tr class="outline-header">
            <th></th>
            <th v-for="header in table.headers">{{ header }}</th>
            <th></th>
          </tr>
          <tr v-for="(row, rowIndex) in table.rows">
            <td class="outline-index">{{ index + 1 }}.{{ rowIndex + 1 }}</td>
            <td v-for="(cell, key) in row">{{ table.rows[rowIndex][key] }}</td>
            <td>
              <span v-if="scenario.lastResult[rowIndex].status !== 'running' && scenario.lastResult[rowIndex].status !== 'queued'"
                    class="results"
                    @click="openResults(rowIndex)">View Results</span>
              <span class="spinner"><spinner v-if="scenario.lastResult[rowIndex].status === 'running'" size="small" line-bg-color="#c5d9ee"></spinner></span>
              <span v-if="scenario.lastResult[rowIndex].status === 'passed'"><i class="fa fa-check"></i></span>
              <span v-if="scenario.lastResult[rowIndex].status === 'failed'"><i class="fa fa-times"></i></span>
              <span v-if="scenario.lastResult[rowIndex].status === 'undefined'"><i class="fa fa-question"></i></span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import spinner from 'vue-simple-spinner'

  const eventBus = require('@/eventBus')

  export default {
    name: 'queue-item',
    props: ['scenario', 'locked', 'index'],
    components: {
      spinner
    },
    data () {
      return {
        rowsModified: false,
        newOutlineListName: '',
        createList: false,
        loadListName: '',
        includeHeaders: {}
      }
    },
    methods: {
      saveOutlineList: function () {
        if (!this.createList) {
          this.createList = true
          this.includeHeaders = {}
          for (let h in this.table.headers) {
            this.includeHeaders[this.table.headers[h]] = true
          }
        } else {
          let headers = []
          let rows = []
          for (let r in this.table.rows) {
            rows.push(Object.assign({}, this.table.rows[r]))
          }
          let _this = this
          Object.keys(this.includeHeaders).forEach(function (h) {
            if (_this.includeHeaders[h]) {
              headers.push(h)
            } else {
              for (let r in rows) {
                delete rows[r][h]
              }
            }
          })
          this.$store.dispatch('CREATE_OUTLINE_LIST', {signature: headers, name: this.newOutlineListName, list: rows})
          this.createList = false
        }
      },
      showDetails: function () {
        eventBus.emit('details', this.scenario.scenario.internalID)
      },
      openResults: function (index) {
        let result = typeof index !== 'undefined' ? this.scenario.lastResult[index] : this.scenario.lastResult
        eventBus.emit('details', 'results', result)
      },
      removeScenario: function () {
        this.$store.dispatch('REMOVE_SCENARIO_FROM_QUEUE', this.scenario.scenario.internalID)
      },
      addRow: function () {
        let blankRow = {}
        let _this = this
        Object.keys(this.table.headers).forEach(function (key) {
          blankRow[_this.table.headers[key]] = ''
        })
        this.table.rows.push(blankRow)
        this.updateTable()
        this.$forceUpdate()
      },
      clearRows: function () {
        let blankRow = {}
        let _this = this
        Object.keys(this.table.headers).forEach(function (key) {
          blankRow[_this.table.headers[key]] = ''
        })
        this.table.rows = [blankRow]
        this.updateTable()
        this.$forceUpdate()
      },
      clearRow: function (index) {
        this.table.rows.splice(index, 1)
        this.updateTable()
        this.$forceUpdate()
      },
      updateTable: function () {
        this.rowsModified = true
        this.$store.commit('UPDATE_SCENARIO_IN_QUEUE', {
          internalID: this.scenario.scenario.internalID,
          table: this.table
        })
      },
      loadList: function () {
        let list = this.outlineLists[this.loadListName]
        let _this = this
        for (let i in list) {
          if (!this.table.rows[i]) {
            let blankRow = {}
            let _this = this
            Object.keys(this.table.headers).forEach(function (key) {
              blankRow[_this.table.headers[key]] = ''
            })
            this.table.rows.push(blankRow)
          }
          Object.keys(list[i]).forEach(function (column) {
            if (this.table.rows[i][column]) {
              _this.table.rows[i][column] = list[i][column]
            }
          })
        }
        this.table.rows.length = list.length // truncate
        this.updateTable()
        this.$forceUpdate()
        this.loadListName = ''
      }
    },
    computed: {
      table: function () {
        return this.scenario.table
      },
      stepStatus: function () {
        return this.scenario.lastResult.status
      },
      outlineListNames: function () {
        let lists = []
        if (this.outlineLists) {
          Object.keys(this.outlineLists).forEach(function (name) {
            lists.push(name)
          })
          return lists
        }
        return null
      },
      outlineLists: function () {
        let lists = {}
        let _this = this
        let oLists = this.$store.state.outline_lists
        Object.keys(oLists).forEach(function (signature) {
          let sig = signature.split('.')
          for (let s in sig) {
            if (_this.table.headers.includes(sig[s])) {
              Object.keys(oLists[signature]).forEach(function (listName) {
                lists[listName] = oLists[signature][listName]
              })
            }
          }
        })
        return lists
      }
    },
    mounted () {
      let _this = this
      eventBus.on('queue_updated', function () {
        _this.$forceUpdate()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .queue-item {
    margin-bottom: 10px;

    .header {
      position: relative;
      background-color: #2e383c;
      color: white;
      /*padding: 15px;*/
      border-radius: 10px;
      cursor: move;
      display: flex;
      align-items: center;
      overflow: hidden;

      .label {
        flex-grow: 1;
        padding: 15px;
      }

      .index {
        border-right: 1px solid #D2D6DB;
        /*padding: 10px;*/
        min-width: 50px;
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-content: center;
      }

      .display {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }

      .remove {
        flex-basis: 70px;
        flex-shrink: 0;
        border-left: 1px solid #D2D6DB;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        cursor: pointer;
        &:hover {
          background-color: #D2D6DB;
          color: #2e383c;
        }
      }

      .status {
        padding: 0 10px;

        .results {
          font-size: 18px;
          color: #6b7186;
          vertical-align: middle;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }

        .icon {
          display: inline-block;
          width: 50px;
          text-align: center;
        }

        i {
          &.fa-check {
            color: #42b983;
          }
          &.fa-times {
            color: #dd4444;
          }
          &.fa-question {
            color: darkorange;
          }
        }
      }

      &.locked {
        background-color: #eaeef3;
        color: #2e383c;
        border-radius: 0;
        margin-bottom: 0;
        border-bottom: 1px solid #D2D6DB;
        cursor: default;

        &:last-child {
          border-bottom: none;
        }
      }
    }

    &.locked {
      margin-bottom: 0;

      .header {
        background-color: #eaeef3;
        color: #2e383c;
        border-radius: 0;
        border-bottom: 1px solid #D2D6DB;
        cursor: default;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .outline-items {
      div.table {

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 18px;

          tr {
            background-color: #c5d9ee;

            &.outline-header {
              background-color: #2e383c;
              color: #eaeef3;
              th {
                font-weight: normal;
              }
            }
            border-bottom: 1px solid #6b7186;
          }

          th {
            padding: 0 10px;
            text-align: center;
            font-size: 20px;
            + th:not(:last-child) {
              border-left: 1px solid #D2D6DB;
            }
          }

          td {
            padding: 10px;
            + td:not(:last-child) {
              border-left: 1px solid #6b7186;
            }
            &:last-child {
              width: 1px;
              white-space: nowrap;
              padding: 0 10px;
              text-align: right;
              .spinner {
                display: inline-block;
              }
              .results {
                font-size: 16px;
                vertical-align: middle;
                &:hover {
                  cursor: pointer;
                  text-decoration: underline;
                }
              }
              i {
                margin-left: 10px;
                font-size: 24px;
                &.fa-check {
                  color: #42b983;
                }
                &.fa-times {
                  color: #dd4444;
                }
                &.fa-question {
                  color: darkorange;
                }
              }
            }
            &.outline-index {
              width: 1px;
            }
          }
        }
      }
    }

    .expand {
      background-color: #eaeef3;
      margin-top: -15px;
      padding: 20px 10px 10px;
      border-radius: 10px;
      border: 2px solid #93a1a1;
      display: flex;

      div.table {
        flex-grow: 1;

        .header-check {
          label {
            font-size: 16px;
            margin-left: 5px;
          }

          input {
            width: auto;
          }
        }

        input {
          /*background-color: transparent;*/
          font-size: 20px;
          width: 200px;
        }

        button {
          border: none;
          padding: 5px 15px;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          background-color: #6b7186;

          &.green {
            background-color: #42b983;
          }
          &.red {
            background-color: #dd4444;
          }
          &:hover {
            color: #2e383c;
          }
        }

        table {
          border-collapse: collapse;
          width: 100%;
          font-size: 22px;

          th {
            text-align: center;
          }

          th, td {
            padding: 0 10px;
            border-bottom: 1px solid #93a1a1;
            + th, + td {
              border-left: 1px solid #93a1a1;
            }

            &.delete-row {
              border-left: none;
              border-bottom: none;
              width: 15px;

              span {
                cursor: pointer;
                &:hover {
                  i {
                    color: #dd4444;
                  }
                }
              }
            }
          }

          input {
            border: none;
            background-color: transparent;
            width: 100%;
            height: 100%;
            margin: 5px 0 0;
          }
        }
      }
    }

  }
</style>
