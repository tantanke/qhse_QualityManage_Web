<template>
  <div class="dashboard" style="height:100%"  >
  <swiper style="height:100%"  ref="mySwiper" :options="swiperOptions">
    <swiper-slide style="height:100%" > <safe-board @changeQuality='gosafe' @changeEnvir='goenvir' :date = 'nowdate'/> </swiper-slide>
    <swiper-slide> <environment-board :date = 'nowdate' @changeSafe='gosafe' @changeQuality='gosafe' /> </swiper-slide>
    <swiper-slide> <quailty-board @changeSafe='gosafe' @changeEnvir='goenvir' :date = 'nowdate' /> </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
  </div>
</template>

<script>
import CurrentUser from "../../store/CurrentUser";
export default {
  
  components: {
    quailtyBoard: () => import("./qualityboard"), //质量看板
    environmentBoard: () => import("./environment"), //环境看板
    safeBoard: () => import("./safeManage"), // 安全看板
  },
  data() {
    return {
      time:'',
      nowCompany:{},
      pageCount:1,
      direction:true, // true代表向左 false 代表向右
      bg: {
        backgroundImage: "url(" + require("./img/bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
       swiperOptions: {
          pagination: {
            el: '.swiper-pagination',
          },
        }
    }
  },
  methods: {
    gosafe(data){
      this.swiper.slideTo(data, 1000, true)
    },
    goenvir(data){
      this.swiper.slideTo(data, 1000, true)
    },
    goquality(data){
      this.swiper.slideTo(data, 1000, true)
    },
     autoChange(){
        setInterval(()=>{
               this.swiper.slideTo(this.pageCount, 1000, true)
              if(this.direction){
                this.pageCount++
              } else{
                this.pageCount--
              }
               if(this.pageCount > 2 ){
                  this.pageCount = 2
                  this.direction = false
               }
               if(this.pageCount < 0 ){
                   this.pageCount = 0
                  this.direction = true
               }
        },10000)
      },
      beginChange(){
        setTimeout(()=>{
          this.autoChange()
        },5000)
      },
      updateTime() {
      setInterval(() => {
        let dd = new Date();
        //获取年月日，时分秒
        let y = dd.getFullYear();
        let m = dd.getMonth() + 1;
        if (Number(m) < 10) {
          m = "0" + m;
        }
        let d = dd.getDate();
        if (Number(d) < 10) {
          d = "0" + d;
        }
        let h = dd.getHours();
        if (Number(h) < 10) {
          h = "0" + h;
        }
        let i = dd.getMinutes();
        if (Number(i) < 10) {
          i = "0" + i;
        }
        let s = dd.getSeconds();
        if (Number(s) < 10) {
          s = "0" + s;
        }
        this.time = y + "-" + m + "-" + d + "   " + h + ":" + i + ":" + s;
      }, 1000);
    },
  },
  computed: {
      swiper() {
        return this.$refs.mySwiper.$swiper
      },
      nowdate() {
        return this.time
      }
    },
    mounted() {
       if (!CurrentUser.get()) {
        this.$message.error("请登录!");
        this.$router.push({ name: "Login" });
      }
      console.log('Current Swiper instance object', this.swiper)
      this.nowCompany = this.$route.params
      this.updateTime()
      this.beginChange()
    }
};
</script>

<style lang="scss" scoped>
html{
  width: 100%; 
     height: 100%; 
    
       body{
          height: 100%;
         width: 100%;
         .dashboard{
           background-color: #0F5A8F;
            height: 100%;
         width: 100%;
         position: fixed;
         z-index: -999;
         }
       }
}
</style>
