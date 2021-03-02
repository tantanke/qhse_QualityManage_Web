<template>
    <div>
        <div class="page-title">报告清单</div>
        <div class="page-content">
          <el-form :inline="true" :model="filterQuery">
            <el-form-item label="单位：">
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择单位名称"
              v-model="filterQuery.companyCode"
              style="width:250px"/>
            </el-form-item>
            <el-form-item label="类别：">            
              <el-select 
              clearable 
              v-model="filterQuery.reportType" 
              placeholder="请选择类别名称" 
              style="width: 100%;" 
              @change="onSelectedReportType">
              <el-option
                v-for="item in reportTypes"
                :key="item.id"
                :label="item.name"
                :value="item.dictCode">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="印章使用时间：">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:300px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="完成状态：">            
              <el-select 
              v-model="filterQuery.state" 
              placeholder="请选择完成状态" 
              style="width: 100%;" 
              @change="onSelectedStates">
              <el-option
                v-for="item in states"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch" icon='el-icon-search'>查询</el-button>
            </el-form-item>
            <!-- <el-row style="margin-button:150px"  height="250px">           -->
            <el-form-item>
            <el-upload
                ref="upload"
                :action="`/api/check_item_excel_upload`"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :file-list="fileList"
                :headers="{Authorization:currentUser.token}"
                :auto-upload="false"
                accept=".excel,.xls,.xlsx"
                  >
                <!-- <el-button slot="trigger" size="mini" type="primary"  round @click="submitUpload" width="150px">导入Excel文件</el-button> -->
                <!-- <el-button icon='el-icon-upload' round size="mini" style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button> -->
                <!-- <el-button type="warning" round size="mini" icon='el-icon-download' @click="download()">下载Excel模板</el-button> -->
            </el-upload>
            </el-form-item>
          <!-- </el-row> -->
          </el-form>
          <el-table :data="tableData" style="width: 100%" border v-loading="loading">
             <el-table-column
                  type="index"
                  :index="this.indexStartNum"
                  label="序号"
                  width="50"
                  align="center">
            </el-table-column>
            <el-table-column
                label="基层单位"
                prop="companyName"
                width="150"
                align="center">
              </el-table-column>
             <el-table-column
                label="报告编号"
                prop="reportCode"
                align="center">
              </el-table-column>
              <el-table-column
                label="报告类别"
                prop="reportType"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                label="报告计划时间"
                prop="reportPlanDate"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                label="检验负责人"
                prop="reportCheckPersonName"
                width="120"
                align="center">
              </el-table-column>
              <!-- <el-table-column
                label="检验时间"
                prop="reportCheckDate"
                width="120"
                align="center">
              </el-table-column> -->
              <el-table-column
                label="审核人"
                prop="auditorName"
                width="80"
                align="center">
              </el-table-column>
              <el-table-column
                label="审核时间"
                prop="auditorDate"
                width="80"
                align="center">
              </el-table-column>
              <el-table-column
                label="批准人"
                prop="approverName"
                width="80"
                align="center">
              </el-table-column>
              <el-table-column
                label="批准时间"
                prop="approverDate"
                width="80"
                align="center">
              </el-table-column>
              <el-table-column
                label="归档日期"
                prop="fileDate"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                label="发送人"
                prop="senderName"
                width="80"
                align="center">
              </el-table-column>
              <el-table-column
                label="发送日期"
                prop="sendDate"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                label="鉴印人"
                prop="authName"
                width="80"
                align="center">
              </el-table-column>
              <el-table-column
                label="报告份数"
                prop="reportCount"
                width="100"
                align="center">
              </el-table-column>
              <el-table-column label="操作" align="center" width="120" fixed="right">
                <template slot-scope="scope">
                  <div class="inline-td">
                    <router-link :to='{name: "ReportContent", params: {id: scope.row.reportID}}'>
                      <el-button size="mini" type="primary" >查看详情</el-button>
                    </router-link>
                  </div>
                </template>
              </el-table-column>
          </el-table>
          <div class="pagination-base">
            <el-pagination
              @current-change="handlePageChange"
              :current-page="filterQuery.pageIdx"
              :page-size="filterQuery.pageSize"
              :total="total"
              background
              layout="total,prev, pager, next,jumper"
            >
            </el-pagination>
          </div>
        </div>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import {GetDictionary} from '../../../services/dictionary'
