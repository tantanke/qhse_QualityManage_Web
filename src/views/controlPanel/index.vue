<template>
<div></div>
<!--  <div class="controlPanel-container">-->
<!--    <link rel="stylesheet/scss" media="screen and (max-device-width:1440px)">-->
<!--    &lt;!&ndash; <link rel="stylesheet/scss" media="screen and (min-device-width:1280px) and (max-device-width:1680px)"> &ndash;&gt;-->
<!--    <link rel="stylesheet/scss" media="screen and (min-device-width:1440px)">-->
<!--    &lt;!&ndash; 第一行，三个柱状图 &ndash;&gt;-->
<!--    <panel-group1/>-->
<!--    &lt;!&ndash; <el-row style="padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <bar-chartAccident :chart-data="lineChartData1"/>-->
<!--      <bar-chartAccident :chart-data="lineChartData1"/>-->
<!--      <bar-chartAccident :chart-data="lineChartData1"/>-->
<!--    </el-row> &ndash;&gt;-->
<!--      <el-row :gutter="10" style="width:100%">  &lt;!&ndash; gutter栅栏间隔 &ndash;&gt;-->
<!--        <el-col class="barCol" :xs="24" :sm="24">-->
<!--          <bar-chartAccident :chart-data="barChart_accidentData"/>-->
<!--        </el-col>-->
<!--        <el-col :xs="24" :sm="24" class="barCol">-->
<!--          <bar-chartEvent :chart-data="barChart_eventData"/>-->
<!--        </el-col>-->
<!--        <el-col :xs="24" :sm="24" class="barCol">-->
<!--          <bar-chartCheck :chart-data="barChart_problemData"/>-->
<!--        </el-col>-->
<!--      </el-row>-->

<!--    &lt;!&ndash; 第二行，三个曲线图 &ndash;&gt;-->
<!--    <panel-group/>-->
<!--    &lt;!&ndash; <el-row style="padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <line-chart :chart-data="lineChartData"/>-->
<!--    </el-row> &ndash;&gt;-->
<!--    <el-row :gutter="10" style="width:100%">  &lt;!&ndash; gutter栅栏间隔 &ndash;&gt;-->
<!--      <el-col class="barCol" :xs="24" :sm="24">-->
<!--        <line-chartCheck :chart-data="lineChart_checkData"/>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" class="barCol">-->
<!--        <line-chartVerify :chart-data="lineChart_verifyData"/>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" class="barCol">-->
<!--        <line-chartSeverity :chart-data="lineChart_severityData"/>-->
<!--      </el-col>-->
<!--    </el-row>-->


<!--    &lt;!&ndash; 第三行，三个图 &ndash;&gt;-->
<!--    <el-row :gutter="10" style="width:100%">  &lt;!&ndash; gutter栅栏间隔 &ndash;&gt;-->
<!--      <el-col class="raddarCol" :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}">-->
<!--        <div class="chart-wrapper">-->
<!--          <raddar-chart/>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col class="pieCol" :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}">-->
<!--        <div class="chart-wrapper">-->
<!--          <pie-chart/>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->

<!--    &lt;!&ndash; 第四行，重大任务列表、任务进行时、巡检人员 &ndash;&gt;-->
<!--    <el-row :gutter="8">-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">-->
<!--        <el-table :data="problemTableData" style="width: 100%" border show-header :header-row-style="{height:'40px'}" :row-style="{height:'40px'}" height="530px">-->
<!--           <el-table-column class="problems" label="重大问题公示栏" >-->
<!--            <el-table-column prop="companyName" label="单位" > </el-table-column>-->
<!--            <el-table-column prop="checkDate" label="检查时间" width="180px"> </el-table-column>-->
<!--            <el-table-column prop="description" label="问题描述" show-overflow-tooltip> </el-table-column>-->
<!--           </el-table-column>-->
<!--        </el-table>-->
<!--      </el-col>-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
<!--        <el-table :data="taskTableData" style="width: 100%" border show-header :header-row-style="{height:'40px'}" :row-style="{height:'40px'}" height="530px">-->
<!--           <el-table-column class="tasks" label="最新任务">-->
<!--            <el-table-column prop="leader" label="任务人" width="120"> </el-table-column>-->
<!--            <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip> </el-table-column>-->
<!--           </el-table-column>-->
<!--        </el-table>-->
<!--      </el-col>-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
<!--        <el-table :data="checkTableData" style="width: 100%" border show-header :header-row-style="{height:'40px'}" :row-style="{height:'40px'}" height="530px">-->
<!--           <el-table-column class="checking" label="最新巡检记录">-->
<!--            <el-table-column prop="routeEmpName" label="巡检人" width="120"> </el-table-column>-->
<!--            <el-table-column prop="address" label="任务地点" show-overflow-tooltip> </el-table-column>-->
<!--           </el-table-column>-->
<!--        </el-table>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--  </div>-->

