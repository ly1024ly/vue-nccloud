<template>
  <div class="card" >
    <el-card class="box-card" >
      <router-link :to="{path:'detail',query:{uuid:item.uuid,alias:item.alias}}">
        <div class="stat" v-for="(it,indexs) in arr" :key="indexs">
          <div v-if="mqtuuid&&it.uuid==item.uuid">
            <span v-if="it.value=='Running'&&it.status=='WHstatus_ExecState'" :style="{background:'green'}" v-show="show"></span>
            <span v-else-if="it.value=='Idle'&&it.status=='WHstatus_ExecState'" :style="{background:'yellow'}" v-show="show"></span>
            <span v-else-if="it.value=='Estop'&&it.status=='WHstatus_ExecState'" :style="{background:'red'}" v-show="show"></span>
            <span v-else="it.status=='WHstatus_ExecState'" :style="{background:'gray'}" v-show="show"></span>
          </div>
        </div>
        <div v-show="show">
          <p>{{item.alias}}</p>
          <div class="uuid" >{{item.uuid}}</div>
          <div class="pres" v-show="show">加工进度</div>
          <div class="val" v-for="(it,indexs) in process" v-if="it.uuid==item.uuid" :key="indexs" v-text:msg="textVal(it)">{{msg}}</div>
        </div>
        <div v-show="!show" >
          <div class="uuid" >{{item.alias}}</div>
          <div class="val" v-show="!echart">{{textVal(item)}}</div>
          
        </div>
        <div v-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_ExecState'">
          <div v-show="!echart" class="state" v-bind:style="{backgroundColor:bgcolor}" v-if="ExecState">{{state}}</div>
          <div v-show="!echart" class="val">开始时间:{{item.time}}</div>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Efficiency'? true : false">
          <echart :option="setOptions(item)"  :id="item.status"></echart>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Efficiency_yester'? true : false">
          <echart :option="setOptions(item)"  :id="item.status"></echart>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Error'? true : false">
          <div class="uuid">消息报警</div>
          <div>{{item.value}}</div>
        </div>
        <div>
        </div>
      </router-link>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/card.scss'
</style>

<script type="text/javascript">
import {mapState} from 'vuex'
import echart from './echart.vue'
  export default{
    props:['mqtuuid','item',"process","allMqttStatus","WHstatus_ExecState"],
    data(){
      return {
        msg:"",
        arr:[],
        show:true,
        bgcolor:'',
        state:'',
        runData:[],
        echart:false,
        ExecStateState:this.WHstatus_ExecState
      }
    },
    mounted(){
        if(this.allMqttStatus){
          this.arr = this.allMqttStatus;
          this.show = false;
        }else if(this.mqtuuid){
          this.arr = this.mqtuuid;
          this.show = true;
        }else if(this.WHstatus_ExecState){
          this.show = false;
        }
    },
    components:{
      echart
    },
    computed:{
      ...mapState(['aliasMqtt']),
      filterArr:function(){
        this.arr.filter(t => {
          if(t.status == this.item.status){
            return true
          }
        })
      },
      yesOption(){
        let obj = {};
        obj.title = "昨日工时分布";
        let arr = [];
        if(this.item.value!==null&&this.item.value){
          for(var i = 0;i<this.item.value.length;i++){
            let o = {};
            if(this.item.value[i].status == "Running"){
              o.name = "加工";
              o.value = this.item.value[i].time;
            }else if(this.item.value[i].status == "Estop"){
              o.name = "紧停";
              o.value = this.item.value[i].time;
            }else if(this.item.value[i].status == "Idle"){
              o.name = "空闲";
              o.value = this.item.value[i].time;
            }else if(this.item.value[i].status == "Offline"){
              o.name = "离线";
              o.value = this.item.value[i].time;
            }
            arr.push(o)
          }
        }
        obj.data = arr;
        return obj  
      },
      setOption(){
        let obj = {};
        if(this.item.status=="WHstatus_Efficiency"){
          obj.title = "今日工时分布";
          obj.status = this.item.status;
        }else if(this.item.status=="WHstatus_Efficiency_yester"){
          obj.title = "昨日工时分布";
          obj.status = this.item.status;
        }
        let arr = [];
        if(this.item.value!==null&&this.item.value){
          for(var i = 0;i<this.item.value.length;i++){
            let o = {};
            if(this.item.value[i].status == "Running"){
              o.name = "加工";
              o.value = this.item.value[i].time;
            }else if(this.item.value[i].status == "Estop"){
              o.name = "紧停";
              o.value = this.item.value[i].time;
            }else if(this.item.value[i].status == "Idle"){
              o.name = "空闲";
              o.value = this.item.value[i].time;
            }else if(this.item.value[i].status == "Offline"){
              o.name = "离线";
              o.value = this.item.value[i].time;
            }
            arr.push(o)
          }
        }
        obj.data = arr;
        return obj
      },
      ExecState:function(){
        if(this.WHstatus_ExecState&&this.WHstatus_ExecState.status=="WHstatus_ExecState"){
          
          if(this.WHstatus_ExecState.value=="Running"){
            this.state = "运行";
            this.bgcolor = 'green'
          }else if(this.WHstatus_ExecState.value == "Idle"){
            this.state = "空闲";
            this.bgcolor = "yellow"
          }else if(this.WHstatus_ExecState.value == "Estop"){
            this.state = "紧停";
            this.bgcolor = "red";
          }else{
            this.state = "离线";
            this.bgcolor = "gray";
          }
          return true
        }else if(this.WHstatus_ExecState&&this.item.status == "WHstatus_FeedV"){
          console.log(this.item)
          this.echart = true;
          this.setOption = {
            title:'今日工时分布',

          }
          return true
        }
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
      setOptions(item){
        let obj = {};
        if(item.status=="WHstatus_Efficiency"){
          obj.title = "今日工时分布";
          obj.status = this.item.status;
        }else if(item.status=="WHstatus_Efficiency_yester"){
          obj.title = "昨日工时分布";
          obj.status = this.item.status;
        }
        let arr = [];
        if(item.value!==null&&item.value){
          for(var i = 0;i<item.value.length;i++){
            let o = {};
            if(item.value[i].status == "Running"){
              o.name = "加工";
              o.value = item.value[i].time;
            }else if(item.value[i].status == "Estop"){
              o.name = "紧停";
              o.value = item.value[i].time;
            }else if(item.value[i].status == "Idle"){
              o.name = "空闲";
              o.value = item.value[i].time;
            }else if(item.value[i].status == "Offline"){
              o.name = "离线";
              o.value = item.value[i].time;
            }
            arr.push(o)
          }
        }
        obj.data = arr;
        return obj
      },
      textVal(param){
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
       } 
    },
    watch:{
      arr:function(value){
        
      },
      WHstatus_ExecState:function(newValue){
      },
      item:function(val){

      }
    }
  }
</script>

