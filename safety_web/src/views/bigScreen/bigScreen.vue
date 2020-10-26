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
            </el-row>
          </el-col>
          <el-col class="midItem" :span='8'>
            <el-row  class="item-title"></el-row>
            <el-row class="content" :style="progress">
              <el-row class="contenTitle">评审通过进度</el-row> 
            </el-row>
          </el-col>
          <el-col class="rightItem" :span='8'>
            <el-row  class="item-title"></el-row>
            <el-row class="content" :style="progress">
              <el-row class="contenTitle">标准发布进度</el-row> 
            </el-row>
          </el-col>
        </el-row>
     </el-row>
</el-row>

</template>

<script>
export default {
  data() {
 return {
  // 背景样式
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
  // 记录管理
  recording: {
  backgroundImage: "url(" + require("./img/hdbj.png") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
  },
  // 进度管理背景
  progress: {
  backgroundImage: "url(" + require("./img/mbox1.png") + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize:"100% 100%",
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
    }
  },
  computed: {
    nowTime() {
      return this.time
    }
  },
  mounted() {
    this.updateTime()
  },
}
</script>

<style lang='scss' scoped>
@import './style/bigScreen.scss'

</style>