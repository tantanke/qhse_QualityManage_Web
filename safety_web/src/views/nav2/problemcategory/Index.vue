
<template>
  <div>
    <div class="page-title" style="width:100%">问题类别配置</div>
    <div class="page-content">
    &nbsp;&nbsp;
    <el-row>
      <el-col :span="8">
         查询：
         <el-input
         placeholder="输入关键字查询"
         v-model="filterText"
         style="width:80%;margin-left:5px"
         >
      </el-input>
      </el-col>
      <el-col :span="6">
<el-upload
  ref="upload"
  :action="`/api/problem_excel_upload`"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  :file-list="fileList"
  :headers="{Authorization:currentUser.token}"
  :auto-upload="false"
  accept=".excel,.xls,.xlsx">
  <el-button slot="trigger" round  size="mini" type="primary">导入Excel文件</el-button>
  <el-button icon='el-icon-upload' round size="mini" style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>
</el-upload>
</el-col>
    </el-row>
    <el-row style="margin-top:15px">
    <el-col :span="3">
      <el-button type="primary"  round  size="mini"  @click="addFirst()" icon='el-icon-circle-plus'>新增一级节点</el-button>
      </el-col>
      <el-col :span="3">
      <el-button  round type="warning"   size="mini"  icon='el-icon-download' @click="download()">下载Excel模板</el-button>
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
      title="新增问题类别"
      :visible.sync="addEventdialogVisible">
      <el-form ref="addEventForm" :model="addEventForm">
        <el-form-item label="问题类别名称" prop="categoryName" >
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
import {GetCurrentUser } from '../../../store/CurrentUser';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetProblemCategory} from '../../../services/gettreedata'
import {Createproblem_factor,delete_tree} from '../../../services/problemcategory'
export default {
    watch: {
    filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    mounted(){
        this.getDate()
        },
    computed:{
    currentUser(){
      return GetCurrentUser()
    }
  },
    methods: {
      download(){
        var url='http://39.98.173.131:7000/ProblemExcel/问题类别模板.xlsx'
        var iframe =document.createElement("iframe")
        iframe.style.display ="none";
        iframe.src = url;
        document.body.appendChild(iframe);

      },
       //获取单位树
      getDate(){
        GetProblemCategory().then((res) => {
          this.treedata = res.data
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleSuccess(response){
       console.log(response)
      //  this.$message.warning(`上传成功`);
       this.$message.warning(response);
       this.getDate();

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
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.problemFactorPojo.problemFactorCode = nodeCode
        delete_tree(this.problemFactorPojo).then( () => {
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
        let newChild = { "problemFactorName": formData.categoryName,"problemFactorCode": this.addNodeCode};
        Createproblem_factor(newChild).then( () => {
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
        fileList:[],
        treedata: [],
        defaultProps: {
        children: 'children',
        label: 'label'
        },
        problemFactorPojo:{
          problemFactorCode:''
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

    
