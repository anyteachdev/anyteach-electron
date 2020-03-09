<template>
  <div id="app" v-loading="$store.state.login === undefined && $store.state.online">
    <Offline v-if="!$store.state.online" />
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

export default {
  name: "App",
  components: {
    TopNav,
    SideNav,
    Offline
  },
  data() {
    return {
    }
  },
  methods: {
    async getProfile() {
      try {
        await this.$store.dispatch("user")
      } catch (error) {
        throw new Error(error)
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
<style>
@import "//at.alicdn.com/t/font_258157_aigzetzkq1e.css";
</style>
<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  box-sizing: border-box;
}
#app {
  height: 100%;
}

.app-container {
  position: fixed;
  top: $topNavHeight;
  width: 100%;
  @include height(100vh);
}
.no-padding {
  padding: 0;
}
</style>
