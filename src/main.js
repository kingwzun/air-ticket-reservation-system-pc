// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// 引入element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
// 引入路由
import router from './router';

// 引入icon
import './assets/icon/iconfont.css'

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import axios from 'axios';
axios.defaults.baseURL='http://localhost:8081/atrs'
Vue.prototype.$axios = axios;
Vue.prototype.pathURL='http://localhost:8081/atrs'
Vue.config.productionTip = false;

// 使用element UI
Vue.use(ElementUI);
// 过滤器


axios.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("token");
    if(token) config.headers.authorization = token
    return config
  },
  error => {
    console.log("error")
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    // 检查是否需要清除 Session Storage 中的 token
    const clearToken = response.headers['clear-token'];
    if (clearToken === 'true') {
      // 清除 Session Storage 中的 token 字段
      sessionStorage.removeItem('token');
    }

    return response;
  },
  error => {
    return Promise.reject(error);
  }
);


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }

})
