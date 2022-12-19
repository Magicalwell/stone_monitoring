import Vue from "vue";
import App from "./App.vue";
import stone from '../../src'
import axios from 'axios'

axios.defaults.retry = 1
axios.defaults.retryDelay = 10000
Vue.prototype.$axios = axios
Vue.config.productionTip = false;
Vue.use(stone,{url:'http://127.0.0.1:8083/'})
new Vue({
  render: (h) => h(App),
}).$mount("#app");
