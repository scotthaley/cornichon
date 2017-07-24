<template>
  <div class="topbar">
    <div class="logo">Cornichon</div>
    <div class="links">
      <router-link v-for="link in links" :key="link.display"
                   :to="`/${link.display.replace(' ', '-')}`"
                   class="link">{{link.display}}
      </router-link>
    </div>
    <div class="settings">
      <md-icon id="settings" @click.native="openDialog('settings-dialog')">settings</md-icon>
    </div>

    <md-dialog md-open-from="#settings" md-close-to="#settings" ref="settings-dialog">
      <md-dialog-title>Settings</md-dialog-title>
      <md-dialog-content>
        <div class="settings-panel">
          <div class="list">
            <md-list>
              <md-list-item :class="{active: selectedSettingsGroup === 'Profiles'}"
                            @click="selectedSettingsGroup = 'Profiles'"><span>Profiles</span></md-list-item>
              <md-divider></md-divider>
              <md-list-item :class="{active: selectedSettingsGroup === 'Setup'}"
                            @click="selectedSettingsGroup = 'Setup'"><span>Setup</span></md-list-item>
            </md-list>
          </div>
          <div class="content">
            <template v-if="selectedSettingsGroup === 'Profiles'">
              <div class="profiles-header">
                <div class="profiles-select">
                  <md-input-container>
                    <label for="profile-select">Select Profile</label>
                    <md-select name="profile-select" v-model="selectedProfileID">
                      <md-option v-for="(value, key) in profiles" :key="key" :value="key">{{value.name}}</md-option>
                    </md-select>
                  </md-input-container>
                </div>
                <div>
                  <md-button class="md-primary" @click="newProfile()">New Profile</md-button>
                </div>
              </div>
              <div v-if="selectedProfileID">
                <md-input-container>
                  <label>Profile Name</label>
                  <md-input v-model="profileSettings.name"></md-input>
                </md-input-container>
                <div class="env-editor">
                  <div class="env-row">
                    <md-input-container>
                      <label>Env Variable</label>
                      <md-input v-model="newEnvVariable"></md-input>
                    </md-input-container>
                    <md-input-container>
                      <label>Value</label>
                      <md-input v-model="newEnvValue"></md-input>
                    </md-input-container>
                    <div class="add">
                      <md-icon @click.native="addEnvVariable()">add</md-icon>
                    </div>
                  </div>
                  <template v-if="profileSettings.env.length" v-for="(env, index) in profileSettings.env">
                    <div class="env-row added">
                      <div>{{env.name}}</div>
                      <div>{{env.value}}</div>
                      <md-icon class="clear" @click.native="removeEnvVariable(index)">clear</md-icon>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  const _ = require('underscore')

  export default {
    name: 'topbar',
    data () {
      return {
        links: [
          {display: 'Home'},
          {display: 'History'},
          {display: 'Scenario Lists'},
          {display: 'Scenarios'},
          {display: 'Steps'},
          {display: 'Features'}
        ],
        selectedSettingsGroup: 'Profiles',
        selectedProfileID: null,
        newEnvVariable: '',
        newEnvValue: '',
        profileSettings: {
          name: '',
          env: []
        }
      }
    },
    methods: {
      openDialog (ref) {
        this.$refs[ref].open()
      },
      closeDialog (ref) {
        this.$refs[ref].close()
      },
      newProfile () {
        this.$store.dispatch('new_profile').then(newID => {
          this.selectedProfileID = newID
        })
      },
      addEnvVariable () {
        this.profileSettings.env.push({
          name: this.newEnvVariable,
          value: this.newEnvValue
        })
        this.newEnvVariable = ''
        this.newEnvValue = ''
      },
      removeEnvVariable (index) {
        this.profileSettings.env.splice(index, 1)
      }
    },
    watch: {
      selectedProfileID: function (newID) {
        let profile = this.$store.state.settings.Profiles[newID]
        this.profileSettings.name = profile.name
        this.profileSettings.env = profile.env || []
      },
      profileSettings: {
        handler: _.debounce(function (newSettings) {
          this.$store.dispatch('update_profile', {
            id: this.selectedProfileID,
            settings: JSON.parse(JSON.stringify(newSettings)) // Weird stuff happens if we don't do the deep copy
          })
        }, 500),
        deep: true
      }
    },
    computed: {
      profiles: function () {
        return this.$store.state.settings.Profiles
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../mixins/long-shadow';

  .topbar {
    background-color: #2c3e50;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .logo {
    flex-grow: 0;
    display: inline-block;
    margin-left: 10px;
    margin-right: 100px;
    color: white;
    font-family: 'Pacifico', cursive;
    font-weight: normal;
    font-size: 30px;
    line-height: 40px;
    user-select: none;
    cursor: default;
    @include long-shadow(#161d21, 70, right, 3, 0);
  }

  .links {
    flex-grow: 1;
    display: inline-block;
  }

  .link {
    color: white;
    margin: 5px 10px;
    text-decoration: none;

    &.router-link-active {
      text-decoration: underline;
    }
  }

  .settings {
    padding-right: 15px;
    color: white;
    cursor: pointer;
  }

  .settings-panel {
    display: flex;
    width: 600px;

    .content {
      padding: 0 15px;

      .profiles-header {
        display: flex;
        align-items: center;

        .profiles-select {
          flex-grow: 1;
        }
      }

      .env-editor {
        .env-row {
          display: flex;
          align-items: center;

          &.added {
            /*justify-content: space-between;*/
            div {
              flex-grow: 1;
            }

            .clear {
              color: #dc322f;
              cursor: pointer;
            }

            &:hover {
              background-color: #f3f3fb;
            }
          }

          .add {
            color: #2aa198;
            cursor: pointer;

            &:hover {
              color: #1d75b3;
            }
          }
        }
      }
    }

    .list {
      flex-basis: 30%;
      border-right: 1px solid #C1C1C9;

      .md-list-item.active {
        background-color: #2e383c;
        color: white;
      }
    }
  }
</style>
