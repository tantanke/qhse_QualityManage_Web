<template>
  <div>
    <div class="page-title" style="width:100%">安全管理-安技项目管理</div>
    <div
      class="page-content"
      v-loading="screenLoading"
      element-loading-text="文件上传中，请稍候"
      element-loading-spinner="el-icon-loading"
    >
      <el-row style="margin-top:1%">
        <el-form :inline="true">
          <el-form-item>
            <el-form-item label="选择公司：" labelWidth="120px">
              <el-cascader
                v-model="chooseItem"
                :options="companyList"
                placeholder="请选择(空则查询年度记录)"
                :props="{ expandTrigger: 'hover', value: 'nodeCode' }"
                :show-all-levels="false"
                @change="handleChange"
                ref="cascaderAddr"
                :clearable="true"
              >
              </el-cascader>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchData"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-upload
              ref="upload"
              action="/api/uploadDashboardSecurityProject"
              :headers="headers"
              :show-file-list="false"
              accept=".xls,.xlsx"
              :on-progress="handleProgress"
              :on-success="successHand"
            >
              <el-button
                icon="el-icon-upload"
                type="success"
                @click="importFile"
                >数据导入</el-button
              >
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-download" @click="downLoadFile"
              >模板下载</el-button
            >
          </el-form-item>
          <el-form-item style="margin-left:5%" v-for="(value,index) in info" :key="index">
            <span >{{value.name}}项目数：</span><el-button type='warning' plain>{{value.value}}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row
        style="padding:10px; border-top: 2px dashed #dddddd;text-align:center"
      >
        <el-table
          :data="listData"
          v-loading="loading"
          element-loading-text="查询中"
          style="width: 100%;text-align:center"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
        >
          <el-table-column label="单位名称" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.companyName ? scope.row.companyName : "全部单位"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="projectLevel"
            label="项目级别"
            :filters="[
              { text: '公司', value: '公司' },
              { text: '科特', value: '科特' },
              { text: '安检院', value: '安检院' },
            ]"
            :filter-method="filterHandler"
            column-key="projectLevel"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="projectName"
            label="项目名称"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="projectFunds"
            label="项目经费"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="recordedFunds"
            label="已入账经费（万元）"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="recordedFundsRate"
            label="入账率"
          ></el-table-column>
          <el-table-column label="填报时间" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.updateTime ? scope.row.updateTime : year
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
import CurrentUser from "@/store/CurrentUser";
import {
  queryDashboardSecurityProjectByLevel,
  GetqhseCompanytree,
 queryDashboardSecurityProjectCount,
  downloadDashboardSecurityProjectTemplate,
  downloadfile,
} from "@/services/qhseDashboard/index";
export default {
  data() {
    return {
      info:[],
      year: "",
      selectdate: "",
      chooseItem: "",
      companyId: "",
      searchForm: { companyCode: "" },
      companyList: [],
      listData: [],
      loading: false,
      screenLoading: false,
      headers: { Authorization: CurrentUser.get().token },
    };
  },
  methods: {
    filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
    searchData() {
      let date = new Date();
      let _this = this
      _this.year = `${date.getFullYear()}年度`;
      _this.listData = [];
      _this.info = [];
      _this.loading = true;
      queryDashboardSecurityProjectCount(_this.searchForm).then(res => {
          res.data.forEach(v =>{
            console.log(v)
            let item = {}
            item.name = v.projectLevel
            item.value = v.projectLevelCount
            _this.info.push(item)
          })
          console.log(_this.info)
      }).catch(() => {
          this.loading = false;
          this.$message.error("查询失败，请稍后再试！");
        });
      queryDashboardSecurityProjectByLevel(this.searchForm)
        .then((res) => {
          this.listData = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("查询失败，请稍后再试！");
        });
    },
    successHand(res) {
      if (res.code === 1000) {
        this.$message.success("上传成功");
        this.screenLoading = false;
        this.searchData()
      } else {
        this.$message.error("上传失败，请重试");
        this.screenLoading = false;
      }
    },
    getUrl(baseurl, data) {
      let url = baseurl + "?";
      Object.keys(data).forEach((key) => {
        url = `${url}${key}=${data[key]}&`;
      });
      url = url.substring(0, url.length - 1);
      return url;
    },
    importFile() {},
    downLoadFile() {
      downloadDashboardSecurityProjectTemplate().then((res) => {
        downloadfile("安全管理-安技项目管理模板", res.file.data, "xlsx");
      });
    },
    getCompany() {
      GetqhseCompanytree()
        .then((res) => {
          this.companyList = res.data;
        })
        .catch(() => {
          this.$message.error("查询失败，请稍后再试！");
        });
    },
    handleChange() {
      this.searchForm.companyCode = this.chooseItem[this.chooseItem.length - 1];
    },
    handleProgress() {
      this.screenLoading = true;
    },
  },
  mounted() {
    this.getCompany();
  },
};
</script>

<style></style>
