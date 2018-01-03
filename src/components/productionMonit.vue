<template>
  <div class="pm">
    <el-card class="box-card" v-for="(item,index) in focus" :key="index">
        <p>{{item.alias}}</p>
        <div class="uuid">{{item.uuid}}</div>
        <div class="pres">加工进度{{typeof(mqtt)}}</div>
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
              console.log("=====================")
              console.log(arr)
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

    }
  }
</script>