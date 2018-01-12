<template>
  <div class="card">
    <el-card class="box-card" >
      <router-link :to="{path:'detail',query:{uuid:item.uuid,alias:item.alias}}">
        <div class="stat" v-for="(it,indexs) in arr" :key="indexs" >
          <span v-if="it.value=='Running'&&it.status=='WHstatus_ExecState'" :style="{background:'green'}" v-show="show"></span>
          <span v-else-if="it.value=='Idle'&&it.status=='WHstatus_ExecState'" :style="{background:'yellow'}" v-show="show"></span>
          <span v-else-if="it.value=='Estop'&&it.status=='WHstatus_ExecState'" :style="{background:'red'}" v-show="show"></span>
          <span v-else="it.status=='WHstatus_ExecState'" :style="{background:'gray'}" v-show="show"></span>
          <div >{{item.alias}}</div>
        </div>
        <div v-show="show">
          <p>{{item.alias}}</p>
          <div class="uuid" >{{item.uuid}}</div>
          <div class="pres" >加工进度</div>
          <div class="val" v-for="(it,indexs) in process" v-if="it.uuid==item.uuid" :key="indexs" v-text:msg="textVal(it)">{{msg}}</div>
        </div>
      </router-link>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/card.scss'
</style>

<script type="text/javascript">
  export default{
    props:['mqtuuid','item',"process","allMqttStatus"],
    data(){
      return {
        msg:"",
        arr:[],
        show:true
      }
    },
    mounted(){
        console.log("********************");
        console.log(this.allMqttStatus,this.mqtuuid);
        console.log(this.item)
        if(this.allMqttStatus){
          this.arr = this.allMqttStatus;
          this.show = false;
        }else if(this.mqtuuid){
          this.arr = this.mqtuuid;
          this.show = true;
        }
    },
    computed:{
      filterArr:function(){
        this.arr.filter(t => {
          if(t.status = this.item.status){
            return true
          }
        })
      }
    },
    methods:{
      showCondition(it,item){
        if(this.mqtuuid){
          return it.uuid == item.uuid
        }else if(this.allMqttStatus){
          return it.status = item.status;
        }
      },
      textVal(mqtt){
        console.log(this.process)
        let status = mqtt.status;
        let val = '';
        if(status == "WHstatus_FeedV") {
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
        }
        console.log(val)
        return val
       } 
    },
    watch:{
      arr:function(value){
        console.log(value)
      }
    }
  }
</script>

