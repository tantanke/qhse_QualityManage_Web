<template>
  <div class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title">问题原因配置</div>
    <div class="page-content">
      <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-form-item label="原因名称：">
        <el-autocomplete 
        v-model="inputName"
        clearable
        :fetch-suggestions="querySearch"
        placeholder="请输入原因名称"
        :trigger-on-focus="true"
        ></el-autocomplete>
        </el-form-item>
        &nbsp;&nbsp;
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
         <el-form-item>
          <router-link :to='{name: "ProblemsourceNew"}' >
            <el-button   icon='el-icon-plus' native-type='button'>新增</el-button>
          </router-link>
        </el-form-item>
        <el-form-item>
           <el-button  style="background-color:#3399CC;color:#FFFFFF" @click="export2Excel ()">导出Excel</el-button>
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
          width="50">
        </el-table-column>
        <el-table-column label="原因名称" prop="problemSourceName"  header-align="center"> </el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template slot-scope="scope">
            <div class="inline-td">
              <router-link :to='{name: "ProblemsourceEdit", params: {id: scope.row.problemSourceID}}'>
                <el-button size="mini" type="primary" icon="el-icon-edit-outline">修改</el-button>
              </router-link>
              &nbsp;&nbsp;
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteProblemSource(scope.row)">删除</el-button>
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
import {GetProblemSourceList,DeleteProblemSource,SelectProblemSourceListDetail} from '../../../services/problemSource'

const DefaultQuery = {
  problemSourceName :'',
  type : "page",
  pageIdx: 1,
  pageSize: 10,
}
const DefaultQueryExcel = {
  problemSourceName :'',
  pageIdx: 1,
  pageSize: 10,
  type : 'all'
}
export default {
    data() {
      return {
        filterQuery: {},
        fitertask: {},
        total: 0,
        loading: false,
        tableData: [],
        taskAyy: '',
        inputName:'',
        timeout: null,
        problemSourceNameList: [],
        indexStartNum:1
      }
    },
    mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetListData() 
    this.getproblemSourceName()
    
    },
    methods:{
      getproblemSourceName(){
        GetProblemSourceList(this.fitertask).then((res) => {
        // alert(JSON.stringify(res))  
        this.taskAyy = res.data.list
        this.total = res.data.total
        for(var i=0;i<this.total;i++){
            this.problemSourceNameList.push({"value": this.taskAyy[i].problemSourceName})
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
      })
      },
      querySearch(queryString, cb) {
        let results = queryString ? this.problemSourceNameList.filter(this.createStateFilter(queryString)) : this.problemSourceNameList;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      },
      createStateFilter(queryString) {
        return (inputName) => {
          return (inputName.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
        };
      },
      handleSearch () {
      this.filterQuery.pageIdx = 1
      this.filterQuery.problemSourceName = this.inputName
      this.handleSelectListData()
    },
      handleGetListData () {
        //筛选条件
        // this.check()
      this.loading = true
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      // this.$router.push({name: 'Problemlist',query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      // console.log(JSON.stringify(this.filterQuery))
      GetProblemSourceList(this.filterQuery).then((res) => {
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
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      // this.$router.push({name: 'Problemlist',query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      // console.log(JSON.stringify(this.filterQuery))
      SelectProblemSourceListDetail(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })  
      },
       handleDeleteProblemSource (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteProblemSource(item.problemSourceID).then(() => {
          this.handleGetListData()
          this.problemSourceNameList=[]
          this.getproblemSourceName()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
      handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetListData()
    },
    //为了保存过滤条件,利用路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      loadFilterParams () {
      //从query读取过滤条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {
        ...this.filterQuery,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize, 10),
      }
    },
    export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetProblemSourceList(this.filterQueryExcel).then((data) => {
        console.log(JSON.stringify(data))
        this.excelData = data.data
        this.loading = false
        console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['原因编码','原因名称'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['problemSourceCode','problemSourceName'];
          // 上面的index、phone_Num、school_Name是tableData里对象的属性
          const list = this.excelData;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '列表excel');
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
   }
  }
</script>
<style>
 
</style>


