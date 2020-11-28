<template>
  <div class="messageBox">
  <el-dropdown>
   <el-badge :value="0" :max="99" class="item">
  <i class="el-icon-chat-dot-round"></i>
</el-badge>
  <el-dropdown-menu ref="msgList" slot="dropdown">
    <el-dropdown-item  class="titleContent">
    <span class="title">我的消息</span><i class="el-icon-message"></i>
    </el-dropdown-item>
    <el-dropdown-item class="content"  >
    <div class="content-item" @click="seeDetail">
    <el-row class="ctitile">
     <i class="el-icon-info"></i> 我是标题
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
  title="消息详情"
  :visible.sync="dialogVisible"
  width="30%">
  
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
data() {
  return {
     dialogVisible:false
  }
},
methods: {
  gomore(){
    this.$router.push({name: 'moreMsg'})
  },
  seeDetail(){
     this.dialogVisible = true
  }
},
mounted() {
  console.log(this.$refs.msgList.$el.style.width)
  //默认为12 每增加一个+6 最多为24
  this.$refs.msgList.$el.style.height ="12vw";
  //超过三个设置为 scroll
  // this.$refs.msgList.$el.style.overflowY ="scroll";
},
}
</script>

<style lang='scss' scoped>
.messageBox{
  cursor: pointer;
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