import axios from "axios"
import { PHP_API } from "./config"

export default {
  SCHEDULE: async function() {
    const url = PHP_API + "/schedule/info/schedule"
    try {
      const { data } = await axios(url)
      const { code, msg } = data
      return code === "1000" ? msg : []
    } catch (err) {
      throw new Error(err)
    }
  },
  TIMES: async function(s_id) {
    const url = PHP_API + "/schedule/info/times"
    try {
      const config = {
        url,
        method: "GET",
        params: { s_id }
      }
      const { data } = await axios(config)
      const { code, msg } = data
      return code === "1000" ? msg : []
    } catch (err) {
      throw new Error(err)
    }
  },
  DAY_TIMES: async function(start_time, end_time) {
    const url = PHP_API + "/schedule/info/getDayTimes"
    try {
      const config = {
        url,
        method: "GET",
        params: { start_time, end_time }
      }
      const { data } = await axios(config)
      const { code, msg } = data
      return code === "1000" ? msg : []
    } catch (err) {
      throw new Error(err)
    }
  }
}
