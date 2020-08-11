
<template>
  <div>
    <div class="page-title" style="width:100%">量化标准</div>
    <div class="page-content">
      &nbsp;&nbsp;
      <el-row>
        <el-col :span="8">
          查询:
          <el-input placeholder="输入关键字查询" v-model="filterText" style="width:80%;margin-left:5px"></el-input>
        </el-col>
        <el-col :span="8" style="display:flex;">
          <el-button type="primary" size="mini" @click="() => append({code:''})">增加一级节点</el-button>
          <!--
            <el-button slot="trigger" size="mini" type="primary"  round>增加一级节点</el-button>
          -->
          <el-button
            icon="el-icon-download"
            size="mini"
            style="margin-left: 10px;margin-right:10px;background-color: #FF5151"
            @click="download"
          >下载模板</el-button>
          <el-upload
            ref="upload"
            :action="'/api/managesyselements_excel_upload'"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            :headers="{Authorization:currentUser.token}"
            :show-file-list="false"
            accept=".excel, .xls, .xlsx"
          >
            <el-button
              icon="el-icon-upload"
              type="primary"
              size="mini"
              style="background-color: #FF5151"
              @click="submitUpload"
            >导入文件</el-button>
          </el-upload>
        </el-col>
        <el-col>
          <el-checkbox label="仅显示启用项" :true-label="0" :false-label="1" v-model="queryStatus" @change="getDate"></el-checkbox>
        </el-col>
      </el-row>&nbsp;&nbsp;
      <el-tree
        :data="treedata"
        node-key="checkListID"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="tree2"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data,node)">
              <i class="el-icon-circle-plus"></i>
            </el-button>&nbsp;&nbsp;
            <el-button type="text" size="mini" @click="() => onEdit(data,node)">
              <i>编辑</i>
            </el-button>&nbsp;&nbsp;
            <el-button  type="text" size="mini" v-if="data.childNode.length === 0 && node.level !== 1" @click="addQuestion(data)">
              <i>问题</i>
            </el-button>&nbsp;&nbsp;
            <el-button type="text" size="mini" @click="() => onStopUse(data)">
              <i>{{data.status=='启用'?'停用':'启用'}}</i>
            </el-button>
          </span>
        </span>
      </el-tree>
      <!--新增事件节点分类弹窗-->
      <el-dialog title="新增检查项" :visible.sync="addEventdialogVisible1">
        <el-form ref="addEventForm1" :model="addEventForm1">
          <el-form-item label="检查项" prop="categoryName">
            <el-input v-model="addEventForm1.categoryName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addEventdialogVisible1=false">取 消</el-button>
          <el-button type="primary" @click="addEventFormSubmitBtn1()">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="新增检查项详情" :visible.sync="addEventdialogVisible2">
        <el-form ref="addEventForm2" :model="addEventForm2">
          <el-form-item label="检查项描述" prop="content">
            <el-input v-model="addEventForm2.categoryName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addEventdialogVisible2=false">取 消</el-button>
          <el-button type="primary" @click="addEventFormSubmitBtn2(addEventForm2)">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="问题详情" :visible.sync="addQuestiondialogVisible" 
      :close-on-click-modal='false'>
      <!--编辑问题数据 --> 
        <el-dialog
          width="30%"
          title="编辑问题"
          :visible.sync="innerVisible"
          :close-on-click-modal='false'
          append-to-body>
          <el-input v-model="editValue" style='margin-bottom:20px' placeholder="请输入新的的问题描述"></el-input>
          <el-button type="primary" @click="submitedit">确定</el-button>
            <el-button type="danger" @click="innerVisible = false">取消</el-button>
        </el-dialog>
        <el-form :inline='true' :model="addquestionDiscription">
          <el-form-item>
            <el-button type="primary" @click="buttoncontrol = true" :disabled='buttoncontrol' plain>新增问题描述</el-button>
          </el-form-item>
          <el-form-item v-show="buttoncontrol">
            <el-input v-model="addquestionDiscription.description" placeholder="请输入问题"></el-input>
          </el-form-item>
          <el-form-item v-show="buttoncontrol">
            <el-button type="primary" @click="submitQuestion">确定</el-button>
            <el-button type="danger" @click="buttoncontrol = false">取消</el-button>
          </el-form-item>
        </el-form>      
        <!--记录问题数据 -->  
        <el-table
        v-loading="loading"
          :data="problemList"
          border
          style="width: 100%">
          <el-table-column
            prop="description"
            label="已有问题描述">
          </el-table-column>
          <el-table-column
          label="操作"
             align="center">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteProblem(scope.row)"
              >删除</el-button>
              <el-button
              icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="editProblem(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addQuestiondialogVisible=false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { GetCurrentUser } from '../../../store/CurrentUser';
