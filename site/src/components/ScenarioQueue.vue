<template>
  <div id="scenario-queue" :class="{expanded: scenarios.length}" >
    <span class="header">Queue</span>
    <p class="scenario" v-for="scenario in scenarios">
      {{scenario}}
      <i @click="runScenario(scenario)" class="fa fa-play-circle play"></i>
    </p>
  </div>
</template>

<script>
const $ = require('jquery')

export default {
  name: 'ScenarioQueue',
  computed: {
    scenarios () {
      return this.$store.state.scenario_queue
    }
  },
  methods: {
    runScenario: function (internalID) {
      $.post('http://localhost:8088/runScenario', {internalID}, null, 'json')
    }
  }
}

</script>

<style lang="scss">
#scenario-queue {
  background-color: #263238;
  width: 0;
  background: #eaeef3;
  font-size: 1rem;
  opacity: 0;
  transition: width .33s ease-in-out, opacity .25s ease-in-out;
  &.expanded {
    padding: .25em .5em;
    width: 200px;
    opacity:1;
  }
  .header {
    display: block;
    font-size: 2em;
  }
  .scenario {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #000;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
  }
}

</style>
