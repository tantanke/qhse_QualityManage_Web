<template>
	<div>
		<div class="page-title" style="width:100%">检查表配置</div>
		<div class="page-content" style="width: fit-content;min-width: 100%;" v-loading="loading">
			<el-form :inline='true'>
				<el-form-item label="查询:">
					<el-input placeholder="输入关键字查询" v-model="filterText"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search"style="margin-right: 15px;" @click="select()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="openAddDialog()" icon='el-icon-circle-plus'>新增节点</el-button>
				</el-form-item>
				<el-form-item>
					<el-upload ref="upload" :action="`/api/check_list_excel_upload`" :on-preview="handlePreview" :on-remove="handleRemove"
					 :on-success="handleSuccess" :file-list="fileList" :headers="{Authorization:currentUser.token}" :on-progress="handleProgress" :show-file-list="false"
					 accept=".excel,.xls,.xlsx">
						<el-button icon='el-icon-upload'  type="success" @click="submitUpload">上传文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" icon='el-icon-download' @click="downloadChoice=true">下载文件</el-button>
				</el-form-item>
			</el-form>
			<el-checkbox label="仅显示启用项" :true-label="0" :false-label="1" v-model="queryStatus" @change="getDate"></el-checkbox>
			<el-tree :data="selectedDate" node-key="checkListID" :props="defaultProps" :filter-node-method="filterNode" ref="tree2" :expand-on-click-node="false" v-loading="loading">
				<div class="custom-tree-node" slot-scope="{ node, data }">
					<div>{{ node.label }}
					</div>
					<div>
						<el-button type="text" size="mini" @click="() => openAddDialog(node)" v-if="node.level!==3&&node.data.status==='启用'">
							<i class="el-icon-plus"></i>
						</el-button>
						&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => openConfigDialog(node)" v-if="node.data.status==='启用'">
							编辑
						</el-button>
						&nbsp;&nbsp;
						<el-button type="text" size="mini" @click="() => updateStatus(node)">
							<i>{{data.status=='启用'?'停用':'启用'}}</i>
						</el-button>
					</div>
				</div>
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
						<el-button icon="el-icon-download" type="warning" @click="downloadAll()">导出全部项</el-button>&nbsp;&nbsp;
						<el-button icon="el-icon-download" type="warning" @click="downloadUse()">导出启用项</el-button>
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
		addCheckListNode,
		delete_tree,
		getcontent,
		Createcontent
	} from '../../../services/hidden_danger_investigation/checkListItem'
	import ExportJsonExcel from "js-export-excel";
	export default {
		data() {
			return {
				addEventForm: {
					checkListName: '',
					attribute:''
				},
				loading:false,
				queryStatus:0,
				addEventdialogVisible: false,
				configEventDialog:false,
				downloadChoice:false,
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'checkListName'
				},
				selectedDate:[],
				chosenData:{
					attribute:'',
					checkListCode:null,
					checkListName:'',
					parentName:null,
					status:''
				},
				insertData:{
					attribute:'',
					checkListCode:'',
					checkListName:'',
					parentName:'',
					status:'启用'
				},
				configData:{
					attribute:'',
					checkListCode:'',
					checkListName:'',
					status:'',
					id:''
				},
				downloadData:[],
				downloadDataItem:{
					checkListCode:'',
					checkListName:'',
					attribute:'',
					parentName:'',
					isChildNode:'',
					status:''
				},
				updateData:{
					checkListName:'',
					checkListCode:''
				}
			};
		},
		watch: {
			//实时监视搜索框字符变化，并进行搜索
			filterText(val) {
				this.$refs.tree2.filter(val);
			}
		},
		mounted() {
			this.getDate()
		},
		computed: {
			//获取当前登录用户
			currentUser() {
				return GetCurrentUser()
			}
		},
		methods: {
			//获取检查表数据
			getDate(){
				this.loading=true
				//根据当前启用选择框状态查询数据
				GetCheckListTree(this.queryStatus).then((res) => {
					this.treeData = res.data
					this.select()
				}).catch((err) => {
					this.$message.error(err.message)
				})
				this.loading=false
			},
			//搜索方法
			select(){
				//搜索输入框为空则显示全部数据
				if(!this.filterText){
					this.selectedDate=this.treeData
				}else{
					//调用树的搜索方法进行关键字搜索
					this.filterNode(this.filterText, this.selectedData)
				}
			},
			//确认上传
			submitUpload() {
				this.$refs.upload.submit();
			},
			//上传过程中
			handleProgress(file){
				this.$alert('文件上传中，请稍候','文件上传')
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
				if(res.code=='1000'){
					this.$message.success(res);
				}else{
					this.$message.error(res)
				}
				//重新渲染界面
				this.getDate();
				this.select()
			},
			//树的关键字搜索
			filterNode(value, data) {
				if (!value) return true;
				return data.checkListName.indexOf(value) !== -1;
			},
			//打开新增节点的对话框
			openAddDialog(node){
				//记录选中的数据
				if(node){
					this.chosenData.parentName=node.data.checkListName
					this.chosenData.checkListCode=node.data.checkListCode
					this.chosenData.status=node.data.status
					if(node.level==1){
						this.chosenData.attribute='项目'
					}else if(node.level==2){
						this.chosenData.attribute='内容'
					}
				}else{
					this.chosenData.attribute='表'
					this.chosenData.parentName=null
					this.chosenData.checkListCode=null
					this.chosenData.status="启用"
				}
				this.addEventdialogVisible=true
			},
			//新增节点
			insertNode(){
				//判断数据是否完整
				if(!this.chosenData.checkListName){
					this.$message.error('数据不完整')
					return
				}
				//装填新增数据
				this.insertData.attribute=this.chosenData.attribute
				this.insertData.checkListCode=this.chosenData.checkListCode
				this.insertData.checkListName=this.chosenData.checkListName
				this.insertData.parentName=this.chosenData.parentName
				this.insertData.status="启用"
				//调用接口新增数据
				addCheckListNode(this.insertData).then(res=>{
					if(res.code=='1000'){
						//调用接口重新查询数据，渲染界面
						GetCheckListTree(this.queryStatus).then((res) => {
							this.treeData = res.data
							this.select()
						}).catch((err) => {
							this.$message.error(err.message)
						})
						this.$message.success('添加成功')
					}else{
						this.$message.error('添加失败')
					}
				}).catch(err=>{
					this.$message.error(err.message)
				})
				//关闭新增节点框
				this.addEventdialogVisible=false
			},
			//打开编辑对话框
			openConfigDialog(node){
				//保存选中的数据
				this.configData.checkListName=node.data.checkListName
				this.configData.checkListCode=node.data.checkListCode
				this.configData.attribute=node.data.attribute
				this.configData.status=node.data.status
				this.configData.id=node.data.checkListID
				this.configEventDialog=true
			},
			//编辑
			configNode(){
				//检查数据是否完整
				if(!this.configData.checkListName){
					this.$message.error('检查项名称不能为空')
					return
				}
				//组装更新的数据
				this.updateData.checkListName= this.configData.checkListName,
				this.updateData.checkListCode=this.configData.checkListCode
				//调用接口更新数据
				updateCheckList(this.updateData).then(res=>{
					if(res.code=='1000'){
						//调用接口重新加载数据，渲染界面
						GetCheckListTree(this.queryStatus).then((res) => {
							this.treeData = res.data
							this.select()
						}).catch((err) => {
							this.$message.error(err.message)
						})
						this.$message.success('更新信息成功')
					}
					else{
						this.$message.error('更新信息失败')
					}
				}).catch(err=>{
					this.$message.error(err.message)
				})
				//关闭更新数据框
				this.configEventDialog=false
			},
			//更新节点状态
			updateStatus(node){
				//调用接口，传入节点id，更新状态
				updateNodeStatus(node.data.checkListID).then(res=>{
					if(res.code=='1000'){
						//调用接口，重新加载数据，渲染界面
						node.data.status=node.data.status== '停用' ? '启用' : '停用'
						this.$message.success('更新状态成功')
					}else{
						this.$message.error('更新状态失败')
					}
				}).catch(err=>{
					this.$message.error(err.message)
				})
			},
			//下载所有项
			downloadAll(){
				this.downloadData=[]
				GetCheckListTree(1).then(res=>{
					if(res.code=='1000'){
						//将树形数据转换为table型数据
						this.parseTreeToTable(res.data)
						//传入表名称，下载文件
						this.downloadFile("隐患排查检查表")
					}
				}).catch(err=>{
					this.$message.error(err.message)
				})
				this.downloadChoice=false
			},
			//仅下载启用项
			downloadUse(){
				this.downloadData=[]
				GetCheckListTree(0).then(res=>{
					if(res.code=='1000'){
						this.parseTreeToTable(res.data)
						this.downloadFile("隐患排查启用检查表")
					}
				})
				this.downloadChoice=false
			},
			//下载文件
			downloadFile(name){
				var option={}
				//设置文件名
				option.fileName=name
				//设置文件数据，数据格式
				option.datas=[{
					sheetData:this.downloadData,
					sheetHeader:["编码","名称","属性","父节点","是否子节点","状态"]
				}]
				var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
			},
			//将树形数据转换为table型数据，递归实现
			parseTreeToTable(node){
				for(var i=0;i<node.length;i++){
					if(node[i]){
						this.downloadData.push({
							checkListCode:node[i].checkListCode,
							checkListName:node[i].checkListName,
							attribute:node[i].attribute,
							parentName:node[i].parentName,
							isChildNode:node[i].isChildNode,
							status:node[i].status
						})
					}
					if(node[i].children){
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
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}
</style>
