<template>
  <div>
    <div class="page-title" style="width:100%">按事件分析</div>
    <div class="page-content">
      <el-form :model="filterQuery">
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="受检单位"
              v-model="filterQuery.companyCode"
              style="width:90%"
              /> 
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:90%">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="handleAnalysis()" style="width:80%">分析</el-button>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :span="10">
            <div id="chart1" style="border: 1px solid black;width:95%;height:500px"></div>
          </el-col>
          <el-col :span="10">
            <div id="chart2" style="border: 1px solid black;width:95%;height:500px"></div>
          </el-col>
        </el-row>
       <el-row style="margin-top:5px">
         <el-col :span="20">
            <div id="chart3" style="border: 1px solid black;width:97%;height:500px"></div>
         </el-col>
        </el-row>
        <el-row style="margin-top:5px">
         <el-col :span="20">
            <div id="chart4" style="border: 1px solid black;width:97%;height:500px"></div>
         </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetIndexSystem,GetTime,GetCompanyData} from '../../../services/accidentanalysis'
import {GetCompany} from '../../../services/gettreedata'
import {GetCheckContentsTree} from '../../../services/complateplan'
import echarts from 'echarts'
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')

const DefaultQuery = {
  companyCode: null,
  startDate: '',
  endDate: '',
  pageName:'事件',
  isOrderBy: true,
}

export default {
    components:{
    },
  data(){
    return{
      options:[],
      checkItem:[],
      dateRange:[], //时间查询，v-model绑定
      filterQuery: {},
      problemData: [],
      pie_data:[],
      bar_data:[],
      barList:[[]],
      label_legend1: [], //横轴标签数组
      label_legend2: [],
      label_legend3: [],
      label_legend4: [],
      label_x2:[],
      label_x3:[],
      label_x4:[],
      label_y1:[],
      label_y2: [],
      label_y3: [],
      label_y33:[],
      label_y4: [], 
    }
  },

  mounted() {
    // this.init()
    this.loadFilterParams()
    this.handleGetCompany()
    this.handleGetDatePic1()//按类别绘制饼状图1
    this.handleGetDatePic2()//按时间绘制柱状图2
    this.handleGetDatePic3()//按时间绘制线形图3
    this.handleGetDatePic4()//按时间绘制柱状图4
  },

  methods: {
    uniq(array){
      var temp = []; //一个新的临时数组
      for(var i = 0; i < array.length; i++){
        if(temp.indexOf(array[i]) == -1){
          temp.push(array[i]);
        }
      }
      return temp;
    },
    //点击分析按钮，绘制ECharts
    handleAnalysis(){
      this.checkFilterParams()
      this.$router.push({query: this.filterQuery})
      this.handleGetDatePic1()//按类别绘制饼状图1
      this.handleGetDatePic2()//按时间绘制柱状图2
      this.handleGetDatePic3()//按时间绘制线形图3
      this.handleGetDatePic4()//按时间绘制柱状图4
      
    },
    //获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })

      GetCheckContentsTree().then((res) => {
				this.checkItem = res.data
			}).catch((err) => {
        this.$message.error(err.message)
      })
    },
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

  //按类别绘制图1
  handleGetDatePic1(){
    this.loading = true
    GetIndexSystem(this.filterQuery).then((res) => {
      if(res.data.list.length === 0){
          this.$message({
            message: '此筛选条件下无数据！',
            type: 'warning',
            duration:3000,
          });
        }

      this.problemData = res.data.list
      this.loading = false
      for(let i=0; i<this.problemData.length; i++){
        this.label_legend1.push(this.problemData[i].label)
      }
      this.label_legend1 = this.uniq(this.label_legend1)
      for(let i=0; i<this.label_legend1.length;i++){
        let pieCount = 0
        for(let k=0; k<this.problemData.length; k++){
          if(this.problemData[k].label === this.label_legend1[i]){
            pieCount = this.problemData[k].count + pieCount
          }
        }
        let piedata = { value: pieCount, name: this.label_legend1[i] }
        this.pie_data[i] = piedata
      }
      //按类别绘制饼状图
      this.handleChart1() 
    }).catch((err) => {
      this.$message.error(err.message)
    })
  },

  //按月，季，年绘制图2
  handleGetDatePic2(){
    this.loading = true
    GetIndexSystem(this.filterQuery).then((res) => {
      this.TimeData = res.data.list
      this.loading = false
      for(let i=0; i<this.TimeData.length; i++){
        this.label_legend2.push(this.problemData[i].label)
        this.label_x2.push(this.TimeData[i].months)
      }
      this.label_x2 = this.uniq(this.label_x2)
      this.label_legend2 = this.uniq(this.label_legend2)
      for(let j=0;j<this.label_legend2.length;j++){
        this.barList[j]=[]
        for(let i=0; i<this.label_x2.length;i++){
          this.barList[j][i] = 0
        }
      }
      for(let j=0;j<this.label_legend2.length;j++){
        for(let i=0; i<this.label_x2.length;i++){
          for(let k=0; k<this.problemData.length; k++){
            if(this.problemData[k].label === this.label_legend2[j] && this.problemData[k].months === this.label_x2[i]){
              this.barList[j][i]=this.problemData[k].count
            }
          }
        }
        let barData = {
          name:this.label_legend2[j],
          type:'bar',
          stack: '总量',
          barMaxWidth:30,
          data: this.barList[j],
          animationDuration: 2000,
          animationEasing: 'cubicInOut',
        }
        this.bar_data.push(barData)
      }
      //绘制柱状图
      this.handleChart2()
      this.label_x2 = []
      this.label_legend2 = []
      this.barList = [[]]
      this.bar_data = []
    }).catch((err) => {
      this.$message.error(err.message)
    })
  },
//绘制图3
  handleGetDatePic3(){ this.loading = true
    GetTime(this.filterQuery).then((res) => {
      this.TimeData1 = res.list_now
      this.TimeData2 = res.list_before
      this.loading = false
      for(let i=0; i<this.TimeData1.length; i++){
        this.label_y3.push(this.TimeData1[i].count)
      }
      for(let i=0; i<this.TimeData2.length; i++){
        this.label_y33.push(this.TimeData2[i].count)
      }
      //绘制图
      this.handleChart3()
      this.label_y3 = []
      this.label_y33 = []
    }).catch((err) => {
      this.$message.error(err.message)
    })
  },

//按单位绘制图4
  handleGetDatePic4(){
    this.loading = true
    GetCompanyData(this.filterQuery).then((res) => {
      this.CompanyData = res.data.list
      this.loading = false
      for(let i=0; i<this.CompanyData.length; i++){
        this.label_x4.push(this.CompanyData[i].months)
        this.label_y4.push(this.CompanyData[i].count)
      }
      //绘制柱状图
      this.handleChart4()
      this.label_x4 = []
      this.label_y4 = []
    }).catch((err) => {
      this.$message.error(err.message)
    })
  },

//点击绘制饼状图1
    handleChart1(){
      this.chart = echarts.init(document.getElementById('chart1'));
      this.chart.setOption({
        title:{
          text:'按类别分析',
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
          bottom: '0',
          data: this.label_legend1
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
          name: '',
          type: 'pie',
          radius: [20, 100],
          center: ['50%', '50%'],
          data: this.pie_data,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        }]
      })
    },

