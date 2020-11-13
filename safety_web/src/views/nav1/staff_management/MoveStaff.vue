<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">员工管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>员工调动</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="100px" :model="formData" @submit.native.prevent="handleSubmit">
          <el-form-item label="  姓  名:  ">
            {{formData.name}}
          </el-form-item>
          <el-form-item label="二级单位:">
            {{formData.topFourCompanyName}}
          </el-form-item>
          <el-form-item label="底层单位:">
            {{formData.companyName}}
          </el-form-item>
          <br>
          <el-form-item label="目标单位：">
            <treeselect
          :multiple="false"
          :options="options"
          placeholder="选择单位"
          v-model="formData.companyCode"      
          style="width:300px"
          /> 
          </el-form-item> 
          <el-form-item>
            <el-button type="primary" native-type="submit" icon='el-icon-sort'>调动</el-button>
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
import {UpdateStaff,GetStaffDetail} from '../../../services/staffmanagement'
import {GetCompany} from  '../../../services/problemRankAnalysis'
// import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
  data() {
    return {
      // formData: {
      //   name: '',
      //   companyName:null,
      //   companyCode:null,
      //   topFourCompanyName:null,
      // },
      formData:{},
      options:[],
      tableData:[],
      ID:""
    }
  },
  mounted () {
    this.handleGetStaffDetail() //根据员工ID获取单个员工的详细信息
    this.handleGetCompany() //获取单位树状图数据
  },
  methods: {
    //获取单位树状图
    handleGetCompany(){
      GetCompany().then((res) => {
        // console.log(res)
        this.options = res.data 
    }).catch((err) => {
      this.$message.error(err.message)
    })
    },
    
    //根据员工ID获取单个员工的角色
    handleGetStaffDetail(){
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      const id = JSON.parse(localStorage.getItem('data'));
      GetStaffDetail(id).then((res) => {
        this.ID = id
        this.formData = res.data
        // alert(JSON.stringify(this.formData))
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
  

    //提交
    handleSubmit () {
      UpdateStaff(this.ID, this.formData).then(() => {
        // alert(JSON.stringify(this.formData))
        this.$message.success('操作成功')
        this.$router.go(-1) //返回上一url
      }, (err) => {
        this.$message.error(err.message)
      })
    },

  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 400px;
}
</style>
