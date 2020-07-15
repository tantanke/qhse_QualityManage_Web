<template>
  <div v-if="this.client === 'android'">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1281px)">
    <div class="page-title">个人问题验证</div>
    <div class="page-content">

<!-- 查询输入框，按钮 -->
      <el-row>
        <el-form class="toolForm"
          :inline="true"
          :model="filterQuery"
          style="width:100%"
          @submit.native.prevent="handleSearch"
          label-width="5em">
          <el-form-item label="受检单位" >
            <treeselect
            :multiple="false"
            :options="options"
            placeholder="选择单位"
            v-model="filterQuery.companyCode"
            style="width:16em"
            :searchable="false"/> 
          </el-form-item>
          <el-form-item label="检查时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:16em"
              :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
<!-- 问题列表table -->
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        @row-click="clickTable"
        ref="refTable"
        style="width:100%">
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
                <el-form-item  label="检查人员">{{ props.row.checkPersonName }}</el-form-item>
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
              <el-col :span="12">
                <el-form-item  label="问题级别">{{ props.row.problemRank }}</el-form-item>
              </el-col>
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
        <el-table-column type="index" :index="this.indexStartNum" label="序号" width="50em"></el-table-column>
        <el-table-column
          label="受检单位"
          prop="companyName"
          header-align="center"
          width="80em">
        </el-table-column>
        <el-table-column
          label="受检二级单位"
          prop="parentCompanyName"
          header-align="center"
          width="120em">
        </el-table-column>
        <el-table-column
          label="问题描述"
          prop="description"
          header-align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="检查时间"
          prop="checkDate"
          header-align="center"
          width="80em"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="责任人"
          width="65em"
          prop="responsePersonName"
          header-align="center">
        </el-table-column>
        <el-table-column
          label="整改负责人"
          prop="rectiPerson"
          width="95em"
          header-align="center"
          min-width="100px">
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" fixed="right">
          <template slot-scope="scope">
            <div class="inline-td">
              <router-link :to='{name: "PersonalVerify", params: {id: scope.row.problemID}}'>
                <el-button size="mini" type="primary" ><i class="el-icon-edit"></i>验证</el-button>
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
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
  <div v-else>
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1281px)">
    <div class="page-title">个人问题验证</div>
    <div class="page-content">

<!-- 查询输入框，按钮 -->
      
      <el-row>
        <el-form class="toolForm"
          :inline="true"
          :model="filterQuery"
          @submit.native.prevent="handleSearch">
            <el-form-item label="受检单位：" >
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="选择单位"
              v-model="filterQuery.companyCode"
              style="width:250px"/> 
            </el-form-item>
            <el-form-item label="检查时间：">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:300px">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" native-type='submit' icon='el-icon-search' >查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="export2Excel ()">导出Excel</el-button>
            </el-form-item>
        </el-form>
      </el-row>

<!-- 问题列表table -->
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        @row-click="clickTable"
        ref="refTable"
        style="width:100%">
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
                <el-form-item  label="检查人员">{{ props.row.checkPersonName }}</el-form-item>
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
              <el-col :span="12">
                <el-form-item  label="问题级别">{{ props.row.problemRank }}</el-form-item>
              </el-col>
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
        <el-table-column type="index" :index="this.indexStartNum" label="序号" width="50"></el-table-column>
        <el-table-column
          label="受检单位"
          prop="companyName"
          header-align="center"
          min-width="100px">
        </el-table-column>
        <el-table-column
          label="受检二级单位"
          prop="parentCompanyName"
          header-align="center"
          min-width="120px">
        </el-table-column>
        <el-table-column
          label="问题描述"
          prop="description"
          header-align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="检查时间"
          prop="checkDate"
          header-align="center"
          min-width="110px"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="责任人"
          prop="responsePersonName"
          header-align="center">
        </el-table-column>
        <el-table-column
          label="整改负责人"
          prop="rectiPerson"
          header-align="center"
          min-width="100px">
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template slot-scope="scope">
            <div class="inline-td">
              <router-link :to='{name: "PersonalVerify", params: {id: scope.row.problemID}}'>
                <el-button size="mini" type="primary" ><i class="el-icon-edit"></i>验证</el-button>
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
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {GetPersonalProblemList} from '../../../services/personCenter'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

const DefaultQuery = {  
  companyCode: null,
  checkDate1: '',
  checkDate2: '',
  status:'未验证',
  pageIdx: 1,
  pageSize: 10,
}
const DefaultQueryExcel = {
  companyCode: null,
  checkDate1: '',
  checkDate2: '',
  status:'未验证',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
  components: { Treeselect },
  data () {
    return {
      indexStartNum:1,
      client:VueCookies.get("client"),
      filterQuery: {},
      filterQueryExcel: {},
      total: 0,
      dateRange: [],
      options: [],
      loading: false,
      tableData: [],
      timeout: null,
      excelData:[],
    }
  },

  mounted () {
    this.handleGetCompany()
    this.loadFilterParams() //加载默认条件
    this.handleGetProblems()
  },
    
  methods:{
    //初始加载公司名称
    handleGetCompany(){
      GetCompany().then((res) => {
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
      if (this.filterQueryExcel.checkDate1 && this.filterQueryExcel.checkDate2) {
        this.dateRange = [this.filterQueryExcel.checkDate1, this.filterQueryExcel.checkDate2]
      }
      //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
      if (this.dateRange && this.dateRange.length === 2) {
        this.filterQuery.checkDate1 = this.dateRange[0]+' '+'00:00:00'
        this.filterQuery.checkDate2 = this.dateRange[1]+' '+'23:59:59'
      } else {
        this.filterQueryExcel.checkDate1 = ''
        this.filterQueryExcel.checkDate2 = ''
      }
      this.filterQueryExcel.companyCode = this.filterQuery.companyCode
      this.excelData=GetPersonalProblemList(this.filterQueryExcel).then((data) => {
        this.excelData = data.data
        this.loading = false
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['受检单位','受检二级单位','检查人员','检查时间','问题级别','责任人','整改负责人',
                            '问题描述','问题细节','建议整改措施','问题原因','限定整改完成日期','检查项1','检查项2','检查项3',
                            '问题类别1','问题类别2','问题所属岗位','责任人性质','任务','工序','整改描述','是否立即整改',
                            '是否延期','整改完成时间','违章扣款','违章记分'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['companyName','parentCompanyName','checkPersonName','checkDate','problemRank','responsePersonName','rectiPerson',
                              'description','descriptionDetail','recommendRectiMeasure','source','limtRectDate','checkItemName1','checkItemName2','checkItemName3',
                              'problemClass1','problemClass2','problemStation','responseEmpGroup','task','process','rectiMeasure','isRectOntime',
                              'isPostpone','rectiFinishDate','penalty','lostScore'];
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
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      this.$router.push({query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      GetPersonalProblemList(this.filterQuery).then((res) => {
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
    loadFilterParams () {
      //从query读取过滤条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {
        ...this.filterQuery,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize, 10),
      }
      //填充datepicker range组件的内容
      if (this.filterQuery.checkDate1 && this.filterQuery.checkDate2) {
        this.dateRange = [this.filterQuery.checkDate1, this.filterQuery.checkDate2]
      }
    },
  //查询
    handleSearch () {
      this.handleGetProblems()
    },
  }
}
</script>
<style>
  .toolForm {
    width: 100%;
    font-size: 0
  }
  .el-table .el-table-column{
    width: 100%;
  }
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 90%;
  }
  
</style>
<style media="screen">
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
