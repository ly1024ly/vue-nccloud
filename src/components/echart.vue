<template>

  <div :id="id" class="main"></div>
</template>

<style lang="scss" scoped>
@import '../style/echart.scss'
</style>

<script type="text/javascript">
  import echarts from 'echarts'
  export default {
    props:['option',"id"],
    data() {
      return {
        chart:null,
        legend:[],
        data:this.option,
        num:[],
        rid:this.id
      }
    },
    methods:{
      drawGraph(id,data) { 
        var that = this;
        this.chart = echarts.init(document.getElementById(id));
        let legend = [];
        for(var i=0;i<data.data.length;i++){
          legend.push(data.data[i].name)
        }
        this.chart.setOption({
            title : {
                text: data.title,
                x:'22%'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: legend,
                formatter:function(name){
                  for(var i=0;i<data.data.length;i++){
                    if(name == data.data[i].name){
                      return data.data[i].name + " "+ data.data[i].value;
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
                    data:data.data,
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
      this.data = this.option;
      if(this.data&&this.data.data){
        for(var i=0;i<this.data.data.length;i++){
          this.legend.push(this.data.data[i].name)
        }
      }
      this.drawGraph(this.id,this.option);
    },
    watch:{
      option:function(value){
        this.data = value;
        
        this.drawGraph(this.id,value);
      },
      num:function(val){
        
      },
      item:function(val){
      }

    }
  }
</script>