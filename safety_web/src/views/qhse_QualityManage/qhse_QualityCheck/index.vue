<template>
  <div>
    <div class="page-title" style="width:100%">QHSE量化审核</div>
    <div class="page-content">
      <el-row>
        <el-form label-width="130px" :inline="true" :model="filterQuery">
          <el-form-item label="选择公司：">
            <treeselect
              :multiple="false"
              :options="companyList"
              placeholder="请选择公司单位"
              v-model="filterQuery.companyCode"
              style="width:200px"
            />
          </el-form-item>
          <el-form-item label="选择年份：">
            <el-date-picker
              v-model="filterQuery.year"
              type="year"
              placeholder="选择年份"
              style="width:200px">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态："  prop="category">
            <el-select v-model="filterQuery.status" placeholder="请选择员工类别" style="width:200px">
              <el-option
                v-for="item in statuss"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="560"
          highlight-current-row
          border
          v-loading="loading">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="year" label="年份" width="120" align="center"></el-table-column>
          <el-table-column prop="companyName" label="公司名称"></el-table-column>
          <el-table-column prop="status" label="审核状态" width="150" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <router-link :to='{name: "QHSEQualityCheck", params: {data:scope.row}}'>
                <el-button type="primary" size="mini" v-if="scope.row.status === '通过'">内容详情</el-button>
                <el-button type="primary" size="mini" v-else>审核通过</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getCompanyStatus } from "../../../services/qhse_QualityCheck";
import { GetCompany } from "../../../services/gettreedata";
const DefaultQuery = {
  year: "",
  companyCode: null,
  status:""
};
export default {
  data() {
    return {
      filterQuery: {},
      companyList: [],
      loading: true,
      tableData: [],
      statuss: [
        { value: "", label: "所有" },
        { value: "通过", label: "通过" },
        { value: "未通过", label: "未通过" }
      ]
    };
  },
  methods: {
    handleGetCompany() {
      GetCompany().then(res => {
          this.companyList = JSON.parse(JSON.stringify(res.data))
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    loadFilterParams() {
      this.filterQuery = { ...DefaultQuery, ...this.$route.query };
      this.filterQuery = {
        ...this.filterQuery
      };
      this.filterQuery.status = ''
      let year = new Date();
      this.filterQuery.year = String(year.getFullYear())
    },
    handleClick() {
      if(!this.filterQuery.year){
        this.filterQuery.year = new Date()
      }
      let nowdata = new Date(this.filterQuery.year);
      this.filterQuery.year = String(nowdata.getFullYear())
      this.handleGetInitialData();
    },
    handleGetDate(date) {
      let nowdata = new Date(date);
      return String(nowdata.getFullYear());
    },
    handleGetInitialData() {
      this.loading = true;
      getCompanyStatus(this.filterQuery).then(res => {
        this.tableData = res.data;
      }).catch(err => {
          this.message.error(err.message);
        });
      this.loading = false;
    }
  },
  mounted() {
    this.handleGetCompany();
    this.loadFilterParams();
    this.handleGetInitialData();
  }
};
</script>

<style lang="scss">

</style>