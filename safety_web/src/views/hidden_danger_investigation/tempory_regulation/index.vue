<template>
  <div style="overflow:hidden">
    <div class="page-title">临时-违章录入</div>
    <div class="page-content" v-loading='adding' >
      <el-row>
        <el-form ref="form" :rules='regulationRule' :model="form" label-width="150px" label-suffix="：">
          <el-row>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="施工队伍" prop='companyId'>
                <el-cascader
                  v-model="form.companyId"
                  :options="companys"
                  ref='companyChoose'
                  :props="{value: 'nodeCode',expandTrigger: 'hover'}"
                  @change="changeCompany"
                  :show-all-levels="false"
                />
              </el-form-item>
              <el-form-item label="检查时间" prop='supervisionDate'>
                <el-date-picker
                  v-model="form.supervisionDate"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="作业项目" prop='workItem'>
                <el-input v-model="form.workItem" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="违章人员" prop='person'>
                <el-select
                  v-model="form.person"
                  placeholder="请选择"
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
              <el-form-item label="违章类别" prop='types'>
                <el-cascader
                v-model="form.types"
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
                  :placeholder="factorPlaceholder"
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
              <el-form-item label="可能后果" prop='consequenceID'>
                <el-select
                  v-model="form.consequenceID"
                  placeholder="请选择"
                  filterable
                  loading-text="查询中..."
                  ref="consequence"
                >
                  <el-option
                    v-for="item in consequences"
                    :key="item.dictCode"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="违章图片上传">
                <el-upload
                  action="/api/uploadScreenShot"
                  :on-success="handleAvatarSuccess"
                  :headers="header"
                  :limit="2"             
                  :on-exceed="handleExceed"
                   accept=".jpg, .png, .bmp"
                >
                <el-button type="primary" icon="el-icon-upload">浏览文件</el-button>
                <span> 最多两张，格式为jpg,png,bmp</span>
                </el-upload>
              </el-form-item>
              <br />
              
            </el-col>
            <el-col :xl="8" :lg="10" :sm="12">
              <el-form-item label="用工性质" prop='employeeCharacter'>
                <el-select
                  v-model="form.employeeCharacter"
                  placeholder="请选择"
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
              <el-form-item label="工种年龄" prop='workSeniority'>
                <el-select
                  v-model="form.workSeniority"
                  placeholder="请选择"
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
              <el-form-item label="所属专业" style="margin-top:1px" prop='profession'>
                <el-input v-model="form.profession" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="岗位分类" prop='position'>
                <el-select
                  v-model="form.position"
                  placeholder="请选择"
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
              <el-form-item label="违章性质" prop='regulationCharacter'>
                <el-select
                  v-model="form.regulationCharacter"
                  placeholder="请选择"
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
              <el-form-item label="违章描述" prop='description'>
                <el-input type="textarea" v-model="form.description" :rows="6" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="扣分" prop='score'>
                <el-input v-model="form.score" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="扣除绩效" style="margin-top:1px"  prop='punish'>
                <el-input v-model="form.punish" placeholder="请填写" />
              </el-form-item>
              <el-form-item  label="操作">
                <el-button type="primary" style="width:100px" @click="onSubmit" icon="el-icon-check">确认</el-button>
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
        consequence:null,
        type: '',
        ok:1,
        position:'',
        score:'',
        recordDate: '',
        factorSource: null,
        profession: '',
        factorHSE: null,
        factorDepartment: null,
        employeeCharacter: '',
        workSeniority: '',
        punish: '',
        factorObserver:null,
        regulationCharacter:'',
        affix1:null,
        affix2:null,
        regulationSource: '临时录入',
        regulationID:null,
        regulationName:null
      },
      factorPlaceholder:'请选择违章类别',
      moreForm:{},
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
      fileNum:0,
      regulationRule:{
					companyId:[{
						required: 'true',
						message: '请选择公司',
						trigger: 'change'
					}],
          supervisionDate:[{
						required: 'true',
						message: '请选择检查时间',
						trigger: 'change'
					}],
          workItem:[{
						required: 'true',
						message: '请选择作业项目',
						trigger: 'change'
					}],
          location:[{
						required: 'true',
						message: '请选择位置区域',
						trigger: 'change'
					}],
          types:[{
						required: 'true',
						message: '请选择违章类别',
						trigger: 'change'
					}],
          person:[{
						required: 'true',
						message: '请选择违章人员',
						trigger: 'change'
					}],
          consequenceID:[{
						required: 'true',
						message: '请填写可能后果',
						trigger: 'change'
					}],
          profession:[{
						required: 'true',
						message: '请选择所属专业',
						trigger: 'change'
					}],
          employeeCharacter:[{
						required: 'true',
						message: '请选择用工性质',
						trigger: 'change'
					}],
          rank:[{
						required: 'true',
						message: '请选择隐患级别',
						trigger: 'change'
					}],
          workSeniority:[{
						required: 'true',
						message: '请选择隐患描述',
						trigger: 'change'
					}],     
          position:[{
						required: 'true',
						message: '请选择岗位分类',
						trigger: 'change'
					}],
          regulationCharacter:[{
						required: 'true',
						message: '请选择违章性质',
						trigger: 'change'
					}],
          description:[{
						required: 'true',
						message: '请填写违章描述',
						trigger: 'change'
					}],
          score:[{
						required: 'true',
						message: '请填写违章描述',
						trigger: 'change'
					}],
          punish:[{
						required: 'true',
						message: '请填写违章描述',
						trigger: 'change'
					}],
				},
    }
  },
  created() {
    let _this = this
    _this.getCompany()
    _this.getEmployees()
    _this.getEmployeeCharacters()
    _this.getPositions()
    _this.getWorkSeniorities()
    _this.getCheckTypes()
    _this.getRegulationCharacters()
    _this.getConsequences()
    _this.getrecordDate()
    this.moreForm = {...this.form}
  },
  methods: {
    // 给附件命名
    handleAvatarSuccess(res) {
      this.fileNum++
      let key = 'affix' + this.fileNum
      this.form[key] = res.data
    },
    // 限制文件数量
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    handleChange (value) {
      let code = value[value.length-1]
      let _this = this
       //查询归属职能部门
       _this.factorDepartments = []
       _this.factorSources = []
        _this.factorHSEs = []
        _this.factorObservers = []
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
       }).catch(() => {
         _this.form.factorObserver = null
         _this.isSelect4 = true
         _this.factorPlaceholder = '无'
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
      let info = this.form.person.split(' ')
      this.form.regulationName  = info[0]
      this.form.regulationID  = info[1]
      this.form.consequence = this.$refs.consequence.query
      this.form.safeStaff_ID = GetCurrentUser().employeeId  
    },
    deleteLocal() {
      // 去除本地数据
       localStorage.moveItem('checkType')
       localStorage.moveItem('sourcedata')
       localStorage.moveItem('regulationSource')
    },
    // 确认提交
    onSubmit() {
      let _this = this
      this.$refs.form.validate((valid) => {
        
				if(valid){
          _this.adding = true
          _this.formatForm()
          delete _this.form.person
          delete _this.form.types
      addRegulationRecord(_this.form)
        .then(res => {
         _this.adding = false
         _this.$refs.form.resetFields();
          _this.$message.success(res.message)
        })
        .catch(err => {
          _this.adding = false
          _this.$message.error(err.message)
        })
        } else{
          _this.$message.warning('请把表单填写完整！')
        }
				})
    },
    resetForm(){
        this.form = {...this.moreForm}
        this.form.types = ''
        this.form.person = ''
    },
    // 一些事件
    changeCompany(value) {
      this.form.companyId = value[value.length - 1]
      console.log()
    },
  },
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
