<template>
  <div>
      <div class="page-title" style="width:100%">QHSE隐患排查</div>
      <el-row>
      <el-form :model='checkForm' style="width:90%" :disabled='formControl' :inline="true">
            <el-form-item label='检查类别：' labelWidth="100px">
            <el-select v-model="value" placeholder="请选择" >
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>        
          </el-form-item>
          <el-form-item>
            <el-select v-model="value">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='检查单位:' labelWidth="100px">
          <el-cascader
                v-model="checkForm.companyCode"
                :options="companyList"
                :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                :show-all-levels="false"
                @change="handleChange"
                ref="cascaderAddr"
                >
                
                </el-cascader>
          </el-form-item>
          <el-form-item label='检查时间:' labelWidth="100px">
             <el-date-picker
                v-model="checkForm.checkDate"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
             </el-date-picker>
          </el-form-item>              
      </el-form>
      </el-row>
      <el-row> 
        
        <el-button type="danger" v-if="formControl" @click="cacelCheck">取消并返回</el-button> 
        <el-button type="primary" v-else @click="addChecklist">生成检查单</el-button>
      </el-row>
      <!--树形检查单 常规检查单 -->
      
      <el-row style="margin-top:15px; border-top: 2px dashed #dddddd" v-if="formControl">
          <div style="margin:15px 0px">
            <span style="margin-right:15px">请选择检查方式:</span>
                <el-radio v-model="checkType" label="树形检查">树形检查</el-radio> 
                <el-radio v-model="checkType" label="列表检查">列表检查</el-radio>
          <!-- 树形检查-->  
          </div>
          <div v-if="checkType === '树形检查' ">
          <el-table
        :data="checkTreeData"
        style="width: 100%;"
        row-key="checkListCode"
        highlight-current-row
        border
        max-height="625"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
        prop="checkListName"
        label="检查名称"       
        >
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope" >
                <div v-if="scope.row.isChildNode === 'true'">
                   <!-- <el-button type='danger' size="mini" style='margin-right:20px'  >删除</el-button> -->      
                   <el-button type="primary" size="mini" >修改</el-button>
                </div>
            </template>
          </el-table-column>
    </el-table>
    </div>
    <div>
        <!-- 列表检查-->
    <el-table
        v-if="checkType === '列表检查'"
        :data="checkListData.filter(data => !search || data.checkListName.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;"
        row-key="checkListCode"
        highlight-current-row
        border
        max-height="625">
        <el-table-column
        prop="checkListName"
        label="检查名称"       
        >
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
            <template slot="header" slot-scope="scope">
                <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope" >
                   <!-- <el-button type='danger' size="mini" style='margin-right:20px'  >删除</el-button>  -->     
                   <el-button type="primary" @click="addCheckRecord(scope.row)" size="mini" >新增检查</el-button>
            </template>
          </el-table-column>
    </el-table>
    </div>
      </el-row>
        
  </div>
</template>

<script>
import {GetqhseCompanytree,getChecklistTree,GetCheckRecordTree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'

export default {
    data() {
        return {
            search: '',
            checkType: '树形检查',
            value2: '',
            companyList: [],
            checkTreeData: [],
            checkListData: [],
            formControl: false,
            checkForm: {
                companyName: '',
                companyCode: ''
            },
            options: [{
                value: '选项1',
                label: '黄金糕'
                }],
                value: ''
                }
            },
    methods: {
        addCheckRecord(data) {
           console.log(data)
        },
        // 筛选出所有叶子节点
        async deepTree (treedata) {
            let _this = this
            treedata.forEach(item => {
                if (item.isChildNode === 'true') {
                    _this.checkListData.push(item)
                    return
                } else {
                    _this.deepTree(item.children)
                }
            })
            return _this.checkListData
      },
        getCheckTree () {
          let _this = this
          getChecklistTree().then(res => {
              _this.checkTreeData = res.data
              console.log(res.data)
              return _this.deepTree(_this.checkTreeData)
          }).then(() => {
              console.log(_this.checkListData)
          } )
        },
        getCheckRecord() {
            GetCheckRecordTree().then(res => {
                console.log(res)
            })
        },
        addChecklist () {
           console.log(this.$refs['cascaderAddr'].inputValue)
           this.formControl = true
        },
        cacelCheck () {
            this.formControl = false
        },
        getCompanyList () {
            GetqhseCompanytree().then(res => {
                this.companyList = res.data
                console.log(res)
            })
        },
        handleChange(value) {
        console.log(value);
        }
    },
    mounted() {
        this.getCheckRecord()
        this.getCheckTree()
        this.getCompanyList()
    },

}
</script>

<style>

</style>