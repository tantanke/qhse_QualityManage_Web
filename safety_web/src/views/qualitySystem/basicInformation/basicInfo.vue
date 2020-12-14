<template>
	<div>
		<div class="page-title" style="width: 100%">审核计划</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :model="selectInfoForm" :inline="true">
				<el-form-item label="受审公司:">
					<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择受审单位" style="width: 250px" :options="companyList"
					 v-model="selectCheckedCompanyId"></treeselect>
				</el-form-item>
				<el-form-item label="审核日期：">
					<el-date-picker v-model="selectCheckDate" type="daterange" range-separator="至" start-placeholder="开始日期"
					 end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="getBasicInfo" style="margin-right: 15px;">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-plus" @click="addBasicInfo">新增审核计划</el-button>
				</el-form-item>
			</el-form>
			<!-- 基本信息登记列表区域 -->
			<el-table :data="basicInfoList" border stripe max-height="540px">
				<el-table-column type="expand" label="详情" width="50px">
					<template slot-scope="scope">
						<el-row>
							<el-col :span="8">
								<div class="detail">受审单位: {{scope.row.checkedCompanyName}}</div>
								<div class="detail">受审室组: {{scope.row.group}}</div>
								<div class="detail">作业项目名称: {{scope.row.projectName}}</div>
								<div class="detail">检测项目: {{scope.row.checkProject}}</div>
								<div class="detail">检测标准: {{scope.row.execStd}}</div>
							</el-col>
							<el-col :span="8">
								<div class="detail">单位负责人: {{scope.row.checkedPersonName}}</div>
								<div class="detail">室组长: {{scope.row.groupLeaderName}}</div>
								<div class="detail">项目组长: {{scope.row.projectLeaderName}}</div>
								<div class="detail">业主: {{scope.row.owner}}</div>
								<div class="detail">作业地点: {{scope.row.workPlace}}</div>
							</el-col>
							<el-col :span="8">
								<div class="detail">承包商: {{scope.row.contractor}}</div>
								<div class="detail">承包商人数: {{scope.row.contractorNumber}}</div>
								<div class="detail">作业人数: {{scope.row.workerNumber}}</div>
								<div class="detail">ERP员工数量: {{scope.row.erpnumber}}</div>
								<div class="detail">外聘员工数量: {{scope.row.externalNumber}}</div>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index" label="序号" width="50px" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="审核任务名称" prop="qualityCheckName" width="200" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="审核类别" prop="checkCategory" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="审核依据" prop="checkBasis" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="审核方式" prop="checkMethod" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="审核人员" prop="checkPerson" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="审核日期" prop="checkDate" width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="受审单位" prop="checkedCompanyName" width="200" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="受审单位负责人" prop="checkedPersonName" width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="审核进度" prop="progress" width="100" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="(整改/验证)完成时间" prop="finishDate" align="center" width="150"></el-table-column>
				<el-table-column label="操作" width="300" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="warning" icon="el-icon-success" size="mini" @click="editBasicInfo(scope.row)" v-if="scope.row.isPush!=='未推送'">查看</el-button>
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editBasicInfo(scope.row)" v-if="scope.row.isPush==='未推送'">修改</el-button>
						<el-button type="success" icon="el-icon-check" size="mini" @click="pushBasicInfo(scope.row)" v-if="scope.row.isPush==='未推送'">推送</el-button>
						<el-button type="success" icon="el-icon-check" size="mini" v-if="scope.row.isPush!=='未推送'">已推送</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBasicInfo(scope.row)" v-if="scope.row.isPush==='未推送'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 新增基本信息生成登记表对话框 -->
			<el-dialog title="新增审核计划" :close-on-click-modal="false" :visible.sync="addInfoDialogVisible" width="50%">
				<el-form :model="addInfoForm" :rules="addInfoFormRules" ref="addInfoFormRef" label-width="120px" :label-position="right"
				 :inline="true" >
				 <el-form-item label="审核任务名称" prop="qualityCheckName">
						<el-input v-model="addInfoForm.qualityCheckName" style="width: 280%;" placeholder="请输入审核任务名称"></el-input>
					</el-form-item>
					<br />
				 <el-col :span="12">
					 <el-form-item label="审核类别" prop="checkCategory">
						<el-select v-model="addInfoForm.checkCategory" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkCategoryOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核方式" prop="checkMethod">
						<el-select v-model="addInfoForm.checkMethod" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkMethodOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核日期" prop="checkDate" style="margin-right: 0px;">
						<el-date-picker clearable v-model="addInfoForm.checkDate" type="date" placeholder="请选择日期" format="yyyy 年 MM 月 dd 日"
						 value-format="yyyy-MM-dd" style="width: 218px;">
						</el-date-picker>
					</el-form-item>
				 </el-col>
				<el-col :span="12">
					<el-form-item label="审核依据" prop="checkBasis">
						<el-select v-model="addInfoForm.checkBasis" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkBasisOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item label="检查表名称" prop="checkListCode">
						<el-input clearable v-model="addInfoForm.checkListName" readonly placeholder="请输入"></el-input>
					</el-form-item>
					
					<el-form-item label="审核人员" prop="checkPerson">
						<el-select v-model="addInfoForm.checkPersonID" style="width: 100%" clearable filterable>
							<el-option :label="item.name+'('+item.companyName+')'" :value="item.employeeID" v-for="(item,index) in employee"
							 :key="index"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
					<el-form-item label="受审核单位" prop="checkedCompanyCode">
						<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择受审单位" style="min-width: 235px;max-width:560px ; width:fit-content "
						 :options="companyList" v-model="checkedCompanyId"></treeselect>
					</el-form-item>
					<el-form-item label="单位负责人">
						<el-select v-model="addInfoForm.checkedPersonID" style="width: 100%" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<br />
					<el-col :span="12">
						<el-form-item label="受审核室组" prop="group">
						<el-input clearable v-model="addInfoForm.group" placeholder="请输入" style="width: 100%"></el-input>
					</el-form-item>
					<el-form-item label="作业项目名称" prop="projectName">
						<el-input clearable v-model="addInfoForm.projectName" style="width: 100%" placeholder="请输入"></el-input>
					</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="室组长">
						<el-select v-model="addInfoForm.groupLeaderID" style="width: 100%" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="项目组长">
						<el-select v-model="addInfoForm.projectLeaderID" style="width: 100%" placeholder="请选择" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					</el-col>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button icon="el-icon-refresh-left" @click="addInfoDialogVisible = false">取 消</el-button>
					<el-button icon="el-icon-check" type="primary" @click="addInfoClick">提 交</el-button>
				</span>
			</el-dialog>
			<!-- 编辑修改基本信息登记表对话框 -->
			<el-dialog title="修改审核计划" :visible.sync="editInfoDialogVisible" width="50%">
				<!-- 基本信息表单 -->
				<el-form :model="eidtInfoForm" label-width="110px" :label-position="right" :inline="true">
					<el-form-item label="审核任务名称">
						<el-input v-model="eidtInfoForm.qualityCheckName" style="width: fit-content;max-width: 575px;min-width: 280%;" placeholder="请输入"></el-input>
					</el-form-item>
					<br/>
					<el-col :span="12">
						<el-form-item label="审核类别">
						<el-select v-model="eidtInfoForm.checkCategory" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkCategoryOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核方式">
						<el-select v-model="eidtInfoForm.checkMethod" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkMethodOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核日期">
						<el-date-picker style="100%" v-model="eidtInfoForm.checkDate" type="date" placeholder="请选择日期" format="yyyy 年 MM 月 dd 日"
						 value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="审核依据">
						<el-select v-model="eidtInfoForm.checkBasis" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkBasisOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item label="检查表名称" prop="checkListCode">
						<el-input v-model="eidtInfoForm.checkListName" readonly style="width: 107%" placeholder="请输入"></el-input>
					</el-form-item>
					
					<el-form-item label="审核人员">
						<el-input v-model="eidtInfoForm.checkPerson" readonly style="width: 107%"></el-input>
					</el-form-item>
					</el-col>
					
					<el-form-item label="受审核单位">
						<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="min-width: 230px;max-width:563px ; width:fit-content "
						 :options="companyList" v-model="checkedCompanyId"></treeselect>
						<!-- <el-input type="textarea" :autosize="true" v-model="eidtInfoForm.checkedCompanyName" readonly style="width: 115%;"></el-input> -->
					</el-form-item>
					<el-form-item label="受审单位负责人">
						<el-select v-model="eidtInfoForm.checkedPersonID" style="width: 100%" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<br />
					<el-col :span="12">
						<el-form-item label="受审核室组">
						<el-input placeholder="请输入" style="width: 107%" v-model="eidtInfoForm.group"></el-input>
					</el-form-item>
					<el-form-item label="作业项目名称" prop="projectName">
						<el-input v-model="eidtInfoForm.projectName" style="width: 107%" placeholder="请输入"></el-input>
					</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="室组长">
						<el-select v-model="eidtInfoForm.groupLeaderID" style="width: 100%" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="  项目组长">
						<el-select v-model="eidtInfoForm.projectLeaderID" style="width: 100%" placeholder="请选择" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					</el-col>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button icon="el-icon-refresh-left" @click="editInfoDialogVisible = false">关 闭</el-button>
					<el-button icon="el-icon-check" type="primary" @click="editInfoClick()" v-if="eidtInfoForm.isPush==='未推送'">修 改</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import { GetCompany } from "../../../services/gettreedata"
	import { GetCurrentUser } from '../../../store/CurrentUser'
	import { GetEmployee } from "../../../services/filePropagation.js"
	import {
		submitBasicInfo,
		getCheckList,
		editBasicInfomation,
		deleteBasicInfomation,
		pushBasicInfomation,
		inquireBasicInfomation
	} from "../../../services/qualitySystem/basicInfo"
	export default {
		data() {
			// 验证邮箱的规则
			var checkCurrentDate = (rule, value, callback) => {
				console.log(value)
				if (this.currentDate <= value) {
					return callback()
				}
				callback(new Error('审核日期不能选择小于当前日期'))
			}
			return {
				// 加载
				loading: false,
				activeIndex: '0',
				editActiveIndex: '0',
				checkCategory: '',
				checkBasis: '',
				checkMethod: '',
				checkCategoryOptions: [],
				checkBasisOptions: [],
				checkMethodOptions: [],
				// 查询部分表格信息表单对象
				selectInfoForm: {
					checkedCompanyCode: null,
					checkDate: ''
				},
				// 查询部分数据时间数组
				selectCheckDate: [],
				// 查询表格公司code
				selectCheckedCompanyId: null,
				// 基本信息登记表格数据
				basicInfoList: [],
				// 可以选择多个的检查表ID数组
				checkListCode: [],
				// 可以选择多个的检查表名称数组
				checkListName: [],
				// 请求的检查表数据
				checkTableList: [],
				// 公司表数据
				companyList: [],
				// 员工表数据
				employee: [],
				// 中间员工表数组
				employeeList: [],
				// 编辑员工数组
				editEmployeeList: [],
				employeeDetail: [],
				// 最终员工表筛选数据
				employeeArr: [],
				// 编辑对话框员工数组
				employeeArray: [],
				// companyNodeCode
				companyCode: '',
				// 公司名称
				companyName: '',
				// 公司id
				companyId: null,
				// 受审核单位ID
				checkedCompanyId: null,
				// 责任部门id
				responsiCompanyId: null,
				// 显示与隐藏新增基本信息登记表对话框
				addInfoDialogVisible: false,
				// 编辑信息登记表对话框显示与隐藏
				editInfoDialogVisible: false,
				// 编辑信息表表单对象
				eidtInfoForm: {},
				// 编辑对话框受审核单位id
				editCheckedCompanyId: null,
				// 编辑对话框责任部门id
				eidtResponsiCompanyId: null,
				// 基本信息登记表单数据
				addInfoForm: {
					//审核任务名
					qualityCheckName: '',
					//审核类别
					checkCategory: '',
					//审核依据
					checkBasis: '',
					//审核方式
					checkMethod: '',
					// 检查表code
					checkListCode: '',
					// 检查表名称
					checkListName: '',
					// 受审核单位
					checkedCompanyName: '',
					// 受审核单位ID
					checkedCompanyCode: null,
					//受审单位负责人
					checkedPersonName: '',
					checkedPersonID: '',
					// 受审核室组
					group: '',
					//室组负责人
					groupLeaderName: '',
					groupLeaderID: '',
					// 审核日期
					checkDate: '',
					checkPersonID: '',
					// 审核人员姓名
					checkPerson: '',
					// 项目组名称
					projectName: '',
					//项目组长
					projectLeaderName: '',
					projectLeaderID: '',
					//承包商
					contractor: '',
					//业主
					owner: '',
					//检查项目
					checkProject: '',
					//执行标准
					execStd: '',
					//工人数量
					workerNumber: '',
					//外聘员工数量
					externalNumber: '',
					//工作地点
					workPlace: '',
					//承包商数量
					contractorNumber: '',
					//完成时间
					finishDate: '',
					//erp员工数量
					erpnumber: ''
				},
				// 验证规则
				addInfoFormRules: {
					qualityCheckName: [{
						required: true,
						message: '请输入审核任务名称',
						trigger: 'blur'
					}],
					checkCategory: [{
						required: true,
						message: '请输入审核类别名称',
						trigger: 'blur'
					}],
					checkBasis: [{
						required: true,
						message: '请输入审核依据名称',
						trigger: 'blur'
					}],
					checkMethod: [{
						required: true,
						message: '请输入审核方式名称',
						trigger: 'blur'
					}],
					projectName: [{
						required: true,
						message: '请输入项目组名称',
						trigger: 'blur'
					}],
					projectLeaderID: [{
						required: true,
						message: '请选择项目组长',
						trigger: 'blur'
					}],
					checkDate: [{
							required: true,
							message: '请选择审核日期',
							trigger: 'blur'
						},
						{
							validator: checkCurrentDate,
							trigger: 'blur'
						}
					],
					checkPerson: [{
						required: true,
						message: '请输入监督人员',
						trigger: 'blur'
					}],
					group: [{
						required: true,
						message: '请选择受审核部门',
						trigger: 'blur'
					}],
					groupLeaderID: [{
						required: true,
						message: '请选择受审室组负责人',
						trigger: 'blur'
					}],
					checkedCompanyCode: [{
						required: true,
						message: '请选择受审核单位',
						trigger: 'blur'
					}],
					checkedPersonID: [{
						required: true,
						message: '请选择受审单位负责人',
						trigger: 'blur'
					}]
				}
			}
		},
		mounted() {
			this.getCheckTableList()
		},
		created: function() {
			this.loading = true
			// 获取公司表
			this.getCompany()
			this.getEmploee()
			this.getBasicInfo()
			// 获取当前用户
			this.currentDate = this.getCurrentDate()
		},
		methods: {
			// 基本信息登记表对话框
			addBasicInfo: function() {
				this.getCompany()
				this.getCurrentUser()
				this.getEmploee()
				this.addInfoDialogVisible = true
				this.getCheckTableList()
				this.init('addInfoForm')
			},
			init(options) {
				switch (options) {
					case 'addInfoForm':
						this.addInfoForm.checkCategory = ''
						this.addInfoForm.checkListCode = ''
						this.addInfoForm.checkListName = ''
						this.addInfoForm.checkedCompanyName = ''
						this.addInfoForm.checkedCompanyCode = ''
						this.addInfoForm.group = ''
						this.addInfoForm.checkedPersonID = ''
						this.addInfoForm.checkedPersonName = ''
						this.addInfoForm.groupLeaderID = ''
						this.addInfoForm.groupLeaderName = ''
						this.addInfoForm.responsiCompanyName = ''
						this.addInfoForm.responsiCompanyCode = ''
						this.addInfoForm.responsePersonID = ''
						this.addInfoForm.responsePersonName = ''
						this.addInfoForm.checkDate = ''
						this.addInfoForm.checkPersonID = ''
						this.addInfoForm.checkPerson = ''
						this.addInfoForm.checkBasis = ''
						this.addInfoForm.contractor = ''
						this.addInfoForm.owner = ''
						this.addInfoForm.projectName = ''
						this.addInfoForm.projectLeaderID = ''
						this.addInfoForm.projectLeaderName = ''
						this.addInfoForm.checkProject = ''
						this.addInfoForm.execStd = ''
						this.addInfoForm.checkMethod = ''
						this.addInfoForm.qualityCheckName = ''
						this.addInfoForm.workerNumber = ''
						this.addInfoForm.externalNumber = ''
						this.addInfoForm.workPlace = ''
						this.addInfoForm.contractorNumber = ''
						this.addInfoForm.finishDate = ''
						this.addInfoForm.erpnumber = ''
						this.checkedCompanyId = null
						break
					default:
						break
				}
			},
			addInfoClick: function() {
				// 提交表单
				//   this.changeCheckListCodeToName()
				//   console.log(this.addInfoForm)
				this.$refs.addInfoFormRef.validate((valid) => {
					if (!valid) {
						return this.$message.error('基本信息表必填项未填')
					}
					this.changeCheckListCodeToName()
					submitBasicInfo(this.addInfoForm).then((res) => {
						this.getBasicInfo()

						return this.$message.success('基本信息登记成功')
					}).catch((err) => {
						return this.$message.error(err.message)
					})
				})
				this.addInfoDialogVisible = false
			},
			getBasicInfo: function() {
				const x = []
				for (let i in this.selectCheckDate) {
					x.push(this.formatDate(this.selectCheckDate[i]))
				}
				this.selectInfoForm.checkDate = x.join(';')
				// if(this.selectInfoForm.checkedCompanyCode == null || this.selectInfoForm.checkDate == '') {
				//     return this.$message.error('请同时选择公司以及审核日期')
				// }
				inquireBasicInfomation(this.selectInfoForm).then((res) => {
					this.basicInfoList = this.sortByDate(res.data)
					this.loading = false
				}).catch((err) => {
					return this.$message.error(err.message)
				})
			},
			editBasicInfo: function(information) {
				// 弹出编辑基本信息表对话框
				// if (information.isPush === '已推送') {
				// 	return this.$message.error('该登记表已推送，无法进行再次修改')
				// }
				this.eidtInfoForm = information
				this.changeCompanyCodeToId(this.companyList, this.eidtInfoForm.checkedCompanyCode)
				this.checkedCompanyId = this.companyId
				//this.getCheckTableList()
				this.employeeList = this.employee.filter(item => {
					return item.companyName == this.eidtInfoForm.checkedCompanyName
				})
				//this.editCheckedCompanyIDChange(information)
				//   this.eidtResponsiCompanyIDChange(information)    
				this.editInfoDialogVisible = true
			},
			deleteBasicInfo: async function(row) {
				// 删除基本信息登记表
				if (row.isPush === "已推送") {
					return this.$message.error('该登记表已推送，请勿进行删除操作')
				}
				const confirmResult = await this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirmResult !== 'confirm') {
					return this.$message.info('已取消删除')
				}
				deleteBasicInfomation(row.qualityCheckID).then((res) => {
					this.getBasicInfo()
					return this.$message.success('删除信息成功')
				}).catch((err) => {
					return this.$message.error(err.message)
				})
			},
			pushBasicInfo: async function(row) {
				// 推送基本信息登记表
				if (row.isPush === "已推送") {
					return this.$message.error('该登记表已推送，请勿重复操作')
				}
				const confirmResult = await this.$confirm('推送该表后相关信息无法修改或删除！是否推送该表信息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirmResult !== 'confirm') {
					return this.$message.info('已取消推送')
				}
				pushBasicInfomation(row.qualityCheckID).then((res) => {
					this.getBasicInfo()
					return this.$message.success('推送成功')
				}).catch((err) => {
					return this.$message.error(err.message)
				})
			},
			addInfoDialogClosed: function() {
				// 关闭基本信息登记表对话框
				this.$refs.addInfoFormRef.resetFields()
				this.checkedCompanyId = null
				this.responsiCompanyId = null
				this.activeIndex = '0'
			},
			// 获取检查表
			getCheckTableList: function() {
				getCheckList().then((res) => {
					this.checkTableList = res.data
					for (var i = 0; i < this.checkTableList.length; i++) {
						//生成审核类别选择表
						if (!this.isCopy(this.checkTableList[i].checkCategory, this.checkCategoryOptions)) {
							let item = {
								value: '',
								label: ''
							}
							item.value = item.label = this.checkTableList[i].checkCategory
							this.checkCategoryOptions.push(item)
						}
						//生成审核依据选择表
						if (!this.isCopy(this.checkTableList[i].checkBasis, this.checkBasisOptions)) {
							let item = {
								value: '',
								label: ''
							}
							item.value = item.label = this.checkTableList[i].checkBasis
							this.checkBasisOptions.push(item)
						}
						//生成审核方式选择表
						if (!this.isCopy(this.checkTableList[i].checkMethod, this.checkMethodOptions)) {
							let item = {
								value: '',
								label: ''
							}
							item.value = item.label = this.checkTableList[i].checkMethod
							this.checkMethodOptions.push(item)
						}
					}
				})
			},
			//检查需要新增的目标字段是否已经存在于目标数组中，返回一个boolean值
			isCopy(original, targetArray) {
				let copy = false
				for (let i = 0; i < targetArray.length; i++) {
					if (original === targetArray[i].value) {
						copy = true
						break
					}
				}
				return copy
			},
			editInfoClick: function(information) {
				// 修改配置基本信息表
				// 编辑确认基本信息表
				let that = this
				if (this.eidtInfoForm.isPush === '已推送') {
					return this.$message.error('该登记表已推送，无法进行再次修改')
				}
				editBasicInfomation(that.eidtInfoForm.qualityCheckID, that.eidtInfoForm).then((res) => {
					this.getBasicInfo()
					this.editActiveIndex = '0'
					this.editInfoDialogVisible = false
					return this.$message.success('修改成功')
				}).catch((err) => {
					return this.$message.error(err.message)
				})
			},
			// 获取公司表
			getCompany: function() {
				GetCompany().then(res => {
					this.companyList = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})

			},
			// 获取当前用户
			getCurrentUser: function() {
				return GetCurrentUser()
			},
			//获得员工信息
			getEmploee: function() {
				GetEmployee().then(res => {
					//调用接口返回员工表，并对员工表进行筛选，只返回属于该行公司的员工信息
					this.employee = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//受审单位监听事件
			checkCompanyCodeChanged: function(val) {
				// 监听受审核单位发生变化时的操作
				console.log(val)
				if (val) {
					//根据公司id获取公司code，name
					this.changeCompanyIdToName(this.companyList, this.checkedCompanyId)
					this.addInfoForm.checkedCompanyName = this.companyName
					this.addInfoForm.checkedCompanyCode = this.companyCode
					//筛选属于该公司的员工
					this.employeeList = this.employee.filter((item) => {
						return item.companyName == this.addInfoForm.checkedCompanyName
					})
					const x = []
					const arr = this.employeeList
					for (let i = 0; i < this.employeeList.length; i++) {
						var isRepeat = false
						for (let j = i + 1; j < arr.length; j++) {
							if (this.employeeList[i].employeeID === arr[j].employeeID) {
								isRepeat = true
								break
							}
						}
						if (isRepeat == false) {
							x.push(this.employeeList[i])
						}
					}
					this.employeeList = x
					console.log('employee', this.employeeList)
				} else {
					this.addInfoForm.checkedCompanyName = ''
					this.companyCode = ''
				}
			},
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
			// 将公司code转化为公司id
			changeCompanyCodeToId: function(val, companyCode) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].nodeCode == companyCode) {
							this.companyId = val[j].id
							this.companyName = val[j].label
							break
						} else if (val[j].children) {
							this.changeCompanyCodeToId(val[j].children, companyCode)
						}
					}
				}
			},
			// 将检查表code改变为name
			changeCheckListCodeToName: function() {
				for (let i in this.checkTableList) {
					if (this.addInfoForm.checkListCode === this.checkTableList[i].checkListCode) {
						this.addInfoForm.checkListName = this.checkTableList[i].checkListName
						break
					}
				}
				//    this.addInfoForm.checkListName = this.checkListName.join(';')
				console.log(this.addInfoForm.checkListName)
			},
			selectCheckedCompanyIdChanged: function(val) {
				// 监听查询选择公司id变化
				if (val) {
					this.changeCompanyIdToName(this.companyList, this.selectCheckedCompanyId)
					this.selectInfoForm.checkedCompanyCode = this.companyCode
				} else {
					this.selectInfoForm.checkedCompanyCode = null
					this.companyCode = ''
				}
			},
			//对基本信息计划进行排序，审核日期越靠后次序越高
			sortByDate(data) {
				if (!data) {
					return
				}
				for (var i = 0; i < data.length - 1; i++) {
					for (var j = i + 1; j < data.length; j++) {
						if (data[i].checkDate <= data[j].checkDate) {
							let temp = data[i]
							data[i] = data[j]
							data[j] = temp
						}
					}
				}
				return data
			},
			editCheckedCompanyIdChanged: function(val) {
				// 监听编辑受审核部门id变化
				let that = this
				that.changeCompanyIdToName(that.companyList, that.checkedCompanyId)
				that.eidtInfoForm.checkedCompanyCode = that.companyCode
				that.eidtInfoForm.checkedCompanyName = that.companyName
				if (that.eidtInfoForm.checkedCompanyName) {
					that.employeeList = that.employee.filter(item => {
						return item.companyName == val
					})
				}
				//that.editFilterCheckedGroup(that.editInfoForm)

			},
			// 时间格式化
			formatDate: function(time) {
				const timer = time.getTime()
				const date = new Date(timer)
				const y = date.getFullYear()
				const m = date.getMonth() + 1
				const mm = m < 10 ? '0' + m : m
				const d = date.getDate()
				const dd = d < 10 ? '0' + d : d
				return y + '-' + mm + '-' + dd
			},
			getCurrentDate: function() {
				// 获取当前时间
				let date = new Date()
				console.log(date)
				let y = date.getFullYear()
				console.log(y)
				let m = date.getMonth() + 1
				console.log(m)
				m = m < 10 ? '0' + m : m
				let d = date.getDate()
				console.log(d)
				d = d < 10 ? '0' + d : d
				let str = y + '-' + m + '-' + d
				console.log(str)
				return str
			},
			addCheckCategory: function() {
				console.log('dialog open')
				if (this.addInfoForm.checkCategory && this.addInfoForm.checkBasis && this.addInfoForm.checkMethod) {
					let temp = this.checkTableList.filter(item => {
						return item.checkCategory == this.addInfoForm.checkCategory &&
							item.checkBasis == this.addInfoForm.checkBasis && item.checkMethod == this.addInfoForm.checkMethod
					})
					console.log('filter', temp)
					if (temp.length > 0) {
						this.addInfoForm.checkListCode = temp[0].checkListCode
						this.addInfoForm.checkListName = temp[0].checkListName
					} else {
						this.$message.warning('查无此表，请重新选择！')
						this.addInfoForm.checkListCode = ''
						this.addInfoForm.checkListName = ''
					}
				}
			},
			addCheckBasis: function() {
				console.log('dialog open')
				if (this.addInfoForm.checkCategory && this.addInfoForm.checkBasis && this.addInfoForm.checkMethod) {
					let temp = this.checkTableList.filter(item => {
						return item.checkCategory == this.addInfoForm.checkCategory && item.checkBasis == this.addInfoForm.checkBasis &&
							item.checkMethod ==
							this.addInfoForm.checkMethod
					})
					if (temp.length > 0) {
						this.addInfoForm.checkListCode = temp[0].checkListCode
						this.addInfoForm.checkListName = temp[0].checkListName
					} else {
						this.$message.warning('查无此表，请重新选择！')
						this.addInfoForm.checkListCode = ''
						this.addInfoForm.checkListName = ''
					}
				}
			},
			addCheckMethod: function() {
				console.log('dialog open')
				if (this.addInfoForm.checkCategory && this.addInfoForm.checkBasis && this.addInfoForm.checkMethod) {
					let temp = this.checkTableList.filter(item => {
						return item.checkCategory == this.addInfoForm.checkCategory && item.checkBasis == this.addInfoForm.checkBasis &&
							item.checkMethod ==
							this.addInfoForm.checkMethod
					})
					if (temp.length > 0) {
						this.addInfoForm.checkListCode = temp[0].checkListCode
						this.addInfoForm.checkListName = temp[0].checkListName
					} else {
						this.$message.warning('查无此表，请重新选择！')
						this.addInfoForm.checkListCode = ''
						this.addInfoForm.checkListName = ''
					}
					console.log('filter', temp)
				}
			},
			editCheckCategory: function() {
				console.log('dialog open')
				if (this.eidtInfoForm.checkCategory && this.eidtInfoForm.checkBasis && this.eidtInfoForm.checkMethod) {
					let temp = this.checkTableList.filter(item => {
						return item.checkCategory == this.eidtInfoForm.checkCategory && item.checkBasis == this.eidtInfoForm.checkBasis &&
							item.checkMethod ==
							this.eidtInfoForm.checkMethod
					})
					if (temp.length > 0) {
						this.eidtInfoForm.checkListCode = temp[0].checkListCode
						this.eidtInfoForm.checkListName = temp[0].checkListName
					} else {
						this.$message.warning('查无此表，请重新选择！')
						this.eidtInfoForm.checkListCode = ''
						this.eidtInfoForm.checkListName = ''
					}
				}
			},
			editCheckBasis: function() {
				console.log('dialog open')
				if (this.eidtInfoForm.checkCategory && this.eidtInfoForm.checkBasis && this.eidtInfoForm.checkMethod) {
					let temp = this.checkTableList.filter(item => {
						return item.checkCategory == this.eidtInfoForm.checkCategory && item.checkBasis == this.eidtInfoForm.checkBasis &&
							item.checkMethod ==
							this.eidtInfoForm.checkMethod
					})
					if (temp.length > 0) {
						this.eidtInfoForm.checkListCode = temp[0].checkListCode
						this.eidtInfoForm.checkListName = temp[0].checkListName
					} else {
						this.$message.warning('查无此表，请重新选择！')
						this.eidtInfoForm.checkListCode = ''
						this.eidtInfoForm.checkListName = ''
					}
				}
			},
			//编辑计划表审核方式事件监听函数
			editCheckMethod: function() {
				console.log('dialog open')
				if (this.eidtInfoForm.checkCategory && this.eidtInfoForm.checkBasis && this.eidtInfoForm.checkMethod) {
					let temp = this.checkTableList.filter(item => {
						return item.checkCategory == this.eidtInfoForm.checkCategory && item.checkBasis == this.eidtInfoForm.checkBasis &&
							item.checkMethod ==
							this.eidtInfoForm.checkMethod
					})
					if (temp.length > 0) {
						this.eidtInfoForm.checkListCode = temp[0].checkListCode
						this.eidtInfoForm.checkListName = temp[0].checkListName
					} else {
						this.$message.warning('查无此表，请重新选择！')
						this.eidtInfoForm.checkListCode = ''
						this.eidtInfoForm.checkListName = ''
					}
				}
			},
			//获取指定员工name
			getEmploeeItem(employeeID, emploeeList) {
				if (!emploeeList || !employeeID) {
					return null
				}
				let temp = emploeeList.filter(item => {
					return item.employeeID == employeeID
				})
				return temp[0].name
			},
			addCheckPerson: function() {
				this.addInfoForm.checkPerson = this.getEmploeeItem(this.addInfoForm.checkPersonID, this.employee)
			},
			addCheckedPerson: function() {
				this.addInfoForm.checkedPersonName = this.getEmploeeItem(this.addInfoForm.checkedPersonID, this.employee)
			},
			addGroupLeader: function() {
				this.addInfoForm.groupLeaderName = this.getEmploeeItem(this.addInfoForm.groupLeaderID, this.employee)
			},
			addProjectLeader: function() {
				this.addInfoForm.projectLeaderName = this.getEmploeeItem(this.addInfoForm.projectLeaderID, this.employee)
			},
			editCheckedPerson: function() {
				this.eidtInfoForm.checkedPersonName = this.getEmploeeItem(this.eidtInfoForm.checkedPersonID, this.employee)
			},
			editGroupLeader: function() {
				this.eidtInfoForm.groupLeaderName = this.getEmploeeItem(this.eidtInfoForm.groupLeaderID, this.employee)
			},
			editProjectLeader: function() {
				this.eidtInfoForm.projectLeaderName = this.getEmploeeItem(this.eidtInfoForm.projectLeaderID, this.employee)
			}
		},
		watch: {
			//新增计划表审核类别事件监听
			'addInfoForm.checkCategory': 'addCheckCategory',
			//新增计划表审核依据事件监听
			'addInfoForm.checkBasis': 'addCheckBasis',
			//新增计划表审核方式事件监听
			'addInfoForm.checkMethod': 'addCheckMethod',
			//编辑计划表审核类别事件监听
			'eidtInfoForm.checkCategory': 'editCheckCategory',
			//编辑计划表审核依据事件监听
			'eidtInfoForm.checkBasis': 'editCheckBasis',
			//编辑计划表审核方式事件监听
			'eidtInfoForm.checkMethod': 'editCheckMethod',
			//新增计划表审核人员事件监听
			'addInfoForm.checkPersonID': 'addCheckPerson',
			//新增计划表受审公司负责人事件监听
			'addInfoForm.checkedPersonID': 'addCheckedPerson',
			//新增计划表受审室组负责人事件监听
			'addInfoForm.groupLeaderID': 'addGroupLeader',
			//新增计划表项目组长事件监听
			'addInfoForm.projectLeaderID': 'addProjectLeader',
			//编辑计划表受审公司负责人监听事件
			'eidtInfoForm.checkedPersonID': 'editCheckedPerson',
			//编辑计划表受审室组负责人事件监听
			'eidtInfoForm.groupLeaderID': 'editGroupLeader',
			//编辑计划表项目组长事件监听
			'eidtInfoForm.projectLeaderID': 'editProjectLeader',
			// 监听受审核单位id发生变化
			'checkedCompanyId': 'checkCompanyCodeChanged',
			// 监听责任部门ID发生变化
			'responsiCompanyId': 'responsiCompanyID',
			// 监听检查表发生变化
			//'checkListCode': 'checkListCodeChanged',
			// 监听查询选择公司id变化
			'selectCheckedCompanyId': 'selectCheckedCompanyIdChanged',
			// 监听编辑受审核单位变化
			'eidtInfoForm.checkedCompanyName': 'editCheckedCompanyIdChanged',
			// 监听编辑责任部门id变化
			//'eidtResponsiCompanyId': 'eidtResponsiCompanyIdChanged'
		}
	}
</script>

<style scoped>
	.progressInfo {
		margin: 26px 0;
	}

	.detail {
		margin: 20px 0;
		color: #999;
	}
</style>
