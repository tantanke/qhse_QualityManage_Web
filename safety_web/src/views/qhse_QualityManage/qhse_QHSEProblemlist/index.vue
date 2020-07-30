<template>
  <div class="problemList">
          <div class="page-title" style="width:100%">QHSE问题清单</div>
      <el-radio v-model="listcate" label="QHSE违章清单">QHSE违章清单</el-radio>
      <el-radio  v-model="listcate" label="QHSE隐患清单">QHSE隐患清单</el-radio>
      <el-radio  v-model="listcate" label="QHSE问题清单">QHSE问题清单</el-radio>
      <el-row v-if="listcate === 'QHSE违章清单'">
          <p style="width:100%">QHSE违章清单</p>
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
                        v-model="date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"                       
                        >
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                <el-button type="primary" @click="searchRegulation">开始查询</el-button>   
                </el-form-item>     
          </el-form>
          </el-row>
          <el-row style="height:370px" >
         <el-table
          type="expand"
          :data='regulationrecord'
          border
          style="width: 100%"
          max-height="735">
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
                <el-form-item label="违章类别:">
                    <span>{{ props.row.consequenceID }}</span>
                </el-form-item>
                <el-form-item label="对应体系要素:">
                    <span>{{ props.row.factorHSE }}</span>
                </el-form-item>
                <el-form-item label="对应安全沟通类型:">
                    <span>{{ props.row.factorObserver }}</span>
                </el-form-item>
                <el-form-item label="原因:">
                    <span>{{ props.row.factoSource }}</span>
                </el-form-item>
                <el-form-item label="归属部门:">
                    <span>{{ props.row.factorDepartment }}</span>
                </el-form-item>
                <el-form-item label="可能后果:">
                    <span>{{ props.row.consequenceID }}</span>
                </el-form-item>
                <el-form-item label="整改负责人:">
                    <span>{{ props.row.punish }}</span>
                </el-form-item>
                <el-form-item label="用工性质:">
                    <span>{{ props.row.employeeCharacter }}</span>
                </el-form-item>
                <el-form-item label="监督人员:">
                    <span>{{ props.row.profession }}</span>
                </el-form-item>
                <el-form-item label="工种年龄:">
                    <span>{{ props.row.workSeniority }}</span>
                </el-form-item>
                <el-form-item label="岗位分类:">
                    <span>{{ props.row.position }}</span>
                </el-form-item>
                <el-form-item label="限制时间:">
                    <span>{{ props.row.approve }}</span>
                </el-form-item>
                <el-form-item label="是否立即验收:">
                    <span>{{ props.row.ok }}</span>
                </el-form-item>
                <el-form-item label="违章性质:">
                    <span>{{ props.row.regulationCharacter }}</span>
                </el-form-item>
                <el-form-item label="违章类别:">
                    <span>{{ props.row.checkType }}</span>
                </el-form-item>
                <el-form-item label="违章描述:">
                    <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="罚款:">
                    <span>{{ props.row.punish1 }}</span>
                </el-form-item>
                <el-form-item label="附件名称:">
                    <span>{{ props.row.affixName }}</span>
                </el-form-item>
             </el-form>
             </template>
          </el-table-column>
          <el-table-column prop='safeStaff_Name' label='检查人员'></el-table-column>
          <el-table-column prop='companyName' label='施工队伍'></el-table-column>
          <el-table-column prop='recordDate' label='检查时间'></el-table-column>
          <el-table-column prop='workItem' label='作业项目'></el-table-column>
          <el-table-column prop='consequenceID' label='违章类别'></el-table-column>
          <el-table-column prop='factorHSE' label='对应体系要素'></el-table-column>        
          <el-table-column prop='factorObserver' label='对应安全沟通类型'></el-table-column>
          <el-table-column prop='factoSource' label='原因'></el-table-column>
          <el-table-column prop='factorDepartment' label='归属部门'></el-table-column>
          <el-table-column prop='consequenceID' label='可能后果'></el-table-column>
          <el-table-column prop='punish' label='整改负责人'></el-table-column>
          <el-table-column prop='employeeCharacter' label='用工性质'></el-table-column>
          <el-table-column prop='profession' label='监督人员'></el-table-column>
          <el-table-column prop='workSeniority' label='工种年龄'></el-table-column>
          <el-table-column prop='position' label='岗位分类'></el-table-column>
          <el-table-column prop='approve' label='限制时间'></el-table-column>
          <el-table-column prop='regulationCharacter' label='违章性质'></el-table-column>
          <el-table-column prop='checkType' label='违章类别'></el-table-column>
          <el-table-column prop='punish1' label='罚款'></el-table-column>
          <el-table-column prop='description' label='违章描述'></el-table-column>
          </el-table>
          </el-row>
      </el-row>
      <el-row v-else-if="listcate === 'QHSE隐患清单'"> 
          <p  style="width:100%">QHSE隐患清单</p>
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
                        >
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                <el-button type="primary" @click="searchDanger">开始查询</el-button>   
                </el-form-item>     
          </el-form>
          </el-row>
          <el-row style="height:350px">
          <el-table
          border
          :data='dangerrecord'
          style="width: 100%"
          max-height="735">
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
                    <span>{{ props.row.checkType }}</span>
                </el-form-item>
                <el-form-item label="对应体系要素:">
                    <span>{{ props.row.factorHSE }}</span>
                </el-form-item>
                <el-form-item label="原因分析:">
                    <span>{{ props.row.factoSource }}</span>
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
                <el-form-item label="监督人员:">
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
                <el-form-item label="附件名称:">
                    <span>{{ props.row.affixName }}</span>
                </el-form-item>
           </el-form>
           </template>
          </el-table-column>
          <el-table-column prop='safeStaff_Name' label='检查人员'></el-table-column>
          <el-table-column prop='companyName' label='施工队伍'></el-table-column>
          <el-table-column prop='location' label='位置区域'></el-table-column>
          <el-table-column prop='checkType' label='隐患类别'></el-table-column>
          <el-table-column prop='workItem' label='作业项目'></el-table-column>    
          <el-table-column prop='recordDate' label='检查时间'></el-table-column>    
          <el-table-column prop='consequenceID' label='可能后果'></el-table-column>    
          <el-table-column prop='factorHSE' label='对应体系要素'></el-table-column>    
          <el-table-column prop='factorDepartment' label='归属职能部门'></el-table-column>   
          <el-table-column prop='ok' label='是否立即验收'></el-table-column>     
          <el-table-column prop='factorSource' label='原因分析'></el-table-column>
          <el-table-column prop='limitDate' label='限期整改时间'></el-table-column>        
          <el-table-column prop='rank' label='隐患级别'></el-table-column>
          <el-table-column prop='profession' label='监督人员'></el-table-column>
          <el-table-column prop='description' label='隐患描述'></el-table-column>
          <el-table-column prop='reformPerson' label='整改负责人'></el-table-column>    
          </el-table>
          </el-row>
      </el-row>
      <el-row v-else-if="listcate === 'QHSE问题清单'">
          <p  style="width:100%">QHSE问题清单</p>
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
                        >             
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label='时间范围：' labelWidth='120px'>
                      <el-date-picker
                        v-model="checkForm.date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        >
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                <el-button type="primary" @click="searchQuestion">开始查询</el-button>   
                </el-form-item>     
          </el-form>
          </el-row>      
          </el-form>
          <el-row style="height:370px">
              <el-table></el-table>
          </el-row>
      </el-row>
  </div>
