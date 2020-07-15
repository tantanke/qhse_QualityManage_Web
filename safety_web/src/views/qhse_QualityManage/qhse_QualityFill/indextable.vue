<template>
    <div>
        <div class="page-title" style="width:100%">QHSE量化填写</div>
        <div class="page-content">
            <el-row>
                <el-form label-width="130px"  :inline="true" :model="filterQuery">
                    <!-- <el-col :span="6"> -->
                    <el-form-item label="选择公司：">
                        <treeselect
                        :multiple="false"
                        :options="companyList"
                        placeholder="请选择公司单位"
                        v-model="filterQuery.companyCode"
                        style="width:200px"/>
                    </el-form-item>
                    <!-- </el-col>
                    <el-col :span="6"> -->
                    <el-form-item label="选择年份：">
                        <el-date-picker v-model="filterQuery.year" type="year" placeholder="选择年份" style="width:200px"></el-date-picker>
                    </el-form-item>
                    <!-- </el-col>
                    <el-col :span="6"> -->
                     &nbsp;&nbsp;&nbsp;
                    <el-form-item>
                        <el-button type="primary" @click="newCompanyQualityManage()" icon='el-icon-plus'>新增</el-button>
                        &nbsp;
                        <el-button type="primary" @click="handleSearchQualityManage()" icon='el-icon-search'>查询</el-button>
                        &nbsp;
                        <el-button type="primary" @click="handleDownloadExcel()" icon="el-icon-download">导出Excel</el-button>
                    </el-form-item>
                    <!-- </el-col> -->
                </el-form>
            </el-row>
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                <el-table
                    :data="treeData"
                    style="width: 100%"
                    show-summary
                    row-key="id"
                    :indent=30
                    max-height="650"
                    border
                    lazy
                    :load="load"
                    v-loading="loading"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column> -->
                    <!-- <el-table-column prop="code" label="编码" width="140" align="left"></el-table-column> -->
                    <el-table-column prop="name" label="内容"></el-table-column>
                    <el-table-column prop="actualScore" label="得分" width="70" align="center"></el-table-column>
                    <el-table-column prop="initialScore" label="总分" width="70" align="center"></el-table-column>
                    <el-table-column prop="completedCount" label="完成数" width="80" align="center"></el-table-column>
                    <el-table-column prop="totalCount" label="总数" width="70" align="center"></el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" 
                                @click="selectContent(scope.row)" 
                                v-if="scope.row.code.length === 4">
                                项目内容
                            </el-button>
                            <!-- <el-button type="primary" size="mini"
                                @click="selectBasis(scope.row.name,scope.row.basis)"
                                v-else-if="scope.row.code.length === 6">
                                查看依据
                            </el-button> -->
                            <el-button type="primary" size="mini"
                                @click="fillRecordManagement(scope.row.id,scope.row.name,scope.row.basis)"
                                v-if="scope.row.code.length === 6">
                                记录详情
                            </el-button>
                            <el-button type="primary" size="mini"
                                @click="updateScore(scope.row)"
                                v-else-if="scope.row.code.length === 10">
                                填写内容
                            </el-button>
                            <!-- <el-button type="primary" size="mini"
                                @click="fillScore(scope.row)"
                                v-else-if="scope.row.code.length === 10 && scope.row.completedCount ===0">
                                填写内容
                            </el-button> -->
                            <!-- <el-button type="primary" size="mini"
                                @click="updateScore(scope.row)"
                                v-else-if="scope.row.code.length === 10 && scope.row.completedCount===1">
                                修改内容
                            </el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <!-- 弹出第二层详细内容 -->
            <el-dialog title="项目内容" :visible.sync="dialogVisibleContent" center width="800px">
                <el-form label-width="140px" :model="dialogContent" style="width:80%">
                    <el-form-item label="项目：">
                        <el-input type="textarea" v-model="dialogContent.label" :autosize="{ minRows: 2}" readonly ></el-input>
                    </el-form-item>
                    <el-form-item label="内容：">
                        <el-input type="textarea" v-model="dialogContent.content" :autosize="{ minRows: 2}" readonly ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align:right">
                    <el-button type="danger" @click="dialogVisibleContent = false">返 回</el-button>
                </div>
            </el-dialog>
            <!-- 弹出第三层管理及运行要求依据或备注 -->
            <el-dialog title="查看依据" :visible.sync="dialogVisibleBasis" center width="800px">
                <el-form label-width="140px" :model="dialogBasis" style="width:80%">
                    <el-form-item label="管理及运行要求：">
                        <el-input type="textarea" v-model="dialogBasis.label" :autosize="{ minRows: 2}" readonly ></el-input>
                    </el-form-item>
                    <el-form-item label="依据或备注：">
                        <el-input type="textarea" v-model="dialogBasis.basis" :autosize="{ minRows: 2}" readonly ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align:right">
                    <el-button type="danger" @click="dialogVisibleBasis = false">返 回</el-button>
                </div>
            </el-dialog>
            <!-- 弹出第三层填写记录 -->
            <el-dialog title="管理及运行要求依据（备注）等" :visible.sync="dialogVisibleRecordManagement" center width="800px">
                <el-form label-width="140px" :model="dialogRecordManagement" style="width:80%">
                    <el-form-item label="管理及运行要求：">
                        <el-input type="textarea" v-model="dialogRecordManagement.label" :autosize="{ minRows: 2}" readonly ></el-input>
                    </el-form-item>
                    <el-form-item label="依据或备注：">
                        <el-input type="textarea" v-model="dialogRecordManagement.basis" :autosize="{ minRows: 2}" readonly ></el-input>
                    </el-form-item>
                    <el-form-item label="应形成的记录：">
                        <el-input v-model="dialogRecordManagement.recordFile"></el-input>
                    </el-form-item>
                    <el-form-item label="记录管理：">
                        <el-input v-model="dialogRecordManagement.recordManagement"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align:right">
                    <el-button type="primary" @click="handleAddRecordManagement()">确 定</el-button>
                    <el-button type="danger" @click="dialogVisibleRecordManagement = false">返 回</el-button>
                </div>
            </el-dialog>
            <!-- 弹出第五层填写分数等内容 -->
            <el-dialog title="填写详细内容" :visible.sync="dialogVisibleFillScore" center width="1000px">
                <el-form label-width="140px" :model="dialogFillScore" style="width:100%">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="量化项：">
                                <el-input type="textarea" v-model="dialogFillScore.name" :autosize="{ minRows: 1}" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="审核方式：">
                                <el-input v-model="dialogFillScore.auditMode" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="初始分数：">
                                <el-input v-model="dialogFillScore.initialScore" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="计算公式：">
                                <el-input type="textarea" v-model="dialogFillScore.formula" :autosize="{ minRows: 1}" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="可能存在的问题：">
                                <el-input type="textarea" v-model="dialogFillScore.problemDescription" :autosize="{ minRows: 4}" readonly ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实际存在的问题：">
                                <el-input type="textarea" v-model="dialogFillScore.existProblems" :autosize="{ minRows: 2}"></el-input>
                            </el-form-item>
                            <el-form-item label="实际得分：">
                                <el-input v-model="dialogFillScore.actualScore"></el-input>
                            </el-form-item>
                            <el-form-item label="违章隐患级别：">
                                <el-input v-model="dialogFillScore.rank"></el-input>
                            </el-form-item>
                            <el-form-item label="问题图片：">
                                <el-input v-model="dialogFillScore.pictureFile"></el-input>
                            </el-form-item>
                            <el-form-item label="视频记录：">
                                <el-input v-model="dialogFillScore.videoFile"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align:right">
                    <el-button type="primary" @click="handleFillScore()">确 定</el-button>
                    <el-button type="danger" @click="dialogVisibleFillScore = false">返 回</el-button>
                </div>
            </el-dialog>
            <!-- 弹出第五层修改分数等内容 -->
            <el-dialog title="填写详细内容" :visible.sync="dialogVisibleUpdateScore" center width="1000px">
                <el-form label-width="140px" :model="dialogUpdateScore" style="width:100%">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="量化项：">
                                <el-input type="textarea" v-model="dialogUpdateScore.name" :autosize="{ minRows: 1}" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="审核方式：">
                                <el-input v-model="dialogUpdateScore.auditMode" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="初始分数：">
                                <el-input v-model="dialogUpdateScore.initialScore" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="计算公式：">
                                <el-input type="textarea" v-model="dialogUpdateScore.formula" :autosize="{ minRows: 1}" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="可能存在的问题：">
                                <el-input type="textarea" v-model="dialogUpdateScore.problemDescription" :autosize="{ minRows: 4}" readonly ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实际存在的问题：">
                                <el-input type="textarea" v-model="dialogUpdateScore.existProblems" :autosize="{ minRows: 2}"></el-input>
                            </el-form-item>
                            <el-form-item label="实际得分：">
                                <el-input v-model="dialogUpdateScore.actualScore"></el-input>
                            </el-form-item>
                            <el-form-item label="违章隐患级别：">
                                <el-input v-model="dialogUpdateScore.rank"></el-input>
                            </el-form-item>
                            <el-form-item label="问题图片：">
                                <el-input v-model="dialogUpdateScore.pictureFile"></el-input>
                            </el-form-item>
                            <el-form-item label="视频记录：">
                                <el-input v-model="dialogUpdateScore.videoFile"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align:right">
                    <el-button type="primary" @click="handleUpdateScore()">确 定</el-button>
                    <el-button type="danger" @click="dialogVisibleUpdateScore = false">返 回</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {GetCompany} from '../../../services/gettreedata'
