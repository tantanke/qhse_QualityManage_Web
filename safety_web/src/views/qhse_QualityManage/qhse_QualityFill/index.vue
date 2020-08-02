<template>
	<div>
		<div class="page-title" style="width: 100%">要素配置管理</div>
		<div class="page-content" v-loading="loading">
			<el-form label-width="130px" :inline="true" :model="filterQuery">
				<el-form-item label="选择公司:">
					<treeselect :multiple="false" placeholder="请选择公司单位" style="width: 200px" :options="companyList" v-model="filterQuery.companyId"></treeselect>
				</el-form-item>
				<el-form-item label="选择年份：">
					<el-date-picker type="year" placeholder="请选择年份" style="width:200px" v-model="filterQuery.year">
					</el-date-picker>
				</el-form-item>
				&nbsp;&nbsp;&nbsp;
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="handleSelect">查询</el-button>
					<el-button type="primary" icon='el-icon-plus' @click="insertCheckListDialog=true">新增</el-button>
					<el-button type="primary" icon='el-icon-plus' @click="addmuch">批量新增</el-button>
				</el-form-item>
			</el-form>
			<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
				<el-table :data="filterQuery.selected" style="width: 100%" max-height="560" border v-loading="loading">
					<el-table-column type="index" label="序号" width="100%" align="center"></el-table-column>
					<el-table-column prop="companyName" label="单位名称" width="250%" align="center"></el-table-column>
					<el-table-column prop="year" label="年度" width="100%" align="center"></el-table-column>
					<el-table-column prop="elementTableName" label="检查表名称" width="340%" align="center"></el-table-column>
					<el-table-column label="操作" width="270%" align="center">
						<template slot-scope="scope">
							<el-button type="primary" icon="el-icon-more" size="mini" @click="handlChosen(scope.row)">配置</el-button>
							<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTable(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog title="新增要素配置" :visible.sync="insertCheckListDialog" align="left" width="30%">
					<el-form :inline="true" label-width="90px" label-postion="left">
						<el-form-item label="请选择公司:">
							<treeselect :multiple="false" required="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
							 v-model="insertCompanyId"></treeselect>
						</el-form-item>
						<el-form-item label="请选择年份:">
							<el-date-picker type="year" required="true" placeholder="请选择年份" style="width:250px" v-model="insertYear">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="要素表名称:">
							<el-input placeholder="请输入要素表名称" style="width:250px;" v-model="insertElementTableName"></el-input>
						</el-form-item>
						<br />
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button icon='el-icon-refresh-left' type="primary" style="color: #000000;background-color: white;" @click="insertCheckListDialog=false">取消</el-button>
						<el-button icon='el-icon-plus' type="primary" @click="insertCheckList()">新增</el-button>
					</div>
				</el-dialog>
				<el-dialog title="要素表明细" :visible.sync="annCheckListDialog" width="70%" align="left">
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
		GetQhseElement,
		GetQhseChildElement,
		GetQhseTable,
		insertQhseTable,
		deleteQhseTable,
		addQHSEYearElement,
		querryQhseElement,
	} from "../../../services/gettreedata"
	const DefaultQuery = {
		companyId: null,
		companyName: '',
		companyCode: '',
		year: '',
		chosenCompany: null,
		chosenYear: '',
		elementTree: [],
		//从后端得到的列表数据应当存入tableData，再经过筛选后在前端呈现出筛选后的selected
		selected: [],
		tableData: []
	}
	export default {
		data() {
			return {
				filterQuery: {},
				insertCompanyCode: '',
				insertCompanyName: '',
				insertCompanyId: null,
				insertYear: '',
				insertElementTableName: '',
				isChild: true,
				companyList: [],
				loading: false,
				treeNodeList: [],
				insertCheckListDialog: false,
				annCheckListDialog: false,
				QhseElement: {
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
		watch: {
			//实时监测单位输入框和年度输入框数据变化，当两者都不为空时将表名字段填入
			insertCompanyId() {
				if (this.insertYear) {
					this.bindIdToName(this.companyList, this.insertCompanyId)
					this.insertElementTableName = this.insertYear.getFullYear() + this.insertCompanyName + "检查表"
				}
			},
			insertYear() {
				if (this.insertCompanyId) {
					this.bindIdToName(this.companyList, this.insertCompanyId)
					this.insertElementTableName = this.insertYear.getFullYear() + this.insertCompanyName + "检查表"
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
				}).catch(err => {
					this.$message.error(err.message)
				})
				this.loading = false
			},
			//加载选择公司的树形列表
			handleGetCompany() {
				GetCompany().then(res => {

					this.companyList = res.data
					console.log(this.companyList)
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//实现查询按钮，根据公司名和年度查询对应记录
			handleSelect() {
				this.isChild = true
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
						this.checkCompany(this.companyList, this.filterQuery.companyName)
						if (this.isChild == false) {
							this.filterQuery.companyId = null
							this.$message.error('公司选择错误，请重新选择')
						} else {

							this.filterQuery.selected = this.filterQuery.tableData.filter(item => {
								return item.companyName == this.filterQuery.companyName
							})
						}
						//当有年度信息和公司信息时所做查询
					} else if (data && this.filterQuery.companyId) {
						this.changeCompanyIdTocompanyName(this.companyList, this.filterQuery.companyId)
						this.checkCompany(this.companyList, this.filterQuery.companyName)
						if (this.isChild == false) {
							this.filterQuery.companyId = null
							this.$message.error('公司选择错误，请重新选择')
						} else {

							this.filterQuery.selected = this.filterQuery.tableData.filter(item => {
								return (item.year == data && item.companyName == this.filterQuery.companyName)
							})
						}

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
				//记录选中的该行数据
				this.chosenConlumn.companyCode = val.companyCode
				this.chosenConlumn.conpanyName = val.companyName
				this.chosenConlumn.year = val.year
				this.chosenConlumn.qhse_CompanyYearManagerSysElementTable_ID = parseInt(val.qhse_CompanyYearManagerSysElementTable_ID)
				//将选中行数据的公司名和年度显示
				this.filterQuery.chosenCompany = String(val.companyName);
				this.filterQuery.chosenYear = String(val.year)
				//组装要素查询数组
				this.QhseElement.companyCode = val.companyCode
				this.QhseElement.year = val.year
				//构建要素树
				this.handleGetQhseChildElement()
				//将已勾选的要素展示
				querryQhseElement(this.QhseElement).then(res => {
					console.log(res)
					var code = []
					for (var i = 0; i < res.data.length; i++) {
						code.push(res.data[i].code)
					}
					this.$refs.tree.setCheckedKeys(code, true)
				})
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
							this.insertCompanyCode = val[j].nodeCode;
							break;
						} else if (val[j].children) {
							this.bindIdToName(val[j].children, companyId);
						}
					}
				}
			},
			//显示新增记录的框
			openInsertCheckListDialog() {
				this.insertCompanyId = null
				this.insertCompanyCode = ''
				this.insertYear = ''
				this.insertElementTableName = ''
				this.insertCheckListDialog = true
			},
			//实现新增框的新增一列数据
			insertCheckList() {
				//判断单位和年度是否为空
				if (this.insertCompanyId && this.insertYear) {
					//判断单位是否为叶子结点标志，默认为true
					this.isChild = true
					//判断新增记录是否重复标志，默认为false
					var isCopy = false
					//调用转换方法，将选中的公司id转换为公司名称
					this.bindIdToName(this.companyList, this.insertCompanyId)
					//检查公司是否为叶子节点方法
					this.checkCompany(this.companyList, this.insertCompanyName)
					//单位不是叶子节点，将单位输入框重置，并提供提示信息
					if (this.isChild == false) {
						this.insertCompanyId = null
						this.insertCompanyCode = null
						this.$message.error('公司选择错误，请重新选择')
					} else {
						//遍历记录数组，检查将要新增的记录是否重复，重复时将输入框重置，并提供提示信息
						for (var i = 0; i < this.filterQuery.tableData.length; i++) {
							if (this.filterQuery.tableData[i].companyName == this.insertCompanyName && this.filterQuery.tableData[i].year ==
								this.insertYear.getFullYear().toString()) {
								this.insertCompanyId = null
								this.insertCompanyCode = ''
								this.insertYear = ''
								this.insertElementTableName = ''
								isCopy = true
								this.$message.error('该记录已存在')
								break
							}
						}
						//当将要新增的记录不重复时，进行新增记录操作
						if (isCopy == false) {
							//将新增记录框中的数据添加到准备好的数组中，组装出一条tabledate的数据
							this.addData.companyName = this.insertCompanyName
							this.addData.companyCode = this.insertCompanyCode
							this.addData.year = this.insertYear.getFullYear().toString()
							this.addData.elementTableName = this.insertElementTableName
							console.log(this.addData)
							//调用接口将新增的记录返回后端，并重新渲染tabledata
							insertQhseTable(this.addData).then(res => {
								if (res.code == '1000') {
									//重新获取tableData，重新渲染前端界面
									GetQhseTable().then(res => {
										console.log(res)
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
							//关闭新增记录框
							this.insertCheckListDialog = false
						}
					}
					//显示数据不完整的提示信息
				} else {
					this.$message.error('数据不完整')
				}
			},
			//递归检查公司是否为叶子节点方法
			checkCompany(val, company) {
				for (var i = 0; i < val.length; i++) {
					if (val[i].label == company) {
						if (val[i].children) {
							this.isChild = false
							break
						} else {
							this.isChild = true
							break
						}
					} else if (val[i].children) {
						this.checkCompany(val[i].children, company)
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
				console.log(this.addQhseElementData)
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
			//删除一列数据，通过slot获取到一行的数据，从而可以得到id删除该行数据
			deleteTable(val) {
				this.$confirm('确认删除本条记录吗?配置信息也将一并删除！', '提示', {
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
			addmuch() {
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
