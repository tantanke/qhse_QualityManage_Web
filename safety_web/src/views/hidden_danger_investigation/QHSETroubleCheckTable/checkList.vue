<template>
  <div v-loading='checkLoading' element-loading-text="拼命加载中"  style="height:550px">
      <div class="page-title" style="width:100%">QHSE隐患排查</div>
      <el-row >
        <!--控制级联菜单 -->
      <el-form :model='checkForm' style="width:90%" :disabled='formControl' >
            <el-form-item label='检查类别：' >
            <el-select v-model="checkForm.checkContent" placeholder="请选择" >
            <el-option
            v-for="item in checkType1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>   
            <el-select v-model="checkForm.checkType" style="margin-left:15px"
             v-if="checkForm.checkContent !== ''" @focus="editCheckType" >
            <el-option
            v-for="item in checkType2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>     
            <el-select v-model="checkForm.checkListCode" style="margin-left:15px" v-if="checkForm.checkType !== '' " ref="selestCheck"  filterable>
            <el-option
            v-for="item in CheckList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='检查单位:' >
          <el-cascader
                style="margin-left:10px"
                v-model="checkForm.companyCode"
                :options="companyList"
                :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                :show-all-levels="false"
                filterable
                ref="cascaderAddr"
                >
                
                </el-cascader>
          </el-form-item>
          <el-form-item label='检查时间:' >
             <el-date-picker
             style="margin-left:10px"
                v-model="checkForm.checkDate"
                type="date"
                :clearable='false'
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
             </el-date-picker>
          </el-form-item>              
      </el-form>
      </el-row>
      <el-row> 
        <el-button type="primary" :disabled="formControl" @click="addChecklist" ref="addNewCheck">生成检查单</el-button>
        <el-button type="danger"  :disabled="!formControl" @click="cacelCheck">取消并返回</el-button> 
      </el-row>
      <!--树形检查单 常规检查单 -->
      
      <el-row style="margin-top:15px; border-top: 2px dashed #dddddd" >
    <div>
        <!-- 列表检查-->
    <el-table
        v-loading='loading'
        v-if="formControl"
        :data="checkListData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;height:500px"
        row-key="checkRecordID"
        highlight-current-row
        border
        max-height="490">
        <el-table-column
        prop="name"    
        >
        <template slot="header">
        <span>检查名称</span>
      </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
            <template slot="header" slot-scope="scope">
                <el-input
                v-model="search"
                :ref="scope.$index"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope" >
                   <el-button type="primary" v-if="!scope.row.pass" @click="addCheckRecord(scope.row)" icon='el-icon-edit-outline' size="mini" >检查</el-button>
                   <el-button :type="scope.row.pass === '通过'? 'success': 'danger'" v-else @click="detailCheckRecord(scope.row)" size="mini" >查看记录</el-button>
            </template>
          </el-table-column>
    </el-table>
    </div>
      </el-row>
    <!--通过不通过选择 --> 
     <el-dialog
     center
  :visible.sync="checkDialogVisible"
  :close-on-click-modal='false'
  width="30%"
  >
  <el-form>
      <el-form-item label='通过详情：'>
          <el-radio v-model="checkRecordForm.pass" label="通过">通过</el-radio>
          <el-radio v-model="checkRecordForm.pass" label="不通过">不通过</el-radio>
      </el-form-item>
      <el-form-item v-show="checkRecordForm.pass === '不通过' &&  reason === '不录入'" label='原因描述：'>
           <el-input            
            type="textarea"
            :rows="3"
            placeholder="请输入原因"
            v-model="checkRecordForm.reason">
            </el-input>
      </el-form-item>
      <el-form-item v-show="checkRecordForm.pass === '不通过' && reason === '问题'"  label='问题描述：'>
           <el-input            
            type="textarea"
            :rows="3"
            placeholder="请输入问题"
            v-model="problemForm.problemDescription">
            </el-input>
      </el-form-item>
      <el-form-item v-show="checkRecordForm.pass === '不通过'" label='检查记录：'>
          <el-radio v-model="reason" label="不录入" style="width:12%">不录入</el-radio>
          <el-radio v-model="reason" label="问题" style="width:15%">录入问题</el-radio>
          <el-radio v-model="reason" label="隐患" style="width:15%">录入隐患</el-radio>
          <el-radio v-model="reason" label="违章" style="width:15%">录入违章</el-radio>
      </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelSub">取 消</el-button>
    <el-button type="primary" @click="submitadd">确 定</el-button>
  </span>
