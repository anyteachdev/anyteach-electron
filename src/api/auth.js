import axios from "axios"
import { PHP_API } from "./config"

export default {
  LOGOUT: async function() {
    const url = PHP_API + "/index/auth/logout"
    try {
      const { data } = await axios(url)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },
  SEND_SMS: async function(phone) {
    const url = PHP_API + "/auth/login/sms"
    try {
      const config = {
        url,
        method: "POST",
        data: { phone }
      }
      const { data } = await axios(config)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },
  PHONE_LOGIN: async function({ phone, number }) {
    const url = PHP_API + "/auth/login/phoneLogin"
    try {
      const config = {
        url,
        method: "POST",
        data: { phone, number }
      }
      const { data } = await axios(config)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },
  FIND_USER: async id => {
    try {
      const config = {
        url: PHP_API + "/auth/login/getData",
        type: "GET",
        params: { id }
      }
      const { data } = await axios(config)
      const { code, msg } = data
      return code == 1000 ? msg : ""
    } catch (err) {
      throw new Error(err)
    }
  }
}
