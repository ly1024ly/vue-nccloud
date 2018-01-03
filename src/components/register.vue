<template>
	<div>
		<header>
			<img src="../img/logo.png" width="90" />
			<span class="title">欢迎注册</span>
			<router-link to="login"><span class="login">已有帐号？请登录</span></router-link>
		</header>
		<section>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			  <el-form-item label="姓名" >
			    <el-input v-model="ruleForm.n"></el-input>
			  </el-form-item>
			  <el-form-item label="用户名" prop="name">
			    <el-input v-model="ruleForm.name"></el-input>
			  </el-form-item>
			  <el-form-item label="手机号" prop="phone" type="tel">
			    <el-input v-model="ruleForm.phone"></el-input>
			  </el-form-item>
			  <el-form-item label="公司名称" >
			    <el-input v-model="ruleForm.company"></el-input>
			  </el-form-item>
			  <el-form-item label="联系地址" >
			    <el-input v-model="ruleForm.addr"></el-input>
			  </el-form-item>
			   <el-form-item prop="email" label="邮箱">
				    <el-input v-model="ruleForm.email"></el-input>
				</el-form-item>
			   <el-form-item label="密码" prop="pass">
			    <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
			  </el-form-item>
			   <el-form-item label="确认密码" prop="cpass">
				    <el-input type="password" v-model="ruleForm.cpass" auto-complete="off"></el-input>
				</el-form-item>
			  <el-form-item label="验证码" prop="code" class="code">
			    <el-input v-model="ruleForm.code"></el-input>
			     <label class="getCode" @click="getCode('ruleForm')" :class="this.class">{{message}}</label>
			  </el-form-item>

			  <el-form-item>
			    <el-button type="primary" @click="submitForm('ruleForm')">立即注册</el-button>
			  </el-form-item>
			</el-form>
			<aside class="">
				<img src="../img/kk.jpg" />
        <p>扫码关注维宏云</p>
			</aside>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import '../style/register.scss';
</style>

<script>
import axios from 'axios'
import {mapActions,mapGetters,mapMutations} from 'vuex'
import md5 from 'js-md5'
  export default {
    data() {
    	var checkname = (rule,value,callback) => {
    		const rul = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
    		let flag = rul.test(value);
    		if(value===""){
    			callback(new Error('用户名不能为空'))
    		}else if(!flag){
    			callback(new Error( "字母开头，长度3-16之间，只能包含字符、数字和下划线"))
    		}else{
    			callback();
    		}
    	};
    	var checkphone = (rule,value,callback) => {
    		const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
    		let flag = rul.test(value);
    		if(value===""){
    			callback(new Error('手机号不能为空'))
    		}else if(!flag){
    			callback(new Error( "手机号格式错误"))
    		}else{
    			callback();
    		}
    	};
    	var checkemail = (rule,value,callback) => {
    		const rul = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		let flag = rul.test(value);
      		if(value===""){
    			callback(new Error('邮箱不能为空'))
    		}else if(!flag){
    			callback(new Error( "邮箱格式错误"))
    		}else{
    			callback();
    		} 		
    	};
    	var checkpass = (rule,value,callback) =>{
	        if (value === '') {
	          callback(new Error('请再次输入密码'));
	        } else if (value !== this.ruleForm.pass) {
	          callback(new Error('两次输入密码不一致!'));
	        } else {
	          callback();
	        }
    	};
    	var checkcode = (rule,value,callback) =>{
    		const rul = /^\d{6,6}$/;
    		let flag = rul.test(value);
 	        if (value === '') {
	          callback(new Error('请输入验证码'));
	        } else if (!flag) {
	          callback(new Error('6位数字验证码!'));
	        } else {
	          callback();
	        }   		
    	}
      return {
      	num:1,
        class:"",
      	message:'免费获取验证码',
        ruleForm: {
          name: '',
          n:'',
          company:'',
          addr:'',
          phone: '',
          email: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          email: '',
          pass:'',
          code:'',
          cpass:'',
          checkPass:''
        },
        rules: {
          name: [
            {  required: true,validator:checkname ,trigger: 'blur' }
          ],
          phone: [
            { required: true,validator:checkphone, trigger: 'change' }
          ],
          email: [
            { required: true, validator:checkemail, trigger: 'change' }
          ],
          pass: [
            { required: true, min: 6, max: 6, message: '长度6的字符串', trigger: 'blur' }
          ],
          cpass: [
            { required: true, validator:checkpass, trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ],
          code:[
          	{ required: true, validator: checkcode, trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
    	
    },
    mounted(){
      document.title = this.$route.name;
    },
    methods: {
      ...mapMutations(['USER_INFO']),
      submitForm(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	const obj = {};
          	obj.names = this.ruleForm.n;
          	obj.username = this.ruleForm.name;
          	obj.phone = this.ruleForm.phone;
          	obj.vercode = this.ruleForm.code;
          	obj.openid = '';
          	obj.address = this.ruleForm.addr;
          	obj.company = this.ruleForm.company;
          	obj.email = this.ruleForm.email;
          	obj.password = md5(this.ruleForm.pass);
            axios.post('https://nccloud.weihong.com.cn/ncmes/web/register',obj).then(function(res){
            	if(res.data.result=="success"){
                _this.USER_INFO(obj);
            		_this.$router.push({path:'/login'})
            	}
            }).catch(function(err){
            	console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getCode(formName) {
        this.$refs[formName].validateField("phone",function(errorMessage){
            console.log(errorMessage)
        })
      	const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
      	if(rul.test(this.ruleForm.phone)){
      	  let index = 60;
          this.class="unclick";
          this.message = "重新发送("+index+")";
          var _this = this;
          setInterval(
            function(){
              if(index>0){
                index--;
                _this.message = "重新发送("+index+")";
              }else{
                _this.message = "免费获取验证码";
                _this.class = ""
              }
            },1000);
        		axios.get('https://nccloud.weihong.com.cn/ncmes/vercode/'+this.ruleForm.phone+"?="+_this.num).then(function(res){
        			console.log(res)
        			if(res.data.result=="success"){
        				_this.num++
        			}
        		}).catch(function(err){
        			console.log(err)
        		})
        	}
      	
      }
    }
  }
</script>
