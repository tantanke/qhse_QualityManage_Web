<template>
  <div>
    <div class="page-title" style="width:100%">要素证据录入</div>
    <div class="page-content">
      <el-row>
        <el-form label-width="130px" :inline="true" :model="filterQuery">
          <el-form-item label="选择公司：" prop="companyCode">
            <treeselect
              :multiple="false"
              :options="companyList"
              placeholder="请选择公司单位"
              @select="selectDepart"
              style="width:200px"
            />
          </el-form-item>
          <el-form-item label="选择年份：">
            <el-date-picker
              v-model="filterQuery.year"
              type="year"
              placeholder="选择年份"
              style="width:200px">
              </el-date-picker>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

<el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        <el-table
          :data="treeData"
          style="width: 100%"
          ref="treeTable"
          row-key="code"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button 
              type="primary"
              size="mini"
              @click="updateScore(scope.row)"
              v-if="scope.row.childNode.length === 0"
              >录入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

       <el-dialog title="详细内容" :visible.sync="dialogVisible" center width="600px">
        <el-form label-width="120px" :model="detailData" style="width:100%;" >
          <el-row>
            <el-col >
              <el-form-item label="量化名称：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>
              <el-form-item label="证据描述："  prop="desc" style="margin-bottom:1px">
                <el-input type="textarea"  v-if="textuse" label="证据描述  ："  class="resizeNone" v-model="text.evidenceDescription" placeholder="请输入内容"></el-input>
                <el-input type="textarea"  v-if="!textuse" readonly="true" label="证据描述  ："  class="resizeNone" v-model="text.evidenceDescription" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item 
              label="证据审核人：" 
              v-if="people1use"
               prop="employeeID">
                <el-select  
                v-model="text.checkStaffID"
                placeholder="输入姓名搜索员工"
                clearable
                filterable
                style="width:100%"
                loading-text="查询中..."
              >
                <el-option
                  v-for="item in peopleList"
                  :key="item.index"
                  :label="`${item.name}(${item.companyName})`"
                  :value="item.employeeID">
                </el-option>
              </el-select>
            </el-form-item>
           <el-form-item label="证据审核人：">
             <el-form-column  v-if="!people2use" style="margin-bottom:1px">{{form.people1name}}</el-form-column>
            </el-form-item>
             <el-form-item label="证据批准人："
             v-if="people2use"
               prop="employeeID">
              <el-select
                v-model="text.approverStaffID"
                placeholder="输入姓名搜索员工"
                clearable
                filterable
                style="width:100%"
                loading-text="查询中..."
              >
                <el-option
                  v-for="item in peopleList"
                  :key="item.index"
                  :label="`${item.name}(${item.companyName})`"
                  :value="item.employeeID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证据批准人：">
             <el-form-column  v-if="!people2use" style="margin-bottom:1px">{{form.people2name}}</el-form-column>
            </el-form-item>
            <el-form-item >
            <el-button type="primary" v-if="buttonVisible" style="margin-top:10px" @click="addEvidence">新增证据</el-button>
              <el-button type="info" v-if="buttonVisible" style="margin-top:10px" >请新增证据后再录入</el-button>
              <el-button type="info" v-if="!buttonVisible" style="margin-top:10px">已新增证据</el-button>
              <el-button type="primary" v-if="!buttonVisible" style="margin-top:10px" @click="gotoEvidence">录入证据附件</el-button>
              </el-form-item >
              </el-col>
          </el-row>
        </el-form>
      </el-dialog>

      <el-dialog title="添加附件" :visible.sync="dialogVisible3" center width="600px">
         <el-form label-width="120px" style="width:100%;" >
           <el-row>
            <el-col >

              <el-form-item label="上传文件">
                <el-upload
                  v-model="form.fileID"
                  :limit="1"
                  :on-success="handleAvatarSuccess"
                  :action="accidentOrEventUploadAddress">
                <div class="span1">浏览附件</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="上传图片"> 
              <el-upload
                :action="accidentOrEventUploadAddress"
                list-type="picture-card"
                ref="upload"
                :limit="2"
                :on-exceed="handleExceed"
                :on-success="handleAvatarSuccess"
                >
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}">
                    <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                    >
                    <span class="el-upload-list__item-actions">
                      <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                      >
                      <i class="el-icon-zoom-in"></i>
                      </span>
                     <span
                     v-if="!disabled"
                     class="el-upload-list__item-delete"
                     @click="handleRemove(file)"
                     >
                       <i class="el-icon-delete"></i>
                     </span>
                    </span>
                   </div>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible2">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog> 
              </el-form-item>
              <el-form-item label="附件描述："  prop="desc" style="margin-bottom:1px">
                <el-input type="textarea"  label="附件描述  ："  class="resizeNone" v-model="evidence.attachDescrption" placeholder="请输入内容"></el-input>
                <el-button type="primary" style="margin-top:10px" @click="addEvidenceFile">新增证据附件</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          </el-form>
      </el-dialog>

      
    </div>
  </div>
