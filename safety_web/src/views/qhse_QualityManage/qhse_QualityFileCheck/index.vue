<template>
  <div>
    <div class="page-title" style="width:100%">QHSE文件审核</div>
    <div class="page-content">
      <el-row>
        <el-form label-width="130px" :inline="true" :model="filterQuery">
          <el-form-item label="选择公司：">
            <treeselect
              :multiple="false"
              :options="companyList"
              placeholder="请选择公司单位"
              @select='getQueryCode'
              v-model="filterQuery.companyCode"
              style="width:200px"
            />
          </el-form-item>
          <el-form-item label="选择年份：">
            <el-date-picker
              v-model="filterQuery.year"
              type="year"
              placeholder="选择年份"
              style="width:200px">
              </el-date-picker>
          </el-form-item>

          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
            <el-button type="primary" icon="el-icon-search" style="margin-left:30px" @click="addNewFile">新建</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="560"
          highlight-current-row
          border
          v-loading="loading">
          <el-table-column prop="year" label="年份" width="120" align="center"></el-table-column>
          <el-table-column prop="companyName" label="公司名称"></el-table-column>
          <el-table-column prop="auditName" label="审核名称"></el-table-column>
          <el-table-column prop="auditType" label="审核类别"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type='danger' size="mini" style='margin-right:20px' @click="deleteFile(scope.row)">删除</el-button>
              <router-link :to='{name: "FileCheckIndex", params: {data:scope.row}}'>        
                <el-button type="primary" size="mini" >审核</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!--添加审核表 -->
        <el-dialog title="新建文件审核" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
          <el-form :model="addFileForm">
            <el-form-item label="选择公司：" :label-width="formLabelWidth" style="width:320px">
            <treeselect
              :multiple="false"
              :options="companyList"
              @select="getCompanyCode"
              placeholder="请选择公司单位"
              v-model="ScompanyCode"
            />
          </el-form-item>
            <el-form-item label="审核类别:" :label-width="formLabelWidth">
              <el-select v-model="addForm.auditType" placeholder="请选择审核类别" style="width:200px">
                <el-option label="基础审核" value="基础审核"></el-option>
                <el-option label="内部审核" value="内部审核"></el-option>
                <el-option label="联系点审核" value="联系点审核"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CurrentUser from '../../../store/CurrentUser'
