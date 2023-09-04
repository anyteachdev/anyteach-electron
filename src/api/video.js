
import axios from "axios"
import { PHP_API } from "./config"

export default {
  CLASSES: async function(params) {
    const url = PHP_API + "/video/courses/all"
    try {
      const config = {
        url,
        method: "GET",
        params
      }
      const { data } = await axios(config)
      const { code, msg } = data
      return code === "1000" ? msg : []
    } catch (err) {
      throw new Error(err)
    }
  },
  LESSONS: async function(params) {
    const url = PHP_API + "/video/course/getList"
    // params: s_id, l_id
    try {
      const config = {
        url,
        method: "GET",
        params
      }
      const { data } = await axios(config)
      const { code, msg } = data
      return code === "1000" ? msg : null
    } catch (err) {
      throw new Error(err)
    }
  },
  PLAY: async function({ socket_id, l_id }) {
    const url = PHP_API + "/video/courses/play_url"
    try {
      const config = {
        url,
        method: "GET",
        params: { socket_id, l_id }
      }
      const { data } = await axios(config)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },
  COMPLETE: async function({ play_id }) {
    const url = PHP_API + "/video/courses/complete"
    try {
      const config = {
        url,
        method: "GET",
        params: { play_id }
      }
      const { data } = await axios(config)
      return data
    } catch (err) {
      throw new Error(err)
    }
  }
}
