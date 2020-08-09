<template>
	<div>
		<div class="page-title" style="width: 100%">文件宣贯接收</div>
		<div class="page-content" v-loading="loading">
			<el-row>
				<el-form label-width="130px" :inline="true">
					<el-form-item label="选择时间">
						<el-date-picker v-model="selectData.selectDateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
						 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px"></el-date-picker>
					</el-form-item>
					<el-form-item label="阅读状态">
						<el-select placeholder="请选择" v-model="selectData.selectStatus" clearable='true'>
							<el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" @click="Select()">查询</el-button>
					</el-form-item>
				</el-form>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
					<el-table style="width: 100%" max-height="560" border v-loading="loading" :data="Selected">
						<el-table-column type="index" label="序号" width="60%" align="center"></el-table-column>
						<el-table-column prop="fileName" label="记录名" width="200%" align="center"></el-table-column>
						<el-table-column prop="pushCompanyName" label="发起单位" width="200%" align="center"></el-table-column>
						<el-table-column prop="pushStaffName" label="发起人" width="120%" align="center"></el-table-column>
						<el-table-column prop="propagationDate" label="宣贯时间" width="160%" align="center"></el-table-column>
						<el-table-column prop="description" label="描述" width="200%" align="center" show-overflow-tooltip='true'></el-table-column>
						<el-table-column prop="status" label="阅读状态" width="120%" align="center"></el-table-column>
						<el-table-column prop="readDate" label="阅读时间" width="160%" align="center"></el-table-column>
						<el-table-column label="操作" width="180%" align="center">
							<template v-slot="scope">
								<el-button type="success" icon="el-icon-check" size="mini" @click="readedFile(scope.row)">已读</el-button>
								<el-button type="warning" size="mini" icon="el-icon-download">
									<a ref="download" href="" @click="download(scope.row)">下载</a>
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
			</el-row>
			<el-dialog title="宣贯文件阅读" :visible.sync="readFileDialog" width="60%" align="left">
				<!-- 文件展示的超链接，可以下载 -->
				<el-table>
					<el-table-column type="index" label="序号"></el-table-column>
					<el-table-column label </el-table> <div slot="footer" class="dialog-footer" :inline="true">
						<el-button type="success" icon="el-icon-check" @click="readedFile">已读</el-button>
						<el-button type="warning" icon="el-icon-download" @click="downloadFile">导出</el-button>
						<el-button icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;" @click="readFileDialog=false">关闭</el-button>
		</div>
		</el-dialog>
	</div>
	</div>
</template>

