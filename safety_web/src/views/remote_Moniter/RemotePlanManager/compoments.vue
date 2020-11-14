<template>
	<div>
		<el-breadcrumb separator="/" class="bread">
			<el-breadcrumb-item :to="{ path: '/remote_Moniter/RemotePlanManager/index' }">远程计划管理</el-breadcrumb-item>
			<el-breadcrumb-item>远程计划管理细节</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="page-content">
			<el-form :inline="true">
				<el-form-item>
					<a ref="download"></a>
					<el-button type="warning" icon="el-icon-download" @click="clickFile()">Excel模板下载</el-button>
				</el-form-item>
				<el-form-item>
					<!-- 除了提交文件外还需要提交id，所以没用默认的提交方式，而是在submit之前通过接口去提交 -->
					<el-upload action="/" :before-upload="handleClick" :data="this.id" ref="upload" :auto-upload="false">
						<el-button type="success" icon="el-icon-upload ">excel导入
						</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-check " @click="newSubmitForm()">确认</el-button>
				</el-form-item>
				<!--手动录入待完善-->
				<el-form-item>
					<!-- 显示出录入窗口，并且将数据清空，让用户重新录入 -->
					<el-button type="primary" icon="el-icon-upload " @click="isCheckIn=true;resData={}">手动录入
					</el-button>
				</el-form-item>
				<!-- <el-form-item style="float:right">
                        <el-button @click="handleCancel" icon="el-icon-refresh-left">返回</el-button>
                    </el-form-item> -->
				<!-- <el-form-item style="float:right">
                      <el-button  type="primary" @click="handlePost">保存</el-button>
                    </el-form-item> -->
			</el-form>
			<!-- 计划列表 -->
			<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
				<el-table :data="listData" style="width: 100%;text-align:center" ref="treeTable" :indent="30" max-height="560"
				 highlight-current-row border>
					<el-table-column type="index" label="序号" width="50" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="deviceNo" label="设备编号" width="120" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="myNo" label="自编号" width="120" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="companyName" label="基层单位" width="120" align="center" show-overflow-tooltip :filters="filterCompanyNameList"
					 :filter-method="filterCompanyName"></el-table-column>
					<!--项目类别，暂时还没确定名字-->
					<el-table-column prop="itemCategory" label="项目类别" width="120" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip :filters="filterProjectNameList"
					 :filter-method="filterProjectName"></el-table-column>
					<el-table-column prop="charger" label="负责人" width="120" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="tel" label="电话" width="120" align="center" show-overflow-tooltip></el-table-column>
					<!--项目进度，暂时还没确定名字-->
					<el-table-column prop="projectProgress" label="项目进度" width="120" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" width="300" align="center">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" @click="handelcelChange(scope.row)" icon="el-icon-edit">编辑</el-button>
							<el-button type="info" size="mini" icon="el-icon-video-pause" @click="endPlanDetails(scope.row)">结束</el-button>
							<el-button type="danger" size="mini" @click="handelcelDelete(scope.row)" icon="el-icon-delete">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<!-- 编辑细节项目  -->
			<el-dialog title="新增计划" :visible.sync="ifchange" width="700px">
				<el-form label-width="120px" style="width:100%;">
					<el-row>
						<el-col :span="24">
							<el-form-item label="设备编号:" prop="deviceNo" style="margin-bottom:1px">
								<el-input type="text" label="设备编号:" class="resizeNone" v-model="resData.deviceNo" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="自编号:" prop="myNo" style="margin-bottom:1px">
								<el-input type="text" label="自编号:" class="resizeNone" v-model="resData.myNo" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="项目名称:" prop="projectName" style="margin-bottom:1px">
								<el-input type="text" label="项目名称: " class="resizeNone" v-model="resData.projectName" placeholder="请输入内容"></el-input>
							</el-form-item>
							<el-form-item label="负责人:" prop="charger" style="margin-bottom:1px">
								<el-input type="text" label="负责人:" class="resizeNone" v-model="resData.charger" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="电话:" prop="tel" style="margin-bottom:1px">
								<el-input type="text" label="电话:" class="resizeNone" v-model="resData.tel" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="基层单位:" prop="companyName" style="margin-bottom:1px">
								<el-input type="text" label="基层单位:" class="resizeNone" v-model="resData.companyName" placeholder="请输入内容">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="ifchange=false" icon="el-icon-refresh-left">
						取 消
					</el-button>
					<el-button type="primary" @click="changeres" icon="el-icon-check">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 手动录入 -->
			<el-dialog title="手动录入" :visible.sync="isCheckIn" width="700px" :close-on-click-modal="false">
				<el-form label-width="120px" style="width:100%;">
					<el-row>
						<el-col :span="24">
							<el-form-item label="设备编号:" prop="deviceNo" style="margin-bottom:10px">
								<el-input type="text" label="设备编号:" class="resizeNone" v-model="resData.deviceNo" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="自编号:" prop="myNo" style="margin-bottom:10px">
								<el-input type="text" label="自编号:" class="resizeNone" v-model="resData.myNo" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="基层单位:" prop="companyName" style="margin-bottom:10px">
								<el-input type="text" label="基层单位:" class="resizeNone" v-model="resData.companyName" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="项目类别:" prop="itemCategory" style="margin-bottom:10px">
								<el-input type="text" label="项目类别:" class="resizeNone" v-model="resData.itemCategory" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="项目名称:" prop="projectName" style="margin-bottom:10px">
								<el-input type="text" label="项目名称: " class="resizeNone" v-model="resData.projectName" placeholder="请输入内容"></el-input>
							</el-form-item>
							<el-form-item label="负责人:" prop="charger" style="margin-bottom:10px">
								<el-input type="text" label="负责人:" class="resizeNone" v-model="resData.charger" placeholder="请输入内容">
								</el-input>
							</el-form-item>
							<el-form-item label="电话:" prop="tel" style="margin-bottom:10px">
								<el-input type="text" label="电话:" class="resizeNone" v-model="resData.tel" placeholder="请输入内容">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button type="" @click="isCheckIn=false" icon="el-icon-refresh-left">取 消
					</el-button>
					<el-button type="primary" @click="confirmCheckIn" icon="el-icon-check">确 定
					</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
    import ExportJsonExcel from "js-export-excel";
    import {getDetails} from "../../../services/remote";//查询细节
    import {uploadMonitorPlanExcel} from "../../../services/remote";//上传excel
    import {updateMonitorPlanDetail} from "../../../services/remote";//修改细节
    import {deletePlanDetail} from "../../../services/remote";//删除细节
    import {createNewDetail} from "../../../services/remote"
    import {endPlanDetail} from "../../../services/remote"
    // import { downloadMonitorDetailExcelTemplate}from "../../../services/remotenew";

    export default {
        name: '',
        data() {
            return {
                listData: [],
                resData: {},
                ifchange: false,
                isCheckIn: false, // 用于判断手动录入窗口是否应该显示
                filterProjectNameList: [],  // 用于对项目名称进行筛选的结构
                filterCompanyNameList: [],  // 用于对基层单位进行筛选的结构
            }
        },
        methods: {
            endPlanDetails(row){

				endPlanDetail(row.monitorPlanDetailID).then(res=>{
                    getDetails(this.$route.params).then(res => {
                        this.listData = res.data;
                        this.filterMethods(this.listData)
                    })
				})
			},

            confirmCheckIn() {
                // 确认录入

                this.resData.monitorPlanID = this.$route.params.monitorPlanID
                console.log(this.resData, '确认录入的表单数据')
                createNewDetail(this.resData).then(res=>{
                    this.$message.success("手动录入成功")
                    getDetails(this.$route.params).then(res => {
                        this.listData = res.data;
                        this.filterMethods(this.listData)
                    })

                }).catch(err=>{
                    this.$message.error("手动录入失败")
                })
                this.isCheckIn = false;
            }
            ,
            clickFile() {
                this.downloadData = [];
                var option = {};
                option.fileName = '远程计划模板';
                //设置数据来源和数据格式
                option.datas = [{
                    sheetData: this.downloadData,
//                    sheetHeader: ["设备编号", "自编号", "项目名称", "负责人", "电话", "基层单位"]
                    sheetHeader: ["设备编号", "自编号", "基层单位", "项目类别", "项目名称", "负责人", "电话"]
                }];
                //导出
                var toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();
            },
            handleClick(file) {//导入
                let fd = new FormData();
                fd.append('file', file);//传文件
                fd.append('planId', this.$route.params.monitorPlanID);//传文件
                uploadMonitorPlanExcel(fd).then(res => {
                    getDetails(this.$route.params).then(res => {
                        this.listData = res.data;
                        this.$message.success('导入成功', res)

                        this.filterMethods(this.listData)
                    })
                }).catch(err => {
                    this.$message.error('批量导入失败', err)
                })
            },
            newSubmitForm() {
                this.$refs.upload.submit()
            },
            handlePost() {//确定
            },
            handleCancel() {//返回
                this.$router.go(-1)
            },
            handelcelDelete(data) {//删除
                this.resData = data;
                deletePlanDetail(this.resData).then(res => {
                    this.$message.success('删除成功', res)
                    getDetails(this.$route.params).then(res => {
                        this.listData = res.data;
                        this.filterMethods(this.listData)
                    })
                }).catch(err => {
                    this.$message.error('删除失败', err)
                })
            },
            handelcelChange(data) {//修改
                this.resData = data
                this.ifchange = true
            },
            changeres() {//确认修改
                updateMonitorPlanDetail(this.resData).then(res => {
                    console.log('修改成功', res)
                    this.$message.success("修改成功")
                    this.ifchange = false
                    getDetails(this.$route.params).then(res => {
                        this.listData = res.data;
                        this.filterMethods(this.listData)
                    })
                }).catch(err => {
                    console.log('修改失败', err)
                    this.$message.error("修改失败")
                })
            },
            // 用于筛选项目名称列的方法
            filterProjectName(value, row, column) {
                // property 是列名，比如此处就为projectName
                const property = column['property'];
                // value 是选中的值，可能会有多个，依次比较，当前行列的值是否与选中的值相等，相等则保留
                return row[property] === value;

            },
            // 用于筛选基层单位列的方法
            filterCompanyName(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            filterMethods(listData) {
                // 两个辅助结构，为了得到不重复的filterList
                let distinctProjectName = new Set()
                let distinctCompanyName = new Set()
                // 添加之前先将原来的清空，防止出现重复数据
                this.filterProjectNameList = []
                this.filterCompanyNameList = []
                listData.forEach(e=>{
                    if (!distinctProjectName.has(e.projectName)) {
                        distinctProjectName.add(e.projectName)
                        this.filterProjectNameList.push({value: e.projectName, text: e.projectName})
                    }
                    if (!distinctCompanyName.has(e.companyName)) {
                        distinctCompanyName.add(e.companyName)
                        this.filterCompanyNameList.push({value:e.companyName, text:e.companyName})
                    }
                })
                console.log(this.filterProjectNameList, this.filterCompanyNameList)
            }
        },
        mounted() {
            console.log('细节页面报错')
            this.id = {"planId": this.$route.params.monitorPlanID}
            getDetails(this.$route.params).then(res => {
                this.listData = res.data;
                this.filterMethods(this.listData)
            })
        }
    }
</script>
<style lang='scss' scope>
.bread {
    margin-bottom: 20px;
}
</style>
