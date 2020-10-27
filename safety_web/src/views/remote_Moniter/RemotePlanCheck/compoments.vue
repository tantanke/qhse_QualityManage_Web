<template>
    <div>
        <div class="page-title" style="width:100%">远程计划核查细节</div>
        <div class="page-content">
            <el-row>
                <el-form label-width="130px" :inline="true">
                    <el-form-item label="选择自编号：">
                        <el-select v-model="myNovalue" placeholder="请选择" clearable>
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="choosemyNo">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="warning" @click="pushfile">导出
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="handleCancel">返回</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <!-- 计划列表 -->
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                <el-table
                        :data="listData"
                        style="width: 100%;text-align:center"
                        ref="treeTable"
                        :indent="30"
                        max-height="560"
                        highlight-current-row
                        border>
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="deviceNo" label="设备编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="myNo" label="自编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
                    <el-table-column prop="charger" label="负责人" width="120" align="center"></el-table-column>
                    <el-table-column prop="tel" label="电话" width="100" align="center"></el-table-column>
                    <el-table-column prop="companyName" label="基层单位" width="140" align="center"></el-table-column>
                    <el-table-column label="视频监控描述:" width="100" prop="description" style="margin-bottom:5px">
                        {{resData.description}}
                    </el-table-column>
                    <el-table-column label="截图编号:" width="100" prop="picNo" style="margin-bottom:5px">
                        {{resData.picNo}}
                    </el-table-column>
                    <el-table-column label="处置情况(录入):" width="100" prop="disposeIn" style="margin-bottom:5px">
                        {{resData.disposeIn}}
                    </el-table-column>
                    -->
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    v-if="$route.params.date==selectdate"
                                    type="primary"
                                    size="mini"
                                    @click="handelcelChange(scope.row)"
                            >核查
                            </el-button>
                            <el-button
                                    type="danger"
                                    size="mini"
                                    @click="handelcelDelete(scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <!-- 新增计划表  -->
            <el-dialog title="核查计划" :visible.sync="table" center width="700px">
                <el-form label-width="120px" style="width:100%;">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="核查情况描述:" prop="check" style="margin-bottom:5px"
                                          v-if="this.selecttime==this.selectdate">
                                <el-input type="text" label="核查情况描述 ：" class="resizeNone" v-model="resData.check"
                                          placeholder="请输入内容"></el-input>
                            </el-form-item>
                            <el-form-item label="处置情况(核查):" prop="disposeCheck" style="margin-bottom:5px"
                                          v-if="this.selecttime==this.selectdate">
                                <el-input type="text" label="处置情况 ：" class="resizeNone" v-model="resData.disposeCheck"
                                          placeholder="请输入内容"></el-input>
                            </el-form-item>
                            <el-form-item label="是否关闭(核查):" prop="closeCheck" style="margin-bottom:5px"
                                          v-if="this.selecttime==this.selectdate">
                                <el-switch
                                        style="margin-right:10px"
                                        v-model="resData.closeCheck"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="否"
                                        inactive-text="是"
                                        active-value="否"
                                        inactive-value="是"
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item>
                                <el-button type="" style="margin-top:20px;margin-left:100px" @click="table=false">取消
                                </el-button>
                                <el-button type="primary" style="margin-top:20px;" @click="addDetail">核查</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>

    import ExportJsonExcel from "js-export-excel";
    import {GetCurrentUser} from "../../../store/CurrentUser.js"
    import {getDetails} from "../../../services/remote";//查询细节
    import {updateInputtedDetailInfo} from "../../../services/remote";//录入当天细节
    import {deletePlanDetail} from "../../../services/remote";//录入当天细节
    import {getInputtedRecordDetailByDate, getInputDates, getNeedToCheckedDetails} from "../../../services/remote";//查看细节内容

    export default {
        name: '',
        data() {
            return {
                listData: [],
                resData: {closeCheck: '是', disposeCheck: '', check: '', description: '', picNo: '', condition: ''},
                ifchange: false,
                ifnew: 0,
                table: false,
                nowdate: '',
                dates: [],
                selecttime: '',
                selectdate: '',
                cansee: true,
                monitorPlanDetailID: '',
                options: [],
                myNovalue: '',
                lists: []
            }
        },
        methods: {
            choosemyNo() {
                if (this.myNovalue == null || this.myNovalue == '') {
                    this.listData = [];
                    getNeedToCheckedDetails(this.$route.params).then(res => {
                        for (var i = 0; i < res.data.length; i++) {
                            this.listData.push(res.data[i]);
                        }
                    })
                }

                else {
                    this.listData = [];
                    for (var i = 0; i < this.lists.length; i++) {
                        if (this.lists[i].myNo == this.myNovalue) {
                            this.listData.push(this.lists[i]);
                        }
                    }
                }

            },
            pushfile() {
                this.downloadData = [];
                //将树形数据转换为table型数据
                this.parseTreeToTable(this.listData)
                var option = {};
                //下载文件名
                option.fileName = this.$route.params.date + '核查表';
                //设置数据来源和数据格式
                option.datas = [{
                    sheetData: this.downloadData,
                    sheetHeader: ["设备编号", "自编号", "项目名称", "负责人", "负责人电话", "基层单位", "记录仪使用情况", "视频监控描述", "截图编号", "处置情况(录入)", "是否关闭(录入)", "核查情况描述", "处置情况(核查)", "是否关闭(核查)"]
                }];
                //导出
                var toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();

            },
            parseTreeToTable(node) {//转换格式
                //初始化下载数据项对象
                this.downloadDataItem = {}
                //遍历当前节点，装填数据
                for (var i = 0; i < node.length; i++) {
                    //如果当前节点存在，装填数据
                    if (node[i]) {
                        this.downloadDataItem = {}
                        this.downloadDataItem.deviceNo = node[i].deviceNo
                        this.downloadDataItem.myNo = node[i].myNo
                        this.downloadDataItem.projectName = node[i].projectName
                        this.downloadDataItem.charger = node[i].charger
                        this.downloadDataItem.tel = node[i].tel
                        this.downloadDataItem.companyName = node[i].companyName
                        this.downloadDataItem.condition = node[i].condition
                        this.downloadDataItem.description = node[i].description
                        this.downloadDataItem.picNo = node[i].picNo
                        this.downloadDataItem.disposeIn = node[i].disposeIn
                        this.downloadDataItem.closeIn = node[i].closeIn
                        this.downloadDataItem.picNo = node[i].check
                        this.downloadDataItem.disposeIn = node[i].disposeCheck
                        this.downloadDataItem.closeIn = node[i].closeCheck
                        //将数据项对象装入下载数据数组，保存
                        this.downloadData.push(this.downloadDataItem)
                    }
                    //递归装填子节点
                    if (node[i].childNode) {
                        this.parseTreeToTable(node[i].childNode)
                    }
                }
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
            getNowFormatDate2() {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate() - 1;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            },
            handleCancel() {//返回
                this.$router.go(-1)
            },
            handelcelChange(data) {
                this.table = true
                this.monitorPlanDetailID = data.monitorPlanDetailID
                //  this.resData={closeCheck:'是',disposeCheck:'',check:'',description:'',picNo:'',condition:''},
                this.resData = data;


            },
            handelcelDelete(data) {//删除
                this.resData = data;
                deletePlanDetail(this.resData).then(res => {
                    this.$message.success('删除成功')
                    getDetails(this.$route.params).then(res => {
                        this.listData = res.data;
                    })
                }).catch(err => {
                    this.$message.error('删除失败', err)
                })
            },
            addDetail() {//录入细节
                if (this.resData.check == '' || this.resData.disposeCheck == '') {
                    this.$message.error('信息录入不全！');
                }
                this.resData.checkPersonId = GetCurrentUser().employeeId;
                this.resData.checkPersonName = GetCurrentUser().employeeName;
                console.log(this.resData)
                updateInputtedDetailInfo(this.resData).then(res => {
                    console.log('审核成功', res)
                    this.$message.success('核查成功')

                    this.table = false;
                })
                    .catch(err => {
                        console.log('审核失败', err)
                    })
                this.listData = [];
                getNeedToCheckedDetails(this.$route.params).then(res => {
                    for (var i = 0; i < res.data.length; i++) {
                        this.listData.push(res.data[i]);
                    }
                })
            }
        },
        mounted() {
            this.nowdate = this.getNowFormatDate();
            this.selectdate = this.getNowFormatDate();
            this.selecttime = this.getNowFormatDate();
            console.log('核查细节页面报错')
            getNeedToCheckedDetails(this.$route.params).then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    this.listData.push(res.data[i]);
                    this.options.push({value: res.data[i].myNo, label: res.data[i].myNo});
                    console.log(this.options)
                }

                console.log(this.listData)
                this.lists = this.listData
            })

        }
    }
</script>
<style lang='scss'>

</style>
