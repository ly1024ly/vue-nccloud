<template>
  <div class="detail">
    <el-dropdown  @command="handleCommand">
      <span class="el-dropdown-link">
        选择设备<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item command="黄金糕" >黄金糕</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/detail.scss'
</style>

<script type="text/javascript">
import * as api from '../api/server.js';
import { mapMutations,mapState} from 'vuex';

  export default{
    data(){
      return {
        mqttDetail:{},
        machinelist:[]
      }
    },
    computed:{
      ...mapState([
        'mqtt'
      ]),
    },
    methods:{
      handleCommand(command) {
        this.$emit("title",command)
      }
    },
    mounted(){
      let obj = {};
      var _this = this;
      this.handleCommand(this.$route.query.alias)
      obj.username = "ly1024";
      obj.openid = "oh9Djvup_15urtYmlsZIF-5SITeo";
      obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTc1Mjk2MDAsImlhdCI6MTUxNDk3MjE1OH0.kxgTb-2Vwvq8cTA19fc75xsF3wW0nKsBmSYL73m3Ww4";
      api.allMachineDropList(obj)
        .then(res => {
          if(res.data.result=="success"){
            
          }
        })
    },
    watch:{
      mqtt:function(value){
        console.log(value)
        this.mqttDetail = value;
      },
    }
  }
</script>