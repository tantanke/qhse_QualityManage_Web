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
                  <el-button type='success' icon="el-icon-upload2" @click="importFile">数据导入</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type='info' icon="el-icon-download" @click="downLoadFile">模板下载</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                  <el-table
                        :data="listData"
                        style="width: 100%;text-align:center"
                        ref="treeTable"
                        row-key="code"
                        :indent="30"
                        max-height="560"
                        highlight-current-row
                        border>
                      </el-table>
            </el-row> 
      </div>
  </div>
</template>

<script>
import CurrentUser from '@/store/CurrentUser'
import {queryDashboardScheduleManagement,GetqhseCompanytree} from '@/services/qhseDashboard/index'
export default {
    data() {
      return {
        selectdate: '',
        chooseItem:'',
        companyId:'',
        companyList:[],
        listData:[]
      }
    },
    methods: {
      searchData(){
        console
      },
      importFile(){

      },
      downLoadFile(){

      },
       getCompany(){
        GetqhseCompanytree().then(res =>{
               this.companyList = res.data
        }).catch(err =>{
          this.$message.error(err)
        })
        
      },
      handleChange(){
        this.companyId = this.chooseItem[this.chooseItem.length - 1]
        console.log(this.companyId)
      }
    },
    mounted() {
      this.getCompany()
      queryDashboardScheduleManagement().then(res => {
        console.log(res)
      })
    },
}
</script>

<style>

</style>