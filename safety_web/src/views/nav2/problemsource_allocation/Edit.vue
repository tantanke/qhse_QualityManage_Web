<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">问题原因配置</a></el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form  ref="problemSource" :rules="rules" label-width="140px" :model="problemSource" >
          <!-- <el-form-item label="原因编码：" prop="problemSourceCode">
            <el-input v-model="problemSource.problemSourceCode" placeholder="请输入编码"></el-input>
          </el-form-item> -->
          <el-form-item label="原因名称：" prop="problemSourceName">
            <el-input v-model="problemSource.problemSourceName" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('problemSource')">确定</el-button>
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
import {UpdateProblemSource, GetProblemSourceListDetail} from '../../../services/problemSource'

export default {
  data() {
    return {
      problemSource: {
        // problemSourceCode: '',
        problemSourceName: ''
      },
      rules:{
        // problemSourceCode :[{required: true, message: '请填写问题原因编码', trigger: 'blur' }],
        problemSourceName :[{required: true, message: '请填写问题原因名称', trigger: 'blur' }]
      }
    }
  },

  mounted () {
    this.getProblemSource() 
  },
  methods: {
    //提交  
    handleSubmit (formName) {
       this.$refs[formName].validate((valid) => {
          if (valid) {
            UpdateProblemSource(this.problemSource.problemSourceID,this.problemSource).then(() => {
              this.$message.success('创建成功')
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
    getProblemSource () {
      const id = this.$route.params.id
      GetProblemSourceListDetail(id).then((res) => {
        this.problemSource = res.data
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
