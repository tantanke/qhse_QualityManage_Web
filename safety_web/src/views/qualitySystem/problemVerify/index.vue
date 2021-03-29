<template>
	<div>
		<div class="page-title" style="width: 100%">问题验证</div>
		<div
		class="page-content"
		v-loading="loading"
		element-loading-text="拼命加载中"
		element-loading-spinner="el-icon-loading">
			<el-form :inline="true" :model="inquireForm">
				<el-form-item label="受审单位">
                <treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
					v-model="inquireCompanyId"></treeselect>
            </el-form-item>
				<el-form-item label="审核日期">
					<!-- 2021-3-29 10:24 新增时间格式-->
					<el-date-picker
					 	v-model="selectCheckDate"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" >
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="handleInquire">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="problemList" border stripe max-height="560px">
				<el-table-column type="expand" label="详情" width="60px">
					<template slot-scope="scope">
						<el-row>
							<el-col :span="12">
							    <div class="detail">受审核单位: {{scope.row.checkedCompanyName}}</div>
							    <div class="detail">受审室组: {{scope.row.group}}</div>
								<div class="detail">作业项目名称: {{scope.row.projectName}}</div>
								<div class="detail">检测项目: {{scope.row.checkProject}}</div>
								<div class="detail">检测标准: {{scope.row.execStd}}</div>
							</el-col>
							<el-col :span="8">
								<div class="detail">单位负责人: {{scope.row.checkedPersonName}}</div>
								<div class="detail">室组长: {{scope.row.groupLeaderName}}</div>
							    <div class="detail">项目组长: {{scope.row.projectLeaderName}}</div>
								<div class="detail">业主: {{scope.row.owner}}</div>
								<div class="detail">作业地点: {{scope.row.workPlace}}</div>
							</el-col>
							<el-col :span="4">
								<div class="detail">承包商: {{scope.row.contractor}}</div>
								<div class="detail">承包商人数: {{scope.row.contractorNumber}}</div>
								<div class="detail">作业人数: {{scope.row.workerNumber}}</div>
							    <div class="detail">ERP员工数量: {{scope.row.erpNumber}}</div>
								<div class="detail">外聘员工数量: {{scope.row.externalNumber}}</div>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index" label="序号" width="60px" align="center"></el-table-column>
				<el-table-column prop="qualityCheckName" width="200" label="审核任务名称" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkCategory" label="审核类别" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkBasis" label="审核依据" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkMethod" label="审核方式" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkPerson" label="审核人员" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="checkDate" width="120" label="审核日期" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="progress" label="审核进度" width="100" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="finishDate" label="(整改/验证)完成时间" align="center" width="120"></el-table-column>
				<el-table-column label="操作" align="center" width="120" fixed="right">
				    <template slot-scope="scope">
				        <el-button type="primary" icon="el-icon-edit" size="mini" @click="jumpProblemVerify(scope.row)" v-if="scope.row.isPush === '已推送' && scope.row.issued === '已下达'">验证</el-button>
				        <el-button type="warning" icon="el-icon-success" size="mini" @click="jumpProblemVerify(scope.row)" v-else>查看</el-button>
				    </template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import { inquireProblemForm, getBasicInfomation } from "../../../services/qualitySystem/problemAccept"
	import { GetCurrentUser } from '../../../store/CurrentUser'
	import { GetCompany } from "../../../services/gettreedata"
	export default{
		data(){
			return{
				loading:false,
				problemList:[],
				inquireCompanyId: null,
				// 公司ID
				companyId: null,
				// 公司code
				companyCode: '',
				companyName: '',
				// 公司列表数据
				companyList: [],
				inquireCheckDate: [],
				// 查询表格部分数据，2021-3-29 10:22，新增查询存储数组
				selectCheckDate:[],
				inquireForm: {
				    checkedCompanyCode: null,
				    checkDate: '',
				    checkEndDate:''
				},
			}
		},
		watch: {
			// 监听查询公司id
			'inquireCompanyId':'inquireCompanyIdChanged'
    	},
		created: function () {
			this.loading = true
			this.getCompany()
			this.getBasicInfo()
		},
		methods:{
			GetCurrentUser: function () {
				return GetCurrentUser()
			},
			handleInquire: function () {
				// 2021-3-29 10:20修改查询
				// 查询表格部分数据
				if(this.inquireForm.checkedCompanyCode == null || this.selectCheckDate.length==0) {
				    return this.$message.error('请同时选择公司以及审核日期')
				}
				this.inquireForm.checkDate=this.selectCheckDate[0]
				this.inquireForm.checkEndDate=this.selectCheckDate[1]
				inquireProblemForm(this.inquireForm).then((res) => {
					console.log('查询问题接收主表表单的信息')
					console.log(res.data)
					this.problemList = this.sortByDate(res.data)
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			getBasicInfo: function() {
			    //查询所有的基本信息登记表
				this.processFailed()    
			},
			processFailed: function () {
				// 筛选出流程未通的数据
				getBasicInfomation().then((res) => {
					console.log('查询所有基本信息生成的信息')
					console.log(res.data)
					let problemDataList = res.data
					problemDataList = problemDataList.filter((item) => {
							return item.issued !== '未下达' && item.checkedCompanyCode===this.GetCurrentUser().companyCode
						})
					this.problemList = this.sortByDate(problemDataList)
					this.loading = false
				}).catch((err) => {
					this.$message.error(err.message)
				})   
			},
			inquireCompanyIdChanged: function (val) {
				// 监听查询公司id
				if(val) {
					this.changeCompanyIdToName(this.companyList, this.inquireCompanyId)
					this.inquireForm.checkedCompanyCode = this.companyCode
				}else {
					this.inquireForm.checkedCompanyCode = null
					this.companyCode = ''
				}
			},
			jumpProblemVerify: function (row) {
				// 跳转问题整改页面
				this.$router.push({
					path: '/qualitySystem/problemVerify/verify',
					query: {
						queryData:row
					}
				})
			},
			// 获取公司表
			getCompany: function () {
				GetCompany().then(res => {
					this.companyList = res.data
					console.log('公司表')
					console.log(this.companyList)
				}).catch(err => {
					this.$message.error(err.message)
					})
				
			},
			// 将公司Id转化为公司名称，并且保存nodeCode
			changeCompanyIdToName: function (val,companyId) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].id == companyId) {
							this.companyCode = val[j].nodeCode
							console.log('公司nodeCode:'+this.companyCode)
							this.companyName = val[j].label
							console.log('公司名称:' + val[j].label)
							break
						} else if (val[j].children) {
							this.changeCompanyIdToName(val[j].children, companyId)
						}
					}
				}
			},
			// 时间格式化
			formatDate: function (time) {
				const timer = time.getTime()
				console.log(timer)
				const date = new Date(timer)
				const y = date.getFullYear()
				const m = date.getMonth() + 1
				const mm = m < 10 ? '0' + m : m
				const d = date.getDate()
				const dd = d < 10 ? '0' + d : d
				return y + '-' + mm + '-' + dd
			},
			sortByDate(data){
			    if(!data){
			        return
			    }
			    for(var i=0;i<data.length-1;i++){
			        for(var j=i+1;j<data.length;j++){
			            if(data[i].checkDate<=data[j].checkDate){
			                let temp=data[i]
			                data[i]=data[j]
			                data[j]=temp
			            }
			        }
			    }
			    return data
			},
		}
	}
</script>

<style scoped>
.detail {
    margin: 20px 0;
    color: #999;
}
</style>
