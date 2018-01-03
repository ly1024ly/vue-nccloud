import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import routes from './router.config'
const router = new VueRouter(routes)
Vue.use(VueRouter);
Vue.use(ElementUI)

new Vue({
  	el: '#app',
  	store,
  	router,
    components:{
    	"v-app":App
    }
});