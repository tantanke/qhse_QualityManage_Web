<template>
    <div>
      <!-- <link media="screen and (max-device-width:1280px)">
      <link media="screen and (min-device-width:1280px)">  -->
        <div class="page-title">事故</div>
        <div class="page-content">
        <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-row>
          <!-- <el-col :span="8"> -->
            <el-form-item label="事故类别：">
              <el-select  v-model="filterQuery.accidentRecordType" placeholder="事故类别" clearable>
                <el-option v-for="item in accidentRecordTypes" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="8"> -->
            &nbsp;&nbsp;
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
              style="width:250px"
              >
            </el-date-picker>
          </el-form-item>
          <!-- </el-col> -->
          </el-row>
          <el-row>
          <!-- <el-col :span="8"> -->
            <el-form-item label="事故级别：">
              <el-select v-model="filterQuery.accidentClass" placeholder="事故级别" clearable>
                <el-option v-for="item in accidentClasses" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="8"> -->
            &nbsp;&nbsp;
            <el-form-item label="事故描述：">
              <el-autocomplete 
              v-model="inputName"
              clearable
              :fetch-suggestions="querySearch"
              placeholder="请输入事故描述字段"
              :trigger-on-focus="true"
              style="width:250px"
              >
            </el-autocomplete>
          </el-form-item>   
          <!-- </el-col> -->
         <!-- <el-col :span="8"> -->
           &nbsp;&nbsp;
            <el-form-item>
              <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button  type="warning" icon="el-icon-download" @click="export2Excel ()">导出Excel</el-button>
            </el-form-item>
          <!-- </el-col> -->
        </el-row>
        </el-form>
        <el-table
        :data="tableData"
        v-loading="loading"
        border
        @row-click="clickTable"
        ref="refTable"
        max-height="560"
        style="width: 100%" >
        <el-table-column type="expand" show-overflow-tooltip align="center">
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

        <!-- <el-table-column label="序号" width='80%'>
          <template slot-scope="scope" >
            <font>{{scope.$index + 1}}</font>
          </template>
        </el-table-column> -->
        <el-table-column
          type="index"
          show-overflow-tooltip
          width="60"
          header-align="center"
          label="序号"
          :index="this.indexStartNum"
          align="center">
        </el-table-column>
        <el-table-column label="事故名称" prop="accidentRecordName" show-overflow-tooltip header-align="center" ></el-table-column>
        <el-table-column label="事故单位名称" prop="companyName" show-overflow-tooltip header-align="center" > </el-table-column>
        <el-table-column label="作业项目" prop="workItem" header-align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="事故类别" prop="accidentRecordType" header-align="center" width=100% show-overflow-tooltip> </el-table-column>
        <el-table-column label="事故级别" prop="accidentClass" header-align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="地点" prop="address" header-align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="发生时间" prop="checkDate" header-align="center" width=100% show-overflow-tooltip> </el-table-column>        
        <el-table-column label="事故描述" prop="description" header-align="center" show-overflow-tooltip > </el-table-column>
      </el-table>
      <div class="pagination-base">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="filterQuery.pageIdx"
          :page-size="filterQuery.pageSize"
          :total="total"
          background
          layout="total,prev, pager, next,jumper"
          style="float:right;">
        </el-pagination>
      </div>
        </div>
    </div>
</template>

<script>
import {GetAccidentList} from '../../../services/accident'
import {GetDictionary} from '../../../services/dictionary'
const DefaultQuery = {
  accidentRecordType: '',
  accidentClass: '',
  startDate: '',
  endDate: '',
  pageIdx: 1,
  pageSize:10,
  description:'',
  
}
const DefaultQueryExcel = {   //************
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
    data() {
        return {
             filterQuery: {},
             filterQueryExcel: {},
             total: 0,
             loading: false,
             dateRange: [],
             tableData: [],
             accidentRecordTypes:[],
             accidentClasses:[],
             fitertask: {},
             descriptionList:[],
             inputName:'',   
             excelData:[],
             indexStartNum:1 
        };

    },

mounted () {
    this.loadFilterParams() //加载默认条件
    this.getStatusDict()
    this.getStatusDict1()
    this.handleGetListData()
    this.Description1()
  },
  methods:{
     //导出excel
      export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetAccidentList(this.filterQueryExcel).then((data) => {
        this.excelData = data.data
        this.loading = false
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          //************
          const tHeader = ['事故名称','事故单位名称','作业项目','事故类别','事故级别','地点','发生时间','事故描述'];
          // 上面设置Excel的表格第一行的标题
          //************
          const filterVal = ['accidentRecordName','companyName','workItem','accidentRecordType','accidentClass','address','checkDate','description'];
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

    clickTable(row){
        this.$refs.refTable.toggleRowExpansion(row)
      },
      handleSearch () {
      this.filterQuery.pageIdx = 1
      this.filterQuery.description = this.inputName
      this.handleGetListData()
      
      
      },

     handleGetListData () {
      //整理筛选条件
      this.checkFilterParams()
      this.loading = true
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      this.$router.push({name: 'select_Accident', query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      // alert(JSON.stringify(this.filterQuery))
      GetAccidentList(this.filterQuery).then((res) => {
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
      GetDictionary({name: '事故类别', type: "all"}).then((res) => {
        this.accidentRecordTypes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    getStatusDict1 () {
      GetDictionary({name: '事故级别', type: "all"}).then((res) => {
        this.accidentClasses = res.data
        //alert(JSON.stringify(res.data))
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取事故描述字段
     Description1(){
        GetAccidentList(this.fitertask).then((res) => {  
        this.taskAyy = res.data.list
        this.total = res.data.total
        for(var i=0;i<this.total;i++){
            this.descriptionList.push({"value": this.taskAyy[i].description})
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
      })
      },
    querySearch(queryString, cb) {
      let results = queryString ? this.descriptionList.filter(this.createStateFilter(queryString)) : this.descriptionList;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (inputName) => {
        return (inputName.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
      };
    },
    //为了保存过滤条件,利用路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
    loadFilterParams () {
      //从query读取过滤条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {
        ...this.filterQuery,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize,10),
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
    }

}

}
</script>

<style>

</style>
