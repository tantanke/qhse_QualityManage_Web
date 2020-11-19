<template>
	<div>
		<el-breadcrumb separator="/" class="bread">
			<el-breadcrumb-item :to="{ path: '/qualitySystem/problemCheck/problemCheck' }">问题审核</el-breadcrumb-item>
			<el-breadcrumb-item>问题复审</el-breadcrumb-item>
		</el-breadcrumb>
		<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
		</el-row>
		<div class="page-title" style="width: 100%">问题复审<span class="boxNew" v-if="isBelongToPart === true"><span class="progressData">{{progress}}</span>
				<el-button type="success" style="font-size: 16px" @click="finishReview">审核完成</el-button>
			</span></div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<!-- 问题复审列表区域 -->
			<el-table :data="problemReviewList" border stripe max-height="560px">
				<el-table-column type="index" label="序号" width="70px" align="center"></el-table-column>
				<el-table-column label="问题性质" prop="nature" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="问题描述" prop="description" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="责任单位" prop="responsiCompanyName" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="负责人" prop="responsePersonName" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="状态" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						<el-tag type="warning" v-if=" scope.row.isPush === '未整改'">{{scope.row.isPush}}</el-tag>
						<el-tag type="success" v-else-if=" scope.row.isPush === '验证已通过'">{{scope.row.isPush}}</el-tag>
						<el-tag type="success" v-else-if=" scope.row.isPush === '审核已通过'">{{scope.row.isPush}}</el-tag>
						<el-tag type="danger" v-else-if=" scope.row.isPush === '审核已打回'">{{scope.row.isPush}}</el-tag>
						<el-tag type="danger" v-else-if=" scope.row.isPush === '验证已打回'">{{scope.row.isPush}}</el-tag>
						<el-tag type="success" v-else-if="scope.row.isPush === '问题已整改'">{{scope.row.isPush}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="warning" icon="el-icon-success" size="mini" @click="problemViewLook(scope.row)" v-if="scope.row.isPush === '审核已通过' || scope.row.isPush === '审核已打回'">查看</el-button>
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="problemViewCheck(scope.row)" v-else>复审</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 问题审核对话框 -->
			<el-dialog title="问题复审" :close-on-click-modal="false" :visible.sync="problemCheckDialogVisible" width="50%" @close="problemCheckDialogClose">
				<!-- 问题审核表单 -->
				<el-form :model="problemCheckForm" label-width="140px" :rules="problemCheckFormRule" ref="problemCheckFormRef">
					<el-tabs v-model="activeIndex" :tab-position="'left'">
						<el-tab-pane label="基本信息" name="0">
							<el-form-item label="要素名称">
								<el-input v-model="problemCheckFormCheckName" readonly></el-input>
							</el-form-item>
							<el-form-item label="责任单位">
								<el-input v-model="problemCheckForm.responsiCompanyName" readonly></el-input>
							</el-form-item>
							<el-form-item label="负责人">
								<el-input v-model="problemCheckForm.responsePersonName" readonly></el-input>
							</el-form-item>
							<el-form-item label="问题描述">
								<el-input v-model="problemCheckForm.description" readonly></el-input>
							</el-form-item>
							<el-form-item label="问题性质">
								<el-input v-model="problemCheckForm.nature" readonly></el-input>
							</el-form-item>
							<el-form-item label="问题附件">
								<div v-for="(item, index) in fileProblemList" :key="index">
									<a :href="item.url" class="filelinks">{{item.fileName}}</a>
									<el-button type="text" size="mini" @click="preview(item.url)">预览</el-button>
								</div>

							</el-form-item>
							<el-form-item label="问题图片">
								<el-image style="width: 100px; height: 100px; margin: 0 15px" :src="item" :preview-src-list="imageList" v-for="(item, index) in imageList"
								 :key="index">
								</el-image>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="违章信息" name="1" v-if="problemCheckForm.nature === '违章项'">
							<el-form-item label="不符合标准">
								<el-input v-model="problemCheckForm.nonConformityStd" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款号">
								<el-input v-model="problemCheckForm.nonConformityStdNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款内容">
								<el-input v-model="problemCheckForm.nonConformityStdContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="不符合文件">
								<el-input v-model="problemCheckForm.nonConformClause" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款号">
								<el-input v-model="problemCheckForm.nonConformClauseNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款内容">
								<el-input v-model="problemCheckForm.nonConformClauseContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="处罚依据">
								<el-input v-model="problemCheckForm.punishmentBasis" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章条款号">
								<el-input v-model="problemCheckForm.violationClause" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章条款内容">
								<el-input v-model="problemCheckForm.violationClauseContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章扣款">
								<el-input v-model="problemCheckForm.violationDeduction" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章扣分">
								<el-input v-model="problemCheckForm.violationScore" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章人员">
								<el-input v-model="problemCheckForm.illegalPerson" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章人员岗位">
								<el-input v-model="problemCheckForm.post" readonly></el-input>
							</el-form-item>
							<el-form-item label="岗位分类">
								<el-input v-model="problemCheckForm.postType" readonly></el-input>
							</el-form-item>
							<el-form-item label="用工性质">
								<el-input v-model="problemCheckForm.employmentProperty" readonly></el-input>
							</el-form-item>
							<el-form-item label="工作年限">
								<el-input v-model="problemCheckForm.workingYears" readonly></el-input>
							</el-form-item>
							<el-form-item label="学历">
								<el-input v-model="problemCheckForm.education" readonly></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="问题信息" name="2" v-else-if="problemCheckForm.nature === '问题项'">
							<el-form-item label="不符合标准">
								<el-input v-model="problemCheckForm.nonConformityStd" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款号">
								<el-input v-model="problemCheckForm.nonConformityStdNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款内容">
								<el-input v-model="problemCheckForm.nonConformityStdContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="不符合文件">
								<el-input v-model="problemCheckForm.nonConformClause" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款号">
								<el-input v-model="problemCheckForm.nonConformClauseNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款内容">
								<el-input v-model="problemCheckForm.nonConformClauseContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="整改时限">
								<el-input v-model="problemCheckForm.reformLimit" readonly></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="观察信息" name="3" v-else-if="problemCheckForm.nature === '观察项'">
							<el-form-item label="观察描述">
								<el-input v-model="problemCheckForm.nonConformSource" readonly></el-input>
							</el-form-item>
							<el-form-item label="整改时限">
								<el-input v-model="problemCheckForm.reformLimit" readonly></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="不符合项" name="4" v-else-if="problemCheckForm.nature === '不符合'">
							<el-form-item label="不符合性质">
								<el-input v-model="problemCheckForm.nonConformityNature" readonly></el-input>
							</el-form-item>
							<el-form-item label="不符合类型">
								<el-input v-model="problemCheckForm.nonConformityType" readonly></el-input>
							</el-form-item>
							<el-form-item label="不符合标准">
								<el-input v-model="problemCheckForm.nonConformityStd" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款号">
								<el-input v-model="problemCheckForm.nonConformityStdNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款内容">
								<el-input v-model="problemCheckForm.nonConformityStdContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="不符合文件">
								<el-input v-model="problemCheckForm.nonConformClause" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款号">
								<el-input v-model="problemCheckForm.nonConformClauseNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款内容">
								<el-input v-model="problemCheckForm.nonConformClauseContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="整改时限">
								<el-input v-model="problemCheckForm.reformLimit" readonly></el-input>
							</el-form-item>
						</el-tab-pane>

						<el-tab-pane label="整改信息" name="5">
							<el-form-item label="不符合原因">
								<el-input v-model="problemCheckForm.nonConformSource" readonly></el-input>
							</el-form-item>
							<el-form-item label="纠正">
								<el-input v-model="problemCheckForm.nonConformCorrect" readonly></el-input>
							</el-form-item>
							<el-form-item label="纠正措施">
								<el-input v-model="problemCheckForm.nonConformCorrectMeasure" readonly></el-input>
							</el-form-item>
							<el-form-item label="整改完成时间">
								<el-input v-model="problemCheckForm.reformDate" readonly></el-input>
							</el-form-item>
							<el-form-item label="纠正附件">
								<div v-for="(item, index) in fileCorrectList" :key="index">
									<a :href="item.url" class="filelinks">{{item.fileName}}</a>
									<el-button type="text" size="mini" @click="preview(item.url)">预览</el-button>
								</div>
							</el-form-item>
							<el-form-item label="纠正图片">
								<el-image style="width: 100px; height: 100px; margin: 0 15px" :src="item" :preview-src-list="imageCorrectList"
								 v-for="(item, index) in imageCorrectList" :key="index">
								</el-image>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="验证信息" name="6">
							<el-form-item label="审核验证意见">
								<el-input style="border:1px solid red;border-radius:5px;" v-model="problemCheckForm.cheVerifyAdvice" placeholder="请填写验证意见"
								 type="textarea"></el-input>
							</el-form-item>
							<el-form-item label="审核结论">
								<el-input style="border:1px solid red;border-radius:5px" v-model="problemCheckForm.nonConformCorrectMeasureVerify"
								 placeholder="请填写纠正措施跟综验证" type="textarea"></el-input>
							</el-form-item>
							<el-form-item label="审核验证时间">
								<el-input v-model="problemCheckForm.cheVerifyDate" readonly></el-input>
							</el-form-item>
							<el-form-item label="审核验证人">
								<el-input v-model="problemCheckForm.cheVerifierName" readonly></el-input>
							</el-form-item>
							<el-form-item label="责任单位验证意见">
								<el-input v-model="problemCheckForm.resVerifyAdvice" readonly></el-input>
							</el-form-item>
							<el-form-item label="责任单位验证时间">
								<el-input v-model="problemCheckForm.resVerifyDate" readonly></el-input>
							</el-form-item>
							<el-form-item label="责任单位验证人">
								<el-input v-model="problemCheckForm.resVerifierName" readonly></el-input>
							</el-form-item>

						</el-tab-pane>
					</el-tabs>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button type="danger" icon="el-icon-close" @click="refuseProblemReview" v-if="isBelongToPart === true">打 回</el-button>
					<el-button type="primary" icon="el-icon-check" @click="acceptProblemReview" v-if="isBelongToPart === true">通 过</el-button>
					<el-button @click="problemCheckDialogVisible = false" v-else icon="el-icon-refresh-left">关 闭</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		getProblemReviewList,
		acceptProblemReviewData,
		refuseProblemReviewData,
		updateQualityCheckRecord,
		getOriginFileName,
		getQualityCheckList
	} from "../../../services/qualitySystem/problemReview"
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser'
	export default {
		data() {
			return {
				loading: false,
				activeIndex: '0',
				// 接收问题审核传递过来的数据
				acceptRow: {},
				// 问题复审表格数据
				problemReviewList: [],
				// 问题复审表单对象
				problemCheckForm: {},
				// 复审验证规则
				problemCheckFormRule: {
					nonConformCorrectMeasureVerify: [{
						required: true,
						message: '请输入跟综验证',
						trigger: 'blur'
					}]
				},
				//问题复审对话框显示与隐藏
				problemCheckDialogVisible: false,
				// 问题审核通过对象
				acceptReviewObject: {
					qualityCheckID: '',
					finishDate: '',
					isPush: '通过'
				},
				// 问题审核打回对象
				refuseReviewObject: {
					qualityCheckID: '',
					finishDate: '',
					isPush: '打回'
				},
				// 纠正措施跟综验证
				reviewConformCorrectMeasureVerify: '',
				// 问题图片
				imageList: [],
				// 问题文件
				fileProblemList: [],
				// 纠正图片
				imageCorrectList: [],
				// 纠正文件
				fileCorrectList: [],
				// 复审全部标志数组
				flagRecifyArray: [],
				// 复审全部通过标志数组
				flagAcceptArray: [],
				// 要素名
				checkName: '',
				// 表单要素名
				problemCheckFormCheckName: '',
				// 质量监督检查表名称
				qualityCheckList: [],
				// 是否属于这个部分
				isBelongToPart: false,
				// 表格要素名
				problemCheckName: ''
			}
		},
		methods: {
			getAcceptRow: function() {
				this.acceptRow = this.$route.query.queryData
				console.log('问题审核页面传递过来的数据')
				console.log(this.acceptRow)
				this.getQualityCheck()
				getProblemReviewList(this.acceptRow.qualityCheckID).then((res) => {
					console.log('查询质量检查id返回的数据')
					console.log(res.data)
					this.problemReviewList = res.data
					this.getProgress()
					if (this.acceptRow.isPush === "已推送" && this.acceptRow.issued === "已整改") {
						this.isBelongToPart = true
					} else {
						this.isBelongToPart = false
					}
					this.loading = false
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			getProblemDetailList: function(qualityCheckId) {
				// 获取问题复审表格列表
				getProblemReviewList(qualityCheckId).then((res) => {
					console.log('查询质量检查id返回的数据')
					console.log(res.data)
					this.problemReviewList = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			// 问题审核弹出对话框
			problemViewCheck: function(row) {
				let that = this
				that.imageList = []
				that.fileProblemList = []
				that.imageCorrectList = []
				that.fileCorrectList = []
				that.changeCheckListCodeToName(that.qualityCheckList, row.checkListCode)
				that.problemCheckFormCheckName = that.checkName
				that.problemCheckForm = row
				that.problemCheckForm.cheVerifierName = that.GetCurrentUser().employeeName
				that.problemCheckForm.cheVerifierID = that.GetCurrentUser().employeeId
				const path = 'http://39.98.173.131:7000/resources/QualityCheck/'
				// 问题图片
				if (that.problemCheckForm.problemPic) {
					const imgArray = that.problemCheckForm.problemPic.split(';');
					console.log(imgArray)
					for (let i in imgArray) {
						that.imageList.push(path + imgArray[i])
					}
					console.log('对话框打开之前问题图片拼接' + that.imageList)
				}

				// 问题文件
				if (that.problemCheckForm.problemAttach) {
					const fileArray = that.problemCheckForm.problemAttach.split(';')
					console.log(fileArray)
					for (let j in fileArray) {
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
					console.log('对话框打开之前问题文件拼接' + that.fileProblemList)
				}

				// 纠正图片
				if (that.problemCheckForm.correctPic) {
					const imgCorrectArray = that.problemCheckForm.correctPic.split(';');
					console.log(imgCorrectArray)
					for (let i in imgCorrectArray) {
						that.imageCorrectList.push(path + imgCorrectArray[i])
					}
					console.log('对话框打开之前纠正图片拼接' + that.imageCorrectList)
				}

				// 纠正文件
				if (that.problemCheckForm.correctAttach) {
					const fileCorrectArray = that.problemCheckForm.correctAttach.split(';')
					console.log(fileCorrectArray)
					for (let j in fileCorrectArray) {
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
					console.log('对话框打开之前纠正文件拼接' + that.fileCorrectList)
				}
				that.problemCheckDialogVisible = true
			},
			problemViewLook: function(row) {
				let that = this
				that.problemViewCheck(row)
			},
			acceptProblemReview: function() {
				// 问题审核通过
				this.problemCheckForm.reformDate = this.getRectifyDate()
				console.log('审核完成时间')
				console.log(this.problemCheckForm.reformDate)
				this.problemCheckForm.cheVerifyDate = this.getRectifyDate()
				console.log('审核验证时间' + this.problemCheckForm.cheVerifyDate)
				this.problemCheckForm.isPush = '审核已通过'
				console.log('问题审核通过表单数据')
				console.log(this.problemCheckForm)
				if (this.flagRecifyArray.length !== 0) {
					const flag = this.findOnly(this.flagRecifyArray, this.problemCheckForm.qulity_CheckRecordID)
					if (flag !== 1) {
						this.flagRecifyArray.push(this.problemCheckForm.qulity_CheckRecordID)
					}
				} else {
					this.flagRecifyArray.push(this.problemCheckForm.qulity_CheckRecordID)
				}

				console.log('复审全部标志数组')
				console.log(this.flagRecifyArray)
				if (this.flagAcceptArray.length !== 0) {
					const flag = this.findOnly(this.flagAcceptArray, this.problemCheckForm.qulity_CheckRecordID)
					if (flag !== 1) {
						this.flagAcceptArray.push(this.problemCheckForm.qulity_CheckRecordID)
					}
				} else {
					this.flagAcceptArray.push(this.problemCheckForm.qulity_CheckRecordID)
				}

				console.log('复审全部通过标志数组')
				console.log(this.flagAcceptArray)
				updateQualityCheckRecord(this.problemCheckForm.qulity_CheckRecordID, this.problemCheckForm).then((res) => {
					console.log(res.data)
					this.getProblemDetailList(this.acceptRow.qualityCheckID)
					this.problemCheckDialogVisible = false
					return this.$message.success('问题审核通过成功')
				}).catch((err) => {
					return this.$message.error(err.message)
				})
			},
			refuseProblemReview: function() {
				// 问题审核打回

				this.problemCheckForm.reformDate = ''
				console.log('审核完成时间')
				console.log(this.problemCheckForm.reformDate)
				this.problemCheckForm.cheVerifyDate = this.getRectifyDate()
				console.log('审核验证时间' + this.problemCheckForm.cheVerifyDate)
				this.problemCheckForm.isPush = '审核已打回'
				console.log('问题审核打回表单数据')
				console.log(this.problemCheckForm)
				if (this.flagRecifyArray.length !== 0) {
					const flag = this.findOnly(this.flagRecifyArray, this.problemCheckForm.qulity_CheckRecordID)
					if (flag !== 1) {
						this.flagRecifyArray.push(this.problemCheckForm.qulity_CheckRecordID)
					}
				} else {
					this.flagRecifyArray.push(this.problemCheckForm.qulity_CheckRecordID)
				}
				console.log('复审全部标志数组')
				console.log(this.flagRecifyArray)

				updateQualityCheckRecord(this.problemCheckForm.qulity_CheckRecordID, this.problemCheckForm).then((res) => {
					console.log(res.data)
					this.getProblemDetailList(this.acceptRow.qualityCheckID)
					this.problemCheckDialogVisible = false
					return this.$message.success('问题审核打回成功')
				}).catch((err) => {
					return this.$message.error(err.message)
				})
			},
			finishReview: async function() {
				// 审核完成
				console.log(this.flagRecifyArray.length)
				console.log(this.problemReviewList.length)
				console.log('全部通过数组')
				console.log(this.flagAcceptArray.length)
				if (this.flagRecifyArray.length === this.problemReviewList.length) {
					//问题审核传通过字段
					console.log('全部通过数组')
					console.log(this.flagAcceptArray.length)
					if (this.flagAcceptArray.length === this.problemReviewList.length) {
						const confirmResult = await this.$confirm('复审已完成，全部通过，数据即将归档, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).catch(err => err)
						if (confirmResult !== 'confirm') {
							return this.$message.info('已取消')
						}

						this.acceptReviewObject.qualityCheckID = this.acceptRow.qualityCheckID
						this.acceptReviewObject.finishDate = this.getRectifyDate()
						acceptProblemReviewData(this.acceptReviewObject).then((res) => {
							console.log(res.data)
							// 跳转问题审核页面
							this.$router.push({
								path: '/qualitySystem/problemCheck/problemCheck',
							})
							return this.$message.success('数据已归档')
						}).catch((err) => {
							return this.$message.error(err.message)
						})
					} else { // 问题审核传打回字段
						const confirmResult = await this.$confirm('复审已完成，未全部通过，数据即将打回, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).catch(err => err)
						if (confirmResult !== 'confirm') {
							return this.$message.info('已取消')
						}

						this.refuseReviewObject.qualityCheckID = this.acceptRow.qualityCheckID
						this.refuseReviewObject.finishDate = ''
						refuseProblemReviewData(this.refuseReviewObject).then((res) => {
							console.log(res.data)
							// 跳转问题审核页面
							this.$router.push({
								path: '/qualitySystem/problemCheck/problemCheck',
							})
							return this.$message.success('数据已打回')
						}).catch((err) => {
							return this.$message.error(err.message)
						})
					}
				} else {
					return this.$message.error('有问题尚未复审完成，请继续复审。')
				}
			},
			problemCheckDialogClose: function() {
				// 问题复审对话框关闭
				this.activeIndex = '0'
				this.imageCorrectList = []
				this.fileCorrectList = []
				this.imageList = []
				this.fileProblemList = []
			},
			getRectifyDate: function() {
				// 获取整改完成时间
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
			preview(url) {
				// 文件预览
				console.log('url', url)
				window.open('http://view.xdocin.com/xdoc?_xdoc=' + url)
			},
			getProgress: function() {
				// 获取进度
				for (let i in this.problemReviewList) {
					if (this.problemReviewList[i].isPush === '审核已打回' || this.problemReviewList[i].isPush === '审核已通过') {
						this.flagRecifyArray.push(this.problemReviewList[i].qulity_CheckRecordID)
					}
				}
				for (let j in this.problemReviewList) {
					if (this.problemReviewList[j].isPush === '审核已通过') {
						this.flagAcceptArray.push(this.problemReviewList[j].qulity_CheckRecordID)
					}
				}
				const length1 = this.problemReviewList.length
				const length2 = this.flagRecifyArray.length
				this.progress = length2 + '/' + length1
			},
			findOnly: function(arr, recordId) {
				// 查找标志数组有无相同元素
				var flagOnly = 0
				for (let i in arr) {
					if (arr[i] === recordId) {
						flagOnly = 1
						break
					}
				}
				return flagOnly
			},
			getQualityCheck: function() {
				// 获取质量监督检查表
				let that = this
				getQualityCheckList().then((res) => {
					console.log('质量监督检查表')
					console.log(res.data)
					that.qualityCheckList = res.data
				})
			},
			// 将检查表要素Code转化为名称
			changeCheckListCodeToName: function(val, checkCode) {
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
			// 将表格检查表要素Code转化为名称
			changeTabelCheckListCodeToName: function(val, checkCode) {
				let that = this
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].checkListCode == checkCode) {

							that.problemCheckName = val[j].checkListName
							console.log('表格检查表要素名称:' + val[j].checkListName)

						} else if (val[j].children) {
							that.changeCheckListCodeToName(val[j].children, checkCode)
						}
					}
				}
			},
			GetCurrentUser() {
				return GetCurrentUser()
			},
		},
		created: function() {
			this.loading = true
			this.getAcceptRow()
		},
		watch: {

		},
		computed: {
			progress: {
				get: function() {
					const length1 = this.problemReviewList.length
					const length2 = this.flagRecifyArray.length
					return length2 + '/' + length1
				},
				set: function() {

				}
			}
		}
	}
</script>

<style scoped>
	.bread {
		margin-bottom: 20px;
	}

	.filelinks {
		float: left;
		text-decoration: underline;
		color: #0099ff;
		margin: 0 15px;
	}

	.boxNew {
		display: inline-block;
		float: left;
		/* margin-right: 40px; */
	}

	.progressData {
		color: #67C23A;
		font-size: 22px;
		margin-right: 20px;
	}
</style>
