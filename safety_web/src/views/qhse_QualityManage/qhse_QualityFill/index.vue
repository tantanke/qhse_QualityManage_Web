<template>
    <div>
        <div class="page-title" style="width:100%">QHSE量化填写</div>
        <div class="page-content">
            <el-row>
                <el-form label-width="130px"  :inline="true" :model="filterQuery">
                    <el-form-item label="选择公司：">
                        <treeselect
                        :multiple="false"
                        :options="companyList"
                        placeholder="请选择公司单位"
                        v-model="filterQuery.companyCode"
                        style="width:200px"/>
                    </el-form-item>
                    <el-form-item label="选择年份：">
                        <el-date-picker v-model="filterQuery.year" type="year" placeholder="选择年份" style="width:200px"></el-date-picker>
                    </el-form-item>
                     &nbsp;&nbsp;&nbsp;
                    <el-form-item>
                        <el-button type="primary" @click="handleSearchQualityManage()" icon='el-icon-search'>查询</el-button>
                        &nbsp;
                        <el-button type="primary" @click="newCompanyQualityManage()" icon='el-icon-plus'>生成量化表</el-button>
                        &nbsp;
                        <el-button type="primary" @click="handleDownloadExcel()" icon="el-icon-download">导出量化表Excel</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                <el-table
                    :data="treeData"
                    style="width: 100%"
                    ref="treeTable"
                    show-summary
                    row-key="id"
                    :indent=30
                    max-height="560"
                    highlight-current-row
                    border
                    @cell-click="handleCellClick"
                    v-loading="loading"
                    :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
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
                            <el-button type="primary" size="mini"
                                @click="fillRecordManagement(scope.row.id,scope.row.name,scope.row.basis)"
                                v-if="scope.row.code.length === 6">
                                记录详情
                            </el-button>
                            <el-button type="primary" size="mini"
                                @click="updateScore(scope.row)"
                                v-else-if="scope.row.code.length === 10">
                                内容详情
                            </el-button>
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
            <!-- 弹出第三层填写记录 -->
            <el-dialog title="管理及运行要求依据（备注）等" :visible.sync="dialogVisibleRecordManagement" center width="800px">
                <el-form label-width="140px" :model="dialogRecordManagement" style="width:80%">
                    <el-form-item label="管理及运行要求：">
                        <el-input type="textarea" v-model="dialogRecordManagement.label" :autosize="{ minRows: 2}" readonly ></el-input>
                    </el-form-item>
                    <el-form-item label="依据或备注：">
                        <el-input type="textarea" v-model="dialogRecordManagement.basis" placeholder="无" :autosize="{ minRows: 2}" readonly ></el-input>
                    </el-form-item>
                    <el-form-item label="应形成的记录：">
                        <el-input v-if="status==='通过'" type="textarea" v-model="dialogRecordManagement.recordFile" readonly></el-input>
                        <el-input v-else v-model="dialogRecordManagement.recordFile"></el-input>
                    </el-form-item>
                    <el-form-item label="记录管理：">
                        <el-input v-if="status==='通过'" type="textarea" v-model="dialogRecordManagement.recordManagement" readonly></el-input>
                        <el-input v-else v-model="dialogRecordManagement.recordManagement"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align:right">
                    <el-button v-if="status==='未通过'" type="primary" @click="handleAddRecordManagement()">确 定</el-button>
                    <el-button type="danger" @click="dialogVisibleRecordManagement = false">返 回</el-button>
                </div>
            </el-dialog>
            <!-- 弹出第五层修改分数等内容 -->
            <el-dialog title="填写详细内容" :visible.sync="dialogVisibleUpdateScore" center width="1200px">
                <el-form label-width="140px" :model="dialogUpdateScore" style="width:100%">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="量化项：" style="margin-bottom:5px">
                                <el-input type="textarea" v-model="dialogUpdateScore.name" :autosize="{ minRows: 1}" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="审核方式：" style="margin-bottom:5px">
                                <el-input v-model="dialogUpdateScore.auditMode" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="初始分数：" style="margin-bottom:5px">
                                <el-input v-model="dialogUpdateScore.initialScore" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="计算公式：" style="margin-bottom:5px">
                                <el-input type="textarea" v-model="dialogUpdateScore.formula" :autosize="{ minRows: 1}" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="可能问题：" style="margin-bottom:5px">
                                <el-input type="textarea" v-model="dialogUpdateScore.problemDescription" :autosize="{ minRows: 4}" readonly ></el-input>
                            </el-form-item>
                            <el-form-item label="实际问题：" style="margin-bottom:5px">
                                <el-input v-if="status==='通过'" type="textarea" v-model="dialogUpdateScore.existProblems" :autosize="{ minRows: 2}" readonly></el-input>
                                <el-input v-else type="textarea" v-model="dialogUpdateScore.existProblems" :autosize="{ minRows: 2}"></el-input>
                            </el-form-item>
                            <el-form-item label="实际得分：" style="margin-bottom:5px">
                                <el-input v-if="status==='通过'" v-model="dialogUpdateScore.actualScore" readonly></el-input>
                                <el-input v-else v-model="dialogUpdateScore.actualScore"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item label="违章隐患级别：" style="margin-bottom:5px">
                                <el-input v-if="status==='通过'" v-model="dialogUpdateScore.rank" readonly></el-input>
                                <el-select v-else v-model="dialogUpdateScore.rank" placeholder="请选择违章隐患级别">
                                    <el-option
                                        v-for="item in ranks"
                                        :key="item.label"
                                        :label="item.label"
                                        :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="问题图片：" style="margin-bottom:5px">
                                <el-card v-if="status==='通过'" :body-style="{ padding: '10px' }" style="width:100%;height:200px;text-align:center">
                                    <span v-if="!dialogUpdateScore.pictureFile">无图片文件记录！</span>
                                    <el-popover placement="right" title="" trigger="click" v-else>
                                        <div style="max-width:600px;height:auto"><img :src="dialogUpdateScore.pictureFile" style="max-width:600px;height:auto"/></div>
                                        <img slot="reference" :src="dialogUpdateScore.pictureFile" :alt="dialogUpdateScore.pictureFile" style="max-height: 180px">
                                    </el-popover><br/>
                                </el-card>
                                <el-row v-else>
                                    <el-col :span="8">
                                        <el-upload
                                            v-model="dialogUpdateScore.pictureFile"
                                            :action="`/api/uploadQHSEFill`"
                                            :auto-upload='true'
                                            :limit="1"
                                            :headers="{Authorization:currentUser.token}"
                                            :before-upload="beforePictureUpload"
                                            :on-remove="handlePictureRemove"
                                            :on-success="handlePictureSuccess"
                                            list-type="text"
                                            :file-list="filePictureList">
                                            <el-button size="small" type="primary" :disabled="disabledPicture">点击上传</el-button>
                                            <div slot="tip" style="padding-right:20px">只能一张上传jpg、png、bmp格式，且不大于12M的图片。</div>
                                        </el-upload>
                                        </el-col>
                                    <el-col :span="16">
                                        <el-card :body-style="{ padding: '10px' }" style="width:90%;height:200px;text-align:center">
                                            <span v-if="!dialogUpdateScore.pictureFile && !pictureURL">无图片文件记录！</span>
                                            <el-popover placement="right" title="" trigger="click" v-if="pictureURL">
                                                <div style="max-width:600px;height:auto"><img :src="pictureURL" style="max-width:600px;height:auto"/></div>
                                                <img slot="reference" :src="pictureURL" :alt="pictureURL" style="max-height: 180px">
                                            </el-popover><br/>
                                            <el-popover placement="right" title="" trigger="click" v-if="dialogUpdateScore.pictureFile && !pictureURL">
                                                <div style="max-width:600px;height:auto"><img :src="dialogUpdateScore.pictureFile" style="max-width:600px;height:auto"/></div>
                                                <img slot="reference" :src="dialogUpdateScore.pictureFile" :alt="dialogUpdateScore.pictureFile" style="max-height: 180px">
                                            </el-popover><br/>
                                        </el-card>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="视频记录：">
                                <el-card v-if="status==='通过'" :body-style="{ padding: '10px' }" style="width:100%;height:200px;text-align:center" >
                                    <span v-if="!dialogUpdateScore.videoFile">无视频文件记录！</span>
                                    <video v-else width="100%" height="180" controls preload="none" :src="dialogUpdateScore.videoFile"></video>
                                </el-card>
                                <el-row v-else>
                                    <el-col :span="8">
                                        <el-upload
                                            v-model="dialogUpdateScore.videoFile"
                                            :action="`/api/uploadQHSEFill`"
                                            :auto-upload='true'
                                            :limit="1"
                                            :headers="{Authorization:currentUser.token}"
                                            :before-upload="beforeVideoUpload"
                                            :on-remove="handleVideoRemove"
                                            :on-success="handleVideoSuccess"
                                            list-type="text"
                                            :file-list="fileVideoList">
                                            <el-button size="small" type="primary" :disabled="disabledVideo">点击上传</el-button>
                                            <div slot="tip" style="padding-right:20px">只能上传mp4、avi、flash、rmvb、rm格式，且不大于50M的视频。</div>
                                        </el-upload>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-card :body-style="{ padding: '10px' }" style="width:90%;height:200px;text-align:center" >
                                            <span v-if="!dialogUpdateScore.videoFile && !videoURL">无视频文件记录！</span>
                                            <video v-if="videoURL" width="100%" height="180" controls preload="none" :src="videoURL"></video>
                                            <video v-if="dialogUpdateScore.videoFile && !videoURL" width="100%" height="180" controls preload="none" :src="dialogUpdateScore.videoFile"></video>
                                        </el-card>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align:right">
                    <el-button v-if="status==='未通过'" type="primary" @click="handleUpdateScore()">确 定</el-button>
                    <el-button type="danger" @click="dialogVisibleUpdateScore = false">返 回</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {GetCompany} from '../../../services/gettreedata'
