<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">角色授权</a></el-breadcrumb-item>
        <el-breadcrumb-item>编辑授权</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <el-form :model="planForm" @submit.native.prevent="handleSubmit">
					<el-form-item>
						<el-tree v-model="planForm.checkedContent" :data="checkItem"  node-key="nodeCode" 
						:default-checked-keys="[...nodeIdList]"  show-checkbox  ref="tree" highlight-current></el-tree>
					</el-form-item>
					<el-form-item>
            <el-button type="primary" native-type="submit" icon="el-icon-check">确定</el-button>
            &nbsp;
            <a @click="$router.go(-1)">
              <el-button native-type="button" type="danger" icon="el-icon-refresh-left">取消</el-button>
            </a>
          </el-form-item>
				</el-form>
      </div>
    </div>
  </div>
</template>

<script>
	import {GetModuleTree,UpdateRoleTree,GetRoleNodeId} from '../../../services/role_module'

	export default {
		data () {
			return {
				planForm: {
					roleModule: ''
				},
				checkItem: [],	
				companyLoading: false,
				nodeIdList: []
			}
		},
		methods: {
			// 得到检查内容树数据
			CheckContentsTree () {
				GetModuleTree().then((res) => {
					this.checkItem = res.data
					console.log(res)
					this.getCheckContent()
				});
			},
			getCheckContent () {
				const roleCode = this.$route.params.id

				GetRoleNodeId({roleCode:roleCode}).then((res) => {
					console.log(res.data)
					let nodedata = []
					res.data.forEach(item => {
						if(item !== '')
						nodedata.push(item)
					})
					nodedata.forEach(i => {
						if(i.length !== 4){ // 这里只能通过长度判断	QAQ
							this.nodeIdList.push(i)
						}
					})
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
		// 提交计划
			handleSubmit () {
				this.checkFilterParams()
				this.$confirm('确定修改权限?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					UpdateRoleTree(this.planForm).then( () => {
						this.$message.success('创建成功')
						this.$router.go(-1) //返回上一url
					}).catch((err) => {
						this.$message.error(err.message)
					})
				}).catch(() => {

				})
			},
			//对数据进行包装，满足后端要求
			checkFilterParams () {
				let item1 = []
				const roleCode = this.$route.params.id
				let value = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
				for(var j=0;j<value.length;j++){
					var dict = {};
					dict.moduleCode = value[j]
					dict.roleCode = roleCode
					item1.push(dict)
					this.planForm.roleModule = item1
				}
      },
		},
		mounted () {
			this.CheckContentsTree();
		}
	}
</script>