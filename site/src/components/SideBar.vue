<template>
  <div id="sidebar">
    <div class="sidebar-wrapper">
      <h1 class="long-shadow">Cornichon</h1>
      <ul class="radio" data-radio="searchMode">
        <li v-for="item in menuItems" :class="{selected: isSelected(item)}" @click="toggle(item)">
          <i class="fa" :class="item.icon"></i>
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sidebar',
    data () {
      return {
        menuItems: [
          {name: 'Steps', icon: 'fa-puzzle-piece'},
          {name: 'Scenarios', icon: 'fa-cube'},
          {name: 'Features', icon: 'fa-cubes'},
          {name: 'Queue', icon: 'fa-list-ul'},
          {name: 'Settings', icon: 'fa-cog'}
        ]
      }
    },
    methods: {
      isSelected: function (item) {
        if (item.name === this.$store.state.currentPage) {
          return true
        }
        return false
      },
      toggle: function (item) {
        this.$store.dispatch('CHANGE_PAGE', item.name)
      }
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
