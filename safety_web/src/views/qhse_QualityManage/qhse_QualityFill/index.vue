<template>
	<div>
		<div class="page-title" style="width: 100%">要素配置管理</div>
		<div class="page-content" v-loading="loading">
			<el-form label-width="130px" :inline="true" :model="filterQuery">
				<el-form-item lable="选择公司:">
					<treeselect :multiple="false" placeholder="请选择公司单位" style="width: 200px" :options="companyList" v-model="filterQuery.companyId"></treeselect>
				</el-form-item>
				<el-form-item label="选择年份：">
					<el-date-picker type="year" placeholder="选择年份" style="width:200px" v-model="filterQuery.year">
					</el-date-picker>
				</el-form-item>
				&nbsp;&nbsp;&nbsp;
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="handleSelect">查询</el-button>
					<el-button type="primary" icon='el-icon-plus' @click="insertCheckListDialog=true">新增</el-button>
					<el-button type="primary" icon='el-icon-plus' @click="addmuch">批量新增</el-button>
				</el-form-item>
			</el-form>
			<!--highlight-current-row @current-change="dialogVisible =true"-->
			<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
				<el-table :data="filterQuery.selected" style="width: 100%" max-height="560" border v-loading="loading">
					<el-table-column type="index" label="序号" width="100%" align="center"></el-table-column>
					<el-table-column prop="companyName" label="单位名称" width="250%" align="center"></el-table-column>
					<el-table-column prop="year" label="年度" width="100%" align="center"></el-table-column>
					<el-table-column prop="elementTableName" label="检查表名称" width="340%" align="center"></el-table-column>
					<!--
					<el-table-column prop="status" label="状态" width="120" align="center"></el-table-column>
					-->
					<el-table-column label="操作" width="270%" align="center">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" @click="handlChosen(scope.row)">配置</el-button>
							<!--
							<el-button type="primary" size="mini" @click="archived(scope.row)">归档</el-button>
							-->

							<el-button type="danger" size="mini" @click="deleteTable(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog title="新增年度检查表" :visible.sync="insertCheckListDialog" align="left" width="30%">
						<el-form :inline="true" label-width="90px" label-postion="left">
							<el-form-item label="请选择公司:">
								<treeselect :multiple="false" required="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
								 v-model="insertCompanyCode"></treeselect>
							</el-form-item>
							<el-form-item label="请选择年份:">
								<el-date-picker type="year" required="true" placeholder="选择年份" style="width:250px" v-model="insertYear">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="检查表名称:">
								<el-input placeholder="请输入检查表名称" style="width:250px;" v-model="insertElementTableName"></el-input>
							</el-form-item>
							<br />
						</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="insertCheckListDialog=false">取消</el-button>
								<el-button type="primary" @click="insertCheckList()">新增</el-button>
					</div>
				</el-dialog>
				<el-dialog title="年度检查表明细" :visible.sync="annCheckListDialog" width="70%" align="left">
					<div class="page-content" width="70%" align="left">
						<el-row>
							<el-form :inline="true">
								<el-form-item label="单位:"></el-form-item>
								<el-form-item>
									<el-input v-model="filterQuery.chosenCompany" readonly="true"></el-input>
								</el-form-item>
								&nbsp;
								<el-form-item label="年度:"></el-form-item>
								<el-form-item>
									<el-input v-model="filterQuery.chosenYear" readonly="true"></el-input>
								</el-form-item>
								&nbsp;
								<el-button type="primary" icon="el-icon-folder" ref="button" @click="addQHSEYearElement">保存</el-button>
							</el-form>
						</el-row>
						<el-row style="padding:10px; border-top: 2px dashed #dddddd;">
							<el-tree :data="filterQuery.elementTree" ref="tree" node-key="id" props="annCheckList" show-checkbox="true"
							 style="width: 70%;">
							</el-tree>
						</el-row>
					</div>
				</el-dialog>
			</el-row>
		</div>
	</div>
</template>

