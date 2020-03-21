<template>
  <transition :enter-active-class="'animated ' + enter" :leave-active-class="'animated ' + leave">
    <slot />
  </transition>
</template>

<script>
export default {
  props: {
    enter: {
      default: "fadeIn"
    },
    leave: {
      default: "fadeOut"
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/animate.css";
.animated {
  animation-duration: 0.3s;
}

.shake {
  animation-duration: 0.6s;
}
</style>