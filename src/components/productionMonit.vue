<template>
  <div class="pm">
    <el-card class="box-card" v-for="(item,index) in focus" :key="index">
        <p>{{item.alias}}</p>
        <div class="uuid">{{item.uuid}}</div>
        <div class="pres">加工进度{{mqtt}}</div>
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

  export default {
    data() {
      return {
        focus:[]
      }
    },
    computed:{
      ...mapState([
        'mqtt'
      ]),
    },
    methods:{
      ...mapMutations(['FOCUS_MACHINE','MQTT']),
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
      mqttDetail(uuid,status,value,timestamp) {
        alert(uuid,status,value,timestamp)
        console.log("fdsg")
      },
    },
    mounted(){
      document.title = this.$route.name;
      var obj = {};
      obj.username = "ly1024";
      obj.openid = "undefined";
      obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTYyMzM2MDAsImlhdCI6MTUxMzY0ODAxM30.lv9HRoXgamAi-Xw4aWgU0Wpr1hMoRRHd67nUcf7vPLw"
       api.getFocusMachine(obj)
        .then((res) => res.json())
        .then(json => {
          if(json.result=="success"){
            let arr = [];
            json.values.forEach(function(value){
            console.log(value)
              let obj = {};
              obj.uuid = value.uuid;
              obj.item = [value.item,"WHstatus_ExecState"];
              obj.enable = true;
              arr.push(obj);
            })
            this.focus = json.values;
            this.FOCUS_MACHINE(json.values);
            var _this = this;
            this.MQTT(arr);
            
          }else{
            this.open()
          }
        })
    },
    watch:{

    }
  }
</script>