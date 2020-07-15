<template>
  <div class="outDiv" >
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title">问题趋势</div>
    <div class="page-content">
      <el-form  :inline="true" :model="formData" label-position="left">
        <el-row>
           <el-form-item label="受检单位:">
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="受检单位"
              v-model="formData.companyCode"
              style="width:280px"
              /> 
            </el-form-item>
             &nbsp; &nbsp; &nbsp; &nbsp;
            <el-form-item label="检查时间:">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:280px">
            </el-date-picker>
            </el-form-item>
             </el-row>
            <el-row>
            <el-form-item label="问题级别:">
             <el-select style="width:280px"  v-model="formData.problemRank" placeholder="请选择问题级别" clearable  >
            <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.name"></el-option>
             </el-select>
            </el-form-item>
             &nbsp; &nbsp; &nbsp; &nbsp;
            <el-form-item label="问题原因:">
             <el-autocomplete 
              v-model="inputName"
              clearable
              :fetch-suggestions="querySearch"
              placeholder="请选择问题原因"
              :trigger-on-focus="true"
               style="width:280px">
              </el-autocomplete>
             </el-form-item>
             </el-row>
           <el-row>
            <el-form-item label="选择任务:">
            <el-select  style="width:280px"  v-model="formData.task" placeholder="请选择任务名称"  @change="onChangedTask" clearable>
                <el-option v-for="item in tasks" :key="item.taskAndProcessCode" :label="item.task" :value="item.taskAndProcessName"></el-option>
            </el-select>
            </el-form-item>
             &nbsp; &nbsp; &nbsp; &nbsp;
            <el-form-item label="选择工序:" >
            <el-select   style="width:280px"  v-model="formData.process" placeholder="请选择工序名称" @change="onChangedProcess" clearable>
                <el-option v-for="item in processes" :key="item.taskAndProcessCode" :label="item.process" :value="item.taskAndProcessName"></el-option>
            </el-select>
            </el-form-item>
             &nbsp; &nbsp; &nbsp; &nbsp;
            <el-form-item>
            <el-button type="primary" style="width:100px" @click="handleAnalysis()" >分析</el-button>
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
import {GetProblemTrend} from '../../../services/ProblemTrend'
import {GetProblemSourceList} from '../../../services/problemSource'
import {GetTasks,GetProcesses} from '../../../services/taskandprocesses'
import {GetCompany} from '../../../services/gettreedata'
import echarts from 'echarts'
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')

const DefaultQuery = {
  companyCode: null,
  problemRank:'',
  source:'',
  startDate: '',
  endDate: '',
  taskAndProcessCode:''
}

