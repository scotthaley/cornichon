<template>
  <div class="settings">
    <h1>Settings</h1>
    <div v-for="(values, key) in options.dropdowns" class="card">
      <div class="key header">{{key}}</div>
      <div class="footer">
        <select v-model="settings.custom[key]" class="large">
          <option v-for="value in values" class="value">{{value}}</option>
        </select>
      </div>
    </div>
    <div class="card">
      <div class="header">Environment Variables</div>
      <div class="footer">
        <div>
          <!-- <input type="text" id="new-conf-name" class="large" placeholder="New Configuration"><br> -->

          <div>
            <table>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Value
                </th>
              </tr>
              <tr v-for="envVar in settings.custom['envVars']">
                <td>
                  {{envVar.name}}
                </td>
                <td>
                  {{envVar.value}}
                  <i class="fa fa-times icon" @click="deleteEnvVar(envVar.name)"></i>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="text"class="large" v-model="envVar.name">
                </td>
                <td>
                  <input type="text"class="large" v-model="envVar.value">
                </td>
              </tr>
            </table>

            <div class="buttons">
              <button @click="addEnvVar">Add variable</button>
            </div>

          </div>
        </div>
        <div class="configuration" v-for="conf in settings.custom.configurations">
          {{configurations.name}}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="header">Setup Command</div>
      <div class="footer">
        <codemirror v-model="settings.custom['Setup Command']" :options="{ hideButtons: true }"></codemirror>
      </div>
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
      },
      envVar: {
        name: '',
        value: ''
      },
      editableConfiguration: null
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
    },
    addEnvVar: function () {
      this.settings.custom.envVars = this.settings.custom.envVars || []
      this.settings.custom.envVars.push(this.envVar)
      this.envVar = {
        name: '',
        value: ''
      }
      this.save()
    },
    deleteEnvVar: function (name) {
      for (let i in this.settings.custom.envVars) {
        let e = this.settings.custom.envVars[i]
        if (e.name === name) {
          delete this.settings.custom.envVars[i]
        }
      }
      this.save()
    }
  }
}

</script>

<style lang="scss" scoped>
  .settings {
    text-align: left;
    font-size: 18px;

    h1 {
      font-size: 24px;
      margin-top: 15px;
      margin-bottom: -15px;
    }

    hr {
      margin-top: 5px;
    }

    .large {
      width: 100%;
      font-size: 20px;
    }

    table {
      border-collapse: collapse;
      width: 100%; 
      th {
        width: 50%;
      }

      td {
        position: relative;
        i {
          position: absolute;
          right: 10px;
          cursor: pointer;
        }
      }
    }

    #new-conf-name {
      margin-bottom: 10px;
    }

    .env-var-add {
      text-align: center;
      cursor: pointer;
    }

    .card {
      box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);
      margin: 10px auto;
      margin-top: 30px;

      .header {
        padding: 10px;
        background-color: #eaeef3;
        position: relative;

        i {
          color: #999;
          position: absolute;
          top: 50%;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          right: 20px;
          cursor: pointer;
        }
      }

      .footer {
        padding: 15px;
      }
    }
  }


</style>
