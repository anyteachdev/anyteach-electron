<template>
  <div id="error">
    <div>
      <i class="anyteachicon anyteach-cuowu" />
      <h1>{{ title }}</h1>
      <p>{{ msg }}</p>
      <el-link type="primary" @click="$emit('retry')">再试一次</el-link>
      <p class="error">错误代码：{{ code }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: "错误"
    },
    code: {
      default: ""
    },
    msg: {
      default: ""
    }
  },
  methods: {
    reload() {
      location.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
#error {
  position: fixed;
  left: 0;
  top: $topNavHeight;
  width: 100%;
  @include height(100vh);
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