<template>
    <el-row class="main" :style ="bg"  element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
     <el-row class="head">
       <el-col class="company"  :span='6'><span></span>
            <p>{{11}}</p>
          </el-col>
          <el-col class="title"  :span='4'>
            <p>QHSE看板</p>
          </el-col>
          <el-col class="time"  :span='3'>
            <span>时间：{{11}}</span>
          </el-col>
          <el-col class="buttons" :span='4'>
            <el-col :span='10'><i class="el-icon-arrow-right"></i><span>安全管理</span></el-col>
            <el-col :span='9'><i class="el-icon-arrow-right"></i><span>环保管理</span></el-col>
          </el-col>
     </el-row>
     <el-row class="main-item">
     <el-row class="main-item1">
     <el-row class="safeTitle">【安全管理】                                      </el-row>
      <el-col :span='12' class="leftContent">
      <el-row class="safeManage"  :style="safeManage">   
        <el-row class="contenTitle">事件指标完成进度</el-row>
        <el-row class="content">
          <el-col :span='5' class="conditon">
              <ul class="numbers">
                <li>总体完成情况</li>
                <li ><img src="./img/jiankong.png" alt=""></li>
                <li >本年累计完成</li>
                <li>{{11}}个</li>
                <li><img src="./img/yunwei.png" alt=""></li>
                <li>本年累计完成率</li>
                <li>{{11}}%</li>
              </ul>
          </el-col>  
          <el-col :span='19' class="zhuimg1">
          <el-col :span='20' class="left">
          <el-col class="thingszhu1" :style="eventChart1" :span='5'></el-col>
          <el-col  :span='1' class="ratepoint">
          <el-row :style="eventpoint">
          <p>{{11.11}}%</p>
          <div></div>
          </el-row>
          </el-col>
          <el-col class="thingszhu2" :style="eventChart2" :span='5'></el-col>

          </el-col>
          <el-col :span='4' class="right">
           <ul v-for="(v,index) in ratedata" :key="index">
             <li>{{v + "%"}}</li>
          </ul>
          </el-col>
          </el-col>  
          <el-row class="tags">
            <el-button class="want"></el-button>
            <span>事件指标</span>
            <el-button class="finish"></el-button>
            <span>实际完成事件</span>
            <el-button class="rate"></el-button>
            <span>完成率</span>
            </el-row>     
        </el-row>
        
      </el-row>
    </el-col>
    <el-col class="rightContent" :span = '12' :style="safeManage">
    <el-row class="contenTitle">违章指标完成进度</el-row>
    <el-row class="content">
          <el-col :span='5' class="conditon">
              <ul class="numbers">
                <li>总体完成情况</li>
                <li ><img src="./img/jiankong.png" alt=""></li>
                <li >本年累计完成</li>
                <li>{{11}}个</li>
                <li><img src="./img/yunwei.png" alt=""></li>
                <li>本年累计完成率</li>
                <li>{{11}}%</li>
              </ul>
          </el-col>  
          <el-col :span='19' class="zhuimg1">
          <el-col :span='20' class="left">
           <el-col class="regulationzhu1" :style="regulationChart1" :span='5'></el-col>
           <el-col  :span='1' class="ratepoint"> <!-- 输入top与height即可确定高度-->
          <el-row :style="regulationpoint">
          <p>{{11.11}}%</p>
          <div></div>
          </el-row>
          </el-col>
          <el-col class="regulationzhu2" :style="regulationChart2" :span='5'></el-col>
          </el-col>
          <el-col :span='4' class="right">
          <ul v-for="(v,index) in ratedata" :key="index">
             <li>{{v + "%"}}</li>
          </ul>
          </el-col>
          </el-col>  
          <el-row class="tags">
           <el-button class="want"></el-button>
            <span>违章指标</span>
            <el-button class="finish"></el-button>
            <span>实际完成纠违</span>
            <el-button class="rate"></el-button>
            <span>完成率</span>
            </el-row>     
        </el-row>
    </el-col>
     </el-row>
     <el-row class="main-item2">
     <el-col class="content1" :span='9' :style="safeManage">
     <el-row class="contenTitle duo">隐患指标完成进度</el-row>
         <el-row class="content">
          <el-col :span='7' class="conditon">
              <ul class="numbers">
                <li>总体完成情况</li>
                <li ><img src="./img/jiankong.png" alt=""></li>
                <li >本年累计完成</li>
                <li>{{11}}个</li>
                <li><img src="./img/yunwei.png" alt=""></li>
                <li>本年累计完成率</li>
                <li>{{11}}%</li>
              </ul>
          </el-col>  
          <el-col :span='17' class="zhuimg1">
          <el-col :span='24' class="left">
           <el-col class="dangerzhu1" :style="dangerChart1" :span='5'></el-col>
           <el-col  :span='1' class="ratepoint"> <!-- 输入top与height即可确定高度-->
          <el-row>
          <p>{{11.11}}%</p>
          <div></div>
          </el-row>
          </el-col>
          <el-col class="dangerzhu2" :style="dangerChart2" :span='5'></el-col>
          </el-col>
          </el-col>  
          <el-row class="tags">
           <el-button class="want"></el-button>
            <span>违章指标</span>
            <el-button class="finish"></el-button>
            <span>实际完成纠违</span>
            <el-button class="rate"></el-button>
            <span>完成率</span>
            </el-row>     
        </el-row>
     </el-col>
     <el-col class="content2" :span='9' :style="safeManage">
     <el-row class="contenTitle">安技项目管理</el-row>
       <el-row class="content">
          <el-col :span='7' class="conditon">
              <ul class="numbers">
                <li ><img src="./img/jiankong.png" alt=""></li>
                <li >项目总体经费</li>
                <li>使用进度</li>
                <li>{{11.21}}%</li>
              </ul>
          </el-col>  
          <el-col :span='17' class="zhuimg1">
          <el-col :span='24' class="left">
          <el-col :span='1'>
          <ul v-for="(v,index) in finishrate" :key="index">
          <li>{{v}}</li>
          </ul>
          </el-col>
           <el-col class="finishzhu1" :style="manageChart1" :span='5'><p>公司</p></el-col>
          <el-col class="finishzhu1" :style="manageChart2" :span='5'><p>科特</p></el-col>
          </el-col>
          </el-col>  
          <el-row class="tags">
           <el-button class="rate"></el-button>
            <span>项目级别</span>
            </el-row>     
        </el-row>
     </el-col>
     <el-col class="content3" :span='6' :style="safeManage">
     <el-row class="contenTitle">百万工时</el-row>
     <el-row class="item1">
     <el-col :span='6' class="ctitle1">
     <p><span>月</span>度</p>
     <p>累计工时</p>
     </el-col>
     <el-col :span='10' class="item2content">
     <p><span>111111</span><span>小时</span></p>
     </el-col>
     </el-row>
      <el-row class="item2" >
       <el-col :span='6' class="ctitle1">
     <p><span>2020年</span></p>
     <p>累计工时</p>
     </el-col>
     <el-col :span='10' class="item2content">
     <p><span>111111</span><span>小时</span></p>
     </el-col>
      </el-row>
     </el-col>
     </el-row>
     </el-row>
     </el-row>
