import Home from './components/home.vue';
import Warning from './components/warning.vue';
import Register from './components/register.vue';
import Login from './components/login.vue';
import Production from './components/productionMonit.vue';
import Detail from './components/detail.vue';
import Card from './components/card.vue';


const routes =[
	{
		path:'/',
		component:Home,
		children:[
			{path:'/warning',component:Warning,name:"消息报警"},
			{
				path:'/production',
				component:Production,
				children:[
					{path:'/card',component:Card}
				],
				name:'生产监控'
			},
			{path:'/detail',component:Detail,name:'设备详情'}
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