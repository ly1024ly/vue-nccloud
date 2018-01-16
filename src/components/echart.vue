<template>

  <div id="main"></div>
</template>

<style lang="scss" scoped>
@import '../style/echart.scss'
</style>

<script type="text/javascript">
  import echarts from 'echarts'
  export default {
    props:['option'],
    data() {
      return {
        chart:null,
        legend:[],
        data:this.option,
        num:[]
      }
    },
    methods:{
      drawGraph() { 
         var that = this;
         this.chart = echarts.init(document.getElementById("main"));
         this.chart.setOption({
            title : {
                text: this.data.title,
                x:'22%'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: this.legend,
                formatter:function(name){
                  for(var i=0;i<that.data.data.length;i++){
                    if(name == that.data.data[i].name){
                      return that.data.data[i].name + " "+ that.data.data[i].value;
                    }
                  }
                }
            },
            series : [
                {
                    name: '加工效率分析',
                    type: 'pie',
                    radius : '55%',
                    center: ['40%', '60%'],
                    data:this.data.data,
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
      this.num.push(this.option)
      if(this.data&&this.data.data){
        for(var i=0;i<this.data.data.length;i++){
          this.legend.push(this.data.data[i].name)
        }
      }
      this.drawGraph();
    },
    watch:{
      option:function(value){
        this.data = value;
        
        this.drawGraph();
      },
      num:function(val){
        
      }
    }
  }
</script>