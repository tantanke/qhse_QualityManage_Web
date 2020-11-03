<template>
	<div>
		<div class="page-title" style="width: 100%">审核计划</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :model="selectInfoForm" :inline="true">
				<el-form-item label="受审公司:">
					<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
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
					<el-button type="primary" icon="el-icon-plus" @click="addBasicInfo">基本信息生成</el-button>
				</el-form-item>
			</el-form>


			<!-- 基本信息登记列表区域 -->
			<el-table :data="basicInfoList" border stripe>
				<el-table-column type="expand" label="详情" width="50px">
					<template slot-scope="scope">
						<el-row>
<<<<<<< HEAD
							<el-col :span="10">
=======
							<el-col :span="8">
>>>>>>> 170940f... 质量模块检查表配置
								<div class="detail">受审核单位: {{scope.row.checkedCompanyName}}</div>
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
<<<<<<< HEAD
							<el-col :span="6">
=======
							<el-col :span="8">
>>>>>>> 170940f... 质量模块检查表配置
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
				<el-table-column label="操作" width="260" align="center" fixed="right">
					<template slot-scope="scope">
<<<<<<< HEAD
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editBasicInfo(scope.row)">修改</el-button>
						<el-button type="success" icon="el-icon-check" size="mini" @click="pushBasicInfo(scope.row)">推送</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBasicInfo(scope.row)">删除</el-button>
=======
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editBasicInfo(scope.row)" v-if="scope.row.isPush==='已推送'">查看</el-button>
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editBasicInfo(scope.row)" v-if="scope.row.isPush==='未推送'">修改</el-button>
						<el-button type="success" icon="el-icon-check" size="mini" @click="pushBasicInfo(scope.row)" v-if="scope.row.isPush==='未推送'">推送</el-button>
						<el-button type="success" icon="el-icon-check" size="mini" v-if="scope.row.isPush==='已推送'">已推送</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBasicInfo(scope.row)" v-if="scope.row.isPush==='未推送'">删除</el-button>
