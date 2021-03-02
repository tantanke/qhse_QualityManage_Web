<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/views/controlPanel/components/Debounce.js'
import {GetProblemClassData} from '../../../services/controlPanel.js'

const animationDuration = 3000

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
      maxCount:'',
      dataArr:[],
      factorName:[],
      firstSeasonCount:[],
      secondSeasonCount:[],
      thirdSeasonCount:[],
      fourthSeasonCount:[],
      radarData:[]
    }
  },
  mounted() {
    this.handleGetDate()
    this.handleGetProblemClassData()
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
    handleGetProblemClassData(){
        GetProblemClassData().then((res) => {
          this.dataArr = res.data.list
          for(let i=0; i< this.dataArr.length; i++){
            this.factorName[i] = this.dataArr[i].factorName
            this.firstSeasonCount[i] = this.dataArr[i].firstSeasonCount
            this.secondSeasonCount[i] = this.dataArr[i].secondSeasonCount
            this.thirdSeasonCount[i] = this.dataArr[i].thirdSeasonCount
            this.fourthSeasonCount[i] = this.dataArr[i].fourthSeasonCount
          }
          this.maxCount = Math.max(this.firstSeasonCount[0],this.firstSeasonCount[1],this.firstSeasonCount[2],this.firstSeasonCount[3],this.firstSeasonCount[4],this.firstSeasonCount[5],
                                  this.secondSeasonCount[0],this.secondSeasonCount[1],this.secondSeasonCount[2],this.secondSeasonCount[3],this.secondSeasonCount[4],this.secondSeasonCount[5],
                                  this.thirdSeasonCount[0],this.thirdSeasonCount[1],this.thirdSeasonCount[2],this.thirdSeasonCount[3],this.thirdSeasonCount[4],this.thirdSeasonCount[5],
                                  this.fourthSeasonCount[0],this.fourthSeasonCount[1],this.fourthSeasonCount[2],this.fourthSeasonCount[3],this.fourthSeasonCount[4],this.fourthSeasonCount[5])
          for(let i=0; i <this.factorName.length ; i++){
            this.radarData[i] = { name: this.factorName[i], max: this.maxCount }
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
    //绘制雷达图
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title:{
          text:this.mydate +'年各季度问题对比',
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
        radar: {
          radius: '70%',
          center: ['60%', '50%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: this.radarData
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          bottom: '10',
          data: ['第一季度', '第二季度', '第三季度','第四季度']
        },
        series: [{
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: this.firstSeasonCount,
              name: '第一季度'
            },
            {
              value: this.secondSeasonCount,
              name: '第二季度'
            },
            {
              value: this.thirdSeasonCount,
              name: '第三季度'
            },
            {
              value: this.fourthSeasonCount,
              name: '第四季度'
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
