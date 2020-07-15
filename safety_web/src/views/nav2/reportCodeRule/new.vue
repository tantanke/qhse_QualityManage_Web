<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">报告编号规则</a></el-breadcrumb-item>
        <el-breadcrumb-item>新增</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form  ref="ReportCodeRule" :rules="rules" label-width="140px" :model="ReportCodeRule" >
          <el-form-item label="基层单位：" prop="companyCode">
            <treeselect
            :multiple="false"
            :options="options"
            placeholder="请选择单位名称"
            v-model="ReportCodeRule.companyCode"
            style="width:250px"/>
          </el-form-item>
          <el-form-item label="业务：" prop="business">
            <el-input type="textarea" style="width:250px" v-model="ReportCodeRule.business" placeholder="请输入业务名称"></el-input>
          </el-form-item>
          <el-form-item label="业务类别：" prop="businessType">
            <el-input type="textarea" style="width:250px" v-model="ReportCodeRule.businessType" placeholder="请输入业务类别"></el-input>
          </el-form-item>
          <el-form-item label="服务内容：" prop="serviceContent">
            <el-input type="textarea" style="width:250px" v-model="ReportCodeRule.serviceContent" placeholder="请输入服务内容"></el-input>
          </el-form-item>
          <el-form-item label="业务编码：" prop="businessCode">
            <el-input v-model="ReportCodeRule.businessCode" style="width:250px" placeholder="请输入业务编码"></el-input>
          </el-form-item>
          <el-form-item label="报告类别：" prop="reportType">
            <el-select style="width:250px" v-model="ReportCodeRule.reportType" filterable allow-create placeholder="选择报告类别" clearable>
              <el-option v-for="item in reportTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('ReportCodeRule')">确定</el-button>
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
import {CreateReportCodeRule,GetReportType} from '../../../services/reportCodeRule'
import {GetCompany} from '../../../services/gettreedata'


export default {
  data() {
    return {
      options: [],
      reportTypes:[],
      ReportCodeRule: {},
      rules:{
        companyCode :[{required: true, message: '请填写基层单位', trigger: 'blur' }],
        // business :[{required: true, message: '请填写业务名称', trigger: 'blur' }],
        // businessType :[{required: true, message: '请填写业务类别', trigger: 'blur' }],
        // serviceContent :[{required: true, message: '请填写服务名称', trigger: 'blur' }],
        businessCode :[{required: true, message: '请填写业务编码', trigger: 'blur' }],
        reportType :[{required: true, message: '请填写报告类别', trigger: 'change' }],
      }
    }
  },

  mounted () {
    this.handleGetCompany()
    this.getreportTypes()
  },
  methods: {
    handleGetCompany(){
        GetCompany().then((res) => {
          this.options = res.data;
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      getreportTypes() {
        GetReportType().then((res) => {
          res.data.forEach(element => {
            this.reportTypes.push({value:element,label:element})
          });
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
    //提交  
    handleSubmit (formName) {
       this.$refs[formName].validate((valid) => {
          if (valid) {
            CreateReportCodeRule(this.ReportCodeRule).then(() => {
              this.$message.success('创建成功')
              this.$router.go(-1)
              }).catch((err) => {
                this.$message.error(err.message)
                })
          } else {
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
