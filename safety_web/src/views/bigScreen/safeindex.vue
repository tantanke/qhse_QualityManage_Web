<template>
  <div class="detail" :style="bg">
    <div class="title">QHSE 看板</div>
    <div class="tableTitle">安技项目详细情况表</div>
    <el-table
      :row-class-name="tableRowClassName"
      :data="tableData"
      max-height="530"
      style="width: 95%"
    >
      <el-table-column prop="companyName" label="单位名称" min-width="70">
      </el-table-column>
      <el-table-column prop="projectLevel" label="项目级别" min-width="40" :filters="[ {text: '公司', value: '公司'}, {text: '科特', value: '科特'}, {text: '安检院', value: '安检院'}]"
      :filter-method="filterHandler"
      column-key="projectLevel"
      >
      </el-table-column>
      <el-table-column prop="projectName" min-width="150" label="项目名称">
      </el-table-column>
      <el-table-column prop="projectFunds" min-width="60" label="项目经费">
      </el-table-column>
      <el-table-column prop="recordedFunds" min-width="60" label="已入账经费">
      </el-table-column>
      <el-table-column prop="recordedFundsRate" min-width="30" label="入账率">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import {
  queryDashboardSecurityProjectByLevel
} from "@/services/qhseDashboard/index";
export default {
  props:{
    level: String
  },
  data() {
    return {
      serForm: {
        companyCode: "",
      },
      bg: {
        backgroundImage: "url(" + require("./img/bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      tableData: [  
      ],
    };
  },
  mounted() {
    this.serForm.companyCode = this.$route.query.companyCode;
    console.log(this.level)
     queryDashboardSecurityProjectByLevel(this.serForm).then(res => {
    this.tableData = res.data
    }).catch((err) => {
          this.$message.error(err.message);
        });
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      }
  },
};
</script>

<style lang="scss">
.detail {
  height: 600%;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0%;
  .title {
    color: #6dd5ed;
    font-size: 2vw;
    position: absolute;
    left: 42%;
  }
  .tableTitle {
    color: #00fe0f;
    position: absolute;
    top: 12%;
    left: 38%;
    width: 25%;
    text-align: center;
    font-size: 1.3vw;
  }
  .el-table {
    position: absolute;
    top: 20%;
    left: 2.5%;
    border: 0;
    color: whitesmoke;
    font-weight: 400;
    font-size: 0.8vw;
    .warning-row {
      background: linear-gradient(#021151, #162a68);
    }
    .success-row {
      background: linear-gradient(#262f66, #273067);
    }
    th {
      border: 0;
      background: linear-gradient(#6d2c54, #692853);
      color: whitesmoke;
    }
    td:hover {
      background: blue;
    }
  }
  .el-table::before {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
  }
  .el-table tbody tr:hover > td {
    background-color: #2c436e !important;
  }
}
</style>
