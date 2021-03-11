<template>
	<div>
		<div class="page-title" style="width: 100%">检查表配置</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :inline='true'>
				<el-form-item label="审核类别:">
					<el-select v-model="filterText.checkCategory" clearable>
						<el-option v-for="item in checkCategoryOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核依据:">
					<el-select v-model="filterText.checkBasis" clearable>
						<el-option v-for="item in checkBasisOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核方式">
					<el-select v-model="filterText.checkMethod" clearable>
						<el-option v-for="item in checkMethodOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启用状态:">
					<el-select placeholder="请选择启用状态" v-model="filterStatus" clearable='true'>
						<el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="getData()" style="margin-right: 15px;">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-plus" @click="openAddDialog()">新增检查表头</el-button>
				</el-form-item>
				<!--2021-3-11 16:46，zhb， 对上传和下载进行统一，使得更加符合使用习惯 -->
				<el-form-item>
					<el-upload ref="upload" :action="'/api/addQualityExcel'" :auto-upload="true" :headers="headers"
						:file-list="uploadFile" :on-preview="handlePreview" :on-remove="handleRemove"
						:on-success="handleSuccess" :before-remove="beforeRemove" accept=".xlsx,.XLSX,.xls,.XLS"
						style="margin-right: 5px;float: left;">
						<el-button icon="el-icon-upload" type="success">上传检查表</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button icon="el-icon-download" type="warning" @click="downloadChoiceDialog=true">下载文件
					</el-button>
				</el-form-item>
			</el-form>
			<!-- 2021-3-11 15:17，zhb，快捷展开节点，无限制新增层数，修复折叠bug，新增删除按钮 -->
			<el-tree :data="selectedDate" node-key="checkListID" :props="defaultProps" :filter-node-method="filterNode"
				ref="tree" :expand-on-click-node="true" :default-expanded-keys="expandedList" @node-expand="nodeExpand"
				@node-collapse="nodeCollapse">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<div>
						<el-button align="center" v-if="node.level===1&&data.checkCategory" round type="primary"
							size="mini" style="width: 130px;padding: 5px;margin-right:5px;">{{data.checkCategory}}
						</el-button>
						<div style="width: 0px;" v-else></div>
					</div>
					<div>
						<el-button align="center" v-if="node.level===1&&data.checkBasis" round type="success"
							size="mini" style="width: 130px;padding: 5px;margin-right:5px;">{{data.checkBasis}}
						</el-button>
						<div style="width: 0px;" v-else></div>
					</div>
					<div>
						<el-button align="center" v-if="node.level===1&&data.checkMethod" round type="warning"
							size="mini" style="width: 130px;padding: 5px;margin-right:5px;">{{data.checkMethod}}
						</el-button>
						<div style="width: 0px;" v-else></div>
					</div>
					<div :title="data.checkListName" class="em-tree-text">{{ data.checkListName }}</div>
					<div>
						<el-button type="text" size="mini" @click="openAddDialog(node)" v-if="data.status==='启用'">
							<i class="el-icon-circle-plus"></i>
						</el-button>
						<el-button type="text" size="mini" @click="openConfigDialog(data)" v-if="data.status==='启用'">
							编辑
						</el-button>
						<el-button type="text" size="mini" @click="deleteNode(data)" v-if="data.status==='停用'">
							删除
						</el-button>
						<el-button type="text" size="mini" @click="updateStatus(data)">
							<i>{{data.status=='启用'?'停用':'启用'}}</i>
						</el-button>
					</div>
				</span>
			</el-tree>
			<el-dialog :title="dialogtitle" :visible.sync="addItemDialog" width="30%">
				<el-form ref="addEventForm" :model="chosenData" label-width="100px" label-position="right">
					<el-form-item label="节点属性">
						<el-input v-model="chosenData.attribute" readonly='true'></el-input>
					</el-form-item>
					<el-form-item label="审核类别" v-if="chosenData.attribute==='表'">
						<el-select style="width: 100%;" v-model="chosenData.checkCategory" clearable filterable allow-create
						 default-first-option placeholder="请选择或输入审核类别">
							<el-option v-for="item in checkCategoryOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核依据" v-if="chosenData.attribute==='表'">
						<el-select style="width: 100%;" v-model="chosenData.checkBasis" clearable filterable allow-create
						 default-first-option placeholder="请选择或输入审核依据">
							<el-option v-for="item in checkBasisOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核方式" v-if="chosenData.attribute==='表'">
						<el-select style="width: 100%;" v-model="chosenData.checkMethod" clearable filterable allow-create
						 default-first-option placeholder="请选择或输入审核方式">
							<el-option v-for="item in checkMethodOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="检查项">
						<el-input v-model="chosenData.checkListName" placeholder="请输入检查表名称" v-if="chosenData.attribute==='表'"></el-input>
						<el-input v-model="chosenData.checkListName" placeholder="请输入检查项目名称" v-if="chosenData.attribute==='项目'"></el-input>
						<el-input v-model="chosenData.checkListName" placeholder="请输入检查内容名称" v-if="chosenData.attribute==='内容'"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button icon='el-icon-refresh-left' @click="addItemDialog=false">取 消</el-button>
					<el-button icon='el-icon-plus' type="primary" @click="insertNode()">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="编辑检查项" :visible.sync="configItemDialog" width="30%">
				<el-form :model="configData">
					<el-form-item label="审核类别" v-if="row.attribute==='表'">
						<el-select style="width: 100%;" v-model="configData.checkCategory" clearable filterable allow-create
						 default-first-option placeholder="请选择或输入审核类别">
							<el-option v-for="item in checkCategoryOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核依据" v-if="row.attribute==='表'">
						<el-select style="width: 100%;" v-model="configData.checkBasis" clearable filterable allow-create
						 default-first-option placeholder="请选择或输入审核依据">
							<el-option v-for="item in checkBasisOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核方式" v-if="row.attribute==='表'">
						<el-select style="width: 100%;" v-model="configData.checkMethod" clearable filterable allow-create
						 default-first-option placeholder="请选择或输入审核方式">
							<el-option v-for="item in checkMethodOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="检查项">
						<el-input v-model="configData.checkListName" placeholder="请输入检查项名称" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button icon='el-icon-refresh-left' @click="configItemDialog=false">取 消</el-button>
					<el-button icon='el-icon-check' type="primary" @click="configNode()">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="导出选择" :visible.sync="downloadChoiceDialog" width="20%" align="left">
				<el-form label-width="100px" label-position="right">
					<!-- <el-form-item label="">
						<el-button icon="el-icon-download" type="warning" @click="downloadAll()">导出全部文件</el-button>
					</el-form-item> -->
					<el-form-item label="查看用模板表:">
						<el-button icon="el-icon-download" type="warning" @click="downloadModle()">导出模板文件</el-button>
					</el-form-item>
					<el-form-item label="上传用模板表:">
						<el-button icon="el-icon-download" type="warning" @click="downloadModelFile">下载模板表</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
	</div>
