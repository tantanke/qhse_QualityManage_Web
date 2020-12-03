<template>
  <div class="messageBox">
  <el-dropdown >
   <el-badge :value="0" :max="99" class="item">
  <i class="el-icon-chat-dot-round"></i>
</el-badge>
  <el-dropdown-menu ref="msgList" slot="dropdown">
    <el-dropdown-item  class="titleContent">
    <span class="title">我的消息</span><i class="el-icon-message"></i>
    </el-dropdown-item>
    <el-dropdown-item class="content"  >
    <div class="content-item" @click="seeDetail">
    <el-row >
    <el-col :span='17' class="ctitile">
     <i class="el-icon-info"></i> 我是标题
     </el-col>
      <el-col style="text-align:center" :span='3'>
       <span :style="readColor">未读</span>
     </el-col>
    </el-row>
    <el-row>
       <el-col :span='15' class="reason"> <i class="el-icon-question"></i>审核录入被打回</el-col>    
    <el-col :offset="1" :span='7' class="ttime">{{"2020/12/21"}}</el-col>
    </el-row>
    <el-row class="ccontent">
    &nbsp;&nbsp;&nbsp;&nbsp;222
    </el-row>
    </div>
    </el-dropdown-item>
     
    <el-dropdown-item class="morebtn">
    <el-button type='primary' @click="gomore" plain icon='el-icon-circle-plus-outline' class="more">更多消息</el-button>
    </el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>

  <el-dialog
  :close-on-click-modal='false'
  :visible.sync="dialogVisible"
  width="30%">
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

  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import {getReceiveMessageList,readMessage} from "../services/messageApi"
export default {
data() {
  return {
     dialogVisible:false,
     //已读未读处理
     readColor:{
       color: "red"
     },
     //仅记录一个数组
     messageList:[
       
     ]
  }
},
methods: {
  // 获取第一页的消息
  getMessage(){
     getReceiveMessageList(1).then(res => {
       console.log(res)
     })
  },
  gomore(){
    this.$router.push({name: 'moreMsg'})
  },
  seeDetail(){
     this.dialogVisible = true
  }
},
mounted() {
  this.getMessage()
  //默认为12 每增加一个+6 最多为24
  this.$refs.msgList.$el.style.height ="24vw";
  //超过三个设置为 scroll 最多显示六条
  // this.$refs.msgList.$el.style.overflowY ="scroll";
},
}
</script>

<style lang='scss' scoped>
.messageBox{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  cursor: pointer;
}
.box-card{
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

.el-dropdown-menu{
   width:15vw;
   overflow-x:hidden;
   .titleContent{
     pointer-events: none;
     height: 3vw;
     line-height: 3vw;
     .title{
       font-size: 1.2vw;
     }
     i{
       font-size: 0.8vw;
       margin-left: 5%;
     }
     
   }
   .more{      
       width: 100%;
     }
    .content-item{
      width: 100%;
    }
     .content{
       width: 100%;
      .content-item{
       overflow: hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/* 超出部分显示省略号 */
        white-space: nowrap;/*规定段落中的文本不进行换行 */
        width: 100%;;/*需要配合宽度来使用*/
        font-size: 16px;
        margin-top: 2px;
               margin-bottom: 10%;
        .ctitile{
          font-size: 1vw;
          font-weight: 600;
          margin-bottom: 2%;
          overflow: hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/* 超出部分显示省略号 */
        white-space: nowrap;/*规定段落中的文本不进行换行 */
        }
        .reason{
          color: #9F9F9F;
           overflow: hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/* 超出部分显示省略号 */
        white-space: nowrap;/*规定段落中的文本不进行换行 */
        }
        .ccontent{
           overflow: hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/* 超出部分显示省略号 */
        white-space: nowrap;/*规定段落中的文本不进行换行 */
        }
        .ttime{
          color: gainsboro;
          font-size: 0.7vw;
        }
      }
     }
  }
</style>