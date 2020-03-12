<template>
  <div></div>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      timeout: null
    }
  },
  watch: {
    trigger: function (val) {
      if (val) {
        this.startTimer()
      } else {
        window.clearTimeout(this.timeout)
      }
    }
  },
  beforeDestroy() {
    window.clearTimeout(this.timeout)
  },
  methods: {
    startTimer() {
      const messages = ["我是好学生", "别拦着我", "我要学习", "哪有", "不不不", "学习不能停", "别停", "课不能停", "我不累", "学习不会累", "快点"]
      const random = Math.floor(Math.random() * Math.floor(messages.length))
      const confirmButtonText = `${messages[random]}，继续播放`
      if (this.timeout) {
        window.clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.$emit("pause")
        this.$confirm("您已经学习一段时间了", "休息一下吧", {
          confirmButtonText,
          cancelButtonText: "暂停",
          confirmButtonClass: "_confirm"
        }).then(() => {
          this.$emit("play")
        }).catch(() => { })
        setTimeout(() => {
          document.querySelector("._confirm").blur()
        }, 0)
      }, this.interval * 1000)
    }
  },
}
</script>