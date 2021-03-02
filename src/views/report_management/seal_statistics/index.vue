<template>
  <div class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title" >印章统计</div>
    <div class="page-content">
      <el-form  :inline="true" :model="formData" label-position='left'>
        <el-row>
          <el-form-item label="公司单位：">
            <treeselect
              filterable
              :multiple="false"
              :options="options"
              placeholder="请选择公司单位"
              v-model="formData.companyCode"
              style="width:280px;margin-left:10px"/> 
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <el-form-item label="报告计划时间：">
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
import {GetSealsAnalysis} from '../../../services/seal_statistics'
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
      dateRange:'', //时间查询，v-model绑定
      filterQuery: {},
      sealsData:[],
      seal1Num:[],
      seal2Num:[],
      seal3Num:[],
      seal4Num:[],
      seal5Num:[],
      seal6Num:[],
      sealsTotalNum:[],
      companyNameList:[],
      formData:{
        companyCode:null,
      },
    }
  },
  mounted() {
    this.handleGetCompany()
    this.loadFilterParams()
    this.handleAnalysis()
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
//初始加载默认条件
    loadFilterParams(){
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {...this.filterQuery}
      //填充datepicker range组件的内容
      if (this.filterQuery.startDate && this.filterQuery.endDate) {
        this.dateRange = [this.filterQuery.startDate, this.filterQuery.endDate]
      }
      this.filterQuery.companyCode = this.formData.companyCode
    },
//点击分析按钮
    handleAnalysis(){
      this.loadFilterParams()
      this.checkFilterParams()
      // this.$router.push({query: this.filterQuery})
      this.handleGetSealsAnalysis()
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
    //获取数据
    handleGetSealsAnalysis(){
      GetSealsAnalysis(this.filterQuery).then((res) => {
        if(res.data.length === 0){
          this.$message({
            message: '此筛选条件下无数据！',
            type: 'warning',
            duration:3000,
          });
        }else{
          this.sealsData = res.data
          this.sealsData.forEach((item) =>{
            this.companyNameList.push(item.companyName)
            this.seal1Num.push(item.seal1Num)
            this.seal2Num.push(item.seal2Num)
            this.seal3Num.push(item.seal3Num)
            this.seal4Num.push(item.seal4Num)
            this.seal5Num.push(item.seal5Num)
            this.seal6Num.push(item.seal6Num)
            this.sealsTotalNum.push(item.total)
          })
        }
        //绘制柱状图
        this.handleMixChart()
        this.companyNameList = []
        this.seal1Num = []
        this.seal2Num = []
        this.seal3Num = []
        this.seal4Num = []
        this.seal5Num = []
        this.seal6Num = []
        this.sealsTotalNum = []
        this.loading = false
      })
    },
//动态绘制柱状图
    handleMixChart(){
      this.chart = echarts.init(document.getElementById('mixChart-container'))
      this.chart.setOption({
        title: {
          text: '印章数量统计分析',
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
          data: ['检验检测专用章','资质认定标识章', 'ILAC-MRA/CNAS互认标识章（检测）', 'CNAS认可标识章（检测）',
                'ILAC-MRA/CNAS互认标识章（校准）','CNAS认可标识章（检验机构）','总和']
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
          name: '检验检测专用章',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'insideTop',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.seal1Num
        },{
          name: '资质认定标识章',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
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
          data: this.seal2Num
        },{
          name: 'ILAC-MRA/CNAS互认标识章（检测）',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
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
          data: this.seal3Num
        },{
          name: 'CNAS认可标识章（检测）',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
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
          data: this.seal4Num
        }, {
          name: 'ILAC-MRA/CNAS互认标识章（校准）',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
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
          data: this.seal5Num
        },{
          name: 'CNAS认可标识章（检验机构）',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
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
          data: this.seal6Num
        },{
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
          data: this.sealsTotalNum
        }
        ]
      })
    }
  }
}
</script>



