
<template>
  <div>
    <div class="page-title" style="width:100%">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <router-link :to='{name: "ControlPanel"}'>
        安全概览
        </router-link>
     </el-breadcrumb-item>
        <!-- <el-breadcrumb-item><a @click="$router.go(-1)">安全概览</a></el-breadcrumb-item> -->
        <el-breadcrumb-item>消息中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
        <el-row><el-button type="warning" icon="el-icon-message" style="border:none;font-size:15px;float:right" @click="allRead()" >全部标记为已读</el-button>
          <el-badge :value="value1" class="item" style="float:left;" >
          未读消息
          </el-badge>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-badge :value="value2" class="item"  >
          已读消息
          </el-badge>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-badge :value="value3" class="item" >
          所有消息
          </el-badge>     
        </el-row> 
    &nbsp;
    <el-table
        :data="tableData"
        v-loading="loading"
        border
        ref="refTable"
        style="width: 100%"
        >
      <el-table-column
      type="index"
      width="50"
      header-align="center"
      label="序号"
      :index="this.indexStartNum"
      align="center">
    </el-table-column>
      <el-table-column
        label="消息"
        prop="messageText"
        header-align="center">
      </el-table-column>
      <el-table-column
        label="时间"
        prop="messageDate"
        header-align="center"
        width="180px">
      </el-table-column>
      <el-table-column label="操作" align="center" header-align="center" width="200%">
        <template slot-scope="scope">
          <div class="inline-td">
              <el-badge :is-dot="true" class="item"  v-if="scope.row.messageStatus === '未读'"><el-button icon="el-icon-message" size="small" @click="handleSubmit(scope.row.messageId)" >未读</el-button></el-badge>
              <el-badge  class="item" v-else><el-button  icon="el-icon-message" size="mini" type="info">已读</el-button></el-badge>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="DeleteMessage11(scope.row.messageId)">删除</el-button>
          </div>
        </template>
    </el-table-column>
  </el-table>
  <div class="pagination-base">
            <el-pagination
              @current-change="handlePageChange"
              :current-page="filterQuery.pageIdx"
              :page-size="filterQuery.pageSize"
              :total="total"
              background
              layout="total, prev, pager, next, jumper">
            </el-pagination>
          </div>         
    </div> 
  </div>
</template>
<script>
import {updateMessage,allMessage,DeleteMessage,readMessage,notReadMessage,newMessage} from '../services/message'
const DefaultQuery = {
  pageIdx: 1,
  pageSize:10,
	}
export default {
    data() {
        return {
            filterQuery:{},
            tableData:[],
            tableData1:[],
            total:0,
            loading:false,
            indexStartNum:1,
            value1:'',
            value2:'',
            value3:'',
        }
    },

mounted() {
    this.loadFilterParams() //加载默认条件
    this.getallMessage()
    this.getMessageCount()
    this.getMessage()
},
methods: {
    loadFilterParams () {
      //从query读取过滤条件
      this.filterQuery = {...DefaultQuery, ...this.$route.query}
      //从query中取到的参数是string的,要转成element要求的number
      this.filterQuery = {
        ...this.filterQuery,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize, 10),
      }
    },
    //获取已读信息
     getMessage () {
        this.loading = true
        this.$router.push({query: this.filterQuery})
        newMessage({status:"已读"}).then((res) => {
        this.value2=res.data.total
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    //获取未读信息数量
     getMessageCount () {
        this.loading = true
        notReadMessage().then((res) => {
         this.value1=res.data
         this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    //提交信息状态
     handleSubmit(id) {
      this.$confirm('此操作标记已读, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // alert(id)
        updateMessage(id).then(() => {
        // alert("成功！")
        this.getallMessage()
        this.getMessageCount()
        this.getMessage()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
    //获取全部消息
    getallMessage () {
        this.loading = true
        this.$router.push({query: this.filterQuery})
        allMessage(this.filterQuery).then((res) => {
        // alert(JSON.stringify(res.data.list.length))
        // alert(res.data.total)
        this.tableData = res.data.list
        this.total = res.data.total
        this.value3=res.data.total
        this.filterQuery.pageIdx = res.data.page
        this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.loading = false
      })
    },
    //删除消息
    DeleteMessage11(id) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // alert(id)
        DeleteMessage(id).then(() => {
        // alert("测试")
        this.getallMessage()
        this.getMessageCount()
        this.getMessage()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
    //一键已读
    allRead(){
        this.$confirm('此操作一键已读, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // alert(id)
        readMessage().then(() => {
        // alert("测试")
        this.getallMessage()
        this.getMessageCount()
        this.getMessage()
        }, (err) => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      })
    },
    handlePageChange(page){
      this.filterQuery.pageIdx = page
      this.getallMessage()
    }

},
}
</script>

<style>
.item {
  margin-top: 5px;
  margin-right: 20px;
}
</style>
