<template>
	<div>
		<div class="page-title">报告计划</div>
		<div class="page-content">
			<div class="form-content">
				<br />
				<el-form :rules="rules" ref="filterQuery" label-width="150px" :model="filterQuery">
					<el-row>
						<el-col :span="12">
							<el-form-item label="基层单位：">
								<treeselect :multiple="false" :options="options" placeholder="请选择单位名称" v-model="filterQuery.companyCode" style="width:100%" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="检查负责人：" prop="reportCheckPersonID">
								<el-select v-model="filterQuery.reportCheckPersonID" placeholder="输入姓名搜索员工" :filter-method="handlegetEmployees"
								 clearable filterable style="width:100%" :loading="employeesLoading" loading-text="查询中...">
									<el-option v-for="item in names" :key="item.index" :label="`${item.name}(${item.companyName})`" :value="item.employeeID">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>

					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="报告类别：" prop="reportType">
								<el-select style="width:100%" v-model="filterQuery.reportType" filterable placeholder="选择报告类别" clearable>
									<el-option v-for="item in reportTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="报告份数：" prop="count">
								<el-input v-model="filterQuery.count" placeholder="份数" style="width:100%" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="报告计划时间：" prop="reportPlanDate">
								<el-date-picker v-model="filterQuery.reportPlanDate" type="date" style="width:100%" format="yyyy-MM-dd"
								 value-format="yyyy-MM-dd" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item>
								<el-button type="primary" @click="handleSubmit('filterQuery')">生成</el-button>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								<a @click="$router.go(0)">
									<el-button type="info" native-type="button">取消</el-button>
								</a>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<!-- 报告计划列表table -->
			</div>
			<el-table :data="tableData" v-loading="loading" border ref="refTable" style="width: 100%">
				<el-table-column label="序号" width="100px" header-align="center" align="center">
					<template slot-scope="scope">
						<font>{{scope.$index + 1}}</font>
					</template>
				</el-table-column>
				<!-- <el-table-column label="报告ID" prop="reportID" width="100px" header-align="center" align="center"> </el-table-column> -->
				<el-table-column label="报告编号" prop="reportCode" min-width="100%" header-align="center" align="center">
				</el-table-column>
				<el-table-column label="基层单位" prop="companyName" width="250px" header-align="center" align="center">
				</el-table-column>
				<el-table-column label="计划时间" prop="reportPlanDate" width="100px" header-align="center"> </el-table-column>
				<el-table-column label="报告类别" prop="reportType" width="250px" header-align="center" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" header-align="center" width="250px">
					<template slot-scope="scope">
						<div class="inline-td">
							<el-button size="mini" type="primary" @click="reportChange(scope.row.reportID)" icon="el-icon-edit">修改</el-button>
							&nbsp;&nbsp;
							<router-link :to='{name: "ReportCompleteIndex", params: {data:scope.row}}'>
								<el-button size="mini" type="primary" icon="el-icon-edit">填写</el-button>
							</router-link>
							&nbsp;&nbsp;
							<el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteReport(scope.row)">删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>

			<!--修改计划弹窗-->
			<el-dialog title="修改报告计划" :visible.sync="dialogEditVisible">
				<el-form :rules="rules" ref="changeReport" label-width="150px" :model="changeReport">
					<el-row>
						<el-col :span="12">
							<el-form-item label="检查负责人" prop="reportCheckPersonID">
								<el-select v-model="changeReport.reportCheckPersonID" placeholder="输入姓名搜索员工" :filter-method="handlegetEmployees"
								 clearable filterable style="width:100%" @change="selectPeople1" :loading="employeesLoading" loading-text="查询中...">
									<el-option v-for="item in names" :key="item.index" :label="`${item.name}`" :value="item.employeeID">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="基层单位:">
								<treeselect :multiple="false" :options="options" placeholder="请选择单位名称" v-model="changeReport.companyCode" style="width:100%" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="报告编码：" prop="reportCode">
								<el-input v-model="changeReport.reportCode" placeholder="编码" style="width:100%" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="报告类别：" prop="reportType">
								<el-select style="width:100%" v-model="changeReport.reportType" filterable placeholder="选择报告类别" clearable>
									<el-option v-for="item in reportTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="报告计划时间:" prop="reportPlanDate">
								<el-date-picker v-model="changeReport.reportPlanDate" type="date" style="width:100%" format="yyyy-MM-dd"
								 value-format="yyyy-MM-dd" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item>
								<el-button type="primary" @click="handleUpdate('changeReport')">确定</el-button>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								<el-button type="info" native-type="button" @click="dialogEditVisible=false">取消</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-dialog>

			<div class="pagination-base">
				<el-pagination @current-change="handlePageChange" :current-page="listcondition.pageIdx" :page-size="listcondition.pageSize"
				 :total="total" background layout="total, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		GetEmployees
	} from '../../../services/employee'
	import {
		GetCompany
	} from '../../../services/problemRankAnalysis'
	import {
		GetReportType
	} from '../../../services/reportCodeRule'
	import {
		CreateReport,
		UpdateReport,
		GetReport,
		DeleteReport,
		GetReportDetail
	} from '../../../services/reportplan'
	// import Treeselect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	export default {
		data() {
			return {
				filterQuery: {
					reportCheckPersonID: '',
					companyCode: null,
					count: '1',
					reportType: '',
					reportPlanDate: '',
				},
				changeReport: {
					reportCheckPersonID: '',
					companyCode: null,
					reportCode: '',
					reportType: '',
					reportPlanDate: ''
				},
				companyId: null,
				companyCode: '',
				companyName: '',
				listcondition: {
					state: '2',
					pageIdx: 1,
					pageSize: 10
				},
				loading: false,
				tableData: [],
				names: [],
				employeesLoading: false,
				dialogEditVisible: false, //编辑框是否可见
				reportTypes: [],
				total: 0,
				options: [], //存放单位
				rules: {
					reportCheckPersonID: [{
						required: true,
						message: '请选择检查负责人',
						trigger: ['blur', 'change']
					}],
					companyCode: [{
						required: true,
						message: '请选择单位名称',
						trigger: ['blur', 'change']
					}],
					count: [{
						required: true,
						message: '请填写报告份数',
						trigger: ['blur', 'change']
					}],
					reportType: [{
						required: true,
						message: '请选择报告类别',
						trigger: ['blur', 'change']
					}],
					reportPlanDate: [{
						required: true,
						message: '请选择报告计划时间',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		mounted() {
			this.getreporttypes()
			this.handlegetEmployees()
			this.handleGetCompany()
			this.getreportlist()
			this.setNow()
		},
		methods: {
			// 将公司Id转化为公司名称，并且保存nodeCode
			changeCompanyIdToName: function(val, companyId) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].id == companyId) {
							this.companyCode = val[j].nodeCode
							this.companyName = val[j].label
							break
						} else if (val[j].children) {
							this.changeCompanyIdToName(val[j].children, companyId)
						}
					}
				}
			},
			//生成计划
			handleSubmit(formName) {
				this.changeCompanyIdToName(this.options,this.filterQuery.companyCode)
				this.filterQuery.companyCode=this.companyCode
				console.log(JSON.stringify(this.filterQuery))
				this.$refs[formName].validate((valid) => {
					if (valid) {
						CreateReport(this.filterQuery).then(() => {
							//alert(res)
							this.$message.success('操作成功')
							this.getreportlist()
							// this.$router.go(-1) //返回上一url
						}, (err) => {
							this.$message.error(err.message)
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//设置默认当前时间
			setNow() {
				var formatDate = function(date) {
					var y = date.getFullYear();
					var m = date.getMonth() + 1;
					m = m < 10 ? '0' + m : m;
					var d = date.getDate();
					d = d < 10 ? ('0' + d) : d;
					return y + '-' + m + '-' + d;
				}
				this.filterQuery.reportPlanDate = formatDate(new Date())
			},
			//获取员工表
			handlegetEmployees(val = '') {
				this.employeesLoading = true
				GetEmployees({
					name: val,
					type: "all"
				}).then((res) => {
					//alert(JSON.stringify(res))
					this.names = res.data
					this.employeesLoading = false
				}).catch((err) => {
					this.$message.error(err.message)
					this.employeesLoading = false
				})
			},
			//获取单位
			handleGetCompany() {
				GetCompany().then((res) => {
					//alert(JSON.stringify(res))
					this.options = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			//获取报告计划类别字典
			getreporttypes() {
				GetReportType().then((res) => {
					res.data.forEach(element => {
						this.reportTypes.push({
							value: element,
							label: element
						})
					});
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			//获取报告计划列表
			getreportlist() {
				GetReport(this.listcondition).then((res) => {
					//alert(JSON.stringify(res))
					this.tableData = res.data.list
					this.total = res.data.total
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			//删除报告计划列表
			handleDeleteReport(item) {
				this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					DeleteReport(item.reportID).then(() => {
						this.$message.success("删除成功")
						this.getreportlist()
					}, (err) => {
						this.$message.error(err.message)
					})
				}).catch(() => {})
			},
			//根据报告ID获取报告详细信息
			handelGetReportDetail(id) {
				//this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
				GetReportDetail(id).then((res) => {
					this.changeReport = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			//报告计划修改
			reportChange(id) {
				this.dialogEditVisible = true;
				this.handelGetReportDetail(id)
			},
			//处理分页
			handlePageChange(page) {
				this.listcondition.pageIdx = page
				this.getreportlist()
			},
			//处理报告计划修改
			handleUpdate() {
				this.changeCompanyIdToName(this.options,this.changeReport.companyCode)
				this.changeReport.companyCode=this.companyCode
				UpdateReport(this.changeReport).then(() => {
					//alert(JSON.stringify(this.changeReport))
					this.$message.success('操作成功')
					this.dialogEditVisible = false;
					this.getreportlist()
				}, (err) => {
					this.$message.error(err.message)
				})
			}


		}
	}
</script>
<style lang="scss" scoped>
	.form-content {
		max-width: 800px;
	}
</style>
