<template>
  <div>
    <div class="page-title" style="width:100%">按责任人分析</div>
    <div class="page-content">
      <el-form :model="filterQuery">
        <el-row>
          <el-col :span="9">
            <el-form-item label="受检单位" label-width="20%">
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择单位名称"
              v-model="filterQuery.companyCode"
              style="width:80%"
              /> 
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
import {GetResponseEmployee,GetCompany} from '../../../services/problemRankAnalysis'
import echarts from 'echarts'
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')

const DefaultQuery = {
  companyCode:null,
  startDate: '',
  endDate: '',
}
export default {
  data(){
    return{
      options:[],
      value:[],
      companyCode:'',
      initTime:'',
      dateRange:[], //时间查询，v-model绑定
      filterQuery: {},
      responseEmployee:[],
      responseEmpGroup:[],
      checkCountList:[],
      rectiCountList:[],
      verifyCountList:[],
      totalNum:[],





    //   hetong:0,
    //   shehuihua:0,
    //   chengbao:0,
    //   xiangguang:0,
    //   qita:0,
    //   hetong_jiancha:0,
    //   hetong_zhenggai:0,
    //   hetong_yanzheng:0,
    //   shehuihua_jiancha:0,
    //   shehuihua_zhenggai:0,
    //   shehuihua_yanzheng:0,
    //   chengbao_jiancha:0,
    //   chengbao_zhenggai:0,
    //   chengbao_yanzheng:0,
    //   xiangguang_jiancha:0,
    //   xiangguang_zhenggai:0,
    //   xiangguang_yanzheng:0,
    //   qita_jiancha:0,
    //   qita_zhenggai:0,
    //   qita_yanzheng:0,
    }
  },

  mounted() {
    this.loadFilterParams()
    this.handleAnalysis()
    this.handleGetCompany()
  },

  methods: {
     //点击分析按钮，绘制ECharts
    handleAnalysis(){   
      this.checkFilterParams()
      this.$router.push({query: this.filterQuery})
      this.handleGetProblemRankAnalysis()
    },
    //获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
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
    handleGetProblemRankAnalysis(){
      this.loading = true
      // alert(JSON.stringify(this.filterQuery))
      GetResponseEmployee(this.filterQuery).then((res) => {
        if(res.data.length === 0){
          this.$message({
            message: '此筛选条件下无数据！',
            type: 'warning',
            duration:5000,
          });
        }
        this.responseEmployee = res.data
        console.log(JSON.stringify(res))
        this.loading = false
         for(let i=0; i<this.responseEmployee.length; i++){
          if(this.responseEmployee[i].responseEmpGroup){
            this.responseEmpGroup[i] = this.responseEmployee[i].responseEmpGroup
          }else{
            this.responseEmpGroup[i] = '未填写级别'
          }
          if(this.responseEmployee[i].checkCount){
            this.checkCountList[i] = this.responseEmployee[i].checkCount
          }else{
            this.checkCountList[i] = 0
          }
          if(this.responseEmployee[i].rectiCount){
            this.rectiCountList[i] = this.responseEmployee[i].rectiCount
          }else{
            this.rectiCountList[i] = 0
          }
          if(this.responseEmployee[i].verifyCount){
            this.verifyCountList[i] = this.responseEmployee[i].verifyCount
          }else{
            this.verifyCountList[i] = 0
          }
          this.totalNum[i] = this.checkCountList[i]
        }
        console.log(JSON.stringify(this.responseEmpGroup))
        console.log(JSON.stringify(this.checkCountList))
        console.log(JSON.stringify(this.rectiCountList))
        console.log(JSON.stringify(this.verifyCountList))
        console.log(JSON.stringify(this.totalNum))

        //绘制饼状图
        this.initPieChart()
        //绘制柱状图
        this.initBarChart()
           })
    },
    //绘制饼状图
    initPieChart(){
      this.chart = echarts.init(document.getElementById('pie-container'));
      const seriesData = []
      for(let i=0; i<this.responseEmpGroup.length;i++){
        const obj = new Object()
        obj.name = this.responseEmpGroup[i]
        obj.value = this.totalNum[i]
        seriesData[i] = obj
      }
      this.chart.setOption({
        title:{
          text:'责任人分析',
          // subtext: this.filterQuery.startDate +' 至 '+ this.filterQuery.endDate,     //显示时间段
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
          data:this.responseEmpGroup
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
          name: '某单位责任人分析汇总',
          type: 'pie',
          radius: [20, 100],
          center: ['50%', '50%'],
          data:seriesData,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        }]
      })
    },
    //绘制柱状图
    initBarChart(){
      this.chart = echarts.init(document.getElementById('bar-container'));
      this.chart.setOption({
        title : {
          text: '责任人分析',
          // subtext: this.filterQuery.startDate +' 至 '+ this.filterQuery.endDate,      //显示时间段
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
          data : this.responseEmpGroup
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
    }
  }
}
</script>

<style>


</style>
