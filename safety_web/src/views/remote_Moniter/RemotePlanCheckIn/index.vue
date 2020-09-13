<template>
<div>
    <div class="page-title" style="width:100%">监控数据录入</div>
    <div class="page-content">
       <el-row>
        <el-form label-width="130px" :inline="true">
          <el-form-item label="录入时间：">
            <el-date-picker
              v-model="selecttime"
              type="date"
              placeholder="选择时间"
              style="width:200px">
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
          <el-table-column prop="uploadTime" label="录入时间" width="200" align="center"> </el-table-column>
          <el-table-column prop="status" label="记录仪使用情况" width="200" align="center"> </el-table-column>
           <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <el-button 
              type="primary"
              size="mini"
              @click="readfile(scope.row)"
              >详情</el-button>
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

export default {
   name:'',
   data(){
      return{
         selecttime:'',
         listData:[],
      }
   },
   methods:{
      handleClick(){//查询
        this.listData=[{"status":"备用","monitorPlanID":7,"startDate":"2020-8-31","endDate":"2020-9-3","uploadTime":"2020-09-12","planName":"GKD!GKD!!","planPersonID":"发布该任务用户的ID","planPersonName":"发布该任务用户的姓名"}]
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
          // this.resData=[{"monitorPlanDetailID":'125105',"deviceNo":'adasd',"myNo":'adasddddd',"projectName":'mock测试',"charger":'adasda',"tel":'asdasdasd'}]
          if (res.code == '1000') {
						//将树形数据转换为table型数据
						this.parseTreeToTable(this.listData)
						var option = {};
						//下载文件名
						option.fileName = data.projectName+'录入表';
						//设置数据来源和数据格式
						option.datas = [{
							sheetData: this.downloadData,
							sheetHeader: ["设备编号", "自编号", "项目名称", "负责人", "负责人电话", "记录仪使用情况","视频监控描述","截图编号","处置情况","是否关闭"]
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
   }
}
</script>
<style lang='scss'>

</style>
