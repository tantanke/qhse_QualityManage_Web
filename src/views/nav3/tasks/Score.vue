<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">任务管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="80px" :model="formData" @submit.native.prevent="handleSubmit">
         
          <el-form-item label="任务评分">
            <el-input v-model="formData.score" placeholder="任务评分"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" native-type="submit">确定</el-button>
            &nbsp;
            <a @click="$router.go(-1)">
              <el-button native-type="button">取消</el-button>
            </a>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import {GetDictionary} from '../../services/dictionary'
import {UpdateTask, GetTaskDetail} from '../../../services/task'
// import {GetEmployees} from '../../services/employee'

export default {
  data() {
    return {
      formData: {
        score:''
      },
    
    }
  },
  mounted () {
    this.getTask()
    this.getRanks()
    this.getTargets()
    this.handleLeaderSearch()
  },
  methods: {
    handleSubmit () {
      UpdateTask(this.formData.taskID, this.formData).then(() => {
        this.$message.success('操作成功')
        this.$router.go(-1) //返回上一url
        
      }, (err) => {
        this.$message.error(err.message)
      })
    },
    getTask () {
      const id = this.$route.params.id
      GetTaskDetail(id).then((res) => {
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
