<template>
	<div>
		<el-breadcrumb separator="/" class="bread">
		    <el-breadcrumb-item :to="{ path: '/qualitySystem/problemVerify/index' }">问题验证</el-breadcrumb-item>
		    <el-breadcrumb-item>验证项</el-breadcrumb-item>
		</el-breadcrumb>
		<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        </el-row>
        <div class="page-title" style="width: 100%">验证项<span class="boxNew" v-if="isBelongToPart === true"><span class="progressData">{{"进度："+ progress}}</span><el-button type="success" style="font-size: 16px" @click="finishVerify">验证完成</el-button></span></div>
		<div
			class="page-content"
			v-loading="loading" 
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading">
			<el-table :data="problemVerifyList" border stripe>
				<el-table-column type="index" label="序号" width="70px" align="center"></el-table-column>
                <el-table-column label="问题性质" prop="nature" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="问题描述" prop="description" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="责任单位" prop="responsiCompanyName" show-overflow-tooltip align="center"></el-table-column> 
                <el-table-column label="负责人" prop="responsePersonName" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-success" size="mini" @click="problemViewLook(scope.row)" v-if="scope.row.isPush === '验证已打回' || scope.row.isPush === '验证已通过' || scope.row.isPush === '已通过'">查看</el-button>
                        <el-button type="warning" icon="el-icon-edit" size="mini" @click="problemViewVerify(scope.row)" v-else>验证</el-button>
                    </template>
                </el-table-column>
			</el-table>
			 <!-- 问题整改对话框 -->
            <el-dialog
                title="问题验证"
                :visible.sync="problemVerifyDialogVisible"
                width="50%" @close="problemVerifyDialogClose">
                <!-- 问题验证表单 -->
                <el-form :model="rectifyForm" label-width="130px" :rules="rectifyFormRule" ref="rectifyFormRef">
                    <el-tabs v-model="activeIndex" :tab-position="'left'">
                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="要素名称">
                                <el-input v-model="rectifyFormCheckName" readonly></el-input>
                            </el-form-item>
							<el-form-item label="责任单位">
                                <el-input v-model="rectifyForm.responsiCompanyName" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="负责人">
                                <el-input v-model="rectifyForm.responsePersonName" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题描述">
                                <el-input v-model="rectifyForm.description" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题性质">
                                <el-input v-model="rectifyForm.nature" readonly></el-input>
                            </el-form-item>
							<el-form-item label="问题图片">
                                <el-image 
                                    style="width: 100px; height: 100px; margin: 0 5px"
                                    :src="item"
                                    :preview-src-list="imageList"
                                    v-for="(item, index) in imageList" :key="index">
                                </el-image>
                            </el-form-item>
                            <el-form-item label="问题附件">
								<a :href="item.url" v-for="(item, index) in fileProblemList" :key="index" class="filelinks">{{item.fileName}}</a>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="违章信息" name="1" v-if="rectifyForm.nature === '违章项'">
                        <el-form-item label="处罚依据">
                        <el-input v-model="rectifyForm.punishmentBasis" readonly></el-input>
                    </el-form-item>
                        <el-form-item label="违章条款号">
                        <el-input v-model="rectifyForm.violationClause" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="违章条款内容">
                        <el-input v-model="rectifyForm.violationClauseContent" readonly></el-input>
                    </el-form-item>
                        <el-form-item label="违章扣款">
                        <el-input v-model="rectifyForm.violationDeduction" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="违章扣分">
                        <el-input v-model="rectifyForm.violationScore" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="违章人员">
                        <el-input v-model="rectifyForm.illegalPerson" readonly></el-input>
                    </el-form-item>
            
                    <el-form-item label="违章人员岗位">
                        <el-input v-model="rectifyForm.post" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="岗位分类">
                        <el-input v-model="rectifyForm.postType" readonly></el-input>
                    </el-form-item>
                    
                    <el-form-item label="用工性质">
                        <el-input v-model="rectifyForm.employmentProperty" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="工作年限">
                        <el-input v-model="rectifyForm.workingYears" readonly></el-input>
                    </el-form-item>
               
                    <el-form-item label="学历">
                        <el-input v-model="rectifyForm.education" readonly></el-input>
                    </el-form-item>
					<el-form-item label="整改时限">
                        <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                    </el-form-item> 
                        </el-tab-pane>
						<el-tab-pane label="问题信息" name="2" v-else-if="rectifyForm.nature === '问题项'">
                            <el-form-item label="不符合标准">
                                <el-input v-model="rectifyForm.nonConformityStd" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准号">
                                <el-input v-model="rectifyForm.nonConformityStdNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准内容">
                                <el-input v-model="rectifyForm.nonConformityStdContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合条款">
                                <el-input v-model="rectifyForm.nonConformClause" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合条款号">
                                <el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合条款内容">
                                <el-input v-model="rectifyForm.nonConformClauseContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合原因">
                                <el-input v-model="rectifyForm.nonConformSource" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="整改时限">
                                <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                            </el-form-item> 
                        </el-tab-pane>
						<el-tab-pane label="观察信息" name="3" v-else-if="rectifyForm.nature === '观察项'">
                            <el-form-item label="不符合原因">
                                <el-input v-model="rectifyForm.nonConformSource" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="整改时限">
                                <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                            </el-form-item> 
                        </el-tab-pane>
                        <el-tab-pane label="不符合项" name="4" v-else-if="rectifyForm.nature === '不符合'">
                            <el-form-item label="不符合性质">
                                <el-input v-model="rectifyForm.nonConformityNature" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合类型">
                                <el-input v-model="rectifyForm.nonConformityType" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准">
                                <el-input v-model="rectifyForm.nonConformityStd" readonly></el-input>
                            </el-form-item>
							<el-form-item label="不符合标准号">
                                <el-input v-model="rectifyForm.nonConformityStdNo" readonly></el-input>
                            </el-form-item>
							<el-form-item label="不符合标准内容">
                                <el-input v-model="rectifyForm.nonConformityStdContent" readonly></el-input>
                            </el-form-item>
							<el-form-item label="不符合条款">
                                <el-input v-model="rectifyForm.nonConformClause" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合条款号">
                                <el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合条款内容">
                                <el-input v-model="rectifyForm.nonConformClauseContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合原因">
                                <el-input v-model="rectifyForm.nonConformSource" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="整改时限">
                                <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                            </el-form-item> 
                        </el-tab-pane>
                        <el-tab-pane label="整改信息" name="5">
                           <el-form-item label="整改完成时间">
                                <el-input v-model="rectifyForm.reformDate" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="跟综验证">
                                <el-input v-model="rectifyForm.nonConformCorrectMeasureVerify" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="纠正">
                                <el-input v-model="rectifyForm.nonConformCorrect" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="纠正措施">
                                <el-input v-model="rectifyForm.nonConformCorrectMeasure" type="textarea" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="纠正图片">
                                <el-image 
                                    style="width: 100px; height: 100px; margin: 0 15px"
                                    :src="item"
                                    :preview-src-list="imageCorrectList"
                                    v-for="(item, index) in imageCorrectList" :key="index">
                                </el-image>
                            </el-form-item>
                            <el-form-item label="纠正附件">
                                <a :href="item.url" class="filelinks" v-for="(item, index) in fileCorrectList" :key="index">{{item.fileName}}</a>
                            </el-form-item>
                        </el-tab-pane>
						<el-tab-pane label="验证信息" name="6">
							<el-form-item label="验证时间">
                                <el-input v-model="rectifyForm.resVerifyDate" readonly></el-input>
                            </el-form-item>
							<el-form-item label="验证人">
                                <el-input v-model="rectifyForm.resVerifierName" readonly></el-input>
                            </el-form-item>
							<el-form-item label="验证意见" prop="resVerifyAdvice">
                                <el-input v-model="rectifyForm.resVerifyAdvice" type="textarea" placeholder="请填写验证意见" ></el-input>
                            </el-form-item>
						</el-tab-pane>
                    </el-tabs>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="problemVerifyRefuse(rectifyForm.qulity_CheckRecordID)" v-if="isBelongToPart === true">打 回</el-button>
					<el-button type="primary"  @click="problemVerifySubmit(rectifyForm.qulity_CheckRecordID)" v-if="isBelongToPart === true">通 过</el-button>
                    <el-button @click="problemVerifyDialogVisible = false" v-else>关闭</el-button>
                    
                </span>
            </el-dialog>
		</div>
	</div>
