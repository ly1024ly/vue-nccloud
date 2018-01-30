<template>
	<div class="all">
		<div class="card-content">
			<card :all="allMachine" v-for="(item,index) in allMachine" :item="item" :key="index" :icon="true" v-on:chooseParam="chooseparam" :selected="selected" :collect="collect" v-on:remove="removeCard"></card>
			<el-card class="box-card"  @click="addMachine()">
      			<el-button type="text" @click="addMachine"><i class="el-icon-circle-plus" ></i></el-button>
      		</el-card>
		</div>
	    <el-dialog
	      :title=this.data
	      :visible.sync="dialogVisible"
	      :width=this.width
	      :before-close="handleClose">
	      <div v-show="this.pop=='add' ? true : false">
	      	<el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
					  <el-form-item label="设备号">
					    <el-input v-model="formLabelAlign.name"></el-input>
					  </el-form-item>
					  <el-form-item label="验证码">
					    <el-input v-model="formLabelAlign.region"></el-input>
					  </el-form-item>
					  <el-form-item label="别名">
					    <el-input v-model="formLabelAlign.type"></el-input>
					  </el-form-item>
					</el-form>
	      </div>
	      <div v-show="this.pop=='delete' ? true : false">你确定要删除此设备？</div>
	      <select v-model="selected" v-show="this.pop=='select' ? true : false">
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
			width:"30%",
			dialogVisible:false,
			selected:'',
			chooseuuid:'',
			selectedma:'',
			collect:"",
			pop:"",
			data:"请选择在此展示的参数",
			labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
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
		if(window.screen.width<=768){
       this.width = "50%";
    }else{
    	this.width = "25%";
    }
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
			this.pop = "select";
			api.addMachine(val.uuid)
				.then(function(res){
					if(res.data.result == "success"){
						that.dialogVisible = true;
						that.chooseuuid = val.uuid;
						that.param = res.data.value;
					}
				})
		},
		addMachine(){
			this.dialogVisible = true;
			this.pop = "add";
			this.data = "请输入新增的设备信息"
		},
		removeCard(res){
			let that = this;
			api.removeMachine({uuid:res.uuid})
				.then(function(res){
					if(res.data.result == "success"){
						let arr = [];
						that.allMachine.forEach(function(val){
							if(res.uuid !== val.uuid){
								let obj ={
									uuid:res.uuid,
      						alias:res.alias,
      						item:res.item,
      						enable:res.enable,
      						param:that.selected.value
								}
								arr.push(obj)
							}
						})
						that.allMachine = arr;
					}
				})
			console.log(this.allMachine)
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