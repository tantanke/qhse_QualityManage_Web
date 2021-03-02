<template>
  <div>
     <div class="page-title" style="width:100%">安全管理 </div>
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
                   <el-upload ref="upload" action='/api/uploadDashboardSecurity'  :headers="headers" :show-file-list="false"
               accept=".xls,.xlsx" :on-progress="handleProgress" :on-success="successHand">
						<el-button icon="el-icon-upload" type="success">数据导入</el-button>
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
                        <el-table-column align='center' prop='quarterDangerIndex' label='季度隐患指标'></el-table-column>
                        <el-table-column align='center' prop='actualFinishDanger' label='实际完成查患'></el-table-column>
                        <el-table-column align='center' prop='finishDangerRate' label='查患完成率'></el-table-column>
                        <el-table-column align='center' prop='quarterRegulationIndex' label='季度违章指标'></el-table-column>
                        <el-table-column align='center' prop='actualFinishRegulation' label='实际完成纠违'></el-table-column>
                        <el-table-column align='center' prop='finishRegulationRate' label='违章完成率'></el-table-column>
                        <el-table-column align='center' prop='quarterEventIndex' label='季度事件指标'></el-table-column>
                        <el-table-column align='center' prop='actualFinishEvent' label='实际完成事件'></el-table-column>
                        <el-table-column align='center' prop='eventFinishRate' label='实际完成事件率'></el-table-column>
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
import {queryDashboardSecurity,GetqhseCompanytree,downloadDashboardSecurityTemplate,downloadfile} from '@/services/qhseDashboard/index'
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
        this.year = `${date.getFullYear()}年度`
        this.listData = []
        this.loading = true
        queryDashboardSecurity(this.searchForm).then(res => {
           this.listData.push(res.data)
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
                this.searchData()
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
        downloadDashboardSecurityTemplate().then(res =>{
          downloadfile('安全管理模板',res.file.data,"xlsx")
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