<template>
  <div>
    <div class="page-title" style="width: 100%; justify-content: flex-start">
      <span style="cursor: pointer; color: #ccc" @click="gotoDataApply()">
        监控数据应用
      </span>
      <span style="padding: 0 20px">|</span>
      <span style="cursor: pointer"> 年度监控统计 </span>
    </div>
    <div class="page-content">
      <el-row
        style="
          padding: 10px;
          border-top: 2px dashed #dddddd;
          text-align: center;
        "
      >
        <!-- 展开事件要放在被展开行所属的表上 -->
        <el-table
          :data="chooses"
          style="width: 100%; text-align: center"
          ref="treeTable"
          :indent="30"
          max-height="560px"
          highlight-current-row
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="name"
            label="文件名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" width="250" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-success"
                @click="showlabel(scope.row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-dialog title="选择时间" :visible.sync="choosetime">
        <el-form label-width="130px" :inline="true">
          <el-form-item label="时间范围：" labelWidth="120px">
            <el-date-picker
              v-model="selectdates"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sechart2()">选择</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="数据详情"
        :visible.sync="seetrend"
        center
        width="800px"
        :close-on-click-modal="false"
      >
        <div
          id="chart1"
          ref="chart1"
          v-if="choose == '趋势图'"
          :style="{ width: '90%', height: '500px', display: 'inline-block' }"
        ></div>
        <div
          id="chart2"
          ref="chart2"
          v-if="choose == '使用情况对比图'"
          :style="{ width: '90%', height: '500px', display: 'inline-block' }"
        ></div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { useDeviceTrend,deviceCompare} from "../../../services/supervise"; //查询细节
export default {
  name: "",
  components: {},
  data() {
    return {
      chooses: [
        { name: "趋势图" },
        { name: "使用情况对比图" },
        { name: "监管统计图" },
        { name: "基层单位监看情况对比" },
        { name: "监看账号统计" },
        { name: "监看频次统计" },
      ],
      option:{
        title: {
            text: '?'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
        ]
        },
      option2:{
        title: {
           text: '?'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
        ]
        },
      seetrend:false,
      choose:'',
      selectdates:"",
      choosetime:false,
    };
  },
  methods: {
    gotoDataApply() {
      this.$router.push({
        name: "DataApply",
        params: {},
      });
    },
    async sechart2(){
      this.choosetime=false;
      this.seetrend=true;
       var that=this;
       console.log(this.selectdates)
        this.$nextTick(()=>{
           that.option2.title.text="使用情况对比图";
            deviceCompare({starttime:this.selectdates[0],endtime:this.selectdates[1]}).then(res=>{
            this.option2.legend.data=res.data.time;//横坐标数据
            this.option2.xAxis.data=res.data.time;//横坐标数据
            this.option2.series=res.data.series;//总数据
          })
          var chart2 = this.$refs.chart2;
          var myChart = this.$echarts.init(chart2);
          myChart.setOption(this.option2);
        })
    },
    async showlabel(data){
      this.choose=data.name;
      if(data.name=='趋势图')
      {
        this.seetrend=true;
        let that=this;
         this.$nextTick(()=>{
           that.option.title.text="趋势图"
            this.option.legend.data=['开工项目数','配备记录仪项目数','开机使用数量']
            useDeviceTrend().then(res=>{
            this.option.xAxis.data=res.data.time;//横坐标数据
            this.option.series=res.data.series;//总数据
          })
          var chart1 = this.$refs.chart1;
          var myChart = this.$echarts.init(chart1);
          myChart.setOption(this.option);
          }); 
      }

      else if(data.name=='使用情况对比图')
      {
        this.choosetime=true;
      }

      else if(data.name!='趋势图'&&data.name!='使用情况对比图')
      {
        this.$message.error('基层单位与用户尚未设置科室级别，无法统计')
      }
    }
  },
  mounted() {
    console.log('监控总览bug');
   
  },
};
</script>
<style lang='scss'>
</style>
