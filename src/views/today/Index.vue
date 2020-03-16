<template>
  <div id="today"></div>
</template>

<script>
export default {
  name: "Today",
  data() {
    return {}
  },
  methods: {
    async getToday() {
      const data = await this.$api.schedule.DAY_TIMES("2020-03-07")
    }
  },
  created() {
    this.getToday()
  }
}
</script>

<style scoped lang="scss">
#today {
}
</style>