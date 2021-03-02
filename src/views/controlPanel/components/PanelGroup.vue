<template>
  <el-row :gutter="40" class="panel-group">
    <link rel="stylesheet/scss" media="screen and (max-device-width:1440px)">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-check">
          <i class="iconfont icon-anquanjianchaon" style="font-size:50px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">问题发现数</div>
          <!--  :end-val 和 :start-val 会自动判断计数和倒数,:duration是指完成动画的时间-->
          <count-to :start-val="0" :end-val="this.checkTotalNum" :duration="3000" class="card-panel-num"/>  
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-verify">
          <i class="iconfont icon-securityCode-b" style="font-size:50px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">通过验证数</div>
          <count-to :start-val="0" :end-val="this.verifyTotalNum" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-rectify">
          <i class="iconfont icon-anquanzhenggaion" style="font-size:50px" ></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">重大隐患数</div>
          <count-to :start-val="0" :end-val="this.severityTotalNum" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {GetTotalData} from '../../../services/controlPanel.js'
import CountTo from 'vue-count-to'
//引入iconfont

export default {
  components: {
    CountTo
  },
  data() {
    return {
      checkTotalNum:null, //这里不能使用“ '' ”，数字必须使用null或者初始为0 ；
      severityTotalNum:null,
      verifyTotalNum:null
    }
  },
  mounted(){
    this.handleGetTotalData()
  },
  methods: {
    handleGetTotalData(){
      GetTotalData().then((res) => {
        if(res.data.checkCount){
          this.checkTotalNum = res.data.checkCount
        }else{
          this.checkTotalNum = 0
        }
        if(res.data.rectiCount){
          this.severityTotalNum = res.data.importantCount
        }else{
          this.severityTotalNum = 0
        }
        if(res.data.verifyCount){
          this.verifyTotalNum = res.data.verifyCount
        }else{
          this.verifyTotalNum = 0
        }
      })
    }
  }
}
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped media="screen">
/*分辨率低于1440，采用下面的样式*/
    @media screen and (max-device-width:1440px){
        .card-panel-col{
          width: 33%
        }
    }
.icon {
   width: 1em; height: 1em;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
}
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-check {
         background: #40c9c6;
      }
      .icon-rectify {
        background: #36a3f7;
      }
      .icon-verify {
        background: #f4516c;
      }
      .icon-login {
        background: #34bfa3
      }
    }
    .icon-check {
      color: #40c9c6;
    }
    .icon-rectify {
      color: #36a3f7;
    }
    .icon-verify {
      color: #f4516c;
    }
    .icon-login {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
