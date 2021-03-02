<template>
  <div class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title">问题描述</div>
    <div class="page-content">

<!-- 查询输入框，按钮 -->
      <el-form
      :inline="true"
      :model="filterQuery" 
      @submit.native.prevent="handleSearch">
        <el-form-item label="问题描述：">
          <el-autocomplete 
          v-model="inputProblemDescription"
          clearable
          :fetch-suggestions="querySearch"
          placeholder="请输入问题描述"
          :trigger-on-focus="true">
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <router-link :to='{name: "ProblemDescriptionNew"}' >
            <el-button   icon='el-icon-plus' native-type='button'>新增</el-button>
          </router-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="export2Excel ()" style="width:100%">导出Excel</el-button>
        </el-form-item>
      </el-form>
<!-- 问题描述列表table -->
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        ref="refTable"
        style="width: 100%">
      <el-table-column
      type="index"
      width="50"
      header-align="center"
      label="序号"
      align="center"
      :index="this.indexStartNum">
    </el-table-column>
      <!-- <el-table-column
        label="问题描述编码"
        prop="problemDescriptionCode"
        width="120"
        header-align="center">
      </el-table-column> -->
      <el-table-column
        label="问题级别"
        prop="problemRank"
        width="100%"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        label="问题描述"
        prop="description"
        header-align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="问题建议整改措施"
        prop="recommendRectiMeasure"
        header-align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="问题验证描述"
        prop="verifyDescription"
        header-align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" header-align="center" width="200%">
        <template slot-scope="scope">
          <div class="inline-td">
            <router-link :to='{name: "ProblemDescriptionEdit", params: {id: scope.row.id}}' >
              <el-button size="mini" type="primary" icon="el-icon-edit">修改</el-button>
            </router-link>
            &nbsp;&nbsp;&nbsp;
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteProblemDescription(scope.row)">删除</el-button>
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
import {GetProblemDescriptionsList} from '../../../services/problemDescription'
import {DeleteProblemDescription,SelectProblemDescriptions} from '../../../services/problemDescription'

const DefaultQuery = {
  description:'',
  type : "page",
  pageIdx: 1,
  pageSize: 10,
}
const DefaultQueryExcel = {
  description:'',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
  data () {
    return {
      filterQuery: {},
      filterQueryExcel: {},
      excelData:[],
      total: 0,
      loading: false,
      tableData: [],
      problemDescriptionsAyy: [],
      inputProblemDescription:'',
      timeout: null,
      descriptionList: [],
      indexStartNum:1 
    }
  },

  mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetProblemDescriptions()
    this.getProblemDescription()
  },
    
  methods:{
    // 导出Excel
    export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetProblemDescriptionsList(this.filterQueryExcel).then((data) => {
        this.excelData = data.data
        this.loading = false
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['问题描述编码','问题级别','问题描述','问题建议整改措施','问题验证描述'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['problemDescriptionCode','problemRank','description','recommendRectiMeasure','verifyDescription'];
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
  //获取全部问题描述，显示在table
    handleGetProblemDescriptions () {
      this.loading = true
      GetProblemDescriptionsList(this.filterQuery).then((res) => {
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
  //查询问题描述
    handleSearch () {
      if(this.inputProblemDescription === ''){
        this.filterQuery.description = ''
        this.loadFilterParams() 
        this.handleGetProblemDescriptions ()
      }else{
        this.filterQuery.description = this.inputProblemDescription
        this.handleSelectProblemDescriptions()
      }
    },
  //获取问题描述下拉框
    getProblemDescription(){
        GetProblemDescriptionsList().then((res) => {  
        this.problemDescriptionsAyy = res.data.list
        // for(let i=0;i<this.total;i++){   此处使用this.total，下面的description会报错：Cannot read property 'description' of undefined
        for(let i=0;i<this.problemDescriptionsAyy.length;i++){
          this.descriptionList.push({"value": this.problemDescriptionsAyy[i].description}) 
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //查询
    handleSelectProblemDescriptions () {
      this.loading = true
      SelectProblemDescriptions(this.filterQuery).then((res) => {
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
    handleDeleteProblemDescription (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteProblemDescription(item.id).then(() => {
          this.handleGetProblemDescriptions()

        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
  //页码改变
    handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetProblemDescriptions()
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
      let results = queryString ? this.descriptionList.filter(this.createStateFilter(queryString)) : this.descriptionList;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (inputProblemDescription) => {
        return (inputProblemDescription.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
      };
    },
  
  }
}
</script>
<style media="screen">
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
