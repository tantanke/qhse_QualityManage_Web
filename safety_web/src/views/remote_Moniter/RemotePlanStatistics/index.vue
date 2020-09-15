<template>
<div>
    <div class="page-title" style="width:100%">远程计划统计</div>
    <div class="page-content">
       <el-row>
        <el-form label-width="130px" :inline="true">
          <el-form-item label="统计时间：">
            <el-date-picker
              v-model="selecttime"
              type="date"
              placeholder="选择时间"
              value-format="yyyy-MM-dd"
              style="width:200px">
              </el-date-picker>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
          </el-form-item>
           <el-form-item style="float:right">
              <el-button type="primary" icon="el-icon-upload "  @click="newSubmitForm()">确认导入</el-button>
          </el-form-item>
          <el-form-item style="float:right">
              <el-upload
                action="/"
                :before-upload="handleupload"
                ref="upload"
                :auto-upload="false">
                <el-button type="warning" icon="el-icon-upload " size="medium">excel上传</el-button>
              </el-upload>
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
          <el-table-column prop="time" label="统计时间" align="center"></el-table-column>
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
//查询当天录入情况//excel上传
import { getAllSumDate,uploadMesSumDataExcel,deleteSumData,deleteSumDataByDate } from "../../../services/remote";
import { getStatisticsInfoByDate } from "../../../services/remote";//查询细节

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
        getAllSumDate().then(res=>{
          this.listData=[];
          for(var i=0;i<res.data.length;i++)
          {
            if(this.selecttime!=''&&this.selecttime!=null){
             if(res.data[i]==this.selecttime) 
                this.listData.push({"time":res.data[i]})
            }
            else
            this.listData.push({"time":res.data[i]})
          }
           console.log(this.listData)
        })
       },
      handleupload(file){//上传excel
         let fd = new FormData();
         fd.append('file',file);//传文件
         uploadMesSumDataExcel(fd).then(res=>{
             getAllSumDate().then(res=>{
              this.listData=[];
              for(var i=0;i<res.data.length;i++)
               this.listData.push({"time":res.data[i]})
               console.log(this.listData)
            })
         }).catch(err=>{
             this.$message.error('批量导入失败',err)
         })
      },
      newSubmitForm(){
         this.$refs.upload.submit()
      },
      readfile(data){//详情
      this.$router.push({
          name: 'Rcompoments4',
          params:data
        })
      },
      deletefile(data){
        deleteSumDataByDate({date:data.time}).then(res=>{
          this.$message.success('删除成功')
         console.log('删除结果',res);
         //再次查询
         getAllSumDate().then(res=>{
           this.listData=[];
          for(var i=0;i<res.data.length;i++)
           this.listData.push({"time":res.data[i]})
           console.log(this.listData)
          }).catch(err=>{
            console.log('查询失败',err)
          })
       })
       },
      pushfile(data){//下载excel
         var data1={date:data.time};
         getStatisticsInfoByDate(data1).then(res=>{
          this.downloadData=[];
           this.resData=res.data;
          // this.resData=[{"monitorPlanDetailID":'125105',"deviceNo":'adasd',"myNo":'adasddddd',"projectName":'mock测试',"charger":'adasda',"tel":'asdasdasd'}]
          if (res.code == '1000') {
						//将树形数据转换为table型数据
						this.parseTreeToTable(this.resData)
						var option = {};
						//下载文件名
						option.fileName = data.time+'统计表';
						//设置数据来源和数据格式
						option.datas = [{
							sheetData: this.downloadData,
							sheetHeader: ["基层单位", "开工项目数量", "日报数量", "配备记录仪数量", "出库数量", "开机使用数量","备用数量","覆盖率","利用率","使用率"]
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
						this.downloadDataItem.companyName = node[i].companyName
						this.downloadDataItem.workNum = node[i].workNum
						this.downloadDataItem.dayReportNum = node[i].dayReportNum
						this.downloadDataItem.recordDeviceNum = node[i].recordDeviceNum
            this.downloadDataItem.outStockNum = node[i].outStockNum
            this.downloadDataItem.powerOnNum = node[i].powerOnNum
            this.downloadDataItem.backNum = node[i].backNum
            this.downloadDataItem.coverageRate = node[i].coverageRate
            this.downloadDataItem.availableRate = node[i].availableRate
            this.downloadDataItem.useRate = node[i].useRate
            this.downloadData[i]=this.downloadDataItem
					}
				}
			},
   },
   mounted(){
      console.log('统计bug开始滴滴滴滴')
   }
}
</script>
<style lang='scss'>

</style>
