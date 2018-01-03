import Home from './components/home.vue';
import Warning from './components/warning.vue';
import Register from './components/register.vue';
import Login from './components/login.vue';
import Production from './components/productionMonit.vue';


const routes =[
	{
		path:'/',
		component:Home,
		children:[
			{path:'/warning',component:Warning,name:"消息报警"},
			{path:'/production',component:Production,name:'生产监控'}
		]
	},
	{
		path:'/register',
		name:'注册',
		component:Register
	},{
		path:'/login',
		name:'登录',
		component:Login
	}
];

export default {routes}