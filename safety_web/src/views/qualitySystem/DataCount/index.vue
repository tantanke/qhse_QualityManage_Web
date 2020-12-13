<template>
	<div>
		<div class="page-title" style="width: 100%">数据统计</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form inline>
				<el-form-item label="受审单位" style="margin-right: 20px;">
					<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px;" :options="companyList"
					 v-model="companyId"></treeselect>
				</el-form-item>
				<el-form-item label="审核日期">
					<el-date-picker type="daterange" v-model="dateRange" value-format="yyyy-MM-dd" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button icon="el-icon-search" type="primary" @click="select">查询</el-button>
					<el-button icon="el-icon-search" type="primary" @click="openShowFilterDialog()">筛选</el-button>
					<el-button icon="el-icon-download" type="warning" @click="openDownloadOption()">下载</el-button>
				</el-form-item>
			</el-form>
			<el-table ref="table" stripe border :data="checkRecordList" style="width: 100%" max-height="600" fixed>
				<el-table-column type="expand" label="详情" width="60px">
					<template slot-scope="prop">
						<el-form label-width="80px" :label-position="left">
							<el-row>
								<el-col :span="12" v-if="prop.row.checkResult==='不符合'">
									<el-form-item label="问题附件">
										<div v-for="(item, index) in prop.row.problemAttach" :key="index">
											<a style="margin: 5px;" :href="item.url">{{item.fileName}}</a>
											<el-button type="text" size="mini" @click="preview(item.url)">预览</el-button>
										</div>
									</el-form-item>
									<el-form-item label="问题图片">
										<div v-for="(item, index) in prop.row.problemPic" :key="index" :inline="true" style="float: left;">
											<el-image style="width: 100px;height: 100px;margin: 5px;" :src="item" :preview-src-list="prop.row.problemPic"></el-image>
										</div>
									</el-form-item>
								</el-col>
								<el-col :span="12" v-if="prop.row.checkResult==='不符合'">
									<el-form-item label="纠正附件">
										<div v-for="(item, index) in prop.row.correctAttach" :key="index">
											<a style="margin: 5px;" :href="item.url">{{item.fileName}}</a>
											<el-button type="text" size="mini" @click="preview(item.url)">预览</el-button>
										</div>
									</el-form-item>
									<el-form-item label="纠正图片">
										<div v-for="(item, index) in prop.row.correctPic" :key="index" style="float: left;">
											<el-image style="width: 100px;height: 100px;margin: 5px;" :src="item" :preview-src-list="prop.row.correctPic"></el-image>
										</div>
									</el-form-item>
								</el-col>
								<el-col :span="25" v-if="prop.row.checkResult==='符合'">
									<el-form-item label="符合附件">
										<div v-for="(item, index) in prop.row.attach" :key="index">
											<a style="margin: 5px;" :href="item.url">{{item.fileName}}</a>
											<el-button type="text" size="mini" @click="preview(item.url)">预览</el-button>
										</div>
									</el-form-item>
									<el-form-item label="符合图片">
										<div v-for="(item, index) in prop.row.pic" :key="index">
											<el-image style="width: 100px;height: 100px;margin: 5px;float:left" :src="item" :preview-src-list="prop.row.pic"></el-image>
										</div>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column type="index" label="序号" width="60" align="center" show-overflow-tooltip></el-table-column>
				<!-- 基本信息列表项 -->
				<el-table-column v-for="(item,index) in BasicInfoItem" :key="index" :prop="item.englishName" :label="item.chineseName"
				 :width="(item.chineseName.length+1)*25" align="center" show-overflow-tooltip :filters="item.filter" :filter-method="filterHandler"
				 v-if="item.showStatus"></el-table-column>
				<!-- 问题信息列表 -->
				<el-table-column v-for="(item,index) in problemInfoItem" :key="index" :prop="item.englishName" :label="item.chineseName"
				 :width="(item.chineseName.length+1)*25" align="center" show-overflow-tooltip :filters="item.filter" :filter-method="filterHandler"
				 v-if="item.showStatus"></el-table-column>
				<!-- 实施信息列表项 -->
				<el-table-column v-for="(item,index) in impleInfoItem" :key="index" :prop="item.englishName" :label="item.chineseName"
				 :width="(item.chineseName.length+1)*25" align="center" show-overflow-tooltip :filters="item.filter" :filter-method="filterHandler"
				 v-if="item.showStatus"></el-table-column>
				<!-- 不符合信息列表项 -->
				<el-table-column v-for="(item,index) in nonconformInfoItem" :key="index" :prop="item.englishName" :label="item.chineseName"
				 :width="(item.chineseName.length+1)*25" align="center" show-overflow-tooltip :filters="item.filter" :filter-method="filterHandler"
				 v-if="item.showStatus"></el-table-column>
				<!-- 违章项列表项 -->
				<el-table-column v-for="(item,index) in violationInfoItem" :key="index" :prop="item.englishName" :label="item.chineseName"
				 :width="(item.chineseName.length+1)*25" align="center" show-overflow-tooltip :filters="item.filter" :filter-method="filterHandler"
				 v-if="item.showStatus"></el-table-column>
				<!-- 纠正列表项 -->
				<el-table-column v-for="(item,index) in correctItem" :key="index" :prop="item.englishName" :label="item.chineseName"
				 :width="(item.chineseName.length+1)*25" align="center" show-overflow-tooltip :filters="item.filter" :filter-method="filterHandler"
				 v-if="item.showStatus"></el-table-column>
			</el-table>
			<el-dialog title="下载选项" :visible.sync="downloadOptionDialog" align="left" width="60%" :close-on-click-modal="false">
				<el-row>
					<span>审核计划基本信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" v-model="downloadAllcheck[0]" label="全选" @change="allCheck($event,'planBasisInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in BasicInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.downloadStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>审核实施基本信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" v-model="downloadAllcheck[1]" label="全选" @change="allCheck($event,'impleBasisInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in impleInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.downloadStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>审核要素问题信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" v-model="downloadAllcheck[2]" label="全选" @change="allCheck($event,'problemInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in problemInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.downloadStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>不符合信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" v-model="downloadAllcheck[3]" label="全选" @change="allCheck($event,'nonConformityInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in nonconformInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.downloadStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>违章信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" v-model="downloadAllcheck[4]" label="全选" @change="allCheck($event,'violationInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in violationInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.downloadStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>验证及纠正信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" v-model="downloadAllcheck[5]" label="全选" @change="allCheck($event,'verifyAndcorInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in correctItem" :key="index" :label="item.chineseName"
					 v-model="item.downloadStatus"></el-checkbox>
				</el-row>
				<span slot="footer" class="dialog-footer">
					<el-button icon="el-icon-refresh-left" @click="downloadOptionDialog=false">关闭</el-button>
					<el-button icon="el-icon-folder" type="primary" @click="saveDownloadFileterOption">保存</el-button>
				</span>
			</el-dialog>
			<el-dialog title="列表展示列筛选" :visible.sync="showFilterOptionDialog" align="left" width="60%" :close-on-click-modal="false">
				<el-row>
					<span>审核计划基本信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="showAllcheck[0]" @change="showFilterAllCheck($event,'planBasisInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in BasicInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.showStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>审核实施基本信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="showAllcheck[1]" @change="showFilterAllCheck($event,'impleBasisInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in impleInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.showStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>审核要素问题信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="showAllcheck[2]" @change="showFilterAllCheck($event,'problemInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in problemInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.showStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>不符合信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="showAllcheck[3]" @change="showFilterAllCheck($event,'nonConformityInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in nonconformInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.showStatus"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>违章信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="showAllcheck[4]" @change="showFilterAllCheck($event,'violationInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in violationInfoItem" :key="index" :label="item.chineseName"
					 v-model="item.showStatus">
					</el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>验证及纠正信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="showAllcheck[5]" @change="showFilterAllCheck($event,'verifyAndcorInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" v-for="(item,index) in correctItem" :key="index" :label="item.chineseName"
					 v-model="item.showStatus"></el-checkbox>
				</el-row>
				<span slot="footer" class="dialog-footer">
					<el-button icon="el-icon-refresh-left" @click="showFilterOptionDialog=false">关闭</el-button>
					<el-button icon="el-icon-folder" type="primary" @click="saveShowFileterOption">保存</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		queryAllTable,
		queryQualityRecordList,
		queryCheckTreeByID,
		queryAllPassTable,
		GetCompany
	} from '../../../services/qualitySystem/dataCount.js'
	import {
		getOriginFileName
	} from '../../../services/qualitySystem/FieldInformEntry.js'
	import ExportJsonExcel from "js-export-excel";
	export default {
		data() {
			return {
				loading: false,
				downloadOptionDialog: false,
				showFilterOptionDialog: false,
				dateRange: [],
				path: 'http://39.98.173.131:7000/resources/QualityCheck/',
				qualityCheckList: [],
				qualityRecordList: [],
				qualityCheckTree: [],
				checkRecordList: [],
				downloadSource: [],
				tableData: [],
				companyList: [],
				companyName: '',
				companyId: null,
				companyCode: '',
				checkResult: '',
				//列表展示全选筛选变量
				downloadAllcheck: [false, false, false, false, false, false],
				showAllcheck: [false, false, false, false, false, false],
				BasicInfoItem: [{
					englishName: 'qualityCheckName',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '审核任务名称'
				}, {
					englishName: 'checkCategory',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '审核类别'
				}, {
					englishName: 'checkBasis',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '审核依据'
				}, {
					englishName: 'checkMethod',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '审核方式'
				}, {
					englishName: 'checkedCompanyName',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '受审单位'
				}, {
					englishName: 'checkedPersonName',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '受审单位负责人'
				}, {
					englishName: 'group',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '受审室组'
				}, {
					englishName: 'groupLeaderName',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '室组负责人'
				}, {
					englishName: 'projectName',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '作业项目名称'
				}, {
					englishName: 'projectLeaderName',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '项目组长'
				}, {
					englishName: 'checkPerson',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '审核人员'
				}, {
					englishName: 'checkDate',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '审核时间'
				}],
				//审核实施基本信息，第二项
				impleInfoItem: [{
					englishName: 'checkProject',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '检测项目'
				}, {
					englishName: 'execStd',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '检测标准'
				}, {
					englishName: 'contractor',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '承包商'
				}, {
					englishName: 'contractorNumber',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '承包商数量'
				}, {
					englishName: 'owner',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '业主'
				}, {
					englishName: 'workPlace',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '作业地点'
				}, {
					englishName: 'workerNumber',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '作业人数'
				}, {
					englishName: 'erpNumber',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: 'ERP员工数量'
				}, {
					englishName: 'externalNumber',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '外聘员工数量'
				}],
				//审核要素问题信息，第三项
				problemInfoItem: [{
					englishName: 'checkListName',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '审核要素名称'
				}, {
					englishName: 'checkResult',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '审核结果'
				}, {
					englishName: 'resultDescription',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '结果描述'
				}, {
					englishName: 'nature',
					showStatus: true,
					downloadStatus: false,
					filter: [],
					chineseName: '问题分类'
				}, {
					englishName: 'problemDescription',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '问题描述'
				}, {
					englishName: 'responsiCompanyName',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '责任单位'
				}, {
					englishName: 'responsePersonName',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '责任人'
				}],
				//不符合信息，第四项
				nonconformInfoItem: [{
					englishName: 'nonConformityType',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '不符合类型'
				}, {
					englishName: 'nonConformityNature',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '不符合性质'
				}, {
					englishName: 'nonConformSource',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '不符合原因'
				}, {
					englishName: 'nonConformityStd',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '不符合标准'
				}, {
					englishName: 'nonConformityStdNo',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '标准条款号'
				}, {
					englishName: 'nonConformityStdContent',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '标准条款内容'
				}, {
					englishName: 'nonConformClause',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '不符合文件'
				}, {
					englishName: 'nonConformClauseNo',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '文件条款号'
				}, {
					englishName: 'nonConformClauseContent',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '文件条款内容'
				}, ],
				//违章信息，第五项
				violationInfoItem: [{
					englishName: 'punishmentBasis',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '处罚依据'
				}, {
					englishName: 'violationClause',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '违章条款号'
				}, {
					englishName: 'violationClauseContent',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '违章条款内容'
				}, {
					englishName: 'violationDeduction',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '违章扣款'
				}, {
					englishName: 'violationScore',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '违章扣分'
				}, {
					englishName: 'illegalPerson',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '违章人员'
				}, {
					englishName: 'post',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '岗位'
				}, {
					englishName: 'postType',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '岗位分类'
				}, {
					englishName: 'employmentProperty',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '用工性质'
				}, {
					englishName: 'workingYears',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '工作年限'
				}, {
					englishName: 'education',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '学历'
				}],
				//验证及纠正措施，第六项
				correctItem: [{
					englishName: 'resVerifierName',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '责任单位验证人'
				}, {
					englishName: 'resVerifyDate',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '责任单位验证时间'
				}, {
					englishName: 'resVerifyAdvice',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '责任单位验证意见'
				}, {
					englishName: 'cheVerifierName',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '审核单位验证人'
				}, {
					englishName: 'cheVerifyDate',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '审核单位验证时间'
				}, {
					englishName: 'cheVerifyAdvice',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '审核单位验证意见'
				}, {
					englishName: 'nonConformCorrect',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '纠正'
				}, {
					englishName: 'nonConformCorrectMeasure',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '纠正措施'
				}, {
					englishName: 'nonConformCorrectMeasureVerify',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '跟踪验证'
				}, {
					englishName: 'reformLimit',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '整改时限'
				}, {
					englishName: 'reformDate',
					showStatus: false,
					downloadStatus: false,
					filter: [],
					chineseName: '整改完成时间'
				}],
				//下载用数组
				downloadList: [],
				downloadEnglishList: [],
				downloadChineseList: [],
			}
		},
		mounted() {
			this.queryAllPassTable()
			this.GetCompany()
		},
		methods: {
			//预览文件，使用外部插件
			preview(url) {
				if(url){
					window.open('http://39.98.173.131:8012/onlinePreview?url='+encodeURIComponent(url))
				}
			},
			//下载选项框中全选按钮的点击事件，全选或撤销全选时对对应的组进行操作
			allCheck(event, option) {
				switch (option) {
					//基本信息组
					case 'planBasisInfo':
						if (event) {
							for (var i = 0; i < this.BasicInfoItem.length; i++) {
								this.BasicInfoItem[i].downloadStatus = true
								this.getOption(true, this.BasicInfoItem[i])
							}
						} else {
							for (var i = 0; i < this.BasicInfoItem.length; i++) {
								this.BasicInfoItem[i].downloadStatus = false
								this.getOption(false, this.BasicInfoItem[i])
							}
						}
						break
					//审核实施组
					case 'impleBasisInfo':
						if (event) {
							for (var i = 0; i < this.impleInfoItem.length; i++) {
								this.impleInfoItem[i].downloadStatus = true
								this.getOption(true, this.impleInfoItem[i])
							}
						} else {
							for (var i = 0; i < this.impleInfoItem.length; i++) {
								this.impleInfoItem[i].downloadStatus = false
								this.getOption(false, this.impleInfoItem[i])
							}
						}
						break
					//问题项组
					case 'problemInfo':
						if (event) {
							for (var i = 0; i < this.problemInfoItem.length; i++) {
								this.problemInfoItem[i].downloadStatus = true
								this.getOption(true, problemInfoItem[i])
							}
						} else {
							for (var i = 0; i < this.problemInfoItem.length; i++) {
								this.problemInfoItem[i].downloadStatus = false
								this.getOption(false, this.problemInfoItem[i])
							}
						}
						break
					//不符合项组
					case 'nonConformityInfo':
						if (event) {
							for (var i = 0; i < this.nonconformInfoItem.length; i++) {
								this.nonconformInfoItem[i].downloadStatus = true
								this.getOption(true, nonconformInfoItem[i])
							}
						} else {
							for (var i = 0; i < this.nonconformInfoItem.length; i++) {
								this.nonconformInfoItem[i].downloadStatus = false
								this.getOption(false, this.nonconformInfoItem[i])
							}
						}
						break
					//违章项组
					case 'violationInfo':
						if (event) {
							for (var i = 0; i < this.violationInfoItem.length; i++) {
								this.violationInfoItem[i].downloadStatus = true
								this.getOption(true, this.violationInfoItem[i])
							}
						} else {
							for (var i = 0; i < this.violationInfoItem.length; i++) {
								this.violationInfoItem[i].downloadStatus = false
								this.getOption(false, this.violationInfoItem[i])
							}
						}
						break
					//验证组
					case 'verifyAndcorInfo':
						if (event) {
							for (var i = 0; i < this.correctItem.length; i++) {
								this.correctItem[i].downloadStatus = true
								this.getOption(true, this.correctItem[i])
							}
						} else {
							for (var i = 0; i < this.correctItem.length; i++) {
								this.correctItem[i].downloadStatus = false
								this.getOption(false, this.correctItem[i])
							}
						}
						break
					default:
						break
				}
			},
			//列表展示项筛选框全选框点击事件
			showFilterAllCheck(event, option) {
				switch (option) {
					case 'planBasisInfo':
						if (event) {
							for (let i = 0; i < this.BasicInfoItem.length; i++) {
								this.BasicInfoItem[i].showStatus = true
							}
						} else {
							for (let i = 0; i < this.BasicInfoItem.length; i++) {
								this.BasicInfoItem[i].showStatus = false
							}
						}
						break
					case 'impleBasisInfo':
						if (event) {
							for (let i = 0; i < this.impleInfoItem.length; i++) {
								this.impleInfoItem[i].showStatus = true
							}
						} else {
							for (let i = 0; i < this.impleInfoItem.length; i++) {
								this.impleInfoItem[i].showStatus = false
							}
						}
						break
					case 'problemInfo':
						if (event) {
							for (let i = 0; i < this.problemInfoItem.length; i++) {
								this.problemInfoItem[i].showStatus = true
							}
						} else {
							for (let i = 0; i < this.problemInfoItem.length; i++) {
								this.problemInfoItem[i].showStatus = false
							}
						}
						break
					case 'nonConformityInfo':
						if (event) {
							for (let i = 0; i < this.nonconformInfoItem.length; i++) {
								this.nonconformInfoItem[i].showStatus = true
							}
						} else {
							for (let i = 0; i < this.nonconformInfoItem.length; i++) {
								this.nonconformInfoItem[i].showStatus = false
							}
						}
						break
					case 'violationInfo':
						if (event) {
							for (let i = 0; i < this.violationInfoItem.length; i++) {
								this.violationInfoItem[i].showStatus = true
							}
						} else {
							for (let i = 0; i < this.violationInfoItem.length; i++) {
								this.violationInfoItem[i].showStatus = false
							}
						}
						break
					case 'verifyAndcorInfo':
						if (event) {
							for (let i = 0; i < this.correctItem.length; i++) {
								this.correctItem[i].showStatus = true
							}
						} else {
							for (let i = 0; i < this.correctItem.length; i++) {
								this.correctItem[i].showStatus = false
							}
						}
						break
					default:
						break
				}
			},
			openShowFilterDialog() {
				this.showFilterOptionDialog = true
			},
			saveShowFileterOption() {
				this.showFilterOptionDialog = false
			},
			//打开下载选项框
			openDownloadOption() {
				//构造临时数组，里面存放的是各个下载选项组，构成一个二维数组
				let downloaditem = [
					this.BasicInfoItem,
					this.impleInfoItem,
					this.problemInfoItem,
					this.nonconformInfoItem,
					this.violationInfoItem,
					this.correctItem
				]
				//初始化，将所有组中的所有项的选中状态置为否
				for (let i = 0; i < downloaditem.length; i++) {
					for (let j = 0; j < downloaditem[i].length; j++) {
						downloaditem[i][j].downloadStatus = false
					}
				}
				//初始化，将全选框选中状态置为否
				for (let i = 0; i < this.downloadAllcheck.length; i++) {
					this.downloadAllcheck[i] = false
				}
				//清空下载用的三个数组
				this.downloadList = []
				this.downloadEnglishList = []
				this.downloadChineseList = []
				this.downloadOptionDialog = true
			},
			//保存下载选项
			saveDownloadFileterOption() {
				//二次确认
				this.$confirm('保存将会下载选中的字段，确定要执行吗？', '下载确认', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(() => {
					//构造临时数组，其中存的是各个下载选项组
					let downloaditem = [
						this.BasicInfoItem,
						this.impleInfoItem,
						this.problemInfoItem,
						this.nonconformInfoItem,
						this.violationInfoItem,
						this.correctItem
					]
					//遍历整个临时数组，查找被选中的下载项，并进行保存
					for (let i = 0; i < downloaditem.length; i++) {
						for (let j = 0; j < downloaditem[i].length; j++) {
							if (downloaditem[i][j].downloadStatus) {
								this.downloadEnglishList.push(downloaditem[i][j].englishName)
								this.downloadChineseList.push(downloaditem[i][j].chineseName)
							}
						}
					}
					//关闭下载选项对话框，执行下载操作
					this.downloadOptionDialog = false
					this.download()
				})
			},
			//调用接口，获取公司列表
			GetCompany() {
				GetCompany().then(res => {
					this.companyList = res.data
				})
			},
			//列表行筛选
			filterHandler(value, row, column) {
				//获取当前的筛选列
				const property = column['property'];
				//根据筛选列筛选下载数组中存储的数据，如果不执行该操作，最后下载时会下载所有的数据，而不是进行过列筛选后剩下的数据
				this.downloadSource = this.downloadSource.filter(item => {
					return item[property] === value
				})
				//返回值为true/false，用于确定某一行是否展示
				//根据这一行代码可知，列筛选只是使某一行是否展示在界面上，而没有从数组中清除，所以列表的数据源没有发生变化
				return row[property] === value
			},
			//下载操作实现
			download() {
				var option = {}
				option.fileName = "质量专项检查记录统计表"
				option.datas = [{
					//数据源
					sheetData: this.downloadSource,
					//列数据源
					sheetFilter: this.downloadEnglishList,
					//表头
					sheetHeader: this.downloadChineseList
				}]
				var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
			},
			//查询所有已经走完流程的数据
			queryAllPassTable() {
				queryAllPassTable().then(res => {
					this.qualityCheckList = res.data
					if (this.qualityCheckList) {
						this.qualityRecordList = []
						this.qualityCheckTree = []
						for (var i = 0; i < this.qualityCheckList.length; i++) {
							this.queryQualityRecordList(this.qualityCheckList[i].qualityCheckID)
							this.queryCheckTreeByID(this.qualityCheckList[i].qualityCheckID)
						}
					}
				}).catch(err => {
					this.$message.error(err.message)
				})
			},
			//调用接口查询问题项列表
			queryQualityRecordList(qualityCheckID) {
				if (qualityCheckID) {
					queryQualityRecordList(qualityCheckID).then(res => {
						this.qualityRecordList.push(res.data)
					}).catch(err => {
						this.$message.error(err.message)
					})
				} else {
					this.$message.error('参数不能为空')
					return
				}
			},
			//调用接口查询列表树
			queryCheckTreeByID(qualityCheckID) {
				if (qualityCheckID) {
					queryCheckTreeByID(qualityCheckID).then(res => {
						this.qualityCheckTree.push(res.data)
					}).catch(err => {
						this.$message.error(err.message)
					})
				} else {
					this.$message.error('参数不能为空')
					return
				}
			},
			//获得组装数据
			getCombineData() {
				//初始化存储组装完成的列表
				this.checkRecordList = []
				//根据审核计划查找问题项列表和树列表，并组装数据
				for (var i = 0; i < this.qualityCheckList.length; i++) {
					let qualityRecordList = this.qualityRecordList.filter(item => {
						let flag = false
						for (let j = 0; j < item.length; j++) {
							if (item[j].qulity_CheckID === this.qualityCheckList[i].qualityCheckID) {
								flag = true
								break
							}
						}
						if (flag) {
							return item
						}
					})
					let qualityCheckTree = this.qualityCheckTree.filter(item => {
						if (item[0].qualityCheckID === this.qualityCheckList[i].qualityCheckID) {
							return item
						}
					})
					this.combineData(this.qualityCheckList[i], qualityRecordList[0], qualityCheckTree[0])
				}
				this.downloadSource = this.checkRecordList
			},
			pushItem(pushItem, targetArray) {
				let temp = {
					text: '',
					value: ''
				}
				temp.text = pushItem
				temp.value = pushItem
				let tempArray = []
				tempArray = targetArray.filter(item => {
					return item.value === temp.value
				})
				if (tempArray.length == 0) {
					targetArray.push(temp)
				}
			},
			select() {
				this.loading = true
				this.getCombineData()
				if (this.companyId) {
					this.changeCompanyIdTocompanyName(this.companyList, this.companyId)
					this.checkRecordList = this.checkRecordList.filter(item => {
						return item.checkedCompanyName == this.companyName
					})
				}
				if (this.dateRange) {
					if (this.dateRange.length > 0) {
						this.checkRecordList = this.checkRecordList.filter(item => {
							return item.checkDate >= this.dateRange[0] && item.checkDate <= this.dateRange[1]
						})
					}
				}
				this.checkRecordList = this.sortData(this.checkRecordList)
				this.loading = false
			},
			sortData(data) {
				if (data.length > 0) {
					for (var i = 0; i < data.length - 1; i++) {
						for (var j = i + 1; j < data.length; j++) {
							if (data[i].checkDate <= data[j].checkDate) {
								let temp = data[i]
								data[i] = data[j]
								data[j] = temp
							}
						}
					}
					return data
				}
			},
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
			combineData(qualityCheckList, qualityRecordList, qualityCheckTree) {
				if (!qualityCheckTree || !qualityRecordList || !qualityCheckList) {
					return 0
				}
				for (var i = 0; i < qualityCheckTree.length; i++) {
					if (!qualityCheckTree[i].children) {
						let checkRecordItem = {
							//审核任务名
							qualityCheckName: '',
							//审核要素名
							checkListName: '',
							//审核类别
							checkCategory: '',
							//审核依据
							checkBasis: '',
							//审核方式
							checkMethod: '',
							//受审核单位
							checkedCompanyName: '',
							//受审单位负责人
							checkedPersonName: '',
							//室组/受审核部门
							group: '',
							//室组负责人
							groupLeaderName: '',
							//作业项目
							projectName: '',
							//项目组长
							projectLeaderName: '',
							//责任单位/责任部门
							responsiCompanyName: '',
							//责任单位负责人
							responsePersonName: '',
							//监督时间/审核日期，格式：yyyy-mm-dd
							checkDate: '',
							//监督人员姓名
							checkPerson: '',
							//承包商
							contractor: '',
							//业主
							owner: '',
							//检测项目
							checkProject: '',
							//检测标准
							execStd: '',
							//作业人数
							workerNumber: '',
							//作业地点
							workPlace: '',
							//承包商人数
							contractorNumber: '',
							//ERP人数
							erpNumber: '',
							//外聘员工数量
							externalNumber: '',
							//检查结果
							checkResult: '',
							//问题描述\不符合事实描述
							resultDescription: '',
							//问题性质\问题分类
							nature: '',
							problemDescription: '',
							//不符合类型
							nonConformityType: '',
							//不符合性质
							nonConformityNature: '',
							//不符合标准\文件名称
							nonConformityStd: '',
							//不符合标准号
							nonConformityStdNo: '',
							//不符合标准内容
							nonConformityStdContent: '',
							//不符合条款
							nonConformClause: '',
							//不符合标准条款号
							nonConformClauseNo: '',
							//不符合标准条款内容
							nonConformClauseContent: '',
							//不符合原因
							nonConformSource: '',
							//纠正（不符合）
							nonConformCorrect: '',
							//纠正措施（不符合）
							nonConformCorrectMeasure: '',
							//纠正措施跟踪验证（不符合）
							nonConformCorrectMeasureVerify: '',
							//处罚依据
							punishmentBasis: '',
							//违章条款
							violationClause: '',
							//违章条款内容
							violationClauseContent: '',
							//违章扣款
							violationDeduction: '',
							//违章扣分
							violationScore: '',
							//违章人员
							illegalPerson: '',
							post: '',
							postType: '',
							employmentProperty: '',
							workingYears: '',
							education: '',

							resVerifierName: '',
							resVerifyDate: '',
							resVerifyAdvice: '',
							cheVerifierName: '',
							cheVerifyDate: '',
							cheVerifyAdvice: '',
							reformDate: '',
							//整改完成时间
							reformLimit: '',
							pic: [],
							attach: [],
							//整改时限
							problemAttach: [],
							//问题附件
							problemPic: [],
							//问题图片
							correctAttach: [],
							//纠正附件
							correctPic: [],
						}
						checkRecordItem.checkListName = qualityCheckTree[i].qualityCheckName
						checkRecordItem.checkResult = qualityCheckTree[i].checkResult
						checkRecordItem.resultDescription = qualityCheckTree[i].description
						checkRecordItem.attach = this.splitFilePath(qualityCheckTree[i].attach)
						checkRecordItem.pic = this.splitPicPath(qualityCheckTree[i].pic)
						checkRecordItem.checkCategory = qualityCheckList.checkCategory
						checkRecordItem.checkBasis = qualityCheckList.checkBasis
						checkRecordItem.checkMethod = qualityCheckList.checkMethod
						checkRecordItem.qualityCheckName = qualityCheckList.qualityCheckName
						checkRecordItem.checkDate = qualityCheckList.checkDate
						checkRecordItem.checkPerson = qualityCheckList.checkPerson
						checkRecordItem.checkedCompanyName = qualityCheckList.checkedCompanyName
						checkRecordItem.checkedPersonName = qualityCheckList.checkedPersonName
						checkRecordItem.group = qualityCheckList.group
						checkRecordItem.groupLeaderName = qualityCheckList.groupLeaderName
						checkRecordItem.projectName = qualityCheckList.projectName
						checkRecordItem.projectLeaderName = qualityCheckList.projectLeaderName
						checkRecordItem.contractor = qualityCheckList.contractor
						checkRecordItem.contractorNumber = qualityCheckList.contractorNumber
						checkRecordItem.owner = qualityCheckList.owner
						checkRecordItem.checkProject = qualityCheckList.checkProject
						checkRecordItem.workPlace = qualityCheckList.workPlace
						checkRecordItem.workerNumber = qualityCheckList.workerNumber
						checkRecordItem.erpNumber = qualityCheckList.erpNumber
						checkRecordItem.externalNumber = qualityCheckList.externalNumber
						checkRecordItem.execStd = qualityCheckList.execStd
						checkRecordItem.progress = qualityCheckList.progress
						let temp = []
						temp = qualityRecordList.filter(item => {
							return item.checkListCode === qualityCheckTree[i].checkListCode
						})[0]
						if (temp) {
							checkRecordItem.nature = temp.nature
							checkRecordItem.problemDescription = temp.description
							checkRecordItem.nonConformityType = temp.nonConformityType
							checkRecordItem.nonConformityNature = temp.nonConformityNature
							checkRecordItem.nonConformSource = temp.nonConformSource
							checkRecordItem.nonConformityStd = temp.nonConformityStd
							checkRecordItem.nonConformityStdNo = temp.nonConformityStdNo
							checkRecordItem.nonConformityStdContent = temp.nonConformityStdContent
							checkRecordItem.nonConformClause = temp.nonConformClause
							checkRecordItem.nonConformClauseNo = temp.nonConformClauseNo
							checkRecordItem.nonConformClauseContent = temp.nonConformClauseContent
							checkRecordItem.nonConformCorrect = temp.nonConformCorrect
							checkRecordItem.nonConformCorrectMeasure = temp.nonConformCorrectMeasure
							checkRecordItem.nonConformCorrectMeasureVerify = temp.nonConformCorrectMeasureVerify
							checkRecordItem.punishmentBasis = temp.punishmentBasis
							checkRecordItem.violationClause = temp.violationClause
							checkRecordItem.violationClauseContent = temp.violationClauseContent
							checkRecordItem.violationDeduction = temp.violationDeduction
							checkRecordItem.violationScore = temp.violationScore
							checkRecordItem.illegalPerson = temp.illegalPerson
							checkRecordItem.post = temp.post
							checkRecordItem.postType = temp.postType
							checkRecordItem.employmentProperty = temp.employmentProperty
							checkRecordItem.workingYears = temp.workingYears
							checkRecordItem.education = temp.education
							checkRecordItem.reformDate = temp.reformDate
							checkRecordItem.reformLimit = temp.reformLimit
							checkRecordItem.responsiCompanyName = temp.responsiCompanyName
							checkRecordItem.responsePersonName = temp.responsePersonName
							checkRecordItem.resVerifierName = temp.resVerifierName
							checkRecordItem.resVerifyDate = temp.resVerifyDate
							checkRecordItem.resVerifyAdvice = temp.resVerifyAdvice
							checkRecordItem.cheVerifierName = temp.cheVerifierName
							checkRecordItem.cheVerifyDate = temp.cheVerifyDate
							checkRecordItem.cheVerifyAdvice = temp.cheVerifyAdvice
							checkRecordItem.problemAttach = this.splitFilePath(temp.problemAttach)
							checkRecordItem.problemPic = this.splitPicPath(temp.problemPic)
							checkRecordItem.correctAttach = this.splitFilePath(temp.correctAttach)
							checkRecordItem.correctPic = this.splitPicPath(temp.correctPic)
						}
						//基本信息
						this.pushItem(checkRecordItem.qualityCheckName, this.BasicInfoItem[0].filter)
						this.pushItem(checkRecordItem.checkCategory, this.BasicInfoItem[1].filter)
						this.pushItem(checkRecordItem.checkBasis, this.BasicInfoItem[2].filter)
						this.pushItem(checkRecordItem.checkMethod, this.BasicInfoItem[3].filter)
						this.pushItem(checkRecordItem.checkedCompanyName, this.BasicInfoItem[4].filter)
						this.pushItem(checkRecordItem.checkedPersonName, this.BasicInfoItem[5].filter)
						this.pushItem(checkRecordItem.group, this.BasicInfoItem[6].filter)
						this.pushItem(checkRecordItem.groupLeaderName, this.BasicInfoItem[7].filter)
						this.pushItem(checkRecordItem.projectName, this.BasicInfoItem[8].filter)
						this.pushItem(checkRecordItem.projectLeaderName, this.BasicInfoItem[9].filter)
						this.pushItem(checkRecordItem.checkPerson, this.BasicInfoItem[10].filter)
						this.pushItem(checkRecordItem.checkDate, this.BasicInfoItem[11].filter)
						//审核实施信息
						this.pushItem(checkRecordItem.checkProject, this.impleInfoItem[0].filter)
						this.pushItem(checkRecordItem.execStd, this.impleInfoItem[1].filter)
						this.pushItem(checkRecordItem.contractor, this.impleInfoItem[2].filter)
						this.pushItem(checkRecordItem.contractorNumber, this.impleInfoItem[3].filter)
						this.pushItem(checkRecordItem.owner, this.impleInfoItem[4].filter)
						this.pushItem(checkRecordItem.workPlace, this.impleInfoItem[5].filter)
						this.pushItem(checkRecordItem.workerNumber, this.impleInfoItem[6].filter)
						this.pushItem(checkRecordItem.erpNumber, this.impleInfoItem[7].filter)
						this.pushItem(checkRecordItem.externalNumber, this.impleInfoItem[8].filter)
						//问题项信息
						this.pushItem(checkRecordItem.checkListName, this.problemInfoItem[0].filter)
						this.pushItem(checkRecordItem.checkResult, this.problemInfoItem[1].filter)
						this.pushItem(checkRecordItem.resultDescription, this.problemInfoItem[2].filter)
						this.pushItem(checkRecordItem.nature, this.problemInfoItem[3].filter)
						this.pushItem(checkRecordItem.problemDescription, this.problemInfoItem[4].filter)
						this.pushItem(checkRecordItem.responsiCompanyName, this.problemInfoItem[5].filter)
						this.pushItem(checkRecordItem.responsePersonName, this.problemInfoItem[6].filter)
						//不符合项信息
						this.pushItem(checkRecordItem.nonConformityType, this.nonconformInfoItem[0].filter)
						this.pushItem(checkRecordItem.nonConformityNature, this.nonconformInfoItem[1].filter)
						this.pushItem(checkRecordItem.nonConformSource, this.nonconformInfoItem[2].filter)
						this.pushItem(checkRecordItem.nonConformityStd, this.nonconformInfoItem[3].filter)
						this.pushItem(checkRecordItem.nonConformityStdNo, this.nonconformInfoItem[4].filter)
						this.pushItem(checkRecordItem.nonConformityStdContent, this.nonconformInfoItem[5].filter)
						this.pushItem(checkRecordItem.nonConformClause, this.nonconformInfoItem[6].filter)
						this.pushItem(checkRecordItem.nonConformClauseNo, this.nonconformInfoItem[7].filter)
						this.pushItem(checkRecordItem.nonConformClauseContent, this.nonconformInfoItem[8].filter)
						//违章信息
						this.pushItem(checkRecordItem.punishmentBasis, this.violationInfoItem[0].filter)
						this.pushItem(checkRecordItem.violationClause, this.violationInfoItem[1].filter)
						this.pushItem(checkRecordItem.violationClauseContent, this.violationInfoItem[2].filter)
						this.pushItem(checkRecordItem.violationDeduction, this.violationInfoItem[3].filter)
						this.pushItem(checkRecordItem.violationScore, this.violationInfoItem[4].filter)
						this.pushItem(checkRecordItem.illegalPerson, this.violationInfoItem[5].filter)
						this.pushItem(checkRecordItem.post, this.violationInfoItem[6].filter)
						this.pushItem(checkRecordItem.postType, this.violationInfoItem[7].filter)
						this.pushItem(checkRecordItem.employmentProperty, this.violationInfoItem[8].filter)
						this.pushItem(checkRecordItem.workingYears, this.violationInfoItem[9].filter)
						this.pushItem(checkRecordItem.education, this.violationInfoItem[10].filter)
						//纠正措施
						this.pushItem(checkRecordItem.resVerifierName, this.correctItem[0].filter)
						this.pushItem(checkRecordItem.resVerifyDate, this.correctItem[1].filter)
						this.pushItem(checkRecordItem.resVerifyAdvice, this.correctItem[2].filter)
						this.pushItem(checkRecordItem.cheVerifierName, this.correctItem[3].filter)
						this.pushItem(checkRecordItem.cheVerifyDate, this.correctItem[4].filter)
						this.pushItem(checkRecordItem.cheVerifyAdvice, this.correctItem[5].filter)
						this.pushItem(checkRecordItem.nonConformCorrect, this.correctItem[6].filter)
						this.pushItem(checkRecordItem.nonConformCorrectMeasure, this.correctItem[7].filter)
						this.pushItem(checkRecordItem.nonConformCorrectMeasureVerify, this.correctItem[8].filter)
						this.pushItem(checkRecordItem.reformLimit, this.correctItem[9].filter)
						this.pushItem(checkRecordItem.reformDate, this.correctItem[10].filter)
						this.checkRecordList.push(checkRecordItem)
					} else {
						this.combineData(qualityCheckList, qualityRecordList, qualityCheckTree[i].children)
					}
				}
			},
			//切割字符串，并组装url
			splitFilePath(pathString) {
				if (pathString) {
					//定义一个空数组用于保存url
					var targetArray = []
					//切割传入的字符串
					var temp = pathString.split(';')
					//遍历数组，组装url
					for (var i = 0; i < temp.length; i++) {
						let file = {
							url: '',
							fileName: ''
						}
						file.url = this.path + temp[i]
						getOriginFileName(temp[i]).then(res => {
							file.fileName = res.data
							targetArray.push(file)
						})
					}
					//返回url数组
					return targetArray
				}
			},
			splitPicPath(picPath) {
				if (picPath) {
					var targetArray = []
					var temp = picPath.split(';')
					for (var i = 0; i < temp.length; i++) {
						targetArray.push(this.path + temp[i])
					}
					return targetArray
				}
			}
		}
	}
</script>

<style>
	.demo-table-expand {
		font-size: 0;
		width: 60%;
	}
	.demo-table-expand label {
		width: 130px;
		color: #99a9bf;
	}
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
	.checkBoxClass {
		width: 110px;
		margin-top: 5px;
		margin-bottom: 5px;
	}
</style>
