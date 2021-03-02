
<template>
  <div  class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title" style="width:100%">组织机构</div>
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
      title="新增组织机构"
      :visible.sync="addEventdialogVisible" :close-on-click-modal="false">
      <el-form ref="addEventForm" :model="addEventForm">
        <el-form-item label="组织机构名称" prop="categoryName" >
          <el-input v-model="addEventForm.categoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addEventdialogVisible=false" icon="el-icon-refresh-left">取 消</el-button>
        <el-button type="primary" @click="addEventFormSubmitBtn(addEventForm)" icon="el-icon-check">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  </div>
</template>
<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCompany} from '../../../services/gettreedata'
import {CreateCompany_tree,delete_tree} from '../../../services/organization'
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
        GetCompany().then((res) => {
          this.treedata = res.data
          // console.log(JSON.stringify(this.treedata))
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
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delete_tree(nodeCode).then( () => {
          this.$message.success('删除成功')
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        })
        this.getDate()
      }).catch(() => {
      })
    },
      // remove(nodeCode) {
      //   delete_tree(nodeCode).then( () => {
      //     this.$message.success('删除成功')
      //     this.getDate()
      //   },(err) => {
      //     this.$message.error(err.message)
      //   })
      //   this.getDate()
      // },
      addEventFormSubmitBtn(formData){
        let newChild = { "name": formData.categoryName,"companyCode": this.addNodeCode};
        CreateCompany_tree(newChild).then( () => {
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
        }
      };
    }
  };
</script>
<style media="screen">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  /*分辨率低于1280，采用下面的样式*/
    @media screen and (max-device-width:1280px){
        .outDiv{
          width: 1060px;
        }
    }
    /*分辨率高于1280，采用下面的样式*/
    @media screen and (min-device-width: 1280px){
        .outDiv{
          width: 100%;
        }
    }
</style>

    
