<template>
  <dialog-container title="编辑" width="800px" @success="success">
    <el-form :model="form" label-width="120px" size="small">
      <el-form-item label="量化项">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="审核方式">
        <el-input v-model="form.auditMode"></el-input>
      </el-form-item>
      <el-form-item label="初始分数">
        <el-input v-model="form.initialScore"></el-input>
      </el-form-item>
      <el-form-item label="计算公式">
        <el-input v-model="form.formula"></el-input>
      </el-form-item>
      <el-form-item label="可能问题">
        <el-input v-model="form.problemDescription"></el-input>
      </el-form-item>
    </el-form>
  </dialog-container>
</template>

<script>
export default {
  props: {
    data: Object
  },
  data() {
    return {
      form: {
        name: null,
        auditMode: null,
        initialScore: 0,
        formula: null,
        problemDescription: null
      }
    };
  },
  created() {
    this.form = this.data;
  },
  methods: {
    success() {
      this.$http.put('http://39.98.173.131:7000/wlhse/api/v3/updateQHSEElement', this.form).then((response) => {
          this.$emit('success');
      })
    }
  }
}
</script>

<style>
</style>