<script>
	import {
		queryPropagationPlan,
		getFilePropagationDetailList,
		readPropagation
	} from "../../../../services/filePropagation.js"
	const DefaultQuery = {}
	export default {
		data() {
			return {
				filterQuery: {},
				readFileDialog: false,
				selectData: {
					selectDateRange: '',
					selectStatus: ''
				},
				options: [{
						value: '已读',
						label: '已读'
					},
					{
						value: '未读',
						label: '未读'
					}
				],
				Selected: [],
				tempDate: [],
				propagationPlan: [],
				tableDataItem: {
					filePropagationId: '',
					propagationDetailId: '',
					fileName: '',
					pushCompanyName: '',
					pushCompanyCode: '',
					pushStaffName: '',
					pushStaffId: '',
					propagationDate: '',
					description: '',
					status: '',
					readDate: '',
					filePath: []
				},
				tableData: [
					// 	{
					// 	filePropagationId:'13414624',
					// 	propagationDetailId:'2',
					// 	fileName:'测试',
					// 	pushCompanyName:'科技信息中心',
					// 	pushCompanyCode:'10101',
					// 	pushStaffName:'lifeng',
					// 	pushStaffId:'168',
					// 	propagationDate:'2020-08-15',
					// 	description:'测试',
					// 	status:'未读',
					// 	readDate:'',
					// },
					// {
					// 	filePropagationId:'13414614',
					// 	propagationDetailId:'1',
					// 	fileName:'测试',
					// 	pushCompanyName:'科技信息中心',
					// 	pushCompanyCode:'10101',
					// 	pushStaffName:'lifeng',
					// 	pushStaffId:'168',
					// 	propagationDate:'2020-08-12',
					// 	description:'测试',
					// 	status:'已读',
					// 	readDate:'2020-08-10',
					// },
				]
			}
		},
		mounted() {
			this.loadParams()
			this.queryPropagationDetailOne()
			this.queryPropagationPlan()

		},
		methods: {
			loadParams() {
				this.loading = true
				this.filterQuery = { ...DefaultQuery,
					...this.$route.query
				};
				this.filterQuery = {
					...this.filterQuery
				};
				this.loading = false
			},
			queryPropagationDetailOne() {
				getFilePropagationDetailList().then(res => {
					this.tempDate = res.data
					console.log(res.data)
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			download(row) {
				console.log(row)
				if (row.filePath.length > 0) {
					for (var i = 0; i < row.filePath.length; i++) {
						this.$refs.download.href = `/api/downloadFilePropagationFile?fileName=` + row.filePath[0]
						this.$refs.download.click()
					}
				} else {
					this.$message.error('没有文件可供下载')
				}

			},
			queryPropagationPlan() {
				queryPropagationPlan().then(res => {
					this.propagationPlan = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			processData() {
				this.tableData = []
				for (var i = 0; i < this.tempDate.length; i++) {
					this.tableDataItem.filePropagationId = this.tempDate[i].filePropagationId
					this.tableDataItem.propagationDetailId = this.tempDate[i].filePropagationPlanDetailID
					this.tableDataItem.status = this.tempDate[i].status
					this.tableDataItem.readDate = this.tempDate[i].readTime
					this.tableDataItem.description = this.tempDate[i].description
					this.tableDataItem.filePath = this.tempDate[i].filePath
					this.tableDataItem.fileName = this.tempDate[i].fileName
					this.tableDataItem.propagationDate = this.tempDate[i].propagationDate
					var temp = this.propagationPlan.filter(item => {
						return item.filePropagationId == this.tempDate[i].filePropagationId
					})
					this.tableDataItem.pushCompanyCode = temp.companyCode
					this.tableDataItem.pushCompanyName = temp.companyName
					this.tableDataItem.pushStaffId = temp.staffId
					this.tableDataItem.pushStaffName = temp.staffName
					console.log(this.tableDataItem)
					this.tableData.push(this.tableDataItem)
				}
			},
			Select() {
				this.processData()
				console.log(this.selectData)
				if (!this.selectData.selectDateRange && !this.selectData.selectStatus) {
					this.Selected = this.tableData
				} else if (this.selectData.selectDateRange && !this.selectData.selectStatus) {
					this.Selected = this.tableData.filter(item => {
						return item.propagationDate >= this.selectData.selectDateRange[0] && item.propagationDate <= this.selectData.selectDateRange[
							1]
					})
				} else if (!this.selectData.selectDateRange && this.selectData.selectStatus) {
					this.Selected = this.tableData.filter(item => {
						return item.status == this.selectData.selectStatus
					})
				} else {
					this.Selected = this.tableData.filter(item => {
						return item.status == this.selectData.selectStatus && (item.propagationDate >= this.selectData.selectDateRange[
							0] && item.propagationDate <= this.selectData.selectDateRange[1])
					})
				}
			},
			readedFile(row) {
				console.log(row)
				if (row.status == "已读") {
					this.$message.error('请勿重复点击')
				} else {
					readPropagation(row.propagationDetailId).then(res => {
						console.log(res)
						if (res.code == '1000') {
							getFilePropagationDetailList().then(res => {
								this.tempDate = res.data
								this.Select()
							}).catch(err => {
								this.$message.error(err.message)
							})
							this.$message({
								message: '文件已读',
								type: 'success'
							})
						} else {
							this.$message.error('更改阅读状态失败')
						}
					}).catch(err => {
						this.$message.error(err.message)
					})
				}
			}
		}
	}
</script>

<style>
</style>
