<template>
    <div>
        <el-breadcrumb separator="/" class="bread">
            <el-breadcrumb-item :to="{ path: '/qualitySystem/problemCheck/problemCheck' }">问题审核</el-breadcrumb-item>
            <el-breadcrumb-item>问题复审</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        </el-row>
        <div class="page-title" style="width: 100%">问题复审<span class="boxNew"><span class="progressData">{{progress}}</span><el-button type="success" style="font-size: 16px" @click="finishReview">审核完成</el-button></span></div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
		<!-- 问题复审列表区域 -->
            <el-table :data="problemReviewList" border stripe>
                <el-table-column type="index" label="序号" width="70px"></el-table-column>
                <el-table-column label="问题性质" prop="nature"></el-table-column>
                <el-table-column label="违章人员" prop="illegalPerson"></el-table-column> 
                <el-table-column label="岗位" prop="post"></el-table-column>
                <el-table-column label="违章条款" prop="violationClause" width="190px"></el-table-column>
                <el-table-column label="不符合标准" prop="nonConformityStd"></el-table-column>
                <el-table-column label="处罚依据" prop="punishmentBasis"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-success" size="mini" @click="problemViewLook(scope.row)" v-if="scope.row.isPush === '已通过' || scope.row.isPush === '已打回'">查看</el-button>
                        <el-button type="warning" icon="el-icon-edit" size="mini" @click="problemViewCheck(scope.row)" v-else>复审</el-button>
                    </template>
                </el-table-column>
            </el-table>

        <!-- 问题审核对话框 -->
            <el-dialog
                title="问题复审"
                :visible.sync="problemCheckDialogVisible"
                width="50%" @close="problemCheckDialogClose">
                <!-- 问题审核表单 -->
                <el-form :model="problemCheckForm" label-width="140px" :rules="problemCheckFormRule" ref="problemCheckFormRef" >
                    <el-tabs v-model="activeIndex" :tab-position="'left'">
                       <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="编号">
                                <el-input v-model="problemCheckForm.no" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="检查表名称">
                                <el-input v-model="problemCheckForm.checkListCode" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题描述">
                                <el-input v-model="problemCheckForm.description" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题性质">
                                <el-input v-model="problemCheckForm.nature" readonly></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="违章信息" name="1">
                     <el-form-item label="处罚依据">
                        <el-input v-model="problemCheckForm.punishmentBasis" readonly></el-input>
                    </el-form-item>
                        <el-form-item label="违章条款">
                        <el-input v-model="problemCheckForm.violationClause" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="违章条款内容">
                        <el-input v-model="problemCheckForm.violationClauseContent" readonly></el-input>
                    </el-form-item>
                        <el-form-item label="违章扣款">
                        <el-input v-model="problemCheckForm.violationDeduction" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="违章扣分">
                        <el-input v-model="problemCheckForm.violationScore" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="违章人员">
                        <el-input v-model="problemCheckForm.illegalPerson" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="岗位">
                        <el-input v-model="problemCheckForm.post" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="岗位分类">
                        <el-input v-model="problemCheckForm.postType" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="用工性质">
                        <el-input v-model="problemCheckForm.employmentProperty" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="工作年限">
                        <el-input v-model="problemCheckForm.workingYears" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="学历">
                        <el-input v-model="problemCheckForm.education" readonly></el-input>
                    </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="问题信息" name="2">
                            <el-form-item label="不符合性质">
                                <el-input v-model="problemCheckForm.nonConformityNature" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合类型">
                                <el-input v-model="problemCheckForm.nonConformityType" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准">
                                <el-input v-model="problemCheckForm.nonConformityStd" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合原因">
                                <el-input v-model="problemCheckForm.nonConformSource" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准条款编号">
                                <el-input v-model="problemCheckForm.nonConformClauseNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准条款内容">
                                <el-input v-model="problemCheckForm.nonConformClauseContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题图片">
                                <el-image 
                                    style="width: 100px; height: 100px; margin: 0 15px"
                                    :src="item"
                                    :preview-src-list="imageList"
                                    v-for="(item, index) in imageList" :key="index">
                                </el-image>
                            </el-form-item>
                            <el-form-item label="问题附件">
                                <a :href="item" class="filelinks" v-for="(item, index) in fileProblemList" :key="index">文件{{ index + 1}}</a>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="整改信息" name="3">
                            <el-form-item label="纠正">
                                <el-input v-model="problemCheckForm.nonConformCorrect" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="纠正措施">
                                <el-input v-model="problemCheckForm.nonConformCorrectMeasure" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="整改时限">
                                <el-input v-model="problemCheckForm.reformLimit" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="纠正措施跟综验证" prop="nonConformCorrectMeasureVerify">
                                <el-input v-model="problemCheckForm.nonConformCorrectMeasureVerify" placeholder="请填写纠正措施跟综验证"></el-input>
                            </el-form-item>
                            <el-form-item label="纠正图片">
                                <el-image 
                                    style="width: 100px; height: 100px; margin: 0 15px"
                                    :src="item"
                                    :preview-src-list="imageCorrectList"
                                    v-for="(item, index) in imageCorrectList" :key="index">
                                </el-image>
                            </el-form-item>
                            <el-form-item label="纠正附件">
                                <a :href="item" class="filelinks" v-for="(item, index) in fileCorrectList" :key="index">文件{{ index + 1}}</a>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="refuseProblemReview">打回</el-button>
                    <el-button type="primary" @click="acceptProblemReview">通 过</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { getProblemReviewList, acceptProblemReviewData, refuseProblemReviewData, updateQualityCheckRecord } from "../../../services/qualitySystem/problemReview"
