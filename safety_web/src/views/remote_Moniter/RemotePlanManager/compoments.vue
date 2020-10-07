<template>
  <div>
    <div class="page-title" style="width:100%">远程计划管理细节</div>
    <div class="page-content">
      <el-row>
        <el-form label-width="130px" :inline="true">
          <el-form-item>
            <a ref="download"></a>
            <el-button type="primary" icon="el-icon-upload " @click="cilckFile()">Excel模板下载</el-button>
          </el-form-item>
          <el-form-item>
            <el-upload action="/" :before-upload="handleClick" :data="this.id" ref="upload" :auto-upload="false">
              <el-button type="warning" icon="el-icon-upload " size="medium">excel导入
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-upload " @click="newSubmitForm()">确认</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button type="danger" @click="handleCancel">返回</el-button>
          </el-form-item>
          <!-- <el-form-item style="float:right">
            <el-button  type="primary" @click="handlePost">保存</el-button>
          </el-form-item> -->
        </el-form>
      </el-row>
      <!-- 计划列表 -->
      <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        <el-table :data="listData" style="width: 100%;text-align:center" ref="treeTable" :indent="30" max-height="560"
          highlight-current-row border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="deviceNo" label="设备编号" width="150" align="center"> </el-table-column>
          <el-table-column prop="myNo" label="自编号" width="150" align="center"> </el-table-column>
          <el-table-column prop="projectName" label="项目名称" align="center"> </el-table-column>
          <el-table-column prop="charger" label="负责人" width="200" align="center"> </el-table-column>
          <el-table-column prop="tel" label="电话" width="200" align="center"> </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handelcelChange(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="handelcelDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-row>

      <!-- 编辑细节项目  -->
      <el-dialog title="新增计划" :visible.sync="ifchange" center width="700px">
        <el-form label-width="120px" style="width:100%;">
          <el-row>
            <el-col :span="24">
              <el-form-item label="设备编号:" prop="deviceNo" style="margin-bottom:1px">
                <el-input type="text" label="设备编号:" class="resizeNone" v-model="resData.deviceNo" placeholder="请输入内容">
                </el-input>
              </el-form-item>
              <el-form-item label="自编号:" prop="myNo" style="margin-bottom:1px">
                <el-input type="text" label="自编号:" class="resizeNone" v-model="resData.myNo" placeholder="请输入内容">
                </el-input>
              </el-form-item>
              <el-form-item label="项目名称:" prop="projectName" style="margin-bottom:1px">
                <el-input type="text" label="项目名称: " class="resizeNone" v-model="resData.projectName"
                  placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="负责人:" prop="charger" style="margin-bottom:1px">
                <el-input type="text" label="负责人:" class="resizeNone" v-model="resData.charger" placeholder="请输入内容">
                </el-input>
              </el-form-item>
              <el-form-item label="电话:" prop="tel" style="margin-bottom:1px">
                <el-input type="text" label="电话:" class="resizeNone" v-model="resData.tel" placeholder="请输入内容">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="" style="margin-top:20px;margin-left:100px" @click="ifchange=false">取消</el-button>
                <el-button type="primary" style="margin-top:20px;" @click="changeres">确定修改</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ExportJsonExcel from "js-export-excel";
import { getDetails } from "../../../services/remote";//查询细节
import { uploadMonitorPlanExcel } from "../../../services/remote";//上传excel
import { updateMonitorPlanDetail } from "../../../services/remote";//修改细节
import { deletePlanDetail } from "../../../services/remote";//删除细节
// import { downloadMonitorDetailExcelTemplate}from "../../../services/remotenew";

export default {
  name: '',
  data () {
    return {
      listData: [],
      resData: '',
      ifchange: false
    }
  },
  methods: {
    cilckFile () {
      this.downloadData = [];
      var option = {};
      option.fileName = '远程计划模板';
      //设置数据来源和数据格式
      option.datas = [{
        sheetData: this.downloadData,
        sheetHeader: ["设备编号", "自编号", "项目名称", "负责人", "电话"]
      }];
      //导出
      var toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();

    },
    handleClick (file) {//导入
      let fd = new FormData();
      fd.append('file', file);//传文件
      fd.append('planId', this.$route.params.monitorPlanID);//传文件
      uploadMonitorPlanExcel(fd).then(res => {
        getDetails(this.$route.params).then(res => {
          this.listData = res.data;
          this.$message.success('导入成功', res)
        })
      }).catch(err => {
        this.$message.error('批量导入失败', err)
      })
    },
    newSubmitForm () {
      this.$refs.upload.submit()
    },
    handlePost () {//确定   
    },
    handleCancel () {//返回
      this.$router.go(-1)
    },
    handelcelDelete (data) {//删除
      this.resData = data;
      deletePlanDetail(this.resData).then(res => {
        this.$message.success('删除成功', res)
        getDetails(this.$route.params).then(res => {
          this.listData = res.data;
        })
      }).catch(err => {
        this.$message.error('删除失败', err)
      })
    },
    handelcelChange (data) {//修改
      this.resData = data
      this.ifchange = true
    },
    changeres () {//确认修改
      updateMonitorPlanDetail(this.resData).then(res => {
        console.log('修改成功', res)
        this.ifchange = false
        getDetails(this.$route.params).then(res => {
          this.listData = res.data;
        })
      }).catch(err => {
        console.log('修改失败', err)
      })
    }
  },
  mounted () {
    console.log('细节页面报错')
    this.id = { "planId": this.$route.params.monitorPlanID }
    getDetails(this.$route.params).then(res => {
      this.listData = res.data;
    })
  }
}
</script>
<style lang='scss'>
</style>
