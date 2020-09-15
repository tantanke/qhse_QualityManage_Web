<template>
<div>
    <div class="page-title" style="width:100%">监控数据录入</div>
    <div class="page-content">
       <el-row>
        <el-form label-width="130px" :inline="true">
         <el-form-item label='时间范围：' labelWidth='120px'>
            <el-date-picker
                v-model="selectdate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"                       
                >
            </el-date-picker>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <!-- 计划列表 -->
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
          <el-table-column  type="index" label="序号" width="120" align="center"></el-table-column>
          <el-table-column prop="planName" label="计划名称" align="center"> </el-table-column>
          <el-table-column prop="startDate" label="开始时间" width="200" align="center"> </el-table-column>
          <el-table-column prop="endDate" label="结束时间" width="200" align="center"> </el-table-column>
           <el-table-column label="编辑" width="100" align="center">
            <template slot-scope="scope">
              <el-button 
              v-if="ifcanwrite(scope.row)"
              type="primary"
              size="mini"
              @click="readfile(scope.row)"
              >录入</el-button>
            </template>
          </el-table-column> 
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button 
              type="danger"
              size="mini"
              @click="deletefile(scope.row)"
              >删除</el-button>
               <el-button 
              type="success"
              size="mini"
              @click="pushfile(scope.row)"
              >导出</el-button>
              </template>
          </el-table-column> 
        </el-table> 
      </el-row>
       
    </div>
</div>
</template>
<script>
import ExportJsonExcel from "js-export-excel";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getDetails } from "../../../services/remote";//查询当天录入情况
import { getMonitorPlanList } from "../../../services/remote";//查询
import { getCheckDetail } from "../../../services/remote";//查询
import { deletePlan } from "../../../services/remote";//删除


export default {
   name:'',
   data(){
      return{
         selectdate:'',
         listData:[],
      }
   },
   methods:{
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
    ifcanwrite(data){
      var data1=new Date(Date.parse(data.startDate.replace(/-/g,"/")));
      var data2=new Date(Date.parse(data.endDate.replace(/-/g,"/")));
      var nd=new Date(Date.parse(this.nowdate.replace(/-/g,"/")));
      if(nd<=data2 && nd>=data1) return true;
      else return false;
    },
      handleClick(){//查询
      getMonitorPlanList().then(res=>{
        console.log('查询结果',res)
        this.listData=res.data;
         if(this.selectdate.length!=0){
          var datas = this.listData;
          var length=datas.length;
          this.listData=[]//清空列表数据
          var datemin = new Date(Date.parse(this.selectdate[0].replace(/-/g,"/")));
          var datemax = new Date(Date.parse(this.selectdate[1].replace(/-/g,"/")));
          //循环遍历
          for(var i=0;i<length ;i++){
            var date1 = new Date(Date.parse(datas[i].startDate.replace(/-/g,"/")));
            var date2 = new Date(Date.parse(datas[i].endDate.replace(/-/g,"/")));
            if(date1>=datemin && date2<=datemax){
              this.listData.push(datas[i])
            }
          }
        }
        })
        .catch(err=>{
          console.log('查询失败',err)
        })
       },
      readfile(data){//详情
      this.$router.push({
          name: 'Rcompoments2',
          params:data
        })
      },
      deletefile(data){
        console.log(data.monitorPlanID)
        deletePlan(data).then(res=>{
         console.log('删除结果',res);
         //再次查询
         getMonitorPlanList().then(res=>{
            console.log('查询结果',res)
            this.listData=res.data
          }).catch(err=>{
            console.log('查询失败',err)
          })
       })
      },
      pushfile(data){
         getDetails(data).then(res=>{
          this.downloadData=[];
           this.resData=res.data;
           if (res.code == '1000') {
						//将树形数据转换为table型数据
						this.parseTreeToTable(this.listData)
						var option = {};
						//下载文件名
						option.fileName = data.plantName+'录入表';
						//设置数据来源和数据格式
						option.datas = [{
							sheetData: this.downloadData,
							sheetHeader: ["设备编号", "自编号", "项目名称", "负责人", "负责人电话", "记录仪使用情况","视频监控描述","截图编号","处置情况(录入)","是否关闭(录入)"]
						}];
						//导出
						var toExcel = new ExportJsonExcel(option);
						toExcel.saveExcel();
					}
       })
      },
      parseTreeToTable(node) {//转换格式
				//初始化下载数据项对象
				this.downloadDataItem = {}
				//遍历当前节点，装填数据
				for (var i = 0; i < node.length; i++) {
					//如果当前节点存在，装填数据
					if (node[i]) {
            this.downloadDataItem = {}
						this.downloadDataItem.deviceNo = node[i].deviceNo
						this.downloadDataItem.myNo = node[i].myNo
						this.downloadDataItem.projectName = node[i].projectName
						this.downloadDataItem.charger = node[i].charger
            this.downloadDataItem.tel = node[i].tel
            this.downloadDataItem.condition = node[i].condition
            this.downloadDataItem.description = node[i].description
            this.downloadDataItem.picNo = node[i].picNo
            this.downloadDataItem.disposeIn = node[i].disposeIn
            this.downloadDataItem.closeIn = node[i].closeIn
						//将数据项对象装入下载数据数组，保存
						this.downloadData.push(this.downloadDataItem)
					}
					//递归装填子节点
					if (node[i].childNode) {
						this.parseTreeToTable(node[i].childNode)
					}
				}
			},
   },
   mounted(){
     this.nowdate=this.getNowFormatDate();
   }
}
</script>
<style lang='scss'>

</style>