import {GetReportList} from '../../../services/report_list'
import {GetCurrentUser } from '../../../store/CurrentUser';
const DefaultQuery = {
  companyCode: null, 
  reportType:'',
  beginTime:'',
  endTime:'',
  pageIdx: 1,//当前页码
  pageSize: 10,//每页消息数
  state:null
}
export default {
  components: { Treeselect },
    data () {
      return {
        ruleCode:"",
        dateRange:"",
        addEventdialogVisible:false,
        indexStartNum:1,//起始页码
        loading: false,
        total: 0,//总共消息数
        problemID:'',
        options: [],
        reportTypes:[],
        states:[
          {value:0,label:"所有"},
          {value:1,label:"已完成"},
          {value:2,label:"未完成"}
        ],
        change:{
					state:1
        },
        tableData:[
            {
                companyName:"职卫油化所",
                reportCode:"BGUJJ2019-001",
                reportType:"监督检验",
                reportPlanDate:"2018.12.3",
                reportCount:"2",
                reportCheckPersonName:"曹玉双",
                auditorName:"曹玉双",
                approverName:"曹玉双",
                fileDate:"2018.12.3",
                senderName:"曹玉双",
                sendDate:"2018.12.3",
                sealPersonName:"曹玉双",
                authName:"曹玉双",
                sealDate:"2019.11.13"
            }
        ],
        fileList:[],
        filterQuery: {
        }
      }
    },
    mounted () {
    this.loadFilterParams() //加载默认条件
    this.filterQuery.state=0
    this.handleGetCompany()//获取公司名称
    this.getreportType()
    this.handleGetListData()
    
    },
    computed:{
    currentUser(){
      return GetCurrentUser()
    }
   },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
       beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleSuccess(response){
       console.log(response)
       this.$message.warning(response);
       this.getDate();
      },
     submitUpload() {
        this.$refs.upload.submit();
      },
      download(){
        var url='http://39.98.173.131:7000/CheckItemExcel/检查项模板 .xlsx'
        var iframe =document.createElement("iframe")
        iframe.style.display ="none";
        iframe.src = url;
        document.body.appendChild(iframe);
      },
      handleSearch() {//搜索
        this.filterQuery.pageIdx = 1//把当前页码值设为1
        this.handleGetListData()
      },
      handlePageChange (page) {//处理跳也
      this.filterQuery.pageIdx = page
      this.handleGetListData()
      },
      //初始获取公司名称、编码
      handleGetCompany(){
        GetCompany().then((res) => {
          this.options = res.data;
        //   consloe.log(this.options); 
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      //获取报告类别
      getreportType() {
        GetDictionary({name: '检验报告类别'}).then((res) => {
          // console.log(JSON.stringify(res))
          this.reportTypes = res.data
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      //报告类别编码
      onSelectedReportType(selectValue){
        let obj = {}
        //遍历下拉数组中的item
        obj = this.reportTypes.find((item)=>{
          return item.name === selectValue
        })
        console.log(JSON.stringify(obj.dictCode))
        this.filterQuery.reportType = obj.dictCode    
        // console.log(this.formData.accidentClassCode)
      },
      //完成状态编码
      onSelectedStates(selectValue){
        // console.log(JSON.stringify(selectValue))
        //  let obj = {}
        //  obj = this.states.find((item)=>{
        //   return item.label === selectValue
        // })
        // this.filterQuery.state = obj.value
         this.filterQuery.state=selectValue

      },
      checkFilterParams () {//处理参数
        //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
        if (this.dateRange && this.dateRange.length === 2) {
          this.filterQuery.beginTime = this.dateRange[0]+' '+'00:00:00'
          this.filterQuery.endTime = this.dateRange[1]+' '+'23:59:59'
          } else {
            this.filterQuery.beginTime = ''
            this.filterQuery.endTime = ''
          }
        },
      //为了保存过滤条件,利用路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      loadFilterParams () {//初始化加载默认条件
          //从query读取过滤条件
          this.filterQuery = {...DefaultQuery, ...this.$route.query}
          //从query中取到的参数是string的,要转成element要求的number
          this.filterQuery = {
            ...this.filterQuery,
            pageIdx: parseInt(this.filterQuery.pageIdx, 10),
            pageSize: parseInt(this.filterQuery.pageSize, 10),
          }
          //填充datepicker range组件的内容
          if (this.filterQuery.beginTime && this.filterQuery.endTime) {
            this.dateRange = [this.filterQuery.beginTime, this.filterQuery.endTime]
          }
      },
      handleGetListData () {//处理请求参数，并发送请求，获取数据
        //筛选条件
        this.checkFilterParams()//处理参数
        this.loading = true
        //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
        this.$router.push({query: this.filterQuery})
        //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
        console.log(JSON.stringify(this.filterQuery))
        GetReportList(this.filterQuery).then((res) => {//发送参数，获取数据
          console.log(JSON.stringify(res))
          this.tableData = res.data.list
          this.total = res.data.total
          // alert(res.data.total)
          this.filterQuery.pageIdx = res.data.page
          this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      },
    }
}
</script>
<style scoped>
</style>
