import axios from "axios"
import { PHP_API } from "./config"
export default {
  CUSTOM: async function(key) {
    const url = PHP_API + "/index/api/getCustom"
    try {
      const config = {
        url,
        method: "GET",
        params: { key }
      }
      const { data } = await axios(config)
      const { code, msg } = data
      return code === "1000" ? msg : null
    } catch (err) {
      throw new Error(err)
    }
  },
  TYPE: async function() {
    const url = PHP_API + "/index/api/getType"
    try {
      const config = {
        url,
        method: "GET"
      }
      const { data } = await axios(config)
      const { code, msg } = data
      return code === "1000" ? msg : null
    } catch (err) {
      throw new Error(err)
    }
  }
}
