<template>
  <div id="terms">
    <div id="top">请完整阅读用户协议</div>
    <Terms />
    <div class="buttons">
      <el-button @click="submit" type="primary" round class="button">同意协议</el-button>
      <el-link :underline="false" @click="logout()" class="link">不同意，退出登陆</el-link>
    </div>
  </div>
</template>

<script>
import Terms from "@/views/terms/Terms"
export default {
  components: {
    Terms
  },
  methods: {
    submit() {
      this.$router.push("/")
    },
    logout() {
      this.$store.dispatch("logout")
      this.$emit("stage", 0)
    }
  },
}
</script>

<style lang="scss" scoped>
#terms {
  width: 800px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.6;
  padding-top: 20px;
  #top {
    position: fixed;
    color: $color-primary;
    font-weight: bold;
    border-bottom: 1px solid $color-border;
    width: 100%;
    top: 0;
    left: 0;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #agreement {
    min-height: 90vh;
  }

  .buttons {
    margin: 30px auto 50px auto;
  }
  .button {
    display: block;
    margin: 0 auto 10px auto;
  }
  .link {
    display: block;
    margin: 0 auto;
    text-align: center;
  }
}
</style>