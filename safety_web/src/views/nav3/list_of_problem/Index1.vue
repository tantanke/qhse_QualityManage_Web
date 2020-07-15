<template>
  <div>
    <div class="page-title">问题审核</div>
    <div class="page-content">
      <el-form
        :inline="true"
        :model="filterQuery"
        @submit.native.prevent="handleSearch">
        <el-row>
          <!-- <el-col :span="8"> -->
            <el-form-item label="受检单位：">
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择受检单位"
              v-model="filterQuery.companyCode"
              style="width:250px"/> 
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="10"> -->
            <el-form-item  label="检查时间：">
              <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
               style="width:300px"
             >
              </el-date-picker>
            </el-form-item>  
          <!-- </el-col> -->
         <!-- <el-col :span="6"> -->
        <el-form-item>
          <el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="background-color:#3399CC;color:#FFFFFF" @click="export2Excel ()">导出Excel</el-button>
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
    style="width: 100%">
     <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand" label-width="140px">
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
          <el-col :span="12">
           <el-form-item label="检查人员:">{{ props.row.checkPersonName }}</el-form-item>
          </el-col>
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
      width="160">
    </el-table-column>
    <el-table-column
      label="问题级别"
      prop="problemRank"
      header-align="center"
      width="90">
    </el-table-column>
    <el-table-column
      label="责任人"
      prop="responsePersonName"
      header-align="center"
      width="100">
    </el-table-column>
    <el-table-column
      label="检查人员"
      prop="checkPersonName"
      header-align="center"
      width="100">
    </el-table-column>
     <el-table-column
      label="审核状态"
      prop="status"
      header-align="center"
      width="100">
    </el-table-column>
     <el-table-column label="操作"  fixed="right" align="center" header-align="center" width="240px"  >
          <template slot-scope="scope">
            <div class="inline-td">
              <el-button  type='primary' size="mini" icon='el-icon-success' @click="handleUpdateProblem1(scope.row.problemID,{status:'未整改'})" v-if="scope.row.status === '未审核'">审核通过</el-button>
              <el-button  type='primary' size="mini" icon='el-icon-success' :disabled=true v-else>审核通过</el-button>
              &nbsp;&nbsp;
              <el-button  type='danger' size="mini" icon='el-icon-error' @click="handleUpdateProblem2(scope.row.problemID)" v-if="scope.row.status === '未审核'">审核不通过</el-button>
              <el-button  type='danger' size="mini" icon='el-icon-error' :disabled=true v-else>审核不通过</el-button>
            </div>
          </template>
        </el-table-column>
  </el-table>
		<el-dialog
      title="审核修改意见"
      :visible.sync="addEventdialogVisible">
      <el-form ref="change"  :model="change" label-position="left" label-width="90px">
          <el-form-item label="修改意见：">
            <el-input v-model="change.modification" type="textarea" :autosize="{ minRows: 4}"  placeholder="请输入修改意见"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >   
				<el-button type="primary"  @click="handleSubmit('change')">提交</el-button>
        <el-button @click="addEventdialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
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
import {GetProblemList,UpdateProblem} from '../../../services/problem'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import { newSendMessage } from '../../../services/chat'
const DefaultQuery = {
  companyCode: null, 
  status:'未审核',
  pageIdx: 1,
  pageSize: 10
}
const DefaultQueryExcel = {
  companyCode: null,
  checkDate1: '',
  checkDate2: '',
  status:'未审核',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
export default {
    components: { Treeselect },
    data() {
      return {
        filterQuery: {},
        total: 0,
        loading: false,
        tableData: [],
        dateRange: '',
        problemID:'',
        options: [],
        change:{
					modification:'',
					status:'审核未通过'
				},
        addEventdialogVisible: false,
        indexStartNum:1
      }
    },
    mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetListData() 
    this.handleGetCompany()
    },
    methods:{
      //初始获取公司名称、编码
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
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
      handleGetListData () {
        //筛选条件
      this.checkFilterParams()
      this.loading = true
      //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
      this.$router.push({query: this.filterQuery})
      //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
      GetProblemList(this.filterQuery).then((res) => {
        //  console.log(JSON.stringify(res))
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
      handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetListData()
    },
      export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetProblemList(this.filterQueryExcel).then((data) => {
        console.log(JSON.stringify(data))
        this.excelData = data.data
        this.loading = false
        console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          const tHeader = ['任务名称','受检单位','受检二级单位','检查时间','问题级别','责任人','责任人性质','问题描述','问题细节','问题原因','是否立即整改',
                           '限定整改完成日期','建议整改措施','检查项1','检查项2','检查项3','问题类别1','问题类别2','问题所属岗位','任务','工序','违章扣款','违章记分','检查人员'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['taskName','companyName','parentCompanyName','checkDate','problemRank',
                             'responsePersonName','responseEmpGroup','description','descriptionDetail','source','isRectOntime','limtRectDate',
                             'recommendRectiMeasure','checkItemName1','checkItemName2','checkItemName3','problemClass1','problemClass2','problemStation','task','process','penalty','lostScore','checkPersonName'];
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
          if (this.filterQuery.checkDate1 && this.filterQuery.checkDate2) {
            this.dateRange = [this.filterQuery.checkDate1, this.filterQuery.checkDate2]
            }
          },
    handleUpdateProblem1(id,data){
				this.$confirm('确定该问题审核通过, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          UpdateProblem(id,data).then(() => {
           this.$message.success('操作成功')
           this.handleGetListData()             
          }, (err) => {
            this.$message.error(err.message)
					}) 
        }).catch(() => {
        })
    },
     handleUpdateProblem2(id){
     this.addEventdialogVisible = true;
     this.problemID=id
    },
			handleSubmit (formName) {
				this.checkFilterParams()
				this.$refs[formName].validate((valid) => {
					if (valid) {
						UpdateProblem(this.problemID,this.change).then( () => {
              newSendMessage({status: 104,problemID:this.problemID}).then().catch();
              this.addEventdialogVisible = false;						  
              this.$message.success('操作成功')
              this.handleGetListData()  						
						}).catch((err) => {
							this.$message.error(err.message)
						})
					} else {
						return false;
						}
						});	
			},
   }
  }
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 130px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    /* width: 50%; */
  }
</style>


