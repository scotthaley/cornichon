<template>
  <div>
    <div ref="container" v-bind:class="{ static: options && options.readOnly}"></div>
    <div v-if="showButtons" class="buttons">
      <button ref="cancel" @click="cancel">Cancel</button>
      <button ref="save" @click="save">Save</button>
    </div>
  </div>
</template>

<script>
//  const $ = require('jquery')

  export default {
    name: 'codemirror',
    props: ['options', 'value'],
    computed: {
      showButtons: function () {
        return !this.options || (this.options && !this.options.readOnly && !this.options.hideButtons)
      },
      _options: function () {
        let _options = this.options || {}
        _options.mode = _options.mode || 'gfm'
        _options.lineNumbers = _options.lineNumbers || true

        _options.theme = _options.theme || 'material'
        if (this.$store.state.settings.custom && this.$store.state.settings.custom['Code Style']) {
          _options.theme = this.$store.state.settings.custom['Code Style']
        }
//        _options.value = this.value
        _options.autoRefresh = true

        return _options
      }
    },
    data: function () {
      return {
        cm: null
      }
    },
    methods: {
      updateOptions: function () {
        if (this.cm) {
          this.cm.setOption('theme', this._options.theme)
//          this.cm.setOption('value', this._options.value)
        }
      },
      save: function () {
        this.$emit('updated', this.cm.getValue())
      },
      cancel: function () {
        this.$emit('cancel')
      }
    },
    mounted () {
      const _this = this
      this._options.value = this.value
      this.cm = CodeMirror(this.$refs.container, this._options)

      this.cm.on('change', function () {
        _this.$emit('input', _this.cm.getValue())
      })

//      $(this.$refs.save).click(function () {
//        _this.$emit('updated', _this.cm.getValue())
//      })
//
//      $(this.$refs.cancel).click(function () {
//        _this.$emit('cancel')
//      })
    },
    watch: {
      _options: function () {
        this.updateOptions()
      }
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

</style>