<script>
	import {
		GetCompany,
		GetQhseChildElement,
		GetQhseTable,
		insertQhseTable,
		deleteQhseTable,
		addQHSEYearElement,
		querryQhseElement,
		publishTableElement
	} from "../../../services/gettreedata"
	const DefaultQuery = {
		companyId: null,
		companyName: '',
		year: '',
		chosenCompany: null,
		chosenYear: '',
		
		insertCompanyId: '',
		
		
		insertStatus: '未发布',
		elementTree: [],
		//从后端得到的列表数据应当存入tableData，再经过筛选后在前端呈现出筛选后的selected
		selected: [],
		tableData: []
	}
	export default {
		data() {
			return {
				filterQuery: {},
				insertCompanyCode: null,
				insertCompanyName: '',
				insertYear: '',
				insertElementTableName: '',
				companyList: [],
				loading: false,
				treeNodeList: [],
				insertCheckListDialog: false,
				annCheckListShow: false,
				annCheckListDialog: false,
				isChild: true,
				querryQhseElement: {
					companyCode: '',
					year: ''
				},
				addData: {
					companyName: '',
					companyCode: '',
					year: '',
					elementTableName: ''
				},
				addQhseElementData: {
					codes: '',
					companyCode: '',
					companyName: '',
					year: '',
					qhseCompanyYearManagerSysElementTableID: ''
				},
				chosenConlumn: {
					qhse_CompanyYearManagerSysElementTable_ID: '',
					companyCode: '',
					conpanyName: '',
					year: ''
				}
			}
		},
		watch:{
			insertCompanyCode(){
				if(this.insertYear){
					this.bindIdToName(this.companyList, this.insertCompanyCode)
					this.insertElementTableName=this.insertYear.getFullYear()+this.insertCompanyName+"检查表"
				}
			},
			insertYear(){
				if(this.insertCompanyCode){
					this.bindIdToName(this.companyList, this.insertCompanyCode)
					this.insertElementTableName=this.insertYear.getFullYear()+this.insertCompanyName+"检查表"
				}
			}
		},
		methods: {
			//加载初始数据
			loadParams() {
				this.loading = true
				this.filterQuery = { ...DefaultQuery,
					...this.$route.query
				};
				this.filterQuery = {
					...this.filterQuery
				};
				this.selected
				GetQhseTable().then(res => {
					this.filterQuery.tableData = res.data
				})
				this.loading = false
			},
			//加载选择公司的树形列表
			handleGetCompany() {
				GetCompany().then(res => {
					this.companyList = res.data
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//实现查询按钮，根据公司名和年度查询对应记录
			handleSelect() {
				//获取到年度的yyyy格式数据
				if (this.filterQuery.year) {
					var data = new Date(this.filterQuery.year).getFullYear()
				}
				//当两个选择框为空，返回所有数据
				if (!data && !this.filterQuery.companyId) {
					this.filterQuery.selected = this.filterQuery.tableData
				} else {
					//当只有年度信息时所做查询
					if (data && !this.filterQuery.companyId) {
						this.filterQuery.selected = this.filterQuery.tableData.filter(item => {
							return item.year == data
						})
						//当只有公司信息时所做查询
					} else if (!data && this.filterQuery.companyId) {
						this.changeCompanyIdTocompanyName(this.companyList, this.filterQuery.companyId)
						this.filterQuery.selected = this.filterQuery.tableData.filter(item => {
							return item.companyName == this.filterQuery.companyName
						})
						//当有年度信息和公司信息时所做查询
					} else if (data && this.filterQuery.companyId) {
						this.changeCompanyIdTocompanyName(this.companyList, this.filterQuery.companyId)
						this.filterQuery.selected = this.filterQuery.tableData.filter(item => {
							return (item.year == data && item.companyName == this.filterQuery.companyName)
						})
					}
				}
			},
			//将从filterQuery.companyCode获取的公司id转换为公司名称，递归实现
			changeCompanyIdTocompanyName(val, companyId) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].id == companyId) {
							this.filterQuery.companyName = val[j].label
							break
						} else if (val[j].children) {
							this.changeCompanyIdTocompanyName(val[j].children, companyId)
						}
					}
				}
			},
			//点击列表中的某一列加载勾选要素表一二级节点
			handlChosen(val) {
				//如果鼠标点击到的是操作框，则不打开要素节点框，因为操作里有三个按钮，会影响到使用
				//如果记录状态不是“未发布”，表示该记录不能再进行操作
				//记录选中的该行数据
				this.chosenConlumn.companyCode = val.companyCode
				this.chosenConlumn.conpanyName = val.companyName
				this.chosenConlumn.year = val.year
				this.chosenConlumn.qhse_CompanyYearManagerSysElementTable_ID = parseInt(val.qhse_CompanyYearManagerSysElementTable_ID)
				//将选中行数据的公司名和年度显示
				this.filterQuery.chosenCompany = String(val.companyName);
				this.filterQuery.chosenYear = String(val.year)
				//组装要素查询数组
				this.querryQhseElement.companyCode = val.companyCode
				this.querryQhseElement.year = val.year
				//构建要素树
				this.handleGetQhseChildElement()
				//将已勾选的要素展示
				querryQhseElement(this.querryQhseElement).then(res => {
					var code = []
					for (var i = 0; i < res.data.length; i++) {
						code.push(res.data[i].code)
					}
					this.$refs.tree.setCheckedKeys(code, true)
				})
				console.log(this.filterQuery.elementTree)
				this.annCheckListDialog = true
			},
			//加载要素表的一二级节点
			handleGetQhseChildElement() {
				//从后端接口中获取对应的要素表的树，并构建出符合el-tree的数据组
				GetQhseChildElement().then(res => {
					this.creatTree(res.data, this.filterQuery.elementTree)
				}).catch(err => {
					this.$message.error(err.message)
				})

			},
			//构建要素表一二级节点树，由于el-tree所能显示的数据类型为{label:'',children:[]}，
			//而从接口中返回的数据类型为data，所以需要对数据进行转换，使得能够呈现
			creatTree(val, elementData) {
				for (var i = 0; i < val.length; i++) {
					if (val[i].name) {
						elementData[i] = {
							//id用于唯一标识该node，使用data中的code
							id: val[i].code,
							label: val[i].name,
							children: []
						}
					}
					//递归构造子节点
					if (val[i].childNode.length > 0) {
						this.creatTree(val[i].childNode, elementData[i].children)
					}
				}
			},
			//根据新增框中选择的公司名称得到公司id，名称，递归实现
			bindIdToName(val, companyId) {
				//根据传入的公司列表和公司id将id装换为对应的公司名称，并同时获得公司编号
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].id == companyId) {
							this.insertCompanyName = val[j].label;
							this.filterQuery.insertCompanyId = val[j].nodeCode;
							break;
						} else if (val[j].children) {
							this.bindIdToName(val[j].children, companyId);
						}
					}
				}
			},
			//显示新增记录的框
			openInsertCheckListDialog() {
				this.insertCompanyCode = null
				this.insertYear = ''
				this.insertCheckListDialog = true
			},
			//实现新增框的新增一列数据
			insertCheckList() {
				if (this.insertCompanyCode && this.insertYear) {
					this.isChild = true
					//关闭新增记录框
					this.checkCompany(this.companyList)
					if (this.isChild == false) {
						this.insertCompanyCode = null
						this.$message.error('公司选择错误，请重新选择')
					} else {
						//调用转换方法，将选中的公司id转换为公司名称
						this.bindIdToName(this.companyList, this.insertCompanyCode)
						//将新增记录框中的数据添加到准备好的数组中，组装出一条tabledate的数据
						this.addData.companyName = this.insertCompanyName
						this.addData.companyCode = this.insertCompanyId
						this.addData.year = this.insertYear.getFullYear().toString()
						this.addData.elementTableName = this.insertYear.getFullYear() + this.insertCompanyName +
							"检查表"
						//调用接口将新增的记录返回后端，并重新渲染tabledata
						insertQhseTable(this.addData).then(res => {
							if (res.code == '1000') {
								//重新获取tableData，重新渲染前端界面
								GetQhseTable().then(res => {
									this.filterQuery.tableData = res.data
									this.handleSelect()
								})
								this.$message({
									message: "添加成功",
									type: "success"
								})
							} else {
								this.$message.error('添加失败')
							}
						}).catch(err => {
							this.$message.error(err.message)
						})
						this.insertCheckListDialog = false
					}
				} else {
					this.$message.error('数据不完整')
				}
			},
			checkCompany(val) {
				for (var i = 0; i < val.length; i++) {
					if (val[i].id == this.insertCompanyCode) {
						if (val[i].children) {
							this.isChild = false
							break
						} else {
							this.isChild = true
							break
						}
					} else if (val[i].children) {
						this.checkCompany(val[i].children)
					}
				}
			},
			//年度检查表要素表一二级节点选中保存后并返回数据给后端
			addQHSEYearElement() {
				//关闭年度检查表明细框
				this.annCheckListDialog = false
				//初始化二级节点选择数组
				this.treeNodeList = []
				//装填数据
				this.treeNodeList = this.$refs.tree.getCheckedKeys()
				//将选中的复选框置空
				this.$refs.tree.setCheckedNodes([]);
				//去除一节节点
				for (var j = 0; j < this.treeNodeList.length; j++) {
					for (var k = 0; k < this.filterQuery.elementTree.length; k++) {
						if (this.filterQuery.elementTree[k].id == this.treeNodeList[j]) {
							/*
							 *spice(val1,val2,data[])方法为向数组添加或删除某一个元素，val1为操作位置，必需；val2为操作元素个数，如果为0则不删除元素，必需；
							 * data[]为添加的元素，非必需。当第三个参数为空时表示从val1位置开始删除val2个元素；当第三个元素不为空时，如果val2为0，则表示
							 * 向val1位置添加data[]，若val2不为0，则表示从val1位置开始将val2个元素替换为data[]
							 */
							this.treeNodeList.splice(j, 1);
							break;
						}
					}
				}
				//初始化新增要素记录数组
				this.addQhseElementData = {}
				//装填二级节点
				for (var i = 0; i < this.treeNodeList.length; i++) {
					if (!this.addQhseElementData.codes)
						this.addQhseElementData.codes = this.treeNodeList[i] + ";"
					else {
						this.addQhseElementData.codes = this.addQhseElementData.codes + this.treeNodeList[i] + ";"
					}
				}
				//装填公司状态，名字，年度，id
				this.addQhseElementData.companyCode = this.chosenConlumn.companyCode
				this.addQhseElementData.companyName = this.chosenConlumn.conpanyName
				this.addQhseElementData.year = this.chosenConlumn.year
				this.addQhseElementData.qhseCompanyYearManagerSysElementTableID = this.chosenConlumn.qhse_CompanyYearManagerSysElementTable_ID
				//调用接口向后端返回更新了的年度检查表要素表
				addQHSEYearElement(this.addQhseElementData).then(res => {
					if (res.code == '1000') {
						this.$message({
							message: '保存成功',
							type: 'success'
						})
					} else {
						this.$message.error('保存失败')
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//发布一列数据
			publishTable(val) {
				this.$confirm('确认发布本条记录吗', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					publishTableElement(val.qhse_CompanyYearManagerSysElementTable_ID).then(res => {
						if (res.code == '1000') {
							this.$message({
								message: '发布成功',
								type: 'success'
							})
							//发布成功，重新渲染前端界面，显示操作后的效果
							this.filterQuery.tableData.filter(item => {
								if (item == val) {
									item.status = '已发布'
								}
							})
						} else {
							this.$message.error('发布失败')
						}
					}).catch(err => {
						this.$message.error(err.message)
					})
				})
			},
			//删除一列数据，通过slot获取到一行的数据，从而可以得到id删除该行数据
			deleteTable(val) {
				this.$confirm('确认删除本条记录吗', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(() => {
					deleteQhseTable(val.qhse_CompanyYearManagerSysElementTable_ID.toString()).then(res => {
						if (res.code == '1000') {
							//重新渲染tableData，显示操作结果
							GetQhseTable().then(res => {
								console.log(res)
								this.filterQuery.tableData = res.data
								this.handleSelect()
							})
							this.$message({
								message: '删除成功',
								type: 'success'
							})
						} else {
							this.$message.error('删除失败')
						}
					}).catch(err => {
						this.$message.error(err.message)
					})
				})

			},
			// 批量新增
			addmuch () {
              this.$router.push({
				path: '/qhse_QualityManage/qhse_QualityFill/addmuch'
            })
			}
		},
		mounted() {
			this.loadParams()
			this.handleGetCompany()
			this.handleGetQhseChildElement()
		}
	}
</script>
<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 15px;
		padding-right: 8px;
	}
</style>
