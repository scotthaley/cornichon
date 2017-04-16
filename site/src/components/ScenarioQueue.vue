<template>
  <div class="scenario-queue" v-if="scenarios.length">
    <span class="tab">Scenario Queue</span>
  </div>
</template>

<script>

export default {
  name: 'Scenario Queue',
  computed: {
    scenarios () {
      return this.$store.state.scenarios
    }
  }
}

</script>

<style lang="scss">
.scenario-queue {
  span.tab {
    background: #2c3e50;
    color: #fff;
    padding:10px;
    border-radius: 5px;
    text-transform: uppercase;
    font-weight:600;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
