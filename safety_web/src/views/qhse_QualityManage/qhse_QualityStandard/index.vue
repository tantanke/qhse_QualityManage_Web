<template>
  <div  class="outDiv">
    <link media="screen and (max-device-width:1280px)">
    <link media="screen and (min-device-width:1280px)">
    <div class="page-title" style="width:100%">量化标准</div>
    <div class="page-content">
    &nbsp;&nbsp;
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
    <el-col :span="8">
         <el-button type="primary" size="mini" @click="() => append({code:''})">增加一级节点</el-button>
    </el-col>
    <el-col>
    <el-checkbox label="仅显示启用项" v-model="queryStatus" @change="changeStatus" checked></el-checkbox>
    </el-col>
    </el-row>
    &nbsp;&nbsp;
    &nbsp;&nbsp; 
    &nbsp;&nbsp;
    &nbsp;&nbsp; 
    <el-tree
    :data="treedata"
    node-key="id"
    :props="defaultProps"    
    accordion
    :filter-node-method="filterNode"
    @node-click="handleNodeClick"
    :show-overflow-tooltip=true
    ref="tree2">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span v-if="data.name.length > 60">{{ data.name.slice(0,60)+'...' }}</span>
        <span v-if="data.name.length <= 60">{{ data.name}}</span>
        <span>                
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)"
            v-if="data.code.length!=10">
            <i class="el-icon-circle-plus"></i>
          </el-button>
           &nbsp;&nbsp;
          <el-button
            type="text"
            size="mini"
            @click="() => update(data)">
            编辑
          </el-button>
         &nbsp;&nbsp;
          <el-button
            type="text"
            size="mini"
            v-if="data.status=='启用'"
            @click="() => updateStatus(data,'停用')">
            停用
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="data.status=='停用'"
            @click="() => updateStatus(data,'启用')">
            启用
          </el-button>
        </span>
      </span>
    </el-tree>

      <!--查看内容-->
      <el-dialog
      title="标准项详情"
      :visible.sync="detailContentdialogVisible">
      <el-form :model="detailText">
      <el-form-item label="标准项名称：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="内容：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.content" autocomplete="off"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >      
        <el-button @click="dealDialogButton">确 定</el-button>
        <el-button type="danger" @click="detailContentdialogVisible=false">返 回</el-button>
      </span>
    </el-dialog>

     <!--查看依据-->
      <el-dialog
      title="标准项详情"
      :visible.sync="detailBasisdialogVisible">
      <el-form :model="detailText">
      <el-form-item label="标准项名称：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="依据：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.basis" autocomplete="off"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >      
        <el-button @click="dealDialogButton">确 定</el-button>
        <el-button type="danger" @click="detailBasisdialogVisible=false">返 回</el-button>
      </span>
    </el-dialog>

      <!--查看最底层详情-->
    <el-dialog
      title="标准项详情"
      :visible.sync="detailLastdialogVisible">
      <el-form :model="detailText">
      <el-form-item label="标准项名称：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="审核方式：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.auditMode" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="公式：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.formula" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="可能存在的问题描述：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.problemDescription" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="分数：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.initialScore" autocomplete="off"></el-input>
      </el-form-item>
      </el-form>     
      <span slot="footer" class="dialog-footer" >      
        <el-button @click="dealDialogButton">确 定</el-button>
        <el-button type="danger" @click="detailLastdialogVisible=false">返 回</el-button>
      </span>
    </el-dialog>

    <!--查看内容-->
      <el-dialog
      title="标准项详情"
      :visible.sync="detailNamedialogVisible">
      <el-form :model="detailText">
      <el-form-item label="标准项名称：" :label-width="formLabelWidth">
      <el-input type="textarea" autosize v-model="detailText.name" autocomplete="off"></el-input>
      </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer" >      
        <el-button @click="dealDialogButton">确 定</el-button>
        <el-button type="danger" @click="detailNamedialogVisible=false">返 回</el-button>
      </span>
    </el-dialog>

    <!--新增事件节点分类弹窗-->
      <el-dialog
      title="新增量化标准"
      :visible.sync="addEventdialogVisible">
      <el-form ref="detailText" :model="detailText">
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
import {QuerryQHSEChildRules,addQHSERule,updateQHSERule,updateQHSERuleStatus} from '../../../services/qhse_QualityStandard'
import {CreateCompany_tree,delete_tree} from '../../../services/organization'
export default {
    watch: {
    filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    mounted(){
        this.changeStatus()
        },
    methods: {
      handleNodeClick(data){
        console.log(JSON.stringify(data))
      },
      getData(status){
        QuerryQHSEChildRules(status).then((res) => {
          this.treedata = res.data
          console.log(JSON.stringify(this.treedata))
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },
      changeStatus(){
        if (this.queryStatus){
          this.getData(1)
        }
        else{
          this.getData(0)
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;        
      },
      dealDialogButton(){
        if (this.isAdd){
        addQHSERule(this.detailText).then(() => {
          this.$message.success('创建成功')
        },(err) => {
          this.$message.error(err.message)
        })
        this.isAdd = false;
        this.detailContentdialogVisible=false;
        this.detailBasisdialogVisible=false;
        this.detailLastdialogVisible=false;
        this.detailNamedialogVisible=false;
        this.changeStatus()
        this.router.go(0)
        }
        if (this.isEdit){
        this.$confirm('此操作将修改该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
        updateQHSERule(this.detailText).then(() => {
          this.$message.success('修改成功')
          this.changeStatus() 
          this.router.go(0)
        },(err) => {
          this.$message.error(err.message)
        })
        }).catch(() => {
        }) 
        this.isEdit = false;
        this.detailContentdialogVisible=false;
        this.detailBasisdialogVisible=false;
        this.detailLastdialogVisible=false;
        this.detailNamedialogVisible=false;
        }
        
        
        
      },
    append(data) {
      this.isAdd = true;
      if (data.code.length == 2){
          this.detailText = {}
          this.detailContentdialogVisible = true;
          this.detailText.code=data.code;
          this.detailText.status='启用';
          this.detailText.initialScore=0;
          this.router.go(0) 
          // this.detailText.content = "";
          // this.detailText.name = "";
      }          
      else if (data.code.length == 4){
          this.detailText = {}
          this.detailBasisdialogVisible = true;
          this.detailText.code=data.code;
          this.detailText.status='启用';
          this.detailText.initialScore=0;
          this.router.go(0) 
          // this.detailText.basis = "";
          // this.detailText.name = "";
        }          
      else  if (data.code.length == 8){
          this.detailText = {}
          this.detailLastdialogVisible = true;
          this.detailText.code=data.code;
          this.detailText.status='启用';
          this.router.go(0) 
          // this.detailText.problemDescription = "";
          // this.detailText.initialScore = "";
          // this.detailText.formula = "";
          // this.detailText.name = "";
          // this.detailText.auditMode = "";
        }
      else{
          this.detailNamedialogVisible = true;
          this.detailText = {};
          this.detailText.status='启用';
          this.detailText.initialScore=0;
          this.detailText.code=data.code;
          this.router.go(0) 
        }
         
      },
    remove(nodeCode) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delete_tree(nodeCode).then( () => {
          this.$message.success('删除成功')
          this.changeStatus()
        },(err) => {
          this.$message.error(err.message)
        })
        this.changeStatus()
      }).catch(() => {
      })
    },
      detail(data){
        if (data.code.length == 4)
          this.detailContentdialogVisible = true;
          this.detailText = data;
        if (data.code.length == 6)
          this.detailBasisdialogVisible = true;
          this.detailText = data;
        if (data.code.length == 10)
          this.detailLastdialogVisible = true;
          this.detailText = data;
      },
      updateStatus(data,status){
        this.detailText = {}
        this.detailText.status = status;
        this.detailText.code = data.code;
        this.detailText.initialScore = data.initialScore;
        updateQHSERuleStatus(this.detailText).then(() => {
          this.$message.success('操作成功')
          this.changeStatus() 
          this.router.go(0)
        },(err) => {
          this.$message.error(err.message)
        })

      },
     update(data){
        this.isEdit = true;
        if (data.code.length == 4){
          this.detailContentdialogVisible = true;
          this.detailText = data;
          delete this.detailText.childNode
        }
        else if (data.code.length == 6){
          this.detailBasisdialogVisible = true;
          this.detailText = data;
          delete this.detailText.childNode
        }          
        else if (data.code.length == 10){
          this.detailLastdialogVisible = true;
          this.detailText = data;
          delete this.detailText.childNode
        }
        else {
          this.detailNamedialogVisible = true;
          this.detailText = data;
          delete this.detailText.childNode
        }        
        
      },
      addEventFormSubmitBtn(formData){
        let newChild = { "name": formData.categoryName,"companyCode": this.addNodeCode};
        CreateCompany_tree(newChild).then( () => {
          this.$message.success('创建成功')
          this.addEventdialogVisible = false;
          this.changeStatus()
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
        detailContentdialogVisible: false,
        detailBasisdialogVisible:false,
        detailLastdialogVisible:false,
        detailNamedialogVisible:false,
        formLabelWidth:"120",
        queryStatus:0,
        isEdit:false,
        isAdd:false,
        filterWord:'',
        detailText:{},
        getFilter:{status:'启用'},
        // formData:{
        //   content:[]
        // },
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

    
