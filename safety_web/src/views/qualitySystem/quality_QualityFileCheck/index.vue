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
              :clearable='false'
              v-model="filterQuery.companyCode"
              style="width:250px"
              :disable-branch-nodes='true'
            />
          </el-form-item>
          <el-form-item label="选择年份：">
            <el-date-picker
              v-model="filterQuery.year"
              type="year"
              format='yyyy'
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
          max-height="537"
          highlight-current-row
          border
          v-loading="loading">
          <el-table-column prop="year" label="年份" width="120" align="center"></el-table-column>
          <el-table-column prop="companyName" label="公司名称"></el-table-column>
          <el-table-column prop="additor" label="审核人"></el-table-column>
          <el-table-column prop="auditTime" label="审核时间"></el-table-column>
          <el-table-column prop="auditName" label="审核名称"></el-table-column>
          <el-table-column prop="auditType" label="审核类别"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type='danger' size="mini" style='margin-right:20px' icon="el-icon-delete" @click="deleteFile(scope.row)">删除</el-button>
              <router-link :to='{name: "FileCheckIndex", params: {data:scope.row}}'>        
                <el-button type="primary" size="mini" icon="el-icon-edit" >审核</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:15px" >
  </div>
      </el-row>
    </div >
    <!--添加审核表 -->
        <el-dialog title="新建文件审核" :visible.sync="dialogFormVisible" center :close-on-click-modal='false' width='32%'>
          <div v-loading='addloading'>
          <el-form :model="addFileForm" style="50%">
            <el-form-item label="审核公司：" :label-width="formLabelWidth">
            <treeselect
             style="width:90%"
              :multiple="false"
              :options="companyList"
              @select="getCompanyCode"
              placeholder="请选择公司单位"
              v-model="ScompanyCode"
              :disable-branch-nodes='true'
            />
          </el-form-item>
            <el-form-item label="审核类别:" :label-width="formLabelWidth">
              <el-select v-model="addForm.auditType" placeholder="请选择审核类别" style="width:90%">
                <el-option label="基础审核" value="基础审核"></el-option>
                <el-option label="内部审核" value="内部审核"></el-option>
                <el-option label="联系点审核" value="联系点审核"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核年份：" :label-width="formLabelWidth" >
            <el-date-picker
            style="width:90%"
              v-model="addForm.year"
              type="year"
              placeholder="选择年份">
              </el-date-picker>
          </el-form-item>
            <el-form-item label="审核名称:"  :label-width="formLabelWidth" >
              <el-input style="width:90%" placeholder="请输入审核名称" v-model="addForm.auditName" @focus=" initName"></el-input>
            </el-form-item>
          </el-form>         
      
       <div style="text-align:right" >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CurrentUser from '../../../store/CurrentUser'
