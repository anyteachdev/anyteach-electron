<template>
  <div id="welcome" ref="main">
    <transition name="fade" mode="out-in">
      <div class="item" v-if="stage === 0" key="0">
        <img src="@/../build/icon.png" />
        <h1>AnyTeach</h1>
        <p>观看直播课回放</p>
      </div>
      <div class="item" v-if="stage === 1" key="1">
        <i class="anyteachicon anyteach-yanzhengma" />
        <h1>请查收短信</h1>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    stage: {
      type: Number,
      default: 0
    }
  },
  watch: {
    stage: function (val) {
      if (val === 0) {
        this.$refs.main.style.height = "170px"
      }
      if (val === 1) {
        this.$refs.main.style.height = "110px"
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/animate.css";
#welcome {
  text-align: center;
  height: 170px;
  transition: all 0.3s;
  position: relative;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.item {
  position: absolute;
  width: 100%;
  i {
    color: $color-primary;
    font-size: 50px;
  }
}

.fade-enter {
  transform: translateY(15px);
  opacity: 0;
}
.fade-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}

.animated {
  animation-delay: 0s !important;
  animation-duration: 0.3s !important;
}
img {
  width: 100px;
}
h1 {
  margin: 0;
  padding: 0 0 3px 0;
  font-size: 20px;
  font-weight: 600;
}
p {
  margin: 0;
  padding: 0;
  opacity: 0.6;
  font-size: 14px;
}
</style>