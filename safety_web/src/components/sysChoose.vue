<template>
       <el-container>
          <!-- <el-header class="main-header">
            <el-row>
              <el-col :offset='1' :span='2'>
                <img class="logo" src="./img/logo.png"  alt="">
              </el-col>
              <el-col :offset='17' :span='3'>
                  <el-row class="userinfo">
                      <el-col :offset='19' :span='14'>
                          <i class="el-icon-s-custom"></i>
                          <el-dropdown @command='handleDropCommand'>
                            <span class="el-dropdown-link">
                               {{name}} <i class="el-icon-caret-bottom"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" >
                                <el-dropdown-item command='handleLogout'>安全退出</el-dropdown-item>
                            </el-dropdown-menu>
                             </el-dropdown>
                      </el-col>
                  </el-row>
              </el-col>
            </el-row>
          </el-header> -->
          <el-main class="sys-main" :style="back">
            <el-row >
              <el-col :offset='1' :span='4'>
                <img class="logo" src="./img/logo.png"  alt="">
              </el-col>
               <el-col :offset='17' :span='2' class="userinfo">
                          <i class="el-icon-s-custom"></i>
                          <el-dropdown @command='handleDropCommand'>
                            <span class="el-dropdown-link">
                               {{name}} <i class="el-icon-caret-bottom"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" >
                                <el-dropdown-item command='handleLogout'>安全退出</el-dropdown-item>
                            </el-dropdown-menu>
                             </el-dropdown>
                      </el-col>
            </el-row>
            <div  class="safe">
            <img  alt="" src="./img/safebtn.png" @click="safe()">
            </div>
            <div class="quality">
            <img   alt="" src="./img/qualitybtn.png" @click="quality()">
            </div>
          </el-main>
       </el-container>
</template>
<script>
import CurrentUser from '../store/CurrentUser'
import {logout} from '../services/navisBar'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
export default {
data() {
  return {
    back:{
           backgroundImage: "url(" + require("./img/back.png") + ")",
    },
    name:''
  }
},
mounted() {
    this.name = CurrentUser.get().employeeName
},
methods: {
  safe(){
    this.$router.push({  
        name:'mainPath',   
        params:{           
          sysId:0 , 
        }
      })
  },
      handleDropCommand (cmd) {
      this[cmd]()
    },
  handleLogout () {
      CurrentUser.clear()
      logout().then(res=>{
      console.log(res)
      }).catch(err=>{
        this.$message.error(err.message)
      })
      this.$router.push({name: 'Login'})
      this.$message.success('退出成功')
    },
  quality(){
    this.$router.push({  
        name:'mainPath',   
        params:{           
          sysId:1 , 
        }
      })
  }
},
}
</script>

<style lang="scss" scope>
body{
    width: 100%;
    height: 100%;
}
.el-container{
    height: 100%;
    width: 100%;
}

  .sys-main{
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: fixed;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      p{
        text-align: center;
      }
      img{
        width: 80%;
      }
      .userinfo{
        position: absolute;
        top: 20%;
        left: 22%;
        .el-icon-s-custom{
          font-size: 1.5vw;
          margin-right: 5px;
        }
        .el-dropdown-link{
          cursor: pointer;
            font-size: 0.9vw;
        }
      }
      .safe{ 
        width: 15%;
        height: 30%;
        position: absolute;
         top: 35%;
        left: 32.5%;
        img{
          position: absolute;
         top: 8%;
        left: 10%;
        cursor: pointer;
        }
        &:hover { 
          background-color: #8AB6EC;
         }
     }
     .quality{
       width: 15%;
       height: 30%;
        position: absolute;
         top: 35%;
        left: 50%;
         img{
          position: absolute;
         top: 8%;
        left: 10%;
        cursor: pointer;
        }
        &:hover { 
          background-color:#8AB6EC;
         }
        
     }
  }
</style>