</template>


<script>
/* import {GetMonthData, GetWeekData, GetProblemList,GetTasksList,GetRouteTasks} from '../../services/controlPanel.js'
import PanelGroup1 from './components/PanelGroup1'
import BarChartAccident from './components/BarChartAccident'
import BarChartEvent from './components/BarChartEvent'
import BarChartCheck from './components/BarChartCheck'
import PanelGroup from './components/PanelGroup'
import LineChartCheck from './components/LineChartCheck'
import LineChartVerify from './components/LineChartVerify'
import LineChartSeverity from './components/LineChartSeverity'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
const DefaultQueryAccident = {
  pageName: '事故',
}
const DefaultQueryEvent = {
  pageName: '事件',
}
const DefaultQueryProblem = {
  pageName: '问题',
}

const DefaultQuerySeverityProblem = {
  isOrderBy:true,
  problemRank: '重大',
  pageIdx: 1,
  pageSize: 10,
}
const DefaultQueryTask = {
  isOrderBy:true,
  pageIdx: 1,
  pageSize: 10,
}
const DefaultQueryRouteTasks = {
  isOrderBy:true,
  pageIdx: 1,
  pageSize: 10,
}

const barChartData = {
  accidentNums: {
    lastyearData: [],
    thisyearData: []
  },
  eventNums: {
    lastyearData: [],
    thisyearData: []
  },
  problemNums: {
    lastyearData: [],
    thisyearData: []
  }
}
const lineChartData = {
  checkNums: {
    lastWeekData: [],
    thisWeekData: []
  },
  verifyNums: {
    lastWeekData: [],
    thisWeekData: []
  },
  severityNums: {
    lastWeekData: [],
    thisWeekData: []
  }
} */

