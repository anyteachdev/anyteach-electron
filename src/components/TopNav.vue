<template>
  <div class="header" v-if="$route.path !== '/login'">
    <div class="buttons">
      <div class="item" :class="{ disabled : !canBack }" @click="back">
        <i class="el-icon-arrow-left" />
      </div>
      <div class="item" :class="{ disabled : !canNext }" @click="next">
        <i class="el-icon-arrow-right" />
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
    // background: #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 70px;
    .item {
      cursor: pointer;
      color: $color-primary;
      display: inline-block;
      $size: 30px;
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