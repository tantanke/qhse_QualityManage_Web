<template>
    <div>
        <div class="page-title">工作量统计</div>
        <div class="page-content" style="width:100%">
          <el-form :inline="true" :model="filterQuery">
            <el-form-item label="公司单位：">
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择公司单位"
              v-model="filterQuery.companyCode"
              style="width:250px"/>
            </el-form-item>
            <el-form-item label="报告完成时间：">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:250px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="员工类别："  prop="category">
              <el-select v-model="filterQuery.personCategory" placeholder="请选择员工类别" style="width:250px">
                <el-option
                  v-for="item in categorys"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            &nbsp;&nbsp;&nbsp;
            <el-form-item>
              <el-button type="primary" @click="handleSearch" icon='el-icon-search'>查询</el-button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <router-link :to='{name: "WorkloadPDF", params: {id: "pdf",data:this.pdfData}}'>
                <el-button icon="el-icon-document">生成工作量确认单</el-button>
              </router-link>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" border v-loading="loading">
             <el-table-column
                  type="index"
                  label="序号"
                  width="100"
                  align="center">
            </el-table-column>
            <el-table-column
                label="人员名字"
                prop="personName"
                width="150"
                align="center">
              </el-table-column>
             <el-table-column
                label="报告类别"
                prop="reportType"
                width="200"
                align="center">
              </el-table-column>
              <el-table-column
                label="单价（元）"
                prop="unitPrice"
                width="150"
                align="center">
              </el-table-column>
              <el-table-column
                label="作用"
                prop="role"
                width="150"
                align="center">
              </el-table-column>
              <el-table-column
              label="报告数量"
              prop="typeCount"
              width="150"
              align="center">
              </el-table-column>
              <el-table-column
              label="报告延迟份数"
              prop="reportDelayReportNums"
              width="150"
              align="center">
              </el-table-column>
              <el-table-column
              label="报告延迟天数"
              prop="reportDelayDays"
              width="150"
              align="center">
              </el-table-column>
              <el-table-column
                label="奖励金额（元）"
                prop="rewardAmount"
                width="150"
                align="center">
              </el-table-column>
              <el-table-column
                label="备注"
                prop="remarks"
                align="center">
              </el-table-column>
            </el-table>
          <div class="pagination-base">
            <el-pagination
              @current-change="handlePageChange"
              :current-page="filterQuery.pageIdx"
              :page-size="filterQuery.pageSize"
              :total="total"
              background
              layout="total,prev, pager, next,jumper">
            </el-pagination>
          </div>
        </div>
    </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import {GetWorkloadAnalysis} from '../../../services/workload_statistics'
const DefaultQuery = {
  companyCode: null, 
  startDate:'',
  endDate:'',
  pageIdx: 1,
  pageSize: 10,
  personCategory:'ERP'
}
export default {
  components: { Treeselect },
    data() {
      return {
        dateRange:"",
        loading: false,
        total: 0,
        problemID:'',
        options: [],
        filterQuery: {},
        tableData:[],
        pdfData:[],
        categorys:[{value: 'ERP',label: 'ERP'},{value: '非ERP',label: '非ERP'}]
      }
    },
    mounted () {
      this.loadFilterParams()
      this.handleGetCompany()
      this.handleSearch()
    },
    methods: {
      handleGetCompany(){
        this.loading = true
        GetCompany().then((res) => {
          this.options = res.data
          if(this.filterQuery.companyCode ===null){
            this.filterQuery.companyCode = res.data[0].nodeCode
          }
          
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      },
      loadFilterParams () {
        this.filterQuery = {...DefaultQuery, ...this.$route.query}
        this.filterQuery = {
          ...this.filterQuery,
          pageIdx: parseInt(this.filterQuery.pageIdx, 10),
          pageSize: parseInt(this.filterQuery.pageSize, 10),
        }
      },
      checkFilterParams () {
        if (this.dateRange && this.dateRange.length === 2) {
          this.filterQuery.startDate = this.dateRange[0]+" "+'00:00:00'
          this.filterQuery.endDate = this.dateRange[1]+" "+'23:59:59'
          } else {
            this.handleGetDate()
          }
      },
      handleSearch() {
        this.checkFilterParams()
        let startDate = new Date(this.filterQuery.startDate)
        let endDate = new Date(this.filterQuery.endDate)
        if (startDate.getFullYear() === endDate.getFullYear()){
          this.filterQuery.pageIdx = 1
          this.handleGetWorkloadData()
        }else{
          this.$notify.warning({
            title: '温馨提示',
            message: '报告完成时间不能跨年查询！',
            type: 'warning'
          })
        }
      },
      handleGetWorkloadData () {
        this.loading = true
        this.$router.push({query: this.filterQuery})
        GetWorkloadAnalysis(this.filterQuery).then((res) => {
          if(res.data.total === 0){
              this.$notify.warning({
              title: '温馨提示',
              message: '该查询条件下无数据，请重新查询！',
              type: 'warning'
            })
          }
          this.tableData = res.data.list
          this.total = res.data.total
          this.filterQuery.pageIdx = res.data.page
          this.pdfData = JSON.parse(JSON.stringify(this.tableData))
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      },
      handleGetDate(){
        let nowdata = new Date()
        let sep = '-'
        let year = nowdata.getFullYear()
        let month = nowdata.getMonth() + 1
        let day = nowdata.getDate()
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
          day = "0" + day;
        }
        this.filterQuery.startDate = year +'-01-01'+" "+'00:00:00'
        this.filterQuery.endDate = year + sep + month + sep + day +" " +'23:59:59'
        this.dateRange = [year +'-01-01', year + sep + month + sep + day]
      },
      handlePageChange (page) {
        this.filterQuery.pageIdx = page
        this.handleGetWorkloadData()
      },
    }
}
</script>
<style>

</style>
