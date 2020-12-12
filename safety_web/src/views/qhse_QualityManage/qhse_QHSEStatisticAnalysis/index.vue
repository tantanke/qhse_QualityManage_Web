<template>
  <div>
    <div class="page-title" style="width: 100%">要素证据审核</div>
    <div class="page-content">
      <el-form :inline="true" :model="filterQuery">
        <el-form-item label="选择公司：">
          <treeselect
            :disable-branch-nodes="true"
            :multiple="false"
            :options="companyList"
            placeholder="请选择公司单位"
            @select="selectDepart"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="选择年份：">
          <el-date-picker
            v-model="filterQuery.year"
            type="year"
            placeholder="选择年份"
            style="width: 200px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleClick"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="success"
            icon="el-icon-success"
            @click="confirmAnalysis"
            >确认审核</el-button
          >
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            icon="el-icon-success"
            @click="messagenotpass"
            >通知打回</el-button
          >
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            icon="el-icon-success"
            @click="checkalllabel"
            >一键审核</el-button
          >
        </el-form-item>
      </el-form>
      <el-row style="padding: 10px; border-top: 2px dashed #dddddd">
        <div style="margin: 15px 0px">
          <span style="margin-right: 15px">请选择批准方式:</span>
          <el-radio v-model="showType" label="树形审核">树形审核</el-radio>
          <el-radio v-model="showType" label="列表审核">列表审核</el-radio>
        </div>
        <div style="margin: 15px 0px">
          <span style="margin-right: 15px">请选择查看内容:</span>
          <el-radio v-model="checkType" label="未审核">未审核</el-radio>
          <el-radio v-model="checkType" label="已审核">已通过</el-radio>
          <el-radio v-model="checkType" label="不通过">不通过</el-radio>
          <!--<div style="float:right;margin:5px 20px;color:orange">未录入:{{this.total3}}</div>-->
          <div style="float: right; margin: 5px 20px; color: orange">
            未录入:{{ this.total - this.total1 - this.total2 || "0" }}
          </div>
          <div style="float: right; margin: 5px 20px; color: blue">
            未审核:{{ this.total1 }}
          </div>
          <div style="float: right; margin: 5px; color: red">
            已审核:{{ this.total2 }}
          </div>
          <div style="float: right; margin: 5px">全要素:{{ this.total }}</div>
        </div>
        <el-table
          :cell-style="cellStyle"
          v-if="checkType == '未审核' && showType == '树形审核'"
          :data="treeData"
          style="width: 100%text-align:center"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{ children: 'childNode', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus == 1)
                "
                >进入审核
              </el-button>
              <el-button
                icon="el-icon-success"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus != 1)
                "
                >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :cell-style="cellStyle"
          v-if="checkType == '已审核' && showType == '树形审核'"
          :data="hasData"
          style="width: 100% text-align:center"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{ children: 'childNode', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="内容"></el-table-column>
          1
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus == 1)
                "
                >进入审核
              </el-button>
              <el-button
                icon="el-icon-success"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus != 1)
                "
                >查看
              </el-button>
            </template>
          </el-table-column>
          1
        </el-table>
        <el-table
          :cell-style="cellStyle"
          v-if="checkType == '未审核' && showType == '列表审核'"
          :data="listData"
          style="width: 100%text-align:center"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{ children: 'childNode', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus == 1)
                "
                >进入审核
              </el-button>
              <el-button
                icon="el-icon-success"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus != 1)
                "
                >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :cell-style="cellStyle"
          v-if="checkType == '已审核' && showType == '列表审核'"
          :data="haslistData"
          style="width: 100% text-align:center"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{ children: 'childNode', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="内容"></el-table-column>
          1
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus == 1)
                "
                >进入审核
              </el-button>
              <el-button
                icon="el-icon-success"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus != 1)
                "
                >查看
              </el-button>
            </template>
          </el-table-column>
          1
        </el-table>
        <el-table
          :cell-style="cellStyle"
          v-if="checkType == '不通过' && showType == '树形审核'"
          :data="nopassData"
          style="width: 100%text-align:center"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{ children: 'childNode', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus == 1)
                "
                >进入审核
              </el-button>
              <el-button
                icon="el-icon-success"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus != 1)
                "
                >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :cell-style="cellStyle"
          v-if="checkType == '不通过' && showType == '列表审核'"
          :data="nopasslistData"
          style="width: 100% text-align:center"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{ children: 'childNode', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="内容"></el-table-column>
          1
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus == 1)
                "
                >进入审核
              </el-button>
              <el-button
                icon="el-icon-success"
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="
                  (scope.row.childNode.length === 0) &
                  (scope.row.checkStatus != 1)
                "
                >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-dialog
        title="详细内容"
        :visible.sync="dialogVisible"
        width="70%"
        :close-on-click-modal="false"
      >
        <el-form
          label-width="100px"
          :label-postion="right"
          :model="detailData"
          style="width: 100%"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核结果:">
                <el-switch
                  style="margin-right: 10px"
                  v-model="upstatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="通过"
                  inactive-text="不通过"
                >
                </el-switch>
                <el-button
                  icon="el-icon-check"
                  :disabled="curCheckStatus !== 1"
                  type="primary"
                  @click="passornot"
                  >确认审核</el-button
                >
              </el-form-item>
              <el-form-item
                v-if="!upstatus"
                label="驳回意见："
                style="margin-bottom: 1px"
              >
                <el-input
                  ype="text"
                  label="驳回意见 ："
                  class="resizeNone"
                  v-model="unpasstext"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
              <el-form-item label="要素名称：" style="margin-bottom: 1px">{{
                detailData.name
              }}</el-form-item>
              <el-form-item
                v-if="detailData.isInvolve==0"
                label="是否不涉及："
                style="margin-bottom: 1px;color:red"
                >该项要素不涉及审核环节！
              </el-form-item>
              <el-form-item label="证据描述：" style="margin-bottom: 1px">{{
                detailData.evidenceDescription
              }}</el-form-item>
            </el-col>
            <el-col :span="24" style="border: 1px solid gray">
              <el-form-item label="附件描述：" style="margin-bottom: 1px">{{
                detailData.attachDescrption
              }}</el-form-item>
              <el-form-item label="证据图片：" style="margin-bottom: 10px">
                <div v-for="(item, index) in attachs" :key="index">
                  <el-card
                    :body-style="{ padding: '10px' }"
                    style="
                      width: 100px;
                      height: 100px;
                      text-align: center;
                      float: left;
                      margin: 05px;
                    "
                  >
                    <span v-if="!item">无图片文件记录！</span>
                    <el-popover placement="right" title trigger="click" v-else>
                      <div
                        style="box-shadow: 0 0 2px 4px rgba(0, 0, 0, 0.3)"
                        class="picPosition"
                      >
                        <img :src="item" class="picSize" />
                      </div>
                      <img
                        slot="reference"
                        :src="item"
                        :alt="detailData.pictureFile"
                        style="width: 100%; height: 100%"
                      />
                    </el-popover>
                  </el-card>
                </div>
              </el-form-item>
              <el-form-item label="证据文件：" style="margin-bottom: 10px">
                <div v-for="(item, index) in files" :key="index">
                  <a
                    :href="item"
                    style="max-width: 600px; height: auto"
                    :download="strings[index]"
                    target="_blank"
                    >{{ strings[index] }}</a
                  >
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog><el-dialog
        title="消息通知"
        :visible.sync="chooseReceiver"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-form label-width="120px" style="width: 100%">
          <el-row>
            <el-form-item label="选择通知人:">
              <el-select
                v-model="receiverId"
                placeholder="请选择人员"
                clearable
                filterable
              >
                <el-option
                  v-for="item in receiverList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option
              ></el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="receiverAndPush" type="primary">通知推送</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
      
    </div>
  </div>