export default {
    data () {
        return {
            loading: false,
            activeIndex: '0',
            // 接收问题审核传递过来的数据
            acceptRow: {},
            // 问题复审表格数据
            problemReviewList: [],
            // 问题复审表单对象
            problemCheckForm: {},
            // 复审验证规则
            problemCheckFormRule: {
                nonConformCorrectMeasureVerify: [
                    { required: true, message: '请输入纠正措施跟综验证', trigger: 'blur' }
                ]
            },
            // 问题整改完成时间
            rectifyFinshDate: '',
            //问题复审对话框显示与隐藏
            problemCheckDialogVisible: false,
            // 问题审核通过对象
            acceptReviewObject: {
                qualityCheckID: '',
                isPush: '通过'
            },
            // 问题审核打回对象
            refuseReviewObject: {
                qualityCheckID: '',
                isPush: '打回'
            },
            // 纠正措施跟综验证
            reviewConformCorrectMeasureVerify: '',
            // 问题图片
            imageList: [],
            // 问题文件
            fileProblemList: [],
            // 纠正图片
            imageCorrectList: [],
            // 纠正文件
            fileCorrectList: [],
            // 复审全部标志数组
            flagRecifyArray: [],
            // 复审全部通过标志数组
            flagAcceptArray: [],
            // 审核完成标志
            isFinish: 0
        }
    },
    methods: {
        getAcceptRow: function () {
            this.acceptRow = this.$route.query
            console.log('问题审核页面传递过来的数据')
            console.log(this.acceptRow)
            getProblemReviewList(this.acceptRow.qualityCheckID).then((res) => {
                console.log('查询质量检查id返回的数据')
                console.log(res.data)
                this.problemReviewList = res.data
            }).catch((err) => {
                this.$message.error(err.message)
            })
        },
        // 问题审核弹出对话框
        problemViewCheck: function (row) {
            let that = this
            that.problemCheckForm = row
            // 问题图片
            if(that.problemCheckForm.problemPic){
                const imgArray = that.problemCheckForm.problemPic.split(';');
                console.log(imgArray)
                for(let i in imgArray){
                    that.imageList.push('http://39.98.173.131:7000/resources/QualityCheck/'+ imgArray[i])
                }
                console.log(that.imageList)
            }
            
            // 问题文件
            if(that.problemCheckForm.problemAttach){
                const fileArray = that.problemCheckForm.problemAttach.split(';')
                console.log(fileArray)
                for(let j in fileArray){
                    that.fileProblemList.push('http://39.98.173.131:7000/resources/QualityCheck/'+ fileArray[j])
                }
                console.log(that.fileProblemList)
            }
            
            // 纠正图片
            if(that.problemCheckForm.correctPic){
                const imgCorrectArray = that.problemCheckForm.correctPic.split(';');
                console.log(imgCorrectArray)
                for(let i in imgCorrectArray){
                    that.imageCorrectList.push('http://39.98.173.131:7000/resources/QualityCheck/'+ imgCorrectArray[i])
                }
                console.log(that.imageCorrectList)
            }
            
            // 纠正文件
            if(that.problemCheckForm.correctAttach){
                const fileCorrectArray = that.problemCheckForm.correctAttach.split(';')
                console.log(fileCorrectArray)
                for(let j in fileCorrectArray){
                    that.fileCorrectList.push('http://39.98.173.131:7000/resources/QualityCheck/'+ fileCorrectArray[j])
                }
                console.log(that.fileCorrectList)
            }
            that.problemCheckDialogVisible = true
        },
        problemViewLook: function (row) {
            let that = this
            that.problemCheckForm = row
            // 问题图片
            if(that.problemCheckForm.problemPic){
                const imgArray = that.problemCheckForm.problemPic.split(';');
                console.log(imgArray)
                for(let i in imgArray){
                    that.imageList.push('http://39.98.173.131:7000/resources/QualityCheck/'+ imgArray[i])
                }
                console.log(that.imageList)
            }
            
            // 问题文件
            if(that.problemCheckForm.problemAttach){
                const fileArray = that.problemCheckForm.problemAttach.split(';')
                console.log(fileArray)
                for(let j in fileArray){
                    that.fileProblemList.push('http://39.98.173.131:7000/resources/QualityCheck/'+ fileArray[j])
                }
                console.log(that.fileProblemList)
            }
            
            // 纠正图片
            if(that.problemCheckForm.correctPic){
                const imgCorrectArray = that.problemCheckForm.correctPic.split(';');
                console.log(imgCorrectArray)
                for(let i in imgCorrectArray){
                    that.imageCorrectList.push('http://39.98.173.131:7000/resources/QualityCheck/'+ imgCorrectArray[i])
                }
                console.log(that.imageCorrectList)
            }
            
            // 纠正文件
            if(that.problemCheckForm.correctAttach){
                const fileCorrectArray = that.problemCheckForm.correctAttach.split(';')
                console.log(fileCorrectArray)
                for(let j in fileCorrectArray){
                    that.fileCorrectList.push('http://39.98.173.131:7000/resources/QualityCheck/'+ fileCorrectArray[j])
                }
                console.log(that.fileCorrectList)
            }
            that.problemCheckDialogVisible = true
        },
        acceptProblemReview: function () {
            // 问题审核通过
            this.$refs.problemCheckFormRef.validate((valid) => {
                if(!valid){
                    return this.$message.error('纠正措施跟综验证必填项未填')
                }
                this.rectifyFinshDate = this.getRectifyDate()
                this.problemCheckForm.reformDate = this.rectifyFinshDate
                this.problemCheckForm.isPush = '已通过'
                console.log('问题审核通过表单数据')
                console.log(this.problemCheckForm)
                if(this.flagRecifyArray.length !== 0){
                    const flag = this.findOnly(this.flagRecifyArray, this.problemCheckForm.qulity_CheckRecordID)
                    if(flag !== 1){
                        this.flagRecifyArray.push(this.problemCheckForm.qulity_CheckRecordID)
                    }
                }else{
                   this.flagRecifyArray.push(this.problemCheckForm.qulity_CheckRecordID) 
                }
                
                console.log('复审全部标志数组')
                console.log(this.flagRecifyArray)
                if(this.flagAcceptArray.length !== 0){
                    const flag = this.findOnly(this.flagAcceptArray, this.problemCheckForm.qulity_CheckRecordID)
                    if(flag !== 1){
                        this.flagAcceptArray.push(this.problemCheckForm.qulity_CheckRecordID)
                    }
                }else{
                    this.flagAcceptArray.push(this.problemCheckForm.qulity_CheckRecordID)
                }
                
                console.log('复审全部通过标志数组')
                console.log(this.flagAcceptArray)
                updateQualityCheckRecord(this.problemCheckForm.qulity_CheckRecordID, this.problemCheckForm).then((res) => {
                    console.log(res.data)
                    this.problemCheckDialogVisible = false
                    return this.$message.success('问题审核通过成功')
                }).catch((err) => {
                    return this.$message.error(err.message)
                })
            })
        },
        refuseProblemReview: function () {
            // 问题审核打回
            this.$refs.problemCheckFormRef.validate((valid) => {
                if(!valid){
                    return this.$message.error('纠正措施跟综验证必填项未填')
                }
                if(this.flagRecifyArray.length !== 0){
                    const flag = this.findOnly(this.flagRecifyArray, this.problemCheckForm.qulity_CheckRecordID)
                    if(flag !== 1){
                        this.flagRecifyArray.push(this.problemCheckForm.qulity_CheckRecordID)
                    }
                }else{
                    this.flagRecifyArray.push(this.problemCheckForm.qulity_CheckRecordID)
                }
                console.log('复审全部标志数组')
                console.log(this.flagRecifyArray)
                this.problemCheckForm.reformDate = ''
                this.problemCheckForm.isPush = '已打回'
                console.log('问题审核打回表单数据')
                console.log(this.problemCheckForm)
                updateQualityCheckRecord(this.problemCheckForm.qulity_CheckRecordID, this.problemCheckForm).then((res) => {
                    console.log(res.data)
                    this.problemCheckDialogVisible = false
                    return this.$message.success('问题审核打回成功')
                }).catch((err) => {
                    return this.$message.error(err.message)
                })
            }) 
        },
        finishReview: async function () {
            // 审核完成
            if(this.isFinish === 1) {
                return this.$message.error('已进行审核完成，请勿重复执行此操作！')
            }
            console.log(this.flagRecifyArray.length)
            console.log(this.problemReviewList.length)
            console.log('全部通过数组')
                console.log(this.flagAcceptArray.length)
            if(this.flagRecifyArray.length === this.problemReviewList.length){
                //问题审核传通过字段
                console.log('全部通过数组')
                console.log(this.flagAcceptArray.length)
                if(this.flagAcceptArray.length === this.problemReviewList.length){
                    const confirmResult = await this.$confirm('复审已完成，全部通过，数据即将归档, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).catch(err => err)
                    if (confirmResult !== 'confirm') {
                        return this.$message.info('已取消')
                    }
                    
                    this.acceptReviewObject.qualityCheckID = this.acceptRow.qualityCheckID
                    acceptProblemReviewData(this.acceptReviewObject).then((res) => {
                    console.log(res.data)
                    this.isFinish = 1
                    return this.$message.success('数据已归档')
                    }).catch((err) => {
                        return this.$message.error(err.message)
                    })
                }else{// 问题审核传打回字段
                    const confirmResult = await this.$confirm('复审已完成，未全部通过，数据即将打回, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).catch(err => err)
                    if (confirmResult !== 'confirm') {
                        return this.$message.info('已取消')
                    }
                    
                    this.refuseReviewObject.qualityCheckID = this.acceptRow.qualityCheckID
                    refuseProblemReviewData(this.refuseReviewObject).then((res) => {
                    console.log(res.data)
                    this.isFinish = 1
                    return this.$message.success('数据已打回')
                    }).catch((err) => {
                        return this.$message.error(err.message)
                    })
                }
            }else {
                return this.$message.error('有问题尚未复审完成，请继续复审。')
            }
        },
        problemCheckDialogClose: function () {
            // 问题复审对话框关闭
            this.activeIndex = '0'
            this.imageCorrectList = []
            this.fileCorrectList = []
            this.imageList = []
            this.fileProblemList = []
        },
        getRectifyDate: function () {
            // 获取整改完成时间
            const date = new Date()
            const y = date.getFullYear()
            const m = date.getMonth() + 1
            const mm = m < 10 ? '0' + m : m
            const d = date.getDate()
            const dd = d < 10 ? '0' + d : d
            return y + '-' + mm + '-' + dd
        },
        findOnly: function (arr, recordId) {
            // 查找标志数组有无相同元素
            var flagOnly = 0
            for(let i in arr) {
                if(arr[i] === recordId){
                    flagOnly = 1
                    break
                }
            }
            return flagOnly
        }
    },
    created: function () {
        this.getAcceptRow()
    },
    watch: {

    },
    computed: {
        // eslint-disable-next-line vue/no-dupe-keys
        progress: function () {
            const length1 = this.problemReviewList.length
            const length2 = this.flagRecifyArray.length
            return length2 + '/' + length1
        }
    }
}
</script>

<style scoped>
.bread {
    margin-bottom: 20px;
}
.filelinks {
    text-decoration: underline;
    color: #0099ff;
    margin: 0 15px;
}
.boxNew {
    display: inline-block;
    float: left;
    margin-right: 40px;
}
.progressData {
    color: red;
    font-size: 22px;
    margin-right: 20px;
}
</style>