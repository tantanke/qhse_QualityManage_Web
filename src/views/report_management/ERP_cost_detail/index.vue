<template>
    <div>
        <div class="page-title">ERP费用详情</div>
        <div class="page-content" style="width:100%">
            <!-- 选择年份进行查询 -->
            <el-form label-width="130px"  :inline="true" :model="filterQuery" style="width:1200px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="选择年份：">
                            <el-date-picker v-model="filterQuery.costYear" type="year" placeholder="选择年份" style="width:200px"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-button type="primary" @click="handleSearch()" icon='el-icon-search'>查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 设置总金额 -->
            <el-form label-width="130px" style="width:1200px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总金额（元）：">
                            <el-input v-model="totalCost" style="width:200px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" @click="handleUpdateTotalCost()" icon='el-icon-check'>修改</el-button>
                        <el-button type="primary" @click="addTotalCost()" icon='el-icon-plus'>新增</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="剩余金额（元）：">
                            <el-input style="width:200px" v-model="surplusTotalCost" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 弹出新增总价页面 -->
            <el-dialog title="新增总金额" :visible.sync="dialogFormVisibleTotalCost" center width="500px">
                <el-form label-width="140px" :model="dialogTotalCost" style="width:80%">
                    <el-form-item label="年份（年）：">
                        <el-date-picker v-model="dialogTotalCost.costYear" type="year" placeholder="选择年份"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="总金额（元）：">
                        <el-input v-model="dialogTotalCost.totalCost"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleAddTotalCost()">确 定</el-button>
                    <el-button type="danger" @click="dialogFormVisibleTotalCost = false">取 消</el-button>
                </div>
            </el-dialog>
            <!-- 费用使用详情表 -->
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;width:1200px">
                <el-table :data="reportCountList" show-summary border v-loading="loading" max-height="600">
                    <el-table-column label="费用使用详情表">
                        <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
                        <el-table-column label="年份（年）" prop="costYear" width="120"  align="center"> </el-table-column>
                        <el-table-column label="报告类别" prop="reportType" align="center"> </el-table-column>
                        <el-table-column label="报告数量" prop="reportCount" width="120" align="center"> </el-table-column>
                        <el-table-column label="审核人数" prop="auditorCount" width="120" align="center"> </el-table-column>
                        <el-table-column label="审核人总额（元）" prop="auditorTotalCost"  width="150" align="center"> </el-table-column>
                        <el-table-column label="批准人数" prop="approverCount" width="150" align="center"> </el-table-column>
                        <el-table-column label="批准人总额（元）" prop="approverTotalCost" width="150" align="center"> </el-table-column>
                        <el-table-column label="类别总额（元）" prop="reportTypeTotalCost" width="150" align="center"> </el-table-column>
                    </el-table-column>
                </el-table>
            </el-row>
        </div>
    </div>
</template>

<script>
import {GetCostDetailList} from '../../../services/report_cost_manage'
import {CreateTotalCost,GetTotalCost,UpdateTotalCost} from '../../../services/report_cost_manage'

const DefaultQuery = {
    costYear:'',
    category:'ERP',
    personCategory:"ERP"
}
export default {
    data() {
        return {
            filterQuery: {},
            costID:null,
            totalCost:null,
            surplusTotalCost:null,
            loading: false,
            dialogTotalCost:{},
            dialogFormVisibleTotalCost:false,
            reportCountList:[]
        }
    },
    mounted () {
        this.loadFilterParams()
        this.handleGetDate()
        this.handleGetTotalCost()
        this.handleGetCostDetail()
    },
    methods: {
        handleGetDate(){
            let nowdata = new Date()
            this.filterQuery.costYear = String(nowdata.getFullYear())
        },
        loadFilterParams () {
            this.filterQuery = {...DefaultQuery, ...this.$route.query}
            this.filterQuery = {
                ...this.filterQuery
            }
        },
        handleGetTotalCost(){
            this.loading = true
            GetTotalCost(this.filterQuery).then((res) => {
                if(res.data[0]){
                    this.costID = res.data[0].costID
                    this.totalCost = parseFloat(res.data[0].totalCost).toFixed(2)
                    this.surplusTotalCost = parseFloat(res.data[0].surplusTotalCost).toFixed(2)
                }else{
                    this.costID = 0
                    this.totalCost = 0
                    this.surplusTotalCost = 0
                }
                this.loading = false
            }).catch((err) => {
                this.$message.error(err.message)
                this.loading = false
            })
        },
        handleUpdateTotalCost(){
            let data = {totalCost:parseFloat(this.totalCost)}
            UpdateTotalCost(this.costID,data).then(() => {
                this.$message.success('修改成功')
                this.handleGetTotalCost()
                this.handleGetCostDetail()
            }).catch((err) => {
                this.$message.error(err.message)
            })
        },
        addTotalCost(){
            this.dialogFormVisibleTotalCost = true
        },
        handleSearch() {
            if(this.filterQuery.costYear){
                let costYear1 = new Date(this.filterQuery.costYear)
                this.filterQuery.costYear = String(costYear1.getFullYear())
            }else{
                this.handleGetDate()
            }
            this.handleGetTotalCost()
            this.handleGetCostDetail()
        },
        handleAddTotalCost(){
            this.dialogTotalCost = {
                costYear:String((new Date(this.dialogTotalCost.costYear)).getFullYear()),
                totalCost:parseFloat(this.dialogTotalCost.totalCost),
                category:'ERP'
            }
            this.$confirm('此操作将新增总金额, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                CreateTotalCost(this.dialogTotalCost).then(() => {
                    this.$message.success('创建成功')
                    this.dialogFormVisibleTotalCost = false
                    this.handleGetTotalCost()
                }).catch((err) => {
                    this.$message.error(err.message)
                })
                this.dialogTotalCost = {}
            })
        },
        handleGetCostDetail(){
            this.loading = true
            GetCostDetailList(this.filterQuery).then((res) => {
                if(res.data.length === 0){
                    this.$notify.warning({
                        title: '温馨提示',
                        message: '该年份下无数据，请重新查询！',
                        type: 'warning'
                    })
                }
                this.reportCountList = res.data
                this.loading = false
            }).catch((err) => {
                this.$message.error(err.message)
                this.loading = false
            })
        }
    }
}
</script>
<style>
.table-title {
  padding: 5px 0px;
  font-size: 15px;
  line-height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
}
</style>
