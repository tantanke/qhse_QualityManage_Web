<template>
  <div>
     <div class="page-title" style="width:100%">标准进度管理 </div>
     <div class="page-content" v-loading='screenLoading' element-loading-text="文件上传中，请稍候"
    element-loading-spinner="el-icon-loading">
          <el-row style="margin-top:1%">
              <el-form :inline="true" >
                <el-form-item>
                    <el-form-item label='选择公司：' labelWidth='120px'>
                        <el-cascader
                        v-model="chooseItem"
                        :options="companyList"
                         placeholder="请选择(空则查询年度记录)"
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
               accept=".xls" :on-progress="handleProgress" :on-success="successHand">
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
                        <el-table-column
                        label="单位名称"
                        align='center'>
                        <template slot-scope="scope">                
                           <span>{{scope.row.companyName?scope.row.companyName:'全部单位'}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column align='center' prop='planNum' label='初稿计划数'></el-table-column>
                        <el-table-column align='center' prop='firstDraftFinishNum' label='初稿完成数'></el-table-column>
                        <el-table-column align='center' prop='firstDraftFinishRate' label='初稿完成率'></el-table-column>
                        <el-table-column align='center' prop='reviewPassNum' label='评审通过数'></el-table-column>
                        <el-table-column align='center' prop='reviewPassRate' label='评审通过率'></el-table-column>
                        <el-table-column align='center' prop='standardReleaseNum' label='标准发布数'></el-table-column>
                        <el-table-column align='center' prop='standardReleaseRate' label='标准发布率'></el-table-column>
                        <el-table-column
                        label="填报时间"
                        align='center'>
                        <template slot-scope="scope">                
                           <span>{{scope.row.updateTime?scope.row.updateTime:year}}</span>
                        </template>
                        </el-table-column>
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
        year:'',
        selectdate: '',
        chooseItem:'',
        companyId:'',
        searchForm:{companyCode:''},
        companyList:[],
        listData:[],
        loading:false,
        screenLoading:false,
        headers:{Authorization:CurrentUser.get().token}
      }
    },
    methods: {
      searchData(){
        let date = new Date()
        this.year = `${date.getFullYear()}年度`,
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
      successHand(res){
            if(res.code === 1000){
                this.$message.success('上传成功')
                this.screenLoading = false
            }
            
            else{
                this.$message.error('上传失败，请重试')
                this.screenLoading = false
            }
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
            this.screenLoading = true
        },
      
    },
    mounted() {
      this.getCompany()
    },
}
</script>

<style>

</style>