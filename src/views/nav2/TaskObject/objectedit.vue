<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">任务目标</a></el-breadcrumb-item>
        <el-breadcrumb-item>任务目标修改</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="140px" :model="formData"  ref="formData" :rules="rules" >
          <!-- <el-form-item label="任务编码:" prop="taskObjectCode">
            <el-input v-model="formData.taskObjectCode" placeholder="任务编码" width=150></el-input>
          </el-form-item> -->
           <el-form-item label="任务目标名称:" prop="taskObjectName">
            <el-input v-model="formData.taskObjectName" placeholder="任务名称"></el-input>
          </el-form-item>
           <el-form-item label="任务目标状态:" prop="status">
               <el-select v-model="formData.status" placeholder="任务状态" style="width: 100%;">
                   <el-option label="启用" value="启用"></el-option>
                   <el-option label="停用" value="停用"></el-option>
               </el-select>
          </el-form-item >
           <el-form-item >
           &nbsp;
            <el-button type="primary" @click="handleSubmit('formData')" >确定</el-button>
            &nbsp;
            <a @click="$router.go(-1)">
              <el-button type="info" native-type="button">取消</el-button>
            </a>
             </el-form-item >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetTaskObjectDetail,UpdateObjectTask} from '../../../services/taskobject'
export default {
  data() {
    return {
      // TaskObject_ID: '',
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
     this.taskObject()
  },
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            UpdateObjectTask(this.formData).then(() => {
              this.$message.success('操作成功')
              this.$router.go(-1) //返回上一url
              }, (err) => {
                this.$message.error(err.message)
                })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
     taskObject () {
      const id = this.$route.params.id
      GetTaskObjectDetail(id).then((res) => {
        // this.TaskObject_ID = res.data.id
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
