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
                    </el-form-item>
                </el-form>
            </el-row>
            <!-- 计划列表 -->
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                <el-table
                        :data="listData"
                        style="width: 100%;text-align:center"
                        ref="treeTable"
                        row-key="code"
                        :indent="30"
                        max-height="560"
                        highlight-current-row
                        border>
                    <el-table-column type="expand" @expand-change="test">
                        <template slot-scope="props">
                            <el-form label-width="150px" :inline='true'>
                                <el-table :stripe="true" :header-cell-style="tableHeaderColor"
                                          :data="props.row.linearray"
                                          ref="treeTable" :indent="30" max-height="560" border>
                                </el-table>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="startDate" label="计划开始时间" width="150" align="center"></el-table-column>
                    <el-table-column prop="endDate" label="计划结束时间" width="150" align="center"></el-table-column>
                    <el-table-column prop="planName" label="计划名称" align="center"></el-table-column>
                    <el-table-column prop="planPersonName" label="计划人姓名" width="150" align="center"></el-table-column>
                    <el-table-column prop="status" label="计划状态" width="120" align="center"></el-table-column>
                    <el-table-column label="操作" width="300" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    disabled
                                    type="primary"
                                    size="mini"
                                    @click="readfile(scope.row)"
                            >暂时无用
                            </el-button>
                        </template>
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
                listData: [],
                nowdate: '',
                status_processing: 0, // 状态统计，执行中的数量
                status_completed: 0, // 状态统计，已完成的数量
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
            }
        },
        mounted() {
            console.log('这是远程计划的bug开始')
            this.nowdate = this.getNowFormatDate();
            this.handleClick();
            getInputAndCheckDetail('100').then(res=>{
                console.log(res, '看看全部数据有哪些')
            }).catch(err=>{
                console.log(err, '看看报了哪些错')
            })
        }
    }
</script>

<style>

</style>