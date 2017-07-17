<template>
  <div id="stepselector" ref="container">
    <span ref="main">Steps</span>
    <div class="dropdown" ref="dropdown">
        <span>Steps</span>
        <span>Hooks</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'stepselector',
    props: {
      stepType: {
        type: String,
        default: 'Any'
      }
    },
    data () {
      return {
        searchType: 'Steps'
      }
    },
    mounted () {
      const _this = this
      this.$refs.dropdown.addEventListener('click', function (e) {
        if (e.target && e.target.matches('span')) {
          _this.selectType(e.target.innerText)
        }
      })
      this.$refs.main.addEventListener('click', function (e) {
        _this.$refs.container.className = 'open'
      })
    },
    methods: {
      selectType (option) {
        this.$refs.container.className = ''
        this.$refs.main.innerText = option
        this.searchType = option
      }
    }
  }
</script>

<style scoped>
#stepselector {
  position: relative;
  cursor: pointer;
  width: 150px;
}

#stepselector.open .dropdown {
  display: block;
}

.dropdown {
  display: none;
  position: absolute;
  left: 0;
  top: 100%;
  background-color: #F9F9F9;
  border: 3px solid #E6E6E6;
  margin-top: 13px;
}

.dropdown span {
  display: inline-block;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-bottom: 1px solid #E6E6E6;
  width: 100%;
  padding: 10px;
}

span:hover {
  color: cornflowerblue;
}
</style>
