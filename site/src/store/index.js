import Vue from 'vue'
import Vuex from 'vuex'
import { app } from '../store/app'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    settings: ['1', '2', '3'],
    tags: []
  },
  mutations: {
    SET_TAGS (state, res) {
      state.tags = res
    }
  },
  actions: {
    TAGS (state) {
      app.fetch('tags')
        .done(function (res) {
          store.commit('SET_TAGS', res)
        })
    }
  }
})

app.fetch('tags').done(function (res) {
  store.state.tags = res
})

export default store
