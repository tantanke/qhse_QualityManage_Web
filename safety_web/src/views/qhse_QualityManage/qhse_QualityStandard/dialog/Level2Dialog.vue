<template>
  <dialog-container title="编辑" width="800px" @success="success">
    <el-form :model="form" label-width="120px" size="small">
      <el-form-item label="项目">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content"></el-input>
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
        content: null
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