export default {
  name: 'DashboardAdmin',
  components: {
    /* PanelGroup1,
    BarChartAccident,
    BarChartEvent,
    BarChartCheck,
    PanelGroup,
    LineChartCheck,
    LineChartVerify,
    LineChartSeverity,
    RaddarChart,
    PieChart, */
  },

  data() {
    return {
      /* filterQuery: {},
      lineChart_checkData: {},
      lineChart_verifyData: {},
      lineChart_severityData: {},
      barChart_accidentData: {},
      barChart_eventData: {},
      barChart_problemData: {},
      problemTableData: [], //最新10条重大问题数据表
      taskTableData:[],//最新10条任务列表
      checkTableData:[],//最新10条巡检的列表
      websock: null,//测试websocket
      information:{},
      addEventdialogVisible:false,
      messageText:'', */
    }
  },
    methods: {
/* //获取每月的数据（事故数、事件数、问题数）
      handleGetAccidentBarChartData(){
        this.filterQuery = {...DefaultQueryAccident, ...this.$route.query}
        this.filterQuery = {...this.filterQuery}
        this.loading = true
        GetMonthData(this.filterQuery).then((res) => {
          for(let i=0;i<12;i++){
            barChartData.accidentNums.lastyearData[i] = res.list_before[i].count
          }
          for(let i=0;i<12;i++){
            barChartData.accidentNums.thisyearData[i] = res.list_now[i].count
          }
          this.barChart_accidentData = barChartData.accidentNums
        })
      },
      handleGetEventBarChartData(){
        this.filterQuery = {...DefaultQueryEvent, ...this.$route.query}
        this.filterQuery = {...this.filterQuery}
        this.loading = true
        GetMonthData(this.filterQuery).then((res) => {
          for(let i=0;i<12;i++){
            barChartData.eventNums.lastyearData[i] = res.list_before[i].count
          }
          for(let i=0;i<12;i++){
            barChartData.eventNums.thisyearData[i] = res.list_now[i].count
          }
          this.barChart_eventData = barChartData.eventNums
        })
      },
      handleGetProblemBarChartData(){
        this.filterQuery = {...DefaultQueryProblem, ...this.$route.query}
        this.filterQuery = {...this.filterQuery}
        this.loading = true
        GetMonthData(this.filterQuery).then((res) => {
          for(let i=0;i<12;i++){
            barChartData.problemNums.lastyearData[i] = res.list_before[i].count
          }
          for(let i=0;i<12;i++){
            barChartData.problemNums.thisyearData[i] = res.list_now[i].count
          }
          this.barChart_problemData = barChartData.problemNums
        })
      },
//获取上周和本周的数据（检查数、整改数、验证数、登录数）
      handleGetLineChartData(){
        GetWeekData().then((res) => {
          for(let i=0;i<7;i++){
            lineChartData.checkNums.lastWeekData[i] = res.data[i].checkCount
            lineChartData.verifyNums.lastWeekData[i] = res.data[i].verifyCount
            lineChartData.severityNums.lastWeekData[i] = res.data[i].importantCount
          }
          for(let i=7;i<14;i++){
            lineChartData.checkNums.thisWeekData[i-7] = res.data[i].checkCount
            lineChartData.verifyNums.thisWeekData[i-7] = res.data[i].verifyCount
            lineChartData.severityNums.thisWeekData[i-7] = res.data[i].importantCount
          }
          this.lineChart_checkData = lineChartData.checkNums
          this.lineChart_verifyData = lineChartData.verifyNums
          this.lineChart_severityData = lineChartData.severityNums
        })
      },
//获取重大问题列表
      handleGetSeverityProblems () {
        //从query读取过滤条件
        this.filterQuery = {...DefaultQuerySeverityProblem, ...this.$route.query}
        //从query中取到的参数是string的,要转成element要求的number
        this.filterQuery = {
          ...this.filterQuery,
          pageIdx: parseInt(this.filterQuery.pageIdx, 10),
          pageSize: parseInt(this.filterQuery.pageSize, 10),
        }
        this.loading = true
        GetProblemList(this.filterQuery).then((res) => {
          this.problemTableData = res.data.list
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      },
//获取任务列表
      handleGetTasksList () {
        //从query读取过滤条件
        this.filterQuery = {...DefaultQueryTask, ...this.$route.query}
        //从query中取到的参数是string的,要转成element要求的number
        this.filterQuery = {
          ...this.filterQuery,
          pageIdx: parseInt(this.filterQuery.pageIdx, 10),
          pageSize: parseInt(this.filterQuery.pageSize, 10),
        }
        this.loading = true
        GetTasksList(this.filterQuery).then((res) => {
          this.taskTableData = res.data.list
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      },
//获取巡检列表
      handleGetRouteTasks () {
        //从query读取过滤条件
        this.filterQuery = {...DefaultQueryRouteTasks, ...this.$route.query}
        //从query中取到的参数是string的,要转成element要求的number
        this.filterQuery = {
          ...this.filterQuery,
          pageIdx: parseInt(this.filterQuery.pageIdx, 10),
          pageSize: parseInt(this.filterQuery.pageSize, 10),
        }
        this.loading = true
        GetRouteTasks(this.filterQuery).then((res) => {
          this.checkTableData = res.data.list
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      }, */
    },

    // mounted(){
    //   this.handleGetAccidentBarChartData()
    //   this.handleGetEventBarChartData()
    //   this.handleGetProblemBarChartData()
    //   this.handleGetLineChartData()
    //   this.handleGetSeverityProblems()
    //   this.handleGetTasksList()
    //   this.handleGetRouteTasks()
    // }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped  media="screen">

.controlPanel-container{
  padding: 10px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
   /*分辨率低于1280，采用下面的样式*/
    @media screen and (max-device-width:1440px){
        .raddarCol{
          width: 100%
        }
        .pieCol{
          width: 100%
        }
        .barCol{
          width: 100%
        }
    }
    /*分辨率介于1280-1680，采用下面的样式*/
    // @media screen and (min-device-width:1280px) and (max-device-width:1680px){
    //     .raddarCol{
    //       width: 50%
    //     }
    //     .pieCol{
    //       width: 50%
    //     }
    //     .barCol{
    //       width: 33%
    //     }
    // }
    /*分辨率高于1680，采用下面的样式*/
    @media screen and (min-device-width: 1440px){
        .raddarCol{
          width: 50%
        }
        .pieCol{
          width: 50%
        }
        .barCol{
          width: 33%
        }
    }
</style>
<style>

</style>
