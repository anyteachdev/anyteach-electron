<template>
  <div id="phone">
    <div class="input-wrapper">
      <div class="input">
        <span>+86</span>
        <input
          :disabled="!isActive"
          v-model="phone"
          type="text"
          maxlength="11"
          ref="input"
          placeholder="您已注册平台的手机号"
          @keyup.enter="send"
        />
        <fade>
          <i
            v-if="phone.length && isActive"
            class="anyteachicon anyteach-gary"
            @click="phone = ''; $refs.input.focus()"
          />
          <span @click="$emit('stage', 1); $refs.input.focus()" class="edit" v-if="!isActive">更改</span>
        </fade>
      </div>
      <fade enter="shake">
        <p class="hint" v-if="hint && isActive">{{ hint }}</p>
      </fade>
    </div>
    <div class="buttons">
      <el-button
        :loading="state.loading"
        v-if="isActive"
        @click="send"
        type="primary"
        round
        class="button"
      >发送验证码</el-button>
      <el-link v-if="isActive" :underline="false" @click="$emit('stage', 0)">取消</el-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ["stage"],
  data() {
    return {
      state: {
        loading: false
      },
      numRegExp: new RegExp("^[0-9]*$"),
      phone: "",
      hint: null
    }
  },
  computed: {
    isActive() {
      return this.stage === 1
    }
  },
  watch: {
    "stage": function (val) {
      this.$emit("phone", this.phone)
    },
    phone: function (newVal, oldVal) {
      if (newVal.indexOf(" ") > 0 || newVal.length > 11 || !this.numRegExp.test(newVal)) {
        this.phone = oldVal
      } else {
        this.hint = null
      }
      if (newVal.length === 11 && this.numRegExp.test(newVal)) {
        this.$refs.input.blur()
        this.send()
      }
    },
  },
  methods: {
    async send() {
      if (this.phone.length !== 11 || !this.numRegExp.test(this.phone)) {
        this.$refs.input.focus()
        return this.hint = "请输入正确的手机号"
      }
      this.state.loading = true
      try {
        const { code, msg } = await this.$api.auth.SEND_SMS(this.phone)
        this.state.loading = false
        if (code != 1000) {
          this.$refs.input.focus()
          return this.hint = `${msg}（${code}）`
        }
        this.$emit("stage", 2)
      } catch (err) {
        this.$refs.input.focus()
        this.$emit("stage", 1)
        this.state.loading = false
        this.hint = "发送验证码失败，请稍后重试"
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
#phone {
}
</style>