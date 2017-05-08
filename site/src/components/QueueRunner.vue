<template>
  <div class="queue-runner">
    <div class="tools">
      <button v-if="running" @click="stopQueue()" class="red">Stop</button>
      <button v-if="!running" @click="runScenarios()">Run Scenarios</button>
      <span v-if="locked">
        <a @click="editQueue()">Edit Queue</a>
      </span>
    </div>

    <div class="queue-list" v-if="!locked">
      <draggable v-model="scenarios">
        <queue-item v-for="s in scenarios" :scenario="s" :key="s.scenario.internalID"></queue-item>
      </draggable>
    </div>

    <div class="queue-list locked" v-if="locked">
      <queue-item v-for="(s, index) in scenarios" :scenario="s" :locked="true" :index="index" :key="s.scenario.internalID"></queue-item>
    </div>
  </div>
</template>

<script>
  import queueItem from './QueueItem'
  import draggable from 'vuedraggable'

  export default {
    name: 'queueRunner',
    components: {
      queueItem,
      draggable
    },
    methods: {
      runScenarios: async function () {
        this.$store.dispatch('LOCK_QUEUE')
        this.$store.dispatch('QUEUE_STARTED')

        let scenarios = this.scenarios

        scenarios = scenarios.map(function (s) {
          s.lastResult.status = 'queued'
          return s
        })
        for (let i = 0; i < scenarios.length; i++) {
          if (this.running) {
            scenarios[i].lastResult.status = 'running'
            await this.$store.dispatch('RUN_SCENARIO', scenarios[i].scenario)
          }
        }
        this.stopQueue()
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
      locked: function () {
        return this.$store.state.queue_locked
      },
      running: function () {
        return this.$store.state.queue_running
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
    }

    .queue-list {
      margin-top: 50px;
    }
  }
</style>
