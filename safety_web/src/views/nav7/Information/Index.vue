<template>
  <div>
    <div class="page-title">文件通知</div>
    <div class="page-content">
      <el-form
        :inline="true"
        v-model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-form-item label="文件名称：">
        <el-autocomplete 
            v-model="inputFileName"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入文件名称查询"
            :trigger-on-focus="true"
            style="width:250px">
        </el-autocomplete>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" native-type='submit' icon='el-icon-search' >查询</el-button>
        </el-form-item>
      </el-form>

      <el-dialog title="新增文件" :visible.sync="dialogFormVisible">
        <el-form label-width="140px" :model="formData" style="width:80%">
          <el-form-item label="文件名称">
            <el-input v-model="formData.fileName"></el-input>
          </el-form-item>
          <el-form-item label="适用单位">
              <treeselect
              filterable
              :multiple="false"
              :options="options"
              placeholder="请选择适用单位"
              v-model="formData.appliComCode"
              style="width:100%"/> 
            </el-form-item>
          <el-form-item label="上传时间">
            <el-input v-model="formData.uploadDate" readonly></el-input>
          </el-form-item>
          <el-form-item label="文件简介">
            <el-input v-model="formData.summary" type="textarea" style="width:100%" :autosize="{ minRows: 4}" placeholder="请输入文件简介,200字以内。"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit()">确 定</el-button>
        </div>
      </el-dialog>

      <el-table :data="tableData" v-loading="loading" border style="width: 100%" >
        <el-table-column type="index" width="50" header-align="center" label="序号" :index="this.indexStartNum" align="center"></el-table-column>
        <el-table-column label="文件名称" prop="fileName" header-align="center"> </el-table-column>
        <el-table-column label="适用单位" prop="appliCom" header-align="center"> </el-table-column>
        <el-table-column label="上传时间" prop="uploadDate" header-align="center" sortable> </el-table-column>
        <el-table-column label="上传人" prop="uploadPerson" header-align="center"> </el-table-column>
        <el-table-column label="文件简介" prop="summary" header-align="center"> </el-table-column>
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
import { GetFileList } from '../../../services/information_management'

const DefaultQuery = {
  fileName:'',
  fileType:'文件通知',
  uploadPerson:'',
  appliComCode:'',
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
        fileName:''
      },
      options:[],
      total:null,
      inputFileName:'',
      loading: false,
      filterQuery: [],
      fileNameAyy:[],
      fileNameListAyy:[],
      fileList:[],
      dialogFormVisible:false
    };
  },

  mounted(){
    this.loadFilterParams()
    this.handleGetFileList()
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
    },
    //获取全部文件
    handleGetFileList () {
      this.loading = true
      GetFileList(this.filterQuery).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
        for(let i=0;i<this.tableData.length;i++){    //获取模糊查询，文件名下拉框
          this.fileNameListAyy.push({"value": this.tableData[i].fileName})   
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
      let results = queryString ? this.fileNameListAyy.filter(this.createStateFilter(queryString)) : this.fileNameListAyy;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (inputFileName) => {
        return (inputFileName.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
      };
    },

    //查询文件名称
    handleSearch () {
      this.filterQuery.pageIdx = 1
      this.filterQuery.fileName = this.inputFileName
      this.handleSelectFile()
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
    //文件预览
    handleGetWord(item) {
      let url = item.fileNameCode
      let index1=url.lastIndexOf(".")
      let index2=url.length
      let type=url.substring(index1+1,index2)
      if(type ==='pdf' || type ==='PDF'){
        window.location.href = item.fileNameCode
      }else{
        this.fileAttach = 'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc=' + item.fileNameCode
        window.open(this.fileAttach)
      }
    },

    //文件下载
    handleDownloadWord(item) {
      window.location.href = item.fileNameCode
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
