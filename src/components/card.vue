<template>
  <div class="card" >
    <el-card class="box-card" >
      <router-link :to="{path:'detail',query:{uuid:item.uuid,alias:item.alias}}" v-show="show">
        <div class="stat" v-for="(it,indexs) in arr" :key="indexs">
          <div v-if="mqtuuid&&it.uuid==item.uuid">
            <span v-if="running(it)" :style="{background:'green'}" v-show="show"></span>
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
        </router-link>
        <div v-show="!show" >
          <div class="uuid" >{{item.alias}}</div>
          <el-progress v-show="item.alias=='加工进度'" :text-inside="true" :stroke-width="18" v-if="item.status=='WHstatus_HadCompletedPercent'" :percentage="Number(item.value)"></el-progress>
          <div class="val" v-show="!echart">{{textVal(item)}}</div>
          <i v-if="item.alias=='进给速度'" class="el-icon-zoom-in" @click="feedv(item)"></i>
          <i class="el-icon-remove" v-show="icon" v-if="item.status!=='WHstatus_ExecState'" @click="removeCard(item)"></i>
        </div>
        <div v-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_ExecState'">
          <div v-show="!echart" class="state" v-bind:style="{backgroundColor:bgcolor}" v-if="ExecState">{{state}}</div>
          <div v-show="!echart" class="val">开始时间:{{item.time}}</div>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Timeline'? true : false">
          <div class="pres">运行日志</div>
          <div class="log">
            <div class="first"></div>
            <div class="second"></div>
            <div class="third"></div>
            <div class="fourth" v-html="timelineStyle">
              {{timelineStyle}}
            </div>
          </div>
          <div class="container_s">
            <div class="first_div">0:00</div>
            <div class="second_div">8:00</div>
            <div class="third_div">16:00</div>
            <div class="fouth_div">24:00</div>
          </div>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Efficiency'? true : false">
          <echart :option="setOptions(item)"  :id="item.status"></echart>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Efficiency_yester'? true : false">
          <echart :option="setOptions(item)"  :id="item.status"></echart>
        </div>
        <div v-else-if="warning" class="mesWarn">
          <div class="uuid">消息报警</div>
          <div class="alarm" v-for="(item,index) in wh_error" :key="index">{{item.value}} <span v-if="item">[{{item.time.split("T").join(" ").slice(0,19)}}]</span></div>
          
        </div>
        <div>
        </div>
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
    props:['mqtuuid','item',"process","allMqttStatus","WHstatus_ExecState","icon","euuid","all"],
    data(){
      return {
        msg:"",
        arr:[],
        show:true,
        bgcolor:'',
        state:'',
        runData:[],
        echart:false,
        wh_error:[],
        line:"",
        allshow:true,
        ExecStateState:this.WHstatus_ExecState
      }
    },
    mounted(){
        if(this.allMqttStatus){
        //如果是设备详情8个设备参数
          this.arr = this.allMqttStatus;
        //生产监控里的页面
          this.show = false;
          this.allshow = false;
        //删除icon
        }else if(this.mqtuuid){
        //当传来的是生产监控页面时的
          this.arr = this.mqtuuid;
          this.show = true;
          this.allshow = false;
        }else if(this.WHstatus_ExecState){
        //echarts图表里的参数
          this.show = false;
          this.allshow = false;
        }else if(this.all){
          this.arr = this.all;
          this.show = false;
          this.allshow = true;
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
      timelineStyle(){
        let values = this.timeLineMethods(this.item);
        var machine_width = 335;
        var html ="";
        for(var i = 0; i < values.length; i++) {
          var sIndex = values[i].time / (24 * 60 * 60) * machine_width;
          var sL = values[i]._timeStamp / (24 * 60 * 60) * machine_width;
          var sColor = this.getcolor(values[i]._value);
          html += "<div class='time_line_item'  style='background:" + sColor + ";height: 14px;position:absolute;top:0;left:" + sIndex + "px;width:" + sL + "px;'>" + "</div>";        
        }
        return html
      },
      warning(){
        if(this.WHstatus_ExecState&&this.WHstatus_ExecState.status == 'WHstatus_Error'){
          let that = this;
          let arr = [];
          this.allMqttStatus.forEach(function(val){
            if(val.uuid == that.euuid){
              val.data.forEach(function(data){
                if(data.status == "WHstatus_Warning"){
                  let obj = {
                    value:data.value,
                    time:data.time
                  }
                  arr.push(obj)
                }else if(data.status == "WHstatus_Error"){
                  let obj = {
                    value:data.value,
                    time:data.time
                  }
                  arr.push(obj)               
                }
              })
            }
          })
          let set = new Set(arr)
          this.wh_error = Array.from(set);
          return true
        }
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
      feedv(val){
        this.$emit("showFeedv",true)
      },
      running(it){
        var reg = /^[0-9]+.?[0-9]*$/;
        let result = reg.test(it.value);
        if(it.value=='Running'&&it.status=='WHstatus_ExecState'||result){
          return true
        }
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
      getcolor(execstatus) {
        var color = 'gray';
        if(execstatus == "Running") {
          color = "#00BA00";
        } else if(execstatus == "Idle") {
          color = "#FFD900";
        } else if(execstatus == "Estop") {
          color = "#FF2609";
        }
        return color;
      },
      removeCard(rel){
        this.$emit("remove",rel)
      },
      timeLineMethods(g_timeline){
          var newObj = {
            "value": []
          };
          var compare = function(obj1, Obj2) {
            var val1 = obj1._timeStamp;
            var val2 = Obj2._timeStamp;
            if(val1 < val2) {
              return -1;
            } else if(val1 > val2) {
              return 1
            } else {
              return 0;
            }
          }
          //把当前的时间戳压进去,
          var current = new Date().getTime() + 8 * 60 * 60 * 1000;
          //然后转化为东八区，当前的时间;
          var currents = new Date(current).toISOString();
          currents = currents.substring(0, 19);
          var b = {
            "_timeStamp": currents,
            "_value": ""
          }
          g_timeline.value.push(b);
          var sortObj = g_timeline.value.sort(compare);
          //判断是否在同一天
          var data1 = g_timeline.value[0]._timeStamp.substring(0, 10);
          var data2 = g_timeline.value[g_timeline.value.length - 1]._timeStamp.substring(0, 10);
          //让不在一天以内的时间，统一到在一天以内，删除那些不在一天以内的元素；
          for(var i = g_timeline.value.length - 1; i >= 0; i--) {
            if(data2 !== g_timeline.value[i]._timeStamp.substring(0, 10)) {
              var status = g_timeline.value[i]._value;
              g_timeline.value.splice(0, i + 1)
              zero = data2 + "T" + "00:00:00";
              var a = {
                "_timeStamp": zero,
                "_value": status
              }
              g_timeline.value.unshift(a);
              break;
            }
            if(i == 0) {
              var zeros = data2 + "T" + "00:00:00";
              var b = {
                "_timeStamp": zeros,
                "_value": status
              }
              g_timeline.value.unshift(b);
            }
          }
          //==========================
          var time_diff1, time_diff2;
          //把数组的时间差放进数组对象里；
          for(var i = 0; i < g_timeline.value.length - 1; i++) {
            var _1 = g_timeline.value[i];
            var _2 = g_timeline.value[i + 1];
            time_diff1 = new Date(_1._timeStamp).getTime() / 1000;
            //获取数组的第一个时间的毫秒数；
            var obj0 = new Date(g_timeline.value[0]._timeStamp).getTime() / 1000;
            time_diff2 = new Date(_2._timeStamp).getTime() / 1000;
            var obj2 = {
              "_timeStamp": time_diff2 - time_diff1,
              "_value": _1._value,
              "time": time_diff1 - obj0
            }
            newObj.value.push(obj2)
          }
          //动态生成=============================
          return newObj.value
          newObj.value = [];
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
        let todayRemain = 0;
        if(item.value!==null&&item.value){
          for(var i = 0;i<item.value.length;i++){
            if(item.status == "WHstatus_Efficiency"){
              todayRemain += item.value[i].time;
            }
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
        if(todayRemain>0){
          let val = 24 * 3600 * 1000 - todayRemain;
          let o = {
            name:"剩余时间",
            value:val
          }
          arr.push(o)
        }
        obj.type = "pie";
        obj.name = "加工效率分析";
        obj.data = arr;
        return obj
      },
      textVal(param){
        let name = param.status;
        let value = param.value;
        let time = param.time||param.value;
        let val;
        if(name == "WHstatus_TotalCompletedCount") {
          val = value + " 件";
        } else if(name == "WHstatus_ControllerMode") {
          val = value;
        } else if(name == "WHstatus_FeedV") {
          if(time){
          val =  this.feedVSstyle(value) + "  mm/min";
          }
        } else if(name == "WHstatus_SpindleFeedrate") {
          val = value + " %";
        } else if(name == "WHstatus_SpindleSpeed") {
          val = value + "  rpm";
        } else if(name == "WHstatus_FeedRate") {
          val = value + "  %";
        } else if(name == "WHstatus_HadCompletedPercent") {
          val = value + "  %";
        } else if(name == "WHstatus_programName") {
          if(value == ''||time.value == '') {
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
        } else if(name == 'WHstatus_Error') {

        } else if(value==''||time == ''){
           val = '****';
        }
        return val
       } 
    },
    watch:{
      arr:function(value){
        
      },
      WHstatus_ExecState:function(newValue){
      },
      item:function(val){

      },
      process(val){
      },
      mqtuuid:function(val){
        console.log(val)
      },
      allMqttStatus:function(val){
      }
    }
  }
</script>

