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

const fixTable = table => {
  let t = table
  t = []
  Object.keys(table).forEach(column => {
    for (let i = 0; i < table[column].length; i++) {
      while (i >= t.length) {
        t.push({})
      }
      t[i][column] = table[column][i]
    }
  })
  return t
}

const store = new Vuex.Store({
  state: {
    steps: [],
    scenarios: [],
    features: [],
    queueLists: [],
    history: [],
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
      for (let i = 0; i < scenarios.length; i++) {
        let s = scenarios[i]
        if (s.table) {
          s.table = fixTable(s.table)
        }
      }
      state.scenarios = scenarios
    },
    setFeatures (state, features) {
      state.features = features
    },
    setHistory (state, history) {
      let reports = []
      Object.keys(history.reports).forEach(jobID => {
        let list = []
        Object.keys(history.reports[jobID].list).forEach(scenarioID => {
          list.push(history.reports[jobID].list[scenarioID])
        })
        history.reports[jobID].list = list
        reports.push(history.reports[jobID])
      })
      state.history = reports
    },
    setQueueLists (state, lists) {
      for (let i = 0; i < lists.length; i++) {
        if (!lists[i].draft) {
          lists[i].draft = []
        }
      }
      state.queueLists = lists
    },
    discardDraft (state, listID) {
      let lists = state.queueLists
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].internalID === listID) {
          lists[i].draft = []
        }
      }
      state.queueLists = lists
    },
    saveDraft (state, listID) {
      let lists = state.queueLists
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].internalID === listID) {
          lists[i].list = []
          for (let a = 0; a < lists[i].draft.length; a++) {
            lists[i].list.push(lists[i].draft[a])
          }
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
      storeTools.fetch('history').then(data => {
        commit('setHistory', data)
      })
    },
    discard_draft ({commit}, listID) {
      commit('discardDraft', listID)
    },
    save_draft ({commit}, list) {
      storeTools.post('updateQueueList', {name: list.name, list: list.draft, internalID: list.internalID}).then(data => {
        commit('setQueueLists', data)
      })
    },
    delete_scenario_list ({commit}, listID) {
      storeTools.post('deleteQueueList', listID).then(data => {
        commit('setQueueLists', data)
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
    },
    queue_started ({ commit }, scenarios) {
      return storeTools.post('queueStarted', scenarios)
    },
    run_scenario ({commit}, data) {
      console.log(data)
      let internalID = data.scenario.internalID
      let outlineRow = data.outlineRow
      let outlineRowIndex = data.outlineRowIndex
      let scenarioID = data.scenarioID
      let jobID = data.jobID
      return new Promise((resolve) => {
        storeTools.post('runScenario', {internalID, outlineRow, outlineRowIndex, scenarioID, jobID}, function (json) {
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
            resolve(res)
          })
      })
    }
  }
})

export default store
