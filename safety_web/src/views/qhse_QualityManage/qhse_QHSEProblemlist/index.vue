<template>
  <div class="problemList">
      <el-row >
          <div class="page-title" style="width:100%">QHSE违章清单</div>
          <el-row style="height:350px">
         <el-table
          :data='regulationrecord'
          style="width: 100%"
          max-height="300">
          <el-table-column prop='checkId' label='检查ID'></el-table-column>
          <el-table-column prop='id' label='违章ID'></el-table-column>
          <el-table-column prop='checkType' label='检查类型'></el-table-column>
          <el-table-column prop='companyId' label='公司ID'></el-table-column>
          <el-table-column prop='consequenceID' label='事故ID'></el-table-column>
          <el-table-column prop='safeStaff_ID' label='检查员ID'></el-table-column>        
          <el-table-column prop='ok' label='整改情况'></el-table-column>
          <el-table-column prop='type' label='违章性质'></el-table-column>
          </el-table>
          </el-row>
      </el-row>
      <el-row > 
          <div class="page-title" style="width:100%">QHSE隐患清单</div>
          <el-row style="height:350px">
          <el-table
          :data='regulationrecord'
          style="width: 100%"
          max-height="350">
          <el-table-column prop='checkId' label='检查ID'></el-table-column>
          <el-table-column prop='id' label='隐患ID'></el-table-column>
          <el-table-column prop='checkType' label='检查类型'></el-table-column>
          <el-table-column prop='companyId' label='公司ID'></el-table-column>
          <el-table-column prop='consequenceID' label='事故ID'></el-table-column>
          <el-table-column prop='safeStaff_ID' label='检查员ID'></el-table-column>        
          <el-table-column prop='ok' label='整改情况'></el-table-column>
          <el-table-column prop='type' label='隐患性质'></el-table-column>
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