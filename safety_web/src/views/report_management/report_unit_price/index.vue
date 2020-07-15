<template>
    <div>
        <div class="page-title">报告单价</div>
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
            <!-- 单价表详情 -->
            <el-row style="padding:5px; border-top: 2px dashed #dddddd;width:1200px">
                <el-table :data="reportUnitPriceList" border v-loading="loading" max-height="660">
                    <el-table-column label="单价表">
                        <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
                        <el-table-column label="年份（年）" prop="costYear" width="150"  align="center"> </el-table-column>
                        <el-table-column label="报告类别" prop="reportType" align="center"> </el-table-column>
                        <el-table-column label="单价（元）" prop="unitPrice" width="150" align="center"> </el-table-column>
                        <el-table-column label="审核人比例" prop="auditorProportion"  width="150" align="center"> </el-table-column>
                        <el-table-column label="批准人比例" prop="approverProportion" width="150" align="center"> </el-table-column>
                    </el-table-column>
                    <el-table-column width="200" align="center">
                        <template slot="header">
                            <el-button type="primary" @click="addUnitPrice()" icon='el-icon-plus'>新增</el-button>
                            <el-button type="primary" @click="addUnitPriceList()" icon='el-icon-plus'>生成单价表</el-button>
                        </template>
                        <el-table-column label="操作" width="300" align="center">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-edit" type="primary" @click="modifyUnitPrice(scope.row)">修改</el-button>
                                <el-button icon="el-icon-delete" type="danger" @click="deleteUnitPrice(scope.row.unitPriceID)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </el-row>
            <!-- 弹出新增单价页面 -->
            <el-dialog title="新增单价" :visible.sync="dialogFormVisible1" center width="500px">
                <el-form label-width="140px" :model="dialogData1" style="width:80%">
                    <el-form-item label="年份（年）：">
                        <el-date-picker v-model="dialogData1.costYear" type="year" placeholder="选择年份"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="报告类别：">
                        <el-select style="width:100%" v-model="dialogData1.reportType" filterable placeholder="选择报告类别" clearable>
                            <el-option v-for="item in reportTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="单价（元）：">
                        <el-input v-model="dialogData1.unitPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="审核人比例：">
                        <el-input v-model="dialogData1.auditorProportion" @change="((val) => {changeAuditorProportion(val)})"></el-input>
                    </el-form-item>
                    <el-form-item label="批准人比例：">
                        <el-input v-model="dialogData1.approverProportion" readonly></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleAddUnitPrice()">确 定</el-button>
                    <el-button type="danger" @click="dialogFormVisible1 = false">取 消</el-button>
                </div>
            </el-dialog>
            <!-- 弹出修改单价页面 -->
            <el-dialog title="修改单价" :visible.sync="dialogFormVisible2" center width="500px">
                <el-form label-width="140px" :model="dialogData2" style="width:80%">
                    <el-form-item label="年份（年）：">
                        <el-date-picker v-model="dialogData2.costYear" type="year" placeholder="选择年份"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="报告类别：">
                        <el-select style="width:100%" v-model="dialogData2.reportType" filterable placeholder="选择报告类别" clearable>
                            <el-option v-for="item in reportTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="单价（元）：">
                        <el-input v-model="dialogData2.unitPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="审核人比例：">
                        <el-input v-model="dialogData2.auditorProportion" @change="((val) => {changeAuditorProportion(val)})"></el-input>
                    </el-form-item>
                    <el-form-item label="批准人比例：">
                        <el-input v-model="dialogData2.approverProportion" readonly></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleModifyUnitPrice()">确 定</el-button>
                    <el-button type="danger" @click="dialogFormVisible2 = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {GetReportType} from '../../../services/reportCodeRule'
