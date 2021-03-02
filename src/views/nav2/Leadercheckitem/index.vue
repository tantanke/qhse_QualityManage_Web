
<template>
  <div class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title" style="width:100%">领导检查项配置</div>
    <div class="page-content">
    &nbsp;&nbsp;
    <el-row>
      <el-col :span="8">
         查询：
         <el-input
         placeholder="输入关键字查询"
         v-model="filterText"
         style="width:80%"
         >
      </el-input>
      </el-col>
      <el-col :span="6">
      <el-button  round type="primary" size="mini" @click="addFirst()" icon='el-icon-circle-plus'>新增一级节点</el-button>
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
      title="新增领导检查项"
      :visible.sync="addEventdialogVisible">
      <el-form ref="addEventForm" :model="addEventForm">
        <el-form-item label="领导检查项名称" prop="categoryName" >
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
import {GetTaskProcedure} from '../../../services/leadercheckitem'
import {Createtaskprocedure,delete_tree} from '../../../services/leadercheckitem'
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
        GetTaskProcedure().then((res) => {
          this.treedata = res.data
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      addFirst(){
        this.addNodeCode = '';
        this.addEventdialogVisible = true;
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
        this.taskAndProcessPojo.checkItemCode = nodeCode
        delete_tree(this.taskAndProcessPojo).then( () => {
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
        let newChild = { "checkItemName": formData.categoryName,"checkItemCode ": this.addNodeCode};
        Createtaskprocedure(newChild).then( () => {
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
        label: 'label'
        },
        taskAndProcessPojo:{
         checkItemCode:''
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

    
