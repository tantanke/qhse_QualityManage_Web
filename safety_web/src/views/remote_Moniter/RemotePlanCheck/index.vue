<template>
  <div>
    <div class="page-title" style="width:100%">远程计划核查</div>
    <div class="page-content">
      <el-row>
        <el-form label-width="130px" :inline="true">
          <el-form-item label='时间范围：' labelWidth='120px'>
            <el-date-picker v-model="selectdate" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <!-- 计划列表 -->
      <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        <el-table :data="listData" style="width: 100%;text-align:center" ref="treeTable" row-key="code" :indent="30"
          max-height="560" highlight-current-row border>
          <el-table-column type="index" label="序号" width="120" align="center"></el-table-column>
          <el-table-column prop="planName" label="计划名称" align="center"> </el-table-column>
          <el-table-column prop="startDate" label="开始时间" width="200" align="center"> </el-table-column>
          <el-table-column prop="endDate" label="结束时间" width="200" align="center"> </el-table-column>
          <el-table-column label="编辑" width="100" align="center">
            <template slot-scope="scope">
              <el-button v-if="ifcanwrite(scope.row)" type="primary" size="mini" @click="readfile(scope.row)">核查
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <!--取消删除按钮-->
              <!--<el-button -->
              <!--type="danger"-->
              <!--size="mini"-->
              <!--@click="deletefile(scope.row)"-->
              <!--&gt;删除</el-button>-->
              <el-button type="warning" size="mini" @click="inputfile(scope.row)">导出日报</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-dialog :visible.sync="table" center width="500px">
        <div v-if="choose=='hecha'" style="margin-left:39%;margin-bottom:30px;font-size:20px">核查计划</div>
        <div v-if="choose=='ribao'" style="margin-left:39%;margin-bottom:30px;font-size:20px">导出日报</div>
        <el-form label-width="120px" style="width:100%;">
          <el-form-item label='选择时间：' labelWidth='120px'>
            <el-select v-model="selecttime" placeholder="请选择" style="margin-right:20px">
              <el-option-group v-for="group in dates" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-option-group>
            </el-select>
            <el-button v-if="choose=='hecha'" type="primary" size="mini" @click="choosetime">进入核查</el-button>
            <el-button v-if="choose=='ribao'" type="primary" size="mini" @click="inputdaily">导出日报</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>

import ExportJsonExcel from "js-export-excel";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getCheckDetail } from "../../../services/remote";//查询当天录入情况
import { getMonitorPlanList } from "../../../services/remote";//查询
import { deletePlan } from "../../../services/remote";//删除
import { getInputDates } from "../../../services/remote";//删除
import { getDayReport } from "../../../services/remotenew";//导出日报

