<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">编制计划</a></el-breadcrumb-item>
        <el-breadcrumb-item>编辑我的计划</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <el-form :model="planForm" ref="planForm" :rules="rules" label-position="left"  label-width="100px">
		<el-row  v-if="this.client === 'android'">
			<el-col :span="16" style="padding-right:10px; border-right:3px solid #dddddd">
				<el-form-item label="检查名称：" style="margin-left:8px">
					<el-p v-model="planForm.checkName">{{taskName}}</el-p>
				</el-form-item>
				<el-row>
					<el-form-item label="检查单位："  prop="companyCode" label-width="100px">
						<treeselect
						:multiple="true"
						:options="companys"
						placeholder="受检单位"
						v-model="planForm.companyCode"
						style="width:360px;"
						:searchable="false"/>
					</el-form-item>
				</el-row>
					<el-form-item label="受检时间：" style="margin-left:8px" prop="dateRange">
						<el-date-picker
							v-model="planForm.dateRange"
							type="daterange"
							align="right"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							:editable="false">
						</el-date-picker>
					</el-form-item>
					<el-form-item prop="planContent" label="检查内容："  label-width="100px" >
						<!-- <span>检查内容：</span> -->
						<el-tree v-model="planForm.planContent" :data="checkItem" :default-checked-keys="this.nodeIdList" show-checkbox node-key="id" ref="tree" highlight-current></el-tree>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="handleSubmit ('planForm')">提交</el-button>
						&nbsp;
						<a @click="$router.go(-1)">
							<el-button native-type="button">取消</el-button>
						</a>
					</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核意见：" style="margin-left:15px">
							<el-p v-model="planForm.modification">{{modification}}</el-p>
						</el-form-item>
					</el-col>
				</el-row>
		<el-row v-else>
			<el-col :span="12" style="padding-right:10px; border-right:3px solid #dddddd">
				<el-form-item label="检查名称：" style="margin-left:8px">
					<el-p v-model="planForm.checkName">{{taskName}}</el-p>
				</el-form-item>
				<el-row>
					<el-form-item label="检查单位："  prop="companyCode" label-width="100px">
						<treeselect
						:multiple="true"
						:options="companys"
						placeholder="受检单位"
						v-model="planForm.companyCode"
						style="width:360px;"
						/>
					</el-form-item>
				</el-row>
					<el-form-item label="受检时间：" style="margin-left:8px" prop="dateRange">
						<el-date-picker
							v-model="planForm.dateRange"
							type="daterange"
							align="right"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item prop="planContent" label="检查内容："  label-width="100px" >
						<!-- <span>检查内容：</span> -->
						<el-tree v-model="planForm.planContent" :data="checkItem" :default-checked-keys="this.nodeIdList" show-checkbox node-key="id" ref="tree" highlight-current></el-tree>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="handleSubmit ('planForm')">提交</el-button>
						&nbsp;
						<a @click="$router.go(-1)">
							<el-button native-type="button">取消</el-button>
						</a>
					</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="审核意见：" style="margin-left:15px">
							<el-p v-model="planForm.modification">{{modification}}</el-p>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
      </div>
    </div>
  </div>
</template>

