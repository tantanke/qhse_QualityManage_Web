<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">学习案例</a></el-breadcrumb-item>
        <el-breadcrumb-item>修改案例</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="140px" :model="formData" ref="formData" :rules="rules" style="width:150%">
          <el-row>
            <el-col :span="12">
              <el-form-item label="案例名称" prop="caseName">
                <el-input v-model="formData.caseName" placeholder="请输入案例名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发生时间" prop="checkDate">
                <el-date-picker v-model="formData.checkDate" 
                type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" 
                placeholder="请选择发生日期" style="width:100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="地点" prop="address">
                <el-input v-model="formData.address" placeholder="请输入案例发生地点"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务" prop="task">
                <el-select v-model="formData.task" placeholder="请选择任务名称" style="width:100%" @change="onChangedTask" clearable>
                  <el-option v-for="item in tasks" :key="item.taskAndProcessCode" :label="item.taskAndProcessName" :value="item.taskAndProcessName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="问题原因" prop="source">
                <el-select v-model="formData.source" placeholder="请选择问题原因" style="width:100%" @change="onChangedSource" clearable>
                  <el-option v-for="item in sources" :key="item.problemSourceID" :label="item.source" :value="item.problemSourceName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工序" prop="process">
                <el-select v-model="formData.process" placeholder="请选择工序名称" style="width:100%" @change="onChangedProcess" clearable>
                  <el-option v-for="item in processes" :key="item.taskAndProcessCode" :label="item.process" :value="item.taskAndProcessName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>          
          <el-form-item label="问题描述">
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.description" placeholder="请输入问题描述"></el-input>
          </el-form-item>
          <el-form-item label="解决描述">
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.rectiMeasure" placeholder="请输入解决描述"></el-input>
          </el-form-item>
          <el-form-item label="文档附件">
           <el-upload
              v-model="formData.attach"
              :action="`/api/file_upload`"
              :on-remove="handleRemove"
              :before-upload="handleBeforeUpload"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              :file-list="fileList"
              :on-success="handleSuccess"
              limit="1"
              list-type="text"
              accept=".pdf,.PDF,.docx,.DOCX">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传一个word文件，且不超过12M。</div>
            </el-upload>
          </el-form-item>
          <el-form-item class="buttons">
            <el-button type="primary" style="width:100px" @click="handleSubmit('formData')">确定</el-button>
            &nbsp;
            <a @click="$router.go(-1)">
              <el-button type="info" style="width:100px" native-type="button">取消</el-button>
            </a>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetStudyCaseDetail,UpdateStudyCase} from '../../../services/studyCase'
import {GetProblemSourceNames,GetTasks,GetProcesses} from '../../../services/studyCase'
import { GetCurrentUser } from '../../../store/CurrentUser';



export default {
  data() {
    return {
      formData: {
        caseName:'',
        taskAndProcessCode:'',
        address:'',
        checkDate:'',
        problemSourceCode:'',
        task:'',
        process:'',
        description:'',
        source:'',
        rectiMeasure:'',
        attach:'',
      },
      //三个下拉框，如下
      tasks: [], //任务名称
      processes: [],//工序名称
      sources: [],//问题原因
      fileList:[],//附件列表
      rules:{
        caseName :[{required: true, message: '请填写案例名称', trigger: 'blur' }],
        checkDate :[{required: true, message: '请选择时间', trigger: ['blur', 'change'] }],
        address :[{required: true, message: '请填写地点', trigger: 'blur' }],
        task :[{required: true, message: '请选择任务', trigger: ['blur', 'change'] }],
        source :[{required: true, message: '请选择问题原因', trigger: ['blur', 'change'] }],
        process :[{required: true, message: '请选择工序', trigger: ['blur', 'change'] }]
      }
    }
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    }
  },
  mounted () {
    this.handleGetStudyCaseDetail()
    this.handleGetProblemSourceNames()
    this.handleGetTaskProcedure()
  },
  methods: {
    //根据problemID获取单个问题详细信息
    handleGetStudyCaseDetail () {
      // const id = this.$route.params.id
      //以下两句话，刷新页面时，数据不会丢失，保存了id
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      const id = JSON.parse(localStorage.getItem('data'));
      GetStudyCaseDetail(id).then((res) => {
        this.formData = res.data
        this.formData.attach = null         //初始将attach置为null，不修改附件时，传null到后端，不修改之前附件。
        this.formData.taskAndProcessCode = res.data.taskAndProcessCode.substr(0, 2)
        this. handleGetProcesses()
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    
    //获取问题原因、问题原因编码，改变问题原因时，将编码赋值给formData.problemSourceCode传递给后台
    handleGetProblemSourceNames () {
      GetProblemSourceNames({}).then((res) => {      
          this.sources = res.data.list
      }).catch((err) => {
          this.$message.error(err.message)
      })
    },
    
    onChangedSource(selectValue) {
      let obj = {}
         //遍历下拉数组中的item
        obj = this.sources.find((item)=>{
          return item.problemSourceName === selectValue
        })
        this.formData.problemSourceName = obj.problemSourceName     
        this.formData.problemSourceCode = obj.problemSourceCode   
    },
    
    //获取任务名称、任务工序、任务工序编码。
    handleGetTaskProcedure(){
      GetTasks({name:''}).then((res) => {   
        for(let i=0;i<res.data.list.length;i++){   //筛选编码为2位数
          if(res.data.list[i].taskAndProcessCode.length === 2){
            this.tasks.push(res.data.list[i])
          }
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    onChangedTask(selectValue) {
      let obj = {}
         //遍历下拉数组中的item
        obj = this.tasks.find((item)=>{
          return item.taskAndProcessName === selectValue
        })
        this.formData.task= obj.taskAndProcessName     
        this.formData.taskAndProcessCode = obj.taskAndProcessCode  
        this.processes = []
        this.formData.process = ''
        this.handleGetProcesses() 
    },   
    handleGetProcesses(){
      GetProcesses({taskAndProcessCode:this.formData.taskAndProcessCode}).then((res) => {    
        for(let i=0;i<res.data.list.length;i++){
          this.processes.push(res.data.list[i])
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    onChangedProcess(selectValue){ 
      let obj = {}
         //遍历下拉数组中的item
        obj = this.processes.find((item)=>{
          return item.taskAndProcessName === selectValue
        })
        this.formData.process = obj.taskAndProcessName     
        this.formData.taskAndProcessCode = obj.taskAndProcessCode   
    },
    
    // 上传文件之前
    handleBeforeUpload(file){
      let size = file.size / 1024 / 1024 / 12
      if(size > 12) {
        this.$notify.warning({
          title: '警告',
          message: '文件大小必须小于12M'
        })
      }
    },
    //文档附件
    handleRemove() {
      this.formData.attach = null
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response){
      if(response) {
        this.$notify.success({
          body:{
            style:{width:'300px',height:'500px'}
          },
          title:'提示',
          message: '文件上传成功'
        })
      }
      this.formData.attach = response.data
    },
    //确认创建
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          UpdateStudyCase(this.formData.id, this.formData).then(() => {
            this.$message.success('创建成功')
            this.$router.go(-1) //返回上一url
          },(err) => {
            this.$message.error(err.message)
          })
        } else {
          this.$notify.warning({
            title: '温馨提示',
            message: '请检查必填项！！！'
          })
          return false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 600px;
}
.buttons{
  display: flex; 
  justify-content: flex-end;
  height: 50px;
  align-items: center; 
  padding-right: 5%;
}
</style>
