<template>
  <div class="header" v-if="$route.path !== '/login'">
    <div class="buttons">
      <div class="item" :class="{ disabled : !canBack }" @click="back">
        <i class="el-icon-arrow-left" />
      </div>
      <div class="item" :class="{ disabled : !canNext }" @click="next">
        <i class="el-icon-arrow-right" />
      </div>
      <div class="item" :class="{ disabled : $route.path === '/' }" @click="home">
        <i class="anyteachicon anyteach-home" />
      </div>
      <div class="item" v-if="isDevtools" @click="openDevtools">
        <i class="el-icon-info" />
      </div>
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
    },
    isDevtools() {
      // TODO: 条件为已登录并且当前用户存在于 electron_debug_users 列表里
      return this.$store.state.login
    }
  },
  methods: {
    bgd(url) {
      return `
      background-image: url('${url}'); 
      background-color: $color-bgd;
      background-size: cover;
      background-position: center center;
      `
    },
    async getDebugUsers() {
      // TODO: 用 this.$api.api.CUSTOM 获取 electron_debug_users
    },
    openDevtools() {
      // TODO: 使用 electron 进程间的通讯，让主进程打开 devtools
    },
    back() {
      if (this.canBack) {
        this.$router.go(-1)
      }
    },
    next() {
      if (this.canNext) {
        this.$router.go(1)
      }
    },
    home() {
      this.$router.push("/")
    },
    logout() {
      this.$confirm("确认退出？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        this.$store.dispatch("logout")
      }).catch(() => { })
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  height: $topNavHeight;
  position: fixed;
  width: 100%;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: $border;
  padding: 0 25px;
  -webkit-app-region: drag;
  -webkit-user-select: none;

  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      cursor: pointer;
      color: $color-primary;
      display: inline-block;
      $size: 30px;
      margin-right: 5px;
      width: $size;
      height: $size;
      border-radius: $size;
      position: relative;
      transition: all 0.1s;
      &:hover {
        background: #f7f7f7;
      }
      &:active {
        i {
          font-size: 17px;
        }
      }
      i {
        position: absolute;
        font-size: 20px;
        transition: all 0.1s;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .disabled {
      opacity: 0.2;
      &:hover {
        background: none;
      }
    }
  }

  .user {
    display: flex;
    align-items: center;
    color: $color-plain;

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