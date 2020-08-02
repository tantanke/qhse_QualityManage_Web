<template>
  <div>
      <div class="page-title" style="width:100%">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a @click="$router.go(-1)">QHSE年度检查表管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>批量添加</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-row style="margin:15px 0">
        <el-date-picker
        v-model="time"
        type="date"
        placeholder="选择日期">
        </el-date-picker>
    </el-row>
    <el-row style="margin:15px 0" v-loading='loading'>
        <el-table
        :data="companyList"
        style="width: 100%;"
        highlight-current-row
        border
        
        max-height="650">
        <el-table-column
        prop="label"
        fixed
        label=''       
        >
        </el-table-column>
        <el-table-column
        v-for="(item,index) in qsheList"
        :key="index"
        :label="item.name"
        width="180">
        <template >
            
            <el-checkbox-group v-model="checkList">
            <el-checkbox :key="e" v-for="(i,e) in item.childNode" :label="i.name"></el-checkbox>
           </el-checkbox-group>
            <!-- <el-cascader
            :options="item.childNode"
            :props="props"
            clearable>
            </el-cascader> -->
        </template>
        </el-table-column>
    </el-table>
    <el-button style="margin:15px 0" type="primary" icon="el-icon-edit">立即添加</el-button>
    </el-row >
    
  </div>
</template>

<script>
import {GetCompany,GetQhseChildElement} from '../../../services/gettreedata'
export default {
    data() {
        return {
            props: { multiple: true ,children: 'childNode',label: 'name',checkStrictly: true},
            loading: true,
            time: '',
            companyList: [],
            qsheList: [],
            checkList: []
        }
    },
    methods: {
        // 遍历出所有的叶子结点
        async deepTree (treedata) {
            let _this = this
            treedata.forEach(item => {
                if (item.children === undefined) {
                    _this.companyList.push(item)
                    return
                } else {
                    _this.deepTree(item.children)
                }
            })
            return _this.companyList
            },
        // 筛选出所有的叶子结点，并且和整合成一个新的数组
        getCompanyTree() {
            let _this = this
            GetCompany().then((res) => {
                return _this.deepTree(res.data)
            }).then((res) => {
                console.log(res)
            }).catch(err => {
					this.$message.error(err.message)
				})
        },
        // 获取所有管理体系要素表
        getQhseChildElement() {
            GetQhseChildElement().then(res => {
                this.qsheList = res.data
                console.log(this.qsheList)
                // 渲染完毕再执行这个，所以才能没有延时的更改
                this.$nextTick( () => {		
				this.loading = false
			})
            }).catch(err => {
					this.$message.error(err.message)
				})
        }
    },
    mounted() {
        this.getCompanyTree()
        this.getQhseChildElement()
        
    },
}
</script>

<style>

</style>