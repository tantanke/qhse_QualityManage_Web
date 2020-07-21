<template>
  <div class="problemList">
      <el-row >
          <div class="page-title" style="width:100%">QHSE违章清单</div>
          <el-row style="height:370px">
         <el-table
          :data='regulationrecord'
          style="width: 100%"
          max-height="370">
          <el-table-column prop='safeStaff_Name' label='检查人员'></el-table-column>
          <el-table-column prop='companyName' label='施工队伍'></el-table-column>
          <el-table-column prop='recordDate' label='检查时间'></el-table-column>
          <el-table-column prop='workItem' label='作业项目'></el-table-column>
          <el-table-column prop='consequenceID' label='违章类别'></el-table-column>
          <el-table-column prop='factorHSE' label='对应体系要素'></el-table-column>        
          <el-table-column prop='ok' label='对应安全沟通类型'></el-table-column>
          <el-table-column prop='factoSource' label='原因'></el-table-column>
          <el-table-column prop='factorDepartment' label='归属部门'></el-table-column>
          <el-table-column prop='consequenceID' label='可能后果'></el-table-column>
          <el-table-column prop='factorObserver' label='安全沟通类型'></el-table-column>
          <el-table-column prop='punish' label='整改负责人'></el-table-column>
          <el-table-column prop='employeeCharacter' label='用工性质'></el-table-column>
          <el-table-column prop='profession' label='监督人员'></el-table-column>
          <el-table-column prop='workSeniority' label='工种年龄'></el-table-column>
          <el-table-column prop='position' label='岗位分类'></el-table-column>
          <el-table-column prop='approve' label='限制时间'></el-table-column>
          <el-table-column prop='ok' label='是否立即验收'></el-table-column>
          <el-table-column prop='regulationCharacter' label='违章性质'></el-table-column>
          <el-table-column prop='checkType' label='违章类别'></el-table-column>
          <el-table-column prop='affixName' label='附件名称'></el-table-column>
          <el-table-column prop='punish1' label='罚款'></el-table-column>
          <el-table-column prop='description' label='违章描述'></el-table-column>
          </el-table>
          </el-row>
      </el-row>
      <el-row > 
          <div class="page-title" style="width:100%">QHSE隐患清单</div>
          <el-row style="height:350px">
          <el-table
          :data='regulationrecord'
          style="width: 100%"
          max-height="370">
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

</style>