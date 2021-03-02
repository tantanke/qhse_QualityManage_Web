<template>
	<div>
		<div class="page-title" style="width: 100%">待办任务</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :inline="true">
				<el-form-item label="选择公司:">
					<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
					 v-model="companyId"></treeselect>
				</el-form-item>
				<el-form-item label="下达日期：">
					<el-date-picker type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期" style="width:250px" v-model="issuedDateRange">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="截止日期:">
					<el-date-picker type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期" style="width:250px" v-model="planDateRange"></el-date-picker>
				</el-form-item>
				&nbsp;&nbsp;&nbsp;
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="select()">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="selectedData" style="width: 100%" max-height="560px" border fixed>
				<el-table-column type="index" label="序号" width="60%" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="companyName" label="任务单位" width="160%" align="center" show-overflow-tooltip></show-overflow-tooltip>></el-table-column>
				<el-table-column prop="taskName" label="任务名称" width="260%" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="issuedName" label="下达人" width="100%" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="任务状态" width="100%" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="issuedDate" label="下达时间" width="180%" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="receiveDate" label="接收时间" width="180%" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planDate" label="证据备案截止时间" width="180%" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="trueDate" label="证据备案完成时间" width="180%" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100%" align="center" fixed='right' show-overflow-tooltip>
					<template slot-scope="scope">
						<el-button ref="acceptButton" type="primary" icon="el-icon-check" size="mini" @click="accept(scope.row)" v-if="!scope.row.receiveDate">接收</el-button>
						<el-button type="success" icon="el-icon-success" size="mini" v-else>已接收</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import {
		GetCompany
	} from "../../../services/gettreedata"
	import {
		getTaskList,
		receiveTask
	} from "../../../services/taskList"
	export default {
		data() {
			return {
				companyList: [],
				companyId: null,
				companyCode: '',
				companyName: '',
				issuedDateRange: [],
				planDateRange: [],
				selectedData: [],
				loading:false,
				taskList: [],
				// {
				// 		companyName: '科技信息中心',
				// 		taskName: '测试样例1',
				// 		status: '备案待查',
				// 		issuedName: '测试样例',
				// 		issuedDate: '2020-08-25',
				// 		planDate: '2020-08-30',
				// 		receiveName: '测试样例',
				// 		trueDate: '2020-09-10'
				// 	},
				// 	{
				// 		companyName: '科技信息中心',
				// 		taskName: '测试样例2',
				// 		status: '备案待查',
				// 		issuedName: '测试样例',
				// 		issuedDate: '2020-08-30',
				// 		planDate: '2020-08-25',
				// 		receiveName: '测试样例',
				// 		trueDate: '2020-09-10'
				// 	},
				// 	{
				// 		companyName: '安全监督站',
				// 		taskName: '测试样例3',
				// 		status: '备案待查',
				// 		issuedName: '测试样例',
				// 		issuedDate: '2020-08-25',
				// 		planDate: '2020-08-30',
				// 		receiveName: '测试样例',
				// 		trueDate: '2020-09-10'
				// 	},
				// 	{
				// 		companyName: '安全监督站',
				// 		taskName: '测试样例4',
				// 		status: '备案待查',
				// 		issuedName: '测试样例',
				// 		issuedDate: '2020-08-30',
				// 		planDate: '2020-08-25',
				// 		receiveName: '测试样例',
				// 		trueDate: '2020-09-10'
				// 	}
			}
		},
		watch: {
			companyId() {
				if (this.companyId) {
					this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
				} else {
					this.companyName = ''
					this.companyCode = ''
				}
			},
			issuedDateRange() {
				console.log("issued",this.issuedDateRange)
				if (!this.issuedDateRange) this.issuedDateRange = []
			},
			planDateRange() {
				console.log("plan",this.planDateRange)
				if (!this.planDateRange) this.planDateRange = []
			}
		},
		mounted() {
			this.handleGetCompany()
			this.getTaskList()
		},
		methods: {
			//搜索任务
			select() {
				//中间变量赋值
				var selected = this.taskList
				//当公司搜索框有数据时进行搜索
				if (this.companyName != '') {
					selected = selected.filter(item => {
						return item.companyName == this.companyName
					})
				}
				//当计划备案截止时间搜索框有数据时进行搜索
				if (this.planDateRange.length>0) {
					selected = selected.filter(item => {
						return item.planDate >= this.planDateRange[0] && item.planDate <= this.planDateRange[1]
					})
				}
				//当下达时间搜索框有数据时进行搜索
				if (this.issuedDateRange.length>0) {
					selected = selected.filter(item => {
						return item.issuedDate >= this.issuedDateRange[0] && item.issuedDate <= this.issuedDateRange[1]
					})
				}
				this.selectedData = selected
			},
			//将从filterQuery.companyCode获取的公司id转换为公司名称，递归实现
			changeCompanyIdTocompanyName(val, companyId) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].id == companyId) {
							this.companyName = val[j].label
							this.companyCode = val[j].nodeCode
							break
						} else if (val[j].children) {
							this.changeCompanyIdTocompanyName(val[j].children, companyId)
						}
					}
				}
			},
			//加载选择公司的树形列表
			handleGetCompany() {
				GetCompany().then(res => {
					this.companyList = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//接收任务
			accept(row) {
				//调用接口改变任务接收状态
				receiveTask(row.qHSETaskID).then(res => {
					if (res.code == '1000') {
						this.getTaskList()
						this.$message.success('接收任务成功')
					} else {
						this.$message.error('接收任务失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//调用接口获取任务列表
			getTaskList() {
				this.loading=true
				getTaskList().then(res=>{
					console.log(res.data)
						this.taskList=res.data
						this.select()
						this.loading=false
				}).catch(err=>{
					this.$message.error(err.message)
				})
			}
		}
	}
</script>

<style>
</style>
