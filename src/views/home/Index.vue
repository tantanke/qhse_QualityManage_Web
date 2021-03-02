<template>
  <div>
    <h1>Home UI examples</h1>
    <h4>树状下拉选择</h4>
    <treeselect v-model="value" :multiple="false" :options="options" />
    <h4>表格合并行</h4>
    <el-table
      :data="tableDataMergeRow"
      :span-method="objectSpanMethod"
      border>
      <!-- <el-table-column label="序号">
        <template slot-scope="scope">
          <font>{{scope.$index + 1}}</font>
        </template>
      </el-table-column> -->
      <el-table-column prop="checkItem1" label="检查项1">
        <template slot-scope="scope">
          <font>{{scope.row.checkItem1Label}}</font>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem2" label="检查项2">
        <template slot-scope="scope">
          <font>{{scope.row.checkItem2Label}}</font>
        </template>
      </el-table-column>
      <el-table-column prop="checkItem3" label="检查项3">
        <template slot-scope="scope">
          <font>{{scope.row.checkItem3Label}}</font>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="检查标准"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import mergeRowData from './mergeRowData'
export default {
  data () {
    return {
      value: null,
      options: [ {
        id: 'a',
        label: 'a',
        children: [ {
          id: 'aa',
          label: 'aa',
        }, {
          id: 'ab',
          label: 'ab',
        } ],
      }, {
        id: 'b',
        label: 'b',
      }, {
        id: 'c',
        label: 'c',
      }],
      tableDataMergeRow: mergeRowData
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex }) {
      let lastRow = null
      if (rowIndex > 0) {
        lastRow = this.tableDataMergeRow[rowIndex - 1]
      }
      let currentKey = column.property
      if (['checkItem1', 'checkItem2', 'checkItem3'].includes(currentKey)) {
        let currentId = row[currentKey]
        if (!lastRow || lastRow[currentKey] !== currentId) {
          let count = this.tableDataMergeRow.filter((item) => item[currentKey] === currentId).length
          return {
            rowspan: count,
            colspan: 1
          }
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      return {
        rowspan: 1,
        colspan: 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-title {
  font-size: 20px;
}
</style>
