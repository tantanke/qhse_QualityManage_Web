<template>
  <div  class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title" style="width:100%">量化标准</div>
    <div class="page-content">
    &nbsp;&nbsp;
    &nbsp;&nbsp; 
    <el-tree
    :data="treedata"
    node-key="id"
    :props="defaultProps"    
    :filter-node-method="filterNode"
    @node-click="handleNodeClick"
    ref="tree2">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>                 
          <el-button
            type="text"
            size="mini"
            @click="() => detail(data)">
            <i class="el-icon-more-outline"></i>
          </el-button>
           &nbsp;&nbsp;
          <el-button
            type="text"
            size="mini"
            @click="() => append(data.code)">
            <i class="el-icon-circle-plus"></i>
          </el-button>
           &nbsp;&nbsp;
          <el-button
            type="text"
            size="mini"
            @click="() => remove(data.code)">
            停用
          </el-button>
           &nbsp;&nbsp;
          <el-button
            type="text"
            size="mini"
            @click="() => remove(data.code)">
            启用
          </el-button>
        </span>
      </span>
    </el-tree>

    <!--新增事件节点分类弹窗-->
      <el-dialog
      title="新增量化标准"
      :visible.sync="addEventdialogVisible">
      <el-form ref="addEventForm" :model="addEventForm">
        <el-form-item label="组织机构名称" prop="categoryName" >
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
import {QuerryQHSEChildRules} from '../../../services/qhse_QualityStandard'
import {CreateCompany_tree,delete_tree} from '../../../services/organization'
export default {
    watch: {
    filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    mounted(){
        this.getData()
        },
    methods: {
      handleNodeClick(data){
        console.log(JSON.stringify(data))
      },
      
      // load(node ,resolve){
      //       this.node = node
      //       this.resolve = resolve
      //       if(node.level === 0){
      //           return resolve(this.treeData)
      //       }else if(node.level>4){
      //           return resolve([])
      //       }else{
      //           this.handleGetChildrenData(node,resolve)
      //       }
      //   },
       //获取单位树
      getData(){
        QuerryQHSEChildRules().then((res) => {
          this.treedata = res.data
          console.log(JSON.stringify(this.treedata))
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
          this.getData()
        },(err) => {
          this.$message.error(err.message)
        })
        this.getData()
      }).catch(() => {
      })
    },
      detail(nodeCode){
        this.checkItemPojo.checkItemCode = nodeCode
        // getcontent(this.checkItemPojo).then((res) => {
        //   this.$alert(res.data.list, '检查项详情', {
        //   confirmButtonText: '确定',
        // });
        //   console.log(res.data);
        // }).catch((err) => {
        //   this.$message.error(err.message)
        // })
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
          this.getData()
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
        treedata:[],
        curnode:"",
        defaultProps: {
        children: 'childNode',
        label: 'name'
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

    
