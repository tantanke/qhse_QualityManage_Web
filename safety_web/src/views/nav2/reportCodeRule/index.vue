<template>
  <div class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title">报告编号规则</div>
    <div class="page-content">
      <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-form-item label="基层单位：">
          <treeselect
          :multiple="false"
          :options="options"
          placeholder="请选择单位名称"
          v-model="filterQuery.companyCode"
          style="width:250px"/>
        </el-form-item>
        <el-form-item label="报告类别：" prop="reportType">
          <el-select style="width:250px" v-model="filterQuery.reportType" filterable placeholder="选择报告类别" clearable>
            <el-option v-for="item in reportTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        &nbsp;&nbsp;
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
         <el-form-item>
          <router-link :to='{name: "ReportCodeRuleIncrease"}' >
            <el-button type="primary"  icon='el-icon-plus' native-type='button'>新增</el-button>
          </router-link>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%" >
        <el-table-column
          type="index"
          :index="this.indexStartNum"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column label="基层单位" prop="companyName"  header-align="center"> </el-table-column>
        <el-table-column label="业务" prop="business"  header-align="center" width="150"> </el-table-column>
        <el-table-column label="业务类别" prop="businessType"  header-align="center"> </el-table-column>
        <el-table-column label="服务内容" prop="serviceContent"  header-align="center"> </el-table-column>
        <el-table-column label="业务编码" prop="businessCode"  header-align="center" width="100"> </el-table-column>
        <el-table-column label="报告类别" prop="reportType"  header-align="center" width="150"> </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" width="200">
          <template slot-scope="scope">
            <div class="inline-td">
              <router-link :to='{name: "ReportCodeRuleChange", params: {id: scope.row.reportCodeRuleID}}'>
                <el-button size="mini" type="primary" icon="el-icon-edit-outline">修改</el-button>
              </router-link>
              &nbsp;&nbsp;
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteReportCodeRule(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    <div class="pagination-base">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="filterQuery.pageIdx"
          :page-size="filterQuery.pageSize"
          :total="total"
          background
          layout="total, prev, pager, next, jumper"
        >
        </el-pagination>
    </div>
  </div>
  </div>
</template>

<script>
import {GetReportCodeRule,DeleteReportCodeRule,GetReportType} from '../../../services/reportCodeRule'
import {GetCompany} from '../../../services/gettreedata'

const DefaultQuery = {
  reportType:'',
  companyCode:null,
  type : "page",
  pageIdx: 1,
  pageSize: 10,
}
export default {
    data() {
      return {
        filterQuery: {},
        fitertask: {},
        total: 0,
        loading: false,
        tableData:[],
        taskAyy: '',
        inputName:'',
        timeout: null,
        indexStartNum:1,
        options: [],
        reportTypes:[],
      }
    },
    mounted () {
      this.loadFilterParams() //加载默认条件
      this.handleGetCompany()
      this.getreportTypes()
      this.handleGetListData() 
    },
    methods:{
      loadFilterParams () {
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      this.filterQuery = {
        ...this.filterQuery,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize, 10),
      }
    },
      handleGetCompany(){
        GetCompany().then((res) => {
          this.options = res.data;
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      getreportTypes() {
        GetReportType().then((res) => {
          res.data.forEach(element => {
            this.reportTypes.push({value:element,label:element})
          });
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      handleSearch () {
      this.filterQuery.pageIdx = 1
      this.handleSelectListData()
    },
      handleGetListData () {
      this.loading = true
      GetReportCodeRule(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
      handleSelectListData(){
      this.loading = true
      GetReportCodeRule(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })  
      },
      handleDeleteReportCodeRule (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteReportCodeRule(item.reportCodeRuleID).then(() => {
          this.handleGetListData()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
      handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetListData()
    }
   }
  }
</script>
<style>
 
</style>


