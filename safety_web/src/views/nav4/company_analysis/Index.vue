<template>
  <div class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title" >按单位分析</div>
    <div class="page-content">
      <el-form  :inline="true" :model="formData" label-position='left'>
        <el-row>
            <el-form-item label="受检单位:">
              <treeselect
              filterable
              :multiple="false"
              :options="options"
              placeholder="受检单位"
              v-model="formData.companyCode"
              style="width:280px;margin-left:10px"/> 
            </el-form-item>
             &nbsp; &nbsp; &nbsp; &nbsp;
            <el-form-item label="检查时间：">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:280px" >
            </el-date-picker>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="选择任务：">
            <el-select style="width:280px"  v-model="formData.task" placeholder="请选择任务名称" @change="onChangedTask" clearable>
              <el-option v-for="item in tasks" :key="item.taskAndProcessCode" :label="item.task" :value="item.taskAndProcessName"></el-option>
            </el-select>
            </el-form-item>
             &nbsp; &nbsp; &nbsp; &nbsp;
            <el-form-item label="选择工序：" >
            <el-select style="width:280px" v-model="formData.process" placeholder="请选择工序名称"  @change="onChangedProcess" clearable>
              <el-option v-for="item in processes" :key="item.taskAndProcessCode" :label="item.process" :value="item.taskAndProcessName"></el-option>
            </el-select>
            </el-form-item>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <el-form-item>
            <el-button type="primary" @click="handleAnalysis()" style="width:100px">分析</el-button>
            </el-form-item>
        </el-row>
        <br>
        <el-row>
          <div id="mixChart-container" style="border: 1px solid black;height:500px"></div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import {GetCompanyProblemClassAnalysis,GetTasks,GetProcesses} from './companyAnalysis.js'
import echarts from 'echarts'
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')

const DefaultQuery = {
  companyCode: '',
  startDate: '',
  endDate: '',
  taskAndProcessCode:''
}

export default {
  data(){
    return{
      options:[],
      value:[],
      dateRange:'', //时间查询，v-model绑定
      filterQuery: {},
      problemData:[],
      companyNameList:[],
      largerProblemsList:[],
      majorProblemsList:[],
      totalNum:[],
      formData:{
        companyCode:null,
        task:'',
        process:'',
        taskAndProcessCode:'',
        temporaryCode:''  //临时存放任务的Code
      },
      tasks:[],
      processes:[],
    }
  },
  mounted() {
    this.loadFilterParams()
    this.handleAnalysis()
    this.handleGetCompany()
    this.handleGetTaskProcedure()
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
//初始获取任务名称、任务工序、任务工序编码。
    handleGetTaskProcedure(){
      GetTasks({name:''}).then((res) => {     
        for(let i=0;i<res.data.list.length;i++){   //筛选编码为2位数
          if(res.data.list[i].taskAndProcessCode.length === 2){
            this.tasks.push(res.data.list[i])
          }
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    onChangedTask(selectValue) {
      let obj = []
      //遍历下拉数组中的item
      if(selectValue === ''){
        this.formData.taskAndProcessCode = ''
        this.formData.temporaryCode = ''
      }else{
        obj = this.tasks.find((item)=>{
          return item.taskAndProcessName === selectValue
        })
        this.formData.task= obj.taskAndProcessName     
        this.formData.taskAndProcessCode = obj.taskAndProcessCode  
        this.formData.temporaryCode = obj.taskAndProcessCode
        this.processes = []
        this.formData.process = ''
        this.handleGetProcesses() 
      }
    },    
    handleGetProcesses(){
      GetProcesses({taskAndProcessCode:this.formData.taskAndProcessCode}).then((res) => {   
        for(let i=0;i<res.data.list.length;i++){
          this.processes.push(res.data.list[i])
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    onChangedProcess(selectValue){ 
      let obj = {}
         //遍历下拉数组中的item
      if(selectValue === ''){
        this.formData.taskAndProcessCode = this.formData.temporaryCode
      }else{
        obj = this.processes.find((item)=>{
          return item.taskAndProcessName === selectValue
        })
        this.formData.process = obj.taskAndProcessName     
        this.formData.taskAndProcessCode = obj.taskAndProcessCode 
      }
    },
//初始加载默认条件
    loadFilterParams(){
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {...this.filterQuery}
      //填充datepicker range组件的内容
      if (this.filterQuery.startDate && this.filterQuery.endDate) {
        this.dateRange = [this.filterQuery.startDate, this.filterQuery.endDate]
      }
      this.filterQuery.taskAndProcessCode = this.formData.taskAndProcessCode
      this.filterQuery.companyCode = this.formData.companyCode
    },
//点击分析按钮
    handleAnalysis(){
      this.loadFilterParams()
      this.checkFilterParams()
      // this.$router.push({query: this.filterQuery})
      this.handleGetCompanyProblemClassAnalysis()
    },
    checkFilterParams () {
      //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
      if (this.dateRange && this.dateRange.length === 2) {
        // this.filterQuery.startDate = this.dateRange[0]
        // this.filterQuery.endDate = this.dateRange[1]
        this.filterQuery.startDate = this.dateRange[0]+' '+'00:00:00'
        this.filterQuery.endDate = this.dateRange[1]+' '+'23:59:59'
      } else {
        this.filterQuery.startDate = ''
        this.filterQuery.endDate = ''
      }
    },

    //获取数据
    handleGetCompanyProblemClassAnalysis(){
      GetCompanyProblemClassAnalysis(this.filterQuery).then((res) => {
        if(res.data.length === 0){
          this.$message({
            message: '此筛选条件下无数据！',
            type: 'warning',
            duration:3000,
          });
        }
        this.problemData = res.data
        for(let i=0; i<this.problemData.length; i++){
          this.companyNameList[i] = this.problemData[i].companyName
          this.largerProblemsList[i] = this.problemData[i].largerProblems
          this.majorProblemsList[i] = this.problemData[i].majorProblems
          this.totalNum[i] = this.largerProblemsList[i] + this.majorProblemsList[i]
        }
        this.loading = false
        //绘制柱状图
        this.handleMixChart()
        this.companyNameList = []
        this.largerProblemsList = []
        this.majorProblemsList = []
        this.totalNum = []
      })
    },
//动态绘制柱状图
    handleMixChart(){
      this.chart = echarts.init(document.getElementById('mixChart-container'))
      this.chart.setOption({
        title: {
          text: '问题类别分析',
          x: 'center',
          top: '20',
          textStyle: {
            color: 'black',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: 'center',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['重大问题', '较大问题', '总和']
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
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: this.companyNameList
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [0],
          bottom: 30,
          start: 0,
          end: 100,
          handleSize: '100%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: '重大问题',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'insideTop',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.majorProblemsList
        },{
          name: '较大问题',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.largerProblemsList
        }, {
          name: '总和',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'red',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.totalNum
        }
        ]
      })
    }
  }
}
</script>



