<template>
	<div>
		<div class="page-title" style="width:100%">远程计划提取</div>
		<div class="page-content"  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
			<el-form :inline="true">
				<el-form-item label="填报日期">
					<el-date-picker v-model="WRITE_DATE" value-format="yyyy-MM-dd" format="yyyy年MM月dd日"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-serach" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="data" :border="true" stripe max-height="540px">
				<el-table-column label="序号" width="50" type="index" :show-overflow-tooltip="true"align="center"></el-table-column>
				<el-table-column label="记录仪编号" prop="RECORD_NUMBER" width="120" :show-overflow-tooltip="true"align="center"></el-table-column>
				<el-table-column label="基层单位" prop="DPT_NAME" width="150" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="室组" prop="C_DPT_NAME" width="150" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="项目名称" prop="PROJECT_NAME" width="150" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="负责人" prop="PRINCIPAL" width="80" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="联系电话" prop="PHONE" width="120" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="作业地点" prop="WORK_LOCATION" width="150" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="计划作业时间" prop="WORK_PLAN" width="150" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="填报时间" prop="WRITE_DATE" width="150" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="作业人员" prop="WORK_USER" width="200" :show-overflow-tooltip="true" align="center"></el-table-column>
				<el-table-column label="作业设备" prop="EQ_NUMBER" width="200" :show-overflow-tooltip="true" align="center"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import {getPlan} from '../../../services/remote.js'
	export default{
		data(){
			return{
				loading:false,
				WRITE_DATE:'',
				data:[],
			}
		},
		mounted(){
			this.loadParams()
		},
		methods:{
			loadParams(){
				this.loading=true
				let today=new Date().toISOString().substr(0,10)
				this.WRITE_DATE=today
				getPlan(today).then(res=>{
					this.data=res.data
					this.loading=false
				}).catch(err=>{
					this.$message.error(err.message)
					this.loading=false
				})
			},
			search(){
				if(this.WRITE_DATE){
					this.loading=true
					getPlan(this.WRITE_DATE).then(res=>{
						this.data=res.data
						this.loading=false
					}).catch(err=>{
					this.$message.error(err.message)
					this.loading=false
				})
				}else{
					return this.$message.warning('请选择填报日期后进行查询！')
				}
			},
		}
	}
</script>

<style>
</style>