//点击绘制柱状图2
    handleChart2(){
      this.chart = echarts.init(document.getElementById('chart2'));
      var option = {
        title : {
          text: '按时间分析',
          textStyle:{
            fontWeight:'bold',
          }
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          left: 'center',
          bottom: '0',
          data:this.label_legend2,
        },
        toolbox: {
          show : true,
          feature : {
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        yAxis : [{type : 'value'}],
        xAxis : [{
          type : 'category',
          axisTick : {show: false},
          data : this.label_x2
        }],
        series : this.bar_data,
      }

      this.chart.setOption(option,true)
    },

//点击绘制折线图3
    handleChart3(){
      // var data = this.data_zhuzhuang
      this.chart = echarts.init(document.getElementById('chart3'));
      var option = {
        title : {
          text: '同期对比（只可选择一年以内数据）',
          textStyle:{
            fontWeight:'bold',
          }
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          x: 'center',
          top: '5%',
          textStyle: {
            color: '#90979c'
          },
        data:['去年事件数','当前事件数']
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

      xAxis: {
        type: 'category',
        data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
      },
      yAxis: {
          type: 'value'
      },
      series: [
      {
          name:'去年事件数',
          type:'line',
          stack: '总量',
          barMaxWidth:15,
          data: this.label_y33,
          animationDuration: 2000,
          animationEasing: 'cubicInOut'
        },
        {
          name:'当前事件数',
          type:'line',
          stack: '总量',
          barMaxWidth:15,
          data: this.label_y3,
          animationDuration: 2000,
          animationEasing: 'quadraticOut'
        }

      ]}
      this.chart.setOption(option,true)
    }
    ,
    
//点击绘制柱状图4
  handleChart4(){
    this.chart = echarts.init(document.getElementById('chart4'));
    var option = {
      title : {
        text: '按单位分析',
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
        data: this.label_x4
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
        data : this.label_x4
      }],
      yAxis : [{
        type : 'value'
      }],
      series: [{
        barMaxWidth:30,
        data: this.label_y4,
        type: 'bar'
      }]
    }

    this.chart.setOption(option,true)
  },

  }
}
</script>

<style>
</style>


