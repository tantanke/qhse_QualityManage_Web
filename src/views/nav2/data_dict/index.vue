
<template>
  <div>
    <div class="page-title">数据字典</div>
    <div class="page-content">
    &nbsp;&nbsp;
    <el-row>

      <el-col :span="12">
         查询:
         <el-input
         placeholder="输入关键字查询"
         v-model="filterText"
         style="width:60%"
         >
    </el-input>
      </el-col>
    </el-row>
    &nbsp;&nbsp;
    
   
    <el-tree
    :data="treedata"
    node-key="id"
    :props="defaultProps"
    :filter-node-method="filterNode"
    ref="tree2">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data.nodeCode)">
            <i class="el-icon-circle-plus"></i>
            
          </el-button>
           &nbsp;&nbsp;
          <el-button
            type="text"
            size="mini"
            @click="() => remove(data.nodeCode)">
            <i class="el-icon-remove"></i>
          </el-button>
        </span>
      </span>
    </el-tree>
    <!--新增事件节点分类弹窗-->
        <el-dialog
      title="新增数据项"
      :visible.sync="addEventdialogVisible">
      <el-form ref="addEventForm" :model="addEventForm">
        <el-form-item label="数据项名称" prop="categoryName" >
          <el-input v-model="addEventForm.categoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addEventdialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addEventFormSubmitBtn(addEventForm)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  </div>
</template>
<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {Getdata_dict} from '../../../services/gettreedata'
import {Createdata_dict,delete_tree} from '../../../services/data_dict'
export default {
    watch: {
    filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    mounted(){
        this.getDate()
        },
    methods: {
       //获取单位树
      getDate(){
        Getdata_dict().then((res) => {
          this.treedata = res.data
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      append(nodeCode) {
        this.addNodeCode = nodeCode
        this.addEventdialogVisible = true;
      },
      remove(nodeCode) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dataDictPojo.dictCode = nodeCode
        delete_tree(this.dataDictPojo).then( () => {
          this.$message.success('删除成功')
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        })
        this.getDate()
      }).catch(() => {
      })
    },
      addEventFormSubmitBtn(formData){
        let newChild = { "name": formData.categoryName,"dictCode": this.addNodeCode};
        Createdata_dict(newChild).then( () => {
          this.$message.success('创建成功')
          this.addEventdialogVisible = false;
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        })
      }
    },
    data() {
      return {
        addEventForm:{
          categoryName: ''
        },
        addEventdialogVisible: false,
        addNodeCode: '',
        filterText: '',
        treedata: [],
        defaultProps: {
        children: 'children',
        label: 'label',
        },
        dataDictPojo:{
          dictCode:''
        }
      };
    }
  };
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

    
