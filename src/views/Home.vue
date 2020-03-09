<template>
  <div class="home">
    <div v-if="$store.state.login">
      <el-button @click="openVideo">打开视频</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    openVideo() {
      this.$router.push("/video/watch/" + "635906f563ec401ab470fca80a1c88bc")
    }
  }
}
</script>
