import Vue from "vue"
import Vuex from "vuex"
import api from "../api"
import socket from "./socket"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    socket
  },
  state: {
    user: {},
    jwt: null,
    login: undefined,
    history: [],
    routeIndex: -1,
    online: true
  },
  mutations: {
    user(state, user) {
      state.user = user
    },
    login(state, status) {
      state.login = status
      if (!status) {
        state.user = {}
        state.jwt = ""
      }
    },
    online(state, online) {
      state.online = online
    },
    jwt(state, jwt) {
      state.jwt = jwt
    },
    back(state) {
      state.routeIndex--
    },
    next(state, route) {
      const nextInStack = state.history[state.routeIndex + 1]
      if (
        // Real new route
        !nextInStack ||
        (nextInStack && nextInStack.fullPath !== route.fullPath)
      ) {
        state.history.push(route)
        state.routeIndex = state.history.length - 1
      } else {
        // On press next button
        state.routeIndex++
      }
    }
  },
  actions: {
    async user(context) {
      const { code, msg } = await api.user.PROFILE()
      if (code === "1000") {
        context.commit("user", msg)
        context.dispatch("login", true)
      } else {
        context.dispatch("login", false)
      }
    },
    login({ state, commit, dispatch }, status = true) {
      commit("login", status)

      if (!state.socket.client) {
        dispatch("socket/init")
        dispatch("socket/log", {
          url: location.href,
          name: "desktop_connect",
          data: navigator.userAgent
        })
      }
      if (status) {
        dispatch("socket/log", {
          url: location.href,
          name: "login",
          data: state.user.user_id
        })
      }
    },
    async logout(context) {
      const { code } = await api.auth.LOGOUT()
      if (code === "1000") {
        context.dispatch("login", false)
        context.dispatch("socket/log", {
          url: location.href,
          name: "logout",
          data: navigator.userAgent
        })
        context.commit("user", {})
        context.commit("jwt", null)
      }
    }
  }
})
