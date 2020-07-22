<template>
  <div class="troublecheck">
      <el-row class="chooseItem">
          <div class="page-title" style="width:100%">QHSE隐患排查</div>
          <!-- <span>请选择检查表类别:</span>
          <el-radio v-model="addform.checkType" label="日常检查">日常检查</el-radio>
          <el-radio v-model="addform.checkType" label="专项检查">专项检查</el-radio>   -->      
      </el-row>
      <el-row style="padding:8px; border-top: 2px dashed #dddddd;text-align:center"></el-row>
      <!-- <span style="margin-right:15px">{{addform.checkType}}</span> -->
      <el-button type="primary" round @click="addformVisible = true">添加检查表</el-button>   
     <el-row style="margin:8px; border-top: 2px dashed #dddddd;text-align:center"></el-row>
        <el-table
        :data="treeData"
        style="width: 100%;"
        row-key="checkListCode"
        highlight-current-row
        border
        max-height="700"
        v-loading="loading"
        :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
        <el-table-column
        prop="checkListName"
        label="检查名称"
        
        >
        </el-table-column>
        <el-table-column label="检查类别" width="200" align="center">
            <template slot-scope="scope" >
                <span v-if="!scope.row.childNode && scope.row.checkType ">{{scope.row.checkType}}</span>
            </template>
          </el-table-column>
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope" >
                <div v-if="!scope.row.childNode && scope.row.checkRecordID">
                   <el-button type='danger' size="mini" style='margin-right:20px'    @click="deleteCheckTable(scope.row)">删除</el-button>      
                   <el-button type="primary" size="mini" @click="editCheckTable(scope.row)">修改</el-button>
                </div>
                <span v-else-if="!scope.row.childNode && !scope.row.checkRecordID ">请点击上方添加检查表进行新增</span>
            </template>
          </el-table-column>
    </el-table>
      <!-- <el-row v-if="addform.checkType === '专项检查'">
         <el-table
          :data="specialTable"
          style="width: 100%"
          row-key="checkListCode"
          max-height="560"
          highlight-current-row
          border
          v-loading="loading">
          <el-table-column prop="checkDate" label="受检日期" align="center"></el-table-column>
          <el-table-column prop="companyName" label="受检单位"></el-table-column>
          <el-table-column prop="checkType" label="检查类别"></el-table-column>
          <el-table-column prop="checkCategory" label="检查类型"></el-table-column>
          <el-table-column prop="checkListName" width="400" label="检查名称"></el-table-column>
          <el-table-column prop="content" label="检查内容"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type='danger' size="mini" style='margin-right:20px' @click="deleteCheckTable(scope.row)">删除</el-button>      
                <el-button type="primary" size="mini" @click="editCheckTable(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row> -->
      <!-- <el-row v-else>
         <el-table
          :data="dateTable"
          style="width: 100%"
          max-height="560"
          highlight-current-row
          border
          v-loading="loading">
          <el-table-column prop="checkDate" label="受检日期" align="center"></el-table-column>
          <el-table-column prop="companyName" label="受检单位"></el-table-column>
          <el-table-column prop="checkType" label="检查类别"></el-table-column>
          <el-table-column prop="checkCategory" label="检查类型"></el-table-column>
          <el-table-column prop="checkListName" width="400" label="检查名称"></el-table-column>
          <el-table-column prop="content" label="检查内容"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type='danger' size="mini" style='margin-right:20px' @click="deleteCheckTable(scope.row)">删除</el-button>      
                <el-button type="primary" size="mini" @click="editCheckTable(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row> -->
      <!-- 编辑表单-->
        <el-dialog
            width="30%"
            title="请选择录入隐患或者违章"
            :visible.sync="addHiddenVisible"
            append-to-body>
            <!--选择隐患或者违章录入 -->
          <el-form>
            <el-form-item label="选择原因：" style="margin-bottom:1px">
               <el-radio v-model="reason" label="违章">录入违章</el-radio>
               <el-radio v-model="reason" label="隐患">录入隐患</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
                <el-button @click="addHiddenVisible = false">取 消</el-button>
                <el-button type="primary" @click="goHidden">确定</el-button>
            </div>
            </el-dialog>
        <el-dialog title="编辑检查记录" :visible.sync="editformVisible" :close-on-click-modal="false" >
            <el-form :model='editform'>
        <el-form-item label="公司单位:" :label-width="labelWidth">
             <treeselect
              :multiple="false"
              :options="companyList"
              placeholder="请选择公司单位(不选择默认当前)"
              v-model="ScompanyCode"
              @select="getEditCode"
              style="width:250px"
            />
        </el-form-item>
        <el-form-item label="检查内容:" :label-width="labelWidth">
            <el-select v-model="editform.checkContent" placeholder="请选择具体检查内容">
                <el-option label="HSE专项检查" value="HSE专项检查"></el-option>
                <el-option label="质量专项检查" value="质量专项检查"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="受检时间" :label-width="labelWidth">
            <el-date-picker
                v-model="editform.checkDate"
                type="date"
                placeholder="选择受检时间"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="检查类别:" :label-width="labelWidth">
            <el-select v-model="editform.checkCategory" placeholder="请选择检查类别">
                <el-option label="日" value="日"></el-option>
                <el-option label="周" value="周"></el-option>
                <el-option label="月" value="月"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="检查表类别:" :label-width="labelWidth">
            <el-select v-model="editform.checkType" placeholder="请选择检查类别">
                <el-option label="日常检查" value="日常检查"></el-option>
                <el-option label="专项检查" value="专项检查"></el-option>
            </el-select>
        </el-form-item>
        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editformVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">通 过</el-button>
                <el-button type="primary" @click="submitEditNo">不通过</el-button>
            </div>
        </el-dialog>
      <!-- 新增表单-->
        <el-dialog title="新增检查记录" :visible.sync="addformVisible" :close-on-click-modal="false">
            
        <el-form :model='addform'>
        <el-form-item label="公司单位:" :label-width="labelWidth">
             <treeselect
              :multiple="false"
              :options="companyList"
              placeholder="请选择公司单位"
              v-model="ScompanyCode"
              @select="getCompanyCode"
            />
        </el-form-item>
        <el-form-item label="检查名称:" :label-width="labelWidth">
             <treeselect
              :multiple="false"
              :options="addData"
              placeholder="请选择最后一级叶子节点检查"
              :normalizer="normalizer"
              v-model="Scode"
              @select="getQueryCode"
              
            />
        </el-form-item>
        <el-form-item label="检查类型:" :label-width="labelWidth">
            <el-select v-model="addform.checkType" placeholder="请选择检查类别">
                <el-option label="日常检查" value="日常检查"></el-option>
                <el-option label="专项检查" value="专项检查"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="检查内容:" :label-width="labelWidth">
            <el-select v-model="addform.checkContent" placeholder="请选择具体检查内容">
                <el-option label="HSE专项检查" value="HSE专项检查"></el-option>
                <el-option label="质量专项检查" value="质量专项检查"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="受检时间" :label-width="labelWidth">
            <el-date-picker
                v-model="addform.checkDate"
                type="date"
                placeholder="选择受检时间"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="检查类别:" :label-width="labelWidth">
            <el-select v-model="addform.checkCategory" placeholder="请选择检查类别">
                <el-option label="日" value="日"></el-option>
                <el-option label="周" value="周"></el-option>
                <el-option label="月" value="月"></el-option>
            </el-select>
        </el-form-item>
        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addformVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">通 过</el-button>
                <el-button type="primary" @click="submitAddNo">不通过</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
