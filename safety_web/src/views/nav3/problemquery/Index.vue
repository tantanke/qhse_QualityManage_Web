<template>
  <div>
    <!-- <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)"> -->
    <div class="page-title">问题清单</div>
    <div class="page-content">
      <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch"
        label-position="left">
        <el-row > 
          <!-- <el-col :span="8"> -->
            <el-form-item label="受检单位:">
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择受检单位"
              v-model="filterQuery.companyCode"
              style="width:280px;margin-left:10px"
              /> 
            </el-form-item>
          <!-- </el-col>  -->
          <!-- <el-col :span="8"> -->
            <el-form-item label="检查时间：">
              <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:280px">
              </el-date-picker>
            </el-form-item>  
          <!-- </el-col>   -->
        </el-row>
        <el-row>
        <el-col >       
            <el-form-item label="任务名称：">
              <el-autocomplete 
              v-model="filterQuery.taskName"
              clearable
              :fetch-suggestions="querySearch"
              placeholder="请输入任务名称"
              :trigger-on-focus="true"
              style="width:280px"
              >
              </el-autocomplete>
            </el-form-item>   
            <el-form-item label="问题状态：">
              <el-select style="width:280px" v-model="filterQuery.status" placeholder="选择问题状态" clearable>
              <el-option v-for="item in states" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="问题级别：">
              <el-select style="width:280px" v-model="filterQuery.problemRank" placeholder="问题级别" clearable>
              <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
            <el-form-item>
              <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button style="background-color:#3399CC;color:#FFFFFF;width:100%" @click="export2Excel ()">导出Excel</el-button>
            </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <el-table
    :data="tableData"
    v-loading="loading"
    border
    @row-click="clickTable"
    ref="refTable"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand" label-width="140px">
          <el-row>
            <el-col :span="12">
           <el-form-item label="任务名：">{{ props.row.taskName }}</el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="检查时间：">{{ props.row.checkDate }}</el-form-item>
          </el-col>
          </el-row>
          <el-row>
          <el-col :span="12">
             <el-form-item label="受检单位名称：">{{ props.row.companyName}}</el-form-item>
          </el-col>
          <el-col :span="12">
           <el-form-item label="受检二级单位名称：">{{ props.row.parentCompanyName }}</el-form-item>
           </el-col>
          </el-row>
          <el-row>
              <el-col :span="12">
                <el-form-item  label="检查项1：">{{ props.row.checkItemName1 }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="问题类别1：">{{ props.row.problemClass1 }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="检查项2：">{{ props.row.checkItemName2 }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="问题类别2：">{{ props.row.problemClass2 }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item  label="检查项3：">{{ props.row.checkItemName3 }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="问题原因:" >{{ props.row.source }}</el-form-item>
              </el-col>
            </el-row>
          <el-row>
            <el-col :span="12">
           <el-form-item label="任务:" >{{ props.row.task }}</el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="工序:" >{{ props.row.process }}</el-form-item>
          </el-col>
          </el-row>
           <el-row>
            <el-col :span="12">
           <el-form-item label="违章扣款:" >{{ props.row.penalty }}</el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="违章记分:">{{ props.row.lostScore }}</el-form-item>
          </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
           <el-form-item label="限定整改完成日期:" >{{ props.row.limtRectDate }}</el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="问题所属岗位:">{{ props.row.problemStation }}</el-form-item>
          </el-col>
          </el-row>
          <el-row>
              <el-form-item label="问题标准描述:" >{{ props.row.description }}</el-form-item>
          </el-row>
          <el-row>
              <el-form-item label="问题详细描述:" >{{ props.row.descriptionDetail }}</el-form-item>
          </el-row>
          <el-row>
              <el-form-item label="建议整改措施:" >{{ props.row.recommendRectiMeasure }}</el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
           <el-form-item label="责任人:" >{{ props.row.responsePersonName }}</el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="责任人性质:">{{ props.row.responseEmpGroup }}</el-form-item>
          </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
           <el-form-item label="问题级别:">{{ props.row.problemRank }}</el-form-item>
           </el-col>
           <!-- <el-col :span="12">
            <el-form-item label="问题重复性:" >{{ props.row.problemRepeat }}</el-form-item>
          </el-col> -->
          </el-row>
           <el-form-item label="检查附件："></el-form-item>
                <el-row >
                <el-col :span="6">
                  <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.checkAttach1 !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.checkAttach1" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.checkAttach1" :alt="props.row.checkAttach1" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.checkAttach2 !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.checkAttach2" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.checkAttach2" :alt="props.row.checkAttach2" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                   <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.checkAttach3 !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.checkAttach3" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.checkAttach3" :alt="props.row.checkAttach3" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                   <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.checkAttach4 !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.checkAttach4" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.checkAttach4" :alt="props.row.checkAttach4" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
              </el-row>
          <el-form-item label="检查视频："></el-form-item>
                <el-row >
                <el-col :span="6">
                  <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.checkVideo !==''">
                   <video width="100%" height="230" controls>
                  <source :src="props.row.checkVideo" type="video/mp4">
                </video>
                </el-card>
                </el-col>
               </el-row> 
           <el-row>
            <el-col :span="12">
           <el-form-item label="检查人员:">{{ props.row.checkPersonName }}</el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="整改负责人:" >{{ props.row.rectiPerson }}</el-form-item>
          </el-col>
          </el-row>
           <el-row>
            <el-col :span="12">
           <el-form-item label="整改完成时间:">{{ props.row.rectiFinishDate }}</el-form-item>
           </el-col>
           <el-col :span="12">
            <el-form-item label="是否延期:" >{{ props.row.isPostpone }}</el-form-item>
          </el-col>
          </el-row>
          <el-row>
              <el-form-item label="整改描述:" >{{ props.row.rectiMeasure }}</el-form-item>
          </el-row>
           <el-form-item label="整改附件："></el-form-item>
                <el-row >
                <el-col :span="6">
                  <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.rectAttach1 !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.rectAttach1" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.rectAttach1" :alt="props.row.rectAttach1" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.rectAttach2 !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.rectAttach2" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.rectAttach2" :alt="props.row.rectAttach2" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                   <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.rectAttach3 !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.rectAttach3" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.rectAttach3" :alt="props.row.rectAttach3" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                <el-col :span="6">
                   <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.rectAttach4 !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.rectAttach4" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.rectAttach4" :alt="props.row.rectAttach4" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
              </el-row>
              <el-form-item label="整改视频："></el-form-item>
                <el-row >
                <el-col :span="6">
                  <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.rectVideo !==''">
                   <video width="100%" height="230" controls>
                  <source :src="props.row.rectVideo" type="video/mp4">
                </video>
                </el-card>
                </el-col>
               </el-row>  
               <el-row>
              <el-col :span="12">
                <el-form-item label="验证时间:">{{ props.row.verifyDate }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="验证人:">{{ props.row.verifyPerson }}</el-form-item>
              </el-col>
            </el-row>
          <el-row>
           <el-form-item label="整改效果:">{{ props.row.rectEffect }}</el-form-item>
          </el-row>
          <el-row>
              <el-form-item label="验证结果描述:">{{ props.row.verifyDescription }}</el-form-item>
          </el-row>
        <el-form-item label="验证附件："></el-form-item>
               <el-row>
                <el-col :span="6">
                  <el-card :body-style="{ padding: '10px' }" style="width:90%;height:240px" v-if="props.row.verifyAttach !==''">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="props.row.verifyAttach" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="props.row.verifyAttach" :alt="props.row.verifyAttach" style="max-height: 240px">
                  </el-popover><br/>
                </el-card>
                </el-col>
                </el-row>
        </el-form>
      </template>
    </el-table-column>
     <el-table-column
          type="index"
          :index="this.indexStartNum"
          label="序号"
          width="50">
    </el-table-column>
    <el-table-column
      label="任务名称"
      prop="taskName"
      header-align="center"
      width="150">
    </el-table-column>
    <el-table-column
      label="受检单位"
      prop="companyName"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="受检二级单位"
      prop="parentCompanyName"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="检查时间"
      prop="checkDate"
      header-align="center"
      width="180">
    </el-table-column>
    <el-table-column
      label="问题描述"
      prop="descriptionDetail"
      header-align="center"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      label="问题级别"
      prop="problemRank"
      header-align="center"
      width="100">
    </el-table-column>
    <!-- <el-table-column
      label="问题重复性"
      prop="problemRepeat"
      header-align="center"
      width="100">
    </el-table-column> -->
    <el-table-column
      label="问题状态"
      prop="status"
      header-align="center"
      width="120">
    </el-table-column>
    <el-table-column
      label="责任人"
      prop="responsePersonName"
      header-align="center"
      width="100">
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
import {GetDictionary} from '../../../services/dictionary'
import {GetProblemList1,DeleteProblem} from '../../../services/problem'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
const DefaultQuery = {
  taskName: '',
  companyCode: null,
  checkDate1: '',
  checkDate2: '',
  problemRank: '',
  // problemRepeat: '',
  status:'',
  pageIdx: 1,
  pageSize: 10
}
const DefaultQueryExcel = {
  taskName: '',
  companyCode: null,
  checkDate1: '',
  checkDate2: '',
  problemRank: '',
  // problemRepeat: '',
  Status:'',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
  components: { Treeselect },
  data () {
    return {
      pid:0,
      filterQuery: {},
      fitertask: {},
      taskAyy: '',
      taskNameList: [],
      taskNameList1:[],
      loading: false,
      tableData: [],
      timeout: null,
      dateRange:[],
      total: 0,
      options: [],
      levels:[],
      repeats:[],
      states:[],
      indexStartNum:1
    }
  },
  mounted() {
    this.loadFilterParams()
    this.gettaskName()
    this.handleGetListData() 
    this.getDate()
    this.getlevels()
    // this.getrepeats()
    this.getStatusDict()
  },
  methods:{
    getlevels(){
      GetDictionary({name: '问题级别'}).then((res) => {
        this.levels = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    // getrepeats(){
    //   GetDictionary({name: '问题重复性'}).then((res) => {
    //     this.repeats = res.data
    //   }).catch((err) => {
    //     this.$message.error(err.message)
    //   })
    // },
    getStatusDict () {
      GetDictionary({name: "问题状态", type: "all"}).then((res) => {
        this.states = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    getDate(){
          GetCompany().then((res) => {
         this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
      },
      handleDelete (item) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteProblem(item.problemID).then(() => {
          this.handleGetListData()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
      export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetProblemList1(this.filterQueryExcel).then((data) => {
        this.excelData = data.data
        this.loading = false
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['任务名','受检单位名称','受检二级单位名称','检查时间','问题状态','检查项一','检查项二','检查项三',
          '任务','工序','违章扣款','违章记分','问题标准描述','问题详细描述','限定整改完成日期','建议整改措施','问题所属岗位','责任人','责任人性质',
          '问题级别','问题类别1','问题类别2','问题原因','检查人员','整改描述','是否延期',
          '整改完成时间','整改负责人','验证结果描述','整改效果','验证时间','验证人'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['taskName','companyName','parentCompanyName','checkDate','status','checkItemName1',
          'checkItemName2','checkItemName3','task','process','penalty','lostScore','description','descriptionDetail','limtRectDate',
          'recommendRectiMeasure','problemStation','responsePersonName','responseEmpGroup','problemRank','problemClass1',
          'problemClass2','source','checkPersonName','rectiMeasure','isPostpone',
          'rectiFinishDate','rectiPerson','verifyDescription','rectEffect',
          'verifyDate','verifyPerson'];
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
    gettaskName(){
        GetProblemList1(this.fitertask).then((res) => {  
        this.taskAyy = res.data.list
        for(var i=0;i<this.taskAyy.length;i++){
            this.taskNameList1.push({"value": this.taskAyy[i].taskName})
        }
        var hash = {};
          this.taskNameList = this.taskNameList1.reduce(function(item, next) {
          hash[next.value] ? '' : hash[next.value] = true && item.push(next);
          return item
         }, [])
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)

      })
      },
      clickTable(row){
           this.$refs.refTable.toggleRowExpansion(row)
      },
      handleSearch () {
      this.filterQuery.pageIdx = 1
      this.handleGetListData()
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
          this.filterQuery = {...this.filterQuery,
          pageIdx: parseInt(this.filterQuery.pageIdx, 10),
          pageSize: parseInt(this.filterQuery.pageSize, 10),
          }
          //填充datepicker range组件的内容
          if (this.filterQuery.checkDate1 && this.filterQuery.checkDate2) {
            this.dateRange = [this.filterQuery.checkDate1, this.filterQuery.checkDate2]
            }
          },
      querySearch(queryString, cb) {
        let results = queryString ? this.taskNameList.filter(this.createStateFilter(queryString)) : this.taskNameList;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      },
      handleGetListData () {
      this.checkFilterParams()
      this.loading = true
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      this.$router.push({query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      GetProblemList1(this.filterQuery).then((res) => {
        // alert(JSON.stringify(res))
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
      createStateFilter(queryString) {
        return (taskName) => {
          return (taskName.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
        };
      }
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