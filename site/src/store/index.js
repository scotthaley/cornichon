import Vue from 'vue'
import Vuex from 'vuex'
import { app } from '../store/app'

const eventBus = require('@/eventBus')

Vue.use(Vuex)

app.socket.on('refresh', function () {
  store.dispatch('FETCH', 'tags')
  store.dispatch('FETCH', 'supportcode')
  store.dispatch('FETCH', 'features')
  store.dispatch('FETCH', 'scenarios')
  store.dispatch('FETCH', 'settings')
})

const findScenarioID = (state, scenario) => {
  for (let i in state.scenarios) {
    let s = state.scenarios[i]
    if (s.keyword !== scenario.keyword) {
      continue
    }
    if (s.name !== scenario.name) {
      continue
    }
    if (s.description !== scenario.description) {
      continue
    }
    if (s.uri !== scenario.uri) {
      continue
    }
    return s.internalID
  }
}

const store = new Vuex.Store({
  state: {
    currentPage: 'Steps',
    settings: {},
    tags: [],
    scenario_queue: [],
    queue_locked: false,
    queue_running: false,
    outline_lists: {},
    queue_lists: {},
    scenarios: [],
    features: [],
    supportcode: [],
    placeholders: {
      supportcode: [],
      features: [],
      scenarios: []
    },
    open_cards: [],
    currentProfile: ''
  },
  getters: {
    profiles: function (state) {
      if (state.settings.custom) {
        console.log(state.settings.custom)
        let list = []
        Object.keys(state.settings.custom.Profiles).forEach(function (key) {
          list.push(key)
        })
        return list
      }
      return null
    },
    currentProfileObject: function (state) {
      if (state.currentProfile !== '') {
        return state.settings.custom.Profiles[state.currentProfile]
      }
    }
  },
  mutations: {
    SET (state, {name, res}) {
      state[name] = res
      if (name in state.placeholders) {
        for (let i in res) {
          let obj = res[i]
          state.placeholders[name].push(`${obj.fullName || obj.name}...`)
        }
      }
    },
    ADD_SCENARIO (state, scenario) {
      if (scenario.scenario.keyword === 'Scenario Outline') {
        let headers = []
        let rows = []
        let lastResult = []
        Object.keys(scenario.scenario.table).forEach(function (key) {
          headers.push(key)
          let column = scenario.scenario.table[key]
          for (let i in column) {
            while (!rows[i]) {
              rows.push({})
              lastResult.push({status: 'queued'})
            }
            rows[i][key] = column[i]
          }
        })
        scenario.table = {headers, rows}
        scenario.lastResult = lastResult
      }
      state.scenario_queue.push(scenario)
    },
    REMOVE_SCENARIO (state, internalID) {
      let i = 0
      for (i; i < state.scenario_queue.length; i++) {
        if (state.scenario_queue[i].scenario.internalID === internalID) {
          break
        }
      }
      state.scenario_queue.splice(i, 1)
    },
    UPDATE_SCENARIO_IN_QUEUE (state, data) {
      for (let i in state.scenario_queue) {
        let s = state.scenario_queue[i]
        if (s.scenario.internalID === data.internalID) {
          if (data.res) {
            if (data.outlineRow) {
              s.lastResult[data.outlineRowIndex] = data.res
            } else {
              s.lastResult = data.res
            }
          }
          if (data.table) {
            s.table = data.table
            for (let i = 0; i < data.table.rows.length; i++) {
              if (!s.lastResult[i]) {
                s.lastResult[i] = {status: 'queued'}
              }
            }
            s.lastResult.length = data.table.rows.length // truncate lastResult records without corresponding data row
          }
        }
      }
      eventBus.emit('queue_updated')
    },
    UPDATE_SCENARIO_LIST (state, scenarios) {
      state.scenario_queue = scenarios
    },
    UPDATE_QUEUE_LOCKED  (state, locked) {
      state.queue_locked = locked
    },
    UPDATE_QUEUE_RUNNING (state, running) {
      state.queue_running = running
    },
    UPDATE_SETTINGS (state, settings) {
      state.settings = settings
    },
    UPDATE_OPEN_CARD (state, data) {
      if (data.open) {
        if (!state.open_cards.includes(data.id)) {
          state.open_cards.push(data.id)
        }
      } else {
        let i = state.open_cards.indexOf(data.id)
        if (i >= 0) {
          state.open_cards.splice(i, 1)
        }
      }
    },
    UPDATE_PAGE (state, page) {
      state.currentPage = page
    },
    UPDATE_OUTLINE_LISTS (state, data) {
      state.outline_lists = data
    },
    UPDATE_QUEUE_LISTS (state, data) {
      state.queue_lists = data
    },
    SET_SCENARIO_QUEUE (state, list) {
      let toRemove = []
      for (let i in list) {
        list[i].scenario.internalID = findScenarioID(state, list[i].scenario)
        if (!list[i].scenario.internalID) {
          toRemove.push(i)
        }
      }
      for (let i in toRemove) {
        list.splice(toRemove[i], 1)
      }
      state.scenario_queue = list
    },
    UPDATE_CURRENT_PROFILE (state, profile) {
      state.currentProfile = profile
    }
  },
  actions: {
    FETCH (context, request) {
      let data = request.data || request
      let name = request.name || request
      app.fetch(data)
        .then(function (res) {
          store.commit('SET', {name, res})
          if (name === 'scenarios') {
            store.dispatch('FIX_SCENARIOS')
          }
        })
    },
    FIX_SCENARIOS ({ commit, state }) {
      let scenarioQueue = state.scenario_queue
      for (let i in scenarioQueue) {
        scenarioQueue[i].scenario.internalID = findScenarioID(state, scenarioQueue[i].scenario)
      }
      commit('UPDATE_SCENARIO_LIST', scenarioQueue)
    },
    QUEUE_SCENARIO ({ commit }, scenario) {
      commit('UPDATE_QUEUE_RUNNING', false)
      commit('UPDATE_QUEUE_LOCKED', false)
      commit('ADD_SCENARIO', {scenario: scenario, lastResult: {status: 'queued'}})
    },
    REMOVE_SCENARIO_FROM_QUEUE ({ commit }, internalID) {
      commit('REMOVE_SCENARIO', internalID)
    },
    LOCK_QUEUE ({ commit }) {
      commit('UPDATE_QUEUE_LOCKED', true)
    },
    RELEASE_QUEUE ({ commit }) {
      commit('UPDATE_QUEUE_LOCKED', false)
    },
    SETTINGS ({ commit }, settings) {
      app.post('saveSettings', settings)
        .then(function (res) {
          if (res) {
            commit('UPDATE_SETTINGS', settings)
          }
        })
    },
    RUN_SCENARIO ({ commit }, data) {
      commit('UPDATE_QUEUE_RUNNING', true)
      let internalID = data.scenario.internalID
      let outlineRow = data.outlineRow
      let outlineRowIndex = data.outlineRowIndex
      let scenarioID = data.scenarioID
      let jobID = data.jobID
      return new Promise((resolve) => {
        app.post('runScenario', {internalID, outlineRow, outlineRowIndex, scenarioID, jobID}, function (json) {
          if (typeof outlineRowIndex === 'undefined') {
            return json.scenario === internalID
          } else {
            return json.scenario === internalID && json.outlineRowIndex === outlineRowIndex
          }
        })
          .then(function (res) {
            for (let i in res.stepResults) {
              let s = res.stepResults[i]
              s.stepDefinition = data.scenario.steps[i - 1]
            }
            commit('UPDATE_SCENARIO_IN_QUEUE', {internalID, res, outlineRow, outlineRowIndex})
            resolve(res)
          })
      })
    },
    QUEUE_STARTED ({ commit }, scenarios) {
      commit('UPDATE_QUEUE_RUNNING', true)
      return app.post('queueStarted', scenarios)
    },
    QUEUE_STOPPED ({ commit }) {
      commit('UPDATE_QUEUE_RUNNING', false)
    },
    CREATE_OUTLINE_LIST ({ commit }, data) {
      app.post('createOutlineList', data)
        .then(function (res) {
          commit('UPDATE_OUTLINE_LISTS', res)
        })
    },
    CREATE_QUEUE_LIST ({ commit, state }, name) {
      app.post('createQueueList', {name, list: state.scenario_queue})
        .then(function (res) {
          commit('UPDATE_QUEUE_LISTS', res)
        })
    },
    LOAD_QUEUE_LIST ({ commit, state }, name) {
      commit('SET_SCENARIO_QUEUE', state.queue_lists[name])
    },
    OPEN_CARD ({ commit }, id) {
      commit('UPDATE_OPEN_CARD', {open: true, id})
    },
    CLOSE_CARD ({ commit }, id) {
      commit('UPDATE_OPEN_CARD', {open: false, id})
    },
    CHANGE_PAGE ({ commit }, page) {
      commit('UPDATE_PAGE', page)
    },
    SET_CURRENT_PROFILE ({ commit }, profile) {
      app.post('setProfile', profile)
        .then(function () {
          commit('UPDATE_CURRENT_PROFILE', profile)
        })
    }
  }
})

export default store
