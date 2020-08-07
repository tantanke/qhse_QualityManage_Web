
<template>
  <div>
    <div class="page-title" style="width:100%">检查项配置</div>
    <div class="page-content">
    &nbsp;&nbsp;
    <!-- <el-row>
      <div class="grid-content bg-purple-light">
      <el-col :span="14">
      <el-input  v-model="filterText"  placeholder="输入关键字查询" style="width:50%" prefix-icon="el-icon-search"> </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" plain @click="download()"><i class="el-icon-download"></i>&nbsp;下载Excel模板</el-button>
      </el-col>
      <el-col :span="3">
      <el-upload
        ref="upload"
        :action="`/api/check_item_excel_upload`"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :file-list="fileList"
        :headers="{Authorization:currentUser.token}"
        accept=".excel,.xls,.xlsx"
      >
      <el-button type="primary" plain><i class="el-icon-document"></i>&nbsp;上传文件</el-button>
      </el-upload>
      </el-col>
      <el-col :span="3">
      <el-button type="primary" plain @click="addFirst()"><i class="el-icon-circle-plus"></i> &nbsp;新增一级节点</el-button>
      </el-col>
      </div>
    </el-row>
    &nbsp;&nbsp;&nbsp;&nbsp; -->
    <el-row>
      <el-col :span="8">
         查询:
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
        :action="`/api/check_item_excel_upload`"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :file-list="fileList"
        :headers="{Authorization:currentUser.token}"
        :auto-upload="false"
        accept=".excel,.xls,.xlsx"
          >
        <el-button slot="trigger" size="mini" type="primary"  round>导入Excel文件</el-button>
        <el-button icon='el-icon-upload' round size="mini" style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>
    </el-upload>
</el-col>
</el-row>
<el-row style="margin-top:15px">
<el-col :span="3">
<el-button  type="primary" round size="mini"  @click="addFirst()" icon='el-icon-circle-plus'>新增一级节点</el-button>
</el-col>
<el-col :span="3">
<el-button type="warning" round size="mini" icon='el-icon-download' @click="download()">下载Excel模板</el-button>
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
            @click="() => adddetail(data.nodeCode)">
            <i class="el-icon-plus"></i>
          </el-button>
          &nbsp;&nbsp;
           <el-button
            type="text"
            size="mini"
            @click="() => detail(data.nodeCode)">
            <i class="el-icon-more-outline"></i>
          </el-button>
          &nbsp;&nbsp;
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
      title="新增检查项"
      :visible.sync="addEventdialogVisible1">
      <el-form ref="addEventForm1" :model="addEventForm">
        <el-form-item label="检查项" prop="categoryName" >
          <el-input v-model="addEventForm1.categoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addEventdialogVisible1=false">取 消</el-button>
        <el-button type="primary" @click="addEventFormSubmitBtn1(addEventForm1)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增检查项详情"
      :visible.sync="addEventdialogVisible2">
      <el-form ref="addEventForm2" :model="addEventForm">
        <el-form-item label="检查项描述" prop="content" >
          <el-input v-model="addEventForm2.categoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addEventdialogVisible2=false">取 消</el-button>
        <el-button type="primary" @click="addEventFormSubmitBtn2(addEventForm2)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  </div>
</template>
<script>
import {GetCurrentUser } from '../../../store/CurrentUser';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {GetCheckItem} from '../../../services/gettreedata'
import {Createcheck_item,delete_tree,getcontent,Createcontent} from '../../../services/checkitem'
export default {
  data() {
      return {
        addEventForm1:{
          categoryName: ''
        },
        addEventForm2:{
          categoryName: ''
        },
        problemList:[],
        addEventdialogVisible1: false,
        addEventdialogVisible2: false,
        addNodeCode: '',
        filterText: '',
        fileList:[],
        treedata: [],
        defaultProps: {
        children: 'children',
        label: 'label'
        },
        checkItemPojo:{
          checkItemCode:''
        }
      };
    },
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
        var url='http://39.98.173.131:7000/CheckItemExcel/检查项模板 .xlsx'
        var iframe =document.createElement("iframe")
        iframe.style.display ="none";
        iframe.src = url;
        document.body.appendChild(iframe);
      },
       //获取单位树
      getDate(){
        GetCheckItem().then((res) => {
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
       beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleSuccess(response){
       console.log(response)
       this.$message.warning(response);
       this.getDate();
      },
      addFirst(){
        this.addNodeCode = '';
        this.addEventdialogVisible1 = true;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      detail(nodeCode){
        this.checkItemPojo.checkItemCode = nodeCode
        getcontent(this.checkItemPojo).then((res) => {
          this.$alert(res.data.list, '检查项详情', {
          confirmButtonText: '确定',
        });
          console.log(res.data);
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      adddetail(nodeCode) {
        this.addNodeCode = nodeCode
        this.addEventdialogVisible2 = true;
      },
      append(nodeCode) {
        this.addNodeCode = nodeCode
        this.addEventdialogVisible1 = true;
      },
      remove(nodeCode) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkItemPojo.checkItemCode = nodeCode
        delete_tree(this.checkItemPojo).then( () => {
          this.$message.success('删除成功')
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        })
        this.getDate()
      }).catch(() => {
      })
    },
      addEventFormSubmitBtn1(formData){
        let newChild = { "checkItemName": formData.categoryName,"checkItemCode": this.addNodeCode};
        Createcheck_item(newChild).then( () => {
          this.$message.success('创建成功')
          this.addEventdialogVisible1 = false;
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        })
      },
      addEventFormSubmitBtn2(formData){
        let newContent = { "content": formData.categoryName,"checkItemCode": this.addNodeCode};
        Createcontent(newContent).then( () => {
          this.$message.success('创建成功')
          this.addEventdialogVisible2 = false;
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        })
      }
    },
    
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
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
</style>

    
