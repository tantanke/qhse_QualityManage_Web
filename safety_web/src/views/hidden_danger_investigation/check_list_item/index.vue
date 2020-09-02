<template>
	<div>
		<div class="page-title" style="width:100%">检查表配置</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :inline='true'>
				<el-form-item label="查询:">
					<el-input placeholder="输入关键字查询" v-model="filterText"></el-input>
				</el-form-item>
				<el-form-item label="启用状态:">
					<el-select placeholder="请选择启用状态" v-model="filterStatus" clearable='true'>
						<el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" style="margin-right: 15px;" @click="select()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="openAddDialog()" icon='el-icon-plus'>新增表</el-button>
				</el-form-item>
				<el-form-item>
					<el-upload ref="upload" :action="`/api/check_list_excel_upload`" :on-preview="handlePreview" :on-remove="handleRemove"
					 :on-success="handleSuccess" :file-list="fileList" :headers="{Authorization:currentUser.token}" :on-progress="handleProgress"
					 :show-file-list="false" accept=".excel,.xls,.xlsx">
						<el-button icon='el-icon-upload' type="success" @click="submitUpload">上传文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" icon='el-icon-download' @click="downloadChoice=true">下载文件</el-button>
				</el-form-item>
			</el-form>
			<el-tree :data="selectedDate" node-key="checkListID" :props="defaultProps" :filter-node-method="filterNode" ref="tree2"
			 :expand-on-click-node="false" :default-expanded-keys="expandedList" @node-expand="nodeExpand" @node-collapse="nodeCollapse">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span :title="node.label" class="em-tree-text">{{ node.label }}</span>
					<span>
						<el-button type="text" size="mini" @click="() => openAddDialog(node)" v-if="node.level!==3&&node.data.status==='启用'">
							<i class="el-icon-circle-plus"></i>
						</el-button>
						&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => openConfigDialog(node)" v-if="node.data.status==='启用'">
							编辑
						</el-button>
						&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => updateStatus(node)">
							<i>{{data.status=='启用'?'停用':'启用'}}</i>
						</el-button>
					</span>
				</span>
			</el-tree>
			<!--新增事件节点分类弹窗-->
			<el-dialog title="新增检查项" :visible.sync="addEventdialogVisible" width="30%">
				<el-form ref="addEventForm" :model="chosenData">
					<el-form-item label="检查项">
						<el-input v-model="chosenData.checkListName" placeholder="请输入检查项名称"></el-input>
					</el-form-item>
					<el-form-item label="节点属性">
						<el-input v-model="chosenData.attribute" readonly='true'></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addEventdialogVisible=false">取 消</el-button>
					<el-button type="primary" @click="insertNode()">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="编辑检查项" :visible.sync="configEventDialog" width="30%">
				<el-form :model="configData">
					<el-form-item label="检查项">
						<el-input v-model="configData.checkListName" placeholder="请输入检查项名称" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="configEventDialog=false">取 消</el-button>
					<el-button type="primary" @click="configNode()">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="导出选择" :visible.sync="downloadChoice" width="30%" align="center">
				<el-form :inline='true'>
					<el-form-item>
						<el-button icon="el-icon-download" type="warning" @click="downloadAll()">导出全部文件</el-button>&nbsp;&nbsp;
						<el-button icon="el-icon-download" type="warning" @click="downloadModle()">导出模板文件</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser';
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import {
		GetCheckListTree,
		updateNodeStatus,
		updateCheckList,
		addCheckListNode
	} from '../../../services/hidden_danger_investigation/checkListItem'
	import xlsx from 'xlsx'
	import ExportJsonExcel from "js-export-excel";
	export default {
		data() {
			return {
				addEventForm: {
					checkListName: '',
					attribute: ''
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
				expandedList: [],
				filterStatus: '启用',
				loading: false,
				queryStatus: 0,
				addEventdialogVisible: false,
				configEventDialog: false,
				downloadChoice: false,
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'checkListName'
				},
				selectedDate: [],
				chosenData: {
					attribute: '',
					checkListCode: null,
					checkListName: '',
					parentName: null,
					status: ''
				},
				insertData: {
					attribute: '',
					checkListCode: '',
					checkListName: '',
					parentName: '',
					status: '启用'
				},
				configData: {
					attribute: '',
					checkListCode: '',
					checkListName: '',
					status: '',
					id: ''
				},
				downloadData: [],
				downloadModleData: [],
				downloadModleItem: [],
				downloadDataItem: {
					checkListCode: '',
					checkListName: '',
					attribute: '',
					parentName: '',
					isChildNode: '',
					status: ''
				},
				updateData: {
					checkListName: '',
					checkListCode: ''
				},
				mergeTable: []
			};
		},
		watch: {
			//实时监视搜索框字符变化，并进行搜索
			filterText(val) {
				this.$refs.tree2.filter(val);
			}
		},
		mounted() {},
		computed: {
			//获取当前登录用户
			currentUser() {
				return GetCurrentUser()
			}
		},
		methods: {
			//获取检查表数据
			getDate() {
				this.loading = true
				//根据选择的状态构造参数查询要素
				if (this.filterStatus == '启用') {
					this.queryStatus = 0
				} else {
					this.queryStatus = 1
				}
				//根据当前启用选择框状态查询数据
				GetCheckListTree(this.queryStatus).then((res) => {
					this.selectedDate = res.data
					this.loading = false
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			nodeExpand(data) {
				this.expandedList.splice(this.expandedList.length, 1, data.checkListID)
			},
			nodeCollapse(data) {
				this.expandedList.splice(this.expandedList.indexOf(data.checkListID), 1)
			},
			//搜索方法
			select() {
				//搜索输入框为空则显示全部数据
				this.getDate()
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
							var end = {
								r: null,
								c: null
							}
							end.r = j
							end.c = i
							var s = {
								r: null,
								c: null
							}
							s.r = start.r
							s.c = start.c
							//保存合并信息
							mergeTable.push({
								s,
								end
							})
						}
					}
				}
				return mergeTable
			},
			//确认上传
			submitUpload() {
				this.$refs.upload.submit();
			},
			//上传过程中
			handleProgress() {
				this.$alert('文件上传中，请稍候', '文件上传')
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
				if (res.code == '1000') {
					this.getDate()
					this.$message.success(res);
				} else {
					this.$message.error(res)
				}
				//重新渲染界面
				this.select()
			},
			//树的关键字搜索
			filterNode(value, data) {
				if (!value) return true;
				return data.checkListName.indexOf(value) !== -1;
			},
			//打开新增节点的对话框
			openAddDialog(node) {
				//记录选中的数据
				if (node) {
					this.chosenData.parentName = node.data.checkListName
					this.chosenData.checkListCode = node.data.checkListCode
					this.chosenData.status = node.data.status
					if (node.level == 1) {
						this.chosenData.attribute = '项目'
					} else if (node.level == 2) {
						this.chosenData.attribute = '内容'
					}
				} else {
					this.chosenData.attribute = '表'
					this.chosenData.parentName = null
					this.chosenData.checkListCode = null
					this.chosenData.status = "启用"
				}
				this.addEventdialogVisible = true
			},
			//新增节点
			insertNode() {
				//判断数据是否完整
				if (!this.chosenData.checkListName) {
					this.$message.error('数据不完整')
					return
				}
				//装填新增数据
				this.insertData.attribute = this.chosenData.attribute
				this.insertData.checkListCode = this.chosenData.checkListCode
				this.insertData.checkListName = this.chosenData.checkListName
				this.insertData.parentName = this.chosenData.parentName
				this.insertData.status = "启用"
				//调用接口新增数据
				addCheckListNode(this.insertData).then(res => {
					if (res.code == '1000') {
						//调用接口重新查询数据，渲染界面
						this.select()
						this.$message.success('添加成功')
					} else {
						this.$message.error('添加失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
				//关闭新增节点框
				this.addEventdialogVisible = false
			},
			//打开编辑对话框
			openConfigDialog(node) {
				//保存选中的数据
				this.configData.checkListName = node.data.checkListName
				this.configData.checkListCode = node.data.checkListCode
				this.configData.attribute = node.data.attribute
				this.configData.status = node.data.status
				this.configData.id = node.data.checkListID
				this.configEventDialog = true
			},
			//编辑
			configNode() {
				//检查数据是否完整
				if (!this.configData.checkListName) {
					this.$message.error('检查项名称不能为空')
					return
				}
				//组装更新的数据
				this.updateData.checkListName = this.configData.checkListName,
					this.updateData.checkListCode = this.configData.checkListCode
				//调用接口更新数据
				updateCheckList(this.updateData).then(res => {
					if (res.code == '1000') {
						//调用接口重新加载数据，渲染界面
						this.select()
						this.$message.success('更新信息成功')
					} else {
						this.$message.error('更新信息失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
				//关闭更新数据框
				this.configEventDialog = false
			},
			//更新节点状态
			updateStatus(node) {
				//调用接口，传入节点id，更新状态
				updateNodeStatus(node.data.checkListID).then(res => {
					if (res.code == '1000') {
						//调用接口，重新加载数据，渲染界面
						this.select()
						this.$message.success('更新状态成功')
					} else {
						this.$message.error('更新状态失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//下载所有项
			downloadAll() {
				this.downloadData = []
				GetCheckListTree(1).then(res => {
					this.loading = true
					if (res.code == '1000') {
						//将树形数据转换为table型数据
						this.parseTreeToTable(res.data)
						var option = {}
						//设置文件名
						option.fileName = name
						//设置文件数据，数据格式
						option.datas = [{
							sheetData: "隐患排查检查表",
							sheetHeader: ["编码", "名称", "属性", "父节点", "是否子节点", "状态"]
						}]
						var toExcel = new ExportJsonExcel(option);
						toExcel.saveExcel();
						this.loading = false
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
				this.downloadChoice = false
			},
			downloadModle() {
				GetCheckListTree(1).then((res) => {
					this.loading = true
					this.parseTreeToModle(res.data)
					if (this.downloadModleData.length > 0) {
						this.downloadModleData.splice(0, 1, ['表名', '项目', '内容'])
						//将table型数据转换为sheet
						var sheet = xlsx.utils.aoa_to_sheet(this.downloadModleData)
						//将合并数组引入sheet中
						sheet['!merges'] = this.mergeData()
						//定义文件名
						const fileName = '隐患排查模板检查表'
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
				this.downloadChoice = false

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
