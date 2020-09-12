<template>
  <div>
    <div class="page-title">违章录入</div>
    <div class="page-content" v-loading='adding'>
      <el-row>
        <el-form ref="form" :model="form" label-width="150px" label-suffix="：">
          <el-row>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="施工队伍">
                <el-cascader
                  v-model="form.companyId"
                  :options="companys"
                  ref='companyChoose'
                  :props="{value: 'nodeCode'}"
                  @change="changeCompany"
                  :show-all-levels="false"
                />
              </el-form-item>
              <el-form-item label="检查时间">
                <el-date-picker
                  v-model="form.supervisionDate"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="作业项目">
                <el-input v-model="form.workItem" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="违章人员">
                <el-select
                  v-model="person"
                  placeholder="请选择"
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in employees"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="`${item.name} ${item.employeeID}`"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="违章类别">
                <el-cascader
                v-model="type"
                :options="checkTypes"
                :show-all-levels="false"
                ref="dangerType"
                :props="{ expandTrigger: 'hover',value: 'factorCode',children: 'childNode',label:'name'}"
                :disable-branch-nodes='true'
                @change="handleChange"></el-cascader>
              </el-form-item>
              <el-form-item label="对应体系要素">
                <el-select
                  :disabled='isSelect2'
                  v-model="form.factorHSE"
                  placeholder="请选择违章类别"
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
                 :disabled='isSelect4'
                  v-model="form.factorObserver"
                  placeholder="请选择违章类别"
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
                :disabled='isSelect3'
                  v-model="form.factorSource"
                  placeholder="请选择违章类别"
                  
                  clearable
                  filterable
                  loading-text="查询中..."
                >
                  <el-option
                    v-for="item in factorSources"
                    :key="item.id"
                    :label="item.factorSourceName"
                    :value="item.factorSourceName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="归属部门">
                <el-select
                 :disabled='isSelect1'
                  v-model="form.factorDepartment"
                  placeholder="请选择违章类别"
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
              <el-form-item label="上传图片">
                <el-upload
                  action="/api/accident_upload"
                  :on-success="handleAvatarSuccess"
                  :headers="header"
                  :limit="4"
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
              <el-form-item label="所属专业" style="margin-top:1px">
                <el-input v-model="form.profession" placeholder="请填写" />
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
              <el-form-item label="扣分">
                <el-input v-model="form.score" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="罚款（元）" style="margin-top:1px">
                <el-input v-model="form.punish" placeholder="请填写" />
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
  QueryFactorDepartment,
  QueryfactorObserverCode,
  QueryFactorHseCode,
  QueryFactorReason,

} from '@/services/hidden_danger_investigation/regulationRecord'
import { GetEmployees } from '../../../services/employee'
import { GetDictionary } from '../../../services/dictionary'

