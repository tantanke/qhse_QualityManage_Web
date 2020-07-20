<template>
  <div>
    <div class="page-title" style="width:100%">要素证据录入</div>
    <div class="page-content">
      <el-row>
        <el-form label-width="130px" :inline="true" :model="filterQuery">
          <el-form-item label="选择公司：">
            <treeselect
              :multiple="false"
              :options="companyList"
              placeholder="请选择公司单位"
              @select="selectDepart"
              style="width:200px"
            />
          </el-form-item>
          <el-form-item label="选择年份：">
            <el-date-picker
              v-model="filterQuery.year"
              type="year"
              placeholder="选择年份"
              style="width:200px">
              </el-date-picker>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        <el-table
          :data="treeData"
          style="width: 100%"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button 
              type="primary"
              size="mini"
              @click="updateScore(scope.row)"
              v-if="scope.row.childNode.length === 0"
              >录入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

       <el-dialog title="详细内容" :visible.sync="dialogVisible" center width="1200px">
        <el-form label-width="140px" :model="detailData" style="width:100%;" >
          <el-row>
            <el-col :span="12">
              <el-form-item label="量化名称：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>
              <el-form-item label="证据描述：" style="margin-bottom:1px"></el-form-item>
              <el-input type="textarea" :rows="7" label="证据描述："  style="margin-bottom:1px;margin-left:40px" v-model="text.input" placeholder="请输入内容"></el-input>
              <el-form-item label="录入人姓名：" style="margin-bottom:1px">{{detailData.checkStaffName}}</el-form-item>
              <el-form-item label="审核人姓名：" style="margin-bottom:1px">{{detailData.checkStaffName}}</el-form-item>
              <el-form-item v-if="this.node.status==='未批准'"  label="批准人姓名：" style="margin-bottom:1px">{{detailData.approverStaffName}}</el-form-item>
              </el-col>
            <el-col :span="12">
              <!-- <el-form-item label="附件：" style="margin-bottom:1px">{{detailData.attacjDescription}}
                <span class="span1"  style="position: absolute;text-align: center;width: 135px;left:0;">浏览文件</span>
                <el-input type="file" class="input1"></el-input>
              </el-form-item>
              <el-form-item label="证据图片：" style="margin-bottom:10px">

                <el-card :body-style="{ padding: '10px' }" style="width:100%;height:200px;text-align:center" >
                  <span v-if="!detailData.attach">无图片文件记录！</span>
                  <el-popover placement="right" title trigger="click" v-else>
                    <div style="max-width:600px;height:auto">
                      <img :src="detailData.attach" style="max-width:600px;height:auto" />
                    </div>
                    <img slot="reference" :src="detailData.attach" :alt="detailData.pictureFile" style="max-height: 180px" />
                  </el-popover>
                </el-card>

                <span class="span1"  style="position: absolute;text-align: center;width: 135px;left:0;">浏览图片</span>
                <el-input type="file" class="input1"></el-input>
              </el-form-item> -->

              <el-form-item label="上传文件">
                <el-upload
                  v-model="form.fileID"
                  :limit="1"
                  :on-success="handleAvatarSuccess"
                  :action="accidentOrEventUploadAddress">
                <div class="span1">浏览附件</div>
                </el-upload>
              </el-form-item>
              <el-form-item style="text-align:right">
                <!-- <el-button v-if="this.node.status==='未审核'" type="danger" @click="pass_click">审核通过</el-button> -->
                <el-button type="danger" @click="dialogVisible = false">返回</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { qhse_company_tree } from "../../../services/qhse_EvidenceCheck";//获取公司tree
