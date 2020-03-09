import Vue from "vue"
import ElementUI from "element-ui"
import "./styles/element.scss"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import api from "./api"

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$bgd = url => {
  return `
    background-image: url('${url}'); 
    background-color: var(--color-bgd);
    background-position: center center;
    `
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
