<template>
	<div class="all">
		<div class="card-content">
			<card :all="allMachine" v-for="(item,index) in allMachine" :item="item" :key="index" :icon="true" v-on:chooseParam="chooseparam" :selected="selected" :collect="collect"></card>
			<el-card class="box-card"  @click="dialogVisible = true">
      			<el-button type="text"  @click="dialogVisible = true;add=true"><i class="el-icon-circle-plus" ></i></el-button>
      		</el-card>
		</div>
	    <el-dialog
	      title="请选择在此展示的参数"
	      :visible.sync="dialogVisible"
	      width="30%"
	      :before-close="handleClose">
	      <select v-model="selected" >
	        <option v-for="(item,index) in param" :key="index" :value="item">{{item.value}}</option>
	      </select>
	      <span slot="footer" class="dialog-footer">
	        <el-button @click="dialogVisible = false">取 消</el-button>
	        <el-button type="primary" @click="saveParam()" >确 定</el-button>
	      </span>
	    </el-dialog>
	</div>
</template>

<style lang="scss" scoped>
@import "../style/allmachine.scss"
</style>

<script type="text/javascript">
import * as api from '../api/server.js';
import Cookies from 'js-cookie';
import card from './card.vue';
export default {
	data(){
		return {
			allMachine:[],
			param:[],
			add:false,
			dialogVisible:false,
			selected:'',
			chooseuuid:'',
			selectedma:'',
			collect:"",
			obj:{
				uuid:'',
				alias:'',
				item:'',
				param:'',
				enable:false
			}
		}
	},
	components:{
		card
	},
	computed:{
	},
	mounted(){
		this.$emit("success","success");
		let that = this;
		api.getAllMachine()
			.then(function(res){
				if(res.data.result=="success"){
					res.data.values;
					console.log(res)
					res.data.values.forEach(function(val){
						that.obj = {
							uuid:val.uuid,
							alias:val.alias,
							item:val.item,
							enable:val.enable,
							param:"加工进度"
						}
						that.allMachine.push(that.obj)
					})
				}
			})
	},
	methods:{
		chooseparam(val){
			let that = this;
			api.addMachine(val.uuid)
				.then(function(res){
					if(res.data.result == "success"){
						that.dialogVisible = true;
						that.chooseuuid = val.uuid;
						that.param = res.data.value;
					}
				})
		},
		saveParam(){
			this.dialogVisible = false;
        	let obj = {
        		uuid:this.chooseuuid,
        		item:this.selected.key
        	}
        	let that = this;
        	api.saveHomeParameter(obj)
        		.then(function(res){
        			if(res.data.result == "success"){
        				let arr = [];
        				that.allMachine.forEach(function(res){
        					if(res.uuid == that.chooseuuid) {
	        					that.obj = {
	        						uuid:res.uuid,
	        						alias:res.alias,
	        						item:res.item,
	        						enable:res.enable,
	        						param:that.selected.value
	        					}
	        					arr.push(that.obj)
        					}else{
        						arr.push(res)
        					}
        				})
        				that.allMachine = arr;
        			}
        		})
		},
		handleClose(done) {
	        this.$confirm('确认关闭？')
	          .then(_ => {
	            done();
	            this.selected = undefined;
	          })
	          .catch(_ => {});
	        }
		},
	watch: {
		allMachine(val){
			console.log(val)
		}
	}
}
</script>