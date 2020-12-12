<template>
  <div>
  <div class="page-title" style="width:100%">我的消息</div>
 <el-table
     v-loading='tableloading'
    :data="tableData"
    @row-click="getdetail"
    max-height='625'
   style="padding:10px; border-top: 2px dashed #dddddd;width:100%">
    <el-table-column
      label="状态">
      <template slot-scope="scope">
      <el-button v-if = 'scope.row.status ==="已读"' type="success" plain>{{ scope.row.status }}</el-button>
      <el-button v-else type="danger" plain>{{ scope.row.status }}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="标题">
      <template slot-scope="scope">
        <i class="el-icon-info"></i>
        <span style="margin-left: 10px">{{ scope.row.tittle }}</span>
      </template>
    </el-table-column>
     <el-table-column
      label="来源">
      <template slot-scope="scope">
        <i class="el-icon-view"></i>
        <span style="margin-left: 10px">{{ scope.row.source }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="发送时间">
      <template slot-scope="scope">
        <i class="el-icon-s-promotion"></i>
        <span  style="margin-left: 10px">{{ scope.row.time }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="接收时间">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px" v-if="scope.row.readTime" >{{ scope.row.readTime }}</span>
        <span v-else style="margin-left: 10px">未读</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  background
  layout="prev, pager, next"
  @current-change="handleCurrentChange"
  :page-size="pageSize"
  :total="total">
</el-pagination>
  </div>
</template>

<script>
	import {
      getReceiveMessageList,
      readMessage,
	} from "../../../services/messageApi"
export default {
  props:{
      taskNum: Number
  },
  data() {
      return {
         pageNum:1,//默认第一页
         pageSize:1,
         total:1,
        tableData: [],
        tableloading: false,
        nowPage:1
      }
    },
  watch:{
     taskNum(){
        this.getMsg(this.nowPage)
     }
  },
  methods: {
    // 获取之后跳转
    getdetail(data){
      
      let _this = this
      if (data.status ) {
        readMessage({messageId:data.id})
          .then(() => {
            
          })
          .catch(() => {
            _this.$message.error("更新消息失败，请稍后再试！");
          });
      }
      //提示消息数量有变

      this.$router.push(
        {
          name:'moreMsgdetail',params: data
        })
        
    },
    handleCurrentChange(val) {
        this.nowPage = val
        this.getMsg(val)
      },
    getMsg(data){
      let _this = this
      _this.tableloading = true
      getReceiveMessageList(data).then(res =>{
        _this.pageSize = res.data.pageSize
        _this.total = res.data.total
        _this.tableloading = false
        _this.tableData = res.data.list
      })
    } 
  },
  mounted() {
     this.getMsg(this.nowPage)
     
  },
}
</script>

<style lang='scss' scoped>
.el-table{
  box-shadow: brown;
  border-radius: 10px;
  thead{
    color: black;
  }
}
.el-pagination{
  position: absolute;
  left: 45%;
  margin-top: 1%;
}
</style>