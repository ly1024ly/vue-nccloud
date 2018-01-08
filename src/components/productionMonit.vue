<template>
  <div class="pm">
    <el-card class="box-card" v-for="(item,index) in focus" :key="index">
      <router-link :to="{path:'detail',query:{uuid:item.uuid,alias:item.alias}}">
        <div class="stat" v-for="(it,indexs) in mqtuuid" v-if="it.uuid==item.uuid">
          <span v-if="it.value=='Running'&&it.status=='WHstatus_ExecState'" :style="{background:'green'}"></span>
          <span v-else-if="it.value=='Idle'&&it.status=='WHstatus_ExecState'" :style="{background:'yellow'}"></span>
          <span v-else-if="it.value=='Estop'&&it.status=='WHstatus_ExecState'" :style="{background:'red'}"></span>
          <span v-else="" :style="{background:'gray'}"></span>
        </div>
        <p>{{item.alias}}</p>
        <div class="uuid">{{item.uuid}}</div>
        <div class="pres">加工进度</div>
        <div class="val" v-for="(it,indexs) in mqtuuid" v-if="it.uuid==item.uuid" :key="indexs" >{{it.value=="Running" ? "0%" : it.value +"%"}}</div>
      </router-link>
    </el-card>
  </div>
</template>


<style lang="scss" scoped>
@import '../style/productionMonit.scss'
</style>


<script type="text/javascript">
import * as api from '../api/server.js';
import { mapMutations,mapState} from 'vuex';
import NcMqttClient from '../mqtt/mqttEchart.js';
import md5 from 'js-md5'

  export default {
    data() {
      return {
        mqtuuid:[],
        focus:[],
        color:"green"
      }
    },
    computed:{
      ...mapState([
        'mqtt'
      ]),
    },
    methods:{
      ...mapMutations(['FOCUS_MACHINE','MQTT']),
      initData(uuid,press,status){
        if(this.mqtuuid.length!==0){
          let flag = true;
          this.mqtuuid.forEach(function(val){
            if(val.uuid==uuid){
              flag = false;
              val.value = press;
              val.status = status;
            }
          })
          if(flag){
            let obj = {};
            obj.uuid = uuid;
            obj.value = press;
            obj.status = status;
            this.mqtuuid.push(obj)
          }
        }else if(this.mqtuuid.length==0){
            let obj = {}
            obj.uuid = uuid;
            obj.status = status;
            obj.value = press;
            this.mqtuuid.push(obj)
        }
      },
      open() {
        this.$alert('没有添加关注设备，请添加关注设备!', '温馨提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      },
     
    },
    mounted(){
      document.title = this.$route.name;
      var obj = {};
      obj.username = "ly1024";
      obj.openid = "undefined";
      obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTYyMzM2MDAsImlhdCI6MTUxMzY0ODAxM30.lv9HRoXgamAi-Xw4aWgU0Wpr1hMoRRHd67nUcf7vPLw"
       api.getFocusMachine(obj)
        .then(res => {
          if(res.data.result=="success"){
            let arr = [];
            console.log(res)
            res.data.values.forEach(function(value){
              let obj = {};
              obj.uuid = value.uuid;
              obj.item = [value.item,"WHstatus_ExecState"];
              obj.enable = true;
              arr.push(obj);
            })
            this.focus = res.data.values;
            this.FOCUS_MACHINE(res.data.values);
            var _this = this;
            this.MQTT(arr)
            
          }else{
            this.open()
          }
        })
    },
    watch:{
      mqtt:function(value){
        console.log(value)
        this.initData(value[0],value[2],value[1])
      },
      mqtuuid(value){
        console.log(value)
      }
    }
  }
</script>