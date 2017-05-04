import Vue from 'vue'
import Vuex from 'vuex'
import { app } from '../store/app'

Vue.use(Vuex)

app.socket.on('refresh', function () {
  store.dispatch('FETCH', 'tags')
  store.dispatch('FETCH', 'supportcode')
  store.dispatch('FETCH', 'features')
  store.dispatch('FETCH', 'scenarios')
  store.dispatch('FETCH', 'settings')
})

const store = new Vuex.Store({
  state: {
    currentPage: 'Steps',
    settings: {},
    tags: [],
    scenario_queue: [],
    scenarios: [],
    features: [],
    supportcode: [],
    placeholders: {
      supportcode: [],
      features: [],
      scenarios: []
    },
    open_cards: []
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
      state.scenario_queue.push(scenario)
    },
    UPDATE_SCENARIO_IN_QUEUE (state, data) {
      for (let i in state.scenario_queue) {
        let s = state.scenario_queue[i]
        if (s.scenario === data.internalID) {
          s.lastResult = data.res
        }
      }
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
    }
  },
  actions: {
    FETCH (context, request) {
      let data = request.data || request
      let name = request.name || request
      app.fetch(data)
        .then(function (res) {
          store.commit('SET', {name, res})
        })
    },
    QUEUE_SCENARIO ({ commit }, scenario) {
      commit('ADD_SCENARIO', {scenario, lastResult: {status: 'queued'}})
    },
    SETTINGS ({ commit }, settings) {
      app.post('saveSettings', settings)
        .then(function (res) {
          if (res) {
            commit('UPDATE_SETTINGS', settings)
          }
        })
    },
    RUN_SCENARIO ({ commit }, internalID) {
      return new Promise((resolve) => {
        app.post('runScenario', internalID)
          .then(function (res) {
            commit('UPDATE_SCENARIO_IN_QUEUE', {internalID, res})
            resolve(res)
          })
      })
    },
    OPEN_CARD ({ commit }, id) {
      commit('UPDATE_OPEN_CARD', {open: true, id})
    },
    CLOSE_CARD ({ commit }, id) {
      commit('UPDATE_OPEN_CARD', {open: false, id})
    },
    CHANGE_PAGE ({ commit }, page) {
      commit('UPDATE_PAGE', page)
    }
  }
})

export default store