import { addFileaduit } from "../../../services/qhse_Filecheck"
import { querryQhseElement,queryFileaduit,queryFileaduit2 } from "../../../services/qhse_Filecheck"
import request from '../../../utils/request'
import { GetCompany } from "../../../services/gettreedata";
const DefaultQuery = {
  year: "",
  status:""
};
export default {
  data() {
    return {
      ScompanyCode: null,
      addFileForm: {
        year: '',
        companyCode: null,
        auditType: '',
        auditName: ''
      },
      addForm: {
        auditName: '',
        auditType: '',
        auditTime: '',
        additor: '',
        companyCode: '',
        year: '',
        tableId: ''
      },
      querryQhseElement: {
        companyCode: '',
        year: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible:false,
      filterQuery: {},
      searchForm: {},
      companyList: [],
      loading: true,
      tableData: [],
      statuss: [
        { value: "", label: "所有" },
        { value: "通过", label: "通过" },
        { value: "未通过", label: "未通过" }
      ],
      rules: {

      }
    };
  },
  methods: {
    handleGetCompany() {
      GetCompany().then(res => {
          this.companyList = JSON.parse(JSON.stringify(res.data))
          console.log(this.companyList)
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    loadFilterParams() {
      this.filterQuery = { ...DefaultQuery, ...this.$route.query };
      this.filterQuery = {
        ...this.filterQuery
      };
      let year = new Date();
      this.filterQuery.year = String(year.getFullYear())
    },
    handleClick() {
      if(!this.filterQuery.year){
        this.filterQuery.year = new Date()
      }
      let nowdata = new Date(this.filterQuery.year);
      this.filterQuery.year = String(nowdata.getFullYear())
      this.handleGetInitialData();
    },
    handleGetDate(date) {
      let nowdata = new Date(date);
      return String(nowdata.getFullYear());
    },
    handleGetInitialData() {
      let serchform = {};
      this.loading = true;
      if(!this.searchForm.companyName){
        serchform = {year: this.filterQuery.year}
        queryFileaduit(serchform).then(res => {
        this.tableData = res.data.list;
        this.loading = false;
      }).catch(err => {
          this.message.error(err.message);
          this.loading = false;
        });
      
      } else{
        serchform = {year: this.filterQuery.year,companyName:this.searchForm.companyName}
        queryFileaduit2(serchform).then(res => {
        this.tableData = res.data.list;
        this.loading = false;
        this.searchForm.companyName = ''
      }).catch(err => {
          this.message.error(err.message);
          this.loading = false;
          this.searchForm.companyName = ''
        });
      }

      
    },
    deleteFile(data) {
      let _this = this
      console.log(data)
      let url ='/api/delete_fileaduit/' +  data.fileAuditId.toString()
      _this.$confirm('确认删除该条审核记录吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(()=>{
        return request(url,{method: 'DELETE'})
       })
       .then(res => {
         if(res.code == '1000'){
           //重新获取文件审核表数据
           _this.$message({
          message: '删除成功！',
          type: 'success'
        }) 
        this.handleGetInitialData();
        }else{
          this.$message.error('删除失败!')
        }
       }).catch(err => {
         this.$message.error(err.message)
       })
    }, 
    initForm () {
      let _this = this
       let nowTime = new Date()
       _this.addForm.auditTime = nowTime.toLocaleDateString()
       _this.addForm.year = nowTime.getFullYear().toString()
       _this.addForm.auditName = _this.addForm.auditName + _this.addForm.auditTime + _this.addForm.auditType
    },
    addNewFile() {
       this.dialogFormVisible = true
       this.initForm()
    },
    serchStatus(deeptree) {
      let _this = this
       deeptree.forEach(item => {
         if(item.childNode.length === 0 && item.status === '未批准') {
           this.isStatus = true
           return
         } else {
           _this.serchStatus(item)
         }
       })
    }, 
    submitAdd () {
       let _this = this
       _this.initForm()
       _this.querryQhseElement.companyCode = _this.addForm.companyCode
       _this.querryQhseElement.year = _this.addForm.year
       querryQhseElement(_this.querryQhseElement).then(res => {
         if(res.data.length > 0){
           _this.addForm.tableId = res.data[0].tableID
           return addFileaduit(_this.addForm)
         } else {
           _this.$message.warning('请选择已经通过要素证据审批的公司信息！')
           _this.ScompanyCode = null
         }
       }).then((res) => {
            if(res.code === 1000) {
            this.handleGetInitialData();
            this.dialogFormVisible = false
            _this.reloadForm() 
            _this.$message({
              message: '添加成功！',
              type: 'success'
            })
            } 
        
      })
       .catch(err => {
          this.$message.error(err)
          _this.reloadForm()
         this.dialogFormVisible = false
       })
      
      
    },
    getCompanyCode(node) {
        this.addForm.auditName = node.label
        this.addForm.companyCode = node.nodeCode
    },
    getUserName() {
        let user = CurrentUser.get()
        this.addForm.additor = user.userName
     },
    reloadForm() {
      let _this = this
      _this.addForm.auditName = ''
      _this.addForm.auditType = ''
      _this.addForm.auditTime = ''
      _this.ScompanyCode = null

    },
    getQueryCode(node){
      console.log(node)
      this.searchForm.companyName = 	node.label
    }
    
  },
  mounted() {
    
    
    this.getUserName();
    this.handleGetCompany();
    this.loadFilterParams();
    this.handleGetInitialData();
  }
};
</script>

<style lang="scss">

</style>