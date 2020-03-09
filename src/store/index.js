import Vue from "vue"
import Vuex from "vuex"
import api from "../api"

Vue.use(Vuex)

export default new Vuex.Store({
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
    online(state, online) {
      state.online = online
    },
    jwt(state, jwt) {
      state.jwt = jwt
    },
    login(state, status = true) {
      state.login = status
      if (!status) {
        state.user = {}
        state.jwt = ""
      }
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
        context.commit("login", true)
      } else {
        context.commit("login", false)
      }
    },
    async logout(context) {
      const { code } = await api.auth.LOGOUT()
      if (code === "1000") {
        context.commit("login", false)
        context.commit("user", {})
        context.commit("jwt", null)
      }
    }
  },
  modules: {}
})
