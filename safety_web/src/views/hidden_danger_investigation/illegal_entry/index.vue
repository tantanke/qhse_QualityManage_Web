<template>
  <div>
    <div class="page-title">违章录入</div>
    <div class="page-content">
      <el-row>
        <el-form ref="form" :model="form" label-width="150px" label-suffix="：">
          <el-row>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="施工队伍">
                <el-cascader
                  v-model="form.companyId"
                  :options="companys"
                  :props="{value: 'id'}"
                  @change="changeCompany"
                  :show-all-levels="false"
                />
              </el-form-item>
              <el-form-item label="检查时间">
                <el-date-picker
                  v-model="form.recordDate"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="作业项目">
                <el-input v-model="form.workItem" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="监督人员">
                <el-select
                  v-model="form.profession"
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
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="违章类别">
                <el-select
                  v-model="form.checkType"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in checkTypes"
                    :key="item.factorCode"
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
              <el-form-item label="对应安全沟通类型">
                <el-select
                  v-model="form.factorObserver"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factorObservers"
                    :key="item.factorObserverCode2"
                    :label="item.factorObserverName2"
                    :value="item.factorObserverName2"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="原因">
                <el-select
                  v-model="form.factoSource"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factoSources"
                    :key="item.factorSourceCode"
                    :label="item.factorSourceName"
                    :value="item.factorSourceName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="归属部门">
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
              <br />
              <el-form-item>
                <el-button type="primary" style="width:100px" @click="onSubmit">确认</el-button>
                <el-button type="danger" style="width:100px" @click="$router.go(-1)">取消</el-button>
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="违章人员">
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
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用工性质">
                <el-select
                  v-model="form.employeeCharacter"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in employeeCharacters"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="工种年龄">
                <el-select
                  v-model="form.workSeniority"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in workSeniorities"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="岗位分类">
                <el-select
                  v-model="form.Position"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in positions"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="违章性质">
                <el-select
                  v-model="form.RegulationCharacter"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in regulationCharacters"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="违章描述">
                <el-input type="textarea" v-model="form.description" :rows="6" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="罚款（元）" style="margin-top:1px">
                <el-input v-model="form.punish1" placeholder="请填写" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import { GetCurrentUser } from '@/store/CurrentUser'
import {
  addRegulationRecord,
  QuerCompany,
  QueryFactor,
  QueryFactorHSE,
  QueryFactorObserver,
  QueryFactorDepartment,
  QueryFactorSource
} from '@/services/hidden_danger_investigation/regulationRecord'
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
        consequenceID: null,
        checkType: null,
        affixName: '',
        recordDate: '',
        factoSource: '',
        profession: null,
        factorHSE: '',
        factorDepartment: '',
        employeeCharacter: '',
        workSeniority: '',
        punish1: null,
        factorObserver:''
      },
      header: { Authorization: GetCurrentUser().token },
      companys: [], // 公司
      employees: [], // 员工
      employeeCharacters: [], // 用工性质
      workSeniorities: [], //工种年龄
      positions: [], //岗位分类
      checkTypes: [], //违章类别
      regulationCharacters: [], //违章性质
      factorHSEs: [], //对应体系要素
      factorObservers: [], //对应安全沟通类型
      factoSources: [], //原因
      factorDepartments: [], //归属部门
      consequences: [] //可能后果
    }
  },
  created() {
    this.getCompany()
    this.getEmployees()
    this.getEmployeeCharacters()
    this.getPositions()
    this.getWorkSeniorities()
    this.getCheckTypes()
    this.getRegulationCharacters()
    this.getFactorHSEs()
    this.getFactorObservers()
    this.getFactoSources()
    this.getFactorDepartments()
    this.getConsequences()
  },
  methods: {
    // 获取数据
    getCompany() {
      QuerCompany()
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
    getEmployeeCharacters() {
      GetDictionary({ name: '用工性质' })
        .then(res => {
          this.employeeCharacters = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getPositions() {
      GetDictionary({ name: '岗位分类' })
        .then(res => {
          this.positions = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getWorkSeniorities() {
      GetDictionary({ name: '工种年龄' })
        .then(res => {
          this.workSeniorities = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getCheckTypes() {
      QueryFactor('违章')
        .then(res => {
          this.checkTypes = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getRegulationCharacters() {
      GetDictionary({ name: '安庆违章性质' })
        .then(res => {
          this.regulationCharacters = res.data
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
    getFactorObservers() {
      QueryFactorObserver()
        .then(res => {
          this.factorObservers = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getFactoSources() {
      QueryFactorSource()
        .then(res => {
          this.factoSources = res.data
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
    getConsequences() {
      GetDictionary({ name: '后果' })
        .then(res => {
          this.consequences = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },

    // 确认提交
    onSubmit() {
      addRegulationRecord(this.form)
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
    }
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 14px;
}
.el-select,
.el-cascader,
.el-input {
  width: 100%;
}
</style>
