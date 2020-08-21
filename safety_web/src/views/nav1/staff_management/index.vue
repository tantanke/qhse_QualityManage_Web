<template>
  <div >
    <div class="page-title">员工管理</div>
    <div class="page-content">
      <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch"
        label-position="right"
        >
        <el-row>
          <el-col :span="4">
             <el-form-item>
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择公司名称"
              v-model="filterQuery.companyCode"
              style="width:220px"
              :disable-branch-nodes='true'
              /> 
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select
                v-model="filterQuery.name"
                placeholder="输入姓名搜索员工"
                :filter-method="handleLeaderSearch" 
                clearable
                filterable
                :loading="leaderLoading"
                loading-text="查询中..."
                style="width:220px"
              >
                <el-option
                  v-for="item in leaders"
                  :key="item.index"
                  :label="`${item.name}`"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-form-item>
          <el-autocomplete 
          v-model="inputEmpGroup"
          clearable
          :fetch-suggestions="querySearch2"
          placeholder="请输入科室"
          style="width:220px"
          :trigger-on-focus="true">
          </el-autocomplete>
        </el-form-item>
          </el-col>
          <el-col :span="4">
        <el-form-item prop="category">
              <el-select v-model="filterQuery.category" clearable placeholder="请选择员工类别" style="width:220px">
                <el-option
                  v-for="item in categorys"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button native-type='submit' type="primary" icon='el-icon-search'>查询</el-button>
            </el-form-item>
            <el-form-item>
              <router-link :to='{name:"management_NewStaff"}' >
                <el-button type="primary" icon='el-icon-plus'>新增</el-button>
              </router-link>
            </el-form-item>
            <el-form-item>
              <el-button  style="background-color:#3399CC;color:#FFFFFF" @click="export2Excel ()">导出Excel</el-button>
            </el-form-item>
          </el-col>
        </el-row>
            <el-row>
            <el-form-item>
              <el-button   type="warning" icon='el-icon-download' @click="downLoad()" >下载Excel模板</el-button>
            </el-form-item>
            <el-form-item>
              <el-upload
              ref="upload"
              :action="`/api/employees_excel_upload`"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              :headers="{Authorization:currentUser.token}"
              :auto-upload="false"
              accept=".excel,.xls,.xlsx"
              >
              <el-button slot="trigger"  type="primary" >导入Excel文件</el-button>
              <el-button icon='el-icon-upload'  style="margin-left: 10px;background-color:#6699CC;color:#FFFFFF"   @click="submitUpload">上传到服务器</el-button>
              </el-upload>
            </el-form-item>
            </el-row>
    </el-form>
    <!-- 表格区 -->
 <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width:100%"
    >   
    <!-- 表格下拉区 -->
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand" label-width="100px" >
          <el-form-item label="员工编号">
            <span>{{ props.row.employeeCode }}</span>
          </el-form-item>
          <el-form-item label="二级单位">
            <span>{{ props.row.topFourCompanyName }}</span>
          </el-form-item>
          <el-form-item label="性别">
            <span>{{ props.row.sex }}</span>
          </el-form-item>
          <el-form-item label="出生日期">
            <span>{{ props.row.birthday }}</span>
          </el-form-item>
          <el-form-item  label="参加工作时间">
            <span>{{ props.row.jobTime}}</span>
          </el-form-item>
          <el-form-item label="文化程度">
            <span>{{ props.row.education }}</span>
          </el-form-item>
          <el-form-item label="邮箱">
            <span>{{ props.row.email }}</span>
          </el-form-item>
          <el-form-item label="电话">
            <span>{{ props.row.tel }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>  
    <el-table-column
      type="index"
      label="序号"
      width="60px"
     :index="this.indexStartNum"
     >
    </el-table-column>
    <el-table-column
      label="员工姓名"
      prop="name"
      width="100%">
    </el-table-column>
    <el-table-column
      label="用户名"
      prop="uName"
      width="300%">
    </el-table-column>
    <el-table-column
      label="角色"
      prop="roleName"
      width="120%">
    </el-table-column>
    <el-table-column
      label="底层单位"
      prop="companyName"
      >
    </el-table-column>
    <el-table-column
      label="科室"
      prop="empGroup"
      width="150%">
    </el-table-column>
    <el-table-column
      label="员工类别"
      prop="category"
      width="100%">
    </el-table-column>
    <el-table-column label="操作" align="center"  width="500%" fixed="right">
        <template slot-scope="scope">
          <router-link :to='{name: "management_zhuceStaff",params: {id: scope.row.employeeID}}' v-if="scope.row.hasOwnProperty('uName') === false">
            <el-button round size="mini" icon='el-icon-document' >注册</el-button>
          </router-link>
          <router-link :to='{}' v-else>
            <el-button round size="mini" icon='el-icon-document'  @click="resetPassword({uName:scope.row.uName})" >重置密码</el-button>
          </router-link>
          &nbsp;
          <el-button round size="mini" icon="el-icon-edit" @click="roleChange(scope.row.employeeID)" v-if="scope.row.hasOwnProperty('uName') === true">修改</el-button>
          <el-button round size="mini" icon="el-icon-edit" :disabled=true v-else>修改</el-button>
            &nbsp;
          <router-link :to='{name: "management_MoveStaff",params: {id: scope.row.employeeID}}' >
            <el-button round size="mini" icon='el-icon-sort'>调动</el-button>
          </router-link>
            &nbsp;
          <router-link :to='{name: "management_EditStaff",params: {id: scope.row.employeeID}}' >
          <el-button round size="mini"  @click="dialogEditVisible = true" icon="el-icon-edit-outline">编辑</el-button>
          </router-link>
          &nbsp;
          <el-button  type="danger"  round size="mini"  @click="handleDeleteStaff(scope.row) " icon="el-icon-delete" >删除</el-button>
        </template>
   </el-table-column>
  </el-table> 
  <!--新增事件节点分类弹窗-->
    <el-dialog
      title="员工账号详情修改"
      :visible.sync="addEventdialogVisible">
      <el-form ref="addEventForm" :model="changeRole" label-position="right" label-width="200px">
        <el-form-item label="用户名：" >
          {{ changeRole.uName }}
          <!-- <el-input v-model="changeRole.uName" style="width:50%" ></el-input> -->
        </el-form-item>
          <el-form-item label="账户状态：">
            <el-select  v-model="changeRole.status" placeholder="账户状态" clearable style="width:50%" >
              <el-option v-for="item in status1" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-input v-model="changeRole.status" style="width:50%"></el-input> -->
        <el-form-item label="角色：">
          <el-select v-model="changeRole.roleCode"  placeholder="角色选择" clearable style="width:50%">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.roleCode">
            </el-option>
          </el-select>
          <!-- <el-input v-model="changeRole.roleCode" style="width:50%"></el-input> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addEventdialogVisible=false">取 消</el-button>
        <el-button type="primary"  @click="handleSubmit()">确 定</el-button>
      </span>
    </el-dialog>
      <!-- 分页 -->
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
import {GetEmployees} from '../../../services/employee'
import {GetCurrentUser } from '../../../store/CurrentUser';
import {GetStaffList,DeleteStaff} from '../../../services/staffmanagement'
import {GetDictionary} from '../../../services/dictionary'
import {GetCompany} from  '../../../services/problemRankAnalysis'
import {GetRoleList} from '../../../services/sys_roles'
import {GetRoleDetail,UpdateRoleDetail,reset} from '../../../services/staffmanagement'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const DefaultQuery = {
  companyCode:null,
  name: '',
  empGroup:'',
  position:'',
  category:'',
  pageIdx: 1,
  pageSize: 10,
}
const DefaultQueryExcel = {   //************
  companyCode:null,
  name: '',
  empGroup:'',
  position:'',
  category:'',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}

export default {
  components: { Treeselect },
  data() {
    return {
      fileList:[], //上传文件的列表
      filterQuery: {},
      changeRole:{},
      addEventdialogVisible: false,
      filterQueryExcel: {},
      tableData: [],
      empGroups:[],
      positions:[],
      inputEmpGroup:'',
      categorys:[{value: 'ERP',label: 'ERP'},{value: '非ERP',label: '非ERP'}],
      options:[],
      loading: false,
      excelData:[],
      taskNameList:[],
      fitertask: {},
      inputName:'',
      timeout: null,
      taskAyy: [],
      total: 0,
      roles:[],
      status1:[],
      leaders:[],
      ID:"",
      leaderLoading: false,
      tableData1:[],
      indexStartNum:1 
    }
  },
  mounted () {
   this.loadFilterParams() //加载默认条件
  //  this.getpositions()
   this.handleLeaderSearch()//查询员工姓名
   this.getempGroups()
   this.handleGetCompany()
   this.handleGetStaffList()
   this.handleRoleList()//获取角色名
  //  this.handelGetRoleDetail()//根据员工ID获取单个员工的角色
   this.handlestatus()
  },
  computed:{
    currentUser(){
      return GetCurrentUser()},
  },
  
    methods: {
      //重置密码
      resetPassword(data){
        this.$confirm('此操作将重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reset(data).then(() => {
          this.$message.success("重置成功！")
          this.handleGetStaffList()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
      //查询员工姓名
      handleLeaderSearch (val='') {
      this.leaderLoading = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.leaders = res.data
        this.leaderLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading = false
      })
    },
      downLoad(){
        var url='http://39.98.173.131:7000/Employees/员工录入模板.xls'
        var iframe =document.createElement("iframe")
        iframe.style.display ="none";
        iframe.src = url;
        document.body.appendChild(iframe);
      },
      //上传文件
      handlePreview(file) {
        console.log(file);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess(response){
       this.$message.warning(response);
       this.getDate();
      },
      //将文件上传服务器
      submitUpload() {
        this.$refs.upload.submit();
      },
      //页码改变
      handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetStaffList()
    },
      //导出excel
      export2Excel() {
        this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
        this.filterQueryExcel = {
          ...this.filterQueryExcel,
        }
        this.excelData=GetStaffList(this.filterQueryExcel).then((data) => {
          this.excelData = data.data
          this.loading = false
          require.ensure([], () => {
            const { export_json_to_excel } = require('../../../vendor/Export2Excel');

            const tHeader = ['员工姓名','性别','单位编码','底层单位','科室','出生日期','参加工作时间','文化程度','邮箱','电话','员工类别'];

            const filterVal = ['name','sex','companyCode','companyName','empGroup','birthday','jobTime','education','email','tel','category'];
            const list = this.excelData;  
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '列表excel');
          })
        })
      },
      getempGroups(){
        GetStaffList({type:"all"}).then((res) => {  
        for(let i=0;i<res.data.length;i++){
          if(this.empGroups.indexOf(res.data[i]) === -1){
            this.empGroups.push({"value": res.data[i].empGroup}) 
          }
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    querySearch2(queryString, cb) {
      let results = queryString ? this.empGroups.filter(this.createStateFilter2(queryString)) : this.empGroups;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter2(queryString) {
      return (inputEmpGroup) => {
        return (inputEmpGroup.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
      };
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

      //获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
      createStateFilter(queryString) {
        return (inputName) => {
          return (inputName.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
        };
      },
    //数据字典获取“职位”
    getpositions () {
      GetDictionary({name: '职位'}).then((res) => {
        this.positions = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //账户详情修改
    roleChange(id){
      this.addEventdialogVisible = true;
      this.handelGetRoleDetail(id)
    },
     handleSearch(){
      this.filterQuery.empGroup = this.inputEmpGroup
      this.filterQuery.pageIdx = 1
      this.handleGetStaffList()
    },
    //获取账户状态
    handlestatus(){
      GetDictionary({name:'账户状态'}).then((res) => {
        this.status1 = res.data 
    }).catch((err) => {
      this.$message.error(err.message)
    })
    },
      //获取角色名
     handleRoleList(){
      GetRoleList().then((res) => {  
        for(let i=0;i<res.data.list.length;i++)
        {
          this.roles[i]={"roleCode":res.data.list[i].roleCode,"name" :res.data.list[i].name}
        }     
      })
    },
    //根据员工ID获取单个员工的角色详细信息
    handelGetRoleDetail (id) {
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      GetRoleDetail(id).then((res) => {
        this.filterQuery.employeeID = id
        this.changeRole = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //账号详情修改提交
    handleSubmit () {
      UpdateRoleDetail(this.filterQuery.employeeID, this.changeRole).then(() => {
        this.$message.success('操作成功')
        this.addEventdialogVisible = false;
        this.handleGetStaffList()
      }, (err) => {
        this.$message.error(err.message)
      })
    },
    handleGetStaffList(){
      this.loading = true
      this.$router.push({name: 'management_index', query: this.filterQuery})
      GetStaffList(this.filterQuery).then((res) => {
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
    handleDeleteStaff (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteStaff(item.employeeID).then(() => {
          this.handleGetStaffList()
          this.$message.success("删除成功")
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
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
  .above{
      width: 1200px;
      height: 50px;
  }
</style>