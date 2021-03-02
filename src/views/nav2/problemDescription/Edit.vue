<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">问题描述</a></el-breadcrumb-item>
        <el-breadcrumb-item>新建问题描述</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="140px" :model="formData" ref="formData" :rules="rules" style="width:150%">
          <el-form-item label="问题级别：" prop="problemRank">
            <el-select v-model="formData.problemRank" placeholder="请选择问题级别" style="width:100%" clearable>
              <el-option 
              v-for="item in problemRanks"
              :key="item.id"
              :label="item.name"
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述：">
            <el-input type="textarea" v-model="formData.description" placeholder="请输入问题描述" :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
         <el-form-item label="问题建议整改措施：">
            <el-input type="textarea" v-model="formData.recommendRectiMeasure" placeholder="请输入问题建议整改措施" :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
          <el-form-item label="问题验证描述：">
            <el-input type="textarea" v-model="formData.verifyDescription" placeholder="请输入问题验证描述" :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
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
import {GetDictionary} from '../../../services/dictionary'
import {UpdateProblemDescription,GetProblemDescriptionDetail} from '../../../services/problemDescription.js'

export default {
  data() {
    return {
      formData: {
        problemRank:'',
        description:'',
        recommendRectiMeasure:'',
        verifyDescription:''
      },
      problemRanks: [], //问题级别
      rules:{
        problemRank :[{required: true, message: '请选择问题级别', trigger: ['blur','change'] }]
      }
    }
  },
  
  mounted () {
    this.getProblemDescriptionDetail()
    this.getProblemRanks()
  },
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          UpdateProblemDescription(this.formData.id, this.formData).then(() => {
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
    getProblemDescriptionDetail () {
      // const id = this.$route.params.id
      //以下两句话，刷新页面时，数据不会丢失，保存了id
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      const id = JSON.parse(localStorage.getItem('data'));
      GetProblemDescriptionDetail(id).then((res) => {
        this.formData = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    getProblemRanks () {
      GetDictionary({name: '问题级别'}).then((res) => {
        this.problemRanks = res.data
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