import {CreateUnitPrice,GetUnitPriceList,UpdateUnitPrice,DeleteUnitPrice} from '../../../services/report_cost_manage'
const DefaultQuery = {
    costYear:'',
    type:''
}
export default {
    data() {
        return {
            filterQuery: {},
            loading: false,
            dialogData1:{},
            dialogData2:{},
            dialogFormVisible1:false,
            dialogFormVisible2:false,
            reportUnitPriceList:[],
            reportTypes:[],
        }
    },
    mounted () {
        this.loadFilterParams()
        this.handleGetDate()
        this.handleGetUnitPrice()
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
        handleSearch() {
            if(this.filterQuery.costYear){
                let costYear1 = new Date(this.filterQuery.costYear)
                this.filterQuery.costYear = String(costYear1.getFullYear())
            }else{
                this.handleGetDate()
            }
            this.handleGetUnitPrice()
        },
        handleGetUnitPrice(){
            this.loading = true
            GetUnitPriceList(this.filterQuery).then((res) => {
                if(res.data){
                    this.reportUnitPriceList = res.data
                }else{
                    this.reportUnitPriceList = []
                }
                this.loading = false
            }).catch((err) => {
                this.$message.error(err.message)
                this.loading = false
            })
        },
        getreporttypes () {
            GetReportType().then((res) => {
                res.data.forEach(element => {
                    this.reportTypes.push({value:element,label:element})
                });
            }).catch((err) => {
                this.$message.error(err.message)
            })
        },
        addUnitPrice(){
            this.dialogFormVisible1 = true
            this.dialogData1 = {
                unitPrice:parseFloat(0),
                auditorProportion:parseFloat(0),
                approverProportion:parseFloat(0)
            }
            this.getreporttypes()
        },
        handleAddUnitPrice(){
            this.dialogData1 = {
                costYear:String((new Date(this.dialogData1.costYear)).getFullYear()),
                reportType:this.dialogData1.reportType,
                unitPrice:parseFloat(this.dialogData1.unitPrice),
                auditorProportion:parseFloat(this.dialogData1.auditorProportion),
                approverProportion:parseFloat(this.dialogData1.approverProportion),
                type:""
            }
            this.$confirm('此操作将新增单价, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                CreateUnitPrice(this.dialogData1).then(() => {
                    this.$message.success('创建成功')
                    this.dialogFormVisible1 = false
                    this.handleGetUnitPrice()
                }).catch((err) => {
                    this.$message.error(err.message)
                })
                this.dialogData1 = {}
            })
        },
        addUnitPriceList(){
            this.$confirm('此操作将新增一年单价表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true
                this.filterQuery.type = "all"
                CreateUnitPrice(this.filterQuery).then(() => {
                    this.$message.success('创建成功')
                    this.handleGetUnitPrice()
                    this.loading = false
                }).catch((err) => {
                    this.$message.error(err.message)
                    this.loading = false
                })
                
            })
        },
        changeAuditorProportion(value){
            if(value<=0 || value>=1){
                this.$notify.warning({
                    title: '温馨提示',
                    message: '审核人比例必须在0-1之间，请重新输入！',
                    type: 'warning'
                })
            }else{
                this.dialogData1.approverProportion = (1.0-parseFloat(value)).toFixed(2)
                this.dialogData2.approverProportion = (1.0-parseFloat(value)).toFixed(2)
            }
        },
        modifyUnitPrice(item){
            this.dialogData2 = item
            this.dialogFormVisible2 = true
            this.getreporttypes()
        },
        handleModifyUnitPrice(){
            this.dialogData2 = {
                unitPriceID:this.dialogData2.unitPriceID,
                costYear:String((new Date(this.dialogData2.costYear)).getFullYear()),
                reportType:this.dialogData2.reportType,
                unitPrice:parseFloat(this.dialogData2.unitPrice),
                auditorProportion:parseFloat(this.dialogData2.auditorProportion),
                approverProportion:parseFloat(this.dialogData2.approverProportion)
            }
            this.$confirm('此操作将新增报告单价, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                UpdateUnitPrice(this.dialogData2.unitPriceID,this.dialogData2).then(() => {
                    this.$message.success('更新成功')
                    this.dialogFormVisible2 = false
                    this.handleGetUnitPrice()
                }).catch((err) => {
                    this.$message.error(err.message)
                })
                this.dialogData2 = {} 
            })
        },
        deleteUnitPrice(unitPriceID){
            this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                DeleteUnitPrice(unitPriceID).then(() => {
                    this.handleGetUnitPrice()
                }, (err) => {
                    this.$message.error(err.message)
                })
            })
        },
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
