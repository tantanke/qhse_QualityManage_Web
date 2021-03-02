<template>
    <div>
        <div class="page-title">问题清单</div>
        <div class="page-content">
          <el-form :inline="true" :model="filterQuery">
            <el-form-item label="客户名称：">
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="请选择客户名称"
              v-model="filterQuery.companyCode"
              style="width:250px"/>
            </el-form-item>
            <el-form-item label="监督检查时间：">
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
            <el-form-item>
              <el-button type="primary" @click="handleSearch" icon='el-icon-search'>查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" style="width: 100%" border v-loading="loading">
             <el-table-column type="expand" style="width: 100%">
               <template slot-scope="props">
                 <el-form label-position="left" inline class="table-expand" label-width="140px">
                   <el-row>
                     <el-col :span="12">
                       <el-form-item label="作业地点: ">{{props.row.address}}</el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item label="作业人员类别: ">{{props.row.operatePersonClass}}</el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item label="问题点: ">{{props.row.problemKey}}</el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item label="责任人员: ">{{props.row.responsePersonName}}</el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item label="不符合标准文件: ">{{props.row.isConformRuleName}}</el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item label="文件链接: " :Code="ruleCode=props.row.isConformRuleCode"><a :href="ruleCode" target="_blank">查看详情</a></el-form-item>
                     </el-col>
                    </el-row>
                    <el-row>
                     <el-col :span="12">
                       <el-form-item label="不符合性质: ">{{props.row.isConformRuleRank}}</el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item label="不符合类型: ">{{props.row.isConformRuleClass}}</el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item label="违章性质: ">{{props.row.breakRuleRank}}</el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item label="违章条款: ">{{props.row.breakRuleItem}}</el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item label="扣款: ">{{props.row.penalty}}</el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item label="扣分: ">{{props.row.lostScore}}</el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="24">
                       <el-form-item label="不符合事实描述: ">{{props.row.isConformDescription}}</el-form-item>
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
                   <el-row>
                     <el-col :span="12">
                       <el-form-item label="问题层级: ">{{props.row.problemLevel}}</el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item label="责任部门: ">{{props.row.responseDepartment}}</el-form-item>
                     </el-col>
                   </el-row>
                   <el-form-item label="整改时限: ">{{props.row.limtRectDate}}</el-form-item>
                 </el-form>
               </template>
             </el-table-column>
             <el-table-column
                  type="index"
                  :index="this.indexStartNum"
                  label="序号"
                  width="70"
                  align="center">
            </el-table-column>
            <el-table-column
                label="记录编号"
                prop="recordCode"
                width="150"
                align="center">
              </el-table-column>
             <el-table-column
                label="监督检查类别"
                prop="checkClass"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                label="监督检查人员"
                prop="checkPersonName"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                label="客户名称"
                prop="companyName"
                width="150"
                align="center">
              </el-table-column>
              <el-table-column
              label="监督检查时间"
              prop="checkDate"
              width="150"
              align="center">
              </el-table-column>
              <el-table-column
                label="检验项目"
                prop="checkItemName"
                width="250"
                align="center">
              </el-table-column>
              <el-table-column
                label="专业"
                prop="profession"  
                align="center">
              </el-table-column>
              <el-table-column
                label="作业人员"
                prop="operatePersonName"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column label="操作" align="center" width="200" fixed="right">
                <template slot-scope="scope">
                  <div class="inline-td">
                    <router-link :to='{name: "modify", params: {id: scope.row.problemID}}'>
                      <el-button size="mini" type="primary" ><i class="el-icon-edit"></i>修改{{scope.row.status}}</el-button>
                    </router-link>
                     &nbsp;&nbsp;
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteTask(scope.row)" >删除</el-button>
                    <!-- <el-button  type='primary' size="mini" icon='el-icon-success' @click="handleUpdateProblem1(scope.row.problemID,{status:'未整改'})" v-if="scope.row.status === '未审核'">审核通过</el-button>
                    <el-button  type='primary' size="mini" icon='el-icon-success' :disabled=true v-else>审核通过</el-button>
                    &nbsp;&nbsp;
                    <el-button  type='danger' size="mini" icon='el-icon-error' @click="handleUpdateProblem2(scope.row.problemID)" v-if="scope.row.status === '未审核'">审核不通过</el-button>
                    <el-button  type='danger' size="mini" icon='el-icon-error' :disabled=true v-else>审核不通过</el-button> -->
                  </div>
                </template>
              </el-table-column>
          </el-table>
          <!-- <el-dialog
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
          </el-dialog> -->
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
// import { newSendMessage } from '../../../services/chat'
import {GetProblemList,DeleteProblem} from '../../../services/QHSE'
const DefaultQuery = {
  companyCode: null, 
  checkDate1:'',
  checkDate2:'',
  pageIdx: 1,//当前页码
  pageSize: 10//每页消息数
}
export default {
  components: { Treeselect },
    data() {
      return {
        ruleCode:"",
        dateRange:"",
        addEventdialogVisible:false,
        indexStartNum:1,//起始页码
        loading: false,
        total: 0,//总共消息数
        problemID:'',
        options: [],
        change:{
					modification:'',
					status:'审核未通过'
        },
        tableData:[],
        filterQuery: {
        }
      }
    },
    mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetListData() 
    this.handleGetCompany()//获取公司名称
    },
    methods: {
    //删除单条数据
    handleDeleteTask (item) {
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
          // consloe.log(this.options); 
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      checkFilterParams () {//处理参数
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
          if (this.filterQuery.checkDate1 && this.filterQuery.checkDate2) {
            this.dateRange = [this.filterQuery.checkDate1, this.filterQuery.checkDate2]
          }
      },
      handleGetListData () {//处理请求参数，并发送请求，获取数据
        //筛选条件
        this.checkFilterParams()//处理参数
        this.loading = true
        //为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
        this.$router.push({query: this.filterQuery})
        //接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
        GetProblemList(this.filterQuery).then((res) => {//发送参数，获取数据
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
      // handleUpdateProblem1(id,data){
			// 	this.$confirm('确定该问题审核通过, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     UpdateProblem(id,data).then(() => {
      //      this.$message.success('操作成功')
      //      this.handleGetListData()             
      //     }, (err) => {
      //       this.$message.error(err.message)
			// 		}) 
      //   }).catch(() => {
      //   })
      // },
      // handleUpdateProblem2(id){
      // this.addEventdialogVisible = true;
      // this.problemID=id
      // },
      // handleSubmit (formName) {//？
			// 	this.checkFilterParams()
			// 	this.$refs[formName].validate((valid) => {//?????
			// 		if (valid) {
			// 			UpdateProblem(this.problemID,this.change).then( () => {
      //         newSendMessage({status: 104,problemID:this.problemID}).then().catch();
      //         this.addEventdialogVisible = false;						  
      //         this.$message.success('操作成功')
      //         this.handleGetListData()  						
			// 			}).catch((err) => {
			// 				this.$message.error(err.message)
			// 			})
			// 		} else {
			// 			return false;
			// 			}
			// 			});	
			// },
    }
}
</script>
<style scoped>
</style>
