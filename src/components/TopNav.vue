<template>
  <div class="header" v-if="$route.path !== '/login'">
    <div class="buttons">
      <el-button
        :disabled="!canBack"
        size="mini"
        circle
        icon="el-icon-arrow-left"
        @click="$router.go(-1)"
      ></el-button>
      <el-button
        :disabled="!canNext"
        size="mini"
        circle
        icon="el-icon-arrow-right"
        @click="$router.go(1)"
      ></el-button>
    </div>
    <el-dropdown>
      <span class="el-dropdown-link">
        <div class="user">
          <div class="img" :style="bgd($store.state.user.gravatar)" />
          <span>{{ $store.state.user.name }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span @click="logout()">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>

export default {
  computed: {
    canBack() {
      return this.$store.state.routeIndex < this.$store.state.history.length && this.$store.state.routeIndex > 0
    },
    canNext() {
      return this.$store.state.routeIndex < this.$store.state.history.length - 1
    }
  },
  methods: {
    bgd(url) {
      return `
      background-image: url('${url}'); 
      background-color: #eee;
      background-size: cover;
      background-position: center center;
      `
    },
    logout() {
      this.$confirm("确认退出？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("logout")
      }).catch(() => { })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../styles/base.scss";
.header {
  height: $topNavHeight;
  position: fixed;
  width: 100%;
  display: flex;
  top: 0;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
  padding: 0 25px;
  -webkit-app-region: drag;
  -webkit-user-select: none;

  .user {
    display: flex;
    align-items: center;

    .img {
      $size: 35px;
      width: $size;
      height: $size;
      border-radius: $size;
      margin-right: 5px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>