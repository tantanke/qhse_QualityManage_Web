<template>
	<div>
		<div class="page-title">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><a @click="$router.go(-1)">规章制度</a></el-breadcrumb-item>
				<el-breadcrumb-item>修改规章制度</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="page-content">
			<div class="form-content">
				<br />
				<el-form label-width="140px" :model="formData" style="width:80%">
					<el-form-item label="文号">
						<el-input v-model="formData.documentSymbol"></el-input>
					</el-form-item>
					<el-form-item label="文件名称">
						<el-input v-model="formData.regName"></el-input>
					</el-form-item>
					<el-form-item label="发布机构">
						<treeselect filterable :multiple="false" :options="options" placeholder="请选择发布机构" v-model="formData.publishComCode"
						 style="width:100%" />
					</el-form-item>
					<el-form-item label="文件类型">
						<el-select v-model="formData.typeName" placeholder="请选择文件类型" style="width:100%" @change="onChangedType">
							<el-option v-for="item in types" :key="item.dictCode" :label="item.name" :value="item.name">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="开始执行时间">
						<el-date-picker v-model="formData.beginDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
						 placeholder="请选择发生日期" style="width:100%">
						</el-date-picker>
					</el-form-item>
					<!-- <el-form-item label="上传时间">
            <el-input v-model="formData.uploadDate" readonly></el-input>
          </el-form-item>
          <el-form-item label="文件简介">
            <el-input v-model="formData.summary" type="textarea" style="width:100%" :autosize="{ minRows: 4}" placeholder="请输入文件简介,200字以内。"></el-input>
          </el-form-item> -->
					<el-form-item label="文档附件">
						<el-upload :action="`/api/file_upload`" :on-remove="handleRemove" :before-upload="handleBeforeUpload"
						 :auto-upload='true' :headers="{Authorization:currentUser.token}" :file-list="fileList" :on-success="handleSuccess"
						 :limit="1" list-type="text" accept=".pdf,.PDF,.docx,.DOCX">
							<el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传一个word文件，且不超过12M。</div>
						</el-upload>
					</el-form-item>
					<el-form-item class="buttons">
						<el-button type="primary" icon="el-icon-check" style="width:100px" @click="handleSubmit('formData')">确定</el-button>
						&nbsp;
						<a @click="$router.go(-1)">
							<el-button icon="el-icon-refresh-left" style="width:100px" native-type="button">取消</el-button>
						</a>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		GetFileDetail,
		UpdateFile
	} from '../../../services/studyCase_rules'
	import {
		GetDictionary
	} from '../../../services/dictionary'
	import {
		GetCurrentUser
	} from '../../../store/CurrentUser';
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import {
		GetCompany
	} from '../../../services/gettreedata'



	export default {
		data() {
			return {
				companyCode:null,
				companyId:'',
				companyName:'',
				formData: {
					caseName: '',
					taskAndProcessCode: '',
					address: '',
					checkDate: '',
					problemSourceCode: '',
					task: '',
					process: '',
					description: '',
					source: '',
					rectiMeasure: '',
					attach: '',
				},
				types: [],
				options: [],
				fileList: [], //附件列表
				rules: {
					caseName: [{
						required: true,
						message: '请填写案例名称',
						trigger: 'blur'
					}],
					checkDate: [{
						required: true,
						message: '请选择时间',
						trigger: ['blur', 'change']
					}],
					address: [{
						required: true,
						message: '请填写地点',
						trigger: 'blur'
					}],
					task: [{
						required: true,
						message: '请选择任务',
						trigger: ['blur', 'change']
					}],
					source: [{
						required: true,
						message: '请选择问题原因',
						trigger: ['blur', 'change']
					}],
					process: [{
						required: true,
						message: '请选择工序',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		computed: {
			currentUser() {
				return GetCurrentUser()
			}
		},
		mounted() {
			this.handleGetCompany()
			this.handleGetFileDetail()
			this.handleGetFileType()
			
		},
		methods: {
			// 将公司code转化为公司id
			changeCompanyCodeToId: function(val, companyCode) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].nodeCode == companyCode) {
							this.companyId= val[j].id
							break
						} else if (val[j].children) {
							this.changeCompanyCodeToId(val[j].children, companyCode)
						}
					}
				}
			},
			changeCompanyNameToId: function(val, companyName) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].label == companyName) {
							this.companyId=val[j].id
							break
						} else if (val[j].children) {
							this.changeCompanyCodeToId(val[j].children, companyCode)
						}
					}
				}
			},
			//根据problemID获取单个问题详细信息
			handleGetFileDetail() {
				// const id = this.$route.params.id
				//以下两句话，刷新页面时，数据不会丢失，保存了id
				this.$route.params.id && localStorage.setItem('data', JSON.stringify(this.$route.params.id));
				const id = JSON.parse(localStorage.getItem('data'));
				GetFileDetail(id).then((res) => {
					this.formData = res.data
					console.log(this.formData)
					if(this.formData.publishComCode){
						this.changeCompanyCodeToId(this.options,this.formData.publishComCode)
						this.formData.publishComCode=this.companyId
					}else{
						this.changeCompanyNameToId(this.options,this.formData.publishComName)
						this.formData.publishComCode=this.companyId
					}
					this.formData.regNameCode = '' //初始将attach置为null，不修改附件时，传null到后端，不修改之前附件。
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			handleGetFileType() {
				GetDictionary({
					name: '规章制度类型'
				}).then((res) => {
					this.types = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			onChangedType(selectValue) {
				let obj = {}
				//遍历下拉数组中的item
				obj = this.types.find((item) => {
					return item.name === selectValue
				})
				this.formData.typeName = obj.name
				this.formData.typeCode = obj.dictCode
			},
			//初始获取公司名称、编码
			handleGetCompany() {
				GetCompany().then((res) => {
					this.options = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			//获取文件上传时间
			handleGetUploadDate() {
				let date = new Date();
				let seperator1 = "-";
				let seperator2 = ":";
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				let hoursDate = date.getHours();
				let minutesDate = date.getMinutes();
				let secondsDate = date.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				if (hoursDate >= 0 && hoursDate <= 9) {
					hoursDate = "0" + hoursDate;
				}
				if (minutesDate >= 0 && minutesDate <= 9) {
					minutesDate = "0" + minutesDate;
				}
				if (secondsDate >= 0 && secondsDate <= 9) {
					secondsDate = "0" + secondsDate;
				}
				let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
					" " + hoursDate + seperator2 + minutesDate + seperator2 + secondsDate;
				this.formData.uploadDate = currentdate
			},
			// 上传文件之前
			handleBeforeUpload(file) {
				let size = file.size / 1024 / 1024 / 12
				if (size > 12) {
					this.$notify.warning({
						title: '警告',
						message: '文件大小必须小于12M'
					})
				}
			},
			//文档附件
			handleRemove() {
				this.formData.attach = null
			},
			handlePreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleSuccess(response) {
				if (response) {
					this.$notify.success({
						body: {
							style: {
								width: '300px',
								height: '500px'
							}
						},
						title: '提示',
						message: '文件上传成功'
					})
				}
				this.handleGetUploadDate()
				this.formData.regNameCode = response.data
			},
			// 将公司Id转化为公司名称，并且保存nodeCode
			changeCompanyIdToName: function(val, companyId) {
				for (var j = 0; j < val.length; j++) {
					if (val[j]) {
						if (val[j].id == companyId) {
							this.formData.publishComCode = val[j].nodeCode
							break
						} else if (val[j].children) {
							this.changeCompanyIdToName(val[j].children, companyId)
						}
					}
				}
			},
			//确认创建
			handleSubmit() {
				this.changeCompanyIdToName(this.options,this.formData.publishComCode)
				UpdateFile(this.formData).then(() => {
					this.$message.success('创建成功')
					this.$router.go(-1) //返回上一url
				}, (err) => {
					this.$message.error(err.message)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-content {
		max-width: 600px;
	}

	.buttons {
		display: flex;
		justify-content: flex-end;
		height: 50px;
		align-items: center;
		padding-right: 5%;
	}
</style>
