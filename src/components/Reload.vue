<template>
  <div id="reload">
    <div>
      <i class="anyteachicon anyteach-cuowu" />
      <h1>加载失败</h1>
      <p>啊哦，好像碰到错误了</p>
      <el-link type="primary" @click="reload">点击刷新</el-link>
      <p class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  methods: {
    reload() {
      location.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
#reload {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  text-align: center;
  -webkit-user-select: none;
  .error {
    position: fixed;
    bottom: 20px;
    width: 100%;
    padding: 0 30px;
    left: 0;
    font-size: 12px;
    opacity: 0.6;
    text-align: center;
  }
  i {
    font-size: 80px;
  }
  h1 {
    margin: 0 0 10px 0;
  }
  p {
    margin: 0 0 20px 0;
  }
  h1,
  i {
    color: $color-primary;
  }
}
</style>