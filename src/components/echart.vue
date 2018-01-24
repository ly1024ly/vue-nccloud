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
      drawLineGraph(id){
        this.chart = echarts.init(document.getElementById(id));
        this.chart.setOption({
    title : {
        text: '未来一周气温变化',
        subtext: '纯属虚构'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['最高气温','最低气温']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
            }
        }
    ],
    series : [
        {
            name:'最高气温',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        },
        {
            name:'最低气温',
            type:'line',
            data:[1, -2, 2, 5, 3, 2, 0],
            markPoint : {
                data : [
                    {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name : '平均值'}
                ]
            }
        }
    ]
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
            this.drawLineGraph(this.id);
      }
    },
    watch:{
      option:function(value){
        this.data = value;
        console.log(value)
        if(value.type=="pie"){
            this.drawPieGraph(this.id,value);
        }
        if(value.type=="line"){
            this.drawLineGraph(this.id);
        }
      },
      num:function(val){
        
      },
      item:function(val){
      }

    }
  }
</script>