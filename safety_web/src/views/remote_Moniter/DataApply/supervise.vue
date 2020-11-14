<template>
<div>
        <div class="page-title" style="width:100%;justify-content: flex-start;">
          <span style="cursor: pointer;color: #ccc;" @click="gotoDataApply()">
            监控数据应
          </span>
          <span style="padding:0 20px">|</span>
          <span style="cursor: pointer;" >
            年度监控统计
          </span>
        </div>
        <div class="page-content"></div>
</div>
</template>
<script>
export default {
name:'',
components: {},
  data() {
    return {

    };
  },
  methods: {
gotoDataApply(){this.$router.push({
            name: 'DataApply',
            // 暂时不知道这里需要什么路径参数
            params: {}
        })}
  },
  mounted() {

  },
  }
</script>
<style lang='scss'>

</style>
