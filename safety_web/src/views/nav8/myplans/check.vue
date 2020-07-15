<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">我编制的计划</a></el-breadcrumb-item>
        <el-breadcrumb-item>查看计划</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <el-form :model="planForm">
					<el-form-item label="检查名称：">
						<el-p v-model="planForm.taskName">{{taskName}}</el-p>
					</el-form-item>
					<el-form-item label="检查单位：">
						<el-p v-model="planForm.companyName">{{companyName}}</el-p>
					</el-form-item>
						<el-form-item label="开始时间：">
						<el-p v-model="planForm.startTime">{{startDate}}</el-p>
					</el-form-item>
						<el-form-item label="结束时间：">
						<el-p v-model="planForm.endTime">{{endDate}}</el-p>
					</el-form-item>
				</el-form>
      </div>
			<div>
				<span>检查内容：</span>
        <el-tree :data="checkItem" node-key="id" ref="tree" highlight-current ></el-tree>
			</div>
    </div>
  </div>
</template>

<script>
import {GetPlanByTaskId,GetPlanContent} from '../../../services/task'
import {GetPersonPlandetail} from '../../../services/personCenter'
import {updateNewPlan} from '../../../services/complateplan'
import { newSendMessage } from "../../../services/chat"
	export default {
		data () {
			return {
				taskID: '',
				taskName: '',
				companyName: '',
				startDate: '',
				endDate: '',
				checkItem: [],
				planForm: {},
				planID: '',
				taskCheckPersonsID:'',
				change:{
					modification:'',
					status:'审核不通过'
				},
				addEventdialogVisible: false,
				checkPersonsID:'',

			}
		},
		methods: {
			//计划审核不通过
			roleChange(){
			this.addEventdialogVisible = true;
			// this.handelGetRoleDetail(id)
			},
			getCheckContent () {
				// alert(this.planId)
				GetPlanContent(this.planID).then((res) => {
					// alert("进入")
					this.checkItem = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			getCheckItem () {
				GetPlanByTaskId(this.taskID).then((res) => {
					// alert(JSON.stringify(res.data))
					// alert("1"+res.data.planId)
					this.planID = res.data.planId
					this.checkCompany = res.data.companyName
					this.startTime = res.data.startDate
					this.endTime = res.data.endDate
					this.taskCheckPersonsID=res.date.taskCheckPersonsID

					// setTimeout(this.getCheckContent,500);
					
				}).catch((err) => {
					this.$message.error(err.message)
				})	
				
			},

			getPlanDTO () {
				this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
				const id = JSON.parse(localStorage.getItem('data'));
				// const id = this.$route.params.id
				GetPersonPlandetail(id).then((res) => {
					// alert(JSON.stringify(res))
					this.checkPersonsID=res.data.checkPersonsID
					this.taskID = res.data.taskID
					this.taskName = res.data.taskName
					//通过TaskID得到planID
					if(res.data.length != ""){
							this.planID = res.data.planId
							// alert('planID:'+this.planID )
							this.companyName = res.data.companyName
							this.startDate = res.data.startDate
							this.endDate = res.data.endDate
							this.taskCheckPersonsID=res.data.taskCheckPersonsID
							// alert('taskCheckPersonsID:'+this.taskCheckPersonsID )
							// this.data.taskID=this.taskID
							// this.data.taskCheckPersonsID=this.taskCheckPersonsID
							// setTimeout(this.getCheckContent,500);
							//通过planID获取plan
							GetPlanContent(this.planID).then((res) => {
								// alert("进入")
								this.checkItem = res.data
							}).catch((err) => {
								this.$message.error(err.message)
							})
						}
					}).catch((err) => {
						this.$message.error(err.message)
					})
				// setTimeout(this.getCheckItem,500);
				
			},
			timestampToTime (timestamp) {
				var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
			},
			passSubmit (data) {
				// alert(JSON.stringify(data))
				this.$confirm('确定同意计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					// alert(this.checkPersonsID)
					newSendMessage({status: 101,user_id:this.checkPersonsID}).then().catch();
          updateNewPlan(this.planID,data).then(() => {
          }, (err) => {
            this.$message.error(err.message)
					})
					// this.$router.go(-1) //返回上一url
					this.$router.push({ name: 'personTaskNew', params: {id:this.taskID}})
        }).catch(() => {
        })

			},
			// 提交计划
			handleSubmit (formName) {
				// this.checkFilterParams()
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// alert(JSON.stringify(this.planID))
						// alert(JSON.stringify(this.change))
						updateNewPlan(this.planID,this.change).then( () => {
							// alert(JSON.stringify(res.data))
							this.addEventdialogVisible = false;
							// this.$router.go(-1) //返回上一url
							this.$router.push({ name: 'personTaskNew', params: {id:this.taskID}})
						}).catch((err) => {
							this.$message.error(err.message)
						})
					} else {
						return false;
						}
						});	
			},
		},
		mounted () {
			this.getPlanDTO();
		}
	}
</script>