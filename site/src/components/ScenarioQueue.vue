<template>
  <div id="scenario-queue" :class="{expanded: scenarios.length && queueOpen, minimized: scenarios.length && !queueOpen}">
    <div class="wrapper">
      <div class="header">
        <span @click="openClose()" class="icon">
          <i class="fa fa-times icon" v-if="queueOpen"></i>
          <i class="fa fa-plus-circle icon" v-if="!queueOpen"></i>
        </span>
        <span class="title" @click="runScenarios()">
          Start
          <i class="fa fa-play-circle-o"></i>
        </span>
      </div>
      <p class="scenario" v-for="scenario in scenarios">
        {{scenario}}
      </p>
    </div>
  </div>
</template>

<script>
// const $ = require('jquery')
const app = require('../store/app')

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
      for (let i = 0; i <= scenarios.length; i++) {
        await app.post('runScenario', scenarios[i]).then(function (res) {
          console.log(res)
        })
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
  width: 0;
  overflow: hidden;
  background: #eaeef3;
  font-size: 1rem;
  opacity: 0;
  transition: width .33s ease-in-out, opacity .33s ease-in-out;
  .title {
    cursor: pointer;
    align-self: flex-end;
  }
  .title, .scenario {
    opacity:1;
    visibility: visible;
    transition: opacity .5s ease-in-out;
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
    }
  }
  .header {
    display: flex;
    font-size: 2em;
    position: relative;
    height: 70px;
    justify-content: center;
    .icon {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.5rem;
    }
  }
  .scenario {
    border-bottom: 1px solid #000;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
  }
}

</style>
