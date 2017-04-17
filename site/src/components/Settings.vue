<template>
  <div class="settings">
    <h3>User Settings</h3>
    <div v-for="(values, key) in options.dropdowns">
      <span class="key">{{key}}</span>
      <select v-model="settings.custom[key]">
        <option v-for="value in values" class="value">{{value}}</option>
      </select>
    </div>
    <div>
      <h4>Setup Command</h4>
      <codemirror v-model="settings.custom['Setup Command']" :options="{ hideButtons: true }"></codemirror>
    </div>
    <button @click="save">Save</button>
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
      options: {
        'dropdowns': {
          'Font-size': ['12', '14', '16'],
          'Code Style': ['material', 'solarized', 'neo']
        }
      }
    }
  },
  computed: {
    settings: function () {
      return this.$store.state.settings
    }
  },
  methods: {
    save: function () {
      this.$store.dispatch('SETTINGS', this.settings)
    }
  }
}

</script>
