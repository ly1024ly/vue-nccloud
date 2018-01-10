<template>
  <div class="card">
    <el-card class="box-card" >
      <router-link :to="{path:'detail',query:{uuid:item.uuid,alias:item.alias}}">
        <div class="stat" v-for="(it,indexs) in mqtuuid" v-if="it.uuid==item.uuid">
          <span v-if="it.value=='Running'&&it.status=='WHstatus_ExecState'" :style="{background:'green'}"></span>
          <span v-else-if="it.value=='Idle'&&it.status=='WHstatus_ExecState'" :style="{background:'yellow'}"></span>
          <span v-else-if="it.value=='Estop'&&it.status=='WHstatus_ExecState'" :style="{background:'red'}"></span>
          <span v-else="it.status=='WHstatus_ExecState'" :style="{background:'gray'}"></span>
        </div>
        <p>{{item.alias}}</p>
        <div class="uuid">{{item.uuid}}</div>
        <div class="pres">加工进度</div>
        <div class="val" v-for="(it,indexs) in process" v-if="it.uuid==item.uuid" :key="indexs" v-text:msg="textVal(it)">{{msg}}</div>
      </router-link>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/card.scss'
</style>

<script type="text/javascript">
  export default{
    props:['mqtuuid','item',"process"],
    data(){
      return {
        msg:""
      }
    },
    mounted(){
        console.log("********************");
        console.log(this.mqtuuid)
    },
    methods:{
      textVal(mqtt){
        console.log("********************");
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
    }
  }
</script>

