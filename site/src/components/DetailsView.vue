<template>
  <div id="detailsview" ref="main">
    <div class="content" ref="content">
      <resultcard v-bind:modal="true" v-bind:step="step"></resultcard>
    </div>
    <div class="overlay" ref="overlay"></div>
  </div>
</template>

<script>
  const $ = require('jquery')
  const eventBus = require('@/eventBus')

  import resultcard from './ResultCard'

  export default {
    name: 'detailsview',
    props: ['supportCode', 'features', 'scenarios'],
    components: {
      resultcard
    },
    data () {
      return {
        step: null
      }
    },
    mounted () {
      const _this = this
      eventBus.on('details', function (id) {
        _this.showDetails(id)
      })

      $(this.$refs.overlay).click(function () {
        _this.hideModal()
      })
    },
    methods: {
      showDetails: function (id) {
        if (id.indexOf('feature-') !== -1) {

        } else if (id.indexOf('scenario-') !== -1) {

        } else {
          this.showStep(id)
        }
      },
      showStep: function (id) {
        for (let s in this.supportCode) {
          let step = this.supportCode[s]
          if (step.cornichonID === id) {
            this.step = step
            this.showModal()
          }
        }
      },
      showModal: function () {
        $(this.$refs.main).css('display', 'block')
      },
      hideModal: function () {
        $(this.$refs.main).css('display', 'none')
        eventBus.emit('details-closed')
      }
    }
  }
</script>

<style lang="scss" scoped>
  #detailsview {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;

    .overlay {
      top: 0;
      background-color: black;
      opacity: 0.8;
      width: 100%;
      height: 100%;
      z-index: 999;
    }

    .content {
      position: absolute;
      z-index: 9999;
      top: 10%;
      left: 10%;
      width: 80%;
      height: 80%;
      background-color: white;
      overflow: auto;
      border: 2px solid white;
    }
  }
</style>
