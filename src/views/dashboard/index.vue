<template>
<div style="height:100%">
 <div id="echartContainer" style="width:700px; height:500px;"></div>
</div>
</template>
<script>
let echarts = require('echarts')
export default {
  mounted() {
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('echartContainer'));
// 绘制图表
let option = {
    tooltip : {
        trigger: 'axis',
        showDelay : 0,
        axisPointer:{
            show: true,
            type : 'cross',
            lineStyle: {
                type : 'dashed',
                width : 1
            }
        }
    },
    legend: {
        data:['sin','cos']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataZoom : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    xAxis : [
        {
            type : 'value',
            scale:true
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale:true
        }
    ],
    series : [
        {
            name:'sin',
            type:'scatter',
            large: true,
            data: (function () {
                var d = [];
                var len = 10000;
                var x = 0;
                while (len--) {
                    x = (Math.random() * 10).toFixed(3) - 0;
                    d.push([
                        x,
                        //Math.random() * 10
                        (Math.sin(x) - x * (len % 2 ? 0.1 : -0.1) * Math.random()).toFixed(3) - 0
                    ]);
                }
                //console.log(d)
                return d;
            })()
        },
        {
            name:'cos',
            type:'scatter',
            large: true,
            data: (function () {
                var d = [];
                var len = 10000;
                var x = 0;
                while (len--) {
                    x = (Math.random() * 10).toFixed(3) - 0;
                    d.push([
                        x,
                        //Math.random() * 10
                        (Math.cos(x) - x * (len % 2 ? 0.1 : -0.1) * Math.random()).toFixed(3) - 0
                    ]);
                }
                //console.log(d)
                return d;
            })()
        }
    ]
};
                    
myChart.setOption(option);
}
}
</script>
