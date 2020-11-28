<template lang="pug">
  <el-container class="layout-base" v-if="this.client==='android'">
    <el-aside style="width:0px" class="layout-aside">
      el-menu.layout-menu( @open="handleOpen" @close="handleClose" ,background-color="#545c64", text-color="#fff", active-text-color="#ffd04b", :default-active="activeNav", :router="true", :unique-opened="true")
        div(v-for='(nav, idx) in navs', :key='idx')
          el-submenu(v-if='nav.children && nav.children.length > 0', :index='nav.routeName')
            template(slot='title')
              .nav-text-inline
                img(:src="nav.icon", height="16")
                | {{nav.title}}
            el-menu-item(v-for='(child, i) in nav.children', :key='i', :index='child.routeName', :route='{name: child.routeName}') {{child.title}}
          el-menu-item(v-else, :index='nav.routeName', :route='{name: nav.routeName}')
            .nav-text-inline
              img(:src="nav.icon", height="16")
              | {{nav.title}}
    </el-aside>
    el-container
      el-main
        router-view
  </el-container>
  <el-container class="layout-base" v-else v-loading='changeS' element-loading-text="切换中">
    <el-aside style="width:200px" class="layout-aside">
      el-header.menu-header(height='60px')
        <el-col :span="6" style="padding-top:8px">
          //- img.logo(:src='imgs.Logo' )
        </el-col>
        <el-col :span="24" style="padding-left:10px">
          //- font 川庆钻探安全检查系统
          font  {{qhse}}
        </el-col>
        
      el-menu.layout-menu( :headers="{Authorization:currentUser.token}" @open="handleOpen" @close="handleClose" ,background-color="#545c64", text-color="#fff", active-text-color="#ffd04b", :router="true", :unique-opened="true")
      
        div(v-for='(nav, idx) in navs', :key='idx')
          el-submenu(v-if='nav.children && nav.children.length > 0', :index='nav.routeName')
            template(slot='title')
              .nav-text-inline
                i(:class="nav.icon")
                | {{nav.title}}
            div(v-for='(level2, idx2) in nav.children', :key='idx2')
                el-submenu(v-if='level2.children && level2.children.length > 0' :index="level2.routeName")
                    template(slot="title")  {{level2.title}}
                    el-menu-item(v-for='(level3, idx3) in level2.children', :key='idx3' , :index="level3.routeName" :route='{name: level3.routeName}')  {{level3.title}}
                el-menu-item(v-else , :index='level2.routeName', :route='{name: level2.routeName}') {{level2.title}}
          el-menu-item(v-else, :index='nav.routeName', :route='{name: nav.routeName}')
            .nav-text-inline
              i(class="el-icon-location")
              | {{nav.title}}
    </el-aside>
    el-container
      el-header.main-header
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span
        span 
        span
        span
        span
        span
        span
        span
        span
        span
        span 
        span
        span
        span
        span
        span
        span
        span
        span 
        span
        span
        span
        span
        <re-msg/>
          el-dropdown(@command='handleDropCommand')
            span.userClick
              font {{this.currentUser ? this.currentUser.userName : ''}}
              i.el-icon-arrow-down.el-icon--right
            el-dropdown-menu(slot='dropdown')
              el-dropdown-item(command='handleLogout')
                font 安全退出
              el-dropdown-item(command='changeSys')
                font 切换系统
              el-dropdown-item(command='goScreen')
                font 看板查看
      el-main
        <router-view/>
        <el-dialog title="请选择需要查看的单位" :visible.sync="dashBoardVisible" width="34%">
        <el-form :inline="true" >
        <el-select v-model="value" placeholder="请选择" style='width:80%' ref="company" filterable>
          <el-option v-for="(item,index) in listdata" :key="index":label="item.label":value="item.value">
          </el-option>
        </el-select>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dashBoardVisible = false">取 消</el-button>
            <el-button  type="primary" @click="changeScreen">确 定</el-button>
          </div>
        </el-dialog>
        
  </el-container>
  
</template>