export default {
  name: '',
  data () {
    return {
      selectdate: '',
      listData: [],
      nowdate: '',
      table: false,
      selecttime: '',
      dates: '',
      monitorPlanID: '',
      choose: ''
    }
  },
  methods: {
    inputdaily () {
      getDayReport({ monitorPlanID: this.monitorPlanID, date: this.selecttime }).then(res => {
        console.log(res.data)
        this.downloadData = [];
        //将树形数据转换为table型数据
        this.parseTreeToTable(res.data)
        var option = {};
        //下载文件名
        option.fileName = this.selecttime + '日报';
        //设置数据来源和数据格式
        option.datas = [{
          sheetData: this.downloadData,
          sheetHeader: ["设备编号", "自编号", "项目名称", "负责人", "负责人电话", "记录仪使用情况", "视频监控描述", "截图编号", "处置情况(录入)", "是否关闭(录入)"]
        }];
        //导出
        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
      })
    },
    parseTreeToTable (node) {//转换格式
      //初始化下载数据项对象
      this.downloadDataItem = {}
      //遍历当前节点，装填数据
      for (var i = 0; i < node.length; i++) {
        //如果当前节点存在，装填数据
        if (node[i]) {
          this.downloadDataItem = {}
          this.downloadDataItem.deviceNo = node[i].deviceNo
          this.downloadDataItem.myNo = node[i].myNo
          this.downloadDataItem.projectName = node[i].projectName
          this.downloadDataItem.charger = node[i].charger
          this.downloadDataItem.tel = node[i].tel
          this.downloadDataItem.condition = node[i].condition
          this.downloadDataItem.description = node[i].description
          this.downloadDataItem.picNo = node[i].picNo
          this.downloadDataItem.disposeIn = node[i].disposeIn
          this.downloadDataItem.closeIn = node[i].closeIn
          //将数据项对象装入下载数据数组，保存
          this.downloadData.push(this.downloadDataItem)
        }
        //递归装填子节点
        if (node[i].childNode) {
          this.parseTreeToTable(node[i].childNode)
        }
      }
    },

    inputfile (data) {
      this.selecttime = this.getNowFormatDate();
      this.selectdate = this.getNowFormatDate();
      this.monitorPlanID = data.monitorPlanID
      this.table = true;
      this.choose = 'ribao';
      getInputDates(data).then(res => {
        this.dates = [
          {
            label: '当天录入日期',
            options: []
          }, {
            label: '过去录入详情',
            options: []
          },
          {
            label: '未到录入时间',
            options: []
          },
        ];

        var cd = new Date(Date.parse(this.selectdate.replace(/-/g, "/")))
        var d1 = new Date(Date.parse(res.data[0].replace(/-/g, "/")))
        if (cd < d1) {
          console.log('why')
          this.selecttime = res.data[0]
          console.log(this.selecttime)
        }
        for (var i = 0; i < res.data.length; i++) {
          var date1 = new Date(Date.parse(this.selectdate.replace(/-/g, "/")));//当前日期
          var date2 = new Date(Date.parse(res.data[i].replace(/-/g, "/")));//列表中的日期

          if (date2 > date1) {
            this.dates[2].options.push({ value: res.data[i], label: res.data[i], disabled: true });
          }
          else if (date2 < date1)
            this.dates[1].options.push({ value: res.data[i], label: res.data[i] });
          else if (date2 = date1) {
            this.dates[0].options.push({ value: res.data[i], label: res.data[i] });
          }


        }
        console.log(this.dates)
      })

    },
    choosetime () {
      this.$router.push({
        name: 'Rcompoments3',
        params: { monitorPlanID: this.monitorPlanID, date: this.selecttime }
      })
    },
    getNowFormatDate () {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    getNowFormatDate2 () {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate() - 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    ifcanwrite (data) {
      var data1 = new Date(Date.parse(data.startDate.replace(/-/g, "/")));
      var data2 = new Date(Date.parse(data.endDate.replace(/-/g, "/")));
      var nd = new Date(Date.parse(this.nowdate.replace(/-/g, "/")));
      if (nd <= data2 && nd >= data1) return true;
      else return false;
    },
    handleClick () {//查询
      getMonitorPlanList().then(res => {
        console.log('查询结果', res)
        this.listData = res.data;
        if (this.selectdate.length != 0) {
          var datas = this.listData;
          var length = datas.length;
          this.listData = []//清空列表数据
          var datemin = new Date(Date.parse(this.selectdate[0].replace(/-/g, "/")));
          var datemax = new Date(Date.parse(this.selectdate[1].replace(/-/g, "/")));
          //循环遍历
          for (var i = 0; i < length; i++) {
            var date1 = new Date(Date.parse(datas[i].startDate.replace(/-/g, "/")));
            var date2 = new Date(Date.parse(datas[i].endDate.replace(/-/g, "/")));
            if (date1 >= datemin && date2 <= datemax) {
              this.listData.push(datas[i])
            }
          }
        }
      })
        .catch(err => {
          console.log('查询失败', err)
        })
    },
    readfile (data) {//详情
      this.monitorPlanID = data.monitorPlanID
      this.selecttime = this.getNowFormatDate();
      this.selectdate = this.getNowFormatDate();
      this.table = true;
      this.choose = 'hecha'
      getInputDates(data).then(res => {
        this.dates = [
          {
            label: '当天可核查日期',
            options: []
          }, {
            label: '过去录入详情',
            options: []
          },
          {
            label: '未到核查时间',
            options: []
          },
        ];

        var cd = new Date(Date.parse(this.selectdate.replace(/-/g, "/")))
        var d1 = new Date(Date.parse(res.data[0].replace(/-/g, "/")))
        if (cd < d1) {
          console.log('why')
          this.selecttime = res.data[0]
          console.log(this.selecttime)
        }
        for (var i = 0; i < res.data.length; i++) {
          var date1 = new Date(Date.parse(this.selectdate.replace(/-/g, "/")));//当前日期
          var date2 = new Date(Date.parse(res.data[i].replace(/-/g, "/")));//列表中的日期

          if (date2 > date1) {
            this.dates[2].options.push({ value: res.data[i], label: res.data[i], disabled: true });
          }
          else if (date2 < date1)
            this.dates[1].options.push({ value: res.data[i], label: res.data[i] });
          else if (date2 = date1) {
            this.dates[0].options.push({ value: res.data[i], label: res.data[i] });
          }


        }
        console.log(this.dates)
      })
    },
    deletefile (data) {
      console.log(data.monitorPlanID)
      deletePlan(data).then(res => {
        console.log('删除结果', res);
        //再次查询
        getMonitorPlanList().then(res => {
          console.log('查询结果', res)
          this.listData = res.data
        }).catch(err => {
          console.log('查询失败', err)
        })
      })
    },

  },
  mounted () {
    this.nowdate = this.getNowFormatDate();
  }
}
</script>
<style lang='scss'>
</style>
