<template>
  <div>
    <div class="page-title">规章制度</div>
    <div class="page-content">
      <el-form
        :inline="true"
        v-model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-form-item label="文件名称：">
          <el-autocomplete 
            v-model="inputRegName"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入文件名称查询"
            :trigger-on-focus="true"
            style="width:200px">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="发布机构：">
          <treeselect
          filterable
          :multiple="false"
          :options="options"
          placeholder="请选择发布机构"
          v-model="filterQuery.publishComCode"
          style="width:200px"/> 
        </el-form-item>
        <el-form-item label="文件类型：">
          <el-select v-model="inputTypeName" placeholder="请选择文件类型" style="width:200px" clearable @change="onChangedSearchType">
            <el-option 
            v-for="item in types" 
            :key="item.dictCode" 
            :label="item.name" 
            :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间：">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width:300px">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search' >查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" border style="width: 100%" >
        <el-table-column type="index" width="50" header-align="center" label="序号" :index="this.indexStartNum" align="center"></el-table-column>
        <el-table-column label="文号" prop="documentSymbol" header-align="center"> </el-table-column>
        <el-table-column label="名称" prop="regName" header-align="center"> </el-table-column>
        <el-table-column label="发布机构" prop="publishComName" header-align="center"> </el-table-column>
        <el-table-column label="文件类型" prop="typeName" header-align="center" width="120"> </el-table-column>
        <el-table-column label="开始执行时间" prop="beginDate" header-align="center" width="160" sortable> </el-table-column>
        <el-table-column label="上传时间" prop="uploadDate" header-align="center" width="160"> </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" width="250%">
          <template slot-scope="scope">
            <div class="inline-td">
              <el-button size="mini" type="primary" icon='el-icon-search' @click="handleGetWord(scope.row)">文件预览</el-button>
              <el-button size="mini" type="primary" icon='el-icon-download' @click="handleDownloadWord(scope.row)">文件下载</el-button>
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
import { GetCurrentUser } from '../../../store/CurrentUser';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { GetCompany } from '../../../services/gettreedata'
import {GetDictionary} from '../../../services/dictionary'
import { GetFileList } from '../../../services/studyCase_rules'

const DefaultQuery = {
  regName:'',
  typeName:'',
  publishComCode:null,
  beginDate1:'',
  beginDate2:'',
  pageIdx: 1,
  pageSize: 10
}
export default {
  computed:{
    currentUser(){
      return GetCurrentUser()
    }
  },
  data() {
    return {
      indexStartNum:1,
      tableData: [],
      formData:{
        regName:''
      },
      types:[],
      options:[],
      total:null,
      inputRegName:'',
      inputTypeName:'',
      loading: false,
      dateRange:'', //时间查询，v-model绑定
      filterQuery: [],
      regNameAyy:[],
      regNameListAyy:[],
      fileList:[],
    };
  },

  mounted(){
    this.loadFilterParams()
    this.handleGetFileList()
    this.handleGetCompany()
    this.handleGetFileType()
  },
  
  methods:{
    //加载默认条件
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
      if (this.filterQuery.beginDate1 && this.filterQuery.beginDate2) {
        this.dateRange = [this.filterQuery.beginDate1, this.filterQuery.beginDate2]
      }
    },
    checkFilterParams () {
      //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
      if (this.dateRange && this.dateRange.length === 2) {
        this.filterQuery.beginDate1 = this.dateRange[0]
        this.filterQuery.beginDate2 = this.dateRange[1]
      } else {
        this.filterQuery.beginDate1 = ''
        this.filterQuery.beginDate2 = ''
      }
    },
    //获取全部文件
    handleGetFileList () {
      this.checkFilterParams()
      this.loading = true
      GetFileList(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
        for(let i=0;i<this.tableData.length;i++){    //获取模糊查询，文件名下拉框
          this.regNameListAyy.push({"value": this.tableData[i].regName}) 
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    
    //页码改变
    handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetFileList()
    },
    
    //查询文件名称下拉框
    querySearch(queryString, cb) {
      let results = queryString ? this.regNameListAyy.filter(this.createStateFilter(queryString)) : this.regNameListAyy;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (inputRegName) => {
        return (inputRegName.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
      };
    },

    //查询文件名称
    handleSearch () {
      this.checkFilterParams()
      this.loading = true
      this.filterQuery.pageIdx = 1
      this.filterQuery.regName = this.inputRegName
      this.handleSelectFile()
    },
    onChangedSearchType(selectValue) {
      if(selectValue != ''){
        let obj = {}
          //遍历下拉数组中的item
        obj = this.types.find((item)=>{
          return item.name === selectValue
        })  
        this.filterQuery.typeCode = obj.dictCode 
      } else {
        this.filterQuery.typeCode = ''
      }
    },
    handleSelectFile () {
      this.loading = true
      GetFileList(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },

    //获取规章制度类型
    handleGetFileType () {
      GetDictionary({name: '规章制度类型'}).then((res) => {   
          this.types = res.data
      }).catch((err) => {
          this.$message.error(err.message)
      })
    },
    onChangedType(selectValue) {
      let obj = {}
         //遍历下拉数组中的item
      obj = this.types.find((item)=>{
        return item.name === selectValue
      })
      this.formData.typeName = obj.name     
      this.formData.typeCode = obj.dictCode   
    },
    //初始获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //文件预览
    handleGetWord(item) {
      let url = item.regNameCode
      let index1=url.lastIndexOf(".")
      let index2=url.length
      let type=url.substring(index1+1,index2)
      if(type ==='pdf' || type ==='PDF'){
        window.location.href = item.regNameCode
      }else{
        this.fileAttach = 'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc=' + item.regNameCode
        window.open(this.fileAttach)
      }
    },

    //文件下载
    handleDownloadWord(item) {
      window.location.href = item.regNameCode
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
