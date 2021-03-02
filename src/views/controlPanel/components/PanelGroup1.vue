<template>
  <el-row :gutter="40" class="panel-group">
    <link rel="stylesheet/scss" media="screen and (max-device-width:1440px)">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-accident">
          <i class="iconfont icon-shigutongjikuaibao" style="font-size:50px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">事故总数</div>
          <!--  :end-val 和 :start-val 会自动判断计数和倒数,:duration是指完成动画的时间-->
          <count-to :start-val="0" :end-val="this.accidentTotalNum" :duration="3000" class="card-panel-num"/>  
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-event">
          <i class="iconfont icon-shijiantongji" style="font-size:50px"></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">事件总数</div>
          <count-to :start-val="0" :end-val="this.eventTotalNum" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-problem">
          <i class="iconfont icon-stats-wenti" style="font-size:50px" ></i>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">问题总数</div>
          <count-to :start-val="0" :end-val="this.problemTotalNum" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {GetTotalNum} from '../../../services/controlPanel.js'
import {GetTotalData} from '../../../services/controlPanel.js'

import CountTo from 'vue-count-to'
//引入iconfont
const DefaultQueryAccident = {
  pageName: '事故',
}
const DefaultQueryEvent = {
  pageName: '事件',
}

export default {
  components: {
    CountTo
  },
  data() {
    return {
      accidentTotalNum:null, //这里不能使用“ '' ”，数字必须使用null或者初始为0 ；
      eventTotalNum:null,
      problemTotalNum:null
    }
  },
  mounted(){
    this.handleGetAccidentTotalData()
    this.handleGetEventTotalData()
    this.handleGetProblemTotalData()
  },
  methods: {
    handleGetAccidentTotalData(){
      this.filterQuery = {...DefaultQueryAccident, ...this.$route.query}
      this.filterQuery = {...this.filterQuery}
      this.loading = true
      GetTotalNum(this.filterQuery).then((res) => {
        if(res.data.count){
          this.accidentTotalNum = res.data.count
        }else{
          this.accidentTotalNum = 0
        }
      })
    },
    handleGetEventTotalData(){
      this.filterQuery = {...DefaultQueryEvent, ...this.$route.query}
      this.filterQuery = {...this.filterQuery}
      this.loading = true
      GetTotalNum(this.filterQuery).then((res) => {
        if(res.data.count){
          this.eventTotalNum = res.data.count
        }else{
          this.eventTotalNum = 0
        }
      })
    },
    handleGetProblemTotalData(){
      GetTotalData().then((res) => {
        if(res.data.checkCount){
          this.problemTotalNum = res.data.checkCount
        }else{
          this.problemTotalNum = 0
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
      .icon-accident {
         background: #40c9c6;
      }
      .icon-problem {
        background: #36a3f7;
      }
      .icon-event {
        background: #f4516c;
      }
      .icon-login {
        background: #34bfa3
      }
    }
    .icon-accident {
      color: #40c9c6;
    }
    .icon-problem {
      color: #36a3f7;
    }
    .icon-event {
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
