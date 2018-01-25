<template>

  <div :id="id" class="main" :style="parentStyle"></div>
</template>

<style lang="scss" scoped>
@import '../style/echart.scss'
</style>

<script type="text/javascript">
  import echarts from 'echarts'
  export default {
    props:['option',"id","parentStyle"],
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
      drawLineGraph(id,data){
        this.chart = echarts.init(document.getElementById(id));
        console.log("&&&&&&&&&&&&&echart&&&&&&&&&&&&&&&&&&&&&&&&&&")
        console.log(data)
        this.chart.setOption({
            title: {
                text: 'Beijing AQI'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: data.map(function (item) {
                    return item[0];
                })
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            },
            toolbox: {
                left: 'center',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: [{
                startValue: '2014-06-01'
            }, {
                type: 'inside'
            }],
            visualMap: {
                top: 10,
                right: 10,
                pieces: [{
                    gt: 0,
                    lte: 4,
                    color: '#096'
                }, {
                    gt: 4,
                    lte: 8,
                    color: '#ffde33'
                }, {
                    gt: 8,
                    lte: 12,
                    color: '#ff9933'
                }, {
                    gt: 12,
                    lte: 16,
                    color: '#cc0033'
                }, {
                    gt: 16,
                    lte: 20,
                    color: '#660099'
                }, {
                    gt: 20,
                    color: '#7e0023'
                }],
                outOfRange: {
                    color: '#999'
                }
            },
            series: {
                name: 'Beijing AQI',
                type: 'line',
                data: data.map(function (item) {
                    return item[1];
                }),
                markLine: {
                    silent: true,
                    data: [{
                        yAxis: 4
                    }, {
                        yAxis: 8
                    }, {
                        yAxis: 12
                    }, {
                        yAxis: 16
                    }, {
                        yAxis: 20
                    }]
                }
            }
        })
      },
      drawPieGraph(id,data) { 
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
                    name: data.name,
                    type: data.type,
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
      if(this.option.type == "pie"){
        this.drawPieGraph(this.id,this.option);
      }else if(this.option.type == "line"){
            this.drawLineGraph(this.id,this.option.data);
      }
    },
    watch:{
      option:function(value){
        this.data = value;
        if(value.type=="pie"){
            this.drawPieGraph(this.id,value);
        }
        if(value.type=="line"){
            this.drawLineGraph(this.id,value.data);
        }
      },
      num:function(val){
        
      },
      item:function(val){
      }

    }
  }
</script>