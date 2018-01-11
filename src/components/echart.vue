<template>
  <div id="main"></div>
</template>

<style lang="scss" scoped>
@import '../style/echart.scss'
</style>

<script type="text/javascript">
  import echarts from 'echarts'
  export default {
    data() {
      return {
        chart:null
      }
    },
    methods:{
      drawGraph() { 
         this.chart = echarts.init(document.getElementById("main"));
         this.chart.setOption({
            title : {
                text: '某站点用户访问来源',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                textStyle:{
                  color:'rgba(255, 255, 255, 0.6)'
                },
                data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ],
                    labelLine:{
                        normal:{
                          show:false
                        }
                    },
                    label:{
                      normal:{
                        show:false
                      }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
         })  
      } 
    },
    mounted(){
      this.drawGraph();
    }
  }
</script>