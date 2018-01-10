<template>
	<div class="warning">
    <el-card class="box-card" v-for="(items,index) in card" :key="index">
      <h4>{{items.alias}}</h4>
      <div class="machine">{{items.uuid}}</div>
      <div v-for="(item,index) in items.alarminfo" :key="index" class="text item">
        <div class="warn">{{item.value}}</div>
        <span class="time">{{item.timeStamp.split('T').join(' ').split('.')[0]}}</span>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/warning.scss';
</style>

<script type="text/javascript">
   import * as api from '../api/server.js';
   export default {
    data() {
      return {
        card:[]
      }
    },
    mounted(){
        let obj = {};
      obj.username = "ly1024";
      obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTYyMzM2MDAsImlhdCI6MTUxMzY0ODAxM30.lv9HRoXgamAi-Xw4aWgU0Wpr1hMoRRHd67nUcf7vPLw"
      api.htrMsg(obj)
        .then(res => {
            if(res.data.result=="success"){
              this.card = res.data.value;
              this.$emit("success","success");
              console.log(res)
            }
        })
        .catch(err => {

        })
    },
    methods:{
      getHistory(){
      
      }
    }
   }
</script>