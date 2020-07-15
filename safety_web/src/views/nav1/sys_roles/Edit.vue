<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">角色管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>修改角色</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="140px" :model="formData" ref="formData" :rules="rules" style="width:150%">
          <!-- <el-form-item label="角色编码：" prop="roleCode">
            <el-input style="width:100%" v-model="formData.roleCode" placeholder="请输入角色编码"></el-input>
          </el-form-item> -->
          <el-form-item label="角色名称：" prop="name">
            <el-input style="width:100%" v-model="formData.name" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" header-align="center">
            <el-input type="textarea" :autosize="{ minRows: 4}" style="width:100%" v-model="formData.description" placeholder="请输入角色描述"></el-input> </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('formData')">确定</el-button>
            &nbsp;
            <a @click="$router.go(-1)">
              <el-button type="info" native-type="button">取消</el-button>
            </a>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetRoleDetail,UpdateRole} from '../../../services/sys_roles'

export default {
  data() {
    return {
      formData: {
        roleID:'',
        roleCode:'',
        name:'',
        description:''
      },
      rules:{
        roleCode :[{required: true, message: '请输入角色编码', trigger: 'blur' }],
        name :[{required: true, message: '请输入角色名称', trigger: 'blur' }],
      }
    }
  },
  
  mounted () {
    this.getRoleDetail()
  },
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          UpdateRole(this.formData.roleID, this.formData).then(() => {
            this.$message.success('操作成功')
            this.$router.go(-1) //返回上一url
          }, (err) => {
            this.$message.error(err.message)
          })
        } else {
          this.$notify.warning({
            title: '温馨提示',
            message: '请检查必填项'
          })
          return false;
        }
      })
    },
    getRoleDetail () {
      // const id = this.$route.params.id
      //以下两句话，刷新页面时，数据不会丢失，保存了id
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      const id = JSON.parse(localStorage.getItem('data'));
      GetRoleDetail(id).then((res) => {
        // console.log(JSON.stringify(res))
        this.formData = res.data
      }).catch((err) => {
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
