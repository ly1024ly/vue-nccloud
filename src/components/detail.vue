<template>
  <div class="detail">
    <el-dropdown  @command="handleCommand">
      <span class="el-dropdown-link">
        {{ $t("message.select") }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item v-for="(item,index) in machinelist" :command="item" :key="index">{{item.alias}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="card-content">
      <card v-for="(item,index) in getEcharts" :key="index" :WHstatus_ExecState="item"  :item="item"></card>
      <card v-for="(item,index) in innerCard" :key="index+allMqttStatus[0].data.length" :item="item"  :allMqttStatus="allMqttStatus" ></card>
      <el-card class="box-card"  @click="dialogVisible = true">
        <el-button type="text"  @click="dialogVisible = true"><i class="el-icon-circle-plus" ></i></el-button>
      </el-card>
    </div>
    <el-dialog
      title="请为新添加的展示块选择内容"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <select v-model="selected">
        <option v-for="(item,index) in li" :key="index" :value="item">{{item.value}}</option>
      </select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
import Cookies from 'js-cookie'

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
        mqtts:[],
        WHstatus:{},
        yester:{},
        innerCard:[],
        li:[],
        selected:'选择内容',
        dialogVisible: false,
        echartsMqtt:["WHstatus_ExecState","WHstatus_FeedV","WHstatus_Efficiency","WHstatus_Error"]
      }
    },
    components:{
      echart,
      card
    },
    computed:{
      getEcharts:function(){
        let arr = [];
        arr.push(this.yester);
        let that = this;
        this.allMqttStatus.filter(t => {
          if(t.uuid==that.uuid){
            t.data.forEach(function(data){
              that.echartsMqtt.forEach(function(val){
                if(val==data.status){
                  arr.push(data)
                }
              })
            })
          }
        });
        return arr
      }
    },
    methods:{
      ...mapMutations(['CHANGEALIAS']),
      handleCommand(command) {
        this.uuid = command.uuid;
        this.yesterEffi();
        this.$emit("title",command.alias)
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
      yesterEffi(){
        let obj = {
          uuid:this.uuid ? this.uuid : this.$route.query.uuid,
          token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTc1Mjk2MDAsImlhdCI6MTUxNDk3MjE1OH0.kxgTb-2Vwvq8cTA19fc75xsF3wW0nKsBmSYL73m3Ww4"
        };
        api.yesterdayEfficiency(obj)
          .then(res =>{
            if(res.data.result=="success"&&res.data.value!==null){
              let o = {
                uuid:res.data.value.uuid,
                status:"WHstatus_Efficiency_yester",
                value:res.data.value.duration
              }
              this.yester = o;
            }else{
              let val = [{status:"Estop",time:0},{status:"Idle",time:0},{status:"Running",time:0},{status:"Offline",time:1}]
              this.yester = {
                uuid:this.uuid ? this.uuid : this.$route.query.uuid,
                status:"WHstatus_Efficiency_yester",
                value:val
              };
            }
          })
      },
      paramSelect(value){
        console.log(value)
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
                  //如果innerText里面是空
                    let param = {};
                    param.uuid = ar[0];
                    param.data = [];
                    let obj = {
                      status:ar[1],
                      value:ar[2],
                      time:ar[3],
                      alias:_this.machineParameterList[i].value
                    }
                    param.data.push(obj);
                    _this.innerText.push(param); 
                  }else{
                    let flag = true;
                    _this.innerText.forEach(function(val){
                      let flagid = true;
                      if(val.uuid==ar[0]){
                      //判断里面是否有uuid相同的情况
                        flagid = false;
                        flag = false;
                        let flagData = true;
                        let newDataObj = {};
                        let newDataArr = [];
                        val.data.forEach(function(three){
                          if(three.status==ar[1]){
                          //判断status是相同就直接将里面对象替换并放到个新的数组里面
                            flagData = false;
                            newDataObj.status = ar[1];
                            newDataObj.value = ar[2];
                            newDataObj.time = ar[3];
                            newDataObj.alias = _this.machineParameterList[i].value;
                            newDataArr.push(newDataObj)
                          }else{
                          //不同就直接放到新的数组里面,该uuid下新的data数组
                            
                            newDataArr.push(three);
                          }
                        });
                        if(flagData){
                        //该uuid下没有这个status,将uuid的data里push个新对象
                          let o = {
                            status:ar[1],
                            value:ar[2],
                            time:ar[3],
                            alias:_this.machineParameterList[i].value
                          }
                          _this.innerText.forEach(function(one){
                            if(one.uuid==val.uuid){
                              one.data.push(o)
                            }
                          })
                        }else{
                        //该uuid下有status，将uuid的data付值为newDataArr;
                         _this.innerText.forEach(function(two){
                            if(two.uuid==val.uuid){
                              two.data = newDataArr;
                            }
                          })
                        }
                      }
                    });
                    if(flag){
                    //如果没有这个uuid的对象
                      let param = {};
                      param.uuid = ar[0];
                      param.data = [];
                      let newObj = {};
                      newObj.status = ar[1];
                      newObj.value = ar[2];
                      newObj.time = ar[3];
                      newObj.alias = _this.machineParameterList[i].value;
                      param.data.push(newObj);
                      _this.innerText.push(param);
                    }
                  }       
                }
              };
              _this.innerText.forEach(function(o){
                if(o.uuid==_this.uuid){
                  _this.innerCard = o.data;
                }
              })
              //生成allMqttStatus数组
              if(_this.allMqttStatus.length==0){
                let param = {};
                param.uuid = ar[0];
                param.data = [];
                let obj = {
                  status:ar[1],
                  value:ar[2],
                  time:ar[3],
                }
                param.data.push(obj);
                _this.allMqttStatus.push(param);
              }else{
                    let flag = true;
                    _this.allMqttStatus.forEach(function(val){
                      let flagid = true;
                      if(val.uuid==ar[0]){
                      //判断里面是否有uuid相同的情况
                        flagid = false;
                        flag = false;
                        let flagData = true;
                        let newDataObj = {};
                        let newDataArr = [];
                        val.data.forEach(function(three){
                          if(three.status==ar[1]){
                          //判断status是相同就直接将里面对象替换并放到个新的数组里面
                            flagData = false;
                            newDataObj.status = ar[1];
                            newDataObj.value = ar[2];
                            newDataObj.time = ar[3];
                            newDataArr.push(newDataObj)
                          }else{
                          //不同就直接放到新的数组里面,该uuid下新的data数组
                            
                            newDataArr.push(three);
                          }
                        });
                        if(flagData){
                        //该uuid下没有这个status,将uuid的data里push个新对象
                          let o = {
                            status:ar[1],
                            value:ar[2],
                            time:ar[3],
                          }
                          _this.allMqttStatus.forEach(function(one){
                            if(one.uuid==val.uuid){
                              one.data.push(o)
                            }
                          })
                        }else{
                        //该uuid下有status，将uuid的data付值为newDataArr;
                         _this.allMqttStatus.forEach(function(two){
                            if(two.uuid==val.uuid){
                              two.data = newDataArr;
                            }
                          })
                        }
                      }
                    });
                    if(flag){
                    //如果没有这个uuid的对象
                      let param = {};
                      param.uuid = ar[0];
                      param.data = [];
                      let newObj = {};
                      newObj.status = ar[1];
                      newObj.value = ar[2];
                      newObj.time = ar[3];
                      param.data.push(newObj);
                      _this.allMqttStatus.push(param);
                    }

              }       
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
              this.machineParameterList = res.data.value.params;
            }
          });
        this.detailMqtt(obj.uuid)
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    },
    mounted(){
      this.$emit("success","success");
      this.uuid = this.$route.query.uuid;
      var _this = this;
      this.handleCommand(this.$route.query.alias);
      let obj = {};
      obj.uuid = this.$route.query.uuid;
      api.allMachineDropList(obj)
        .then(res => {
          if(res.data.result=="success"){
            this.machinelist = res.data.values;
          }
        });
      this.getMachineData(obj);
      this.$emit("title",this.$route.query.alias);
      this.yesterEffi();

    },
    watch:{
      mqtts:function(ar){
        
 
      },
      allMqttStatus:function(value){
        console.log(value)
      },
      WHstatus:function(value){
        
      },
      uuid:function(val){
        let obj = {};
        obj.username = "ly1024";
        obj.uuid = val;
        obj.openid = "oh9Djvup_15urtYmlsZIF-5SITeo";
        obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTc1Mjk2MDAsImlhdCI6MTUxNDk3MjE1OH0.kxgTb-2Vwvq8cTA19fc75xsF3wW0nKsBmSYL73m3Ww4";
        this.getMachineData(obj);
        this.uuid = val;
        if(!this.uuid){
          this.uuid = this.$route.query.uuid;
        }
        var that = this;
        this.innerText.forEach(function(o){
          if(o.uuid==that.uuid){
            that.innerCard = o.data;
          }
        })
        api.addMachineParameters({uuid:this.uuid})
          .then(function(res){
            if(res.data.result=="success"){
              that.li = res.data.value;
            }
          })
      },
      innerText(val){
        var that = this;
        let addMachine;
        if(sessionStorage.obj){
          addMachine = JSON.parse(sessionStorage.obj);
        }
        if(addMachine){
          addMachine.forEach(function(add){
            let obj;
            console.log(add)
            val.forEach(function(vals){
            console.log(vals)
            console.log(add)
              if(add.uuid == vals.uuid){
                obj = {
                  alias:add.alias,
                  status:add.status,
                  time:add.time,
                  value:add.value
                }
              }
              vals.data.push(obj)
            })
  
          })
        }
      },
      mqtts:function(val){
        
      },
      selected:function(val){
        console.log(val,this.innerText);
        let that = this;
        that.innerText.forEach(function(rel){
          if(rel.uuid == that.uuid){
            let obj = {};
            obj.alias = val.value;
            obj.status = val.key;
            obj.time = "";
            obj.value = "";
            rel.data.push(obj);
            obj.uuid = that.uuid;
            let o = [];
            console.log()
            if(!sessionStorage.obj){
              o.push(obj);
            } else {
               o = JSON.parse(sessionStorage.obj);
              
              o.push(obj);
            }
            sessionStorage.obj = JSON.stringify(o);
          }
        })
        console.log(JSON.parse(sessionStorage.obj))
      }
    }
  }
</script>