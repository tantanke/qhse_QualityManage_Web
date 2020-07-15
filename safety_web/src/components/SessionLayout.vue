<template lang="pug">
.session-page
  .main-section
    slot
</template>

<script>
import CurrentUser from '../store/CurrentUser'

export default {
  name: 'SessionLayout',
  beforeCreate () {
    let currentUser = CurrentUser.get()
    if (currentUser) {
      this.$router.push({name: 'Home'})
    }
  }
}
</script>

<style lang='scss' scoped>
.session-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  background: linear-gradient(45deg, #4d4279, #43879b);

  .main-section {
    flex: 1 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
