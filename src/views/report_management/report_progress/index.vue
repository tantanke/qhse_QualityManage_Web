<template>
    <div>
        <div class="page-title">报告进度</div>
        <div class="page-content">
          <el-form :inline="true" :model="filterQuery">
            <el-form-item label="单位：">
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择单位名称"
              v-model="filterQuery.companyCode"
              style="width:250px"/>
            </el-form-item>
            <el-form-item label="类别：">            
              <el-select 
              clearable 
              v-model="filterQuery.reportType" 
              placeholder="请选择类别名称" 
              style="width: 100%;" 
              @change="onSelectedReportType">
              <el-option
                v-for="item in reportTypes"
                :key="item.id"
                :label="item.name"
                :value="item.dictCode">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报告时间：">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:300px">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAnalysis" icon='el-icon-search'>分析</el-button>
            </el-form-item>
          </el-form>
          <el-row>
            <el-col :span="9">
            <el-table
            :data="tableData"
            border
            max-height="600"
            style="width: 100%">
            <el-table-column
            prop="companyName"
            label="单位">
            </el-table-column>
            <el-table-column
            prop="total"
            label="计划数"
            width="70">
            </el-table-column>
            <el-table-column
            prop="compelet"
            label="完成数"
            width="70">
            </el-table-column>
            <el-table-column
            label="未完成数"
            width="100">
            <template slot-scope="scope">
              <div class="inline-td">
                <router-link :to='{name: "ReportProgressIncomplete", params: {data:scope.row,selectData:filterQuery}}'>
                  <el-button size="mini" type="text" >{{scope.row.incompelet}}</el-button>
                </router-link>
              </div>
            </template>
            </el-table-column>
           <el-table-column
            prop="completePrecent"
            label="完成比例"
            width="100">
            </el-table-column>
            </el-table>
            </el-col >
            <el-col  :span="15">
            <div id="bar-container" style="border: 1px solid black;width:95%;height:600px"></div>
            </el-col>
        </el-row> 
        </div>
    </div>
</template>

<script>
import {GetDictionary} from '../../../services/dictionary'
import {GetReportProgress} from '../../../services/report_progress'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import echarts from 'echarts'
require('echarts/lib/chart/bar')
const DefaultQuery = {
    companyCode: null,
    reportType: "",
    beginTime: "",
    endTime: ""
}

export default {
  components: { Treeselect },
    data() {
      return {
        ruleCode:"",
        dateRange:"",
        addEventdialogVisible:false,
        indexStartNum:1,//起始页码
        loading: false,
        options: [],
        reportTypes:[],
        reportType:"",
        beginTime: "",
        endTime: "",
        companyCode: null,
        tableData:[],
        totalList:[],
        compeletList:[],
        incompeletList:[],
        companyList:[],
        filterQuery: {}
      }
    },
    mounted () {
    this.handleGetCompany()
    this.getreportType()
    this.loadFilterParams()
    this.handleAnalysis()
    },
    methods: {
      handleGetReportProgress () {
      this.loading = true
      this.$router.push({query: this.filterQuery})
      GetReportProgress(this.filterQuery).then((res) => {
        this.tableData = res.data
        res.data.forEach((item)=>{
          this.companyList.push(item.companyName)
          this.compeletList.push(item.compelet)
          this.incompeletList.push(item.incompelet)
          this.totalList.push(item.total)
        })
        this.initBarChart()
        this.totalList=[]
        this.compeletList=[]
        this.incompeletList=[]
        this.companyList=[]
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
      //绘制柱状图
    initBarChart(){
      this.chart = echarts.init(document.getElementById('bar-container'));
      this.chart.setOption({
        title : {
          text: '报告进度',
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
          data:['计划数','完成数','未完成数']
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
          data : this.companyList
        }],
        yAxis : [{
          type : 'value'
        }],
        series : [{
          name:'计划数',
          type:'bar',
          barMaxWidth:30,
          data:this.totalList,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        },{
          name:'完成数',
          type:'bar',
          barMaxWidth:30,
          data:this.compeletList,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        },{
          name:'未完成数',
          type:'bar',
          barMaxWidth:30,
          data:this.incompeletList,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        }]
      })
    },
      getreportType() {
        GetDictionary({name: '检验报告类别'}).then((res) => {
          this.reportTypes = res.data
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      onSelectedReportType(selectValue){
        this.reportTypes.forEach(item => {
          if(item.dictCode === selectValue){
            this.filterQuery.reportTypeName = item.name
          }
        })
        this.filterQuery.reportType = selectValue  
      },
      handleGetCompany(){
        GetCompany().then((res) => {
          this.options = res.data;
          this.filterQuery.companyCode = res.data[0].companyCode
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      checkFilterParams () {
        if (this.dateRange && this.dateRange.length === 2) {
          this.filterQuery.beginTime = this.dateRange[0]+' '+'00:00:00'
          this.filterQuery.endTime = this.dateRange[1]+' '+'23:59:59'
          } else {
            this.filterQuery.beginTime = ''
            this.filterQuery.endTime = ''
          }
        },
    loadFilterParams(){
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      this.filterQuery = {...this.filterQuery}
      // if(this.$route.params.data){
      //   this.$route.params.data && localStorage.setItem('data',JSON.stringify(this.$route.params.data));
      //   const data1 = JSON.parse(localStorage.getItem('data'))
      //   console.log(JSON.stringify(data1))

      //   this.filterQuery.beginTime = data1.beginTime.substring(0,10)
      //   this.filterQuery.endTime = data1.endTime.substring(0,10)
      //   this.filterQuery.reportType = data1.reportType
      //   this.filterQuery.companyCode = data1.companyCode
      //   this.filterQuery.reportTypeName = data1.reportTypeName
      // }
      if (this.filterQuery.beginTime && this.filterQuery.endTime) {
        this.dateRange = [this.filterQuery.beginTime, this.filterQuery.endTime]
      }
    },
      //点击分析按钮，绘制ECharts
    handleAnalysis(){   
      this.checkFilterParams()
      this.handleGetReportProgress()
    },
  }
}
</script>
<style scoped>
</style>