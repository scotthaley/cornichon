<template>
  <div class="settings">
    <h3>User Settings</h3>
    <div v-for="(values, key) in settings.dropdowns">
      <span class="key">{{key}}</span>
      <select v-model="values[0]">
        <option v-for="value in values" class="value">{{value}}</option>
      </select>
    </div>
    <div>
      <h4>Setup Command</h4>
      <codemirror v-bind:value="settings.custom['Setup Command']" :options="{ hideButtons: true }"></codemirror>
    </div>
  </div>
</template>

<script>
import codemirror from './CodeMirror'

export default {
  name: 'settings',
  components: {
    codemirror
  },
  data () {
    return {
      settings: {
        'dropdowns': {
          'Font-size': ['12', '14', '16'],
          'theme': ['solarized', 'mono blue', 'frankenstein']
        },
        'custom': {
          'Setup Command': ''
        }
      }
    }
  }
}

</script>
