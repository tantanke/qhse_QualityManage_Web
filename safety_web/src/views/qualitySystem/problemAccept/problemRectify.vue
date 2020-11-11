<template>
    <div>
        <el-breadcrumb separator="/" class="bread">
            <el-breadcrumb-item :to="{ path: '/qualitySystem/problemAccept/problemAccept' }">问题整改</el-breadcrumb-item>
            <el-breadcrumb-item>整改项</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        </el-row>
        <div class="page-title" style="width: 100%">问题整改  <span class="boxNew" v-if="isBelongToPart === true"><span class="progressData" >{{"进度："+ progress}}</span></span></div>
		<div class="page-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <!-- 问题接收列表区域 -->
            <el-table :data="problemRectifyList" border stripe>
                <el-table-column type="index" label="序号" width="70px" align="center"></el-table-column>
                <el-table-column label="问题性质" prop="nature" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="问题描述" prop="description" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="责任单位" prop="responsiCompanyName" show-overflow-tooltip align="center"></el-table-column> 
                <el-table-column label="负责人" prop="responsePersonName" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="状态" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						<el-tag type="warning">{{scope.row.isPush}}</el-tag>
					</template>
				</el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" icon="el-icon-success" size="mini" @click="problemLook(scope.row)" v-if="scope.row.isPush === '问题已整改' || scope.row.isPush === '审核已通过' || scope.row.isPush === '验证已通过'">查看</el-button>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="problemRectify(scope.row)" v-else>整改</el-button>
                    </template>
                </el-table-column>
            </el-table>
              <!-- 问题整改对话框 -->
            <el-dialog
                title="整改项"
                :visible.sync="problemRectifyDialogVisible"
                width="50%" @close="problemRectifyDialogClose" :close-on-click-modal="false">
                <!-- 问题整改表单 -->
                <el-form :model="rectifyForm" label-width="140px" >
                    <el-tabs v-model="activeIndex" :tab-position="'left'">
                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="要素名称">
                                <el-input v-model="rectifyFormCheckName" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="责任单位">
                                <el-input v-model="rectifyForm.responsiCompanyName" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="负责人">
                                <el-input v-model="rectifyForm.responsePersonName" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题描述">
                                <el-input v-model="rectifyForm.description" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="问题性质">
                                <el-input v-model="rectifyForm.nature" readonly></el-input>
                            </el-form-item>
			    <el-form-item label="问题附件">
				<a :href="item.url" v-for="(item, index) in fileProblemList" :key="index" class="filelinks">{{item.fileName}}</a>
                            </el-form-item>
                            <el-form-item label="问题图片">
                                <el-image 
                                    style="width: 100px; height: 100px; margin: 0 5px"
                                    :src="item"
                                    :preview-src-list="imageList"
                                    v-for="(item, index) in imageList" :key="index">
                                </el-image>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="违章信息" name="1" v-if="rectifyForm.nature === '违章项'">
						<el-form-item label="不符合标准">
						    <el-input v-model="rectifyForm.nonConformityStd" readonly></el-input>
						</el-form-item>
						<el-form-item label="标准条款号">
						    <el-input v-model="rectifyForm.nonConformityStdNo" readonly></el-input>
						</el-form-item>
						<el-form-item label="标准条款内容">
						    <el-input v-model="rectifyForm.nonConformityStdContent" readonly></el-input>
						</el-form-item>
						<el-form-item label="不符合文件">
						    <el-input v-model="rectifyForm.nonConformClause" readonly></el-input>
						</el-form-item>
						<el-form-item label="文件条款号">
						    <el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
						</el-form-item>
						<el-form-item label="文件条款内容">
						    <el-input v-model="rectifyForm.nonConformClauseContent" readonly></el-input>
						</el-form-item>	
                        <el-form-item label="处罚依据">
                        <el-input v-model="rectifyForm.punishmentBasis" readonly></el-input>
                    </el-form-item>
                        <el-form-item label="违章条款号">
                        <el-input v-model="rectifyForm.violationClause" readonly></el-input>
                    </el-form-item>
            
                    <el-form-item label="违章条款内容">
                        <el-input v-model="rectifyForm.violationClauseContent" readonly></el-input>
                    </el-form-item>
                        <el-form-item label="违章扣款">
                        <el-input v-model="rectifyForm.violationDeduction" readonly></el-input>
                    </el-form-item>
                  
                    <el-form-item label="违章扣分">
                        <el-input v-model="rectifyForm.violationScore" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="违章人员">
                        <el-input v-model="rectifyForm.illegalPerson" readonly></el-input>
                    </el-form-item>
                   
                    <el-form-item label="违章人员岗位">
                        <el-input v-model="rectifyForm.post" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="岗位分类">
                        <el-input v-model="rectifyForm.postType" readonly></el-input>
                    </el-form-item>
              
                    <el-form-item label="用工性质">
                        <el-input v-model="rectifyForm.employmentProperty" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="工作年限">
                        <el-input v-model="rectifyForm.workingYears" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="学历">
                        <el-input v-model="rectifyForm.education" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="整改时限">
                        <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                    </el-form-item> 
                        </el-tab-pane>
                        <el-tab-pane label="问题信息" name="2" v-else-if="rectifyForm.nature === '问题项'">
                            <el-form-item label="不符合标准">
                                <el-input v-model="rectifyForm.nonConformityStd" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="标准条款号">
                                <el-input v-model="rectifyForm.nonConformityStdNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="标准条款内容">
                                <el-input v-model="rectifyForm.nonConformityStdContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合文件">
                                <el-input v-model="rectifyForm.nonConformClause" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="文件条款号">
                                <el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="文件条款内容">
                                <el-input v-model="rectifyForm.nonConformClauseContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合原因">
                                <el-input v-model="rectifyForm.nonConformSource" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="整改时限">
                                <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                            </el-form-item> 
                        </el-tab-pane>
                        <el-tab-pane label="观察信息" name="3" v-else-if="rectifyForm.nature === '观察项'">
                            <el-form-item label="不符合原因">
                                <el-input v-model="rectifyForm.nonConformSource" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="整改时限">
                                <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                            </el-form-item> 
                        </el-tab-pane>
                        <el-tab-pane label="不符合项" name="4" v-else-if="rectifyForm.nature === '不符合'">
                            <el-form-item label="不符合性质">
                                <el-input v-model="rectifyForm.nonConformityNature" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合类型">
                                <el-input v-model="rectifyForm.nonConformityType" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合标准">
                                <el-input v-model="rectifyForm.nonConformityStd" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="标准条款号">
                                <el-input v-model="rectifyForm.nonConformityStdNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="标准条款内容">
                                <el-input v-model="rectifyForm.nonConformityStdContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合文件">
                                <el-input v-model="rectifyForm.nonConformClause" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="文件条款号">
                                <el-input v-model="rectifyForm.nonConformClauseNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="文件条款内容">
                                <el-input v-model="rectifyForm.nonConformClauseContent" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="不符合原因">
                                <el-input v-model="rectifyForm.nonConformSource" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="整改时限">
                                <el-input v-model="rectifyForm.reformLimit" readonly></el-input>
                            </el-form-item> 
                        </el-tab-pane>
                         
                        <el-tab-pane label="整改信息" name="6">
                            <el-form-item label="纠正">
                                <el-input v-model="rectifyForm.nonConformCorrect" placeholder="请填写纠正"></el-input>
                            </el-form-item>
                            <el-form-item label="纠正措施">
                                <el-input v-model="rectifyForm.nonConformCorrectMeasure" type="textarea" placeholder="请填写纠正措施"></el-input>
                            </el-form-item>
			    <el-form-item label="跟综验证">
                                <el-input v-model="rectifyForm.nonConformCorrectMeasureVerify" readonly></el-input>
                            </el-form-item>
			     <el-form-item label="整改完成时间">
                                <el-input v-model="rectifyForm.reformDate" readonly></el-input>
                            </el-form-item>
			    <el-form-item label="纠正附件">
							    <el-upload
							    ref="uploadFile"
							    action="/api/addQualityAttach"
							    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
							    :headers="headers"
							    :on-remove="handleFileRemove"
							    :on-success="handleFileSuccess"
							    v-if="isBelongToPart === true">
							    <el-button size="small" type="success" icon="el-icon-upload">点击上传文件</el-button>
							    </el-upload>
			    </el-form-item>
                            <el-form-item label="纠正图片">
                                <el-upload
                                ref="uploadPic"
                                action="/api/addQualityAttach"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                :show-file-list="true"
                                list-type="picture"
                                accept=".jpg,.jpeg,.png"
                                :headers="headers"
                                v-if="isBelongToPart === true">
                                <el-button size="small" type="primary" icon="el-icon-upload">点击上传图片</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="历史纠正文件" class="historyfile">
                                <div class="historyFile" v-for="(item, index) in historyFileList" :key="index" >
                                    <a :href="item.url" class="filelinks">{{item.fileName}}</a>
                                    <el-button type="text" size="mini" @click="deleteFile(item.url)">
                                        <i class="el-icon-close"></i>
                                    </el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="历史纠正图片">
                                <div  v-for="(item, index) in historyImageList" :key="index" class="historyPic">
                                    <el-image 
                                    style="width: 100px; height: 100px;"
                                    :src="item"
                                    :preview-src-list="historyImageList">
                                </el-image>
                                <el-button type="text" size="mini" @click="deleteImage(item)" class="iconBtns">
                                    <i class="el-icon-close"></i>
                                    </el-button>
                                </div>
                            </el-form-item>
                           
                        </el-tab-pane>
                       <el-tab-pane label="验证信息" name="5">
                           <el-form-item label="审核验证时间">
                                <el-input v-model="rectifyForm.cheVerifyDate" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="审核验证人">
                                <el-input v-model="rectifyForm.cheVerifierName" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="审核验证意见">
                                <el-input v-model="rectifyForm.cheVerifyAdvice" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="责任单位验证时间">
                               <el-input v-model="rectifyForm.resVerifyDate" readonly></el-input>
                           </el-form-item>
                       	<el-form-item label="责任单位验证人">
                               <el-input v-model="rectifyForm.resVerifierName" readonly></el-input>
                           </el-form-item>
                       	<el-form-item label="责任单位验证意见">
                               <el-input v-model="rectifyForm.resVerifyAdvice" readonly></el-input>
                           </el-form-item>
                       </el-tab-pane>
                    </el-tabs>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="problemRectifySubmit(rectifyForm.qulity_CheckRecordID)" v-if="isBelongToPart === true" icon="el-icon-folder">保 存</el-button>
                    <el-button @click="problemRectifyDialogVisible = false" v-else icon="el-icon-refresh-left">关闭</el-button>
                    
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
import { getProblemRectifyList, updateQualityCheckRecord, getOriginFileName, getQualityCheckList  } from "../../../services/qualitySystem/problemRectify"
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
            flagRecifyArray: [],
            // 历史纠正图片
            historyImageList: [],
            //historyImageRectify: [],
            // 历史纠正文件
            historyFileList: [],
            //historyFileRectifyList: [],
            // 要素名
            checkName: '',
            // 表单要素名
            rectifyFormCheckName: '',
            // 质量监督检查表名称
            qualityCheckList: [],
            // 是否属于这个部分
            isBelongToPart: false
        }
    },
    methods: {
        getAcceptRow: function () {
            this.acceptRow = this.$route.query.queryData
            console.log('问题接收页面传递过来的数据')
            console.log(this.acceptRow)
            this.getProblemRectify(this.acceptRow.qualityCheckID)
        },
        getProblemRectify: function (qualityCheckId) {
            // 获取问题整改表格列表
            getProblemRectifyList(qualityCheckId).then((res) => {
                console.log('查询质量检查id返回的数据')
                console.log(res.data)
                this.problemRectifyList = res.data 
                this.getProgress()
                if(this.acceptRow.isPush === "已推送" && this.acceptRow.issued === "已下达"){
                    this.isBelongToPart = true
                }else{
                    this.isBelongToPart = false
                }
                this.loading = false
            }).catch((err) => {
                this.$message.error(err.message)
            })
        },
        getProblemDetailList: function (qualityCheckId) {
            // 获取问题整改表格列表
            getProblemRectifyList(qualityCheckId).then((res) => {
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
            that.imageList = []
            that.fileProblemList = []
            that.historyImageList = []
            that.historyFileList = []
            that.changeCheckListCodeToName(that.qualityCheckList, row.checkListCode)
            that.rectifyFormCheckName = that.checkName
            const path = 'http://39.98.173.131:7000/resources/QualityCheck/'
            that.rectifyForm = row
            if(that.rectifyForm.problemPic){
                const imgArray = that.rectifyForm.problemPic.split(';')
                console.log(imgArray)
                for(let i in imgArray){
                    that.imageList.push(path+ imgArray[i])
                }
                console.log('对话框打开之前问题图片拼接'+that.imageList)
            }
            if(this.rectifyForm.problemAttach){
                const fileArray = that.rectifyForm.problemAttach.split(';')
                console.log(fileArray)
                for(let j in fileArray){
                    const filePro = {
                        url: '',
                        fileName: ''
                    }
                    filePro.url = path+ fileArray[j]
                    getOriginFileName(fileArray[j]).then((res) => {
                        console.log(res.data)
                        filePro.fileName = res.data
                        that.fileProblemList.push(filePro)
                    })
                    
                }
                console.log('对话框打开之前问题文件拼接'+that.fileProblemList)
            }
            // 历史纠正图片
            if(that.rectifyForm.correctPic){
                var imgHistoryArray = []
                imgHistoryArray = that.rectifyForm.correctPic.split(';');
                console.log('历史纠正图片')
                console.log(imgHistoryArray)
                for(let i in imgHistoryArray){
                    that.historyImageList.push(path+ imgHistoryArray[i])
                }
                console.log('对话框打开之前拼接路径之后的历史纠正图片')
                console.log(that.historyImageList)
            }
            // 历史纠正文件
            if(that.rectifyForm.correctAttach){
                var fileHistoryArray = []
                fileHistoryArray = that.rectifyForm.correctAttach.split(';')
                console.log('历史纠正文件',fileHistoryArray)
                for(let j in fileHistoryArray){
                    const file={
                        url:'',
                        fileName:''
                    }
                    file.url=path+fileHistoryArray[j]
                    getOriginFileName(fileHistoryArray[j]).then((res)=>{
                        console.log('fileNameItem',res.data)
                        file.fileName=res.data
                        that.historyFileList.push(file)
                    })
                }
                console.log('对话框打开之前拼接路径之后的历史纠正文件',that.historyFileList)
            }
            that.problemRectifyDialogVisible = true
        },
        problemLook: function (row) {
            // 问题查看
            let that = this
            that.problemRectify(row)
        },
        problemRectifySubmit: function (qualityRecordId) {
            // 保存修改纠正图片与文件等纠正信息
            let that = this
            console.log('提交更新质量记录id'+qualityRecordId)
            let historyFileRectifyList = []
            that.translateFileStr(that.historyFileList, historyFileRectifyList)
            if(historyFileRectifyList.length !== 0 && that.fileList.length !== 0){
                that.rectifyForm.correctAttach = historyFileRectifyList.join(';') + ';' + that.fileList.join(";")
            }else{
                that.rectifyForm.correctAttach = historyFileRectifyList.join(';') + that.fileList.join(";")
            }
            console.log(that.rectifyForm.correctAttach)
            let historyImageRectify = []
            that.translateStr(that.historyImageList,historyImageRectify)
            if(historyImageRectify.length !== 0 && that.file.length !== 0){
                that.rectifyForm.correctPic = historyImageRectify.join(';') + ';' + that.file.join(';')
            }else{
                that.rectifyForm.correctPic = historyImageRectify.join(';') + that.file.join(';')
            }
            console.log(that.rectifyForm.correctPic)
            console.log('更新整改表单')
            console.log(that.rectifyForm)
            if(that.flagRecifyArray.length !== 0){
                const flag = that.findOnly(that.flagRecifyArray, qualityRecordId)
                if(flag !== 1){
                   that.flagRecifyArray.push(qualityRecordId) 
                }
            }else{
                    that.flagRecifyArray.push(qualityRecordId)
                }
            console.log(that.flagRecifyArray)
            that.rectifyForm.isPush = '问题已整改'
            updateQualityCheckRecord(qualityRecordId,that.rectifyForm).then((res) => {
                console.log(res.data)
                that.getProblemDetailList(that.acceptRow.qualityCheckID)
                that.problemRectifyDialogVisible = false
                return that.$message.success('更新表单成功')
            }).catch((err) => {
                that.$message(err.message)
            })
        },
        // pushRectify: async function () {
        //     // 全部整改完成推送
        //     console.log(this.flagRecifyArray.length)
        //     console.log(this.problemRectifyList.length)
        //     if(this.flagRecifyArray.length === this.problemRectifyList.length){
        //         const confirmResult = await this.$confirm('整改已完成，可以进行推送操作，是否继续?', '提示', {
        //                 confirmButtonText: '确定',
        //                 cancelButtonText: '取消',
        //                 type: 'warning'
        //             }).catch(err => err)
        //             if (confirmResult !== 'confirm') {
        //                 return this.$message.info('已取消')
        //             }
        //         modifyPush(this.acceptRow.qualityCheckID).then((res) => {
        //             console.log(res.data)
        //             return this.$message.success('推送成功')
        //         })
        //     }else {
        //         return this.$message.error('有问题尚未整改完成，请继续整改。')
        //     }
        // },
        problemRectifyDialogClose: function () {
            // 问题整改对话框关闭
            let that = this
            that.activeIndex = '0'
            that.file = []
            that.fileList = []
            that.imageList = []
            that.fileProblemList = []
            that.historyImageList = []
            that.historyFileList = []
            //that.historyImageRectify = []
            //that.historyFileRectifyList = []
            that.$refs['uploadPic'].clearFiles()
            that.$refs['uploadFile'].clearFiles()
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
        deleteImage: async function (path) {
            // 删除纠正图片
            let that = this
            const confirmResult = await that.$confirm('此操作将永久删除该图片,是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return that.$message.info('已取消')
            }
            const i = that.historyImageList.findIndex(x => x === path)
            that.historyImageList.splice(i,1)
            console.log('图片删除之后的数组')
            console.log(that.historyImageList)
        },
        deleteFile: async function (path) {
            // 删除历史纠正文件
            let that = this
            const confirmResult = await that.$confirm('此操作将永久删除该文件,是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return that.$message.info('已取消')
            }
            const i = that.historyFileList.findIndex(x => x.url === path)
            that.historyFileList.splice(i,1)
            console.log('历史纠正文件删除之后的数组')
            console.log(that.historyFileList)
        },
        translateStr: function(imagelist,imagelistRectify) {
            // 转换历史纠正图片
            for(let j in imagelist){
                let k = imagelist[j].lastIndexOf('/')
                imagelistRectify.push(imagelist[j].substr(k+1))
            }
            console.log('拼接新的纠正图片数组')
            console.log(imagelistRectify.join(';'))
        },
        translateFileStr: function (filelist,filelistRectify) {
            // 转换历史纠正文件
            for(let j in filelist){
                let k = filelist[j].url.lastIndexOf('/')
                filelistRectify.push(filelist[j].url.substr(k+1))
            }
            console.log('拼接新的纠正文件数组')
            console.log(filelistRectify.join(';'))
        },
        getProgress: function () {
            // 获取进度
            for(let i in this.problemRectifyList){
                if(this.problemRectifyList[i].isPush === '问题已整改' || this.problemRectifyList[i].isPush === '审核已通过' || this.problemRectifyList[i].isPush === '验证已通过'){
                    this.flagRecifyArray.push(this.problemRectifyList[i].qulity_CheckRecordID)
                }
            }
            const length1 = this.problemRectifyList.length
            const length2 = this.flagRecifyArray.length
            this.progress = length2 + '/' + length1
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
        },
        getQualityCheck: function () {
            // 获取质量监督检查表
            let that = this
            getQualityCheckList().then((res) => {
                console.log('质量监督检查表')
                console.log(res.data)
                that.qualityCheckList = res.data
            })
        },
        getVerifyDate: function () {
				// 获取整改完成时间
				let date = new Date()
				console.log(date)
				let y = date.getFullYear()
				console.log(y)
				let m = date.getMonth() + 1
				console.log(m)
				m = m < 10 ? '0' + m : m
				let d = date.getDate()
				console.log(d)
				d = d < 10 ? '0' + d : d
				let str = y + '-' + m + '-' + d
				console.log(str)
				return str
			},
        // 将检查表要素Code转化为名称
        changeCheckListCodeToName: function (val,checkCode) {
            let that = this
            for (var j = 0; j < val.length; j++) {
                if (val[j]) {
                    if (val[j].checkListCode == checkCode) {
                       
                        that.checkName = val[j].checkListName
                        console.log('检查表要素名称:' + val[j].checkListName)
                        break
                    } else if (val[j].children) {
                        that.changeCheckListCodeToName(val[j].children, checkCode)
                    }
                }
            }
        },
        // 将表格检查表要素Code转化为名称
        changeTabelCheckListCodeToName: function (val,checkCode) {
            let that = this
            for (var j = 0; j < val.length; j++) {
                if (val[j]) {
                    if (val[j].checkListCode == checkCode) {
                       
                        that.checkName = val[j].checkListName
                        console.log('检查表要素名称:' + val[j].checkListName)
                        break
                    } else if (val[j].children) {
                        that.changeCheckListCodeToName(val[j].children, checkCode)
                    }
                }
            }
        },
    },
    watch: {

    },
    computed: {
        progress: {
            get: function () {
                const length1 = this.problemRectifyList.length
                const length2 = this.flagRecifyArray.length
                return length2 + '/' + length1
            },
            set: function () {

            }
        }
    },
    created: function () {
        this.loading = true
        this.getAcceptRow()
        this.getQualityCheck()
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
.boxNew {
    display: inline-block;
    float: left;
    /* margin-right: 40px; */
}
.progressData {
    color: #67C23A;
    font-size: 22px;
    margin-right: 20px;
}
.historyPic {
    position: relative;
    float: left;
    width: 100px;
    height: 100px;
    margin: 0 5px;
}
.historyfile {
    margin-top: 40px;
}
.historyFile {
    float: left;
    height: 40px;
}
.iconBtns {
    position: absolute;
    top: 4px;
    right: 5px;
}
</style>
