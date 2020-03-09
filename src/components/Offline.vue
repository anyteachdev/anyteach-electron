<template>
  <div id="offline">
    <div>
      <i class="anyteachicon anyteach-wuwangluo" />
      <h1>无法连接</h1>
      <p>啊哦，您的网络好像断开了</p>
      <el-link type="primary" @click="reload">尝试刷新</el-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    reload() {
      location.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
#offline {
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