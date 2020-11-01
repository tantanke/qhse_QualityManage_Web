<template>
  <el-row class="main" :style ="bg">
     <el-row class="head">
          <el-col class="title"  :span='5'>
            <p>安检院QHSE看板</p>
          </el-col>
          <el-col class="time"  :span='3'>
            <span>时间：{{nowTime}}</span>
          </el-col>
          <el-col class="buttons" :span='4'>
            <el-col :span='10'><i class="el-icon-arrow-right"></i><span>安全管理</span></el-col>
            <el-col :span='9'><i class="el-icon-arrow-right"></i><span>环保管理</span></el-col>
          </el-col>
     </el-row>
     <el-row class="main-item1">
      <el-col :span='12' class="rightContent">
      <el-row class="title">
        【质量管理】
      </el-row>
      <el-row class="qualityManage"  :style="progress">   
        <el-row class="contenTitle">质量报告计划进度</el-row>
        <el-row class="content">
          <el-col :span='6'>
              <ul>
                <li>总体完成情况</li>
                <li ><img src="./img/jiankong.png" alt=""></li>
                <li >本年累计完成</li>
                <li>{{100 + " "}}个</li>
                <li><img src="./img/yunwei.png" alt=""></li>
                <li>完成进度</li>
                <li>{{100 + " "}}%</li>
              </ul>
          </el-col>
           <el-col :span='18'>
               <el-row class='qualityManageChart'>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in listdata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
                 <el-col :span='17' class="zhuImage">
                   <el-row>
                     <el-col :span='4' style="color:#021151">.</el-col>
                     <el-col :span='6'  class="zhu1" :style="qualityzhu1">
                     </el-col>
                     <el-col :span='4' class="point">
                        <div class="finishrate"  plain style="color:#021151">.</div><span>20.2%</span>
                     </el-col>
                     <el-col :span='6' class="zhu2"  :style="qualityzhu2"></el-col>
                   </el-row>
                 </el-col>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in ratedata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
               </el-row>
               <el-row class='date'>2020.06</el-row>
               <el-row class='tags'>
                 
                 <el-col :span='8' style="color:#021151">.</el-col>
                    <el-col  :span='2'>
                      <el-button class="will"  plain></el-button><span>计划数</span>
                    </el-col>
                     <el-col :span='2'>
                      <el-button class="finish" plain></el-button><span>完成数</span>
                     </el-col>
                      <el-col :span='2'>
                        <el-button class="finishrate"  plain></el-button><span>完成率</span>
                      </el-col>
               </el-row>
           </el-col>
        </el-row>
      </el-row>
    </el-col>
      <el-col :span='12' class="leftContent">
      <el-row class="title">
        【记录仪管理】
      </el-row>
      <el-row class="recording"  :style="progress">    
        <el-row class="contenTitle">本月记录仪使用情况</el-row> 
        <el-row class='recordingManageChart'>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in listdata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
                 <el-col :span='17' class="zhuImage">
                   <el-row>
                     <el-col :span='4' style="color:#021151">.</el-col>
                     <el-col :span='4'  class="zhu1" :style="recordingzhu1">
                     </el-col>
                     <el-col :span='3' class="point">
                        <div class="finishrate"  plain style="color:#021151">.</div><span>20.2%</span>
                     </el-col>
                     <el-col :span='4'  class="zhu2" :style="recordingzhu2">
                     </el-col>
                     <el-col :span='3' style="color:#021151">.</el-col>
                     <el-col :span='4' class="zhu3"  :style="recordingzhu3"></el-col>
                   </el-row>                 
                 </el-col>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in ratedata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
               </el-row>
               <el-row class='tags'>                
                 <el-col :span='11' style="color:#021151">.</el-col>
                    <el-col  :span='3'>
                      <el-button class="will"  plain></el-button><span>领用数</span>
                    </el-col>
                     <el-col :span='3'>
                      <el-button class="finish" plain></el-button><span>正常开机数</span>
                     </el-col>
                      <el-col :span='3'>
                        <el-button class="jiankong"  plain></el-button><span>监控查看数</span>
                      </el-col>
                      <el-col :span='3'>
                        <el-button class="finishrate"  plain></el-button><span>使用比</span>
                      </el-col>
               </el-row>
      </el-row>
    </el-col>
     </el-row>
     <el-row class="main-item2">
        <el-row class="title">
          【标准进度管理】
        </el-row>
        <el-row class="mainContent">
          <el-col class="leftItem" :span='8'>
            <el-row class="item-title"></el-row>
            <el-row class="content" :style="progress"> 
               <el-row class="contenTitle">初稿完成进度</el-row> 
               <el-row class='qualityManageChart'>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in listdata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
                 <el-col :span='17' class="zhuImage">
                   <el-row>
                     <el-col :span='4' style="color:#021151">.</el-col>
                     <el-col :span='6'  class="zhu1" :style="firstzhu1">
                     </el-col>
                     <el-col :span='4' class="point">
                        <div class="finishrate"  plain style="color:#021151">.</div><span>20.2%</span>
                     </el-col>
                     <el-col :span='6' class="zhu2"  :style="firstzhu2"></el-col>
                   </el-row>
                 </el-col>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in ratedata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
               </el-row>
               <el-row class='date'>2020.06</el-row>
               <el-row class='tags'>
                 
                 <el-col :span='9' style="color:#021151">.</el-col>
                    <el-col  :span='3'>
                      <el-button class="will"  plain></el-button><span>计划数</span>
                    </el-col>
                     <el-col :span='3'>
                      <el-button class="finish" plain></el-button><span>完成数</span>
                     </el-col>
                      <el-col :span='3'>
                        <el-button class="finishrate"  plain></el-button><span>完成率</span>
                      </el-col>
               </el-row>
            </el-row>
          </el-col>
          <el-col class="midItem" :span='8'>
            <el-row  class="item-title"></el-row>
            <el-row class="content" :style="progress">
              <el-row class="contenTitle">评审通过进度</el-row> 
              <el-row class='qualityManageChart'>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in listdata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
                 <el-col :span='17' class="zhuImage">
                   <el-row>
                     <el-col :span='4' style="color:#021151">.</el-col>
                     <el-col :span='6'  class="zhu1" :style="passzhu1">
                     </el-col>
                     <el-col :span='4' class="point">
                        <div class="finishrate"  plain style="color:#021151">.</div><span>20.2%</span>
                     </el-col>
                     <el-col :span='6' class="zhu2"  :style="passzhu2"></el-col>
                   </el-row>
                 </el-col>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in ratedata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
               </el-row>
               <el-row class='date'>2020.06</el-row>
               <el-row class='tags'>
                 
                 <el-col :span='9' style="color:#021151">.</el-col>
                    <el-col  :span='3'>
                      <el-button class="will"  plain></el-button><span>计划数</span>
                    </el-col>
                     <el-col :span='3'>
                      <el-button class="finish" plain></el-button><span>完成数</span>
                     </el-col>
                      <el-col :span='3'>
                        <el-button class="finishrate"  plain></el-button><span>完成率</span>
                      </el-col>
               </el-row>
            </el-row>
          </el-col>
          <el-col class="rightItem" :span='8'>
            <el-row  class="item-title"></el-row>
            <el-row class="content" :style="progress">
              <el-row class="contenTitle">标准发布进度</el-row> 
              <el-row class='qualityManageChart'>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in listdata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
                 <el-col :span='17' class="zhuImage">
                   <el-row>
                     <el-col :span='4' style="color:#021151">.</el-col>
                     <el-col :span='6'  class="zhu1" :style="handoutzhu1">
                     </el-col>
                     <el-col :span='4' class="point">
                        <div class="finishrate"  plain style="color:#021151">.</div><span>20.2%</span>
                     </el-col>
                     <el-col :span='6' class="zhu2"  :style="handoutzhu2"></el-col>
                   </el-row>
                 </el-col>
                 <el-col :span='3'>
                   <ul v-for="(value,index) in ratedata1" :key="index">
                       <li><span>{{value}}</span></li>
                   </ul>
                 </el-col>
               </el-row>
               <el-row class='date'>2020.06</el-row>
               <el-row class='tags'>
                 
                 <el-col :span='9' style="color:#021151">.</el-col>
                    <el-col  :span='3'>
                      <el-button class="will"  plain></el-button><span>计划数</span>
                    </el-col>
                     <el-col :span='3'>
                      <el-button class="finish" plain></el-button><span>完成数</span>
                     </el-col>
                      <el-col :span='3'>
                        <el-button class="finishrate"  plain></el-button><span>完成率</span>
                      </el-col>
               </el-row>
            </el-row>
          </el-col>
        </el-row>
     </el-row>
