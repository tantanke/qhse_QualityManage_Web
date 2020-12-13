<template>
  <div>
    <div class="page-title">管理亮点</div>
    <div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
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
        <!-- <el-form-item>
          <router-link :to='{name: "InformationNew"}' >
            <el-button   icon='el-icon-plus' native-type='button' >新增</el-button>
          </router-link>
        </el-form-item> -->
        <el-form-item>
          <el-upload
            v-model="formData.fileNameCode"
            :action="`/api/file_upload`"
            :on-remove="handleRemove"
            :before-upload="handleBeforeUpload"
            :auto-upload='true'
            :headers="{Authorization:currentUser.token}"
            :file-list="fileList"
            :on-success="handleSuccess"
            :limit="1"
            list-type="text"
            accept=".pdf,.PDF,.docx,.DOCX">
            <el-button type="primary" icon='el-icon-upload'>上传文件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">请上传一个word文档或者pdf文件，且不超过2M。</div> -->
          </el-upload>
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

      <el-table :data="tableData" border style="width: 100%" >
        <el-table-column type="index" width="50" header-align="center" label="序号" :index="this.indexStartNum" align="center"></el-table-column>
        <el-table-column label="文件名称" prop="fileName" header-align="center"> </el-table-column>
        <el-table-column label="适用单位" prop="appliCom" header-align="center"> </el-table-column>
        <el-table-column label="上传时间" prop="uploadDate" header-align="center" sortable> </el-table-column>
        <el-table-column label="上传人" prop="uploadPerson" header-align="center" width="80px"> </el-table-column>
        <el-table-column label="文件简介" prop="summary" header-align="center"> </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" width="250%">
          <template slot-scope="scope">
            <div class="inline-td">
              <el-button size="mini" type="primary" icon='el-icon-search' @click="handleGetWord(scope.row)">预览</el-button>
              <el-button size="mini" type="primary" icon='el-icon-download' @click="handleDownloadWord(scope.row)">下载</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteFile(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-base" style="margin-bottom: 15px">
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
import { GetFileList,DeleteFile,CreateFile } from '../../../services/information_management'

const DefaultQuery = {
  fileName:'',
  fileType:'管理亮点',
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
    this.handleGetCompany()
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

    //删除文件
    handleDeleteFile (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
		  this.loading=true
        DeleteFile(item.fileID).then(() => {
          this.handleGetFileList()
          this.loading=false
          }, (err) => {
          this.$message.error(err.message)
          })
        }).catch(() => {
      })
    },

//新增表单
    //初始获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取文件上传时间
    handleGetUploadDate(){
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      let hoursDate = date.getHours();
      let minutesDate = date.getMinutes();
      let secondsDate = date.getSeconds();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      if (hoursDate >= 0 && hoursDate <= 9) {
          hoursDate = "0" + hoursDate;
      }
      if (minutesDate >= 0 && minutesDate <= 9) {
          minutesDate = "0" + minutesDate;
      }
      if (secondsDate >= 0 && secondsDate <= 9) {
          secondsDate = "0" + secondsDate;
      }
      let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
              + " " + hoursDate + seperator2 + minutesDate + seperator2 + secondsDate;
      this.formData.uploadDate = currentdate
    },
    // 上传文件之前
    handleBeforeUpload(file){
      let size = file.size / 1024 / 1024 / 12
      if(size > 12) {
        this.$notify.warning({
          title: '警告',
          message: '文件大小必须小于12M'
        })
      }
    },
    //文档附件
    handleRemove() {
      this.formData.fileNameCode = null
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response,file){
      if(response) {
        this.$notify.success({
          body:{
            style:{width:'300px',height:'500px'}
          },
          title:'提示',
          message: '文件上传成功'
        })
      }
      this.handleGetUploadDate()
      this.formData.fileNameCode = response.data
      let arr = file.name
      let n = arr.lastIndexOf('.')
      this.formData.fileName = arr.substring(0,n)
      this.dialogFormVisible = true
    },
    //确认创建
    handleSubmit () {
      this.formData.fileType = '管理亮点'
	  this.loading=true
      CreateFile(this.formData).then(() => {
        this.$message.success('创建成功')
        this.handleGetFileList()
		this.loading=false
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //文件预览
    handleGetWord(item) {
      let url = item.fileNameCode
      if(url){
      	window.open('http://39.98.173.131:8012/onlinePreview?url='+encodeURIComponent(url))
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
