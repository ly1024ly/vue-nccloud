import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import routes from './router.config'
import echarts from 'echarts'
const router = new VueRouter(routes)
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueI18n);
Vue.prototype.$echarts = echarts

const i18n = new VueI18n({
  locale:'zh-CN',
  messages:{
    'zh-CN':require('./i18n/lang/cn.js'),
    'zh-US':require('./i18n/lang/en.js')
  }
});

export default i18n;

new Vue({
  	el: '#app',
  	store,
  	router,
    i18n:i18n,
    components:{
    	"v-app":App
    }
});