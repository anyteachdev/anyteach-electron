<template>
  <div id="watermark">
    <div v-for="i in 10" :key="i" class="overlay">
      <p
        v-for="j in 20"
        :key="j"
      >{{ $store.state.user.name }} {{ $store.state.user.mobile || $store.state.user.user_id }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Watermark"
}
</script>
<style scoped lang="scss">
#watermark {
  height: calc(100% - 40px);
  height: 100%;
  z-index: 100000;
  position: absolute;
  top: 0;
  width: 200%;
  overflow: hidden;
  opacity: 0.5;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: none;
  -webkit-user-select: none;
}
.overlay {
  transform: rotate(-25deg) translateY(-150px);
  overflow: visible;
  position: relative;
  display: inline-block;
  color: white;
  margin: 0 50px 0 0;
  p {
    margin: 0 0 80px 0;
    font-size: 14px;
  }
}

.prism-fullscreen {
  .overlay {
    margin: 0 100px 0 0;
  }
  .overlay p {
    font-size: 16px;
    margin-bottom: 120px;
  }
}
</style>