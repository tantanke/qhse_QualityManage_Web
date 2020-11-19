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
				<el-table-column type="expand" fixed="left">
					<template slot-scope="prop">
						<el-form label-width="80px" :label-position="left">
							<el-row>
								<el-col :span="12" v-if="prop.row.checkResult==='不符合'">
									<el-form-item label="纠正">
										<span>{{prop.row.nonConformCorrect}}</span>
									</el-form-item>
									<el-form-item label="纠正措施">
										<span>{{prop.row.nonConformCorrectMeasure}}</span>
									</el-form-item>
									<el-form-item label="跟踪验证">
										<span>{{prop.row.nonConformCorrectMeasureVerify}}</span>
									</el-form-item>
									<el-form-item label="问题附件">
										<div v-for="(item, index) in prop.row.problemAttach" :key="index">
											<a style="margin: 5px;" :href="item.url">
												{{item.fileName}}
											</a>
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
										<el-form-item label="整改时限">
										<span>{{prop.row.reformLimit}}</span>
									</el-form-item>
									<el-form-item label="整改完成时间">
										<span>{{prop.row.reformDate}}</span>
									</el-form-item>
										
									<el-form-item label="纠正附件">
										<div v-for="(item, index) in prop.row.correctAttach" :key="index">
											<a style="margin: 5px;" :href="item.url">
												{{item.fileName}}
											</a>
											<el-button type="text" size="mini" @click="preview(item.url)">预览</el-button>
										</div>
									</el-form-item>
									
									<el-form-item label="纠正图片">
										<div v-for="(item, index) in prop.row.correctPic" :key="index" style="float: left;">
											<el-image style="width: 100px;height: 100px;margin: 5px;" :src="item" :preview-src-list="prop.row.correctPic"></el-image>
										</div>
									</el-form-item>
									</el-col>
									
								
								<el-col  :span="25" v-if="prop.row.checkResult==='符合'">
									<el-form-item label="符合附件">
										<div v-for="(item, index) in prop.row.attach" :key="index">
											<a style="margin: 5px;" :href="item.url">
												{{item.fileName}}
											</a>
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
				<el-table-column prop="qualityCheckName" label="审核任务名称" width="200" align="center" :filters="qualityCheckNameFilter"
				 :filter-method="filterHandler" v-if="showFilter.qualityCheckName" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkListName" label="审核要素名" width="200" align="center" :filters="checkListNameFilter"
				 :filter-method="filterHandler" v-if="showFilter.checkListName" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkCategory" label="审核类别" align="center" width="120" :filters="checkCategoryFilter"
				 :filter-method="filterHandler" v-if="showFilter.checkCategory" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkBasis" label="审核依据" align="center" width="120" :filters="checkBasisFilter"
				 :filter-method="filterHandler" v-if="showFilter.checkBasis" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkMethod" label="审核方式" align="center" width="120" :filters="checkMethodFilter"
				 :filter-method="filterHandler" v-if="showFilter.checkMethod" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkDate" label="审核时间" width="120" align="center" v-if="showFilter.checkDate"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkResult" label="审核结果" align="center" width="100" :filters="checkResultFilter"
				 :filter-method="filterHandler" v-if="showFilter.checkResult" show-overflow-tooltip></el-table-column>
				<el-table-column prop="resultDescription" label="结果描述" align="center" width="200" v-if="showFilter.resultDescription"
				 show-overflow-tooltip></el-table-column>
				 <el-table-column prop="responsiCompanyName" label="责任单位" align="center" width="200" v-if="showFilter.responsiCompanyName"
				  show-overflow-tooltip :filters="responsiCompanyNameFilter" :filter-method="filterHandler"></el-table-column>
				  <el-table-column prop="responsePersonName" label="责任单位负责人" align="center" width="120" v-if="showFilter.responsePersonName"
				   show-overflow-tooltip :filters="responsePersonNameFilter" :filter-method="filterHandler"></el-table-column>
				<el-table-column prop="nature" label="问题分类" align="center" width="100" :filters="natureFilter" v-if="showFilter.nature"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="problemDescription" label="问题描述" align="center" width="200" v-if="showFilter.problemDescription"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkedCompanyName" label="受审单位" width="200" align="center" :filters="companyFilter"
				 :filter-method="filterHandler" v-if="showFilter.checkedCompanyName" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkedPersonName" label="受审单位负责人" width="140" align="center" :filters="companyLeaderFilter"
				 :filter-method="filterHandler" v-if="showFilter.checkedPersonName" show-overflow-tooltip></el-table-column>
				<el-table-column prop="group" label="受审室组" align="center" width="200" :filters="groupFilter" v-if="showFilter.group"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="groupLeaderName" label="室组负责人" align="center" width="120" v-if="showFilter.groupLeaderName"
				 :filters="groupLeaderFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="projectName" label="作业项目名称" align="center" width="200" v-if="showFilter.projectName"
				 :filters="projectFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="projectLeaderName" label="项目组长" align="center" width="120" v-if="showFilter.projectLeaderName"
				 show-overflow-tooltip :filters="projectLeaderFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkPerson" label="审核人员" align="center" width="120" v-if="showFilter.checkPerson" :filters="checkPersonFilter"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkProject" label="检测项目" width="120" align="center" v-if="showFilter.checkProject"
				 :filters="checkProjectFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="execStd" label="检测标准" width="120" align="center" v-if="showFilter.execStd" :filters="execStdFilter"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="owner" label="业主" width="120" align="center" v-if="showFilter.owner" :filters="ownerFilter"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="contractor" label="承包商" width="120" align="center" v-if="showFilter.contractor" :filters="contractorFilter"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="workPlace" label="作业地点" width="120" align="center" v-if="showFilter.workPlace" :filters="workPlaceFilter"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>

				<el-table-column prop="contractorNumber" label="承包商数量" width="100" align="center" v-if="showFilter.contractorNumber"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="workerNumber" label="作业人数" width="80" align="center" v-if="showFilter.workerNumber"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="erpNumber" label="ERP员工数量" width="110" align="center" v-if="showFilter.erpNumber"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="externalNumber" label="外聘员工数量" width="120" align="center" v-if="showFilter.externalNumber"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="nonConformityType" label="不符合类型" width="120" align="center" v-if="showFilter.nonConformityType"
				 :filters="nonConformityTypeFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>

				<el-table-column prop="nonConformityNature" label="不符合性质" width="120" align="center" v-if="showFilter.nonConformityNature"
				 :filters="nonConformityNatureFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nonConformSource" label="不符合原因" width="120" align="center" v-if="showFilter.nonConformSource"
				 :filters="nonConformSourceFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nonConformityStd" label="不符合标准" width="120" align="center" v-if="showFilter.nonConformityStd"
				 :filters="nonConformityStdFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nonConformityStdNo" label="标准条款号" width="120" align="center" v-if="showFilter.nonConformityStdNo"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="nonConformityStdContent" label="标准条款内容" width="150" align="center" v-if="showFilter.nonConformityStdContent"
				 show-overflow-tooltip></el-table-column>

				<el-table-column prop="nonConformClause" label="不符合文件" width="120" align="center" v-if="showFilter.nonConformClause"
				 :filters="nonConformClauseFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nonConformClauseNo" label="文件条款号" width="120" align="center" v-if="showFilter.nonConformClauseNo"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="nonConformClauseContent" label="文件条款内容" width="150" v-if="showFilter.nonConformClauseContent"
				 align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="punishmentBasis" label="处罚依据" width="120" align="center" v-if="showFilter.punishmentBasis"
				 :filters="punishmentBasisFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="violationClause" label="违章条款号" width="120" align="center" v-if="showFilter.violationClause"
				 show-overflow-tooltip></el-table-column>

				<el-table-column prop="violationClause" label="违章条款内容" width="150" align="center" v-if="showFilter.violationClause"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="violationDeduction" label="违章扣款" width="100" align="center" v-if="showFilter.violationDeduction"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="violationScore" label="违章扣分" width="80" align="center" v-if="showFilter.violationScore"
				 show-overflow-tooltip></el-table-column>
				<el-table-column prop="illegalPerson" label="违章人员" width="120" align="center" v-if="showFilter.illegalPerson"
				 :filters="illegalPersonFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="post" label="岗位" align="center" :filters="postFilter" v-if="showFilter.post" :filter-method="filterHandler"
				 show-overflow-tooltip></el-table-column>

				<el-table-column prop="postType" label="岗位分类" width="120" align="center" v-if="showFilter.postType" :filters="postTypeFilter"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="employmentProperty" label="用工性质" width="120" v-if="showFilter.employmentProperty" align="center"
				 :filters="employmentPropertyFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="workingYears" label="工作年限" width="120" align="center" v-if="showFilter.workingYears"
				 :filters="workingYearsFilter" :filter-method="filterHandler" show-overflow-tooltip></el-table-column>
				<el-table-column prop="education" label="学历" width="120" align="center" v-if="showFilter.education" :filters="educationFilter"
				 :filter-method="filterHandler" show-overflow-tooltip></el-table-column>

			</el-table>
			<el-dialog title="下载选项" :visible.sync="downloadOptionDialog" align="left" width="60%" :close-on-click-modal="false">
				<el-row>
					<span>审核计划基本信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" @change="allCheck($event,'planBasisInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="审核任务名称" v-model="qualityCheckName.status" @change="getOption($event,qualityCheckName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核类别" v-model="checkCategory.status" @change="getOption($event,checkCategory)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核依据" v-model="checkBasis.status" @change="getOption($event,checkBasis)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核方式" v-model="checkMethod.status" @change="getOption($event,checkMethod)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="受审单位" v-model="checkedCompanyName.status" @change="getOption($event,checkedCompanyName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="受审单位负责人" v-model="checkedPersonName.status" @change="getOption($event,checkedPersonName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="受审室组" v-model="group.status" @change="getOption($event,group)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="室组负责人" v-model="groupLeaderName.status" @change="getOption($event,groupLeaderName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="作业项目名称" v-model="projectName.status" @change="getOption($event,projectName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="项目组长" v-model="projectLeaderName.status" @change="getOption($event,projectLeaderName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核人员" v-model="checkPerson.status" @change="getOption($event,checkPerson)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核时间" v-model="checkDate.status" @change="getOption($event,checkDate)"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>审核实施基本信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" @change="allCheck($event,'impleBasisInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="检测项目" v-model="checkProject.status" @change="getOption($event,checkProject)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="检测标准" v-model="execStd.status" @change="getOption($event,execStd)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="承包商" v-model="contractor.status" @change="getOption($event,contractor)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="承包商数量" v-model="contractorNumber.status" @change="getOption($event,contractorNumber)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="业主" v-model="owner.status" @change="getOption($event,owner)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="作业地点" v-model="workPlace.status" @change="getOption($event,workPlace)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="作业人数" v-model="workerNumber.status" @change="getOption($event,workerNumber)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="ERP员工数量" v-model="erpNumber.status" @change="getOption($event,erpNumber)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="外聘员工数量" v-model="externalNumber.status" @change="getOption($event,externalNumber)"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>审核要素问题信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" @change="allCheck($event,'problemInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="审核要素名称" v-model="checkListName.status" @change="getOption($event,checkListName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核结果" v-model="checkResult.status" @change="getOption($event,checkResult)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="结果描述"  v-model="resultDescription.status" @change="getOption($event,resultDescription)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="问题分类"  v-model="nature.status" @change="getOption($event,nature)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="问题描述" v-model="problemDescription.status" @change="getOption($event,problemDescription)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="责任单位" v-model="responsiCompanyName.status" @change="getOption($event,responsiCompanyName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="责任人" v-model="responsePersonName.status" @change="getOption($event,responsePersonName)"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>不符合信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" @change="allCheck($event,'nonConformityInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="不符合类型" v-model="nonConformityType.status" @change="getOption($event,nonConformityType)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="不符合性质" v-model="nonConformityNature.status" @change="getOption($event,nonConformityNature)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="不符合原因" v-model="nonConformSource.status" @change="getOption($event,nonConformSource)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="不符合标准" v-model="nonConformityStd.status" @change="getOption($event,nonConformityStd)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="标准条款号" v-model="nonConformityStdNo.status" @change="getOption($event,nonConformityStdNo)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="标准条款内容" v-model="nonConformityStdContent.status" @change="getOption($event,nonConformityStdContent)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="不符合文件" v-model="nonConformClause.status" @change="getOption($event,nonConformClause)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="文件条款号" v-model="nonConformClauseNo.status" @change="getOption($event,nonConformClauseNo)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="文件条款内容" v-model="nonConformClauseContent.status" @change="getOption($event,nonConformClauseContent)"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>违章信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" @change="allCheck($event,'violationInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="处罚依据" v-model="punishmentBasis.status" @change="getOption($event,punishmentBasis)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章条款号" v-model="violationClause.status" @change="getOption($event,violationClause)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章条款内容" v-model="violationClauseContent.status" @change="getOption($event,violationClauseContent)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章扣款" v-model="violationDeduction.status" @change="getOption($event,violationDeduction)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章扣分" v-model="violationScore.status" @change="getOption($event,violationScore)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章人员" v-model="illegalPerson.status" @change="getOption($event,illegalPerson)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="岗位" v-model="post.status" @change="getOption($event,post)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="岗位分类" v-model="postType.status" @change="getOption($event,postType)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="用工性质" v-model="employmentProperty.status" @change="getOption($event,employmentProperty)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="工作年限" v-model="workingYears.status" @change="getOption($event,workingYears)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="学历" v-model="education.status" @change="getOption($event,education)"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>验证及纠正信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" @change="allCheck($event,'verifyAndcorInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="责任单位验证人" v-model="resVerifierName.status" @change="getOption($event,resVerifierName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="责任单位验证时间" v-model="resVerifyDate.status" @change="getOption($event,resVerifyDate)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="责任单位验证意见" v-model="resVerifyAdvice.status" @change="getOption($event,resVerifyAdvice)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核验证人" v-model="cheVerifierName.status" @change="getOption($event,cheVerifierName)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核验证时间" v-model="cheVerifyDate.status" @change="getOption($event,cheVerifyDate)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核验证意见" v-model="cheVerifyAdvice.status" @change="getOption($event,cheVerifyAdvice)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="纠正" v-model="nonConformCorrect.status" @change="getOption($event,nonConformCorrect)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="纠正措施" v-model="nonConformCorrectMeasure.status" @change="getOption($event,nonConformCorrectMeasure)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="跟踪验证" v-model="nonConformCorrectMeasureVerify.status" @change="getOption($event,nonConformCorrectMeasureVerify)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="整改时限" v-model="reformLimit.status" @change="getOption($event,reformLimit)"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="整改完成时间" v-model="reformDate.status" @change="getOption($event,reformDate)"></el-checkbox>
				</el-row>
				<span slot="footer" class="dialog-footer">
					<el-button icon="el-icon-refresh-left" @click="downloadOptionDialog=false">关闭</el-button>
					<el-button icon="el-icon-folder" type="primary" @click="saveDownloadFileterOption">保存</el-button>
				</span>
			</el-dialog>
			<el-dialog title="列表展示列筛选" :visible.sync="showFilterOptionDialog" align="left" width="60%" :close-on-click-modal="false">
				<el-row>
					<span>审核计划基本信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="planBasisInfoCheckbox" @change="showFilterAllCheck($event,'planBasisInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="审核任务名称" v-model="showFilter.qualityCheckName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核类别" v-model="showFilter.checkCategory"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核依据" v-model="showFilter.checkBasis"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核方式" v-model="showFilter.checkMethod"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="受审单位" v-model="showFilter.checkedCompanyName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="受审单位负责人" v-model="showFilter.checkedPersonName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="受审室组" v-model="showFilter.group"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="室组负责人" v-model="showFilter.groupLeaderName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="作业项目名称" v-model="showFilter.projectName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="项目组长" v-model="showFilter.projectLeaderName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核人员" v-model="showFilter.checkPerson"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核时间" v-model="showFilter.checkDate"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>审核实施基本信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="impleBasisInfoCheckbox" @change="showFilterAllCheck($event,'impleBasisInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="检测项目" v-model="showFilter.checkProject"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="检测标准" v-model="showFilter.execStd"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="承包商" v-model="showFilter.contractor"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="承包商数量" v-model="showFilter.contractorNumber"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="业主" v-model="showFilter.owner"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="作业地点" v-model="showFilter.workPlace"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="作业人数" v-model="showFilter.workerNumber"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="ERP员工数量" v-model="showFilter.erpNumber"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="外聘员工数量" v-model="showFilter.externalNumber"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>审核要素问题信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="problemInfoCheckbox" @change="showFilterAllCheck($event,'problemInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="审核要素名称" v-model="showFilter.checkListName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核结果" v-model="showFilter.checkResult"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="结果描述" v-model="showFilter.resultDescription"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="问题分类" v-model="showFilter.nature"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="问题描述" v-model="showFilter.problemDescription"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="责任单位" v-model="showFilter.responsiCompanyName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="责任人" v-model="showFilter.responsePersonName"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>不符合信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="nonConformityInfoCheckbox" @change="showFilterAllCheck($event,'nonConformityInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="不符合类型" v-model="showFilter.nonConformityType"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="不符合性质" v-model="showFilter.nonConformityNature"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="不符合原因" v-model="showFilter.nonConformSource"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="不符合标准" v-model="showFilter.nonConformityStd"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="标准条款号" v-model="showFilter.nonConformityStdNo"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="标准条款内容" v-model="showFilter.nonConformityStdContent"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="不符合文件" v-model="showFilter.nonConformClause"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="文件条款号" v-model="showFilter.nonConformClauseNo"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="文件条款内容" v-model="showFilter.nonConformClauseContent"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>违章信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="violationInfoCheckbox" @change="showFilterAllCheck($event,'violationInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="处罚依据" v-model="showFilter.punishmentBasis"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章条款号" v-model="showFilter.violationClause"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章条款内容" v-model="showFilter.violationClauseContent"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章扣款" v-model="showFilter.violationDeduction"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章扣分" v-model="showFilter.violationScore"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="违章人员" v-model="showFilter.illegalPerson"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="岗位" v-model="showFilter.post"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="岗位分类" v-model="showFilter.postType"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="用工性质" v-model="showFilter.employmentProperty"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="工作年限" v-model="showFilter.workingYears"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="学历" v-model="showFilter.education"></el-checkbox>
				</el-row>
				<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center;margin-top: 15px;"></el-row>
				<el-row>
					<span>验证及纠正信息</span>
					&nbsp;&nbsp;<el-checkbox class="checkBoxClass" label="全选" v-model="verifyAndcorInfoCheckbox" @change="showFilterAllCheck($event,'verifyAndcorInfo')"></el-checkbox>
					<br />
					<el-checkbox class="checkBoxClass" label="责任单位验证人" v-model="showFilter.resVerifierName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="责任单位验证时间" v-model="showFilter.resVerifyDate"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="责任单位验证意见" v-model="showFilter.resVerifyAdvice"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核验证人" v-model="showFilter.cheVerifierName"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核验证时间" v-model="showFilter.cheVerifyDate"></el-checkbox>
					<el-checkbox class="checkBoxClass" label="审核验证意见" v-model="showFilter.cheVerifyAdvice"></el-checkbox>
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
				taskType: '',
				checkResult: '',
				nature: '',
				//列表展示全选筛选变量
				planBasisInfoCheckbox:false,
				impleBasisInfoCheckbox:false,
				problemInfoCheckbox:false,
				violationInfoCheckbox:false,
				nonConformityInfoCheckbox:false,
				verifyAndcorInfoCheckbox:false,
				//列表筛选数组
				qualityCheckNameFilter: [],
				checkListNameFilter: [],
				companyFilter: [],
				companyLeaderFilter: [],
				groupFilter: [],
				groupLeaderFilter: [],
				projectFilter: [],
				projectLeaderFilter: [],
				natureFilter: [],
				responsiCompanyNameFilter:[],
				responsePersonNameFilter:[],
				checkCategoryFilter: [],
				checkBasisFilter: [],
				checkMethodFilter: [],
				checkResultFilter: [],
				checkPersonFilter: [],
				checkProjectFilter: [],
				execStdFilter: [],
				contractorFilter: [],
				ownerFilter: [],
				workPlaceFilter: [],
				nonConformClauseFilter: [],
				nonConformSourceFilter: [],
				nonConformityNatureFilter: [],
				nonConformityTypeFilter: [],
				nonConformityStdFilter: [],
				punishmentBasisFilter: [],
				illegalPersonFilter: [],
				postFilter: [],
				postTypeFilter: [],
				employmentPropertyFilter: [],
				workingYearsFilter: [],
				educationFilter: [],

				showFilter: {
					qualityCheckName: true,
					//审核要素名
					checkListName: true,
					//审核类别
					checkCategory: true,
					//审核依据
					checkBasis: true,
					//审核方式
					checkMethod: true,
					//受审核单位
					checkedCompanyName: true,
					//受审单位负责人
					checkedPersonName: false,
					//室组/受审核部门
					group: false,
					//室组负责人
					groupLeaderName: false,
					//作业项目
					projectName: false,
					//项目组长
					projectLeaderName: false,
					//责任单位/责任部门
					responsiCompanyName: false,
					//责任单位负责人
					responsePersonName: false,
					//监督时间/审核日期，格式：yyyy-mm-dd
					checkDate: true,
					//监督人员姓名
					checkPerson: true,
					//承包商
					contractor: false,
					//业主
					owner: false,
					//检测项目
					checkProject: false,
					//检测标准
					execStd: false,
					//作业人数
					workerNumber: false,
					//作业地点
					workPlace: false,
					//承包商人数
					contractorNumber: false,
					//ERP人数
					erpNumber: false,
					//外聘员工数量
					externalNumber: false,
					//检查结果
					checkResult: true,
					//问题描述\不符合事实描述
					resultDescription: false,
					//问题性质\问题分类
					nature: true,
					problemDescription:false,
					//不符合类型
					nonConformityType: false,
					//不符合性质
					nonConformityNature: false,
					//不符合标准\文件名称
					nonConformityStd: false,
					//不符合标准号
					nonConformityStdNo: false,
					//不符合标准内容
					nonConformityStdContent: false,
					//不符合条款
					nonConformClause: false,
					//不符合标准条款号
					nonConformClauseNo: false,
					//不符合标准条款内容
					nonConformClauseContent: false,
					//不符合原因
					nonConformSource: false,
					//纠正（不符合）
					nonConformCorrect: false,
					//纠正措施（不符合）
					nonConformCorrectMeasure: false,
					//纠正措施跟踪验证（不符合）
					nonConformCorrectMeasureVerify: false,
					//处罚依据
					punishmentBasis: false,
					//违章条款
					violationClause: false,
					//违章条款内容
					violationClauseContent: false,
					//违章扣款
					violationDeduction: false,
					//违章扣分
					violationScore: false,
					//违章人员
					illegalPerson: false,
					post: false,
					postType: false,
					employmentProperty: false,
					workingYears: false,
					education: false,
					resVerifierName: false,
					resVerifyDate: false,
					resVerifyAdvice: false,
					cheVerifierName: false,
					cheVerifyDate: false,
					cheVerifyAdvice: false,
				},
				//下载用数组
				downloadList: [],
				downloadEnglishList: [],
				downloadChineseList: [],
				//审核计划基本信息，第一项
				qualityCheckName: {
					englishName: 'qualityCheckName',
					status: false,
					number: 1,
					chineseName: '审核任务名称'
				},
				checkCategory: {
					englishName: 'checkCategory',
					status: false,
					number: 2,
					chineseName: '审核类别'
				},
				checkBasis: {
					englishName: 'checkBasis',
					status: false,
					number: 3,
					chineseName: '审核依据'
				},
				checkMethod: {
					englishName: 'checkMethod',
					status: false,
					number: 4,
					chineseName: '审核方式'
				},
				checkedCompanyName: {
					englishName: 'checkedCompanyName',
					status: false,
					number: 5,
					chineseName: '受审单位'
				},
				checkedPersonName: {
					englishName: 'checkedPersonName',
					status: false,
					number: 6,
					chineseName: '受审单位负责人'
				},
				group: {
					englishName: 'group',
					status: false,
					number: 7,
					chineseName: '受审室组'
				},
				groupLeaderName: {
					englishName: 'groupLeaderName',
					status: false,
					number: 8,
					chineseName: '室组负责人'
				},
				projectName: {
					englishName: 'projectName',
					status: false,
					number: 9,
					chineseName: '作业项目名称'
				},
				projectLeaderName: {
					englishName: 'projectLeaderName',
					status: false,
					number: 10,
					chineseName: '项目组长'
				},
				checkPerson: {
					englishName: 'checkPerson',
					status: false,
					number: 11,
					chineseName: '审核人员'
				},
				checkDate: {
					englishName: 'checkDate',
					status: false,
					number: 12,
					chineseName: '审核时间'
				},
				//审核实施基本信息，第二项
				checkProject: {
					englishName: 'checkProject',
					status: false,
					number: 13,
					chineseName: '检测项目'
				},
				execStd: {
					englishName: 'execStd',
					status: false,
					number: 14,
					chineseName: '检测标准'
				},
				contractor: {
					englishName: 'contractor',
					status: false,
					number: 15,
					chineseName: '承包商'
				},
				contractorNumber: {
					englishName: 'contractorNumber',
					status: false,
					number: 16,
					chineseName: '承包商数量'
				},
				owner: {
					englishName: 'owner',
					status: false,
					number: 17,
					chineseName: '业主'
				},
				workPlace: {
					englishName: 'workPlace',
					status: false,
					number: 18,
					chineseName: '作业地点'
				},
				workerNumber: {
					englishName: 'workerNumber',
					status: false,
					number: 19,
					chineseName: '作业人数'
				},
				erpNumber: {
					englishName: 'erpNumber',
					status: false,
					number: 20,
					chineseName: 'ERP员工数量'
				},
				externalNumber: {
					englishName: 'externalNumber',
					status: false,
					number: 21,
					chineseName: '外聘员工数量'
				},
				//审核要素问题信息，第三项
				checkListName: {
					englishName: 'checkListName',
					status: false,
					number: 22,
					chineseName: '审核要素名称'
				},
				checkResult: {
					englishName: 'checkResult',
					status: false,
					number: 22,
					chineseName: '审核结果'
				},
				resultDescription: {
					englishName: 'resultDescription',
					status: false,
					number: 23,
					chineseName: '结果描述'
				},
				nature:{
					englishName: 'nature',
					status: false,
					number: 23,
					chineseName: '问题分类'
				},
				problemDescription:{
					englishName: 'problemDescription',
					status: false,
					number: 23,
					chineseName: '问题描述'
				},
				responsiCompanyName: {
					englishName: 'responsiCompanyName',
					status: false,
					number: 24,
					chineseName: '责任单位'
				},
				responsePersonName: {
					englishName: 'responsePersonName',
					status: false,
					number: 25,
					chineseName: '责任人'
				},
				//不符合信息，第四项
				nonConformityType: {
					englishName: 'nonConformityType',
					status: false,
					number: 26,
					chineseName: '不符合类型'
				},
				nonConformityNature: {
					englishName: 'nonConformityNature',
					status: false,
					number: 27,
					chineseName: '不符合性质'
				},
				nonConformSource: {
					englishName: 'nonConformSource',
					status: false,
					number: 28,
					chineseName: '不符合原因'
				},
				nonConformityStd: {
					englishName: 'nonConformityStd',
					status: false,
					number: 29,
					chineseName: '不符合标准'
				},
				nonConformityStdNo: {
					englishName: 'nonConformityStdNo',
					status: false,
					number: 30,
					chineseName: '标准条款号'
				},
				nonConformityStdContent: {
					englishName: 'nonConformityStdContent',
					status: false,
					number: 31,
					chineseName: '标准条款内容'
				},
				nonConformClause: {
					englishName: 'nonConformClause',
					status: false,
					number: 32,
					chineseName: '不符合文件'
				},
				nonConformClauseNo: {
					englishName: 'nonConformClauseNo',
					status: false,
					number: 33,
					chineseName: '文件条款号'
				},
				nonConformClauseContent: {
					englishName: 'nonConformClauseContent',
					status: false,
					number: 34,
					chineseName: '文件条款内容'
				},
				//违章信息，第五项
				punishmentBasis: {
					englishName: 'punishmentBasis',
					status: false,
					number: 35,
					chineseName: '处罚依据'
				},
				violationClause: {
					englishName: 'violationClause',
					status: false,
					number: 36,
					chineseName: '违章条款号'
				},
				violationClauseContent: {
					englishName: 'violationClauseContent',
					status: false,
					number: 37,
					chineseName: '违章条款内容'
				},
				violationDeduction: {
					englishName: 'violationDeduction',
					status: false,
					number: 38,
					chineseName: '违章扣款'
				},
				violationScore: {
					englishName: 'violationScore',
					status: false,
					number: 39,
					chineseName: '违章扣分'
				},
				illegalPerson: {
					englishName: 'illegalPerson',
					status: false,
					number: 40,
					chineseName: '违章人员'
				},
				post: {
					englishName: 'post',
					status: false,
					number: 41,
					chineseName: '岗位'
				},
				postType: {
					englishName: 'postType',
					status: false,
					number: 42,
					chineseName: '岗位分类'
				},
				employmentProperty: {
					englishName: 'employmentProperty',
					status: false,
					number: 43,
					chineseName: '用工性质'
				},
				workingYears: {
					englishName: 'workingYears',
					status: false,
					number: 44,
					chineseName: '工作年限'
				},
				education: {
					englishName: 'education',
					status: false,
					number: 45,
					chineseName: '学历'
				},
				//验证及纠正措施，第六项
				resVerifierName: {
					englishName: 'resVerifierName',
					status: false,
					number: 46,
					chineseName: '责任单位验证人'
				},
				resVerifyDate: {
					englishName: 'resVerifyDate',
					status: false,
					number: 47,
					chineseName: '责任单位验证时间'
				},
				resVerifyAdvice: {
					englishName: 'resVerifyAdvice',
					status: false,
					number: 48,
					chineseName: '责任单位验证意见'
				},
				cheVerifierName: {
					englishName: 'cheVerifierName',
					status: false,
					number: 49,
					chineseName: '审核单位验证人'
				},
				cheVerifyDate: {
					englishName: 'cheVerifyDate',
					status: false,
					number: 50,
					chineseName: '审核单位验证时间'
				},
				cheVerifyAdvice: {
					englishName: 'cheVerifyAdvice',
					status: false,
					number: 51,
					chineseName: '审核单位验证意见'
				},
				nonConformCorrect: {
					englishName: 'nonConformCorrect',
					status: false,
					number: 52,
					chineseName: '纠正'
				},
				nonConformCorrectMeasure: {
					englishName: 'nonConformCorrectMeasure',
					status: false,
					number: 53,
					chineseName: '纠正措施'
				},
				nonConformCorrectMeasureVerify: {
					englishName: 'nonConformCorrectMeasureVerify',
					status: false,
					number: 54,
					chineseName: '跟踪验证'
				},
				reformLimit: {
					englishName: 'reformLimit',
					status: false,
					number: 55,
					chineseName: '整改时限'
				},
				reformDate: {
					englishName: 'reformDate',
					status: false,
					number: 56,
					chineseName: '整改完成时间'
				},
				checkResultOptions: [{
						value: '符合',
						label: '符合'
					},
					{
						value: '不符合',
						label: '不符合'
					}
				],
				natureOptions: [{
						value: '建议项',
						label: '建议项'
					},
					{
						value: '观察项',
						label: '观察项'
					},
					{
						value: '问题项',
						label: '问题项'
					},
					{
						value: '不符合',
						label: '不符合'
					},
					{
						value: '违章项',
						label: '违章项'
					}

				]
			}
		},
		mounted() {
			//this.getData()
			this.queryAllPassTable()
			this.GetCompany()
		},
		methods: {
			getData() {
				this.queryAllTable()
			},
			//预览文件，使用外部插件
			preview(url) {
				if(!url){
					return 0
				}
				window.open('http://view.xdocin.com/xdoc?_xdoc=' + url)
			},
			allCheck(event, option) {
				switch (option) {
					case 'planBasisInfo':
						let planBasisInfo = [
							this.qualityCheckName,
							this.checkCategory,
							this.checkBasis,
							this.checkMethod,
							this.checkedCompanyName,
							this.checkedPersonName,
							this.group,
							this.groupLeaderName,
							this.projectName,
							this.projectLeaderName,
							this.checkPerson,
							this.checkDate
						]
						if (event) {
							for (var i = 0; i < planBasisInfo.length; i++) {
								planBasisInfo[i].status = true
								this.getOption(true, planBasisInfo[i])
							}
						} else {
							for (var i = 0; i < planBasisInfo.length; i++) {
								planBasisInfo[i].status = false
								this.getOption(false, planBasisInfo[i])
							}
						}
						break
					case 'impleBasisInfo':
						let impleBasisInfo = [
							this.checkProject,
							this.execStd,
							this.contractor,
							this.contractorNumber,
							this.owner,
							this.workerNumber,
							this.erpNumber,
							this.externalNumber,
							this.workPlace
						]
						if (event) {
							for (var i = 0; i < impleBasisInfo.length; i++) {
								impleBasisInfo[i].status = true
								this.getOption(true, impleBasisInfo[i])
							}
						} else {
							for (var i = 0; i < impleBasisInfo.length; i++) {
								impleBasisInfo[i].status = false
								this.getOption(false, impleBasisInfo[i])
							}
						}
						break
					case 'problemInfo':
						let problemInfo = [
							this.checkListName,
							this.checkResult,
							this.resultDescription,
							this.nature,
							this.problemDescription,
							this.responsePersonName,
							this.responsiCompanyName
						]
						if (event) {
							for (var i = 0; i < problemInfo.length; i++) {
								problemInfo[i].status = true
								this.getOption(true, problemInfo[i])
							}
						} else {
							for (var i = 0; i < problemInfo.length; i++) {
								problemInfo[i].status = false
								this.getOption(false, problemInfo[i])
							}
						}
						break
					case 'nonConformityInfo':
						let nonConformityInfo = [
							this.nonConformClause,
							this.nonConformClauseNo,
							this.nonConformClauseContent,
							this.nonConformityStd,
							this.nonConformityStdNo,
							this.nonConformityStdContent,
							this.nonConformityNature,
							this.nonConformityType,
							this.nonConformSource
						]
						if (event) {
							for (var i = 0; i < nonConformityInfo.length; i++) {
								nonConformityInfo[i].status = true
								this.getOption(true, nonConformityInfo[i])
							}
						} else {
							for (var i = 0; i < nonConformityInfo.length; i++) {
								nonConformityInfo[i].status = false
								this.getOption(false, nonConformityInfo[i])
							}
						}
						break
					case 'violationInfo':
						let violationInfo = [
							this.punishmentBasis,
							this.violationClause,
							this.violationClauseContent,
							this.violationDeduction,
							this.violationScore,
							this.illegalPerson,
							this.post,
							this.postType,
							this.employmentProperty,
							this.workingYears,
							this.education
						]
						if (event) {
							for (var i = 0; i < violationInfo.length; i++) {
								violationInfo[i].status = true
								this.getOption(true, violationInfo[i])
							}
						} else {
							for (var i = 0; i < violationInfo.length; i++) {
								violationInfo[i].status = false
								this.getOption(false, violationInfo[i])
							}
						}
						break
					case 'verifyAndcorInfo':
						let verifyAndcorInfo = [
							this.resVerifierName,
							this.resVerifyDate,
							this.resVerifyAdvice,
							this.cheVerifierName,
							this.cheVerifyDate,
							this.cheVerifyAdvice,
							this.nonConformCorrect,
							this.nonConformCorrectMeasure,
							this.nonConformCorrectMeasureVerify,
							this.reformLimit,
							this.reformDate
						]
						if (event) {
							for (var i = 0; i < verifyAndcorInfo.length; i++) {
								verifyAndcorInfo[i].status = true
								this.getOption(true, verifyAndcorInfo[i])
							}
						} else {
							for (var i = 0; i < verifyAndcorInfo.length; i++) {
								verifyAndcorInfo[i].status = false
								this.getOption(false, verifyAndcorInfo[i])
							}
						}
						break
					default:
						break
				}
			},
			showFilterAllCheck(event, option) {
				switch (option) {
					case 'planBasisInfo':
						if (event) {
							this.showFilter.qualityCheckName = true
							this.showFilter.checkCategory = true
							this.showFilter.checkBasis = true
							this.showFilter.checkMethod = true
							this.showFilter.checkedCompanyName = true
							this.showFilter.checkedPersonName = true
							this.showFilter.group = true
							this.showFilter.groupLeaderName = true
							this.showFilter.projectName = true
							this.showFilter.projectLeaderName = true
							this.showFilter.checkPerson = true
							this.showFilter.checkDate = true
						} else {
							this.showFilter.qualityCheckName = false
							this.showFilter.checkCategory = false
							this.showFilter.checkBasis = false
							this.showFilter.checkMethod = false
							this.showFilter.checkedCompanyName = false
							this.showFilter.checkedPersonName = false
							this.showFilter.group = false
							this.showFilter.groupLeaderName = false
							this.showFilter.projectName = false
							this.showFilter.projectLeaderName = false
							this.showFilter.checkPerson = false
							this.showFilter.checkDate = false
						}
						break
					case 'impleBasisInfo':
						if (event) {
							this.showFilter.checkProject = true
							this.showFilter.execStd = true
							this.showFilter.contractor = true
							this.showFilter.contractorNumber = true
							this.showFilter.owner = true
							this.showFilter.workerNumber = true
							this.showFilter.erpNumber = true
							this.showFilter.externalNumber = true
							this.showFilter.workPlace = true
						} else {
							this.showFilter.checkProject = false
							this.showFilter.execStd = false
							this.showFilter.contractor = false
							this.showFilter.contractorNumber = false
							this.showFilter.owner = false
							this.showFilter.workerNumber = false
							this.showFilter.erpNumber = false
							this.showFilter.externalNumber = false
							this.showFilter.workPlace = false
						}
						break
					case 'problemInfo':
						if (event) {
							this.showFilter.checkListName = true
							this.showFilter.checkResult = true
							this.showFilter.resultDescription = true
							this.showFilter.nature=true
							this.showFilter.problemDescription=true
							this.showFilter.responsePersonName = true
							this.showFilter.responsiCompanyName = true
						} else {
							this.showFilter.checkListName = false
							this.showFilter.checkResult = false
							this.showFilter.description = false
							this.showFilter.responsePersonName = false
							this.showFilter.responsiCompanyName = false
						}
						break
					case 'nonConformityInfo':
						if (event) {
							this.showFilter.nonConformClause = true
							this.showFilter.nonConformClauseNo = true
							this.showFilter.nonConformClauseContent = true
							this.showFilter.nonConformityStd = true
							this.showFilter.nonConformityStdNo = true
							this.showFilter.nonConformityStdContent = true
							this.showFilter.nonConformityNature = true
							this.showFilter.nonConformityType = true
							this.showFilter.nonConformSource = true
						} else {
							this.showFilter.nonConformClause = false
							this.showFilter.nonConformClauseNo = false
							this.showFilter.nonConformClauseContent = false
							this.showFilter.nonConformityStd = false
							this.showFilter.nonConformityStdNo = false
							this.showFilter.nonConformityStdContent = false
							this.showFilter.nonConformityNature = false
							this.showFilter.nonConformityType = false
							this.showFilter.nonConformSource = false
						}
						break
					case 'violationInfo':
						if (event) {
							this.showFilter.punishmentBasis = true
							this.showFilter.violationClause = true
							this.showFilter.violationClauseContent = true
							this.showFilter.violationDeduction = true
							this.showFilter.violationScore = true
							this.showFilter.illegalPerson = true
							this.showFilter.post = true
							this.showFilter.postType = true
							this.showFilter.employmentProperty = true
							this.showFilter.workingYears = true
							this.showFilter.education = true
						} else {
							this.showFilter.punishmentBasis = false
							this.showFilter.violationClause = false
							this.showFilter.violationClauseContent = false
							this.showFilter.violationDeduction = false
							this.showFilter.violationScore = false
							this.showFilter.illegalPerson = false
							this.showFilter.post = false
							this.showFilter.postType = false
							this.showFilter.employmentProperty = false
							this.showFilter.workingYears = false
							this.showFilter.education = false
						}
						break
					case 'verifyAndcorInfo':
						if (event) {
							this.showFilter.resVerifierName = true
							this.showFilter.resVerifyDate = true
							this.showFilter.resVerifyAdvice = true
							this.showFilter.cheVerifierName = true
							this.showFilter.cheVerifyDate = true
							this.showFilter.cheVerifyAdvice = true
							this.showFilter.nonConformCorrect = true
							this.showFilter.nonConformCorrectMeasure = true
							this.showFilter.nonConformCorrectMeasureVerify = true
							this.showFilter.reformLimit = true
							this.showFilter.reformDate = true
						} else {
							this.showFilter.resVerifierName = false
							this.showFilter.resVerifyDate = false
							this.showFilter.resVerifyAdvice = false
							this.showFilter.cheVerifierName = false
							this.showFilter.cheVerifyDate = false
							this.showFilter.cheVerifyAdvice = false
							this.showFilter.nonConformCorrect = false
							this.showFilter.nonConformCorrectMeasure = false
							this.showFilter.nonConformCorrectMeasureVerify = false
							this.showFilter.reformLimit = false
							this.showFilter.reformDate = false
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
			getOption(event, chosenOne) {
				if (event == true) {
					let temp = this.downloadList.filter(item => {
						return chosenOne.englishName === item.englishName
					})
					if (temp.length == 0) {
						this.downloadList.push(chosenOne)
					}
				} else {
					this.downloadList.splice(this.downloadList.indexOf(chosenOne), 1)
				}
			},
			openDownloadOption() {
				let downloadOptions = [
					this.qualityCheckName,
					this.checkCategory,
					this.checkBasis,
					this.checkMethod,
					this.checkedCompanyName,
					this.checkedPersonName,
					this.group,
					this.groupLeaderName,
					this.projectName,
					this.projectLeaderName,
					this.checkPerson,
					this.checkDate,
					// ]
					// let checkDoingInfo=[
					this.checkProject,
					this.execStd,
					this.contractor,
					this.contractorNumber,
					this.owner,
					this.workerNumber,
					this.erpNumber,
					this.externalNumber,
					this.workPlace,
					// ]
					// let checkProblemInfo=[
					this.checkListName,
					this.checkResult,
					this.resultDescription,
					this.nature,
					this.problemDescription,
					this.responsePersonName,
					this.responsiCompanyName,
					// ]
					// let nonConformityInfo=[
					this.nonConformClause,
					this.nonConformClauseNo,
					this.nonConformClauseContent,
					this.nonConformityStd,
					this.nonConformityStdNo,
					this.nonConformityStdContent,
					this.nonConformityNature,
					this.nonConformityType,
					this.nonConformSource,
					// ]
					// let violationInfo=[
					this.punishmentBasis,
					this.violationClause,
					this.violationClauseContent,
					this.violationDeduction,
					this.violationScore,
					this.illegalPerson,
					this.post,
					this.postType,
					this.employmentProperty,
					this.workingYears,
					this.education,
					// ]
					// let verifyAndCorInfo=[
					this.resVerifierName,
					this.resVerifyDate,
					this.resVerifyAdvice,
					this.cheVerifierName,
					this.cheVerifyDate,
					this.cheVerifyAdvice,
					this.nonConformCorrect,
					this.nonConformCorrectMeasure,
					this.nonConformCorrectMeasureVerify,
					this.reformLimit,
					this.reformDate
				]
				for (var i = 0; i < downloadOptions.length; i++) {
					downloadOptions[i].status = false
				}
				this.downloadList = []
				this.downloadEnglishList = []
				this.downloadChineseList = []
				this.downloadOptionDialog = true
			},
			saveDownloadFileterOption() {
				this.$confirm('保存将会下载选中的字段，确定要执行吗？', '下载确认', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: "warning"
				}).then(() => {
					for (var i = 0; i < this.downloadList.length - 1; i++) {
						for (var j = i + 1; j < this.downloadList.length; j++) {
							if (this.downloadList[i].number > this.downloadList[j].number) {
								var temp = this.downloadList[i]
								this.downloadList[i] = this.downloadList[j]
								this.downloadList[j] = temp
							}
						}
					}
					for (var i = 0; i < this.downloadList.length; i++) {
						this.downloadEnglishList.push(this.downloadList[i].englishName)
						this.downloadChineseList.push(this.downloadList[i].chineseName)
					}
					this.downloadOptionDialog = false
					this.download()
				})

			},
			GetCompany() {
				GetCompany().then(res => {
					this.companyList = res.data
				})
			},
			filterHandler(value, row, column) {
				const property = column['property'];
				this.downloadSource = this.downloadSource.filter(item => {
					return item[property] === value
				})
				return row[property] === value
			},
			download() {
				var option = {}
				option.fileName = "质量专项检查记录统计表"
				option.datas = [{
					sheetData: this.downloadSource,
					sheetFilter: this.downloadEnglishList,
					sheetHeader: this.downloadChineseList
				}]
				var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
			},
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
			queryAllTable() {
				queryAllTable().then(res => {
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
			getCombineData() {
				this.checkRecordList = []
				for (var i = 0; i < this.qualityCheckList.length; i++) {
					this.combineData(this.qualityCheckList[i], this.qualityRecordList[i], this.qualityCheckTree[i])
				}
				let flag=false
				for(var i=0;i<this.checkRecordList.length;i++){
					if(this.checkRecordList[i].checkResult=='不符合'&&this.checkRecordList[i].nature==''){
						flag=true
						break
					}
				}
				if(flag){
					console.log('data reload')
					this.$message.error('界面出错了，正重新加载')
					location.reload()
				}
				this.qualityCheckNameFilter = []
				this.checkListNameFilter = []
				this.companyFilter = []
				this.companyLeaderFilter = []
				this.groupFilter = []
				this.groupLeaderFilter = []
				this.projectFilter = []
				this.projectLeaderFilter = []
				this.checkResultFilter = []
				this.natureFilter = []
				this.responsiCompanyNameFilter=[]
				this.responsePersonNameFilter=[]
				this.checkCategoryFilter = []
				this.checkBasisFilter = []
				this.checkMethodFilter = []
				this.checkPersonFilter = []
				this.checkProjectFilter = []
				this.execStdFilter = []
				this.contractorFilter = []
				this.ownerFilter = []
				this.workPlaceFilter = []
				this.nonConformClauseFilter = []
				this.nonConformSourceFilter = []
				this.nonConformityNatureFilter = []
				this.nonConformityTypeFilter = []
				this.nonConformityStdFilter = []
				this.punishmentBasisFilter = []
				this.illegalPersonFilter = []
				this.postFilter = []
				this.postTypeFilter = []
				this.employmentPropertyFilter = []
				this.workingYearsFilter = []
				this.educationFilter = []
				for (var i = 0; i < this.checkRecordList.length; i++) {
					this.pushItem(this.checkRecordList[i].qualityCheckName, this.qualityCheckNameFilter)
					this.pushItem(this.checkRecordList[i].checkListName, this.checkListNameFilter)
					this.pushItem(this.checkRecordList[i].checkCategory, this.checkCategoryFilter)
					this.pushItem(this.checkRecordList[i].checkBasis, this.checkBasisFilter)
					this.pushItem(this.checkRecordList[i].checkMethod, this.checkMethodFilter)
					this.pushItem(this.checkRecordList[i].checkResult, this.checkResultFilter)
					this.pushItem(this.checkRecordList[i].nature, this.natureFilter)
					this.pushItem(this.checkRecordList[i].responsiCompanyName,this.responsiCompanyNameFilter)
					this.pushItem(this.checkRecordList[i].responsePersonName,this.responsePersonNameFilter)
					this.pushItem(this.checkRecordList[i].checkedCompanyName, this.companyFilter)
					this.pushItem(this.checkRecordList[i].checkedPersonName, this.companyLeaderFilter)
					this.pushItem(this.checkRecordList[i].group, this.groupFilter)
					this.pushItem(this.checkRecordList[i].groupLeaderName, this.groupLeaderFilter)
					this.pushItem(this.checkRecordList[i].projectName, this.projectFilter)
					this.pushItem(this.checkRecordList[i].projectLeaderName, this.projectLeaderFilter)
					this.pushItem(this.checkRecordList[i].checkPerson, this.checkPersonFilter)

					this.pushItem(this.checkRecordList[i].checkProject, this.checkProjectFilter)
					this.pushItem(this.checkRecordList[i].execStd, this.execStdFilter)
					this.pushItem(this.checkRecordList[i].owner, this.ownerFilter)
					this.pushItem(this.checkRecordList[i].workPlace, this.workPlaceFilter)
					this.pushItem(this.checkRecordList[i].nonConformClause, this.nonConformClauseFilter)
					this.pushItem(this.checkRecordList[i].nonConformityStd, this.nonConformityStdFilter)
					this.pushItem(this.checkRecordList[i].nonConformityNature, this.nonConformityNatureFilter)
					this.pushItem(this.checkRecordList[i].nonConformityType, this.nonConformityTypeFilter)
					this.pushItem(this.checkRecordList[i].nonConformSource, this.nonConformSourceFilter)
					this.pushItem(this.checkRecordList[i].punishmentBasis, this.punishmentBasisFilter)
					this.pushItem(this.checkRecordList[i].illegalPerson, this.illegalPersonFilter)
					this.pushItem(this.checkRecordList[i].post, this.postFilter)
					this.pushItem(this.checkRecordList[i].postType, this.postTypeFilter)
					this.pushItem(this.checkRecordList[i].employmentProperty, this.employmentPropertyFilter)
					this.pushItem(this.checkRecordList[i].workingYears, this.workingYearsFilter)
					this.pushItem(this.checkRecordList[i].education, this.educationFilter)
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
				console.log('qualityCheckTree', qualityCheckTree)
				for (var i = 0; i < qualityCheckTree.length; i++) {
					if (!qualityCheckTree[i].children) {
						var checkRecordItem = {
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
							problemDescription:'',
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
						let temp=[]
						temp = qualityRecordList.filter(item => {
							return item.checkListCode == qualityCheckTree[i].checkListCode
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
