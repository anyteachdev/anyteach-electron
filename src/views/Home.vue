<template>
  <div id="home">
    <div class="text">
      <h1>您好，欢迎登陆</h1>
      <router-link tag="span" to="/videos">
        <el-link type="primary">
          看看视频课
          <i class="el-icon-right" />
        </el-link>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
  }
}
</script>

<style lang="scss" scoped>
#home {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  @include height(80vh);
  .text {
  }
}
</style>
