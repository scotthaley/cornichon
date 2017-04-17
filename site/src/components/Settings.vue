<template>
  <div class="settings">
    <h1>Settings</h1>
    <hr>
    <div v-for="(values, key) in options.dropdowns">
      <div class="key name">{{key}}</div>
      <select v-model="settings.custom[key]">
        <option v-for="value in values" class="value">{{value}}</option>
      </select>
    </div>
    <div>
      <div class="name">Setup Command</div>
      <codemirror v-model="settings.custom['Setup Command']" :options="{ hideButtons: true }"></codemirror>
    </div>
    <div class="buttons">
      <button @click="save">Save</button>
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
      options: {
        'dropdowns': {
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

<style lang="scss" scoped>
  .settings {
    text-align: left;
    font-size: 18px;

    .name {
      margin-top: 15px;
      margin-bottom: 5px;
    }

    h1 {
      font-size: 24px;
      margin-top: 15px;
      margin-bottom: 0;
    }

    hr {
      margin-top: 5px;
    }

    select {
      width: 100%;
      font-size: 20px;
    }
  }


</style>
