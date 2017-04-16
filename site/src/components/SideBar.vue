<template>
  <div id="sidebar">
    <div class="sidebar-wrapper">
      <h1 class="long-shadow">Cornichon</h1>
      <ul class="radio" data-radio="searchMode">
        <li class="selected"><i class="fa fa-puzzle-piece"></i>Steps</li>
        <li><i class="fa fa-cube"></i>Scenarios</li>
        <li><i class="fa fa-cubes"></i>Features</li>
        <li><i class="fa fa-cog"></i>Settings</li>
      </ul>
    </div>
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

  @import '../mixins/long-shadow';

  #sidebar {
    overflow: hidden;
    flex: 0 0 150px;
    background-color: #263238;
    width: 150px;

    .sidebar-wrapper {
      position: fixed;
      top:0;
      left:0;
      width:150px;
      overflow: hidden;
    }
    h1 {
      color: white;
      font-family: 'Pacifico', cursive;
      font-weight: normal;
      font-size: 30px;
      margin-top: 0;
      user-select: none;
      cursor: default;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      color: white;
      text-align: left;
      font-size: 18px;
      padding: 5px;
      user-select: none;
      cursor: pointer;

      +li {
        border-top: none;
      }

      i {
        padding-left: 3px;
        padding-right: 5px;
        width: 25px;
        text-align: center;
      }

      &.selected {
        background-color: #e6e6e6;
        color: #282a36;
        cursor: default;
      }
    }

    .long-shadow {
      @include long-shadow(#161d21, 70, right, 3, 0);
    }
  }
</style>
