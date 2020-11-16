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
      <el-dialog 
        title="导出数据"
        :visible.sync="seetrend"
        center
        width="800px"
        :close-on-click-modal="false">
        <div id="chart1" ref="chart1" :style="{width: '90%', height: '500px',display:'inline-block'}"></div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { useDeviceTrend } from "../../../services/supervise"; //查询细节
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
        text: '示例图'
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
    };
  },
  methods: {
    gotoDataApply() {
      this.$router.push({
        name: "DataApply",
        params: {},
      });
    },
    showlabel(data){
      if(data.name=='趋势图'){
        this.seetrend=true;
        useDeviceTrend().then(res=>{
          this.option.text="趋势图";
          this.option.legend.data=res.data.time;//横坐标数据
          this.option.xAxis.data=res.data.time;//横坐标数据
          this.option.series=res.data.series;//总数据
        })
        this.$nextTick(()=>{
          var chart1 = this.$refs.chart1;
          var myChart = this.$echarts.init(chart1);
          myChart.setOption(this.option);
        })
      }
    }
  },
  mounted() {
    console.log('监控总览bug')
  },
};
</script>
<style lang='scss'>
</style>
