<template>
  <div>
    <div class="page-title" style="width:100%">指标体系</div>
    <div class="page-content">
      <el-form :model="filterQuery">
        <el-row>
          <el-col :span="10">
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
          <el-col :span="10">
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
          <el-col :span="4">
            <el-button type="primary" @click="handleAnalysis()" style="width:80%">分析</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
             <el-form-item>
              <treeselect
              :multiple="false"
              :options="checkItem"
              placeholder="员工检查表要素"
              v-model="filterQuery.checkItem"
              style="width:90%" 
              /> 
            </el-form-item>
          </el-col>
          <el-col :span="10">
             <el-form-item>
              <treeselect
              :multiple="false"
              :options="leadercheckItem"
              placeholder="领导检查表要素"
              v-model="filterQuery.checkItem"
              style="width:90%" 
              /> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div id="pie-container" style="border: 1px solid black;width:95%;height:500px"></div>
          </el-col>
          <el-col :span="16">
            <div id="bar-container" style="border: 1px solid black;width:95%;height:500px"></div>
          </el-col>
        </el-row>>
      </el-form> 
    </div>
  </div>
</template>

<script>
// import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetIndexSystem} from '../../../services/queryAnalysis'
import {GetCompany} from '../../../services/gettreedata'
import {GetCheckContentsTree} from '../../../services/complateplan'
import {GetTaskProcedure} from '../../../services/leadercheckitem'//获取检查表要素
import echarts from 'echarts'
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')

const DefaultQuery = {
  companyCode: null,
  checkItem: null,
  startDate:'',
  endDate:'',
}

export default {
  data(){
    return{
      radio2:"first",
      options:[],
      checkItem:[],
      leadercheckItem:[],
      dateRange:[], //时间查询，v-model绑定
      filterQuery: {},
      problemData: [],

      label_x: [], //横轴标签数组
      label_y: [], //纵轴标签数组
      data_bingzhuang: [], //饼状图数据数组
      data_zhuzhuang: [], //柱状图数据数组
    }
  },

  mounted() {
    // this.init()
    this.loadFilterParams()
    this.handleGetCompany()
    this.handleAnalysis()
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
    init(){
      this.label_x = ['基地准备', '行车途中', '测井准备', '资料采集', '队伍离井']
      this.label_y = ['2018-09', '2018-10', '2018-11', '2018-12']
      this.data_bingzhuang = [{ value: 2, name: '基地准备' },
            { value: 3, name: '行车途中' },
            { value: 23, name: '测井准备' },
            { value: 27, name: '资料采集' },
            { value: 45, name: '队伍离井' }]
      this.data_zhuzhuang = [{
          name:'基地准备',
          type:'bar',
          data:[ 2, 3, 23, 45],
          animationEasing: 'cubicInOut',
          animationDuration: 2000
        },{
          name:'行车途中',
          type:'bar',
          data:[ 2, 2, 21, 44],
          animationEasing: 'cubicInOut',
          animationDuration: 2000
        },{
          name:'测井准备',
          type:'bar',
          data:[ 2, 2, 20, 40],
          animationEasing: 'cubicInOut',
          animationDuration: 2000
        },{
          name:'资料采集',
          type:'bar',
          data:[ 2, 2, 20, 40],
          animationEasing: 'cubicInOut',
          animationDuration: 2000
        },{
          name:'队伍离井',
          type:'bar',
          data:[ 2, 2, 20, 40],
          animationEasing: 'cubicInOut',
          animationDuration: 2000
        }]


    },
    //点击分析按钮，绘制ECharts
    handleAnalysis(){
      this.checkFilterParams()
      this.$router.push({query: this.filterQuery})
      this.handleGetIndexSystem()
    },
    //获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })

      GetCheckContentsTree().then((res) => {
        // alert(JSON.stringify(res.data))
				this.checkItem = res.data
			}).catch((err) => {
        this.$message.error(err.message)
      })

      GetTaskProcedure().then((res) => {
        // alert(JSON.stringify(res.data))
				this.leadercheckItem = res.data
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
    
    handleGetIndexSystem(){
      this.loading = true
      GetIndexSystem(this.filterQuery).then((res) => {
        // alert(JSON.stringify(res.data))
        // this.problemData =res.data.shift()
        this.problemData =res.data
        // alert(JSON.stringify(this.problemData))
        this.loading = false
        for(let i=0; i<this.problemData.length; i++){
          this.label_x.push(this.problemData[i].label)
          this.label_y.push(this.problemData[i].months)
        }
        this.label_x = this.uniq(this.label_x)
        this.label_y = this.uniq(this.label_y)
        for(let i=0; i<this.label_x.length;i++){
          let bingzhuangSum = 0
          for(let k=0; k<this.problemData.length; k++){
            if(this.problemData[k].label === this.label_x[i]){
              bingzhuangSum+=this.problemData[k].count
            }
          }
          let bingzhuang = { value: bingzhuangSum, name: this.label_x[i] }
          this.data_bingzhuang.push(bingzhuang)
        }
        for(let i=0; i<this.label_x.length;i++){
          let zhuzhuangList = []
          for(let j=0;j<this.label_y.length;j++){
            for(let k=0; k<this.problemData.length; k++){
              if(this.problemData[k].label === this.label_x[i] && this.problemData[k].months === this.label_y[j]){
                zhuzhuangList.push(this.problemData[k].count)
              }
            }
          }
          let zhuzhuang = {
            name:this.label_x[i],
            barMaxWidth:30,
            type:'bar',
            data:zhuzhuangList,
            animationEasing: 'cubicInOut',
            animationDuration: 2000
          }
          this.data_zhuzhuang.push(zhuzhuang)
        }
        //绘制饼状图
        this.handlePieChart()
        //绘制柱状图
        this.handleBarChart()
        this.data_bingzhuang = []
        this.data_zhuzhuang = []
        this.label_x = []
        this.label_y = []
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    

//点击绘制饼状图
    handlePieChart(){
      this.chart = echarts.init(document.getElementById('pie-container'));
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
          data: this.label_x
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
          data: this.data_bingzhuang,
          animationEasing: 'cubicInOut',
          animationDuration: 3000
        }]
      })
    },
//点击绘制柱状图
    handleBarChart(){
      this.chart = echarts.init(document.getElementById('bar-container'));
      var option = {
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
          data: this.label_x
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
          data : this.label_y
        }],
        yAxis : [{
          type : 'value'
        }],
        series : this.data_zhuzhuang
      }
      this.chart.setOption(option,true)
    },
  }
}
</script>