export default {
  data() {
    return {
      form: {
        checkId: null,
        safeStaff_ID: '',
        workItem: '',
        companyId: '',
        description: '',
        consequenceID: '',
        type: '',
        ok:1,
        score:'',
        recordDate: '',
        factorSource: '',
        profession: '',
        factorHSE: '',
        factorDepartment: '',
        employeeCharacter: '',
        workSeniority: '',
        punish: '',
        factorObserver:'',
        RegulationCharacter:'',
        affix1:null,
        affix2:null,
        regulationSource: null,
        regulationID:null,
        regulationName:null
         /* qHSE_FileAudit_ID: '', 
        QHSE_FileAuditRecord_ID: '',
        code: '', 
        QHSE_CheckCategory: '' //后续判断之后填入
        */
      },
      adding: false,
      person: '',
      header: { Authorization: GetCurrentUser().token },
      companys: [], // 公司
      employees: [], // 员工
      employeeCharacters: [], // 用工性质
      workSeniorities: [], //工种年龄
      positions: [], //岗位分类
      checkTypes: [], //违章类别
      type:[],
      regulationCharacters: [], //违章性质
      factorHSEs: [], //对应体系要素
      factorObservers: [], //对应安全沟通类型
      factorSources: [], //原因
      factorDepartments: [], //归属部门
      consequences: [], //可能后果
      qHSE_FileAudit_ID: '', //文件审核id
      // 管理是否禁用
      isSelect1:true,
      isSelect2:true,
      isSelect3:true,
      isSelect4:true,
    }
  },
  created() {
    let _this = this
    _this.getSource()
    _this.getCompany()
    _this.getEmployees()
    _this.getEmployeeCharacters()
    _this.getPositions()
    _this.getWorkSeniorities()
    _this.getCheckTypes()
    _this.getRegulationCharacters()
    _this.getConsequences()
    _this.getrecordDate()
  },
  methods: {
    handleChange (value) {
      let code = value[value.length-1]
      let _this = this
       //查询归属职能部门
      QueryFactorDepartment(code).then(res => {
        _this.factorDepartments = res.data
        _this.form.factorDepartment = res.data[0].factorDepartmentName
        _this.isSelect1 = false
        _this.form.type = _this.$refs['dangerType'].inputValue
      }).catch(() => {
          this.$message.error('获取数据失败！')
        })
       // 查询对应体系要素
      QueryFactorHseCode(code).then(res => {
        _this.factorHSEs = res.data
        _this.form.factorHSE = res.data[0].factorHseName
        _this.isSelect2 = false
      }).catch(() => {
          this.$message.error('获取数据失败！')
        })
       // 查询原因
       QueryFactorReason(code).then(res => {
        _this.factorSources = res.data
        _this.form.factorSource = res.data[0].factorSourceName
        _this.isSelect3 = false
      }).catch(() => {
          this.$message.error('获取数据失败！')
        })
       // 查询安全沟通类型
       QueryfactorObserverCode(code).then(res => {
         _this.factorObservers = res.data
        _this.form.factorObserver = res.data[0].factorObserverName2
        _this.isSelect4 = false
         console.log(res)
       }).catch(() => {
          this.$message.error('获取数据失败！')
        })
    },
    getrecordDate(){
      let nowDate = new Date()
      let month  = Number(nowDate.getMonth() + 1)
      let date = Number(nowDate.getDate())
      if(month >= 10) {
        month = String(month)
      } else {
        month = String('0' + month)
      }
      if(date >= 10) {
        date = String(date)
      } else {
        date = String('0' + date)
      }
      this.form.recordDate = `${nowDate.getFullYear()}-${month}-${date}`
    },
    // 获取数据
    getCompany() {
      QuerCompany()
        .then(res => {
          this.companys = res.data
          console.log(this.companys)
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
    getConsequences() {
      GetDictionary({ name: '后果' })
        .then(res => {
          this.consequences = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    formatForm() {
      let info = this.person.split(' ')
      this.form.regulationName  = info[0]
      this.form.regulationID  = info[1]
    },
    getSource() {
      let source, _this = this
      _this.form.regulationSource = localStorage.getItem('regulationSource')
      source = _this.form.regulationSource
      if (source === '体系运行'){
      const initData = JSON.parse(localStorage.getItem('sourcedata'))
      _this.form.qHSE_FileAudit_ID = initData.qHSE_FileAudit_ID
      _this.form.QHSE_FileAuditRecord_ID = initData.qHSE_FileAuditRecord_ID
      _this.form.code = initData.code
      } else if (source === '隐患排查') {
      _this.form.QHSE_CheckCategory = _this.$route.params.type
      }
    },
    // 确认提交
    onSubmit() {
      let noFill = false
      let _this = this
      _this.form.safeStaff_ID = GetCurrentUser().employeeId   
      Object.keys(this.form).forEach((value) => {
        if( _this.form[value] === '' ){
           noFill = true
        }
      })
      if(noFill || this.person === '') {
        console.log(this.form)
         _this.$message.warning('请把表单填写完整！')
        return
      }
       _this.formatForm()
       _this.adding = true
      addRegulationRecord( _this.form)
        .then(res => {
          console.log(res)
           _this.$message.success(res.message)
           _this.adding = false
           _this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
           _this.$message.error(err.message)
            _this.adding = false
        })
    },

    // 一些事件
    changeCompany(value) {
      this.form.companyId = value[value.length - 1]
      console.log()
    },
    handleAvatarSuccess(res) {
      this.form.affixName = res.data
    }
  },
 beforeRouteEnter (to, from, next) {
    let fronRouter = from.name
    if(fronRouter === "QHSETroubleCheckTable" ){
      localStorage.setItem('regulationSource','隐患排查');
      next()
    } else if (fronRouter === "FileCheckIndex") {
      localStorage.setItem('regulationSource','体系运行');
      next()
    } else{
      next('/index')
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
