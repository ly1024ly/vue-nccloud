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
    <el-menu-item index="2" class="lang">
      <el-dropdown @command="changeLang">
        <span class="el-dropdown-link">
          {{language}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item :command="cn">中文</el-dropdown-item>
          <el-dropdown-item :command="en">英文(English)</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>     
    </el-menu-item>
  </el-menu>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="260px" style="background-color: rgb(238, 241, 246)" v-show="is">
      <el-menu >
        
      <el-menu-item index="1" @click="warning('warning')" >
        <i class="el-icon-bell"></i>
        <span slot="title">{{ $t("message.menu1") }}</span>
      </el-menu-item>
    
      <el-menu-item index="2" @click="production('production')">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t("message.menu2") }}</span>
      </el-menu-item>
        <router-link to="warning">
          <el-menu-item index="3">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ $t("message.menu3") }}</span>
          </el-menu-item>
        </router-link>
        <router-link to="warning">
          <el-menu-item index="4">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ $t("message.menu4") }}</span>
          </el-menu-item>
        </router-link>
        <router-link to="warning">
          <el-menu-item index="5">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ $t("message.menu5") }}</span>
          </el-menu-item>
        </router-link>
        <router-link to="warning">
          <el-menu-item index="6">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ $t("message.menu6") }}</span>
          </el-menu-item>
        </router-link>
        <router-link to="warning">
          <el-menu-item index="7">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ $t("message.menu7") }}</span>
          </el-menu-item>
        </router-link>
        <el-submenu index="8">
          <template slot="title"><i class="el-icon-menu"></i>{{ $t("message.menu8") }}</template>
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
          <template slot="title"><i class="el-icon-menu"></i>{{ $t("message.menu9") }}</template>
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
            <span slot="title">{{ $t("message.menu10") }}</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-aside>
    
    <el-container :class="cla">
       <el-header style="text-align: right; font-size: 12px;position:relative;">
        <div class="title" style="fontSize:20px;">{{title}}</div>
      </el-header>
      <el-main>
      	<transition-group name="fade" mode="out-in">
          <div key="0" class='zaochen' v-show="show"><i class="el-icon-loading"></i></div>
      		<router-view key="1" v-on:title="getTitle" v-on:success="warningSucc"></router-view>
      	</transition-group>
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
import Cookies from 'js-cookie'
  export default {
    data() {
  		return {
        cla:'',
        show:true,
        is:true,
        title:'',
        cn:'zh-CN',
        en:'zh-US',
        language:'多语言',
        class:'el-icon-d-arrow-left',
  			objStyle:{
  				height:window.screen.height+"px"
  			}
  		}
	  },
    mounted(){
        console.log(typeof(Cookies.get('locale')))
      let lang = Cookies.get('locale');
      
      if(lang===undefined||lang=="zh-CN"){
          this.language = "中文";
          this.$i18n.locale = 'zh-CN';
      }else{
          this.language = "英文English";
          this.$i18n.locale = 'zh-US';
      }
      if(this.$route.path=="/detail"){
        this.cla = "bgcolor";
      }else{
        this.cla = '';
      }
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
    watch:{
      '$route':'styleChange'
    },
    methods:{
      getTitle(value){
        this.title = value;
      },
      changeLang(command){
        this.$i18n.locale = command;
        Cookies.set('locale',command);
        if(command=="zh-CN"){
          this.language = "中文"
        }else{
          this.language = "English"
        }
      },
      warningSucc(value){
        if(value=="success"){
          this.show = false;
        }
      },
      styleChange(){
        if(this.$route.path=="/detail"){
          this.cla = "bgcolor";
        }else{
          this.cla = '';
        }
      },
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