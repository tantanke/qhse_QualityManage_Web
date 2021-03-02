<template>
  <div class="problemList">
          <div class="page-title" style="width:100%">QHSE问题验收</div>
      <el-radio  v-model="listcate" label="QHSE隐患清单" >QHSE隐患验收</el-radio>
      <el-radio  v-model="listcate" label="QHSE问题清单"  style="margin-bottom:20px">QHSE问题验收</el-radio>
      <el-row v-if="listcate === 'QHSE隐患清单'"> 
          <el-row>
          <el-form :inline="true">
                  <el-form-item label='组件机构：' >
                      <el-cascader
                        v-model="checkForm.companyId"
                        :options="companyList"
                        :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                        :show-all-levels="false"
                        @change="handleChange"
                        ref="cascaderAddr"    
                        filterable           
                        >             
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label='时间范围：' labelWidth='120px'>
                      <el-date-picker
                        v-model="dateH"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :clearable='false'  
                        >
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                <el-button type="primary" :disabled='dangerBtn' icon="el-icon-search" @click="searchDanger">查询</el-button>   
                </el-form-item>     
          </el-form>
          </el-row>
          <el-row style="height:350px">
          <el-table
          v-loading='dangerLoading'
          :data='dangerrecord'
          stripe
          style="width: 100%"
          max-height="590">
          <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="table-expand">
                <el-form-item label="检查人员:">
                    <span>{{ props.row.safeStaff_Name }}</span>
                </el-form-item>
                <el-form-item label="施工队伍:">
                    <span>{{ props.row.companyName }}</span>
                </el-form-item>
                <el-form-item label="位置区域:">
                    <span>{{ props.row.location }}</span>
                </el-form-item>
                <el-form-item label="作业项目:">
                    <span>{{ props.row.workItem }}</span>
                </el-form-item>
                <el-form-item label="隐患类别:">
                    <span>{{ props.row.type }}</span>
                </el-form-item>
                <el-form-item label="对应体系要素:">
                    <span>{{ props.row.factorHSE }}</span>
                </el-form-item>
                <el-form-item label="原因分析:">
                    <span>{{ props.row.factorSource }}</span>
                </el-form-item>
                <el-form-item label="检查时间:">
                    <span>{{ props.row.recordDate }}</span>
                </el-form-item>
                <el-form-item label="归属部门:">
                    <span>{{ props.row.factorDepartment }}</span>
                </el-form-item>
                <el-form-item label="可能后果:">
                    <span>{{ props.row.consequence }}</span>
                </el-form-item>
                <el-form-item label="整改负责人:">
                    <span>{{ props.row.reformPerson }}</span>
                </el-form-item>
                <el-form-item label="所属专业:">
                    <span>{{ props.row.profession }}</span>
                </el-form-item>
                <el-form-item label="限期整改时间:">
                    <span>{{ props.row.limitDate }}</span>
                </el-form-item>
                <el-form-item label="是否立即验收:">
                    <span>{{ props.row.ok == '1'?'是':'否'}}</span>
                </el-form-item>
                <el-form-item label="隐患级别:">
                    <span>{{ props.row.rank }}</span>
                </el-form-item>
                <el-form-item label="隐患描述:">
                    <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="隐患状态:">
                <span v-show=" props.row.status === 1 && !props.row.refuseReason" >待整改</span>
                <span v-show=" props.row.status === 1 && props.row.refuseReason" >被打回</span>
                <span v-show=" props.row.status === 3" >待验收</span>
                <span v-show=" props.row.status === 5"  >已验收</span>
                </el-form-item>
                 <el-form-item v-if="props.row.affix1" label="证据图片1:" >
                    <a  :href="'http://39.98.173.131:9000/api' + props.row.affix1" target="_blank">证据图片1</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix2" label="证据图片2:">
                    <a  :href="'http://39.98.173.131:9000/api' + props.row.affix2" target="_blank" >证据图片2</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix3" label="整改图片1:" >
                     <a  :href="'http://39.98.173.131:9000/api' + props.row.affix3" target="_blank" >整改图片1</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix4" label="整改图片2:">
                   <a :href="'http://39.98.173.131:9000/api' + props.row.affix4" target="_blank">整改图片2</a>
                </el-form-item>
           </el-form>
           </template>
          </el-table-column>
         <el-table-column align='center' prop='safeStaff_Name' label='检查人员'></el-table-column>
          <el-table-column align='center' prop='companyName' label='施工队伍'></el-table-column>
          <el-table-column align='center' prop='rank' label='隐患级别'></el-table-column>
          <el-table-column align='center' prop='reformPerson' label='整改负责人'></el-table-column>
          <el-table-column align='center' prop='dangerSource' label='隐患来源'></el-table-column>    
          <el-table-column align='center' prop='supervisionDate' label='检查时间'></el-table-column>        
          <el-table-column
            label="状态"
            fixed="right"
            align='center'>
            <template slot-scope="scope">
                <!-- <el-button @click="testedit(scope.row)">测试</el-button> -->
               <el-button v-show="scope.row.status === 1 && !scope.row.refuseReason " style="margin-left:9px" type="primary" icon="el-icon-search" plain size="small">待整改</el-button>
               <el-button v-show="scope.row.status === 1 && scope.row.refuseReason " style="margin-left:9px" type="danger" icon="el-icon-search" plain size="small">被打回</el-button>
                <el-button v-show="scope.row.status === 3" type="warning" icon="el-icon-edit" plain size="small" @click="goRecieve(scope.row)">待验收</el-button>
                <el-button v-show="scope.row.status === 5" type="success" icon="el-icon-check" plain size="small">已验收</el-button>
            </template>
            </el-table-column>
          </el-table>
          </el-row>
      </el-row>
      <el-dialog
            title="隐患验收"
            :visible.sync="recieveShow"
            :close-on-click-modal='false'
            width="35%">
            <div v-loading='addLoading'>
            <el-form >
            <el-form-item label='整改情况:' label-width='80px'>
               <span>{{detail.reformCase}}</span>
            </el-form-item>
            <el-form-item label='整改文件:' label-width='80px'>
              <div v-for="(item,index) in detail.img" :key="index">
                    <el-card :body-style="{ padding: '10px' }"
                                style="width:200px;height:120px;text-align:center;float:left;margin:05px">
                        <span v-if="!item">无图片文件记录！</span>
                        <el-popover placement="right" title trigger="click" v-else>
                            <div style="box-shadow: 0 0 2px 4px rgba(0,0,0,0.3);"
                                    class="picPosition">
                                <img :src="item" class="picSize"/>
                            </div>
                            <img slot="reference" :src="item" :alt="detail.img"
                                    style="width: 100%; height: 100%;"/>
                        </el-popover>
                    </el-card>
                </div>
            </el-form-item>
             <el-form-item label='操作:' label-width='80px'>
                <el-radio @click="resethidden"  v-model="doHidden" label="refuse" ><el-button type="danger" plain>打 回</el-button></el-radio>
                <el-radio  @click="resethidden"  v-model="doHidden" label="pass"><el-button type="primary" plain >通 过</el-button></el-radio>
            </el-form-item>
            <el-form-item label='通过描述:' label-width='80px' v-show='doHidden === "pass"'>
               <el-input v-model="reformForm.passReason" style="width:70%"></el-input>
            </el-form-item>
             <el-form-item label='打回原因:' label-width='80px' v-show='doHidden === "refuse"'>
               <el-input v-model="reformForm.refuseReason" style="width:70%"></el-input>
            </el-form-item>     
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right">
                 <el-button type="danger"  @click="noreciveInfo" v-show='doHidden === "refuse"'>确定打回</el-button>
                 <el-button type="primary"  @click="reciveInfo" v-show='doHidden === "pass"'>确定通过</el-button>
            </div>
            </div>
            </el-dialog>
      <el-row v-show="listcate === 'QHSE问题清单'">
          <el-form>
              <el-row>
          <el-form :inline="true">
                  <el-form-item label='组件机构：' >
                      <el-cascader
                        v-model="checkForm.companyId"
                        :options="companyList"
                        :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                        :show-all-levels="false"
                        @change="handleChange"
                        ref="cascaderAddr"    
                        clearable
                        filterable  
                        >             
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label='时间范围：' labelWidth='120px'>
                      <el-date-picker
                        v-model="dateQ"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :clearable='false'  
                        >
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getProblemDescription" :disabled='proBtn'>查询</el-button>   
                </el-form-item>     
          </el-form>
          </el-row>      
          </el-form>
          <el-row style="height:370px" >
              <el-table
              stripe
              v-loading='problemLoading'
            :data='problemrecord'
            style="width: 100%"
            max-height="590">
                    <el-table-column
                    prop="auditTime"
                    label="检查时间">
                </el-table-column>
                    <el-table-column
                    prop="companyName"
                    width='250'
                    label="公司名称">
                </el-table-column>
                <el-table-column
                    prop="itemName"
                    label="检查项">
                </el-table-column>
                <el-table-column
                    prop="auditor"
                    label="检查人">
                </el-table-column>
                  <el-table-column
                    prop="problemDescription"
                    label="问题描述">
                </el-table-column>
                <el-table-column
                    prop="problemSource"
                    label="问题来源">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="状态"
                    align='center'
                    width="200">
                    <template slot-scope="scope">
                        <el-button v-show="scope.row.status === '未整改' && !scope.row.refuseReason" style="margin-left:9px" type="primary" icon="el-icon-search" plain size="small"  >未整改</el-button>
                        <el-button v-show="scope.row.status === '未整改' && scope.row.refuseReason" style="margin-left:9px" type="danger" icon="el-icon-search" plain size="small"  >被打回</el-button>
                        <el-button v-show="scope.row.status === '验收中'" type="warning" icon="el-icon-edit" plain size="small" @click="goProRecieve(scope.row)">验收中</el-button>
                        <el-button v-show="scope.row.status === '已整改'" type="success" icon="el-icon-check" plain size="small" >已整改</el-button>
                    </template>
                    </el-table-column>       
            </el-table>
          </el-row>
      </el-row>
      <el-dialog
            title="问题验收"
            :visible.sync="recieveProShow"
            :close-on-click-modal='false'
            width="35%">
            <div v-loading='addLoading'>
            <el-form >
            <el-form-item label='整改情况:' label-width='80px'>
               <span>{{detailPro.situation}}</span>
            </el-form-item>
             <el-form-item label='整改文件:' label-width='80px' v-show="detailPro.img.length > 0">
              <div v-for="(item,index) in detailPro.img" :key="index">
                    <el-card :body-style="{ padding: '10px' }"
                                style="width:200px;height:120px;text-align:center;float:left;margin:05px">
                        <span v-if="!item">无图片文件记录！</span>
                        <el-popover placement="right" title trigger="click" v-else>
                            <div style="box-shadow: 0 0 2px 4px rgba(0,0,0,0.3);"
                                    class="picPosition">
                                <img :src="item" class="picSize"/>
                            </div>
                            <img slot="reference" :src="item" :alt="detail.img"
                                    style="width: 100%; height: 100%;"/>
                        </el-popover>
                    </el-card>
                </div>
            </el-form-item>
            <el-form-item label='操作:' label-width='80px'>
                <el-radio @click="reset"  v-model="doWhat" label="refuse" ><el-button type="danger" plain>打 回</el-button></el-radio>
                <el-radio  @click="reset"  v-model="doWhat" label="pass"><el-button type="primary" plain >通 过</el-button></el-radio>
            </el-form-item>
            <el-form-item label='通过描述:' label-width='80px' v-show='doWhat === "pass"'>
               <el-input v-model="proForm.passReason" style="width:70%"></el-input>
            </el-form-item>
             <el-form-item label='打回原因:' label-width='80px' v-show='doWhat === "refuse"'>
               <el-input v-model="proForm.refuseReason" style="width:70%"></el-input>
            </el-form-item>
            </el-form>
            
            <div slot="footer" class="dialog-footer" style="text-align:right">
                 <el-button type="danger"  @click="norecivePro" v-show='doWhat === "refuse"'>确定打回</el-button>
                 <el-button type="primary"  @click="recivePro" v-show='doWhat === "pass"'>确定通过</el-button>
            </div>
            </div>
            </el-dialog>
  </div>