import {AddQHSEReport,QuerryQHSEReportElements,UpdateQHSEReportElements} from '../../../services/qhse_QualityFill'
import {GetCurrentUser} from '../../../store/CurrentUser'

const DefaultQuery = {
    year:'',
    companyCode:'',
    status:''
}

export default {
    data(){
        return{
            filterQuery: {},
            companyList:[],
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
            companyName:'',
            status:'',
            disabledPicture:false,
            pictureURL:'',
            filePictureList:[],
            disabledVideo:false,
            videoURL:'',
            fileVideoList:[],
            ranks:[
                {value: '无',label: '无'},
                {value: '轻微',label: '轻微'},
                {value: '一般',label: '一般'},
                {value: '较大',label: '较大'},
                {value: '严重',label: '严重'},
            ]
        }
    },
computed:{
    currentUser(){
        return GetCurrentUser()
    },
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
                this.treeData = res.data.list
                this.companyName = res.data.companyName
                this.status = res.data.status
            }).catch((err) => {
                this.message.error(err.message)
            })
            this.loading = false
        },
        newCompanyQualityManage(){
            this.handleGetDate(this.filterQuery.year)
            AddQHSEReport(this.filterQuery).then(() =>{
                this.$message.success('创建成功')
                this.handleGetInitialData()
            }).catch((err) => {
                this.message.error(err.message)
            })
        },
        handleSearchQualityManage(){
            if(!this.filterQuery.year){
                let year = new Date()
                this.filterQuery.year = String(year.getFullYear())
            }
            this.treeData = []
            this.handleGetDate(this.filterQuery.year)
            this.filterQuery.code = ""
            this.handleGetInitialData()
        },
        selectContent(data){
            this.dialogVisibleContent = true
            this.dialogContent.label = data.name
            this.dialogContent.content = data.content
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
        updateScore(data){
            this.dialogVisibleUpdateScore = true
            this.dialogUpdateScore = JSON.parse(JSON.stringify(data))
        },
        beforePictureUpload(file){
            let size = file.size / 1024 / 1024 / 12
            if(size <= 12 && (file.type==='image/jpeg' || file.type==='image/png' || file.type === 'image/bmp')) {
                return true
            } else {
                this.$notify.warning({
                    title: '警告',
                    message: '图片大小或者格式不满足要求，请检查！'
                })
                return false
            }
        },
        handlePictureRemove(){
            this.dialogUpdateScore.pictureFile = ""
            this.pictureURL = ""
            this.disabledPicture = false
        },
        handlePictureSuccess(response,file){
            this.pictureURL = URL.createObjectURL(file.raw)
            if(response) {
                this.$notify.success({
                    body:{
                        style:{width:'300px',height:'500px'}
                    },
                    title:'提示',
                    message: '图片上传成功!'
                })
                this.dialogUpdateScore.pictureFile = response.data
                this.disabledPicture = true
            }
        },
        beforeVideoUpload(file){
            let size = file.size / 1024 / 1024 / 50
            if(size <= 50 && (file.type==='video/mp4' || file.type==='video/avi' || file.type === 'video/flash' || file.type === 'video/rmvb' || file.type === 'video/rm')) {
                return true
            } else {
                this.$notify.warning({
                    title: '警告',
                    message: '视频大小或者格式不满足要求，请检查！'
                })
                return false
            }
        },
        handleVideoRemove(){
            this.dialogUpdateScore.videoFile = ""
            this.videoURL = ""
            this.disabledVideo = false
        },
        handleVideoSuccess(response,file){
            this.videoURL = URL.createObjectURL(file.raw)
            if(response) {
                this.$notify.success({
                    body:{
                        style:{width:'300px',height:'500px'}
                    },
                    title:'提示',
                    message: '视频上传成功!'
                })
                this.dialogUpdateScore.videoFile = response.data
                this.disabledVideo = true
            }
        },
        handleUpdateScore(){
            let actualScore = parseInt(this.dialogUpdateScore.actualScore)
            let initialScore = this.dialogUpdateScore.initialScore
            
            if(actualScore<0 | actualScore>initialScore){
                this.$notify.warning({
                    title: '温馨提示',
                    message: '实际得分不能小于0或大于初始分数！',
                    type: 'warning'
                })
            }else{
                if(this.dialogUpdateScore.pictureFile && this.dialogUpdateScore.pictureFile.length >50){
                    this.dialogUpdateScore.pictureFile = ''
                }
                if(this.dialogUpdateScore.videoFile && this.dialogUpdateScore.videoFile.length >50){
                    this.dialogUpdateScore.videoFile = ''
                }
                this.dialogVisibleUpdateScore = false
                this.dialogUpdateScore.actualScore = parseInt(this.dialogUpdateScore.actualScore)
                UpdateQHSEReportElements(this.dialogUpdateScore).then(() => {
                    this.$message.success('更新成功')
                    this.handleGetInitialData()
                }).catch((err) => {
                    this.$message.error(err.message)
                })
                this.disabledPicture = false
                this.pictureURL = ""
                this.filePictureList = []
                this.disabledVideo = false
                this.videoURL = ""
                this.fileVideoList = []
            }
        },
        handleCellClick(row,cell,column){
            if(row.code.length < 10){
                let els = column.getElementsByClassName('el-icon-arrow-right') 
                if(els.length !=0){
                    els[0].click()
                }
            }
        },
        handleDownloadExcel() {
            if (this.treeData!= []) {
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../../vendor/Export2ExcelTree')
                    const { export_get_title_time } = require('../../../vendor/Export2ExcelTree')
                    const { format_json } = require('../../../vendor/Export2ExcelTree')
                    const tHeader = ['主题', '项目', '内容', '管理及运行要求','依据或备注','应形成的记录','记录管理',
                                    '量化说明','量化项','审核方式','分数','计算公式','可能存在的问题描述','实际存在问题',
                                    '违章、隐患分级','得分','问题图示','视频记录编号']
                    const filterVal = [ 'theme', 'project', 'content',  'requirements','basis', 'recordFile','recordManagement',
                                        'qExplanation','qTerm','auditMode','initialScore','formula','problemDescription','existProblems',
                                        'rank','actualScore','pictureFile','videoFile']
                    const list = this.treeData
                    var theme_c = filterVal.indexOf("theme")
                    var project_c = filterVal.indexOf("project")
                    var content_c = filterVal.indexOf("content")
                    var requirements_c = filterVal.indexOf("requirements")
                    var basis_c = filterVal.indexOf("basis")
                    var recordFile_c = filterVal.indexOf("recordFile")
                    var recordManagement_c = filterVal.indexOf("recordManagement")
                    var qExplanation_c = filterVal.indexOf("qExplanation")
                    var current_r = 1;
                    // var current_s_r = 1
                    var theme_s_r = 1;
                    var project_s_r = 1;
                    var content_s_r = 1;
                    var requirements_s_r = 1;
                    var basis_s_r = 1;
                    var recordFile_s_r = 1;
                    var recordManagement_s_r = 1;
                    var qExplanation_s_r = 1;
                    //要合并集合
                    var merges = [];
                    var nowList = [];
                    for (let i = 0; i < list.length; i++) {
                        const level1 = list[i];
                        for (let j = 0; j < level1.childNode.length; j++) {
                            const level2 = level1.childNode[j];
                            for (let k = 0; k < level2.childNode.length; k++) {
                                const level3 = level2.childNode[k];
                                for (let l = 0; l < level3.childNode.length; l++) {
                                    const level4 = level3.childNode[l];
                                    for (let m = 0; m < level4.childNode.length; m++) {
                                        const level5 = level4.childNode[m];
                                        current_r++
                                        nowList.push(
                                            {
                                                theme:level1.name, 
                                                project:level2.name, content:level2.content,
                                                requirements:level3.name, basis:level3.basis, recordFile:level3.recordFile,recordManagement:level3.recordManagement,
                                                qExplanation:level4.name, 
                                                qTerm:level5.name, auditMode:level5.auditMode, 
                                                initialScore:String(level5.initialScore), 
                                                formula:level5.formula, problemDescription:level5.problemDescription, 
                                                existProblems:level5.existProblems, rank:level5.rank, 
                                                actualScore:String(level5.actualScore), 
                                                pictureFile:level5.pictureFile, videoFile:level5.videoFile
                                            }
                                        )
                                    }
                                    if(qExplanation_s_r != (current_r-1)){
                                        var qExplanationMerges = {
                                            s: {c: qExplanation_c,r: qExplanation_s_r},
                                            e: {c: qExplanation_c,r: current_r-1}
                                        };
                                        merges.push(qExplanationMerges)
                                    }
                                    qExplanation_s_r = current_r
                                }
                                if(requirements_s_r != (current_r-1)){
                                    var requirementsMerges = [
                                        { s: {c: requirements_c,r: requirements_s_r}, e: {c: requirements_c,r: current_r-1} },
                                        { s: {c: basis_c,r: basis_s_r}, e: {c: basis_c,r: current_r-1} },
                                        { s: {c: recordFile_c,r: recordFile_s_r}, e: {c: recordFile_c,r: current_r-1} },
                                        { s: {c: recordManagement_c,r: recordManagement_s_r}, e: {c: recordManagement_c,r: current_r-1} }
                                    ];
                                    merges.push(requirementsMerges[0],requirementsMerges[1],requirementsMerges[2],requirementsMerges[3],)
                                }
                                requirements_s_r = current_r
                                basis_s_r = current_r
                                recordFile_s_r = current_r
                                recordManagement_s_r = current_r
                            }
                            if(project_s_r != (current_r-1)){
                                var projectMerges = [
                                    { s: {c: project_c,r: project_s_r}, e: {c: project_c,r: current_r-1} },
                                    { s: {c: content_c,r: content_s_r}, e: {c: content_c,r: current_r-1} }
                                ];
                                merges.push(projectMerges[0],projectMerges[1])
                            }
                            project_s_r = current_r
                            content_s_r = current_r
                        }
                        if(theme_s_r != (current_r-1)){
                            var nodeMerges = {
                                s: {c: theme_c,r: theme_s_r},
                                e: {c: theme_c,r: current_r-1}
                            };
                            merges.push(nodeMerges)
                        }
                        theme_s_r = current_r
                    }
                    const data = format_json(filterVal, nowList)
                    const currentdate = export_get_title_time()
                    export_json_to_excel(tHeader, data, '（'+ this.companyName +'）QHSE管理体系要素一体化、标准化_'+currentdate,merges)
                })
            }
            this.loading = false;
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