<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/views/controlPanel/components/Debounce.js'
import {GetProblemRepeatData} from '../../../services/controlPanel.js'

const animationDuration = 3000    //柱状图动画加载时间

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      mydate:'',
      dataArr:[],
      months:[],               //月份
      normalCount:[],          //普遍性
      repeatCount:[],          //重复性
      emergingCount:[],        //新出现
    }
  },
  mounted() {
    this.handleGetDate()
    this.handleGetProblemRepeatData()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    //得到数据
    handleGetProblemRepeatData(){
        GetProblemRepeatData().then((res) => {
          this.dataArr = res.data
          for(let i=0; i< this.dataArr.length; i++){
            this.months[i] = this.dataArr[i].months
            this.repeatCount[i] = this.dataArr[i].repeatCount
            this.normalCount[i] = this.dataArr[i].normalCount
            this.emergingCount[i] = this.dataArr[i].emergingCount
          }
          this.initChart()
        })
      },
    //获取年份
    handleGetDate(){
      let date = new Date
      let year = date.getFullYear()
      this.mydate = year.toString()
    },
    //绘制柱状图
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title:{
          text:this.mydate + '年问题普遍性分析',
          textStyle:{
            fontWeight:'bold',
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '12%',
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.months,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel:{
            rotate:30,//倾斜度 -90 至 90 默认为0
        },
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '普遍性',
          type: 'bar',
          stack: 'vistors',
          barMaxWidth:30,
          barWidth: '50%',
          data: this.normalCount,
          animationDuration
        }, {
          name: '重复性',
          type: 'bar',
          stack: 'vistors',
          barMaxWidth:30,
          barWidth: '50%',
          data: this.repeatCount,
          animationDuration
        }, {
          name: '新出现',
          type: 'bar',
          stack: 'vistors',
          barMaxWidth:30,
          barWidth: '50%',
          data: this.emergingCount,
          animationDuration
        }]
      })
    }
  }
}
</script>
