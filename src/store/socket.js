
import io from "socket.io-client"
import { NODE_API } from "../api/config"
export default {
  namespaced: true,
  state: {
    client: undefined,
    id: null,
    queue: []
  },
  mutations: {
    client(state, { emit, data }) {
      if (!state.client) {
        state.queue.push({ emit, data })
      } else {
        state.client.emit(emit, data)
      }
    }
  },
  actions: {
    init({ state, dispatch, rootState }) {
      state.client = io(NODE_API + "/user", {
        query: {
          user_id: rootState.user.user_id || 0
        }
      })
      if (state.queue.length) {
        state.queue.forEach(job => {
          dispatch("log", job)
        })
        state.queue = []
      }
      state.client.on("socket_id", socket_id => {
        state.id = socket_id
      })
    },
    log({ state }, data) {
      if (!state.client) {
        state.queue.push(data)
      } else {
        state.client.emit("message", data)
      }
    }
  }
}
