<template>
<div>
    <div class="page-title" style="width:100%">监控数据录入细节</div>
    <div class="page-content">
        <el-row>
        <el-form label-width="130px" :inline="true">
          <el-form-item label="选择自编号：">
            <el-select v-model="myNovalue" placeholder="请选择" clearable>
              <el-option
                 v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="choosemyNo">查询</el-button>
          </el-form-item>
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
          <el-table-column type="expand">
            <template slot-scope="props">
							<el-form label-width="150px"  :inline='true' >
								<el-table
                   :stripe="true"
                  :header-cell-style="tableHeaderColor"
                  :data="props.row.linearray"
                  ref="treeTable"
                  :indent="30"
                  max-height="560"
                  border
                  >
                  <el-table-column  prop="inputDate" label="录入时间"  align="center"></el-table-column>
                   <el-table-column  prop="condition" label="记录仪使用情况"  align="center"></el-table-column>
                   <el-table-column  prop="description" label="视频监控描述"  align="center"></el-table-column>
                   <el-table-column  prop="picNo" label="截图编号"  align="center">
                     <template slot-scope="scope">>
                     <a href="#" @click="handlePictureCardPreview2(scope.row)" >{{scope.row.picNo}}</a>
                    </template>
                   </el-table-column>
                   <el-table-column  prop="disposeIn" label="处置情况"  align="center"></el-table-column>
                   <el-table-column  prop="closeIn" label="是否关闭"  align="center"></el-table-column>
								</el-table>
							</el-form>
						</template>
          </el-table-column>
          <el-table-column  type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="deviceNo" label="设备编号" width="150" align="center"> </el-table-column>
          <el-table-column prop="myNo" label="自编号" width="130" align="center"> </el-table-column>
          <el-table-column prop="projectName" label="项目名称" align="center"> </el-table-column>
          <el-table-column prop="charger" label="负责人" width="120" align="center"> </el-table-column>
          <el-table-column prop="tel" label="电话" width="140" align="center"> </el-table-column>
            <!-- <el-table-column prop="condition" label="记录仪使用情况" width="150" align="center"> 
              <template slot-scope="scope"  v-if="scope.row.condition==null">在</template>
            </el-table-column> -->
          <el-table-column label="操作" width="180" align="center">
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
      <el-dialog title="录入数据" :visible.sync="table" center width="700px">
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
              <el-form-item label="截图编号(限制1):"> 
              <el-upload
                action=""
                :limit="1"
                ref="upload"
                :before-upload="handleAvatarSuccess"
                :auto-upload="true"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
                  <a  href="#" @click="handlePictureCardPreview()" class="pic" >{{resData.picNo}}</a>
                  
                  
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
            <el-button type="primary" style="margin-top:20px;" @click="addDetail">录入</el-button>
            </el-form-item>
             </el-col>
           </el-row>
          </el-form>
      </el-dialog>
      
      <el-dialog :visible.sync="dialogVisible2">
        <img width="100%" :src="dialogImageUrl" alt="">
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
import { uploadScreenShot } from "../../../services/remotenew";//录入图片

export default {
   name:'',
   data(){
       return{
           listData:[],
           resData:{monitorPlanDetailID:'',monitorPlanID:'',condition:'在用',closeIn:'是',description:'',picNo:'',disposeIn:''},
           ifchange:false,
           ifnew:0,
           table:false,
           nowdate:'',
           dialogVisible2:false,
           dialogImageUrl:'',
           url:'',
           options:[],
           myNovalue:'',
           lists:[]
       }
   },
   methods:{
     async choosemyNo(){
       if(this.myNovalue==null || this.myNovalue=='')
       {
         getDetails(this.$route.params).then(res=>{
           this.listData=res.data; 
        })
       }
       else{
         
           this.listData=[];
         
         for(var i=0;i<this.lists.length;i++)
         {
           if(this.lists[i].myNo==this.myNovalue)
           {
             var data=this.lists[i];
             this.listData.push(data);
           }
          }
       }
       
     },
      //设置表头行的样式
     tableHeaderColor({row,column,rowIndex,columnIndex}){
        return 'background-color:lightblue;color:#fff;font-family:"楷体";font-size:18px;text-align:center'

     },
     async showlinedatas(){
       await getDetails(this.$route.params).then(res=>{
           this.listData=res.data; 
        })
        this.options=[];
        for(var i=0;i<this.listData.length;i++){
             this.options.push({value:this.listData[i].myNo,label:this.listData[i].myNo});
            await getInputtedDetailInfo(this.listData[i]).then(res=>{
             this.listData[i].linearray=res.data;
            })
            
           }
           this.lists=this.listData;
           console.log('最开始查询',this.listData)
     },
     handlePictureCardPreview() {
        this.dialogImageUrl = this.url;
        this.dialogVisible2 = true;
    },
    handlePictureCardPreview2(data) {
        this.dialogImageUrl = "http://39.98.173.131:9000/api"+data.picLink;
        this.dialogVisible2 = true;
    },
     handleAvatarSuccess(file){ 
       this.resData.picNo=file.name;
       let fd = new FormData();
         fd.append('file',file);//传文件
         uploadScreenShot(fd).then(res=>{
            this.$message.success('导入图片成功',res)
            this.resData.picLink=res.data;
            this.url="http://39.98.173.131:9000/api"+res.data
            console.log(this.url);
         })
     },
     changeDetail(){//废用 原本用来判断是否为空进行覆盖的
           if(this.resData.condition==true)this.resData.condition='备用';
           else if(this.resData.condition=false)this.resData.condition='在用';

           if(this.resData.closeIn==false)this.resData.closeIn='是'
           if(this.resData.closeIn==true)this.resData.closeIn='否'
         console.log(this.resData)
          getInputtedDetailInfo(this.resData).then(res=>{
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
         this.table=true;
         this.resData={monitorPlanDetailID:'',monitorPlanID:'',condition:'在用',closeIn:'是',description:'',picNo:'',disposeIn:''},
         this.resData.monitorPlanDetailID=data.monitorPlanDetailID;
         this.resData.monitorPlanID=data.monitorPlanID;
         console.log(data)
         //获取总览数据
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
           inputDetail(this.resData).then(res=>{
           console.log('录入成功',res)
           this.$message.success('录入成功')
           this.table=false;
           this.showlinedatas();
         })
         .catch(err=>{
           console.log('录入失败',err)
         })
         
         
       }
   },
   mounted(){
       console.log('细节页面报错')
       this.showlinedatas();
       
       }
}
</script>
<style lang='scss'>

</style>
