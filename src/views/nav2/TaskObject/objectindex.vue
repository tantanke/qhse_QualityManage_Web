<template>
    <div class="outDiv">
        <link media="screen and (max-device-width:1280px)">
        <link media="screen and (min-device-width:1280px)">   
        <div class="page-title">任务目标配置</div>
        <div class="page-content">
        <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-form-item label="任务目标名称：">
        <el-autocomplete 
        v-model="inputName"
        clearable
        :fetch-suggestions="querySearch"
        placeholder="请输入任务目标名称"
        :trigger-on-focus="true"
        ></el-autocomplete>
        </el-form-item>
        &nbsp;&nbsp;
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <router-link :to='{name:"objectnew"}' >
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
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            <font>{{scope.$index + 1}}</font>
          </template>
        </el-table-column>
        <!-- <el-table-column label="任务编码" prop="taskObjectCode" ></el-table-column> -->
        <el-table-column label="任务目标名称" prop="taskObjectName" ></el-table-column>
        <el-table-column label="任务状态" prop="status" > </el-table-column>
        <el-table-column label="操作" align="center" header-align="center"  >
          <template slot-scope="scope">
            <div class="inline-td">
              <router-link :to='{name: "objectedit", params: {id: scope.row.id}}'>
                <el-button icon="el-icon-edit-outline" >修改</el-button>
              </router-link>
              &nbsp;&nbsp;
               <el-button  type="danger" icon="el-icon-delete" @click="handleDeleteTaskObject(scope.row)">删除</el-button>
              &nbsp;&nbsp;
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
          style="float:right;"
        >
        </el-pagination>
      </div>
        </div>
    </div>
</template>
<script>
import {GetTasksObjectList,DeleteObjectTask} from '../../../services/taskobject'
const DefaultQuery = {
  status: '',
  pageIdx: 1,
  pageSize:10,
  taskObjectName: '',
  
}
const DefaultQueryExcel = {   //************
  taskObjectName: '',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
  data () {
    return {
      filterQuery: {},
      filterQueryExcel: {},
      total: 0,
      loading: false,
      dateRange: '',
      tableData: [],
      states: [],
      inputName:'',
      taskNameList: [],
      fitertask: {} ,   
      excelData:[]
    }
  },
  mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetListObjectData()
    this.gettaskName()
  },
  methods:{
    //导出excel
      export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetTasksObjectList(this.filterQueryExcel).then((data) => {
        console.log(JSON.stringify(data))
        this.excelData = data.data
        this.loading = false
        console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          //************
          const tHeader = ['编码','任务名称','任务状态'];
          // 上面设置Excel的表格第一行的标题
          //************
          const filterVal = ['taskObjectCode','taskObjectName','status'];
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


    handleSearch(){
       this.handleGetListObjectData()
       this.filterQuery.taskObjectName = this.inputName
       this.filterQuery.pageIdx = 1
    },
    handleGetListObjectData(){
      //整理筛选条件
      this.checkFilterParams()
      this.loading = true
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      this.$router.push({name: 'objectindex', query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      GetTasksObjectList(this.filterQuery).then((res) => {
      // alert(JSON.stringify(res))
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })   
    },
    //获取任务名称
    gettaskName(){
        GetTasksObjectList(this.fitertask).then((res) => {  
        this.taskAyy = res.data.list
        this.total = res.data.total
        for(var i=0;i<this.total;i++){
            this.taskNameList.push({"value": this.taskAyy[i].taskObjectName})
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)

      })
      },
      querySearch(queryString, cb) {
      let results = queryString ? this.taskNameList.filter(this.createStateFilter(queryString)) : this.taskNameList;
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
    handleDeleteTaskObject (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteObjectTask(item.id).then(() => {
          this.handleGetListObjectData()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
  handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetListObjectData()
    },
    //为了保存过滤条件,利用路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
    loadFilterParams () {
      //从query读取过滤条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {
        ...this.filterQuery1,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize,10),
      }
      //填充datepicker range组件的内容
      if (this.filterQuery.issueDate1 && this.filterQuery.issueDate2) {
        this.dateRange = [this.filterQuery.issueDate1, this.filterQuery.issueDate2]
      }
    },
    checkFilterParams () {
      //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
      if (this.dateRange && this.dateRange.length === 2) {
        this.filterQuery.issueDate1 = this.dateRange[0]
        this.filterQuery.issueDate2 = this.dateRange[1]
      } else {
        this.filterQuery.issueDate1 = ''
        this.filterQuery.issueDate2 = ''
      }
    }
    }
  }
</script>
<style>
</style>

