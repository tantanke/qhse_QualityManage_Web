<template>
    <div>
        <!-- <link media="screen and (max-device-width:1280px)">
        <link media="screen and (min-device-width:1280px)"> -->
        <div class="page-title">我下达的任务</div>
        <div class="page-content">
        <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-form-item label="任务状态：">
          <el-select  style="width:200px"  v-model="filterQuery.status" placeholder="选择任务状态" clearable>
            <el-option v-for="item in states" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下达时间：">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width:250px"
          >
          </el-date-picker>
        </el-form-item>
         &nbsp; &nbsp;
        <el-form-item>
          <el-button  type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <router-link :to='{name: "personTaskNew"}' >
            <el-button   icon='el-icon-plus' native-type='button'>新增</el-button>
          </router-link>
        </el-form-item> -->
        <el-form-item>
          <el-button  style="background-color:#3399CC;color:#FFFFFF" @click="export2Excel ()">导出Excel</el-button>
        </el-form-item>
        </el-form>
        <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%" >
          <!-- 表格下拉区 -->
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand" label-width="100px" >
        <el-row>
          <el-form-item label="主要内容：">
            <span>{{ props.row.mainContain }}</span>
          </el-form-item>
        </el-row>   
        <el-row>
          <el-col :span="12"><el-form-item label="文档附件："><a :href="props.row.attach">下载文档</a></el-form-item></el-col>
          <el-col :span="12">
          <el-form-item label="评分：">
            <span>{{ props.row.score }}</span>
          </el-form-item>
          </el-col>
        </el-row>
        </el-form>
      </template>
    </el-table-column>
        <!-- <el-table-column label="序号" width="55px" >
          <template slot-scope="scope">
            <font>{{scope.$index + 1}}</font>
          </template>
        </el-table-column> -->
        <el-table-column
          type="index"
          width="50"
          header-align="center"
          label="序号"
          :index="this.indexStartNum"
          align="center">
        </el-table-column>
        <el-table-column label="任务单号" prop="orderNumber"  show-overflow-tooltip></el-table-column>
        <el-table-column label="任务名称" prop="taskName"  show-overflow-tooltip></el-table-column>
        <el-table-column label="检查级别" prop="checkRank" ></el-table-column>
        <el-table-column label="检查类型" prop="checkType"  ></el-table-column>
        <el-table-column label="任务负责人" prop="leader" width="100%"></el-table-column>
        <el-table-column label="下达时间" prop="issueDate" width="100%"> </el-table-column>
        <el-table-column label="任务状态" prop="status" width="100%"> </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" width="300px" fixed="right" >
          <template slot-scope="scope">
            <div class="inline-td">
               <router-link :to='{name: "personTaskNew", params: {id: scope.row.taskID}}' v-if="scope.row.status === '执行中'">
              <el-button  size="mini" native-type='submit' icon='el-icon-view'>审核</el-button>
              </router-link>
              <router-link :to='{name: ""}' v-else>
              <el-button  size="mini" native-type='submit' icon='el-icon-view' disabled>审核</el-button>
              </router-link>
              &nbsp;&nbsp;
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteTask(scope.row)">删除</el-button>
              &nbsp;&nbsp;
              <router-link :to='{name: "personTaskScore", params: {id: scope.row.taskID}}' v-if="scope.row.status === '完成' && scope.row.score ===0 "  >
                <el-button size="mini" icon="el-icon-edit-outline" >评分</el-button>
              </router-link>
              <router-link :to='{name: ""}' v-else >
                <el-button size="mini" icon="el-icon-edit-outline" disabled >评分</el-button>
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
          style="float:right;"
        >
        </el-pagination>
      </div>
        </div>
    </div>