</template>
<script>
import { qhse_company_tree } from "../../../services/qhse_EvidenceCheck";//获取公司tree
import { querryYearElement } from "../../../services/qhse_QualityCheck";//显示公司所有的证据项节点
import { element_evidence } from "../../../services/qhse_QualityCheck";//显示证据项内容
import { employees } from "../../../services/qhse_QualityCheck";//显示成员
import { evidence } from "../../../services/qhse_QualityCheck";//显示成员
import { element_evidence_attach } from "../../../services/qhse_QualityCheck";//显示成员
const DefaultQuery = {
  year: "",
  companyCode: null,
  status:""
};
export default {
  data() {
    return {
      filterQuery: {},
      companyList: [],
      peopleList:[],
      disabled1:false,
      dialogFormVisible: false,
      loading: true,
      dialogVisible: false,
      detailData: {},//存储查询到的employe信息
      treeData: [],
      initData:[],
      node:[],
      nodeData:[],
      dialogImageUrl: '',
      dialogVisible2: false,
      uploadDisabled: false,
      disabled: false,
      textuse:true,
      people1use:true,
      people2use:true,
      buttonVisible:true,
      dialogVisible3: false,//证据录入按钮
      fileList:[],//文件列表
      hideUpload: false,//隐藏上传按钮
      text:{//获取到左边的描述框
        evidenceDescription:'',
        code:'',
        qhseCompanyYearManagerSysElementID:'', 
        checkStaffID:'',
        approverStaffID:''},
      form:{//保存上传的文件
        address: '',
        emergencyHandler: '',
        briefDescription: '',
        people1name:'1111',
        pelple2name:'1111',
        fileID:''},
      evidence:{
        uploadTime:'',
        qhseCompanyYearManagerSysElementEvidenceID:'',
        attachDescrption:'',
        attach:''
        }
    };
  },
  methods: {
    gotoEvidence(){
      this.dialogVisible3=true;
    },
    addEvidenceFile(){
      var datetime = new Date();
      var year = datetime.getFullYear();
      var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate(); 
      this.evidence.uploadTime=year+'-'+month+'-'+date;
      element_evidence_attach(this.evidence).then(res => {
        console.log(this.evidence);
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    addEvidence(){
      consoel.log(this.text);
      // evidence(this.text).then(res => {
      //   }).catch(err => {
      //     this.$message.error(err.message);
      //   });
    },
    handleAvatarSuccess(res) {
                if (res.code === 1000){ 
                    this.form.fileID = res.data;

                    this.evidence.attach += res.data;
                    this.evidence.attach+=';';
                }
                else {
                    this.$message.error('上传失败');
                    this.form.fileID = '';
                }
            },
    handleExceed(files, fileList) {
        this.$message.warning('当前限制选择 2 个文件');
      },
    handleRemove(file, fileList) {
        this.$refs.upload.clearFiles();
    },
    handlePictureCardPreview(file) {//放大显示
        this.dialogImageUrl = file.url;
        this.dialogVisible2 = true;
    },
    selectDepart(val) {
      this.filterQuery.companyCode = val.nodeCode;
    },
    handleGetCompany() {//获取到公司的名字 即在选择页面显示
        qhse_company_tree().then(res => {
          this.companyList = JSON.parse(JSON.stringify(res.data));
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    handleGetPeople() {//获取到公司的名字 即在选择页面显示
        employees().then(res => {
          this.peopleList = JSON.parse(JSON.stringify(res.data));
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    loadFilterParams() {
      this.filterQuery = { ...DefaultQuery, ...this.$route.query };
      this.filterQuery = {
        ...this.filterQuery
      };
      this.filterQuery.status = ''
      let year = new Date();
      this.filterQuery.year = String(year.getFullYear())
    },
    handleCellClick(row, cell, column) {//展开列表的子节点
      if (row.childNode.length > 0) {
        let els = column.getElementsByClassName("el-icon-arrow-right");
        if (els.length != 0) {
          els[0].click();
        }
      }
    },
    handleClick() {
      if(!this.filterQuery.year){//显示年份
        this.filterQuery.year = new Date()
      }
      let nowdata = new Date(this.filterQuery.year);
      this.filterQuery.year = String(nowdata.getFullYear());
      
      this.handleGetInitialData();//更改loading状态
      
      querryYearElement(this.filterQuery)//获取到叶子节点信息
        .then(res => {
          this.treeData = res.data;
        })
        .catch(err => {
          console.log(err);
          this.message.error(err.message);
        });
      this.loading = false;
    },
    handleGetDate(date) {
      let nowdata = new Date(date);
      return String(nowdata.getFullYear());
    },
    handleGetInitialData() {
      this.loading = true;
    },
    updateScore(data){
      this.dialogVisible = true;  
      element_evidence(data)
      .then(res => {
        this.nodeData= res.data;
        console .log(res.data)
        this.text.code=data.code;
        this.text.qhseCompanyYearManagerSysElementID=this.nodeData.qhseCompanyYearManagerSysElementID;
        this.evidence.qhseCompanyYearManagerSysElementEvidenceID=this.nodeData.qhseCompanyYearManagerSysElementEvidenceID;
        this.text.evidenceDescription=this.nodeData.evidenceDescription;
        this.form.people1name=this.nodeData.approverStaffName;
        this.form.people2name=this.nodeData.checkStaffName;
        if(this.nodeData.evidenceDescription!=null)
        {
          this.buttonVisible=false;
          this.textuse=false
          this.people1use=false;
          this.people2use=false
        }
        console.log('获取到的要素节点内容：',this.nodeData);
        console.log('获取到要素表后的text:',this.text)
      })
      .catch(err => {
        console.log(err);
        this.message.error(err.message);
      });//证据表数据

    
    
    this.node=data;
    this.detailData = {}
    this.detailData.name = data.name
    this.dialogVisible = true;            
    }
    
  },
  mounted() {
    this.handleGetCompany();//第一个函数 获取到公司信息
    this.handleGetPeople();
    this.loadFilterParams();
    this.handleGetInitialData();//获取到表单信息
    this.loading = false;
  },
  computed: {
            accidentOrEventUploadAddress: function () {
                return '/api/evidence_upload'
            }
        }
};
</script>

<style lang="scss">
.input1{
  margin-top: 10px;
  opacity: 0;
  //   position: absolute;
}
.span1{
  margin-top: 10px;;
  width: 100px;
  border-radius: 5%;
  background: rgb(0, 153, 255);
  color: white;
}
.resizeNone{
   .el-textarea__inner{ //el_input中的隐藏属性
         resize: none;  //主要是这个样式
         width: 420px;
         height: 100px;
         margin-bottom: 10px;
     }   
 }
</style>