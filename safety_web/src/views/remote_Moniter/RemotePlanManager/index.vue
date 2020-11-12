<template>
    <div>
        <div class="page-title" style="width:100%">远程计划管理</div>
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
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建</el-button>
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
                    <el-table-column type="index" label="序号" width="80" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="startDate" label="计划开始时间" width="150" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="endDate" label="计划结束时间" width="150" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="planName" label="计划名称" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="planPersonName" label="计划人姓名" width="150" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="计划状态" width="120" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="340" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-more"
                                    @click="readfile(scope.row)"
                            >详情
                            </el-button>
                            
                            <el-button
                                    type="warning"
                                    size="mini"
                                    icon="el-icon-download"
                                    @click="pushfile(scope.row)"
                            >导出
                            </el-button>
                            <el-button
                                    type="info"
                                    size="mini"
                                    icon="el-icon-video-pause"
                                    @click="endplans(scope.row)"
                            >结束
                            </el-button>
                            <el-button
                                    type="danger"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="deletefile(scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <!-- 新增计划表  -->
            <el-dialog title="新增计划" :visible.sync="ifadd" width="700px" :close-on-click-modal="false">
                <el-form label-width="120px" style="width:100%;">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label='时间范围：' labelWidth='120px'>
                                <el-date-picker
                                        v-model="newdate"
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
                            <el-form-item label="计划名称：" prop="desc" style="margin-bottom:1px">
                                <el-input type="text" label="计划名称 ：" class="resizeNone" v-model="newname"
                                          placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        
                                
                           
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="" @click="ifadd=false" icon="el-icon-refresh-left">取 消
                                </el-button>
                                <el-button type="primary" @click="addEvidenceFile" icon="el-icon-check">录 入
                                </el-button>
                </span>
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

    export default {
        data() {
            return {
                selectdate: '',
                listData: [],
                resData: [],
                downloadData: [],
                ifadd: false,
                newdate: '',
                newname: '',
                nowdate: '',
                status_processing: 0, // 状态统计，执行中的数量
                status_completed: 0, // 状态统计，已完成的数量
            }
        },
        methods: {
            endplans(data) {
                endMonitorPlan(data).then(res => {
                    console.log('结束结果', res);
                    this.$message.success('成功结束任务');
                    //再次查询
                    getMonitorPlanList().then(res => {
                        console.log('查询结果', res)
                        this.listData = res.data
                        // 每次查询，都要对任务的状态进行统计

                        this.status_count(this.listData)
                    }).catch(err => {
                        console.log('查询失败', err)
                    })
                })
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
            handleAdd() {//新建表格
                this.ifadd = true,
                    this.newlist = ''
            },
            addEvidenceFile() {//确认新建
                var data = {
                    startDate: this.newdate[0],
                    endDate: this.newdate[1],
                    planName: this.newname,
                    companyCode: GetCurrentUser().companyCode
                }
                console.log(data)
                if (this.newdate == '' || this.newname == '') {
                    this.$message.error('请完善信息')
                }
                else {
                    createNewMonitorPlan(data).then(res => {
                        console.log(res)
                        this.ifadd = false;
                        this.handleClick();
                    }).catch(err => {
                        console.log('添加失败', err)
                    })
                }

            },
            readfile(data) {//详情
                console.log(data)
                this.$router.push({
                    name: 'Rcompoments',
                    params: data
                })
            },
            deletefile(data) {//删除
                console.log(data.monitorPlanID)
                deletePlan(data).then(res => {
                    console.log('删除结果', res);
                    //再次查询
                    getMonitorPlanList().then(res => {
                        console.log('查询结果', res)
                        this.listData = res.data
                        // 每次查询，都要对任务的状态进行统计
                        this.status_count(this.listData)
                    }).catch(err => {
                        console.log('查询失败', err)
                    })
                })
            },
            pushfile(data) {//导出
                getDetails(data).then(res => {
                    this.downloadData = [];
                    this.resData = res.data;
                    if (res.code == '1000') {
                        //将树形数据转换为table型数据
                        this.parseTreeToTable(this.resData)
                        var option = {};
                        //下载文件名
                        option.fileName = data.planName + '细节表';
                        //设置数据来源和数据格式
                        option.datas = [{
                            sheetData: this.downloadData,
                            sheetHeader: ["设备编号", "自编号", "项目名称", "负责人", "负责人电话", "状态"]
                        }];
                        //导出
                        var toExcel = new ExportJsonExcel(option);
                        toExcel.saveExcel();
                    }
                })

            },
            parseTreeToTable(node) {//转换格式
                //初始化下载数据项对象
                this.downloadDataItem = []
                //遍历当前节点，装填数据
                for (var i = 0; i < node.length; i++) {
                    //如果当前节点存在，装填数据
                    this.downloadDataItem = {}
                    this.downloadDataItem.deviceNo = node[i].deviceNo
                    this.downloadDataItem.myNo = node[i].myNo
                    this.downloadDataItem.projectName = node[i].projectName
                    this.downloadDataItem.charger = node[i].charger
                    this.downloadDataItem.tel = node[i].tel
                    this.downloadDataItem.condition = node[i].condition
                    //将数据项对象装入下载数据数组，保存
                    this.downloadData.push(this.downloadDataItem)


                }
            },
            // 对两种状态进行统计计数
            status_count(listData) {
                this.status_processing = 0
                this.status_completed = 0
                listData.forEach(d => {
                    if (d.status === '执行中') this.status_processing++
                    if (d.status === '完成') this.status_completed++

                })
            }
        },
        mounted() {
            console.log('这是远程计划的bug开始')
            this.nowdate = this.getNowFormatDate();
            this.handleClick();
        }
    }
</script>

<style>

</style>