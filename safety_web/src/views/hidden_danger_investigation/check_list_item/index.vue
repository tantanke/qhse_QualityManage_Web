
<template>
  <div>
    <div class="page-title" style="width:100%">检查表配置</div>
    <div class="page-content">
    &nbsp;&nbsp;
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
        :action="`/api/check_list_excel_upload`"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :file-list="fileList"
        :headers="{Authorization:currentUser.token}"
        :auto-upload="false"
        accept=".excel,.xls,.xlsx"
          >
        <el-button slot="trigger" size="mini" type="primary"  round>导入检查表</el-button>
        <el-button icon='el-icon-upload' round size="mini" style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>
    </el-upload>
</el-col>
</el-row>
<el-row style="margin-top:15px">
<el-col :span="3">
<el-button  type="primary" round size="mini"  @click="addFirst()" icon='el-icon-circle-plus'>新增一级节点</el-button>
</el-col>
<el-col :span="3">
<el-button type="warning" round size="mini" icon='el-icon-download' @click="download()">下载检查表模板</el-button>
</el-col>
</el-row>
  
    &nbsp;&nbsp;
    <el-tree
    :data="treedata"
    node-key="checkListID"
    :props="defaultProps"

    :filter-node-method="filterNode"
    ref="tree2">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => adddetail(data.checkListCode)">
            <i class="el-icon-plus"></i>
          </el-button>
          &nbsp;&nbsp;
           <el-button
            type="text"
            size="mini"
            @click="() => detail(data.checkListCode)">
            <i class="el-icon-more-outline"></i>
          </el-button>
          &nbsp;&nbsp;
          <el-button
            type="text"
            size="mini"
            @click="() => append(data.checkListCode)">
            <i class="el-icon-circle-plus"></i>    
          </el-button>
           &nbsp;&nbsp;
          <el-button
            type="text"
            size="mini"
            @click="() => remove(data.checkListCode)">
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
import {GetCheckListTree} from '../../../services/hidden_danger_investigation/checkListTree'
import {/* Createcheck_item, */delete_tree,getcontent,Createcontent} from '../../../services/hidden_danger_investigation/checkListItem'
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
        var url='http://39.98.173.131:7000/CheckItemExcel/检查项模板 .xlsx'
        var iframe =document.createElement("iframe")
        iframe.style.display ="none";
        iframe.src = url;
        document.body.appendChild(iframe);
      },
       //获取单位树
      getDate(){
        GetCheckListTree().then((res) => {
          this.treedata = res.data
          console.log(this.treedata)
          console.log(JSON.stringify(res.data))
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
        return data.checkListName.indexOf(value) !== -1;
      },
      detail(checkListCode){
        this.checkListPojo.checkListCode = checkListCode
        getcontent(this.checkListPojo).then((res) => {
          this.$alert(res.data.list, '检查项详情', {
          confirmButtonText: '确定',
        });
          console.log(res.data);
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      adddetail(checkListCode) {
        this.addNodeCode = checkListCode
        this.addEventdialogVisible2 = true;
      },
      append(checkListCode) {
        this.addNodeCode = checkListCode
        this.addEventdialogVisible1 = true;
      },
      remove(checkListCode) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkListPojo.checkListCode = checkListCode
        delete_tree(this.checkListPojo).then( () => {
          this.$message.success('删除成功')
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        })
        this.getDate()
      }).catch(() => {
      })
    },
      addEventFormSubmitBtn1(/* formData */){
        /* let newChild = { "checkListName": formData.categoryName,"checkListCode": this.addNodeCode};
        Createcheck_item(newChild).then( () => {
          this.$message.success('创建成功')
          this.addEventdialogVisible1 = false;
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        }) */
      },
      addEventFormSubmitBtn2(formData){
        let newContent = { "content": formData.categoryName,"checkListCode": this.addNodeCode};
        Createcontent(newContent).then( () => {
          this.$message.success('创建成功')
          this.addEventdialogVisible2 = false;
          this.getDate()
        },(err) => {
          this.$message.error(err.message)
        })
      }
    },
    data() {
      return {
        addEventForm1:{
          categoryName: ''
        },
        addEventForm2:{
          categoryName: ''
        },
        addEventdialogVisible1: false,
        addEventdialogVisible2: false,
        addNodeCode: '',
        filterText: '',
        fileList:[],
        treedata: [],
        defaultProps: {
        children: 'children',
        label: 'checkListName'
        },
        checkListPojo:{
          checkListCode:''
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
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
</style>

    
