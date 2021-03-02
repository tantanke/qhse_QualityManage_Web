<template>
    <div>
        <div class="page-title">问题清单</div>
        <div class="page-content">
            <el-table :data="reportUnitPriceList" border v-loading="loading" max-height="560">
                <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column label="年份（年）" prop="costYear" width="150" align="center"></el-table-column>
                <el-table-column label="报告类别" prop="reportType" align="center"></el-table-column>
                <el-table-column label="单价（元）" prop="unitPrice" width="150" align="center"></el-table-column>
                <el-table-column label="审核人比例" prop="auditorProportion" width="150" align="center"></el-table-column>
                <el-table-column label="批准人比例" prop="approverProportion" width="150" align="center"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" @click="modifyUnitPrice(scope.row)" size="mini">修改
                        </el-button>
                        <el-button icon="el-icon-delete" type="danger" size="mini"
                                   @click="deleteUnitPrice(scope.row.unitPriceID)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>

</style>
