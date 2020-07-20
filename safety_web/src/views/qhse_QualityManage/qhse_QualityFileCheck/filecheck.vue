<template>
  <div>
    <div class="page-title" style="width:100%">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a @click="$router.go(-1)">QHSE文件审核</a></el-breadcrumb-item>
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
          &nbsp;&nbsp;&nbsp;
         <!--  <el-form-item>
            <el-button :disabled="disabled1" type="primary" @click="updateCompanyStatus">是否审核通过</el-button>
          </el-form-item> -->
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
          <el-table-column prop="totalCount" label="内容数" width="80" align="center"></el-table-column>
          <el-table-column  label="分数" width="80" align="center">
             <template slot-scope="scope">
              <span
                v-if="scope.row.childNode.length === 0 "
              >5</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="updateScore(scope.row)"
                v-if="scope.row.childNode.length === 0 "
              >开始审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-dialog title="文件审核" :visible.sync="dialogVisible" center width="1200px">
        <el-dialog
        :close-on-click-modal='false'
          width="30%"
          title="输入分数："
          :visible.sync="innerVisible"
          append-to-body>
          <el-form>
            <el-form-item label="输入分数：" style="margin-bottom:1px">
               <el-input v-model="score" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="putScore">确定</el-button>
            <el-button @click="innerVisible = false">取 消</el-button>
          </div>
        </el-dialog>
        <el-dialog
        :close-on-click-modal='false'
          width="30%"
          title="选择原因："
          :visible.sync="noinnerVisible"
          append-to-body>
          <el-form>
            <el-form-item label="选择原因：" style="margin-bottom:1px">
               <el-radio v-model="reason" label="违章">录入违章</el-radio>
               <el-radio v-model="reason" label="隐患">录入隐患</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="noScore">确定</el-button>
            <el-button @click="noinnerVisible = false">取 消</el-button>
          </div>
        </el-dialog>
        <el-form label-width="140px" :model="detailData" style="width:100%;" >
          <el-row>
            <el-col :span="12">
              <el-form-item label="打分项：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>  
              <el-form-item label="状态：" style="margin-bottom:1px">{{detailData.status}}</el-form-item>            
              <el-form-item label="审核方式：" style="margin-bottom:1px">{{detailData.auditMode}}</el-form-item>
              <el-form-item label="初始分数：" style="margin-bottom:1px">{{detailData.initialScore}}</el-form-item>
              <el-form-item label="计算公式：" style="margin-bottom:1px">{{detailData.formula}}</el-form-item>
              <el-form-item label="问题描述：" style="margin-bottom:1px">{{detailData.problemDescription}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证据图片：" style="margin-bottom:10px">
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
              <el-form-item style="text-align:right">
                <el-button type="primary" @click="innerVisible = true">通过</el-button>
                <el-button type="primary" @click="noinnerVisible = true">不通过</el-button>
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
import { UpdateComSysEleStatus } from "../../../services/qhse_QualityCheck";
import { querryQhseElement } from "../../../services/filecheck";
import { updateScore } from "../../../services/filecheck";
export default {
  data() {
    return {
      filterQuery: {
        year: "",
        companyCode: null,
        status:''
      },
      noinnerVisible: false,
      innerVisible: false,
      status:'',
      disabled1:false,
      dialogFormVisible: false,
      loading: true,
      dialogVisible: false,
      detailData: {},
      treeData: [],
      initData:[],
      score: '',
      reason:'',
      editdata: ''
    };
  },
  methods: {
    loadFilterParams() {
      this.$route.params.data && localStorage.setItem('data',JSON.stringify(this.$route.params.data));
      const initData = JSON.parse(localStorage.getItem('data'));
      console.log(initData)
      this.filterQuery.year = initData.year
      this.filterQuery.companyCode = initData.companyCode
      this.filterQuery.companyName = initData.companyName
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
      console.log(data)
      let _this = this
      _this.editdata = data
      _this.detailData.status = data.status 
      _this.detailData.auditMode = data.auditMode
      _this.detailData.initialScore = data.initialScore
      _this.detailData.formula = data.formula
      _this.detailData.name = data.name
      _this.detailData.problemDescription = data.problemDescription
      _this.dialogVisible = true            
    },
    deepForeach(){
      
    },
    handleGetInitialData() {
      this.loading = true;
      querryQhseElement().then(res => {
        this.treeData = res.data;
        this.loading = false;
        console.log(this.treeData)
      })
      .catch(err => {
          this.message.error(err.message);
        });   
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
    },
    getStatus() {
      this.status = this.$route.params.data.status
      console.log(this.status)
    },
    lookScore(data) {
      console.log(data)
      this.dialogVisible = true 
    },
    putScore() {
      let _this = this
      _this.innerVisible = false
      let data = {}
      data.code = _this.editdata.code
      data.codeScore = _this.score
      console.log(data)
      updateScore(data).then(res => {
        console.log(res)
      }).catch(err => {
        this.$message.error(err)
      })
      this.dialogVisible = false
    },
    noScore() {
      let rowdata = this.editdata
      let _this = this
      _this.noinnerVisible = false
      if (_this.reason === '隐患'){
           _this.$router.push({
            path: '/hidden_danger/input',
            params: {
            data: rowdata
            }
          })
      } else {
            _this.$router.push({
            path: '/hidden_danger/illegal_entry',
            params: {
            data: rowdata
            }
          })
      }
      _this.dialogVisible = false
    }
  },
  mounted() {
    console.log(this.$route.params.data)
    this.loadFilterParams();
    this.handleGetInitialData();
  }
};
</script>

<style lang="scss">

</style>