<template>
  <div class="problemList">
          <div class="page-title" style="width:100%">QHSE问题验证</div>
      <el-radio v-model="listcate" label="QHSE违章清单">QHSE违章清单</el-radio>
      <el-radio  v-model="listcate" label="QHSE隐患清单" @click.native.once="getMessage">QHSE隐患清单</el-radio>
      <el-radio  v-model="listcate" label="QHSE问题清单" @click.native.once="getProblem" style="margin-bottom:20px">QHSE问题清单</el-radio>
      <el-row v-show="listcate === 'QHSE违章清单'">
          <el-row>
          <el-form :inline="true">
                  <el-form-item label='组件机构：' >
                      <el-cascader
                        v-model="checkForm.companyId"
                        :options="companyList"
                        :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                        @change="handleChange"
                        ref="cascaderAddr"  
                        :show-all-levels="false" 
                        clearable
                        filterable          
                        >             
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label='时间范围：' labelWidth='120px'>
                      <el-date-picker
                        v-model="date"
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
                <el-button type="primary" :disabled='regulationBtn' icon="el-icon-search" @click="searchRegulation">查询</el-button>   
                </el-form-item>     
          </el-form>
          </el-row>
          <el-row style="height:370px" >
         <el-table
         v-loading='regulationrecordLoading'
          type="expand"
          stripe
          :data='regulationrecord'
          style="width:100%"
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
                <el-form-item label="检查时间:">
                    <span>{{ props.row.recordDate }}</span>
                </el-form-item>
                <el-form-item label="作业项目:">
                    <span>{{ props.row.workItem }}</span>
                </el-form-item>
                <el-form-item label="可能后果:">
                    <span>{{ props.row.consequenceID }}</span>
                </el-form-item>
                <el-form-item label="对应体系要素:">
                    <span>{{ props.row.factorHSE }}</span>
                </el-form-item>
                <el-form-item label="对应安全沟通类型:">
                    <span>{{ props.row.factorObserver }}</span>
                </el-form-item>
                <el-form-item label="原因:">
                    <span>{{ props.row.factorSource }}</span>
                </el-form-item>
                <el-form-item label="归属部门:">
                    <span>{{ props.row.factorDepartment }}</span>
                </el-form-item>
                <el-form-item label="整改负责人:">
                    <span>{{ props.row.punish }}</span>
                </el-form-item>
                <el-form-item label="用工性质:">
                    <span>{{ props.row.employeeCharacter }}</span>
                </el-form-item>
                <el-form-item label="工种年龄:">
                    <span>{{ props.row.workSeniority }}</span>
                </el-form-item>
                <el-form-item label="岗位分类:">
                    <span>{{ props.row.position }}</span>
                </el-form-item>
                <el-form-item label="是否立即验收:">
                    <span>{{ props.row.ok }}</span>
                </el-form-item>
                <el-form-item label="所属专业:">
                    <span>{{ props.row.profession }}</span>
                </el-form-item>
                <el-form-item label="违章性质:">
                    <span>{{ props.row.regulationCharacter }}</span>
                </el-form-item>
                <el-form-item label="违章类别:">
                    <span>{{ props.row.type }}</span>
                </el-form-item>
                <el-form-item label="违章描述:">
                    <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="罚款:">
                    <span>{{ props.row.punish }}</span>
                </el-form-item>
             </el-form>
             </template>
          </el-table-column>
          <el-table-column prop='safeStaff_Name' label='检查人员'></el-table-column>
          <el-table-column prop='companyName' label='施工队伍'></el-table-column>
          <el-table-column prop='recordDate' label='检查时间'></el-table-column>        
          <el-table-column prop='regulationName' label='违章人员'></el-table-column>
          <el-table-column prop='regulationSource' label='隐患来源'></el-table-column>
          <el-table-column prop='punish' label='罚款'></el-table-column>
        </el-table>
          </el-row>
      </el-row>
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
                         clearable
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
                <el-form-item label="是否立即验收:">
                    <span>{{ props.row.ok }}</span>
                </el-form-item>
                <el-form-item label="隐患级别:">
                    <span>{{ props.row.rank }}</span>
                </el-form-item>
                <el-form-item label="隐患描述:">
                    <span>{{ props.row.description }}</span>
                </el-form-item>
           </el-form>
           </template>
          </el-table-column>
         <el-table-column prop='safeStaff_Name' label='检查人员'></el-table-column>
          <el-table-column prop='companyName' label='施工队伍'></el-table-column>
          <el-table-column prop='rank' label='隐患级别'></el-table-column>
          <el-table-column prop='reformPerson' label='整改负责人'></el-table-column>
          <el-table-column prop='dangerSource' label='隐患来源'></el-table-column>    
          <el-table-column prop='recordDate' label='检查时间'></el-table-column>        
          <!-- <el-table-column prop='consequenceID' label='可能后果'></el-table-column>    
          <el-table-column prop='factorHSE' label='对应体系要素'></el-table-column>    
          <el-table-column prop='factorDepartment' label='归属职能部门'></el-table-column>   
          <el-table-column prop='ok' label='是否立即验收'></el-table-column>     
          <el-table-column prop='factorSource' label='原因分析'></el-table-column>
          <el-table-column prop='limitDate' label='限期整改时间'></el-table-column>        
          <el-table-column prop='rank' label='隐患级别'></el-table-column>
          <el-table-column prop='description' label='隐患描述'></el-table-column>     -->
          <el-table-column
            fixed="right"
            label="操作"
            align='center'
            width="200">
            <template slot-scope="scope">
                <el-button v-show="!scope.row.reformCase" type="primary" icon="el-icon-search" plain size="small" @click="reciveInfo(scope.row)">验收</el-button>
                <el-button v-show="scope.row.reformCase === '已验收'" type="warning" icon="el-icon-edit" plain size="small" @click="goEdit(scope.row)">整改</el-button>
                <span v-show="scope.row.reformCase === '已整改'"  >已整改</span>
            </template>
            </el-table-column>
          </el-table>
          </el-row>
      </el-row>
      <el-dialog
            title="问题验收"
            :visible.sync="editShow"
            :close-on-click-modal='false'
            width="30%">
            <p>请提交证据图片：</p>
            <el-upload
                  action="/api/uploaddanger"
                  :on-success="handleAvatarSuccess"
                  :limit="2"    
                  :headers="header"        
                  :on-exceed="handleExceed"
                >
                <el-button size="small" type="primary">浏览文件</el-button>
                <span> 最多两张，格式为jpg,png,bmp</span>
                </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="editInfo">确 定</el-button>
            </span>
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
            style="width: 100%"
            max-height="590">
                    <el-table-column
                    prop="companyName"
                    width='250'
                    label="公司名称">
                </el-table-column>
                <!-- <el-table-column
                    prop="safeStaffName"
                    label="检查人">
                </el-table-column> -->
                  <el-table-column
                    prop="problemDescription"
                    label="问题描述">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    align='center'
                    width="200">
                    <template slot-scope="scope">
                        <el-button v-show="!scope.row.situation" type="primary" icon="el-icon-search" plain size="small" @click="recivePro(scope.row)">验收</el-button>
                        <el-button v-show="scope.row.situation === '已验收'" type="warning" icon="el-icon-edit" plain size="small" @click="goEditPro(scope.row)">整改</el-button>
                        <span v-show="scope.row.situation === '已整改'"  >已整改</span>
                    </template>
                    </el-table-column>       
            </el-table>
          </el-row>
      </el-row>
  </div>
