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
      <el-dialog v-if="seetrend">
        <div id="main" style="width: 600px;height:400px;"></div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
var echarts = require('echarts/lib/echarts');
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
      optiontrend:{
        title: {
        text: '折线图堆叠'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
    },
      seetrend:false,
    };
  },
  methods: {
    gotoDataApply() {
      this.$router.push({
        name: "DataApply",
        // 暂时不知道这里需要什么路径参数
        params: {},
      });
    },
    showlabel(data){
      if(data.name=='趋势图'){
        this.seetrend=true;
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(this.optiontrend);}
    }
  },
  mounted() {
    console.log('监控总览bug')
  },
};
</script>
<style lang='scss'>
</style>