</template>
<script>
import {GetTasksList} from '../../../services/personCenter'
import {DeleteTask} from '../../../services/task'
import {GetDictionary} from '../../../services/dictionary'
import { UpdateTask} from '../../../services/task'
const DefaultQuery = {
  issueDate1: '',
  issueDate2: '',
  pageIdx: 1,
  pageSize:10,
  status:"已下达",
}
const DefaultQueryExcel = {   //************
  // taskName: '',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
  data () {
    return {
      filterQuery: {},
      filterQueryExcel: {},
      total: 0,
      loading: false,
      dateRange:[] ,
      tableData: [],
      states: [],
      excelData:[],
      indexStartNum:1
    }
  },
mounted () {
    this.loadFilterParams() //加载默认条件
    this.getStatusDict()
    this.handleGetListData()
    this.handleGetDate()
  },
methods:{
  //导出excel
      export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetTasksList(this.filterQueryExcel).then((data) => {
        console.log(JSON.stringify(data))
        this.excelData = data.data
        this.loading = false
        console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          //************
          const tHeader = ['任务单号','任务名称','检查级别','检查类型','任务负责人','下达时间','任务状态','主要内容','评分'];
          // 上面设置Excel的表格第一行的标题
          //************
          const filterVal = ['orderNumber','taskName','checkRank','checkType','leader','issueDate','status','mainContain','score'];
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
  handleSearch () {
      this.filterQuery.pageIdx = 1
      this.handleGetListData()
    },

     handleGetListData () {
      //整理筛选条件
      this.checkFilterParams()
      this.loading = true
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      // this.$router.push({name: 'personTaskIndex', query: this.filterQuery})
      this.$router.push({query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      // alert(JSON.stringify(this.filterQuery))
      GetTasksList(this.filterQuery).then((res) => {
        // console.log(JSON.stringify(res))
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
     handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetListData()
    },
    getStatusDict () {
      GetDictionary({name: "大任务状态", type: "all"}).then((res) => {
        this.states = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
     handleDeleteTask (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteTask(item.taskID).then(() => {
          this.handleGetListData()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
    handleUpdateTask(id,data){
      this.$confirm('确定下达任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UpdateTask(id,data).then(() => {
          this.handleGetListData()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })

    },
    handleUpdateTask1(id,data){
      this.$confirm('确定下达任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UpdateTask(id,data).then(() => {
          this.handleGetListData()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })

    },
    //获取一个月的时间
    handleGetDate(){
      let showDate =new Date();
        let seperator ='-';
        let year = showDate.getFullYear();
        let month = showDate.getMonth() + 1;
        let month1=month-1
        let year1=year
        var strDate = showDate.getDate();
        if(month===1){
          month1=month+11
          year1=year-1
        }
        if (month >= 1 && month <= 9) {
            month = "0" + month;           
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        
       this.filterQuery.issueDate1 = year1 + seperator + month1 + seperator + strDate;
       this.filterQuery.issueDate2 = year + seperator + month + seperator + strDate;
       this.dateRange=[ this.filterQuery.issueDate1, this.filterQuery.issueDate2]
    },




    //为了保存过滤条件,利用路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
    loadFilterParams () {
      //从query读取过滤条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {
        ...this.filterQuery1,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize,10),
      }
      //填充datepicker range组件的内容
      if (this.filterQuery.issueDate1 && this.filterQuery.issueDate2) {
        this.dateRange = [this.filterQuery.issueDate1, this.filterQuery.issueDate2] 
      }
      
    },
    
    checkFilterParams () {
      //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
      if (this.dateRange && this.dateRange.length === 2) {
        this.filterQuery.issueDate1 = this.dateRange[0]+' '+'00:00:00'
        this.filterQuery.issueDate2 = this.dateRange[1]+' '+'23:59:59'

      } else {
        this.filterQuery.issueDate1 = ''
        this.filterQuery.issueDate2 = ''
      }    
    },


}
}
</script>
<style media="screen">
/*分辨率低于1280，采用下面的样式*/
    @media screen and (max-device-width:1280px){
        .outDiv{
          width: 1060px;
        }
    }
    /*分辨率高于1280，采用下面的样式*/
    @media screen and (min-device-width: 1280px){
        .outDiv{
          width: 100%;
        }
    }
</style>
