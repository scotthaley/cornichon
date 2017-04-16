import Vue from 'vue'
import Vuex from 'vuex'
import { app } from '../store/app'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    settings: ['1', '2', '3'],
    tags: [],
    scenarios: []
  },
  mutations: {
    SET (state, {name, res}) {
      state[name] = res
    },
    ADD_SCENARIO (state, scenario) {
      state.scenarios.push(scenario)
    }
  },
  actions: {
    FETCH (context, {data, name}) {
      app.fetch(data)
        .done(function (res) {
          store.commit('SET', {name, res})
        })
    },
    QUEUE_SCENARIO ({ commit }, scenario) {
      commit('ADD_SCENARIO', scenario)
    }
  }
})

export default store
