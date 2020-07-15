<template>
  <div  >
		<div class="page-title">我接收的任务</div>
		<div class="page-content">
			<el-form  v-if="this.client === 'android'"
			:inline="true"
			:model="filterQuery"
			@submit.native.prevent="handleSearch">
				<el-form-item label="任务状态：">
					<el-select  style="width:180px" v-model="filterQuery.status" placeholder="选择任务状态" clearable>
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
						style="width:230px"
						:editable="false">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
				</el-form-item>
			</el-form>
			<el-form v-else
			:inline="true"
			:model="filterQuery"
			@submit.native.prevent="handleSearch">
				<el-form-item label="任务状态：">
					<el-select  style="width:180px" v-model="filterQuery.status" placeholder="选择任务状态" clearable>
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
						style="width:230px">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" v-loading="loading" border style="width: 100%;">
				<!-- 表格下拉区 -->
				<el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand" label-width="100px" >
		<el-row>
			<el-col :span="12">
			<el-form-item label="检查级别：">
				<span>{{ props.row.checkRank }}</span>
           </el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="检查类型：">
					<span>{{ props.row.checkType }}</span>
					</el-form-item>
			</el-col>
		</el-row>
		<el-row>
		<el-form-item label="主要内容：">
			<span>{{ props.row.mainContain }}</span>
        </el-form-item>
		</el-row>
		<el-row>
			<el-col :span="12">
				<el-form-item label="文档附件："><a :href="props.row.attach">下载文档</a></el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="评分：">
					<span>{{ props.row.score }}</span>
					</el-form-item>
			</el-col>
		</el-row>
        </el-form>
      </template> 
        </el-table-column>          
				<el-table-column type="index" :index="this.indexStartNum" label="序号" width="50"></el-table-column>
				<el-table-column label="任务单号" prop="orderNumber"  show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskName" label="任务名称"></el-table-column>
				<el-table-column prop="leader" label="负责人"></el-table-column>
				<el-table-column prop="issueDate" label="下达时间" width="100px" ></el-table-column>
				<el-table-column prop="status" label="任务状态"></el-table-column>
				<el-table-column label="操作" align="center" header-align="center" width="180px"  fixed="right">
					<template slot-scope="scope">
						<div class="inline-td"> 
							<router-link :to='{name: "personComplatePlan", params: {id: scope.row.taskCheckPersonsID}}' v-if="scope.row.status === '执行中'">
								<el-button size="mini" icon="el-icon-edit-outline">编制计划</el-button>
							</router-link>
							<router-link :to='{name: ""}' v-else>
								<el-button size="mini" icon="el-icon-edit-outline" :disabled=true>编制计划</el-button>
							</router-link>
							&nbsp;&nbsp;
              <el-button size="mini"  @click="batchAccept(scope.row.taskID, {status: '执行中',taskCheckPersonsID:scope.row.taskCheckPersonsID,receiveDate: formatDate(new Date())})" v-if="scope.row.status === '已下达'">接收</el-button>
              <el-button size="mini" :disabled=true v-else>接收</el-button>
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
import {GetDictionary} from '../../../services/dictionary'
import {GetComplateTasksList} from '../../../services/personCenter'
import {UpdateTask} from '../../../services/task'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
	const DefaultQuery = {
			status: '', 
			issueDate1: '',
			issueDate2: '',
			pageIdx: 1,
			pageSize: 10
	}
	const DefaultQueryExcel = {   //************
	status: '', 
	issueDate1: '',
	issueDate2: '',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}

export default {
	data () {
		return {
			client:VueCookies.get("client"),
			filterQuery: {},
			filterQueryExcel: {},
			total: 0,
			loading: false,
			dateRange: '',
			tableData: [],
			states: [],
			excelData:[],
			jsonData:[],
			indexStartNum:1
		}
	},
	methods: {
		//导出excel
		export2Excel() {
		this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
		this.filterQueryExcel = {
			...this.filterQueryExcel,
		}
		this.filterQueryExcel.status = this.filterQuery.status
		this.filterQueryExcel.issueDate1 = this.filterQuery.issueDate1
		this.filterQueryExcel.issueDate2 = this.filterQuery.issueDate2
		this.excelData=GetComplateTasksList(this.filterQueryExcel).then((data) => {
			console.log(JSON.stringify(data))
			this.excelData = data.data
			this.loading = false
			console.log(JSON.stringify(this.excelData))
			require.ensure([], () => {
				const { export_json_to_excel } = require('../../../vendor/Export2Excel');
				//************
				const tHeader = ['任务单号','任务名称','任务负责人','下达时间','任务状态','检查级别','检查类别','主要内容','评分'];
				// 上面设置Excel的表格第一行的标题
				//************
				const filterVal = ['orderNumber','taskName','leader','issueDate','status','checkRank','checkType','mainContain','score'];
				// 上面的index、phone_Num、school_Name是tableData里对象的属性
				const list = this.excelData;  //把data里的tableData存到list
				const data = this.formatJson(filterVal, list);
				export_json_to_excel(tHeader, data, '列表excel');
			}).catch(err =>{
				console.log(err);
			})
		})
	},
		formatJson(filterVal, jsonData) {
		return jsonData.map(v => filterVal.map(j => v[j]))
		},
		handleSearch () {
			this.handleGetListData()
		},
		getStatusDict () {
			GetDictionary({name: "小任务状态"}).then((res) => {
				this.states = res.data
			}).catch((err) => {
				this.$message.error(err.message)
			})
		},
		handleGetListData () {
					//整理筛选条件
					this.checkFilterParams()
					this.loading = true
					//为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
					this.$router.push({name: 'personComplateIndex', query: this.filterQuery})
					//接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
					GetComplateTasksList(this.filterQuery).then((res) => {
						this.tableData = res.data.list	
						// alert(JSON.stringify(	this.tableData))
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
	formatDate (date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? '0' + m : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		return y + '-' + m + '-' + d;  
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
		// 批量接收
		batchAccept (id,data) {
			this.$confirm('确定接收任务, 是否继续?', '提示', {
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
		// 批量提交
		batchSubmit (id,data) {
			this.$confirm('确定提交任务, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// SubmitTaskPlan(id).then(() => {
				//   this.handleGetListData()
				// }, (err) => {
				//   this.$message.error(err.message)
				// })
				UpdateTask(id,data).then(() => {
					this.handleGetListData()
				}, (err) => {
					this.$message.error(err.message)
				})
			}).catch(() => {
			})
		},
	},
	mounted () {
		this.loadFilterParams();
		this.getStatusDict();
		this.handleGetListData();
		this.handleGetDate()
	}
}
</script>
<style>
.android-style{
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	font: 18px sans-serif;
}
</style>
