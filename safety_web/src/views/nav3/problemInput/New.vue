<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">计划内问题录入
        <!-- <el-breadcrumb-item><a @click="$router.go(-1)">问题管理</a></el-breadcrumb-item> -->
      </el-breadcrumb>
      
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="120px" :model="formData"  ref="formData" :rules="rules">
        <el-row>
         <el-col :span="12">
            <div class="grid-content bg-purple">
             <el-form-item label="计划名称：" prop="planID">
            <el-select
              v-model="formData.planID"
              placeholder="输入计划名搜索"
              :filter-method="handleTaskSearch"
              clearable
              filterable
              :loading="taskLoading"
              loading-text="查询中..."
              style="width: 90%;"
              @change="onSelectedTask"
            >
              <el-option
                v-for="item in tasks"
                :key="item.planID"
                :label="`${item.taskName}(${item.companyName}) `"
                :value="item.planID">
              </el-option>
            </el-select>
            </el-form-item>
          </div>
         </el-col>        
          <el-col :span="12">
           <div class="grid-content bg-purple">
            <el-form-item label="检查级别：" prop="checkRank">
              <el-input  style="width: 100%;" v-model="formData.checkRank" placeholder="获取检查级别"  readonly></el-input>
            </el-form-item>
           </div>
          </el-col>
        </el-row>
        <el-row>         
         <el-col :span="12">
              <el-form-item label="检查日期：" prop="checkDate">
                 <el-date-picker
                  v-model="formData.checkDate" style="width: 90%;"   type="datetime"
                  :picker-options="pickerOptions0"
                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期">
                 </el-date-picker>
              </el-form-item>                  
         </el-col>
         <el-col :span="12">
         <div class="grid-content bg-purple">
                <el-form-item label="检查人员：" prop="checkPersonID" >
                  <el-select
                    v-model="formData.checkPersonID"
                    placeholder="输入姓名搜索检查人员"
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
            </div>
            </el-col>
        </el-row>
        <el-row>
         <el-col :span="12">
           <div class="grid-content bg-purple">
            <el-form-item label="受检单位：" prop="companyCode">
              <el-select
                    v-model="formData.companyCode"
                    placeholder="选择受检单位"
                    clearable
                    style="width: 90%;"
                   >
                   <el-option
                    v-for="item in options"
                    :key="item.companyCode"
                    :label="`${item.name}`"
                    :value="item.companyCode">
                   </el-option>
               </el-select>
            </el-form-item>
           </div>
          </el-col>
          <el-col :span="12">
              <el-form-item label="检查项：" prop="checkItemCode">
              <treeselect
              :multiple="false"
              :options="checkItem"
              placeholder="选择底层数据"
              :disable-branch-nodes="true"
              v-model="formData.checkItemCode"
              style="width:280px;margin-left:0px"
              /> 
            </el-form-item>
         </el-col>
        </el-row>
        
        <!-- <el-row>
          <el-col :span="12">
            <el-tabs v-model="formData.radio2" @tab-click="change" style="margin-left:30px">    
              <el-tab-pane  name="first" >
                 <span slot="label"><i class="el-icon-success"></i> 问题单位</span>
                 <el-form-item label="问题单位：" prop="problemCompanyCode" style="margin-left:-30px">
                  <el-cascader
                    placeholder="问题所在单位"
                    :v-model="formData.problemCompanyCode"
                    :options="options11"
                    :props="props"
                    :show-all-levels="false"
                    clearable
                    filterable
                    style="width: 90%;"
                    @change="onSelectedproblemCompany"
                    >
                  </el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane  name="second">
                <span slot="label"><i class="el-icon-success"></i> 承包商</span>
                <el-form-item label="承包商：" style="margin-left:-30px">
                  <el-select  
                  v-model="formData.contractor" 
                  placeholder="输入承包商" 
                  style="width: 90%;"
                  clearable   
                  filterable
                  :loading="leaderLoading4"
                  :filter-method="handleLeadercontractor"
                  @change="onSelectedproblemCompany1" 
                  >
                  <el-option
                    v-for="item in contractors"
                    :key="item.companyCode"
                    :label="item.name"
                    :value="item.companyCode">
                    </el-option>
                  </el-select>
                   <el-button type="primary" icon="el-icon-plus" circle size="mini"></el-button>
                </el-form-item>   
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>              -->
         <el-row>
         <el-col :span="12">
            <div class="grid-content bg-purple">
                <el-form-item label="责任人：" prop="responsePersonID" >
                  <el-select
                    v-model="formData.responsePersonID"
                    placeholder="输入姓名搜索负责人"
                    clearable
                    filterable
                    :loading="leaderLoading2"
                    loading-text="查询中..."
                    style="width: 90%;"
                    @change="onSelectedEmpGroup"                   
                   >
                   <el-option
                    v-for="item in leaders2"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID">
                   </el-option>
               </el-select>
               <!-- <router-link :to='{name:"Problemnewperson"}' >
                <el-button type="primary" icon="el-icon-plus" circle size="mini"></el-button>
               </router-link> -->
          </el-form-item>
            </div>
         </el-col>
          <el-col :span="12">
            <el-form-item label="员工组：" prop="responseEmpGroup">
              <el-input v-model="formData.responseEmpGroup" placeholder="责任人员工组" readonly></el-input>
            </el-form-item>
         </el-col>
        </el-row>
        <el-row>
         <el-col :span="24">
             <div class="grid-content bg-purple-dark">
                <el-form-item label="问题标准描述：" prop="description">
                  <el-select
                    v-model="formData.description"
                    placeholder="搜索"
                    :filter-method="handleDescriptionSearch"
                    clearable
                    filterable
                    :loading="descriptionLoading"
                    loading-text="查询中..."
                    style="width: 100%;"
                    @change="onSelectedDescription" 
                  >
              <el-option
                style="width:700px"
                v-for="item in descriptions"
                :key="item.problemDescriptionCode"
                :label="`${item.description}`"
                :value="item.problemDescriptionCode">
              </el-option>
            </el-select>
                </el-form-item>
             </div>
         </el-col>
        </el-row>
        <el-row>
         <el-col :span="24">
             <div class="grid-content bg-purple-dark">
                <el-form-item label="问题详细描述：" prop="descriptionDetail">
                 <el-input
                    type="textarea"  :autosize="{ minRows: 6, maxRows: 8}" 
                    :rows="6"          placeholder="请输入内容不超过200字符"
                     v-model="formData.descriptionDetail"                    
                     >
                  </el-input>
                </el-form-item>
             </div>
         </el-col>
        </el-row>
         <el-row>
         <el-col :span="24">
             <div class="grid-content bg-purple-dark">
                <el-form-item label="整改建议：" prop="recommendRectiMeasure" >
                 <el-input
                    type="textarea"  :autosize="{ minRows: 4, maxRows: 6}" 
                    :rows="4"          placeholder="请输入建议整改措施不超过200字符"
                     v-model="formData.recommendRectiMeasure"                    
                     >
                  </el-input>
                </el-form-item>
             </div>
         </el-col>
        </el-row>
        <el-row>
         <el-col :span="12">
             <div class="grid-content bg-purple-dark">
              <el-form-item label="整改期限：" prop="limtRectDate">
                 <el-date-picker
                  v-model="formData.limtRectDate" style="width: 100%;"   type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期">
                 </el-date-picker>
              </el-form-item>    
             </div>
         </el-col>
        </el-row>
        <el-row>
         <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="问题类别1：" prop="problemClass1">
                  <el-select v-model="formData.problemClass1" placeholder="问题类别1" 
                  style="width: 100%;"
                  @change="onChangedProblemClass1"
                  >
                    <el-option
                      v-for="item in problemClass1s"  :key="item.problemFactorCode1"  :label="item.problemClass1"    :value="item.problemFactorCode1">
                   </el-option>
                </el-select>
               </el-form-item>
            </div>
         </el-col>
         <el-col :span="12">
             <div class="grid-content bg-purple">
                <el-form-item label="问题类别2：" prop="problemFactorCode">
                  <el-select v-model="formData.problemFactorCode" placeholder="问题类别2" style="width: 100%;" @change="onChangedProblemClass2">
                    <el-option
                      v-for="item in problemClass2s"   :key="item.problemFactorCode2"  :label="item.problemClass2"    :value="item.problemFactorCode2">
                   </el-option>
                </el-select>
               </el-form-item>
            </div>
         </el-col>
        </el-row> 
         <el-row>
         <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="问题级别：" prop="problemRank">
                <el-input  style="width: 100%;" v-model="formData.problemRank"  readonly></el-input>
               </el-form-item>
            </div>
         </el-col>
         <el-col :span="12">
             <div class="grid-content bg-purple">
               <el-form-item label="问题原因：" prop="problemSourceCode">
                   <el-select v-model="formData.problemSourceCode" placeholder="问题原因" style="width: 100%;" @change="onChangedSource">
                    <el-option
                      v-for="item in problemsources" :key="item.problemSourceCode" :label="item.problemSourceName"    :value="item.problemSourceCode">
                   </el-option>
                </el-select>
               </el-form-item>
            </div>
         </el-col>
        </el-row> 

        <el-row>
         <el-col :span="12">
            <div class="grid-content bg-purple">
               <el-form-item label="违章扣款：" >
                <el-input  style="width: 100%;" v-model="formData.penalty"  readonly></el-input>
               </el-form-item>
            </div>
         </el-col>
         <el-col :span="12">
             <div class="grid-content bg-purple">
               <el-form-item label="违章记分：">
                <el-input  style="width: 100%;" v-model="formData.lostScore"  readonly></el-input>
               </el-form-item>
            </div>
         </el-col>
        </el-row>

        <el-row>
         <el-col :span="12">
            <div class="grid-content bg-purple">
               <el-form-item label="任务：" prop="task">
                 <el-select style="width:100%"  v-model="formData.task" placeholder="请选择任务名称" @change="onChangedTask" clearable>
                  <el-option v-for="item in taskProcessName" :key="item.taskAndProcessCode" :label="item.task" :value="item.taskAndProcessName"></el-option>
                  </el-select>                
               </el-form-item>
            </div>
         </el-col>
         <el-col :span="12">
            <div class="grid-content bg-purple">
               <el-form-item label="工序：" prop="process">
                   <el-select style="width:100%" v-model="formData.process" placeholder="请选择工序名称"  @change="onChangedProcess" clearable >
                    <el-option v-for="item in processes" :key="item.taskAndProcessCode" :label="item.process" :value="item.taskAndProcessName"></el-option>
                   </el-select>
               </el-form-item>
            </div>
         </el-col>
        </el-row> 
        <el-row>
             <el-col :span="12">
               <el-form-item label="图片附件1：" prop="checkAttach1">
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
           <el-row>
             <el-col :span="12">
              <el-form-item label="视频附件：">
              <el-upload class="avatar-uploader el-upload--text"
              v-model="formData.checkVideo"
              :action="`/api/file_upload`"
              :file-list="videoList1"
              :limit="1"
              accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
              :before-upload="beforeUploadVideo1"
              :on-progress="uploadVideoProcess1"
              :headers="{Authorization:currentUser.token}"
              :on-success="handleVideoSuccess1"
              :on-remove="handlevideoRemove1"
              style="width:100%"
              >
              <video v-if="formData.checkVideo !='' && videoFlag1 == false"
                               :src="checkVideourl"
                               class="avatar video-avatar"
                               controls="controls">您的浏览器不支持视频播放</video> 
                        <i v-if="formData.checkVideo =='' && videoFlag1 == false"
                           class="el-icon-plus avatar-uploader-icon"></i>
                        <el-progress v-if="videoFlag1 == true"
                                     type="circle"
                                     :percentage="videoUploadPercent1"
                                     style="margin-top:30px;"></el-progress>
              </el-upload>
              </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-form-item>
               视频不能超过12M！
             </el-form-item>
           </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleupdate()" :disabled = !Submitflag>新建</el-button>
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
import {Getmyplan} from '../../../services/personCenter'
import {GetCurrentUser } from '../../../store/CurrentUser';
// import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import {GetPlanContent} from '../../../services/task'
import {GetCheckContentsTree} from '../../../services/complateplan'
import {GetDictionary} from '../../../services/dictionary'
import {GetEmployees} from '../../../services/employee'
import {Getproblemdescriptions,GetTaskProcess,GetProcesses,GetDescriptions,CreateProblem,GetCompanysbyplan,GetProblemSources,GetProblemClass1s,GetProblemClass2s} from '../../../services/ProblemInput.js'
import { newSendMessage } from "../../../services/chat"
export default {
  data() {
    return {
      formData: {
        // radio2:'first',
        // contractor:null,
        // problemCompanyCode:null,
        checkRank:'',
        planID:'',
        taskID: "",
        taskName: "",
        status:'未整改',
        plan_ID:"",
        planContent_ID:"",
        companyCode:null , 
        checkDate:"",
        checkItemCode:null  ,//检查项编码
        penalty:"",
        lostScore:"",
        taskAndProcessCode: "", //任务工序编码 
        temporaryCode:"",
        task:"",//任务
        process:"",//工序
        problemDescriptionCode:"",//问题描述编码
        description: "",//问题标准描述
        descriptionDetail:"",//问题详细描述
        isRectOntime:'否', 
        limtRectDate:"",//限定整改完成日期
        recommendRectiMeasure:"",//建议整改措施
        problemStation:"",//问题所属岗位
        problemRank: "", //问题级别
        problemRepeat:"",//问题重复性
        problemFactorCode:"",//问题因素编码
        problemClass1: "",//问题类别1
        problemClass2: "",//问题类别2        
        problemSourceCode: "",  //问题原因编码
        source:"",//问题原因
        responsePersonID:'',  
        responseEmpGroup:'',//责任人性质     
        checkAttach1: "", //附件1234   
        checkAttach2: "", //附件1234      
        checkAttach3: "", //附件1234   
        checkAttach4: "" ,//附件1234    ,        
        checkPersonID:"",//录入人员ID
        rectAttach1: "", //附件1234   
        rectAttach2: "", //附件1234      
        rectAttach3: "", //附件1234   
        rectAttach4: "" ,//附件1234 
        rectiMeasure:"",
        verifyDescription :"",
        rectEffect:"",
        checkVideo:"",
        verifyAttach:"",
        rectVideo:"",
        rectiPersonId:"",
        

      },
      activeNames: ['1'],
      pickerOptions0:{
					disabledDate(time){
						return time.getTime() > Date.now()- 8.64e6;
					}
        },
      fileList:[],
      videoList1:[],
      videoList2:[],
      fileList1:[],//图片附件1
      fileList2:[],//图片附件2
      fileList3:[],//图片附件3
      fileList4:[],//图片附件4
      videoFlag1:false,
      videoFlag2:false,
      videoUploadPercent1:0,
      checkVideourl:"",
      rectVideourl:"",
      videoUploadPercent2:0,
      isShowUploadVideo1:false,
      isShowUploadVideo2:false,
      checkItem:"",
      Submitflag:false,
      rectEffects: [],   
      problemClass1s:[],
      problemClass2s:[],
      problemsources:[],
      descriptions:[],
      isRectOntimeValue:false,
      companyLoading: false,
      companys:[],
      taskLoading: false,
      descriptionLoading: false,
      tasks:[],
      tableData1:[],
      tableData2:[],
      taskProcessName: [],
      processes:[],
      // companyLoading: false,
      leaderLoading1: false,
      leaderLoading2: false,
      leaderLoading3: false,
      leaderLoading4: false,
      leaderFilterText: '',
      ranks: [],//检查级别
      targets: [],
      problemRankoptions:[],
      problemRepeatoptions:[],
       leaders1: [],
       leaders2: [],
       leaders3: [],
       options:[],
       options11:[],
       contractors:[],
      props:{
        checkStrictly: true ,
        multiple: true, 
        value:'nodeCode',
        label:'label',
        children:'children',  
      },
       tableData:[],
       options1: [
        {
          value: "0",
          label: "0"
        },
        {
          value: "100",
          label: "100"
        },
        {
          value: "200",
          label: "200"
        },
        {
          value: "500",
          label: "500"
        },
        {
          value: "1000",
          label: "1000"
        },
        {
          value: "2000",
          label: "2000"
        },
        {
          value: "5000",
          label: "5000"
        }
      ],
       isRectnow:[
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],
      options2: [
        {
          value: "0",
          label: "0"
        },
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        },
      ],
      problemDescriptionCode:'',
       rules:{
        // taskID :[{required: true, message: '任务名称不可为空', trigger: 'blur' }],
        planID:[{required: true, message: '计划名称不可为空', trigger: 'blur' }],
        checkPersonID:[{required: true, message: '检查人员不可为空', trigger: 'blur' }],
        penalty:[{required: true, message: '违章扣款不可为空', trigger: 'blur' }],
        lostScore:[{required: true, message: '违章记分不可为空', trigger: 'blur' }],
        // checkRankID :[{required: true, message: '检查级别不可为空', trigger: 'blur' }],
        checkDate :[{required: true, message: '检查日期不可为空', trigger: ['blur', 'change'] }],
        companyCode :[{required: true, message: '问题单位不可为空', trigger: ['blur', 'change'] }],
        checkItemCode :[{required: true, message: '检查项不可为空', trigger: 'blur' }],
        responsePersonID :[{required: true, message: '责任人不可为空', trigger: 'blur' }],
        // responseEmpGroup :[{required: true, message: '性质不可为空', trigger: 'blur' }],
        description:[{required: true, message: '问题标准描述不可为空', trigger: 'blur' }],
        descriptionDetail :[{required: true, message: '问题详细描述不可为空', trigger: 'blur' }],
        recommendRectiMeasure :[{required: true, message: '整改建议不可为空', trigger: 'blur' }],
        limtRectDate :[{required: true, message: '整改限期不可为空', trigger: 'blur' }],
        problemRepeat :[{required: true, message: '重复性不可为空', trigger: 'blur' }],
        problemClass1 :[{required: true, message: '问题类别1不可为空', trigger: 'blur' }],
        problemFactorCode :[{required: true, message: '问题类别2不可为空', trigger: 'blur' }],
        problemRank :[{required: true, message: '问题级别不可为空', trigger: 'blur' }],
        problemSourceCode :[{required: true, message: '问题原因不可为空', trigger: 'blur' }],
        task :[{required: true, message: '任务不可为空', trigger: 'blur' }],
        process :[{required: true, message: '工序不可为空', trigger: 'blur' }],
        // checkAttach1 :[{required: true, message: '图片附件不可为空', trigger: 'blur' }],
        rectiMeasure:[{required: false, message: '整改问题描述不可为空', trigger: 'blur' }],
        rectEffect:[{required: false, message: '整改效果不可为空', trigger: 'blur' }],
        rectiPersonId:[{required: false, message: '整改负责人不可为空', trigger: 'blur' }],
        verifyDescription:[{required: false, message: '验证描述不可为空', trigger: 'blur' }],
      }
      
         }
  },
  mounted () {
    // this.handleGetproblemCompany()
    // this.getCheckItems()
    this.getProblemClass1()
    this.getSources()
    // this.getRanks()
    // this.getTargets()
    // this.setuser()
    this.getRepeat()//问题重复性
    this.getproblemRank()//问题级别
    this.handleLeaderSearch1()
    this.handleLeaderSearch2()
    this.handleLeaderSearch3()
    this.handleGetTaskProcedure()
    this.handleTaskSearch()
    this.handleDescriptionSearch()
    this.handleGetRectEffects()
   // this.handleCompanySearch()
    // this.handleLeadercontractor()
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    }
  },
  methods: {
    // change(tab, event){
    //  console.log(tab, event);
    // },
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
              console.log(JSON.stringify(this.formData)) 
              CreateProblem(this.formData).then(() => {
              // console.log(JSON.stringify(res)) 
            this.formData.rectAttach1=null
            this.formData.rectAttach2=null
            this.formData.rectAttach3=null
            this.formData.rectAttach4=null
            this.formData.checkAttach1=null
            this.formData.checkAttach2=null
            this.formData.checkAttach3=null
            this.formData.checkAttach4=null
            this.formData.checkVideo=null
            this.formData.rectVideo=null
            this.formData.verifyAttach=null
            this.$message.success('创建成功')
            this.Submitflag=!this.Submitflag
        // alert(this.formData.checkPersonID)
        newSendMessage({status: 103,user_id:this.formData.checkPersonID}).then().catch();
  
        // this.$router.push({name:'Problemlist'})
        // this.$router.go(-1) //返回上一url
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
    // setuser(){
    //   let user=GetCurrentUser()
    //   // alert(JSON.stringify( user))
    //   this.formData.checkPersonID=user.userId
    // },
    handleChange() {
      if (this.formData.isRectOntime=='是'){   
          this.formData.isRectOntime='否'
          this.rules.rectiMeasure[0].required=false     
          this.rules.rectEffect[0].required=false
          this.rules.rectiPersonId[0].required=false
          this.rules.verifyDescription[0].required=false       
       }else{       
          this.formData.isRectOntime='是'   
          this.rules.rectiMeasure[0].required=true     
          this.rules.rectEffect[0].required=true 
          this.rules.rectiPersonId[0].required=true 
          this.rules.verifyDescription[0].required=true           
       }    
      },
    //问题重复性
    getRepeat() {   
      GetDictionary({name: '问题重复性'}).then((res) => {
        this.problemRepeatoptions = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //问题级别
    getproblemRank() {
      GetDictionary({name: '问题级别'}).then((res) => {
        this.problemRankoptions = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //初始获取任务名称、任务工序、任务工序编码。
    handleGetTaskProcedure(){
      GetTaskProcess({name:''}).then((res) => {   
        // console.log(JSON.stringify(res.data))    
        for(let i=0;i<res.data.list.length;i++){   //筛选编码为2位数
          if(res.data.list[i].taskAndProcessCode.length === 2){
            this.taskProcessName.push(res.data.list[i])
          }
        }
       // alert(this.tasks)
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    handleGetRectEffects () {
      GetDictionary({name: '整改效果'}).then((res) => {
        this.rectEffects = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    onChangedTask(selectValue) {
      let obj = []
      //遍历下拉数组中的item
      if(selectValue === ''){
        this.formData.taskAndProcessCode = ''
        this.formData.temporaryCode = ''
      }else{
        obj = this.taskProcessName.find((item)=>{
          return item.taskAndProcessName === selectValue
        })
        this.formData.task= obj.taskAndProcessName     
        this.formData.taskAndProcessCode = obj.taskAndProcessCode  
        this.formData.temporaryCode = obj.taskAndProcessCode
        this.processes = []
        this.formData.process = ''
       
        // this.filterQuery.taskAndProcessCode = this.formData.taskAndProcessCode 
        this.handleGetProcesses() 
      }
    },    
    handleGetProcesses(){
      GetProcesses({taskAndProcessCode:this.formData.taskAndProcessCode}).then((res) => {   
       // alert(res.data.list)
       for(let i=0;i<res.data.list.length;i++){
          this.processes.push(res.data.list[i])
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    onChangedProcess(selectValue){ 
      let obj = {}
         //遍历下拉数组中的item
      if(selectValue === ''){
        this.formData.taskAndProcessCode = this.formData.temporaryCode
      }else{
        obj = this.processes.find((item)=>{
          return item.taskAndProcessName === selectValue
        })
        this.formData.process = obj.taskAndProcessName     
        this.formData.taskAndProcessCode = obj.taskAndProcessCode 
        // this.filterQuery.taskAndProcessCode = this.formData.taskAndProcessCode 
      }
    },
        //初始获取公司名称、编码，检查项
    handleGetproblemCompany(){
      GetCompany().then((res) => {
        this.options11=res.data   
        console.log(JSON.stringify(this.options11))
      }).catch((err) => {
        this.$message.error(err.message)
      })
      GetCheckContentsTree().then((res) => {
        // alert(JSON.stringify(res.data))
        this.checkItem = res.data
        
			}).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //根据公司名获取该公司下的所有员工
       onSelectedproblemCompany(selectValue) {
         this.formData.problemCompanyCode=selectValue[selectValue.length-1]
        //  alert(JSON.stringify(this.formData.problemCompanyCode))  
         GetEmployees({"companyCode":this.formData.problemCompanyCode}).then((res) => {
        //  alert(JSON.stringify(res))
         this.leaders2=res.data
				}).catch((err) => {
					this.$message.error(err.message)
        })
    },
    
    //获取承包商公司
    // handleLeadercontractor(){
    //   this.leaderLoading4 = true
    //   Getcontractor().then((res) => {
    //     this.contractors = res.data
    //     // alert(JSON.stringify(this.contractors))
    //     this.leaderLoading4 = false
    //   }).catch((err) => {
    //     this.$message.error(err.message)
    //     this.leaderLoading4 = false
    //   })
    // },
     //根据承包商公司名获取该公司下的所有员工
       onSelectedproblemCompany1(selectValue) {
         this.formData.contractor=selectValue
        //  alert(JSON.stringify(this.formData.contractor))  
         GetEmployees({"companyCode":this.formData.contractor}).then((res) => {
        //  alert(JSON.stringify(res))
        this.leaders2=res.data
				}).catch((err) => {
					this.$message.error(err.message)
        })
    },
    getProblemClass1(){
         GetProblemClass1s({name:''}).then((res) => {   
         //alert(JSON.stringify(res.data))    
          this.problemClass1s = res.data.list
        }).catch((err) => {
        this.$message.error(err.message)
      })
    },    
    getProblemClass2(){
     
       GetProblemClass2s({problemFactorCode2:this.formData.problemFactorCode1}).then((res) => {   
          //alert(JSON.stringify(res.data))    
          this.problemClass2s = res.data.list
        }).catch((err) => {
        this.$message.error(err.message)
      })
    },    
    getSources () {
        GetProblemSources({name:''}).then((res) => {   
         //alert(JSON.stringify(res.data))    
          this.problemsources = res.data.list
        }).catch((err) => {
        this.$message.error(err.message)
      })
    }, 
    handleLeaderSearch1 (val='') {
      this.leaderLoading1 = true
      GetEmployees({name: val, type: "all",inputType:"problem_write_check_person"}).then((res) => {
        this.leaders1 = res.data
        // alert(JSON.stringify(this.leaders))
        this.leaderLoading1 = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading1 = false
      })
    },
    handleLeaderSearch2 (val='') {
      this.leaderLoading2 = true
      GetEmployees({name: val, type: "all",inputType:"problem_write_response_person"}).then((res) => {
        this.leaders2 = res.data
        // alert(JSON.stringify(this.leaders))
        this.leaderLoading2 = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading2 = false
      })
    },
    handleLeaderSearch3 (val='') {
      this.leaderLoading3 = true
      GetEmployees({name: val, type: "all",inputType:"problem_rectification"}).then((res) => {
        this.leaders3 = res.data
        // alert(JSON.stringify(this.leaders))
        this.leaderLoading3 = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading3 = false
      })
    },

     handleTaskSearch (val='') {
      //  let user=GetCurrentUser()
      //  alert(JSON.stringify( user))
       this.taskLoading = true
      Getmyplan({taskName:val}).then((res) => {
        this.tableData2=res.data.list
         var hash = {};
          this.tasks = this.tableData2.reduce(function(item, next) {
          hash[next.planID] ? '' : hash[next.planID] = true && item.push(next);
          return item
         }, [])
        // alert(JSON.stringify( this.tasks))
         this.taskLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.taskLoading = false
      })
    },
    handleDescriptionSearch (val='') {
      this.descriptionLoading = true
      // alert("进入")
      GetDescriptions({description: val,type:'all'}).then((res) => {
        // alert(JSON.stringify(res))
        this.descriptions = res.data.list
         this.descriptionLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.descriptionLoading = false
      })
    },
    //获取select item中的label获取检查级别级别
      onSelectedTask(selectValue) {
      let obj = {}
      //遍历下拉数组中的item
      obj = this.tasks.find((item)=>{
            return item.planID === selectValue
      })
        this.formData.checkRank = obj.checkRank   
        GetPlanContent(selectValue).then((res) => {
           console.log(JSON.stringify(res.data))
					this.checkItem = res.data
				}).catch((err) => {
					this.$message.error(err.message)
        })
        GetCompanysbyplan(selectValue).then((res) => {
          //alert(JSON.stringify(res))
          this.options = res.data
				}).catch((err) => {
					this.$message.error(err.message)
        })
        // this.formData.checkItemCode = obj.checkItemCode        
},
  //获取责任人性质
      onSelectedEmpGroup(selectValue){
        let obj = {}
         //遍历下拉数组中的item
         obj = this.leaders2.find((item)=>{
          return item.employeeID === selectValue
         })
         this.formData.responseEmpGroup = obj.empGroup   
      },
  //问题描述
     onSelectedDescription(selectValue) {
         let obj = {}
         //遍历下拉数组中的item
         obj = this.descriptions.find((item)=>{
            return item.problemDescriptionCode === selectValue
         })
        this.formData.problemDescriptionCode = obj.problemDescriptionCode 
        this.formData.description = obj.description 
        Getproblemdescriptions(this.formData.problemDescriptionCode).then((res) => {
          this.formData.problemRank=res.data.problemRank  
          this.formData.penalty=res.penalty
          this.formData.lostScore=res.score
				}).catch((err) => {
					this.$message.error(err.message)
        })
    },
    onChangedIsRectOntime(val){     
       if (val==false){   
          this.formData.isRectOntime='否'            
       }else{       
          this.formData.isRectOntime='是'             
       }     
    },
    handleupdate(){
      this.formData.description = ""
      this.formData.problemDescriptionCode = ""
      this.Submitflag=!this.Submitflag
    },
    onChangedProblemClass1(selectValue) {
         let obj = {}
         //遍历下拉数组中的item
         obj = this.problemClass1s.find((item)=>{
                return item.problemFactorCode1 === selectValue
         })
         this.formData.problemFactorCode1=selectValue
         this.formData.problemClass1=obj.problemClass1
         this.formData.problemClass2 = ''
         this.problemClass2s=[]
         this.getProblemClass2()
    },
    onChangedProblemClass2(selectValue) {
          let obj = {}
         //遍历下拉数组中的item
         obj = this.problemClass2s.find((item)=>{
                return item.problemFactorCode2 === selectValue
         })
         this.formData.problemFactorCode=obj.problemFactorCode2 
         this.formData.problemClass2 = obj.problemClass2     
    },
    onChangedSource(selectValue) {
          let obj = {}
         //遍历下拉数组中的item
         obj = this.problemsources.find((item)=>{
                return item.problemSourceCode === selectValue
         })
         this.formData.problemSourceCode=obj.problemSourceCode 
         this.formData.source = obj.problemSourceName     
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

    // 上传图片
    handleRemove1(file, fileList1) {
        this.formData.checkAttach1=null;
        // alert(JSON.stringify(this.formData.checkAttach1))
        console.log(file, fileList1);
      },
    handleRemove2(file, fileList2) {
        this.formData.checkAttach2=null;
        console.log(file, fileList2);
      },
    handleRemove3(file, fileList3) {
        this.formData.checkAttach3=null;
        console.log(file, fileList3);
      },
    handleRemove4(file, fileList4) {
        this.formData.checkAttach4=null;
        console.log(file, fileList4);
      },
         handleRemove5(file, fileList4) {
        this.formData.rectAttach1=null;
        console.log(file, fileList4);
      },
         handleRemove6(file, fileList4) {
        this.formData.rectAttach2=null;
        console.log(file, fileList4);
      },
         handleRemove7(file, fileList4) {
        this.formData.rectAttach3=null;
        console.log(file, fileList4);
      },
         handleRemove8(file, fileList4) {
        this.formData.rectAttach4=null;
        console.log(file, fileList4);
      },
         handleRemove9(file, fileList4) {
        this.formData.verifyAttach=null;
        console.log(file, fileList4);
      },
    
      handlevideoRemove1(file, videoList1) {
        this.formData.checkVideo="";
        console.log(file, videoList1);
      },
      handlevideoRemove2(file, videoList2) {
        this.formData.rectVideo="";
        console.log(file, videoList2);
      },
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
        handleSuccess5(response){
      console.log(response)
      this.formData.rectAttach1 = response.data
      // alert(this.formData.checkAttach4)
    },
        handleSuccess6(response){
      console.log(response)
      this.formData.rectAttach2 = response.data
      // alert(this.formData.checkAttach4)
    },
        handleSuccess7(response){
      console.log(response)
      this.formData.rectAttach3 = response.data
      // alert(this.formData.checkAttach4)
    },
        handleSuccess8(response){
      console.log(response)
      this.formData.rectAttach5 = response.data
      // alert(this.formData.checkAttach4)
    },
        handleSuccess9(response){
      console.log(response)
      this.formData.verifyAttach= response.data
      // alert(this.formData.checkAttach4)
    },

    beforeUploadVideo1(file) {          //视频上传之前判断他的大小
      const isLt12M = file.size / 1024 / 1024  < 12;
      if (!isLt12M) {
        this.$message.error('上传视频大小不能超过12MB哦!');
        return false;
      }
      this.isShowUploadVideo1 = false;
    },
    uploadVideoProcess1(event, file){    //视频上传的时候获取上传进度传给进度条
      this.videoFlag1 = true;
      this.videoUploadPercent1 = parseInt(file.percentage);
      // console.log(this.videoUploadPercent)
    },
    handleVideoSuccess1(res) {           //视频上传成功之后返回视频地址
    this.isShowUploadVideo1 = true;
      this.videoFlag1 = false;
      this.videoUploadPercent1 = 0;
      this.formData.checkVideo = res.data;
      this.checkVideourl='http://39.98.173.131:7000/resources/'+ this.formData.checkVideo
      
    },
    beforeUploadVideo2(file) {          //视频上传之前判断他的大小
      const isLt50M = file.size / 1024 / 1024  < 50;
      if (!isLt50M) {
        this.$message.error('上传视频大小不能超过50MB哦!');
        return false;
      }
      this.isShowUploadVideo2 = false;
    },
    uploadVideoProcess2(event, file){    //视频上传的时候获取上传进度传给进度条
      this.videoFlag2 = true;
      this.videoUploadPercent2 = parseInt(file.percentage);
      // console.log(this.videoUploadPercent)
    },
    handleVideoSuccess2(res) {           //视频上传成功之后返回视频地址
    this.isShowUploadVideo2 = true;
      this.videoFlag2 = false;
      this.videoUploadPercent2 = 0;
      this.formData.rectVideo = res.data;
      this.rectVideourl='http://39.98.173.131:7000/resources/'+ this.formData.rectVideo
    },
    // 图片处理
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
    },
    downLoad(){
        var url='http://39.98.173.131:7000/Problems/问题录入模板.xlsx'
        var iframe =document.createElement("iframe")
        iframe.style.display ="none";
        iframe.src = url;
        document.body.appendChild(iframe);
      },
    handlePreview(file) {
        console.log(file);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess(response){
       console.log(response)
       this.$message.warning(response);
       this.getDate();
      },
    submitUpload() {
        this.$refs.upload.submit();
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
