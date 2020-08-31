<template>
	<div>
		<div class="page-title" style="width:100%">审核要素管理</div>
		<div class="page-content" style="width: fit-content;min-width: 100%;" v-loading="loading">
			<el-form :inline='true'>
				<el-form-item label="查询:">
					<el-input placeholder="输入关键字查询" v-model="filterText" style="width:300px;"></el-input>
				</el-form-item>
				<el-form-item label="启用状态:">
					<el-select placeholder="请选择启用状态" v-model="filterStatus" clearable='true'>
						<el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="select()" style="margin-right: 15px;">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-plus" @click="() => append({code:''})">新增主题</el-button>
				</el-form-item>
				<el-form-item>
					<el-upload ref="upload" :action="'/api/managesyselements_excel_upload'" :on-preview="handlePreview" :on-remove="handleRemove"
					 :on-success="handleSuccess" :file-list="fileList" :headers="{Authorization:currentUser.token}" :show-file-list="false"
					accept=".excel, .xls, .xlsx" :on-progress="handleProgress">
						<el-button icon="el-icon-upload" type="success" @click="submitUpload">上传文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button icon="el-icon-download" type="warning" @click="downloadChoice=true">下载文件</el-button>
				</el-form-item>
			</el-form>
			<el-tree :data="selectedData" node-key="id" :props="defaultProps" :expand-on-click-node="false" ref="tree2"
			 :filter-node-method="filterNode" :default-expanded-keys="expandedList" @node-expand="nodeExpand" @node-collapse="nodeCollapse"
			v-loading="loading">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<span>{{data.initialScore}}分</span>&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => append(data,node)" v-if="node.level<6">
							<i class="el-icon-circle-plus"></i>
						</el-button>&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => onEdit(data,node)">
							<i>编辑</i>
						</el-button>&nbsp;&nbsp;
						<el-button type="text" size="mini" v-if="data.childNode.length === 0 && node.level === 6" @click="addQuestion(data)">
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
						<el-button icon="el-icon-download" type="warning" @click="downloadAll()">导出全部文件</el-button>&nbsp;&nbsp;
						<el-button icon="el-icon-download" type="warning" @click="downloadmodel()">导出模板文件</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelOneDialog" width="30%">
				<el-form :model="chosenData" align="left">
					<el-form-item label="主题">
						<el-input v-model="chosenData.name" style="width: 90%;"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelOneDialog=false" icon='el-icon-refresh-left'>取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelTwoDialog" width="30%">
				<el-form :model="chosenData">
					<el-form-item label="项目">
						<el-input v-model="chosenData.name" style="width: 90%;"></el-input>
					</el-form-item>
					<el-form-item label="内容">
						<el-input v-model="chosenData.content" style="width: 90%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelTwoDialog=false" icon='el-icon-refresh-left'>取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelThreeDialog" width="40%">
				<el-form :model="chosenData">
					<el-form-item label="内容">
						<el-input v-model="chosenData.content" style="width: 90%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelThreeDialog=false" icon='el-icon-refresh-left'>取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelFourDialog" width="40%">
				<el-form :model="chosenData" label-width="20%" :label-position="left">
					<el-form-item label="管理及运行要求">
						<el-input v-model="chosenData.name" style="width: 80%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelFourDialog=false" icon='el-icon-refresh-left'>取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelFiveDialog" width="40%">
				<el-form :model="chosenData" label-width="20%" :label-position="left">
					<el-form-item label="量化说明">
						<el-input v-model="chosenData.name" style="width: 90%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="levelFiveDialog=false" icon='el-icon-refresh-left'>取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<el-dialog title="编辑" :visible.sync="levelSixDialog" width="40%">
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
					<el-button @click="levelSixDialog=false" icon='el-icon-refresh-left'>取消</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="updateQHSEElement">保存</el-button>
				</div>
			</el-dialog>
			<!--新增事件节点分类弹窗-->
			<el-dialog title="新增检查项" :visible.sync="addEventdialogVisible" width="40%">
				<el-form ref="addEventForm" :model="addEventForm" label-width="20%" :label-position="left">
					<el-form-item label="检查项" prop="categoryName">
						<el-input v-model="addEventForm.name" style="width: 90%;" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addEventdialogVisible=false">取 消</el-button>
					<el-button type="primary" @click="addEventFormSubmitBtn()">确 定</el-button>
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
	import xlsx from 'xlsx'
	import {
		querryQhseElement
	} from '../../../services/querryQhseElement'
	import ExportJsonExcel from "js-export-excel";
	export default {
		data() {
			return {
				levelOneDialog: false,
				levelTwoDialog: false,
				levelThreeDialog: false,
				levelFourDialog: false,
				levelFiveDialog: false,
				levelSixDialog: false,
				buttoncontrol: false,
				innerVisible: false,
				downloadChoice: false,
				level: '',
				expandedList: [],
				loading: false,
				selectedData: [],
				tableData: [],
				addEventForm: {
					name: ''
				},
				options: [{
						value: '启用',
						label: '启用'
					},
					{
						value: '全部',
						label: '全部'
					}
				],
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
				addEventdialogVisible: false,
				addQuestiondialogVisible: false,
				addNodeCode: '',
				filterText: '',
				filterStatus: '启用',
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
				downloadDataItem: [],
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
				problemDescription: '',
				mergeTable: []
			};
		},
		watch: {
			//实时监测搜索input输入框数据变化，并根据变化对tree进行筛选
			filterText(val) {
				this.$refs.tree2.filter(val)
			},
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
			//展开要素树时将展开的节点进行记录
			nodeExpand(data) {
				this.expandedList.splice(this.expandedList.length, 1, data.id)
			},
			//折叠要素树时将折叠的节点从数组中删除
			nodeCollapse(data) {
				this.expandedList.splice(this.expandedList.indexOf(data.id), 1)
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
			//递归将tree型数据转换为table型数据，用于导出模板文件
			parseTreeToModleTable(node) {
				for (var i = 0; i < node.length; i++) {
					//删除返回过程之中已经录入的节点名
					while (this.downloadDataItem.length * 3 >= node[i].code.length) {
						this.downloadDataItem.pop()
					}
					//将访问到的当前节点名录入临时存储器
					this.downloadDataItem.push(node[i].name)
					//当访问到最后一级节点时将储存的节点树导出，从而得到一个一维的数据
					if (node[i].childNode.length == 0) {
						//将临时储存器中的数据序列化，并且保存到待合并的数组中
						this.downloadDataItem.push(node[i].problemDescription)
						this.downloadData.push(JSON.parse(JSON.stringify(this.downloadDataItem)))
						this.downloadDataItem.pop()
						this.downloadDataItem.pop()
					} else {
						//递归访问
						this.parseTreeToModleTable(node[i].childNode)
					}
				}
			},
			//搜索树
			select() {
				//如果搜索框为空，则直接显示
				this.getDate()
			},
			//获取要素树
			getDate() {
				//根据选择的状态构造参数查询要素
				if (this.filterStatus == '启用') {
					this.queryStatus = 0
				} else {
					this.queryStatus = 1
				}
				//调用接口传入状态参数查询要素
				querryQhseElement({
					queryStatus: this.queryStatus
				}).then(res => {
					this.selectedData = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			//构建合并数组
			mergeData() {
				let mergeTable = []
				//遍历下载数据的二维数组构建合并数组
				//第一层循环遍历六列数据
				for (var i = 0; i < 6; i++) {
					//构建一个合并开始单元格对象，包含开始行标，开始列标，并将
					var start = {
						r: null,
						c: null
					}
					start.r = 0
					start.c = i
					//第二层循环遍历一列的所有行
					for (var j = 1; j < this.downloadData.length; j++) {
						//处理空单元格，避免空单元格合并
						if (!this.downloadData[j][i] && !this.downloadData[j - 1][i]) {
							start.r = j
							start.c = i
						}
						//由于数据规则排列，所以只需要处理两个相邻处不相同时的情况
						else if (this.downloadData[j][i] != this.downloadData[j - 1][i]) {
							//构建合并结束单元格对象，包含结束行标，列标，并将不相同的前一个坐标写入
							var e = {
								r: null,
								c: null
							}
							e.r = j - 1
							e.c = i
							//将之前得到的开始单元格坐标重新拷贝，实现深拷贝
							var s = {
								r: null,
								c: null
							}
							s.r = start.r
							s.c = start.c
							//保存合并信息
							mergeTable.push({
								s,
								e
							})
							//将不相同的后一个坐标写入，开始下一次循环
							start.r = j
							start.c = i
						}
					}
				}
				return mergeTable
			},
			//下载模板文件
			downloadmodel() {
				//调用转换方法，得到table型数据
				this.parseTreeToModleTable(this.selectedData)
				if (this.downloadData.length > 0) {
					//在待下载数据中加入表头
					this.downloadData.splice(0, 1, ["主题", "项目", "内容", "管理及运行要求", "量化说明", "量化项", "问题描述"])
					//将table型数据转换为sheet
					var sheet = xlsx.utils.aoa_to_sheet(this.downloadData)
					//将合并数组引入sheet中
					sheet['!merges'] = this.mergeData()
					//定义文件名
					const fileName = 'QHSE体系要素模板文件表.xlsx'
					//定义表名
					const sheetName = 'sheet1'
					//定义新的book用来存储sheet
					const wb = xlsx.utils.book_new()
					//将sheet加入book中
					xlsx.utils.book_append_sheet(wb, sheet, sheetName)
					//生成文件
					xlsx.writeFile(wb, fileName)
				}
				this.downloadChoice = false
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
			//上传过程中
			handleProgress() {
				this.$alert('文件上传中，请稍候', '文件上传')
			},
			handleSuccess(response) {
				console.log(response)
				if (response.code == '1000') {
					querryQhseElement({
						queryStatus: this.queryStatus
					}).then(res => {
						this.tableData = res.data
						this.select()
					}).catch((err) => {
						this.$message.error(err.message)
					})
					this.$message.success('上传成功')
				} else {
					this.$message.error('上传失败')
				}

			},
			//打开新增框
			append(val) {
				//保存选中的节点的code，初始化要书名称框
				this.insertDate.code = val.code
				this.addEventForm.name = ''
				//显示新增节点框
				this.addEventdialogVisible = true;
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
				else if (this.level == 6) this.levelSixDialog = true
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
				if (!this.chosenData.name) {
					this.$message.error('数据不完整')
					return
				}
				if (this.chosenData.initialScore < 0) {
					this.$message.error('分数输入错误')
					this.chosenData.initialScore = ''
					return
				}
				//调用接口编辑数据
				updateQHSEElement(this.chosenData).then(res => {
					if (res.code == '1000') {
						//调用搜索方法重新渲染界面
						this.getDate()
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
				else if (this.level == 6) this.levelSixDialog = false
			},
			//更改当前节点的启用状态
			onStopUse(val) {
				//调用接口传回数据
				updateQHSEElementStatus(val.id).then(res => {
					if (res.code == '1000') {
						//点击后的状态更新
						//val.status = val.status == '停用' ? '启用' : '停用';
						this.getDate()
						this.$message.success('更新状态成功')
					} else {
						this.$message.error('更新状态失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//新增节点
			addEventFormSubmitBtn() {
				//对节点数据完整性进行检查
				if (!this.addEventForm.name) {
					this.$message.error('数据不完整')
					return
				}
				//组装数据
				this.insertDate.name = this.addEventForm.name
				//调用接口新增数据
				addQHSEElement(this.insertDate).then(res => {
					if (res.code == '1000') {
						//调用搜索方法重新渲染界面
						this.getDate()
						this.$message.success('节点添加成功')

					} else {
						this.$message.error('节点添加失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
				//关闭新增节点框
				this.addEventdialogVisible = false

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
