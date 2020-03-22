<template>
  <div v-loading="!data" id="agreement" v-html="data" />
</template>

<script>
export default {
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
  h1 {
    font-size: 30px;
    margin-top: 0;
  }
  h2 {
    font-size: 20px;
  }
}
</style>
<style lang="scss" scoped>
#agreement {
  min-height: 90vh;
}
</style>