</template>

<script> 
import { GetCurrentUser } from '@/store/CurrentUser'
import {queryDangerrecord,
        queryProblemDescription
} from '../../../services/hidden_danger_investigation/QHSETroubleCheckList'
import {problemVerification,
        updateProblemDescription
} from '../../../services/hidden_danger_investigation/problemVerify'
import {GetqhseCompanytree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
export default {
   data() {
       return {
           proForm:{
             passReason:'',
             refuseReason:''
           },
           doWhat:'',
           doHidden:'',
           header: { Authorization: GetCurrentUser().token },
           editId:'',
           // 控制加载
           regulationrecordLoading: false,
           problemLoading: false,
           dangerLoading: false,
           date: [],
           dateQ:[],
           dateH:[],
           regulationrecord: [],
           problemrecord: [],
           dangerrecord: [],
           serdata:{},
           companyList: [],
           checkForm: {
                companyId: [],
                startDate: null,
                endDate: null
            },
            reformForm:{
               receptionDate:'',
               status: 1,
               reformCase:'已打回',
               passReason:'',
               refuseReason:''
            },
           listcate: 'QHSE隐患清单',
           date30:[],
           // 控制按钮 防止一直点击
           regulationBtn:false,
           proBtn:false,
           dangerBtn:false,
           editShow: false,
           fileNum:2,
           form:{},
           recieveShow:false,
           addLoading:false,
           //验证信息：
           detail:{
               reformCase:'',
               img:[]
           },
           detailPro:{
               situation:'',
               img:[]
           },
           recieveProShow: false,
           qHSE_AuditProblemRecord_ID:''
       }
   },
   methods: {
       goProRecieve(data){
           console.log(data)
        this.qHSE_AuditProblemRecord_ID = data.qHSE_AuditProblemRecord_ID
        this.detailPro.situation = data.situation
        this.detailPro.img = [];
        this.recieveProShow = true
        if(data.file2){
             this.detailPro.img.push('http://39.98.173.131:9000/api'+ data.file1)
             this.detailPro.img.push('http://39.98.173.131:9000/api'+ data.file2)
          }
          else if(data.file1){
              this.detailPro.img.push('http://39.98.173.131:9000/api'+ data.file1)
          }
          else{
              return
          }
        
       },
       reset(){
           this.proForm.passReason = ''
           this.proForm.refuseReason = ''
       },
       resethidden(){
           this.reformForm.passReason = ''
           this.reformForm.refuseReason = ''
       },
       goRecieve(data) {
          this.detail.reformCase = data.reformCase
          this.detail.img = []
          if(data.affix4){
             this.detail.img.push('http://39.98.173.131:9000/api'+ data.affix4)
             this.detail.img.push('http://39.98.173.131:9000/api'+ data.affix3)
          }else{
              this.detail.img.push('http://39.98.173.131:9000/api'+ data.affix3)
          }
          this.recieveShow = true
          this.editId = data.id
       },
       // 给附件命名
       getRecentTime() {
          let date = new Date().getTime()
          console.log(new Date())
          let near = date + 60*60*1000*24*30
          let day = new Date(date).toISOString()
          let nearday = new Date(near).toISOString()
          this.date30.push(day.split('T')[0])
          this.date30.push(nearday.split('T')[0])    
          this.reformForm.receptionDate = this.date30[0]
          this.date = [...this.date30]
          this.dateQ = [...this.date30]
          this.dateH = [...this.date30]
       },
       noreciveInfo() {
           if(this.reformForm.refuseReason === ''){
               this.$message.warning('请输入打回原因')
               return
           }
          this.$confirm('确定不通过验收吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(()=>{
            this.reformForm.passReason = ''
            this.addLoading = true
            problemVerification(this.editId,this.reformForm).then(res => {
                if(res.code === 1000){
                this.recieveShow = false
                this.detail.img = []
                this.$message.success('打回成功')
                this.searchDanger()
                this.addLoading = false
                }
            })
        })
       },
       reciveInfo () {
           if(this.reformForm.passReason === ''){
               this.$message.warning('请输入通过描述')
               return
           }
          this.$confirm('确定通过验收吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(()=>{
            this.reformForm.refuseReason = ''
            this.addLoading = true
            this.reformForm.status = 5
            this.reformForm.reformCase = '已整改'
            problemVerification(this.editId,this.reformForm).then(res => {
                if(res.code === 1000){
                this.recieveShow = false
                this.detail.img = []
                this.$message.success('验收成功')
                this.searchDanger()
                this.addLoading = false
                }
            })
        })
       },
       // 问题验证
       // 验收
       recivePro(){
           if(this.proForm.passReason === ''){
               this.$message.warning('请输入通过描述')
               return
           }
          this.$confirm('确认通过验收吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=> {
           updateProblemDescription(this.qHSE_AuditProblemRecord_ID,{status:'已整改',passReason:this.proForm.passReason,refuseReason:''}).then(res => {
               console.log(res)
               this.recieveProShow = false
               this.$message.success('验收成功')
               this.getProblemDescription()
           })
        })
        .catch(err => {
                this.$message.error(err)
            })
       },
       norecivePro(){
           
           if(this.proForm.refuseReason === ''){
               this.$message.warning('请输入打回原因')
               return
           }
          this.$confirm('确认不通过验收吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=> {
           updateProblemDescription(this.qHSE_AuditProblemRecord_ID,{status:'未整改',file1:null,file2:null,refuseReason:this.proForm.refuseReason,passReason:''}).then(res => {
               console.log(res)
               this.$message.success('打回成功')
               this.getProblemDescription()
               this.recieveProShow = false
           })
        })
        .catch(err => {
                this.$message.error(err)
            })
       },
       // 整改
       goEditPro(data){
           this.$confirm('确认通过整改情况吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=> {
           updateProblemDescription(data.qHSE_AuditProblemRecord_ID,{situation:'已整改'}).then(res => {
               console.log(res)
              this.$message.success('验收成功')
               this.getProblemDescription()
           })
        })
        .catch(err => {
                this.$message.error(err)
            })
       },
       searchDanger () {
         // 根据参数的不同选择不同的拼接方式
            let baseurl 
            let form = {}
            let start,end         
            let _this = this
                
            if (_this.date) {
               start = _this.dateH[0]
               end = _this.dateH[1]
               form.startDate = start
               form.endDate = end
            } else{
               form.startDate = _this.date30[0]
               form.endDate = _this.date30[1]
            }
            if (_this.checkForm.companyId.length !== 0) {
                form.companyId = _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
            }
            if(!form.companyId) {
                _this.$message.warning('请选择公司')
                return
            }
            _this.dangerLoading = true    
            _this.dangerBtn = true
           baseurl  = _this.getUrl('/api/query_dangerrecord',form)
           queryDangerrecord(baseurl,form).then(res => {
               _this.dangerrecord = res.list
               if(res.list.length === 0) {
                   this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });

               }
                  _this.dangerLoading = false
                  _this.dangerBtn = false
           }).catch(err => {
              this.$message.error(err)
              _this.dangerLoading = false
              _this.dangerBtn = false
          })
       },
       getMessage() {
         this.searchDanger()
       },
       getProblem() {
         this.getProblemDescription()
       },
       getCompanyList () {
            GetqhseCompanytree().then(res => {
                this.companyList = res.data
            }).catch(err => {
              this.$message.error(err)
          })
        },
        handleChange(value) {
        console.log(value);
        },
        
        getProblemDescription() {
            let baseurl 
            let form = {}
            let start,end         
            let _this = this
           
            if (_this.date) {
               start = _this.dateQ[0]
               end = _this.dateQ[1]
               form.startDate = start
               form.endDate = end
            }  else{
               form.startDate = _this.date30[0]
               form.endDate = _this.date30[1]
            }
            if (_this.checkForm.companyId.length !== 0) {
                form.companyCode = _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
            }
            if(!form.companyCode) {
                _this.$message.warning('请选择公司')
                return
            }
             _this.problemLoading = true
            _this.proBtn = true
           baseurl  = _this.getUrl('/api/query_problemDescription',form)
           queryProblemDescription(baseurl,form).then(res => {
               if(res.data.length === 0) {
                   this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });

               }
               _this.problemrecord = res.data
                _this.problemLoading = false
                _this.proBtn = false
           }).catch(err => {
              this.$message.error(err)
              _this.problemLoading = false
              _this.proBtn = false
          })
        },
        getUrl(baseurl,data) {
            let url = baseurl+'?'
            Object.keys(data).forEach(function (key) {
                 url =  `${url}${key}=${data[key]}&`              
                });
                url = url.substring(0,url.length-1)
            return url
        },
   },
   mounted() {     
       this.getRecentTime()
       this.getCompanyList()
   },
}
</script>

<style lang='scss' scoped>
.picSize {
        max-width: 1400px;
        max-height: 750px;
        vertical-align: bottom;
    }

    .picPosition {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
.el-table{
    height: 590px;
    .table-expand {
    font-size: 0;
    
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    color: #99a9bf;
   }
  }
}

</style>