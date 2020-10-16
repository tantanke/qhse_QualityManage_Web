<template>
	<div>
		<div class="page-title" style="width: 100%">
			检查项审核
		</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
				<el-table border :data="tableData" row-key="qualityCheckTableRecordID" :indent="30" max-height="560" @cell-click="handleCellClick"
				 highlight-current-row style="width: 100%" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
					<el-table-column prop="qualityCheckName" label="内容"></el-table-column>
					<el-table-column prop="schedule" label="进度" width="80" align="center"></el-table-column>
					<el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
					<el-table-column label="操作" width="150" align="center">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" icon="el-icon-download" @click="isComplete(scope.row)" v-if="scope.row.checkListCode.length===4&&isBelongToPart===true">审核提交</el-button>
							<el-button type="primary" size="mini" icon="el-icon-edit" @click="check(scope.row)" v-if="scope.row.children.length===0&&!scope.row.checkResult&&isBelongToPart===true">审核</el-button>
							<el-button type="success" size="mini" icon="el-icon-search" @click="check(scope.row)" v-if="scope.row.children.length===0&&scope.row.checkResult">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				
			</el-row>
			<el-dialog title="审核" :visible.sync="checkDialog" v-loading="dialogLoading" align="left" width="66%" @close="closeDialog">
				<el-form :model="formData" :rules="rules" :inline='true' label-width="100px" :label-postion="left">
					<el-form-item label="要素名:">
						<el-input v-model="chosenData.qualityCheckName" style="width: 200%;"></el-input>
					</el-form-item>
					<el-row>
						<el-form-item label="审核结果:" style="margin-right: 20px;">
							<el-switch v-model="value" active-color="#ff4949" inactive-color="#13ce66">
							</el-switch>&nbsp;{{result.checkResult}}
						</el-form-item>
						<el-row v-if="result.checkResult==='符合'">
							<el-col :span='20' v-if="isBelongToPart===true">
								<el-form-item label="审核证据">
									<el-upload :action="'/api/addQualityAttach'" :headers="headers" ref="fileUpload" :file-list="attach"
									 show-file-list multiple :on-success="onSuccessFile" :on-remove="onRemoveFile" :on-progress="onProgressFile"
									 auto-upload>
										<el-button type="success" icon="el-icon-upload">附件上传</el-button>
									</el-upload>
								</el-form-item>
								<el-form-item>
									<el-upload :action="'/api/addQualityAttach'" :headers="headers" show-file-list :file-list="pic" multiple
									 auto-upload :on-success="onSuccessPic" :on-remove="onRemovePic" :on-progress="onProgressPic" accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
									 list-type="picture">
										<el-button icon="el-icon-upload" type="primary">上传图片</el-button>
									</el-upload>
								</el-form-item>
							</el-col>
							<br>
							<el-form-item label="证据描述" prop="description">
								<el-input type="textarea" rows="3" style="width: 300%;" v-model="formData.description" placeholder="请输入附件描述"></el-input>
							</el-form-item>
						</el-row>
					</el-row>
					<el-form-item label="问题分类:" v-if="result.checkResult==='不符合'" prop="problemType">
						<el-select placeholder="请选择问题类别" v-model="formData.nature" clearable style="width: 120px;">
							<el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
						</el-select>
					</el-form-item>
					<el-row v-if="result.checkResult==='不符合'">
						<el-row v-if="formData.nature!==''">
							<el-col :span='24'>
								<el-form-item label="检查方式" prop="taskType">
									<el-input v-model="qualityCheckData.taskType" readonly></el-input>
								</el-form-item>
								<el-form-item label="受审单位" prop="checkedCompanyName">
									<el-input v-model="qualityCheckData.checkedCompanyName" readonly></el-input>
								</el-form-item>
								<el-form-item label="受审部门" prop="group">
									<el-input v-model="qualityCheckData.group" readonly></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label="责任部门" prop="responsiCompanyName">
									<el-input v-model="qualityCheckData.responsiCompanyName" readonly></el-input>
								</el-form-item>
								<el-form-item label="负责人" prop="responsePersonName">
									<el-input v-model="qualityCheckData.responsePersonName" readonly></el-input>
								</el-form-item>
								<el-form-item label="审核日期" prop="checkDate">
									<el-input v-model="qualityCheckData.checkDate" readonly></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-if="formData.nature==='建议项'">
							<el-form-item label="建议" prop="description">
								<el-input type="textarea" rows="autosize" style="width: 300%;" v-model="formData.description" placeholder="请输入建议"></el-input>
							</el-form-item>
						</el-row>
						<el-row v-if="formData.nature==='问题项'">
							<el-form-item label="问题描述" prop="description">
								<el-input type="textarea" rows="autosize" style="width: 300%;" v-model="formData.description" placeholder="请输入观察描述"></el-input>
							</el-form-item>
							<el-col :span='24'>
								<el-form-item label="条款名称">
									<!--  -->
									<el-input v-model="formData.nonConformityStd"></el-input>
								</el-form-item>
								<el-form-item label="条款编号">
									<!--  -->
									<el-input v-model="formData.nonConformClauseNo"></el-input>
								</el-form-item>
								<el-form-item label="条款内容">
									<!--  -->
									<el-input v-model="formData.nonConformClauseContent"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label="不符合原因">
									<el-input type="textarea" rows="autosize" style="width: 300%;" v-model="formData.nonConformSource"></el-input>
								</el-form-item>
								<br />
								<el-form-item label="整改时限">
									<el-date-picker v-model="formData.reformLimit" value-format="yyyy-MM-dd" format="yyyy年MM月dd日"></el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-if="formData.nature==='观察项'">
							<el-form-item label="观察描述" prop="description">
								<el-input type="textarea" rows="autosize" style="width: 300%;" v-model="formData.description"></el-input>
							</el-form-item>
							<br />
							<el-form-item label="不符合原因" prop="nonConformSource">
								<el-input type="textarea" rows="autosize" style="width: 300%;" v-model="formData.nonConformSource"></el-input>
							</el-form-item>
							<br />
							<el-form-item label="整改时限" prop="reformLimit">
								<el-date-picker v-model="formData.reformLimit" value-format="yyyy-MM-dd" format="yyyy年MM月dd日"></el-date-picker>
							</el-form-item>
						</el-row>
						<el-row v-if="formData.nature==='不符合'">
							<el-form-item label="不符合描述" prop="description">
								<el-input type="textarea" rows="autosize" style="width: 300%;" v-model="formData.description"></el-input>
							</el-form-item>
							<br />
							<el-form-item label="条款名称" prop="nonConformityStd">
								<el-input v-model="formData.nonConformityStd"></el-input>
							</el-form-item>
							<el-form-item label="条款编号" prop="nonConformClauseNo">
								<el-input v-model="formData.nonConformClauseNo"></el-input>
							</el-form-item>
							<el-form-item label="条款内容" prop="nonConformClauseContent">
								<el-input v-model="formData.nonConformClauseContent"></el-input>
							</el-form-item>
							<el-row>
								<el-form-item label="不符合性质" prop="nonConformityNature">
									<el-radio-group v-model="formData.nonConformityNature">
										<el-radio border label="一般不符合"></el-radio>
										<el-radio border label="严重不符合"></el-radio>
									</el-radio-group>
								</el-form-item>
							</el-row>
							<el-form-item label="不符合类型" prop="nonConformityType">
								<el-radio-group style="margin: 0rem;" v-model="formData.nonConformityType">
									<el-radio border label="体系性不符合"></el-radio>
									<el-radio border label="实施性不符合"></el-radio>
									<el-radio border label="效果性不符合"></el-radio>
									<el-radio border label="法规性不符合"></el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="不符合原因" prop="nonConformSource">
								<el-input type="textarea" rows="autosize" style="width: 300%;" v-model="formData.nonConformSource"></el-input>
							</el-form-item>
							<br />
							<el-form-item label="整改时限" prop="reformLimit">
								<el-date-picker v-model="formData.reformLimit" value-format="yyyy-MM-dd" format="yyyy年MM月dd日"></el-date-picker>
							</el-form-item>
						</el-row>
						<el-row v-if="formData.nature==='违章项'">
							<el-row>
								<el-form-item label="违章描述" prop="description">
									<el-input type="textarea" rows="autosize" style="width: 300%;" v-model="formData.description"></el-input>
								</el-form-item>
							</el-row>
							<el-col :span='24'>
								<el-form-item label="处罚依据" prop="punishmentBasis">
									<el-input v-model="formData.punishmentBasis"></el-input>
								</el-form-item>
								<el-form-item label="违章条款" prop="violationClause">
									<el-input v-model="formData.violationClause"></el-input>
								</el-form-item>
								<el-form-item label="条款内容" prop="violationClauseContent">
									<el-input v-model="formData.violationClauseContent"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='20'>
								<el-form-item label="违章扣款" prop="violationDeduction">
									<el-input v-model.number="formData.violationDeduction"></el-input>
								</el-form-item>
								<el-form-item label="违章扣分" prop="violationScore">
									<el-input v-model.number="formData.violationScore"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label="违章人员" prop="illegalPerson">
									<el-input v-model="formData.illegalPerson"></el-input>
								</el-form-item>
								<el-form-item label="岗位" prop="post">
									<el-input v-model="formData.post"></el-input>
								</el-form-item>
								<el-form-item label="岗位分类" prop="postType">
									<el-input v-model="formData.postType"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
								<el-form-item label="用工性质" prop="employmentProperty">
									<el-input v-model="formData.employmentProperty"></el-input>
								</el-form-item>
								<el-form-item label="工作年限" prop="workingYears">
									<el-input v-model.number="formData.workingYears"></el-input>
								</el-form-item>
								<el-form-item label="学历" prop="education">
									<el-input v-model="formData.education"></el-input>
								</el-form-item>
							</el-col>
							<el-form-item label="整改时限" prop="reformLimit">
								<el-date-picker v-model="formData.reformLimit" style="width:88%;" value-format="yyyy-MM-dd" format="yyyy年MM月dd日"></el-date-picker>
							</el-form-item>
						</el-row>
						<el-col :span='20' v-if="formData.nature!==''&&isBelongToPart===true">
							<el-form-item label="审核证据">
								<el-upload :action="'/api/addQualityAttach'" :headers="headers" show-file-list multiple
								 :on-success="onSuccessProbFile" :on-remove="onRemoveProbFile" :on-progress="onProgressFile" :auto-upload="true">
									<el-button icon="el-icon-upload" type="success">上传附件</el-button>
								</el-upload>
							</el-form-item>
							<el-form-item>
								<el-upload :action="'/api/addQualityAttach'" :headers="headers" show-file-list multiple
								 auto-upload :on-success="onSuccessProbPic" :on-remove="onRemoveProbPic" :on-progress="onProgressPic"
								 accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF" list-type="picture">
									<el-button icon="el-icon-upload" type="primary">上传图片</el-button>
								</el-upload>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<el-form :inline="true">
					<el-col :span='20'>
						<el-form-item label="附件浏览">
							<div v-for="(item, index) in attachList" :key="index">
								<a style="margin: 5px;" :href="item.url">
								{{item.fileName}}
							</a><el-button type="text" size="mini" @click="deleteAttach(item)" style="color: #000000;">
							<i class="el-icon-close"></i>
							</el-button>
							</div>
							
						</el-form-item>
						<el-form-item label="图片浏览">
							<div v-for="(item, index) in picList" :key="index" style="float: left;">
								<el-image style="width: 100px;height: 100px;margin: 5px;" :src="item.url" :preview-src-list="picList"></el-image>
								<el-button type="text" @click="deletePic(item,index)" size="mini" style="color: #000000; position: relative;top: -90px;left: -20px;">
									<i class="el-icon-close"></i>
								</el-button>
							</div>
						</el-form-item>
						<br />
					</el-col>
				</el-form>
				<br />
				<span slot="footer" class="dialog-footer">
					<el-button icon="el-icon-folder" type="success" @click="handleClick" v-if="chosenData.checked&&isBelongToPart===true">更新</el-button>
					<el-button icon="el-icon-folder" type="primary" @click="handleClick" v-else-if="isBelongToPart===true">保存</el-button>
					<el-button icon="el-icon-refresh-left" @click="checkDialog=false">关闭</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		queryCheckTreeByID,
		addCheckRecord,
		queryCheckRecord,
		deleteCheckRecord,
		//根据质量检查记录id更新对应记录数据，需要在路径中传入id，同时在请求体中传入修改的data
		updateCheckRecord,
		addQualityInformAndAttach,
		queryCheckRecordByCheckID,
		addQualityAttach,
		downloadQualityAttach,
		issuedTable,
		pictureDownload,
		//获取文件原文件名
		getOriginFileName
	} from "../../../services/qualitySystem/FieldInformEntry.js"
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser'
	const headers1 = {
		Accept: 'application/json',
		'Content-Type': 'aplication/json;charset=utf-8'
	}
	const newOptions = { ...headers1
	}
	let user = GetCurrentUser()
	if (user) {
		newOptions.headers = { ...newOptions.headers1,
			Authorization: user.token
		}
	}
	export default {
		data() {
			return {
				loading: false,
				dialogLoading:false,
				//用于判断当前主表是否属于该流程
				isBelongToPart:false,
				headers: newOptions.headers,
				path:'http://39.98.173.131:7000/resources/QualityCheck/',
				tableData: [],
				checkRecordList: [],
				checkDialog: false,
				//审核结果单选框，默认false，表示符合，true表示不符合
				value: false,
				attachList: [],
				picList: [],
				chosenData: {
					qualityCheckName: '',
					qualityCheckTableRecordID: '',
					qualityCheckRecordID: '',
					checked: '',
					checkResult: '',
					qualityCheckID:''
				},
				//获取route数据
				qualityCheckData: {},
				//问题类型选择项
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
				attach: [],
				pic: [],
				result: {
					//打开审核对话框时自动装填
					qualityCheckTableRecordID: '',
					//由操作员填入
					//附件描述
					description: '',
					//审查结果
					checkResult: '符合',
					//附件，图片路径数组
					attach: '',
					pic: ''
				},
				formData: {
					//审查结果为不符合时自动装填
					//质量检查id
					qulity_CheckID: '',
					//检查表code
					checkListCode: '',
					//检查方式
					nature: '',
					//编号
					no: '',
					//问题描述，前端展示的根据问题分类会有不同表述，但在后端统一使用一个字段
					description: '',
					//条款名称，编号，内容
					nonConformityStd: '',
					nonConformClauseNo: '',
					nonConformClauseContent: '',
					//不符合原因
					nonConformSource: '',
					//纠正（不符合）
					nonConformCorrect: '',
					//纠正措施
					nonConformCorrectMeasure: '',
					//跟踪验证
					nonConformCorrectMeasureVerify: '',
					//不符合性质
					nonConformityNature: '',
					//不符合分类
					nonConformityType: '',
					//问题描述，前端展示的根据问题分类会有不同表述，但在后端统一使用一个字段
					description: '',
					//处罚依据
					punishmentBasis: '',
					//违章条款
					violationClause: '',
					//违章内容
					violationClauseContent: '',
					//违章扣款
					violationDeduction: '',
					//违章扣分
					violationScore: '',
					//违章人员
					illegalPerson: '',
					illegalPersonID: '',
					//岗位
					post: '',
					postType: '',
					//用工性质
					employmentProperty: '',
					//工作年限
					workingYears: '',
					//学历
					education: '',
					reformDate: '',
					//整改时限
					reformLimit: '',
					//是否推送
					isPush: '',
					//问题附件
					problemAttach: '',
					//问题图片
					problemPic: '',
					//纠正附件
					correctAttach: '',
					//纠正图片
					correctPic: ''
				},
				//表单验证规则
				rules: {
					attach: [{
						required: 'true',
						message: '请上传审核结果支撑文件',
						trigger: 'blur'
					}],
					description: [{
						type: "string",
						required: 'true',
						message: '请输入附件描述',
						trigger: 'blur'
					}],
					nonConformityStd: [{
						required: 'true',
						message: '请输入问题条款',
						trigger: 'blur'
					}],
					nonConformClauseNo: [{
						required: 'true',
						message: '请输入问题条款编号',
						trigger: 'blur'
					}],
					nonConformClauseContent: [{
						required: 'true',
						message: '请输入问题条款内容',
						trigger: 'blur'
					}],
					//不符合原因
					nonConformSource: [{
						required: 'true',
						message: '请输入不符合原因',
						trigger: 'blur'
					}],
					//纠正措施
					nonConformCorrectMeasure: [{
						required: 'true',
						message: '请输入纠正措施',
						trigger: 'blur'
					}],
					//整改时限
					reformLimit: [{
						required: 'true',
						message: '请输入整改时限',
						trigger: 'blur'
					}],
					//跟踪验证
					nonConformCorrectMeasureVerify: [{
						required: 'true',
						message: '请输入跟踪验证内容',
						trigger: 'blur'
					}],
					nonConformityNature: [{
						required: 'true',
						message: '请输入不符合性质',
						trigger: 'blur'
					}],
					nonConformityType: [{
						required: 'true',
						message: '请输入不符合类型',
						trigger: 'blur'
					}],
					//处罚依据
					punishmentBasis: [{
						required: 'true',
						message: '请输入处罚依据',
						trigger: 'blur'
					}],
					//违章条款
					violationClause: [{
						required: 'true',
						message: '请输入违章条款',
						trigger: 'blur'
					}],
					//违章内容
					violationClauseContent: [{
						required: 'true',
						message: '请输入违章内容',
						trigger: 'blur'
					}],
					//违章扣款
					violationDeduction: [{
							required: 'true',
							message: '请输入违章扣款',
							trigger: 'blur'
						},
						{
							type: 'number',
							message: '扣款必须为数字'
						}
					],
					//违章扣分
					violationScore: [{
							required: 'true',
							message: '请输入不符合类型',
							trigger: 'blur'
						},
						{
							type: 'number',
							message: '扣分必须为数字'
						}
					],
					//违章人员
					illegalPerson: [{
						required: 'true',
						message: '请输入违章人员',
						trigger: 'blur'
					}],
					//岗位
					post: [{
						required: 'true',
						message: '请输入岗位名',
						trigger: 'blur'
					}],
					postType: [{
						required: 'true',
						message: '请输入岗位类型',
						trigger: 'blur'
					}],
					//用工性质
					employmentProperty: [{
						required: 'true',
						message: '请输入用工性质',
						trigger: 'blur'
					}],
					//工作年限
					workingYears: [{
							required: 'true',
							message: '请输入工作年限',
							trigger: 'blur'
						},
						{
							type: 'number',
							message: '工作年限必须为数字'
						}
					],
					//学历
					education: [{
						required: 'true',
						message: '请输入学历',
						trigger: 'blur'
					}],
				}
			}
		},
		watch: {
			value() {
				if (this.value == true) {
					this.result.checkResult = '不符合'
				} else {
					this.result.checkResult = '符合'
				}
			},
			nature() {
				if (this.formData.nature) {
					//this.initData()
				}
			}
		},
		mounted() {
			this.getParams()
		},
		methods: {
			deleteAttach(item){
				console.log('file before delete',this.attachList)
				this.$confirm('确认删除本文件吗？删除后请点击更新保存操作','提示',{
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(()=>{
					this.dialogLoading=true
					this.attachList.splice(this.attachList.indexOf(item.url),1)
					this.dialogLoading=false
					console.log('file after delete',this.attachList)
				})
			},
			//删除当前选中图片
			deletePic(item,index){
				this.$confirm('确认删除本张图片吗？删除后请点击更新保存操作','提示',{
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(()=>{
					this.dialogLoading=true
					console.log(item)
					let temp=item.url.split('/')
					var deleteName=temp[temp.length-1]
					console.log(temp[temp.length-1])
					this.picList.splice(this.picList.indexOf(deleteName),1)
					
					console.log('result',this.result)
					this.dialogLoading=false
				})
				
			},
			//查询当前用户
			currentUser() {
				return GetCurrentUser()
			},
			handleCellClick(row, cell, column) {
				if (row.children) {
					let els = column.getElementsByClassName("el-icon-arrow-right");
					if (els.length != 0) {
						els[0].click();
					}
				}
			},
			//打开审核对话框
			check(row) {
				this.dialogLoading=true
				console.log('row', row)
				//chosendata赋值
				this.chosenData.qualityCheckName = row.qualityCheckName
				this.chosenData.qualityCheckTableRecordID = row.qualityCheckTableRecordID
				this.chosenData.checked = row.checked
				this.chosenData.checkResult = row.checkResult
				this.chosenData.checkListCode=row.checkListCode
				this.chosenData.qualityCheckID=row.qualityCheckID
				this.chosenData.qualityCheckRecordID=''
				this.pic=[]
				this.attach=[]
				console.log('chosenData', this.chosenData)
				//选择打开哪一个对话框
				//有审核结果，将打开更新对话框
				if (row.checkResult=='不符合') {
					this.value = true
					this.result.checkResult = row.checkResult
					this.initFormdata(this.checkRecordList.filter(item => {
						return item.checkListCode == row.checkListCode && item.qulity_CheckID == this.qualityCheckData.qualityCheckID
					})[0])
					if(!this.formData.nature){
						this.getParams()
					}
				}else if(row.checkResult=='符合'){
					this.value = false
					this.result.checkResult = row.checkResult
					this.initFormdata()
					this.formData.description = row.description
					this.picList = this.splitPicPath(row.pic)
					console.log('piclist',this.picList)
					this.attachList = this.splitFilePath(row.attach)
					
				}else{
					this.value = false
					this.result.checkResult = '符合'
					this.initFormdata()
					
				}
				this.$nextTick(function(){
					this.checkDialog = true
					this.dialogLoading=false
				})
			},
			//页面跳转后获取数据
			getParams() {
				//开启页面加载
				this.loading = true
				this.initData('chosenData')				//路由信息中有数据
				if (this.qualityCheckData.qualityCheckID) {
					if(this.qualityCheckData.isPush=='已推送'&&this.qualityCheckData.issued=='未下达'){
						this.isBelongToPart=true
					}else{
						this.isBelongToPart=false
					}
					queryCheckTreeByID(this.qualityCheckData.qualityCheckID).then(res => {
						var temp=[]
						this.addCheckTreeElement(res.data, temp)
						this.tableData=temp
						this.countTree(this.tableData)
						console.log('tableData', this.tableData)
						this.loading = false
					}).catch(err => {
						this.$message.error(err.message)
					})
					queryCheckRecordByCheckID(this.qualityCheckData.qualityCheckID).then(res => {
						this.checkRecordList = res.data
						console.log('checkRecordList', this.checkRecordList)
						this.loading=false
					}).catch(err => {
						this.$message.error(err.message)
					})
				} 
				//路由信息中无数据
				else {
					//获取主页面传过来的数据
					this.qualityCheckData = this.$route.query.qualityCheckData
					console.log(this.qualityCheckData)
					//获取到了路由数据，重新调用该方法，执行另一个分支
					if (this.qualityCheckData.qualityCheckID) {
						this.getParams()
					} 
					//依旧没有路由数据，返回主页面
					else {
						this.$router.push({
							path: '/qualitySystem/FieldInformEntry/index'
						})
					}
				}
			},
			//增加检查表树的属性
			addCheckTreeElement(tree, temp) {
				for (var i = 0; i < tree.length; i++) {
					temp[i] = {
						attach: tree[i].attach,
						checkListCode: tree[i].checkListCode,
						checkResult: tree[i].checkResult,
						children: [],
						description: tree[i].description,
						pic: tree[i].pic,
						qualityCheckID: tree[i].qualityCheckID,
						qualityCheckName: tree[i].qualityCheckName,
						qualityCheckTableRecordID: tree[i].qualityCheckTableRecordID,
						//用于展示完成信息
						schedule: '',
						//用于储存是否已审核
						status: '',
						//用于统计是否已审核
						checked: 0,
						//用于统计某一节点的孩子节点数目
						childrenCount: 0
					}
					if (tree[i].children) {
						this.addCheckTreeElement(tree[i].children, temp[i].children)
					} else {
						if (tree[i].checkResult) {
							temp[i].status = '已审核'
						} else {
							temp[i].status = '未审核'
						}
					}
				}
			},
			//使用递归方法获取整颗树中全部的叶子节点，已审核节点数，并进行展示
			countTree(tree) {
				//定义一个临时数组变量，第一个用来存储叶子结点数目，第二个用来存储已审核节点数目
				var count = [0, 0]
				//循环遍历每一层
				for (var i = 0; i < tree.length; i++) {
					//当当前层在叶子结点时
					if (tree[i].children.length == 0) {
						//根据叶子节点审核结果状态决定已审核数目
						//当审核状态不为空时，已审核数目为1.否则为0
						if (tree[i].checkResult) {
							tree[i].checked = 1
						} else {
							tree[i].checked = 0
						}
						//叶子节点的数目为1
						tree[i].childrenCount = 1
						//将以上两个变量累加
						count[0] += tree[i].childrenCount
						count[1] += tree[i].checked
						//将两个变量以分数的形式进行组合，用于展示进度
						tree[i].schedule = tree[i].checked + '/' + tree[i].childrenCount
					}
					//当当前节点不是叶子结点时
					else {
						//定义一个临时变量用于存储从下一层递归中返回的数据
						var temp = this.countTree(tree[i].children)
						//将该层的节点的对应变量进行累加
						tree[i].childrenCount += temp[0]
						tree[i].checked += temp[1]
						//使用分数的形式进行进度展示
						tree[i].schedule = tree[i].checked + '/' + tree[i].childrenCount
						//将存储两个变量的临时变量数据更新
						count[0] += tree[i].childrenCount
						count[1] += tree[i].checked
					}
				}
				//向上层递归返回数据
				return count
			},
			//正在上传文件的响应事件
			onProgressFile() {
				this.$message.info('文件正在上传中，请稍候')
			},
			//删除文件的响应事件
			onRemoveFile(file, res) {
				this.attach.splice(this.attach.indexOf(file.response.data), 1)
				console.log('attach remove', this.attach)
				console.log('attach remove res', file)
			},
			//文件上传成功
			onSuccessFile(file, res) {
				this.attach.push(res.response.data)
				this.$message.success('文件上传成功')
			},
			//图片上传过程中
			onProgressPic() {
				this.$message.info('图片正在上传中，请稍候')
			},
			//图片上传成功
			onSuccessPic(file, res) {
				this.pic.push(res.response.data)
				this.$message.success('图片上传成功')
			},
			//删除图片
			onRemovePic(file) {
				this.pic.splice(this.result.pic.indexOf(file.response.data), 1)
			},
			//成功上传问题文件
			onSuccessProbFile(file, res) {
				console.log('prob success attach', res)
				this.attach.push(res.response.data)
				this.$message.success('文件上传成功')
			},
			//成功移除问题文件
			onRemoveProbFile(file) {
				this.attach.splice(this.attach.indexOf(file.response.data), 1)
			},
			//成功上传问题图片
			onSuccessProbPic(file, res) {
				console.log('prob success pic', res)
				this.pic.push(res.response.data)
				this.$message.success('图片上传成功')
			},
			//成功移除问题图片
			onRemoveProbPic(file) {
				this.pic.splice(this.pic.indexOf(file.response.data), 1)
			},
			//初始化数据方法
			initData(flag) {
				switch (flag) {
					//初始化chosendata，
					case 'chosenData':
						this.chosenData.checkListCode=''
						this.chosenData.qualityCheckID=''
						this.chosenData.qualityCheckRecordID = ''
						this.chosenData.qualityCheckName = ''
						this.chosenData.qualityCheckTableRecordID = ''
						this.chosenData.checked = ''
						this.chosenData.checkResult = ''
						this.attach = []
						this.pic = []
						break
					default:
						break
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
						let file={
							url:'',
							fileName:''
						}
						file.url=this.path+temp[i]	
						getOriginFileName(temp[i]).then(res=>{
							file.fileName=res.data
							targetArray.push(file)
						})
					}
					//返回url数组
					return targetArray
				}
			},
			splitPicPath(picPath){
				if(picPath){
					var targetArray=[]
					var temp=picPath.split(';')
					for(var i=0;i<temp.length;i++){
						let file={
							url:'',
							fileName:''
						} 
						file.url=this.path+temp[i]
						targetArray.push(file)
					}
					return targetArray
				}
			},
			//初始化formdata
			initFormdata(checkRecord) {
				/*
				谨慎使用初始化数据对象方法，在某一个方法f中调用该方法时，如果在f中同时调用了访问服务器的接口，
				有可能会使得该方法在调用接口前执行，从而使得存储在数据对象中的数据被初始化从而造成丢失，最后导致
				一些不可预知的错误
				*/
				console.log('initformdata use')
				//formdata装填主表id
				this.formData.qulity_CheckID = this.qualityCheckData.qualityCheckID
				//有传入参数时
				if (checkRecord) {
					console.log('checkRecord',checkRecord)
					//组装附件和图片展示用url数组
					this.picList = this.splitPicPath(checkRecord.problemPic)
					this.attachList = this.splitFilePath(checkRecord.problemAttach)
					//保存这一条记录的id
					this.chosenData.qualityCheckRecordID = checkRecord.qulity_CheckRecordID
					//去除多余属性
					delete checkRecord.qulity_CheckRecordID
					//赋值
					this.formData = checkRecord
					console.log('checkrecord->formdata',this.formData)
				}
				//无传入参数时，formdata所有值为空
				else {
					console.log('init')
					this.chosenData.qualityCheckRecordID =''
					this.formData.description = ''
					this.formData.nature = ''
					this.formData.nonConformityStd = ''
					this.formData.nonConformClauseNo = ''
					this.formData.nonConformClauseContent = ''
					//不符合原因
					this.formData.nonConformSource = ''
					//纠正（不符合）
					this.formData.nonConformCorrect = ''
					//纠正措施
					this.formData.nonConformCorrectMeasure = ''
					//跟踪验证
					this.formData.nonConformCorrectMeasureVerify = ''
					//不符合性质
					this.formData.nonConformityNature = ''
					//不符合分类
					this.formData.nonConformityType = ''
					//处罚依据
					this.formData.punishmentBasis = ''
					//违章条款
					this.formData.violationClause = ''
					//违章内容
					this.formData.violationClauseContent = ''
					//违章扣款
					this.formData.violationDeduction = ''
					//违章扣分
					this.formData.violationScore = ''
					//违章人员
					this.formData.illegalPerson = ''
					this.formData.illegalPersonID = ''
					//岗位
					this.formData.post = ''
					this.formData.postType = ''
					//用工性质
					this.formData.employmentProperty = ''
					//工作年限
					this.formData.workingYears = ''
					//学历
					this.formData.education = ''
					this.formData.reformDate = ''
					//整改时限
					this.formData.reformLimit = ''
					//是否推送
					this.formData.isPush = '未推送'
					//问题附件
					this.formData.problemAttach = ''
					//问题图片
					this.formData.problemPic = ''
					//纠正附件
					this.formData.correctAttach = ''
					//纠正图片
					this.formData.correctPic = ''
					//展示附件和图片数组
					this.picList = []
					this.attachList = []
					console.log('init->formdata',this.formData)
				}
			},
			//修改树的数据
			addQualityInformAndAttach(data) {
				if (!data) {
					this.$message.error('数据为空')
					return
				}
				console.log('addQualityInformAndAttach', data)
				this.loading = true
				addQualityInformAndAttach(data).then(res => {
					if (res.code == '1000') {
						this.$message.success('保存成功')
						this.loading = false
					} else {
						this.$message.error('保存失败')
						this.loading = false
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//增加质量检查记录
			addCheckRecord(data) {
				if (!data) {
					this.$message.error('数据为空')
					return
				}
				console.log('addCheckRecord', data)
				this.loading = true
				addCheckRecord(data).then(res => {
					if (res.code == '1000') {
						this.$message.success('问题项保存成功')
						this.loading = false
					} else {
						this.$message.error('保存失败')
						this.loading = false
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//点击审核或者更新按钮的响应事件
			handleClick() {
				this.formData.checkListCode=this.chosenData.checkListCode
				//完整性检查
				if (this.formData.reformLimit) {
					var nowDate = new Date().toISOString().substr(0, 10)
					if (this.formData.reformLimit <= nowDate) {
						this.$message.error('整改时限不能小于当前日期')
						this.formData.reformLimit = ''
						return
					}
				}
				if (this.formData.violationDeduction) {
					if (this.formData.violationDeduction < 0) {
						this.$message.error('违章扣款金额不能小于0')
						this.formData.violationDeduction = ''
						return
					}
				}
				if (this.formData.violationScore) {
					if (this.formData.violationScore < 0) {
						this.$message.error('违章扣分不能小于0分')
						this.formData.violationScore = ''
						return
					}
				}
				//关闭对话框，并开启页面加载
				
				this.result.qualityCheckTableRecordID = this.chosenData.qualityCheckTableRecordID
				console.log('result', this.result)
				console.log('formdata', this.formData)
				console.log('chosenData', this.chosenData)
				//已有审核结果，执行更新操作
				if (this.chosenData.checkResult) {
					//已有审核结果为“符合”
					if (this.chosenData.checkResult == '符合') {
						//新增的审核结果为“符合”，只执行更新树状表操作
						if (this.result.checkResult == '符合') {
							this.result.attach = this.combinePath(this.attach,this.attachList)
							this.result.pic = this.combinePath(this.pic,this.picList)
							this.result.description = this.formData.description
							this.addQualityInformAndAttach(this.result)
						}
						//新增审核结果为“不符合”，执行更新树状表操作，同时新增一条质量检查记录
						else {
							this.formData.problemAttach = this.combinePath(this.attach,this.attachList)
							this.formData.problemPic = this.combinePath(this.pic,this.picList)
							this.addQualityInformAndAttach(this.result)
							this.addCheckRecord(this.formData)
						}
					}
					//已有审核结果为“不符合”
					else {
						//新增审核结果为符合
						if (this.result.checkResult == '符合') {
							//删除原来的质量检查记录
							deleteCheckRecord(this.chosenData.qualityCheckRecordID).then(res => {
								if (res.code == '1000') {
									//更新树状表
									this.result.attach = this.combinePath(this.attach)
									this.result.pic = this.combinePath(this.pic)
									this.result.description = this.formData.description
									this.addQualityInformAndAttach(this.result)
								}
							}).catch(err => {
								this.$message.error(err.message)
							})
						}
						//新增审核结果为“不符合”
						else {
							//更新对应质量检查记录
							this.formData.problemAttach = this.combinePath(this.attach,this.attachList)
							this.formData.problemPic = this.combinePath(this.pic,this.picList)
							console.log('update chosendata',this.chosenData)
							console.log('update formdata',this.formData)
							updateCheckRecord(this.chosenData.qualityCheckRecordID, this.formData).then(res => {
								if (res.code == '1000') {
									this.$message.success('更新信息成功')
									this.getParams()
								}
							}).catch(err => {
								this.$message.error(err.message)
							})
						}
					}
				}
				//无已有审核结果
				else {
					//新增审核结果为“不符合”
					if (this.result.checkResult == '不符合') {
						//同时新增一条第二张表记录
						this.formData.problemAttach = this.combinePath(this.attach)
						this.formData.problemPic = this.combinePath(this.pic)
						this.addQualityInformAndAttach(this.result)
						this.addCheckRecord(this.formData)
					}
					//新增审核结果为“符合”
					else {
						//更新树状表
						this.result.description = this.formData.description
						this.result.attach = this.combinePath(this.attach)
						this.result.pic = this.combinePath(this.pic)
						this.addQualityInformAndAttach(this.result)
					}
				}
				//重新获取数据，刷新页面
				this.getParams()
				this.checkDialog = false

			},
			//检查现场信息是否录入完毕，用于推送整个表之前的检查
			isComplete(row) {
				//获取树状表的统计信息
				var count = this.checkTree(this.tableData)
				//未录入节点数目为0
				if (count[0] == 0) {
					//组装推送数据对象，由主表id，是否推送两个字段组成
					var data = {
						qualityCheckID: '',
						isPush: ''
					}
					//获取主表id
					data.qualityCheckID = this.qualityCheckData.qualityCheckID
					//不符合项和符合项数目之和等于总的节点数目
					if (count[1] + count[2] == this.tableData[0].childrenCount) {
						//不符合项数目为0
						if (count[1] == 0) {
							//是否推送字段装入“通过”
							data.isPush = '通过'
							//调用推送接口推送主表
							issuedTable(data).then(res => {
								if (res.code == '1000') {
									//推送完成，显示提示信息，并返回主页面
									this.$message.success('现场信息已录入完毕')
									this.$router.push({
										path: '/qualitySystem/FieldInformEntry/index'
									})
								} else {
									this.$message.error(res)
								}
							}).catch(err => {
								this.$message.error(err.message)
							})
						} 
						//表中存在不符合项
						else {
							//是否推送装入“下达”，并进行推送
							data.isPush = '下达'
							issuedTable(data).then(res => {
								if (res.code == '1000') {
									//推送完毕，显示提示信息，并返回主页面
									this.$message.success('现场信息已录入完毕，问题已下达至基层单位')
									this.$router.push({
										path: '/qualitySystem/FieldInformEntry/index'
									})
								} else {
									this.$message.error(res)
								}
							}).catch(err => {
								this.$message.error(err.message)
							})
						}
					}
					 //不符合项和符合项之和小于总结点数，表示未录入完毕，用于二次检查
					 //当count为[0,0,0]时，可以通过第一次检查，但是事实上树状表还未开始录入
					 else {
						this.$message.error('数据尚未录入完毕')
						return
					}
				}
				 //进行第一次检查，树状表中存在未录入项，表示未录入完毕
				 else {
					this.$message.error('数据尚未录入完毕')
					return
				}
			},
			//统计树状表中各个状态的节点数目，count数组中第一个变量表示未录入节点数目，
			//第二个变量表示不符合项节点数目，第三个变量表示符合项数目
			checkTree(tree) {
				var count = [0, 0, 0]
				for (var i = 0; i < tree.length; i++) {
					if (tree[i].children.length == 0) {
						if (tree[i].checkResult == null) {
							count[0]++
						} else if (tree[i].checkResult == '符合') {
							count[2]++
						} else {
							count[1]++
						}
					} else {
						var temp = this.checkTree(tree[i].children)
						count[0] += temp[0]
						count[1] += temp[1]
						count[2] += temp[2]
					}
				}
				return count
			},
			//将路径数组组装成字符串
			combinePath(pathArray,pathList) {
				var targetString = ''
				if(pathArray){
					for (var i = 0; i < pathArray.length; i++) {
						if (!targetString) {
							targetString = pathArray[i]
						} else {
							targetString = targetString + ';' + pathArray[i]
						}
					}
				}
				if(pathList){
					for(var i=0;i<pathList.length;i++){
						var temp=pathList[i].url.split('/')
						if(!targetString){
							targetString=temp[temp.length-1]
						}else{
							targetString=targetString+';'+temp[temp.length-1]
						}
					}
				}
				return targetString
			},
			queryCheckRecord(id) {
				queryCheckRecord(id).then(res => {
					console.log('record', res.data)
					this.initData(res.data)
				})
			},
		}
	}
</script>

<style>
</style>
