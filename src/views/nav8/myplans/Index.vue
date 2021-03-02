<template>
    <div>
        <div class="page-title">我编制的计划</div>
        <div class="page-content">
        <el-form
        :inline="true"
        v-model="filterQuery"
        @submit.native.prevent="handleSearch">
          <el-form-item label="计划状态：">
            <el-select  style="width:200px"  v-model="filterQuery.status" placeholder="选择计划状态" clearable>
                <el-option v-for="item in states" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type='submit' icon='el-icon-search' >查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          v-loading="loading"
          border
          style="width: 100%">
          <el-table-column type="index" :index="this.indexStartNum" label="序号" width="50"></el-table-column>
          <el-table-column label="检查名称" prop="taskName" header-align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column label="计划责任人" prop="checkPerson" header-align="center"> </el-table-column>
          <el-table-column label="检查单位" prop="companyName" header-align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column label="受检开始时间" prop="startDate" header-align="center"> </el-table-column>
          <el-table-column label="受检结束时间" prop="endDate" header-align="center"></el-table-column>
          <el-table-column label="计划状态" prop="status" header-align="center"> </el-table-column>
          <el-table-column label="操作" align="center" header-align="center" width="180px"  fixed="right">
          <template slot-scope="scope">
            <div class="inline-td">   
              <router-link :to='{name: "Personalmyplans", params: {id: scope.row.planID}}' v-if="scope.row.status === '未审核'" >
                <el-button size="mini"  icon="el-icon-edit-outline" >修改</el-button>
              </router-link>
              <router-link :to='{name: "Personalmyplans", params: {id: scope.row.planID}}' v-else-if="scope.row.status === '审核不通过'" >
                <el-button size="mini"  icon="el-icon-edit-outline" >修改</el-button>
              </router-link>
              <router-link :to='{name: "Personalmyplanscheck", params: {id: scope.row.planID}}' v-else>
                <el-button size="mini" icon="el-icon-view"  type="primary" >查看</el-button>
              </router-link>
              &nbsp;&nbsp;
              <!-- <el-button  size="mini"  type="success" icon="el-icon-circle-check-outline"  @click="batchSubmit(scope.row.planID, {status: '完成',taskCheckPersonsID:scope.row.taskCheckPersonsID,taskID:scope.row.taskID})"  v-if="scope.row.status === '执行中'" >完成</el-button> -->
              <el-button  size="mini"  type="success" icon="el-icon-circle-check-outline"  @click="batchSubmit(scope.row.planID,{status:'完成',taskCheckPersonsID:scope.row.taskCheckPersonsID,taskID:scope.row.taskID})" v-if="scope.row.status === '执行中'" >完成</el-button>
              <el-button  size="mini"  type="success" icon="el-icon-circle-check-outline" v-else disabled>完成</el-button>
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
          layout="total, prev, pager, next, jumper"
          style="float:right;">
        </el-pagination>
      </div>
        </div>
    </div>
</template>
<script>
import {Getmyplans} from '../../../services/personCenter'
import {GetDictionary} from '../../../services/dictionary'
import {updateNewPlan} from '../../../services/complateplan'
import  {GetCurrentUser} from '../../../store/CurrentUser'
import { newSendMessage } from "../../../services/chat"
//import VueCookies from 'vue-cookies'
// Vue.use(VueCookies)
const DefaultQuery = {
      status: '', 
      startDate:'',
      endDate:'',
			pageIdx: 1,
			pageSize:10
	}
export default {
    data(){
        return{  
        // client:VueCookies.get("client"),
        filterQuery:{
          status:'',
        },
        tableData:[], 
        states:[],
        loading: false,
        total: 0,
        indexStartNum:1,
        planID:[],
        checkItem: [],
        tableData1:[],
        tableData2:[],
        date:{
          messageText:'你已完成一项计划',
          toUserId:''
        }


    }

},
    mounted () {
    this.loadFilterParams() //加载默认条件
    this.handleGetListData() 
    this.getStatusDict()
    },
methods:{
    //为了保存过滤条件,利用路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
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
      handleGetListData () {
        this.loading = true
        // alert(JSON.stringify(this.filterQuery))
        this.$router.push({query: this.filterQuery})
        Getmyplans(this.filterQuery).then((res) => {
          console.log(JSON.stringify(res))
          // alert(res.data.list.length)
          // this.tableData = res.data.list
          if(res.data.planId===0){
             this.tableData2=[]
             this.tableData=[]
          }else if(res.data.planId !==0) {
            this.tableData2 = res.data.list
            var hash = {};
            this.tableData = this.tableData2.reduce(function(item, next) {
            hash[next.planID] ? '' : hash[next.planID] = true && item.push(next);
            return item
            }, []) 
            // alert(this.tableData.length)
            this.total = res.data.total
            this.filterQuery.pageIdx =  res.data.page
            this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
            this.loading = false   
          }
          // alert(JSON.stringify(this.tableData))
          // this.total = res.data.total
            
          // alert(JSON.stringify(this.tableData))
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      },
    handleSearch () {
      this.filterQuery.pageIdx = 1
      this.handleGetListData()
    },
    getStatusDict () {
      GetDictionary({name: "计划状态", type: "all"}).then((res) => {
        this.states = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    handlePageChange (page) {
      this.filterQuery.pageIdx = page
      this.handleGetListData()
    },
    //点击完成计划按钮
     batchSubmit (id,data){
       this.$confirm('确定完成计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let user = GetCurrentUser();
            newSendMessage({status: 102,user_id:user.userId}).then().catch();
            updateNewPlan(id,data).then(() => {
            this.handleGetListData()
          }, (err) => {
            this.$message.error(err.message)
          }).catch(() => {
        })
     })
     }
}
}



</script>