<template>
  <div class='problemVerify'>
       <div class="page-title" style="width:100%">QHSE问题验证</div>
       <el-row style="margin-bottom:20px">
      <el-radio v-model="listcate" label="QHSE违章清单">QHSE违章清单</el-radio>
      <el-radio  v-model="listcate" label="QHSE隐患清单">QHSE隐患清单</el-radio>
      <el-radio  v-model="listcate" label="QHSE问题清单" >QHSE问题清单</el-radio>
      </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listcate: 'QHSE违章清单',
    }
  },
  methods: {
    
  },
  mounted() {
    
  },
}
</script>

<style>

</style>