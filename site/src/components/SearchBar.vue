<template>
  <div id="searchbar" ref="container">
    <input type="text" v-bind:value="value" ref="input" v-on:input="updateValue($event.target.value)"/>
  </div>
</template>

<script>
  var superplaceholder = require('node_modules/superplaceholder/dist/superplaceholder.min.js')

  import stepselector from './StepSelector'

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
      value: String,
      placeholders: Array
    },
    data () {
      return {
        search: '',
        loaded: false
      }
    },
    watch: {
      placeholders: function () {
        if (!this.loaded) {
          this.initSuperplaceholder()
        }
        this.loaded = true
      }
    },
    methods: {
      updateValue: function (value) {
        this.$emit('input', value)
      },
      initSuperplaceholder: function () {
        if (this.placeholders) {
          superplaceholder({
            el: this.$refs.input,
            sentences: this.placeholders,
            options: {
              startOnFocus: false,
              shuffle: true,
              loop: true
            }
          })
        }
      }
    },
    mounted () {
      this.initSuperplaceholder()
    }
  }
</script>

<style scoped>
  #searchbar {
    display: block;
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