</el-dialog>
    <!--具体检查详情 --> 
    <el-dialog
  title="检查详情"
  :visible.sync="detailDialogVisible"
  width="30%">
  <el-form label-width="140px" :model="detailForm" style="width:100%;" >
          <el-row>
              <el-form-item label="检查人：" style="margin-bottom:1px">{{detailForm.checkPerson}}</el-form-item>            
              <el-form-item label="组织机构：" style="margin-bottom:1px">{{detailForm.companyName}}</el-form-item>
              <el-form-item label="检查类型：" style="margin-bottom:1px">{{detailForm.checkType}}</el-form-item>
              <el-form-item label="检查日期：" style="margin-bottom:1px">{{detailForm.checkDate}}</el-form-item>
              <el-form-item label="通过状态：" style="margin-bottom:1px">{{detailForm.pass}}</el-form-item>
              <el-form-item v-show='detailForm.problems' label="问题描述：" style="margin-bottom:1px">{{detailForm.problems}}</el-form-item>
              <el-form-item v-show='detailForm.reason' label="原因描述：" style="margin-bottom:1px">{{detailForm.reason}}</el-form-item>
              <el-form-item label="操作：" style="margin-bottom:20px" v-show="detailForm.pass === '不通过'">
                 <el-button size='mini' @click="questionEditfalse  = true">录入问题</el-button>
                <el-button size='mini' type="warning" @click="addHidden">录入隐患</el-button>
                <el-button size='mini' type="danger" @click="addRegulation">录入违章</el-button>
              </el-form-item>
          </el-row>
          
        </el-form>
</el-dialog>
    <!--编辑检查记录 -->
    <el-dialog title="添加问题"
    :close-on-click-modal='false'
  :visible.sync="questionEditfalse"
  width="30%">
  <el-form>
     <el-form-item :model="problemForm"  label="请输入问题：">
             <el-input v-model="problemForm.problemDescription" ></el-input>
     </el-form-item>
  </el-form>
  <div style="text-align:right">
    <el-button  type="primary" @click="questionEditfalse = false">取 消</el-button>
    <el-button  type="primary" @click="submitEditQuestion()">确 定</el-button>
    </div>

    </el-dialog>
  </div>
</template>

