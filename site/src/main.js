// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueMaterial from 'vue-material'
import router from './router'
import store from './store'

import 'vue-material/dist/vue-material.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/mode/javascript/javascript.js'

Vue.use(VueMaterial)

Vue.config.productionTip = false

require('@/assets/pacifico.css')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
