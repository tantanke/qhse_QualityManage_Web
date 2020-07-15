<template>
  <div>
		<div class="page-title">角色授权</div>
		<div class="page-content">
			<el-form
				:inline="true"
				@submit.native.prevent="handleSearch">
				<el-form-item>
					<el-select placeholder="角色选择" clearable v-model="value">
						<el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.roleCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" native-type='submit' icon='el-icon-search' v-if="this.value !== ''">查询</el-button>
					<el-button type="primary" native-type='submit' icon='el-icon-search' :disabled=true v-else>查询</el-button>
				</el-form-item>
        <el-form-item>
					<router-link :to='{name: "AuthorizationEdit", params: {id: this.value}}' v-if="this.value !== ''">
						<el-button type="primary">授权</el-button>
					</router-link>
					<router-link :to='{}' v-else>
						<el-button type="primary" :disabled=true>授权</el-button>
					</router-link>
				</el-form-item>
			</el-form>
		</div>
    <div>
      <el-tree :data="checkItem" :default-expand-all="true" node-key="id" ref="tree" highlight-current></el-tree>
    </div>
	</div>
</template>

<script>
  import {GetRoleDictionary} from '../../../services/dictionary'
  import {GetRoleTree} from '../../../services/role_module'

	export default {
		data () {
			return {
        loading: false,
        roles: '',
        checkItem: [],
        value: ''
			}
		},
		methods: {
			handleSearch () {
				this.handleGetTreeData()
			},
			getRolesDict () {
				GetRoleDictionary().then((res) => {
					this.roles = res.data.list
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			handleGetTreeData () {
				GetRoleTree({roleCode:this.value}).then((res) => {
					this.checkItem = res.data
				});
			},
		},
		mounted () {
			this.getRolesDict();
		}
	}
</script>