</el-row>

</template>

<script>
import CurrentUser from '../../store/CurrentUser'
import {queryDashboardQualityManagement,queryDashboardRecorderManagement,queryDashboardScheduleManagement} from '@/services/qhseDashboard/index'
export default {
  data() {
 return {
  // 背景样式
  listdata1:[30000,24000,18000,12000,6000,0],
  ratedata1:['100%','80%','60%','40%','20%','0%',],
  bg: {
  backgroundImage: "url(" + require("./img/bg.jpg") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
  },
  // 质量管理背景
  quality: {
  backgroundImage: "url(" + require("./img/hdbj.png") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
  },
  // 质量柱状图数据 只需要获得已使用占总数的百分比填入
  qualityzhu1:{
    height: '80%',
    top: '20%'
  },
  qualityzhu2:{
    height: '70%',
    top: '30%'
  },
  // 记录管理
  recording: {
  backgroundImage: "url(" + require("./img/hdbj.png") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
  },
  // 记录管理柱状图
  recordingzhu1:{
    height: '80%',
    top: '20%'
  },
  recordingzhu2:{
    height: '70%',
    top: '30%'
  },
  recordingzhu3:{
    height: '60%',
    top: '40%'
  },
  // 进度管理背景
  progress: {
  backgroundImage: "url(" + require("./img/mbox1.png") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
  },

  //初稿完成进度
  firstzhu1:{
    height: '80%',
    top: '20%'
  },
  firstzhu2:{
    height: '80%',
    top: '20%'
  },
  //评审通过进度
  passzhu1:{
    height: '50%',
    top: '50%'
  },
  passzhu2:{
    height: '80%',
    top: '20%'
  },
  //标准发布进度
  handoutzhu1:{
    height: '70%',
    top: '30%'
  },
  handoutzhu2:{
    height: '80%',
    top: '20%'
  },
  icon1: {
  backgroundImage: "url(" + require("./img/jiankong.png") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
  },
  icon2s: {
  backgroundImage: "url(" + require("./img/yunwei.png") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
  },
  time:'加载中...'
 }
  },
  methods: {
    updateTime(){
      setInterval(()=>{
       let dd=new Date;
        //获取年月日，时分秒
        let y = dd.getFullYear();
        let m = dd.getMonth()+1;
        if(Number(m)<10){
          m = '0'+ m
        }
        let d = dd.getDate();
        if(Number(d)<10){
          d = '0'+ d
        }
        let h = dd.getHours();
        if(Number(h)<10){
          h = '0'+ h
        }
        let i = dd.getMinutes();
        if(Number(i)<10){
          i = '0'+ i
        }
        let s = dd.getSeconds();
        if(Number(s)<10){
          s = '0'+ s
        }
        this.time = y+"-"+m+"-"+d+"   "+h+":"+i+":"+s
      },1000)   
    },
    initQualityBarchart(){

    },
    initRecordingBarchart(){

    },
    initFirstBarchart(){

    },
    initPassBarchart(){

    },
    initHandBarchart(){

    },
      },
  computed: {
    nowTime() {
      return this.time
    }
  },
  mounted() {
    if(!CurrentUser.get()){
      this.$message.error('请登录!')
      this.$router.push({name: 'Login'})
    }
    this.updateTime()
    this.initQualityBarchart()
    this.initRecordingBarchart()
    this.initFirstBarchart()
    this.initPassBarchart()
    this.initHandBarchart()
  },
}
</script>

<style lang='scss' scoped>
@import './style/bigScreen.scss'

</style>