</template>

<script> 
import { GetCurrentUser } from '@/store/CurrentUser'
import {queryDangerrecord,
        queryRegulationrecord,
        queryProblemDescription
} from '../../../services/hidden_danger_investigation/QHSETroubleCheckList'
import {problemVerification,
        updateDangerrecord,
        updateProblemDescription
} from '../../../services/hidden_danger_investigation/problemVerify'
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
            reformForm:{
               receptionDate:'',
               reformCase: ''
            },
           listcate: 'QHSE违章清单',
           date30:[],
           // 控制按钮 防止一直点击
           regulationBtn:false,
           proBtn:false,
           dangerBtn:false,
           editShow: false,
           fileNum:2,
           form:{}

       }
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
       reciveInfo (data) {
          this.reformForm.reformCase = '已验收'
          this.$confirm('确认提交验收情况吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(()=>{
            problemVerification(data.id,this.reformForm).then(res => {
                console.log(res)
                this.searchDanger()
            }).catch(err => {
                this.$message.error(err)
                this.dangerLoading = false
                this.dangerBtn = false
            })
        })
       },
       goEdit(data){
          this.editId = data.id
          this.editShow = true
          this.form = {...data}
       },
       editInfo() {
           let _this = this
           if(_this.fileNum === 2){
               _this.$message.warning('请至少提交一个证明附件！')
               return
           } 
           
          _this.reformForm.reformCase = '已整改'
          _this.$confirm('确认提交整改情况吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(()=>{
        problemVerification(_this.editId,_this.reformForm).then(() => {
                return updateDangerrecord(_this.editId,_this.form)          
            })
        }).then((res) => {
            // 推送新状态
            if(res.code === 1000) 
            this.searchDanger()
        }).catch(err => {
                this.$message.error(err)
            })
          
       },
       // 问题验证
       // 验收
       recivePro(data){
          this.$confirm('确认提交验收情况吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=> {
           updateProblemDescription(data.qHSE_AuditProblemRecord_ID,{situation:'已验收'}).then(res => {
               console.log(res)
               this.getProblemDescription()
           })
        })
        .catch(err => {
                this.$message.error(err)
            })
       },
       // 整改
       goEditPro(data){
           this.$confirm('确认提交整改情况吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=> {
           updateProblemDescription(data.qHSE_AuditProblemRecord_ID,{situation:'已整改'}).then(res => {
               console.log(res)
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
            _this.dangerLoading = true        
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
            _this.dangerBtn = true
           baseurl  = _this.getUrl('/api/query_dangerrecord',form)
           queryDangerrecord(baseurl,form).then(res => {
               _this.dangerrecord = res.data.list
               console.log(res.data)
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
       searchRegulation () {
        let baseurl 
            let form = {}
            let start,end         
            let _this = this
            _this.regulationrecordLoading = true
            if (_this.date) {
               start = _this.date[0]
               end = _this.date[1]
               form.startDate = start
               form.endDate = end
            } else{
               form.startDate = _this.date30[0]
               form.endDate = _this.date30[1]
            }
            if (_this.checkForm.companyId.length !== 0) {
                form.companyId = _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
            }
            _this.regulationBtn = true
           baseurl  = _this.getUrl('/api/query_regulationrecord',form)
           queryRegulationrecord(baseurl,form).then(res => {
               if(res.data.list.length === 0) {
                   this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });
                    console.log(1)

               }
               _this.regulationrecord = res.data.list
                  _this.regulationrecordLoading = false
                   _this.regulationBtn = false
           }).catch(err => {
              this.$message.error(err)
              _this.regulationrecordLoading = false
              _this.regulationBtn = false
          })
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
            _this.problemLoading = true
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
       this.searchRegulation()

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