<script>
import {addCheckList,GetqhseCompanytree,getChecklistTree,editCheckRecord,addProblemDescription} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
import { GetDictionary } from '../../../services/dictionary'
import CurrentUser from '../../../store/CurrentUser'
export default {
    data() {
        return {
            pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e7;   //禁用以前的日期，今天不禁用
                // return date.getTime() <= Date.now();    //禁用今天以及以前的日期
            }
            },
            // 控制页面
            checkDialogVisible: false,
            detailDialogVisible: false,
            loading: false,
            checkLoading:true,
            // 筛选表格
            search: '',
            value2: '',
            // 树形图相关
            companyList: [],
            checkTreeData: [],
            checkListData: [],
            checkingTreeData: [],
            // 隐患违章录入
            reason: '不录入',
            formControl: false,
            // 筛选出检查表
            checkForm: {
                companyName: '',
                companyCode: '',
                checkType: '',
                checkContent: '',
                name: '',
                checkListCode: '',
                checkDate: '',
                checkPersonID: '',
            },
            // 添加检查记录
            checkRecordForm: {
                pass:'通过'
            },
            problemForm:{
                problemDescription:'',
                code:'',
                companyName:'',
                companyCode:'',
                auditor:'',
                itemName:'',
                auditTime:'',
                problemSource:'隐患排查'
            },
            // 检查表单
            checkListForm: {
                companyName: '',
                companyCode: '',
                checkType: '',
                checkDate: '',
                checkListCode: ''
            },
            // 确认检查类型
            checkType1: [{
                value: '专项检查',
                label: '专项检查'
                }, {
                value: '日常检查',
                label: '日常检查'
                }],  
            checkTypeContent1: [{
                value: 'HSE专项检查',
                label: 'HSE专项检查'
                }, {
                value: '质量专项检查',
                label: '质量专项检查'
                }],
            checkTypeContent2: [{
                value: '日常检查1',
                label: '日常检查1'
                }, {
                value: '日常检查2',
                label: '日常检查2'
                }],
            checkType2: [],
            CheckList: [], 
            // 检查详情表单      
            detailForm: {},
            questionEditfalse: false,
            type: 'primary',
            editQuestionForm:{}
              }
            
            },
            
    methods: {
        submitEditQuestion(){
            let _this = this
            if(this.problemForm.problemDescription === ''){
                this.$message.warning('请输入问题！')
                return
            }
             _this.loading = true
             _this.questionEditfalse = false
             _this.detailDialogVisible = false
            addProblemDescription(_this.problemForm).then(res => {
                _this.loading = false
                _this.$message.success('录入问题成功！')
                _this.checkRecordForm = {pass:'通过'}
                _this.pushRouter()
            })
            .catch(err => {
              _this.$message.error(err)
              _this.loading = false
              _this.checkRecordForm = {}
          })

        },
        addHidden() {
            console.log(this.checkForm.checkContent)
          this.$router.push({
            name: 'input',
            params: {type:this.checkForm.checkContent}
          })
        },
        addRegulation() {
            console.log(this.checkForm.checkContent)
          this.$router.push({
                    name: 'illegal_entry',
                    params: {type:this.checkForm.checkContent}
                })
        },
        // 获取检查类别
        getCheckType() {
         GetDictionary({name:'检查类型'}).then(res => {
             console.log(res)
         }).catch(err => {
              this.$message.error(err)
          })
        },
        // 隐患违章跳转
        pushRouter() {
            let _this = this
           if (_this.reason === '不录入' || _this.reason === '问题'){
               _this.reason = '不录入'
               return
           } 
          else if (_this.reason === '隐患'){
           _this.$router.push({
            name: 'input',
            params: {type:this.checkForm.checkContent}
          })
            } else {
                    _this.$router.push({
                    name: 'illegal_entry',
                    params: {type:this.checkForm.checkContent}
                })
            }
        },
        // 添加记录
        cancelSub() {
          this.checkDialogVisible = false
          this.checkRecordForm = {pass:'通过'}
        },
        submitadd () {
            let _this = this          
            if(_this.reason === '问题' && !_this.problemForm.problemDescription){
                _this.$message.warning('请输入具体问题！')
                return
            }
            if(_this.reason === '不录入' && !_this.checkRecordForm.reason && _this.checkRecordForm.pass !== '通过'){
                _this.$message.warning('请输入具体原因！')
                return
            }
             _this.loading = true
             // 先添加问题再编辑检查记录
            editCheckRecord(_this.checkRecordForm).then(() => {
                return addCheckList(_this.checkListForm)
            }).then(res => {
                 _this.checkListData = res.data
                if(_this.reason === '问题'){
                    return  addProblemDescription(_this.problemForm)
                }
                else{    
                _this.loading = false
                _this.$message.success('新增成功！')
                _this.checkRecordForm = {pass:'通过'}
                _this.checkRecordForm.reason = ''
                _this.problemForm.problemDescription = ''
                _this.pushRouter()
                }
            })
            .then(res => {
                console.log(res)
                _this.loading = false
                _this.checkRecordForm = {pass:'通过'}
                _this.checkRecordForm.reason = ''
                _this.problemForm.problemDescription = ''
                _this.pushRouter()
            })
            .catch(err => {
              _this.$message.error(err)
              _this.loading = false
              _this.checkRecordForm = {}
          })
           _this.checkDialogVisible = false
        },
        // 修改级联菜单的值
        editCheckType() {
           if (this.checkForm.checkContent === '专项检查') {
              this.checkType2 = this.checkTypeContent1
           } else {
               this.checkType2 = this.checkTypeContent2
           }
        },
        // 添加检查记录
        addCheckRecord(data) {
            let _this = this
            let user = CurrentUser.get()


            //检查记录表单
            _this.checkRecordForm = {...data,..._this.checkRecordForm}
            _this.checkRecordForm.checkPerson = user.employeeName
            _this.checkRecordForm.checkPersonId = user.userId
            _this.checkRecordForm.checkTypeCode = _this.checkForm.checkListCode
            //问题表单
            _this.problemForm.code = _this.checkRecordForm.code
            _this.problemForm.companyName = _this.checkRecordForm.companyName
            _this.problemForm.companyCode = _this.checkRecordForm.companyCode
            _this.problemForm.auditor = _this.checkRecordForm.checkPerson
            _this.problemForm.itemName = _this.checkRecordForm.name
            _this.problemForm.auditTime = _this.checkRecordForm.checkDate
            _this.problemForm.problemDescription = ''
            this.checkDialogVisible = true
        },
        // 显示出检查详情
        detailCheckRecord(data) {           
            let _this = this
            _this.editQuestionForm = {...data}
            console.log(data)
            _this.editQuestionForm.problems = ''
            _this.detailForm.problems = data.problems
            _this.detailForm.reason = data.reason
            _this.detailForm.companyName = data.companyName
            _this.detailForm.checkType = data.checkType
            _this.detailForm.checkDate = data.checkDate
            _this.detailForm.pass = data.pass
            _this.detailForm.checkPerson = data.checkPerson

            // 添加问题表单
            _this.problemForm.code = data.code
            _this.problemForm.companyName = data.companyName
            _this.problemForm.companyCode = data.companyCode
            _this.problemForm.auditor = data.checkPerson
            _this.problemForm.itemName = data.name
            _this.problemForm.auditTime = data.checkDate
            _this.problemForm.problemDescription = ''
            console.log(_this.problemForm)
            _this.detailDialogVisible = true
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
      // 获取检查表的总表
        getCheckTree () {
          let _this = this
          getChecklistTree().then(res => {
              let data = JSON.parse(localStorage.getItem('checkdata'))
              _this.checkTreeData = res.data            
              _this.getSelectList(res.data)
              _this.checkLoading = false
              if(data) _this.$refs['addNewCheck'].$listeners.click()
          }).catch(err => {
              _this.$message.error(err)
          })
        },
        async getCheckForm () {
            let value
             this.checkTreeData.forEach((item) => {
               if(item.checkListName === this.checkForm.checkListName){
                 value =  item
                 this.checkingTreeData.push(item)
               }
               
           })
           return value
        },
        // 初始化最近一次的检查记录
        initChecklist () {
           let data = JSON.parse(localStorage.getItem('checkdata'))
           if(data){
           this.checkForm = {...data}
           this.checkForm.checkDate = this.getTime()
           }
           
        },
        getTime() {
        let nowDate = new Date()
        let month  = Number(nowDate.getMonth() + 1)
        if(month>=10) {
            month = String(month)
        } else {
            month = String('0' + month)
        }
        return `${nowDate.getFullYear()}-${month}-${nowDate.getDate()}`
        },
        // 添加检查记录表
        addChecklist () {
            let _this = this
            if(_this.checkForm.checkListCode === '' || _this.checkForm.companyCode === '' ||_this.checkForm.checkDate === ''){
                this.$message('请把检查表单填写完整！')
                return
            }
            
           _this.formControl = true
           _this.loading = true
           _this.formatForm()      
           console.log(_this.checkForm)
           localStorage.setItem('checkdata',JSON.stringify(_this.checkForm));
           addCheckList(_this.checkListForm).then(res => {
               _this.checkListData = res.data
               _this.loading = false
           }).catch(err => {
               _this.$message.error(err)
               _this.formControl = false
           })
           

        },
        //
        formatForm () {
           let _this = this
           _this.checkListForm.companyCode = _this.checkForm.companyCode[_this.checkForm.companyCode.length -1]
           _this.checkListForm.companyName = _this.$refs['cascaderAddr'].inputValue
           _this.checkListForm.checkType = _this.checkForm.checkType
           _this.checkListForm.checkListCode = _this.checkForm.checkListCode
           _this.checkListForm.checkDate = _this.checkForm.checkDate

        },
        cacelCheck () {
            this.formControl = false
            this.checkingTreeData = []
            this.checkListData = []
        },
        // 筛选出下拉列表
        getSelectList(checkList) {
            let _this = this
           checkList.forEach(item => {
               let i = {}
               i.value = item.checkListCode
               i.label = item.checkListName
               _this.CheckList.push(i)
           })
        },
        getCompanyList () {
            GetqhseCompanytree().then(res => {
                this.companyList = res.data
            })
        }
    },
    mounted() {
        this.initChecklist()
        this.getCheckType()
        this.getCheckTree()
        this.getCompanyList()
    },

}
</script>

<style>

</style>