<style>
/* [{"count": 3,"label": "处置废弃物/液","months": "2018-01"},{"count": 4,"label": "处置废弃物/液","months": "2018-02"},
                   {"count": 5,"label": "处置废弃物/液","months": "2018-03"},{"count": 6,"label": "处置废弃物/液","months": "2018-04"},
                   {"count": 7,"label": "处置废弃物/液","months": "2018-05"},{"count": 8,"label": "处置废弃物/液","months": "2018-06"},
                   {"count": 7,"label": "处置废弃物/液","months": "2018-07"},{"count": 8,"label": "处置废弃物/液","months": "2018-08"},
                   {"count": 3,"label": "联机安全监控装置","months": "2018-01"},{"count": 4,"label": "联机安全监控装置","months": "2018-02"},
                   {"count": 5,"label": "联机安全监控装置","months": "2018-03"},{"count": 6,"label": "联机安全监控装置","months": "2018-04"},
                   {"count": 3,"label": "施工总结会","months": "2018-01"},{"count": 4,"label": "施工总结会","months": "2018-02"},
                   {"count": 5,"label": "施工总结会","months": "2018-03"},{"count": 6,"label": "施工总结会","months": "2018-04"},
                   {"count": 3,"label": "拆卸设备","months": "2018-01"},{"count": 4,"label": "拆卸设备","months": "2018-02"},
                   {"count": 5,"label": "拆卸设备","months": "2018-03"},{"count": 6,"label": "拆卸设备","months": "2018-04"},
                   {"count": 3,"label": "固定仪器及设备","months": "2018-01"},{"count": 4,"label": "固定仪器及设备","months": "2018-02"},
                   {"count": 5,"label": "固定仪器及设备","months": "2018-03"},{"count": 6,"label": "固定仪器及设备","months": "2018-04"},
                   {"count": 3,"label": "检查爆炸品","months": "2018-01"},{"count": 4,"label": "检查爆炸品","months": "2018-02"},
                   {"count": 5,"label": "检查爆炸品","months": "2018-03"},{"count": 6,"label": "检查爆炸品","months": "2018-04"}] */

</style>


