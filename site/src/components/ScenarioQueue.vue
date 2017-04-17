<template>
  <div id="scenario-queue" :class="{expanded: scenarios.length && queueOpen, minimized: scenarios.length && !queueOpen}">
    <div class="wrapper">
      <div class="header">
        <span @click="openClose()" class="icon">
          <i class="fa fa-times icon" v-if="queueOpen"></i>
          <i class="fa fa-plus-circle icon" v-if="!queueOpen"></i>
        </span>
        <span class="title button" @click="runScenarios()">
          Start
          <i class="fa fa-play play"></i>
        </span>
      </div>
      <p class="scenario" v-for="scenario in scenarios">
        {{scenario.scenario}}
        <i v-if="scenario.lastResult.status === 'passed'" class="success fa fa-check-circle"></i>
        <i v-if="scenario.lastResult.status === 'running'" class="running fa fa-ellipsis-h"></i>
        <i v-if="scenario.lastResult.status !== 'passed' && scenario.lastResult.status !== 'queued' && scenario.lastResult.status !== 'running'" class="error fa fa-times-circle"></i>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ScenarioQueue',
  data () {
    return {
      queueOpen: true
    }
  },
  computed: {
    scenarios () {
      return this.$store.state.scenario_queue
    }
  },
  methods: {
    runScenarios: async function () {
      var scenarios = this.scenarios

      scenarios = scenarios.map(function (s) {
        s.lastResult.status = 'queued'
        return s
      })
      for (let i = 0; i < scenarios.length; i++) {
        scenarios[i].lastResult.status = 'running'
        await this.$store.dispatch('RUN_SCENARIO', scenarios[i].scenario)
      }
    },
    openClose: function () {
      this.queueOpen = !this.queueOpen
    }
  }
}

</script>

<style lang="scss">
#scenario-queue {
  background-color: #263238;
  overflow: hidden;
  background: #eaeef3;
  font-size: 1rem;
  width: 0;
  opacity: 0;
  transition: width .33s ease-in-out, opacity .33s ease-in-out;
  .title {
    cursor: pointer;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    font-size: .8em;
    background: #263238;
    padding: .15em .75em;
    color:#eaeef3;
    .play {
      font-size: .65em;
      margin-left: .65em;
    }
  }
  .title, .scenario {
    opacity:1;
    visibility: visible;
    transition: opacity 1s ease;
  }
  .wrapper {
    width:0;
    padding: .5em;
    height: 95vh;
    overflow-y: scroll;
    position: fixed;
    top:0;
    right:0;
  }
  &.expanded {
    width: 220px;
    opacity:1;
    .wrapper {
      width: 205px;
    }
  }
  &.minimized {
    width: 37px;
    opacity: 1;
    .wrapper {
      width:35px;
    }
    .title, .scenario {
      opacity: 0;
      visibility: hidden;
      // transition: opacity .5s ease-in-out;
    }
  }
  .header {
    display: flex;
    font-size: 2em;
    position: relative;
    height: 75px;
    justify-content: center;
    .icon {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.25rem;
    }
  }
  .scenario {
    border-bottom: 2px solid #000;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    i {
      float: right;
      &.success {
        color: green;
      }
      &.error {
        color: red;
      }
    }
  }
}

</style>