</template>
<script>
import { qhse_company_tree } from "../../../services/qhse_EvidenceCheck"; //获取公司及诶单数
import { query_elementReviewer } from "../../../services/qhse_EvidenceCheck"; //证据项
import { pass_elementReviewer } from "../../../services/qhse_EvidenceCheck"; //通过审核
import { no_elementReviewer } from "../../../services/qhse_EvidenceCheck"; //不通过审核
import { show_elementReviewer } from "../../../services/qhse_EvidenceCheck"; //显示要素证据信息
import { downloadElementFile } from "../../../services/qhse_EvidenceCheck";
import {
  getReceiver,
  sendMessage,
  callBack,
} from "../../../services/qhse_QualityCheck"; // 确认提交
import {
  show_approve_check,
  show_no_pass_element,
} from "../../../services/qhse_EvidenceCheck"; //显示已经审核或者批准的信息
import { showAllElement } from "../../../services/qhse_EvidenceCheck";
import {
  submitInputResult,
  passAll,
} from "../../../services/qhse_QualityCheck"; // 确认审核
import { GetCurrentUser } from "../../../../src/store/CurrentUser";

const DefaultQuery = {
  year: "",
  companyCode: null,
  companyName: null,
};
export default {
  data() {
    return {
      code: "",
      receiverId: "", //选择的id
      receiverList: [],
      chooseReceiver: false, //推送框
      chooseReceiver2: false, //推送框
      right: "",
      nopasslistData: [],
      nopassData: [],
      listData: [],
      haslistData: [],
      showType: "树形审核",
      unpasstext: "",
      total: "",
      total1: "",
      total2: "",
      checkType: "未审核",
      filelength: "",
      strings: null,
      upstatus: false,
      filterQuery: {}, //记载公司的信息
      companyList: [], //记载公司的展开树节点
      disabled1: false,
      download: "",
      dialogFormVisible: false,
      loading: true,
      dialogVisible: false,
      detailData: [],
      treeData: [],
      hasData: [],
      initData: [],
      node: [],
      nodeData: [],
      attachs: [],
      attach: "",
      files: [],
      status: [
        {
          id: 1,
          label: "未审核",
          status: "未审核",
        },
        {
          id: 2,
          label: "未批准",
          status: "未批准",
        },
      ],
      tableID: null,
      curStatus: "", // 通过进入审核或查看按钮进入录入页面时，保存具体某个要素的状态(不通过、未审核等一系列状态)
      curCheckStatus: 0, //  通过进入审核或查看按钮进入录入页面时，保存具体某个要素的状态(0, 1, 2等一系列状态)
    };
  },
  methods: {
    reshowdata() {
      query_elementReviewer(this.filterQuery) //获取到叶子节点信息
        .then((res) => {
          this.listData = [];
          this.treeData = res.data;
          console.log(res.data, "query_elementReviewer");

          // 如果长度大于0，从其中取出tableID属性
          if (this.treeData.length) {
            this.tableID = this.treeData[0].childNode[0].qHSE_CompanyYearManagerSysElementTable_ID;
          }
          this.deepTree4(this.treeData);
          this.total1 = 0;
          this.deepTree1(this.treeData);
          console.log("查询的时候查询1");
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("获取已审核");
      show_approve_check(this.filterQuery)
        .then((res) => {
          this.haslistData = [];
          this.hasData = res.data;
          console.log("已审核数据源1", this.hasData);
          this.deepTree3(this.hasData);
          console.log("已审核列表", this.haslistData);
          // 如果长度大于0，从其中取出tableID属性
          if (this.hasData.length) {
            this.tableID = this.hasData[0].childNode[0].qHSE_CompanyYearManagerSysElementTable_ID;
          }

          this.total2 = 0;
          this.deepTree2(this.hasData);
        })
        .catch((err) => {
          console.log(err);
          this.message.error(err.message);
        });
      show_no_pass_element(this.filterQuery).then((res) => {
        this.nopasslistData = [];
        this.nopassData = res.data;
        this.deepTree5(this.nopassData);
      });
      console.log(this.nopassData, this.nopasslistData);
    },
    deepTree5(treedata) {
      let _this = this;
      treedata.forEach((item) => {
        if (item.childNode.length === 0) {
          _this.nopasslistData.push(item);
          return;
        } else {
          _this.deepTree5(item.childNode);
        }
      });
    },
    deepTree3(treedata) {
      let _this = this;
      treedata.forEach((item) => {
        if (item.childNode.length === 0) {
          _this.haslistData.push(item);
          return;
        } else {
          _this.deepTree3(item.childNode);
        }
      });
    },
    deepTree4(treedata) {
      let _this = this;
      treedata.forEach((item) => {
        if (item.childNode.length === 0) {
          _this.listData.push(item);
          return;
        } else {
          _this.deepTree4(item.childNode);
        }
      });
    },
    selectDepart(val) {
      console.log("selectDepart", val);
      this.filterQuery.companyCode = val.nodeCode;
    },
    selectDepart2(res) {
      console.log("selectDepart2", res);
      let obj = {};
      //遍历下拉数组中的item
      obj = this.status.find((item) => {
        return item.status === res;
      });
      console.log(JSON.stringify(obj.status));
      this.$set(this.filterQuery, this.filterQuery.status, res.value);
    },
    handleGetCompany() {
      //获取到公司的名字 即在选择页面显示
      qhse_company_tree()
        .then((res) => {
          this.companyList = JSON.parse(JSON.stringify(res.data));
          this.dialogVisible = false;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    deepTree1(treedata) {
      let _this = this;
      console.log("啊这", treedata);

      treedata.forEach((item) => {
        if (item.childNode.length === 0) {
          _this.total1++;
          return;
        } else {
          _this.deepTree1(item.childNode);
        }
      });
      return _this.total1;
    },
    deepTree2(treedata) {
      let _this = this;
      console.log("啊这2", treedata);
      treedata.forEach((item) => {
        if (item.childNode.length === 0) {
          _this.total2++;
          return;
        } else {
          _this.deepTree2(item.childNode);
        }
      });
      return _this.total2;
    },
    passornot() {
      if (this.upstatus == true) {
        //当按钮选择通过
        this.nodeData.negativeOpinion = "";
        pass_elementReviewer(this.nodeData)
          .then((res) => {
            console.log(res.message);
            this.$message.success(res.message);
            this.reshowdata();
            this.dialogVisible = false;
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      } else {
        if (this.unpasstext == "" || this.unpasstext == null)
          this.$message.error("请输入驳回意见");
        else {
          this.nodeData.negativeOpinion = this.unpasstext;
          no_elementReviewer(this.nodeData)
            .then((res) => {
              console.log(res.message);
              this.$message.success(res.message);
              this.reshowdata();
              this.dialogVisible = false;
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      }
    },
    loadFilterParams() {
      //获取年份
      //把filterquery加上信息与路由
      this.filterQuery = { ...DefaultQuery, ...this.$route.query };
      this.filterQuery = {
        ...this.filterQuery,
      };
      this.filterQuery.status = "";
      let year = new Date();
      this.filterQuery.year = String(year.getFullYear());
    },
    handleClick() {
      //点击查询获取到公司的证据项  改为check页面的显示节点
      (this.treeData = ""), (this.hasData = "");
      if (!this.filterQuery.year) {
        //显示年份
        this.filterQuery.year = new Date();
      }
      let nowdata = new Date(this.filterQuery.year);
      this.filterQuery.year = String(nowdata.getFullYear());
      this.filterQuery.status = 0;
      if (this.filterQuery.companyCode == null)
        this.$message.error("请选择公司");
      else {
        this.handleGetInitialData(); //更改loading状态
        showAllElement(this.filterQuery) //获取全要素
          .then((res) => {
            this.total = res.AllElement;
            this.total3 = res.NotInput;
          })
          .catch((err) => {
            console.log(err);
            this.message.error(err.message);
          });
        this.reshowdata();
      }

      this.loading = false;
    },
    handleCellClick(row, cell, column) {
      //展开列表的子节点
      if (row.childNode.length > 0) {
        let els = column.getElementsByClassName("el-icon-arrow-right");
        if (els.length != 0) {
          els[0].click();
        }
      }
    },
    handleGetInitialData() {
      this.loading = true;
    },
    async updateScore(data) {
      //显示出证据项的内容
      // 点击进入审核或录入进入某个具体的要素时，保存这个要素的状态

      this.detailData = {};
      this.detailData.name = data.name;
      this.detailData.code = data.code;
      this.detailData.content = data.content;
      if (data.content == null) {
        this.detailData.content = "未输入内容";
      }
      this.detailData.basis = data.basis;
      if (data.basis == null) {
        this.detailData.basis = "未输入内容";
      }
      this.detailData.auditMode = data.auditMode;
      this.detailData.initialScore = data.initialScore;
      this.detailData.formula = data.formula;
      this.detailData.problemDescription = data.problemDescription;
      this.detailData.isInvolve = data.isInvolve;

      this.curStatus = data.status;
      var this_;

      // 点击进入审核或录入进入某个具体的要素时，保存这个要素的状态
      this.curCheckStatus = data.checkStatus;

      console.log(this.userId);
      this.attachs = {};
      this.files = {};
      (this.download = {}), (this_ = this);
      await show_elementReviewer(data)
        .then((res) => {
          this_.dialogVisible = true;
          this_.nodeData = res.data;
          this_.nodeData.qHSE_CompanyYearManagerSysElement_ID =
            data.qHSE_CompanyYearManagerSysElement_ID;
          this_.detailData.evidenceDescription =
            this_.nodeData.evidenceDescription;
          if (
            this_.nodeData.evidenceDescription ==
            "录入判定该项要素不涉及流程，不予录入"
          )
            this.$message.warnning("该项要素不涉及流程！");
          this_.detailData.checkStaffName = this_.nodeData.checkStaffName;
          this_.detailData.approverStaffName = this_.nodeData.approverStaffName;
          this_.detailData.attachDescrption = this_.nodeData.attachDescrption;
          this_.detailData.uploadTime = this_.nodeData.uploadTime;
          var attach = this_.nodeData.attach; //获取地址字符串
          var arr = attach.split(";");
          for (var i = 0, j = 0, k = 0; i < arr.length - 1; i++) {
            //j代表图片数量，k代表文件数量
            var houzhui = arr[i].substring(arr[i].length - 3); //获取到链接后缀
            if (
              houzhui == "jpg" ||
              houzhui == "png" ||
              houzhui == "PNG" ||
              houzhui == "JPG"
            ) {
              this_.attachs[j] = arr[i];
              j++;
            } else {
              this_.files[k] = arr[i];
              k++;
              this_.filelength = k;
            }
          }
          console.log("attach数量：", arr.length, this_.attachs);
        })
        .catch((err) => {
          console.log(err);
          this_.message.error(err.message);
        });
      this.node = data;

      this.download = [];
      for (var i = 0; i < this.filelength; i++) {
        await downloadElementFile(
          this.files[i].substring(49, this.files[i].length)
        ).then((res) => {
          console.log(this.download);
          this.download[i] = JSON.parse(JSON.stringify(res.data));
        });
      }
      var strings = JSON.parse(JSON.stringify(this.download));
      this.strings = strings;
      console.log("文件信息", this.strings);

      console.log(
        "最后的为什么没信息要素节点内容：",
        this.nodeData,
        this.detailData
      );
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      //根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === "状态" && row.row.status === "备案待查") {
        return "color:pink";
      } else if (row.column.label === "状态" && row.row.status === "未提供") {
        return "color:orange";
      } else if (row.column.label === "状态" && row.row.status === "未批准") {
        return "color:blue";
      } else if (row.column.label === "状态" && row.row.status === "不通过") {
        return "color:red";
      }
    },
    // 确认审核
    confirmAnalysis() {
      if (this.tableID) {
        if (this.total == this.total2) {
          this.chooseReceiver = true;
          console.log("初始code", this.code);
          var mcode="00010005";
          getReceiver({ companyCode: this.code, moduleCode: mcode }).then(
            (res) => {
              this.receiverList = res.data;
            }
          );
        } else this.$message.error("未审核完成");
      }
    },
    receiverAndPush() {
      if (this.receiverId) {
        sendMessage({receiverId: this.receiverId, tag: 1}).then(res=>{
          submitInputResult({
          tableID: this.tableID,
          tag: 1,
        }).then((res) => {
          this.$message.success("提交成功");
          this.receiverId='';
          this.chooseReceiver=false;
          this.reshowdata();
          this.curCheckStatus = 2;
        });
        })
        //进行了选择
        
      } else {
        this.$message.error("请选择通知成员");
      }
    },
    checkalllabel() {
      if (this.tableID) {
        if((this.total - this.total1 - this.total2)!=0)
        this.$message.error('存在已打回项，无法一键审核!')
        else
        {
          passAll({
          tableID: this.tableID,
          sourceID: 1,
        }).then((res) => {
          if (res.code == 1000) {
            this.$message.success("一键审核成功");
            this.reshowdata();
          }
        });
        }
        
      }
    },
    messagenotpass(){
      if (this.tableID) {
        if (this.total1==0) {
          if(this.nopasslistData.length!=0){
          console.log("初始code", this.code);
          var mcode="00010005";
          callBack({ tableId: this.tableID, sourceId:0}).then(
            (res) => {
              if(res.code==1000)
            {
            this.$message.success("通知打回成功");
            }
            else{
            this.$message.error("通知打回失败");}
            }
          );}
          else{
            this.$message.error("不存在未通过项");
          }
        } else this.$message.error("未审核完毕");
      }
    }
  },
  mounted() {
    console.log("审核从这里开始报错");
    this.handleGetCompany(); //第一个函数 获取到公司信息
    this.loadFilterParams();
    this.handleGetInitialData(); //获取到表单信息
    this.filterQuery.companyCode = GetCurrentUser().companyCode;
    this.code=GetCurrentUser().companyCode;
    this.handleClick();
    this.loading = false;
  },
};
</script>

<style lang="scss">
.el-popover.el-popper {
  left: -1000px !important;
}

.picSize {
  max-width: 1400px;
  max-height: 750px;
  vertical-align: bottom;
}

.picPosition {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