<script>
// import {updateMessage,notReadMessage} from '../services/message'
import reMsg from "./recieveMessage"
import {GetqhseCompanytree} from '@/services/qhseDashboard/index'
import CurrentUser from '../store/CurrentUser'
import Logo from '../assets/resources/logo.jpg'
// import NAV_ITEMS from '../navis'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import {getTaskList} from "../services/taskList"
import {GetNaviByUserRole,logout,getModule} from '../services/navisBar'
// import IconDashBoard from '../assets/icons/dashboard.svg'
// import IconSystem from '../assets/icons/system.svg'
// import IconConfig from '../assets/icons/config.svg'
// import IconAnalysis from '../assets/icons/analysis.svg'
// // import IconPatrol from '../assets/icons/patrol.svg'
// import IconList from '../assets/icons/list.svg'
// // import IconEventAndAccident from '../assets/icons/EventAndAccident.svg'
// import IconStudyCase from '../assets/icons/StudyCase.svg'
// import IconPersonalCenter from '../assets/icons/personalCenter.svg'
// import IconReportManagement from '../assets/icons/report_management.svg'
// import IconQHSEQualityManage from '../assets/icons/QHSEQualityManage.svg'
import {GetCurrentUser} from '../store/CurrentUser'  //新增
Vue.use(VueCookies)

