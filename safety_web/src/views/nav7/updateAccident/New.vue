<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">事故</a></el-breadcrumb-item>
        <el-breadcrumb-item>创建事故</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
       <el-form label-width="150px" :model="formData" ref="formData" :rules="rules">
         <el-row>
           <el-col :span="12">
             <el-form-item label="事故名称" prop="accidentRecordName">
               <el-input v-model="formData.accidentRecordName" placeholder="事故名称"></el-input>
               </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="事故地点" prop="address">
               <el-input v-model="formData.address" placeholder="事故地点"></el-input>
               </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
          <el-form-item label="事故单位" prop="companyCode">
            <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择单位名称"
              v-model="formData.companyCode"
              style="width:100%"/> 
					</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="作业项目" prop="workItem">
               <el-input v-model="formData.workItem" placeholder="作业项目" ></el-input>
             </el-form-item>
             <!-- <el-form-item label="事故单位ID">
            <el-input v-model="formData.companyCode" placeholder="事故单位ID"></el-input>
          </el-form-item> -->
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="事故类别" prop="accidentRecordType" >
            <el-select clearable  v-model="formData.accidentRecordType" placeholder="事故类别" style="width: 100%;" @change="onSelectedAccidentRecordType">
              <el-option
                v-for="item in accidentRecordTypes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="事故级别" prop="accidentClass">
            <el-select  clearable v-model="formData.accidentClass" placeholder="事故级别" style="width: 100%;" @change="onSelectedaccidentClass">
              <el-option
                v-for="item in accidentClasses"
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
             <el-form-item label="发生时间" prop="checkDate">
            <el-date-picker
               v-model="formData.checkDate"
               type="date"
               placeholder="选择日期"
               format="yyyy-MM-dd"
               value-format="yyyy-MM-dd"
               style="width:100%">
            </el-date-picker>
          </el-form-item>
           </el-col>
         </el-row>
          <el-form-item label="事故描述">
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="formData.description" placeholder="事故描述"></el-input>
          </el-form-item>
          <el-form-item label="文档附件">
            <el-upload
              v-model="formData.attach"
              :action="`/api/file_upload`"
              :on-remove="handleRemove"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              :file-list="fileList"
              :on-success="handleWordSuccess"
              :before-upload="handleBeforeUpload"
              list-type="text"
              accept=".pdf,.PDF,.docx,.DOCX">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传一个word文档或者pdf文件，且不超过2M。</div>
            </el-upload>
          </el-form-item>
          <el-row>
            <el-col :span="12">
               <el-form-item label="图片附件1" >
            <el-upload
              v-model="formData.attach1"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-remove="handleRemove1"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleImgSuccess1"
               :before-upload="handleBeforeUpload"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
              <!-- <div slot="tip" class="el-upload__tip">请上传一张图片</div> -->
            </el-upload>
          </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="图片附件2">
            <el-upload
              v-model="formData.attach2"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-remove="handleRemove2"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleImgSuccess2"
               :before-upload="handleBeforeUpload"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
              <!-- <div slot="tip" class="el-upload__tip">请上传一张图片</div> -->
            </el-upload>
             
          </el-form-item>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="12">
              <el-form-item label="图片附件3">
            <el-upload
              v-model="formData.attach3"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-remove="handleRemove3"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleImgSuccess3"
              :before-upload="handleBeforeUpload"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
              <!-- <div slot="tip" class="el-upload__tip">请上传一张图片</div> -->
            </el-upload>
            
          </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图片附件4">
            <el-upload
              v-model="formData.attach4"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-remove="handleRemove4"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleImgSuccess4"
              :before-upload="handleBeforeUpload"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
              <!-- <div slot="tip" class="el-upload__tip">请上传一张图片</div> -->
            </el-upload>
             
          </el-form-item>
            </el-col>
          </el-row>     
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
import {CreateAccident} from '../../../services/accident'
import {GetDictionary} from '../../../services/dictionary'
import {GetCurrentUser} from '../../../store/CurrentUser'
import {GetCompany} from  '../../../services/problemRankAnalysis'
export default { 
  data() {
    return {
      formData: {
        accidentRecordName: '',
        companyCode:null,
        // companyName: '',
        workItem: '',
        accidentRecordTypeCode:'',
        accidentRecordType:'',
        accidentClassCode:'',
        accidentClass:'',
        address:'',
        checkDate:'',
        description:'',
        attach:'',
        attach1:'',
        attach2:'',
        attach3:'',
        attach4:'',
      },
      accidentRecordTypes: [],
      accidentClasses: [],
      fileList:[],//附件列表
      companyLoading: false,
      // companys: [],
      options:[],
      rules:{
        accidentRecordName :[{required: true, message: '事故名称不能为空', trigger: 'blur' }],
        address :[{required: true, message: '事故地点不能为空', trigger: 'blur' }],
        companyCode :[{required: true, message: '事故单位不能为空', trigger: ['blur', 'change'] }],
        workItem :[{required: true, message: '作业项目不能为空', trigger: 'blur' }],
        accidentRecordType :[{required: true, message: '事故类别不能为空', trigger: ['blur', 'change'] }],
        accidentClass :[{required: true, message: '事故级别不能为空', trigger: ['blur', 'change'] }],
        checkDate :[{required: true, message: '事故发生时间不能为空', trigger: ['blur', 'change'] }]
      }
     
   
    }
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    },
  },
  mounted () {
    this.getaccidentRecordType()
    this.getaccidentClass()
    this.handleGetCompany()
    this.handleGetDate()
  },
  
  methods: {
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            CreateAccident(this.formData).then(() => {
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
     //获取底层单位
      handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    // ongetcompanyName(selectValue){
    //   let obj = {}
    //   obj = this.options.find((item)=>{
    //      return item.companyCode === selectValue     
    //  })
    //   this.formData.companyName= obj.label

    // },

    // handleCompanySearch (val='') {
		// 		this.companyLoading = true
		// 		GetCompanys({sonName: val, type: "all"}).then((res) => {
    //       this.companys = res.data
		// 			this.companyLoading = false
		// 		}).catch((err) => {
		// 			this.$message.error(err.message)
		// 			this.companyLoading = false
		// 		})
    //   },
    // onSelectedCompany(selectValue) {
    //      let obj = {}
    //      //遍历下拉数组中的item
    //      obj = this.companys.find((item)=>{
    //        return item.sonCode === selectValue
    //      })
    //     this.formData.companyName = obj.parentName+'('+obj.sonName+')'
    //     this.formData.parentCompanyName = obj.parentName        
    // },
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
    getaccidentRecordType () {
      GetDictionary({name: '事故类别'}).then((res) => {
        this.accidentRecordTypes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //事故类别编码
    onSelectedAccidentRecordType(selectValue){
      let obj = {}
         //遍历下拉数组中的item
        obj = this.accidentRecordTypes.find((item)=>{
          return item.name === selectValue
        })
        this.formData.accidentRecordTypeCode = obj.dictCode  
        alert(this.formData.accidentRecordTypeCode)  
    },

     getaccidentClass() {
      GetDictionary({name: '事故级别'}).then((res) => {
        this.accidentClasses = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //事故级别编码
    onSelectedaccidentClass(selectValue){
      let obj = {}
         //遍历下拉数组中的item
        obj = this.accidentClasses.find((item)=>{
          return item.name === selectValue
        })
        this.formData.accidentClassCode = obj.dictCode   
        
        // alert(this.formData.accidentClassCode)  

    },
    //上传文件之前
  // 上传文件之前
     handleBeforeUpload(file){
      const isLt2M = file.size / 1024 / 1024 < 12;
      if(!isLt2M) {
        this.$message.error('文件大小必须小于12M！');
      }
      return isLt2M;
    },
    // //文档附件
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    //删除文档图片附件
    handleRemove() {
      this.formData.attach=null
    },
     handleRemove1() {
      this.formData.attach1=null
    },
     handleRemove2() {
       this.formData.attach2=null
    },
     handleRemove3() {
      this.formData.attach3=null
    },
     handleRemove4() {
       this.formData.attach4=null
    },

    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //文件图片上传成功
    handleWordSuccess(response){
      this.formData.attach = response.data
    },
    handleImgSuccess1(response){
      this.formData.attach1 = response.data
    },
    handleImgSuccess2(response){
      this.formData.attach2 = response.data
    },
    handleImgSuccess3(response){
      this.formData.attach3 = response.data
    },
    handleImgSuccess4(response){
      this.formData.attach4= response.data
    },

    
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 800px;
}


</style>

