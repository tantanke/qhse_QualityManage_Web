<template>
   <div> 
    <!-- <div class="outDiv"> -->
		<!-- <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)"> -->
		<div class="page-title">编制计划</div>
		<div class="page-content">
			<el-form
			:inline="true"
				:model="filterQuery"
				@submit.native.prevent="handleSearch">
						<el-form-item label="任务状态：">
							<el-select  style="width:200px" v-model="filterQuery.status" placeholder="选择任务状态" clearable>
								<el-option v-for="item in states" :key="item.id" :label="item.name" :value="item.name"></el-option>
							</el-select>
						</el-form-item>
						&nbsp; &nbsp; &nbsp; &nbsp;
						<el-form-item label="下达时间：">
							<el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  align="right"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
									style="width:250px">
								</el-date-picker>
						</el-form-item>
						&nbsp; &nbsp; &nbsp; &nbsp;
						<el-form-item>
							<el-button type="primary" native-type='submit' icon='el-icon-search'>查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button  style="background-color:#3399CC;color:#FFFFFF" @click="export2Excel ()">导出Excel</el-button>
            </el-form-item>
					</el-form>

			<el-table :data="tableData" v-loading="loading" border style="width: 100%;">	
				<el-table-column label="序号" width="80">
          <template slot-scope="scope">
            <font>{{scope.$index + 1}}</font>
          </template>
        </el-table-column>
				<el-table-column label="任务名称" prop="taskName"></el-table-column>
				<el-table-column prop="checkRank" label="检查级别"></el-table-column>
				<el-table-column prop="leader" label="任务负责人"></el-table-column>
				<el-table-column prop="issueDate" label="下达时间"></el-table-column>
        <!-- <el-table-column prop="receiveDate" label="接收时间"></el-table-column> -->
				<el-table-column prop="taskObject" label="任务目标"></el-table-column>
				<el-table-column prop="status" label="任务状态"></el-table-column>
        <el-table-column prop="score" label="得分"  width="100"></el-table-column>
				<!-- <el-table-column prop="publisher" label="下达人"></el-table-column> -->
				<el-table-column label="操作" align="center" header-align="center" width="180px"  fixed="right">
					<template slot-scope="scope">
						<div class="inline-td"> 
							<router-link :to='{name: "PlanEdit", params: {id: scope.row.taskID,taskName: scope.row.taskName}}' v-if="scope.row.status === '已接收'">
								<el-button size="mini" icon="el-icon-edit-outline">编制计划</el-button>
							</router-link>
							<router-link :to='{name: "PlanEdit", params: {id: scope.row.taskID,taskName: scope.row.taskName}}' v-else-if="scope.row.status === '不通过'">
								<el-button size="mini" icon="el-icon-edit-outline">编制计划</el-button>
							</router-link>
							<router-link :to='{name: ""}' v-else>
								<el-button size="mini" icon="el-icon-edit-outline" :disabled=true>编制计划</el-button>
							</router-link>
							&nbsp;&nbsp;
              <el-button size="mini"  @click="batchAccept(scope.row.taskID, {status: '已接收',receiveDate: formatDate(new Date())})" v-if="scope.row.status === '已下达'">接收</el-button>
              <el-button size="mini"  @click="batchSubmit(scope.row.taskID, {status: '未审核'})" v-else-if="scope.row.status === '已接收'">提交</el-button>
							<el-button size="mini"  @click="batchSubmit(scope.row.taskID, {status: '未审核'})" v-else-if="scope.row.status === '不通过'">提交</el-button>
              <el-button size="mini" :disabled=true v-else>接收</el-button>
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
          layout="total,prev, pager, next,jumper"
        >
        </el-pagination>
      </div>
		</div>
	</div>
</template>

