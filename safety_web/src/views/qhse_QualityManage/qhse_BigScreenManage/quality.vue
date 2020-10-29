<template>
  <div>
      <div class="page-title" style="width:100%">质量进度管理</div>
      <div class="page-content">
          <el-row style="margin-top:1%">
              <el-form :inline="true" >
                <el-form-item>
                    <el-form-item label='填报日期：' labelWidth='120px'>
                        <el-date-picker
                                v-model="selectdate"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' icon="el-icon-search" @click="searchData">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type='success' icon="el-icon-upload2" @click="importFile">数据导入</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type='info' icon="el-icon-download" @click="downLoadFile">模板下载</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
                 <el-table
                        :data="listData"
                        style="width: 100%;text-align:center"
                        ref="treeTable"
                        row-key="code"
                        :indent="30"
                        max-height="560"
                        highlight-current-row
                        border>
                      </el-table>
            </el-row>
      </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        selectdate: '',
        listData:[]
      }
    },
    methods: {
      searchData(){

      },
      importFile(){

      },
      downLoadFile(){
        
      }
    },
}
</script>

<style>

</style>