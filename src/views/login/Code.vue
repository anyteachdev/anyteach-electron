<template>
  <div id="code">
    <div class="input-wrapper">
      <div class="input no-top">
        <input
          v-model="code"
          type="text"
          maxlength="4"
          ref="input"
          placeholder="输入 4 位验证码"
          @keyup.enter="submit"
        />
        <fade>
          <i
            v-if="code.length"
            class="anyteachicon anyteach-gary"
            @click="code = ''; $refs.input.focus()"
          />
        </fade>
      </div>
      <fade enter="shake">
        <p class="hint" v-if="hint">{{ hint }}</p>
      </fade>
    </div>
    <el-button :loading="state.loading" @click="submit" type="primary" round class="button">登陆</el-button>
  </div>
</template>
<script>
export default {
  name: "Code",
  props: ["phone"],
  data() {
    return {
      state: {
        loading: false
      },
      code: "",
      hint: "",
      numRegExp: new RegExp("^[0-9]*$"),
    }
  },
  watch: {
    code: function (newVal, oldVal) {
      if (newVal.indexOf(" ") > 0 || newVal.length > 4 || !this.numRegExp.test(newVal)) {
        this.code = oldVal
      } else if (newVal !== "") {
        this.hint = null
      }
      if (newVal.length === 4 && this.numRegExp.test(newVal)) {
        this.$refs.input.blur()
        this.submit()
      }
    },
  },
  methods: {
    async submit() {
      if (this.code.length !== 4 || !this.numRegExp.test(this.code)) {
        this.$refs.input.focus()
        return this.hint = "请输入 4 位验证码"
      }
      this.state.loading = true
      try {
        const { code, msg } = await this.$api.auth.PHONE_LOGIN({
          phone: this.phone,
          number: this.code,
        })
        this.state.loading = false
        if (parseInt(code) >= 2000) {
          this.code = ""
          return this.hint = `${msg}（${code}）`
        }
        const { user, jwt } = msg
        this.$store.commit("user", user)
        this.$store.commit("jwt", jwt)
        this.$store.dispatch("login")
        // this.$router.push("/")
        // this.$message.success("登陆成功")
        this.$emit("stage", 2)
      } catch (error) {
        this.state.loading = false
        this.hint = "登陆失败，请重试"
      }
    }
  },
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>