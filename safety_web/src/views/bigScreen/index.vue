<template>
  <div class="dashboard">
    <quailty-board />
    <!--<environment-board/>-->
    <!--<safe-board/> -->
  </div>
</template>

<script>
export default {
  components: {
    quailtyBoard: () => import("./qualityboard"), //质量看板
    environmentBoard: () => import("./environment"), //环境看板
    safeBoard: () => import("./safeManage"), // 安全看板
  },
};
</script>

<style lang="scss" scoped></style>
