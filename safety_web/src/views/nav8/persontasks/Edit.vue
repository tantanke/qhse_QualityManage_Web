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
        <el-form label-width="120px" :model="formData" ref="formData" :rules="rules">
          <el-form-item label="任务名称：" prop="taskName">
            <el-input v-model="formData.taskName" placeholder="任务名称"></el-input>
          </el-form-item>
          <el-form-item label="检查级别：" prop="checkRank">
            <el-select v-model="formData.checkRank" placeholder="检查级别" style="width: 100%;" disabled="true">
              <el-option
                v-for="item in ranks"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检查类型：" prop="checkType" >
            <el-select  clearable v-model="formData.checkType" placeholder="检查类型" style="width: 100%;" disabled="true">
              <el-option
                v-for="item in targets"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主要内容：" prop="mainContain">
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.mainContain" placeholder="主要内容"></el-input>
          </el-form-item>
          <!-- <el-form-item label="任务地点：" prop="address">
            <el-input v-model="formData.address" placeholder="任务地点"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="下达时间：" prop="issueDate">
            <el-date-picker
               v-model="formData.issueDate"
               type="date"
               placeholder="选择日期"
               size="large"
               format="yyyy-MM-dd"
               value-format="yyyy-MM-dd"
               style="width:100%">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="任务负责人：" prop="leaderIDs" >
            <el-select
              v-model="formData.leaderIDs"
              placeholder="输入姓名搜索负责人"
              :filter-method="handleLeaderSearch"
              clearable
              multiple 
              filterable
              :loading="leaderLoading"
              loading-text="查询中..."
              style="width: 100%;">
               <el-option
                v-for="item in leaders"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文档附件：">
            <el-upload
              v-model="formData.attach"
              :action="`/api/file_upload`"
              :on-remove="handleRemove"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              :file-list="fileList"
              :on-success="handleWordSuccess"
              list-type="text"
              accept=".pdf,.PDF,.docx,.DOCX">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传一个word文档或者pdf文件，且不超过2M。</div>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="任务目标：" prop="taskObjectID">
            <el-select v-model="formData.taskObjectID" placeholder="任务目标" style="width: 100%;">
              <el-option
                v-for="item in targets"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
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
import {GetCheckTypeList} from '../../../services/checktype'
import {GetCurrentUser} from '../../../store/CurrentUser'
// import {GetTasksObjectList} from '../../../services/taskobject'
import {UpdateTask, GetTaskDetail} from '../../../services/task'
import {GetEmployees} from '../../../services/employee'
const DefaultQuery = {
  status:'启用'
}
export default {
  data() {
    return {
      formData: {
        taskName: '',
        checkRank: '',
        leaderIDs: [],
        checkType:'',
        mainContain:'',
        attach:'',
        // taskObjectID: '',
        // address:'',
        // issueDate:'',
      },

      leaderLoading: false,
      leaderFilterText: '',
      tableData: [],
      tableData1:[],
      ranks: [],
      targets: [],
      leaders: [],
      filterQuery:'',
       rules:{
        taskName :[{required: true, message: '请填写任务名称', trigger: 'blur' }],
        checkRankID :[{required: true, message: '请选择检查级别', trigger: 'blur' }],
        leaderIDs :[{required: true, message: '请选择负责人', trigger: ['blur', 'change'] }],
        // taskObjectID :[{required: true, message: '请选择任务目标', trigger: ['blur', 'change'] }],
        // issueDate :[{required: true, message: '请填写下达时间', trigger: ['blur', 'change'] }],
        // address :[{required: true, message: '请填写地点', trigger: 'blur' }],
      }
    }
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    },
  },
  mounted () {
    this.getTask()
    this.getRanks()
    this.getTargets()
    this.handleLeaderSearch()
  },
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
              this.formData.leaderIDs=this.formData.leaderIDs.join(',')
              // alert(JSON.stringify(this.formData))
            UpdateTask(this.formData.taskID, this.formData).then(() => {
              // alert(JSON.stringify(this.formData))
              this.$message.success('操作成功')
              this.$router.go(-1) //返回上一url
              }, (err) => {
              this.$message.error(err.message)
          })
          } else {
            return false;
          }
        });
      
    },
    getTask () {
      const id = this.$route.params.id
      GetTaskDetail(id).then((res) => {
        // this.formData.leaderIDs=this.formData.leaderIDs.split(',')
        // alert(JSON.stringify(res.data))
        this.formData = res.data
        this.formData.leaderIDs=this.formData.leaderIDs.split(",")
       this.formData.leaderIDs=this.formData.leaderIDs.map(Number)
        // alert(JSON.stringify(this.formData))
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    getRanks () {
      GetDictionary({name: '检查级别'}).then((res) => {
        this.ranks = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
     getTargets () {
        this.filterQuery = {...DefaultQuery, ...this.$route.query}
        //从query中取到的参数是string的,要转成element要求的number
        this.filterQuery = {...this.filterQuery}
         GetCheckTypeList(this.filterQuery).then((res) => {
            this.tableData=res.data.list
            for(let i=0;i<this.tableData.length;i++)
            {
              this.targets[i]={"id": this.tableData[i].checkTypeCode,"name" : this.tableData[i].checkTypeName}        
            }       
    })
    },
   handleLeaderSearch (val='') {
      this.leaderLoading = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.tableData1 = res.data
        //  alert(JSON.stringify(this.tableData1))
         for(let i=0;i<this.tableData1.length;i++)
            {
              this.leaders[i]={"id": this.tableData1[i].employeeID,"name" : this.tableData1[i].name+'('+this.tableData1[i].companyName+')'}        
            }       
        this.leaderLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading = false
      })
    }, 
    handleRemove(file, fileList) {
      this.formData.attach=null
      console.log(file, fileList);
    },
    //文件图片上传成功
    handleWordSuccess(response){
      console.log(response)
      this.formData.attach = response.data
      console.log(this.formData.attach)
    },
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 400px;
}
</style>
