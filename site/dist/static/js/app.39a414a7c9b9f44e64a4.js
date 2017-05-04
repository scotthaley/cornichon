webpackJsonp([1],[,,,,,function(t,e,s){var n=s(121);t.exports=new n.EventEmitter},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,s){s(126);var n=s(1)(s(72),s(164),null,null);t.exports=n.exports},function(t,e,s){s(128);var n=s(1)(s(76),s(166),"data-v-4fccc661",null);t.exports=n.exports},function(t,e,s){"use strict";var n=s(18),a=s.n(n),i=s(31),r=s(173),o=s(70);i.a.use(r.a),o.a.socket.on("refresh",function(){c.dispatch("FETCH","tags"),c.dispatch("FETCH","supportcode"),c.dispatch("FETCH","features"),c.dispatch("FETCH","scenarios"),c.dispatch("FETCH","settings")});var c=new r.a.Store({state:{settings:{},tags:[],scenario_queue:[],scenarios:[],features:[],supportcode:[],placeholders:{supportcode:[],features:[],scenarios:[]}},mutations:{SET:function(t,e){var s=e.name,n=e.res;if(t[s]=n,s in t.placeholders)for(var a in n){var i=n[a];t.placeholders[s].push((i.fullName||i.name)+"...")}},ADD_SCENARIO:function(t,e){t.scenario_queue.push(e)},UPDATE_SCENARIO_IN_QUEUE:function(t,e){for(var s in t.scenario_queue){var n=t.scenario_queue[s];n.scenario===e.internalID&&(n.lastResult=e.res)}},UPDATE_SETTINGS:function(t,e){t.settings=e}},actions:{FETCH:function(t,e){var s=e.data||e,n=e.name||e;o.a.fetch(s).then(function(t){c.commit("SET",{name:n,res:t})})},QUEUE_SCENARIO:function(t,e){(0,t.commit)("ADD_SCENARIO",{scenario:e,lastResult:{status:"queued"}})},SETTINGS:function(t,e){var s=t.commit;o.a.post("saveSettings",e).then(function(t){t&&s("UPDATE_SETTINGS",e)})},RUN_SCENARIO:function(t,e){var s=t.commit;return new a.a(function(t){o.a.post("runScenario",e).then(function(n){s("UPDATE_SCENARIO_IN_QUEUE",{internalID:e,res:n}),t(n)})})}}});e.a=c},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},,,,,,,,,,,,,function(t,e,s){s(132);var n=s(1)(s(71),s(171),null,null);t.exports=n.exports},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(31),a=s(68),i=s.n(a),r=s(48);n.a.config.productionTip=!1,s(58),s(56),s(57),s(67),s(65),s(64),s(62),s(60),s(63),s(59),s(61),s(66),s(53),s(49),s(50),s(52),s(51),s(54),s(55),document.addEventListener("DOMContentLoaded",function(){s(30).initHighlightingOnLoad()},!1),new n.a({el:"#app",store:r.a,template:"<App/>",components:{App:i.a}})},function(t,e,s){"use strict";var n=s(18),a=s.n(n);s.d(e,"a",function(){return i});var i=function(){function t(t){return new a.a(function(e){s.once(t,function(t){e(t)}),s.emit(t)})}function e(t,e){return new a.a(function(n){s.once(t,function(t){n(t)}),s.emit(t,e)})}var s=io.connect("http://localhost:8088/");return{fetch:t,post:e,socket:s}}()},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(152),a=s.n(n),i=s(155),r=s.n(i),o=s(156),c=s.n(o),u=s(158),l=s.n(u),d=s(151),p=s.n(d),f=s(153),h=s.n(f),v=s(154),_=s.n(v),m=s(12),g=s(5);e.default={name:"app",components:{Hello:a.a,searchbar:r.a,searchresults:c.a,sidebar:l.a,detailsview:p.a,refinements:h.a,scenarioQueue:_.a},data:function(){return{search:"",sidebarData:{}}},computed:{placeholders:function(){return this.$store.state.placeholders}},beforeMount:function(){this.$store.dispatch("FETCH","tags"),this.$store.dispatch("FETCH","supportcode"),this.$store.dispatch("FETCH","features"),this.$store.dispatch("FETCH","scenarios"),this.$store.dispatch("FETCH","settings")},mounted:function(){g.on("details",function(){m("body").css("overflow","hidden")}),g.on("details-closed",function(){m("body").css("overflow","auto")})}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(12);e.default={name:"codemirror",props:["options","value"],computed:{showButtons:function(){return!this.options||this.options&&!this.options.readOnly&&!this.options.hideButtons},_options:function(){var t=this.options||{};return t.mode=t.mode||"gfm",t.lineNumbers=t.lineNumbers||!0,t.theme=t.theme||"material",this.$store.state.settings.custom&&this.$store.state.settings.custom["Code Style"]&&(t.theme=this.$store.state.settings.custom["Code Style"]),t.value=this.value,t.autoRefresh=!0,t}},data:function(){return{cm:null}},methods:{updateOptions:function(){this.cm&&(this.cm.setOption("theme",this._options.theme),this.cm.setOption("value",this._options.value))}},mounted:function(){var t=this;this.cm=CodeMirror(this.$refs.container,this._options),this.cm.on("change",function(){t.$emit("input",t.cm.getValue())}),n(this.$refs.save).click(function(){t.$emit("updated",t.cm.getValue())}),n(this.$refs.cancel).click(function(){t.$emit("cancel")})},watch:{_options:function(){this.updateOptions()}}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(47),a=s.n(n),i=s(12),r=s(5);e.default={name:"detailsview",components:{resultcard:a.a},data:function(){return{step:null,scenario:null,feature:null,results:null}},computed:{supportCode:function(){return this.$store.state.supportcode},features:function(){return this.$store.state.features},scenarios:function(){return this.$store.state.scenarios},resultScenario:function(){return this.getScenarioByID(this.results.scenario)},resultSteps:function(){if(!this.results)return[];var t=[];for(var e in this.results.stepResults){var s=this.results.stepResults[e];s.stepDefinition.pattern&&t.push(s)}return t}},mounted:function(){var t=this;r.on("details",function(e,s){"results"===e?t.showScenarioResults(s):t.showDetails(e)}),i(this.$refs.overlay).click(function(){t.hideModal()})},methods:{getScenarioByID:function(t){for(var e in this.scenarios){var s=this.scenarios[e];if(s.internalID===t)return s}},showDetails:function(t){var e=this;setTimeout(function(){e.$refs.content.scrollTop=0},50),-1!==t.indexOf("feature-")?this.showFeature(t):-1!==t.indexOf("scenario-")?this.showScenario(t):this.showStep(t)},showScenarioResults:function(t){this.step=null,this.scenario=null,this.feature=null,this.results=t,this.showModal()},showStep:function(t){for(var e in this.supportCode){var s=this.supportCode[e];if(s.cornichonID===t)return this.step=s,this.results=null,this.scenario=null,this.feature=null,void this.showModal()}},showFeature:function(t){for(var e in this.features){var s=this.features[e];if(s.internalID===t)return this.feature=s,this.step=null,this.results=null,this.scenario=null,void this.showModal()}},showScenario:function(t){for(var e in this.scenarios){var s=this.scenarios[e];if(s.internalID===t)return this.scenario=s,this.step=null,this.feature=null,this.results=null,void this.showModal()}},showModal:function(){i(this.$refs.main).css("display","block")},hideModal:function(){i(this.$refs.main).css("display","none"),r.emit("details-closed")}}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"hello",data:function(){return{msg:"Welcome to Your Vue.js App"}}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(5);e.default={name:"refinements",data:function(){return{tags:[],selected:""}},methods:{toggleTag:function(t){var e=this.tags.indexOf(t);e<0?this.tags.push(t):this.tags.splice(e,1)}},watch:{refinementData:function(t){n.emit("refinement.data",t)}},computed:{tagOptions:function(){return this.$store.state.tags.map(function(t){return{name:t,active:!1}})},refinementData:function(){return{tags:this.tags}}},beforeMount:function(){this.$store.dispatch("FETCH",{data:"tags",name:"tags"})}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(84),a=s.n(n),i=s(86),r=s.n(i),o=s(46),c=s.n(o),u=s(12),l=s(120),d=s(30),p=s(134),f=s(5);e.default={name:"resultcard",props:["step","feature","scenario","modal"],components:{codemirror:c.a},data:function(){return{openToggled:!1,usageOpen:!1}},watch:{step:function(){this.openToggled=!1,setTimeout(this.codeHighlight,50)},feature:function(){this.openToggled=!1,setTimeout(this.codeHighlight,50)},scenario:function(){this.openToggled=!1,setTimeout(this.codeHighlight,50)}},methods:{toggleCard:function(){this.openToggled=!this.openToggled,setTimeout(this.codeHighlight,50)},codeHighlight:function(){u(this.$refs.card).find("pre code").each(function(t,e){d.highlightBlock(e)})},updateUsage:function(t){u.post("http://localhost:8088/updateUsage",{markdown:t,cornichonID:this.step.cornichonID},null,"json"),this.usageOpen=!1,this.step.usage=t,setTimeout(this.codeHighlight,50)},cancelUsage:function(){this.usageOpen=!1},openFile:function(t){t=t.replace(/\\/g,"/"),u.post("http://localhost:8088/openFile",{path:t},null,"json")},runScenario:function(t){u.post("http://localhost:8088/runScenario",{internalID:t},null,"json")},queueScenario:function(t){this.$store.dispatch("QUEUE_SCENARIO",t)}},computed:{open:function(){return this.openToggled||this.modal},usageHTML:function(){return p(this.step.usage)},featureTitle:function(){return this.feature?this.feature.keyword+": "+this.feature.name:""},stepTitle:function(){var t=this.step?this.step.keyword+" "+this.step.pattern:"";return t=t.replace(/({[^}]*})/g,'<span class="hljs-string">$1</span>'),t},scenarioTitle:function(){return this.scenario?this.scenario.keyword+": "+this.scenario.name:""},mappedFeatures:function(){var t=[],e=null;if(this.step?e=this.step.features:this.scenario&&(e=[this.scenario.feature]),e)for(var s in e){var n=e[s],a="";a+="<span "+this.$options._scopeId+' class="feature" data-id="'+n.internalID+'">'+l(n.keyword)+": "+l(n.name)+"</span>",a+="\n<div "+this.$options._scopeId+' class="feature-description">'+l(n.description)+"</div>",t.push(a)}return t},mappedScenarios:function(){var t=[],e=void 0;this.step?e=this.step.scenarios:this.feature?e=this.feature.scenarios:this.scenario&&(e=[this.scenario].concat(r()(this.scenario.otherScenarios)));for(var s in e){var n=e[s],i="";this.step&&(i+="<span "+this.$options._scopeId+' class="uri" data-uri='+n.uri_full+">"+n.uri+"</span>\n");for(var o in n.tags){var c=n.tags[o];i+=l(c.name)+" "}n.tags.length>0&&(i+="\n"),i+="<span "+this.$options._scopeId+' class="scenario" data-id="'+n.internalID+'">'+l(n.keyword)+": "+l(n.name)+"</span>";for(var u in n.steps){var d=n.steps[u],p=d.cornichonID?"":"<span "+this.$options._scopeId+' class="und-step">No step definition found</span>',f=d.cornichonID?"":"und-step";d.currentStep?i+="\n<span "+this.$options._scopeId+' class="step currentStep '+f+'" data-id="'+d.cornichonID+'"><span '+this.$options._scopeId+' class="marker"></span>'+l(d.keyword+" "+d.name)+p+"</span>":i+="\n<span "+this.$options._scopeId+' class="step '+f+'" data-id="'+d.cornichonID+'">'+l(d.keyword+" "+d.name)+p+"</span>"}if(n.table){i+="\n\n<table "+this.$options._scopeId+"><tr>";for(var h in n.table)i+="<th "+this.$options._scopeId+">"+h+"</th>";i+="</tr>";for(var v=0;v<n.table[a()(n.table)[0]].length;v++){i+="<tr "+this.$options._scopeId+">";for(var _ in n.table)i+="<td "+this.$options._scopeId+">"+n.table[_][v]+"</td>";i+="</tr>"}}t.push(i)}return t}},mounted:function(){this.codeHighlight();var t=this;u(this.$refs.card).on("click",".step:not(.currentStep), .scenario, .feature",function(t){var e=u(t.target).closest("[data-id]");f.emit("details",e.data("id").toString())}),u(this.$refs.card).on("click",".uri",function(e){t.openFile(u(this).attr("data-uri"))}),u(this.$refs.card).on("click",".tag",function(t){f.emit("refinement.tag",u(t.target).closest(".tag").text())})}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(87),a=s.n(n),i=s(85),r=s.n(i),o=s(5);e.default={name:"ScenarioQueue",data:function(){return{queueOpen:!0}},computed:{scenarios:function(){return this.$store.state.scenario_queue}},methods:{runScenarios:function(){function t(){return e.apply(this,arguments)}var e=r()(a.a.mark(function t(){var e,s;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e=this.scenarios,e=e.map(function(t){return t.lastResult.status="queued",t}),s=0;case 3:if(!(s<e.length)){t.next=10;break}return e[s].lastResult.status="running",t.next=7,this.$store.dispatch("RUN_SCENARIO",e[s].scenario);case 7:s++,t.next=3;break;case 10:case"end":return t.stop()}},t,this)}));return t}(),openClose:function(){this.queueOpen=!this.queueOpen},openResults:function(t){console.log(t),o.emit("details","results",t)}}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(159),a=s.n(n),i=s(150);e.default={name:"searchbar",components:{stepselector:a.a},props:{stepType:{type:String,default:"Any"},value:String,placeholders:Array},data:function(){return{search:"",loaded:!1}},watch:{placeholders:function(){this.loaded||this.initSuperplaceholder(),this.loaded=!0}},methods:{updateValue:function(t){this.$emit("input",t)},initSuperplaceholder:function(){this.placeholders&&i({el:this.$refs.input,sentences:this.placeholders,options:{startOnFocus:!1,shuffle:!0,loop:!0}})}},mounted:function(){this.initSuperplaceholder()}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(47),a=s.n(n),i=s(157),r=s.n(i),o=s(133),c=s(5);e.default={name:"searchresults",props:["value","search","sidebarData"],components:{resultcard:a.a,settings:r.a},data:function(){return{refinementData:{}}},mounted:function(){var t=this;c.on("refinement.data",function(e){t.refinementData=e})},computed:{features:function(){return this.$store.state.features},supportCode:function(){return this.$store.state.supportcode},scenarios:function(){return this.$store.state.scenarios},filteredSupportCode:function(){var t=[];for(var e in this.supportCode){var s=this.supportCode[e];o.test(this.search,s.fullName)&&t.push(s)}return t},filteredFeatures:function(){var t=[];for(var e in this.features){var s=this.features[e];o.test(this.search,s.name)&&(this.refinementData.tags&&this.refinementData.tags.length>0&&!this.tagMatchesSource(s)||t.push(s))}return t},filteredScenarios:function(){var t=[];for(var e in this.scenarios){var s=this.scenarios[e];o.test(this.search,s.name)&&(this.refinementData.tags&&this.refinementData.tags.length>0&&!this.tagMatchesSource(s)||t.push(s))}return t}},methods:{tagMatchesSource:function(t){var e=!1;for(var s in this.refinementData.tags){var n=this.refinementData.tags[s];for(var a in t.tags)if(n===t.tags[a].name){e=!0;break}if(e)break}return e}}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(46),a=s.n(n);e.default={name:"settings",components:{codemirror:a.a},data:function(){return{options:{dropdowns:{"Code Style":["material","solarized","neo"]}},envVar:{name:"",value:""},editableConfiguration:null}},computed:{settings:function(){return this.$store.state.settings}},methods:{save:function(){this.$store.dispatch("SETTINGS",this.settings)},addEnvVar:function(){this.settings.custom.envVars=this.settings.custom.envVars||[],this.settings.custom.envVars.push(this.envVar),this.envVar={name:"",value:""},this.save()},deleteEnvVar:function(t){for(var e in this.settings.custom.envVars){this.settings.custom.envVars[e].name===t&&delete this.settings.custom.envVars[e]}this.save()}}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(12);e.default={name:"sidebar",props:["value"],data:function(){return{searchMode:"Steps"}},methods:{updateModel:function(){var t={searchMode:this.searchMode};this.$emit("input",t)}},mounted:function(){var t=this;n("ul.radio").click("li",function(e){n(this).find("li").each(function(){n(this).removeClass("selected")}),n(e.target).addClass("selected"),t[n(this).data("radio")]=n(e.target).text(),t.updateModel()}),this.updateModel()}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"stepselector",props:{stepType:{type:String,default:"Any"}},data:function(){return{searchType:"Steps"}},mounted:function(){var t=this;this.$refs.dropdown.addEventListener("click",function(e){e.target&&e.target.matches("span")&&t.selectType(e.target.innerText)}),this.$refs.main.addEventListener("click",function(e){t.$refs.container.className="open"})},methods:{selectType:function(t){this.$refs.container.className="",this.$refs.main.innerText=t,this.searchType=t}}}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},,,,,,,,,,,,,,,,,,,function(t,e,s){s(124);var n=s(1)(s(73),s(162),"data-v-331d5523",null);t.exports=n.exports},function(t,e,s){s(129);var n=s(1)(s(74),s(168),"data-v-6e68336e",null);t.exports=n.exports},function(t,e,s){s(127);var n=s(1)(s(75),s(165),"data-v-486bdd24",null);t.exports=n.exports},function(t,e,s){s(123);var n=s(1)(s(77),s(161),null,null);t.exports=n.exports},function(t,e,s){s(122);var n=s(1)(s(78),s(160),"data-v-1862f167",null);t.exports=n.exports},function(t,e,s){var n=s(1)(s(79),s(167),null,null);t.exports=n.exports},function(t,e,s){s(131);var n=s(1)(s(80),s(170),"data-v-7985b5b7",null);t.exports=n.exports},function(t,e,s){s(125);var n=s(1)(s(81),s(163),"data-v-3d0d37d8",null);t.exports=n.exports},function(t,e,s){s(130);var n=s(1)(s(82),s(169),"data-v-78bc021f",null);t.exports=n.exports},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"container",attrs:{id:"searchbar"}},[s("input",{ref:"input",attrs:{type:"text"},domProps:{value:t.value},on:{input:function(e){t.updateValue(e.target.value)}}})])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{class:{expanded:t.scenarios.length&&t.queueOpen,minimized:t.scenarios.length&&!t.queueOpen},attrs:{id:"scenario-queue"}},[s("div",{staticClass:"wrapper"},[s("div",{staticClass:"header"},[s("span",{staticClass:"icon",on:{click:function(e){t.openClose()}}},[t.queueOpen?s("i",{staticClass:"fa fa-times icon"}):t._e(),t._v(" "),t.queueOpen?t._e():s("i",{staticClass:"fa fa-plus-circle icon"})]),t._v(" "),s("span",{staticClass:"title button",on:{click:function(e){t.runScenarios()}}},[t._v("\n        Start\n        "),s("i",{staticClass:"fa fa-play play"})])]),t._v(" "),t._l(t.scenarios,function(e){return s("p",{staticClass:"scenario"},[s("span",{on:{click:function(s){t.openResults(e.lastResult)}}},[t._v(t._s(e.scenario))]),t._v(" "),"passed"===e.lastResult.status?s("i",{staticClass:"success fa fa-check-circle"}):t._e(),t._v(" "),"running"===e.lastResult.status?s("i",{staticClass:"running fa fa-ellipsis-h"}):t._e(),t._v(" "),"passed"!==e.lastResult.status&&"queued"!==e.lastResult.status&&"running"!==e.lastResult.status?s("i",{staticClass:"error fa fa-times-circle"}):t._e()])})],2)])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"main",attrs:{id:"detailsview"}},[s("div",{ref:"content",staticClass:"content"},[t.results?t._e():s("resultcard",{attrs:{modal:!0,step:t.step,scenario:t.scenario,feature:t.feature}}),t._v(" "),t.results?s("div",{staticClass:"results"},[s("div",{staticClass:"header"},[s("h1",[t._v('Scenario: "'+t._s(t.resultScenario.name)+'"')]),t._v(" "),"passed"===t.results.status?s("i",{staticClass:"success fa fa-check-circle"}):t._e(),t._v(" "),"passed"!==t.results.status?s("i",{staticClass:"error fa fa-times-circle"}):t._e()]),t._v(" "),s("div",{staticClass:"steps"},t._l(t.resultSteps,function(e){return s("div",{staticClass:"step"},[e.stepDefinition?s("span",{class:{success:"passed"===e.status}},[t._v(t._s(e.stepDefinition.pattern))]):t._e(),t._v(" "),"passed"===e.status?s("i",{staticClass:"success fa fa-check-circle"}):t._e(),t._v(" "),"passed"!==e.status?s("i",{staticClass:"error fa fa-times-circle"}):t._e()])})),t._v(" "),s("div",{staticClass:"status"},["passed"===t.results.status?s("div",{staticClass:"success"},[s("span",[t._v(t._s(t.resultSteps.length)+" steps completed in "+t._s(t.results.duration)+" milliseconds")])]):t._e(),t._v(" "),"passed"!==t.results.status?s("div",{staticClass:"error"},[s("span",[t._v("Scenario did not complete")])]):t._e()])]):t._e()],1),t._v(" "),s("div",{ref:"overlay",staticClass:"overlay"})])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"sidebar"}},[s("div",{staticClass:"sidebar-wrapper"},[s("h1",{staticClass:"long-shadow"},[t._v("Cornichon")]),t._v(" "),s("ul",{staticClass:"radio",attrs:{"data-radio":"searchMode"}},[s("li",{staticClass:"selected"},[s("i",{staticClass:"fa fa-puzzle-piece"}),t._v("Steps")]),t._v(" "),s("li",[s("i",{staticClass:"fa fa-cube"}),t._v("Scenarios")]),t._v(" "),s("li",[s("i",{staticClass:"fa fa-cubes"}),t._v("Features")]),t._v(" "),s("li",[s("i",{staticClass:"fa fa-cog"}),t._v("Settings")])])])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{ref:"container",class:{static:t.options&&t.options.readOnly}}),t._v(" "),t.showButtons?s("div",{staticClass:"buttons"},[s("button",{ref:"cancel"},[t._v("Cancel")]),t._v(" "),s("button",{ref:"save"},[t._v("Save")])]):t._e()])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"main",attrs:{id:"refinements"}},[s("div",{ref:"tags"},t._l(t.tagOptions,function(e){return s("span",{staticClass:"tag",class:{active:t.tags.includes(e.name)},domProps:{textContent:t._s(e.name)},on:{click:function(s){t.toggleTag(e.name)}}})}))])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"card",staticClass:"resultcard",class:{modal:t.modal}},[t.step?s("div",[s("div",{staticClass:"wrapper",on:{click:t.toggleCard}},[s("pre",[s("code",{ref:"header",staticClass:"gherkin header",domProps:{innerHTML:t._s(t.stepTitle)}})])]),t._v(" "),t.open?s("div",{staticClass:"content"},[s("span",{staticClass:"uri",domProps:{textContent:t._s(t.step.uri)},on:{click:function(e){t.openFile(t.step.uri_full)}}}),t._v(" "),s("div",{ref:"usage",staticClass:"usage"},[s("h1",{staticClass:"first"},[t._v("Usage"),s("i",{ref:"editusage",staticClass:"edit-usage fa fa-pencil fa-1x",on:{click:function(e){t.usageOpen=!0}}})]),t._v(" "),s("div",{ref:"marked",staticClass:"marked",domProps:{innerHTML:t._s(t.usageHTML)}}),t._v(" "),t.usageOpen?s("codemirror",{staticClass:"codemirror_usage",attrs:{value:t.step.usage},on:{updated:t.updateUsage,cancel:t.cancelUsage}}):t._e()],1),t._v(" "),s("h1",[t._v("Code")]),t._v(" "),s("codemirror",{staticClass:"codemirror",attrs:{options:{readOnly:!0,mode:"javascript",firstLineNumber:t.step.line}},model:{value:t.step.code,callback:function(e){t.step.code=e},expression:"step.code"}}),t._v(" "),s("h1",[t._v("Features")]),t._v(" "),t._l(t.mappedFeatures,function(e){return s("div",[s("pre",[s("code",{staticClass:"gherkin",domProps:{innerHTML:t._s(e)}})])])}),t._v(" "),s("h1",[t._v("Scenarios")]),t._v(" "),t._l(t.mappedScenarios,function(e){return s("div",[s("pre",[s("code",{staticClass:"gherkin",domProps:{innerHTML:t._s(e)}})])])})],2):t._e()]):t._e(),t._v(" "),t.feature?s("div",[s("div",{staticClass:"wrapper",on:{click:t.toggleCard}},[s("pre",[s("code",{ref:"header",staticClass:"gherkin header",domProps:{textContent:t._s(t.featureTitle)}})])]),t._v(" "),t.open?s("div",{staticClass:"content"},[s("span",{staticClass:"uri",domProps:{textContent:t._s(t.feature.uri)},on:{click:function(e){t.openFile(t.feature.uri_full)}}}),t._v(" "),""!=t.feature.description?s("div",[s("h1",[t._v("Description")]),t._v(" "),s("div",{domProps:{innerHTML:t._s(t.feature.description.replace(/(?:\r\n|\r|\n)/g,"<br />"))}})]):t._e(),t._v(" "),t.feature.tags.length>0?s("div",[s("h1",[t._v("Tags")]),t._v(" "),t._l(t.feature.tags,function(e){return s("span",{staticClass:"tag",domProps:{textContent:t._s(e.name)}})})],2):t._e(),t._v(" "),s("h1",[t._v("Scenarios")]),t._v(" "),t._l(t.mappedScenarios,function(e){return s("div",[s("pre",[s("code",{staticClass:"gherkin",domProps:{innerHTML:t._s(e)}})])])})],2):t._e()]):t._e(),t._v(" "),t.scenario?s("div",[s("div",{staticClass:"wrapper",on:{click:t.toggleCard}},[s("pre",[s("code",{ref:"header",staticClass:"gherkin header",domProps:{innerHTML:t._s(t.scenarioTitle)}})]),t._v(" "),s("i",{staticClass:"fa fa-plus add",on:{click:function(e){t.queueScenario(t.scenario.internalID)}}})]),t._v(" "),t.open?s("div",{staticClass:"content"},[s("span",{staticClass:"uri",domProps:{textContent:t._s(t.scenario.uri)},on:{click:function(e){t.openFile(t.scenario.uri_full)}}}),t._v(" "),""!=t.scenario.description?s("div",[s("h1",[t._v("Description")]),t._v(" "),s("div",{domProps:{innerHTML:t._s(t.scenario.description.replace(/(?:\r\n|\r|\n)/g,"<br />"))}})]):t._e(),t._v(" "),t.scenario.tags.length>0?s("div",[s("h1",[t._v("Tags")]),t._v(" "),t._l(t.scenario.tags,function(e){return s("span",{staticClass:"tag",domProps:{textContent:t._s(e.name)}})})],2):t._e(),t._v(" "),s("h1",[t._v("Features")]),t._v(" "),t._l(t.mappedFeatures,function(e){return s("div",[s("pre",[s("code",{staticClass:"gherkin",domProps:{innerHTML:t._s(e)}})])])}),t._v(" "),s("h1",[t._v("Full Scenario")]),t._v(" "),t._l(t.mappedScenarios,function(e){return s("div",[s("pre",[s("code",{staticClass:"gherkin",domProps:{innerHTML:t._s(e)}})])])})],2):t._e()]):t._e()])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"container",attrs:{id:"searchresults"}},[t._l(t.filteredSupportCode,function(e){return"Steps"===t.sidebarData.searchMode?s("div",[s("resultcard",{attrs:{step:e}})],1):t._e()}),t._v(" "),t._l(t.filteredFeatures,function(e){return"Features"===t.sidebarData.searchMode?s("div",[s("resultcard",{attrs:{feature:e}})],1):t._e()}),t._v(" "),t._l(t.filteredScenarios,function(e){return"Scenarios"===t.sidebarData.searchMode?s("div",[s("resultcard",{attrs:{scenario:e}})],1):t._e()}),t._v(" "),"Settings"===t.sidebarData.searchMode?s("div",[s("settings")],1):t._e()],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"hello"},[s("h1",[t._v(t._s(t.msg))]),t._v(" "),s("h2",[t._v("Essential Links")]),t._v(" "),t._m(0),t._v(" "),s("h2",[t._v("Ecosystem")]),t._v(" "),t._m(1)])},staticRenderFns:[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ul",[s("li",[s("a",{attrs:{href:"https://vuejs.org",target:"_blank"}},[t._v("Core Docs")])]),t._v(" "),s("li",[s("a",{attrs:{href:"https://forum.vuejs.org",target:"_blank"}},[t._v("Forum")])]),t._v(" "),s("li",[s("a",{attrs:{href:"https://gitter.im/vuejs/vue",target:"_blank"}},[t._v("Gitter Chat")])]),t._v(" "),s("li",[s("a",{attrs:{href:"https://twitter.com/vuejs",target:"_blank"}},[t._v("Twitter")])]),t._v(" "),s("br"),t._v(" "),s("li",[s("a",{attrs:{href:"http://vuejs-templates.github.io/webpack/",target:"_blank"}},[t._v("Docs for This Template")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ul",[s("li",[s("a",{attrs:{href:"http://router.vuejs.org/",target:"_blank"}},[t._v("vue-router")])]),t._v(" "),s("li",[s("a",{attrs:{href:"http://vuex.vuejs.org/",target:"_blank"}},[t._v("vuex")])]),t._v(" "),s("li",[s("a",{attrs:{href:"http://vue-loader.vuejs.org/",target:"_blank"}},[t._v("vue-loader")])]),t._v(" "),s("li",[s("a",{attrs:{href:"https://github.com/vuejs/awesome-vue",target:"_blank"}},[t._v("awesome-vue")])])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"container",attrs:{id:"stepselector"}},[s("span",{ref:"main"},[t._v("Steps")]),t._v(" "),s("div",{ref:"dropdown",staticClass:"dropdown"},[s("span",[t._v("Steps")]),t._v(" "),s("span",[t._v("Hooks")])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"settings"},[s("h1",[t._v("Settings")]),t._v(" "),t._l(t.options.dropdowns,function(e,n){return s("div",{staticClass:"card"},[s("div",{staticClass:"key header"},[t._v(t._s(n))]),t._v(" "),s("div",{staticClass:"footer"},[s("select",{directives:[{name:"model",rawName:"v-model",value:t.settings.custom[n],expression:"settings.custom[key]"}],staticClass:"large",on:{change:function(e){var s=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value}),a=t.settings.custom,i=n;Array.isArray(a)?a.splice(i,1,e.target.multiple?s:s[0]):t.settings.custom[n]=e.target.multiple?s:s[0]}}},t._l(e,function(e){return s("option",{staticClass:"value"},[t._v(t._s(e))])}))])])}),t._v(" "),s("div",{staticClass:"card"},[s("div",{staticClass:"header"},[t._v("Environment Variables")]),t._v(" "),s("div",{staticClass:"footer"},[s("div",[s("div",[s("table",[t._m(0),t._v(" "),t._l(t.settings.custom.envVars,function(e){return s("tr",[s("td",[t._v("\n                "+t._s(e.name)+"\n              ")]),t._v(" "),s("td",[t._v("\n                "+t._s(e.value)+"\n                "),s("i",{staticClass:"fa fa-times icon",on:{click:function(s){t.deleteEnvVar(e.name)}}})])])}),t._v(" "),s("tr",[s("td",[s("input",{directives:[{name:"model",rawName:"v-model",value:t.envVar.name,expression:"envVar.name"}],staticClass:"large",attrs:{type:"text"},domProps:{value:t.envVar.name},on:{input:function(e){e.target.composing||(t.envVar.name=e.target.value)}}})]),t._v(" "),s("td",[s("input",{directives:[{name:"model",rawName:"v-model",value:t.envVar.value,expression:"envVar.value"}],staticClass:"large",attrs:{type:"text"},domProps:{value:t.envVar.value},on:{input:function(e){e.target.composing||(t.envVar.value=e.target.value)}}})])])],2),t._v(" "),s("div",{staticClass:"buttons"},[s("button",{on:{click:t.addEnvVar}},[t._v("Add variable")])])])]),t._v(" "),t._l(t.settings.custom.configurations,function(e){return s("div",{staticClass:"configuration"},[t._v("\n        "+t._s(t.configurations.name)+"\n      ")])})],2)]),t._v(" "),s("div",{staticClass:"card"},[s("div",{staticClass:"header"},[t._v("Setup Command")]),t._v(" "),s("div",{staticClass:"footer"},[s("codemirror",{attrs:{options:{hideButtons:!0}},model:{value:t.settings.custom["Setup Command"],callback:function(e){var s=t.settings.custom;Array.isArray(s)?s.splice("Setup Command",1,e):t.settings.custom["Setup Command"]=e},expression:"settings.custom['Setup Command']"}})],1)]),t._v(" "),s("div",{staticClass:"buttons"},[s("button",{on:{click:t.save}},[t._v("Save")])])],2)},staticRenderFns:[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("tr",[s("th",[t._v("\n                Name\n              ")]),t._v(" "),s("th",[t._v("\n                Value\n              ")])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"app"}},[s("sidebar",{model:{value:t.sidebarData,callback:function(e){t.sidebarData=e},expression:"sidebarData"}}),t._v(" "),s("div",{ref:"content",staticClass:"content"},[s("searchbar",{directives:[{name:"show",rawName:"v-show",value:"Steps"===t.sidebarData.searchMode,expression:"sidebarData.searchMode === 'Steps'"}],attrs:{placeholders:t.placeholders.supportcode},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}}),t._v(" "),s("searchbar",{directives:[{name:"show",rawName:"v-show",value:"Features"===t.sidebarData.searchMode,expression:"sidebarData.searchMode === 'Features'"}],attrs:{placeholders:t.placeholders.features},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}}),t._v(" "),s("searchbar",{directives:[{name:"show",rawName:"v-show",value:"Scenarios"===t.sidebarData.searchMode,expression:"sidebarData.searchMode === 'Scenarios'"}],attrs:{placeholders:t.placeholders.scenarios},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}}),t._v(" "),"Settings"!==t.sidebarData.searchMode?s("div",{staticClass:"utility-bar"},[s("refinements")],1):t._e(),t._v(" "),s("searchresults",{attrs:{search:t.search,sidebarData:t.sidebarData}})],1),t._v(" "),s("scenario-queue"),t._v(" "),s("detailsview")],1)},staticRenderFns:[]}}],[69]);
//# sourceMappingURL=app.39a414a7c9b9f44e64a4.js.map