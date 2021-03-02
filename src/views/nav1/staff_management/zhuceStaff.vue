<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">员工管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>员工注册</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form  label-width="140px" :model="filterQuery">
          <el-form-item label="  姓  名:  ">
            {{filterQuery.name}}
          </el-form-item>
          <el-form-item label="二级单位:">
            {{filterQuery.topFourCompanyName}}
          </el-form-item>
          <el-form-item label="底层单位:">
            {{filterQuery.companyName}}
          </el-form-item>
          <br>
          </el-form>
           <el-form  :rules="rules"  ref="dataform" label-width="140px" :model="dataform" >
          <el-form-item label="用户名：" prop="uName">
            <el-input v-model="dataform.uName" placeholder="请输入6位及以上字符" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="pwd">
            <el-input v-model="dataform.pwd" placeholder="数字+字母共8位字符" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item label="账户状态：">
            <el-select  v-model="dataform.status" placeholder="账户状态" clearable style="width:100%" disabled>
              <el-option v-for="item in status1" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色：" prop="roleCode">
            <el-select  v-model="dataform.roleCode" placeholder="角色选择" clearable style="width:100%">
              <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.roleCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('dataform')" icon='el-icon-document'>注册</el-button>
            &nbsp;
            <a @click="$router.go(-1)">
              <el-button type="danger" native-type="button" icon="el-icon-refresh-left">取消</el-button>
            </a>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetStaffDetail,RegisterStaff} from '../../../services/staffmanagement'
import {GetRoleList} from '../../../services/sys_roles'
import {GetDictionary} from '../../../services/dictionary'

export default {
  data() {
    return {
      filterQuery: {
        name: '',
        employeeID:'',
        topFourCompanyName:null,
        companyName:null,
      },
      dataform:{
        uName: '',
        employeeID:'',
        pwd: '',
        status:'启用',
        description:'',
        roleCode:'',
      },
      status1:[],
      roles:[],
      tableData:[],
      ID:"",
      rules:{
        uName :[{required: true, message: '请填写用户名', trigger: 'blur' }],
        pwd :[{required: true, message: '请填写密码', trigger: 'blur' }],
        // status :[{required: true, message: '请选择用户状态', trigger: 'change' }],
        roleCode :[{required: true, message: '请选择用户角色', trigger: 'change' }],
      }
    }
  },
  mounted () {
    this.handleRoleList()
    this.handleGetStaffDetail() //根据员工ID获取单个员工的详细信息
    this.handlestatus() //获取账户状态
  },
  methods: {

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
          //  for(let i=0;i<res.data.list.length;i++){
          //       this.tableData.push((res.data.list[i]))  
          //   }   
            for(let i=0;i<res.data.list.length;i++)
            {
              this.roles[i]={"roleCode": res.data.list[i].roleCode,"name" : res.data.list[i].name}
            }     
    })
    },

    //根据员工ID获取单个员工的详细信息
    handleGetStaffDetail () {
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      const id = JSON.parse(localStorage.getItem('data'));
      // alert(JSON.stringify(id))
      GetStaffDetail(id).then((res) => {
        // alert(JSON.stringify(res.data))
        this.ID = id
        this.filterQuery = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },

    //提交注册
    handleSubmit(formName) {
    this.$refs[formName].validate((valid) => {
      if (valid) {
        this.dataform.employeeID=this.filterQuery.employeeID
        // alert(JSON.stringify(this.dataform)) //弹窗显示json数据
        RegisterStaff(this.dataform.employeeID,this.dataform).then(() => {
          // alert(JSON.stringify(this.dataform)) //弹窗显示json数据
          this.$message.success('操作成功')
          this.$router.go(-1)     //返回上一url
          }, (err) => {
            this.$message.error(err.message)
            })
            // alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
              }
              });
              },

  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 400px;
}
</style>
