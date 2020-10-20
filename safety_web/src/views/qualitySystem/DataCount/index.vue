<template>
	<div>
		<div class="page-title" style="width: 100%">数据统计</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form inline>
				<el-form-item label="受审单位" style="margin-right: 20px;">
					<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px;" :options="companyList"
					 v-model="companyId"></treeselect>
				</el-form-item>
				<el-form-item label="审核日期">
					<el-date-picker type="daterange" v-model="dateRange" value-format="yyyy-MM-dd" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button icon="el-icon-search" type="primary" @click="select">查询</el-button>
					<el-button icon="el-icon-download" type="warning" @click="download">下载</el-button>
				</el-form-item>
			</el-form>
			<el-table border :data="checkRecordList" style="width: 100%" max-height="600" fixed>
				<el-table-column type="expand" fixed="left">
					<template slot-scope="prop">
						<el-form label-width="150px" :label-position="left" inline class="demo-table-expand">
							<div v-if="prop.row.checkResult==='不符合'">
								<div v-if="prop.row.nature==='不符合'">
									<el-form-item label="不符合类型">
										<span>{{prop.row.nonConformityType}}</span>
									</el-form-item>
									<el-form-item label="不符合性质" style="float: right;">
										<span>{{prop.row.nonConformityNature}}</span>
									</el-form-item>
									<el-form-item label="不符合原因">
										<span>{{prop.row.nonConformSource}}</span>
									</el-form-item>
									<el-form-item label="不符合条款">
										<span>{{prop.row.nonConformityStd}}</span>
									</el-form-item>
									<el-form-item label="不符合条款号">
										<span>{{prop.row.nonConformClauseNo}}</span>
									</el-form-item>
									<el-form-item label="不符合条款内容">
										<span>{{prop.row.nonConformClauseContent}}</span>
									</el-form-item>
								</div>
								<div v-if="prop.row.nature==='违章项'">
									<el-form-item label="处罚依据">
										<span>{{prop.row.punishmentBasis}}</span>
									</el-form-item>
									<el-form-item label="违章条款">
										<span>{{prop.row.violationClause}}</span>
									</el-form-item>
									<el-form-item label="违章条款内容">
										<span>{{prop.row.violationClause}}</span>
									</el-form-item>
									<el-form-item label="违章扣款">
										<span>{{prop.row.violationDeduction}}</span>
									</el-form-item>
									<el-form-item label="违章扣分">
										<span>{{prop.row.violationScore}}</span>
									</el-form-item>
									<el-form-item label="违章人员">
										<span>{{prop.row.illegalPerson}}</span>
									</el-form-item>
									<el-form-item label="岗位">
										<span>{{prop.row.post}}</span>
									</el-form-item>
									<el-form-item label="岗位分类">
										<span>{{prop.row.postType}}</span>
									</el-form-item>
									<el-form-item label="用工性质">
										<span>{{prop.row.employmentProperty}}</span>
									</el-form-item>
									<el-form-item label="工作年限">
										<span>{{prop.row.workingYears}}</span>
									</el-form-item>
									<el-form-item label="学历">
										<span>{{prop.row.education}}</span>
									</el-form-item>
								</div>
								<div>
									<el-form-item label="纠正">
										<span>{{prop.row.nonConformCorrect}}</span>
									</el-form-item>
									<el-form-item label="纠正措施">
										<span>{{prop.row.nonConformCorrectMeasure}}</span>
									</el-form-item>
									<el-form-item label="跟踪验证">
										<span>{{prop.row.nonConformCorrectMeasureVerify}}</span>
									</el-form-item>
									<el-form-item label="整改时限">
										<span>{{prop.row.reformLimit}}</span>
									</el-form-item>
									<el-form-item label="整改完成时间">
										<span>{{prop.row.reformDate}}</span>
									</el-form-item>
									<el-form-item label="问题附件">
										<div v-for="(item, index) in prop.row.problemAttach" :key="index">
											<a style="margin: 5px;" :href="item.url">
												{{item.fileName}}
											</a>
										</div>
									</el-form-item>
									<el-form-item label="纠正附件">
										<div v-for="(item, index) in prop.row.correctAttach" :key="index">
											<a style="margin: 5px;" :href="item.url">
												{{item.fileName}}
											</a>
										</div>
									</el-form-item>
									<el-form-item label="问题图片">
										<div v-for="(item, index) in prop.row.problemPic" :key="index">
											<el-image style="width: 100px;height: 100px;margin: 5px;" :src="item.url" :preview-src-list="prop.row.problemPic"></el-image>
										</div>
									</el-form-item>
									<el-form-item label="纠正图片">
										<div v-for="(item, index) in prop.row.correctPic" :key="index">
											<el-image style="width: 100px;height: 100px;margin: 5px;" :src="item.url" :preview-src-list="prop.row.correctPic"></el-image>
										</div>
									</el-form-item>
								</div>
							</div>
							<el-row v-if="prop.row.checkResult==='符合'">
								<el-form-item label="符合附件">
									<div v-for="(item, index) in prop.row.attach" :key="index">
										<a style="margin: 5px;" :href="item.url">
											{{item.fileName}}
										</a>
									</div>
								</el-form-item>
								<el-form-item label="符合图片">
									<div v-for="(item, index) in prop.row.pic" :key="index">
										<el-image style="width: 100px;height: 100px;margin: 5px;" :src="item.url" :preview-src-list="prop.row.pic"></el-image>
									</div>
								</el-form-item>
							</el-row>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column type="index" label="序号" fixed="left" width="60" align="center"></el-table-column>
				<el-table-column prop="checkListName" label="名称" fixed="left" width="200" align="center"></el-table-column>
				<el-table-column prop="taskType" label="检查类别" fixed="left"
				 width="100" align="center"
				 :filters="taskTypeFilter"
				 :filter-method="filterHandler"
				 ></el-table-column>
				<el-table-column prop="checkDate" label="审核日期" fixed="left" width="120" align="center"></el-table-column>
				<el-table-column prop="checkResult" label="审核结果"
				 fixed="left" align="center" width="100"
				 :filters="[{text:'符合',value:'符合'},{text:'不符合',value:'不符合'}]"
				 :filter-method="filterHandler"
				>
				</el-table-column>
				<el-table-column prop="resultDescription" label="结果描述" fixed="left" align="center" width="200"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="nature" label="问题分类"
				 align="center" width="100"
				 :filters="natureFilter"
				 :filter-method="filterHandler"
				 ></el-table-column>
				<el-table-column prop="problemDescription" label="问题描述" align="center" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkedCompanyName" label="受审单位" width="200" align="center"></el-table-column>
				<el-table-column prop="group" label="受审部门" align="center" width="200"></el-table-column>
				<el-table-column prop="responsiCompanyName" label="责任单位" align="center" width="200"></el-table-column>
				<el-table-column prop="responsePersonName" label="责任人" align="center" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkPerson" label="监督人员" align="center" width="100"></el-table-column>
				<el-table-column prop="contractor" label="承包商" align="center" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="owner" label="业主" align="center" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="projectName" label="项目组名称" align="center" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkProject" label="检测项目" align="center" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="execStd" label="执行标准" align="center" width="200" show-overflow-tooltip></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import {
		queryAllTable,
		queryQualityRecordList,
		queryCheckTreeByID,
		queryAllPassTable,
		GetCompany
	} from '../../../services/qualitySystem/dataCount.js'
	import {
		getOriginFileName
	} from '../../../services/qualitySystem/FieldInformEntry.js'
	import ExportJsonExcel from "js-export-excel";
	export default {
		data() {
			return {
				loading: false,
				dateRange: [],
				path: 'http://39.98.173.131:7000/resources/QualityCheck/',
				qualityCheckList: [],
				qualityRecordList: [],
				qualityCheckTree: [],
				checkRecordList: [],
				tableData: [],
				companyList: [],
				companyName: '',
				companyId: null,
				companyCode: '',
				taskType: '',
				checkResult: '',
				nature: '',
				natureFilter:[
					{
						text:'建议项',
						value:'建议项'
					},
					{
						text:'观察项',
						value:'观察项'
					},
					{
						text:'问题项',
						value:'问题项'
					},
					{
						text:'不符合',
						value:'不符合'
					},
					{
						text:'违章项',
						value:'违章项'
					}
				],
				taskTypeFilter:[{
						value: '内审',
						text: '内审'
					},
					{
						value: '外审',
						text: '外审'
					},
					{
						value: '管理评审',
						text: '管理评审'
					},
					{
						value: '顾客投诉',
						text: '顾客投诉'
					},
					{
						value: '监督',
						text: '监督'
					},
					{
						value: '远程监控',
						text: '远程监控'
					},
					{
						value: '其他',
						text: '其他'
					}
				],
				taskTypeOptions: [{
						value: '内审',
						label: '内审'
					},
					{
						value: '外审',
						label: '外审'
					},
					{
						value: '管理评审',
						label: '管理评审'
					},
					{
						value: '顾客投诉',
						label: '顾客投诉'
					},
					{
						value: '监督',
						label: '监督'
					},
					{
						value: '远程监控',
						label: '远程监控'
					},
					{
						value: '其他',
						label: '其他'
					}
				],
				checkResultOptions: [{
						value: '符合',
						label: '符合'
					},
					{
						value: '不符合',
						label: '不符合'
					}
				],
				natureOptions: [{
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

				]
			}
		},
		mounted() {
			//this.getData()
			this.queryAllPassTable()
			this.GetCompany()
		},
		methods: {
			getData() {
				this.queryAllTable()
			},
			GetCompany() {
				GetCompany().then(res => {
					this.companyList = res.data
				})
			},
			filterHandler(value, row, column) {
			        const property = column['property'];
			        return row[property] === value;
			},
			download() {
				var option={}
				option.fileName="质量专项检查记录统计表"
				option.datas=[{
					sheetData: this.checkRecordList,
					sheetFilter:['checkListName','taskType','checkDate','checkResult','resultDescription','nature','problemDescription','checkedCompanyName',
					'group','responsiCompanyName','responsePersonName','checkPerson','contractor','owner','projectName','checkProject',
					'execStd','nonConformityType','nonConformityNature','nonConformSource','nonConformityStd','nonConformClauseNo',
					'nonConformClauseContent','punishmentBasis','violationClause','violationClauseContent','violationDeduction',
					'violationScore','illegalPerson','post','postType','employmentProperty','workingYears','education','nonConformCorrect',
					'nonConformCorrectMeasure','nonConformCorrectMeasureVerify','reformLimit','reformDate'],
					sheetHeader:["检查项名称","检查类别","审核日期","审核结果","结果描述","问题分类","问题描述","受审单位","受审部门","责任单位",
					"责任人","监督人员","承包商","业主","项目组名称","检测项目","执行标准","不符合类型","不符合性质","不符合原因","不符合条款",
					"不符合条款号","不符合条款内容","处罚依据","违章条款","违章条款内容","违章扣款","违章扣分","违章人员","岗位","岗位分类",
					"用工性质","工作年限","学历","纠正","纠正措施","跟踪验证","整改时限","整改完成时间"]
				}]
				var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
			},
			queryAllPassTable() {
				queryAllPassTable().then(res => {
					console.log('queryAllPassTable', res.data)
					this.qualityCheckList = res.data
					if (this.qualityCheckList) {
						this.qualityRecordList = []
						this.qualityCheckTree = []
						for (var i = 0; i < this.qualityCheckList.length; i++) {
							this.queryQualityRecordList(this.qualityCheckList[i].qualityCheckID)
							this.queryCheckTreeByID(this.qualityCheckList[i].qualityCheckID)
						}
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			queryAllTable() {
				queryAllTable().then(res => {
					console.log(res.data)
					this.qualityCheckList = res.data
					if (this.qualityCheckList) {
						this.qualityRecordList = []
						this.qualityCheckTree = []
						for (var i = 0; i < this.qualityCheckList.length; i++) {
							this.queryQualityRecordList(this.qualityCheckList[i].qualityCheckID)
							this.queryCheckTreeByID(this.qualityCheckList[i].qualityCheckID)
						}
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			queryQualityRecordList(qualityCheckID) {
				if (qualityCheckID) {
					queryQualityRecordList(qualityCheckID).then(res => {
						this.qualityRecordList.push(res.data)
						console.log(this.qualityRecordList)
					}).catch(err => {
						this.$message.error(err.message)
					})
				} else {
					this.$message.error('参数不能为空')
					return
				}

			},
			queryCheckTreeByID(qualityCheckID) {
				if (qualityCheckID) {
					queryCheckTreeByID(qualityCheckID).then(res => {
						this.qualityCheckTree.push(res.data)
						console.log(this.qualityCheckTree)
					}).catch(err => {
						this.$message.error(err.message)
					})
				} else {
					this.$message.error('参数不能为空')
					return
				}
			},
			getCombineData() {
				this.checkRecordList = []
				for (var i = 0; i < this.qualityCheckList.length; i++) {
					this.combineData(this.qualityCheckList[i], this.qualityRecordList[i], this.qualityCheckTree[i])
				}
			},
			select() {
				this.loading = true
				this.getCombineData()
				if (this.taskType) {
					this.checkRecordList = this.checkRecordList.filter(item => {
						return item.taskType == this.taskType
					})
				}
				if (this.companyId) {
					this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
					this.checkRecordList = this.checkRecordList.filter(item => {
						return item.checkedCompanyName == this.companyName
					})
				}
				if (this.dateRange) {
					if (this.dateRange.length > 0) {
						this.checkRecordList = this.checkRecordList.filter(item => {
							return item.checkDate >= this.dateRange[0] && item.checkDate <= this.dateRange[1]
						})
					}
				}
				if (this.checkResult) {
					this.checkRecordList = this.checkRecordList.filter(item => {
						return item.checkResult == this.checkResult
					})
				}
				if (this.nature) {
					this.checkRecordList = this.checkRecordList.filter(item => {
						return item.nature == this.nature
					})
				}
				this.checkRecordList=this.sortData(this.checkRecordList)
				this.loading = false
			},
			sortData(data){
				if(data.length>0){
					for(var i=0;i<data.length-1;i++){
						for(var j=i+1;j<data.length;j++){
							if(data[i].checkDate<=data[j].checkDate){
								let temp=data[i]
								data[i]=data[j]
								data[j]=temp
							}
						}
					}
					return data
				}
			},
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
			combineData(qualityCheckList, qualityRecordList, qualityCheckTree) {
				for (var i = 0; i < qualityCheckTree.length; i++) {
					if (!qualityCheckTree[i].children) {
						var checkRecordItem = {
							checkListName: '',
							taskType: '',
							//任务类别/检查类别/检查方式
							//检查表名字，有多个中间用";"隔开
							checkedCompanyName: '',
							//受审核单位
							//受审核单位code
							group: '',
							//室组/受审核部门
							workProject: '',
							//作业项目
							responsiCompanyName: '',
							//责任单位/责任部门
							responsePersonName: '',
							//责任部门负责人姓名
							checkDate: '',
							//监督时间/审核日期，格式：yyyy-mm-dd
							checkPerson: '',
							//监督人员姓名
							checkBasis: '',
							//监督检查依据
							contractor: '',
							//承包商
							owner: '',
							//业主
							projectName: '',
							//项目组名称
							checkProject: '',
							//检测项目
							execStd: '',
							resultDescription: '',
							//问题描述\不符合事实描述
							nature: '',
							//问题性质\问题分类
							nonConformityType: '',
							//不符合类型
							nonConformityNature: '',
							//不符合性质
							nonConformityStd: '',
							//不符合标准\文件名称
							nonConformClauseNo: '',
							//不符合标准条款号
							nonConformClauseContent: '',
							//不符合标准条款内容
							nonConformSource: '',
							//不符合原因
							nonConformCorrect: '',
							//纠正（不符合）
							nonConformCorrectMeasure: '',
							//纠正措施（不符合）
							nonConformCorrectMeasureVerify: '',
							//纠正措施跟踪验证（不符合）
							punishmentBasis: '',
							//处罚依据
							//违章条款
							violationClause: '',
							violationClauseContent: '',
							//违章条款内容
							violationDeduction: '',
							//违章扣款
							violationScore: '',
							illegalPerson: '',
							post: '',
							postType: '',
							employmentProperty: '',
							workingYears: '',
							education: '',
							reformDate: '',
							//整改完成时间
							reformLimit: '',
							pic:[],
							attach:[],
							//整改时限
							problemAttach: [],
							//问题附件
							problemPic: [],
							//问题图片
							correctAttach: [],
							//纠正附件
							correctPic: [],
						}
						checkRecordItem.checkListName = qualityCheckTree[i].qualityCheckName
						checkRecordItem.checkResult = qualityCheckTree[i].checkResult
						checkRecordItem.resultDescription = qualityCheckTree[i].description
						checkRecordItem.attach =this.splitFilePath(qualityCheckTree[i].attach)
						checkRecordItem.pic = this.splitPicPath(qualityCheckTree[i].pic)
						checkRecordItem.taskType = qualityCheckList.taskType
						checkRecordItem.checkDate = qualityCheckList.checkDate
						checkRecordItem.checkedCompanyName = qualityCheckList.checkedCompanyName
						checkRecordItem.group = qualityCheckList.group
						checkRecordItem.responsiCompanyName = qualityCheckList.responsiCompanyName
						checkRecordItem.responsePersonName = qualityCheckList.responsePersonName
						checkRecordItem.checkPerson = qualityCheckList.checkPerson
						checkRecordItem.contractor = qualityCheckList.contractor
						checkRecordItem.owner = qualityCheckList.owner
						checkRecordItem.projectName = qualityCheckList.projectName
						checkRecordItem.checkProject = qualityCheckList.checkProject
						checkRecordItem.execStd = qualityCheckList.execStd
						var temp = qualityRecordList.filter(item => {
							return item.checkListCode == qualityCheckTree[i].checkListCode
						})[0]
						if (temp) {
							checkRecordItem.nature = temp.nature
							checkRecordItem.problemDescription = temp.description
							checkRecordItem.nonConformityType = temp.nonConformityType
							checkRecordItem.nonConformityNature = temp.nonConformityNature
							checkRecordItem.nonConformityStd = temp.nonConformityStd
							checkRecordItem.nonConformClauseNo = temp.nonConformClauseNo
							checkRecordItem.nonConformClauseContent = temp.nonConformClauseContent
							checkRecordItem.nonConformSource = temp.nonConformSource
							checkRecordItem.nonConformCorrect = temp.nonConformCorrect
							checkRecordItem.nonConformCorrectMeasure = temp.nonConformCorrectMeasure
							checkRecordItem.nonConformCorrectMeasureVerify = temp.nonConformCorrectMeasureVerify
							checkRecordItem.punishmentBasis = temp.punishmentBasis
							checkRecordItem.violationClause = temp.violationClause
							checkRecordItem.violationClauseContent = temp.violationClauseContent
							checkRecordItem.violationDeduction = temp.violationDeduction
							checkRecordItem.violationScore = temp.violationScore
							checkRecordItem.illegalPerson = temp.illegalPerson
							checkRecordItem.post = temp.post
							checkRecordItem.postType = temp.postType
							checkRecordItem.employmentProperty = temp.employmentProperty
							checkRecordItem.workingYears = temp.workingYears
							checkRecordItem.education = temp.education
							checkRecordItem.reformDate = temp.reformDate
							checkRecordItem.reformLimit = temp.reformLimit
							checkRecordItem.problemAttach = this.splitFilePath(temp.problemAttach)
							checkRecordItem.problemPic = this.splitPicPath(temp.problemPic)
							checkRecordItem.correctAttach = this.splitFilePath(temp.correctAttach)
							checkRecordItem.correctPic =this.splitPicPath(temp.correctPic)
						}
						this.checkRecordList.push(checkRecordItem)
					} else {
						this.combineData(qualityCheckList, qualityRecordList, qualityCheckTree[i].children)
					}
				}
			},
			//切割字符串，并组装url
			splitFilePath(pathString) {
				if (pathString) {
					//定义一个空数组用于保存url
					var targetArray = []
					//切割传入的字符串
					var temp = pathString.split(';')
					//遍历数组，组装url
					for (var i = 0; i < temp.length; i++) {
						let file = {
							url: '',
							fileName: ''
						}
						file.url = this.path + temp[i]
						getOriginFileName(temp[i]).then(res => {
							file.fileName = res.data
							targetArray.push(file)
						})
					}
					//返回url数组
					return targetArray
				}
			},
			splitPicPath(picPath) {
				if (picPath) {
					var targetArray = []
					var temp = picPath.split(';')
					for (var i = 0; i < temp.length; i++) {
						let file = {
							url: '',
							fileName: ''
						}
						file.url = this.path + temp[i]
						targetArray.push(file)
					}
					return targetArray
				}
			}
		}

	}
</script>

<style>
	.demo-table-expand {
		font-size: 0;
		width: 60%;
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
</style>
