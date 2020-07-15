<template>
    <div>
        <div class="page-title" style="width:100%">QHSE量化填写</div>
        <div class="page-content">
            <el-row>
                <el-form label-width="130px"  :inline="true" :model="filterQuery">
                    <el-col :span="8">
                        <el-form-item label="选择公司：">
                            <treeselect
                            :multiple="false"
                            :options="companyList"
                            placeholder="请选择公司单位"
                            v-model="filterQuery.companyCode"
                            style="width:200px"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="选择年份：">
                            <el-date-picker v-model="filterQuery.year" type="year" placeholder="选择年份" style="width:200px"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-button type="primary" @click="newCompanyQualityManage()" icon='el-icon-plus'>新增</el-button>
                            <el-button type="primary" @click="handleSearchQualityManage()" icon='el-icon-search'>查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center" class="custom-tree-node">
                <el-col :span="18">
                    
                </el-col>
                <el-col :span="2">
                    <span>完成数/总数</span>
                </el-col>
                <el-col :span="4">
                    <span>操作</span>
                </el-col>
            </el-row>
            <el-row>
                <el-tree 
                :data="treeData" 
                :props="defaultProps" 
                node-key="id"
                accordion 
                highlight-current
                lazy
                :load="load"
                @node-click="handleNodeClick">
                    <el-row class="custom-tree-node" slot-scope="{ node, data }">
                        <el-col :span="18" style="text-align:left">
                            {{node.label }}
                        </el-col>
                        <el-col :span="2" style="text-align:center">
                            {{data.completedCount}}/{{data.totalCount}}
                        </el-col>
                        <el-col :span="2" style="text-align:center">
                            <el-button
                                type="text"
                                size="mini"
                                @click="selectContent(node.label,data.content)"
                                v-if="data.code.length === 4">
                                查看内容
                            </el-button>
                            <el-button
                                type="text"
                                size="mini"
                                @click="selectBasis(data.name,data.basis)"
                                v-else-if="data.code.length === 6">
                                查看依据
                            </el-button>
                            <el-button
                                type="text"
                                size="mini"
                                @click="fillScore(data)"
                                v-else-if="data.code.length === 10 && data.completedCount ===0">
                                填写内容
                            </el-button>
                        </el-col>
                        <el-col :span="2" style="text-align:center">
                            <el-button
                                type="text"
                                size="mini"
                                @click="fillRecordManagement(data.id,data.name,data.basis)"
                                v-if="data.code.length === 6">
                                填写记录
                            </el-button>
                            <el-button
                                type="text"
                                size="mini"
                                @click="updateScore(data)"
                                v-else-if="data.code.length === 10 && data.completedCount===1">
                                修改内容
                            </el-button>
                        </el-col>
                    </el-row>
                </el-tree>
            </el-row>
            <!-- 弹出第二层详细内容 -->
            <el-dialog title="查看内容" :visible.sync="dialogVisibleContent" center width="800px">
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
            <el-dialog title="填写记录" :visible.sync="dialogVisibleRecordManagement" center width="800px">
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
            QuerryQHSEReportElements(this.filterQuery).then((res) =>{
                this.treeData = res.data
            }).catch((err) => {
                this.message.error(err.message)
            })
        },
        handleGetChildrenData(node,resolve){
            QuerryQHSEReportElements(this.filterQuery).then((res) =>{
                return resolve(res.data)
            }).catch((err) => {
                this.message.error(err.message)
            })
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
            this.handleGetDate(this.filterQuery.year)
            this.filterQuery.code = ""
            this.handleGetInitialData()
        },
        handleNodeClick(data) {
            this.filterQuery.code = data.code
        },
        load(node ,resolve){
            this.node = node
            this.resolve = resolve
            if(node.level === 0){
                return resolve(this.treeData)
            }else if(node.level>4){
                return resolve([])
            }else{
                this.handleGetChildrenData(node,resolve)
            }
        },
        replaceData(data){
            if(data){
                return data.replace(/;/g,'\n')
            }else{
                return '无'
            }
        },
        selectContent(label,content){
            this.dialogVisibleContent = true
            this.dialogContent.label = label
            this.dialogContent.content = this.replaceData(content)
        },
        selectBasis(label,basis){
            this.dialogVisibleBasis = true
            this.dialogBasis.label = label
            this.dialogBasis.basis = this.replaceData(basis)
        },
        fillRecordManagement(id,label,basis){
            this.dialogVisibleRecordManagement = true
            this.dialogRecordManagement.id = id
            this.dialogRecordManagement.label = label
            this.dialogRecordManagement.basis = this.replaceData(basis)
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
            this.dialogFillScore.problemDescription = this.replaceData(data.problemDescription)
        },
        handleFillScore(){
            this.dialogVisibleFillScore = false
            this.dialogFillScore.actualScore = parseInt(this.dialogFillScore.actualScore)
            UpdateQHSEReportElements(this.dialogFillScore).then(() => {
                this.$message.success('更新成功')
            }).catch((err) => {
                this.$message.error(err.message)
            })
            // this.handleGetChildrenData(this.node,this.resolve)
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
            // this.handleGetChildrenData(this.node,this.resolve)
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
</style>