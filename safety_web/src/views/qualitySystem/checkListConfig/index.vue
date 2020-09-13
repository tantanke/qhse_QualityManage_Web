<template>
	<div>
		<div class="page-title" style="width: 100%">检查表配置</div>
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
					<el-button type="primary" icon="el-icon-search" @click="getData()" style="margin-right: 15px;">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-plus" @click="openAddDialog()">新增检查表</el-button>
				</el-form-item>
				<el-form-item>
					<el-upload ref="upload" :action="'/api/QualityCheck_excel_upload'" :on-preview="handlePreview" :on-remove="handleRemove"
					 :on-success="handleSuccess" :file-list="fileList" :headers="{Authorization:currentUser().token}" :show-file-list="false"
					 accept=".excel, .xls, .xlsx" :on-progress="handleProgress">
						<el-button icon="el-icon-upload" type="success" @click="submitUpload">上传文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button icon="el-icon-download" type="warning" @click="downloadChoiceDialog=true">下载文件</el-button>
				</el-form-item>
			</el-form>
			<el-tree :data="selectedDate" node-key="checkListID" :props="defaultProps" :filter-node-method="filterNode" ref="tree"
			 :expand-on-click-node="false" :default-expanded-keys="expandedList" @node-expand="nodeExpand" @node-collapse="nodeCollapse">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span :title="data.checkListName" class="em-tree-text">{{ data.checkListName }}</span>
					<span>
						<el-button type="text" size="mini" @click="openAddDialog(node)" v-if="node.level!==3&&data.status==='启用'">
							<i class="el-icon-circle-plus"></i>
						</el-button>
						&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="openConfigDialog(data)" v-if="data.status==='启用'">
							编辑
						</el-button>
						&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="updateStatus(data)">
							<i>{{data.status=='启用'?'停用':'启用'}}</i>
						</el-button>
					</span>
				</span>
			</el-tree>
			<el-dialog title="新增检查项" :visible.sync="addItemDialog" width="30%">
				<el-form ref="addEventForm" :model="chosenData">
					<el-form-item label="检查项">
						<el-input v-model="chosenData.checkListName" placeholder="请输入检查项名称"></el-input>
					</el-form-item>
					<el-form-item label="节点属性">
						<el-input v-model="chosenData.attribute" readonly='true'></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button icon='el-icon-refresh-left' @click="addItemDialog=false">取 消</el-button>
					<el-button icon='el-icon-plus' type="primary" @click="insertNode()">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="编辑检查项" :visible.sync="configItemDialog" width="30%">
				<el-form :model="configData">
					<el-form-item label="检查项">
						<el-input v-model="configData.checkListName" placeholder="请输入检查项名称" type="textarea" autosize='true'></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button icon='el-icon-refresh-left' @click="configItemDialog=false">取 消</el-button>
					<el-button icon='el-icon-check' type="primary" @click="configNode()">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="导出选择" :visible.sync="downloadChoiceDialog" width="30%" align="center">
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
		uploadFile
	} from '../../../services/qualitySystem/checkListConfig'
	import xlsx from 'xlsx'
	import ExportJsonExcel from "js-export-excel";
	export default {
		data() {
			return {
				//加载变量初始值
				loading: false,
				//关键字搜索框初始值
				filterText: '',
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
				//检查表树数组
				selectedDate: [],
				//对话框显示变量
				addItemDialog: false,
				configItemDialog: false,
				downloadChoiceDialog: false,
				//选中某一行时保存数据用对象
				chosenData: {
					checkListName: '',
					attribute: '',
					parentName:'',
					status:'',
					checkListCode:'',
					
				},
				configData:{
					checkListName:'',
					checkListCode:''
				},
				//检查表树展开与折叠数组
				expandedList: [],
				//查询用状态变量
				queryStatus: 0,
				//模板下载数据数组
				downloadModleData:[],
				//模板下载数据项
				downloadModleItem:[],
				//全部下载数据数组
				downloadData:[]
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		mounted() {
			this.getData()
		},
		methods: {
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
					this.$message.success('上传成功');
				} else {
					this.$message.error('上传失败')
				}
			},
			//根据状态选择框进行查询
			getData() {
				this.loading = true
				if (this.filterStatus == '启用') {
					this.queryStatus = 0
				} else {
					this.queryStatus = 1
				}
				queryCheckList(this.queryStatus).then(res => {
					this.selectedDate = res.data
					console.log(this.selectedDate)
					this.loading = false
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			initData(data){
				switch(data){
					//清空chosenData对象中保存的值，用于在打开和关闭对应对话框和时使用
					case 'chosen':
						this.chosenData.checkListCode=''
						this.chosenData.checkListName=''
						this.chosenData.parentName=''
						this.chosenData.attribute=''
						this.chosenData.status=''
						console.log('chosen clear')
						break
					//清空configData对象中保存的值,用于在打开和关闭编辑对话框时使用	
					case 'config':
						this.configData.checkListCode=''
						this.configData.checkListName=''
						console.log('config clear')
						break
					//清空模板下载数据数组
					case 'modle':
						this.downloadModleData=[]
						break
					//清空全部下载数据数组
					case 'downloadall':
						this.downloadData=[]
						break
				}
				
			},
			//新增一个表，项目或者内容
			openAddDialog(row) {
				//初始化chosenData对象
				this.initData('chosen')
				//当该对话框是从树中打开而不是从上面单独打开时
				if(row){
					//保存被选中的行的数据
					this.chosenData.parentName=row.data.checkListName
					this.chosenData.checkListCode=row.data.checkListCode
					//当被选中的行是第一层，新增的节点是第二层，属性为“项目”
					if(row.level==1){
						this.chosenData.attribute='项目'
					}
					//当被选中的是第二层，新增的节点是第三层，属性为“内容”
					else if(row.level==2){
						this.chosenData.attribute='内容'
					}
				}
				//当对话框是从上面打开时，表示新增表，所以父节点名字和code为空
				else{
					this.chosenData.attribute='表'
					this.chosenData.parentName=null
					this.chosenData.checkListCode=null
					
				}
				//新增节点状态默认为启用状态，节点名为空
				this.chosenData.status='启用'
				this.chosenData.checkListName=''
				this.addItemDialog = true
			},
			//新增一个节点
			insertNode(){
				//判断数据完整性
				if(!this.chosenData.checkListName){
					this.$message.error('数据不完整')
					return
				}
				//调用接口新增节点
				addCheckListItem(this.chosenData).then(res=>{
					//新增成功
					if(res.code=='1000'){
						//重新获取数据，并显示相应的提示信息
						this.getData()
						this.$message.success('新增节点成功')
					}else{
						this.$message.error('新增节点失败')
					}
					//清空临时数据对象
					this.initData('chosen')
				}).catch((err) => {
					this.$message.error(err.message)
				})
				//关闭新增节点对话框
				this.addItemDialog=false
			},
			//打开编辑数据对话框
			openConfigDialog(row) {
				//清空临时数据对象
				this.initData('config')
				//将需要保存的数据保存到临时数据对象中
				this.configData.checkListName=row.checkListName
				this.configData.checkListCode=row.checkListCode
				//显示编辑数据对话框
				this.configItemDialog = true
			},
			//提交编辑数据
			configNode(){
				//检查数据完整性
				if(!this.configData.checkListName){
					this.$message.error('数据不完整')
					return
				}
				//调用接口提交编辑数据
				updateNodeContent(this.configData).then(res=>{
					//提交数据成功
					if(res.code=='1000'){
						//重新获取数据，刷新界面，并显示相应提示信息
						this.getData()
						this.$message.success('更新信息成功')
					}else{
						this.$message.error('更新信息失败')
					}
					//清空临时数据对象
					this.initData('config')
				}).catch(err=>{
					this.$message.error(err.message)
				})
				//关闭编辑数据对话框
				this.configItemDialog=false
			},
			//更新节点启用状态
			updateStatus(row){
				//调用接口提交请求
				updateNodeStatus(row.checkListID).then(res=>{
					//提交请求成功
					if(res.code=='1000'){
						//重新获取数据，刷新界面，并显示相应提示信息
						this.getData()
						this.$message.success('更新状态成功')
					}else{
						this.$message.error('更新状态失败')
					}
				}).catch(err=>{
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
			//折叠检查表树
			nodeCollapse(data) {
				this.expandedList.splice(this.expandedList.indexOf(data.checkListID), 1)
			},
			//下载全部检查项
			downloadAll(){
				//清空保存数据的数组
				this.initData('downloadall')
				//调用接口查询所有检查项
				queryCheckList(1).then(res => {
					this.loading=true
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
						this.downloadChoiceDialog=false
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
			downloadModle(){
				//清空模板文件数据数组
				this.initData('modle')
				this.loading=true
				queryCheckList(1).then(res => {
					//将树形数据转换为table数据
					this.parseTreeToModle(res.data)
					if (this.downloadModleData.length > 0) {
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
				this.downloadChoiceDialog=false
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
