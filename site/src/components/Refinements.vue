<template>
  <div id="refinements" ref="main">
    <div ref="tags">
      <span v-for="tag in tags" class="tag" v-text="tag"></span>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')
  const eventBus = require('@/eventBus')

  export default {
    name: 'refinements',
    data () {
      return {
        tags: []
      }
    },
    watch: {
      refinementData: function (value) {
        eventBus.emit('refinement.data', value)
      }
    },
    computed: {
      refinementData: function () {
        return {
          tags: this.tags
        }
      }
    },
    mounted () {
      const _this = this
      eventBus.on('refinement.tag', function (tag) {
        _this.tags.push(tag)
      })

      $(this.$refs.tags).on('click', '.tag', function (e) {
        let text = $(e.target).text()
        let i = _this.tags.indexOf(text)
        if (i >= 0) {
          _this.tags.splice(i, 1)
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  #refinements {
    margin-top: 20px;
    font-size: 18px;
    text-align: left;

    .tag {
      font-size: 14px;
      padding: 7px;
      background-color: #2c3e50;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      margin-right: 5px;

      &:hover {
        color: #f98990;
      }
    }
  }
</style>