</template>

<script>
export default {
  props:{
    date: String,
    company:String
  },
data() {
  return {
    nowdate:this.date,
    nowcompany:this.company,
    finishrate:[10,8,6,4,2,0],
    ratedata:[100,80,60,40,20,0],
     bg: {
      backgroundImage: "url(" + require("./img/bg.jpg") + ")",
      backgroundRepeat: "no-repeat",
      backgroundSize:"100% 100%",
  },
   safeManage: {
  backgroundImage: "url(" + require("./img/hdbj.png") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
  },
  // 事件完成指标
  eventChart1:{
    height:'10%',
    top:'90%'
  },
  eventChart2:{
    height:'10%',
    top:'90%'
  },
  //从最底下开始计算 -100代表100%
  eventpoint:{
    top:'-90%'
  },
   //违章指标完成进度
   regulationChart1:{
     height:'10%',
     top:'90%'
   },
    regulationChart2:{
     height:'10%',
     top:'90%'
   },
   regulationpoint:{
      top:'-90%'
   },
   // 隐患指标完成进度
   dangerChart1:{
     height:'10%',
     top:'90%'
   },
    dangerChart2:{
     height:'10%',
     top:'90%'
   },
   //安技项目管理
   manageChart1:{
     height:'20%',
     top:'80%'
   },
   manageChart2:{
      height:'10%',
     top:'90%'
   },
   //百万工时
   monthValue:'',
   yearValue:''
  }
},
}
</script>

<style lang="scss" scoped>
@import './style/safeManage.scss'
</style>