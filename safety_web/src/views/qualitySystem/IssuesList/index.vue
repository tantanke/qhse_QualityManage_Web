<template>
	<div>
		<div class="page-title" style="width: 100%">问题清单</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :inline='true'>
				<el-form-item label="受审单位">
					<treeselect :multiple="false"  placeholder="请选择公司单位" style="width: 250px" :options="companyList"
					:disable-branch-nodes="true" 
					 v-model="companyId"></treeselect>
				</el-form-item>
				<el-form-item label="审核日期">
					<el-date-picker  v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px"></el-date-picker>
				</el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="select">查询</el-button>
			</el-form>
			<el-row>
				<el-table border='true' row-key="qualityCheckID" :data="checkListData" style="width: 100%">
					<el-table-column type="index" label="序号" width="80%" align="center"></el-table-column>
					<el-table-column prop="checkListName" label="检查表名称" align="center" width="200%"></el-table-column>
					<el-table-column prop="checkPerson" label="监督人员" align="center" width="200%"></el-table-column>
					<el-table-column prop="taskType" label="审核方式" align="center" width="150%"></el-table-column>
					<el-table-column prop="checkedCompanyName" label="受审单位" align="center" width="150%"></el-table-column>
					<el-table-column prop="group" label="受审部门" align="center" width="200%"></el-table-column>
					<el-table-column prop="checkDate" label="审核日期" align="center" width="150%"></el-table-column>
					<el-table-column prop="responsiCompanyName" label="责任单位" align="center" width="200%"></el-table-column>
					<el-table-column prop="responsePersonName" label="责任人" align="center" width="200%"></el-table-column>
					<el-table-column label="操作" align="center" fixed="right" width="100%">
						<template slot-scope="scope">
							<el-button icon="el-icon-search" type="primary" size="mini" @click="show(scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</div>
	</div>
</template>

<script>
	import {
		getCompany,
		queryTableByYearAndComAndPush,
		queryCheckTreeByID
	} from "../../../services/qualitySystem/FieldInformEntry.js"
	import{queryTable}from '../../../services/qualitySystem/issuesList.js'
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser' 
	export default {
		data() {
			return {
				loading: false,
				companyList:'',
				companyCode:'',
				companyName:'',
				companyId:null,
				dateRange:[],
				checkListData:[],
				selectedData: [],
				queryData:{
					checkedCompanyCode:'',
					checkDate:''
				}
			}
		},
		mounted(){
			this.getCompany()
		},
		methods:{
			GetCurrentUser() {
				return GetCurrentUser();
			},
			select() {
				//console.log('user', this.GetCurrentUser())
				if (this.dateRange) {
					if (this.companyId && this.dateRange.length > 0) {
						this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
						this.queryData.checkedCompanyCode = this.companyCode
						this.queryData.checkDate = this.dateRange[0] + ';' + this.dateRange[1]
						console.log(this.queryData)
						queryTable(this.queryData).then(res=>{
							console.log(res.data)
							this.checkListData=res.data
						}).catch(err=>{
							this.$message.error(err.message)
						})
					}else{
						this.$message.error('查询信息不完整')
					}
				} else {
					this.$message.error('查询信息不完整')
				}
			
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
			getCompany() {
				getCompany().then(res => {
					console.log(res.data)
					this.companyList = res.data
				})
			},
			show(row){
				this.$router.push({
					path:'/qualitySystem/IssuesList/showIndex',
					query:{
						qualityCheckData:row
					}
				})
			},
		}
	}
</script>

<style>
	.demo-table-expand {
		font-size: 0;
	}

	.demo-table-expand label {
		width: 100px;
		color: #99a9bf;
	}

	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
</style>
