<template>
  <div>
    <div ref="container" v-bind:class="{ static: options && options.readOnly}"></div>
    <div v-if="showButtons" class="buttons">
      <button ref="cancel">Cancel</button>
      <button ref="save">Save</button>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')

  export default {
    name: 'codemirror',
    props: ['options', 'value'],
    computed: {
      showButtons: function () {
        return !this.options || (this.options && !this.options.readOnly && !this.options.hideButtons)
      }
    },
    mounted () {
      const _this = this
      let _options = this.options || {}
      _options.mode = _options.mode || 'gfm'
      _options.lineNumbers = _options.lineNumbers || true
      _options.theme = _options.theme || 'material'
      _options.value = this.value
      _options.autoRefresh = true

      let _codemirror = CodeMirror(this.$refs.container, _options)

      $(this.$refs.save).click(function () {
        _this.$emit('updated', _codemirror.getValue())
      })

      $(this.$refs.cancel).click(function () {
        _this.$emit('cancel')
      })
    }
  }
</script>

<style lang="scss">

  .static {
    .CodeMirror {
      height: initial;
    }
  }

  .CodeMirror {
    text-align: left;
    font-size: 18px;

    &.cm-s-dracula {
      span.cm-variable-2 {
        color: #8be9fd;
      }
      span.cm-header {
        color: #42b983;
      }
      span.cm-em {
        font-style: normal;
        font-weight: bold;
      }
    }
  }

  .buttons {
    margin-top: 10px;
    width: 100%;
    text-align: right;

    button {
      cursor: pointer;
      background-color: #263238;
      color: white;
      padding: 10px;
      width: 150px;
      border: none;

      &:hover {
        color: #8be9fd;
      }
    }
  }
</style>
