<template>
    <div>
        <div class="page-title">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                  <router-link :to='{name: "personTaskIndex"}'>
                    任务管理
                  </router-link>
                  </el-breadcrumb-item>
                <el-breadcrumb-item>计划审核</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="page-content">
        <!-- <el-form
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
        </el-form> -->
         <el-table
    :data="tableData"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column label="序号" width="80">
        <template slot-scope="scope">
            <font>{{scope.$index + 1}}</font>
        </template>
    </el-table-column>
    <el-table-column
      label="检查名称"
      prop="taskName"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="计划责任人"
      prop="checkPerson"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="计划状态"
      prop="status"
      header-align="center">
    </el-table-column>
    <el-table-column label="操作" align="center" header-align="center" width="200px"  fixed="right">
          <template slot-scope="scope">
            <div class="inline-td">
              <router-link :to='{name: "personTaskPlan", params: {id: scope.row.planID,}}' v-if="scope.row.status === '未审核'" >
                <el-button size="mini"  icon="el-icon-edit-outline" >审核</el-button>
              </router-link>
              <!-- <router-link :to='{name: "", params: {id: scope.row.planID}}' v-else >
                <el-button size="mini"  icon="el-icon-edit-outline" disabled>审核</el-button>
              </router-link> -->
               <router-link :to='{name: "personTaskcheck", params: {id: scope.row.planID}}' v-else >
                <el-button size="mini"  icon="el-icon-view"  type="primary">查看</el-button>
              </router-link>
            </div>
          </template>
   </el-table-column>
  </el-table>
      <!-- <div class="pagination-base">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="filterQuery.pageIdx"
          :page-size="filterQuery.pageSize"
          :total="total"
          background
          layout="total, prev, pager, next, jumper"
          style="float:right;">
        </el-pagination>
      </div> -->
        </div>
    </div>
</template>
<script>
import {GetTasksPlan,GetTaskDetail} from '../../../services/task'
import {GetDictionary} from '../../../services/dictionary'
const DefaultQuery = {
      status:'', 
      startDate:'',
      endDate:'',
      pageIdx: 1,
      pageSize: 10,

	}
export default {
    data(){
        return{
        filterQuery:{
        },
        tableData:[],
        states:[],
        total:0,
        loading: false,
        tableData1:[],
        taskID:'',
        }
        
    },
    mounted () {
      this.loadFilterParams() //加载默认条件
      this.getPlanDTO()
      // this.handleGetListData() 
      // this.getStatusDict()
    },
    methods:{
    getStatusDict () {
      GetDictionary({name: "计划状态", type: "all"}).then((res) => {
        this.states = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    getPlanDTO (){
       this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
				const id = JSON.parse(localStorage.getItem('data'));
        // const id = this.$route.params.id
				GetTaskDetail(id).then((res) => {
					this.taskID = res.data.taskID
          this.checkName = res.data.taskName
          console.log(JSON.stringify(res))
          this.$router.push({query:this.filterQuery})
          GetTasksPlan({taskID:this.taskID} ).then((res) => {
            // alert(JSON.stringify(res))
          // console.log(JSON.stringify(res))
          // alert(res.data.total)
          if(res.data.planId===0){
             this.tableData1=[]
             this.$message({
             message: '该任务目前没有未审核的计划！',
             type: 'warning',
             duration:5000,
           });
        
          }else if(res.data.planId !==0) {
            this.tableData1 = res.data.list
            var hash = {};
            this.tableData = this.tableData1.reduce(function(item, next) {
            hash[next.planID] ? '' : hash[next.planID] = true && item.push(next);
            return item
            }, [])
            // this.total = res.data.total
            // this.filterQuery.pageIdx = res.data.page
            this.loading = false
          }
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
        })
        
      },
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
    // handleGetListData () {
    //   //整理筛选条件
    //   this.loading = true
    //   this.$router.push({query:this.filterQuery})
    //   GetTasksPlan({taskID:this.taskID}).then((res) => {
    //       console.log(JSON.stringify(res))
    //       // alert(JSON.stringify(res))   
    //       if(res.data.planId===0){
    //          this.tableData1=[]
    //       }else if(res.data.planId !==0) {
    //         this.tableData1 = res.data.list
    //         var hash = {};
    //         this.tableData = this.tableData1.reduce(function(item, next) {
    //         hash[next.planID] ? '' : hash[next.planID] = true && item.push(next);
    //         return item
    //         }, [])  
    //         this.total = res.data.total
    //         alert( res.data.page)
    //         this.filterQuery.pageIdx = res.data.page
    //         this.loading = false
    //       }            
    //     }).catch((err) => {
    //       this.$message.error(err.message)
    //       this.loading = false
    //     })
    //   },

    // handleSearch () {
    //   this.filterQuery.pageIdx = 1
    //   this.handleGetListData()
    // },
    // handlePageChange (page) {
    //   this.filterQuery.pageIdx = page
    //   this.getPlanDTO ()
    //   // this.filterQuery.pageIdx=1
    // },

    }
}
</script>