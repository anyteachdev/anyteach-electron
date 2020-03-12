<template>
  <div id="app" v-loading="!state.error && $store.state.login === undefined && $store.state.online">
    <Offline v-if="!$store.state.online" />
    <Reload :error="state.error" v-else-if="state.error" />
    <TopNav v-if="$route.path !== '/login'" />
    <el-container class="app-container">
      <el-aside v-if="$route.meta.sideNav" width="200px">
        <SideNav />
      </el-aside>
      <el-main :class="{ 'no-padding' : !$route.meta.sideNav }">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav"
import SideNav from "@/components/SideNav"
import Offline from "@/components/Offline"
import Reload from "@/components/Reload"

export default {
  name: "App",
  components: {
    TopNav,
    SideNav,
    Offline,
    Reload
  },
  data() {
    return {
      state: {
        error: false
      }
    }
  },
  methods: {
    async getProfile() {
      try {
        await this.$store.dispatch("user")
      } catch (error) {
        this.state.error = error.message
      }
    },
  },
  computed: {
    login() {
      return this.$store.state.login
    },
    history() {
      return this.$store.state.history
    },
    routeIndex() {
      return this.$store.state.routeIndex
    },
  },
  watch: {
    login(val) {
      if (!val) {
        const config = {
          path: "/login",
          query: {
            from: this.$route.fullPath,
          }
        }
        this.$router.push(config).catch(err => err)
      }
    }
  },
  created() {
    this.$router.afterEach(to => {
      if (this.routeIndex <= 0) {
        return this.$store.commit("next", to)
      }
      if (
        to.fullPath !== this.history[this.routeIndex - 1].fullPath
      ) {
        this.$store.commit("next", to)
      } else {
        this.$store.commit("back")
      }
    })
    this.$store.commit("online", navigator.onLine)
    window.addEventListener("online", () => {
      this.$store.commit("online", navigator.onLine)
      this.getProfile()
    })
    window.addEventListener("offline", () => {
      this.$store.commit("online", navigator.onLine)
    })
  },
  mounted() {
    this.getProfile()
    if (this.$route.path === "/") {
      this.$store.commit("next", this.$route)
    }
  }
}
</script>
<style lang="scss">
@import "./styles/app.scss";

#app {
  height: 100%;
}

.app-container {
  position: fixed;
  top: $topNavHeight;
  width: 100%;
  @include height(100vh);
}
</style>
