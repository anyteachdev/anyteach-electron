<template>
  <div id="sidenav">
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
</template>

<script>
export default {
  name: "SideNav",
  data() {
    return {
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

<style scoped lang="scss">
@import "../styles/base.scss";
#sidenav {
  @include height(100vh);
  width: 100%;
  border-right: 1px solid #eaeaea;

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
    background: #0183ff;
    span,
    i {
      color: white;
    }
  }
}
</style>