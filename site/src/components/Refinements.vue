<template>
  <div id="refinements" ref="main">
    <div ref="tags">
      <span v-for="tag in tagOptions" class="tag" @click="toggleTag(tag.name)" v-bind:class="{ active: tags.includes(tag.name) }" v-text="tag.name"></span>
    </div>
  </div>
</template>

<script>
  const eventBus = require('@/eventBus')

  export default {
    name: 'refinements',
    data () {
      return {
        tags: [],
        selected: ''
      }
    },
    methods: {
      toggleTag: function (tag) {
        let i = this.tags.indexOf(tag)
        if (i < 0) {
          this.tags.push(tag)
        } else {
          this.tags.splice(i, 1)
        }
      }
    },
    watch: {
      refinementData: function (value) {
        eventBus.emit('refinement.data', value)
      }
    },
    computed: {
      tagOptions: function () {
        return this.$store.state.tags.map((t) => ({name: t, active: false}))
      },
      refinementData: function () {
        return {
          tags: this.tags
        }
      }
    },
    beforeMount () {
      this.$store.dispatch('FETCH', {data: 'tags', name: 'tags'})
    }
  }
</script>

<style lang="scss" scoped>
  #refinements {
    margin-top: 20px;
    margin-bottom: -15px;
    font-size: 18px;
    text-align: left;
    overflow: scroll;
    white-space: nowrap;
    line-height: 40px;

    .tag {
      font-size: 14px;
      padding: 7px;
      background-color: #263238;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      margin-right: 5px;

      &.active {
        background-color: #f98990;

        &:hover {
          color: #263238;
        }
      }

      &:hover {
        color: #f98990;
      }
    }
  }
</style>