<script>
	// import {GetDictionary} from '../../../services/dictionary'
	import {GetPersonPlandetail} from '../../../services/personCenter'
	import {GetCheckContentsTree,updateNewPlan,GetTreeNodeId} from '../../../services/complateplan'
	import {GetPlanByTaskId} from '../../../services/task'
	// import {GetTaskDetail} from '../../../services/task'
	import {GetCompany} from '../../../services/gettreedata'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import Vue from 'vue'
	import VueCookies from 'vue-cookies'
	Vue.use(VueCookies)

	export default {
		data () {
			return {
				client:VueCookies.get("client"),
				planForm: {
					checkName: '',
					taskID: '',
					taskCheckPersonsID:'',
					companyCode:[],
					// area: '',
					startDate: '',
					endDate: '',
					checkType1: '',
					checkType2: '',
					planId: '',
					planContent: [],
					status:'',
					dateRange: '',
				},
				modification:'',
				defaultChecked: '',
				planId: '',
				checkItem: [],		
				companys: [],
				taskName: '',
				areas: '',
				companyLoading: false,
				nodeIdList: [],
				rules:{
					companyCode :[{required: true, message: '请选择检查单位', trigger: 'blur' }],
					dateRange :[{required: true, message: '请选择受检时间', trigger: 'change' }],
					// planContent :[{required: true, message: '检查内容不可为空', trigger: 'change' }],
					}
					}
					},
		methods: {
			getPlanDetail(){
				// const id = this.$route.params.id
				this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
				const id = JSON.parse(localStorage.getItem('data'));
				// alert('计划id:'+id)
				GetPersonPlandetail(id).then((res) => {
					// alert(JSON.stringify(res))
					this.taskName = res.data.taskName
					if(res.data.length != ""){
						this.planId = res.data.planId
						this.planForm.planId=this.planId
						this.planForm.companyCode = res.data.companyCode
						this.planForm.companyCode=this.planForm.companyCode.split(",")
						this.planForm.area = res.data.area
						this.modification=res.data.modification
						this.planForm.dateRange=[res.data.startDate,res.data.endDate]
						//小任务id
						this.planForm.taskCheckPersonsID=res.data.taskCheckPersonsID
						//大任务id
						this.planForm.taskID = res.data.taskID
						//通过planID得到plan
						GetTreeNodeId(this.planId).then((res) => {
							// alert(this.planId)
							this.nodeIdList = res.data
							// alert(JSON.stringify(this.nodeIdList))
						}).catch((err) => {
							this.$message.error(err.message)
						})
						setTimeout(this.getCheckContent,500);
					}
				}).catch((err) => {
					this.$message.error(err.message)
				})	
			},

			// 得到检查内容树数据
			CheckContentsTree () {
				GetCheckContentsTree().then((res) => {
					this.checkItem = res.data
				});
			},
			// 得到检查单位下拉框数据
			handleCompanySearch () {
				// this.companyLoading = true
				GetCompany().then((res) => {
					// alert(JSON.stringify(res.data))
					this.companys = res.data
					// this.companyLoading = false
					}).catch((err) => {
					this.$message.error(err.message)
					this.companyLoading = false
					})
			},
		// 提交计划
			handleSubmit (formName) {
				this.checkFilterParams()
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.planForm.companyCode=this.planForm.companyCode.join(',')
						// alert(JSON.stringify(this.planForm))
						updateNewPlan(this.planId,this.planForm).then( () => {
							this.$message.success('创建成功')
							this.$router.go(-1) //返回上一url
						}).catch((err) => {
							this.$message.error(err.message)
						})
					} else {
						return false;
						}
						});	
			},
			getCheckContent () {
				GetTreeNodeId(this.planId).then((res) => {
					// console.log(res.data)
					this.nodeIdList = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			getCheckItem () {
				// alert(this.planForm.taskId)
				GetPlanByTaskId(this.planForm.taskID).then((res) => {
					// alert(JSON.stringify(res))
					if(res.data.length != ""){
						this.planId = res.data.planId 
						this.planForm.companyCode = res.data.companyCode
						this.planForm.area = res.data.area
						this.planForm.dateRange=[res.data.startDate,res.data.endDate]
						setTimeout(this.getCheckContent,500);
					}
				}).catch((err) => {
					this.$message.error(err.message)
				})	
			},
			//对数据进行包装，满足后端要求
			checkFilterParams () {
				//datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
				if (this.planForm.dateRange && this.planForm.dateRange.length === 2) {
					this.planForm.startDate = this.planForm.dateRange[0]
					this.planForm.endDate = this.planForm.dateRange[1]
				} else {
					this.planForm.startDate = ''
					this.planForm.endDate = ''
				}		
				//对检查内容进行绑定
				let item1 = []
				let item2 = []
				let item3 = []
				let value = this.$refs.tree.getCheckedNodes(true)
				for(var i=0;i<value.length;i++){
					item3.push(value[i].nodeCode)
					item2.push(value[i].nodeCode.substring(0,8))
					item1.push(value[i].nodeCode.substring(0,4))
				}
				for(var j=0;j<value.length;j++){
					var dict = {};
					dict.taskName = this.taskName
					dict.item3 = item3[j]
					dict.item2 = item2[j]
					dict.item1 = item1[j]
					dict.standard = ''
					dict.score = ''
					this.planForm.planContent.push(dict)
				}
      },
		},
		mounted () {
			// this.getTask();
			this.handleCompanySearch();
			// this.getStatusDict();
			this.CheckContentsTree();
			this.getPlanDetail();
		}
	}
</script>