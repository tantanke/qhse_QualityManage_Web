<template>
    <div>
        <!-- 此页面暂时未被使用 -->
        <div class="page-title" style="width:100%">远程计划监控数据细节</div>
        <div class="page-content">
            <el-row>
                <el-form label-width="130px" :inline="true">
                    <el-form-item style="float:right">
                        <el-button  @click="handleCancel" icon="el-icon-refresh-left">返回</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <!-- 计划列表 -->
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                <el-table :data="listData" style="width: 100%;text-align:center" ref="treeTable" :indent="30"
                          max-height="560"
                          highlight-current-row border>
                    <el-table-column type="index" label="序号" width="50" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deviceNo" label="设备编号" width="120" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="myNo" label="自编号" width="120" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="companyName" label="基层单位" width="120" align="center" show-overflow-tooltip
                                     :filters="filterCompanyNameList"
                                     :filter-method="filterCompanyName"
                    ></el-table-column>
                    <!--项目类别，暂时还没确定名字-->
                    <el-table-column prop="itemCategory" label="项目类别" width="120" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip
                                     :filters="filterProjectNameList"
                                     :filter-method="filterProjectName"
                    ></el-table-column>
                    <el-table-column prop="charger" label="负责人" width="120" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="tel" label="电话" width="120" align="center" show-overflow-tooltip></el-table-column>
                    <!--项目进度，暂时还没确定名字-->
                    <el-table-column prop="projectProgress" label="项目进度" width="120" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="200" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handelcelChange(scope.row)" icon="el-icon-edit">编辑</el-button>
                            <el-button type="danger" size="mini" @click="handelcelDelete(scope.row)" icon="el-icon-delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        methods: {
            handleCancel(){
                this.$router.go(-1)
            }
        }
    }
</script>

<style>

</style>