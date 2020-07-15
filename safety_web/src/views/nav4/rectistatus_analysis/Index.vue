<template>
  <div>
    <div class="page-title">监督业绩</div>
    <div class="page-content">
        <el-form
        :inline="true"
        :model="filterQuery">
        <el-form-item label="受检单位：">
          <treeselect
          filterable
          :multiple="false"
          :options="options"
          placeholder="选择单位"
          v-model="filterQuery.companyCode"
          style="width:250px"
          /> 
        </el-form-item> 
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-form-item label="发生时间：">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-form-item >
            <el-button @click="handleSearch()" type="primary" style="width:100px">分析</el-button>
            <!-- <el-button native-type='submit' type="primary" style="width:100px">分析</el-button> -->
        </el-form-item>
        </el-form>
    <!-- 按单位显示 -->
    <el-tabs type="border-card">
        <el-tab-pane label="按单位">
            <el-table
                :data="tableData1"
                v-loading="loading"
                border
                ref="refTable"
                >
                <!-- <el-table-column label="序号" width="100px" align="center">
                <template slot-scope="scope">
                    <font>{{scope.$index + 1}}</font>
                </template>
                </el-table-column> -->
                <el-table-column
                type="index"
                width="50"
                header-align="center"
                label="序号"
                :index="this.indexStartNum"
                align="center">
                </el-table-column>
                <el-table-column label="单位名称" prop="companyName"  header-align="center" align="center"> </el-table-column>
                <el-table-column label="检查数" prop="checkCount"  header-align="center" align="center"> </el-table-column>
                <el-table-column label="整改数" prop="rectiCount"  header-align="center" align="center"> </el-table-column>
                <el-table-column label="验证数" prop="verifyCount"  header-align="center" align="center"> </el-table-column>
            </el-table>
            <div class="pagination-base">
                <el-pagination
                    @current-change="handlePageChange1"
                    :current-page="filterQuery.pageIdx"
                    :page-size="filterQuery.pageSize"
                    :total="total2"
                    background
                    layout="total,prev, pager, next,jumper"
                    style="float:right;">
                </el-pagination>
            </div>
        </el-tab-pane>
        <!-- 按人分析 -->
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-tab-pane label="按人员">
            <el-table
                :data="tableData2"
                v-loading="loading"
                border
                ref="refTable"
                style="width:500px"
                >
                <el-table-column label="序号" width="100px" align="center">
                <template slot-scope="scope">
                    <font>{{scope.$index + 1}}</font>
                </template>
                </el-table-column>
                <el-table-column label="姓名" prop="responsePersonName" width="200px" header-align="center" align="center"> </el-table-column>
                <el-table-column label="检查数" prop="checkCount"  header-align="center" align="center"> </el-table-column>
            </el-table>
                <div class="pagination-base">
                <el-pagination
                    @current-change="handlePageChange"
                    :current-page="filterQuery.pageIdx"
                    :page-size="filterQuery.pageSize"
                    :total="total"
                    background
                    layout="total,prev, pager, next,jumper"
                    style="float:right;">
                </el-pagination>
                </div>
        </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>
<script>
import {GetCompanyList,GetEmployeeList} from '../../../services/jianduyeji'
import {GetCompany} from '../../../services/gettreedata'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const DefaultQuery = {
  companyCode: null,
  companyName: null,
  startDate: '',
  endDate: '',
  pageIdx: 1,
  pageSize:10,
}

export default {
    data(){
        return{
             filterQuery:{},
             dateRange: [],
             tableData1: [],
             tableData2: [],
             options:[],
             loading:false,
             total:0,
             total2:0,
             indexStartNum:1 
        }      
    },
    mounted () {
        this.loadFilterParams() //加载默认条件
        this.handleGetCompany()
        this.handleGetCompanyData ()
        this.handleGetPersonData ()

  },
  methods:{
    handlePageChange1 (page) {
      this.filterQuery.pageIdx = page
      this.handleGetCompanyData()
    },
     handlePageChange (page) {
      this.filterQuery.pageIdx= page
      this.handleGetPersonData ()
    },
    //初始获取公司名称、编码
    handleGetCompany(){
        GetCompany().then((res) => {
            this.options = res.data 
        }).catch((err) => {
            this.$message.error(err.message)
        })  
    },
    //加载条件
     loadFilterParams () {
      //从query读取过滤条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {
        ...this.filterQuery,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize, 10),
      }
      //填充datepicker range组件的内容
      if (this.filterQuery.startDate && this.filterQuery.endDate) {
            this.dateRange = [this.filterQuery.startDate, this.filterQuery.endDate]
        }
    },
    checkFilterParams () {
        //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
        if (this.dateRange && this.dateRange.length === 2) {
          this.filterQuery.startDate = this.dateRange[0]+' '+'00:00:00'
          this.filterQuery.endDate = this.dateRange[1]+' '+'23:59:59'
          } else {
            this.filterQuery.startDate = ''
            this.filterQuery.endDate = ''
        }
    },
    //获取单位数据
    handleGetCompanyData () {
      this.loading = true
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
    //   alert(JSON.stringify(this.filterQuery))
      GetCompanyList(this.filterQuery).then((res) => {
          console.log(JSON.stringify(res))
        // alert(JSON.stringify(res))
        this.tableData1 = res.data.list
        
        this.total2 = res.data.total
        // alert(this.total2 )
         this.filterQuery.pageIdx = res.data.page
         this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
//获取人数据
   handleGetPersonData (){
       this.checkFilterParams()
       this.loading = true
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
    //   this.$router.push({query: this.filterQuery})
       this.$router.push({name: 'Rectistatusanalysis', query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      GetEmployeeList(this.filterQuery).then((res) => {
           console.log(JSON.stringify(res))
        // alert(JSON.stringify(res))
        this.tableData2 = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })

   },
   //分析获取数据
    handleSearch(){
        this.filterQuery.pageIdx = 1
        // alert(JSON.stringify(this.filterQuery))
        // this.$router.push({query: this.filterQuery})
        this.handleGetPersonData()
        this.handleGetCompanyData()
       
    },
    },
}

</script>



