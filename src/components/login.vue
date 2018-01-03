<template>
	<div class="login">
		<div class="box">
			<p>登 录</p>
			<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
				<el-form-item label="帐号" prop="phone">
				    <el-input type="phone" v-model="ruleForm2.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="checkPass">
				    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="age" class="lcode">
				    <el-input v-model.number="ruleForm2.age"></el-input>
				    <label class="getCode" :class="this.class" @click="getCode('ruleForm2')" v-model="ruleForm2.phone">{{message}}</label>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm2')">提 交</el-button>
				    
				</el-form-item>
			</el-form>
			<p>
				<router-link to="register"><span>立即注册</span></router-link> <span>忘记密码？</span>
			</p>
		</div>
	</div>
</template>
<style lang="scss" scoped>
	@import "../style/login.scss"
</style>
<script>
  import * as api from '../api/server.js';
  import {mapState, mapGetters,mapMutations} from 'vuex'
  import axios from 'axios'
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
      	const rul = /^\d{6,6}$/;
    		let flag = rul.test(value);
        if (!value) {
          return callback(new Error('验证码不能为空'));
        } else if (!flag) {
	          callback(new Error('6位数字验证码!'));
	      } else {
	          callback();
	      }   		
      };
    	var checkphone = (rule,value,callback) => {
    		const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
    		let flag = rul.test(value);
    		if(value===""){
    			callback(new Error('帐号不能为空'))
    		}else if(!flag){
    			callback(new Error( "帐号格式错误"))
    		}else{
    			callback();
    		}
    	};
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
      	class:"",
      	num:1,
      	message:'免费获取验证码',
        ruleForm2: {
          phone: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          phone: [
            { validator: checkphone, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, min: 6, max: 6, message: '长度6的字符串', trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    mounted(){
      console.log(this.user)
      document.title = this.$route.name;
    },
    created() {
       
    },
    computed:{
      ...mapState(['user']),
    },
    methods: {
       ...mapMutations(['USER_INFO']),
      submitForm(formName) {
      console.log(this.user)
        this.$refs[formName].validate((valid) => {
        var _this = this;
          if (valid) {
            const obj = {};
            obj.account = this.ruleForm2.phone;
            obj.password = this.ruleForm2.checkPass;
            obj.vercode = this.ruleForm2.age;
            api.userLogin(obj).then((res) => {
                if(res.ok){
                    res.json().then(res => {
                         _this.setCookies(obj);
                        _this.$router.push({path:'/warning'})
                    })
                }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      setCookies(obj){
        var day = new Date();
        console.log(obj);
        var str = "";
        day.setTime(day.getTime() + 7*24*60*60*1000);
        for(var key in obj){
          str += key+"="+obj[key]+",";
        }
        str +=  "expires="+day.toGMTString(); 
        document.cookie = str;
        console.log(str)
        console.log(document.cookie)

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getCode(formName) {
      	  this.$refs[formName].validateField("phone",function(errorMessage){
      	  	console.log(errorMessage)
      	  })

	      	const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
	      	if(rul.test(this.ruleForm2.phone)){
	      		let index = 60;
		        this.class="unclick";
		      	this.message = "重新发送("+index+")";
      			var _this = this;
	      		var interval = setInterval(
				     	function(){
				     		if(index>0){
				     			index--;
				     			_this.message = "重新发送("+index+")";
				     		}else{
                  clearInterval(interval);
				     			_this.message = "免费获取验证码";
			            _this.class = ""
				     		}
				     	},1000);
              let pam = {};
              pam.phone = this.ruleForm2.phone;
              pam.num = this.num;
              api.vercode(pam)
                  .then(res => res.json())
                  .then(json => {
                      console.log(json)
                      _this.num++
                  })
	      	}      	
      	}
    	}
  	}
</script>