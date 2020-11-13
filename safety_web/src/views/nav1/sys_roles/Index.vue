<template>
  <div>
    <div class="page-title">角色管理</div>
    <div class="page-content">

<!-- 查询输入框，按钮 -->
      <el-form
      :inline="true"
      :model="filterQuery" 
      @submit.native.prevent="handleSearch">
        <el-form-item label="角色名称">
          <el-autocomplete 
          v-model="inputRoleName"
          clearable
          :fetch-suggestions="querySearch"
          placeholder="请输入角色名称"
          :trigger-on-focus="true">
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <router-link :to='{name: "SysRolesNew"}' >
            <el-button  icon='el-icon-plus' native-type='button' type="primary">新增</el-button>
          </router-link>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="export2Excel()" icon="el-icon-download">导出Excel</el-button>
        </el-form-item>
      </el-form>
<!-- 问题描述列表table -->
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        max-height="560px"
        ref="refTable"
        style="width: 100%">
        <el-table-column label="序号" width="100px" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <font>{{scope.$index + 1}}</font>
          </template>
        </el-table-column>
        <!-- <el-table-column label="角色编码" prop="roleCode" width="200%" header-align="center"> </el-table-column> -->
        <el-table-column label="角色名称" prop="name" width="250px" header-align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="角色描述" prop="description" min-width="100%" header-align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" width="250px" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="inline-td">
            <router-link :to='{name: "SysRolesEdit", params: {id: scope.row.roleID}}' >
              <el-button size="mini" type="primary" icon="el-icon-edit">修改</el-button>
            </router-link>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteRole(scope.row)">删除</el-button>
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
          layout="total, prev, pager, next, jumper">
        </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
import {GetRoleList,SelectRoleName,DeleteRole} from '../../../services/sys_roles'

const DefaultQuery = {
  roleName:'',
  pageIdx: 1,
  pageSize: 10
}
const DefaultQueryExcel = {
  roleName:'',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
  data () {
    return {
      filterQuery: {},
      filterQueryExcel: {},
      fiterRoleName: {},
      total: 0,
      loading: false,
      tableData: [],
      roleNameAyy: [],
      inputRoleName:'',
      timeout: null,
      roleNameList: [],
      excelData:[]
    }
  },

  mounted () {
   this.loadFilterParams() //加载默认条件
   this.handleGetRoleList()
   this.getRoleName()
  },
    
  methods:{
    // 导出Excel
    export2Excel() {
       //从query读取过滤条件
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
        pageIdx: parseInt(this.filterQueryExcel.pageIdx, 10),
        pageSize: parseInt(this.filterQueryExcel.pageSize, 10),
      }
      this.filterQueryExcel.roleName = this.filterQuery.roleName
      GetRoleList(this.filterQueryExcel).then((res) => {
        this.excelData = res.data.list
        this.loading = false
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['角色编码','角色名称','角色描述'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['roleCode','name','description'];
          // 上面的index、phone_Num、school_Name是tableData里对象的属性
          const list = this.excelData;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '角色管理');
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  //获取全部问题，显示在table
    handleGetRoleList () {
      this.loading = true
      GetRoleList(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
  //查询问题描述
    handleSearch () {
      this.filterQuery.roleName = this.inputRoleName
      this.handleSelectRole()
    },
  //获取问题描述下拉框
    getRoleName(){
        GetRoleList(this.fiterRoleName).then((res) => {  
        this.roleNameAyy = res.data.list
        // this.total = res.data.total
        // for(let i=0;i<this.total;i++){   此处使用this.total，下面的description会报错：Cannot read property 'description' of undefined
        for(let i=0;i<this.roleNameAyy.length;i++){
          this.roleNameList.push({"value": this.roleNameAyy[i].name}) 
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)

      })
    },
    //查询
    handleSelectRole () {
      this.loading = true
      SelectRoleName(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    //删除问题描述
    handleDeleteRole (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteRole(item.roleID).then(() => {
          this.handleGetRoleList()
          this.roleNameList = []
          this.getRoleName()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
  //页码改变
    handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetRoleList()
    },
  
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

    querySearch(queryString, cb) {
      let results = queryString ? this.roleNameList.filter(this.createStateFilter(queryString)) : this.roleNameList;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (inputRoleName) => {
        return (inputRoleName.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
      };
    },
  
  }
}
</script>
<style  media="screen">
  /*分辨率低于1280，采用下面的样式*/
    @media screen and (max-device-width:1280px){
        .outDiv{
          width: 1060px;
        }
    }
    /*分辨率高于1280，采用下面的样式*/
    @media screen and (min-device-width: 1280px){
        .outDiv{
          width: 100%;
        }
    }
</style>
