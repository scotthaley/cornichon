/**
 * Created by scotthaley on 7/15/17.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import { storeTools } from './storeTools'

Vue.use(Vuex)

const highlightStep = name => {
  let html = name
  html = html.replace(/(given|when|then)/ig, '<span class="keyword-1">$1</span>')
  html = html.replace(/({[^}]*})/ig, '<span class="keyword-2">$1</span>')
  return html
}

const store = new Vuex.Store({
  state: {
    steps: [],
    scenarios: [],
    features: [],
    queueLists: [],
    settings: {}
  },
  mutations: {
    setSteps (state, steps) {
      for (let i = 0; i < steps.length; i++) {
        steps[i].html = highlightStep(steps[i].fullName)
      }
      state.steps = steps
    },
    setScenarios (state, scenarios) {
      state.scenarios = scenarios
    },
    setFeatures (state, features) {
      state.features = features
    },
    setQueueLists (state, lists) {
      for (let i = 0; i < lists.length; i++) {
        if (!lists[i].draft) {
          lists[i].draft = []
        }
      }
      state.queueLists = lists
    },
    setSettings (state, settings) {
      state.settings = settings
    }
  },
  actions: {
    refresh_data ({commit}) {
      storeTools.fetch('supportcode').then(data => {
        commit('setSteps', data)
      })
      storeTools.fetch('scenarios').then(data => {
        commit('setScenarios', data)
      })
      storeTools.fetch('features').then(data => {
        commit('setFeatures', data)
      })
      storeTools.fetch('queueLists').then(data => {
        commit('setQueueLists', data)
      })
      storeTools.fetch('settings').then(data => {
        commit('setSettings', data)
      })
    },
    update_usage ({commit}, usage) {
      storeTools.post('updateUsage', usage).then(data => {
        commit('setSteps', data.steps)
        commit('setFeatures', data.features)
        commit('setScenarios', data.scenarios)
      })
    },
    create_scenario_list ({commit}, listName) {
      storeTools.post('createQueueList', {name: listName, list: []}).then(data => {
        commit('setQueueLists', data)
      })
    }
  }
})

export default store
