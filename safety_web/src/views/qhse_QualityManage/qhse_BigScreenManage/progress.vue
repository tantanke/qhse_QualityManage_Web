<template>
  <div>
     <div class="page-title" style="width:100%">标准进度管理 </div>
     <div class="page-content">
          <el-row style="margin-top:1%">
              <el-form :inline="true" >
                <el-form-item>
                    <el-form-item label='选择公司：' labelWidth='120px'>
                        <el-cascader
                        v-model="chooseItem"
                        :options="companyList"
                        :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                        :show-all-levels="false"
                        @change="handleChange"
                        ref="cascaderAddr"  
                        :clearable='true'        
                        >             
                      </el-cascader>
                    </el-form-item>
                </el-form-item>
                 <el-form-item>
                    <el-button type='primary' icon="el-icon-search" @click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item>
                   <el-upload ref="upload" action='/api/uploadDashboardScheduleManagement'  :headers="headers" :show-file-list="false"
               accept=".excel, .xls, .xlsx" :on-progress="handleProgress">
						<el-button icon="el-icon-upload" type="success" @click="importFile">数据导入</el-button>
					</el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button type='info' icon="el-icon-download" @click="downLoadFile">模板下载</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                  <el-table
                        :data="listData"
                        v-loading='loading'
                        element-loading-text="查询中"
                        style="width: 100%;text-align:center"
                        ref="treeTable"
                        row-key="code"
                        :indent="30"
                        max-height="560"
                        highlight-current-row
                        border>
                        <el-table-column align='center' prop='companyName' label='单位名称'></el-table-column>
                        <el-table-column align='center' prop='planNum' label='初稿计划数数'></el-table-column>
                        <el-table-column align='center' prop='firstDraftFinishNum' label='初稿完成数'></el-table-column>
                        <el-table-column align='center' prop='firstDraftFinishRate' label='初稿完成率'></el-table-column>
                        <el-table-column align='center' prop='ReviewPassNum' label='评审通过数'></el-table-column>
                        <el-table-column align='center' prop='ReviewPassRate' label='评审通过率'></el-table-column>
                        <el-table-column align='center' prop='StandardReleaseNum' label='标准发布数'></el-table-column>
                        <el-table-column align='center' prop='StandardReleaseRate' label='标准发布率'></el-table-column>
                        <el-table-column align='center' prop='updateTime' label='填报时间'></el-table-column>
                      </el-table>
            </el-row> 
      </div>
  </div>
</template>

<script>
import CurrentUser from '@/store/CurrentUser'
import {queryDashboardScheduleManagement,GetqhseCompanytree,downloadDashboardScheduleManagementTemplate,downloadfile} from '@/services/qhseDashboard/index'
export default {
    data() {
      return {
        selectdate: '',
        chooseItem:'',
        companyId:'',
        searchForm:{companyCode:''},
        companyList:[],
        listData:[],
        loading:false,
        headers:{Authorization:CurrentUser.get().token}
      }
    },
    methods: {
      searchData(){
        this.loading = true
        queryDashboardScheduleManagement(this.searchForm).then(res => {
          this.listData = res.data
           this.loading = false
         console.log(res.data)
        }).catch(() => {
           this.loading = false
          this.$message.error("查询失败，请稍后再试！")
        })
      },
      getUrl(baseurl,data) {
            let url = baseurl+'?'
            Object.keys(data).forEach( (key)=> {
                 url =  `${url}${key}=${data[key]}&`        
                });
                url = url.substring(0,url.length-1)
            return url
        },
      importFile(){

      },
      downLoadFile(){
        downloadDashboardScheduleManagementTemplate().then(res =>{
          downloadfile('标准进度管理模板',res.file.data)

        })
      },
       getCompany(){
        GetqhseCompanytree().then(res =>{
               this.companyList = res.data
        }).catch(() =>{
          this.$message.error("查询失败，请稍后再试！")
          
        })
        
      },
      handleChange(){
        this.searchForm.companyCode = this.chooseItem[this.chooseItem.length - 1]    
      },
      handleProgress(){
            this.$alert('文件上传中，请稍候', '文件上传')
        },
      
    },
    mounted() {
      this.getCompany()
    },
}
</script>

<style>

</style>