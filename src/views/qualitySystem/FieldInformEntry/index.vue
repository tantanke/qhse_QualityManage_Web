<template>
	<div>
		<div class="page-title" style="width: 100%">审核实施</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :inline="true">
				<el-form-item label="受审单位:">
					<!-- -->
					<treeselect :multiple="false" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
					 :disable-branch-nodes="true" v-model="companyId"></treeselect>
				</el-form-item>
				<el-form-item label="审核日期:">
					<el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="select()" style="margin-right: 15px;">查询</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="openAddInfoDialog">补录</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="warning" icon="el-icon-download">推送</el-button>
				</el-form-item> -->
			</el-form>
			<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
				<el-table :border="true" row-key="qualityCheckID" :data="checkListData" stripe>
					<el-table-column type="expand" label="详情" width="50px">
						<template slot-scope="scope">
							<el-row>
								<el-col :span="8">
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
					<el-table-column type="index" label="序号" width="60" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="qualityCheckName" width="200" label="审核任务名称" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="checkCategory" label="审核类别" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="checkBasis" label="审核依据" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="checkMethod" label="审核方式" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="checkPerson" label="审核人员" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="checkDate" width="120" label="审核日期" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="progress" label="审核进度" width="100" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="finishDate" label="(整改/验证)完成时间" align="center" width="120"></el-table-column>
					<el-table-column label="操作" align="center" width="240" fixed="right">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" icon="el-icon-plus" @click="addInfo(scope.row)">基本信息录入</el-button>
							<el-button type="primary" size="mini" @click="audit(scope.row)" icon="el-icon-edit" v-if="scope.row.isPush==='已推送'&&scope.row.issued==='未下达'">审核</el-button>
							<el-button type="warning" size="mini" icon="el-icon-success" @click="audit(scope.row)" v-else>查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<el-dialog title="零星数据录入" :visible.sync="addLittleInfoDialog">
				<el-form :inline="true" :model="addLittleInform" label-width="110px" :label-position="right">
					<el-form-item label="审核任务名称">
						<el-input v-model="addLittleInform.qualityCheckName" style="width: 555px" placeholder="请输入审核任务名称"></el-input>
					</el-form-item>
					<el-form-item label="审核类别">
						<el-select v-model="addLittleInform.checkCategory" style="width: 100%" placeholder="请选择审核类别">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkCategoryOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核依据">
						<el-select v-model="addLittleInform.checkBasis" style="width: 100%" placeholder="请选择审核依据">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkBasisOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核方式">
						<el-select v-model="addLittleInform.checkMethod" style="width: 100%" placeholder="请选择审核方式">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in checkMethodOptions" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核要素名">
						<el-input style="width: 100%"></el-input>
					</el-form-item>
					<el-form-item label="审核日期">
						<el-date-picker v-model="addLittleInform.checkDate" style="width: 100%" placeholder="请选择审核日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="审核人员">
						<el-select v-model="addLittleInform.checkPersonID" style="width: 100%" placeholder="请选择审核人员">
							<el-option :label="item.name+'('+item.companyName+')'" :value="item.employeeID" v-for="(item,index) in employee" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="受审单位">
						<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择受审单位" style="min-width: 230px;max-width:560px ; width:fit-content "
							 :options="companyList" v-model="checkedCompanyId"></treeselect>
						</el-form-item>
					</el-form-item>
					<el-form-item label="受审单位负责人">
						<el-select v-model="addLittleInform.checkedPersonID" style="width: 100%" placeholder="请选择单位负责人">
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="受审核室组">
						<el-input v-model="addLittleInform.group" style="width: 100%" placeholder="请输入受审室组"></el-input>
					</el-form-item>
					<el-form-item label="室组负责人">
						<el-select v-model="addLittleInform.groupLeaderID" style="width: 100%" placeholder="请选择室组负责人">
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="作业项目名称">
						<el-input v-model="addLittleInform.projectName" style="width: 100%" placeholder="请输入作业项目名称"></el-input>
					</el-form-item>
					<el-form-item label="项目组长">
						<el-select v-model="addLittleInform.projectLeaderID" style="width: 100%" placeholder="请选择项目组长">
							<el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeList" :key="index">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addLittleInfoDialog = false">取 消</el-button>
					<el-button type="primary" @click="addInfoClick">提 交</el-button>
				</span>
			</el-dialog>
			<el-dialog title="基本信息录入" :visible.sync="addInfoDialog" :close-on-click-modal="false">
				<el-form :inline="true" :model="editInfoForm" label-width="100px" label-position="right">
					<el-form-item label="检测项目">
						<el-input clearable v-model="editInfoForm.checkProject" width="100%" placeholder="请输入检测项目"></el-input>
					</el-form-item>
					<el-form-item label="检测标准">
						<el-input clearable v-model="editInfoForm.execStd" width="100%" placeholder="请输入检测标准"></el-input>
					</el-form-item>
					<el-form-item label="业主">
						<el-input clearable v-model="editInfoForm.owner" width="100%" placeholder="请输入业主"></el-input>
					</el-form-item>
					<el-form-item label="承包商">
						<el-input clearable v-model="editInfoForm.contractor" width="100%" placeholder="请输入承包商"></el-input>
					</el-form-item>
					<el-form-item label="作业地点">
						<el-input clearable v-model="editInfoForm.workPlace" width="100%" placeholder="请输入作业地点"></el-input>
					</el-form-item>
					<br />
					<el-form-item label="作业人数">
						<el-input-number v-model="editInfoForm.workerNumber" width="100%" :min='0'></el-input-number>
					</el-form-item>&nbsp;
					<el-form-item label="ERP员工数量">
						<el-input-number v-model="editInfoForm.erpnumber" width="100%" :min='0'></el-input-number>
					</el-form-item>
					<el-form-item label="外聘员工数量">
						<el-input-number v-model="editInfoForm.externalNumber" width="100%" :min='0'></el-input-number>
					</el-form-item>&nbsp;
					<el-form-item label="承包商人数">
						<el-input-number v-model="editInfoForm.contractorNumber" width="100%" :min='0'></el-input-number>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button icon="el-icon-refresh-left" @click="addInfoDialog = false">取 消</el-button>
					<el-button icon="el-icon-check" type="primary" @click="addBeasedInfo">保 存</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		getCompany,
		queryTableByYearAndComAndPush,
		queryCheckTreeByID,
		queryAllTable,
		addQualityCheck,
		updateQualityCheck
	} from "../../../services/qualitySystem/FieldInformEntry.js"
	import {
		GetEmployee
	} from "../../../services/filePropagation.js"
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser'
	import {
		getCheckList,
	} from "../../../services/qualitySystem/basicInfo"
	const DefaultQuery = {}
	export default {
		data() {
			return {
				checkListData: [],
				loading: false,
				addInfoDialog: false,
				addLittleInfoDialog: false,
				employeeList: [],
				employee:[],
				employeeArr: [],
				companyList: [],
				dateRange: [],
				companyName: '',
				companyId: null,
				editInfoForm: {},
				companyCode: '',
				nature: '',
				checkedCompanyId:null,
				//审核类别，审核依据，审核方式筛选数组
				checkCategoryOptions:[
					{
						value:'内审',
						label:'内审'
					},
					{
						value:'外审',
						label:'外审'
					},
					{
						value:'管理评审',
						label:'管理评审'
					}
				],
				checkBasisOptions:[
					{
						value:'CNAS',
						label:'CNAS'
					},
					{
						value:'ISO-9000',
						label:'ISO-9000'
					},
					{
						value:'API-Q2',
						label:'API-Q2'
					},
					{
						value:'CMA',
						label:'CMA'
					},
					{
						value:'检验机构',
						label:'检验机构'
					},
					{
						value:'特种设备',
						label:'特种设备'
					}
				],
				checkMethodOptions:[
					{
						value:'现场审核',
						label:'现场审核'
					},
					{
						value:'远程监控',
						label:'远程监控'
					},
					{
						value:'专项审核',
						label:'专项审核'
					},
					{
						value:'自改自查',
						label:'自改自查'
					},
					{
						value:'其他',
						label:'其他'
					}
				],
				//质量检查数据
				taskType: '',
				addLittleInform: {
					//审核任务名
					qualityCheckName: '',
					//检查表信息
					checkListCode:'',
					checkListName:'',
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
					//责任部门
					responsiCompanyName:'',
					responsiCompanyCode:'',
					responsePersonID:'',
					responsePersonName:'',
					//现场基本信息
					contractor:'',
					owner:'',
					checkProject:'',
					execStd:'',
					workPlace:'',
					contractorNumber:0,
					workerNumber:0,
					erpNumber:0,
					externalNumber:0
				},
				//问题类型选择项
				nonConformityNatureOptions: [{
						value: '一般不符合',
						label: '一般不符合'
					},
					{
						value: '严重不符合',
						label: '严重不符合'
					}
				],
				nonConformityTypeOptions: [{
						value: '体系性不符合',
						label: '体系性不符合'
					},
					{
						value: '实施性不符合',
						label: '实施性不符合'
					},
					{
						value: '效果性不符合',
						label: '效果性不符合'
					},
					{
						value: '法规性不符合',
						label: '法规性不符合'
					}
				],
				options: [{
						value: '建议项',
						label: '建议项'
					},
					{
						value: '观察项',
						label: '观察项'
					},
					{
						value: '问题项',
						label: '问题项'
					},
					{
						value: '不符合',
						label: '不符合'
					},
					{
						value: '违章项',
						label: '违章项'
					}
				],
				queryData: {
					checkedCompanyCode: '',
					checkDate: ''
				},
				addInfoForm: {
					taskType: '',
					checkListCode: '',
					checkListName: '',
					checkedCompanyName: '',
					checkedCompanyCode: '',
					group: '',
					workProject: '',
					responsiCompanyName: '',
					responsiCompanyCode: '',
					responsePersonID: '',
					responsePersonName: '',
					checkDate: '',
					checkPersonID: '',
					checkPerson: '',
					checkBasis: '',
					contractor: '',
					owner: '',
					projectName: '',
					checkProject: '',
					execStd: '',
				},
				formData: {
					checkListCode: '',
					qulity_CheckID: '',
					no: '',
					description: '',
					nature: '',
					nonConformityType: '',
					nonConformityNature: '',
					nonConformityStd: '',
					nonConformClauseNo: '',
					nonConformClauseContent: '',
					nonConformSource: '',
					nonConformCorrect: '',
					nonConformCorrectMeasure: '',
					nonConformCorrectMeasureVerify: '',
					punishmentBasis: '',
					violationClause: '',
					violationClauseContent: '',
					violationDeduction: '',
					violationScore: '',
					illegalPerson: '',
					illegalPersonID: '',
					post: '',
					postType: '',
					employmentProperty: '',
					workingYears: '',
					education: '',
					reformDate: '',
					reformLimit: '',
					isPush: '',
					problemAttach: '',
					problemPic: '',
					correctAttach: '',
					correctPic: ''
				}
			}
		},

		mounted() {
			this.getCompany()
			this.GetEmployee()
			this.getCheckTableList()
			this.select()
		},
		watch:{
			'addLittleInform.checkPersonID':'checkPersonID',
			'addLittleInform.checkedPersonID':'checkedPersonID',
			'addLittleInform.groupLeaderID':'groupLeaderID',
			'addLittleInform.projectLeaderID':'projectLeaderID',
			checkedCompanyId(){
				if(this.checkedCompanyId){
					this.changeCompanyIdTocompanyName(this.companyList,this.checkedCompanyId)
					this.addLittleInform.checkedCompanyCode=this.companyCode
					this.addLittleInform.checkedCompanyName=this.companyName
					console.log('employee',this.employee)
					this.employeeList=this.employee.filter(item=>{
						return item.companyName==this.companyName
					})
				}
			}
		},
		methods: {
			initData(options) {
				switch (options) {
					case 'littleInfo':
						//审核任务名
						this.addLittleInform.qualityCheckName = ''
						//审核类别
						this.addLittleInform.checkCategory = ''
						//审核依据
						this.addLittleInform.checkBasis = ''
						//审核方式
						this.addLittleInform.checkMethod = ''
						// 检查表code
						this.addLittleInform.checkListCode = ''
						// 检查表名称
						this.addLittleInform.checkListName = ''
						// 受审核单位
						this.addLittleInform.checkedCompanyName = ''
						// 受审核单位ID
						this.addLittleInform.checkedCompanyCode = null
						//受审单位负责人
						this.addLittleInform.checkedPersonName = ''
						this.addLittleInform.checkedPersonID = ''
						// 受审核室组
						this.addLittleInform.group = ''
						//室组负责人
						this.addLittleInform.groupLeaderName = ''
						this.addLittleInform.groupLeaderID = ''
						// 审核日期
						this.addLittleInform.checkDate = ''
						this.addLittleInform.checkPersonID =this.GetCurrentUser().employeeId
						// 审核人员姓名
						this.addLittleInform.checkPerson = this.GetCurrentUser().employeeName
						// 项目组名称
						this.addLittleInform.projectName = ''
						//项目组长
						this.addLittleInform.projectLeaderName = ''
						this.addLittleInform.projectLeaderID = ''
						break
					case 'impleInfo':
						//承包商
						this.editInfoForm.contractor=''
						//承包商数量
						this.editInfoForm.contractorNumber=''
						//作业人数
						this.editInfoForm.workerNumber=''
						//业主
						this.editInfoForm.owner=''
						//检测项目
						this.editInfoForm.checkProject=''
						//检测标准
						this.editInfoForm.execStd=''
						//外聘员工数量
						this.editInfoForm.externalNumber=''
						//erp员工数量
						this.editInfoForm.erpNumber=''
						//工作地点
						this.editInfoForm.workPlace=''
						break
					default:
						break
				}
			},
			//审核人员监听事件
			checkPersonID:function(){
				if(this.addLittleInform.checkPersonID){
					var temp=this.employee.filter(item=>{
						return item.employeeID==this.addLittleInform.checkPersonID
					})
					this.addLittleInform.checkPerson=temp[0].name
				}
			},
			//受审单位负责人监听事件
			checkedPersonID:function(){
				if(this.addLittleInform.checkedPersonID){
					var temp=this.employee.filter(item=>{
						return item.employeeID==this.addLittleInform.checkedPersonID
					})
					this.addLittleInform.checkedPersonName=temp[0].name
				}
			},
			//室组负责人监听事件
			groupLeaderID:function(){
				if(this.addLittleInform.groupLeaderID){
					var temp=this.employee.filter(item=>{
						return item.employeeID==this.addLittleInform.groupLeaderID
					})
					this.addLittleInform.groupLeaderName=temp[0].name
				}
			},
			//项目组长监听事件
			projectLeaderID:function(){
				if(this.addLittleInform.projectLeaderID){
					var temp=this.employee.filter(item=>{
						return item.employeeID==this.addLittleInform.projectLeaderID
					})
					this.addLittleInform.projectLeaderName=temp[0].name
				}
			},
			// 获取检查表
			getCheckTableList: function() {
				getCheckList().then((res) => {
					console.log('检查表信息', res.data)
					var checkTableList=[]
					checkTableList = res.data
					console.log('获取的检查表信息', checkTableList)
					for (var i = 0; i < checkTableList.length; i++) {
						if (!this.isCopy(checkTableList[i].checkCategory, this.checkCategoryOptions)) {
							let item = {
								value: '',
								label: ''
							}
							item.value = item.label = checkTableList[i].checkCategory
							this.checkCategoryOptions.push(item)
						}
						if (!this.isCopy(checkTableList[i].checkBasis, this.checkBasisOptions)) {
							let item = {
								value: '',
								label: ''
							}
							item.value = item.label = checkTableList[i].checkBasis
							this.checkBasisOptions.push(item)
						}
						if (!this.isCopy(checkTableList[i].checkMethod, this.checkMethodOptions)) {
							let item = {
								value: '',
								label: ''
							}
							item.value = item.label = checkTableList[i].checkMethod
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
			GetEmployee(){
				GetEmployee().then(res=>{
					this.employee=res.data
				}).catch(err=>{
					return this.$message.error(err.message)
				})
			},
			openAddInfoDialog() {
				this.initData('littleInfo')
				//this.addLittleInfoDialog = true
			},
			addInfoClick() {
				this.addLittleInfoDialog = false
				this.loading=true
				console.log('littledata',this.addLittleInform)
				addQualityCheck(this.addLittleInform).then(res=>{
					if(res.code=='1000'){
						this.$message.success('零星数据录入成功')
						this.select()
						this.loading=false
					}else{
						this.$message.success('零星数据录入失败')
						this.loading=false
					}
				}).catch(err=>{
					return this.$message.error(err.message)
				})
			},
			GetCurrentUser() {
				return GetCurrentUser();
			},
			addInfo(row) {
				this.editInfoForm = row
				console.log('editinfo', this.editInfoForm)
				this.addInfoDialog = true
			},
			addBeasedInfo() {
				this.addInfoDialog = false
				console.log('final', this.editInfoForm)
				updateQualityCheck(this.editInfoForm).then(res => {
					if (res.code == '1000') {
						this.$message.success('基本信息录入成功!')
						this.select()
					} else {
						this.$message.error('基本信息录入失败！')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			select() {
				//console.log('user', this.GetCurrentUser())
				// if (this.dateRange) {
				// 	if (this.companyId && this.dateRange.length > 0) {
				// 		this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
				// 		this.queryData.checkedCompanyCode = this.companyCode
				// 		this.queryData.checkDate = this.dateRange[0] + ';' + this.dateRange[1]
				// 		console.log(this.queryData)
				// 		queryTableByYearAndComAndPush(this.queryData).then(res=>{
				// 			console.log(res.data)
				// 			this.checkListData=res.data
				// 		}).catch(err=>{
				// 			this.$message.error(err.message)
				// 		})
				// 	}else{
				// 		this.$message.error('查询信息不完整')
				// 	}
				// } else {
				// 	this.$message.error('查询信息不完整')
				// }
				console.log('use',this.GetCurrentUser())
				queryAllTable().then(res => {
					console.log('all table list', res.data)
					let temp = res.data
					console.log('before filter', temp)
					if (this.companyId) {
						this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
						temp = temp.filter(item => {
							return item.checkedCompanyName == this.companyName
						})
					}

					if (this.dateRange && this.dateRange.length > 0) {
						temp = temp.filter(item => {
							return item.checkDate >= this.dateRange[0] && item.checkDate <= this.dateRange[1]
						})
					}
					for (var i = 0; i < temp.length - 1; i++) {
						for (var j = i + 1; j < temp.length; j++) {
							if (temp[i].checkDate <= temp[j].checkDate) {
								let tempItem = temp[i]
								temp[i] = temp[j]
								temp[j] = tempItem
							}
						}
					}
					console.log('after filter', temp)
					this.checkListData = temp
					this.checkListData = this.checkListData.filter(item => {
						return item.checkPersonID === this.GetCurrentUser().employeeId
					})
				})
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
			updateScore(row) {},

			beforeUpload(file) {
				console.log(file)
			},
			onSuccess() {
				console.log('上传成功')
			},
			onPreview(file) {},
			onRemove(file) {},
			onProgress(file) {},
			handleClick() {
				this.$refs.fileUpload.submit()
				this.checkDialog = false
			},
			audit(row) {
				console.log(row)
				this.$router.push({
					path: '/qualitySystem/FieldInformEntry/auditIndex',
					query: {
						qualityCheckData: row
					}
				})
			}
		}
	}
</script>

<style>
</style>
