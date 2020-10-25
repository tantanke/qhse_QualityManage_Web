<template>
  <div class="main" :style ="note">

</div>

</template>

<script>
export default {
  data() {
 return {
  note: {
  backgroundImage: "url(" + require("./img/bg.jpg") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%"
  },
 }
  }
}
</script>

<style lang='scss' scoped>
@import './style/bigScreen.scss'

</style>