export default {
  components:{
      reMsg
  },
  data() {
    return {//记录即将去往的公司
    value:'',
      companyId:'',
      chooseItem:'',
      searchForm:{companyCode:''},
      companyList:[],
      listdata:[],
      dashBoardVisible: false,
      qhse:'QHSE管理系统',
      close1:false,
      changeS:false,
      close2:false,
      close3:false,
      taskFlag:false,
      dialogTableVisible:false,
      client:VueCookies.get("client"),
      // isCollapse: true,
      navs: [],
      imgs: {
        Logo
      },
      websock: null,//测试websocket
      information:{},
      addEventdialogVisible:false,
      messageText:'',
      messageDate:'',
      messageId:'',
      routerForm:{},
      value1:'',
      value2:'',
      timer:'',
      nav:'',
      //图片路径
      
    }
  },
  beforeMount () {
    this.checkUser()
  },
  mounted () {
   this.chooseSys()
    this.checkSys()
    //定时刷新消息数量
    if(this.timer){
      clearInterval(this.timer)
    }else{
      this.timer=setInterval(()=>{
       /*  this.getMessageCount() */
      },3600000)
    }
    /* this.getMessageCount() */
    window.onload = function(){
      if(!window.sessionStorage["tempFlag"]){
        VueCookies.remove("store-current-user")
        location.reload();   //不能省，强制跳到登陆页
      }else{
        window.sessionStorage.removeItem("tempFlag");
      }
    }
    window.onunload = function (){
      window.sessionStorage["tempFlag"] = true;
    }
    window.onbeforeunload = function (){
      window.sessionStorage["tempFlag"] = true;
    }
  },
  methods: {
    chooseSys(){
       if(this.$route.params.sysId === 0){
          this.goSafe()
       }
       if(this.$route.params.sysId === 1){
          this.goQuality()
       }
    },
    // 校验当前系统
    checkSys(){
      let sysCate = localStorage.getItem('sysCate')
      if(sysCate){
        if(sysCate === '安全'){
          this.goSafe()
        } else {
          this.goQuality()
        }
      }
    },
     handleChange(){
        this.searchForm.companyCode = this.chooseItem[this.chooseItem.length - 1] 
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
    goScreen(){
      this.getCompany()
    },
    changeSys() { 
      let _this = this
      if(_this.qhse == 'QHSE质量板块') {
        _this.$confirm("确定切换到QHSE安全板块吗?", '提示', {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type:"warning"
              })
              .then(() => {
              _this.goSafe()
              })
              }
          else {
           _this.$confirm("确定切换到QHSE质量板块吗?", '提示', {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type:"warning"
              })
              .then(() => {
               _this.goQuality()
              })
      }
    },
    goSafe() {
       let _this = this
      _this.changeS = true
      GetNaviByUserRole().then(res => {
         this.nav = res.data
         return getModule({type:0})
      })
      .then(res => {
        _this.navs = []      
        res.data.forEach(value => {
          for(let i = 0;i< _this.nav.length;i++){
              if(value === _this.nav[i].code) {
                _this.navs.push(_this.nav[i])
                break
              }
          }
        })
        localStorage.setItem('sysCate','安全')
        _this.qhse = 'QHSE安全板块'
         this.$router.push({name: 'mainPath'})
        _this.checkTaskList(_this.navs)
        console.log(_this.navs)
	if(_this.taskFlag){
		getTaskList().then(res=>{
			let notReceive=res.data.filter(item=>{
				return !item.receiveDate
			})
			if(notReceive.length>0){
				_this.$confirm('您当前有任务待处理,请前往待办任务确认!','待办任务提醒',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(()=>{
					this.$router.push({
						name:'TaskList'
					})
				})
			}
		})
	}
        _this.dialogTableVisible = false
        _this.changeS = false
      }).catch(err=>{
			this.$message.error(err.message)
		})
    },
    checkTaskList(tree){
	if(tree){
		for(var i=0;i<tree.length;i++){
			if(tree[i].code==='00010010'){
				this.taskFlag=true
				break
			}else{
				this.checkTaskList(tree[i].children)
			}
		}
	}
    },
    goQuality() {
      let _this = this
      _this.changeS = true
      GetNaviByUserRole().then(res => {
         this.nav = res.data
         return getModule({type:1})
      })
     .then(res => {
        _this.navs = []
        res.data.forEach(value => {
          for(let i = 0;i< _this.nav.length;i++){
              if(value === _this.nav[i].code) {
                _this.navs.push(_this.nav[i])
                break
              }
          }
        })
        localStorage.setItem('sysCate','质量')
        _this.qhse = 'QHSE质量板块'
         this.$router.push({name: 'mainPath'})
        _this.changeS = false
        _this.dialogTableVisible = false
      }).catch(err=>{
			this.$message.error(err.message)
		})
    },
    initWebSocket() {
      //初始化weosocket
      let user = GetCurrentUser();
      const wsuri = "ws://39.98.173.131:7000/wlhse/ws?token="+user.token; //ws地址
      this.websocket = new WebSocket(wsuri);
      this.websocket.onopen = this.websocketonopen;
      this.websocket.onerror = this.websocketonerror;
      this.websocket.onmessage = this.websocketonmessage;
      this.websocket.onclose = this.websocketclose;
    },
     websocketonopen() {//连接建立之后执行send方法发送数据
      console.log("WebSocket连接成功");
    },
    websocketonerror() {
      //错误
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      this.messageText=redata.data.messageText
      this.messageDate=redata.data.messageDate
      this.messageId=redata.data.messageId
      if(this.messageText=='{}')
      {
        this.addEventdialogVisible=false
      }else{
        this.addEventdialogVisible=true
      }
    },
    websocketsend(agentData) {
      //数据发送
      this.websock.send(agentData);
    },
    websocketclose() {
      //关闭
      // console.log("connection closed (" + e.code + ")");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    checkUser () {
      if (!this.currentUser) {
        // this.$message.error('请登录')
		logout().then(res=>{
			console.log(res)
		}).catch(err=>{
			this.$message.error(err.message)
		})
        this.$router.push({name: 'Login'})
      } 
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
    },
    //提交信息状态
    handleSubmit () {
      
    },
    getNavigation(){
        GetNaviByUserRole().then((res) => {
            if (res.code === 1000)
                this.nav = res.data
                console.log(this.navs)
        })
    }
  },
  computed: {
    activeNav () {
      let navs = this.navs
      let routeName = this.$route.name
      for (let nav of navs) {
        if (nav.children && nav.children.length > 0) {
          for (let child of nav.children) {
            if (child.routes.includes(routeName)) {
              return child.routeName
            }
          }
        } else {
          if (nav.routes.includes(routeName)) {
            return nav.routeName
          }
        }
      }
      return 'QHSEQualityStandardIndex'
    },
     currentUser(){
      return GetCurrentUser()
    },
  }

}
</script>

<style lang='scss' scoped>
.userClick{
      cursor: pointer;
    }
.chooseSys{
    background-color: #0070A2;
    position: absolute;
    left: 0vw;
    top: -2vw;
    width: 100%;
    height: 40vw;
  }
  .backimg{
     position: absolute;
     left: 25%;
     width: 60%;
    height: 39%;
  }
   .safeimg{
    position: absolute;
    left: 45%;
    top: 8%;
    width: 17%;
    height: 28%;
    cursor: pointer;
  }
   .qualityimg{
    position: absolute;
    left: 20%;
    top: 8%;
    cursor: pointer;
    width: 17%;
    height: 28%;
  }
.layout-base {
  background: #F4F4F4;
  height: 100vh;
  
   .changeSys{
     font-size:5px;color:gray;cursor:pointer
   }
  .layout-aside {
    overflow: hidden;
    background: #F4F4F4;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .menu-header {
      background: #fff;
      font-size: 17px;
      padding: 5px;
      line-height: 30px;
      font-weight: bold;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    
    .layout-menu {
      flex: 1 1;
      border: none;
      overflow-y: auto;

      .nav-text-inline {
        display: flex;
        align-items: center;
        img {
          margin-right: 8px;
          opacity: 0.7;
        }
      }
    }
  }
  .redPoint::before{
       display: inline-block;
       content: '';
       width: 8px;
       height: 8px;
       position: relative;
       top: -7px;
       left: 1px;
       border-radius: 50%;
       background-color: red;
  }
  .main-header {
    background: #fff;
    padding: 15px;
    line-height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  

}
 img.logo {
  height: 50px;
  margin-right: 10px;
}
</style>
