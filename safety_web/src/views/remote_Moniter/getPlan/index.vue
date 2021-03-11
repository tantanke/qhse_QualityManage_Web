<template>
	<div>
		<div class="page-title" style="width:100%">远程计划提取</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading">
			<el-form :inline="true">
				<el-form-item label="填报日期">
					<el-date-picker v-model="WRITE_DATE" value-format="yyyy-MM-dd" format="yyyy年MM月dd日">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
				</el-form-item>
				&nbsp;
				<el-form-item>
					<el-button type="warning" icon="el-icon-download" @click="downloadPlan">下载计划</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="newPlan">生成计划</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="data" :border="true" stripe max-height="540px">
				<el-table-column label="序号" width="50" type="index" :show-overflow-tooltip="true" align="center">
				</el-table-column>
				<el-table-column label="记录仪编号" prop="RECORD_NUMBER" width="120" :show-overflow-tooltip="true"
					align="center"></el-table-column>
				<el-table-column label="自编号" prop="" width="120" :show-overflow-tooltip="true" align="center">
				</el-table-column>
				<el-table-column label="基层单位" prop="DPT_NAME" width="150" :show-overflow-tooltip="true" align="center">
				</el-table-column>
				<el-table-column label="室组" prop="C_DPT_NAME" width="150" :show-overflow-tooltip="true" align="center">
				</el-table-column>
				<el-table-column label="项目名称" prop="PROJECT_NAME" width="150" :show-overflow-tooltip="true"
					align="center"></el-table-column>
				<el-table-column label="项目类别" prop="" width="120" :show-overflow-tooltip="true" align="center">
				</el-table-column>
				<el-table-column label="负责人" prop="PRINCIPAL" width="80" :show-overflow-tooltip="true" align="center">
				</el-table-column>
				<el-table-column label="联系电话" prop="PHONE" width="120" :show-overflow-tooltip="true" align="center">
				</el-table-column>
				<el-table-column label="作业地点" prop="WORK_LOCATION" width="150" :show-overflow-tooltip="true"
					align="center"></el-table-column>
				<el-table-column label="计划作业时间" prop="WORK_PLAN" width="150" :show-overflow-tooltip="true"
					align="center"></el-table-column>
				<el-table-column label="填报时间" prop="WRITE_DATE" width="150" :show-overflow-tooltip="true"
					align="center"></el-table-column>
				<el-table-column label="作业人员" prop="WORK_USER" width="200" :show-overflow-tooltip="true" align="center">
				</el-table-column>
				<el-table-column label="作业设备" prop="EQ_NUMBER" width="200" :show-overflow-tooltip="true" align="center">
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="生成监控计划确认" :visible.sync="generateConfirm" width="30%">
			<el-form label-width="100px" label-position="right">
				<el-form-item label="基层单位:">
					<el-input type="textarea" :autosize="true" v-model="user.companyName" :readonly="true" @focus="tips"
						@click="tips"></el-input>
				</el-form-item>
				<el-form-item label="计划日期:">
					<el-date-picker v-model="generateData.date" value-format="yyyy-MM-dd" format="yyyy年MM月dd日"
						style="width: 100%;"></el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button icon='el-icon-refresh-left' @click="generateConfirm=false">取 消</el-button>
				<el-button icon='el-icon-plus' type="primary" @click="generatePlan()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import ExportJsonExcel from "js-export-excel";
	import {
		getPlan,
		generateMonitorPlan
	} from '../../../services/remote.js'
	import {
		GetCurrentUser
	} from "../../../store/CurrentUser.js"
	export default {
		data() {
			return {
				generateConfirm: false,
				loading: false,
				WRITE_DATE: '',
				data: [],
				generateData: {
					date: '',
					companyCode: ''
				},
				user: {}
			}
		},
		mounted() {
			this.loadParams()
		},
		methods: {
			// 初始化界面，2021-3-11 12:25，zhb
			loadParams() {
				// 开启加载，设定搜索框日期为当前日期，并以此日期调用接口查询数据
				this.loading = true
				let today = new Date().toISOString().substr(0, 10)
				this.WRITE_DATE = today
				getPlan(today).then(res => {
					this.data = res.data
					this.loading = false
				}).catch(err => {
					this.$message.error(err.message)
					this.loading = false
				})
			},
			// 搜索框按钮响应事件，2021-3-11 12:25，zhb
			search() {
				if (this.WRITE_DATE) {
					// 开启加载，调用接口查询数据，重新渲染表格，关闭加载
					this.loading = true
					getPlan(this.WRITE_DATE).then(res => {
						this.data = res.data
						this.loading = false
					}).catch(err => {
						this.$message.error(err.message)
						this.loading = false
					})
				} else {
					return this.$message.warning('请选择填报日期后进行查询！')
				}
			},
			// 下载当前界面所有数据，并设置列宽，2021-3-11 12:18，zhb
			downloadPlan() {
				this.$confirm('保存将会下载当前界面所有数据，确定要执行吗？', '下载确认', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(() => {
					// 文件名为当前日期加监控计划表
					let fileName = this.WRITE_DATE + '远程监控计划表'
					// 列数据源
					let sheetFilter = ['RECORD_NUMBER', '', 'DPT_NAME', 'C_DPT_NAME', 'PROJECT_NAME', '',
						'PRINCIPAL', 'PHONE', 'WORK_LOCATION', 'WORK_PLAN', 'WRITE_DATE', 'WORK_USER',
						'EQ_NUMBER'
					]
					// 表头
					let sheetHeader = ['记录仪编号', '自编号', '基层单位', '室组', '项目名称', '项目类别', '负责人', '联系电话', '作业地点',
						'计划作业时间', '填报时间', '作业人员', '作业设备'
					]
					// 根据字段长度获取列宽
					let columnWidths = this.getColumnWidths(this.data)
					var option = {}
					// 文件名
					option.fileName = fileName
					option.datas = [{
						//数据源
						sheetData: this.data,
						//列数据源
						sheetFilter: sheetFilter,
						//表头
						sheetHeader: sheetHeader,
						// 列宽
						columnWidths: columnWidths
					}]
					var toExcel = new ExportJsonExcel(option);
					toExcel.saveExcel();
				})
			},
			// 在生成计划确认对话框中，点击公司输入框时提示信息，2021-3-11 12:19，zhb
			tips() {
				this.$message.warning('该项数据不允许修改！')
			},
			// 打开生成计划对话框，加载待生成数据，2021-3-11 11:26，zhb
			newPlan() {
				this.user = GetCurrentUser()
				this.generateData.companyCode = this.user.companyCode
				this.generateData.date = this.WRITE_DATE
				this.generateConfirm = true
			},
			// 生成监控计划，二次确认，2021-3-11-11:17，zhb
			generatePlan() {
				// 二次确认
				this.$confirm('确认生成计划？', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 调用接口生成计划
					generateMonitorPlan(this.generateData).then(res => {
						if (res.code == '1000') {
							this.$message.success('计划生成成功')
							this.generateConfirm = false
						}
					}).catch(err => {
						this.$message.error(err.message)
						this.generateConfirm = false
					})
				})
			},
			// 输入待下载的数据，根据字段长度生成列宽，2021-3-11 12:21，zhb
			getColumnWidths(data) {
				// 设置初始列宽数组，长度为表头长度+一个空格长度
				let columnWidths = [5.5, 3.5, 4.5, 2.5, 4.5, 4.5, 3.5, 6, 4.5, 6.5, 4.5, 4.5, 4.5]
				// 遍历数组寻找最长字段，并进行保存
				for (var i = 0; i < data.length; i++) {
					if (data[i].RECORD_NUMBER && data[i].RECORD_NUMBER.length > columnWidths[0]) {
						columnWidths[0] = data[i].RECORD_NUMBER.length
					}
					if (data[i].DPT_NAME && data[i].DPT_NAME.length > columnWidths[2]) {
						columnWidths[2] = data[i].DPT_NAME.length
					}
					if (data[i].C_DPT_NAME && data[i].C_DPT_NAME.length > columnWidths[3]) {
						columnWidths[3] = data[i].C_DPT_NAME.length
					}
					if (data[i].PROJECT_NAME && data[i].PROJECT_NAME.length > columnWidths[4]) {
						columnWidths[4] = data[i].PROJECT_NAME.length
					}
					if (data[i].PRINCIPAL && data[i].PRINCIPAL.length > columnWidths[6]) {
						columnWidths[6] = data[i].PRINCIPAL.length
					}
					if (data[i].WORK_LOCATION && data[i].WORK_LOCATION.length > columnWidths[8]) {
						columnWidths[8] = data[i].WORK_LOCATION.length
					}
					if (data[i].WORK_PLAN && data[i].WORK_PLAN.length > columnWidths[9]) {
						columnWidths[9] = data[i].WORK_PLAN.length
					}
					if (data[i].WRITE_DATE && data[i].WRITE_DATE.length > columnWidths[10]) {
						columnWidths[10] = data[i].WRITE_DATE.length
					}
					if (data[i].WORK_USER && data[i].WORK_USER.length > columnWidths[11]) {
						columnWidths[11] = data[i].WORK_USER.length
					}
					if (data[i].EQ_NUMBER && data[i].EQ_NUMBER.length > columnWidths[12]) {
						columnWidths[12] = data[i].EQ_NUMBER.length
					}
				}
				// 普通字段长度与excel长度换算，大约是1:0.8
				for (let i = 0; i < columnWidths.length; i++) {
					columnWidths[i] = columnWidths[i] * 0.8
				}
				// 返回列宽数组
				return columnWidths
			}
		}
	}
</script>

<style>
</style>
