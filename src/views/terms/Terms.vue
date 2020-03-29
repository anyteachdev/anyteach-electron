<template>
  <div id="agreement">
    <div class="container" v-loading="!data" v-html="data" />
    <div v-if="buttons" class="buttons">
      <el-button @click="$emit('agree', true)" type="primary" round class="button">同意协议</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttons: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: ""
    }
  },
  methods: {
    async getData() {
      const { value_1 } = await this.$api.api.CUSTOM("user_agreement_desktop")
      this.data = value_1
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss">
#agreement {
  user-select: text;
  color: $color-plain;
  font-size: 13px;
  h1 {
    font-size: 25px;
    margin-top: 10px;
  }
  h2 {
    font-size: 18px;
  }
}
</style>
<style lang="scss" scoped>
#agreement {
  .container {
    min-height: 60vh;
  }

  .buttons {
    .button {
      margin: 30px auto 0 auto;
      display: block;
    }
  }
}
</style>