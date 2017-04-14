<template>
  <div class="settings">
    <h3>User Settings</h3>
    <div v-for="(values, key) in settings.user">
      <span class="key">{{key}}</span> 
      <select v-model="values[0]">
        <option v-for="value in values" class="value">{{value}}</option>
      </select>
    </div>
  </div>
</template>

<script>

var data = {
  'user': {
    'Font-size': ['12', '14', '16'],
    'theme': ['solarized', 'mono blue', 'frankenstein']
  }
}

export default {
  name: 'settings',
  data () {
    return {
      settings: {}
    }
  },
  mounted () {
    this.settings = data
  }
}

</script>
