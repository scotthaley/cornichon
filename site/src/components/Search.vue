<template>
  <div>
    <md-input-container>
      <md-icon>search</md-icon>
      <label>Search</label>
      <md-input type="text" v-model="searchPattern"></md-input>
    </md-input-container>
    <md-list>
      <md-list-item v-for="item in filteredList" :key="item[itemKey]"
                    @click="onClick(item)"
                    :class="{active: value === item[itemKey]}">
        <span v-html="item[display]"></span>
        <md-divider></md-divider>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  const fuzzy = require('fuzzy')

  export default {
    name: 'search',
    props: ['list', 'itemKey', 'display', 'value', 'filter'],
    data () {
      return {
        searchPattern: ''
      }
    },
    computed: {
      filteredList: function () {
        let l = this.$store.state[this.list]
        let filtered = []
        for (let i = 0; i < l.length; i++) {
          let listItem = l[i]
          if (fuzzy.test(this.searchPattern, listItem[this.display])) {
            if (!this.filter || this.filter(listItem)) {
              filtered.push(listItem)
            }
          }
        }
        return filtered
      }
    },
    methods: {
      onClick: function (item) {
        this.$emit('input', item[this.itemKey])
        this.$emit('item-clicked', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-input-container {
    margin-bottom: 0;
  }

  .md-list-item {
    &.active {
      background-color: #232731;
      color: white;
    }
    .md-list-item-container {
      padding: 10px 16px;
      user-select: none;
      cursor: pointer;
    }
  }
</style>
