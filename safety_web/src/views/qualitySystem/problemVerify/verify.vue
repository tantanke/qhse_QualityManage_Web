<template>
	<div>
		<el-breadcrumb separator="/" class="bread">
			<el-breadcrumb-item :to="{ path: '/qualitySystem/problemVerify/index' }">问题验证</el-breadcrumb-item>
			<el-breadcrumb-item>验证项</el-breadcrumb-item>
		</el-breadcrumb>
		<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
		</el-row>
		<div class="page-title" style="width: 100%">验证项<span class="allBtn"><span class="boxNew" v-if="isBelongToPart === true"><span
					 class="progressData">{{"进度："+ progress}}</span>
					<el-button type="success" style="font-size: 16px" @click="finishVerify">验证完成</el-button>
				</span><span class="btnDownload">
					<el-button icon="el-icon-download" type="primary" style="font-size: 16px" @click="downloadDialog">下载</el-button>
				</span></span></div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-table :data="problemVerifyList" border stripe>
				<el-table-column type="index" label="序号" width="70px" align="center"></el-table-column>
				<el-table-column label="问题性质" prop="nature" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="问题描述" prop="description" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="责任单位" prop="responsiCompanyName" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="负责人" prop="responsePersonName" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column label="状态" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						<el-tag type="success">{{scope.row.isPush}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="warning" icon="el-icon-success" size="mini" @click="problemViewLook(scope.row)" v-if="scope.row.isPush === '验证已打回' || scope.row.isPush === '验证已通过' || scope.row.isPush === '审核已通过'">查看</el-button>
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="problemViewVerify(scope.row)" v-else>验证</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 问题整改对话框 -->
			<el-dialog title="问题验证" :close-on-click-modal="false" :visible.sync="problemVerifyDialogVisible" width="50%" @close="problemVerifyDialogClose">
				<!-- 问题验证表单 -->
				<el-form :model="rectifyForm" label-width="140px" :rules="rectifyFormRule" ref="rectifyFormRef">
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
							<el-form-item label="问题附件">
								<a :href="item.url" v-for="(item, index) in fileProblemList" :key="index" class="filelinks">{{item.fileName}}</a>
							</el-form-item>
							<el-form-item label="问题图片">
								<el-image style="width: 100px; height: 100px; margin: 0 5px" :src="item" :preview-src-list="imageList" v-for="(item, index) in imageList"
								 :key="index">
								</el-image>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="违章信息" name="1" v-if="rectifyForm.nature === '违章项'">
							
							<el-form-item label="不符合标准">
								<el-input v-model="rectifyForm.nonConformityStd" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款号">
								<el-input v-model="rectifyForm.nonConformityStdNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款内容">
								<el-input v-model="rectifyForm.nonConformityStdContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="不符合文件">
								<el-input v-model="rectifyForm.nonConformClause" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款号">
								<el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款内容">
								<el-input v-model="rectifyForm.nonConformClauseContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="处罚依据">
								<el-input v-model="rectifyForm.punishmentBasis" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章条款号">
								<el-input v-model="rectifyForm.violationClause" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章条款内容">
								<el-input v-model="rectifyForm.violationClauseContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="违章扣款">
								<el-input v-model="rectifyForm.violationDeduction" readonly></el-input>
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
							<el-form-item label="标准条款号">
								<el-input v-model="rectifyForm.nonConformityStdNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款内容">
								<el-input v-model="rectifyForm.nonConformityStdContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="不符合文件">
								<el-input v-model="rectifyForm.nonConformClause" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款号">
								<el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款内容">
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
							<el-form-item label="标准条款号">
								<el-input v-model="rectifyForm.nonConformityStdNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="标准条款内容">
								<el-input v-model="rectifyForm.nonConformityStdContent" readonly></el-input>
							</el-form-item>
							<el-form-item label="不符合文件">
								<el-input v-model="rectifyForm.nonConformClause" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款号">
								<el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
							</el-form-item>
							<el-form-item label="文件条款内容">
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
							<el-form-item label="纠正">
								<el-input v-model="rectifyForm.nonConformCorrect" readonly></el-input>
							</el-form-item>
							<el-form-item label="纠正措施">
								<el-input v-model="rectifyForm.nonConformCorrectMeasure" type="textarea" readonly></el-input>
							</el-form-item>
							<el-form-item label="跟综验证">
								<el-input v-model="rectifyForm.nonConformCorrectMeasureVerify" readonly></el-input>
							</el-form-item>
							<el-form-item label="整改完成时间">
								<el-input v-model="rectifyForm.reformDate" readonly></el-input>
							</el-form-item>
							<el-form-item label="纠正附件">
								<a :href="item.url" class="filelinks" v-for="(item, index) in fileCorrectList" :key="index">{{item.fileName}}</a>
							</el-form-item>
							<el-form-item label="纠正图片">
								<el-image style="width: 100px; height: 100px; margin: 0 15px" :src="item" :preview-src-list="imageCorrectList"
								 v-for="(item, index) in imageCorrectList" :key="index">
								</el-image>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="验证信息" name="6">
							<el-form-item label="审核验证时间">
								<el-input v-model="rectifyForm.cheVerifyDate" readonly></el-input>
							</el-form-item>
							<el-form-item label="审核验证人">
								<el-input v-model="rectifyForm.cheVerifierName" readonly></el-input>
							</el-form-item>
							<el-form-item label="审核验证意见">
								<el-input v-model="rectifyForm.cheVerifyAdvice" readonly></el-input>
							</el-form-item>
							<el-form-item label="验证时间">
								<el-input v-model="rectifyForm.resVerifyDate" readonly></el-input>
							</el-form-item>
							<el-form-item label="验证人">
								<el-input v-model="rectifyForm.resVerifierName" readonly></el-input>
							</el-form-item>
							<el-form-item label="验证意见" prop="resVerifyAdvice">
								<el-input v-model="rectifyForm.resVerifyAdvice" type="textarea" placeholder="请填写验证意见"></el-input>
							</el-form-item>
						</el-tab-pane>
					</el-tabs>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button type="danger" @click="problemVerifyRefuse(rectifyForm.qulity_CheckRecordID)" v-if="isBelongToPart === true"
					 icon="el-icon-close">打 回</el-button>
					<el-button type="primary" @click="problemVerifySubmit(rectifyForm.qulity_CheckRecordID)" v-if="isBelongToPart === true"
					 icon="el-icon-check">通 过</el-button>
					<el-button @click="problemVerifyDialogVisible = false" v-else icon="el-icon-refresh-left">关 闭</el-button>

				</span>
			</el-dialog>
			<el-dialog title="下载" :close-on-click-modal="false" :visible.sync="downloadDialogVisible" @close="downloadDialogClosed"
			 width="50%">
				<span class="titleSpan">基本信息</span>
				<el-checkbox-group v-model="downloadSelectBasic">
					<el-checkbox class="checkBoxInfo" v-for="item in downloadBasic" :label="item" :key="item" disabled></el-checkbox>
				</el-checkbox-group>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center"></el-row>
				<span class="titleSpan">违章信息</span>
				<el-checkbox :indeterminate="isIndeterminateViolation" v-model="checkAllViolation" @change="handleCheckAllViolationChange">全选</el-checkbox>
				<el-checkbox-group v-model="downloadSelectViolation" @change="handleCheckedViolationChange">
					<el-checkbox class="checkBoxInfo" v-for="item in downloadViolation" :label="item" :key="item">{{item}}</el-checkbox>
				</el-checkbox-group>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center"></el-row>
				<span class="titleSpan">问题信息</span>
				<el-checkbox :indeterminate="isIndeterminateProblem" v-model="checkAllProblem" @change="handleCheckAllProblemChange">全选</el-checkbox>
				<el-checkbox-group v-model="downloadSelectProblem" @change="handleCheckedProblemChange">
					<el-checkbox class="checkBoxInfo" v-for="item in downloadProblem" :label="item" :key="item">{{item}}</el-checkbox>
				</el-checkbox-group>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center"></el-row>
				<span class="titleSpan">整改信息</span>
				<el-checkbox :indeterminate="isIndeterminateRectify" v-model="checkAllRectify" @change="handleCheckAllRectifyChange">全选</el-checkbox>
				<el-checkbox-group v-model="downloadSelectRectify" @change="handleCheckedRectifyChange">
					<el-checkbox class="checkBoxInfo" v-for="item in downloadRectify" :label="item" :key="item">{{item}}</el-checkbox>
				</el-checkbox-group>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center"></el-row>
				<span class="titleSpan">验证信息</span>
				<el-checkbox :indeterminate="isIndeterminateVerify" v-model="checkAllVerify" @change="handleCheckAllVerifyChange">全选</el-checkbox>
				<el-checkbox-group v-model="downloadSelectVerify" @change="handleCheckedVerifyChange">
					<el-checkbox class="checkBoxInfo" v-for="item in downloadVerify" :label="item" :key="item">{{item}}</el-checkbox>
				</el-checkbox-group>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center"></el-row>
				<span slot="footer" class="dialog-footer">
					<el-button @click="downloadDialogVisible = false" icon="el-icon-refresh-left">取 消</el-button>
					<el-button type="primary" @click="downloadFile" icon="el-icon-check">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		getProblemReviewList,
		refuseProblemReviewData,
		updateQualityCheckRecord,
		getOriginFileName,
		getQualityCheckList
	} from "../../../services/qualitySystem/problemReview"
	import {
		modifyPush
	} from "../../../services/qualitySystem/problemRectify"
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser'
	import ExportJsonExcel from "js-export-excel";

	const optionBasic = ['检查项', '问题分类', '责任单位', '责任单位负责人', '问题描述', '整改时限'];
	const optionViolation = ['处罚依据', '违章扣分', '违章人员', '违章扣款', '违章人员岗位', '违章条款内容', '岗位分类', '用工性质', '人员学历', '工作年限', '违章条款号'];
	const optionProblem = ['不符合性质', '不符合类型', '不符合标准', '不符合标准号', '不符合标准内容', '不符合条款', '不符合原因', '不符合条款号', '不符合条款内容'];
	const optionRectify = ['整改完成时间', '纠正', '纠正措施', '纠正跟综验证']
	const optionVerify = ['审核验证时间', '审核验证人', '审核验证意见', '责任单位验证时间', '责任单位验证人', '责任单位验证意见'];
	export default {
		data() {
			return {
				loading: false,
				activeIndex: '0',
				// 问题验证对话框显示与隐藏
				problemVerifyDialogVisible: false,
				// 下载对话框的隐藏与显示
				downloadDialogVisible: false,
				// 表格数据
				problemVerifyList: [],
				// 是否属于这个部分
				isBelongToPart: false,
				// 问题验证传过来的数据
				acceptRow: {},
				// 验证规则
				rectifyFormRule: {
					resVerifyAdvice: [{
						required: true,
						message: '请输入验证意见',
						trigger: 'blur'
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
				checkListNameArray: [],
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
				basicDown: [{
						chineseName: '检查项',
						englishName: 'checkListName',
						number: 1
					}, {
						chineseName: '问题分类',
						englishName: 'nature',
						number: 2
					},
					{
						chineseName: '责任单位',
						englishName: 'responsiCompanyName',
						number: 3
					}, {
						chineseName: '责任单位负责人',
						englishName: 'responsePersonName',
						number: 4
					}, {
						chineseName: '问题描述',
						englishName: 'description',
						number: 5
					}, {
						chineseName: '整改时限',
						englishName: 'reformLimit',
						number: 6
					}
				],
				// 下载总数据
				downloadAllData: [{
						chineseName: '检查项',
						englishName: 'checkListCode',
						number: 1
					}, {
						chineseName: '问题分类',
						englishName: 'nature',
						number: 2
					},
					{
						chineseName: '责任单位',
						englishName: 'responsiCompanyName',
						number: 3
					}, {
						chineseName: '责任单位负责人',
						englishName: 'responsePersonName',
						number: 4
					}, {
						chineseName: '问题描述',
						englishName: 'description',
						number: 5
					}, {
						chineseName: '整改时限',
						englishName: 'reformLimit',
						number: 6
					}, {
						chineseName: '处罚依据',
						englishName: 'punishmentBasis',
						number: 7
					}, {
						chineseName: '违章条款号',
						englishName: 'violationClause',
						number: 8
					}, {
						chineseName: '违章条款内容',
						englishName: 'violationClauseContent',
						number: 9
					}, {
						chineseName: '违章扣款',
						englishName: 'violationDeduction',
						number: 10
					}, {
						chineseName: '违章扣分',
						englishName: 'violationScore',
						number: 11
					}, {
						chineseName: '违章人员',
						englishName: 'illegalPerson',
						number: 12
					}, {
						chineseName: '违章人员岗位',
						englishName: 'post',
						number: 13
					}, {
						chineseName: '岗位分类',
						englishName: 'postType',
						number: 14
					}, {
						chineseName: '用工性质',
						englishName: 'employmentProperty',
						number: 16
					}, {
						chineseName: '人员学历',
						englishName: 'education',
						number: 17
					}, {
						chineseName: '工作年限',
						englishName: 'workingYears',
						number: 18
					}, {
						chineseName: '不符合性质',
						englishName: 'nonConformityNature',
						number: 19
					}, {
						chineseName: '不符合类型',
						englishName: 'nonConformityType',
						number: 20
					}, {
						chineseName: '不符合标准',
						englishName: 'nonConformityStd',
						number: 21
					}, {
						chineseName: '不符合标准号',
						englishName: 'nonConformityStdNo',
						number: 22
					}, {
						chineseName: '不符合标准内容',
						englishName: 'nonConformityStdContent',
						number: 23
					}, {
						chineseName: '不符合条款',
						englishName: 'nonConformClause',
						number: 24
					}, {
						chineseName: '不符合条款号',
						englishName: 'nonConformClauseNo',
						number: 25
					}, {
						chineseName: '不符合条款内容',
						englishName: 'nonConformClauseContent',
						number: 26
					}, {
						chineseName: '不符合原因',
						englishName: 'nonConformSource',
						number: 27
					}, {
						chineseName: '整改完成时间',
						englishName: 'reformDate',
						number: 28
					}, {
						chineseName: '纠正',
						englishName: 'nonConformCorrect',
						number: 29
					}, {
						chineseName: '纠正措施',
						englishName: 'nonConformCorrectMeasure',
						number: 30
					}, {
						chineseName: '纠正跟综验证',
						englishName: 'nonConformCorrectMeasureVerify',
						number: 31
					}, {
						chineseName: '审核验证时间',
						englishName: 'cheVerifyDate',
						number: 32
					}, {
						chineseName: '审核验证人',
						englishName: 'cheVerifierName',
						number: 33
					}, {
						chineseName: '审核验证意见',
						englishName: 'cheVerifyAdvice',
						number: 34
					}, {
						chineseName: '责任单位验证时间',
						englishName: 'resVerifyDate',
						number: 35
					}, {
						chineseName: '责任单位验证人',
						englishName: 'resVerifierName',
						number: 36
					}, {
						chineseName: '责任单位验证意见',
						englishName: 'resVerifyAdvice',
						number: 37
					}
				],
				// 排序数据
				violationDown: [],
				problemDown: [],
				rectifyDown: [],
				verifyDown: [],
				selectChineseData: [],
				selectEnglishData: [],
				// 下载基本信息数组对象
				downloadBasic: optionBasic,
				// 下载基本信息数组选中对象
				downloadSelectBasic: optionBasic,
				// 下载违章信息数组对象
				downloadViolation: optionViolation,
				// 下载违章信息选中数组对象
				downloadSelectViolation: [],
				// 下载违章全选
				isIndeterminateViolation: true,
				checkAllViolation: false,
				isIndeterminateProblem: true,
				checkAllProblem: false,
				// 下载问题信息选中数组
				downloadSelectProblem: [],
				// 下载问题信息数组
				downloadProblem: optionProblem,
				isIndeterminateRectify: true,
				checkAllRectify: false,
				// 下载整改信息选中数组
				downloadSelectRectify: [],
				// 下载信息数组
				downloadRectify: optionRectify,
				isIndeterminateVerify: true,
				checkAllVerify: false,
				// 下载验证信息选中数组
				downloadSelectVerify: [],
				// 下载验证信息
				downloadVerify: optionVerify

			}
		},
		methods: {
			// 接收问题验证主页面传递过来的数据
			getAcceptRow: function() {
				this.acceptRow = this.$route.query.queryData
				console.log('问题验证主页面页面传递过来的数据')
				console.log(this.acceptRow)
				this.getQualityCheck()
				this.getProblemVerify(this.acceptRow.qualityCheckID)
			},
			getProblemVerify: function(qualityCheckId) {
				// 获取问题验证表格列表
				getProblemReviewList(qualityCheckId).then((res) => {
					console.log('查询质量检查id返回的数据')
					console.log(res.data)
					this.problemVerifyList = res.data
					this.getProgress()
					if (this.acceptRow.isPush === "已推送" && this.acceptRow.issued === "已下达") {
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
			problemViewVerify: function(row) {
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
				if (that.rectifyForm.problemPic) {
					const imgArray = that.rectifyForm.problemPic.split(';');
					console.log(imgArray)
					for (let i in imgArray) {
						that.imageList.push(path + imgArray[i])
					}
					console.log('对话框打开之前问题图片拼接' + that.imageList)
				}

				// 问题文件
				if (that.rectifyForm.problemAttach) {
					const fileArray = that.rectifyForm.problemAttach.split(';')
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
				if (that.rectifyForm.correctPic) {
					const imgCorrectArray = that.rectifyForm.correctPic.split(';');
					console.log(imgCorrectArray)
					for (let i in imgCorrectArray) {
						that.imageCorrectList.push(path + imgCorrectArray[i])
					}
					console.log('对话框打开之前纠正图片拼接' + that.imageCorrectList)
				}

				// 纠正文件
				if (that.rectifyForm.correctAttach) {
					const fileCorrectArray = that.rectifyForm.correctAttach.split(';')
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
				that.problemVerifyDialogVisible = true
			},
			problemViewLook: function(row) {
				let that = this
				that.problemViewVerify(row)
			},
			handleCheckAllViolationChange: function(val) {
				// 违章全选
				console.log("违章全选" + val)
				this.downloadSelectViolation = val ? optionViolation : []
				this.isIndeterminateViolation = false
			},
			handleCheckAllProblemChange: function(val) {
				// 问题全选
				console.log("问题全选" + val)
				this.downloadSelectProblem = val ? optionProblem : []
				this.isIndeterminateProblem = false
			},
			handleCheckAllRectifyChange: function(val) {
				// 整改全选
				console.log("整改全选" + val)
				this.downloadSelectRectify = val ? optionRectify : []
				this.isIndeterminateRectify = false
			},
			handleCheckAllVerifyChange: function(val) {
				// 验证全选
				console.log("验证全选" + val)
				this.downloadSelectVerify = val ? optionVerify : []
				this.isIndeterminateVerify = false
			},
			handleCheckedViolationChange: function(value) {
				// 违章选项变动数组
				console.log("违章选中数组" + value)
				let checkedViolationCount = value.length
				this.checkAllViolation = checkedViolationCount === this.downloadViolation.length
				this.isIndeterminateViolation = checkedViolationCount > 0 && checkedViolationCount < this.downloadViolation.length
			},
			handleCheckedProblemChange: function(value) {
				// 问题信息数组选中
				console.log("问题选中数组" + value)
				let checkedProblemCount = value.length
				this.checkAllProblem = checkedProblemCount === this.downloadProblem.length
				this.isIndeterminateProblem = checkedProblemCount > 0 && checkedProblemCount < this.downloadProblem.length

			},
			handleCheckedRectifyChange: function(value) {
				// 整改信息选中数组
				console.log("整改选中数组" + value)
				let checkedRectifyCount = value.length
				this.checkAllRectify = checkedRectifyCount === this.downloadRectify.length
				this.isIndeterminateRectify = checkedRectifyCount > 0 && checkedRectifyCount < this.downloadRectify.length
			},
			handleCheckedVerifyChange: function(value) {
				// 验证信息选中数组
				console.log("验证选中数组" + value)
				let checkedVerifyCount = value.length
				this.checkAllVerify = checkedVerifyCount === this.downloadVerify.length
				this.isIndeterminateVerify = checkedVerifyCount > 0 && checkedVerifyCount < this.downloadVerify.length
			},
			problemVerifySubmit: function() {
				// 验证通过
				this.$refs.rectifyFormRef.validate(async (valid) => {
					if (!valid) {
						return this.$message.error('请填写验证意见')
					}
					this.rectifyForm.resVerifyDate = this.getVerifyDate()
					console.log('验证完成时间')
					console.log(this.rectifyForm.resVerifyDate)
					this.rectifyForm.isPush = '验证已通过'
					console.log('问题验证通过表单数据')
					console.log(this.rectifyForm)
					if (this.flagRecifyArray.length !== 0) {
						const flag = this.findOnly(this.flagRecifyArray, this.rectifyForm.qulity_CheckRecordID)
						if (flag !== 1) {
							this.flagRecifyArray.push(this.rectifyForm.qulity_CheckRecordID)
						}
					} else {
						this.flagRecifyArray.push(this.rectifyForm.qulity_CheckRecordID)
					}

					console.log('验证全部标志数组')
					console.log(this.flagRecifyArray)
					if (this.flagAcceptArray.length !== 0) {
						const flag = this.findOnly(this.flagAcceptArray, this.rectifyForm.qulity_CheckRecordID)
						if (flag !== 1) {
							this.flagAcceptArray.push(this.rectifyForm.qulity_CheckRecordID)
						}
					} else {
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
			problemVerifyRefuse: function() {
				// 验证打回
				this.$refs.rectifyFormRef.validate(async (valid) => {
					if (!valid) {
						return this.$message.error('请填写验证意见')
					}
					this.rectifyForm.resVerifyDate = this.getVerifyDate()
					console.log('验证完成时间')
					console.log(this.rectifyForm.resVerifyDate)
					this.rectifyForm.isPush = '验证已打回'
					console.log('问题验证打回表单数据')
					console.log(this.rectifyForm)
					if (this.flagRecifyArray.length !== 0) {
						const flag = this.findOnly(this.flagRecifyArray, this.rectifyForm.qulity_CheckRecordID)
						if (flag !== 1) {
							this.flagRecifyArray.push(this.rectifyForm.qulity_CheckRecordID)
						}
					} else {
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
			finishVerify: async function() {
				// 全部验证完成推送
				console.log(this.flagRecifyArray.length)
				console.log(this.problemVerifyList.length)
				console.log('全部通过数组')
				console.log(this.flagAcceptArray.length)
				if (this.flagRecifyArray.length === this.problemVerifyList.length) {
					if (this.flagAcceptArray.length === this.problemVerifyList.length) {
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
							// 跳转问题验证页面
							this.$router.push({
								path: '/qualitySystem/problemVerify/index',
							})
							return this.$message.success('推送成功')
						}).catch((err) => {
							return this.$message.error(err.message)
						})

					} else {
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
							// 跳转问题验证页面
							this.$router.push({
								path: '/qualitySystem/problemVerify/index',
							})
							return this.$message.success('数据已打回')
						}).catch((err) => {
							return this.$message.error(err.message)
						})
					}
				} else {
					return this.$message.error('有问题尚未验证完成，请继续验证。')
				}
			},
			problemVerifyDialogClose: function() {
				// 对话框关闭后
				this.activeIndex = '0'
				this.$refs.rectifyFormRef.resetFields()
				this.imageList = []
				this.fileProblemList = []
				this.imageCorrectList = []
				this.fileCorrectList = []
			},
			downloadFile: function() {
				// 下载表格
				for (let i in this.downloadAllData) {
					for (let j in this.downloadSelectViolation) {

						if (this.downloadSelectViolation[j] === this.downloadAllData[i].chineseName) {
							const obj = {
								chineseName: '',
								englishName: '',
								number: ''
							}
							obj.chineseName = this.downloadAllData[i].chineseName
							obj.englishName = this.downloadAllData[i].englishName
							obj.number = this.downloadAllData[i].number
							this.violationDown.push(obj)
						}
					}
					for (let k in this.downloadSelectProblem) {
						if (this.downloadSelectProblem[k] === this.downloadAllData[i].chineseName) {
							const obj = {
								chineseName: '',
								englishName: '',
								number: ''
							}
							obj.chineseName = this.downloadAllData[i].chineseName
							obj.englishName = this.downloadAllData[i].englishName
							obj.number = this.downloadAllData[i].number
							this.problemDown.push(obj)
						}
					}
					for (let l in this.downloadSelectRectify) {
						if (this.downloadSelectRectify[l] === this.downloadAllData[i].chineseName) {
							const obj = {
								chineseName: '',
								englishName: '',
								number: ''
							}
							obj.chineseName = this.downloadAllData[i].chineseName
							obj.englishName = this.downloadAllData[i].englishName
							obj.number = this.downloadAllData[i].number
							this.rectifyDown.push(obj)
						}
					}
					for (let n in this.downloadSelectVerify) {
						if (this.downloadSelectVerify[n] === this.downloadAllData[i].chineseName) {
							const obj = {
								chineseName: '',
								englishName: '',
								number: ''
							}
							obj.chineseName = this.downloadAllData[i].chineseName
							obj.englishName = this.downloadAllData[i].englishName
							obj.number = this.downloadAllData[i].number
							this.verifyDown.push(obj)
						}
					}
				}
				console.log('违章选中字段数组')
				console.log(this.downloadSelectViolationEng)
				console.log(this.violationDown)
				console.log('问题选中字段数组')
				console.log(this.downloadSelectProblemEng)
				console.log(this.problemDown)
				console.log('验证选中字段数组')
				console.log(this.downloadSelectVerifyEng)
				console.log(this.verifyDown)
				console.log('整改选中字段数组')
				console.log(this.downloadSelectRectifyEng)
				console.log(this.rectifyDown)
				for (let i in this.basicDown) {
					this.selectChineseData.push(this.basicDown[i].chineseName)
					this.selectEnglishData.push(this.basicDown[i].englishName)
				}
				for (let j in this.violationDown) {
					this.selectChineseData.push(this.violationDown[j].chineseName)
					this.selectEnglishData.push(this.violationDown[j].englishName)
				}
				for (let k in this.problemDown) {
					this.selectEnglishData.push(this.problemDown[k].englishName)
					this.selectChineseData.push(this.problemDown[k].chineseName)
				}
				for (let l in this.rectifyDown) {
					this.selectChineseData.push(this.rectifyDown[l].chineseName)
					this.selectEnglishData.push(this.rectifyDown[l].englishName)
				}
				for (let n in this.verifyDown) {
					this.selectEnglishData.push(this.verifyDown[n].englishName)
					this.selectChineseData.push(this.verifyDown[n].chineseName)
				}
				console.log(this.selectChineseData)
				console.log(this.selectEnglishData)
				for (let i in this.problemVerifyList) {
					this.problemVerifyList[i]['checkListName'] = this.checkListNameArray[i]
				}
				console.log('增加字段后的表格数组')
				console.log(this.problemVerifyList)
				var option = {}
				option.fileName = "质量监督检查问题清单"
				option.datas = [{
					sheetData: this.problemVerifyList,
					sheetFilter: this.selectEnglishData,
					sheetHeader: this.selectChineseData
				}]
				var toExcel = new ExportJsonExcel(option)
				toExcel.saveExcel()
				this.downloadDialogVisible = false
			},
			downloadDialog: function() {
				// 下载对话框打开
				if (this.acceptRow.issued != '已整改' || this.acceptRow.isPush != '已推送') {
					return this.$message.error('验证未完成，不能进行此操作，请继续验证')
				}
				this.getCheckListName(this.problemVerifyList, this.qualityCheckList)
				this.downloadDialogVisible = true
			},
			downloadDialogClosed: function() {
				// 下载对话框关闭
				this.downloadSelectViolation = []
				this.downloadSelectProblem = []
				this.downloadSelectRectify = []
				this.downloadSelectVerify = []
			},
			getProgress: function() {
				// 获取进度
				for (let i in this.problemVerifyList) {
					if (this.problemVerifyList[i].isPush === '验证已打回' || this.problemVerifyList[i].isPush === '验证已通过' || this.problemVerifyList[
							i].isPush === '审核已通过') {
						this.flagRecifyArray.push(this.problemVerifyList[i].qulity_CheckRecordID)
					}
				}
				for (let j in this.problemVerifyList) {
					if (this.problemVerifyList[j].isPush === '验证已通过' || this.problemVerifyList[j].isPush === '审核已通过') {
						this.flagAcceptArray.push(this.problemVerifyList[j].qulity_CheckRecordID)
					}
				}
				const length1 = this.problemVerifyList.length
				const length2 = this.flagRecifyArray.length
				this.progress = length2 + '/' + length1
			},
			getCheckListName: function(arr1, arr2) {
				for (let i in arr1) {
					let name = ''
					this.changeCheckListCodeToName(arr2, arr1[i].checkListCode)
					name = this.checkName
					this.checkListNameArray.push(name)
				}
				console.log('要素名数组')
				console.log(this.checkListNameArray)
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
			getVerifyDate: function() {
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
		created: function() {
			this.loading = true
			this.getAcceptRow()
		},
		computed: {
			progress: {
				get: function() {
					const length1 = this.problemVerifyList.length
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

	.btnDownload {
		display: inline-block;
		margin-left: 20px;
	}

	.checkBoxInfo {
		margin: 10px;
	}

	.titleSpan {
		margin-right: 20px;
	}
</style>
