<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">事件</a></el-breadcrumb-item>
        <el-breadcrumb-item>新建事件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
       <el-form ref="formData" :rules="rules" label-width="150px" :model="formData">
         <el-row>
           <el-col :span="12">
             <el-form-item label="事件名称:" prop="eventRecordName">
               <el-input v-model="formData.eventRecordName" placeholder="请输入事件名称"></el-input>
               </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="事件地点:" prop="address">
               <el-input v-model="formData.address" placeholder="请输入事件地点"></el-input>
               </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
          <el-form-item label="事件单位:" prop="companyCode">
            <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择单位名称"
              v-model="formData.companyCode"
              style="width:100%"/> 
					</el-form-item>
           </el-col>
            <el-col :span="12">
             <el-form-item label="事件类别:" prop="eventRecordType" >
            <el-select v-model="formData.eventRecordType" placeholder="请选择事件类别" style="width: 100%;" @change="onSelectedEventRecordType" clearable>
              <el-option
                v-for="item in eventRecordTypes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="发生时间:" prop="checkDate" >
            <el-date-picker
               v-model="formData.checkDate"
               type="date"
               placeholder="请选择日期"
               format="yyyy-MM-dd"
               value-format="yyyy-MM-dd"
               style="width:100%">
            </el-date-picker>
          </el-form-item>
           </el-col>
         </el-row>
          <el-form-item label="事件描述:">
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.description" placeholder="请输入事件描述"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
               <el-form-item label="图片附件1:">
            <el-upload
              v-model="formData.attach1"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
              :before-upload="handleBeforeUpload"
              :auto-upload='true'
              :file-list="fileList1"
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess1"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
            </el-upload>
          </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="图片附件2:">
            <el-upload
              v-model="formData.attach2"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove2"
              :before-upload="handleBeforeUpload"
              :auto-upload='true'
              :file-list="fileList2"
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess2"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
            </el-upload>
          </el-form-item>
            </el-col>
            </el-row> 
            <el-row>
            <el-col :span="12">
              <el-form-item label="图片附件3:">
            <el-upload
              v-model="formData.attach3"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove3"
              :before-upload="handleBeforeUpload"
              :auto-upload='true'
              :file-list="fileList3"
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess3"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
            </el-upload>
          </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图片附件4:">
            <el-upload
              v-model="formData.attach4"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove4"
              :before-upload="handleBeforeUpload"
              :auto-upload='true'
              :file-list="fileList4"
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess4"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
            </el-upload>
          </el-form-item>
            </el-col>
          </el-row>        
        <el-form-item label="文档附件:">
            <el-upload
              v-model="formData.attach"
              :action="`/api/file_upload`"
              :on-remove="handleRemove"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              :file-list="fileList"
              :on-success="handleSuccess"
              list-type="text"
              accept=".pdf,.PDF,.docx,.DOCX">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传一个word文档或者pdf文件，且不超过2M。</div>
            </el-upload>
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
import {CreateEvent} from '../../../services/event'
import {GetDictionary} from '../../../services/dictionary'
import {GetCurrentUser} from '../../../store/CurrentUser'
import {GetCompany} from  '../../../services/problemRankAnalysis'
export default { 
  data() {
    return {
      formData: {
        eventRecordName: '',
        companyCode:null,
        eventRecordTypeCode:'',
        eventRecordType:'',
        address:'',
        checkDate:'',
        description:'',
        attach:'',
        attach1:'',
        attach2:'',
        attach3:'',
        attach4:''
      },
      rules:{
        eventRecordName :[{required: true, message: '请填写事件名称', trigger: 'blur' }],
        address :[{required: true, message: '请填写事件地点', trigger: 'blur' }],
        companyCode :[{required: true, message: '请填写事件单位', trigger: 'blur' }],
        eventRecordType :[{required: true, message: '请选择事件类别', trigger: ['blur','change'] }],
        checkDate :[{required: true, message: '请填写发生时间', trigger: ['blur','change']}]
      },
      eventRecordTypes: [],
      options:[],
      fileList:[],//附件列表
      fileList1:[],//图片附件1
      fileList2:[],//图片附件2
      fileList3:[],//图片附件3
      fileList4:[],//图片附件4
    }
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    },
  },
  mounted () {
    this.geteventRecordType()
    this.handleGetDate()
    this.handleGetCompany()
  },
  
  methods: {
  handleSubmit (formName) {
       this.$refs[formName].validate((valid) => {
          if (valid) {
            CreateEvent(this.formData).then(() => {
              this.$message.success('创建成功')
              this.$router.go(-1) //返回上一url
              }).catch((err) => {
                this.$message.error(err.message)
                })
          } else {
           this.$notify.warning({
            title: '温馨提示',
            message: '请检查必填项'
          })
            return false;
          }
        }); 
    },

    geteventRecordType () {
      GetDictionary({name: '事件类别'}).then((res) => {
        this.eventRecordTypes = res.data
         //alert(JSON.stringify(res.data))
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取底层单位
      handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取当前时间
    handleGetDate(){
      let showDate =new Date();
        let seperator ='-';
        let year = showDate.getFullYear();
        let month = showDate.getMonth() + 1;
        var strDate = showDate.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 1 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        this.formData.checkDate = year + seperator + month + seperator + strDate;
        // alert(this.formData.checkDate)
    },
    //事件类别编码
    onSelectedEventRecordType(selectValue){
      let obj = {}
         //遍历下拉数组中的item
        obj = this.eventRecordTypes.find((item)=>{
          return item.name === selectValue
        })
        this.formData.eventRecordTypeCode = obj.dictCode   
        // alert(this.formData.eventRecordTypeCode)  
    },
       
       
    //上传图片之前
     handleBeforeUpload(file){
      const isLt2M = file.size / 1024 / 1024 < 12;
      if(!isLt2M) {
        this.$message.error('文件大小必须小于12M！');
      }
      return isLt2M;
    },
        //文档附件
      handleRemove() {
        this.formData.attach=null;
    
      },
      //图片附件
      handleRemove1() {
        this.formData.attach1=null;
        
      },
      handleRemove2() {
        this.formData.attach2=null;
        
      },
      handleRemove3() {
        this.formData.attach3=null;
        
      },
      handleRemove4() {
        this.formData.attach4=null;
        
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      handleSuccess1(response){
      this.formData.attach1 = response.data
    },
    handleSuccess2(response){
      this.formData.attach2 = response.data
    },
    handleSuccess3(response){
      this.formData.attach3 = response.data
    },
    handleSuccess4(response){
      this.formData.attach4 = response.data
    },
    handleSuccess(response){
      this.formData.attach = response.data
    },
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 800px;
}
</style>