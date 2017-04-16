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
    SET_TAGS (state, res) {
      state.tags = res
    },
    ADD_SCENARIO (state, scenario) {
      state.scenarios.push(scenario)
    }
  },
  actions: {
    TAGS () {
      app.fetch('tags')
        .done(function (res) {
          store.commit('SET_TAGS', res)
        })
    },
    QUEUE_SCENARIO ({ commit }, scenario) {
      commit('ADD_SCENARIO', scenario)
    }
  }
})

app.fetch('tags').done(function (res) {
  store.state.tags = res
})

export default store