import {GetCheckRecordTree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
import {GetqhseCompanytree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
import {getChecklistTree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
import {editCheckRecord} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
import {addCheckRecord} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
import {deleteCheckRecord} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'



export default {
    data() {
        return {
            reason: '',
            addHiddenVisible: false,
            Scode: null,
            ScompanyCode: null,
            labelWidth: '120px',
            editformVisible: false,
            addformVisible: false,
            editform: {
              id: "",
              content: '',
              checkType: '', //
              checkCategory: '', //
              companyName: '', //
              companyCode: '', //
              checkDate: '', //
              checkContent: ''
            },
            addform: {
              code: '', //
              name: '', //
              content: '',
              checkType: '', //
              checkCategory: '', //
              companyName: '', //
              companyCode: '', //
              checkDate: '', //
              checkContent: ''
            },
            searchdate: '',
            searchSpe: '',
            tableData: [],
            loading: true,
            rowdata: '',
            addData: [],
            mapAddData: [],
            treeData: [],
            dateTable: [],
            specialTable: [],
            companyList: [],
            options: [ {
            key: 'a',
            name: 'a',
            subOptions: [ {
                key: 'aa',
                name: 'aa',
                subOptions: null
            } ],
            } ],
            normalizer(node) {
                return {
                    id: node.checkListID,
                    label: node.checkListName,
                    children: node.children,
                }
    },
        }
    },
    methods: {
         /* deepTree (treedata) {
            let _this = this
            treedata.forEach(item => {
                if (item.children.length === 0) {
                     delete item.children
                    return
                } else {
                    _this.deepTree(item.children)
                }
            })
        }, */
        getTableData() {
            let _this = this
            _this.loading = true
            _this.tableData = []
            _this.specialTable = []
            _this.dateTable = []
            GetCheckRecordTree().then(res => {
            _this.treeData = res.data
            _this.loading = false
           /*  return _this.deepTree(_this.treeData)
                    }).then((res) => {
                        _this.loading = false
                        // 再次过滤数组
                        res.forEach((item) => {
                            if(item.checkType === '专项检查') {
                                _this.specialTable.push(item)
                            } else if(item.checkType === '日常检查') {
                                _this.dateTable.push(item)
                            }
                        }) */
                    }).catch(err => {
                        _this.$message.error(err)
                    })
        },
        editCheckTable (data) {
            console.log(data)
            let _this = this
            _this.editformVisible = true
            _this.fillForm(data)
        },
        // 自动填充数据
        fillForm (data) {
            let _this = this
            _this.editform.id = data.checkRecordID
            _this.editform.checkType = data.checkType
            _this.editform.companyName = data.companyName
            _this.editform.companyCode = data.companyCode
            _this.editform.checkDate = data.checkDate
            _this.editform.checkContent = data.checkContent
            _this.editform.checkCategory = data.checkCategory
        },
        getEditCode (node) {
            this.editform.companyName = node.label
            this.editform.companyCode = node.nodeCode
        },
        deleteCheckTable (data) {
            // 获取待删除数据的id
            let deldata = data.checkRecordID
            let delId = {id: deldata}
            this.$confirm('确认删除该条检查记录吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(() => {
            return deleteCheckRecord(delId)
         }).then(res => {
                if (res.code === 1000) {
                        this.$message.success(res.message)                        
                        this.getTableData()
                    }            
            }).catch(err => {
                this.$message.error(err)
            })
        },
        submitEdit () {
            let _this = this
            _this.editformVisible = false
            let editform = _this.editform
            editform.content = '通过'
            editCheckRecord(editform).then(res => {
                console.log(res)
                _this.$message.success('编辑成功')
                _this.getTableData()
            }).catch(err => {
                _this.$message.error(err)
            })

        },
        submitEditNo () {
            let _this = this
            _this.editformVisible = false
            let editform = _this.editform
            editform.content = '不通过'
            editCheckRecord(editform).then(res => {
                console.log(res)
                _this.$message.success('编辑成功')
                _this.getTableData()
                _this.addHiddenVisible = true
            }).catch(err => {
                _this.$message.error(err)
            })
            
},
        submitAdd () {
            let _this = this
            let addform = _this.addform
            let isAll = true
            addform.content = '通过'
           Object.keys(addform).forEach( (key) => {
                if(addform[key] === '' ) {
                    isAll = false
                }
                });
            if(!isAll) {
                _this.$message.error('请检查表单是否填写完整！！')
            } else{
                _this.rowdata = addform
                addCheckRecord(addform).then(res => {
                    if (res.code === 1000) {
                        _this.$message.success('添加成功')
                        _this.getTableData()
                        _this.resetForm()
                    }
                }).catch(err => {
                    _this.$message.error(err)
                })

            }
        },
        goHidden () {
            let _this = this
          if(_this.reason === '') {
              _this.$message('请选择录入类别！')
          } else {
              _this.addformVisible = false
              if (_this.reason === '违章') {
                 _this.$router.push({
                path: '/hidden_danger/illegal_entry',
                params: {
                data: _this.rowdata
                }
            })
              } else {
                  _this.$router.push({
                    path: '/hidden_danger/input',
                    params: {
                    data: _this.rowdata
                    }
                })
              }
          }
        },
        resetForm () {
           let _this = this
           _this.addform.code = ''
           _this.addform.name = ''
           _this.addform.content = ''
           _this.addform.companyName = ''
           _this.addform.companyCode = ''
           _this.addform.checkDate = ''
           _this.addform.checkType = ''
           _this.addform.checkContent = ''
           _this.addform.checkCategory = ''
           _this.Scode = null
           _this.ScompanyCode = null
           _this.addformVisible = false
        },
        submitAddNo () {
            let _this = this
            let addform = _this.addform
            let isAll = true
            addform.content = '不通过'
           Object.keys(addform).forEach( (key) => {
                if(addform[key] === '' ) {
                    isAll = false
                }
                });
            if(!isAll) {
                _this.$message.error('请检查表单是否填写完整！！')
            } else{
                _this.rowdata = addform
               addCheckRecord(addform).then(res => {
                    if (res.code === 1000) {
                        _this.$message.success('添加成功！开始录入隐患违章')
                        _this.getTableData()
                        _this.resetForm()
                        _this.addHiddenVisible = true
                    }
                }).catch(err => {
                    _this.$message.error(err)
                })
            }
        },
        getCompanytree () {
            GetqhseCompanytree().then(res => {
                this.companyList = res.data
                console.log(this.companyList)
            })
        },
        getCheckTree () {
          getChecklistTree().then(res => {
              this.addData = res.data
              /* this.deepTree(this.addData) */
          })
        },
        getQueryCode (node) {
          if(node.children !== undefined) {
              this.$message('请选择最后一级叶子节点检查,')
          } else{
              this.addform.name = node.checkListName;
              this.addform.code = node.checkListCode;
              
          }
         
        },
        getCompanyCode (node) {
            this.addform.companyName = node.label
            this.addform.companyCode = node.nodeCode
        },
        addHidden () {
            this.addHiddenFormVisible = false
            this.addHiddenVisible = false
        },
        submitRisk () {
            this.addRiskFormVisible = false
            this.addHiddenVisible = false
        }    
    },
    mounted() {
        this.getTableData()
        this.getCompanytree()
        this.getCheckTree()
    }
}
</script>

<style lang="scss" scoped>
.troublecheck{
    .chooseItem{
        margin-bottom: 15px;
        span{
            font-size:14px;
            margin-right: 10px;
        }
    }
}
</style>