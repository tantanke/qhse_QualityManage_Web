<template>
  <div>
  <div class="page-title" style="width:100%">我的消息</div>
 <el-table
 
    :data="tableData"
    @row-click="getdetail"
    max-height='580'
   style="padding:10px; border-top: 2px dashed #dddddd;width:100%">
    <el-table-column
      label="状态">
      <template slot-scope="scope">
      <el-button type="success" plain>{{ scope.row.status }}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="标题">
      <template slot-scope="scope">
        <i class="el-icon-info"></i>
        <span style="margin-left: 10px">{{ scope.row.title }}</span>
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
        <span style="margin-left: 10px">{{ scope.row.time }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="接收时间">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.readTime }}</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  background
  layout="prev, pager, next"
  @current-change="handleCurrentChange"
  :page-size="10"
  :total="100">
</el-pagination>
  </div>
</template>

<script>
export default {
  data() {
      return {
        tableData: [{
          status: '已读',
          title: '我是标题',
          source: '我是来源',
          time:'2020/10/28',
          readTime:'暂未阅读'
        }]
      }
    },
  methods: {
    // 获取之后跳转
    getdetail(data){
      this.$router.push(
        {
          name:'moreMsgdetail',params: data
        })
    },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
  },
  mounted() {
    
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