<template>
  <div id="login">
    <div v-show="state.stage < 2" class="wrapper">
      <Welcome :stage="state.stage" />
      <Phone :stage="state.stage" @phone="phone = $event" @stage="state.stage = $event" />
      <fade>
        <Code @stage="state.stage = $event" :phone="phone" v-if="state.stage === 1" />
      </fade>
    </div>
    <fade>
      <Terms @stage="state.stage = $event" v-if="state.stage === 2" />
    </fade>
  </div>
</template>

<script>
import Welcome from "./Welcome"
import Phone from "./Phone"
import Code from "./Code"
import Terms from "./Terms"
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
  mounted() {
    if (this.login) {
      this.$router.push("/")
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  -webkit-user-select: none;
}
.wrapper {
  padding: 100px 0 0 0;
  margin: 0 auto;
  width: 250px;
}
</style>