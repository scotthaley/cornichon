<template>
  <div class="queue-runner">
    <div class="tools">
      <button v-if="running" @click="stopQueue()" class="red">Stop</button>
      <button v-if="!running" @click="runScenarios()">Run Scenarios</button>
      <span v-if="locked">
        <a @click="editQueue()">Edit Queue</a>
      </span>
      <div class="list-tools">
        <span v-if="scenarios.length">
          <input v-if="saveList" v-model="saveListName" placeholder="List Name"/>
          <button @click="saveListClicked()" :class="{green: saveList}">Save Queue</button>
        </span>
        <select v-model="saveListName">
          <option disabled value="">Select a queue list to load...</option>
          <option v-for="(list, key) in queueLists" :value="key">{{ key }}</option>
        </select>
        <button v-if="saveListName !== ''" @click="loadQueue">Load Queue</button>
      </div>
    </div>

    <div class="queue-list" v-if="!locked">
      <draggable v-model="scenarios" :options="{handle: '.header'}">
        <queue-item v-for="s in scenarios" :scenario="s" :key="s.scenario.internalID"></queue-item>
      </draggable>
    </div>

    <div class="queue-list locked" v-if="locked">
      <queue-item v-for="(s, index) in scenarios" :scenario="s" :locked="true" :index="index"
                  :key="s.scenario.internalID"></queue-item>
    </div>
  </div>
</template>

<script>
  import queueItem from './QueueItem'
  import draggable from 'vuedraggable'

  const eventBus = require('@/eventBus')

  export default {
    name: 'queueRunner',
    components: {
      queueItem,
      draggable
    },
    data () {
      return {
        saveList: false,
        saveListName: '',
        parallelCount: 0
      }
    },
    methods: {
      loadQueue: function () {
        this.$store.dispatch('LOAD_QUEUE_LIST', this.saveListName)
      },
      saveListClicked: function () {
        if (!this.saveList) {
          this.saveList = true
        } else {
          this.saveList = false
          this.$store.dispatch('CREATE_QUEUE_LIST', this.saveListName)
        }
      },
      runScenariosParallel: function () {
        let _this = this
        let scenarios = this.scenarios
        let scenariosFinished = true

        if (this.parallelCount < this.parallelSlots) {
          for (let i = 0; i < scenarios.length; i++) {
            if (this.running) {
              if (scenarios[i].table) {
                for (let t = 0; t < scenarios[i].table.rows.length; t++) {
                  if (this.running && scenarios[i].lastResult[t].status === 'queued') {
                    scenarios[i].lastResult[t].status = 'running'
                    eventBus.emit('queue_updated')
                    this.$store.dispatch('RUN_SCENARIO', {
                      scenario: scenarios[i].scenario,
                      outlineRow: scenarios[i].table.rows[t],
                      outlineRowIndex: t
                    }).then(function () {
                      _this.parallelCount --
                      _this.runScenariosParallel()
                    })
                    this.parallelCount ++
                    if (this.parallelCount >= this.parallelSlots) {
                      return
                    }
                  } else if (scenarios[i].lastResult[t].status === 'running') {
                    scenariosFinished = false
                  }
                }
              } else {
                if (scenarios[i].lastResult.status === 'queued') {
                  scenarios[i].lastResult.status = 'running'
                  this.$store.dispatch('RUN_SCENARIO', {scenario: scenarios[i].scenario})
                    .then(function () {
                      _this.parallelCount --
                      _this.runScenariosParallel()
                    })
                  this.parallelCount ++
                  if (this.parallelCount >= this.parallelSlots) {
                    return
                  }
                } else if (scenarios[i].lastResult.status === 'running') {
                  scenariosFinished = false
                }
              }
            }
          }
          if (scenariosFinished) {
            this.stopQueue()
          }
        }
      },
      runScenarios: async function () {
        let scenarios = this.scenarios

        scenarios = scenarios.map(function (s) {
          if (s.table) {
            s.lastResult = s.lastResult.map(function (lr) {
              lr.status = 'queued'
              return lr
            })
          } else {
            s.lastResult.status = 'queued'
          }
          return s
        })
        this.scenarios = scenarios

        let scenariosToRun = []
        for (let i = 0; i < scenarios.length; i++) {
          if (scenarios[i].table) {
            for (let t = 0; t < scenarios[i].table.rows.length; t++) {
              let job = {
                scenario: scenarios[i].scenario,
                outlineRow: scenarios[i].table.rows[t],
                outlineRowIndex: t,
                scenarioID: `scenario-${i}-${t}`
              }
              scenariosToRun.push(job)
            }
          } else {
            let job = {
              scenario: scenarios[i].scenario,
              scenarioID: `scenario-${i}`
            }
            scenariosToRun.push(job)
          }
        }

        this.$store.dispatch('LOCK_QUEUE')
        this.$store.dispatch('QUEUE_STARTED', scenariosToRun).then(jobID => {
          for (let i = 0; i < scenariosToRun.length; i++) {
            scenariosToRun[i].jobID = jobID
            this.$store.dispatch('RUN_SCENARIO', scenariosToRun[i])
          }
        })
      },
      stopQueue: function () {
        this.$store.dispatch('QUEUE_STOPPED')
      },
      editQueue: function () {
        this.$store.dispatch('RELEASE_QUEUE')
      }
    },
    computed: {
      scenarios: {
        get () {
          return this.$store.state.scenario_queue
        },
        set (value) {
          this.$store.commit('UPDATE_SCENARIO_LIST', value)
        }
      },
      queueLists: function () {
        return this.$store.state.queue_lists
      },
      locked: function () {
        return this.$store.state.queue_locked
      },
      running: function () {
        return this.$store.state.queue_running
      },
      profileObject: function () {
        return this.$store.getters.currentProfileObject
      },
      parallelSlots: function () {
        return this.profileObject ? parseInt(this.profileObject.parallelCount.value) : null
      },
      isParallel: function () {
        return this.profileObject ? this.profileObject.parallel : false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .queue-runner {
    text-align: left;
    padding: 10px;

    .tools {
      button {
        padding: 10px;
        background-color: #42b983;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 24px;

        &:hover {
          cursor: pointer;
          color: #1d75b3;
        }

        &.red {
          background-color: #dd4444;
        }
      }

      a {
        font-size: 22px;
        text-decoration: underline;
        margin-left: 10px;
        cursor: pointer;
        color: #6b7186;

        &:hover {
          color: #2e383c;
        }
      }

      .list-tools {
        margin-top: 15px;

        button {
          font-size: 16px;
          padding: 5px 10px;
          background-color: #6b7186;
          &:hover {
            color: #93a1a1;
          }
          &.green {
            background-color: #42b983;
            &:hover {
              color: #1d75b3;
            }
          }
        }
      }
    }

    .queue-list {
      margin-top: 50px;
    }
  }
</style>
