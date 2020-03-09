import axios from "axios"
import { PHP_API } from "./config"

const prefix = PHP_API + "/index/user/"

function path(method) {
  return prefix + method
}

export default {
  FIND: async id => {
    try {
      const config = {
        url: PHP_API + "/user/index/getData",
        method: "GET",
        params: { id }
      }
      const { data } = await axios(config)
      const { code, msg } = data
      return code == 1000 ? msg : null
    } catch (err) {
      throw new Error(err)
    }
  },
  TYPE: async (u_id = "") => {
    const config = {
      url: path("type"),
      method: "GET",
      params: {
        u_id
      }
    }
    try {
      const { data } = await axios(config)
      return data.msg
    } catch (err) {
      throw new Error(err)
    }
  },
  PROFILE: async () => {
    const config = {
      url: path("profile/"),
      method: "GET"
    }
    try {
      const { data } = await axios(config)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },
  IS_LOGIN: async () => {
    const config = {
      url: path("/isSession"),
      type: "GET",
      xhrFields: {
        withCredentials: true
      }
    }
    try {
      const { data } = await axios(config)
      const { code } = data
      return code == 1000
    } catch (err) {
      throw new Error(err)
    }
  },
  FOLLOW_STATUS: async () => {
    const config = {
      url: path("follow"),
      type: "GET"
    }
    try {
      const { data } = await axios(config)
      const { code } = data
      return code
    } catch (err) {
      throw new Error(err)
    }
  },
  UPDATE_STUDENT: async ({
    student_name,
    student_name_eng,
    student_age,
    student_gender
  }) => {
    const config = {
      url: PHP_API + "/user/info/update_student",
      method: "POST",
      data: {
        student_name,
        student_name_eng,
        student_age,
        student_gender
      }
    }
    try {
      const { data } = await axios(config)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },
  GET_INVITE_RECORD: async () => {
    const url = PHP_API + "/user/info/getLowerOrder"
    try {
      const { data } = await axios(url)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },
  GET_INVITE_FRIENDS: async () => {
    const url = PHP_API + "/user/info/getFriends"
    try {
      const { data } = await axios(url)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },
  LOCATION: async () => {
    const url = path("getUserCityV2")
    try {
      const { data } = await axios(url)
      return data.msg
    } catch (err) {
      throw new Error(err)
    }
  },
  CONTACT: async () => {
    const url = path("contact")
    try {
      const { data } = await axios(url)
      const { code, msg } = data
      return code == 1000 ? msg : null
    } catch (err) {
      throw new Error(err)
    }
  },
  GET_COUPON: async () => {
    const config = {
      url: PHP_API + "/user/coupon/giveCoupon",
      method: "POST"
    }
    try {
      const { data } = await axios(config)
      const { code, msg } = data
      return code == 1000 ? msg : []
    } catch (err) {
      throw new Error(err)
    }
  }
}
