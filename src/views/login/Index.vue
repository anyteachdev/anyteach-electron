<template>
  <div id="login">
    <h1>登陆 AnyTeach</h1>
    <el-form>
      <el-form-item>
        <el-input
          placeholder="已注册平台的手机号"
          prefix-icon="el-icon-mobile"
          type="number"
          v-model="form.phone"
        >
          <template slot="append">
            <el-button :disabled="!phoneValid" @click="sendSms">发送验证码</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="4 位短信验证码" type="number" v-model="form.code" />
      </el-form-item>
      <el-button type="primary" id="login-button" @click="submit">登陆</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      numRegExp: new RegExp("^[0-9]*$"),
      state: {
        loading: false,
        timeout: null
      },
      form: {
        phone: null,
        code: null
      },
      sms: {
        state: 0,
        countdown: 60,
      },
    }
  },
  computed: {
    phoneValid() {
      return this.form.phone && this.form.phone.length === 11 && this.numRegExp.test(this.form.phone)
    },
    codeValid() {
      return this.form.code && this.form.code.length >= 4 && this.numRegExp.test(this.form.code)
    },
    login() {
      return this.$store.state.login
    }
  },
  watch: {
    login: function (val) {
      if (val) {
        this.$router.push(this.$route.query.from)
      }
    }
  },
  methods: {
    async submit() {
      if (!this.phoneValid) return this.$message.error("请输入手机号")
      if (!this.codeValid) return this.$message.error("请输入验证码")
      try {
        const { code, msg } = await this.$api.auth.PHONE_LOGIN({
          phone: this.form.phone,
          number: this.form.code,
        })
        if (parseInt(code) >= 2000) {
          return this.$message.error(`${msg}（${code}）`)
        }
        const { user, jwt } = msg
        this.$store.commit("user", user)
        this.$store.commit("jwt", jwt)
        this.$store.dispatch("login")
        this.$message.success("登陆成功")
      } catch (error) {
        throw new Error(error)
      }
    },
    async sendSms() {
      if (this.sms.state === 1) {
        return
      }
      // if (this.form.phone.length < 11) {
      //   this.$refs.phoneInput.focus()
      //   return this.$toast("请输入 11 位手机号")
      // }
      this.setSmsCountdown()
      this.sms.state = 1
      this.smsCode = ""

      try {
        const { code, msg } = await this.$api.auth.SEND_SMS(this.form.phone)
        if (code != 1000) {
          return this.$message.error(`${msg}（${code}）`)
        }
        return this.$message.success("已发送短信验证码")
      } catch (err) {
        this.$message.error("发送验证码失败，请稍后重试")
        throw new Error(err)
      }
    },
    setSmsCountdown() {
      // const timeout = (this.sms.countdown + 1) * 1000
      // this.state.timeout = setTimeout(() => {
      //   window.clearInterval(countdown)
      //   this.sms.countdown = timeout / 1000 - 1
      //   this.sms.state--
      // }, timeout)

      // const countdown = window.setInterval(() => {
      //   this.sms.countdown--
      // }, 1000)
    },
  }
}
</script>

<style lang="scss" scoped>
#login {
  width: 400px;
  margin: 0 auto;
  padding: 50px 0 0 0;
  h1 {
    // text-align: center;
  }
  #login-button {
    width: 100%;
  }
}
</style>