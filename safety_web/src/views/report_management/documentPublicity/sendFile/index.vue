<template>
	<div>
		<div class="page-title" style="width: 100%">文件宣贯发送</div>
		<div class="page-content" v-loading="loading">
			<!-- 文件名，发起单位name，宣贯时间，描述，发起员工姓名 -->
			<el-row>
				<el-form label-width="130px" :inline="true" style="">
					<el-form-item label="选择公司:" style="margin: 1px;">
						<treeselect :multiple="false" placeholder="请选择公司单位" style="width: 230px;" :options="companyList" v-model="selectData.selectCompanyId"></treeselect>
					</el-form-item>
					<el-form-item label="选择时间" style="">
						<el-date-picker v-model="selectData.selectDateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
						 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px"></el-date-picker>
					</el-form-item>&nbsp;
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" @click="select()">查询</el-button>
						<el-button type="primary" icon="el-icon-plus" @click="openInsertPropagationDialog()">新增</el-button>
					</el-form-item>
				</el-form>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
					<el-table style="width: 100%" max-height="560" border v-loading="loading" :data="filterQuery.putSelected">
						<el-table-column type="index" label="序号" width="60%" align="center"></el-table-column>
						<el-table-column prop="fileName" label="记录名" width="200%" align="center"></el-table-column>
						<el-table-column prop="companyName" label="发起单位" width="200%" align="center"></el-table-column>
						<el-table-column prop="staffName" label="发起人" width="130%" align="center"></el-table-column>
						<el-table-column prop="propagationDate" label="宣贯时间" width="120%" align="center"></el-table-column>
						<el-table-column prop="description" label="描述" width="200%" align="center" show-overflow-tooltip="true"></el-table-column>
						<el-table-column label="操作" width="330%" align="center">
							<template slot-scope="scope">
								<el-button type="primary" size="mini" icon="el-icon-edit" @click="openConfigDialog(scope.row)">配置</el-button>
								<el-button type="info" size="mini" icon="el-icon-message" @click="openStatisticsDialog(scope.row)">统计</el-button>
								<el-button type="danger" size="mini" icon="el-icon-close" @click="deletePropagationPlan(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-row>
			</el-row>
			<el-dialog title="新增宣贯记录" :visible.sync="insertPropagationDialog" width="60%" align="left">
				<el-form :label-position='right' label-width="80px" :model="propagationPlan">
					<el-col :span="12">
						<el-form-item label="记录名">
							<el-input v-model="propagationPlan.fileName" style="width: 80%;" placeholder="请输入记录名"></el-input>
						</el-form-item>
						<el-form-item label="发起单位">
							<!-- 这里应该是一个只读input，直接显示从当前登录用户那里得到的公司信息 -->
							<treeselect :multiple="false" placeholder="请选择公司单位" style="width: 80%" :options="companyList" v-model="companyId"></treeselect>
							<!-- <el-input v-model="propagationPlan.insertStaffName" style="width: 80%;" placeholder="请输入发起单位"></el-input> -->
						</el-form-item>
						<el-form-item label="发起人">
							<el-input v-model="propagationPlan.staffName" style="width: 80%;" placeholder="请输入发起人姓名"></el-input>
						</el-form-item>
						<el-form-item label="宣贯时间">
							<el-date-picker type="date" placeholder="请选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width:80%"
							 v-model="propagationPlan.propagationDate">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上传文件">
							<el-upload :action="'/api/propagationFileUpload'" :headers="headers" multiple show-file-list="true" :file-list="propagationPlan.list"
							 :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :before-remove="beforeRemove">
								<el-button type="primary" icon="el-icon-upload">点击上传</el-button>
							</el-upload>
						</el-form-item>
						<el-form-item label="描述">
							<el-input v-model="propagationPlan.description" type="textarea" :rows="6" style="width: 100%;" placeholder="请输入文件描述"></el-input>
						</el-form-item>
					</el-col>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;" @click="insertPropagationDialog=false">取消</el-button>
					<el-button icon='el-icon-plus' type="primary" @click="insertPropagation()">新增</el-button>
				</div>
			</el-dialog>
			<el-dialog title="文件宣贯配置" :visible.sync="configPropagationDialog" width="70%" align="left">
				<el-form :label-position='right' label-width="80px" :inline="true">
					<el-form-item label="记录名">
						<el-input v-model="showFileName" style="width: 200px;" readonly="true"></el-input>
					</el-form-item>
					<el-form-item label="推送单位">
						<treeselect multiple="true" placeholder="请选择推送单位" style="width: 300px;" :options="companyList" v-model="pushCompanyId"></treeselect>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" @click="chosenSelect">查询</el-button>
					</el-form-item>
				</el-form>
				<el-row>
					<el-table style="width: 100%" ref="employeeList" max-height="560" border v-loading="loading" :data="employeeSelected"
					 @select="handleSelectionChange">
						<el-table-column type="selection"></el-table-column>
						<el-table-column type="index" label="序号" align="center"></el-table-column>
						<el-table-column prop="companyName" label="所属单位" align="center"></el-table-column>
						<el-table-column prop="empGroup" label="下属部门" align="center" :filters="selectFilter" :filter-method="filterHandler"></el-table-column>
						<el-table-column prop="name" label="姓名" align="center"></el-table-column>
					</el-table>
				</el-row>
				<div slot="footer" class="dialog-footer">
					<el-button icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;" @click="configPropagationDialog=false">取消</el-button>
					<el-button icon='el-icon-plus' type="primary" @click="pushPropagation()">宣贯</el-button>
				</div>
			</el-dialog>
			<el-dialog title="文件宣贯统计" :visible.sync="statisticsDialog" width="66%" align="left">
				<el-table style="width: 100%" max-height="560" border v-loading="loading" :data="statisticsTableData">
					<el-table-column type="index" label="序号" width="100%" align="center"></el-table-column>
					<el-table-column prop="companyName" label="推送单位" width="200%" align="center"></el-table-column>
					<el-table-column prop="department" label="推送部门" width="200%" align="center"></el-table-column>
					<el-table-column prop="staffName" label="推送人" width="160%" align="center"></el-table-column>
					<el-table-column prop="readTime" label="阅读时间" width="200%" align="center"></el-table-column>
					<el-table-column prop="status" label="状态" width="100%" align="center"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="warning" icon="el-icon-download" @click="downloadStatisticsFile">导出</el-button>
					<el-button icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;" @click="statisticsDialog=false">关闭</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		GetCompany,
		GetEmployee,
		queryPropagationPlan,
		queryPropagationDetailAll,
		insertPropagationPlan,
		getFilePropagationDetailList,
		insertPropagationDetail,
		deletePropagationPlan,
	} from "../../../../services/filePropagation.js"
	import {
		GetCurrentUser
	} from '../../../../store/CurrentUser'
	import ExportJsonExcel from "js-export-excel";
	const headers1={
		Accept:'application/json',
		'Content-Type':'aplication/json;charset=utf-8'
	}
	const newOptions={...headers1}
	let user=GetCurrentUser()
	if(user){
		newOptions.headers={...newOptions.headers1,Authorization:user.token}
	}
	const DefaultQuery = {
		putSelected: [],
		putTableData: [],
	}
	export default {
		data() {
			return {
				filterQuery: {},
				headers:newOptions.headers,
				companyId: null,
				companyCode: '',
				companyName: '',
				isChild: true,
				insertPropagationDialog: false,
				statisticsDialog: false,
				configPropagationDialog: false,
				checkType: '发送者',
				companyList: [],
				selectData: {
					selectCompanyId: null,
					selectCompanyName: '',
					selectDateRange: ''
				},
				getSelectData: {
					selectDateRange: '',
					selectStatus: ''
				},
				showFileName: '',
				pushCompanyId: [],
				pushStaffName: [],
				loading: false,
				statisticsSelect: [],
				statisticsTableData: [],
				chosenData: {
					propagationId: '',
					fileName: '',
					companyName: '',
					staffName: '',
					propagationDate: '',
					filePath: []
				},
				getChosenData: {
					propagationDetailId: ''
				},
				employeeSelected: [],
				employeeTableData: [],
				getSelected: [{
					fileName: "xxx",
					companyName: "xxx",
					staffName: "xxx",
					propagationDate: "2020-08-07",
					description: "xxx",
					status: "未阅读"
				}],
				getTableData: [],
				//新增宣贯记录用数组
				propagationPlan: {
					fileName: '',
					description: '',
					propagationDate: '',
					companyCode: '',
					companyName: '',
					staffId: '',
					staffName: '',
					filePath: []
				},
				propagationDetailList: [],
				fileList: [],
				file: {
					propagationId: '',
					filePath: '',
					originName: ''
				},
				selectionData: [],
				selectFilter: [],
				propagationDetail: {
					filePropagationID: '',
					pushCompanyCode: '',
					pushCompanyName: '',
					pushStaffId: '',
					pushStaffName: '',
					department: '',
					status: ''
				},
				downloadFileItem: {
					fileName: '',
					pushCompanyName: '',
					pushStaffName: '',
					pushDate: '',
					getCompanyName: '',
					getGroupName: '',
					getStaffName: '',
					readStatus: '',
					readDate: '',
					downloadDate: ''
				},
				downloadFile: [],
				options: [{
						value: '已读',
						label: '已读'
					},
					{
						value: '未读',
						label: '未读'
					}
				],
				status: '',
			}
		},
		mounted() {
			this.loadParams()
		},
		methods: {
			//加载初试数据
			loadParams() {
				this.loading = true
				this.filterQuery = { ...DefaultQuery,
					...this.$route.query
				};
				this.filterQuery = {
					...this.filterQuery
				};
				this.queryPropagationPlan()
				this.getFilePropagationDetailList()
				this.handleGetCompany()
				this.loading = false
			},
			//预览上传文件
			handlePreview(file) {
				console.log(file)
			},
			//删除上传文件
			handleRemove(file, fileList) {
				console.log(file, fileList)
				var deleteFile = this.fileList.filter(item => {
					return item.name = file.name
				})
				//在文件列表中删除文件
				this.fileList.pop(deleteFile)
				//在新增计划数组中删除该文件路径
				this.propagationPlan.filePath.pop(deleteFile.filePath)
			},
			//上传文件成功
			handleSuccess(res, file) {
				//将文件路径加入新增计划数组
				this.propagationPlan.filePath.push(res.data)
				this.file.filePath = res.data
				this.file.originName = file.name
				this.fileList.push(this.file)
				console.log(res)
			},
			//删除文件前
			beforeRemove(file, FileList) {
				console.log(file, FileList)
			},
			//获取公司列表
			handleGetCompany() {
				GetCompany().then(res => {
					this.companyList = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//发送方查询功能，根据两个查询框数据分别进行判断，再查询合适的数据
			select() {
				this.isChild = true
				//转换公司id
				if (this.selectData.selectCompanyId) {
					this.changeCompanyIdTocompanyName(this.companyList, this.selectData.selectCompanyId)
					this.selectData.selectCompanyName = this.companyName
					this.checkCompany(this.companyList, this.selectData.selectCompanyName)
				}
				//根据搜索框数据情况进行搜索
				if (!this.selectData.selectCompanyId && !this.selectData.selectDateRange) {
					this.filterQuery.putSelected = this.filterQuery.putTableData
				} else if (!this.selectData.selectCompanyId && this.selectData.selectDateRange) {
					this.filterQuery.putSelected = this.filterQuery.putTableData.filter(item => {
						//“yyyy-MM-dd”型日期数据比较时日期更靠前的数据会更大，而日期更靠后的数据会更小
						return item.propagationDate >= this.selectData.selectDateRange[0] && item.propagationDate <= this.selectData.selectDateRange[
							1]
					})
				} else if (this.selectData.selectCompanyId && !this.selectData.selectDateRange) {
					//不能查询非叶子公司节点
					if (this.isChild == false) {
						this.selectData.selectCompanyId = null
						this.selectData.selectCompanyName = ''
						this.$message.error('公司选择错误，请重新选择')
					} else {
						this.filterQuery.putSelected = this.filterQuery.putTableData.filter(item => {
							return item.companyName == this.selectData.selectCompanyName
						})
					}
				} else if (this.selectData.selectCompanyId && this.selectData.selectDateRange) {
					if (this.isChild == false) {
						this.selectData.selectCompanyId = null
						this.selectData.selectCompanyName = ''
						this.$message.error('公司选择错误，请重新选择')
					} else {
						this.filterQuery.putSelected = this.filterQuery.putTableData.filter(item => {
							return item.companyName == this.selectData.selectCompanyName && (item.propagationDate >= this.selectData.selectDateRange[
								0] && item.propagationDate <= this.selectData.selectDateRange[1])
						})
					}
				}
			},
			//获取宣贯计划细节列表
			getFilePropagationDetailList() {
				getFilePropagationDetailList().then(res => {
					this.getTableData = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//将公司id转换为公司名称，同时保存公司code，递归实现
			changeCompanyIdTocompanyName(val, companyId) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].id == companyId) {
							this.companyCode = val[j].nodeCode
							this.companyName = val[j].label
							break
						} else if (val[j].children) {
							this.changeCompanyIdTocompanyName(val[j].children, companyId)
						}
					}
				}
			},
			//将公司名称转换为公司code，同时保存id，递归实现
			changeCompanyNameTocompanyCode(val, companyName) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].label == companyName) {
							this.companyCode = val[j].nodeCode
							this.companyId = val[j].id
							break
						} else if (val[j].children) {
							this.changeCompanyIdTocompanyName(val[j].children, companyName)
						}
					}
				}
			},
			//递归检查公司是否为叶子节点方法
			checkCompany(val, company) {
				for (var i = 0; i < val.length; i++) {
					if (val[i].label == company) {
						if (val[i].children) {
							this.isChild = false
							break
						} else {
							this.isChild = true
							break
						}
					} else if (val[i].children) {
						this.checkCompany(val[i].children, company)
					}
				}
			},
			//查询“文件宣贯计划”表，返回所有记录
			queryPropagationPlan() {
				this.loading = true
				queryPropagationPlan().then(res => {
					this.filterQuery.putTableData = res.data
					console.log(this.filterQuery.putTableData)
				}).catch(err => {
					this.$message.error(err.message)
				})
				this.loading = false
			},
			//打开新增宣贯计划对话框
			openInsertPropagationDialog() {
				//初始化新增宣贯计划数组
				this.propagationPlan.description = ''
				this.propagationPlan.fileName = ''
				this.propagationPlan.propagationDate = ''
				this.companyId = null
				this.propagationPlan.companyCode = ''
				this.propagationPlan.companyName = ''
				this.propagationPlan.filePath = []
				this.propagationPlan.staffName = this.currentUser().userName
				this.propagationPlan.staffId = this.currentUser().userId
				this.insertPropagationDialog = true
			},
			//打开宣贯统计框，并加载对应记录的宣贯细节表
			openStatisticsDialog(row) {
				//保存被选中的数据
				this.chosenData.companyName = row.companyName
				this.chosenData.fileName = row.fileName
				this.chosenData.staffName = row.staffName
				this.chosenData.propagationId = row.filePropagationID
				this.chosenData.propagationDate = row.propagationDate
				this.chosenData.filePath = row.filePath
				//查询接口显示统计数据
				queryPropagationDetailAll(row).then(res => {
					this.statisticsTableData = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})
				//显示统计框
				this.statisticsDialog = true
			},
			//导出统计数据
			downloadStatisticsFile() {
				//组装导出数据
				for (var i = 0; i < this.statisticsTableData.length; i++) {
					this.downloadFileItem = {}
					this.downloadFileItem.fileName = this.chosenData.fileName
					this.downloadFileItem.pushCompanyName = this.chosenData.companyName
					this.downloadFileItem.pushStaffName = this.chosenData.staffName
					this.downloadFileItem.pushDate = this.chosenData.propagationDate
					this.downloadFileItem.getCompanyName = this.statisticsTableData[i].companyName
					this.downloadFileItem.getGroupName = this.statisticsTableData[i].department
					this.downloadFileItem.getStaffName = this.statisticsTableData[i].staffName
					this.downloadFileItem.readStatus = this.statisticsTableData[i].status
					this.downloadFileItem.readDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.statisticsTableData[i].readTime)
					var newDate = new Date()
					this.downloadFileItem.downloadDate = newDate
					this.downloadFile.push(this.downloadFileItem)
				}
				var option = {};
				//组装导出文件名，公司名称+记录名称+宣贯统计表
				option.fileName = this.chosenData.companyName + this.chosenData.fileName + "宣贯计划统计表";
				//设置导出数据和导出格式
				option.datas = [{
					sheetData: this.downloadFile,
					sheetHeader: ["文件名", "宣贯单位", "宣贯人", "宣贯时间", "推送单位", "推送部门", "推送人", "阅读状态", "阅读时间", "导出时间"]
				}];
				//导出数据
				var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
			},
			//新增宣贯计划
			insertPropagation() {
				this.isChild = true
				this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
				this.propagationPlan.companyName = this.companyName
				this.propagationPlan.companyCode = this.companyCode
				this.checkCompany(this.companyList,this.propagationPlan.insertPutCompanyName)
				if(this.isChild==false){
					this.propagationPlan.insertPutCompanyId=null
					this.propagationPlan.insertPutCompanyName=''
					this.$message.error('公司选择错误，请重新选择')
				}
				//检查数据完整性
				if (this.propagationPlan.companyCode && this.propagationPlan.staffId && this.propagationPlan.fileName && this.propagationPlan
					.propagationDate && this.propagationPlan.filePath.length > 0) {
						//调用接口新增数据
					insertPropagationPlan(this.propagationPlan).then(res => {
						if (res.code == '1000') {
							queryPropagationPlan().then(res => {
								this.filterQuery.putTableData = res.data
								//调用搜索方法刷新页面
								this.select()
							}).catch(err => {
								this.$message.error(err.message)
							})
							this.$message({
								message: '添加成功',
								type: 'success'
							})
						} else {
							this.$message.error('添加失败')
						}
					}).catch(err => {
						this.$message.error(err.message)
					})
					//关闭新增宣贯计划框
					this.insertPropagationDialog = false
				} else {
					this.$message.error('数据不完整')
				}
			},
			//配置对话框搜索
			chosenSelect() {
				//初始化选择后的数组后部门数组
				this.employeeSelected = []
				this.selectFilter = []
				//根据选择的公司列表筛选出对应的员工数据
				for (var i = 0; i < this.pushCompanyId.length; i++) {
					this.changeCompanyIdTocompanyName(this.companyList, this.pushCompanyId[i])
					this.employeeSelected.push(this.employeeTableData.filter(item => {
						return item.companyName == this.companyName
					}))
				}
				//中间数组
				var x = []
				//根据选择出来的员工数组构建部门筛选器所需的数组
				for (i = 0; i < this.employeeSelected.length; i++) {
					for (var j = 0; j < this.employeeSelected[i].length; j++) {
						x.push(this.employeeSelected[i][j])
						if (this.selectFilter.filter(item => {
								return item.value == this.employeeSelected[i][j].empGroup
							}).length == 0) {
							this.selectFilter.splice(this.selectFilter.length, 0, {
								text: this.employeeSelected[i][j].empGroup,
								value: this.employeeSelected[i][j].empGroup
							})
						}

					}
				}
				//将员工数组从中间数组中重新赋值
				this.employeeSelected = x
			},
			//打开配置宣贯计划框
			openConfigDialog(row) {
				//加载员工信息
				GetEmployee().then(res => {
					this.employeeTableData = res.data
					this.employeeSelected = []
				})
				//保存选中数据
				this.chosenData.propagationId = row.filePropagationID
				this.chosenData.fileName = row.fileName
				this.chosenData.companyName = row.companyName
				this.chosenData.staffName = row.staffName
				this.chosenData.propagationDate = row.propagationDate
				this.chosenData.filePath = row.filePath
				this.showFileName = row.fileName
				this.pushCompanyId = []
				this.pushStaffName = []
				//调用接口根据宣贯计划id查询所有宣贯计划细节
				queryPropagationDetailAll(row.filePropagationID).then(res => {
					this.propagationDetailList = res.data
				})
				//根据选中的公司来加载对应数据
				for (var i = 0; i < this.propagationDetailList.length; i++) {
					this.changeCompanyNameTocompanyCode(this.companyList, this.propagationDetailList[i].pushCompanyName)
					if (this.pushCompanyId.filter(item => {
							return item == this.propagationDetailList[i].pushCompanyId
						}).length == 0) {
						this.pushCompanyId.push(this.propagationDetailList[i].pushCompanyId)
					}
					this.$refs.employeeList.toggleRowSelection(this.employeeTableData.filter(item => {
						return item.name = this.propagationDetailList.staffName
					}))
				}
				//调用搜索方法加载数据
				this.chosenSelect()
				//打开配置宣贯计划框
				this.configPropagationDialog = true
			},
			//勾选员工数据，记录信息
			handleSelectionChange(val) {
				this.selectionData = val
				console.log(this.selectionData)
			},
			//返回部门筛选后的信息
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},
			//删除宣贯计划
			deletePropagationPlan(row) {
				//二次确认
				this.$confirm('确认删除本条记录吗?配置信息也将一并删除！', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(() => {
					//调用接口删除数据
					deletePropagationPlan(row.filePropagationID).then(res => {
						if (res.code == '1000') {
							queryPropagationPlan().then(res => {
								this.filterQuery.putTableData = res.data
								//调用搜索方法刷新界面
								this.select()
							}).catch(err => {
								this.$message.error(err.message)
							})
							this.$message({
								message: '删除成功',
								type: 'success'
							})
						} else {
							this.$message.error('删除失败')
						}
					}).catch(err => {
						this.$message.error(err.message)
					})
				})
			},
			//推送宣贯计划
			pushPropagation() {
				//初始化推送列表
				this.propagationDetailList = []
				//装填推送列表
				for (var i = 0; i < this.selectionData.length; i++) {
					this.changeCompanyNameTocompanyCode(this.companyList, this.selectionData[i].companyName)
					this.propagationDetail.filePropagationID = this.chosenData.propagationId
					this.propagationDetail.pushCompanyCode = this.companyCode
					this.propagationDetail.pushCompanyName = this.selectionData[i].companyName
					this.propagationDetail.department = this.selectionData[i].empGroup
					this.propagationDetail.pushStaffId = this.selectionData[i].employeeID
					this.propagationDetail.pushStaffName = this.selectionData[i].name
					this.propagationDetail.status = '未读'
					this.propagationDetailList.push(this.propagationDetail)
				}
				//调用接口推送数据
				insertPropagationDetail(this.propagationDetailList).then(res => {
					if (res.code == '1000') {
						this.$message({
							message: '宣贯成功',
							type: 'success'
						})
					} else {
						this.$message.error("宣贯失败")
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
				//关闭配置框
				this.configPropagationDialog = false
			},
			//查询当前用户
			currentUser() {
				return GetCurrentUser()
			},
		}
	}
</script>

<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 15px;
		padding-right: 8px;
	}
</style>
