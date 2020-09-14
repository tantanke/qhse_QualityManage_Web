<template>
<div>
    <div class="page-title" style="width:100%">远程计划统计表</div>
    <div class="page-content">
        <el-row>
        <el-form label-width="130px" :inline="true">
          <el-form-item >
              <el-button type="warning" icon="el-icon-upload "  @click="output()">导出</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button type="danger" @click="handleCancel">返回</el-button>
          </el-form-item>
        </el-form>
      </el-row>
        <!-- 计划列表 -->
      <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
          <el-table
          :data="listData"
          style="width: 100%;text-align:center"
          ref="treeTable"
          :indent="30"
          max-height="560"
          highlight-current-row
          border>
          <el-table-column  type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="deviceNo" label="设备编号" width="150" align="center"> </el-table-column>
          <el-table-column prop="myNo" label="自编号" width="150" align="center"> </el-table-column>
          <el-table-column prop="projectName" label="项目名称" align="center"> </el-table-column>
          <el-table-column prop="charger" label="负责人" width="200" align="center"> </el-table-column>
          <el-table-column prop="tel" label="电话" width="200" align="center"> </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button 
              type="danger"
              size="mini"
              @click="handelcelDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
            
        </el-table> 
      </el-row>
    </div>
</div>
</template>
<script>
import { getStatisticsInfoByDate } from "../../../services/remote";//查询细节
import { deletePlanDetail } from "../../../services/remote";//删除细节
export default {
   name:'',
   data(){
       return{
           listData:[],
           resData:'',
           ifchange:false
       }
   },
   methods:{
       handleClick(file){//导入
         let fd = new FormData();
         fd.append('file',file);//传文件
         fd.append('planId',this.$route.params.monitorPlanID);//传文件
         uploadMonitorPlanExcel(fd).then(res=>{
             getDetails(this.$route.params).then(res=>{
                this.listData=res.data;
                this.$message.success('导入成功',res)
             })
         }).catch(err=>{
             this.$message.error('批量导入失败',err)
         })
       },
       newSubmitForm () {
         this.$refs.upload.submit()
     },
       handleCancel(){//返回
         this.$router.go(-1)
       },output(){},
       handelcelDelete(data){//删除
         this.resData=data;
         deletePlanDetail(this.resData).then(res=>{
           this.$message.success('删除成功',res)
           getDetails(this.$route.params).then(res=>{
             this.listData=res.data;
            })
         }).catch(err=>{
           this.$message.error('删除失败',err)
         })
       },
   },
   mounted(){
       console.log('细节页面报错',JSON.stringify(this.$route.params.time))
    //    this.id={"planId":this.$route.params.monitorPlanID}
       var data={time:''};
       data.time=this.$route.params.time
       getStatisticsInfoByDate(data).then(res=>{
           this.listData=res.data; })
   }
}
</script>
<style lang='scss'>

</style>
