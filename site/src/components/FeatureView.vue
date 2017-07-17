<template>
  <div v-if="feature" class="feature-view">
    <span v-html="`<span class='keyword-1'>${feature.keyword}</span>: ${feature.name}`"></span><br>
    <span class="description" v-html="feature.description.replace(new RegExp('\r?\n', 'g'), '<br/>')"></span>
  </div>
</template>

<script>
  export default {
    name: 'feature-view',
    props: ['featureID'],
    computed: {
      feature: function () {
        for (let i = 0; i < this.$store.state.features.length; i++) {
          let f = this.$store.state.features[i]
          if (f.internalID === this.featureID) {
            return f
          }
        }
        return null
      }
    }
  }
</script>

<style lang="scss">
  .feature-view {
    font-family: Menlo, Monaco, Consolas, monospace;
    font-size: 14px;
    color: white;
    background-color: #263338;
    padding: 5px;
    line-height: 1.3;

    .description {
      color: #b7c2c9;
      font-size: 12px;
    }

    +.feature-view {
      padding-top: 10px;
    }
  }

</style>

