<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">检查类型</a></el-breadcrumb-item>
        <el-breadcrumb-item>修改类型</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="140px" :model="checktype"  ref="checktype" :rules="rules">
          <!-- <el-form-item label="检查类型编码：" prop="checkTypeCode">
            <el-input v-model="checktype.checkTypeCode" placeholder="请输入编码"></el-input>
          </el-form-item> -->
          <el-form-item label="检查类型名称：" prop="checkTypeName">
            <el-input v-model="checktype.checkTypeName" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="检查类型状态：" prop="status">
            <el-select v-model="checktype.status" placeholder="状态" style="width: 100%;">
              <el-option label="启用" value="启用"></el-option>
              <el-option label="停用" value="停用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('checktype')">确定</el-button>
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
import {UpdateCheckType,GetCheckTypeDetail} from '../../../services/checktype'
export default {
  data() {
    return {
      checktype: {
        id: '',
        // checkTypeCode: '',
        checkTypeName: '',
        status: ''
      },
      rules:{
        // checkTypeCode :[{required: true, message: '请填写检查类型编码', trigger: 'blur' }],
        checkTypeName :[{required: true, message: '请填写检查类型名称', trigger: 'blur' }],
        status :[{required: true, message: '请选择检查类型状态', trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted () {
    this.getcheck()
    // this.handleSubmit ()
  },
  methods: {
      //提交确认的方法
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            UpdateCheckType(this.checktype.id,this.checktype).then(() => {
              this.$message.success('编辑成功')
              this.$router.go(-1) //返回上一url
              }).catch((err) => {
                this.$message.error(err.message)
                })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //获取每一条ID的信息
      getcheck () {
      // const id = this.$route.params.id
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      const id = JSON.parse(localStorage.getItem('data'));
      GetCheckTypeDetail(id).then((res) => {
        this.checktype = res.data
      }).catch((err) => { 
        this.$message.error(err.message)
        // alert("error")
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
