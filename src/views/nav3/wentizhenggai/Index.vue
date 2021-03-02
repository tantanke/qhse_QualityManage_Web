<template>
  <div>
    <div class="page-title">问题整改</div>
    <div class="page-content">
    
<!-- 查询输入框，按钮 -->
      <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-row>
              <el-form-item label="检查单位：">
                <treeselect
                :multiple="false"
                :options="options"
                placeholder="选择单位"
                v-model="filterQuery.companyCode"
                style="width:250px"/> 
              </el-form-item >
              <el-form-item label="检查时间：">
              <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
              </el-date-picker>
              </el-form-item>
            <el-form-item >
              <el-button type="primary" native-type='submit' icon='el-icon-search' style="width:100%">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="export2Excel ()" style="width:100%">导出Excel</el-button>
            </el-form-item>
        </el-row>
      </el-form>

<!-- 问题列表table -->
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        @row-click="clickTable"
        ref="refTable"
        style="width: 100%">
      <el-table-column type="expand">

 <!-- 点击某一问题，查看详情的form表单 -->
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand" label-width="130px">
            <el-row>
              <el-form-item label="问题描述">{{ props.row.description }}</el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="问题细节">{{ props.row.descriptionDetail }}</el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="建议整改措施">{{ props.row.recommendRectiMeasure }}</el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="限定整改完成日期">{{ props.row.limtRectDate }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="问题原因">{{ props.row.source }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="检查项1">{{ props.row.checkItemName1 }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="问题类别1">{{ props.row.problemClass1 }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="检查项2">{{ props.row.checkItemName2 }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="问题类别2">{{ props.row.problemClass2 }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="检查项3">{{ props.row.checkItemName3 }}</el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item  label="问题重复性">{{ props.row.problemRepeat }}</el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="问题所属岗位">{{ props.row.problemStation }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="责任人性质">{{ props.row.responseEmpGroup }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="任务">{{ props.row.task }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="工序">{{ props.row.process }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="违章记分">{{ props.row.lostScore }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="违章扣款">{{ props.row.penalty }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="整改描述">{{ props.row.rectiMeasure }}</el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="整改负责人">{{ props.row.rectiPerson }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="检查人员">{{ props.row.checkPersonName }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="整改完成时间">{{ props.row.rectiFinishDate }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="是否延期">{{ props.row.isPostpone }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
    
    
      <!-- 问题列表，显示在table里面的内容 -->
    <!-- <el-table-column label="序号" width="70">
      <template slot-scope="scope">
        <font>{{scope.$index + 1}}</font>
      </template>
    </el-table-column> -->
    <el-table-column
      type="index"
      width="70"
      header-align="center"
      label="序号"
      :index="this.indexStartNum"
      align="center">
    </el-table-column>
    <el-table-column
      label="受检单位"
      prop="companyName"
      width="120"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="受检二级单位"
      prop="parentCompanyName"
      width="120"
      header-align="center">
    </el-table-column>
    <el-table-column show-overflow-tooltip
      label="问题描述"
      prop="description"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="检查时间"
      prop="checkDate"
      width="170"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="问题级别"
      prop="problemRank"
      width="100"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="责任人"
      prop="responsePersonName"
      width="100">
    </el-table-column>
    <el-table-column
      label="问题状态"
      prop="status"
      width="100">
    </el-table-column>
    <el-table-column label="操作" align="center" header-align="center" width="250px" >
      <template slot-scope="scope">
        <div class="inline-td">
          <router-link :to='{name: "ProblemRectification", params: {id: scope.row.problemID}}' >
            <el-button size="mini" type="primary"> <i class="el-icon-edit"></i>整改</el-button>
          </router-link>
          &nbsp;&nbsp;
          <el-button   size="mini" icon='el-icon-view' @click="open(scope.row.verifyModification)" v-if="scope.row.status ==='验证未通过'">审核意见</el-button>
          <el-button   size="mini" icon='el-icon-view' :disabled=true v-else>审核意见</el-button>
          &nbsp;&nbsp;
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
      layout="total, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
    </div>
  </div>
</template>

<script>
import {RectifyProblem} from '../../../services/verify'
import {GetCompany} from '../../../services/gettreedata'

const DefaultQuery = {
  companyCode: null,
  checkDate1:'',
  checkDate2:'',
  status:'',
  // verifyStatus:'验证不通过',
  pageIdx: 1,
  pageSize: 10,
  
}
const DefaultQueryExcel = {
  companyCode: null,
  checkDate1:'',
  checkDate2:'',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
  data () {
    return {
        dateRange:[], //选择时间
        options: [], //选择单位
        filterQuery: {},
        filterQueryExcel: {},
        fitertask: {},
        total: 0,
        loading: false,
        tableData:[],
        problemAyy:'',
        timeout: null,
        excelData:[],
        indexStartNum:1 
    }
  },

  mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetProblems() //获取全部问题
    this.getDate() // 获取公司列表
  },
    
  methods:{
    open(data) {
      this.$alert(data, {
      confirmButtonText: '确定',})
    },
    //时间选择
     checkFilterParams () {
        //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
        if (this.dateRange && this.dateRange.length === 2) {
          this.filterQuery.checkDate1 = this.dateRange[0]+' '+'00:00:00'
          this.filterQuery.checkDate2 = this.dateRange[1]+' '+'23:59:59'
          } else {
            this.filterQuery.checkDate1 = ''
            this.filterQuery.checkDate2 = ''
          }
        },
        //加载默认条件
       loadFilterParams () {
          //从query读取过滤条件
          this.filterQuery = {...DefaultQuery, ...this.$route.query}
          //从query中取到的参数是string的,要转成element要求的number
          this.filterQuery = {...this.filterQuery,
          pageIdx: parseInt(this.filterQuery.pageIdx, 10),
          pageSize: parseInt(this.filterQuery.pageSize, 10),
          }
          //填充datepicker range组件的内容
          if (this.filterQuery.checkDate1 && this.filterQuery.checkDate2) {
            this.dateRange = [this.filterQuery.checkDate1, this.filterQuery.checkDate2]
            }
          },
    //获取公司
    getDate(){
      GetCompany().then((res) => {
        console.log(res)
      this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    // 导出Excel
    export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=RectifyProblem(this.filterQueryExcel).then((data) => {
        console.log(JSON.stringify(data))
        this.excelData = data.data
        this.loading = false
        console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['受检单位','受检二级单位','问题描述','检查时间','问题级别','责任人','问题状态','问题细节',
          '建议整改措施','限定整改完成日期','问题原因','检查项1','检查项2','检查项3','问题类别1','问题类别2',
          '问题所属岗位','责任人性质','任务','工序','违章记分','违章扣款','整改描述','整改负责人','检查人员','整改完成时间','是否延期'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['companyName','parentCompanyName','description',
                             'checkDate','problemRank','responsePersonName','status','descriptionDetail','recommendRectiMeasure','limtRectDate',
                             'source','checkItemName1','checkItemName2','checkItemName3','problemClass1',
                             'problemClass2','problemStation','responseEmpGroup','task','process','lostScore','penalty','rectiMeasure'
                             ,'rectiPerson','checkPersonName','rectiFinishDate','isPostpone'];
          // 上面的index、phone_Num、school_Name是tableData里对象的属性
          const list = this.excelData;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '列表excel');
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

  //点击行，显示详情
     clickTable(row){
        this.$refs.refTable.toggleRowExpansion(row)
      },
  //获取全部问题，显示在table
    handleGetProblems () {
      this.checkFilterParams()
      this.loading = true
      this.$router.push({query: this.filterQuery})
      RectifyProblem(this.filterQuery).then((res) => {
        // alert(JSON.stringify(res.data.total))
        this.tableData = res.data.list
        this.total = res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
  
  //页码改变
    handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetProblems()
    },
    
  //查询
    handleSearch () {
      this.handleGetProblems()
    },

  }
}
</script>
<style media="screen">
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    /* width: 49%; */
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    /* width: 49%; */
  }
  /*分辨率低于1280，采用下面的样式*/
    @media screen and (max-device-width:1280px){
        .outDiv{
          width: 1060px;
        }
    }
    /*分辨率高于1280，采用下面的样式*/
    @media screen and (min-device-width: 1281px){
        .outDiv{
          width: 100%;
        }
    }
  
</style>
