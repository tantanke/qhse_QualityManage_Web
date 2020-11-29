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
  <div class="dtitle"><span>我是标题</span></div>
  </div>
  <div >
  <p>发件人：xxxx</p>
  <p>发送时间：2020/10/28</p>
  <p>收件人：xxxx</p>
  <div class="source" >来源：审核录入</div>
    <div  class="content">&nbsp;&nbsp;&nbsp;&nbsp;我是内容</div>
  </div>
</el-card>
    </div>
    <div class="content">
    
    </div>
  </div>
</template>

<script>
export default {

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
      width: 100%;
      font: 16px "lucida Grande",Verdana,"Microsoft YaHei";
  }
}

</style>