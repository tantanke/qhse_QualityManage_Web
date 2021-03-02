<template>
    <div>
        <div class="page-title">学习案例</div>
        <div class="page-content">
        <el-form
        :inline="true"
        v-model="filterQuery"
        @submit.native.prevent="handleSearch">
          <el-form-item label="问题描述：">
            <el-autocomplete 
              v-model="inputProblemDescription"
              clearable
              :fetch-suggestions="querySearch"
              placeholder="请输入问题描述字段"
              :trigger-on-focus="true"
              style="width:250px">
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="选择时间：">
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
          <el-form-item>
            <el-button type="primary" native-type='submit' icon='el-icon-search' >查询</el-button>
          </el-form-item>
          <el-form-item>
            <router-link :to='{name: "StudyCaseNew"}' >
              <el-button   icon='el-icon-plus' native-type='button' >新增</el-button>
            </router-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="export2Excel ()" >导出Excel</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="tableData" v-loading="loading" @row-click="clickTable" ref="refTable" border style="width: 100%" >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="任务"><span>{{ props.row.task }}</span></el-form-item>
                <el-form-item label="工序"><span>{{ props.row.process }}</span></el-form-item>
                <el-form-item label="问题原因"><span>{{ props.row.source }}</span></el-form-item>
                <el-form-item label="解决描述"><span>{{ props.row.rectiMeasure }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            <font>{{scope.$index + 1}}</font>
          </template>
        </el-table-column>
        <el-table-column label="案例名称" prop="caseName" header-align="center"></el-table-column>
        <el-table-column label="地点" prop="address" header-align="center"> </el-table-column>
        <el-table-column label="发生时间" prop="checkDate" header-align="center"> </el-table-column>
        <el-table-column label="问题描述" prop="description" header-align="center" > </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" width="350%">
          <template slot-scope="scope">
            <div class="inline-td">
              <el-button size="mini" type="primary" icon='el-icon-search' @click="handleGetWord(scope.row)">预览</el-button>
              <el-button size="mini" type="primary" icon='el-icon-download' @click="handleDownloadWord(scope.row)">下载</el-button>
              &nbsp;&nbsp;
              <router-link :to='{name: "StudyCaseEdit", params: {id: scope.row.id}}'>
                <el-button size="mini" type="primary" icon="el-icon-edit-outline">修改</el-button>
              </router-link>
              &nbsp;&nbsp;
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteStudyCase(scope.row)">删除</el-button>
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
          style="float:right;">
        </el-pagination>
      </div>
        </div>
    </div>
</template>

<script>
import {GetStudyCasesList} from '../../../services/studyCase' //任务工序表
import {DeleteStudyCase} from '../../../services/studyCase' //任务工序表

const DefaultQuery = {
  description:'',
  startDate:'',
  endDate:'',
  pageIdx: 1,
  pageSize: 10
}
const DefaultQueryExcel = {
  description:'',
  startDate:'',
  endDate:'',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
  data() {
    return {
      tableData: [],
      total:null,
      inputProblemDescription:'',
      loading: false,
      dateRange:'', //时间查询，v-model绑定
      filterQuery: [],
      filterQueryExcel: [],
      excelData:[],
      fiterStudyCasesList:[],
      studyCasesAyy:[],
      studyCasesListAyy:[],
    };
  },

  mounted(){
    this.loadFilterParams()
    this.handleGetStudyCasesList()
    this.getStudyCases()
  },
  
  methods:{
    // 导出Excel
    export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      //以下 **** 3句话 ****，导出根据查询条件获取到的table列表，初始默认都为空。
      this.filterQueryExcel.description = this.filterQuery.description
      this.filterQueryExcel.startDate = this.filterQuery.startDate
      this.filterQueryExcel.endDate = this.filterQuery.endDate
      this.excelData=GetStudyCasesList(this.filterQueryExcel).then((res) => {
        // console.log(JSON.stringify(res))
        this.excelData = res.data
        this.loading = false
        // console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['案例名称','地点','发生时间','任务','工序','问题描述','问题原因','解决描述'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['caseName','address','checkDate','task','process','description','source','rectiMeasure'];
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
    //获取全部案例
    handleGetStudyCasesList () {
      this.checkFilterParams()
      this.loading = true
      // this.$router.push({name: 'StudyCaseIndex', query: this.filterQuery})
      GetStudyCasesList(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    checkFilterParams () {
      //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
      if (this.dateRange && this.dateRange.length === 2) {
        this.filterQuery.startDate = this.dateRange[0]
        this.filterQuery.endDate = this.dateRange[1]
      } else {
        this.filterQuery.startDate = ''
        this.filterQuery.endDate = ''
      }
    },
    
    //页码改变
    handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetStudyCasesList()
    },
    loadFilterParams () {
      //从query读取过滤条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {
        ...this.filterQuery,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize,10),
      }
      //填充datepicker range组件的内容
      if (this.filterQuery.startDate && this.filterQuery.endDate) {
        this.dateRange = [this.filterQuery.startDate, this.filterQuery.endDate]
      }
    },

    //获取学习案例下拉框
    getStudyCases(){
        GetStudyCasesList(this.fiterStudyCasesList).then((res) => {  
        this.studyCasesAyy = res.data.list
        // this.total = res.data.total
        // for(let i=0;i<this.total;i++){   此处使用this.total，下面的description会报错：Cannot read property 'description' of undefined
        for(let i=0;i<this.studyCasesAyy.length;i++){
          this.studyCasesListAyy.push({"value": this.studyCasesAyy[i].description}) 
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    querySearch(queryString, cb) {
      let results = queryString ? this.studyCasesListAyy.filter(this.createStateFilter(queryString)) : this.studyCasesListAyy;
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

    //查询问题描述
    handleSearch () {
      this.filterQuery.pageIdx = 1
      this.filterQuery.description = this.inputProblemDescription
      this.handleSelectProblemDescriptions()
    },
    handleSelectProblemDescriptions () {
      this.checkFilterParams()
      this.loading = true
      GetStudyCasesList(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },

    //删除学习案例
    handleDeleteStudyCase (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteStudyCase(item.id).then(() => {
          this.handleGetStudyCasesList()
          this.$router.go(0)
          }, (err) => {
          this.$message.error(err.message)
          })
        }).catch(() => {
      })
    },

    //点击行，显示详情
    clickTable(row){
      this.$refs.refTable.toggleRowExpansion(row)
    },
    //文件预览
    handleGetWord(item) {
      let url = item.attach
      let index1=url.lastIndexOf(".")
      let index2=url.length
      let type=url.substring(index1+1,index2)
      if(type ==='pdf' || type ==='PDF'){
        window.location.href = item.attach
      }else{
        this.fileAttach = 'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc=' + item.attach
        window.open(this.fileAttach)
      }
    },

    //文件下载
    handleDownloadWord(item) {
      window.location.href = item.attach
    },
  }
    
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
