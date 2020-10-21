<template>
    <div>
        <div class="page-title" style="width: 100%">基本信息生成</div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
                <el-form :model="selectInfoForm" label-width="100px" :inline="true">
				<el-form-item label="公司:">
				<treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList" v-model="selectCheckedCompanyId"></treeselect>
				</el-form-item>
				<el-form-item label="审核日期：">
					<el-date-picker
                        v-model="selectCheckDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="getBasicInfo" style="margin-right: 15px;">查询</el-button>
				</el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="addBasicInfo">基本信息生成</el-button>
                </el-form-item>
                </el-form>
                

         <!-- 基本信息登记列表区域 -->
            <el-table :data="basicInfoList" border stripe>
                <el-table-column type="expand" label="详情" width="60px">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="8">
                                <div class="detail">受审核单位:{{scope.row.checkedCompanyName}}</div>
                                <div class="detail">受审核部门:{{scope.row.group}}</div>
                                <div class="detail">责任部门:{{scope.row.responsiCompanyName}}</div>
                                <div class="detail">责任部门负责人:{{scope.row.responsePersonName}}</div>
                                <div class="detail">检查方式:{{scope.row.taskType}}</div>
                            </el-col>
                            <el-col :span="8">
                                <div class="detail">审核日期:{{scope.row.checkDate}}</div>
                                <div class="detail">检查表名称:{{scope.row.checkListName}}</div>
                                <div class="detail">监督人员:{{scope.row.checkPerson}}</div>
                                <div class="detail">监督检查依据:{{scope.row. checkBasis}}</div>
                                <div class="detail">执行标准:{{scope.row.execStd}}</div>
                            </el-col>
                            <el-col :span="8">
                                 <div class="detail">业主:{{scope.row.owner}}</div>
                                <div class="detail">承包商:{{scope.row.contractor}}</div>
                                <div class="detail">作业项目:{{scope.row.workProject}}</div>
                                <div class="detail">项目组名称:{{scope.row.projectName}}</div>
                                <div class="detail">检测项目:{{scope.row.checkProject}}</div>
                            </el-col>
                           
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" width="60px"></el-table-column>
                <el-table-column label="单位名称" prop="checkedCompanyName"></el-table-column>
                 <el-table-column label="检查表名称" prop="checkListName" width="200px"></el-table-column>
                <el-table-column label="责任部门" prop="responsiCompanyName"></el-table-column>
                <el-table-column label="受审核部门" prop="group"></el-table-column>
                <el-table-column label="审核日期" prop="checkDate"></el-table-column>
                <el-table-column label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editBasicInfo(scope.row)">修改</el-button>
                        <el-button type="success" icon="el-icon-check" size="mini" @click="pushBasicInfo(scope.row)">推送</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBasicInfo(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>


        <!-- 新增基本信息生成登记表对话框 -->
        <el-dialog
            title="新增基本信息登记表"
            :visible.sync="addInfoDialogVisible"
            width="50%" @closed="addInfoDialogClosed">
            <!-- 步骤条 -->
            <el-steps :space="240" :active="activeIndex - 0" finish-status="success" align-center class="progressInfo">
                <el-step title="部门信息"></el-step>
                <el-step title="监督信息"></el-step>
                <el-step title="项目信息"></el-step>
             </el-steps>
            <!-- 基本信息表单 -->
                     <!-- tab栏 -->
        <el-form :model="addInfoForm" :rules="addInfoFormRules" ref="addInfoFormRef" label-width="100px" label-position="top">
             <el-tabs v-model="activeIndex" :tab-position="'left'">
                <el-tab-pane label="部门信息" name="0">
                    <el-form-item label="受审核单位" prop="checkedCompanyCode">
                        <treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
				        v-model="checkedCompanyId"></treeselect>
                    </el-form-item>
                     <el-form-item label="受审核部门">
                     <!-- <el-select v-model="addInfoForm.group" placeholder="请选择">
                     <el-option :label="item.empGroup" :value="item.empGroup" v-for="(item, index) in employeeList" :key="index">
                         <span>{{item.empGroup}}({{item.companyName}})</span>
                     </el-option>
                    </el-select> -->
                    <el-input v-model="addInfoForm.group"></el-input>
                    </el-form-item>
                     <el-form-item label="责任部门" prop="responsiCompanyCode">
                        <treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
				        v-model="responsiCompanyId"></treeselect>
                    </el-form-item>
                    <el-form-item label="责任部门负责人">
                         <!-- <el-select v-model="addInfoForm.responsePersonID" placeholder="请选择">
                            <el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeArr" :key="index">
                                <span>{{item.name}}&nbsp;({{item.companyName}})</span>
                            </el-option>
                        </el-select> -->
                        <el-input v-model="addInfoForm.responsePersonID"></el-input>
                    </el-form-item>
                    <el-form-item label="检查方式" prop="taskType">
                         <el-radio-group v-model="addInfoForm.taskType">
                            <el-radio label="内审"></el-radio>
                            <el-radio label="外审"></el-radio>
                            <el-radio label="管理评审"></el-radio>
                            <el-radio label="顾客投诉"></el-radio>
                            <el-radio label="监督"></el-radio>
                            <el-radio label="远程监控"></el-radio>
                            <el-radio label="其他"></el-radio>
                         </el-radio-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="监督信息" name="1">
                    <el-form-item label="审核日期" prop="checkDate"> 
                         <el-date-picker
                            v-model="addInfoForm.checkDate"
                            type="date"
                            placeholder="请选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="检查表名称" prop="checkListCode">
                        <el-select v-model="addInfoForm.checkListCode" placeholder="请选择">
                            <el-option 
                            :label="item.checkListName"
                            :value="item.checkListCode"
                            v-for="(item, index) in checkTableList"
                            :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="监督人员" prop="checkPerson">
                        <el-input v-model="addInfoForm.checkPerson" readonly></el-input>    
                    </el-form-item>
                    <el-form-item label="监督检查依据" prop="checkBasis">
                        <el-input v-model="addInfoForm.checkBasis" type="textarea"></el-input>    
                    </el-form-item>
                    <el-form-item label="执行标准" prop="execStd">
                        <el-input v-model="addInfoForm.execStd" type="textarea"></el-input>    
                    </el-form-item>
                </el-tab-pane>
                 <el-tab-pane label="项目信息" name="2">
                     <el-form-item label="业主" prop="owner">
                        <el-input v-model="addInfoForm.owner"></el-input>    
                    </el-form-item>
                     <el-form-item label="承包商" prop="contractor">
                        <el-input v-model="addInfoForm.contractor"></el-input>    
                    </el-form-item>
                    <el-form-item label="作业项目" prop="workProject">
                        <el-input v-model="addInfoForm.workProject"></el-input>    
                    </el-form-item>
                     <el-form-item label="项目组名称" prop="projectName">
                        <el-input v-model="addInfoForm.projectName"></el-input>    
                    </el-form-item>
                    <el-form-item label="检测项目" prop="checkProject">
                        <el-input v-model="addInfoForm.checkProject"></el-input>    
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addInfoDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addInfoClick">提 交</el-button>
            </span>
            </el-dialog>
            <!-- 编辑修改基本信息登记表对话框 -->
            <el-dialog
            title="修改基本信息登记表"
            :visible.sync="editInfoDialogVisible"
            width="50%">
            <!-- 基本信息表单 -->
                     <!-- tab栏 -->
        <el-form :model="eidtInfoForm"  label-width="100px" label-position="top">
             <el-tabs v-model="editActiveIndex" :tab-position="'left'">
                <el-tab-pane label="部门信息" name="0">
                    <el-form-item label="受审核单位" >
                        <!-- <treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
				        v-model="editCheckedCompanyId"></treeselect> -->
                         <el-input v-model="eidtInfoForm.checkedCompanyName" readonly></el-input>
                    </el-form-item>
                     <el-form-item label="受审核部门">
                     <!-- <el-select v-model="eidtInfoForm.group" placeholder="请选择">
                     <el-option :label="item.empGroup" :value="item.empGroup" v-for="(item, index) in editEmployeeList" :key="index">
                         <span>{{item.empGroup}}({{item.companyName}})</span>
                     </el-option>
                    </el-select> -->
                    <el-input v-model="eidtInfoForm.group" readonly></el-input>
                    </el-form-item>
                     <el-form-item label="责任部门">
                        <!-- <treeselect :multiple="false" :disable-branch-nodes="true" placeholder="请选择公司单位" style="width: 250px" :options="companyList"
				        v-model="eidtResponsiCompanyId"></treeselect> -->
                        <el-input v-model="eidtInfoForm.responsiCompanyName" readonly></el-input>
                        
                    </el-form-item>
                    <el-form-item label="责任部门负责人">
                         <!-- <el-select v-model="eidtInfoForm.responsePersonID" placeholder="请选择" >
                            <el-option :label="item.name" :value="item.employeeID" v-for="(item, index) in employeeArray" :key="index">
                                <span>{{item.name}}&nbsp;({{item.companyName}})</span>
                            </el-option>
                        </el-select> -->
                        <el-input v-model="eidtInfoForm.responsePersonName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="检查方式">
                         <el-radio-group v-model="eidtInfoForm.taskType">
                            <el-radio label="内审"></el-radio>
                            <el-radio label="外审"></el-radio>
                            <el-radio label="管理评审"></el-radio>
                            <el-radio label="顾客投诉"></el-radio>
                            <el-radio label="监督"></el-radio>
                            <el-radio label="远程监控"></el-radio>
                            <el-radio label="其他"></el-radio>
                         </el-radio-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="监督信息" name="1">
                    <el-form-item label="审核日期"> 
                         <el-date-picker
                            v-model="eidtInfoForm.checkDate"
                            type="date"
                            placeholder="请选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="检查表名称">
                        <el-select v-model="eidtInfoForm.checkListCode" placeholder="请选择">
                            <el-option
                            v-for="item in checkTableList"
                            :key="item.checkListCode"
                            :label="item.checkListName"
                            :value="item.checkListCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="监督人员">
                        <el-input v-model="eidtInfoForm.checkPerson" readonly></el-input>    
                    </el-form-item>
                    <el-form-item label="监督检查依据">
                        <el-input v-model="eidtInfoForm.checkBasis" type="textarea"></el-input>    
                    </el-form-item>
                    <el-form-item label="执行标准">
                        <el-input v-model="eidtInfoForm.execStd" type="textarea"></el-input>    
                    </el-form-item>
                </el-tab-pane>
                 <el-tab-pane label="项目信息" name="2">
                     <el-form-item label="业主">
                        <el-input v-model="eidtInfoForm.owner"></el-input>    
                    </el-form-item>
                     <el-form-item label="承包商">
                        <el-input v-model="eidtInfoForm.contractor"></el-input>    
                    </el-form-item>
                    <el-form-item label="作业项目">
                        <el-input v-model="eidtInfoForm.workProject"></el-input>    
                    </el-form-item>
                     <el-form-item label="项目组名称">
                        <el-input v-model="eidtInfoForm.projectName"></el-input>    
                    </el-form-item>
                    <el-form-item label="检测项目">
                        <el-input v-model="eidtInfoForm.checkProject"></el-input>    
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editInfoDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editInfoClick()">修 改</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { GetCompany } from "../../../services/gettreedata"
import { GetCurrentUser } from '../../../store/CurrentUser'
import { GetEmployee } from "../../../services/filePropagation.js"
import { submitBasicInfo, getCheckList, editBasicInfomation, deleteBasicInfomation, pushBasicInfomation, inquireBasicInfomation} from "../../../services/qualitySystem/basicInfo"
export default {
  data () {
      // 验证邮箱的规则
    var checkCurrentDate = (rule, value, callback) => {
        console.log(value)
      if (this.currentDate <= value) {
        return callback()
      }
      callback(new Error('审核日期不能选择小于当前日期'))
    }
    return {
        // 加载
        loading: false,
        activeIndex: '0',
        editActiveIndex: '0',
        // 查询部分表格信息表单对象
        selectInfoForm: {
            checkedCompanyCode: null,
            checkDate: ''
        },
        // 查询部分数据时间数组
        selectCheckDate: [],
        // 查询表格公司code
        selectCheckedCompanyId: null,
        // 基本信息登记表格数据
        basicInfoList: [],
        // 可以选择多个的检查表ID数组
        checkListCode: [],
        // 可以选择多个的检查表名称数组
        checkListName: [],
        // 请求的检查表数据
        checkTableList: [],
        // 公司表数据
        companyList: [],
        // 员工表数据
        employee: [],
        // 中间员工表数组
        employeeList: [],
        // 编辑员工数组
        editEmployeeList: [],
        employeeDetail: [],
        // 最终员工表筛选数据
        employeeArr: [],
        // 编辑对话框员工数组
        employeeArray: [],
        // companyNodeCode
        companyCode: '',
        // 公司名称
        companyName: '',
        // 公司id
        companyId: null,
        // 受审核单位ID
        checkedCompanyId: null,
        // 责任部门id
        responsiCompanyId: null,
      // 显示与隐藏新增基本信息登记表对话框
      addInfoDialogVisible: false,
      // 编辑信息登记表对话框显示与隐藏
      editInfoDialogVisible: false,
      // 编辑信息表表单对象
      eidtInfoForm: {},
      // 编辑对话框受审核单位id
      editCheckedCompanyId: null,
      // 编辑对话框责任部门id
      eidtResponsiCompanyId: null,
      // 基本信息登记表单数据
      addInfoForm: {
          // 检查方式
          taskType: '',
          // 受审核单位
          checkedCompanyName: '',
          // 受审核单位ID
          checkedCompanyCode: null,
          // 受审核部门
          // group: '',
          // 作业项目
          workProject: '',
          // 项目组名称
          projectName: '',
          // 承包商
          contractor: '',
          // 业主
          owner: '',
          // 检测项目
          checkProject: '',
          // 监督日期
          checkDate: '',
          // 监督人员ID
          checkPersonID: '',
          // 监督人员姓名
          checkPerson: '',
          // 监督检查依据
          checkBasis: '',
          // 执行标准
          execStd: '',
          // 责任部门名称
          responsiCompanyName: '',
          // 责任部门id
          responsiCompanyCode: null,
          // 检查表code
          checkListCode: '',
          // 检查表名称
          checkListName: '',
          // 责任部门负责人
          responsePersonName: '',
          // 责任部门负责人id
          responsePersonID: '',
          // 当前时间
          currentDate: ''
      },
      // 验证规则
      addInfoFormRules: {
          owner: [
              { required: true, message: '请输入业主姓名', trigger: 'blur' }
          ],
          contractor: [
              { required: true, message: '请输入承包商姓名', trigger: 'blur' }
          ],
          projectName: [
              { required: true, message: '请输入项目组名称', trigger: 'blur' }
          ],
          checkProject: [
              { required: true, message: '请输入需要检测的项目', trigger: 'blur' }
          ],
          execStd: [
              { required: true, message: '请输入执行的标准', trigger: 'blur' }
          ],
          workProject: [
               { required: true, message: '请输入作业项目', trigger: 'blur' }
          ],
          checkBasis: [
               { required: true, message: '请输入监督检查依据', trigger: 'blur' }
          ],
          checkListCode: [
               { required: true, message: '请选择检查表', trigger: 'blur' }
          ],
          checkDate: [
               { required: true, message: '请选择审核日期', trigger: 'blur' },
               { validator: checkCurrentDate, trigger: 'blur' }   
          ],
          checkPerson: [
              { required: true, message: '请输入监督人员', trigger: 'blur' }   
          ],
          taskType: [
              { required: true, message: '请选择检查方式', trigger: 'blur' }   
          ],
        //   responsePersonID: [
        //       { required: true, message: '请选择责任部门负责人', trigger: 'blur' }   
        //   ],
          responsiCompanyCode: [
              { required: true, message: '请选择责任部门', trigger: 'blur' }   
          ],
        //   group: [
        //       { required: true, message: '请选择受审核部门', trigger: 'blur' }   
        //   ],
          checkedCompanyCode: [
               { required: true, message: '请选择受审核单位', trigger: 'blur' }   
          ]
      }
    }
  },
  created: function () {
    this.loading = true
    // 获取公司表
    this.getCompany()
    this.getEmploee()
    this.getBasicInfo()
    // 获取当前用户
    console.log(GetCurrentUser())
    this.currentDate = this.getCurrentDate()
  },
  methods: {
    // 基本信息登记表对话框
    addBasicInfo: function () {
      this.getCompany()
      this.getCurrentUser()
      this.getEmploee()
      this.addInfoDialogVisible = true 
      this.getCheckTableList()
  },
    addInfoClick: function () {
      // 提交表单
    //   this.changeCheckListCodeToName()
    //   console.log(this.addInfoForm)
      this.$refs.addInfoFormRef.validate((valid) => {
          if (!valid) {
              return this.$message.error('基本信息表必填项未填')
          }
          this.changeCheckListCodeToName()
          console.log('基本信息表单登记提交')
          console.log(this.addInfoForm)
          submitBasicInfo(this.addInfoForm).then((res) => {
              console.log('基本信息登记提交返回结果')
              console.log(res.data) 
              this.getBasicInfo()
              this.addInfoDialogVisible = false
              return this.$message.success('基本信息登记成功')
          }).catch((err) => {
              return this.$message.error(err.message)
          })
      })
    },
    getBasicInfo: function () {
        const x = []
        for(let i in this.selectCheckDate) {
            x.push(this.formatDate(this.selectCheckDate[i]))
        }
        console.log(x)
        this.selectInfoForm.checkDate = x.join(';')
        console.log(this.selectInfoForm.checkDate)
        console.log(this.selectInfoForm)
        // if(this.selectInfoForm.checkedCompanyCode == null || this.selectInfoForm.checkDate == '') {
        //     return this.$message.error('请同时选择公司以及审核日期')
        // }
        inquireBasicInfomation(this.selectInfoForm).then((res) => {
            console.log('查询基本信息登记表的信息')
            console.log(res.data)
            this.basicInfoList = this.sortByDate(res.data)
            this.loading = false   
        }).catch((err) => {
            return this.$message.error(err.message)
        })
    },
    editBasicInfo: function (information) {
      // 弹出编辑基本信息表对话框
      if(information.isPush === '已推送'){
            return this.$message.error('该登记表已推送，无法进行再次修改')
        }
      console.log('该表的基本信息')
      console.log(information)
      this.eidtInfoForm = information
      this.getCheckTableList()  
    //   this.editCheckedCompanyIDChange(information)
    //   this.eidtResponsiCompanyIDChange(information)    
      this.editInfoDialogVisible = true
    },
    deleteBasicInfo: async function (row) {
      // 删除基本信息登记表
      if(row.isPush === "已推送") {
          return this.$message.error('该登记表已推送，请勿进行删除操作')
      }
      const confirmResult = await this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      deleteBasicInfomation(row.qualityCheckID).then((res) => {
          console.log('删除基本信息登记表返回信息')
          console.log(res.data)
          this.getBasicInfo()
          return this.$message.success('删除信息成功')
      }).catch((err) => {
          return this.$message.error(err.message)
      })
    },
    pushBasicInfo: async function (row) {
      // 推送基本信息登记表
      if(row.isPush === "已推送") {
          return this.$message.error('该登记表已推送，请勿重复操作')
      }
      const confirmResult = await this.$confirm('是否推送该表信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消推送')
      }
      console.log(row)
      pushBasicInfomation(row.qualityCheckID).then((res) => {
          console.log('推送基本信息表返回信息')
          console.log(res.data)
          this.getBasicInfo()
          return this.$message.success('推送成功')
      }).catch((err) => {
          return this.$message.error(err.message)
      })
    },
    addInfoDialogClosed: function () {
      // 关闭基本信息登记表对话框
      this.$refs.addInfoFormRef.resetFields()
      this.checkedCompanyId = null
      this.responsiCompanyId= null
      this.activeIndex = '0'
    },
    // 获取检查表
    getCheckTableList: function () {
        getCheckList().then((res) => {
            console.log('检查表信息')
            console.log(res.data)
            this.checkTableList = res.data
            console.log('获取的检查表信息')
            console.log(this.checkTableList)
        })
    },
    editInfoClick: function () {
        // 修改配置基本信息表
        // 编辑确认基本信息表
        let that = this
        console.log('编辑修改的基本信息表')
        console.log(that.eidtInfoForm)
        editBasicInfomation(that.eidtInfoForm.qualityCheckID,that.eidtInfoForm).then((res) => {
          console.log('修改基本信息登记表返回的信息')
          console.log(res.data)
          this.getBasicInfo()
          this.editActiveIndex = '0'
          this.editInfoDialogVisible = false
          return this.$message.success('修改成功')
      }).catch((err) => {
          return this.$message.error(err.message)
      })
    },
    // 获取公司表

    getCompany: function () {
	  GetCompany().then(res => {
        this.companyList = res.data
        console.log('公司表')
        console.log(this.companyList)
	  }).catch(err => {
		this.$message.error(err.message)
        })
        
    },
    // 获取当前用户
    getCurrentUser: function () {
        console.log(GetCurrentUser())
        const currentUser = GetCurrentUser()
        this.addInfoForm.checkPerson = currentUser.employeeName
        this.addInfoForm.checkPersonID = currentUser.employeeId
    },
    //获得员工信息
	getEmploee: function () {
		GetEmployee().then(res => {
		//调用接口返回员工表，并对员工表进行筛选，只返回属于该行公司的员工信息
        this.employee = res.data
        console.log('员工表')
        console.log(this.employee)
        })
        
    },
    checkCompanyCodeChanged: function (val) {
        // 监听受审核单位发生变化时的操作
        console.log(val)
        if(val) {
            this.changeCompanyIdToName(this.companyList, this.checkedCompanyId)
            this.addInfoForm.checkedCompanyName = this.companyName
            this.addInfoForm.checkedCompanyCode = this.companyCode
            this.employeeList = this.employee.filter((item) => {
                return item.companyName == this.addInfoForm.checkedCompanyName
            })
            const x = []
            const arr = this.employeeList
            for(let i = 0; i < this.employeeList.length; i++){
                var isRepeat = false
                for(let j = i+1; j < arr.length; j++) {
                    if(this.employeeList[i].empGroup === arr[j].empGroup){
                        isRepeat = true
                        break
                    }
                   
                } 
                if(isRepeat == false){
                    x.push(this.employeeList[i])
                }
                
            }
            this.employeeList = x
           
        }else {
            this.addInfoForm.checkedCompanyName = ''
            this.companyCode = ''
        }
    },
    // 将公司Id转化为公司名称，并且保存nodeCode
    changeCompanyIdToName: function (val,companyId) {
        for (var j = 0; j < val.length; j++) {
		    if (val[j]) {
		        if (val[j].id == companyId) {
                    this.companyCode = val[j].nodeCode
                    console.log('公司nodeCode:'+this.companyCode)
                    this.companyName = val[j].label
                    console.log('公司名称:' + val[j].label)
				    break
			    } else if (val[j].children) {
				    this.changeCompanyIdToName(val[j].children, companyId)
			    }
		    }
	    }
    },
    // 将公司code转化为公司id
    changeCompanyCodeToId: function (val,companyCode) {
        for (var j = 0; j < val.length; j++) {
		    if (val[j]) {
		        if (val[j].nodeCode == companyCode) {
                    this.companyId = val[j].id
                    console.log('公司Id:'+this.companyId)
                    this.companyName = val[j].label
                    console.log('公司名称:' + val[j].label)
				    break
			    } else if (val[j].children) {
				    this.changeCompanyCodeToId(val[j].children, companyCode)
			    }
		    }
	    }
    },
    // 将检查表code改变为name
    changeCheckListCodeToName: function () {
    //    for(let j = 0; j < this.checkListCode.length; j++) {
    //         for(let i in this.checkTableList) {
    //             if(this.checkListCode[j] === this.checkTableList[i].checkListCode){
    //                 console.log(this.checkTableList[i].checkListName)
    //                 this.checkListName[j] = this.checkTableList[i].checkListName
    //                 console.log(this.checkListName)
    //             }
    //         } 
    //    }
    for(let i in this.checkTableList){
        if(this.addInfoForm.checkListCode === this.checkTableList[i].checkListCode){
            this.addInfoForm.checkListName = this.checkTableList[i].checkListName
            break
        }
    }
    //    this.addInfoForm.checkListName = this.checkListName.join(';')
       console.log(this.addInfoForm.checkListName)
    },
    responsePersonIDChange: function (val) {
        // 责任部门负责人改变触发的事件
        console.log('责任部门负责人ID:' + val)
        if(val) {
            for(let i in this.employee) {
                if(val === this.employee[i].employeeID) {
                    this.addInfoForm.responsePersonName = this.employee[i].name
                    break
                }
            }
        }else {
            this.addInfoForm.responsePersonName = ''
        }
    },
    responsiCompanyID: function (val) {
        // 监听责任部门id发生变化获得部门的名称
        console.log(val)
        if(val) {
            this.changeCompanyIdToName(this.companyList, this.responsiCompanyId)
            this.addInfoForm.responsiCompanyName = this.companyName
            this.addInfoForm.responsiCompanyCode = this.companyCode
             this.employeeArr = this.employee.filter((item) => {
                return item.companyName == this.addInfoForm.responsiCompanyName
            })
            console.log('筛选责任部门员工表')
            console.log(this.employeeArr)
        }else {
            this.addInfoForm.responsiCompanyName = ''
            this.companyCode = ''
        }
    },
    selectCheckedCompanyIdChanged: function (val) {
        // 监听查询选择公司id变化
        if(val) {
            this.changeCompanyIdToName(this.companyList, this.selectCheckedCompanyId)
            this.selectInfoForm.checkedCompanyCode = this.companyCode
        }else {
            this.selectInfoForm.checkedCompanyCode = null
            this.companyCode = ''
        }
    },
    sortByDate(data){
		if(!data){
			return
		}
		for(var i=0;i<data.length-1;i++){
			for(var j=i+1;j<data.length;j++){
				if(data[i].checkDate<=data[j].checkDate){
					let temp=data[i]
					data[i]=data[j]
					data[j]=temp
				}
			}
		}
		return data
	},
    // editCheckedCompanyIDChange: function (form) {
    //     let that = this
    //     that.changeCompanyCodeToId(that.companyList,form.checkedCompanyCode)
    //     that.editCheckedCompanyId = that.companyId
    //     that.editFilterCheckedGroup(form)
    // },
    // eidtResponsiCompanyIDChange: function (form) {
    //     let that = this
    //     that.changeCompanyCodeToId(that.companyList,form.responsiCompanyCode)
    //     that.eidtResponsiCompanyId = that.companyId
    //     that.editFilterReponseCompany(form)
    // },
    // editFilterCheckedGroup: function (form) {
    //     // 筛选编辑受审核部门
    //     let that = this
    //     that.changeCompanyIdToName(that.companyList, that.editCheckedCompanyId)
    //         form.checkedCompanyName = that.companyName
    //         form.checkedCompanyCode = that.companyCode
    //         that.editEmployeeList = that.employee.filter((item) => {
    //             return item.companyName == form.checkedCompanyName
    //         })
    //         const x = []
    //         const arr = that.editEmployeeList
    //         for(let i = 0; i < that.editEmployeeList.length; i++){
    //             var isRepeat = false
    //             for(let j = i+1; j < arr.length; j++) {
    //                 if(that.editEmployeeList[i].empGroup === arr[j].empGroup){
    //                     isRepeat = true
    //                     break
    //                 }
                   
    //             } 
    //             if(isRepeat == false){
    //                 x.push(that.editEmployeeList[i])
    //             }
                
    //         }
    //         that.editEmployeeList = x
    //         console.log('编辑受审核单位得到的受审核部门')
    //         console.log(that.editEmployeeList)
           
    // },
    // editFilterReponseCompany: function (form) {
    //     let that = this
    //     that.changeCompanyIdToName(that.companyList, that.eidtResponsiCompanyId)
    //     form.responsiCompanyName = that.companyName
    //     form.responsiCompanyCode = that.companyCode
    //     that.employeeArray = that.employee.filter((item) => {
    //             return item.companyName == form.responsiCompanyName
    //     })
    //     console.log('筛选编辑责任部门员工表')
    //     console.log(that.employeeArray)
    // },
    // editCheckedCompanyIdChanged: function (val) {
    //     // 监听编辑受审核部门id变化
    //     let that = this
    //     console.log('编辑受审核单位id'+val)
    
    //     that.editFilterCheckedGroup(that.editInfoForm)
        
    // },
    // eidtResponsiCompanyIdChanged: function (val) {
    //     // 监听编辑责任部门id变化
    //     let that = this
    //     console.log('监听编辑责任部门id变化'+val)
    //     that.editFilterReponseCompany(that.editInfoForm)
        
    // },
    // checkListCodeChanged: function (val) {
    //     // 监听检查表发生变化
    //    console.log('选中的检查表信息')
    //    console.log(val)
    //    this.addInfoForm.checkListCode = val.join(';')
    //    console.log(this.addInfoForm.checkListCode)
    // },
    // 时间格式化
    formatDate: function (time) {
        const timer = time.getTime()
        console.log(timer)
        const date = new Date(timer)
        const y = date.getFullYear()
        const m = date.getMonth() + 1
        const mm = m < 10 ? '0' + m : m
        const d = date.getDate()
        const dd = d < 10 ? '0' + d : d
        return y + '-' + mm + '-' + dd
    },
    getCurrentDate: function () {
            // 获取当前时间
            let date = new Date()
            console.log(date)
            let y = date.getFullYear()
            console.log(y)
            let m = date.getMonth() + 1
            console.log(m)
            m = m < 10 ? '0' + m : m
            let d = date.getDate()
            console.log(d)
            d = d < 10 ? '0' + d : d
            let str = y + '-' + m + '-' + d
            console.log(str)
            return str
        },
  },
  watch: {
      // 监听受审核单位id发生变化
    'checkedCompanyId' : 'checkCompanyCodeChanged',
    // 监听责任部门负责人ID变化
    'addInfoForm.responsePersonID' : 'responsePersonIDChange',
    // 监听责任部门ID发生变化
    'responsiCompanyId': 'responsiCompanyID',
    // 监听检查表发生变化
    //'checkListCode': 'checkListCodeChanged',
    // 监听查询选择公司id变化
    'selectCheckedCompanyId': 'selectCheckedCompanyIdChanged',
    // 监听编辑受审核单位变化
    //'editCheckedCompanyId': 'editCheckedCompanyIdChanged',
    // 监听编辑责任部门id变化
    //'eidtResponsiCompanyId': 'eidtResponsiCompanyIdChanged'
  }
}
</script>

<style scoped>
.progressInfo {
    margin: 26px 0;
}
.detail {
    margin: 20px 0;
    color: #999;
}
</style>