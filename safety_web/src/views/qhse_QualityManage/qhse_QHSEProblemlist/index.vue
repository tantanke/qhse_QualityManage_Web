<template>
  <div class="problemList">

          <div class="page-title" style="width:100%">QHSE问题清单</div>
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
                <el-form-item>
                <el-button type="info" :disabled='regulationBtn' icon='el-icon-download'  @click="downloadRegulation">下载</el-button>   
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
                <el-form-item v-if="props.row.affix1" label="证据图片1:" >
                     <a target='_blank'  :href="'http://39.98.173.131:7000'+props.row.affix1">证据图片1</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix2" label="证据图片2:">
                    <a target='_blank'  :href="'http://39.98.173.131:7000'+props.row.affix2">证据图片2</a>
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
<!--           <el-table-column
            fixed="right"
            label="操作"
            align='center'
            width="200">
            <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" plain size="small" @click="deleteRegulation(scope.row)">删除</el-button>
            </template>
            </el-table-column> -->
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
                <el-form-item>
                <el-button type="info" :disabled='dangerBtn' icon='el-icon-download'  @click="dowmloadDanger">下载</el-button>   
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
                     <a target='_blank'  :href="'/api'+props.row.affix1">证据图片1</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix2" label="证据图片2:">
                    <a   target='_blank' :href="'/api'+props.row.affix2">证据图片2</a>
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
<!--           <el-table-column
            fixed="right"
            label="操作"
            align='center'
            width="200">
            <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" plain size="small" @click="deleteDanger(scope.row)">删除</el-button>
            </template>
            </el-table-column> -->
          </el-table>
          </el-row>
      </el-row>
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
                <el-button type="primary" @click="getProblemDescription" icon='el-icon-search' :disabled='proBtn'>查询</el-button>   
                </el-form-item>   
                 <el-form-item>
                <el-button type="info" :disabled='proBtn' icon='el-icon-download'  @click="downloadPro">下载</el-button>   
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
             <!-- <el-table-column
                    prop="recordDate"
                    label="检查时间">
                </el-table-column> -->
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
                <!-- <el-table-column
                fixed="right"
                label="操作"
                align='center'
                width="200">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" plain size="small" @click="deleteProblem(scope.row)">删除</el-button>
                </template>
                </el-table-column>       -->
            </el-table>
          </el-row>
      </el-row>
  </div>
</template>

<script> 
import {queryDangerrecord,
        queryRegulationrecord,
        queryProblemDescription,
} from '../../../services/hidden_danger_investigation/QHSETroubleCheckList'
import ExportJsonExcel from "js-export-excel";
import {GetqhseCompanytree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
export default {
   data() {
       return {
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
           listcate: 'QHSE违章清单',
           date30:[],
           // 控制按钮 防止一直点击
           regulationBtn:false,
           proBtn:false,
           dangerBtn:false
           // 控制频率

       }
   },
   methods: {
       //删除对应的问题/违章/隐患
       deleteRegulation(data){
         console.log(data)
       },
       deleteDanger(data){
          console.log(data)
       },
       deleteProblem(data){
          console.log(data)
       },
       // 下载模板文件
       downloadRegulation() {
           let _this = this
           if(_this.regulationrecord.length > 0) {
               let option = {}
               const priData = _this.regulationrecord
               option.filename = 'QHSE违章清单'
               option.datas = [{
							sheetData: priData,
                            sheetHeader: ['公司id','公司名称','可能后果','违章描述','用工性质','归属部门','对应体系要素'
                            ,'原因','违章id','验收情况','岗位分类','所属专业','罚款','记录时间','违章性质','违章人员id','违章人员',
                            '违章来源','检查人员id','检查人','分数','提交时间','违章类别','作业项目','工种年龄']
                        }];
                // 导出数据
                var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
           } else {
               _this.$message.warning('无记录可下载！')
           }
       },
       dowmloadDanger() {
            let _this = this
                    if(_this.dangerrecord.length > 0) {
                        let option = {}                 
                        const priData = _this.dangerrecord
                        option.filename = 'QHSE违章清单'
                        option.datas = [{
                                        sheetData: priData,
                                        sheetHeader: ['公司id','公司名称','可能后果','可能后果id','隐患来源','隐患描述','归属部门'
                                        ,'对应体系要素','原因分析','隐患id','限期整改时间','位置区域','所属专业','隐患级别','提交时间','整改负责人','整改负责人id','检查人员id',
                                        '检查人员','检查时间','隐患类别','作业项目']
                                    }];
                            // 导出数据
                            var toExcel = new ExportJsonExcel(option);
                            toExcel.saveExcel();
                    } else {
                        _this.$message.warning('无记录可下载！')
                    }
       },
       downloadPro () {

       },
       getRecentTime() {
          let date = new Date().getTime()
          let near = date + 60*60*1000*24*30
          let day = new Date(date).toISOString()
          let nearday = new Date(near).toISOString()
          this.date30.push(day.split('T')[0])
          this.date30.push(nearday.split('T')[0])    
          this.date = [...this.date30]
          this.dateQ = [...this.date30]
          this.dateH = [...this.date30]
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
                form.companyId = _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
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
   .imgUrl{
       cursor: pointer;
       color:blue
   }
  }
}

</style>