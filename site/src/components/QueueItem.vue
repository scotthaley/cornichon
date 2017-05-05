<template>
  <div class="queue-item" :class="{locked}">
    <span v-if="typeof index !== 'undefined'" class="index">{{ index }}.</span>
    <span @click="showDetails()" class="display">{{ scenario.scenario.name }}</span>
    <div v-if="locked" class="status">
      <span v-if="scenario.lastResult.status !== 'running' && scenario.lastResult.status !== 'queued'" class="results" @click="openResults()">View Results</span>
      <span class="icon">
        <spinner v-if="scenario.lastResult.status === 'running'"></spinner>
        <span v-if="scenario.lastResult.status === 'passed'"><i class="fa fa-check"></i></span>
        <span v-if="scenario.lastResult.status === 'failed'"><i class="fa fa-times"></i></span>
        <span v-if="scenario.lastResult.status === 'undefined'"><i class="fa fa-question"></i></span>
      </span>
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
      openResults: function () {
        eventBus.emit('details', 'results', this.scenario.lastResult)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .queue-item {
    background-color: #2e383c;
    color: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;

    .index {
      border-right: 1px solid #D2D6DB;
      padding-right: 10px;
    }

    .display {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .status {
      display: inline-block;
      float: right;

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

      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
