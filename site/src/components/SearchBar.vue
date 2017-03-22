<template>
  <div id="searchbar">
    <table>
      <tr>
        <td><stepselector></stepselector></td>
        <td class="input-cell"><input type="text" v-bind:value="value" ref="input" v-on:input="updateValue($event.target.value)"/></td>
      </tr>
    </table>
  </div>
</template>

<script>
var superplaceholder = require('node_modules/superplaceholder/dist/superplaceholder.min.js')

import stepselector from './stepselector'

export default {
  name: 'searchbar',
  components: {
    stepselector
  },
  props: {
    stepType: {
      type: String,
      default: 'Any'
    },
    value: String
  },
  data () {
    return {
      search: ''
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  },
  mounted () {
    superplaceholder({
      el: this.$refs.input,
      sentences: [
        'Given I am logged in...',
        'When I proceed to billing...',
        'Then I should see a confirmation page...'
      ],
      options: {
        startOnFocus: false,
        shuffle: true,
        loop: true
      }
    })
  }
}
</script>

<style scoped>
#searchbar {
  display: block;
  margin: 0 15px;
  border-bottom: 3px solid #E6E6E6;
}

table {
  width: 100%;
}

.input-cell {
  width: 100%;
}

input {
  position: relative;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 5px;
  font-size: 32px;
  border: none;
  outline: none;
}
</style>