</template>

<script> 
import { queryDangerrecord,
        queryDangerrecordDate,
        queryDangerrecordTwo,
        queryDangerrecordCompany,
        queryRegulationrecord,
        queryRegulationrecordCompany,
        queryRegulationrecordTwo,
        queryRegulationrecordDate
} from '../../../services/hidden_danger_investigation/QHSETroubleCheckList'
import {GetqhseCompanytree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
export default {
   data() {
       return {
          pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
           date: '',
           regulationrecord: [],
           dangerrecord: [],
           serdata:{},
           companyList: [],
           checkForm: {
                companyId: null,
                startDate: null,
                endDate: null
            },
           listcate: 'QHSE违章清单'
       }
   },
   methods: {
       searchQuestion () {
        let _this = this
         // 查询全部
          if (!_this.checkForm.companyId && !_this.date) {
                queryRegulationrecord().then(res => {
                    this.regulationrecord = res.data.list
                }).catch(err => {
              this.$message.error(err)
          })
          } else if (_this.checkForm.companyId && !_this.date) {
              // 查询时间
                let data = this.checkForm.companyId.pop()
                queryRegulationrecordCompany({companyId:data}).then(res => {
                    this.regulationrecord = res.data.list
                    this.checkForm.companyId = null
                }).catch(err => {
              this.$message.error(err)
          })
          } else if (!_this.checkForm.companyId && _this.date) {
              // 查询公司
                let start = _this.date[0]
                let end = _this.date[1]
                queryRegulationrecordDate({startDate:start,endDate:end}).then(res => {
                    this.regulationrecord = res.data.list
                })
          } else if (_this.checkForm.companyId && _this.date) {
              // 都查询
              let data = this.checkForm.companyId.pop()           
              let start = _this.date[0]
              let end = _this.date[1]
              queryRegulationrecordTwo({startDate:start,endDate:end,companyId:data}).then(res => {
                  this.regulationrecord = res.data.list
                  this.checkForm.companyId = null
              })
              console.log(4)
          }
       },
       searchDanger () {
         let _this = this
         // 查询全部
          if (!_this.checkForm.companyId && !_this.date) {
                queryDangerrecord().then(res => {
                    this.dangerrecord = res.data.list
                }).catch(err => {
              this.$message.error(err)
          })
          } else if (_this.checkForm.companyId && !_this.date) {
              // 查询时间
                let data = this.checkForm.companyId.pop()
                queryDangerrecordCompany({companyId:data}).then(res => {
                    this.dangerrecord = res.data.list
                    this.checkForm.companyId = null
                }).catch(err => {
              this.$message.error(err)
          })
          } else if (!_this.checkForm.companyId && _this.date) {
              // 查询公司
                let start = _this.date[0]
                let end = _this.date[1]
                queryDangerrecordDate({startDate:start,endDate:end}).then(res => {
                    this.dangerrecord = res.data.list
                })
          } else if (_this.checkForm.companyId && _this.date) {
              // 都查询
              let data = this.checkForm.companyId.pop()           
              let start = _this.date[0]
              let end = _this.date[1]
              queryDangerrecordTwo({startDate:start,endDate:end,companyId:data}).then(res => {
                  this.dangerrecord = res.data.list
                  this.checkForm.companyId = null
              })
              console.log(4)
          }
       },
       searchRegulation () {
        let _this = this
         // 查询全部
          if (!_this.checkForm.companyId && !_this.date) {
                queryRegulationrecord().then(res => {
                    this.regulationrecord = res.data.list
                }).catch(err => {
              this.$message.error(err)
          })
          } else if (_this.checkForm.companyId && !_this.date) {
              // 查询时间
                let data = this.checkForm.companyId.pop()
                queryRegulationrecordCompany({companyId:data}).then(res => {
                    this.regulationrecord = res.data.list
                    this.checkForm.companyId = null
                }).catch(err => {
              this.$message.error(err)
          })
          } else if (!_this.checkForm.companyId && _this.date) {
              // 查询公司
                let start = _this.date[0]
                let end = _this.date[1]
                queryRegulationrecordDate({startDate:start,endDate:end}).then(res => {
                    this.regulationrecord = res.data.list
                })
          } else if (_this.checkForm.companyId && _this.date) {
              // 都查询
              let data = this.checkForm.companyId.pop()           
              let start = _this.date[0]
              let end = _this.date[1]
              queryRegulationrecordTwo({startDate:start,endDate:end,companyId:data}).then(res => {
                  this.regulationrecord = res.data.list
                  this.checkForm.companyId = null
              })
              console.log(4)
          }
       },
       getDangerrecord () {
          queryDangerrecord().then(res => {
              this.dangerrecord = res.data.list
              console.log(res)
          }).catch(err => {
              this.$message.error(err)
          })
       },
       getCompanyList () {
            GetqhseCompanytree().then(res => {
                this.companyList = res.data
                console.log(res)
            })
        },
        handleChange(value) {
        console.log(value);
        }
   },
   mounted() {
       this.getCompanyList()
       this.getDangerrecord()
       this.searchRegulation()
   },
}
</script>

<style lang='scss' scoped>
.table-expand {
    font-size: 0;
    
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    label {
    width: 90px;
    color: #99a9bf;
    }
   }
  }
</style>