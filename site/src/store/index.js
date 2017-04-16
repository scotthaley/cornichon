import Vue from 'vue'
import Vuex from 'vuex'
import { app } from '../store/app'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    settings: ['1', '2', '3'],
    tags: [],
    scenario_queue: [],
    scenarios: [],
    features: [],
    supportcode: [],
    placeholders: {
      supportcode: [],
      features: [],
      scenarios: []
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
      state.scenario_queue.push(scenario)
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
      commit('ADD_SCENARIO', scenario)
    }
  }
})

export default store
