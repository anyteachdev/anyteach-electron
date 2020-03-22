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
    component: () => import("../views/login/Index.vue")
  },
  {
    path: "/today",
    name: "Today",
    component: () => import("../views/today/Index.vue"),
    meta: {
      sideNav: true
    }
  },
  {
    path: "/terms",
    name: "Terms",
    component: () => import("../views/terms/Index.vue"),
    meta: {
      sideNav: true
    }
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("../views/schedule/Index.vue"),
    meta: {
      sideNav: true
    }
  },
  {
    path: "/videos",
    name: "Videos",
    component: () => import("../views/video-courses/Index.vue"),
    meta: {
      sideNav: true,
      keepAlive: true
    }
  },
  {
    path: "/videos/watch/:id",
    name: "WatchVideo",
    component: () => import("../views/video/Index.vue"),
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
