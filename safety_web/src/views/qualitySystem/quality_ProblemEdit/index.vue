<template>
  <div class="problemList">
          <div class="page-title" style="width:100%">质量-问题整改</div>
      <el-radio  v-model="listcate" label="QHSE隐患清单" >质量-隐患整改</el-radio>
      <el-radio  v-model="listcate" label="QHSE问题清单"  style="margin-bottom:20px">质量-问题整改</el-radio>
      <el-row v-show="listcate === 'QHSE隐患清单'"> 
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
                    <span>{{ props.row.consequenceID }}</span>
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
                <el-form-item label="隐患级别:">
                    <span>{{ props.row.rank }}</span>
                </el-form-item>
                <el-form-item label="隐患描述:">
                    <span>{{ props.row.description }}</span>
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
                <el-button v-show="scope.row.status === 1" style="margin-left:9px" type="primary" icon="el-icon-search" plain size="small" @click="goEdit(scope.row)">待整改</el-button>
                <el-button v-show="scope.row.status === 3"  type="warning" icon="el-icon-edit" plain size="small" >验收中</el-button>
                <el-button v-show="scope.row.status === 5" type="success" icon="el-icon-check" plain size="small">已验收</el-button>
                
            </template>
            </el-table-column>
          </el-table>
          </el-row>
      </el-row>
      <el-dialog
            title="隐患整改"
            :visible.sync="editShow"
            :close-on-click-modal='false'
            width="35%">
            <div v-loading='addLoading'>
            <el-form v-model="reformForm">
            <el-form-item label='整改情况:'>
               <el-input v-model="reformForm.reformCase" style="width:55%"></el-input>
            </el-form-item>
            <el-form-item label='整改图片:'>
               <el-upload
                 ref="upload"
                 accept=".bmp,.png,.jpg"
                  action="/api/uploadScreenShot"
                  :on-success="handleAvatarSuccess"
                  :limit="2"    
                  :headers="header"        
                  :on-exceed="handleExceed"
                >
                <el-button size="small" type="primary">浏览文件</el-button>
                <span>&nbsp;&nbsp;&nbsp;最多两张，格式为jpg,png,bmp</span>
                </el-upload>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right">
           <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="editInfo">确 定</el-button>
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
            :data='problemrecord'
            v-loading='problemLoading'
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
                        <el-button v-show="scope.row.status === '未整改'" style="margin-left:9px" type="primary" icon="el-icon-search" plain size="small"  @click="goEditPage(scope.row)" >待整改</el-button>
                        <el-button v-show="scope.row.status === '验收中'" type="warning" icon="el-icon-edit"  plain size="small">待验收</el-button>
                        <el-button v-show="scope.row.status === '已整改'" type="success" icon="el-icon-check" plain size="small">已验收</el-button>
                    </template>
                    </el-table-column>       
            </el-table>        
          </el-row>
      </el-row>
      <el-dialog
            title="问题整改"
            :visible.sync="editProShow"
            :close-on-click-modal='false'
            width="30%">
            <div v-loading='addLoading2'>
            <el-form>
            <el-form-item label='整改情况:'>
               <el-input v-model="proForm.situation" style="width:70%"></el-input>
            </el-form-item>
           
            </el-form>
             <div slot="footer" class="dialog-footer" style="text-align:right">
           <el-button @click="editProShow= false">取 消</el-button>
            <el-button type="primary" @click="goEditPro">确 定</el-button>
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
        updateDangerrecord,
        updateProblemDescription
} from '../../../services/qualitySystem/problemVerify'
import {GetqhseCompanytree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
export default {
   data() {
       return {
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
            // 问题整改
           situation:'',
            // 隐患整改
            reformForm:{
               receptionDate:'',
               reformCase: '',
               status: 3
            },
           listcate: 'QHSE隐患清单',
           date30:[],
           // 控制按钮 防止一直点击
           regulationBtn:false,
           proBtn:false,
           dangerBtn:false,
           editShow: false,
           fileNum:2,
           fileNumPro:0,
           form:{},
           addLoading:false,
           addLoading2:false,
           editProShow:false,
           qHSE_AuditProblemRecord_ID:'',
           proForm:{
              situation:'',
              status:'验收中'
           },

       }
   },
   methods: {
      handleAvatarSuccessPro(res) {
      this.fileNumPro++
      let key = 'affix' + this.fileNumPro
      this.proForm[key] = res.data
    },
    // 限制文件数量
    handleExceedPro(files, fileList) {
        this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
       // 给附件命名
    handleAvatarSuccess(res) {
        console.log(res.data)
      this.fileNum++
      let key = 'affix' + this.fileNum
      this.form[key] = res.data
    },
    // 限制文件数量
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
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
        goEdit(data){
           let _this = this
          _this.editId = data.id
          _this.editShow = true
          _this.form = {...data}
          _this.form.status = 3
          _this.$refs['upload'].clearFiles()
          _this.reformForm.reformCase = ''
          _this.fileNum = 2
       },
       editInfo() {
           let _this = this
           if(_this.fileNum === 2){
               _this.$message.warning('请至少提交一个证明附件！')
               return
           }  
           if(_this.reformForm.reformCase === ''){
                _this.$message.warning('请输入整改情况！')
               return
           }     
          _this.$confirm('确认提交整改情况吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(()=>{
            _this.addLoading = true
            _this.form.reformCase = _this.reformForm.reformCase
        problemVerification(_this.editId,_this.reformForm).then(() => {       
                return updateDangerrecord(_this.editId,_this.form)          
            })
        }).then(() => {
            // 推送新状态    
            _this.$refs['upload'].clearFiles()
            _this.reformForm.reformCase = ''
            _this.fileNum = 2
            _this.editShow = false
            _this.addLoading = false
            _this.$message.success('上传成功')
            _this.searchDanger()
        }).catch((err) => {      
                _this.$message.error(err)         
                _this.addLoading = false
            })
          
       },
       goEditPage(data){
           this.qHSE_AuditProblemRecord_ID = data.qHSE_AuditProblemRecord_ID
           this.editProShow = true
            this.proForm.situation = ''
       }, 
       // 问题验证
       // 整改
       goEditPro(){
           let _this = this
           if(_this.proForm.situation === ''){
               _this.$message.warning('请输入整改情况')
               return
           }
           /* if(_this.fileNumPro === 0){
               _this.$message.warning('请至少提交一个证明附件！')
               return
           }   */
           _this.$confirm('确认提交整改情况吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=> {
            _this.addLoading2 = true
           updateProblemDescription(this.qHSE_AuditProblemRecord_ID,_this.proForm).then(res => {
               console.log(res)
               _this.addLoading2 = false
               this.editProShow = false
                this.proForm.situation = ''
               _this.$message.success('上传成功')
               _this.getProblemDescription()
               
           }).catch(err => {
                this.$message.error(err)
           })
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
           baseurl  = _this.getUrl('/api/query_quality_dangerrecord',form)
           queryDangerrecord(baseurl,form).then(res => {
               _this.dangerrecord = res.data.list
               if(res.data.list.length === 0) {
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
           baseurl  = _this.getUrl('/api/query_quality_problemDescription',form)
           queryProblemDescription(baseurl,form).then(res => {
               if(res.data.length === 0) {
                   this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });

               }
               console.log(res.data)
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