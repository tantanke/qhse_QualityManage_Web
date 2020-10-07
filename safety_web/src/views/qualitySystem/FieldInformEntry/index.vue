<template>
	<div>
		<div class="page-title" style="width: 100%">现场信息录入</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :inline="true">
				<el-form-item label="受审单位:">
					<!-- -->
					<treeselect :multiple="false"  placeholder="请选择公司单位" style="width: 250px" :options="companyList"
					:disable-branch-nodes="true" 
					 v-model="companyId"></treeselect>
				</el-form-item>
				<el-form-item label="审核日期:">
					<el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="select()" style="margin-right: 15px;">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="warning" icon="el-icon-download">推送</el-button>
				</el-form-item> -->
			</el-form>
			<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
				<el-table :border="true" row-key="qualityCheckID" :data="checkListData">
					<el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
					<el-table-column prop="checkListName" label="检查表名称" align="center"></el-table-column>
					<el-table-column prop="checkPerson" label="监督人员" align="center"></el-table-column>
					<el-table-column prop="checkedCompanyName" label="受审单位" align="center"></el-table-column>
					<el-table-column prop="group" label="受审部门" align="center"></el-table-column>
					<el-table-column prop="checkDate" label="审核日期" align="center"></el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" @click="audit(scope.row)">审核</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</div>
	</div>
</template>

<script>
	import {
		getCompany,
		queryTableByYearAndComAndPush,
		queryCheckTreeByID
	} from "../../../services/qualitySystem/FieldInformEntry.js"
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser'
	const DefaultQuery = {}
	export default {
		data() {
			return {
				checkListData: [],
				loading: false,
				companyList: [],
				dateRange: [],
				companyName: '',
				companyId: null,
				companyCode: '',
				nature: '',
				//质量检查数据
				taskType: '',
				queryData: {
					checkedCompanyCode: '',
					checkDate: ''
				}
			}
		},
		mounted() {
			this.getCompany()
		},
		methods: {
			GetCurrentUser() {
				return GetCurrentUser();
			},
			select() {
				//console.log('user', this.GetCurrentUser())
				if (this.dateRange) {
					if (this.companyId && this.dateRange.length > 0) {
						this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
						this.queryData.checkedCompanyCode = this.companyCode
						this.queryData.checkDate = this.dateRange[0] + ';' + this.dateRange[1]
						console.log(this.queryData)
						queryTableByYearAndComAndPush(this.queryData).then(res=>{
							console.log(res.data)
							this.checkListData=res.data
						}).catch(err=>{
							this.$message.error(err.message)
						})
					}else{
						this.$message.error('查询信息不完整')
					}
				} else {
					this.$message.error('查询信息不完整')
				}

			},
			//将从filterQuery.companyCode获取的公司id转换为公司名称，递归实现
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
			getCompany() {
				getCompany().then(res => {
					console.log(res.data)
					this.companyList = res.data
				})
			},
			updateScore(row) {},

			beforeUpload(file) {
				console.log(file)
			},
			onSuccess() {
				console.log('上传成功')
			},
			onPreview(file) {},
			onRemove(file) {},
			onProgress(file) {},
			handleClick() {
				this.$refs.fileUpload.submit()
				this.checkDialog = false
			},
			audit(row) {
				console.log(row)
				this.$router.push({
					path: '/qualitySystem/FieldInformEntry/auditIndex',
					query:{
						qualityCheckData:row
					}
				})
			}
		}
	}
</script>

<style>
</style>
