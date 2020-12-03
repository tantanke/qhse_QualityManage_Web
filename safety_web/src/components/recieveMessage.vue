<template>
  <div class="messageBox">
    <el-dropdown>
      <el-badge :value="noreadCount" :max="10" class="item">
        <i class="el-icon-chat-dot-round"></i>
      </el-badge>
      <el-dropdown-menu ref="msgList" slot="dropdown">
        <el-dropdown-item class="titleContent">
          <span class="title">我的消息</span><i class="el-icon-message"></i>
        </el-dropdown-item>
        <el-dropdown-item
          class="content"
          v-for="item in messageList"
          :key="item.id"
        >
          <div class="content-item" @click="seeDetail(item)">
            <el-row>
              <el-col :span="17" class="ctitile">
                <i class="el-icon-info"></i>{{ item.tittle }}
              </el-col>
              <el-col style="text-align:center" :span="3">
                <span v-show="item.status === '未读'" style="color:red">{{
                  item.status
                }}</span>
                <span v-show="item.status === '已读'" style="color:green">{{
                  item.status
                }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="15" class="reason">
                <i class="el-icon-question"></i>{{ item.source }}</el-col
              >
            </el-row>
            <el-row>
              <el-col :offset="2" :span="7" class="ttime">{{
                item.time
              }}</el-col>
            </el-row>
            <el-row>
              <div class="ccontent">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ item.body }}
              </div>
            </el-row>
          </div>
        </el-dropdown-item>

        <el-dropdown-item class="morebtn">
          <el-button
            type="primary"
            @click="gomore"
            plain
            icon="el-icon-circle-plus-outline"
            class="more"
            >更多消息</el-button
          >
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-card class="box-card">
        <div slot="header">
          <div class="dtitle">
            <span>{{ detail.tittle }}</span>
          </div>
        </div>
        <div>
          <p>发送时间：{{ detail.time }}</p>
          <div class="source">来源：{{ detail.source }}</div>
          <div class="content">&nbsp;&nbsp;&nbsp;&nbsp;{{ detail.body }}</div>
        </div>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getReceiveMessageList,
  readMessage,
  getReceiveMessageCnt,
} from "../services/messageApi";
export default {
  data() {
    return {
      dialogVisible: false,
      //已读未读处理
      readColor: {
        color: "red",
      },
      //仅记录一个数组
      messageList: [],
      detail: {
        source: "",
        body: "",
        status: "",
        time: "",
        tittle: "",
      },
      noreadCount: 0,
    };
  },
  methods: {
    // 获取第一页的消息
    getMessage() {
      this.messageList = []
      getReceiveMessageList(1)
        .then((res) => {
          res.data.list.forEach((item) => {
            if (item.status === "未读") {
              this.messageList.push(item);
            }
            let height =  this.messageList.length * 6 > 12 ? 12 : this.messageList.length * 6 
            console.log(height)
            this.$refs.msgList.$el.style.height =
              12 + height + "vw"
          });
        })
        .catch(() => {
          this.$message.error("获取消息失败，请稍后再试！");
        });
      getReceiveMessageCnt()
        .then((res) => {
          this.noreadCount = res.data;
          console.log(res);
        })
        .catch(() => {
          this.$message.error("获取消息失败，请稍后再试！");
        });
    },
    gomore() {
      this.$router.push({ name: "moreMsg" });
    },
    seeDetail(data) {
      let _this = this;
      _this.detail.source = data.source;
      _this.detail.body = data.body;
      _this.detail.status = data.status;
      _this.detail.time = data.time;
      _this.detail.tittle = data.tittle;
      this.dialogVisible = true;
      //发送已读通知
      if (data.status === "未读") {
        readMessage({messageId:data.id})
          .then((res) => {
            console.log(res);
            this.getMessage();
          })
          .catch(() => {
            this.$message.error("更新消息失败，请稍后再试！");
          });
      }
    },
  },
  mounted() {
    this.getMessage();
    //默认为12 每增加一个+6 最多为24
    
      
    //超过三个设置为 scroll 最多显示六条
    // this.$refs.msgList.$el.style.overflowY ="scroll";
  },
};
</script>

<style lang="scss" scoped>
.messageBox {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  cursor: pointer;
}
.box-card {
  background-color: #eff5fb;
  width: 100%;
  .dtitle {
    font: bold 20px "lucida Grande", Verdana, "Microsoft YaHei";
  }
  .source {
    border-bottom: 1px solid #dcdcdc;
    height: 2vw;
  }
  .content {
    margin-top: 2%;
    width: 100%;
    font: 16px "lucida Grande", Verdana, "Microsoft YaHei";
  }
}

.el-dropdown-menu {
  width: 15vw;
  overflow-x: hidden;
  .titleContent {
    pointer-events: none;
    height: 3vw;
    line-height: 3vw;
    .title {
      font-size: 1.2vw;
    }
    i {
      font-size: 0.8vw;
      margin-left: 5%;
    }
  }
  .more {
    width: 100%;
  }
  .content-item {
    width: 100%;
  }
  .content {
    width: 100%;
    .content-item {
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      width: 100%; /*需要配合宽度来使用*/
      font-size: 16px;
      margin-top: 2px;
      margin-bottom: 10%;
      .ctitile {
        font-size: 1vw;
        font-weight: 600;
        margin-bottom: 2%;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
      .reason {
        color: #9f9f9f;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
      .ccontent {
        width: 90%;
        height: 1.3 vw;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
      .ttime {
        color: gainsboro;
        font-size: 0.7vw;
      }
    }
  }
}
</style>
