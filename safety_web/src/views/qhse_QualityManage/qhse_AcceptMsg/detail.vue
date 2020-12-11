<template>
  <div >
  <div class="page-title" style="width:100%">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a @click="$router.go(-1)">我的消息</a></el-breadcrumb-item>
            <el-breadcrumb-item>详情查看</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="info">
    <el-card class="box-card">
  <div slot="header">
  <div class="dtitle"><span>{{detail.tittle}}</span></div>
  </div>
  <div >
  <p>状态：{{detail.status}}</p>
  <p>发送时间：{{detail.time}}</p>
  <p v-show="detail.readTime">阅读时间：{{detail.readTime}}</p>
  <div class="source" >来源：{{detail.source}}</div>
    <div  class="content">&nbsp;&nbsp;&nbsp;&nbsp;{{detail.body}}</div>
  </div>
</el-card>
    </div>
    <div class="content">
    
    </div>
  </div>
</template>

<script>
export default {
data() {
  return {
    detail:''
  }
},
mounted() {
  this.detail = this.$route.params
  this.$emit('taskChange')
},
methods: {
  
},
}
</script>

<style lang='scss' scoped>

.info{
    margin: 0;
    padding: 0;
    height: 10vw;
    font-size: 16px;
    background-color: #EFF5FB;
}
.box-card{
    margin-top: 2%;
  background-color: #EFF5FB;
  width: 100%;
  .dtitle{
    font:bold 20px "lucida Grande",Verdana,"Microsoft YaHei";
  }
  .source{
      border-bottom:1px solid #DCDCDC;
      height: 2vw;
  }
    .content{
      margin-top: 2%;
      height: 15vw;
      width: 100%;
      font: 16px "lucida Grande",Verdana,"Microsoft YaHei";
  }
}

</style>