import { addFileaduit } from "../../../services/qualitySystem/quality_Filecheck"
import { querryQhseElement,queryFileaduit,queryFileaduit2} from "../../../services/qualitySystem/quality_Filecheck"
import request from '../../../utils/request'
import { GetCompany } from "../../../services/gettreedata";
export default {
  data() {
    return {
      ScompanyCode: null,
      ScompanyName: '',
      addFileForm: {
        year: '',
        companyCode: null,
        auditType: '',
        auditName: ''
      },
      addloading: false,
      // 添加文件审核
      addForm: {
        auditName: '',
        auditType: '',
        auditTime: '',
        additor: '',
        companyCode: '',
        year: '',
        tableId: ''
      },
      hasFocus:true,
      querryQhseElement: {
        companyCode: '',
        year: ''
      },
      formLabelWidth: '140px',
      dialogFormVisible:false,
      filterQuery: {},
      searchForm: {},
      companyList: [],
      loading: false,
      tableData: [],
      statuss: [
        { value: "", label: "所有" },
        { value: "通过", label: "通过" },
        { value: "未通过", label: "未通过" }
      ],
      // 记录是否分页
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
    handleClick() {
      this.handleGetInitialData();
    },
    // 获取当前年份
    handleGetDate(date) {
      let nowdata = new Date(date);
      return String(nowdata.getFullYear());
    },
    // 初始化表格数据
    handleGetInitialData() {
      let serchform = {};
      if(typeof(this.filterQuery.year) === 'object' && this.filterQuery.year)
      this.filterQuery.year = String(this.filterQuery.year.getFullYear())
      if(this.searchForm.companyName && this.filterQuery.year){
        serchform = {year: this.filterQuery.year,companyName:this.searchForm.companyName}
        this.loading = true;
        queryFileaduit2(serchform).then(res => {
        this.tableData = res.data.list;
        this.loading = false;
      }).catch(err => {
          this.message.error(err.message);
          this.loading = false;
        });
      } 
      else if(this.searchForm.companyName && !this.filterQuery.year){
         serchform = {companyName:this.searchForm.companyName}
        this.loading = true;
        queryFileaduit(serchform).then(res => {
        this.tableData = res.data.list;
        this.loading = false;
      }).catch(err => {
          this.message.error(err.message);
          this.loading = false;
        });
      }
      else {
        console.log(this.searchForm.companyName,this.filterQuery.year)
        this.$message.warning('请选择正确的公司查询！')
      }

      
    },
    //分页相关
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
    // 删除文件审核记录
    deleteFile(data) {
      let _this = this
      let url ='/api/delete_qualityfileaduit/' +  data.fileAuditId.toString()
      _this.$confirm('确认删除该条审核记录吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(()=>{
        this.loading = true;
        return request(url,{method: 'DELETE'})
       })
       .then(res => {
         if(res.code == '1000'){
           //重新获取文件审核表数据
           _this.$message({
          message: '删除成功！',
          type: 'success'
        }) 
        this.loading = false;
        this.handleGetInitialData();
        }else{
          this.$message.error('删除失败!')
        }
       }).catch(err => {
         this.$message.error(err.message)
         this.loading = false;
       })
    }, 
    initForm () {
      let _this = this
       let nowTime = new Date()
       _this.addForm.auditTime = nowTime.toLocaleDateString()
       _this.ScompanyCode = null
       _this.addForm.auditName = ''
       _this.addForm.auditType = ''
       _this.addForm.year = ''
       _this.hasFocus = true     
    },
    initName() {
      let _this = this
      _this.addForm.year = String(_this.addForm.year.getFullYear())
      if(_this.ScompanyCode && _this.addForm.auditType !== '' && _this.addForm.year !== ''){
      _this.addForm.auditName = _this.ScompanyName + _this.addForm.year + _this.addForm.auditType
      }
    },
    addNewFile() {     
       this.initForm()     
       this.dialogFormVisible = true
    },
    // 获取tableid
    submitAdd () {
       let _this = this
       _this.querryQhseElement.companyCode = _this.addForm.companyCode
       _this.querryQhseElement.year = _this.addForm.year
       if(_this.addForm.auditType === '' ||  _this.addForm.companyCode === '' || _this.addForm.year === '' || _this.addForm.auditName === '') {
         _this.$message.warning('请填写完整的审核信息！')
         return
       }
       _this.addloading = true
       querryQhseElement(_this.querryQhseElement).then(res => {
         if(res.data.length > 0){
           _this.addForm.tableId = res.data[0].tableID
           return addFileaduit(_this.addForm)
         } else {
           _this.$message.error('请选择已经通过要素证据审批的公司信息！')
           _this.ScompanyCode = null
           _this.reloadForm()
           _this.dialogFormVisible = false
           _this.addloading = false   
           return {code: 0}
         }
       }).then((res) => {
            if(res.code === 1000) {
            _this.filterQuery.year = _this.addForm.year
            _this.filterQuery.companyCode = _this.ScompanyName
            this.searchForm.companyName = _this.ScompanyName
            console.log(_this.filterQuery)
            _this.handleGetInitialData();
            _this.dialogFormVisible = false
            _this.reloadForm() 
            _this.$message.success('添加成功！')
            _this.addloading = false   
            }      
      }).catch(err => {
          _this.$message.error(err)     
          _this.addloading = false   
       })
      
      
    },
    getCompanyCode(node) {
        this.ScompanyName = node.label
        this.addForm.companyCode = node.nodeCode
    },
    getUserName() {
        let user = CurrentUser.get()
        this.addForm.additor = user.employeeName
     },
    reloadForm() {
      let _this = this
      _this.addForm.auditName = ''
      _this.addForm.auditType = ''
      _this.addForm.auditTime = ''
      _this.addForm.year = ''
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
  }
};
</script>

<style lang="scss">

</style>