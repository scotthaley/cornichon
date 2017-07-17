import Vue from 'vue'
import Router from 'vue-router'
import Steps from '@/pages/Steps'
import Scenarios from '@/pages/Scenarios'
import Features from '@/pages/Features'
import ScenarioLists from '@/pages/ScenarioLists'
import EditList from '@/pages/EditList'
import History from '@/pages/History'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/Steps'},
    {
      path: '/Steps',
      name: 'Steps',
      component: Steps
    },
    {
      path: '/Scenarios',
      name: 'Scenarios',
      component: Scenarios
    },
    {
      path: '/Features',
      name: 'Features',
      component: Features
    },
    {
      path: '/Scenario-Lists',
      name: 'Scenario-Lists',
      component: ScenarioLists
    },
    {
      path: '/History',
      name: 'History',
      component: History
    },
    {
      path: '/EditList/:id',
      name: 'EditList',
      component: EditList,
      props: true
    }
  ]
})
