<template>
  <div class="detail">
    <el-dropdown  @command="handleCommand">
      <span class="el-dropdown-link">
        选择设备<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item v-for="(item,index) in machinelist" :command="item" :key="index">{{item.alias}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="card-content">
      <el-card class="box-card" >
         <echart></echart> 
      </el-card>
      <el-card class="box-card" v-for="(item,index) in machineParameterList" :key="index" :class="item.key">
          <p>{{item.value}}</p>
          <el-progress v-show="item.value=='加工进度'" :text-inside="true" :stroke-width="16" v-for="(it,index) in innerText" v-if="it.status=='WHstatus_HadCompletedPercent'" :percentage="Number(it.value)" :key="index"></el-progress>
          <div v-show="item.value!=='加工进度'" v-text:msg="innerMsg(item.key)">{{msg}}</div>
      </el-card>
      <el-card class="box-card" @click="open4">
        <el-button type="text" @click="open4"><i class="el-icon-circle-plus" ></i></el-button>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/detail.scss'
</style>

<script type="text/javascript">
import * as api from '../api/server.js';
import { mapMutations,mapState} from 'vuex';
import NcMqttClient from '../mqtt/mqttEchart.js';
import md5 from 'js-md5';
import echart from './echart.vue';
import card from './card.vue';

  export default{
    data(){
      return {
        mqttDetail:{},
        machinelist:[],
        innerText:[],
        machineParameterList:[],
        msg:'',
        proData:0,
        process:false,
        allMqttStatus:[],
        WHstatus_FeedVData:[],
        uuid:this.$route.query.uuid,
        mqtts:[]
      }
    },
    components:{
      echart,
      card
    },
    computed:{
    },
    methods:{
      handleCommand(command) {
        this.uuid = command.uuid;
        this.$emit("title",command.alias)
      },
      innerMsg(key){
        let name = this.innerText;  
        let result; 
        for(let i=0;i<name.length;i++){
          if(key==name[i].status){
            result = this.rule(name[i])
          }
        }
        console.log(result)
        return result
      },
      feedVSstyle(msg){
        var t = msg * 60 + " ";
        var t1 = t.indexOf('.');
        if(t1 == -1) {
          t1 = t.length;
        }
        var a = t.substr(0, t1);
        return a;
      },
      rule(param){
        let name = param.status;
        let value = param.value;
        let time = param.time;
        let val;
        if(name == "WHstatus_TotalCompletedCount") {
          val = value + " 件";
        } else if(name == "WHstatus_ControllerMode") {
          val = value;
        } else if(name == "WHstatus_FeedV") {
          let ts = time.substr(0, 27);
          if(this.WHstatus_FeedVData.length > 1800){
            this.WHstatus_FeedVData = this.WHstatus_FeedVData.slice(500)
          }
          
          val =  value + "  mm/min";
        } else if(name == "WHstatus_SpindleFeedrate") {
          val = value + " %";
        } else if(name == "WHstatus_SpindleSpeed") {
          val = value + "  rpm";
        } else if(name == "WHstatus_FeedRate") {
          val = value + "  %";
        } else if(name == "WHstatus_HadCompletedPercent") {
          val = value + "  %";
        } else if(name == "WHstatus_programName") {
          if(value == '') {
            val = '****';
          } else {
            //截取加工文件
            var cncname = value.substr(value.lastIndexOf('\\') + 1);
            val = cncname;
          }
        } else if(name == "WHstatus_ExecState") {
          
          if(value == "Running") {
            
          } else if(value == "Idle") {
           
          } else if(value == "Estop") {
           
          } else {
            
          }
        } else if(name == "WHstatus_Timeline") {
         
        } else if(name == 'WHstatus_Efficiency') {
          //echarts
          var todayTimeSum = 0;
          if(value !== null &&value) {
            
          }
        } else if(name == 'WHstatus_Error') {}
        return val
      },
      forceData(ar,data){
        if(data.length==0){
          let obj = {
            status:ar[1],
            value:ar[2],
            time:ar[3]
          }
          data.push(obj)
        }else{
          let flag = true;
          let newArr = [];
          data.forEach(function(val){
            var newObj = {};
            if(val.status==ar[1]){
              flag = false;
              newObj.status = ar[1];
              newObj.value = ar[2];
              newObj.time = ar[3];
              newArr.push(newObj)
            }else{
              newArr.push(val)
            }
          });
          if(flag){
              let obj = {
                status:ar[1],
                value:ar[2],
                time:ar[3]
              }
              data.push(obj)
          }else{
              data = newArr;
          }
        }       
      },
      detailMqtt(uuid){
        let pass = md5("ly1024");
        let ar = [];
        var _this = this;
        var detailMqtt = new NcMqttClient("ly1024", pass, function(_1, _2, _3, _4) {
            ar = [_1, _2, _3, _4];
              for(var i=0;i<_this.machineParameterList.length;i++){
                if(ar[1]==_this.machineParameterList[i].key){
                  if(_this.innerText.length==0){
                    let obj = {
                      status:ar[1],
                      value:ar[2],
                      time:ar[3]
                    }
                    _this.innerText.push(obj)
                  }else{
                    let flag = true;
                    let newArr = [];
                    _this.innerText.forEach(function(val){
                      var newObj = {};
                      if(val.status==ar[1]){
                        flag = false;
                        newObj.status = ar[1];
                        newObj.value = ar[2];
                        newObj.time = ar[3];
                        newArr.push(newObj)
                      }else{
                        newArr.push(val)
                      }
                    });
                    if(flag){
                        let obj = {
                          status:ar[1],
                          value:ar[2],
                          time:ar[3]
                        }
                        _this.innerText.push(obj)
                    }else{
                        _this.innerText = newArr;
                    }
                  }       
                }
              }
            _this.forceData(ar,_this.allMqttStatus);
              console.log(ar)
            _this.mqtts = ar;
        })
        detailMqtt.connect([{
          'uuid': uuid,
          'enable': true,
          "item": '+'
        }]);
      },
      getMachineData(obj){
        api.machineParameterList(obj)
          .then(res => {
            //获取设备参数
            if(res.data.result=="success"){
              console.log(res)
              this.machineParameterList = res.data.value.params;
            }
          });
        this.detailMqtt(obj.uuid)
      },
      open4() {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '内容可以是 '),
            h('i', { style: 'color: teal' }, 'VNode')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: ' + action
          });
        });
      }
    },
    mounted(){
      this.$emit("success","success");
      this.uuid = this.$route.query.uuid;
      var _this = this;
      this.handleCommand(this.$route.query.alias);
      let obj = {};
      obj.username = "ly1024";
      obj.uuid = this.$route.query.uuid;
      obj.openid = "oh9Djvup_15urtYmlsZIF-5SITeo";
      obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTc1Mjk2MDAsImlhdCI6MTUxNDk3MjE1OH0.kxgTb-2Vwvq8cTA19fc75xsF3wW0nKsBmSYL73m3Ww4";
      console.log(obj)
      api.allMachineDropList(obj)
        .then(res => {
          if(res.data.result=="success"){
              console.log(res.data)
            this.machinelist = res.data.values;
          }
        });
      this.getMachineData(obj);
      this.$emit("title",this.$route.query.alias)
    },
    watch:{
      mqtts:function(ar){
        
 
      },
      allMqttStatus:function(value){
        console.log(value)
      },
      uuid:function(val){
        let obj = {};
        obj.username = "ly1024";
        obj.uuid = val;
        obj.openid = "oh9Djvup_15urtYmlsZIF-5SITeo";
        obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTc1Mjk2MDAsImlhdCI6MTUxNDk3MjE1OH0.kxgTb-2Vwvq8cTA19fc75xsF3wW0nKsBmSYL73m3Ww4";
        this.getMachineData(obj);
      },
      innerText(val){
        console.log(val)
      }
    }
  }
</script>