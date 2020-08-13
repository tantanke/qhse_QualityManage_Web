<template>
  <div>
    <div class="page-title">隐患基本信息</div>
    <div class="page-content">
      <el-row>
        <el-form ref="form" :model="form" label-width="150px" label-suffix="：">
          <el-row>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="检查人员">
                <el-select
                  v-model="form.safeStaff_ID"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in employees"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="施工队伍">
                <el-cascader
                  ref="companyChoose"
                  v-model="form.companyId"
                  :options="companys"
                  :props="{value: 'nodeCode'}"
                  @change="changeCompany"
                  :show-all-levels="false"
                  
                />
              </el-form-item>
              <el-form-item label="位置区域">
                <el-input v-model="form.location" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="隐患类别">
                <el-select
                  v-model="form.checkType"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in checkTypes"
                    :key="item.factorID"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="原因分析">
                <el-select
                  v-model="form.factorSource"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factoSources"
                    :key="item.factorObserverCode2"
                    :label="item.factorObserverName2"
                    :value="item.factorObserverName2"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="限期整改时间">
                <el-date-picker
                  v-model="form.limitDate"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="隐患级别">
                <el-select
                  v-model="form.rank"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in ranks"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="隐患描述">
                <el-input type="textarea" v-model="form.description" :rows="5" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="整改负责人">
                <el-select
                  v-model="form.reformPerson"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in employees"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="上传附件">
                <el-upload
                  action="/api/accident_upload"
                  :on-success="handleAvatarSuccess"
                  :headers="header"
                  :limit="1"
                >
                  <el-button size="small" type="primary">浏览文件</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="作业项目">
                <el-input v-model="form.workItem" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="检查时间">
                <el-date-picker
                  v-model="form.recordDate"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="可能后果">
                <el-select
                  v-model="form.consequenceID"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in consequences"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="对应体系要素">
                <el-select
                  v-model="form.factorHSE"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factorHSEs"
                    :key="item.factorHseId"
                    :label="item.factorHseName"
                    :value="item.factorHseName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="归属职能部门">
                <el-select
                  v-model="form.factorDepartment"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factorDepartments"
                    :key="item.factorDepartmentCode"
                    :label="item.factorDepartmentName"
                    :value="item.factorDepartmentName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="是否立即验收" style="margin-top:114px">
                <el-switch v-model="form.ok"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <br />
          <el-form-item>
            <el-button type="primary" style="width:100px" @click="onSubmit">确认</el-button>
            <el-button type="danger" style="width:100px" @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import { GetCurrentUser } from '@/store/CurrentUser'
import {
  addDangerRecord,
  QueryCompany,
  QueryFactor,
  QueryFactorDepartment,
  QueryFactorHSE,
  QueryFactorObserver
} from '@/services/hidden_danger_investigation/dangerRecord'
import { GetEmployees } from '../../../services/employee'
import { GetDictionary } from '../../../services/dictionary'

export default {
  data() {
    return {
      form: {
        checkId: '',
        safeStaff_ID: null,
        workItem: '',
        companyId: '',
        description: '',
        reformPerson: null,
        limitDate: '',
        ok: false,
        consequenceID: null,
        checkType: null,
        affixName: '',
        recordDate: '',
        rank: '',
        factorSource: '',
        factorHSE: '',
        factorDepartment: '',
        location: '',
        qHSE_FileAudit_ID: '' //文件审核id
      },
      header: { Authorization: GetCurrentUser().token },
      companys: [], // 公司
      employees: [], // 员工
      checkTypes: [], // 隐患类别
      consequences: [], //可能后果
      factoSources: [], //原因分析
      factorHSEs: [], //对应体系要素
      factorDepartments: [], //归属职能部门
      ranks: [] //隐患级别
    }
  },
  created() {
    this.getCompany()
    this.getEmployees()
    this.getCheckTypes()
    this.getConsequences()
    this.getFactoSources()
    this.getFactorHSEs()
    this.getFactorDepartments()
    this.getRanks()
    this.getfileAuditId()
  },
  methods: {
    getfileAuditId () {
      const initData = JSON.parse(localStorage.getItem('data'))
      this.form.qHSE_FileAudit_ID = initData.fileAuditId
    },
    // 获取数据方法
    getCompany() {
      QueryCompany()
        .then(res => {
          this.companys = res.data
        })
        .catch(() => {
          this.$message.error('获取公司数据失败！')
        })
    },
    getEmployees() {
      GetEmployees({ name: '', type: 'all' })
        .then(res => {
          this.employees = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getCheckTypes() {
      QueryFactor('隐患')
        .then(res => {
          this.checkTypes = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getConsequences() {
      GetDictionary({ name: '后果' })
        .then(res => {
          this.consequences = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getFactoSources() {
      QueryFactorObserver()
        .then(res => {
          this.factoSources = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getFactorHSEs() {
      QueryFactorHSE()
        .then(res => {
          this.factorHSEs = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getFactorDepartments() {
      QueryFactorDepartment()
        .then(res => {
          this.factorDepartments = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getRanks() {
      GetDictionary({ name: '隐患级别' })
        .then(res => {
          this.ranks = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 确认提交方法
    onSubmit() {
      this.form.checkId = '0001'
      this.form.ok = this.form.ok ? '1' : '0'
      this.form.companyName = this.$refs['companyChoose'].inputValue
      addDangerRecord(this.form)
        .then(res => {
          console.log(res)
          this.$message.success(res.message)
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
          this.$message.error(err.message)
        })
    },

    // 一些事件
    changeCompany(value) {
      this.form.companyId = value[value.length - 1]
    },
    handleAvatarSuccess(res) {
      this.form.affixName = res.data
    },
     
  },
  beforeRouteEnter (to, from, next) {
    next()
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 15px;
}
.el-select,
.el-cascader,
.el-input {
  width: 100%;
}
</style>
