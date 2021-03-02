<template>
  <div>
    <div class="page-title">事件</div>
    <div class="page-content">
      <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
         <el-row>
        <el-form-item label="事件类别：">
        <el-select v-model="filterQuery.eventRecordType" placeholder="请选择事件类别" clearable>
              <el-option
                v-for="item in eventRecordTypes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
        </el-select>
        </el-form-item>
        <!-- <el-form-item label="事件描述:">
        <el-autocomplete 
        v-model="inputName3"
        clearable
        :fetch-suggestions="querySearch3"
        placeholder="请输入事件描述"
        :trigger-on-focus="true">
        </el-autocomplete>
        </el-form-item> -->
          <el-form-item label="发生时间：">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width:250px">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
         <el-form-item>
          <router-link :to='{name: "Event_New"}' >
            <el-button icon='el-icon-plus' native-type='button'>新增</el-button>
          </router-link>
        </el-form-item>
        <el-form-item>
          <el-button  style="background-color:#3399CC;color:#FFFFFF" @click="export2Excel ()">导出Excel</el-button>
        </el-form-item>
          </el-row>
      </el-form>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        @row-click="clickTable" ref="refTable"
        style="width: 100%" >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="文档附件："><a :href="props.row.attach">下载文档</a></el-form-item>
                <el-row >
                <el-form-item label="图片附件："></el-form-item>
                </el-row >
                <el-row >
                <el-col :span="6">
                  <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.attach1" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.attach1" :alt="props.row.attach1" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.attach2" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.attach2" :alt="props.row.attach2" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                   <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.attach3" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.attach3" :alt="props.row.attach3" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                   <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.attach4" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.attach4" :alt="props.row.attach4" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
              </el-row>   
              </el-form>
            </template>
          </el-table-column>
          
        <!-- <el-table-column label="序号"  width='80%'>
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
        <el-table-column label="事件单位名称" prop="companyName" header-align="center"></el-table-column>
        <el-table-column label="事件名称" prop="eventRecordName" header-align="center"> </el-table-column>
        <el-table-column label="事件类别" prop="eventRecordType" header-align="center" width=100%> </el-table-column>
        <el-table-column label="地点"     prop="address" header-align="center"> </el-table-column>
        <el-table-column label="发生时间" prop="checkDate" header-align="center"  width=180%> </el-table-column>
        <el-table-column label="事件描述" prop="description" header-align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" width=180%>>
          <template slot-scope="scope">
            <div class="inline-td">
              <router-link :to='{name: "Event_Edit", params: {id: scope.row.id}}'>
                <el-button size="mini" type="primary" icon="el-icon-edit-outline">修改</el-button>
              </router-link>
              &nbsp;&nbsp;
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteEvent(scope.row)">删除</el-button>
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
import {GetEventList,DeleteEvent} from '../../../services/event'
import {GetDictionary} from '../../../services/dictionary'

const DefaultQuery = {
  // companyName :'',
  eventRecordType:'',
  // description:'',
  startDate: '',
  endDate: '',
  pageIdx: 1,
  pageSize: 10,
}
const DefaultQueryExcel = {
  // companyName :'',
  eventRecordType:'',
  // description:'',
  startDate: '',
  endDate: '',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
    data() {
      return {
        filterQuery: {},
        fitertask: {},
        total: 0,
        loading: false,
        tableData: [],
        taskAyy: '',
        dateRange:[],
        inputName1:'',
        inputName2:'',
        inputName3:'',
        timeout: null,
        companyNameList: [],
        eventRecordTypeList:[],
        descriptionList:[],
        eventRecordTypes:[],
        indexStartNum:1 

      }
    },
    mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetListData() 
    // this.getcompanyName()
    this.geteventRecordType()
    // this.getdescription()
    // this.handleGetDate()
    },
    methods:{
       geteventRecordType(){
       GetDictionary({name: '事件类别'}).then((res) => {
        // alert(JSON.stringify(res))  
        this.eventRecordTypes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
      },
      //  getdescription(){
      //   GetEventList(this.fitertask).then((res) => {
      //   // alert(JSON.stringify(res))  
      //   this.taskAyy = res.data.list
      //   this.total = res.data.total
      //   for(var i=0;i<this.total;i++){
      //     this.descriptionList.push({"value": this.taskAyy[i].description})
      //   }
      //   this.loading = false
      // }).catch((err) => {
      //   this.$message.error(err.message)
      // })
      // },
      // querySearch3(queryString, cb) {
      //   let results = queryString ? this.descriptionList.filter(this.createStateFilter3(queryString)) : this.descriptionList;
      //   clearTimeout(this.timeout);
      //   this.timeout = setTimeout(() => {
      //     cb(results);
      //   }, 1000 * Math.random());
      // },
      // createStateFilter3(queryString) {
      //   return (inputName3) => {
      //     return (inputName3.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
      //   };
      // },
      handleSearch () {
      this.filterQuery.pageIdx = 1
      this.filterQuery.companyName = this.inputName1
      // this.filterQuery.eventRecordType = this.inputName2
      // this.filterQuery.description = this.inputName3
      this.handleGetListData()
    },
      handleGetListData () {
        //筛选条件
        // this.check()
      this.checkFilterParams()
      this.loading = true
      // 为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      // this.$router.push({name: 'Problemlist',query: this.filterQuery})
      // 接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      GetEventList(this.filterQuery).then((res) => {
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
       handleDeleteEvent (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteEvent(item.id).then(() => {
          this.handleGetListData()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
      handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetListData()
    },
    //为了保存过滤条件,利用路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
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
      if (this.filterQuery.startDate && this.filterQuery.endDate) {
        this.dateRange = [this.filterQuery.startDate, this.filterQuery.endDate]
      }
    },
      checkFilterParams () {
      //datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
      if (this.dateRange && this.dateRange.length === 2) {
        this.filterQuery.startDate = this.dateRange[0]+' '+'00:00:00'
        this.filterQuery.endDate = this.dateRange[1]+' '+'23:59:59'
      } else {
        this.filterQuery.startDate = ''
        this.filterQuery.endDate = ''
      }
    },
      clickTable(row){
      this.$refs.refTable.toggleRowExpansion(row)
    },
       export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetEventList(this.filterQueryExcel).then((data) => {
        this.excelData = data.data
        this.loading = false
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['事件单位名称','事件名称','事件类别','地点','发生时间','事件描述'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['companyName','eventRecordName','eventRecordType','address','checkDate','description'];
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
   }
  }
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>


