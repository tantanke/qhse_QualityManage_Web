<template>
<div>
    <div class="page-title" style="width:100%">远程计划核查细节</div>
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
              >核查</el-button>
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
      <el-dialog title="核查计划" :visible.sync="table" center width="700px">
          <el-form label-width="120px" style="width:100%;" >
            <el-select v-model="selecttime" placeholder="请选择" style="margin-right:20px" @change="handleSelect">
              <el-option-group
                  v-for="group in dates"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
           <el-row>
            <el-col :span="24" v-if="cansee==true">
              <el-form-item label="视频监控描述:"  prop="description" style="margin-bottom:5px">{{resData.description}}</el-form-item>
              <el-form-item label="截图编号:"  prop="picNo" style="margin-bottom:5px">{{resData.picNo}}</el-form-item>
              <el-form-item label="处置情况(录入):"  prop="disposeIn" style="margin-bottom:5px">{{resData.disposeIn}}</el-form-item>
              <el-form-item label="是否关闭(录入):"  prop="closeIn" style="margin-bottom:5px">{{resData.closeIn}}</el-form-item>
              <el-form-item label="核查情况描述:"  prop="check" style="margin-bottom:5px" v-if="this.selecttime==this.selectdate">
                <el-input type="text"   label="核查情况描述 ："  class="resizeNone" v-model="resData.check" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="处置情况(核查):"  prop="disposeCheck" style="margin-bottom:5px" v-if="this.selecttime==this.selectdate">
                <el-input type="text"   label="处置情况 ："  class="resizeNone" v-model="resData.disposeCheck" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="是否关闭(核查):"  prop="closeCheck" style="margin-bottom:5px" v-if="this.selecttime==this.selectdate">
                  <el-switch
                  style="margin-right:10px"
                  v-model="resData.closeCheck"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="否"
                  inactive-text="是">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="cansee==true">
            <el-form-item>
            <el-button type="" style="margin-top:20px;margin-left:100px" @click="table=false">取消</el-button>
            <el-button type="primary" style="margin-top:20px;" @click="addDetail" >核查</el-button>
            </el-form-item>
             </el-col>
             <el-col :span="24" v-if="!cansee">
            <el-form-item>
              <el-table-column prop="myNo" label="自编号" width="150" align="center">当前日期内容尚未录入不可查看</el-table-column>
            </el-form-item>
             </el-col>
           </el-row>
          </el-form>
      </el-dialog>
    </div>
</div>
</template>
<script>
import {GetCurrentUser} from "../../../store/CurrentUser.js"
import { getDetails } from "../../../services/remote";//查询细节
import { updateInputtedDetailInfo } from "../../../services/remote";//录入当天细节
import { deletePlanDetail } from "../../../services/remote";//录入当天细节
import { getInputtedRecordDetailByDate,getInputDates } from "../../../services/remote";//查看细节内容

export default {
   name:'',
   data(){
       return{
           listData:[],
           resData:{closeCheck:'是',disposeCheck:'',check:'',description:'',picNo:'',disposeIn:'',closeIn:''},
           ifchange:false,
           ifnew:0,
           table:false,
           nowdate:'',
           dates:[],
           selecttime:'',
           selectdate:'',
           cansee:true,
           monitorPlanDetailID:''
       }
   },
   methods:{
     selected(val){
       this.selecttime=val
     },
     async handleSelect(){
       await getInputtedRecordDetailByDate({monitorPlanDetailID:this.monitorPlanDetailID,date:this.selecttime}).then(res=>{
           this.resData=res.data;
           if(res.data==null){//已经录入但是不能查看
             this.cansee=false
           }
           else if(res.data!=null){ this.cansee=true}
         })
       console.log(this.cansee,res.data)
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
     getNowFormatDate2(){
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate()-1;
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
         this.selecttime=this.getNowFormatDate2();
          getInputDates(this.$route.params).then(res=>{//获取选择日期
           var cd= new Date(Date.parse(this.selectdate.replace(/-/g,"/")))
           var d1 = new Date(Date.parse(res.data[0].replace(/-/g,"/")))
           if(cd<d1)
           {
             this.selecttime=res.data[0]
           }
         this.monitorPlanDetailID=data.monitorPlanDetailID
         getInputtedRecordDetailByDate({monitorPlanDetailID:this.monitorPlanDetailID,date:this.selecttime}).then(res=>{
           
           if(res.data==null){//已经录入但是不能查看
           this.resData={closeCheck:'是',disposeCheck:'',check:'',description:'',picNo:'',disposeIn:'',closeIn:''},
             this.cansee=false
           }
           else{ this.cansee=true
           
           this.resData=res.data;
           }
         })
         
           this.table=true
         })
        
       },
       handelcelDelete(data){//删除
         this.resData=data;
         deletePlanDetail(this.resData).then(res=>{
           this.$message.success('删除成功')
           getDetails(this.$route.params).then(res=>{
             this.listData=res.data;
            })
         }).catch(err=>{
           this.$message.error('删除失败',err)
         })
       },
       addDetail(){//录入细节
         if(this.resData.check==''||this.resData.disposeCheck==''){
           this.$message.error('信息录入不全！');
         }
         else{
           if(this.resData.closeCheck==false)this.resData.closeCheck='是'
           if(this.resData.closeCheck==true)this.resData.closeCheck='否'
         }
         this.resData.checkPersonId=GetCurrentUser().employeeId;
         this.resData.checkPersonName=GetCurrentUser().employeeName;
         console.log(this.resData)
         updateInputtedDetailInfo(this.resData).then(res=>{
           console.log('审核成功',res)
           this.$message.success('核查成功')

           this.table=false;
         })
         .catch(err=>{
           console.log('审核失败',err)
         })
       }
   },
   mounted(){
      this.nowdate=this.getNowFormatDate();
      this.selectdate=this.getNowFormatDate2();
      this.selecttime=this.getNowFormatDate2();
       console.log('细节页面报错')
       getDetails(this.$route.params).then(res=>{
         for(var i=0,j=0;i<res.data.length;i++)
         {
           if(res.data[i].condition==null)
           {
             this.listData.push(res.data[i]);
             j++;}
         }
         console.log(this.listData)
       })
       getInputDates(this.$route.params).then(res=>{
         this.dates=[{
           label: '过去录入详情',
           options: []},
           {
           label: '当天可核查日期',
           options: []},
           {
           label: '未到核查时间',
           options: []},
          ];
          
           var cd= new Date(Date.parse(this.selectdate.replace(/-/g,"/")))
           var d1 = new Date(Date.parse(res.data[0].replace(/-/g,"/")))
           if(cd<d1)
           {
             console.log('why')
             this.selecttime=res.data[0]
             console.log(this.selecttime)
           }
         for(var i=0;i<res.data.length;i++){
           var date1=new Date(Date.parse(this.selectdate.replace(/-/g,"/")));//当前日期
           var date2=new Date(Date.parse(res.data[i].replace(/-/g,"/")));//列表中的日期

           if(date2>date1)
           {
              this.dates[2].options.push({value:res.data[i],label:res.data[i]});
           }
             else if(date2<date1)
             this.dates[0].options.push({value:res.data[i],label:res.data[i]});
             else if(date2=date1){
             this.dates[1].options.push({value:res.data[i],label:res.data[i]});
             }
           
           
         }
         console.log(this.dates)
       })
  }
}
</script>
<style lang='scss'>

</style>
