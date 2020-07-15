<template>
  <div>
    <div class="page-title">报告填写</div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="130px" :model="formData"  ref="formData" :rules="rules" >
          <el-row>
            <el-col :span="12">
              <el-form-item label="报告编号:"  >
                <el-select 
                clearable 
                v-model="formData.reportCode" 
                placeholder="报告编号" 
                filterable
                style="width: 80%;" 
                @change="onSelectReportCode">
                  <el-option
                    v-for="item in reportCodes"
                    :key="item.reportCode"
                    :label="item.reportCode"
                    :value="item.reportCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报告类别:"  >
                <el-input v-model="formData.reportType" placeholder="报告类别" style="width:80%" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>  
          <el-row>
            <el-col :span="12">
              <el-form-item label="检验负责人:" >
                <el-input v-model="formData.reportCheckPersonName" placeholder="检验负责人" style="width:80%" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="基层单位:" >
                <el-input v-model="formData.companyName" placeholder="基层单位" style="width:80%" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>  
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划时间:" >
                <el-input v-model="formData.reportPlanDate" placeholder="计划时间" style="width:80%" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>  
          <div v-for="(item, index) in formData.sampleDtoList" :key="index">    
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;">  </el-row>
            <el-row> 
              <el-col :span="12">
                <el-form-item label="样品名称:"  >
                  <el-input v-model="item.sampleName" placeholder="样品名称" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="样品编号:"  >
                  <el-input v-model="item.sampleNO" placeholder="样品编号" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row > 
              <el-col :span="12">
                <el-form-item label="样品型号:"  >
                  <el-input v-model="item.sampleModel" placeholder="样品型号" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品/出厂编号:"  >
                  <el-input v-model="item.sampleCode" placeholder="产品/出厂编号" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row> 
              <el-col :span="12">
                <el-form-item label="委托单位:"  >
                  <el-input v-model="item.entrustCompany" placeholder="委托单位" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生产/销售单位:"  >
                  <el-input v-model="item.productCompany" placeholder="生产/销售单位" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row> 
              <el-col :span="12">
                <el-form-item label="使用单位:"  >
                  <el-input v-model="item.customerCompany" placeholder="使用单位" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检测地点:"  >
                  <el-input v-model="item.checkAddress" placeholder="检测地点" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row> 
              <el-col :span="12">
                <el-form-item label="到样日期:" >
                  <el-date-picker
                    v-model="item.arriveDate" 
                    style="width: 80%;"   
                    type="date"
                    value-format="yyyy-MM-dd" 
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检测日期:" >
                  <el-date-picker
                    v-model="item.checkDate" 
                    style="width: 80%;"   
                    type="date"
                    value-format="yyyy-MM-dd" 
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row> 
              <el-col :span="12">
                <el-form-item label="检验检测项目:"  >
                  <el-input v-model="item.checkProject" placeholder="检验检测项目" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检验检测依据:"  >
                  <el-input v-model="item.checkGuist" placeholder="检验检测依据" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row> 
              <el-col :span="12">
                <el-form-item label="检验检测结果:"  >
                  <el-input v-model="item.checkResult" placeholder="检验检测结果" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检验检测人员:"  >
                  <el-input v-model="item.sampleCheckPersonName" placeholder="检验检测人员" style="width:80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="text-align:center">
              <el-button @click="deleteItem(item, index)" type="danger" icon="el-icon-remove-outline" style="border-radius: 30px" >删除样品信息</el-button>
            </el-row>
          </div>
          <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
            <el-button @click="addItem()" type="primary" icon="el-icon-circle-plus-outline" style="border-radius: 30px">增加样品信息</el-button>
          </el-row >
          <el-row style="padding:10px; border-top: 2px dashed #dddddd;"> </el-row>
          <el-row> 
            <el-col :span="12">
              <el-form-item label="审核人:" prop="auditorIDs">
                <el-select
                  v-model="formData.auditorIDs"
                  placeholder="输入姓名搜索审核人"
                  :filter-method="handleGetEmployee1"
                  multiple 
                  clearable
                  filterable
                  :loading="EmployeeLoading"
                  @change="auditorChange"
                  loading-text="查询中..."
                  style="width: 80%;"
                  >            
                  <el-option
                    v-for="item in Employees1"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核时间:" prop="auditorDate">
                <el-date-picker
                  v-model="formData.auditorDate" 
                  style="width: 80%;"   
                  type="date"
                  value-format="yyyy-MM-dd" 
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="批准人:" prop="approverIDs">
                <el-select
                  v-model="formData.approverIDs"
                  placeholder="输入姓名搜索批准人"
                  :filter-method="handleGetEmployee2"
                  multiple 
                  clearable
                  filterable
                  :loading="EmployeeLoading"
                  @change="approverChange"
                  loading-text="查询中..."
                  style="width: 80%;"
                  >            
                  <el-option
                    v-for="item in Employees2"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="批准时间:" prop="approverDate">
                <el-date-picker
                  v-model="formData.approverDate" 
                  style="width: 80%;"   
                  type="date"
                  value-format="yyyy-MM-dd" 
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
                <el-form-item label="归档日期:" >
                  <el-date-picker
                    v-model="formData.fileDate" 
                    style="width: 80%;"   
                    type="date"
                    value-format="yyyy-MM-dd" 
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发送日期:" >
                  <el-date-picker
                    v-model="formData.sendDate" 
                    style="width: 80%;"   
                    type="date"
                    value-format="yyyy-MM-dd" 
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row> 
            <el-col :span="12">
              <el-form-item label="报告份数:" prop="reportCount">
                <el-input v-model="formData.reportCount" placeholder="报告份数" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12">
                <el-form-item label="发送人:" >
                  <el-select
                    v-model="formData.senderID"
                    placeholder="输入姓名搜索发送人"
                    :filter-method="handleGetEmployee3"
                    clearable
                    filterable
                    :loading="EmployeeLoading"
                    loading-text="查询中..."
                    style="width: 80%;"
                    >            
                    <el-option
                      v-for="item in Employees3"
                      :key="item.employeeID"
                      :label="`${item.name}(${item.companyName})`"
                      :value="item.employeeID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="检验检测:"  >
                <el-input v-model="formData.seal1" placeholder="检验检测专用章" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资质认定（个）:"  >
                <el-input v-model="formData.seal2" placeholder="资质认定标识章（个）" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> 
            <el-col :span="12">
              <el-form-item label="互认标识（检测）:">
                <el-input v-model="formData.seal3" placeholder="ILAC-MRA/CNAS互认标识章（检测）" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="互认标识（校准）:">
                <el-input v-model="formData.seal5" placeholder="ILAC-MRA/CNAS互认标识章（校准）" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> 
            <el-col :span="12">
              <el-form-item label="认可标识（检测）:"  >
                <el-input v-model="formData.seal4" placeholder="CNAS认可标识章（检测）" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="认可标识（机构）:">
                <el-input v-model="formData.seal6" placeholder="CNAS认可标识章（检验机构）" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> 
            <el-col :span="12">
              <el-form-item label="其它标识请注明:"  >
                <el-input v-model="formData.note" placeholder="其它标识请注明" style="width:80%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="印章使用人:" prop="sealPersonID">
                <el-select
                  v-model="formData.sealPersonID"
                  placeholder="输入姓名搜索印章使用人"
                  :filter-method="handleGetEmployee4"
                  clearable
                  filterable
                  :loading="EmployeeLoading"
                  loading-text="查询中..."
                  style="width: 80%;"
                  >            
                  <el-option
                    v-for="item in Employees4"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> 
            <el-col :span="12">
              <el-form-item label="鉴印人:" prop="authID">
                <el-select
                  v-model="formData.authID"
                  placeholder="输入姓名搜索鉴印人"
                  :filter-method="handleGetEmployee5"
                  clearable
                  filterable
                  :loading="EmployeeLoading"
                  loading-text="查询中..."
                  style="width: 80%;"
                  >            
                  <el-option
                    v-for="item in Employees5"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="印章使用时间:" prop="sealDate">
                <el-date-picker
                  v-model="formData.sealDate" 
                  style="width: 80%;"   
                  type="date"
                  value-format="yyyy-MM-dd" 
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="text-align:center">
            <el-button type="primary" @click="handleSubmit('formData')" :disabled = Submitflag >确定提交</el-button>
          &nbsp; &nbsp;
            <a @click="$router.go(0)">  
              <el-button type="danger" native-type="button">取消填写</el-button>
            </a>
             <!-- &nbsp; &nbsp;
            <a @click="$router.go(-1)">  
              <el-button type="danger" native-type="button">返回前一页</el-button>
            </a> -->
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetCurrentUser } from '../../../store/CurrentUser'
import {GetCompany} from '../../../services/gettreedata'
import {GetEmployees} from '../../../services/employee'
import {CompleteReport,GetReportCodeList} from '../../../services/report_complete.js'
export default {
  data() {
    return {
      getCodeList:{
        companyCode:"",
        reportType:"",
        beginTime:"",
        endTime:"",
        state: "2"
      },
      reportCodeList:[],
      reportCodes:[],
      formData: { 
        reportID:null,  //报告ID
        companyName:'',  //基层单位名
        reportCode:'',  //报告编号
        reportType:'',  //报告类别，根据报告编号获取
        reportPlanDate:'', //报告计划时间
        reportCheckPersonName:'',  //检验负责人
        sampleDtoList: [],
        auditorIDs:[],
        approverIDs:[], 
        fileDate:'',
        senderID:null,
        sendDate:'',
        reportCount:0,  //报告份数
        seal1:0,  //检验检测专用章
        seal2:0,  //资质认定标识章（个）
        seal3:0,  //ILAC-MRA/CNAS互认标识章（检测）
        seal4:0,  //CNAS认可标识章（检测）
        seal5:0,  //ILAC-MRA/CNAS互认标识章（校准）
        seal6:0,  //CNAS认可标识章（检验机构） 
        note:'',  //其它标识请注明
        sealPersonID:null,  //印章使用人ID，来自employee表
        authID:null,  //鉴印人ID
        sealDate:''  //印章使用时间
      },
      Submitflag:true,
      EmployeeLoading:false,
      checkClassCodes:[],
      Employees1:[],
      Employees2:[],
      Employees3:[],
      Employees4:[],
      Employees5:[],
      options:[],
      rules:{
        auditorIDs :[{required: true, message: '请选择审核人', trigger: ['blur', 'change']}],
        auditorDate :[{required: true, message: '请选择审核时间',trigger: ['blur', 'change']}],
        approverIDs :[{required: true, message: '请选择批准人', trigger: ['blur', 'change']}],
        approverDate :[{required: true, message: '请选择批准时间',trigger: ['blur', 'change']}],
        reportCount :[{required: true, message: '请填写报告份数', trigger: ['blur', 'change'] }],
        sealPersonID :[{required: true, message: '请选择印章使用人', trigger: ['blur', 'change']}],
        authID :[{required: true, message: '请选择鉴印人', trigger: ['blur', 'change']}],
        sealDate :[{required: true, message: '请选择印章使用时间',trigger: ['blur', 'change']}],
      }
    }
  },
  mounted () {
    this.handleGetReportCodeList()
    if(this.$route.params.data){
      this.planToHere()
    }
    this.handleGetCompany()
    this.handleGetEmployee()
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    }
  },
  methods: {
    planToHere(){
      let data = this.$route.params.data
      this.formData.companyName=data.companyName
      this.formData.reportCheckPersonID=data.reportCheckPersonID
      this.formData.reportCheckPersonName=data.reportCheckPersonName
      this.formData.reportID=data.reportID
      this.formData.reportType=data.reportType
      this.formData.reportPlanDate=data.reportPlanDate
      this.formData.reportCode=data.reportCode
    },
    handleGetReportCodeList(){
      GetReportCodeList().then((res) => {
        this.reportCodeList = res.data
        this.reportCodeList.forEach((item) => {
          this.reportCodes.push({reportID:item.reportID,reportCode:item.reportCode})
        })
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    onSelectReportCode(selectValue){
      if(selectValue){
        let obj = {}
        obj = this.reportCodeList.find((item)=>{
          return item.reportCode === selectValue
        })
        this.formData.reportID = obj.reportID
        this.formData.companyName = obj.companyName
        this.formData.reportCheckPersonID=obj.reportCheckPersonID
        this.formData.reportCheckPersonName = obj.reportCheckPersonName
        this.formData.reportType = obj.reportType
        this.formData.reportPlanDate = obj.reportPlanDate
        // this.formData.reportPlanDate = new Date(parseInt(obj.reportPlanDate)).toLocaleDateString().replace(/\//g,'-')
        this.Submitflag=false
      }else{
        this.formData = {sampleDtoList: []}
      }
    },
    //获取人员
    handleGetEmployee(){
      this.handleGetEmployee1()
      this.handleGetEmployee2()
      this.handleGetEmployee3()
      this.handleGetEmployee4()
      this.handleGetEmployee5()
    },
    handleGetEmployee1 (val='') {
      this.EmployeeLoading = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.Employees1 = res.data
        this.EmployeeLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.EmployeeLoading = false
      })
    },
    auditorChange(selectValue){
      let n = selectValue.length
      if(n > 0){
        let obj1 = {}
        obj1 = selectValue.find((item)=>{
          return item === this.formData.reportCheckPersonID
        })
        let obj2 = false
        selectValue.forEach((item1) =>{
          if(this.formData.approverIDs){
            this.formData.approverIDs.forEach((item2)  => {
              if(item1 === item2){
                return obj2=true
              }
            })
          }
        })
        if(obj1 || obj2){
          this.$message({
            message: '检查负责人、审核人、批准人不能相同，请检查！',
            type: 'error',
            duration: 3000,
          })
        }
      }
    },
    handleGetEmployee2 (val='') {
      this.EmployeeLoading = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.Employees2 = res.data
        this.EmployeeLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.EmployeeLoading = false
      })
    },
    approverChange(selectValue){
      let n = selectValue.length
      if(n > 0){
        let obj1 = {}
        obj1 = selectValue.find((item)=>{
          return item === this.formData.reportCheckPersonID
        })
        let obj2 = false
        selectValue.forEach((item1) =>{
          if(this.formData.auditorIDs){
            this.formData.auditorIDs.forEach((item2)  => {
              if(item1 === item2){
                return obj2=true
              }
            })
          }
        })
        if(obj1 || obj2){
          this.$message({
            message: '检查负责人、审核人、批准人不能相同，请检查！',
            type: 'error',
            duration: 3000,
          })
        }
      }
    },
    handleGetEmployee3 (val='') {
      this.EmployeeLoading = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.Employees3 = res.data
        this.EmployeeLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.EmployeeLoading = false
      })
    },
    handleGetEmployee4 (val='') {
      this.EmployeeLoading = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.Employees4 = res.data
        this.EmployeeLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.EmployeeLoading = false
      })
    },
    handleGetEmployee5 (val='') {
      this.EmployeeLoading = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.Employees5 = res.data
        this.EmployeeLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.EmployeeLoading = false
      })
    },
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    handleSubmit (formName) {
      this.formData.auditorIDs = JSON.stringify(this.formData.auditorIDs).substring(1,JSON.stringify(this.formData.auditorIDs).length-1)
      this.formData.approverIDs = JSON.stringify(this.formData.approverIDs).substring(1,JSON.stringify(this.formData.approverIDs).length-1)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          CompleteReport(this.formData).then(() => {
            this.$message.success('创建成功')
            this.Submitflag=true
          }).catch((err) => {
            this.$message.error(err.message)
          })
        } else {
          this.$notify.warning({
            title: '温馨提示',
            message: '请检查必填项'
          })
          return false;
        }
      });
      this.reportCodes = []
      this.reportCodeList = []
      this.handleGetReportCodeList()
    },
    addItem () {
      this.Submitflag = false
      if(this.formData.reportID){
        let len = this.formData.sampleDtoList.length
        let sampleNO = this.formData.reportCode
        sampleNO = sampleNO.replace("BG","YP")
        if(len != 0){
          // this.formData.sampleDtoList.push(this.formData.sampleDtoList[len-1])
          // 出现了浅拷贝的错误
          let sampleDtoList=JSON.parse(JSON.stringify(this.formData.sampleDtoList[len-1]))    
          sampleDtoList.sampleNO = sampleNO +"-" + (len + 1)    
          this.formData.sampleDtoList.push(sampleDtoList)
        }else{
          this.formData.sampleDtoList.push({sampleCheckPersonName:this.formData.reportCheckPersonName,
                                            sampleNO: sampleNO +"-" + 1})
        }
      }else{
        this.$notify.warning({
          title: '温馨提示',
          message: '请先选择报告，再增加样品！'
        })
      }
    },
    deleteItem (item, index) {
      this.Submitflag = true
      this.formData.sampleDtoList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 1200px;
}
.avatar-uploader .el-upload {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.video-avatar {
  width: 400px;
  height: 200px;
}
</style>
