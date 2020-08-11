<template>
	<div>
		<div class="page-title" style="width:100%">审核要素管理</div>
		<div class="page-content">
			&nbsp;&nbsp;
			<el-row>
				<el-col :span="8">
					查询:<el-input placeholder="输入关键字查询" v-model="filterText" style="width:80%;margin-left:5px"></el-input>
				</el-col>
				<el-col :span="8" style="display:flex;">
					<el-button type="primary" icon="el-icon-search" @click="select()">查询</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="() => append({code:''})">新增节点</el-button>
					<el-button icon="el-icon-download" type="warning" @click="downloadChoice=true">导出文件</el-button>&nbsp;&nbsp;
					<el-upload ref="upload" :action="'/api/managesyselements_excel_upload'" :on-preview="handlePreview" :on-remove="handleRemove"
					 :on-success="handleSuccess" :file-list="fileList" :headers="{Authorization:currentUser.token}" :show-file-list="false"
					 accept=".excel, .xls, .xlsx">
						<el-button icon="el-icon-upload" type="success" @click="submitUpload">导入文件</el-button>
					</el-upload>
				</el-col>
				<el-col>
					<el-checkbox label="仅显示启用项" :true-label="0" :false-label="1" v-model="queryStatus" @change="getDate"></el-checkbox>
				</el-col>
			</el-row>&nbsp;&nbsp;
			<el-tree :data="selectedData" node-key="id" :props="defaultProps" :expand-on-click-node="false" ref="tree2"
			 :filter-node-method="filterNode">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<span>{{data.initialScore}}分</span>&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => append(data,node)" v-if="node.level!==5">
							<i class="el-icon-circle-plus"></i>
						</el-button>&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => onEdit(data,node)">
							<i>编辑</i>
						</el-button>&nbsp;&nbsp;
						<el-button type="text" size="mini" v-if="data.childNode.length === 0 && node.level === 5" @click="addQuestion(data)">
							<i>问题</i>
						</el-button>&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => onStopUse(data)">
							<i>{{data.status=='启用'?'停用':'启用'}}</i>
						</el-button>
					</span>
				</span>
			</el-tree>
			<el-dialog title="导出选择" :visible.sync="downloadChoice" width="30%" align="center">
				<el-form :inline='true'>
					<el-form-item>
						<el-button icon="el-icon-download" type="warning" @click="downloadAll()">导出全部项</el-button>&nbsp;&nbsp;
						<el-button icon="el-icon-download" type="warning" @click="downloadUse()">导出启用项</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelOneDialog" width="30%">
				<el-form :model="chosenData" align="left">
					<el-form-item label="主题">
						<el-input v-model="chosenData.name" style="width: 90%;"></el-input>
					</el-form-item>
					<el-form-item label="分数">
						<el-input v-model="chosenData.initialScore" readonly='true' style="width: 90%;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelOneDialog=false" icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;">取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelTwoDialog" width="30%">
				<el-form :model="chosenData">
					<el-form-item label="项目">
						<el-input v-model="chosenData.name" style="width: 90%;"></el-input>
					</el-form-item>
					<el-form-item label="分数">
						<el-input v-model="chosenData.initialScore" readonly='true' style="width: 90%;"></el-input>
					</el-form-item>
					<el-form-item label="内容">
						<el-input v-model="chosenData.content" style="width: 90%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelTwoDialog=false" icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;">取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelThreeDialog" width="40%">
				<el-form :model="chosenData" label-width="20%" :label-position="left">
					<el-form-item label="管理及运行要求">
						<el-input v-model="chosenData.name" style="width: 80%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
					<el-form-item label="分数">
						<el-input v-model="chosenData.initialScore" readonly='true' style="width: 80%;"></el-input>
					</el-form-item>
					<!-- <el-form-item label="依据或备注">
				    <el-input v-model="chosenData.basis"></el-input>
				  </el-form-item> -->
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelThreeDialog=false" icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;">取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelFourDialog" width="40%">
				<el-form :model="chosenData" label-width="20%" :label-position="left">
					<el-form-item label="量化说明">
						<el-input v-model="chosenData.name" style="width: 90%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
					<el-form-item label="分数">
						<el-input v-model="chosenData.initialScore" readonly='true' style="width: 90%;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelFourDialog=false" icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;">取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelFiveDialog" width="40%">
				<el-form :model="chosenData" label-width="20%" :label-position="left">
					<el-form-item label="量化项">
						<el-input v-model="chosenData.name" style="width: 90%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
					<el-form-item label="审核方式">
						<el-input v-model="chosenData.auditMode" style="width: 90%;"></el-input>
					</el-form-item>
					<el-form-item label="初始分数">
						<el-input v-model="chosenData.initialScore" style="width: 90%;"></el-input>
					</el-form-item>
					<el-form-item label="计算公式">
						<el-input v-model="chosenData.formula" style="width: 90%;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelFiveDialog=false" icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;">取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<!--新增事件节点分类弹窗-->
			<el-dialog title="新增检查项" :visible.sync="addEventdialogVisible1" width="40%">
				<el-form ref="addEventForm1" :model="addEventForm1" label-width="20%" :label-position="left">
					<el-form-item label="检查项" prop="categoryName">
						<el-input v-model="addEventForm1.name" style="width: 90%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addEventdialogVisible1=false">取 消</el-button>
					<el-button type="primary" @click="addEventFormSubmitBtn1()">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog title="新增检查项详情" :visible.sync="addEventdialogVisible2">
				<el-form ref="addEventForm2" :model="addEventForm2">
					<el-form-item label="检查项描述" prop="content">
						<el-input v-model="addEventForm2.categoryName"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addEventdialogVisible2=false">取 消</el-button>
					<el-button type="primary" @click="addEventFormSubmitBtn2(addEventForm2)">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="问题详情" :visible.sync="addQuestiondialogVisible" :close-on-click-modal='false'>
				<!--编辑问题数据 -->
				<el-dialog width="30%" title="编辑问题" :visible.sync="innerVisible" :close-on-click-modal='false' append-to-body>
					<el-input v-model="editValue" style='margin-bottom:20px' placeholder="请输入新的的问题描述"></el-input>
					<el-button type="primary" @click="submitedit">确定</el-button>
					<el-button type="danger" @click="innerVisible = false">取消</el-button>
				</el-dialog>
				<el-form :inline='true' :model="addquestionDiscription">
					<el-form-item>
						<el-button type="primary" @click="buttoncontrol = true" :disabled='buttoncontrol' plain>新增问题描述</el-button>
					</el-form-item>
					<el-form-item v-show="buttoncontrol">
						<el-input v-model="addquestionDiscription.description" placeholder="请输入问题"></el-input>
					</el-form-item>
					<el-form-item v-show="buttoncontrol">
						<el-button type="primary" @click="submitQuestion">确定</el-button>
						<el-button type="danger" @click="buttoncontrol = false">取消</el-button>
					</el-form-item>
				</el-form>
				<!--记录问题数据 -->
				<el-table v-loading="loading" :data="problemList" border style="width: 100%">
					<el-table-column prop="description" label="已有问题描述">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button icon="el-icon-edit" type="primary" size="mini" @click="editProblem(scope.row)">编辑</el-button>
							<el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteProblem(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="addQuestiondialogVisible=false">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser';
	import {
		querryQHSEproblemDiscription,
		updateQHSEElement,
		addQHSEproblemDiscription,
		deleteQHSEproblemDiscription,
		updateQHSEproblemDiscription,
		addQHSEElement,
		updateQHSEElementStatus,
		querryQhseElements
	} from '../../../services/qhse_QualityStandard'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import {
		GetCheckListTree
	} from '../../../services/hidden_danger_investigation/checkListTree'
	import {
		Createcheck_item,
		delete_tree,
		getcontent,
		Createcontent
	} from '../../../services/hidden_danger_investigation/checkListItem'
	import {
		querryQhseElement
	} from '../../../services/querryQhseElement'

	import ExportJsonExcel from "js-export-excel";
	import Level1dialog from './dialog/Level1Dialog';
	import Level2dialog from './dialog/Level2Dialog';
	import Level3dialog from './dialog/Level3Dialog';
	import Level4dialog from './dialog/Level4Dialog';
	import Level5dialog from './dialog/Level5Dialog';

	export default {
		data() {
			return {
				levelOneDialog: false,
				levelTwoDialog: false,
				levelThreeDialog: false,
				levelFourDialog: false,
				levelFiveDialog: false,
				buttoncontrol: false,
				innerVisible: false,
				downloadChoice: false,
				level: '',
				loading: false,
				selectedData: [],
				tableData: [],
				addEventForm1: {
					name: ''
				},
				addEventForm2: {
					categoryName: ''
				},
				addquestionDiscription: {
					qHSE_ManagerSysElementProblemDescription_ID: null,
					code: '',
					description: ''
				},
				editquestionDiscription: {
					qHSE_ManagerSysElementProblemDescription_ID: null,
					code: '',
					description: ''
				},
				editValue: '',
				editForm: {},
				problemCode: '',
				addEventdialogVisible1: false,
				addEventdialogVisible2: false,
				addQuestiondialogVisible: false,
				addNodeCode: '',
				filterText: '',
				fileList: [],
				treedata: [],
				defaultProps: {
					children: 'childNode',
					label: 'name'
				},
				checkListPojo: {
					checkListCode: ''
				},
				problemList: [],
				currentNodeData: '',
				queryStatus: 0,
				chosenData: {
					code: '',
					name: '',
					qhseManagerSysElementID: '',
					content: '',
					auditMode: '',
					initialScore: '',
					formula: '',
					totalCount: '',
					status: ''
				},
				downloadData: [],
				downloadDataItem: {
					code: '',
					name: '',
					content: '',
					auditMode: '',
					initialScore: '',
					formula: '',
					problemDescription: '',
					totalCount: '',
					status: ''
				},
				insertDate: {
					code: '',
					name: '',
					content: '',
					auditMode: '',
					initialScore: 0,
					formula: '',
					totalCount: '',
					status: '启用'
				},
				problemDescription: ''
			};
		},
		watch: {
			//实时监测搜索input输入框数据变化，并根据变化对tree进行筛选
			filterText(val) {
				this.$refs.tree2.filter(val)
			}
		},
		mounted() {
			this.getDate()
		},
		computed: {
			//获取当前用户
			currentUser() {
				return GetCurrentUser()
			}
		},
		methods: {
			//根据搜索框数据对tree进行关键字搜索
			filterNode(value, data) {
				if (!value) return this.tableData;
				return data.name.indexOf(value) !== -1;
			},
			//下载所有要素，启用和停用要素都下载
			downloadAll() {
				//初始化下载数据数组
				this.downloadData = []
				//调用接口，查询数据
				querryQhseElements(1).then(res => {
					if (res.code == '1000') {
						//将树形数据转换为table型数据
						this.parseTreeToTable(res.data)
						var option = {};
						//下载文件名
						option.fileName = "QHSE体系要素表";
						//设置数据来源和数据格式
						option.datas = [{
							sheetData: this.downloadData,
							sheetHeader: ["编码", "要素名称", "内容", "审核方式", "分数", "计算公式", "可能存在的问题", "总数", "状态"]
						}];
						//导出
						var toExcel = new ExportJsonExcel(option);
						toExcel.saveExcel();
					}
				})
				//关闭下载选项框
				this.downloadChoice = false
			},
			//仅下载启用的要素
			downloadUse() {
				//初始化下载数据数组
				this.downloadData = []
				//调用接口，查询数据
				querryQhseElements(0).then(res => {
					if (res.code == '1000') {
						//将树形数据转换为table型数据
						this.parseTreeToTable(res.data)
						var option = {};
						//下载文件名
						option.fileName = "QHSE体系启用要素表";
						//设置数据来源和数据格式
						option.datas = [{
							sheetData: this.downloadData,
							sheetHeader: ["编码", "要素名称", "内容", "审核方式", "分数", "计算公式", "可能存在的问题", "总数", "状态"]
						}];
						//导出数据
						var toExcel = new ExportJsonExcel(option);
						toExcel.saveExcel();
					}
				})
				//关闭下载选项框
				this.downloadChoice = false
			},
			//将树形数据转换为table型数据，递归实现
			parseTreeToTable(node) {
				//初始化下载数据项对象
				this.downloadDataItem = {}
				//遍历当前节点，装填数据
				for (var i = 0; i < node.length; i++) {
					//如果当前节点存在，装填数据
					if (node[i]) {
						this.downloadDataItem.code = node[i].code
						this.downloadDataItem.name = node[i].name
						this.downloadDataItem.content = node[i].content
						this.downloadDataItem.auditMode = node[i].auditMode
						this.downloadDataItem.initialScore = node[i].initialScore
						this.downloadDataItem.formula = node[i].formula
						this.downloadDataItem.problemDescription = node[i].problemDescription
						this.downloadDataItem.totalCount = node[i].totalCount
						this.downloadDataItem.status = node[i].status
						//将数据项对象装入下载数据数组，保存
						this.downloadData.push(this.downloadDataItem)
					}
					//递归装填子节点
					if (node[i].childNode) {
						this.parseTreeToTable(node[i].childNode)
					}
				}
			},
			//搜索树
			select() {
				//如果搜索框为空，则直接显示
				if (!this.filterText) {
					this.selectedData=this.tableData
				}
				//否则进行搜索
				else {
					this.filterNode(this.filterText, this.selectedData)
				}
			},
			//获取单位树
			getDate() {
				querryQhseElement({queryStatus: this.queryStatus}).then(res=> {
					this.tableData = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			beforeRemove(file) {
				return this.$confirm(`确定移除 ${file.name}？`);
			},
			handleSuccess(response) {
				console.log(response)
				this.$message.warning(response);
				this.getDate();
			},
			addFirst() {
				this.addNodeCode = '';
				this.addEventdialogVisible1 = true;
			},
			detail(checkListCode) {
				this.checkListPojo.checkListCode = checkListCode
				getcontent(this.checkListPojo).then((res) => {
					this.$alert(res.data.list, '检查项详情', {
						confirmButtonText: '确定',
					});
					console.log(res.data);
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			adddetail(checkListCode) {
				this.addNodeCode = checkListCode
				this.addEventdialogVisible2 = true;
			},
			//打开新增框
			append(val, val1) {
				//保存选中的节点的code，初始化要书名称框
				this.insertDate.code = val.code
				this.addEventForm1.name = ''
				//显示新增节点框
				this.addEventdialogVisible1 = true;
			},
			//打开编辑框
			onEdit(data, node) {
				//保存选中节点的数据
				this.saveChosenData(data)
				//保存当前节点的层级
				this.level = node.level;
				//根据层级选择显示的编辑框
				if (this.level == 1) this.levelOneDialog = true
				else if (this.level == 2) this.levelTwoDialog = true
				else if (this.level == 3) this.levelThreeDialog = true
				else if (this.level == 4) this.levelFourDialog = true
				else if (this.level == 5) this.levelFiveDialog = true
			},
			//保存选中节点的数据
			saveChosenData(data) {
				this.chosenData.qhseManagerSysElementID = data.id
				this.chosenData.name = data.name
				this.chosenData.code = data.code
				this.chosenData.auditMode = data.auditMode
				this.chosenData.initialScore = data.initialScore
				this.chosenData.content = data.content
				this.chosenData.status = data.status
				this.chosenData.totalCount = data.totalCount
				this.chosenData.formula = data.formula
			},
			//更新要素节点数据
			updateQHSEElement() {
				//调用接口编辑数据
				updateQHSEElement(this.chosenData).then(res => {
					if (res.code == '1000') {
						//调用搜索方法重新渲染界面
						this.select()
						this.$message.success('修改信息成功')
					} else {
						this.$message.error('修改信息失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
				//根据保存的层级信息关闭对应对话框
				if (this.level == 1) this.levelOneDialog = false
				else if (this.level == 2) this.levelTwoDialog = false
				else if (this.level == 3) this.levelThreeDialog = false
				else if (this.level == 4) this.levelFourDialog = false
				else if (this.level == 5) this.levelFiveDialog = false
			},
			remove(checkListCode) {
				this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.checkListPojo.checkListCode = checkListCode
					delete_tree(this.checkListPojo).then(() => {
						this.$message.success('删除成功')
						this.getDate()
					}, (err) => {
						this.$message.error(err.message)
					})
					this.getDate()
				}).catch(() => {})
			},
			//更改当前节点的启用状态
			onStopUse(val) {
				//点击后的状态更新
				val.status = val.status == '停用' ? '启用' : '停用';
				//调用接口传回数据
				updateQHSEElementStatus(val.id).then(res => {
					if (res.code == '1000') {
						//调用搜索方法重新渲染界面
						this.select()
						this.$message.success('更新状态成功')
					} else {
						this.$message.error('更新状态失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//新增节点
			addEventFormSubmitBtn1() {
				//对节点数据完整性进行检查
				if (!this.addEventForm1.name) {
					this.$message.error('数据不完整')
				} else {
					//组装数据
					this.insertDate.name = this.addEventForm1.name
					//调用接口新增数据
					addQHSEElement(this.insertDate).then(res => {
						if (res.code == '1000') {
							//调用搜索方法重新渲染界面
							this.select()
							this.$message.success('节点添加成功')

						} else {
							this.$message.error('节点添加失败')
						}
					}).catch(err => {
						this.$message.error(err.message)
					})
					//关闭新增节点框
					this.addEventdialogVisible1 = false
				}
			},
			addEventFormSubmitBtn2(formData) {
				let newContent = {
					"content": formData.categoryName,
					"checkListCode": this.addNodeCode
				};
				Createcontent(newContent).then(() => {
					this.$message.success('创建成功')
					this.addEventdialogVisible2 = false;
					this.getDate()
				}, (err) => {
					this.$message.error(err.message)
				})
			},
			// 数据获取
			getProblems(data) {
				let _this = this
				_this.loading = true
				_this.problemList = []
				querryQHSEproblemDiscription({
					code: data
				}).then(res => {
					console.log(res.data)
					res.data.forEach((item) => {
						let obj = {}
						obj.code = item.code
						obj.description = item.description
						obj.qHSE_ManagerSysElementProblemDescription_ID = item.qHSE_ManagerSysElementProblemDescription_ID
						_this.problemList.push(obj)
					})
					_this.loading = false
				}).catch(err => {
					this.$message.error(err)
					_this.loading = false
					_this.addQuestiondialogVisible = false
				})
			},
			// 弹出对话框
			addQuestion(data) {
				let _this = this
				_this.problemCode = data.code
				_this.getProblems(data.code)
				_this.addQuestiondialogVisible = true
			},
			// 添加问题描述
			submitQuestion() {
				let _this = this
				_this.addquestionDiscription.code = _this.problemCode
				if (_this.addquestionDiscription.description === '') {
					this.$message.warning('请输入具体问题！')
					return
				}
				addQHSEproblemDiscription(this.addquestionDiscription).then((res) => {
					if (res.code == '1000') {
						_this.$message.success('添加成功')
						_this.addquestionDiscription.description = ''
						_this.getProblems(_this.problemCode)
					} else {
						_this.$message.error('添加失败')
					}
				}).catch(err => {
					_this.$message.error(err)
				})
			},
			// 删除问题描述
			deleteProblem(data) {
				let form = {}
				let _this = this
				form.id = data.qHSE_ManagerSysElementProblemDescription_ID
				deleteQHSEproblemDiscription(form).then((res) => {
					if (res.code == '1000') {
						_this.$message.success('删除成功')
						_this.getProblems(_this.problemCode)
					} else {
						_this.$message.error('删除失败')
					}
				}).catch(err => {
					_this.$message.error(err)
				})
			},
			editProblem(data) {
				this.editForm = { ...data
				}
				this.innerVisible = true
				this.editValue = data.description
			},
			// 提交编辑问题
			submitedit() {
				let _this = this
				if (_this.editValue === '') {
					_this.$message.warning('请输入具体问题！')
					return
				}
				if (_this.editValue === _this.editForm.description) {
					_this.$message.warning('请不要与原问题一致！')
					return
				}
				_this.editForm.description = _this.editValue
				updateQHSEproblemDiscription(_this.editForm).then((res) => {
					if (res.code == '1000') {
						_this.$message.success('编辑成功')
						_this.getProblems(_this.problemCode)
					} else {
						_this.$message.error('编辑失败')
					}
				}).catch(err => {
					_this.$message.error(err)
				})
				_this.innerVisible = false
			}
		}
	};
</script>
<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}
</style>
