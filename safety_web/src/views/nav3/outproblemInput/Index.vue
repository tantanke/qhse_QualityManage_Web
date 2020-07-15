<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">问题录入
        <!-- <el-breadcrumb-item><a @click="$router.go(-1)">问题管理</a></el-breadcrumb-item> -->
        
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="130px" :model="formData"  ref="formData" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="记录编号：" >
              <el-input v-model="formData.recordCode" placeholder="记录编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监督检查类别："  >
              <el-select 
              clearable 
              v-model="formData.checkClass" 
              placeholder="事故类别" 
              style="width: 100%;" 
              @change="onSelectedcheckClass">
              <el-option
                v-for="item in checkClassCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
          </el-col>
        </el-row>      
        <el-row> 
        <el-col :span="12">
          <el-form-item label="监督检查人员："  >
            <el-select
              v-model="formData.checkPersonID"
              placeholder="输入姓名搜索监督检查人员"
              :filter-method="handleLeaderSearch1"
              clearable
              filterable
              :loading="leaderLoading1"
              loading-text="查询中..."
              style="width: 100%;"
              >            
              <el-option
                v-for="item in leaders1"
                :key="item.employeeID"
                :label="`${item.name}(${item.companyName})`"
                :value="item.employeeID">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称：" >
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="客户名称"
              v-model="formData.companyCode"
              style="width:270px;margin-left:0px"
              /> 
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
            <el-form-item label="检查项目:" >
              <el-select 
              clearable 
              v-model="formData.checkItem" 
              placeholder="检查项目" 
              style="width: 100%;" 
              @change="onSelectedcheckItem">
              <el-option
                v-for="item in checkItemCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检查专业："  >
              <el-select 
              clearable 
              v-model="formData.profession" 
              placeholder="检查专业" 
              style="width: 100%;" 
              @change="onSelectedprofessionCode">
              <el-option
                v-for="item in professionCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="作业地点：" >
            <el-input v-model="formData.address" placeholder="作业地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业人员："  >
            <el-select
              v-model="formData.operatePersonID"
              placeholder="输入姓名搜索作业人员"
              :filter-method="handleLeaderSearch2"
              clearable
              filterable
              :loading="leaderLoading2"
              loading-text="查询中..."
              style="width: 100%;"
              >            
              <el-option
                v-for="item in leaders2"
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
          <el-form-item label="作业人员类别："  >
              <el-select 
              clearable 
              v-model="formData.operatePersonClass" 
              placeholder="作业人员类别" 
              style="width: 100%;" 
              @change="onSelectedoperatePersonClassCode">
              <el-option
                v-for="item in operatePersonClassCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监督检查时间：" >
              <el-date-picker
                v-model="formData.checkDate" 
                style="width: 100%;"   
                type="datetime"
                :picker-options="pickerOptions0"
                value-format="yyyy-MM-dd HH:mm:ss" 
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>  
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="责任人员："  >
            <el-select
              v-model="formData.responsePersonID"
              placeholder="输入姓名搜索责任人员"
              :filter-method="handleLeaderSearch3"
              clearable
              filterable
              :loading="leaderLoading3"
              loading-text="查询中..."
              style="width: 100%;"
              >            
              <el-option
                v-for="item in leaders3"
                :key="item.employeeID"
                :label="`${item.name}(${item.companyName})`"
                :value="item.employeeID">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="不符合标准文件："  >
            <el-select 
              clearable 
              v-model="formData.isConformRuleName" 
              placeholder="不符合性质" 
              style="width: 100%;" 
              @change="onSelectedisConformRuleCode">
              <el-option
                v-for="item in isConformRuleCodes"
                :key="item.regNameCode"
                :label="item.regName"
                :value="item.regName">
              </el-option>
              </el-select>
          </el-form-item>
           <!-- <el-form-item label="不符合标准文件：" prop="isConformRuleCode">
            <el-input v-model="formData.isConformRuleCode" placeholder="不符合标准文件"></el-input>
          </el-form-item> -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="不符合性质："  >
              <el-select 
              clearable 
              v-model="formData.isConformRuleRank" 
              placeholder="不符合性质" 
              style="width: 100%;" 
              @change="onSelectedisConformRuleRankCode">
              <el-option
                v-for="item in isConformRuleRankCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="违章性质："  >
              <el-select 
              clearable 
              v-model="formData.breakRuleRank" 
              placeholder="违章性质" 
              style="width: 100%;" 
              @change="onSelectedbreakRuleRankCode">
              <el-option
                v-for="item in breakRuleRankCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="违章条款："  >
              <el-select 
              clearable 
              v-model="formData.breakRuleItem" 
              placeholder="违章条款" 
              style="width: 100%;" 
              @change="onSelectedbreakRuleItemCode">
              <el-option
                v-for="item in breakRuleItemCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣款：">
            <el-input v-model="formData.penalty" placeholder="扣款"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="扣分：" >
            <el-input v-model="formData.lostScore" placeholder="扣分"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="不符合类型："  >
              <el-select 
              clearable 
              v-model="formData.isConformRuleClass" 
              placeholder="不符合类型" 
              style="width: 100%;" 
              @change="onSelectedisConformRuleClassCode">
              <el-option
                v-for="item in isConformRuleClassCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="不符合事实描述：" >
            <el-input   type="textarea" :autosize="{ minRows: 4}" v-model="formData.isConformDescription" placeholder="不符合事实描述"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录点："  >
              <el-select 
              clearable 
              v-model="formData.problemKey" 
              placeholder="记录点" 
              style="width: 100%;" 
              @change="onSelectedproblemKeyCode">
              <el-option
                v-for="item in problemKeyCodes"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
           <el-form-item label="问题层级：" >
              <treeselect
              :multiple="false"
              :options="options1"
              placeholder="问题层级"
              v-model="formData.problemLevelCode"
              style="width:270px;margin-left:0px"
              /> 

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任部门：" >
              <treeselect
              :multiple="false"
              :options="options2"
              placeholder="责任部门"
              v-model="formData.responseDepartmentCode"
              style="width:270px;margin-left:0px"
              /> 
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="限定整改时间：" >
              <el-date-picker
                v-model="formData.limtRectDate" 
                style="width: 100%;"   
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss" 
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>  
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注：" >
            <el-input  type="textarea" :autosize="{ minRows: 4}" v-model="formData.remarks" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
             <el-col :span="12">
               <el-form-item label="图片附件1：" >
                 <el-upload
                v-model="formData.checkAttach1"
                :action="`/api/file_upload`"
                list-type="picture"
                :limit="1"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove1"
                :before-upload="handleBeforeUpload"
                :file-list="fileList1"
                :auto-upload='true'
                :headers="{Authorization:currentUser.token}"
                name="file"
                :on-success="handleSuccess1"
                style="width:100%"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
            </el-upload>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="图片附件2：">
                 <el-upload
                 v-model="formData.checkAttach2"
                  :action="`/api/file_upload`"
                  list-type="picture"
                  :limit="1"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove2"
                  :before-upload="handleBeforeUpload"
                  :file-list="fileList2"
                  :auto-upload='true'
                  :headers="{Authorization:currentUser.token}"
                  name="file"
                  :on-success="handleSuccess2"
                  style="width:100%"
                  >
                  <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
                </el-upload>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="12">
               <el-form-item label="图片附件3：">
              <el-upload
              v-model="formData.checkAttach3"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove3"
              :before-upload="handleBeforeUpload"
              :file-list="fileList3"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess3"
              style="width:100%"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
            </el-upload>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="图片附件4：">
                 <el-upload
                  v-model="formData.checkAttach4"
                  :action="`/api/file_upload`"
                  list-type="picture"
                  :limit="1"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove4"
                  :before-upload="handleBeforeUpload"
                  :file-list="fileList4"
                  :auto-upload='true'
                  :headers="{Authorization:currentUser.token}"
                  name="file"
                  :on-success="handleSuccess4"
                  style="width:100%"
                  >
                  <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
                </el-upload>
               </el-form-item>
             </el-col>
           </el-row>
             <el-form-item>
          <!-- <el-button type="primary" @click="handleupdate()" :disabled = !Submitflag>新建</el-button> -->
          &nbsp; &nbsp; &nbsp; 
            <el-button type="primary" @click="handleSubmit('formData')" :disabled = Submitflag>确定</el-button>
            &nbsp; &nbsp; &nbsp; 
              <a @click="$router.go(-1)">  
              <el-button native-type="button">取消</el-button>
            </a>
        </el-form-item>
      
      
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetCurrentUser } from '../../../store/CurrentUser';
// import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import {GetDictionary} from '../../../services/dictionary'
import {GetEmployees} from '../../../services/employee'
import {CreateProblem,regulation} from '../../../services/ProblemInput.js'
export default {
  data() {
    return {
        pickerOptions0:{
					disabledDate(time){
						return time.getTime() > Date.now()- 8.64e6;
					}
        },
      formData: { 
        recordCode:'',
        checkClass:'',
        checkClassCode:'',//监督检查类别
        checkPersonID:'',//监督检查任意人员
        companyCode:null,//客户名称
        checkItem:'',
        checkItemCode:'',//检验项目
        profession:'',
        professionCode:'',//专业
        address:'',//作业地点
        operatePersonID:'',//作业人员
        operatePersonClass:'',
        operatePersonClassCode:'',//作业人员类别
        checkDate:'',//监督检查时间
        responsePersonID:'',//责任人员
        isConformRuleName:'',
        isConformRuleCode:'',//不符合标准文件
        isConformRuleRank:'',
        isConformRuleRankCode:'',//不符合性质
        breakRuleRank:'',
        breakRuleRankCode:'',//违章性质
        breakRuleItem:'',
        breakRuleItemCode:'',//违章条款
        penalty:'',//扣款
        lostScore:'',//扣分
        isConformRuleClass:'',
        isConformRuleClassCode:'',//不符合类型
        isConformDescription:'',//不符合事实描述
        problemKeyCode:'',//问题点
        checkAttach1: "", //附件1234   
        checkAttach2: "", //附件1234      
        checkAttach3: "", //附件1234   
        checkAttach4: "" ,//附件1234
        problemLevelCode:null,//问题层级编码
        problemLevel:"",//问题层级名称
        responseDepartmentCode:null,//责任部门
        limtRectDate:'',//整改时限
        remarks:''//备注

      },
      Submitflag:false,
      leaderLoading1:false,
      leaderLoading2:false,
      leaderLoading3:false,
      checkClassCodes:[],
      leaders1:[],
      leaders2:[],
      leaders3:[],
      rules:[],
      options:[],
      checkItemCodes:[],
      professionCodes:[],
      operatePersonClassCodes:[],
      isConformRuleRankCodes:[],
      breakRuleRankCodes:[],
      breakRuleItemCodes:[],
      isConformRuleClassCodes:[],
      problemKeyCodes:[],
      options2:[],
      options1:[
        {
          "id":"00",
          "nodecode":"00",
          "label":"问题层级",
          "children":[
            {
              "id":"0001",
              "nodecode":"0001",
              "label":"管理",
              "children":[
                {
                  "id":"000101",
                  "nodecode":"000101",
                  "label":"院级"
                },
                {
                  "id":"000102",
                  "nodecode":"000102",
                  "label":"基层单位"
                },
                {
                  "id":"000103",
                  "nodecode":"000103",
                  "label":"组室"
                },
                {
                  "id":"000104",
                  "nodecode":"000104",
                  "label":"项目组"
                }
              ]
            },
            {
              "id":"0002",
              "nodecode":"0002",
              "label":"岗位"
            }
          ]
        }
      ],
      fileList1:[],//图片附件1
      fileList2:[],//图片附件2
      fileList3:[],//图片附件3
      fileList4:[],//图片附件4
      options11:[],
      isConformRuleCodes:[]
    }
  },
  mounted () {
    this.getcheckClass()//获取监督检查类别
    this.handleLeaderSearch1()//获取监督人员
    this.handleGetCompany()//获取客户名称
    this.getcheckItem()//获取检验项目
    this.getprofession()//获取专业
    this.handleLeaderSearch2()//获取作业人员
    this.getoperatePersonClass()//获取作业人员类别
    this.handleLeaderSearch3()//获取责任人员
    this.getisConformRuleRankCode()//获取不符合性质
    this.getbreakRuleRankCode()//获取违章性质
    this.getbreakRuleItem()//获取违章条款
    this.getisConformRuleClass()//获取不符合类型
    this.getproblemKey()//获取问题点
    this.getisConformRuleCode()//获取不标准文件

  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    }


  },
  methods: {
    //获取监督检查类别
    getcheckClass() {
      GetDictionary({name: '监督检查类别'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.checkClassCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //监督检查类别编码
    onSelectedcheckClass(selectValue){
      console.log(JSON.stringify(selectValue))
      let obj = {}
      //遍历下拉数组中的item
      obj = this.checkClassCodes.find((item)=>{
        return item.name === selectValue
      })
      this.formData.checkClassCode = obj.dictCode    
      // console.log(this.formData.accidentClassCode)
    },
    //获取监督检查人员
    handleLeaderSearch1 (val='') {
      this.leaderLoading1 = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.leaders1 = res.data
        // alert(JSON.stringify(this.leaders))
        this.leaderLoading1 = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading1 = false
      })
    },
    //获取作业人员
    handleLeaderSearch2 (val='') {
      this.leaderLoading2 = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.leaders2 = res.data
        // alert(JSON.stringify(this.leaders))
        this.leaderLoading2 = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading2 = false
      })
    },
    //获取责任人员
    handleLeaderSearch3 (val='') {
      this.leaderLoading3 = true
      GetEmployees({name: val, type: "all"}).then((res) => {
        this.leaders3 = res.data
        // alert(JSON.stringify(this.leaders))
        this.leaderLoading3 = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading3 = false
      })
    },

    //获取客户名称
    handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data
        this.options2 = res.data
        // console.log(JSON.stringify(this.options))  
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取不标准文件名
    getisConformRuleCode(){
       regulation().then((res) => {
        this.isConformRuleCodes= res.data
        // console.log("不标准文件名：")  
        // console.log(JSON.stringify(res.data))  
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取不标准文件名编码
    onSelectedisConformRuleCode(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.isConformRuleCodes.find((item)=>{
        return item.regName === selectValue
      })
      this.formData.isConformRuleCode = obj.regNameCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.isConformRuleCode)
      // console.log(this.formData.isConformRuleName)
    },
    //获取检验项目
    getcheckItem() {
      GetDictionary({name: '检验项目'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.checkItemCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取检验项目编码
    onSelectedcheckItem(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.checkItemCodes.find((item)=>{
        return item.name === selectValue
      })
      this.formData.checkItemCode = obj.dictCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.accidentClassCode)
    },
    //获取专业
    getprofession() {
      GetDictionary({name: '检查专业'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.professionCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取专业编码
    onSelectedprofessionCode(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.professionCodes.find((item)=>{
        return item.name === selectValue
      })
      this.formData.professionCode = obj.dictCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.accidentClassCode)
    },
    //获取作业人员类别
    getoperatePersonClass() {
      GetDictionary({name: '作业人员类别'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.operatePersonClassCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取作业人员类别编码
    onSelectedoperatePersonClassCode(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.operatePersonClassCodes.find((item)=>{
        return item.name === selectValue
      })
      this.formData.operatePersonClassCode = obj.dictCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.accidentClassCode)
    },
    //获取不符合性质
    getisConformRuleRankCode() {
      GetDictionary({name: '不符合性质'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.isConformRuleRankCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取不符合性质编码
    onSelectedisConformRuleRankCode(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.isConformRuleRankCodes.find((item)=>{
        return item.name === selectValue
      })
      this.formData.isConformRuleRankCode = obj.dictCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.accidentClassCode)
    },
       //获取违章性质
    getbreakRuleRankCode() {
      GetDictionary({name: '违章性质'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.breakRuleRankCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取违章性质编码
    onSelectedbreakRuleRankCode(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.breakRuleRankCodes.find((item)=>{
        return item.name=== selectValue
      })
      this.formData.breakRuleRankCode = obj.dictCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.accidentClassCode)
    },
    //获取违章条款
    getbreakRuleItem() {
      GetDictionary({name: '违章条款'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.breakRuleItemCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取违章条款编码
    onSelectedbreakRuleItemCode(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.breakRuleItemCodes.find((item)=>{
        return item.name === selectValue
      })
      this.formData.breakRuleItemCode = obj.dictCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.accidentClassCode)
    },
    //获取不符合类型
    getisConformRuleClass() {
      GetDictionary({name: '不符合类型'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.isConformRuleClassCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取不符合类型编码
    onSelectedisConformRuleClassCode(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.isConformRuleClassCodes.find((item)=>{
        return item.name === selectValue
      })
      this.formData.isConformRuleClassCode = obj.dictCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.accidentClassCode)
    },
    //获取问题点
    getproblemKey() {
      GetDictionary({name: '问题点'}).then((res) => {
        // console.log(JSON.stringify(res))
        this.problemKeyCodes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取问题点编码
    onSelectedproblemKeyCode(selectValue){
      let obj = {}
      //遍历下拉数组中的item
      obj = this.problemKeyCodes.find((item)=>{
        return item.name === selectValue
      })
      this.formData.problemKeyCode = obj.dictCode   
      // alert(this.formData.accidentClassCode)  
      // console.log(this.formData.accidentClassCode)
    },
    
    // 图片处理
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
    },
    //删除图片
    handleRemove1() {
        this.formData.checkAttach1=null;
      },
    handleRemove2() {
        this.formData.checkAttach2=null;
      },
    handleRemove3() {
        this.formData.checkAttach3=null;
      },
    handleRemove4() {
        this.formData.checkAttach4=null;
      },
    //上传图片之前
    handleBeforeUpload(file){
      const isJPG =(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg');
      const isLt2M = file.size / 1024 / 1024 < 12;
      if(!isJPG){
        this.$message.error('请检查图片格式!');
      }
      if(!isLt2M) {
        this.$message.error('上传图片大小不能超过 12MB!');
      }
      return isJPG && isLt2M;
    },
    //成功上传图片
    handleSuccess1(response){
     console.log(response)
      this.formData.checkAttach1 = response.data
      console.log(this.formData.checkAttach1)
    },
    handleSuccess2(response){
       console.log(response)
      this.formData.checkAttach2 = response.data
      // alert(this.formData.checkAttach2)
    },
    handleSuccess3(response){
       console.log(response)
      this.formData.checkAttach3 = response.data
      //  alert(this.formData.checkAttach3)
    },
    handleSuccess4(response){
      console.log(response)
      this.formData.checkAttach4 = response.data
      // alert(this.formData.checkAttach4)
    },

    handleupdate(){
      this.formData.description = ""
      this.formData.problemDescriptionCode = ""
      this.Submitflag=!this.Submitflag
    },
    //提交表单
      handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.formData.problemLevelCode=="00"){
              this.formData.problemLevel="问题层级"
            }
            if(this.formData.problemLevelCode=="0001"){
              this.formData.problemLevel="管理"
            }
            if(this.formData.problemLevelCode=="000101"){
              this.formData.problemLevel="院级"
            }
            if(this.formData.problemLevelCode=="000102"){
              this.formData.problemLevel="基层单位"
            }
            if(this.formData.problemLevelCode=="000103"){
              this.formData.problemLevel="组室"
            }
            if(this.formData.problemLevelCode=="000104"){
              this.formData.problemLevel="项目组"
            }
            if(this.formData.problemLevelCode=="0002"){
              this.formData.problemLevel="岗位"
            }

             console.log(JSON.stringify(this.formData)) 
            //alert(JSON.stringify(this.formData))
          CreateProblem(this.formData).then(() => {
        //  alert(JSON.stringify(this.formData))
        this.$message.success('创建成功')
        this.formData.checkAttach1=null
        this.formData.checkAttach2=null
        this.formData.checkAttach3=null
        this.formData.checkAttach4=null
        this.Submitflag=!this.Submitflag
      }).catch((err) => {
        this.$message.error(err.message)
      })
          } else {
            this.$notify.warning({
              title: '温馨提示',
              message: '请检查必填项'
            })
            console.log('error submit!!');
            return false;
          }
        });

     
    },






   
}
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 800px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
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