export default {
  data(){
    return{
      options:[],
      levels:[
        {id:'1',name:'重大'},
        {id:'2',name:'较大'},
        {id:'3',name:'一般'},
        {id:'4',name:'轻微'}],
      value:[],
      inputName:'',
      problemRank:'',
      source:'',
      dateRange:[], //时间查询，v-model绑定
      filterQuery: {},
      fitertask:{},
      problemSourceNameList:[],
      taskAyy:[],

      formData:{
        companyCode: null,
        problemRank:'',
        task:'',
        process:'',
        taskAndProcessCode:''        
      },

      tasks:[],
      processes:[],

      chart: null,
      problemtrendData:[],
      monthsList:[],//保存查询的月份
      checkCountList:[],//检查数
      rectiCountList:[],//整改数
      verifyCountList:[],//验证数
    }
  },

  mounted() {
   
    this.handleGetCompany()
    this.getproblemSourceName()
    this.handleGetTaskProcedure()
    // this.initChart()
    this.handleAnalysis()
  },

  methods: {
//获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
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
      this.filterQuery.problemRank = this.formData.problemRank
      this.filterQuery.source = this.inputName
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
   getproblemSourceName(){
        GetProblemSourceList(this.fitertask).then((res) => {
        console.log(JSON.stringify(res))  
        this.taskAyy = res.data.list
        this.total = res.data.total
        for(var i=0;i<this.total;i++){
            this.problemSourceNameList.push({"value": this.taskAyy[i].problemSourceName})
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
      })
      },
      querySearch(queryString, cb) {
        let results = queryString ? this.problemSourceNameList.filter(this.createStateFilter(queryString)) : this.problemSourceNameList;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      },
      createStateFilter(queryString) {
        return (inputName) => {
          return (inputName.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
        };
      },
//获取任务名称、任务工序、任务工序编码。
    handleGetTaskProcedure(){
      GetTasks({name:''}).then((res) => {   
        // console.log(JSON.stringify(res.data))    
        for(let i=0;i<res.data.list.length;i++){   //筛选编码为2位数
          if(res.data.list[i].taskAndProcessCode.length === 2){
            this.tasks.push(res.data.list[i])
          }
        }
        // alert(this.tasks)
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
        // this.filterQuery.taskAndProcessCode = this.formData.taskAndProcessCode 
        this.handleGetProcesses() 
      }
    },    
    handleGetProcesses(){
      GetProcesses({taskAndProcessCode:this.formData.taskAndProcessCode}).then((res) => {   
        // alert(JSON.stringify(res.data.list))    
        for(let i=0;i<res.data.list.length;i++){
          this.processes.push(res.data.list[i])
        }
        // alert(JSON.stringify(this.processes))
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
        // this.filterQuery.taskAndProcessCode = this.formData.taskAndProcessCode 
      }
    },

//获取数据
    handleAnalysis(){
      this.checkFilterParams()
      this.$router.push({query: this.filterQuery})
      this.handleGetIssueTrendAnalysis()
    },
   handleGetIssueTrendAnalysis(){
      //整理筛选条件
      this.loading = true
      // alert(JSON.stringify(this.filterQuery))
      this.loadFilterParams()
      GetProblemTrend(this.filterQuery).then((res) => {
        if(res.data.length === 0){
          this.$message({
            message: '此筛选条件下无数据！',
            type: 'warning',
            duration:3000,
          });
        }
        this.problemtrendData = res.data
        for(let i=0; i<this.problemtrendData.length; i++){
          this.monthsList[i] = this.problemtrendData[i].months
          this.checkCountList[i] = this.problemtrendData[i].checkCount
          this.rectiCountList[i] = this.problemtrendData[i].rectiCount
          this.verifyCountList[i] = this.problemtrendData[i].verifyCount
        }
        console.log(this.monthsList)
        console.log(this.checkCountList)
        console.log(this.rectiCountList)
        console.log(this.verifyCountList)
        this.loading = false
        //绘制图
        this.handleChart()
        this.monthsList = []
        this.checkCountList = []
        this.rectiCountList = []
        this.verifyCountList = []
      })
   },
//初始化绘制柱状图
    initChart() {
      this.chart = echarts.init(document.getElementById('mixChart-container'))

      this.chart.setOption({
        backgroundColor: 'white',
        title: {
          top: 20,
          text: '全年问题趋势示例图',
          x:'center',
          textStyle: {
            // fontWeight: 'normal',
            fontSize: 22,
            color: 'black'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['检查', '整改', '验证'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: 'black'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        }],
        yAxis: [{
          type: 'value',
          name: '数量',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '检查',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: [254, 210, 291, 194, 180, 150, 223, 267, 195, 152, 234, 192]
        }, {
          name: '整改',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: [187, 167, 239, 123, 167, 140, 157, 230, 95, 112, 174, 167]
        }, {
          name: '验证',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: [178, 162, 157, 98, 136, 112, 145, 178, 90, 89, 120, 137]
        }]
      })
    },
    handleChart() {
      this.chart = echarts.init(document.getElementById('mixChart-container'))

      this.chart.setOption({
        backgroundColor: 'white',
        title: {
          top: 20,
          text: '问题趋势',
          x:'center',
          textStyle: {
            // fontWeight: 'normal',
            fontSize: 22,
            color: 'black'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['检查', '整改', '验证'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: 'black'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: this.monthsList
        }],
        yAxis: [{
          type: 'value',
          name: '数量',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '检查',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: this.checkCountList
        }, {
          name: '整改',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: this.rectiCountList
        }, {
          name: '验证',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: this.verifyCountList
        }]
      })
    }
  }
}
</script>


