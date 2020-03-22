<template>
  <div id="login">
    <el-dialog title="请完整阅读至底部" :visible.sync="state.terms" :modal-append-to-body="false">
      <Terms
        v-if="state.stage === 0"
        @agree="state.stage = 1; state.terms = false"
        :buttons="true"
      />
    </el-dialog>
    <div class="wrapper">
      <Welcome :stage="state.stage" />
      <transition name="fade" mode="out-in">
        <el-button
          v-if="state.stage === 0"
          @click="state.terms = true"
          type="primary"
          round
          class="button"
        >手机号登录</el-button>
        <Phone
          v-if="state.stage > 0"
          :stage="state.stage"
          @phone="phone = $event"
          @stage="state.stage = $event"
        />
      </transition>
      <fade>
        <Code @stage="state.stage = $event" :phone="phone" v-if="state.stage === 2" key="0" />
      </fade>
    </div>
  </div>
</template>

<script>
import Welcome from "./Welcome"
import Phone from "./Phone"
import Code from "./Code"
import Terms from "@/views/terms/Terms"
export default {
  name: "Login",
  components: {
    Welcome,
    Phone,
    Code,
    Terms
  },
  data() {
    return {
      numRegExp: new RegExp("^[0-9]*$"),
      state: {
        stage: 0,
        terms: false
      },
      phone: "",
    }
  },
  computed: {
    login() {
      return this.$store.state.login
    }
  },
  mounted() {
    if (this.login) {
      this.$router.push("/")
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
#login {
  -webkit-user-select: none;
}
.wrapper {
  padding: 100px 0 0 0;
  margin: 0 auto;
  width: 250px;
}
</style>