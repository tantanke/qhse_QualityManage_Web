<template>
<div>
    <div class="page-title" style="width:100%">监控数据录入细节</div>
    <div class="page-content">
        <el-row>
        <el-form label-width="130px" :inline="true">
          <el-form-item>
            <el-button type="danger" @click="handleCancel">返回</el-button>
          </el-form-item>
          <!-- <el-form-item style="float:right">
            <el-button  type="primary" @click="handlePost">保存</el-button>
          </el-form-item> -->
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
          <el-table-column prop="charger" label="负责人" width="150" align="center"> </el-table-column>
            <el-table-column prop="tel" label="电话" width="150" align="center"> </el-table-column>
            <!-- <el-table-column prop="condition" label="记录仪使用情况" width="150" align="center"> 
              <template slot-scope="scope"  v-if="scope.row.condition==null">在</template>
            </el-table-column> -->
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button 
              type="primary"
              size="mini"
              @click="handelcelChange(scope.row)"
              >录入</el-button>
               <el-button 
              type="danger"
              size="mini"
              @click="handelcelDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
            
        </el-table> 
      </el-row>

      <!-- 新增计划表  -->
      <el-dialog title="新增计划" :visible.sync="table" center width="700px">
          <el-form label-width="120px" style="width:100%;" >
           <el-row>
            <el-col :span="24">
              <el-form-item label="记录仪使用情况:"  prop="condition" style="margin-bottom:5px">
                <el-switch
                  style="margin-right:10px"
                  v-model="resData.condition"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="备用"
                  inactive-text="在用">
                </el-switch>
              </el-form-item>
              <el-form-item label="视频监控描述:"  prop="description" style="margin-bottom:5px">
                <el-input type="text"   label="视频监控描述 ："  class="resizeNone" v-model="resData.description" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="截图编号:"  prop="picNo" style="margin-bottom:5px">
                <el-input type="text"   label="截图编号 ："  class="resizeNone" v-model="resData.picNo" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="处置情况:"  prop="disposeIn" style="margin-bottom:5px">
                <el-input type="text"   label="处置情况 ："  class="resizeNone" v-model="resData.disposeIn" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="是否关闭:"  prop="closeIn" style="margin-bottom:5px">
                  <el-switch
                  style="margin-right:10px"
                  v-model="resData.closeIn"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="否"
                  inactive-text="是">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="24" >
            <el-form-item>
            <el-button type="" style="margin-top:20px;margin-left:100px" @click="table=false">取消</el-button>
            <el-button type="primary" style="margin-top:20px;" @click="addDetail" v-if="ifnew">录入</el-button>
            <el-button type="primary" style="margin-top:20px;" @click="changeDetail" v-if="!ifnew">确认修改</el-button>
            </el-form-item>
             </el-col>
           </el-row>
          </el-form>
      </el-dialog>
    </div>
</div>
</template>
<script>
import { getDetails } from "../../../services/remote";//查询细节
import { getCheckDetail } from "../../../services/remote";//查询细节
import { getInputtedDetailInfo } from "../../../services/remote";//查询细节
import { inputDetail } from "../../../services/remote";//录入当天细节
import { updateInputtedDetailInfo } from "../../../services/remote";//录入当天细节
import { deletePlanDetail } from "../../../services/remote";//录入当天细节

export default {
   name:'',
   data(){
       return{
           listData:[],
           resData:{monitorPlanDetailID:'',monitorPlanID:'',condition:'在用',closeIn:'是',description:'',picNo:'',disposeIn:''},
           ifchange:false,
           ifnew:0,
           table:false,
           nowdate:''
       }
   },
   methods:{
     changeDetail(){
           if(this.resData.condition==true)this.resData.condition='备用';
           else if(this.resData.condition=false)this.resData.condition='在用';

           if(this.resData.closeIn==false)this.resData.closeIn='是'
           if(this.resData.closeIn==true)this.resData.closeIn='否'
         console.log(this.resData)
         updateInputtedDetailInfo(this.resData).then(res=>{
           console.log('审核成功',res)
           this.$message.success('核查成功')

           this.table=false
         })
         .catch(err=>{
           console.log('审核失败',err)
         })
     },
      getNowFormatDate(){
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
       handleCancel(){//返回
         this.$router.go(-1)
       },
       handelcelChange(data){
         this.resData={monitorPlanDetailID:'',monitorPlanID:'',condition:'在用',closeIn:'是',description:'',picNo:'',disposeIn:''},
         this.resData.monitorPlanDetailID=data.monitorPlanDetailID;
         this.resData.monitorPlanID=data.monitorPlanID;
         console.log(data)
         getInputtedDetailInfo(data).then(res=>{
           if(res.data==null){
           this.ifnew=1;
           }
         else{
           this.ifnew=0;
           this.resData=res.data;
           if(this.resData.condition=='备用')this.resData.condition=true;
           else this.resData.condition=false;
           if(this.resData.closeIn=='否')this.resData.closeIn=true;
           else this.resData.closeIn=false;
           console.log('获取数据',this.resData)
         }
         this.table=true
         })
       },
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
       addDetail(){//录入细节
         if(this.resData.description==''||this.resData.picNo==''||this.resData.disposeIn==''){
           this.$message.error('信息录入不全！');
         }
         else{
           if(this.resData.condition==false)this.resData.condition='在用'
           if(this.resData.condition==true)this.resData.condition='备用'
           if(this.resData.closeIn==false)this.resData.closeIn='是'
           if(this.resData.closeIn==true)this.resData.closeIn='否'
         }
         console.log(this.resData)
         if(this.ifnew=1){
           inputDetail(this.resData).then(res=>{
           console.log('录入成功',res)
           this.table=false
         })
         .catch(err=>{
           console.log('录入失败',err)
         })
         }
         else{
           updateInputtedDetailInfo(this.resData).then(res=>{
           console.log('录入成功',res)
           this.table=false
         })
         .catch(err=>{
           console.log('录入失败',err)
         })
         }
         
       }
   },
   mounted(){
       console.log('细节页面报错')
       getDetails(this.$route.params).then(res=>{
           this.listData=res.data; })
       }
}
</script>
<style lang='scss'>

</style>