</template>

<script>
import { getProblemReviewList, refuseProblemReviewData, updateQualityCheckRecord, getOriginFileName, getQualityCheckList}from "../../../services/qualitySystem/problemReview"
import { modifyPush } from "../../../services/qualitySystem/problemRectify"
import { GetCurrentUser } from '../../../store/CurrentUser'
	export default {
		data () {
			return {
				loading: false,
				activeIndex: '0',
				// 问题验证对话框显示与隐藏
				problemVerifyDialogVisible: false,
				// 表格数据
				problemVerifyList:[],
				// 是否属于这个部分
				isBelongToPart: false,
				// 问题验证传过来的数据
				acceptRow: {},
				// 验证规则
				rectifyFormRule :{
					resVerifyAdvice: [{
						required: true, message: '请输入验证意见', trigger: 'blur'
					}]
				},
				// 纠正图片
				imageCorrectList: [],
				// 纠正文件
				fileCorrectList: [],
				// 要素名
				checkName: '',
				// 表单要素名
				rectifyFormCheckName: '',
				// 质量监督检查表名称
				qualityCheckList: [],
				// 验证全部标志数组
				flagRecifyArray: [],
				// 验证全部通过标志数组
				flagAcceptArray: [],
				// 表单数据对象
				rectifyForm: {},
				// 问题图片
				imageList: [],
				// 问题文件
				fileProblemList: [],
				// 问题审核打回对象
				refuseReviewObject: {
					qualityCheckID: '',
					isPush: '打回'
				},
			}
		},
		methods: {
			// 接收问题验证主页面传递过来的数据
			getAcceptRow: function () {
				this.acceptRow = this.$route.query.queryData
				console.log('问题验证主页面页面传递过来的数据')
				console.log(this.acceptRow)
				this.getQualityCheck()
				this.getProblemVerify(this.acceptRow.qualityCheckID)
			},
			getProblemVerify: function (qualityCheckId) {
            // 获取问题验证表格列表
				getProblemReviewList(qualityCheckId).then((res) => {
					console.log('查询质量检查id返回的数据')
					console.log(res.data)
					this.problemVerifyList = res.data 
					this.getProgress()
					if(this.acceptRow.isPush === "已推送" && this.acceptRow.issued === "已下达"){
						this.isBelongToPart = true
					}else{
						this.isBelongToPart = false
					}
					this.loading = false
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			getProblemDetailList: function (qualityCheckId) {
				// 获取问题验证表格列表
				getProblemReviewList(qualityCheckId).then((res) => {
					console.log('查询质量检查id返回的数据')
					console.log(res.data)
					this.problemVerifyList = res.data   
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			// 问题验证弹出对话框
			problemViewVerify: function (row) {
				let that = this
				that.imageList = []
				that.fileProblemList = []
				that.imageCorrectList = []
				that.fileCorrectList = []
				that.changeCheckListCodeToName(that.qualityCheckList, row.checkListCode)
				that.rectifyFormCheckName = that.checkName
				that.rectifyForm = row
				that.getCurrentUser()
				const path = 'http://39.98.173.131:7000/resources/QualityCheck/'
				// 问题图片
				if(that.rectifyForm.problemPic){
					const imgArray = that.rectifyForm.problemPic.split(';');
					console.log(imgArray)
					for(let i in imgArray){
						that.imageList.push(path + imgArray[i])
					}
					console.log('对话框打开之前问题图片拼接'+that.imageList)
				}
				
				// 问题文件
				if(that.rectifyForm.problemAttach){
					const fileArray = that.rectifyForm.problemAttach.split(';')
					console.log(fileArray)
					for(let j in fileArray){
						const filePro = {
							url: '',
							fileName: ''
						}
						filePro.url = path + fileArray[j]
						getOriginFileName(fileArray[j]).then((res) => {
							console.log(res.data)
							filePro.fileName = res.data
							that.fileProblemList.push(filePro)
						})
					}
					console.log('对话框打开之前问题文件拼接'+that.fileProblemList)
				}
				
				// 纠正图片
				if(that.rectifyForm.correctPic){
					const imgCorrectArray = that.rectifyForm.correctPic.split(';');
					console.log(imgCorrectArray)
					for(let i in imgCorrectArray){
						that.imageCorrectList.push(path + imgCorrectArray[i])
					}
					console.log('对话框打开之前纠正图片拼接'+that.imageCorrectList)
				}
				
				// 纠正文件
				if(that.rectifyForm.correctAttach){
					const fileCorrectArray = that.rectifyForm.correctAttach.split(';')
					console.log(fileCorrectArray)
					for(let j in fileCorrectArray){
						const file = {
							url: '',
							fileName: ''
						}
						file.url = path + fileCorrectArray[j]
						getOriginFileName(fileCorrectArray[j]).then((res) => {
							console.log(res.data)
							file.fileName = res.data
							that.fileCorrectList.push(file)
						})
						
					}
					console.log('对话框打开之前纠正文件拼接'+that.fileCorrectList)
				}
				that.problemVerifyDialogVisible = true
			},
			problemViewLook: function (row) {
				let that = this
				that.problemViewVerify(row)
			},
			problemVerifySubmit: function () {
				// 验证通过
				this.$refs.rectifyFormRef.validate(async (valid) => {
					if(!valid){
						return this.$message.error('请填写验证意见')
					}
					this.rectifyForm.resVerifyDate = this.getVerifyDate()
					console.log('验证完成时间')
					console.log(this.rectifyForm.resVerifyDate)
					this.rectifyForm.isPush = '验证已通过'
					console.log('问题验证通过表单数据')
					console.log(this.rectifyForm)
					if(this.flagRecifyArray.length !== 0){
						const flag = this.findOnly(this.flagRecifyArray, this.rectifyForm.qulity_CheckRecordID)
						if(flag !== 1){
							this.flagRecifyArray.push(this.rectifyForm.qulity_CheckRecordID)
						}
					}else{
					this.flagRecifyArray.push(this.rectifyForm.qulity_CheckRecordID) 
					}
					
					console.log('验证全部标志数组')
					console.log(this.flagRecifyArray)
					if(this.flagAcceptArray.length !== 0){
						const flag = this.findOnly(this.flagAcceptArray, this.rectifyForm.qulity_CheckRecordID)
						if(flag !== 1){
							this.flagAcceptArray.push(this.rectifyForm.qulity_CheckRecordID)
						}
					}else{
						this.flagAcceptArray.push(this.rectifyForm.qulity_CheckRecordID)
					}
					
					console.log('验证全部通过标志数组')
					console.log(this.flagAcceptArray)
					updateQualityCheckRecord(this.rectifyForm.qulity_CheckRecordID, this.rectifyForm).then((res) => {
						console.log(res.data)
						this.getProblemDetailList(this.acceptRow.qualityCheckID)
						this.problemVerifyDialogVisible = false
						return this.$message.success('问题验证通过成功')
					}).catch((err) => {
						return this.$message.error(err.message)
					})
				})
					
			},
			problemVerifyRefuse: function () {
				// 验证打回
				this.$refs.rectifyFormRef.validate(async (valid) => {
					if(!valid){
						return this.$message.error('请填写验证意见')
					}
					this.rectifyForm.resVerifyDate = this.getVerifyDate()
					console.log('验证完成时间')
					console.log(this.rectifyForm.resVerifyDate)
					this.rectifyForm.isPush = '验证已打回'
					console.log('问题验证打回表单数据')
					console.log(this.rectifyForm)
					if(this.flagRecifyArray.length !== 0){
						const flag = this.findOnly(this.flagRecifyArray, this.rectifyForm.qulity_CheckRecordID)
						if(flag !== 1){
							this.flagRecifyArray.push(this.rectifyForm.qulity_CheckRecordID)
						}
					}else{
						this.flagRecifyArray.push(this.rectifyForm.qulity_CheckRecordID)
					}
					console.log('验证全部标志数组')
					console.log(this.flagRecifyArray)
					updateQualityCheckRecord(this.rectifyForm.qulity_CheckRecordID, this.rectifyForm).then((res) => {
						console.log(res.data)
						this.getProblemDetailList(this.acceptRow.qualityCheckID)
						this.problemVerifyDialogVisible = false
						return this.$message.success('问题验证打回成功')
					}).catch((err) => {
						return this.$message.error(err.message)
					})
				})
					
			},
			finishVerify: async function () {
				// 全部验证完成推送
				console.log(this.flagRecifyArray.length)
				console.log(this.problemVerifyList.length)
				console.log('全部通过数组')
				console.log(this.flagAcceptArray.length)
				if(this.flagRecifyArray.length === this.problemVerifyList.length){
					if(this.flagAcceptArray.length === this.problemVerifyList.length){
						const confirmResult = await this.$confirm('验证已完成，全部通过，数据即将传到问题审核, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).catch(err => err)
						if (confirmResult !== 'confirm') {
							return this.$message.info('已取消')
						}
						modifyPush(this.acceptRow.qualityCheckID).then((res) => {
							console.log(res.data)
							return this.$message.success('推送成功')
						}).catch((err) => {
							return this.$message.error(err.message)
						})
					
					}else {
						const confirmResult = await this.$confirm('验证已完成，未全部通过，数据即将打回，是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).catch(err => err)
						if (confirmResult !== 'confirm') {
							return this.$message.info('已取消')
						}
						this.refuseReviewObject.qualityCheckID = this.acceptRow.qualityCheckID
						refuseProblemReviewData(this.refuseReviewObject).then((res) => {
							console.log(res.data)
							return this.$message.success('数据已打回')
						}).catch((err) => {
							return this.$message.error(err.message)
						})
					}
				}else {
					return this.$message.error('有问题尚未验证完成，请继续验证。')
				}
				// if(this.flagRecifyArray.length === this.problemVerifyList.length){
				// 	const confirmResult = await this.$confirm('验证已完成，可以进行推送操作，是否继续?', '提示', {
				// 			confirmButtonText: '确定',
				// 			cancelButtonText: '取消',
				// 			type: 'warning'
				// 		}).catch(err => err)
				// 		if (confirmResult !== 'confirm') {
				// 			return this.$message.info('已取消')
				// 		}
				// 	modifyPush(this.acceptRow.qualityCheckID).then((res) => {
				// 		console.log(res.data)
				// 		return this.$message.success('推送成功')
				// 	})
				// }else {
				// 	return this.$message.error('有问题尚未验证完成，请继续整改。')
				// }
			},
			problemVerifyDialogClose: function () {
				// 对话框关闭后
				this.activeIndex = '0'
				this.$refs.rectifyFormRef.resetFields()
				this.imageList = []
				this.fileProblemList = []
				this.imageCorrectList = []
				this.fileCorrectList = []
			},
			getProgress: function () {
				// 获取进度
				for(let i in this.problemVerifyList){
					if(this.problemVerifyList[i].isPush === '验证已打回' || this.problemVerifyList[i].isPush === '验证已通过' || this.problemVerifyList[i].isPush === '已通过'){
						this.flagRecifyArray.push(this.problemVerifyList[i].qulity_CheckRecordID)
					}
				}
				const length1 = this.problemVerifyList.length
				const length2 = this.flagRecifyArray.length
				this.progress = length2 + '/' + length1
			},
			findOnly: function (arr, recordId) {
				// 查找标志数组有无相同元素
				var flagOnly = 0
				for(let i in arr) {
					if(arr[i] === recordId){
						flagOnly = 1
						break
					}
				}
				return flagOnly
			},
			getQualityCheck: function () {
            // 获取质量监督检查表
				let that = this
				getQualityCheckList().then((res) => {
					console.log('质量监督检查表')
					console.log(res.data)
					that.qualityCheckList = res.data
				})
			},
			// 将检查表要素Code转化为名称
			changeCheckListCodeToName: function (val,checkCode) {
				let that = this
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].checkListCode == checkCode) {
						
							that.checkName = val[j].checkListName
							console.log('检查表要素名称:' + val[j].checkListName)
							break
						} else if (val[j].children) {
							that.changeCheckListCodeToName(val[j].children, checkCode)
						}
					}
				}
			},
			getVerifyDate: function () {
				// 获取验证完成时间
				let date = new Date()
				console.log(date)
				let y = date.getFullYear()
				console.log(y)
				let m = date.getMonth() + 1
				console.log(m)
				m = m < 10 ? '0' + m : m
				let d = date.getDate()
				console.log(d)
				d = d < 10 ? '0' + d : d
				let str = y + '-' + m + '-' + d
				console.log(str)
				return str
			},
			// 获取当前用户
			getCurrentUser: function() {
				console.log(GetCurrentUser())
				const currentUser = GetCurrentUser()
				this.rectifyForm.resVerifierName = currentUser.employeeName
				this.rectifyForm.resVerifierID = currentUser.employeeId
			},
		},
		created: function () {
			this.loading = true
			this.getAcceptRow()
		},
		computed: {
			progress: {
				get: function () {
					const length1 = this.problemVerifyList.length
					const length2 = this.flagRecifyArray.length
					return length2 + '/' + length1
				},
				set: function () {

				}
			}
    	}
	}
</script>

<style scoped>
.detail {
    margin: 20px 0;
    color: #999;
}
.bread {
    margin-bottom: 20px;
}
.previewImg {
  width: 100%;
}
.filelinks {
    text-decoration: underline;
    color: #0099ff;
    margin: 0 15px;
}
.boxNew {
    display: inline-block;
    float: left;
    /* margin-right: 20px; */
}
.progressData {
    color: #67C23A;
    font-size: 22px;
    margin-right: 20px;
}
.historyPic {
    position: relative;
    float: left;
    width: 100px;
    height: 100px;
    margin: 0 5px;
}
.historyfile {
    margin-top: 40px;
}
.historyFile {
    float: left;
    height: 40px;
}
.iconBtns {
    position: absolute;
    top: 4px;
    right: 5px;
}
</style>
