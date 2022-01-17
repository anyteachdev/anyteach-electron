let PHP_API = ""
let NODE_API = ""

if (process.env.VUE_APP_MODE === "production") {
  PHP_API = "https://wx.anyteach.cn"
  NODE_API = "https://anyteach.cn/api"
} else if (process.env.VUE_APP_MODE === "staging") {
  PHP_API = "https://php-staging.anyteach.cn"
  NODE_API = "https://node-staging.anyteach.cn/api"
} else {
  PHP_API = "http://localhost:8080/api"
  NODE_API = "https://node-staging.anyteach.cn/api"
}

export { PHP_API, NODE_API }
