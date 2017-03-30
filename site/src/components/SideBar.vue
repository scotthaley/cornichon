<template>
  <div id="sidebar">
    <h1>Cornichon</h1>
    <ul class="radio" data-radio="searchMode">
      <li class="selected">Steps</li>
      <li>Scenarios</li>
      <li>Features</li>
    </ul>
  </div>
</template>

<script>
  const $ = require('jquery')

  export default {
    name: 'sidebar',
    props: ['value'],
    data () {
      return {
        searchMode: 'Steps'
      }
    },
    methods: {
      updateModel: function () {
        let newValue = {
          searchMode: this.searchMode
        }
        this.$emit('input', newValue)
      }
    },
    mounted () {
      const _this = this
      $('ul.radio').click('li', function (e) {
        $(this).find('li').each(function () {
          $(this).removeClass('selected')
        })
        $(e.target).addClass('selected')
        _this[$(this).data('radio')] = $(e.target).text()
        _this.updateModel()
      })
      this.updateModel()
    }
  }
</script>

<style lang="scss" scoped>
  #sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #282a36;
    border-right: 1px solid #282a36;
    width: 150px;
    font-family: monospace;

    h1 {
      color: white;
      font-family: 'Pacifico', cursive;
      font-weight: normal;
      font-size: 30px;
      margin-top: 0;
      border-bottom: 2px solid white;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      color: white;
      text-align: left;
      font-size: 18px;
      border-bottom: 1px solid #e6e6e6;
      border-top: 1px solid #e6e6e6;
      padding: 5px;
      cursor: pointer;

      +li {
        border-top: none;
      }

      &.selected {
        background-color: #e6e6e6;
        color: #282a36;
        cursor: inherit;
      }
    }
  }
</style>
