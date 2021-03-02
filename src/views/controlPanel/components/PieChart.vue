<template>
  <div :class="className" :style="{height:height,width:width}" id="pieDiv"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/views/controlPanel/components/Debounce.js'
import {GetProblemClassData} from '../../../services/controlPanel.js'

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
      factorName:[],
      factorNumList:[],
      outRadius:0
    }
  },

  mounted() {
    this.handleGetDiv()
    this.handleGetDate()
    this.handleGetProblemClassData()
    this.initChart()
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
    handleGetDiv(){
      let o = document.getElementById("pieDiv");
      // let h = o.offsetHeight; //高度
      let w = o.offsetHeight; //宽度
      this.outRadius =( w * 0.4)
    },
    //得到数据
    handleGetProblemClassData(){
      GetProblemClassData().then((res) => {
        this.dataArr = res.data.list
        for(let i=0; i< this.dataArr.length; i++){
          this.factorName[i] = this.dataArr[i].factorName
          this.factorNumList[i] = this.dataArr[i].firstSeasonCount +this.dataArr[i].secondSeasonCount +this.dataArr[i].thirdSeasonCount +this.dataArr[i].fourthSeasonCount
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
    //绘制饼状图
    initChart(){
      this.chart = echarts.init(this.$el, 'macarons')
      const seriesData = []
      for(let i=0; i<this.factorName.length; i++){
        const obj = new Object()
        obj.name = this.factorName[i]
        obj.value = this.factorNumList[i]
        seriesData[i] = obj
      }
      this.chart.setOption({
        title:{
          text:this.mydate +'年问题汇总',
          textStyle:{
            fontWeight:'bold',
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          // left: 'center',
          orient: 'vertical',
          x: 'left',
          bottom: '10',
          data: this.factorName
        },
        calculable: true,
        series: [
          {
            name: '全年问题汇总',
            type: 'pie',
            roseType: 'radius',
            radius: [10, this.outRadius],
            center: ['60%', '50%'],
            data: seriesData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
  }
}
</script>
