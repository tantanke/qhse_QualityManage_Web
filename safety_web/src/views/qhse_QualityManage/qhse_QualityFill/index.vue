<template>
	<div>
		<div class="page-title" style="width: 100%">要素配置管理</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :inline="true">
				<el-form-item label="选择公司:">
					<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
					 v-model="companyId"></treeselect>
				</el-form-item>
				<el-form-item label="选择年份：">
					<el-date-picker type="year" placeholder="请选择年份" style="width:200px" v-model="year">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="handleSelect" style="margin-right: 15px;">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon='el-icon-plus' @click="insertCheckListDialog=true">新增</el-button>
				</el-form-item>
			</el-form>
			<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
				<el-table :data="selected" style="width: 100%" max-height="560px" border>
					<el-table-column type="expand">
						<template slot-scope="props">
							<el-form label-width="150px" :label-position="left" :inline='true' class="demo-table-expand">
								<el-form-item label="下达时间:">
									<span>{{props.row.issuedDate}}</span>
								</el-form-item>
								<el-form-item label="任务名称:">
									<span>{{props.row.taskName}}</span>
								</el-form-item>
								<el-form-item label="文件备案截止时间:">
									<span>{{props.row.planDate}}</span>
								</el-form-item>
								<el-form-item label="接收人:">
									<span>{{props.row.receiveName}}</span>
								</el-form-item>
								<el-form-item label="实际完成时间:">
									<span>{{props.row.trueDate}}</span>
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					<el-table-column type="index" label="序号" width="100%" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="companyName" label="单位名称" width="220%" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="year" label="年度" width="100%" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="elementTableName" label="检查表名称" width="260%" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="status" label="任务状态" width="100%" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" width="430%" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button type="primary" icon="el-icon-edit" size="mini" @click="handlChosen(scope.row)">配置要素</el-button>
							<el-button type="primary" icon="el-icon-plus" size="mini" @click="openAssignTaskDialog(scope.row)">配置任务</el-button>
							<el-button type="info" icon="el-icon-message" size="mini" @click="openStatisticsDialog(scope.row)">任务统计</el-button>
							<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTable(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<el-dialog title="新增要素配置" :visible.sync="insertCheckListDialog" align="left" width="30%">
					<el-form :inline="true" label-width="90px" :label-postion="left">
						<el-form-item label="请选择公司:">
							<treeselect :multiple="false" :required="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
							 v-model="insertCompanyId" :disable-branch-nodes="true"></treeselect>
						</el-form-item>
						<el-form-item label="请选择年份:">
							<el-date-picker type="year" required="true" placeholder="请选择年份" style="width:250px" v-model="insertYear">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="要素表名称:">
							<el-input placeholder="请输入要素表名称" style="width:250px;" v-model="insertElementTableName"></el-input>
						</el-form-item>
						<br />
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button icon='el-icon-refresh-left' @click="insertCheckListDialog=false">取 消</el-button>
						<el-button icon='el-icon-plus' type="primary" @click="insertCheckList()">新 增</el-button>
					</div>
				</el-dialog>
				<el-dialog title="要素配置" :visible.sync="annCheckListDialog" width="50%" align="left">
					<div width="70%" align="left" v-loading="dialogLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
						<el-row>
							<el-form :inline="true">
								<el-form-item label="单位:"></el-form-item>
								<el-form-item>
									<el-input v-model="filterQuery.chosenCompany" readonly="true"></el-input>
								</el-form-item>
								&nbsp;
								<el-form-item label="年度:"></el-form-item>
								<el-form-item>
									<el-input v-model="filterQuery.chosenYear" readonly="true"></el-input>
								</el-form-item>
								&nbsp;
								<el-button type="primary" icon="el-icon-folder" ref="button" @click="addQHSEYearElement" v-if="!chosenReceiveID()">保 存</el-button>
								<el-button type="success" icon="el-icon-check" ref="button" @click="annCheckListDialog=false" v-else>已下达任务</el-button>
							</el-form>
						</el-row>
						<el-row style="padding:10px; border-top: 2px dashed #dddddd;">
							<el-tree :data="filterQuery.elementTree" ref="tree" node-key="id" props="annCheckList" show-checkbox="true"
							 style="width: 70%;">
							</el-tree>
						</el-row>
					</div>
				</el-dialog>
				<el-dialog title="下达任务" :visible.sync="assignTaskoDialog" align="left" width="35%">
					<el-form label-width="150px" :label-postion="left">
						<el-form-item label="单位名称:">
							<el-input v-model="task.companyName" placeholder="请输入单位名称" style="width: 300px;" :disable-branch-nodes="true"></el-input>
						</el-form-item>
						<el-form-item label="下达任务人:">
							<el-input v-model="task.issuedName" placeholder="请输入下达任务人姓名" style="width: 300px;"></el-input>
						</el-form-item>
						<el-form-item label="任务名称:">
							<el-input v-model="task.taskName" placeholder="请输入任务名称" style="width: 300px;"></el-input>
						</el-form-item>
						<el-form-item label="接收人:">
							<el-select placeholder="请选择接收人,可搜索姓名" v-model="task.receiveID" clearable='true' style="width: 300px;" filterable='true'>
								<el-option v-for="item in emploee" :key="item.name" :value="item.employeeID" :label="item.name">
									<span style="float:left">{{item.name}}({{item.empGroup}})</span>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="文件备案截止时间:">
							<el-date-picker type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="请选择日期" style="width: 300px;"
							 v-model="task.planDate">
							</el-date-picker>
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button icon="el-icon-refresh-left" @click="assignTaskoDialog=false">取 消</el-button>
						<el-button icon="el-icon-check" type="primary" @click="assignTask()">下达任务</el-button>
					</span>
				</el-dialog>
				<el-dialog title="任务统计" :visible.sync="statisticsDialog" align="left" width="40%">
					<el-row>
						<el-table align="center" :data="statisticsData" border v-loading="loading">
							<el-table-column prop="total" label="总要素" align="center"></el-table-column>
							<el-table-column prop="input" label="要素证据录入" align="center"></el-table-column>
							<el-table-column prop="check" label="要素证据审核" align="center"></el-table-column>
							<el-table-column prop="approve" label="要素证据批准" align="center"></el-table-column>
						</el-table>
						<br />
						<div id="bar-containerFir" style="border: 1px solid black;width:100%;height:300px;aligin:center"></div>
					</el-row>
					<span slot="footer" class="dialog-footer">
						<el-button icon="el-icon-refresh-left" @click="statisticsDialog=false">关 闭</el-button>
						<el-button icon="el-icon-bottom" type="warning" @click="downloadData()">导 出</el-button>
						
					</span>
				</el-dialog>
			</el-row>
		</div>
	</div>
</template>

<script>
	import {
		GetCompany,
		GetQhseElement,
		GetQhseChildElement,
		GetQhseTable,
		insertQhseTable,
		deleteQhseTable,
		addQHSEYearElement,
		querryQhseElement,
		createNewTask,
		getOrderedTask,
		getTaskDetails
	} from "../../../services/gettreedata"
	import {
		GetEmployee
	} from "../../../services/filePropagation.js"
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser'
	import echarts from 'echarts'
	import ExportJsonExcel from "js-export-excel";
	require('echarts/lib/chart/bar')
	const DefaultQuery = {

		chosenCompany: null,
		chosenYear: '',
		elementTree: [],
		//从后端得到的列表数据应当存入tableData，再经过筛选后在前端呈现出筛选后的selected

		tableData: []
	}
	export default {
		data() {
			return {
				loading: false,
				dialogLoading:false,
				filterQuery: {},
				selected: [],
				companyId: null,
				companyName: '',
				companyCode: '',
				year: '',
				insertCompanyCode: '',
				insertCompanyName: '',
				insertCompanyId: null,
				insertYear: '',
				insertElementTableName: '',
				isChild: true,
				companyList: [],
				treeNodeList: [],
				insertCheckListDialog: false,
				annCheckListDialog: false,
				assignTaskoDialog: false,
				statisticsDialog: false,
				//用于保存选中行数据
				row:{},
				//用于保存已选中的要素节点
				chosenElement:[],
				QhseElement: {
					companyCode: '',
					year: ''
				},
				addData: {
					companyName: '',
					companyCode: '',
					year: '',
					elementTableName: ''
				},
				addQhseElementData: {
					codes: '',
					companyCode: '',
					companyName: '',
					year: '',
					qhseCompanyYearManagerSysElementTableID: ''
				},
				chosenConlumn: {
					qhse_CompanyYearManagerSysElementTable_ID: '',
					companyCode: '',
					conpanyName: '',
					year: '',
					receiveID: ''
				},
				task: {
					companyCode: '',
					companyName: '',
					taskName: '',
					issuedID: '',
					issuedName: '',
					receiveID: '',
					receiveName: '',
					planDate: '',
					tableID: ''
				},
				tableItem: {
					elementTableName: '',
					status: '',
					year: '',
					companyCode: '',
					companyName: '',
					taskName: '',
					receiveID: '',
					receiveName: '',
					planDate: '',
					tableID: '',
					issuedDate: '',
					planDate: '',
					receiveDate: '',
					trueDate: ''
				},
				emploee: [],
				tableDataList: [],
				taskList: [],
				statisticsData: [],
				chartDataFir: [],
				chartDatsec: [],
				statisticsDataItem: {
					total: '',
					input: '',
					check: '',
					approve: '',
					fileCheck: ''
				}
			}
		},
		watch: {
			//实时监测单位输入框和年度输入框数据变化，当两者都不为空时将表名字段填入
			insertCompanyId() {
				if (this.insertYear) {
					this.bindIdToName(this.companyList, this.insertCompanyId)
					this.insertElementTableName = this.insertYear.getFullYear() + this.insertCompanyName + "检查表"
				}
			},
			insertYear() {
				if (this.insertCompanyId) {
					this.bindIdToName(this.companyList, this.insertCompanyId)
					this.insertElementTableName = this.insertYear.getFullYear() + this.insertCompanyName + "检查表"
				}
			},
			companyId() {
				if (this.companyId) {
					this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
				} else {
					this.companyName = ''
					this.companyCode = ''
				}
			},
			year() {
				if (this.year) {
					this.year = new Date(this.year).getFullYear().toString()
					console.log(this.year)
				} else {
					this.year = ''
				}
			}
		},
		mounted() {
			this.GetCompany()
			this.loadParams()
			this.GetEmployee()
		},
		methods: {
			//加载初始数据
			loadParams() {
				this.filterQuery = { ...DefaultQuery,
					...this.$route.query
				};
				this.filterQuery = {
					...this.filterQuery
				};
				this.loading=true
				GetQhseTable().then(res => {
					this.tableDataList = res.data
					console.log("table",res.data)
					getOrderedTask().then(res => {
						console.log("task",res.data)
						this.taskList = res.data
						var selected=[]
						for (var i = 0; i < this.tableDataList.length; i++) {
							var tempData = this.taskList.filter(item => {
								return item.tableID == this.tableDataList[i].qhse_CompanyYearManagerSysElementTable_ID
							})
							var tableItem = {
								elementTableName: '',
								status: '',
								year: '',
								companyCode: '',
								companyName: '',
								taskName: '',
								receiveID: '',
								receiveName: '',
								planDate: '',
								tableID: '',
								issuedDate: '',
								planDate: '',
								receiveDate: '',
								trueDate: ''
							}
							//一下任务来自要素配置管理表
							tableItem.elementTableName = this.tableDataList[i].elementTableName
							tableItem.companyCode = this.tableDataList[i].companyCode
							tableItem.companyName = this.tableDataList[i].companyName
							tableItem.tableID = this.tableDataList[i].qhse_CompanyYearManagerSysElementTable_ID
							tableItem.year = this.tableDataList[i].year
							//以下部分来自任务表
							if (tempData.length > 0) {
								tableItem.taskName = tempData[0].taskName
								tableItem.receiveID = tempData[0].receiveID
								tableItem.receiveName = tempData[0].receiveName
								tableItem.planDate = tempData[0].planDate
								tableItem.issuedDate = tempData[0].issuedDate
								tableItem.receiveDate = tempData[0].receiveDate
								tableItem.trueDate = tempData[0].trueDate
								tableItem.status = tempData[0].status
							}
							//装入数据
							selected.push(tableItem)
						}
						this.selected=selected
						this.filterQuery.tableData = this.selected
						console.log(this.selected)
						this.loading=false
					}).catch(err => {
						this.$message.error(err.message)
					})
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			chosenReceiveID() {
				return this.chosenConlumn.receiveID
			},
			GetCompany() {
				GetCompany().then(res => {
					this.companyList = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//绘制柱状图
			initChartFir(id) {
				this.chart = echarts.init(document.getElementById(id));
				this.chart.setOption({
					//标题组件
					title: {
						text: '录入统计',
						textStyle: {
							fontWeight: 'bold',
						}
					},
					//工具栏
					toolbox: {
						//显示工具栏
						show: true,
						feature: {
							dataView: {
								show: true,
								readOnly: false
							}, //数据列表展示
							restore: {
								show: true
							}, //重置表格
							saveAsImage: {
								show: true
							} //保存为图片
						}
					},
					//提示框组件
					tooltip: {
						//触发类型，axis：坐标轴触发；item：数据项图形触发
						trigger: 'axis'
					},
					//横坐标，type：value，数值轴，适用于连续数据；category：类目轴，适用于离散的类目数据，可通过data设置数据；
					//time：时间轴，适用于连续的时序数据；log：对数轴，适用于对数数据
					xAxis: [{
						type: 'category',
						data: ['总要素', '证据录入', '证据审核', '证据审批','文件审核']
					}],
					//纵坐标，type类型同横坐标
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: 'ceshi', //名字
						barMaxWidth: 25,
						type: 'bar', //图的类型，bar表示柱状图；line表示折线图；pie表示饼状图；
						data: this.chartDataFir //数据源
					}]
				})
			},

			//打开任务统计框
			openStatisticsDialog(row) {
				//初始化保存查询信息的对象
				var queryData = {
					tableID: '',
					status: ''
				}
				this.row=row
				console.log('row',row)
				//保存查询信息
				queryData.tableID = row.tableID
				queryData.status = row.status
				//调用接口查询统计信息
				console.log(queryData)
				getTaskDetails(queryData).then(res => {
					var data = {
						total: '',
						finished: ''
					}
					console.log(res.data)
					data.total = res.data.total
					if(res.data.finishedNum){
						data.finished = res.data.finishedNum
					}else{
						data.finished=0
					}
					
					this.statisticsData = []
					switch (row.status) {
						case '未接收':
							this.statisticsDataItem.total = data.total
							this.statisticsDataItem.input = 0
							this.statisticsDataItem.check = 0
							this.statisticsDataItem.approve = 0
							this.statisticsDataItem.fileCheck=0
							this.chartDataFir = [data.total, 0, 0, 0,0]
							break
						case '录入证据中':
							this.statisticsDataItem.total = data.total
							this.statisticsDataItem.input = data.finished
							this.statisticsDataItem.check = 0
							this.statisticsDataItem.approve = 0
							this.statisticsDataItem.fileCheck=0
							this.chartDataFir = [data.total, data.finished, 0, 0,0]
							break
						case '审核中':
							this.statisticsDataItem.total = data.total
							this.statisticsDataItem.input = data.total
							this.statisticsDataItem.check = data.finished
							this.statisticsDataItem.approve = 0
							this.statisticsDataItem.fileCheck=0
							this.chartDataFir = [data.total, data.total, data.finished, 0,0]
							break
						case '批准中':
							this.statisticsDataItem.total = data.total
							this.statisticsDataItem.input = data.total
							this.statisticsDataItem.check = data.total
							this.statisticsDataItem.approve = data.finished
							this.statisticsDataItem.fileCheck=0
							this.chartDataFir = [data.total, data.total, data.total, data.finished,0]
							break
						case '文件审核中':
							this.statisticsDataItem.total = data.total
							this.statisticsDataItem.input = data.total
							this.statisticsDataItem.check = data.total
							this.statisticsDataItem.approve = data.total
							this.statisticsDataItem.fileCheck=data.finished
							this.chartDataFir = [data.total, data.total, data.total, data.total,data.finished]
							break
						case '任务完成':
							this.statisticsDataItem.total = data.total
							this.statisticsDataItem.input = data.total
							this.statisticsDataItem.check = data.total
							this.statisticsDataItem.approve = data.total
							this.statisticsDataItem.fileCheck= data.total
							this.chartDataFir = [data.total, data.total, data.total, data.total, data.total]
							break
					}
					this.statisticsData.push(this.statisticsDataItem)
					//延迟绘制两个柱状图
					setTimeout(() => {
						this.initChartFir('bar-containerFir')
					}, 1000)
				})
				this.statisticsDialog = true
			},
			downloadData() {
				console.log('statistic data',this.statisticsData)
				var option={}
				option.fileName=this.row.elementTableName+"任务进度统计表"
				option.datas=[{
					sheetData: this.statisticsData,
					sheetFilter: ['total','input','check','approve','filecheck'],
					sheetHeader: ['总计','录入证据中','审核中','审批中','文件审核中']
				}]
				var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
				this.statisticsDialog = false
			},
			//获取员工表
			GetEmployee(){
				GetEmployee().then(res=>{
					this.emploee=res.data
				}).catch(err => {
						this.$message.error(err.message)
				})
			},
			//打开新增任务对话框
			openAssignTaskDialog(row) {
				console.log('click open dialog')
				if (row.receiveID) {
					this.$message.error('请勿重复发布任务')
					return
				}
				//装填员工信息
				this.emploee.filter(item => {
					return item.companyName == row.companyName
				})
				//初始化新增任务列表
				this.task.companyCode = row.companyCode
				this.task.companyName = row.companyName
				this.task.tableID = row.tableID
				this.task.issuedID = this.GetCurrentUser().employeeId
				this.task.issuedName = this.GetCurrentUser().employeeName
				this.task.taskName = ''
				//将date格式的时间改为“yyyy-MM-dd”类型的时间
				//this.task.issuedDate =new Date().toISOString().substr(0,10)
				this.task.receiveID = ''
				this.task.receiveName = ''
				this.task.planDate = ''
				if(this.QhseElement.companyCode!=row.companyCode){
					console.log('chosen element',this.chosenElement)
					//保存该行数据
					this.QhseElement.companyCode = row.companyCode
					this.QhseElement.year = row.year
					//将已勾选的要素展示
					querryQhseElement(this.QhseElement).then(res => {
					//检查是否已经配置要素
						if (res.data.length > 0) {
							//打开新增任务对话框
							this.assignTaskoDialog = true
						} else {
							//提示配置要素
							this.$message.error('要素未配置，请配置后再配置任务')
						}
					})
				}else{
					//打开新增任务对话框
					this.assignTaskoDialog = true
				}
				
			},
			//新增任务
			assignTask() {
				//获得当前日期，ISOString：yyyy-MM-dd hh:mm:ss,取前10位就可以获得yyyy-MM-dd类型数据
				var newDate = new Date().toISOString().substr(0, 10)
				//检查数据完整性，必须的有公司信息，发布人信息，任务名，接收人信息，备案计划截止时间
				if (this.task.companyName && this.task.issuedName && this.task.taskName && this.task.receiveID && this.task.planDate) {
					//备案计划截止时间不能小于当前时间，即不能在当前日期之前截止任务
					if (this.task.planDate < newDate) {
						this.task.planDate = ''
						this.$message.error('任务截止日期选择错误')
						return
					}
					//关闭新增任务对话框
					this.assignTaskoDialog = false
					//通过员工id获得员工姓名，因为对话框里选择的时候只能选择到员工id
					this.task.receiveName = this.emploee.filter(item => {
						return item.employeeID == this.task.receiveID
					})[0].name
					//调用接口新增任务
					console.log(this.task)
					createNewTask(this.task).then(res => {
						if (res.code == '1000') {
							//调用加载数据和搜索方法重新渲染界面
							this.loadParams()
							this.handleSelect()
							this.$message.success('任务下达成功')
						} else {
							this.$message.error('任务下达失败')
						}
					}).catch(err => {
						this.$message.error(err.message)
					})
				} else {
					this.$message.error('数据不完整')
					return
				}
			},
			GetCurrentUser() {
				return GetCurrentUser()
			},
			//实现查询按钮，根据公司名和年度查询对应记录
			handleSelect() {
				var select=this.filterQuery.tableData
				//当年度框有数据时筛选数据
				if (this.year != '') {
					select = select.filter(item => {
						return item.year == this.year
					})
				}
				//当公司框有数据时筛选数据
				if (this.companyName != '') {
					select = select.filter(item => {
						return item.companyName == this.companyName
					})
				}
				this.selected=select
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
			//点击列表中的某一列加载勾选要素表一二级节点
			handlChosen(val) {
				this.annCheckListDialog = true
				this.loading = true
				//记录选中的该行数据
				this.chosenConlumn.companyCode = val.companyCode
				this.chosenConlumn.conpanyName = val.companyName
				this.chosenConlumn.year = val.year
				this.chosenConlumn.qhse_CompanyYearManagerSysElementTable_ID = val.tableID
				this.chosenConlumn.receiveID = val.receiveID
				//将选中行数据的公司名和年度显示
				this.filterQuery.chosenCompany = val.companyName;
				this.filterQuery.chosenYear = val.year
				//组装要素查询数组
				this.QhseElement.companyCode = val.companyCode
				this.QhseElement.year = val.year

				//从后端接口中获取对应的要素表的树，并构建出符合el-tree的数据组
				GetQhseChildElement().then(res => {
					var temp = []
					this.creatTree(res.data, temp)
					this.filterQuery.elementTree = temp
					this.loading = false
				}).catch(err => {
					this.$message.error(err.message)
				})
				this.dialogLoading=true
				//将已勾选的要素展示
				querryQhseElement(this.QhseElement).then(res => {
					this.chosenElement=res.data
					var code = []
					for (var i = 0; i < res.data.length; i++) {
						code.push(res.data[i].code)
					}
					this.$refs.tree.setCheckedKeys(code, true)
					this.dialogLoading = false
				})
			},
			//构建要素表一二级节点树，由于el-tree所能显示的数据类型为{label:'',children:[]}，
			//而从接口中返回的数据类型为data，所以需要对数据进行转换，使得能够呈现
			creatTree(val, elementData) {
				for (var i = 0; i < val.length; i++) {
					if (val[i].name) {
						elementData[i] = {
							//id用于唯一标识该node，使用data中的code
							id: val[i].code,
							label: val[i].name,
							children: []
						}
					}
					//递归构造子节点
					if (val[i].childNode.length > 0) {
						this.creatTree(val[i].childNode, elementData[i].children)
					}
				}
			},
			//根据新增框中选择的公司名称得到公司id，名称，递归实现
			bindIdToName(val, companyId) {
				//根据传入的公司列表和公司id将id装换为对应的公司名称，并同时获得公司编号
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].id == companyId) {
							this.insertCompanyName = val[j].label;
							this.insertCompanyCode = val[j].nodeCode;
							break;
						} else if (val[j].children) {
							this.bindIdToName(val[j].children, companyId);
						}
					}
				}
			},
			//显示新增记录的框
			openInsertCheckListDialog() {
				this.insertCompanyId = null
				this.insertCompanyCode = ''
				this.insertYear = ''
				this.insertElementTableName = ''
				this.insertCheckListDialog = true
			},
			//实现新增框的新增一列数据
			insertCheckList() {
				//判断单位和年度是否为空
				if (this.insertCompanyId && this.insertYear) {
					//判断新增记录是否重复标志，默认为false
					var isCopy = false
					//调用转换方法，将选中的公司id转换为公司名称
					this.bindIdToName(this.companyList, this.insertCompanyId)
					//遍历记录数组，检查将要新增的记录是否重复，重复时将输入框重置，并提供提示信息
					for (var i = 0; i < this.filterQuery.tableData.length; i++) {
						if (this.filterQuery.tableData[i].companyName == this.insertCompanyName && this.filterQuery.tableData[i].year ==
							this.insertYear.getFullYear().toString()) {
							this.insertCompanyId = null
							this.insertCompanyCode = ''
							this.insertYear = ''
							this.insertElementTableName = ''
							isCopy = true
							this.$message.error('该记录已存在')
							break
						}
					}
					//当将要新增的记录不重复时，进行新增记录操作
					if (isCopy == false) {
						//将新增记录框中的数据添加到准备好的数组中，组装出一条tabledate的数据
						this.addData.companyName = this.insertCompanyName
						this.addData.companyCode = this.insertCompanyCode
						this.addData.year = this.insertYear.getFullYear().toString()
						this.addData.elementTableName = this.insertElementTableName
						console.log(this.addData)
						//调用接口将新增的记录返回后端，并重新渲染tabledata
						insertQhseTable(this.addData).then(res => {
							if (res.code == '1000') {
								this.insertCompanyId = null
								this.insertCompanyCode = ''
								this.insertYear = ''
								this.insertElementTableName = ''
								//重新获取tableData，重新渲染前端界面
								this.loadParams()
								this.$message({
									message: "添加成功",
									type: "success"
								})
							} else {
								this.$message.error('添加失败')
							}
						}).catch(err => {
							this.$message.error(err.message)
						})
						//关闭新增记录框
						this.insertCheckListDialog = false
					}

					//显示数据不完整的提示信息
				} else {
					this.$message.error('数据不完整')
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
			//年度检查表要素表一二级节点选中保存后并返回数据给后端
			addQHSEYearElement() {
				//关闭年度检查表明细框
				this.annCheckListDialog = false
				this.loading=true
				//初始化二级节点选择数组
				this.treeNodeList = []
				//装填数据
				this.treeNodeList = this.$refs.tree.getCheckedKeys()
				//将选中的复选框置空
				this.$refs.tree.setCheckedNodes([]);
				//去除一节节点
				for (var j = 0; j < this.treeNodeList.length; j++) {
					for (var k = 0; k < this.filterQuery.elementTree.length; k++) {
						if (this.filterQuery.elementTree[k].id == this.treeNodeList[j]) {
							/*
							 *spice(val1,val2,data[])方法为向数组添加或删除某一个元素，val1为操作位置，必需；val2为操作元素个数，如果为0则不删除元素，必需；
							 * data[]为添加的元素，非必需。当第三个参数为空时表示从val1位置开始删除val2个元素；当第三个元素不为空时，如果val2为0，则表示
							 * 向val1位置添加data[]，若val2不为0，则表示从val1位置开始将val2个元素替换为data[]
							 */
							this.treeNodeList.splice(j, 1);
							break;
						}
					}
				}
				//初始化新增要素记录数组
				this.addQhseElementData = {}
				//装填二级节点
				for (var i = 0; i < this.treeNodeList.length; i++) {
					if (!this.addQhseElementData.codes)
						this.addQhseElementData.codes = this.treeNodeList[i] + ";"
					else {
						this.addQhseElementData.codes = this.addQhseElementData.codes + this.treeNodeList[i] + ";"
					}
				}
				//装填公司状态，名字，年度，id
				this.addQhseElementData.companyCode = this.chosenConlumn.companyCode
				this.addQhseElementData.companyName = this.chosenConlumn.conpanyName
				this.addQhseElementData.year = this.chosenConlumn.year
				this.addQhseElementData.qhseCompanyYearManagerSysElementTableID = this.chosenConlumn.qhse_CompanyYearManagerSysElementTable_ID
				//调用接口向后端返回更新了的年度检查表要素表
				console.log(this.addQhseElementData)
				addQHSEYearElement(this.addQhseElementData).then(res => {
					if (res.code == '1000') {
						this.loadParams()
						this.$message({
							message: '保存成功',
							type: 'success'
						})
						this.loading=false
					} else {
						this.$message.error('保存失败')
						this.loading=false
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
				
			},
			//删除一列数据，通过slot获取到一行的数据，从而可以得到id删除该行数据
			deleteTable(val) {
				this.$confirm('确认删除本条记录吗?配置信息也将一并删除！', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(() => {
					deleteQhseTable(val.tableID).then(res => {
						if (res.code == '1000') {
							//重新渲染tableData，显示操作结果
							this.loadParams()
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
			// 批量新增
			addmuch() {
				this.$router.push({
					path: '/qhse_QualityManage/qhse_QualityFill/addmuch'
				})
			}
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
		width: 50%;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 15px;
		padding-right: 8px;
	}
</style>
