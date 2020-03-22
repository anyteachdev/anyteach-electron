<template>
  <div id="sidenav">
    <el-dialog :visible.sync="state.terms" :modal-append-to-body="false">
      <Terms />
    </el-dialog>
    <div class="bottom">
      <span class="version">v{{ version }}</span>
      <span class="link" @click="state.terms=true">用户协议</span>
    </div>
    <div class="routes">
      <router-link
        class="route"
        v-for="route in routes"
        :key="route.title"
        tag="div"
        :to="route.to"
        :exact="route.exact"
      >
        <i :class="route.icon" />
        <span>{{ route.title }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { version } from "../../package.json"
import Terms from "@/views/terms/Terms"
export default {
  name: "SideNav",
  components: {
    Terms
  },
  data() {
    return {
      version,
      state: {
        terms: false,
      },
      routes: [
        {
          to: "/",
          icon: "anyteachicon anyteach-home",
          exact: true,
          title: "首页",
        },
        {
          to: "/videos",
          icon: "el-icon-video-camera",
          exact: false,
          title: "视频课",
        },
        // {
        //   to: "/today",
        //   icon: "anyteachicon anyteach-calendar",
        //   exact: false,
        //   title: "今天",
        // },
        // {
        //   to: "/schedule",
        //   icon: "anyteachicon anyteach-book-open",
        //   exact: false,
        //   title: "我的课程",
        // },
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
.el-dialog__body {
  padding-top: 0;
  margin-top: -10px;
}
</style>
<style scoped lang="scss">
#sidenav {
  @include height(100vh);
  width: 100%;
  border-right: $border;
  position: relative;
  -webkit-user-select: none;

  .bottom {
    position: absolute;
    bottom: 20px;
    text-align: center;
    width: 100%;
    span {
      font-size: 12px;
      display: block;
    }
    .version {
      opacity: 0.3;
      font-family: DIN alternate;
    }
    .link {
      cursor: pointer;
      transition: all 0.1s;
      &:hover {
        color: $color-primary;
      }
      &:active {
        opacity: 0.6;
      }
    }
  }

  .routes {
    .route {
      display: block;
      width: 100%;
      padding: 13px 25px;
      cursor: pointer;
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
      }
      i {
        font-size: 25px;
        margin-right: 5px;
        width: 30px;
        color: #909090;
      }
    }
    .router-link-active {
      background: $color-primary;
      span,
      i {
        color: white;
      }
    }
  }
}
</style>