import { querryQHSEproblemDiscription,
         addQHSEproblemDiscription,
         deleteQHSEproblemDiscription,
         updateQHSEproblemDiscription
} from '../../../services/qhse_QualityStandard'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { GetCheckListTree } from '../../../services/hidden_danger_investigation/checkListTree'
import { Createcheck_item, delete_tree, getcontent, Createcontent } from '../../../services/hidden_danger_investigation/checkListItem'
import { querryQhseElement } from '../../../services/querryQhseElement'

import ExportJsonExcel from "js-export-excel";
import Level1dialog from './dialog/Level1Dialog';
import Level2dialog from './dialog/Level2Dialog';
import Level3dialog from './dialog/Level3Dialog';
import Level4dialog from './dialog/Level4Dialog';
import Level5dialog from './dialog/Level5Dialog';

export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted() {
    this.getDate()
  },
  computed: {
    currentUser() {
      return GetCurrentUser()
    }
  },
  methods: {
    download() {
      // window.open('http://39.98.173.131:7000/CheckItemExcel/检查项模板.xlsx', '_blank')
      //   var url = 'http://39.98.173.131:7000/CheckItemExcel/检查项模板.xlsx'
      //   var iframe = document.createElement("iframe")
      //   iframe.style.display = "none";
      //   iframe.src = url;
      //   document.body.appendChild(iframe);
      // 直接导出文件

      this.$http.get('http://39.98.173.131:7000/wlhse/api/v3/querryQhseElements/1').then((response) => {
        let tempArr = response.data.data;

        for (const temp of tempArr) {
          delete temp.childNode;
        }

        var option = {};

        option.fileName = "excel";

        option.datas = [
          {
            sheetData: tempArr,
            sheetHeader: ["ID","编码", "要素名称", "内容", "依据", "审核方式", "分数", "计算公式", "可能存在的问题", "总数", "状态"]
          }
        ];

        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
      });

    },
    //获取单位树
    getDate() {
      querryQhseElement({queryStatus: this.queryStatus}).then((res) => {
        this.treedata = res.data
        console.log('审核要素管理1',this.treedata)
        console.log('审核要素管理2',JSON.stringify(res.data))
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
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(response) {
      console.log('隐患排查',response)
      this.$message.warning(response);
      this.getDate();
    },
    addFirst() {
      this.addNodeCode = '';
      this.addEventdialogVisible1 = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      console.log('隐患排查','hha')
      console.log('隐患排查',value);
      console.log('隐患排查',data);
      return data.name.indexOf(value) !== -1;
    },
    detail(checkListCode) {
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
    append(val, val1) {
      console.log('隐患排查',val1);
      // this.addNodeCode = checkListCode
      this.currentNodeData = val;
      this.addEventdialogVisible1 = true;
    },
    onEdit(data, node) {
      console.log('隐患排查',node.level);
      let level = node.level;
      let component = null;
      if (level == 1) component = Level1dialog;
      else if (level == 2) component = Level2dialog;
      else if (level == 3) component = Level3dialog;
      else if (level == 4) component = Level4dialog;
      else if (level == 5) component = Level5dialog;

      this.$dialog(component, {data: data}).then(r => {
         this.$message.success('编辑成功');
         this.getDate();
      });
    },
    remove(checkListCode) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkListPojo.checkListCode = checkListCode
        delete_tree(this.checkListPojo).then(() => {
          this.$message.success('删除成功')
          this.getDate()
        }, (err) => {
          this.$message.error(err.message)
        })
        this.getDate()
      }).catch(() => {
      })
    },
    onStopUse(val) {
      val.status = val.status == '停用' ? '启用' : '停用';
      this.$http.put(`http://39.98.173.131:7000/wlhse/api/v3/updateQHSEElementStatus/${val.id}`).then((response) => {
        this.getDate();
        this.$message.success(val.status+'成功');
      })
    },
    addEventFormSubmitBtn1() {
      // let newChild = { "checkListName": formData.categoryName, "checkListCode": this.addNodeCode };
      // Createcheck_item(newChild).then(() => {
      //   this.$message.success('创建成功')
      //   this.addEventdialogVisible1 = false;
      //   this.getDate()
      // }, (err) => {
      //   this.$message.error(err.message)
      // // })
      //  console.log(this.currentNodeData);
      //  return;
      let temp = {
        id: this.currentNodeData.id,
        code: null,
        name: this.addEventForm1.categoryName,
        content: null,
        basis: null,
        auditMode: null,
        initialScore: 0,
        formula: null,
        problemDescription: null,
        totalCount: null,
        status: '启用'
      };
      this.$http.post('http://39.98.173.131:7000/wlhse/api/v3/addQHSEElement', temp).then((response) => {
        this.getDate();
        this.$message.success('创建成功');
        this.addEventdialogVisible1 = false;
      })
    },
    addEventFormSubmitBtn2(formData) {
      let newContent = { "content": formData.categoryName, "checkListCode": this.addNodeCode };
      Createcontent(newContent).then(() => {
        this.$message.success('创建成功')
        this.addEventdialogVisible2 = false;
        this.getDate()
      }, (err) => {
        this.$message.error(err.message)
      })
    },
    // 数据获取
    getProblems (data) {
      let _this = this
      _this.loading = true
      _this.problemList = []
      querryQHSEproblemDiscription({code:data}).then(res => {
        console.log(res.data)
        res.data.forEach((item) => {
          let obj = {}
          obj.code = item.code
          obj.description = item.description
          obj.qHSE_ManagerSysElementProblemDescription_ID = item.qHSE_ManagerSysElementProblemDescription_ID
          _this.problemList.push(obj)
        })       
        _this.loading = false
      }).catch(err => {
         this.$message.error(err)
         _this.loading = false
         _this.addQuestiondialogVisible = false
       })
    },
    // 弹出对话框
    addQuestion(data) {
      let _this = this    
      _this.problemCode = data.code
      _this.getProblems(data.code)
      _this.addQuestiondialogVisible = true
    },
    // 添加问题描述
    submitQuestion() {
      let _this = this
      _this.addquestionDiscription.code = _this.problemCode
       if(_this.addquestionDiscription.description === '') {
         this.$message.warning('请输入具体问题！')
         return
       }
       addQHSEproblemDiscription(this.addquestionDiscription).then(() => {
         _this.$message.success('添加成功')
         _this.addquestionDiscription.description = ''
         _this.getProblems(_this.problemCode)
       }).catch(err => {
         _this.$message.error(err)
       })
    },
    // 删除问题描述
    deleteProblem(data) {
        let form = {}
        let _this = this
        form.id = data.qHSE_ManagerSysElementProblemDescription_ID
        deleteQHSEproblemDiscription(form).then(() => {
           _this.$message.success('删除成功')
           _this.getProblems(_this.problemCode)
        }).catch(err => {
          _this.$message.error(err)
       })
    },
    editProblem(data) {      
        this.editForm = {...data}
        this.innerVisible = true
        this.editValue = data.description
    },
    // 提交编辑问题
    submitedit() {
      let _this = this
      if(_this.editValue === ''){
         _this.$message.warning('请输入具体问题！')
         return
      }
      if(_this.editValue === _this.editForm.description) {
        _this.$message.warning('请不要与原问题一致！')
         return
      }
        _this.editForm.description = _this.editValue
        updateQHSEproblemDiscription(_this.editForm).then(() => {
          _this.$message.success('编辑成功')
           _this.getProblems(_this.problemCode)
           _this.innerVisible = false
        }).catch(err => {
          _this.$message.error(err)
          _this.innerVisible = false
       })
       
    }
  },
  data() {
    return {
      buttoncontrol: false,
      innerVisible: false,
      loading:false,
      addEventForm1: {
        categoryName: ''
      },
      addEventForm2: {
        categoryName: ''
      },
      addquestionDiscription: {
        qHSE_ManagerSysElementProblemDescription_ID: null,
        code: '',
        description: ''
      },
      editquestionDiscription: {
        qHSE_ManagerSysElementProblemDescription_ID: null,
        code: '',
        description: ''
      },
      editValue: '',
      editForm: {},
      problemCode: '',
      addEventdialogVisible1: false,
      addEventdialogVisible2: false,
      addQuestiondialogVisible:false,
      addNodeCode: '',
      filterText: '',
      fileList: [],
      treedata: [],
      defaultProps: {
        children: 'childNode',
        label: 'name'
      },
      checkListPojo: {
        checkListCode: ''
      },
      problemList: [],
      currentNodeData: null,
      queryStatus: 0
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


    

    
