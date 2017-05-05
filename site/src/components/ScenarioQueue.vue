<template>
  <div id="scenario-queue"
       :class="{expanded: scenarios.length && queueOpen, minimized: scenarios.length && !queueOpen}">
    <div class="wrapper">
      <div class="header">
        <span @click="openClose()" class="icon">
          <i class="fa fa-times icon" v-if="queueOpen"></i>
          <i class="fa fa-plus-circle icon" v-if="!queueOpen"></i>
        </span>
        <span class="title button" @click="openQueueRunner()">
          Open Queue
          <i class="fa fa-folder-open-o play"></i>
        </span>
      </div>
      <p class="scenario" v-for="scenario in scenarios">
        <span @click="openResults(scenario.lastResult)">{{scenario.scenario.name}}</span>
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
    openQueueRunner: function () {
      this.$store.dispatch('CHANGE_PAGE', 'Queue')
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
    overflow-y: auto;
    overflow-x: hidden;
    position: fixed;
    top:0;
    right:0;
  }
  &.expanded {
    width: 320px;
    opacity:1;
    .wrapper {
      width: 305px;
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
      border-bottom: 1px solid #000;
      text-align: left;
      cursor: pointer;
      span {
        width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
      }
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
