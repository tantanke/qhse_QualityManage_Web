<template>
  <div>
    <div class="page-title" style="width: 100%; justify-content: flex-start">
      <span style="cursor: pointer">监控数据应用</span>
			<span style="padding:0 20px">|</span>
			<span style="color: #ccc; cursor: pointer" @click="gotoPlanData()">年度监控统计</span>
    </div>
    <div class="page-content">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="choosetime = true"
            >选择时间导出</el-button
          >
        </el-form-item>
      </el-form>
      <el-row
        style="
          padding: 10px;
          border-top: 2px dashed #dddddd;
          text-align: center;
        "
      >
        <!-- 展开事件要放在被展开行所属的表上 -->
        <el-table
          :data="listData"
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
            prop="deviceNo"
            label="设备编号"
            width="120"
            align="center"
            show-overflow-tooltip
            :filters="filterdeviceNoList"
            :filter-method="filterdeviceNo"
          ></el-table-column>
          <el-table-column
            prop="myNo"
            label="自编号"
            width="120"
            align="center"
            show-overflow-tooltip
            :filters="filtermyNoList"
            :filter-method="filtermyNo"
          ></el-table-column>
          <el-table-column
            prop="planName"
            label="计划名称"
            width="120"
            align="center"
            show-overflow-tooltip
            :filters="filterPlanNameList"
            :filter-method="filterPlanName"
          ></el-table-column>
          <el-table-column
            prop="companyName"
            label="基层单位"
            width="120"
            align="center"
            show-overflow-tooltip
            :filters="filterCompanyNameList"
            :filter-method="filterCompanyName"
          ></el-table-column>
          <el-table-column
            prop="itemCategory"
            label="项目类别"
            width="120"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="projectName"
            label="项目名称"
            align="center"
            show-overflow-tooltip
            :filters="filterProjectNameList"
            :filter-method="filterProjectName"
          ></el-table-column>
          <el-table-column
            prop="charger"
            label="负责人"
            width="120"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="tel"
            label="电话"
            width="120"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="projectProgress"
            label="项目进度"
            width="120"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="condition"
            label="记录仪使用情况"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="description"
            label="视频监控描述"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="picNo"
            label="截图编号"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <a href="#" @click="handlePictureCardPreview2(scope.row)">{{
                scope.row.picNo
              }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="disposeInOrCheck"
            label="处置情况"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="inputPersonName"
            label="监控人员"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="inputDate"
            label="录入时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="checkDate"
            label="核查时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="result"
            label="核查情况"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="closeInOrCheck"
            label="是否关闭"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </el-row>
      <el-dialog
        title="导出数据"
        :visible.sync="choosetime"
        center
        width="700px"
        :close-on-click-modal="false"
      >
        <el-form label-width="130px" :inline="true">
          <el-form-item
          style="margin-left:220px">
            <el-switch
              v-model="timetype"
              active-text="选择时间段"
              inactive-text="选择某天"
              active-value="选择时间段"
              inactive-value="选择某天"
              inactive-color="orange"
            ></el-switch
          ></el-form-item>
          <el-form-item
            label="时间范围："
            labelWidth="120px"
            v-if="timetype == '选择时间段'"
          >
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
          <el-form-item 
            labelWidth="120px" label="统计时间:" v-if="timetype == '选择某天'">
            <el-date-picker
              v-model="selecttime"
              type="date"
              placeholder="选择时间"
              value-format="yyyy-MM-dd"
              style="width: 200px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="warning"
              icon="el-icon-download "
              @click="timeupload()"
              >下载</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ExportJsonExcel from "js-export-excel";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { GetCurrentUser } from "../../../store/CurrentUser.js";
import { createNewMonitorPlan } from "../../../services/remote"; //新建
import { getMonitorPlanList } from "../../../services/remote"; //查询
import { deletePlan } from "../../../services/remote"; //删除
import { getDetails, endMonitorPlan } from "../../../services/remote"; //查询细节
import { getInputAndCheckDetail } from "../../../services/remote";
export default {
  data() {
    return {
      selectdate: "",
      listData: [], // 渲染表格的初始数据结构
      listData2:[],
      status_processing: 0, // 状态统计，执行中的数量
      status_completed: 0, // 状态统计，已完成的数量
      filterProjectNameList: [], // 用于对项目名称进行筛选的结构
      filterCompanyNameList: [], // 用于对基层单位进行筛选的结构
      filterPlanNameList: [], // 用于对计划名称进行筛选的结构
      filtermyNoList:[],
      filterdeviceNoList:[],
      expandNum: 0, // 展开的行数，用来判断当前事件是展开还是收起
      dialogVisible2: false,
      dialogImageUrl: "",
      choosetime:false,
      selectdates: "", //时间段
      selecttime: "", //时间天
      timetype: "选择某天",
    };
  },
  methods: 
  {gotoPlanData(){//前往迷之页面
        this.$router.push({
            name: 'supervise',
            // 暂时不知道这里需要什么路径参数
            params: {}
        })
    },
    //设置表头行的样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return 'background-color:lightblue;color:#fff;font-family:"楷体";font-size:18px;text-align:center';
    },
    handlePictureCardPreview() {
      this.dialogImageUrl = this.url;
      this.dialogVisible2 = true;
    },
    handlePictureCardPreview2(data) {
      this.dialogImageUrl = "http://39.98.173.131:9000/api" + data.picLink;
      this.dialogVisible2 = true;
    },
    // 得到用于渲染表格的数据
    async getListData() {
      this.listData = [];
      this.listData2 = [];
      let res = await getMonitorPlanList();
      if (res.code === 1000) {
        res.data.forEach((d) => {
          getDetails({ monitorPlanID: d.monitorPlanID }).then((res) => {
            if (res.code === 1000) {
              // 将远程计划的计划详情添加进去
              //                                d.detailsArray = res.data
              res.data.forEach((d2) => {
                //d2是获取到的每一节点
                d2.planName = d.planName;
                //高亮！！
                //监控数据应用部分，再加一层循环，把详情给循环进去。
                var oneline = d2; //记录外层数据结构
                getInputAndCheckDetail(d2.monitorPlanDetailID).then((res) => {
                  var linearray2 = res.data;
                  // 为了满足新需求，对不同的condition显示不同的字段内容
                  //循环每一行，添加数据
                  linearray2.forEach((a) => {
                    a.closeInOrCheck =
                      a.condition === "备用" ? a.closeCheck : a.closeIn;
                    a.disposeInOrCheck =
                      a.condition === "备用" ? a.disposeCheck : a.disposeIn;

                    if (a.condition === "备用") {
                      a.closeInOrCheck = a.closeInOrCheck
                        ? a.closeInOrCheck
                        : "未核查";
                      a.disposeInOrCheck = a.closeInOrCheck
                        ? a.closeInOrCheck
                        : "未核查";
                    }
                    // oneline = Object.assign( oneline, a)
                    oneline.checkDate = a.checkDate;
                    oneline.disposeIn = a.disposeIn;
                    oneline.disposeInOrCheck = a.disposeInOrCheck;
                    oneline.closeInOrCheck = a.closeInOrCheck;
                    oneline.condition = a.condition;
                    oneline.description = a.description;
                    oneline.closeIn = a.closeIn;
                    oneline.disposeIn = a.disposeIn;
                    oneline.inputDate = a.inputDate;
                    oneline.inputPersonName = a.inputPersonName;
                    oneline.inputPersonID = a.inputPersonID;
                    oneline.monitorInputCheckRecordID =
                      a.monitorInputCheckRecordID;
                    oneline.picLink = a.picLink;
                    oneline.picNo = a.picNo;
                    this.listData2.push(oneline);
                  });

                  console.log(res.data, "当前展开的表格的数据");

                  // 由于表格不及时更新，需要点击表格一下
                  let row = document.getElementsByClassName("el-table__row");
                  for (let i = 0; i < row.length; i++) {
                    row[i].click();
                  }
                });

                // this.listData.push(d2);
              });
            } else {
              console.log("远程计划监控数据getDetails失败");
              this.$message.error("获取失败");
            }
          });
        });
        console.log('获取数据完成',this.listData2)
        this.listData=this.listData2
      } else {
        console.log("远程计划监控数据getMonitorPlanList失败");
        this.$message.error("获取失败");
      }
      // 为了防止前面的请求未完成，因此通过定时器将该操作延后执行
      setTimeout(() => {
        this.filterMethods(this.listData);
        console.log('筛选字段完成')
      }, 5000);
    },
    // 用于筛选项目名称列的方法
    filterProjectName(value, row, column) {
      // property 是列名，比如此处就为projectName
      const property = column["property"];
      // value 是选中的值，可能会有多个，依次比较，当前行列的值是否与选中的值相等，相等则保留
      return row[property] === value;
    },
    // 用于筛选基层单位列的方法
    filterCompanyName(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    // 用于筛选计划名称的方法
    filterPlanName(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    filtermyNo(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    filterdeviceNo(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    // 筛选数据
    filterMethods(listData) {
      // 两个辅助结构，为了得到不重复的filterList
      let distinctProjectName = new Set();
      let distinctCompanyName = new Set();
      let distinctPlanName = new Set();
      let distinctmyNo = new Set();
      let distinctdeviceNo = new Set();
      // 添加之前先将原来的清空，防止出现重复数据
      this.filterProjectNameList = [];
      this.filterCompanyNameList = [];
      this.filterPlanNameList = [];
      this.filterdeviceNoList=[];
      this.filtermyNoList=[];
      listData.forEach((e) => {
        if (!distinctProjectName.has(e.projectName)) {
          distinctProjectName.add(e.projectName);
          this.filterProjectNameList.push({
            value: e.projectName,
            text: e.projectName,
          });
        }
        if (!distinctCompanyName.has(e.companyName)) {
          distinctCompanyName.add(e.companyName);
          this.filterCompanyNameList.push({
            value: e.companyName,
            text: e.companyName,
          });
        }
        if (!distinctPlanName.has(e.planName)) {
          distinctPlanName.add(e.planName);
          this.filterPlanNameList.push({ value: e.planName, text: e.planName });
        }
        if (!distinctmyNo.has(e.myNo)) {
          distinctmyNo.add(e.myNo);
          this.filtermyNoList.push({ value: e.myNo, text: e.myNo });
        }
        if (!distinctdeviceNo.has(e.deviceNo)) {
          distinctdeviceNo.add(e.deviceNo);
          this.filterdeviceNoList.push({ value: e.deviceNo, text: e.deviceNo });
        }
      });
    },
  },
  mounted() {
    console.log("这是远程计划的bug开始");
    this.getListData();
  },
};
</script>
<style>
</style>