>>>>>>> 170940f... 质量模块检查表配置
					</template>
				</el-table-column>
			</el-table>


			<!-- 新增基本信息生成登记表对话框 -->
			<el-dialog title="新增基本信息登记表" :close-on-click-modal="false" :visible.sync="addInfoDialogVisible" @closed="addInfoDialogClosed">
				<el-form :model="addInfoForm" :rules="addInfoFormRules" ref="addInfoFormRef" label-width="110px" :label-position="right"
				 :inline="true">
					<el-form-item label="审核任务名称" prop="qualityCheckName">
						<el-input v-model="addInfoForm.qualityCheckName"style="width: 272%" placeholder="请输入"></el-input>
					</el-form-item>
					<br />
						<el-form-item label="审核类别" prop="checkCategory">
						<el-select v-model="addInfoForm.checkCategory" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkCategoryOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核依据" prop="checkBasis">
						<el-select v-model="addInfoForm.checkBasis" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkBasisOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核方式" prop="checkMethod">
						<el-select v-model="addInfoForm.checkMethod" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkMethodOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>	
					<el-form-item label="检查表名称" prop="checkListCode">
						<el-input clearable v-model="addInfoForm.checkListName" readonly placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="审核日期" prop="checkDate" style="width: 46%">
						<el-date-picker clearable v-model="addInfoForm.checkDate" type="date" placeholder="请选择日期"
						 format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="审核人员" prop="checkPerson">
						<el-select v-model="addInfoForm.checkPersonID" style="width: 100%" clearable filterable>
							<el-option :label="item.name+'('+item.companyName+')'" :value="item.employeeID" v-for="(item,index) in employee" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="受审核单位" prop="checkedCompanyCode">
						<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="min-width: 230px;max-width:560px ; width:fit-content "
						 :options="companyList" v-model="checkedCompanyId"></treeselect>
					</el-form-item>
					<el-form-item label="受审单位负责人" prop="checkedPersonName">
						<el-select v-model="addInfoForm.checkedPersonID" style="width: 100%" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<br />
					<el-form-item label="受审核室组" prop="group">
						<!-- <el-select v-model="addInfoForm.group" placeholder="请选择" style="width: 100%">
							<el-option :label="item.empGroup" :value="item.empGroup" v-for="(item, index) in employeeList" :key="index">
								<span>{{item.empGroup}}({{item.companyName}})</span>
							</el-option>
						</el-select> -->
						<el-input clearable v-model="addInfoForm.group" placeholder="请输入" style="width: 100%"></el-input>
					</el-form-item>
					<el-form-item label="室组长" prop="groupLeaderID">
						<el-select v-model="addInfoForm.groupLeaderID" style="width: 100%" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="作业项目名称" prop="projectName">
						<el-input clearable v-model="addInfoForm.projectName" style="width: 100%" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="项目组长" prop="projectLeaderName">
						<el-select v-model="addInfoForm.projectLeaderID" style="width: 100%" placeholder="请选择" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addInfoDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addInfoClick">提 交</el-button>
				</span>
			</el-dialog>
			<!-- 编辑修改基本信息登记表对话框 -->
			<el-dialog title="修改基本信息登记表" :visible.sync="editInfoDialogVisible" width="50%">
				<!-- 基本信息表单 -->
				<el-form :model="eidtInfoForm" label-width="120px" :label-position="right" :inline="true">
					<el-form-item label="审核任务名称">
						<el-input v-model="eidtInfoForm.qualityCheckName" style="width: 555px" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="审核类别">
						<el-select v-model="eidtInfoForm.checkCategory" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkCategoryOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核依据">
						<el-select v-model="eidtInfoForm.checkBasis" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkBasisOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核方式">
						<el-select v-model="eidtInfoForm.checkMethod" style="width: 100%">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkMethodOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="检查表名称" prop="checkListCode">
						<el-input v-model="eidtInfoForm.checkListName" readonly style="width: 107%" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="审核日期">
						<el-date-picker style="100%" v-model="eidtInfoForm.checkDate" type="date" placeholder="请选择日期" format="yyyy 年 MM 月 dd 日"
						 value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="审核人员">
						<el-input v-model="eidtInfoForm.checkPerson" readonly style="width: 107%"></el-input>
					</el-form-item>
					<el-form-item label="受审核单位">
						<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="min-width: 230px;max-width:560px ; width:fit-content "
						 :options="companyList" v-model="checkedCompanyId"></treeselect>
						<!-- <el-input type="textarea" :autosize="true" v-model="eidtInfoForm.checkedCompanyName" readonly style="width: 115%;"></el-input> -->
					</el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<el-form-item label="受审单位负责人">
						<el-select v-model="eidtInfoForm.checkedPersonID" style="width: 100%" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="受审核室组">
						<!-- <el-select v-model="eidtInfoForm.group" placeholder="请选择">
                     <el-option :label="item.empGroup" :value="item.empGroup" v-for="(item, index) in editEmployeeList" :key="index">
                         <span>{{item.empGroup}}({{item.companyName}})</span>
                     </el-option>
                    </el-select> -->
						<el-input placeholder="请输入" style="width: 107%" v-model="eidtInfoForm.group"></el-input>
					</el-form-item>&nbsp;&nbsp;&nbsp;
					<el-form-item label="室组长">
						<el-select v-model="eidtInfoForm.groupLeaderID" style="width: 100%" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="作业项目名称" prop="projectName">
						<el-input v-model="eidtInfoForm.projectName" style="width: 107%" placeholder="请输入"></el-input>
					</el-form-item>&nbsp;&nbsp;&nbsp;
					<el-form-item label="  项目组长">
						<el-select v-model="eidtInfoForm.projectLeaderID" style="width: 100%" placeholder="请选择" clearable filterable>
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
<<<<<<< HEAD
					<el-button @click="editInfoDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="editInfoClick()">修 改</el-button>
=======
					<el-button @click="editInfoDialogVisible = false">关 闭</el-button>
					<el-button type="primary" @click="editInfoClick()" v-if="eidtInfoForm.isPush==='未推送'">修 改</el-button>
