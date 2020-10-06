<template>
    <div>
        <div class="page-title" style="width:100%">要素证据批准</div>
        <div class="page-content">
            <el-row>
                <el-form label-width="130px" :inline="true" :model="filterQuery">
                    <el-form-item label="选择公司：">
                        <treeselect
                                :disable-branch-nodes="true"
                                :multiple="false"
                                :options="companyList"
                                placeholder="请选择公司单位"
                                @select="selectDepart"
                                style="width:200px"
                        />
                    </el-form-item>
                    <el-form-item label="选择年份：">
                        <el-date-picker
                                v-model="filterQuery.year"
                                type="year"
                                placeholder="选择年份"
                                style="width:200px">
                        </el-date-picker>
                    </el-form-item>
                    &nbsp;&nbsp;&nbsp;
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;">
                <div style="margin:15px 0px">
                    <span style="margin-right:15px">请选择查看内容:</span>
                    <el-radio v-model="checkType" label="未批准">未批准</el-radio>
                    <el-radio v-model="checkType" label="已批准">已批准</el-radio>
                    <!--<div style="float:right;margin:5px 20px;color:orange">未审核:{{this.total3}}</div>-->
                    <div style="float:right;margin:5px 20px;color:orange">
                        未审核:{{this.total - this.total1 - this.total2 || '0'}}
                    </div>
                    <div style="float:right;margin:5px 20px;color:blue">未批准:{{this.total1}}</div>
                    <div style="float:right;margin:5px;color:red">已批准:{{this.total2}}</div>
                    <div style="float:right;margin:5px">全要素:{{this.total}}</div>
                </div>
                <el-table
                        :cell-style="cellStyle"
                        v-if="checkType=='未批准'"
                        :data="treeData"
                        style="width: 100%;text-align:center"
                        ref="treeTable"
                        row-key="code"
                        :indent="30"
                        max-height="560"
                        highlight-current-row
                        border
                        @cell-click="handleCellClick"
                        v-loading="loading"
                        :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
                    <el-table-column prop="name" label="内容"></el-table-column>
                    <el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="updateScore(scope.row)"
                                    v-if="scope.row.childNode.length === 0"
                            >{{['备案待查'].includes(scope.row.status) ? '查看' : '进入批准'}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                        :cell-style="cellStyle"
                        v-if="checkType=='已批准'"
                        :data="hasData"
                        style="width: 100%;text-align:center"
                        ref="treeTable"
                        row-key="code"
                        :indent="30"
                        max-height="560"
                        highlight-current-row
                        border
                        @cell-click="handleCellClick"
                        v-loading="loading"
                        :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
                    <el-table-column prop="name" label="内容"></el-table-column>
                    1
                    <el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="updateScore(scope.row)"
                                    v-if="scope.row.childNode.length === 0"
                            >{{['备案待查'].includes(scope.row.status) ? '查看' : '进入批准'}}
                            </el-button>
                        </template>
                        -->
                    </el-table-column>
                    1
                </el-table>
            </el-row>
            <el-dialog title="详细内容" :visible.sync="dialogVisible" center width="1200px" :close-on-click-modal=false>
                <el-form label-width="140px" :model="detailData" style="width:100%;">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item style="margin-left:300px;text-align:left">
                                <el-switch
                                        style="margin-right:10px"
                                        v-model="upstatus"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="通过"
                                        inactive-text="不通过">
                                </el-switch>
                                <el-button :disabled="['备案待查'].includes(curStatus)" type="primary" @click="passornot">确认批准</el-button>
                            </el-form-item>
                            <el-form-item v-if="!upstatus" label="驳回意见：" style="margin-bottom:1px">
                                <el-input ype="text" label="驳回意见 ：" class="resizeNone" v-model="unpasstext"
                                          placeholder="请输入内容"></el-input>
                            </el-form-item>
                            <el-form-item label="要素名称：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>
                            <!-- <el-form-item label="内容：" style="margin-bottom:1px">{{detailData.content}}</el-form-item>
                            <el-form-item label="依据：" style="margin-bottom:1px">{{detailData.basis}}</el-form-item>
                            <el-form-item label="审核方式：" style="margin-bottom:1px">{{detailData.auditMode}}</el-form-item>
                            <el-form-item label="分数：" style="margin-bottom:1px">{{detailData.initialScore}}</el-form-item>
                            <el-form-item label="计算分数：" style="margin-bottom:1px">{{detailData.formula}}</el-form-item>
                            <el-form-item label="可能存在的问题：" style="margin-bottom:1px">{{detailData.problemDescription}}</el-form-item> -->
                            <el-form-item label="证据描述：" style="margin-bottom:1px">{{detailData.evidenceDsecription}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="24"
                                style="border:1px solid gray">
                            <!-- <el-form-item label="附件描述：" style="margin-bottom:1px">{{detailData.attacjDescription}}</el-form-item>
                            <el-form-item label="上传时间：" style="margin-bottom:1px">{{detailData.uploadTime}}</el-form-item> -->
                            <el-form-item label="证据图片："
                                          style="margin-bottom:10px"
                            >
                                <div v-for="(item,index) in attachs" :key="index">
                                    <el-card :body-style="{ padding: '10px' }"
                                             style="width:100px;height:100px;text-align:center;float:left;margin:05px">
                                        <span v-if="!item">无图片文件记录！</span>
                                        <el-popover placement="right" title trigger="click" v-else>
                                            <div style="box-shadow: 0 0 2px 4px rgba(0,0,0,0.3);"
                                                 class="picPosition">
                                                <img :src="item" class="picSize"/>
                                            </div>
                                            <img slot="reference" :src="item" :alt="detailData.pictureFile"
                                                 style="width: 100%; height: 100%;"/>
                                        </el-popover>
                                    </el-card>
                                </div>
                            </el-form-item>
                            <el-form-item label="证据文件："
                                          style="margin-bottom:10px"
                            >
                                <div v-for="(item,index) in files" :key="index">
                                    <a :href="item" style="max-width:600px;height:auto"
                                       :download="strings[index]">{{strings[index]}}</a>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import {qhse_company_tree} from "../../../services/qhse_EvidenceCheck";//获取公司及诶单数
    import {query_elementReviewers} from "../../../services/qhse_EvidenceCheck"//证据项
    import {approval_elementReviewer} from "../../../services/qhse_EvidenceCheck"//通过批准
    import {no_elementReviewer} from "../../../services/qhse_EvidenceCheck"//不通过审核
    import {show_elementReviewer} from "../../../services/qhse_EvidenceCheck"//显示要素证据信息
    import {downloadElementFile} from "../../../services/qhse_EvidenceCheck"
    import {show_approve_check} from "../../../services/qhse_EvidenceCheck"//显示已经审核或者批准的信息
    import {showAllElement} from "../../../services/qhse_EvidenceCheck";


    const DefaultQuery = {
        year: "",
        companyCode: null,
        companyName: null
    };
    export default {
        data() {
            return {
                unpasstext: '',
                checkType: '未批准',
                filelength: '',
                strings: null,
                upstatus: false,
                filterQuery: {},//记载公司的信息
                companyList: [],//记载公司的展开树节点
                disabled1: false,
                download: '',
                dialogFormVisible: false,
                loading: true,
                dialogVisible: false,
                detailData: {},
                attach: '',
                treeData: [],
                hasData: [],
                initData: [],
                node: [],
                nodeData: [],
                attachs: [],
                files: [],
                status: [{
                    id: 1,
                    label: "未审核",
                    status: "未审核"
                },
                    {
                        id: 2,
                        label: "未批准",
                        status: "未批准"
                    }],
                curStatus: '', // 通过录入或查看按钮进入录入页面时，保存具体某个要素的状态(不通过、未审核等一系列状态)
            };
        },
        methods: {
            selectDepart(val) {
                console.log('selectDepart', val);
                this.filterQuery.companyCode = val.nodeCode;
            },
            deepTree1(treedata) {
                let _this = this
                console.log('啊这', treedata)

                treedata.forEach(item => {
                    if (item.childNode.length === 0) {
                        _this.total1++;
                        return
                    } else {
                        _this.deepTree1(item.childNode)
                    }
                })
                return _this.total1
            },
            deepTree2(treedata) {
                let _this = this
                console.log('啊这', treedata)

                treedata.forEach(item => {
                    if (item.childNode.length === 0) {
                        _this.total2++;
                        return
                    } else {
                        _this.deepTree2(item.childNode)
                    }
                })
                return _this.total2
            },
            selectDepart2(res) {
                console.log('selectDepart2', res);
                let obj = {}
                //遍历下拉数组中的item
                obj = this.status.find((item) => {
                    return item.status === res
                })
                console.log(JSON.stringify(obj.status))
                this.$set(this.filterQuery, this.filterQuery.status, res.value)
            },
            handleGetCompany() {//获取到公司的名字 即在选择页面显示
                qhse_company_tree().then(res => {
                    this.companyList = JSON.parse(JSON.stringify(res.data));
                    this.dialogVisible = false;
                }).catch(err => {
                    this.$message.error(err.message);
                });
            },
            passornot() {

                if (this.upstatus == true) {//当按钮选择通过

                    approval_elementReviewer(this.nodeData).then(res => {
                        console.log(res.message);
                        this.$message.success(res.message);
                        query_elementReviewers(this.filterQuery)//获取到叶子节点信息
                            .then(res => {
                                this.treeData = res.data;
                                this.total1 = 0;
                                this.deepTree1(this.treeData);
                            })
                            .catch(err => {
                                console.log(err);
                                this.message.error(err.message);
                            });

                        show_approve_check(this.filterQuery)
                            .then(res => {
                                this.hasData = res.data;
                                this.total2 = 0;
                                this.deepTree2(this.hasData);
                            })
                            .catch(err => {
                                console.log(err);
                                this.message.error(err.message);
                            });

                        this.dialogVisible = false;
                    }).catch(err => {
                        this.$message.error(err.message);
                    })
                }
                else {
                    this.nodeData.negativeOpinion = this.unpasstext;
                    no_elementReviewer(this.nodeData).then(res => {
                        console.log(res.message);
                        this.$message.success(res.message);
                        query_elementReviewers(this.filterQuery)//获取到叶子节点信息
                            .then(res => {
                                this.treeData = res.data;
                                this.total1 = 0;
                                this.deepTree1(this.treeData);
                                // this.companyName = res.data.name;
                                // this.year = res.data.year;
                                // this.status = res.data.status;
                            })
                            .catch(err => {
                                console.log(err);
                                this.message.error(err.message);
                            });
                        show_approve_check(this.filterQuery)
                            .then(res => {
                                this.hasData = res.data;
                                this.total2 = 0;
                                this.deepTree2(this.hasData);
                            })
                            .catch(err => {
                                console.log(err);
                                this.message.error(err.message);
                            });

                        this.dialogVisible = false;
                    }).catch(err => {
                        this.$message.error(err.message);
                    })
                }
            },
            loadFilterParams() {//获取年份
                //把filterquery加上信息与路由
                this.filterQuery = {...DefaultQuery, ...this.$route.query};
                this.filterQuery = {
                    ...this.filterQuery
                };
                this.filterQuery.status = ''
                let year = new Date();
                this.filterQuery.year = String(year.getFullYear());

            },
            handleClick() {//点击查询获取到公司的证据项  改为check页面的显示节点
                this.treeData = '',
                    this.hasData = ''
                if (!this.filterQuery.year) {//显示年份
                    this.filterQuery.year = new Date()
                }
                let nowdata = new Date(this.filterQuery.year);
                this.filterQuery.year = String(nowdata.getFullYear());
                this.filterQuery.status = 1

                if (this.filterQuery.companyCode == null)
                    this.$message.error('请选择公司')
                else {
                    this.handleGetInitialData();//更改loading状态
                    showAllElement(this.filterQuery)//获取全要素
                        .then(res => {
                            this.total = res.AllElement;
                            this.total3 = res.NotInput;
                        })
                        .catch(err => {
                            console.log(err);
                            this.message.error(err.message);
                        });
                    query_elementReviewers(this.filterQuery)//获取到叶子节点信息
                        .then(res => {
                            this.treeData = res.data;
                            this.total1 = 0;
                            console.log(this.filterQuery.compayCode)
                            this.deepTree1(this.treeData);
                        })
                        .catch(err => {
                            console.log(err);
                            this.message.error(err.message);
                        });

                    show_approve_check(this.filterQuery)
                        .then(res => {
                            this.hasData = res.data;
                            this.total2 = 0;
                            this.deepTree2(this.hasData);
                        })
                        .catch(err => {
                            console.log(err);
                            this.message.error(err.message);
                        });
                }
                this.loading = false;

            },
            handleCellClick(row, cell, column) {//展开列表的子节点
                if (row.childNode.length > 0) {
                    let els = column.getElementsByClassName("el-icon-arrow-right");
                    if (els.length != 0) {
                        els[0].click();
                    }
                }
            },
            handleGetInitialData() {
                this.loading = true;
            },
            async updateScore(data) {//显示出证据项的内容
                // 点击查看或录入进入某个具体的要素时，保存这个要素的状态
                this.curStatus = data.status

                console.log(this.userId)
                this.attachs = {};
                this.files = {};
                this.download = {};
                show_elementReviewer(data)
                    .then(res => {
                        this.dialogVisible = true;
                        this.nodeData = res.data;
                        this.nodeData.qHSE_CompanyYearManagerSysElement_ID = data.qHSE_CompanyYearManagerSysElement_ID
                        this.detailData.evidenceDsecription = this.nodeData.evidenceDescription
                        this.detailData.checkStaffName = this.nodeData.checkStaffName
                        this.detailData.approverStaffName = this.nodeData.approverStaffName
                        this.detailData.attacjDescription = this.nodeData.attachDescrption
                        this.detailData.uploadTime = this.nodeData.uploadTime
                        var attach = this.nodeData.attach;//获取地址字符串
                        if (attach != null) {
                            var arr = attach.split(";");
                            for (var i = 0, j = 0, k = 0; i < arr.length - 1; i++) {
                                //j代表图片数量，k代表文件数量
                                var houzhui = arr[i].substring(arr[i].length - 3);//获取到链接后缀
                                if (houzhui == 'jpg' || houzhui == 'png' || houzhui == 'PNG' || houzhui == 'JPG') {
                                    this.attachs[j] = arr[i];
                                    j++;
                                }
                                else {
                                    this.files[k] = arr[i];
                                    k++;
                                    this.filelength = k;
                                }
                            }
                        }

                        console.log('获取到的要素节点内容：', this.nodeData);

                    })
                    .catch(err => {
                        console.log(err);
                        this.message.error(err.message);
                    })
                this.node = data;
                this.download = [];
                for (var i = 0; i < this.filelength; i++) {
                    await downloadElementFile(this.files[i].substring(49, this.files[i].length))
                        .then(res => {
                            console.log(this.download)
                            this.download[i] = JSON.parse(JSON.stringify(res.data))
                        })
                }
                var strings = JSON.parse(JSON.stringify(this.download))
                this.strings = strings;

                this.detailData = {}
                this.detailData.name = data.name
                this.detailData.code = data.code
                this.detailData.content = data.content
                if (data.content == null) {
                    this.detailData.content = '未输入内容'
                }
                this.detailData.basis = data.basis
                if (data.basis == null) {
                    this.detailData.basis = '未输入内容'
                }
                this.detailData.auditMode = data.auditMode
                this.detailData.initialScore = data.initialScore
                this.detailData.formula = data.formula
                this.detailData.problemDescription = data.problemDescription


            },
            cellStyle(row, column, rowIndex, columnIndex) {//根据报警级别显示颜色
                // console.log(row);
                // console.log(row.column);
                if (row.column.label === "状态" && row.row.status === "备案待查") {
                    return 'color:pink'
                } else if (row.column.label === "状态" && row.row.status === "未提供") {
                    return 'color:orange'
                } else if (row.column.label === "状态" && row.row.status === "未批准") {
                    return 'color:blue'
                } else if (row.column.label === "状态" && row.row.status === "未审核") {
                    return 'color:red'
                }
            },
        },
        mounted() {
            this.handleGetCompany();//第一个函数 获取到公司信息
            this.loadFilterParams();
            this.handleGetInitialData();//获取到表单信息
            this.loading = false;
        }
    }
</script>

<style lang="scss">
    .el-popover.el-popper {
        left: -1000px !important;
    }

    .picSize {
        max-width: 1400px;
        max-height: 750px;
        vertical-align: bottom;
    }

    .picPosition {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>