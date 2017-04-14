// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

require('script-loader!node_modules/codemirror/lib/codemirror.js')
require('script-loader!node_modules/codemirror/addon/display/autorefresh.js')
require('script-loader!node_modules/codemirror/addon/mode/overlay.js')
require('script-loader!node_modules/codemirror/mode/xml/xml.js')
require('script-loader!node_modules/codemirror/mode/markdown/markdown.js')
require('script-loader!node_modules/codemirror/mode/javascript/javascript.js')
require('script-loader!node_modules/codemirror/mode/gherkin/gherkin.js')
require('script-loader!node_modules/codemirror/mode/css/css.js')
require('script-loader!node_modules/codemirror/mode/htmlmixed/htmlmixed.js')
require('script-loader!node_modules/codemirror/mode/clike/clike.js')
require('script-loader!node_modules/codemirror/mode/gfm/gfm.js')
require('script-loader!node_modules/codemirror/mode/meta.js')
require('node_modules/font-awesome/css/font-awesome.min.css')
require('node_modules/codemirror/lib/codemirror.css')
require('node_modules/codemirror/theme/material.css')
require('node_modules/highlightjs/styles/mono-blue.css')
require('@/assets/pacifico.css')
document.addEventListener('DOMContentLoaded', () => {
  var hljs = require('highlightjs')
  hljs.initHighlightingOnLoad()
}, false)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
