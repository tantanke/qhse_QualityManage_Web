<template>
    <div>
        <div class="page-title" style="width:100%;justify-content: flex-start;">
          <span style="cursor: pointer;color: #ccc;" @click="gotoRemotePlanStatistics()">
            远程计划统计
          </span>
          <span style="padding:0 20px">|</span>
          <span style="cursor: pointer;" >
            远程计划监控数据
          </span>
        </div>
        <div class="page-content">
            <el-row>
                <el-form label-width="130px" :inline="true">

                </el-form>
            </el-row>
            <!-- 计划列表 -->
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                <!-- 展开事件要放在被展开行所属的表上 -->
                <el-table :data="listData" style="width: 100%;text-align:center" ref="treeTable" :indent="30"
                          @expand-change="expandLoad"
                          highlight-current-row border>
                    <el-table-column type="expand" >
                        <template slot-scope="props">
                            <el-form label-width="150px" :inline='true'>
                                <el-table :stripe="true" :header-cell-style="tableHeaderColor"
                                          :data="props.row.linearray"
                                          ref="treeTable" :indent="30" max-height="560" border>
                                    <el-table-column prop="condition" label="记录仪使用情况" align="center"></el-table-column>
                                    <el-table-column prop="description" label="视频监控描述" align="center"></el-table-column>
                                    <el-table-column prop="picNo" label="截图编号" align="center">
                                        <template slot-scope="scope">>
                                            <a href="#" @click="handlePictureCardPreview2(scope.row)">{{scope.row.picNo}}</a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="disposeInOrCheck" label="处置情况" align="center"></el-table-column>
                                    <el-table-column prop="inputPersonName" label="监控人员" align="center"></el-table-column>
                                    <el-table-column prop="inputDate" label="录入时间" align="center"></el-table-column>
                                    <el-table-column prop="checkDate" label="核查时间" align="center"></el-table-column>
                                    <el-table-column prop="result" label="核查结论" align="center"></el-table-column>
                                    <el-table-column prop="closeInOrCheck" label="是否关闭" align="center"></el-table-column>
                                </el-table>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column prop="deviceNo" label="设备编号" width="120" align="center"></el-table-column>
                    <el-table-column prop="myNo" label="自编号" width="120" align="center"></el-table-column>
                    <el-table-column prop="planName" label="计划名称" width="120" align="center"
                                     :filters="filterPlanNameList"
                                     :filter-method="filterPlanName"
                    ></el-table-column>
                    <el-table-column prop="companyName" label="基层单位" width="120" align="center"
                                     :filters="filterCompanyNameList"
                                     :filter-method="filterCompanyName"
                    ></el-table-column>
                    <el-table-column prop="itemCategory" label="项目类别" width="120" align="center"></el-table-column>
                    <el-table-column prop="projectName" label="项目名称" align="center"
                                     :filters="filterProjectNameList"
                                     :filter-method="filterProjectName"
                    ></el-table-column>
                    <el-table-column prop="charger" label="负责人" width="120" align="center"></el-table-column>
                    <el-table-column prop="tel" label="电话" width="120" align="center"></el-table-column>
                    <el-table-column prop="projectProgress" label="项目进度" width="120" align="center"></el-table-column>
                    <el-table-column label="操作" width="200" align="center">
                        <!--<template slot-scope="scope">-->
                            <!--<el-button type="primary" size="mini" @click="handelcelChange(scope.row)">编辑</el-button>-->
                            <!--<el-button type="danger" size="mini" @click="handelcelDelete(scope.row)">删除</el-button>-->
                        <!--</template>-->
                        此处暂时留白
                    </el-table-column>
                </el-table>
            </el-row>
            <el-dialog :visible.sync="dialogVisible2">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import ExportJsonExcel from "js-export-excel";
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import {GetCurrentUser} from "../../../store/CurrentUser.js"
    import {createNewMonitorPlan} from "../../../services/remote";//新建
    import {getMonitorPlanList} from "../../../services/remote";//查询
    import {deletePlan} from "../../../services/remote";//删除
    import {getDetails, endMonitorPlan} from "../../../services/remote";//查询细节
    import {getInputAndCheckDetail} from "../../../services/remote"

    export default {
        data() {
            return {
                selectdate: '',
                listData: [],   // 渲染表格的初始数据结构
                status_processing: 0, // 状态统计，执行中的数量
                status_completed: 0, // 状态统计，已完成的数量
                filterProjectNameList: [],  // 用于对项目名称进行筛选的结构
                filterCompanyNameList: [],  // 用于对基层单位进行筛选的结构
                filterPlanNameList: [],  // 用于对计划名称进行筛选的结构
                expandNum: 0,           // 展开的行数，用来判断当前事件是展开还是收起
                dialogVisible2: false,
                dialogImageUrl: '',

            }
        },
        methods: {
            //设置表头行的样式
            tableHeaderColor({row, column, rowIndex, columnIndex}) {
                return 'background-color:lightblue;color:#fff;font-family:"楷体";font-size:18px;text-align:center'

            },
            handlePictureCardPreview() {
                this.dialogImageUrl = this.url;
                this.dialogVisible2 = true;
            },
            handlePictureCardPreview2(data) {
                this.dialogImageUrl = "http://39.98.173.131:9000/api" + data.picLink;
                this.dialogVisible2 = true;
            },
            // 展开表格中的一行时，开始加载其中的数据
            // p 代表当前展开的行的数据，q是一个列表，表示展开的所有行的数据
            expandLoad(p, q){
                // 当操作是展开时才进行加载
                if (q.length > this.expandNum) {
                    getInputAndCheckDetail(p.monitorPlanDetailID).then(res => {
                        p.linearray = res.data
                        // 为了满足新需求，对不同的condition显示不同的字段内容
                        p.linearray.forEach(a=>{
                            a.closeInOrCheck = a.condition==='备用'?a.closeCheck:a.closeIn
                            a.disposeInOrCheck = a.condition==='备用'?a.disposeCheck:a.disposeIn

                            if (a.condition === '备用') {
                                a.closeInOrCheck = a.closeInOrCheck?a.closeInOrCheck:'未核查'
                                a.disposeInOrCheck = a.closeInOrCheck?a.closeInOrCheck:'未核查'
                            }
                        })

                        console.log(res.data, '当前展开的表格的数据')

                        // 由于表格不及时更新，需要点击表格一下
                        let row = document.getElementsByClassName("el-table__row")
                        for (let i = 0; i < row.length; i++){
                            row[i].click();
                        }
                    })
                }
                this.expandNum = q.length
            },

            // 对两种状态进行统计计数
            status_count(listData) {
                this.status_processing = 0
                this.status_completed = 0
                listData.forEach(d => {
                    if (d.status === '执行中') this.status_processing++
                    if (d.status === '完成') this.status_completed++

                })
            },
            // 跳转到远程计划统计
            gotoRemotePlanStatistics() {
                this.$router.push({
                    name: 'RemotePlanStatistics',
                    params: {}
                })
            },
            // 得到用于渲染表格的数据
            async getListData() {
                this.listData = []
                let res = await getMonitorPlanList()
                if (res.code === 1000){
                    res.data.forEach(d=>{
                        getDetails({monitorPlanID: d.monitorPlanID}).then(res=>{
                            if (res.code === 1000) {
                                // 将远程计划的计划详情添加进去
//                                d.detailsArray = res.data
                                res.data.forEach(d2=>{
                                    d2.planName = d.planName
                                    this.listData.push(d2)
                                })

                            }else{
                                console.log('远程计划监控数据getDetails失败')
                                this.$message.error("获取失败")
                            }
                        })

                    })
                }else{
                    console.log('远程计划监控数据getMonitorPlanList失败')
                    this.$message.error("获取失败")
                }
                console.log(this.listData, '组成的数据结构')
                // 为了防止前面的请求未完成，因此通过定时器将该操作延后执行
                setTimeout(()=>{
                    this.filterMethods(this.listData)
                }, 1000)


            },
            // 用于筛选项目名称列的方法
            filterProjectName(value, row, column) {
                // property 是列名，比如此处就为projectName
                const property = column['property'];
                // value 是选中的值，可能会有多个，依次比较，当前行列的值是否与选中的值相等，相等则保留
                return row[property] === value;

            },
            // 用于筛选基层单位列的方法
            filterCompanyName(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            filterPlanName(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            filterMethods(listData) {
                // 两个辅助结构，为了得到不重复的filterList
                let distinctProjectName = new Set()
                let distinctCompanyName = new Set()
                let distinctPlanName = new Set()
                // 添加之前先将原来的清空，防止出现重复数据
                this.filterProjectNameList = []
                this.filterCompanyNameList = []
                this.filterPlanNameList = []
                listData.forEach(e=>{
                    if (!distinctProjectName.has(e.projectName)) {
                        distinctProjectName.add(e.projectName)
                        this.filterProjectNameList.push({value: e.projectName, text: e.projectName})
                    }
                    if (!distinctCompanyName.has(e.companyName)) {
                        distinctCompanyName.add(e.companyName)
                        this.filterCompanyNameList.push({value:e.companyName, text:e.companyName})
                    }
                    if (!distinctPlanName.has(e.planName)) {
                        distinctPlanName.add(e.planName)
                        this.filterPlanNameList.push({value:e.planName, text:e.planName})
                    }
                })
            }
        },
        mounted() {
            console.log('这是远程计划的bug开始')
            this.getListData()

        }
    }
</script>

<style>

</style>