import { querryYearElement } from "../../../services/qhse_QualityCheck";//显示公司所有的证据项节点
import { element_evidence } from "../../../services/qhse_QualityCheck";//显示证据项内容
const DefaultQuery = {
  year: "",
  companyCode: null,
  status:""
};
export default {
  data() {
    return {
      filterQuery: {},
      companyList: [],
      disabled1:false,
      dialogFormVisible: false,
      loading: true,
      dialogVisible: false,
      detailData: {},
      treeData: [],
      initData:[],
      node:[],
      nodeData:[],
      text:{
        input:[]},
      form:{
        address: '',
        emergencyHandler: '',
        briefDescription: '',
        fileID:''}
    };
  },
  methods: {
    selectDepart(val) {
      console.log('selectDepart', val);
      this.filterQuery.companyName = val.label;
    },
    handleGetCompany() {//获取到公司的名字 即在选择页面显示
        qhse_company_tree().then(res => {
          this.companyList = JSON.parse(JSON.stringify(res.data));
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    loadFilterParams() {
      this.filterQuery = { ...DefaultQuery, ...this.$route.query };
      this.filterQuery = {
        ...this.filterQuery
      };
      this.filterQuery.status = ''
      let year = new Date();
      this.filterQuery.year = String(year.getFullYear())
    },
    handleCellClick(row, cell, column) {//展开列表的子节点
      if (row.childNode.length > 0) {
        let els = column.getElementsByClassName("el-icon-arrow-right");
        if (els.length != 0) {
          els[0].click();
        }
      }
    },
    handleClick() {
      if(!this.filterQuery.year){//显示年份
        this.filterQuery.year = new Date()
      }
      let nowdata = new Date(this.filterQuery.year);
      this.filterQuery.year = String(nowdata.getFullYear());
      
      this.handleGetInitialData();//更改loading状态
      
      querryYearElement(this.filterQuery)//获取到叶子节点信息
        .then(res => {
          console.log(res.data);
          this.treeData = res.data;
          console.log(this.treeData);
          // this.companyName = res.data.name;
          // this.year = res.data.year;
          // this.status = res.data.status;
        })
        .catch(err => {
          console.log(err);
          this.message.error(err.message);
        });
      this.loading = false;
    },
    handleGetDate(date) {
      let nowdata = new Date(date);
      return String(nowdata.getFullYear());
    },
    handleGetInitialData() {
      this.loading = true;
    },
    updateScore(data){//显示出证据项的内容
    this.dialogVisible = true;  
     this.nodeData=element_evidence(data);
      console.log(data.code);//打印传递的id
      // this.node=data;
      // this.detailData = {}
      // this.detailData.name = data.name
      // this.detailData.code = data.code
      // this.detailData.content = data.content
      // this.detailData.basis = data.basis
      // this.detailData.auditMode = data.auditMode
      // this.detailData.initialScore = data.initialScore
      // this.detailData.formula = data.formula
      // this.detailData.problemDescription = data.problemDescription
      // this.detailData.evidenceDsecription = this.nodeData.evidenceDsecription
      // this.detailData.checkStaffName = this.nodeData.checkStaffName
      // this.detailData.approverStaffName = this.nodeData.approverStaffName
      // this.detailData.attacjDescription = this.nodeData.attacjDescription
      // this.detailData.uploadTime = this.nodeData.uploadTime
      // this.detailData.attach = this.nodeData.attach
      
      this.dialogVisible = true;            
    },handleAvatarSuccess(res) {
                if (res.code === 1000)
                    this.form.fileID = res.data;
                else {
                    this.$message.error('上传失败');
                    this.form.fileID = '';
                }
            }
  },
  mounted() {
     this.handleGetCompany();//第一个函数 获取到公司信息
    this.loadFilterParams();
    this.handleGetInitialData();//获取到表单信息
    this.loading = false;
  },
  
  computed: {
            accidentOrEventUploadAddress: function () {
                return '/api/evidence_upload'
            }
        }
};
</script>

<style lang="scss">
.input1{
  margin-top: 10px;
  opacity: 0;
  //   position: absolute;
}
.span1{
  margin-top: 10px;;
  width: 100px;
  border-radius: 5%;
  background: rgb(0, 153, 255);
  color: white;
}
</style>