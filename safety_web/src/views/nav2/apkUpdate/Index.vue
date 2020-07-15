<template>
  <div>
    <div class="page-title"  style="width:100%">发布版本</div>
    <div class="page-content"  style="font-size:20px;border-top: 1px solid #dddddd;">
      <div class="form-content">
        <!-- 获取当前服务的版本号 -->
        <el-form label-width="140px" style="width:100%" :model="serverVersion">
          <el-row style="padding-bottom:5px">
            <font style="font-size:15px;font-weight:bold">版本号</font>
          </el-row>
          <el-row style="padding-top:10px; border-top: 2px solid #dddddd">
            <el-form-item label="正在服务的版本号">
              <el-input type="text" style="width:35%" readonly v-model="serverVersion.version"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <!-- 发布最新数据配置 -->
        <el-form label-width="140px" style="width:100%">
          <el-row style="padding-bottom:5px">
            <font style="font-size:15px;font-weight:bold">数据配置</font>
          </el-row>
          <el-row style="padding-top:10px; border-top: 2px solid #dddddd">
            <el-form-item label="数据配置发布">
              <el-button type="primary" @click="handlePublishServerVersion()">发布最新数据配置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
        <!-- 获取历史版本号 -->
        <el-form label-width="140px" style="width:100%">
          <el-row style="padding-bottom:5px">
            <font style="font-size:15px;font-weight:bold">历史版本</font>
          </el-row>
          <el-row style="padding-top:10px; border-top: 2px solid #dddddd">
            <el-form-item label="回到以前版本">
              <el-table
              :data="previousVrsionList"
              border
              style="width: 100%"
              height="450px">
                <el-table-column label="序号" width="100%" header-align="center" align="center" type="index"></el-table-column>
                <el-table-column prop="serverVersion" label='历史版本号' header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" align="center" header-align="center" width="150%"  fixed="right">
                  <template slot-scope="scope">
                    <div class="inline-td">
                      <el-button size="mini" type="primary" @click="handleSubmitReturn(scope.row)">确认选择</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-row>
        </el-form>
        <!-- 更新APK -->
        <!-- <el-form label-width="145px" style="width:100%" :model="apkData" ref="apkData" :rules="rules">
          <el-row style="padding-bottom:5px">
            <font style="font-size:15px;font-weight:bold">APK更新</font>
          </el-row>
          <el-row style="padding-top:10px; border-top: 2px solid #dddddd">
            <el-form-item label="选择开始服务时间" prop="beginningServiceTimes">
              <el-date-picker
              v-model="apkData.beginningServiceTimes"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择开始服务时间"
              style="width:35%">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="APK文件上传">
              <el-upload
              v-model="apkData.apkAddress"
              :action="`/api/app_apk`"
              :on-remove="handleRemove"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              :file-list="fileList"
              :on-success="handleSuccess"
              list-type="text"
              accept=".apk,.APK">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">请上传一个正确的APK文件。</div>
              </el-upload>
            </el-form-item>
          </el-row>
          <el-row class="buttons">
            <el-form-item>
              <el-button type="primary" style="width:100px" @click="handleSubmitUpload('apkData')">确认上传</el-button>   
            </el-form-item>
          </el-row>
        </el-form> -->
      </div>
    </div>
  </div>
</template>

<script>
import {GetVersionNumber} from '../../../services/apkUpdate'
import {PublishServerVersion} from '../../../services/apkUpdate'
import {GetPreviousVersion} from '../../../services/apkUpdate'
import {UpdateServerVersion} from '../../../services/apkUpdate'
import {UploadApk} from '../../../services/apkUpdate'
import { GetCurrentUser } from '../../../store/CurrentUser';

const DefaultQueryServerVersion = {
  isOrderBy:true,
}
const DefaultQueryPreviousVrsion = {
  isOrderBy:true,
}

export default {
  data() {
    return {
      isRouterAlive: true,
      serverVersion:{
        version:''
      }, //正在服务的版本号
      previousVrsionList:[],
      fileList:[],
      apkData:{
        beginningServiceTimes:'',
        apkAddress:'',
        version:''
      },
      rules:{beginningServiceTimes :[{required: true, message: '请选择开始服务时间', trigger: ['blur', 'change'] }]}
    }
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    }
  },
  mounted () {
    this.handleGetVersionNumber()
    this.handleGetPreviousVersion()
    // this.handleGetTime()
  },
  methods: {
//获取当前服务的版本号
    handleGetVersionNumber(){
      //从query读取过滤条件
        this.filterQuery = {...DefaultQueryServerVersion, ...this.$route.query}
        //从query中取到的参数是string的,要转成element要求的number
        this.filterQuery = {...this.filterQuery}
        this.loading = true
      GetVersionNumber(this.filterQuery).then((res) => {
        this.serverVersion.version = res.data.list[0].serverVersion1 + '.' +res.data.list[0].serverVersion2 + '.' + res.data.list[0].serverVersion3
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
//发布最新数据配置
    handlePublishServerVersion(){
      PublishServerVersion(this.serverVersion).then(() => {
        this.$router.go(0)
      }).catch((err) => {
        this.$message.error(err.message)
      })
      this.$message.success('发布成功')
    },
//回到以前版本
    //1、获取所有历史版本号，显示在table
    handleGetPreviousVersion(){
      //从query读取过滤条件
        this.filterQuery = {...DefaultQueryPreviousVrsion, ...this.$route.query}
        //从query中取到的参数是string的,要转成element要求的number
        this.filterQuery = {...this.filterQuery}
        this.loading = true
      GetPreviousVersion(this.filterQuery).then((res) => {
        if (JSON.stringify(res.data) === '{}') {
          this.previousVrsionList = []
        }else{
          this.previousVrsionList = res.data.list
          for(let i=0; i<this.previousVrsionList.length ;i++){
            this.previousVrsionList[i].serverVersion = this.previousVrsionList[i].serverVersion1 + '.' +this.previousVrsionList[i].serverVersion2 + '.' + this.previousVrsionList[i].serverVersion3
          }
        }
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    //2、确认选择回到以前版本
    handleSubmitReturn(item){
      this.$confirm('确定回到以前版本?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UpdateServerVersion(item.servicerId).then(() => {   
          this.$router.go(0)
        }).catch((err) => {
          this.$message.error(err.message)
        })
        this.$message.success('更新成功')
      })
    },
//APK更新
    //上传文件，返回data
    handleRemove() {
      this.apkData.apkAddress = null
      this.apkData.beginningServiceTimes	 = null
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
      this.apkData.apkAddress = response.fileName
      }
    },
    //3、确认上传APK文件
    handleSubmitUpload(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.apkData.version = this.serverVersion.version
          UploadApk(this.apkData).then(() => {
            this.$router.go(0)
          },(err) => {
            this.$message.error(err.message)
          })
          this.$message.success('上传成功')
        } else {
          return false;
        }
      })
      
    },
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 1000px;
}
.buttons{
  display: flex; 
  justify-content: flex-end;
  align-items: center; 
  padding: 0%
}
</style>
