<template>
    <div>
        <el-breadcrumb separator="/" class="bread">
            <el-breadcrumb-item :to="{ path: '/qualitySystem/problemAccept/problemAccept' }">问题接收</el-breadcrumb-item>
            <el-breadcrumb-item>问题整改</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        </el-row>
        <div class="page-title" style="width: 100%">问题整改  <el-button type="success" style="float:right; margin-right:80px; font-size: 16px" @click="pushRectify">推送</el-button></div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <!-- 问题接收列表区域 -->
            <el-table :data="problemRectifyList" border stripe>
                <el-table-column type="index" label="序号" width="70px"></el-table-column>
                <el-table-column label="问题性质" prop="nature"></el-table-column>
                <el-table-column label="违章人员" prop="illegalPerson"></el-table-column> 
                <el-table-column label="岗位" prop="post"></el-table-column>
                <el-table-column label="违章条款" prop="violationClause" width="190px"></el-table-column>
                <el-table-column label="不符合标准" prop="nonConformityStd"></el-table-column>
                <el-table-column label="处罚依据" prop="punishmentBasis"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="warning" icon="el-icon-edit" size="mini" @click="problemRectify(scope.row)">整改</el-button>
                    </template>
                </el-table-column>
            </el-table>
              <!-- 问题整改对话框 -->
            <el-dialog
                title="问题整改"
                :visible.sync="problemRectifyDialogVisible"
                width="50%" @close="problemRectifyDialogClose">
                <!-- 问题整改表单 -->
                <el-form :model="rectifyForm" label-width="140px" >
                    <el-tabs v-model="activeIndex" :tab-position="'left'">
                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="编号">
                                <el-input v-model="rectifyForm.no" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="检查表名称">
                                <el-input v-model="rectifyForm.checkListCode" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题描述">
                                <el-input v-model="rectifyForm.description" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题性质">
                                <el-input v-model="rectifyForm.nature" readonly></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="违章信息" name="1">
                        <el-form-item label="违章条款">
                        <el-input v-model="rectifyForm.violationClause" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="违章条款内容">
                        <el-input v-model="rectifyForm.violationClauseContent" readonly></el-input>
                    </el-form-item>
                        <el-form-item label="违章扣款">
                        <el-input v-model="rectifyForm.violationDeduction" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="违章扣分">
                        <el-input v-model="rectifyForm.violationScore" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="违章人员">
                        <el-input v-model="rectifyForm.illegalPerson" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="岗位">
                        <el-input v-model="rectifyForm.post" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="岗位分类">
                        <el-input v-model="rectifyForm.postType" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="用工性质">
                        <el-input v-model="rectifyForm.employmentProperty" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="工作年限">
                        <el-input v-model="rectifyForm.workingYears" readonly></el-input>
                    </el-form-item>
                    </el-form-item>
                    <el-form-item label="学历">
                        <el-input v-model="rectifyForm.education" readonly></el-input>
                    </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="问题信息" name="2">
                            <el-form-item label="不符合性质">
                                <el-input v-model="rectifyForm.nonConformityNature" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合类型">
                                <el-input v-model="rectifyForm.nonConformityType" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准">
                                <el-input v-model="rectifyForm.nonConformityStd" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合原因">
                                <el-input v-model="rectifyForm.nonConformSource" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准条款编号">
                                <el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准条款内容">
                                <el-input v-model="rectifyForm.nonConformClauseContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题图片">
                                <el-image 
                                    style="width: 100px; height: 100px; margin: 0 5px"
                                    :src="item"
                                    :preview-src-list="imageList"
                                    v-for="(item, index) in imageList" :key="index">
                                </el-image>
                            </el-form-item>
                            <el-form-item label="问题附件">
									<a :href="item" v-for="(item, index) in fileProblemList" :key="index" class="filelinks">文件{{ index + 1}}</a>
                                <!-- <el-button type="primary" @click="downloadProblemFile">下载问题文件</el-button> -->
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="整改信息" name="3">
                            <el-form-item label="整改时限">
                                <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                            </el-form-item> 
                            <el-form-item label="纠正措施跟综验证">
                                <el-input v-model="rectifyForm.nonConformCorrectMeasureVerify" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="纠正">
                                <el-input v-model="rectifyForm.nonConformCorrect" placeholder="请填写纠正"></el-input>
                            </el-form-item>
                            <el-form-item label="纠正措施">
                                <el-input v-model="rectifyForm.nonConformCorrectMeasure" type="textarea" placeholder="请填写纠正措施"></el-input>
                            </el-form-item>
                           
                            <el-form-item label="纠正图片">
                                <el-upload
                                action="/api/addQualityAttach"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                :show-file-list="true"
                                list-type="picture"
                                :headers="headers"
                                >
                                <el-button size="small" type="primary">点击上传图片</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="纠正附件">
                                <el-upload
                                action="/api/addQualityAttach"
                                :headers="headers"
                                :on-remove="handleFileRemove"
                                :on-success="handleFileSuccess">
                                <el-button size="small" type="success">点击上传文件</el-button>
                                </el-upload>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="problemRectifyDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="problemRectifySubmit(rectifyForm.qulity_CheckRecordID)">提 交</el-button>
                </span>
            </el-dialog>
            <!-- 图片预览对话框 -->
        <el-dialog
          title="图片预览"
          :visible.sync="preViewDialogVisible"
          width="30%">
          <img :src="preViewPath" alt="" class="previewImg"></img>
        </el-dialog>
        </div>
    </div>