import {AddQHSEReport,QuerryQHSEReportElements,UpdateQHSEReportElements} from '../../../services/qhse_QualityFill'

const DefaultQuery = {
    year:'',
    companyCode:'',
    code:''
}

export default {
    data(){
        return{
            filterQuery: {},
            companyList:[],
            defaultProps: {
                id:"id",
                children: "children",
                label: "name",
            },
            loading:true,
            dialogVisibleContent:false,
            dialogContent:{},
            dialogVisibleBasis:false,
            dialogBasis:{},
            dialogVisibleRecordManagement:false,
            dialogRecordManagement:{},
            dialogVisibleFillScore:false,
            dialogFillScore:{},
            dialogVisibleUpdateScore:false,
            dialogUpdateScore:{},
            treeData:[],
            childrenData:[],
            countList:[],
            node:[],
            resolve:[]
        }
    },
    mounted(){
        this.loadFilterParams()
        this.handleGetCompany()
        this.handleGetInitialData()
    },
    methods:{
        handleGetCompany(){
            GetCompany().then((res) => {
                this.companyList = JSON.parse(JSON.stringify(res.data))
                this.filterQuery.companyCode = res.data[0].nodeCode
            }).catch((err) => {
                this.$message.error(err.message)
            })
        },
        loadFilterParams () {
            this.filterQuery = {...DefaultQuery, ...this.$route.query}
            this.filterQuery = {
                ...this.filterQuery
            }
            this.filterQuery.year = new Date()
            this.handleGetDate(this.filterQuery.year)
        },
        handleGetDate(date){
            let nowdata = new Date(date)
            this.filterQuery.year = String(nowdata.getFullYear())
        },
        handleGetInitialData(){
            this.loading = true
            QuerryQHSEReportElements(this.filterQuery).then((res) =>{
                this.treeData = res.data
                this.treeData.forEach((item) => {
                    item.hasChildren = true
                })
            }).catch((err) => {
                this.message.error(err.message)
            })
            this.loading = false
        },
        handleGetChildrenData(tree, treeNode, resolve){
            this.loading = true
            QuerryQHSEReportElements(this.filterQuery).then((res) =>{
                if(tree.code.length<8){
                    res.data.forEach((item) => {
                        item.hasChildren = true
                    })
                }else{
                    res.data.forEach((item) => {
                        item.hasChildren = false
                    })
                }
                tree.children = res.data
                return resolve(res.data)
            }).catch((err) => {
                this.message.error(err.message)
            })
            this.loading = false
        },
        newCompanyQualityManage(){
            this.handleGetDate(this.filterQuery.year)
            AddQHSEReport(this.filterQuery).then(() =>{
                this.$message.success('创建成功')
            }).catch((err) => {
                this.message.error(err.message)
            })
            this.handleGetInitialData()
        },
        handleSearchQualityManage(){
            this.treeData = []
            this.handleGetDate(this.filterQuery.year)
            this.filterQuery.code = ""
            this.handleGetInitialData()
        },
        load(tree, treeNode, resolve){
            this.filterQuery.code = tree.code
            this.handleGetChildrenData(tree, treeNode, resolve)
        },
        replaceData(data){
            if(data){
                return data.replace(/;/g,'\n')
            }else{
                return '无'
            }
        },
        selectContent(data){
            this.dialogVisibleContent = true
            this.dialogContent.label = data.name
            this.dialogContent.content = data.content
        },
        selectBasis(label,basis){
            this.dialogVisibleBasis = true
            this.dialogBasis.label = label
            this.dialogBasis.basis = basis
        },
        fillRecordManagement(id,label,basis){
            this.dialogVisibleRecordManagement = true
            this.dialogRecordManagement.id = id
            this.dialogRecordManagement.label = label
            this.dialogRecordManagement.basis = basis
        },
        handleAddRecordManagement(){
            this.dialogVisibleRecordManagement = false
        },
        fillScore(data){
            this.dialogVisibleFillScore = true
            this.dialogFillScore.id = data.id 
            this.dialogFillScore.name = data.name
            this.dialogFillScore.auditMode = data.auditMode
            this.dialogFillScore.initialScore = data.initialScore
            this.dialogFillScore.formula = data.formula
            this.dialogFillScore.problemDescription = data.problemDescription
        },
        handleFillScore(){
            this.dialogVisibleFillScore = false
            this.dialogFillScore.actualScore = parseInt(this.dialogFillScore.actualScore)
            UpdateQHSEReportElements(this.dialogFillScore).then(() => {
                this.$message.success('更新成功')
            }).catch((err) => {
                this.$message.error(err.message)
            })
        },
        updateScore(data){
            this.dialogVisibleUpdateScore = true
            this.dialogUpdateScore = data
        },
        handleUpdateScore(){
            this.dialogVisibleUpdateScore = false
            this.dialogUpdateScore.actualScore = parseInt(this.dialogUpdateScore.actualScore)
            UpdateQHSEReportElements(this.dialogUpdateScore).then(() => {
                this.$message.success('更新成功')
            }).catch((err) => {
                this.$message.error(err.message)
            })
        }
    }
}
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 8px;
}
/* .el-table__header tr,
  .el-table__header th {
    font-size: 15px;
    color: black;
    font-weight: 700;
}


.el-table__body tr,
    .el-table__body td {
        color: black;
        padding: 0;
        height: 40px;
}

.el-table__footer tr,
    .el-table__footer td {
        font-size: 15px;
        color: black;
        font-weight: 700;
} */
</style>