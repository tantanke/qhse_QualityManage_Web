<template>
  <div class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title">检查类型</div>
    <div class="page-content">
      <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-form-item label="检查类型名称：">
        <el-autocomplete 
        v-model="inputName"
        clearable
        :fetch-suggestions="querySearch"
        placeholder="请输入检查名称"
        :trigger-on-focus="true"
        ></el-autocomplete>
        </el-form-item>
        &nbsp;&nbsp;
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <router-link :to='{name: "CheckInsert"}' >
            <el-button type="primary" native-type='submit' icon='el-icon-plus'>新增</el-button>
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
    style="width: 100%">
       <el-table-column
      type="index"
      width="50"
      header-align="center"
      label="序号"
      :index="this.indexStartNum"
      align="center">
    </el-table-column>
    <el-table-column
      label="检查类型名称"
      prop="checkTypeName"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="状态"
      prop="status"
      header-align="center">
    </el-table-column>
    <el-table-column label="操作" align="center" header-align="center" width="200px"  fixed="right">
          <template slot-scope="scope">
            <div class="inline-td">
              <router-link :to='{name: "CheckModify", params: {id: scope.row.id}}' >
                <el-button size="mini"  icon="el-icon-edit-outline" >编辑</el-button>
              </router-link>
              &nbsp;&nbsp;
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeletecheckType(scope.row)" >删除</el-button>
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
import {GetCheckTypeList,DeleteCheckType} from '../../../services/checktype'

const DefaultQuery = {
  checkTypeName: '',
  pageIdx: 1,
  pageSize:10,
}
const DefaultQueryExcel = {   //************
  checkTypeName: '',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
    data() {
      return {
        filterQuery: {},
        filterQueryExcel: {},
        fitertask: {},
        total: 0,
        loading: false,
        tableData: [],
        taskAyy: '',
        inputName:'',
        timeout: null,
        checkTypeNameList: [],
        excelData:[],
        indexStartNum:1 
      }
    },
    mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetListData() 
    this.getcheckTypeName()
    },

    methods:{
      //导出EXCEL
      export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetCheckTypeList(this.filterQueryExcel).then((data) => {
        console.log(JSON.stringify(data))
        this.excelData = data.data
        this.loading = false
        console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          //************
          const tHeader = ['名称','状态'];
          // 上面设置Excel的表格第一行的标题
          //************
          const filterVal = ['checkTypeName','status'];
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

      //删除
      handleDeletecheckType (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteCheckType(item.id).then(() => {
          this.handleGetListData()
          this.checkTypeNameList=[]
          this.getcheckTypeName()
          this.$message.success('删除成功')
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },


      getcheckTypeName(){
        GetCheckTypeList(this.fitertask).then((res) => {  
        this.taskAyy = res.data.list
        this.total = res.data.total
        for(var i=0;i<this.total;i++){
            this.checkTypeNameList.push({"value": this.taskAyy[i].checkTypeName})
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
      })
      },
      querySearch(queryString, cb) {
        let results = queryString ? this.checkTypeNameList.filter(this.createStateFilter(queryString)) : this.checkTypeNameList;
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
      this.filterQuery.checkTypeName = this.inputName
      this.handleGetListData()
    },
      handleGetListData () {
        //筛选条件
        // this.check()
        this.loading = true

        GetCheckTypeList(this.filterQuery).then((res) => {
          // alert(JSON.stringify(res))
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
      handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetListData()
    },
    check(){
    },
    //跳转到编辑页面
    // insert(){

    // },
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
    }
   }
  }
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 130px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
