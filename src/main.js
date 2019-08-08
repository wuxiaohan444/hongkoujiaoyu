import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '../theme/index.css'
import echarts from 'echarts'
import qs from 'qs'
import "./assets/font/iconfont.css"
import store from "./store"

import close from './components/close'

router.beforeEach((to, from, next) => {
    if (sessionStorage.getItem("user")) {
        if (to.path !== '/login') {
            next()
        } else {
            next('/login');
        }
    } else {
        if (to.path === '/login') {
            next()
        } else {
            next('/login');
        }
    }
});

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

const env = "prod";
const link = {
    dev: "http://192.168.2.146:8081",
    prod: "http://hongkou.jkainfo.com/pc"
}[env];
Vue.prototype.fixedIp = function () {//固定ip
    return link
};

Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component("close", close);
new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app');


