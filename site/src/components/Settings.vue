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
    <div class="card environment">
      <div class="header">
        <span>Environment Profile</span>
        <span v-if="profiles.length">
          <span>:</span>
          <select v-model="edittingProfile">
            <option value="" disabled>Select a Profile</option>
            <option v-for="(value, key) in settings.custom.Profiles" :value="key">{{ key }}</option>
          </select>
        </span>
      </div>
      <div class="footer">
        <div>
          <!-- <input type="text" id="new-conf-name" class="large" placeholder="New Configuration"><br> -->
          <div class="tools">
            <input v-if="newProfile" v-model="newProfileName" placeholder="Profile Name"/>
            <button class="green" @click="newProfileClicked()">New Profile</button>
          </div>

          <div v-if="edittingProfile !== ''">
            <table>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
              <tr v-for="envVar in currentProfile.envVars">
                <td>{{envVar.name}}</td>
                <td>{{envVar.value}}<i class="fa fa-times icon" @click="deleteEnvVar(envVar.name)"></i></td>
              </tr>
              <tr>
                <td><input type="text" class="large" v-model="envVar.name"></td>
                <td><input type="text" class="large" v-model="envVar.value"></td>
              </tr>
            </table>

            <div class="buttons">
              <button @click="addEnvVar">Add variable</button>
            </div>

          </div>
        </div>
        <div>
          <div v-for="(value, key) in environmentSettings" class="profile-setting">
            <div v-if="typeof value === 'boolean'">
              <span>{{ key }}: </span>
              <input type="checkbox" v-model="environmentSettings[key]" @change="environmentSettingChanged()"/>
            </div>
            <div v-if="typeof value === 'object' && shouldShowSetting(value)">
              <span>{{ key }}: </span>
              <input v-if="typeof value.value === 'boolean'" type="checkbox" v-model="environmentSettings[key]" @change="environmentSettingChanged()"/>
              <input v-if="value.type === 'text'" type="text" v-model="environmentSettings[key].value" @change="environmentSettingChanged()"/>
              <input v-if="value.type === 'number'" type="number" v-model="environmentSettings[key].value" @change="environmentSettingChanged()"/>
            </div>
          </div>
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
        edittingProfile: '',
        newProfileName: '',
        newProfile: false,
        editableConfiguration: null,
        settings: this.$store.state.settings,
        test: 'hello'
      }
    },
    computed: {
      currentProfile: {
        get () {
          if (this.edittingProfile !== '') {
            return this.settings.custom.Profiles[this.edittingProfile]
          }
          return null
        },
        set (value) {
          this.settings.custom.Profiles[this.edittingProfile] = value
        }
      },
      profiles: function () {
        return this.$store.getters.profiles
      },
      environmentSettings: {
        get () {
          if (this.currentProfile) {
            let list = Object.assign({}, this.currentProfile)
            delete list.envVars
            return list
          }
          return null
        }
      }
    },
    methods: {
      environmentSettingChanged: function () {
        this.$forceUpdate()
        this.currentProfile = Object.assign(this.currentProfile, this.environmentSettings)
      },
      save: function () {
        this.$store.dispatch('SETTINGS', this.settings)
      },
      newProfileClicked: function () {
        if (!this.newProfile) {
          this.newProfile = true
        } else {
          this.settings.custom.Profiles[this.newProfileName] = {
            envVars: [],
            parallel: false,
            parallelCount: {
              dependency: 'parallel',
              value: '5',
              type: 'number'
            }
          }
          this.edittingProfile = this.newProfileName
          this.newProfile = false
        }
      },
      addEnvVar: function () {
        this.settings.custom.Profiles[this.edittingProfile].envVars.push(this.envVar)
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
      },
      shouldShowSetting: function (setting) {
        if (!setting.dependency) {
          return true
        } else {
          return this.environmentSettings[setting.dependency]
        }
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

  .environment {
    select {
      border: none;
      background-color: transparent;
      font-size: 18px;
      cursor: pointer;
    }

    .tools {
      margin-bottom: 15px;
      button {
        border: none;
        background-color: #6b7186;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          color: #93a1a1;
        }

        &.green {
          background-color: #42b983;
          &:hover {
            color: #1d75b3;
          }
        }

      }
    }

    .profile-setting {
      margin-top: 15px;
      input {
        width: 50px;
        &[type=checkbox] {
        width: 25px;
      }
      }
    }
  }


</style>
