<template>
  <div>
    <div class="page-title" style="width:100%">按任务工序分析</div>
    <div class="page-content">
      <el-form :model="filterQuery">
        <el-row>
          <el-col :span="9">
            <el-form-item label="受检单位" label-width="20%">
              <treeselect
              filterable
              :multiple="false"
              :options="options"
              placeholder="请选择受检单位"
              v-model="filterQuery.companyCode"
              style="width:80%"/> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查时间">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:80%">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="handleAnalysis()" style="width:80%">分析</el-button>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :span="8">
            <div id="pie-container" style="border: 1px solid black;width:95%;height:500px"></div>
          </el-col>
          <el-col :span="16">
            <div id="bar-container" style="border: 1px solid black;width:95%;height:500px"></div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetTaskprocedureAnalysis} from '../../../services/TaskprocedureAnalysis'
import {GetCompany} from '../../../services/gettreedata'
import echarts from 'echarts'
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')

const DefaultQuery = {
  companyCode: null,
  startDate: '',
  endDate: '',
}

export default {
  data(){
    return{
      options:[],
      value:[],
      dateRange:[], //时间查询，v-model绑定
      filterQuery: {},
      taskprocessData:[],
      taskNameList:[],
      checkCountList:[],
      rectiCountList:[],
      verifyCountList:[],
      totalNum:[],
    }
  },

  mounted() {
    this.loadFilterParams()
    this.handleAnalysis()
    this.handleGetCompany()
  },

  methods: {
//初始获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
//加载条件
    loadFilterParams(){
      //整理筛选条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {...this.filterQuery}
      //填充datepicker range组件的内容
      if (this.filterQuery.startDate && this.filterQuery.endDate) {
        this.dateRange = [this.filterQuery.startDate, this.filterQuery.endDate]
      }
    },
//点击分析按钮，绘制ECharts
    handleAnalysis(){
      this.checkFilterParams()
      this.$router.push({query: this.filterQuery})
      this.handleGetTaskprocedureAnalysis()
    },
    checkFilterParams () {
      //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
      if (this.dateRange && this.dateRange.length === 2) {
        this.filterQuery.startDate = this.dateRange[0]+' '+'00:00:00'
        this.filterQuery.endDate = this.dateRange[1]+' '+'23:59:59'
      } else {
        this.filterQuery.startDate = ''
        this.filterQuery.endDate = ''
      }
    },
    handleGetTaskprocedureAnalysis(){
      this.loading = true
      GetTaskprocedureAnalysis(this.filterQuery).then((res) => {
        if(res.data.length === 0){
          this.$message({
            message: '此筛选条件下无数据！',
            type: 'warning',
            duration:3000,
          });
        }
        this.taskprocessData = res.data
        this.loading = false
        for(let i=0; i<this.taskprocessData.length; i++){
          if(this.taskprocessData[i].taskName){
            this.taskNameList[i] = this.taskprocessData[i].taskName
          }else{
            this.taskNameList[i] = '未填写任务工序'
          }
          if(this.taskprocessData[i].checkCount){
            this.checkCountList[i] = this.taskprocessData[i].checkCount
          }else{
            this.checkCountList[i] = 0
          }
          if(this.taskprocessData[i].rectiCount){
            this.rectiCountList[i] = this.taskprocessData[i].rectiCount
          }else{
            this.rectiCountList[i] = 0
          }
          if(this.taskprocessData[i].verifyCount){
            this.verifyCountList[i] = this.taskprocessData[i].verifyCount
          }else{
            this.verifyCountList[i] = 0
          }
          this.totalNum[i] = this.checkCountList[i] + this.rectiCountList[i]+this.verifyCountList[i]
        }
        console.log(JSON.stringify(this.taskNameList))
        console.log(JSON.stringify(this.checkCountList))
        console.log(JSON.stringify(this.rectiCountList))
        console.log(JSON.stringify(this.verifyCountList))
        console.log(JSON.stringify(this.totalNum))
        this.loading = false
        //绘制饼状图
        this.handlePieChart()
        //绘制柱状图
        this.handleBarChart()
        this.taskNameList = []
        this.checkCountList = []
        this.verifyCountList = []
        this.rectiCountList = []
        this.totalNum = []
      })
    },
//点击绘制饼状图
    handlePieChart(){
      this.chart = echarts.init(document.getElementById('pie-container'));
      const seriesData = []
      for(let i=0; i<this.taskNameList.length;i++){
        const obj = new Object()
        obj.name = this.taskNameList[i]
        obj.value = this.totalNum[i]
        seriesData[i] = obj
      }
      this.chart.setOption({
        title:{
          text:'问题汇总',
          textStyle:{
            fontWeight:'bold',
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.taskNameList
        },
        toolbox: {
          show : true,
          feature : {
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        calculable: true,
        series: [{
          name: '某单位问题汇总',
          type: 'pie',
          radius: [20, 100],
          center: ['50%', '50%'],
          data: seriesData,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        }]
      })
    },
//点击绘制柱状图
    handleBarChart(){
      this.chart = echarts.init(document.getElementById('bar-container'));
      this.chart.setOption({
        title : {
          text: '问题汇总',
          textStyle:{
            fontWeight:'bold',
          }
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          bottom: 10,
          left:"center",
          data:['检查数','整改数','验证数']
        },
        toolbox: {
          show : true,
          feature : {
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        calculable : true,
        xAxis : [{
          type : 'category',
          data : this.taskNameList
        }],
        yAxis : [{
          type : 'value'
        }],
        series : [{
          name:'检查数',
          type:'bar',
          barMaxWidth:30,
          data:this.checkCountList,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        },{
          name:'整改数',
          type:'bar',
          barMaxWidth:30,
          data:this.rectiCountList,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        },{
          name:'验证数',
          type:'bar',
          barMaxWidth:30,
          data:this.verifyCountList,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        }]
      })
    },
  }
}
</script>

<style>

</style>