</template>

<script>
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
	//引入接口
	import {
		//当前登录用户
		GetCurrentUser
	} from '../../../store/CurrentUser';
	import {
		queryCheckList,
		updateNodeStatus,
		updateNodeContent,
		addCheckListItem,
		addQualityExcel,
		downloadModelFile,
		deleteNode
	} from '../../../services/qualitySystem/checkListConfig'
	import xlsx from 'xlsx'
	import ExportJsonExcel from "js-export-excel";
	export default {
		data() {
			return {
				headers:newOptions.headers,
				uploadFile:[],
				//加载变量初始值
				loading: false,
				dialogtitle: '',
				row: {},
				//关键字搜索框初始值
				//filterText: '',
				filterText: {
					checkCategory: [],
					checkBasis: [],
					checkMethod: []
				},
				//状态选择框初始值
				filterStatus: '启用',
				//状态选择框选项
				options: [{
						value: '启用',
						label: '启用'
					},
					{
						value: '全部',
						label: '全部'
					}
				],
				checkCategoryOptions: [{
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
					}
				],
				checkBasisOptions: [{
						value: 'CNAS',
						label: 'CNAS'
					},
					{
						value: 'ISO-9000',
						label: 'ISO-9000'
					},
					{
						value: 'API-Q2',
						label: 'API-Q2'
					},
					{
						value: 'CMA',
						label: 'CMA'
					},
					{
						value: '检验机构',
						label: '检验机构'
					},
					{
						value: '特种设备',
						label: '特种设备'
					}
				],
				checkMethodOptions: [{
						value: '现场审核',
						label: '现场审核'
					},
					{
						value: '远程监控',
						label: '远程监控'
					},
					{
						value: '专项审核',
						label: '专项审核'
					},
					{
						value: '自改自查',
						label: '自改自查'
					},
					{
						value: '其他',
						label: '其他'
					}
				],
				//检查表树数组
				tableData: [],
				selectedDate: [],
				//对话框显示变量
				addItemDialog: false,
				configItemDialog: false,
				downloadChoiceDialog: false,
				//选中某一行时保存数据用对象
				chosenData: {
					checkCategory: '',
					checkBasis: '',
					checkMethod: '',
					checkListName: '',
					attribute: '',
					parentName: '',
					status: '',
					checkListCode: '',

				},
				configData: {
					checkCategory: '',
					checkBasis: '',
					checkMethod: '',
					checkListName: '',
					checkListCode: ''
				},
				//检查表树展开与折叠数组
				expandedList: [],
				//查询用状态变量
				queryStatus: 0,
				//模板下载数据数组
				downloadModleData: [],
				//模板下载数据项
				downloadModleItem: [],
				//全部下载数据数组
				downloadData: []
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			},
			filterStatus() {
				this.initData('init')
			}
		},
		mounted() {
			this.initData('init')
		},
		methods: {
			// 2021-3-11 15:24，zhb，递归删除节点，二次确认
			deleteNode(data) {
				this.$confirm('确认要删除该节点吗？该操作会删除该节点的所有下级节点!', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(() => {
					delete(data.checkListCode).then(res => {
						if (res.code == '1000') {
							this.$message.success('删除节点成功')
						}
					}).catch(err => {
						this.$message.error(err.message)
					})
				})
			},
			handleCellClick(row, cell, column) {
				if (row.children) {
					let els = column.getElementsByClassName("el-icon-arrow-right");
					if (els.length != 0) {
						els[0].click();
					}
				}
			},
			downloadModelFile(){
				var url='http://39.98.173.131:7000/QualityManagerSysElement/model.xlsx'
				var iframe =document.createElement("iframe")
				iframe.style.display ="none";
				iframe.src = url;
				document.body.appendChild(iframe);
				this.downloadChoiceDialog = false
			},
			//树的关键字搜索
			filterNode(value, data) {
				if (!value) return true;
				return data.checkListName.indexOf(value) !== -1;
			},
			//确认上传
			submitUpload() {
				this.$refs.upload.submit();
			},
			//上传过程中
			handleProgress() {
				//this.$alert('文件上传中，请稍候', '文件上传')
			},
			//移除上传文件
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			//预览上传文件
			handlePreview(file) {
				console.log(file);
			},
			//删除前二次确认
			beforeRemove(file) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			//上传成功
			handleSuccess(res) {
				this.loading=true
				if (res.code == '1000') {
					this.getDate('init')
					this.$message.success('上传成功');
					this.loading=false
				} else {
					this.$message.error('上传失败')
					this.loading=false
				}
			},
			//根据状态选择框进行查询
			getData() {
				this.loading = true
				//this.initData('init')
				this.selectedDate = this.tableData
				if (this.filterText.checkCategory) {
					this.selectedDate = this.selectedDate.filter(item => {
						return item.checkCategory === this.filterText.checkCategory
					})
				}
				if (this.filterText.checkBasis) {
					this.selectedDate = this.selectedDate.filter(item => {
						return item.checkBasis === this.filterText.checkBasis
					})
				}
				if (this.filterText.checkMethod) {
					this.selectedDate = this.selectedDate.filter(item => {
						return item.checkMethod === this.filterText.checkMethod
					})
				}
				console.log('after selected', this.selectedDate)
				this.loading = false
			},
			initData(data) {
				switch (data) {
					//清空chosenData对象中保存的值，用于在打开和关闭对应对话框和时使用
					case 'chosen':
						this.chosenData.checkCategory = ''
						this.chosenData.checkBasis = ''
						this.chosenData.checkMethod = ''
						this.chosenData.checkListCode = ''
						this.chosenData.checkListName = ''
						this.chosenData.parentName = ''
						this.chosenData.attribute = ''
						this.chosenData.status = ''
						console.log('chosen clear')
						break
						//清空configData对象中保存的值,用于在打开和关闭编辑对话框时使用	
					case 'config':
						this.configData.checkCategory = ''
						this.configData.checkBasis = ''
						this.configData.checkMethod = ''
						this.configData.checkListCode = ''
						this.configData.checkListName = ''
						console.log('config clear')
						break
						//清空模板下载数据数组
					case 'modle':
						this.downloadModleData = []
						break
						//清空全部下载数据数组
					case 'downloadall':
						this.downloadData = []
						break
					case 'init':
						// this.filterText.checkCategory=''
						// this.filterText.checkBasis=''
						// this.filterText.checkMethod=''
						this.loading = true
						if (this.filterStatus == '启用') {
							this.queryStatus = 0
						} else {
							this.queryStatus = 1
						}
						queryCheckList(this.queryStatus).then(res => {
							for (var i = 0; i < res.data.length; i++) {

								if (!this.isCopy(res.data[i].checkCategory, this.checkCategoryOptions)) {
									let item = {
										value: '',
										label: ''
									}
									item.value = item.label = res.data[i].checkCategory
									this.checkCategoryOptions.push(item)
								}
								if (!this.isCopy(res.data[i].checkBasis, this.checkBasisOptions)) {
									let item = {
										value: '',
										label: ''
									}
									item.value = item.label = res.data[i].checkBasis
									this.checkBasisOptions.push(item)
								}
								if (!this.isCopy(res.data[i].checkMethod, this.checkMethodOptions)) {
									let item = {
										value: '',
										label: ''
									}
									item.value = item.label = res.data[i].checkMethod
									this.checkMethodOptions.push(item)
								}
							}
							this.tableData = this.selectedDate = res.data
							console.log('select', this.selectedDate)
							this.loading = false
						}).catch((err) => {
							this.$message.error(err.message)
						})
					default:
						break
				}

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
			//新增一个表，项目或者内容
			openAddDialog(row) {
				//初始化chosenData对象
				this.initData('chosen')
				//当该对话框是从树中打开而不是从上面单独打开时
				if (row) {
					this.row = row
					//保存被选中的行的数据
					this.chosenData.parentName = row.data.checkListName
					this.chosenData.checkListCode = row.data.checkListCode
					//当被选中的行是第一层，新增的节点是第二层，属性为“项目”
					if (row.level == 1) {
						this.chosenData.attribute = '项目'
					}
					//当被选中的是第二层，新增的节点是第三层，属性为“内容”
					else if (row.level == 2) {
						this.chosenData.attribute = '内容'
					}
				}
				//当对话框是从上面打开时，表示新增表，所以父节点名字和code为空
				else {
					this.chosenData.attribute = '表'
					this.chosenData.parentName = null
					this.chosenData.checkListCode = null

				}
				//新增节点状态默认为启用状态，节点名为空
				this.chosenData.status = '启用'
				this.chosenData.checkListName = ''
				this.dialogtitle = "新增" + this.chosenData.attribute
				this.addItemDialog = true
				console.log('chosendata', this.chosenData)
			},
			//新增一个节点
			insertNode() {
				if (this.chosenData.attribute == '表') {
					//判断数据完整性
					if (!this.chosenData.checkListName || !this.chosenData.checkCategory || !this.chosenData.checkBasis || !this.chosenData
						.checkMethod) {
						this.$message.error('数据不完整')
						return
					}
					if (this.chosenData.checkCategory.length > 9 || this.chosenData.checkBasis.length > 9 || this.chosenData.checkMethod >
						9) {
						this.$message.error('审核类型，审核依据，审核方式长度最大为9！')
						return
					}
					let isCopy = this.tableData.filter(item => {
						return item.checkCategory == this.chosenData.checkCategory && item.checkBasis == this.chosenData.checkBasis &&
							item.checkMethod == this.chosenData.checkMethod
					})
					console.log(isCopy)
					if (isCopy.length > 0) {
						this.$message.error('审核类型，审核依据，审核方式重复，请重新选择！')
						this.chosenData.checkCategory = ''
						this.chosenData.checkBasis = ''
						this.chosenData.checkMethod = ''
						return
					}
				} else {
					if (!this.chosenData.checkListName) {
						this.$message.error('数据不完整')
						return
					}
				}
				//调用接口新增节点
				this.loading = true
				addCheckListItem(this.chosenData).then(res => {
					//新增成功
					if (res.code == '1000') {
						//重新获取数据，并显示相应的提示信息
						this.getData()
						this.initData('init')
						this.$message.success('新增节点成功')
						this.loading = false
					} else {
						this.$message.error('新增节点失败')
					}
					//清空临时数据对象
					this.initData('chosen')
					this.loading = false
				}).catch((err) => {
					this.$message.error(err.message)
					this.loading = false
				})
				//关闭新增节点对话框
				this.loading = false
				this.addItemDialog = false
			},
			//打开编辑数据对话框
			openConfigDialog(row) {
				//清空临时数据对象
				this.initData('config')
				//将需要保存的数据保存到临时数据对象中
				this.row = row
				this.configData.checkCategory = row.checkCategory
				this.configData.checkBasis = row.checkBasis
				this.configData.checkMethod = row.checkMethod
				this.configData.checkListName = row.checkListName
				this.configData.checkListCode = row.checkListCode
				//显示编辑数据对话框
				this.configItemDialog = true
			},
			//提交编辑数据
			configNode() {
				if (this.row.checkListCode.length == 4) {
					//检查数据完整性
					if (!this.configData.checkListName || !this.configData.checkCategory || !this.configData.checkBasis || !this.configData
						.checkMethod) {
						this.$message.error('数据不完整')
						return
					}
					if (this.configData.checkListName.length > 9 || this.configData.checkCategory.length > 9 || this.configData.checkBasis
						.length > 9) {
						console.log(this.configData.checkCategory.length)
						this.$message.error('审核类型，审核依据，审核方式长度最大为9！')
						this.configData.checkCategory = this.row.checkCategory
						this.configData.checkBasis = this.row.checkBasis
						this.configData.checkMethod = this.row.checkMethod
						return
					}
					let isCopy = this.tableData.filter(item => {
						return item.checkCategory == this.configData.checkCategory && item.checkBasis == this.configData.checkBasis &&
							item.checkMethod == this.configData.checkMethod
					})
					if (isCopy.length > 0) {
						for (var i = 0; i < isCopy.length; i++) {
							if (this.row.checkListID != isCopy.checkListID) {
								this.$message.error('审核类型，审核依据，审核方式重复，请重新选择！')
								this.configData.checkCategory = this.row.checkCategory
								this.configData.checkBasis = this.row.checkBasis
								this.configData.checkMethod = this.row.checkMethod
								return
							}
						}
					}
				} else {
					if (!this.configData.checkListName) {
						this.$message.error('数据不完整')
						return
					}
				}
				//调用接口提交编辑数据
				updateNodeContent(this.configData).then(res => {
					//提交数据成功
					if (res.code == '1000') {
						//重新获取数据，刷新界面，并显示相应提示信息
						this.initData('init')
						this.$message.success('更新信息成功')
					} else {
						this.$message.error('更新信息失败')
					}
					//清空临时数据对象
					this.initData('config')
				}).catch(err => {
					this.$message.error(err.message)
				})
				//关闭编辑数据对话框
				this.configItemDialog = false
			},
			//更新节点启用状态
			updateStatus(row) {
				//调用接口提交请求
				updateNodeStatus(row.checkListID).then(res => {
					//提交请求成功
					if (res.code == '1000') {
						//重新获取数据，刷新界面，并显示相应提示信息
						this.initData('init')
						this.$message.success('更新状态成功')
					} else {
						this.$message.error('更新状态失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//获取当前登录用户
			currentUser() {
				return GetCurrentUser()
			},
			//展开检查表树
			nodeExpand(data) {
				this.expandedList.splice(this.expandedList.length, 1, data.checkListID)
			},
			//折叠检查表树,（2021-3-11 16:52，折叠更新）
			nodeCollapse(data) {
				for (var i = this.expandedList.length - 1; i >= 0; i--) {
					if (this.expandedList[i] != data.checkListID) {
						this.expandedList.pop()
					} else {
						this.expandedList.pop()
						break
					}
				}
			},
			//下载全部检查项
			downloadAll() {
				//清空保存数据的数组
				this.initData('downloadall')
				//调用接口查询所有检查项
				queryCheckList(1).then(res => {
					this.loading = true
					if (res.code == '1000') {
						//将树形数据转换为table型数据
						this.parseTreeToTable(res.data)
						var option = {}
						//设置文件名
						option.fileName = "质量体系运行检查表"
						//设置文件数据，数据格式
						option.datas = [{
							sheetData: this.downloadData,
							sheetHeader: ["编码", "名称", "属性", "父节点", "是否子节点", "状态"]
						}]
						var toExcel = new ExportJsonExcel(option);
						toExcel.saveExcel();
						this.loading = false
						this.downloadChoiceDialog = false
					}
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			//将树形数据转换为table型数据，递归实现
			parseTreeToTable(node) {
				for (var i = 0; i < node.length; i++) {
					if (node[i]) {
						this.downloadData.push({
							checkListCode: node[i].checkListCode,
							checkListName: node[i].checkListName,
							attribute: node[i].attribute,
							parentName: node[i].parentName,
							isChildNode: node[i].isChildNode,
							status: node[i].status
						})
					}
					if (node[i].children) {
						this.parseTreeToTable(node[i].children)
					}
				}
			},
			//下载模板文件
			downloadModle() {
				//清空模板文件数据数组
				this.initData('modle')
				this.loading = true
				queryCheckList(1).then(res => {
					//将树形数据转换为table数据
					this.parseTreeToModle(res.data)
					if (this.downloadModleData.length > 0) {
						console.log('merge flag array', this.mergeData())
						this.downloadModleData.splice(0, 1, ['表名', '项目', '内容'])
						//将table型数据转换为sheet
						var sheet = xlsx.utils.aoa_to_sheet(this.downloadModleData)
						//将合并数组引入sheet中
						sheet['!merges'] = this.mergeData()
						//定义文件名
						const fileName = '质量运行体系模板检查表.xlsx'
						//定义表名
						const sheetName = 'sheet1'
						//定义新的book用来存储sheet
						const wb = xlsx.utils.book_new()
						//将sheet加入book中
						xlsx.utils.book_append_sheet(wb, sheet, sheetName)
						//生成文件
						xlsx.writeFile(wb, fileName)
						this.loading = false
					}
				}).catch((err) => {
					this.$message.error(err.message)
				})
				this.downloadChoiceDialog = false
			},
			parseTreeToModle(node) {
				for (var i = 0; i < node.length; i++) {
					while (this.downloadModleItem.length * 4 >= node[i].checkListCode.length) {
						this.downloadModleItem.pop()
					}
					this.downloadModleItem.push(node[i].checkListName)
					if (!node[i].children) {
						this.downloadModleData.push(JSON.parse(JSON.stringify(this.downloadModleItem)))
						this.downloadModleItem.pop()
					} else {
						this.parseTreeToModle(node[i].children)
					}
				}
			},
			//循环模板文件数组得到合并数组
			mergeData() {
				let mergeTable = []
				for (var i = 0; i < 3; i++) {
					var start = {
						r: null,
						c: null
					}
					start.r = 0
					start.c = i
					for (var j = 1; j < this.downloadModleData.length; j++) {
						//处理空单元格，避免空单元格合并
						if (!this.downloadModleData[j][i] && !this.downloadModleData[j - 1][i]) {
							start.r = j
							start.c = i
						}
						//由于数据规则排列，所以只需要处理两个相邻处不相同时的情况
						else if (this.downloadModleData[j][i] != this.downloadModleData[j - 1][i]) {
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
						} else if (j == this.downloadModleData.length - 1) {
							var e = {
								r: null,
								c: null
							}
							e.r = j
							e.c = i
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
						}
					}
				}
				return mergeTable
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
		font-size: 14px;
		padding-right: 8px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 100%;
	}

	.em-tree-text {
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		width: 100%;
		text-overflow: ellipsis;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}
</style>
