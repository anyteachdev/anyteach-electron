<template>
  <div id="login">
    <Welcome :stage="state.stage" />
    <Phone @phone="phone = $event" @stage="state.stage = $event" />
    <fade>
      <Code :phone="phone" v-if="state.stage === 1" />
    </fade>
  </div>
</template>

<script>
import Welcome from "./Welcome"
import Phone from "./Phone"
import Code from "./Code"
export default {
  name: "Login",
  components: {
    Welcome,
    Phone,
    Code
  },
  data() {
    return {
      numRegExp: new RegExp("^[0-9]*$"),
      state: {
        loading: false,
        stage: 0
      },
      phone: "",
    }
  },
  computed: {
    login() {
      return this.$store.state.login
    }
  },
  watch: {
    login: function (val) {
      if (val) {
        this.$router.push("/")
      }
    }
  },
}
</script>

<style lang="scss" scoped>
#login {
  -webkit-user-select: none;
  width: 250px;
  margin: 0 auto;
  padding: 100px 0 0 0;
}
</style>