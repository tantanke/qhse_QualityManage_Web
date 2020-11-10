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
                    <!--  此处暂时不需要
                    <el-form-item label='时间范围：' labelWidth='120px'>
                        <el-date-picker
                                v-model="selectdate"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </el-form-item>
                    &nbsp;&nbsp;&nbsp;
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
                    </el-form-item>
                    <el-form-item style="float:right;  color:cornflowerblue">
                        <span style="font-size:16px;">执行中: {{status_processing}}</span>
                        &nbsp;
                        <span style="font-size:16px;">完成: {{status_completed}}</span>
                    </el-form-item>-->
                </el-form>
            </el-row>
            <!-- 计划列表 -->
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                <el-table :data="listData" style="width: 100%;text-align:center" ref="treeTable" :indent="30"

                          highlight-current-row border>
                    <el-table-column type="expand">
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
                                    <el-table-column prop="disposeIn" label="处置情况" align="center"></el-table-column>
                                    <el-table-column prop="inputPersonName" label="监控人员" align="center"></el-table-column>
                                    <el-table-column prop="inputDate" label="录入时间" align="center"></el-table-column>
                                    <el-table-column prop="checkDate" label="核查时间" align="center"></el-table-column>
                                    <el-table-column prop="closeIn" label="是否关闭" align="center"></el-table-column>
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
                nowdate: '',
                status_processing: 0, // 状态统计，执行中的数量
                status_completed: 0, // 状态统计，已完成的数量
                filterProjectNameList: [],  // 用于对项目名称进行筛选的结构
                filterCompanyNameList: [],  // 用于对基层单位进行筛选的结构
                filterPlanNameList: [],  // 用于对计划名称进行筛选的结构

            }
        },
        methods: {
            //设置表头行的样式
            tableHeaderColor({row, column, rowIndex, columnIndex}) {
                return 'background-color:lightblue;color:#fff;font-family:"楷体";font-size:18px;text-align:center'

            },
            test(p){
                alert("展开了")
                console.log(p, 1232324)
            },
            getNowFormatDate() {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            },
            handleClick() {
                //查询
                getMonitorPlanList().then(res => {
                    return
                    console.log('查询结果', res)
                    this.listData = res.data
                    // 每次查询，都要对任务的状态进行统计
                    this.status_count(this.listData)


                    // 该api(getMonitorPlanList)查询所有的计划，然后由前端通过日期进行过滤
                    if (this.selectdate.length != 0) {
                        var datas = this.listData;
                        var length = datas.length;
                        this.listData = []//清空列表数据
                        var datemin = new Date(Date.parse(this.selectdate[0].replace(/-/g, "/")));
                        var datemax = new Date(Date.parse(this.selectdate[1].replace(/-/g, "/")));
                        //循环遍历
                        for (var i = 0; i < length; i++) {
                            var date1 = new Date(Date.parse(datas[i].startDate.replace(/-/g, "/")));
                            var date2 = new Date(Date.parse(datas[i].endDate.replace(/-/g, "/")));
                            if (date1 >= datemin) {
                                this.listData.push(datas[i])
                            }
                        }
                    }
                }).catch(err => {
                    console.log('查询失败', err)
                })
            },

            readfile(data) {//详情
                console.log(data, "看看详情能得到哪些路径参数")
                this.$router.push({
                    name: 'planDataDetail',
                    params: data
                })
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
            // 暂时用这个名字，用来打好数据结构
            async makeData() {
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
                    this.listData.forEach(d=>{

                        getInputAndCheckDetail(d.monitorPlanDetailID).then(res=>{
                            d.linearray = res.data
                            console.log(d, 'd.linearray')
                        })
                    })
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
            this.nowdate = this.getNowFormatDate();
            this.handleClick();
            this.makeData()

        }
    }
</script>

<style>

</style>