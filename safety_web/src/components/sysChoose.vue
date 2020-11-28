<template>
       <el-container>
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
            <img  alt="" src="./img/4.png" @click="safe()">
            </div>
            <div class="quality">
            <img   alt="" src="./img/3.png" @click="quality()">
            </div>
            <div class="dashboard" >
            <img   alt="" src="./img/1aa.png" @click="dashboard()">
            </div>
          </el-main>
          <el-dialog title="请选择需要查看的单位" :visible.sync="dashBoardVisible" width="34%">
        <el-form :inline="true" >
        <el-select v-model="value" placeholder="请选择" style='width:80%' ref="company" filterable>
          <el-option v-for="(item,index) in listdata" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dashBoardVisible = false">取 消</el-button>
            <el-button  type="primary" @click="changeScreen">确 定</el-button>
          </div>
        </el-dialog>
        <img :src="goback.Bback" style="display:none">
       </el-container>
</template>
<script>
import Bback from '../components/img/back.png'
import CurrentUser from '../store/CurrentUser'
import {GetqhseCompanytree} from '@/services/qhseDashboard/index'
import {logout} from '../services/navisBar'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
export default {
data() {
  return {
    dashBoardVisible:false,
    goback:{
      Bback
    },
    back:{
           backgroundImage: "url(" + require("./img/back.png") + ")",
    },
    name:'',
    routerForm:{},
    value:'',
    listdata:[]

  }
},
mounted() {
    this.name = CurrentUser.get().employeeName
},
methods: {
  dashboard(){
      this.getCompany()
    },
     async getList(data){
          data.forEach((item) => {
            if (!item.children) {
                  this.listdata.push({value:item.nodeCode,label:item.label})
                } else {
                    this.getList(item.children)
                }
          })
          return true
      },
    getCompany(){
       this.listdata = []
        GetqhseCompanytree().then(res =>{
               this.companyList = res.data
               console.log(res.data)
               this.listdata.push({value:res.data[0].nodeCode,label:res.data[0].label})
               return  this.getList(res.data)
               
        }).then(() => {
          console.log(this.listdata)
          this.dashBoardVisible = true
        })
        .catch((err) =>{
          this.$message.error(err.message)
        })
    },
  changeScreen(){
     this.routerForm = {}
        if(this.value !== '00'){
            this.routerForm.companyCode = this.value
            this.routerForm.companyName = this.$refs.company.selectedLabel
        }
        const {href} = this.$router.resolve({
        name: "qhseBigScreen",
        query: this.routerForm
        });
          window.open(href, '_blank');
  },
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
        width: 13%;
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
     .dashboard{
       width: 13.2%;
        height: 30%;
        position: absolute;
         top: 35%;
        left: 15%;
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
       width: 13%;
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