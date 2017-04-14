import Vue from 'vue'
import Vuex from 'vuex'
import { app } from '../store/app'

Vue.use(Vuex)

console.log(app.test)

const store = new Vuex.Store({
  state: {
    settings: ['1', '2', '3']
  }
})

export default store