>>>>>>> 170940f... 质量模块检查表配置
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		GetCompany
	} from "../../../services/gettreedata"
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser'
	import {
		GetEmployee
	} from "../../../services/filePropagation.js"
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
					contractor:'',
					//业主
					owner:'',
					//检查项目
					checkProject:'',
					//执行标准
					execStd:'',
					//工人数量
					workerNumber:'',
					//外聘员工数量
					externalNumber:'',
					//工作地点
					workPlace:'',
					//承包商数量
					contractorNumber:'',
					//完成时间
					finishDate:'',
					//erp员工数量
					erpnumber:''
				},
				// 验证规则
				addInfoFormRules: {
					qualityCheckName: [{
						required: true,
						message: '请输入审核任务名称',
						trigger: 'blur'
					}],
					checkCategory:[{
						required: true,
						message: '请输入审核类别名称',
						trigger: 'blur'
					}],
					checkBasis:[{
						required: true,
						message: '请输入审核依据名称',
						trigger: 'blur'
					}],
					checkMethod:[{
						required: true,
						message: '请输入审核方式名称',
						trigger: 'blur'
					}],
					projectName: [{
						required: true,
						message: '请输入项目组名称',
						trigger: 'blur'
					}],
					checkProject: [{
						required: true,
						message: '请输入需要检测的项目',
						trigger: 'blur'
					}],
					checkBasis: [{
						required: true,
						message: '请输入监督检查依据',
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
					checkedCompanyCode: [{
						required: true,
						message: '请选择受审核单位',
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
			console.log(GetCurrentUser())
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
				console.log('checkBasisOptions',this.checkBasisOptions)
			},
			init(options){
				switch(options){
					case 'addInfoForm':
						this.addInfoForm.checkCategory=''
						this.addInfoForm.checkListCode=''
						this.addInfoForm.checkListName=''
						this.addInfoForm.checkedCompanyName=''
						this.addInfoForm.checkedCompanyCode=''
						this.addInfoForm.group=''
						this.addInfoForm.checkedPersonID=''
						this.addInfoForm.checkedPersonName=''
						this.addInfoForm.groupLeaderID=''
						this.addInfoForm.groupLeaderName=''
						this.addInfoForm.responsiCompanyName=''
						this.addInfoForm.responsiCompanyCode=''
						this.addInfoForm.responsePersonID=''
						this.addInfoForm.responsePersonName=''
						this.addInfoForm.checkDate=''
						this.addInfoForm.checkPersonID=''
						this.addInfoForm.checkPerson=''
						this.addInfoForm.checkBasis=''
						this.addInfoForm.contractor=''
						this.addInfoForm.owner=''
						this.addInfoForm.projectName=''
						this.addInfoForm.projectLeaderID=''
						this.addInfoForm.projectLeaderName=''
						this.addInfoForm.checkProject=''
						this.addInfoForm.execStd=''
						this.addInfoForm.checkMethod=''
						this.addInfoForm.qualityCheckName=''
						this.addInfoForm.workerNumber=''
						this.addInfoForm.externalNumber=''
						this.addInfoForm.workPlace=''
						this.addInfoForm.contractorNumber=''
						this.addInfoForm.finishDate=''
						this.addInfoForm.erpnumber=''
						this.checkedCompanyId=null
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
					console.log('基本信息表单登记提交')
					console.log('addinfoform',this.addInfoForm)
					submitBasicInfo(this.addInfoForm).then((res) => {
						console.log('基本信息登记提交返回结果')
						console.log(res.data)
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
				console.log(x)
				this.selectInfoForm.checkDate = x.join(';')
				console.log(this.selectInfoForm.checkDate)
				console.log(this.selectInfoForm)
				// if(this.selectInfoForm.checkedCompanyCode == null || this.selectInfoForm.checkDate == '') {
				//     return this.$message.error('请同时选择公司以及审核日期')
				// }
				inquireBasicInfomation(this.selectInfoForm).then((res) => {
					console.log('查询基本信息登记表的信息')
					console.log(res.data)
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
				console.log('该表的基本信息')
				console.log(information)
				this.eidtInfoForm = information
				this.changeCompanyCodeToId(this.companyList,this.eidtInfoForm.checkedCompanyCode)
				this.checkedCompanyId=this.companyId
				//this.getCheckTableList()
				this.employeeList=this.employee.filter(item=>{
					return item.companyName==this.eidtInfoForm.checkedCompanyName
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
					console.log('删除基本信息登记表返回信息')
					console.log(res.data)
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
<<<<<<< HEAD
				const confirmResult = await this.$confirm('是否推送该表信息?', '提示', {
=======
				const confirmResult = await this.$confirm('推送该表后相关信息无法修改或删除！是否推送该表信息?', '提示', {
>>>>>>> 170940f... 质量模块检查表配置
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirmResult !== 'confirm') {
					return this.$message.info('已取消推送')
				}
				console.log(row)
				pushBasicInfomation(row.qualityCheckID).then((res) => {
					console.log('推送基本信息表返回信息')
					console.log(res.data)
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
					console.log('检查表信息', res.data)
					this.checkTableList = res.data
					console.log('获取的检查表信息', this.checkTableList)
					for (var i = 0; i < this.checkTableList.length; i++) {
						if (!this.isCopy(this.checkTableList[i].checkCategory, this.checkCategoryOptions)) {
							let item = {
								value: '',
								label: ''
							}
							item.value = item.label = this.checkTableList[i].checkCategory
							this.checkCategoryOptions.push(item)
						}
						if (!this.isCopy(this.checkTableList[i].checkBasis, this.checkBasisOptions)) {
							let item = {
								value: '',
								label: ''
							}
							item.value = item.label = this.checkTableList[i].checkBasis
							this.checkBasisOptions.push(item)
						}
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
<<<<<<< HEAD
			editInfoClick: function() {
=======
			editInfoClick: function(information) {
>>>>>>> 170940f... 质量模块检查表配置
				// 修改配置基本信息表
				// 编辑确认基本信息表
				let that = this
				console.log('编辑修改的基本信息表')
				console.log(that.eidtInfoForm)
<<<<<<< HEAD
=======
				if (this.eidtInfoForm.isPush === '已推送') {
					return this.$message.error('该登记表已推送，无法进行再次修改')
				}
>>>>>>> 170940f... 质量模块检查表配置
				editBasicInfomation(that.eidtInfoForm.qualityCheckID, that.eidtInfoForm).then((res) => {
					console.log('修改基本信息登记表返回的信息')
					console.log(res.data)
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
					console.log('公司表')
					console.log(this.companyList)
				}).catch(err => {
					this.$message.error(err.message)
				})

			},
			// 获取当前用户
			getCurrentUser: function() {
				console.log(GetCurrentUser())
				const currentUser = GetCurrentUser()
				// this.addInfoForm.checkPerson = currentUser.employeeName
				// this.addInfoForm.checkPersonID = currentUser.employeeId
			},
			//获得员工信息
			getEmploee: function() {
				GetEmployee().then(res => {
					//调用接口返回员工表，并对员工表进行筛选，只返回属于该行公司的员工信息
					this.employee = res.data
					console.log('员工表')
					console.log(this.employee)
				})

			},
			checkCompanyCodeChanged: function(val) {
				// 监听受审核单位发生变化时的操作
				console.log(val)
				if (val) {
					this.changeCompanyIdToName(this.companyList, this.checkedCompanyId)
					this.addInfoForm.checkedCompanyName = this.companyName
					this.addInfoForm.checkedCompanyCode = this.companyCode
					console.log('add checked companyname',this.addInfoForm.checkedCompanyName)
					this.employeeList = this.employee.filter((item) => {
						return item.companyName == this.addInfoForm.checkedCompanyName
					})
					console.log('filter emploee list',this.employeeList)
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
							console.log('公司nodeCode:' + this.companyCode)
							this.companyName = val[j].label
							console.log('公司名称:' + val[j].label)
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
							console.log('公司Id:' + this.companyId)
							this.companyName = val[j].label
							console.log('公司名称:' + val[j].label)
							break
						} else if (val[j].children) {
							this.changeCompanyCodeToId(val[j].children, companyCode)
						}
					}
				}
			},
			// 将检查表code改变为name
			changeCheckListCodeToName: function() {
				//    for(let j = 0; j < this.checkListCode.length; j++) {
				//         for(let i in this.checkTableList) {
				//             if(this.checkListCode[j] === this.checkTableList[i].checkListCode){
				//                 console.log(this.checkTableList[i].checkListName)
				//                 this.checkListName[j] = this.checkTableList[i].checkListName
				//                 console.log(this.checkListName)
				//             }
				//         } 
				//    }
				for (let i in this.checkTableList) {
					if (this.addInfoForm.checkListCode === this.checkTableList[i].checkListCode) {
						this.addInfoForm.checkListName = this.checkTableList[i].checkListName
						break
					}
				}
				//    this.addInfoForm.checkListName = this.checkListName.join(';')
				console.log(this.addInfoForm.checkListName)
			},
			responsePersonIDChange: function(val) {
				// 责任部门负责人改变触发的事件
				console.log('责任部门负责人ID:' + val)
				if (val) {
					for (let i in this.employee) {
						if (val === this.employee[i].employeeID) {
							this.addInfoForm.responsePersonName = this.employee[i].name
							break
						}
					}
				} else {
					this.addInfoForm.responsePersonName = ''
				}
			},
			responsiCompanyID: function(val) {
				// 监听责任部门id发生变化获得部门的名称
				console.log(val)
				if (val) {
					this.changeCompanyIdToName(this.companyList, this.responsiCompanyId)
					this.addInfoForm.responsiCompanyName = this.companyName
					this.addInfoForm.responsiCompanyCode = this.companyCode
					this.employeeArr = this.employee.filter((item) => {
						return item.companyName == this.addInfoForm.responsiCompanyName
					})
					console.log('筛选责任部门员工表')
					console.log(this.employeeArr)
				} else {
					this.addInfoForm.responsiCompanyName = ''
					this.companyCode = ''
				}
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
			// editCheckedCompanyIDChange: function (form) {
			//     let that = this
			//     that.changeCompanyCodeToId(that.companyList,form.checkedCompanyCode)
			//     that.editCheckedCompanyId = that.companyId
			//     that.editFilterCheckedGroup(form)
			// },
			// eidtResponsiCompanyIDChange: function (form) {
			//     let that = this
			//     that.changeCompanyCodeToId(that.companyList,form.responsiCompanyCode)
			//     that.eidtResponsiCompanyId = that.companyId
			//     that.editFilterReponseCompany(form)
			// },
			// editFilterCheckedGroup: function (form) {
			//     // 筛选编辑受审核部门
			//     let that = this
			//     that.changeCompanyIdToName(that.companyList, that.editCheckedCompanyId)
			//         form.checkedCompanyName = that.companyName
			//         form.checkedCompanyCode = that.companyCode
			//         that.editEmployeeList = that.employee.filter((item) => {
			//             return item.companyName == form.checkedCompanyName
			//         })
			//         const x = []
			//         const arr = that.editEmployeeList
			//         for(let i = 0; i < that.editEmployeeList.length; i++){
			//             var isRepeat = false
			//             for(let j = i+1; j < arr.length; j++) {
			//                 if(that.editEmployeeList[i].empGroup === arr[j].empGroup){
			//                     isRepeat = true
			//                     break
			//                 }

			//             } 
			//             if(isRepeat == false){
			//                 x.push(that.editEmployeeList[i])
			//             }

			//         }
			//         that.editEmployeeList = x
			//         console.log('编辑受审核单位得到的受审核部门')
			//         console.log(that.editEmployeeList)

			// },
			// editFilterReponseCompany: function (form) {
			//     let that = this
			//     that.changeCompanyIdToName(that.companyList, that.eidtResponsiCompanyId)
			//     form.responsiCompanyName = that.companyName
			//     form.responsiCompanyCode = that.companyCode
			//     that.employeeArray = that.employee.filter((item) => {
			//             return item.companyName == form.responsiCompanyName
			//     })
			//     console.log('筛选编辑责任部门员工表')
			//     console.log(that.employeeArray)
			// },
			editCheckedCompanyIdChanged: function (val) {
			    // 监听编辑受审核部门id变化
			    let that = this
			    console.log('编辑受审核单位id'+val)
				that.changeCompanyIdToName(that.companyList, that.checkedCompanyId)
				that.eidtInfoForm.checkedCompanyCode=that.companyCode
				that.eidtInfoForm.checkedCompanyName=that.companyName
				if(that.eidtInfoForm.checkedCompanyName){
					that.employeeList=that.employee.filter(item=>{
						return item.companyName==val
					})
				}
			    //that.editFilterCheckedGroup(that.editInfoForm)

			},
			// eidtResponsiCompanyIdChanged: function (val) {
			//     // 监听编辑责任部门id变化
			//     let that = this
			//     console.log('监听编辑责任部门id变化'+val)
			//     that.editFilterReponseCompany(that.editInfoForm)

			// },
			// checkListCodeChanged: function (val) {
			//     // 监听检查表发生变化
			//    console.log('选中的检查表信息')
			//    console.log(val)
			//    this.addInfoForm.checkListCode = val.join(';')
			//    console.log(this.addInfoForm.checkListCode)
			// },
			// 时间格式化
			formatDate: function(time) {
				const timer = time.getTime()
				console.log(timer)
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
						return item.checkCategory == this.addInfoForm.checkCategory && item.checkBasis == this.addInfoForm.checkBasis && item.checkMethod ==
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
						return item.checkCategory == this.addInfoForm.checkCategory && item.checkBasis == this.addInfoForm.checkBasis && item.checkMethod ==
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
						return item.checkCategory == this.eidtInfoForm.checkCategory && item.checkBasis == this.eidtInfoForm.checkBasis && item.checkMethod ==
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
						return item.checkCategory == this.eidtInfoForm.checkCategory && item.checkBasis == this.eidtInfoForm.checkBasis && item.checkMethod ==
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
						return item.checkCategory == this.eidtInfoForm.checkCategory && item.checkBasis == this.eidtInfoForm.checkBasis && item.checkMethod ==
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
			getEmploeeItem(employeeID,emploeeList){
				if(!emploeeList||!employeeID){
					return null
				}
				let temp=emploeeList.filter(item=>{
					return item.employeeID==employeeID
				})
				return temp[0].name
			},
			addCheckPerson:function(){
				this.addInfoForm.checkPerson=this.getEmploeeItem(this.addInfoForm.checkPersonID,this.employee)
			},
			addCheckedPerson:function(){
				this.addInfoForm.checkedPersonName=this.getEmploeeItem(this.addInfoForm.checkedPersonID,this.employee)
			},
			addGroupLeader:function(){
				this.addInfoForm.groupLeaderName=this.getEmploeeItem(this.addInfoForm.groupLeaderID,this.employee)
			},
			addProjectLeader:function(){
				this.addInfoForm.projectLeaderName=this.getEmploeeItem(this.addInfoForm.projectLeaderID,this.employee)
			},
			editCheckedPerson:function(){
				this.eidtInfoForm.checkedPersonName=this.getEmploeeItem(this.eidtInfoForm.checkedPersonID,this.employee)
			},
			editGroupLeader:function(){
				this.eidtInfoForm.groupLeaderName=this.getEmploeeItem(this.eidtInfoForm.groupLeaderID,this.employee)
			},
			editProjectLeader:function(){
				this.eidtInfoForm.projectLeaderName=this.getEmploeeItem(this.eidtInfoForm.projectLeaderID,this.employee)
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
			'addInfoForm.checkPersonID':'addCheckPerson',
			//新增计划表受审公司负责人事件监听
			'addInfoForm.checkedPersonID':'addCheckedPerson',
			//新增计划表受审室组负责人事件监听
			'addInfoForm.groupLeaderID':'addGroupLeader',
			//新增计划表项目组长事件监听
			'addInfoForm.projectLeaderID':'addProjectLeader',
			//编辑计划表受审公司负责人监听事件
			'eidtInfoForm.checkedPersonID':'editCheckedPerson',
			//编辑计划表受审室组负责人事件监听
			'eidtInfoForm.groupLeaderID':'editGroupLeader',
			//编辑计划表项目组长事件监听
			'eidtInfoForm.projectLeaderID':'editProjectLeader',
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
