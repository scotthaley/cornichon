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
        <button class="new" @click="addRow()">New Row</button>
        <button class="clear" @click="clearRows()">Clear Rows</button>
      </div>
    </div>
    <div v-if="scenario.table && locked" class="outline-items">
      <!--<div class="outline-item" v-for="(row, rowIndex) in table.rows">-->
      <!--<div v-if="typeof index !== 'undefined'" class="index"><span>{{ index + 1 }}.{{ rowIndex + 1}}</span></div>-->
      <!--</div>-->
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
              <spinner v-if="scenario.lastResult[rowIndex].status === 'running'" size="small"></spinner>
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
    methods: {
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
        Object.keys(this.table.headers).forEach(function (key) {
          blankRow[key] = ''
        })
        this.table.rows.push(blankRow)
        this.updateTable()
        this.$forceUpdate()
      },
      clearRows: function () {
        let blankRow = {}
        Object.keys(this.table.headers).forEach(function (key) {
          blankRow[key] = ''
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
        this.$store.commit('UPDATE_SCENARIO_IN_QUEUE', {
          internalID: this.scenario.scenario.internalID,
          table: this.table
        })
      }
    },
    computed: {
      table: function () {
        return this.scenario.table
      },
      stepStatus: function () {
        return this.scenario.lastResult.status
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
          font-size: 20px;

          tr {
            background-color: #eaeef3;

            &.outline-header {
              background-color: #2e383c;
              color: #eaeef3;
              th {
                font-weight: normal;
              }
            }
            border-bottom: 1px solid #D2D6DB;
          }

          th {
            padding: 0 10px;
            text-align: center;
            + th:not(:last-child) {
              border-left: 1px solid #D2D6DB;
            }
          }

          td {
            padding: 10px;
            + td:not(:last-child) {
              border-left: 1px solid #D2D6DB;
            }
            &:last-child {
              width: 1px;
              white-space: nowrap;
              padding: 0 10px;
              .results {
                font-size: 16px;
                color: #6b7186;
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

        button {
          border: none;
          padding: 5px 15px;
          border-radius: 5px;
          color: white;
          cursor: pointer;

          &.new {
            background-color: #42b983;
          }
          &.clear {
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
          }
        }
      }
    }

  }
</style>
