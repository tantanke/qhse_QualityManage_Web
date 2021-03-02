<template>
    <div>
        <div class="page-title">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a @click="backTo">报告进度</a></el-breadcrumb-item>
            <el-breadcrumb-item>未完成报告清单</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
      <div class="page-content">
        <el-row>
          <el-form label-width="100px"  :inline="true" :model="selectData">
            <el-form-item label="公司名称：">
              <el-input v-model="selectData.companyName" placeholder="未选择公司" readonly></el-input>
            </el-form-item>
            <el-form-item label="报告类别：">
              <el-input v-model="selectData.reportTypeName" placeholder="未选择报告类别" readonly></el-input>
            </el-form-item>
            <el-form-item label="开始时间：">
              <el-input v-model="selectData.beginTime" placeholder="未选择开始时间" readonly></el-input>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-input v-model="selectData.endTime" placeholder="未选择结束时间" readonly></el-input>
            </el-form-item>
            &nbsp;&nbsp;&nbsp;
            <el-form-item>
              <el-button align="right" type="danger" @click="backTo">返回</el-button>
            </el-form-item>    
          </el-form>
        </el-row>
        <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
          <el-table :data="tableData" style="width: 100%" border v-loading="loading">
             <el-table-column
                  type="index"
                  label="序号"
                  width="100"
                  align="center">
            </el-table-column>
            <el-table-column
                label="基层单位"
                prop="companyName"
                width="260"
                align="center">
              </el-table-column>
             <el-table-column
                label="报告编号"
                prop="reportCode"
                align="center">
              </el-table-column>
              <el-table-column
                label="报告类别"
                prop="reportType"
                width="200"
                align="center">
              </el-table-column>
              <el-table-column
                label="报告计划时间"
                prop="reportPlanDate"
                width="260"
                align="center">
              </el-table-column>
              <el-table-column
                label="检验负责人"
                prop="reportCheckPersonName"
                width="200"
                align="center">
              </el-table-column>
          </el-table>
        </el-row>
          <div class="pagination-base">
            <el-pagination
              @current-change="handlePageChange"
              :current-page="filterQuery.pageIdx"
              :page-size="filterQuery.pageSize"
              :total="total"
              background
              layout="total,prev, pager, next,jumper"
            ></el-pagination>
          </div>
        </div>
    </div>
</template>

<script>
import {GetReportList} from '../../../services/report_list'

const DefaultQuery = {
    companyCode: null,
    reportType: "",
    beginTime: "",
    endTime: "",
    pageIdx:1,
    pageSize:10,
    state: 2
}

export default {
    data () {
      return {
        loading: false,
        total: null,
        tableData:[],
        companyCode:'',
        filterQuery: {},
        selectData:{}
      }
    },
    mounted () {
      this.loadFilterParams()
      this.progressToList()
      this.handleGetListData()
    },
    methods: {
      loadFilterParams () {
          this.filterQuery = {...DefaultQuery, ...this.$route.query}
          this.filterQuery = {
            ...this.filterQuery,
            pageIdx: parseInt(this.filterQuery.pageIdx, 10),
            pageSize: parseInt(this.filterQuery.pageSize, 10),
          }
      },
      progressToList(){
        this.$route.params.data && localStorage.setItem('data',JSON.stringify(this.$route.params.data));
        const data1 = JSON.parse(localStorage.getItem('data'))
        this.selectData.companyName = data1.companyName

        this.$route.params.selectData && localStorage.setItem('selectData',JSON.stringify(this.$route.params.selectData));
        const selectData = JSON.parse(localStorage.getItem('selectData'))
        this.selectData.beginTime = selectData.beginTime.substring(0,10)
        this.selectData.endTime = selectData.endTime.substring(0,10)
        this.selectData.reportTypeName = selectData.reportTypeName

        this.filterQuery.companyCode = data1.companyCode
        this.filterQuery.beginTime = selectData.beginTime
        this.filterQuery.endTime = selectData.endTime
        this.filterQuery.reportType = selectData.reportType
      },
      handlePageChange (page) {
        this.filterQuery.pageIdx = page
        this.handleGetListData()
      },
      handleGetListData () {
        this.loading = true
        this.$router.push({query: this.filterQuery})
        GetReportList(this.filterQuery).then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      },
      backTo(){
        for(let i=0;i<2;i++){
          this.$router.go(-1)
        }
      }
    }
}
</script>
<style scoped>
</style>
