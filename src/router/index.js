import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      sideNav: true,
      keepAlive: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login/Index.vue")
  },
  {
    path: "/today",
    name: "Today",
    component: () =>
      import(/* webpackChunkName: "today" */ "../views/today/Index.vue"),
    meta: {
      sideNav: true
    }
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () =>
      import(/* webpackChunkName: "schedule" */ "../views/schedule/Index.vue"),
    meta: {
      sideNav: true
    }
  },
  {
    path: "/videos",
    name: "Videos",
    component: () =>
      import(
        /* webpackChunkName: "Videos" */ "../views/video-courses/Index.vue"
      ),
    meta: {
      sideNav: true,
      keepAlive: true
    }
  },
  {
    path: "/videos/watch/:id",
    name: "WatchVideo",
    component: () =>
      import(/* webpackChunkName: "WatchVideo" */ "../views/video/Index.vue"),
    meta: {
      sideNav: false
    }
  }
]

const router = new VueRouter({
  routes,
  mode: "hash"
})

export default router