</template>

<script>
import { getProblemRectifyList, updateQualityCheckRecord, modifyPush  } from "../../../services/qualitySystem/problemRectify"
import { GetCurrentUser } from '../../../store/CurrentUser'
const headers1 = {
		Accept: 'application/json',
		'Content-Type': 'aplication/json;charset=utf-8'
	}
	const newOptions = { ...headers1
	}
	let user = GetCurrentUser()
	if (user) {
		newOptions.headers = { ...newOptions.headers1,
			Authorization: user.token
		}
	}
export default {
    data () {
        return {
            loading: false,
            activeIndex: '0',
            // 问题整改列表
            problemRectifyList: [],
            // 上传图片数组
            file: [],
            // 上传文件数组
            fileList: [],
            // 接收问题接收传递过来的数据
            acceptRow: {},
            // 问题整改对象表单
            rectifyForm: {},
            // 问题整改对话框显示与隐藏
            problemRectifyDialogVisible: false,
            // 图片预览路径
            preViewPath: '',
            // 图片上传请求头
            headers: newOptions.headers,
            // 图片预览对话框显示与隐藏
            preViewDialogVisible: false,
            // 纠正措施
            rectifyCorrectMeasure: '',
            // 问题图片数组
            problemPicList: [],
            // 纠正
            rectifyConformCorrect: '',
            // 问题图片
            imageList: [],
            // 问题文件
            fileProblemList: [],
            // 问题全部整改标志数组
            flagRecifyArray: []
        }
    },
    methods: {
        getAcceptRow: function () {
            this.acceptRow = this.$route.query
            console.log('问题接收页面传递过来的数据')
            console.log(this.acceptRow)
            getProblemRectifyList(this.acceptRow.qualityCheckID).then((res) => {
                console.log('查询质量检查id返回的数据')
                console.log(res.data)
                this.problemRectifyList = res.data
            }).catch((err) => {
                this.$message.error(err.message)
            })
        },
        problemRectify: function (row) {
            // 问题整改对话框
            let that = this
            const path = 'http://39.98.173.131:7000/resources/QualityCheck/'
            that.rectifyForm = row
            if(that.rectifyForm.problemPic){
                const imgArray = that.rectifyForm.problemPic.split(';');
                console.log(imgArray)
                for(let i in imgArray){
                    that.imageList.push(path+ imgArray[i])
                }
                console.log(that.imageList)
            }
            if(this.rectifyForm.problemAttach){
                const fileArray = that.rectifyForm.problemAttach.split(';')
                console.log(fileArray)
                for(let j in fileArray){
                    that.fileProblemList.push(path+ fileArray[j])
                }
                console.log(that.fileProblemList)
            }
            
            that.problemRectifyDialogVisible = true
        },
        problemRectifySubmit: function (qualityRecordId) {
            // 修改纠正图片与文件等纠正信息
            this.rectifyForm.correctAttach = this.fileList.join(";")
            console.log(this.rectifyForm.correctAttach)
            this.rectifyForm.correctPic = this.file.join(";")
            console.log(this.rectifyForm.correctPic)
            console.log('更新整改表单')
            console.log(this.rectifyForm)
            if(this.flagRecifyArray.length !== 0){
                const flag = this.findOnly(this.flagRecifyArray, qualityRecordId)
                if(flag !== 1){
                   this.flagRecifyArray.push(qualityRecordId) 
                }
            }else{
                    this.flagRecifyArray.push(qualityRecordId)
                }
            console.log(this.flagRecifyArray)
            updateQualityCheckRecord(qualityRecordId,this.rectifyForm).then((res) => {
                console.log(res.data)
                this.problemRectifyDialogVisible = false
                return this.$message.success('更新表单成功')
            }).catch((err) => {
                this.$message(err.message)
            })
        },
        pushRectify: function () {
            // 全部整改完成推送
            if(this.flagRecifyArray.length === this.rectifyForm.length){
                modifyPush(this.acceptRow.qualityCheckID).then((res) => {
                    console.log(res.data)
                    return this.$message.success('推送成功')
                })
            }else {
                return this.$message.error('有问题尚未整改完成，请继续整改。')
            }
        },
        problemRectifyDialogClose: function () {
            // 问题整改对话框关闭
            this.activeIndex = '0'
            this.imageList = []
            this.fileProblemList = []
        },
        handlePreview: function (file) {
            // 图片已上传，图片预览
            let that = this
            console.log('图片预览信息')
            console.log(file)
            that.preViewPath = "http://39.98.173.131:7000/resources/QualityCheck/" + file.response.data
            console.log(that.preViewPath)
            that.preViewDialogVisible = true
            
        },
        handleRemove: function (file) {
            // 图片移除
            console.log(file)
            // 获取将要删除的图片的临时路径
            const filePath = file.response.data
            // 从这个pics数组中找到对应的图片的索引值
            const i = this.file.findIndex(x => x === filePath)
            // i 就是对应的索引值，X就是数组中的每一项，如果数组中的每一项的属性值等于filePath，那么就找到了
            // 调用数组的splice方法，将该图片信息删除
            this.file.splice(i, 1)
            console.log(this.file)
            // file是将要移除的图片的信息
        },
        handleSuccess: function (response) {
            // 图片上传成功
            console.log(response)
            // 拼接得到一个图片信息对象
            // 将图片push到pics中
            const picInfo = response.data
            this.file.push(picInfo)
            console.log(this.file)
        },
        handleFileRemove: function (file) {
            // 文件删除
            console.log(file)
            // 获取将要删除的文件的临时路径
            const filePath = file.response.data
            // 从这个数组中找到对应的图片的索引值
            const i = this.fileList.findIndex(x => x === filePath)
            // i 就是对应的索引值，X就是数组中的每一项，如果数组中的每一项的属性值等于filePath，那么就找到了
            // 调用数组的splice方法，将该文件信息删除
            this.fileList.splice(i, 1)
            console.log(this.fileList)
            // file是将要移除的文件的信息
        },
        handleFileSuccess: function (response) {
            // 文件上传成功
            console.log(response)
            // 拼接得到一个文件信息对象
            // 将文件push到fileList中
            const picInfo = response.data
            this.fileList.push(picInfo)
            console.log(this.fileList)
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
    watch: {

    },
    created: function () {
        this.getAcceptRow()
    }
}
</script>

<style scoped>
.bread {
    margin-bottom: 20px;
}
.previewImg {
  width: 100%;
}
.filelinks {
    text-decoration: underline;
    color: #0099ff;
    margin: 0 15px;
}
</style>