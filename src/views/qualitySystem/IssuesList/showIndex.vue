<template>
	<div>
		<div class="page-title" style="width: 100%">问题列表</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-table border :data="qualityRecordList">
				<el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
				<el-table-column prop="checkListName" label="名称" align="center"></el-table-column>
				<el-table-column prop="nature" label="问题类型" align="center"></el-table-column>
				<el-table-column prop="description" label="问题描述"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="openDetailDialog(scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="问题详情" :visible.sync="detailDialog">
			<el-form :inline='true' label-width="100px" :label-postion="left">
				<el-row v-if="rowData.nature=='观察项'">
					<el-form-item label="不符合原因">
						<el-input readonly v-model="rowData.nonConformSource"></el-input>
					</el-form-item>
				</el-row>
				<el-row v-if="rowData.nature=='问题项'">
						<el-form-item label="条款名称">
						<el-input readonly v-model="rowData.nonConformityStd"></el-input>
					</el-form-item>
					<el-form-item label="条款编号">
						<el-input readonly v-model="rowData.nonConformClauseNo"></el-input>
					</el-form-item>
					<el-form-item label="条款内容">
						<el-input readonly v-model="rowData.nonConformClauseContent"></el-input>
					</el-form-item>
					
					<el-form-item label="不符合原因">
						<el-input readonly v-model="rowData.nonConformSource"></el-input>
					</el-form-item>
				</el-row>
				<el-row v-if="rowData.nature=='不符合'">
					<el-form-item label="条款名称">
						<el-input readonly v-model="rowData.nonConformityStd"></el-input>
					</el-form-item>
					<el-form-item label="条款编号">
						<el-input readonly v-model="rowData.nonConformClauseNo"></el-input>
					</el-form-item>
					<el-form-item label="条款内容" >
						<el-input readonly v-model="rowData.nonConformClauseContent"></el-input>
					</el-form-item>
					<el-form-item label="不符合原因">
						<el-input readonly v-model="rowData.nonConformSource"></el-input>
					</el-form-item>
					
					<el-form-item label="不符合性质">
						<el-input readonly v-model="rowData.nonConformityNature"></el-input>
					</el-form-item>
					<el-form-item label="不符合类型" >
						<el-input readonly v-model="rowData.nonConformityType"></el-input>
					</el-form-item>
				</el-row>
				<el-row v-if="rowData.nature=='违章项'">
					<el-form-item label="处罚依据">
						<el-input readonly v-model="rowData.punishmentBasis"></el-input>
					</el-form-item>
					<el-form-item label="违章条款">
						<el-input readonly v-model="rowData.violationClause"></el-input>
						</el-form-item>
					<el-form-item label="条款内容">
						<el-input readonly v-model="rowData.violationClauseContent"></el-input>
						</el-form-item>
					<el-form-item label="违章扣款">
						<el-input readonly v-model="rowData.violationDeduction"></el-input>
						</el-form-item>
					<el-form-item label="违章扣分">
						<el-input readonly v-model="rowData.violationScore"></el-input>
						</el-form-item>
					<el-form-item label="违章人员">
						<el-input readonly v-model="rowData.illegalPerson"></el-input>
						</el-form-item>
					<el-form-item label="岗位">
						<el-input readonly v-model="rowData.post"></el-input>
						</el-form-item>
					<el-form-item label="岗位分类" >
						<el-input readonly v-model="rowData.postType"></el-input>
						</el-form-item>
					<el-form-item label="用工性质">
						<el-input readonly v-model="rowData.employmentProperty"></el-input>
						</el-form-item>
					<el-form-item label="工作年限">
						<el-input readonly v-model="rowData.workingYears"></el-input>
						</el-form-item>
					<el-form-item label="学历" >
						<el-input readonly v-model="rowData.education"></el-input>
						</el-form-item>
				</el-row>
				<el-form-item label="整改时限">
					<el-input readonly v-model="rowData.reformLimit"></el-input>
				</el-form-item>
				<br/>
				<el-form-item label="问题附件">
					<div v-for="(item, index) in problemAttach" :key="index">
						<a style="margin: 5px;":href="item.url">{{item.fileName}}</a>
					</div>
					
				</el-form-item>
				<el-form-item label="问题图片">
					<el-image
					style="width: 100px;height: 100px;margin: 5px;"
					:src="item.url"
					:preview-src-list="problemPic"
					 v-for="(item, index) in problemPic" :key="index"
					></el-image>
				</el-form-item>
				<br />
				<el-form-item label="改正文件">
					<div v-for="(item, index) in correctAttach" :key="index">
						<a style="margin: 5px;" :href="item.url">{{item.fileName}}</a>
					</div>
					
				</el-form-item>
				<el-form-item label="改正图片">
					<el-image
					style="width: 100px;height: 100px;margin: 5px;"
					:src="item.url"
					:preview-src-list="correctPic"
					 v-for="(item, index) in correctPic" :key="index"
					></el-image>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button icon="el-icon-refresh-left" @click="detailDialog=false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		queryQualityCheckTree,
		queryQualityRecordList
	} from '../../../services/qualitySystem/issuesList.js'
	import{
		pictureDownload,
		getOriginFileName
	}from '../../../services/qualitySystem/FieldInformEntry.js'
	export default {
		data() {
			return {
				loading: false,
				showData: [],
				qualityCheckData: '',
				checkTree: '',
				qualityRecordList: [],
				detailDialog: false,
				checkListName:'',
				rowData: {},
				problemPic:[],
				correctPic:[],
				problemAttach:[],
				correctAttach:[],
				problemAttachName:[],
				correctAttachName:[],
				path:'http://39.98.173.131:7000/resources/QualityCheck/'
			}
		},
		mounted() {
			this.loadData()
		},
		methods: {
			loadData() {
				this.qualityCheckData = this.$route.query.qualityCheckData
				console.log('routeData', this.qualityCheckData)
				this.queryQualityCheckTree(this.qualityCheckData.checkListCode)
				this.queryQualityRecordList(this.qualityCheckData.qualityCheckID)

			},
			getCheckListName(tree, checkListCode) {
				for (var i = 0; i < tree.length; i++) {
					if (tree[i].checkListCode == checkListCode) {
						this.checkListName=tree[i].checkListName
						break
					} else if (tree[i].children) {
						this.getCheckListName(tree[i].children, checkListCode)
					}
				}
			},
			openDetailDialog(row) {
				this.rowData = row
				this.problemPic=this.splitPicPath(row.problemPic)
				this.correctPic=this.splitPicPath(row.correctPic)
				this.problemAttach=this.splitFilePath(row.problemAttach)
				this.correctAttach=this.splitFilePath(row.correctAttach)
				console.log('rowdata',this.rowData)
				this.detailDialog = true
			},
			splitPicPath(pathString){
				if(pathString){
					var targetArray=[]
					var temp=pathString.split(';')
					for(var i=0;i<temp.length;i++){
						var file={
							url:'',
							fileName:''
						}
						file.url=this.path+temp[i]
						targetArray.push(file)
					}
					return targetArray
				}
			},
			splitFilePath(pathString){
				if(pathString){
					var targetArray=[]
					var temp=pathString.split(';')
					console.log('patharray',temp)
					for(var i=0;i<temp.length;i++){
						var file={
							url:'',
							fileName:''
						}
						file.url=this.path+temp[i]
						getOriginFileName(temp[i]).then(res=>{
							file.fileName=res.data
						})
						targetArray.push(file)
					}
					console.log(targetArray)
					return targetArray
				}
			},
			queryQualityCheckTree(checkListCode) {
				queryQualityCheckTree(1).then(res => {
					if (res.code == '1000') {
						this.checkTree = res.data.filter(item => {
							return item.checkListCode == checkListCode
						})
						console.log('tree', this.checkTree)
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			queryQualityRecordList(qualityCheckID) {
				if (!qualityCheckID) {
					this.$router.push({
						path:'/qualitySystem/IssuesList/index'
					})
				}else{
					queryQualityRecordList(qualityCheckID).then(res => {
					if (res.code == '1000') {
						console.log('qualityRecordList', res.data)
						this.qualityRecordList = res.data
						for(var i=0;i<this.qualityRecordList.length;i++){
							this.getCheckListName(this.checkTree,this.qualityRecordList[i].checkListCode)
							this.qualityRecordList[i].checkListName=this.checkListName
						}
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
				}
			},
			pictureDownload(param){
				pictureDownload(param).then(res=>{
					console.log(res)
					this.srcList.push(res.preview)
				}).catch(err => {
					this.$message.error(err.message)
				})
			}
		}
	}
</script>

<style>
</style>
