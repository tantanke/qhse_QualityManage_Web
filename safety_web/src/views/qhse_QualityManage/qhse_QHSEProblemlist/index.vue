<template>
  <div class="problemList">
      <div class="page-title" style="width:100%">QHSE问题清单</div>
      <el-radio v-model="listcate" label="QHSE违章清单">QHSE违章清单</el-radio>
      <el-radio  v-model="listcate" label="QHSE隐患清单">QHSE隐患清单</el-radio>
      <el-row v-if="listcate === 'QHSE违章清单'">
          <p style="width:100%">QHSE违章清单</p>
          <el-row style="height:370px" >
         <el-table
          type="expand"
          :data='regulationrecord'
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
      <el-row v-else> 
          <p  style="width:100%">QHSE隐患清单</p>
          <el-row style="height:350px">
          <el-table
          :data='regulationrecord'
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
          <el-table-column prop='affixName' label='附件名称'></el-table-column>
          </el-table>
          </el-row>
      </el-row>
  </div>
</template>

<script>
import {queryDangerrecord,queryRegulationrecord} from '../../../services/hidden_danger_investigation/QHSETroubleCheckList'
export default {
   data() {
       return {
           regulationrecord: [],
           dangerrecord: [],
           serdata:{},
           listcate: 'QHSE违章清单'
       }
   },
   methods: {
       getDangerrecord () {
          queryDangerrecord().then(res => {
              this.dangerrecord = res.data.list
              console.log(res)
          }).catch(err => {
              this.$message.error(err)
          })
       },
       getRegulationrecord () {
           queryRegulationrecord().then(res => {
               this.regulationrecord = res.data.list
               console.log(res)
           }).catch(err => {
              this.$message.error(err)
           })
       }
   },
   mounted() {
       this.getDangerrecord()
       this.getRegulationrecord()
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