<script>
	import {GetDictionary} from '../../../services/dictionary'
  import {GetTasksList1,UpdateTask} from '../../../services/task'
	const DefaultQuery = {
			status: '', 
			issueDate1: '',
			issueDate2: '',
			pageIdx: 1,
			pageSize: 10
	}
	const DefaultQueryExcel = {   //************
  taskName: '',
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}

	export default {
		data () {
			return {
				filterQuery: {},
				filterQueryExcel: {},
				total: 0,
				loading: false,
				dateRange: '',
				tableData: [],
				states: [],
				excelData:[]
			}
		},
		methods: {
			//导出excel
      export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetTasksList1(this.filterQueryExcel).then((data) => {
        console.log(JSON.stringify(data))
        this.excelData = data.data
        this.loading = false
        console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          //************
          const tHeader = ['任务名称','负责人','检查级别','任务目标','任务地点','下达时间','任务状态','评分'];
          // 上面设置Excel的表格第一行的标题
          //************
          const filterVal = ['taskName','leader','checkRank','taskObject','address','issueDate','status','score'];
          // 上面的index、phone_Num、school_Name是tableData里对象的属性
          const list = this.excelData;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '列表excel');
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },



			handleSearch () {
				this.handleGetListData()
			},
			getStatusDict () {
				GetDictionary({name: "任务状态"}).then((res) => {
					this.states = res.data
				}).catch((err) => {
					this.$message.error(err.message)
				})
			},
			handleGetListData () {
						//整理筛选条件
						this.checkFilterParams()
						this.loading = true
						//为了保存过滤条件,我们通过路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
						this.$router.push({name: 'complatePlan', query: this.filterQuery})
						//接口函数,then后面的回调表示成功所执行的内容,catch后面表示错误时所执行的内容
						GetTasksList1(this.filterQuery).then((res) => {
							this.tableData = res.data.list
							this.total = res.data.total
							this.filterQuery.pageIdx = res.data.page
							this.loading = false
						}).catch((err) => {
							this.$message.error(err.message)
							this.loading = false
						})
			},
			handlePageChange (page) {
				this.filterQuery.pageIdx = page
				this.handleGetListData()
			},
			//获取一个月的时间
      handleGetDate(){
        let showDate =new Date();
        let seperator ='-';
        let year = showDate.getFullYear();
        let month = showDate.getMonth() + 1;
        let month1=month-1
        let year1=year
        var strDate = showDate.getDate();
        if(month===1){
          month1=month+11
          year1=year-1
        }
        if (month >= 1 && month <= 9) {
            month = "0" + month;           
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        
       this.filterQuery.issueDate1 = year1 + seperator + month1 + seperator + strDate;
       this.filterQuery.issueDate2 = year + seperator + month + seperator + strDate;
       this.dateRange=[ this.filterQuery.issueDate1, this.filterQuery.issueDate2]
		},
		formatDate (date) {
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			return y + '-' + m + '-' + d;  
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
						//填充datepicker range组件的内容
						if (this.filterQuery.issueDate1 && this.filterQuery.issueDate2) {
							this.dateRange = [this.filterQuery.issueDate1, this.filterQuery.issueDate2]
						}
				},
			checkFilterParams () {
						//datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
						if (this.dateRange && this.dateRange.length === 2) {
							this.filterQuery.issueDate1 = this.dateRange[0]
							this.filterQuery.issueDate2 = this.dateRange[1]
						} else {
							this.filterQuery.issueDate1 = ''
							this.filterQuery.issueDate2 = ''
						}
      },
      // 批量接收
			batchAccept (id,data) {
        this.$confirm('确定接收任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          UpdateTask(id,data).then(() => {
            this.handleGetListData()
          }, (err) => {
            this.$message.error(err.message)
          })
        }).catch(() => {
        })
      },
      // 批量提交
			batchSubmit (id,data) {
        this.$confirm('确定提交任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // SubmitTaskPlan(id).then(() => {
          //   this.handleGetListData()
          // }, (err) => {
          //   this.$message.error(err.message)
					// })
					UpdateTask(id,data).then(() => {
						this.handleGetListData()
          }, (err) => {
            this.$message.error(err.message)
					})
        }).catch(() => {
        })
			},
		},
		mounted () {
			this.loadFilterParams();
			this.getStatusDict();
			this.handleGetListData();
			this.handleGetDate()
		}
	}
</script>