<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">任务目标配置</a></el-breadcrumb-item>
        <el-breadcrumb-item>新建任务编码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="140px" :model="formData"  ref="formData" :rules="rules"  >
          <!-- <el-form-item label="任务编码：" prop="taskObjectCode"> 
            <el-input v-model="formData.taskObjectCode" placeholder="任务编码"></el-input>
          </el-form-item> -->
          <el-form-item label="任务目标名称：" prop="taskObjectName">
            <el-input v-model="formData.taskObjectName" placeholder="任务名称"></el-input>
          </el-form-item>
           <el-form-item label="任务目标状态：" prop="status">
                <el-select v-model="formData.status" placeholder="任务状态" style="width: 100%;">
                    <el-option label="启用" value="启用"></el-option>
                    <el-option label="停用" value="停用"></el-option>
                </el-select>
          </el-form-item>  
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('formData')" >确定</el-button>
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
import {CreateObjectTask} from '../../../services/taskobject'
export default {
  data() {
    return {
      formData: {
        taskObjectCode: '',
        taskObjectName: '', 
        status: ''
      },
      rules:{
        // taskObjectCode :[{required: true, message: '请填写任务编码', trigger: 'blur' }],
        taskObjectName :[{required: true, message: '请填写任务目标名称', trigger: 'blur' }],
        status :[{required: true, message: '请选择任务目标状态', trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted () {
  },
  methods: {
  
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          CreateObjectTask(this.formData).then(() => {
          this.$message.success('创建成功')
          this.$router.go(-1) //返回上一url
        }).catch((err) => {
          this.$message.error(err.message)
        })
          // alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 400px;
}
</style>
