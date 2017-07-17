<template>
  <div class="topbar">
    <div class="logo">Cornichon</div>
    <div class="links">
      <router-link v-for="link in links" :key="link.display"
                   :to="`/${link.display.replace(' ', '-')}`"
                   class="link">{{link.display}}</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'topbar',
    data () {
      return {
        links: [
          {display: 'Home'},
          {display: 'History'},
          {display: 'Scenario Lists'},
          {display: 'Scenarios'},
          {display: 'Steps'},
          {display: 'Features'}
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../mixins/long-shadow';

  .topbar {
    background-color: #2c3e50;
    overflow: hidden;
  }

  .logo {
    display: inline-block;
    margin-left: 10px;
    margin-right: 100px;
    color: white;
    font-family: 'Pacifico', cursive;
    font-weight: normal;
    font-size: 30px;
    line-height: 40px;
    user-select: none;
    cursor: default;
    @include long-shadow(#161d21, 70, right, 3, 0);
  }

  .links {
    display: inline-block;
  }

  .link {
    color: white;
    margin: 5px 10px;
    text-decoration: none;

    &.router-link-active {
      text-decoration: underline;
    }
  }
</style>
