<template>
  <div class="pm">
    <card :mqtuuid="mqtuuid" :process="process" v-for="(item,index) in focus" :item='item' :key="index"></card>
  </div>
</template>


<style lang="scss" scoped>
@import '../style/productionMonit.scss'
</style>


<script type="text/javascript">
import * as api from '../api/server.js';
import { mapMutations,mapState} from 'vuex';
import NcMqttClient from '../mqtt/mqttEchart.js';
import md5 from 'js-md5';
import card from './card.vue';

  export default {
    props:["lang"],
    data() {
      return {
        mqtuuid:[],
        process:[],
        focus:[],
        mqtt:[],
        color:"green"
      }
    },
    computed:{
      
    },
    components:{
       card
    },
    methods:{
      ...mapMutations(['FOCUS_MACHINE','MQTT']),
      initData(uuid,press,status){
        if(this.mqtuuid.length!==0){
          let flag1 = true;
          let flag2 = true;
          this.mqtuuid.forEach(function(val){
            if(val.uuid==uuid){
              flag1 = false;
              val.value = press;
              val.status = status;
            }
          });
          this.process.forEach(function(val){
            if(val.uuid==uuid&&status!=="WHstatus_ExecState"&&status!=="WHstatus_Error"){
              flag2 = false;
              val.value = press;
              val.status = status;
            }
          });
          if(flag1){
            let obj = {};
            obj.uuid = uuid;
            obj.value = press;
            obj.status = status;
            this.mqtuuid.push(obj);
          }
          if(flag2&&status!=="WHstatus_ExecState"&&status!=="WHstatus_Error"){
            let obj = {};
            obj.uuid = uuid;
            obj.value = press;
            obj.status = status;
            this.process.push(obj);
          }
        }else if(this.mqtuuid.length==0){
            let obj = {};
            obj.uuid = uuid;
            obj.status = status;
            obj.value = press;
            this.mqtuuid.push(obj);
            if(status!=="WHstatus_ExecState"&&status!=="WHstatus_Error"){
              let obj = {};
              obj.uuid = uuid;
              obj.status = status;
              obj.value = press;
              this.process.push(obj);
            }
        }
      },
      textVal(mqtt){
        let status = mqtt.status;
        let val = '';
        if(status == 'WHstatus_Error') {

        }else if(status == "WHstatus_FeedV") {
            //$("#" + machineInfo.uuid + " .WHstatus_FeedV").html(feedVSstyle(machineInfo.value) + "  mm/min")
        }else if(status == "WHstatus_programName") {
            if(mqtt.value == '') {
              val = '****';
            } else {
              //截取加工文件
              var cncname = mqtt.value.substr(mqtt.value.lastIndexOf('\\') + 1);
              val = cncname;
            }
        } else if(status == "WHstatus_SpindleFeedrate") {
          //var time = mofifySpindleFeedrateStyle(machineInfo.value);
          val = mqtt.value + " %";
        } else if(status == "WHstatus_TotalCompletedCount") {
          val = mqtt.value + " 件";
        } else if(status == "WHstatus_SpindleSpeed") {
          val = mqtt.value + "  rpm";
        } else if(status == "WHstatus_HadCompletedPercent") {
          val = mqtt.value + "  %";
        } else if(status == "WHstatus_FeedRate") {
          val = mqtt.value + "  %";
        } else if(status == "WHstatus_ControllerMode") {
          val = mqtt.value;
        }else if(status == 'WHstatus_ExecState') {
          //更新在线、离线、紧急、空闲等状态(生产监控)
        } 
        return val
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
       api.getFocusMachine()
        .then(res => {
          if(res.data.result=="success"){
            this.$emit("success","success");
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
            let pass = md5("ly1024");
            let ar = [];
            var productionMqtt = new NcMqttClient("ly1024", pass, function(_1, _2, _3, _4) {
              ar = [_1, _2, _3, _4];
              _this.initData(ar[0],ar[2],ar[1]);
              _this.mqtt = ar;
            });
                
            productionMqtt.connect(arr)
          }else{
            this.open()
          }
        })
    },
    watch:{
      mqtt:function(value){
          //console.log(value)
      },
      mqtuuid(value){
        
      },
      lang(val){
        console.log(val)
      }
    }
  }
</script>