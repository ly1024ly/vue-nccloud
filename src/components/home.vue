<template>
  <div v-bind:style="objStyle">
  <div class="line"></div>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item index="1"><i @click="asideShow" v-bind:class="this.class
"></i></el-menu-item>
  </el-menu>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)" v-show="is">
      <el-menu >
        
      <el-menu-item index="1" @click="warning('warning')" >
        <i class="el-icon-bell"></i>
        <span slot="title">消息报警</span>
      </el-menu-item>
    
      <el-menu-item index="2" @click="production('production')">
        <i class="el-icon-menu"></i>
        <span slot="title">生产监控</span>
      </el-menu-item>
        <router-link to="warning">
          <el-menu-item index="3">
            <i class="el-icon-menu"></i>
            <span slot="title">全部设备</span>
          </el-menu-item>
        </router-link>
        <router-link to="warning">
          <el-menu-item index="4">
            <i class="el-icon-menu"></i>
            <span slot="title">智能报警</span>
          </el-menu-item>
        </router-link>
        <router-link to="warning">
          <el-menu-item index="5">
            <i class="el-icon-menu"></i>
            <span slot="title">帮助中心</span>
          </el-menu-item>
        </router-link>
        <router-link to="warning">
          <el-menu-item index="6">
            <i class="el-icon-menu"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
        </router-link>
        <router-link to="warning">
          <el-menu-item index="7">
            <i class="el-icon-menu"></i>
            <span slot="title">用户信息</span>
          </el-menu-item>
        </router-link>
        <el-submenu index="8">
          <template slot="title"><i class="el-icon-menu"></i>自定义模版</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="2-4">
           <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="9">
          <template slot="title"><i class="el-icon-menu"></i>更多服务</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="2-4">
           <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <router-link to="login">
          <el-menu-item index="10">
            <i class="el-icon-menu"></i>
            <span slot="title">安全离开</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-aside>
    
    <el-container>
       <el-header style="text-align: right; font-size: 12px;position:relative;">
        <ul>
          <li>gg</li>
        </ul>
        <span>王小虎</span>
      </el-header>
      <el-main>
      	<transition name="fade" mode="out-in">
      		<router-view></router-view>
      	</transition>
      </el-main>
    </el-container>
    </el-container>
  </div>
</template>


<style lang="scss" scoped>
@import '../style/common.scss';
@import '../style/home.scss';
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
</style>

<script>

  export default {
    data() {
  		return {
        is:true,
        class:'el-icon-d-arrow-left',
  			objStyle:{
  				height:window.screen.height+"px"
  			}
  		}
	  },
    mounted(){
      console.log(window.screen.width)
      if(window.screen.width<=768){
        this.is = false;
      }
      document.title = this.$route.name;
    },
    currentRoute(to,from,next){
      console.log(to,from,next)
      next(vm => {

      })
    },
    methods:{
      warning(res){
        console.log(window.location.href)
        var url = window.location.href;
        var index = url.lastIndexOf("/");
        var openU = url.slice(0,index); 
        this.active = 'is-active';
        window.open( openU + '/warning')
      },
      production(res){
        var url = window.location.href;
        var index = url.lastIndexOf("/");
        var openU = url.slice(0,index); 
        window.open( openU + '/production')
      },
      asideShow(){
        if(this.class=="el-icon-d-arrow-left"){
          this.class="el-icon-d-arrow-right";
          this.is = false;
        }else{
          this.class="el-icon-d-arrow-left";
          this.is = true;
        }
      }
    }
  };
</script>