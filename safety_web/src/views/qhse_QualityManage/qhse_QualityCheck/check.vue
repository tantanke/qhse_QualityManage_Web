<template>
  <div>
    <div class="page-title" style="width:100%">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a @click="$router.go(-1)">QHSE量化审核</a></el-breadcrumb-item>
            <el-breadcrumb-item>详情查看</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="page-content">
      <el-row>
        <el-form label-width="100px"  :inline="true" :model="filterQuery">
          <el-form-item label="公司：">
            <el-input v-model="filterQuery.companyName" readonly></el-input>
          </el-form-item>
          <el-form-item label="年份：">
            <el-input v-model="filterQuery.year" readonly></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-input v-model="filterQuery.status" readonly></el-input>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button :disabled="disabled1" type="primary" @click="updateCompanyStatus">是否审核通过</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="$router.go(-1)">返回前一页</el-button>
          </el-form-item>
          <!--模态框，弹出审核内容-->
          <el-dialog title="是否确认审核通过？" :visible.sync="dialogFormVisible">
            <div slot="footer">
              <el-button type="primary" @click="updateStatus">确认</el-button>
              <el-button type="danger" @click="dialogFormVisible = false">返回</el-button>
            </div>
          </el-dialog>
          <!--</el-col>-->
        </el-form>
      </el-row>
      <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        <el-table
          :data="treeData"
          style="width: 100%"
          ref="treeTable"
          show-summary
          row-key="id"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column prop="completedCount" label="完成数" width="80" align="center"></el-table-column>
          <el-table-column prop="totalCount" label="未完成数" width="80" align="center"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="scope.row.code.length === 10"
              >内容详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-dialog title="详细内容" :visible.sync="dialogVisible" center width="1200px">
        <el-form label-width="140px" :model="detailData" style="width:100%;" >
          <el-row>
            <el-col :span="12">
              <el-form-item label="主题：" style="margin-bottom:1px">{{detailData.theme}}</el-form-item>
              <el-form-item label="项目：" style="margin-bottom:1px">{{detailData.project}}</el-form-item>
              <el-form-item label="内容：" style="margin-bottom:1px">{{detailData.content}}</el-form-item>
              <el-form-item label="管理及运行要求：" style="margin-bottom:1px">{{detailData.requirements}}</el-form-item>
              <el-form-item label="依据或备注：" style="margin-bottom:1px">{{detailData.basis}}</el-form-item>
              <el-form-item label="应形成的记录：" style="margin-bottom:1px">{{detailData.recordFile}}</el-form-item>
              <el-form-item label="记录管理：" style="margin-bottom:1px">{{detailData.recordManagement}}</el-form-item>
              <el-form-item label="量化项：" style="margin-bottom:1px">{{detailData.qTerm}}</el-form-item>
              <el-form-item label="审核方式：" style="margin-bottom:1px">{{detailData.auditMode}}</el-form-item>
              <el-form-item label="初始分数：" style="margin-bottom:1px">{{detailData.initialScore}}</el-form-item>
              <el-form-item label="计算公式：" style="margin-bottom:1px">{{detailData.formula}}</el-form-item>
              <el-form-item label="可能存在的问题：" style="margin-bottom:1px">{{detailData.problemDescription}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际问题：" style="margin-bottom:1px">{{detailData.existProblems}}</el-form-item>
              <el-form-item label="实际得分：" style="margin-bottom:1px">{{detailData.actualScore}}</el-form-item>
              <el-form-item label="违章级别：" style="margin-bottom:1px">{{detailData.rank}}</el-form-item>
              <el-form-item label="问题图片：" style="margin-bottom:10px">
                <el-card :body-style="{ padding: '10px' }" style="width:100%;height:200px;text-align:center" >
                  <span v-if="!detailData.pictureFile">无图片文件记录！</span>
                  <el-popover placement="right" title trigger="click" v-else>
                    <div style="max-width:600px;height:auto">
                      <img :src="detailData.pictureFile" style="max-width:600px;height:auto" />
                    </div>
                    <img slot="reference" :src="detailData.pictureFile" :alt="detailData.pictureFile" style="max-height: 180px" />
                  </el-popover>
                </el-card>
              </el-form-item>
              <el-form-item label="视频记录：">
                <el-card :body-style="{ padding: '10px' }" style="width:100%;height:200px;text-align:center" >
                  <span v-if="!detailData.videoFile">无视频文件记录！</span>
                  <video v-else width="100%" height="180" controls preload="none" :src="detailData.videoFile" ></video>
                </el-card>
              </el-form-item>
              <el-form-item style="text-align:right">
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
import { QuerryQHSEReportElements } from "../../../services/qhse_QualityFill";
import { UpdateComSysEleStatus } from "../../../services/qhse_QualityCheck";

export default {
  data() {
    return {
      filterQuery: {
        year: "",
        companyCode: null,
        status:''
      },
      disabled1:false,
      dialogFormVisible: false,
      loading: true,
      dialogVisible: false,
      detailData: {},
      treeData: [],
      initData:[]
    };
  },
  methods: {
    loadFilterParams() {
      this.$route.params.data && localStorage.setItem('data',JSON.stringify(this.$route.params.data));
      const initData = JSON.parse(localStorage.getItem('data'));
      this.filterQuery.year = initData.year
      this.filterQuery.companyCode = initData.companyCode
      this.filterQuery.companyName = initData.companyName
      this.filterQuery.status = initData.status
      if(this.filterQuery.status==='通过'){
        this.disabled1 = true
      }
    },
    handleCellClick(row, cell, column) {
      if (row.code.length < 10) {
        let els = column.getElementsByClassName("el-icon-arrow-right");
        if (els.length != 0) {
          els[0].click();
        }
      }
    },
    updateScore(data){
      this.detailData = {}
      let code5 = data.code
      this.deepForeach(this.treeData,code5)
      this.detailData.qTerm = data.name
      this.detailData.auditMode = data.auditMode
      this.detailData.initialScore = data.initialScore
      this.detailData.formula = data.formula
      this.detailData.problemDescription = data.problemDescription
      this.detailData.existProblems = data.existProblems
      this.detailData.rank = data.rank
      this.detailData.actualScore = data.actualScore
      this.detailData.pictureFile = data.pictureFile
      this.detailData.videoFile = data.videoFile
      this.dialogVisible = true            
    },
    deepForeach(tree,code5){
      tree.forEach(data =>{
        let code = code5.substring(0,data.code.length)
        if(data.code.length===2 & data.code===code){
            this.detailData.theme = data.name
            this.deepForeach(data.childNode,code5)
        }else if(data.code.length===4 && data.code===code){
          this.detailData.project = data.name
          this.detailData.content = data.content
          this.deepForeach(data.childNode,code5)
        }else if(data.code.length===6 && data.code===code){
          this.detailData.requirements = data.name
          this.detailData.basis = data.basis
          this.detailData.recordFile = data.recordFile
          this.detailData.recordManagement = data.recordManagement
          this.deepForeach(data.childNode,code5)
        }else if(data.code.length===8 && data.code===code){
          this.detailData.qExplanation = data.name
        }
      })
    },
    handleGetInitialData() {
      this.loading = true;
      QuerryQHSEReportElements(this.filterQuery)
        .then(res => {
          this.treeData = res.data.list;
          this.companyName = res.data.companyName;
          this.year = res.data.year;
          this.status = res.data.status;
        })
        .catch(err => {
          this.message.error(err.message);
        });
      this.loading = false;
    },
    updateCompanyStatus(){
        this.dialogFormVisible = true
    },
    updateStatus() {
        let that=this;
        let info = {
            year:this.filterQuery.year,
            companyCode:this.filterQuery.companyCode,
            status:"通过"
        }
        UpdateComSysEleStatus(info).then(()=>{
            that.dialogFormVisible = false;
            that.$message.success("审核成功");
            this.filterQuery.status = info.status
            this.$route.params.data.status = info.status
            this.loadFilterParams()
            this.handleGetInitialData()
            this.disabled1 = true
        }).catch(() => {
            that.$message.error("审核失败");
            that.dialogFormVisible = false;
        })
    }
  },
  mounted() {
    this.loadFilterParams();
    this.handleGetInitialData();
  }
};
</script>

<style lang="scss">

</style>