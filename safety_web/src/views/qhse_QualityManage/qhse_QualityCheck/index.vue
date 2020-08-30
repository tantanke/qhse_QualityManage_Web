<template>
  <div>
    <div class="page-title" style="width:100%">要素证据录入</div>
    <div class="page-content">
      <el-row>
        <el-form label-width="130px" :inline="true" :model="filterQuery">
          <el-form-item label="选择公司：" prop="companyCode">
            <treeselect
              :disable-branch-nodes="true"
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
   <div style="margin:15px 0px">
      <span style="margin-right:15px">请选择录入方式:</span>
          <el-radio v-model="checkType" label="树形录入">树形录入</el-radio> 
          <el-radio v-model="checkType" label="列表录入">列表录入</el-radio>     
    </div>
        <el-table
          :cell-style="cellStyle"
          v-if="checkType=='树形录入'"
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
          <el-table-column prop="schedule" label="进度" width="80" align="center"> </el-table-column>
          <el-table-column prop="status" label="状态" width="80" align="center"> </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button 
              type="primary"
              size="mini"
              @click="updateScore(scope.row)"
              v-if="scope.row.childNode.length === 0 &&(scope.row.status==='未审核' || scope.row.status==='未提供'|| scope.row.status==='不通过')"
              >录入</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          :cell-style="cellStyle"
          v-if="checkType=='列表录入'"
          :data="listData"
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
          <el-table-column prop="status" label="状态" width="80" align="center">
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button 
              type="primary"
              size="mini"
              @click="updateScore(scope.row)"
              v-if="scope.row.childNode.length === 0 &&(scope.row.status==='未审核' || scope.row.status==='未提供'|| scope.row.status==='不通过')"
              >录入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-dialog title="添加附件" :visible.sync="dialogVisible3" center width="1200px">
         <el-form label-width="120px" style="width:100%;" >
           <el-row>
            <el-col :span="24">
              <el-form-item label="量化名称：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>
              <el-form-item label="证据描述："  prop="desc" style="margin-bottom:1px">
                <el-input type="text"   label="证据描述  ："  class="resizeNone" v-model="form.evidenceDescription" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="证据图片：" 
              style="margin-bottom:10px"
              >
              <div  v-for="(item,index) in attachs" :key="index">
                <el-card :body-style="{ padding: '10px' }" style="width:100px;height:100px;text-align:center;float:left; margin:10px" >
                  <span v-if="!item">无图片文件记录！</span>
                  <el-popover placement="right" title trigger="click" v-else>
                    <div style="max-width:600px;height:auto">
                      <img :src="item" style="max-width:600px;height:auto" />
                    </div>
                    <img slot="reference" :src="item" :alt="detailData.pictureFile" style="max-height: 180px" />
                  </el-popover>
                </el-card>
              </div >
              </el-form-item>
              <el-form-item label="证据文件：" 
              style="margin-bottom:10px"
              >
                <div v-for="(item,index) in files" :key="index">
                    <a :href="item" style="max-width:600px;height:auto" :download="strings[index]">{{strings[index]}}</a>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="border:1px solid gray; ">

              <el-form-item label="上传文件">
                <el-upload
                 :show-file-list="show"
                :on-remove="removeFile"
                  v-model="form.fileID"
                  :headers="headers"
                  :limit="1"
                  ref="uploads"
                  style="float:left"
                  :on-success="handleFilerSuccess"
                  :action="accidentOrEventUploadAddress">
                <div class="span1">浏览附件</div>
                </el-upload>
                <div style="float:left;margin-left:10px;line-height:60px">限制上传数量为1</div>
              </el-form-item>
              <el-form-item label="上传图片"> 
              <el-upload
                :action="accidentOrEventUploadAddress"
                :headers="headers"
                list-type="picture-card"
                clearable
                ref="upload"
                :on-success="handleAvatarSuccess"
                >
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}" >
                    <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                    >
                    <span class="el-upload-list__item-actions"
                    style="width:100px">
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
                <el-input type="textarea"  label="附件描述  ："  class="resizeNone" v-model="form.attachDescrption" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="24" >
            <el-form-item>
            <el-button type="" style="margin-top:10px;margin-left:380px;float:left" @click="dialogVisible3=false">取消</el-button>
            <el-button type="primary" style="margin-top:10px;" @click="addEvidenceFile">确定录入</el-button>
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
import { query_evidence_attach } from "../../../services/qhse_QualityCheck";//显示证据项内容
import { employees } from "../../../services/qhse_QualityCheck";//显示成员
import { addAll_evidence_attach } from "../../../services/qhse_QualityCheck";//添加所有的信息
import  {GetCurrentUser} from '../../../store/CurrentUser';
import { downloadElementFile } from"../../../services/qhse_EvidenceCheck";
// import {querryYearElement}from"../../../services/qhse_EvidenceCheck"


const headers1 = {
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8'
              }
              const newOptions = {...headers1}
              let user = GetCurrentUser()
              if (user) {
              newOptions.headers = {...newOptions.headers1, Authorization: user.token}
              }
const DefaultQuery = {
  year: "",
  companyCode: null,
  status:""
};
export default {
  data() {
    return {
      show:false,
      headers:newOptions.headers,
      strings:null,
      filterQuery: {},
      checkType:'树形录入',
      companyList: [],//公司列表
      peopleList:[],//职员列表
      disabled1:false,
      download:[],
      dialogFormVisible: false,
      loading: true,
      detailData: {},//存储查询到的employe信息
      treeData: [],
      listData:[],
      initData:[],
      node:[],
      nodeData:[],
      dialogImageUrl: '',
      dialogVisible2: false,
      uploadDisabled: false,
      disabled: false,
      buttonVisible:false,
      dialogVisible3: false,//证据录入
      fileList:[],//文件列表
      hideUpload: false,//隐藏上传按钮
      attach:'',//存储新增的图片id
      fileattach:'',//存储新增文件的id
      attachs:[],//将attach按照分号转化为数组
      files:[],//保存的文本文件
      form:{//保存上传的文件
        evidenceID:'',//证据id
        id:'',//年度要素id,
        code:'',//要素编码
        evidenceDescription:'',//证据描述
        attachID:'',//附件id
        attachDescrption:'',//附件描述
        attach:'',//附件
        uploadTime:''//上传时间
        }
    };
  },
  methods: {
    cellStyle(row,column,rowIndex,columnIndex){//根据报警级别显示颜色
        // console.log(row);
        // console.log(row.column);
        if(row.column.label==="状态"&& row.row.status==="备案待查"){
          return 'color:red'
        }else if(row.column.label==="状态"&& row.row.status==="未提供" ){
          return 'color:orange'
        }else if(row.column.label==="状态"&& row.row.status==="未批准" ){
          return 'color:blue'
        }else if(row.column.label==="状态"&& row.row.status==="未审核" ){
          return 'color:pink'
        }
    },
    gotoEvidence(){
      this.evidence.attach='';
      this.evidence.attachDescrption='';
      this.form.fileID='';
      this.dialogVisible3=true;
    },
    deepTree (treedata) {
            let _this = this
            
            treedata.forEach(item => {
                if (item.childNode.length === 0) {
                    _this.listData.push(item)
                    return
                } else {
                    _this.deepTree(item.childNode)
                }
            })
            return _this.listData;
      },
    //添加附件，与下面整合
    async addEvidenceFile(){
      var datetime = new Date();
      var year = datetime.getFullYear();
      var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate(); 
      this.form.uploadTime=year+'-'+month+'-'+date;
      this.form.attach+=this.attach;//加上图片attach
      this.form.attach+=this.fileattach;//加上文件attach
      
      this.$refs.upload.clearFiles();//清空数据
      this.$refs.uploads.clearFiles();//清空数据
      //上传接口
      await addAll_evidence_attach(this.form).then(res => {
         console.log(res);
         console.log(1);
         //上传后刷新树
         this.dialogVisible3=false;
        }).catch(err => {
          this.$message.error(err.message);
        });
      await querryYearElement(this.filterQuery)//获取到叶子节点信息
        .then(res => {
          this.treeData = res.data;
        })
        .catch(err => {
          console.log(err);
          this.message.error(err.message);
        });
      this.listData=[];
      await this.deepTree(this.treeData);
        this.$message.success('添加成功');
        
    },
    async updateScore(data){
      this.show=false;
      if(this.$refs.uploads!=undefined){this.$refs.uploads.clearFiles();}
      if(this.$refs.upload!=undefined)
        // this.removeFile();
        this.$refs.upload.clearFiles();//清空数据
        
        this.form.fileID='';
        this.attach='';
        this.fileattach='';
        this.attachs={};
        this.files={};
        this.download=[];
        this.detailData.name = data.name    
        this.form.evidenceDescription='';//初始化证据
        this.form.evidenceID='';//初始化
        this.form.attachID='';//初始化
        this.form.attachDescrption=null;//初始化附件描述
        this.form.code=data.code;//赋值要素编码
        this.form.id=data.id;//附件id
        this.form.attach='';
        this.form.filelength='';//文件长度
        //获取证据项内容
        await query_evidence_attach(data)
        .then(res => {
          //当数据不为空的时候
          if(res.data!=null){
            this.form.attach=res.data.attach;//赋值附件id
            this.form.attachID=res.data.attachID;//赋值附件id
            this.form.evidenceID=res.data.evidenceID;//赋值证据id
            this.form.attachDescrption=res.data.attachDescrption;//赋值附件描述
            this.form.evidenceDescription=res.data.evidenceDescription;//赋值证据描述
            console.log(this.form.attach);
            //辨析图片
            this.node=data;
            //展示attachs图片数组url
            this.attachs={};//初始化图片数组
            
            var attach = this.form.attach;//获取地址字符串
              if(attach!=null){
                var arr=attach.split(";");
              
                for(var i=0,j=0,k=0;i<arr.length-1;i++)
                {
                  //j代表图片数量，k代表文件数量
                  var houzhui=arr[i].substring(arr[i].length-3);//获取到链接后缀
                  if(houzhui=='jpg'||houzhui=='png'||houzhui=='PNG'||houzhui=='JPG'){
                  this.attachs[j]='http://39.98.173.131:7000/resources/QHSEEvidence/'+arr[i];
                  j++;
                  }
                  else{
                    if(arr.length!=0)
                    this.files[k]='http://39.98.173.131:7000/resources/QHSEEvidence/'+arr[i];
                    k++;
                    this.form.filelength=k;
                  }
                }
              }
          }
          else{//为空的时候好像就不怎么地
          }
          this.dialogVisible3=true;
        })
        .catch(err => {
          console.log(err);
        });//证据表数据
        this.download=[];
        for(var i=0;i<this.form.filelength;i++){
          await downloadElementFile(this.files[i].substring(49,this.files[i].length))
          .then(res=>{
            console.log(this.download)
            this.download[i]=JSON.parse(JSON.stringify(res.data))
          })
        }
        var strings=JSON.parse(JSON.stringify(this.download))
        this.strings=strings;
        this.node=data;
         
    },
    //限制文件数量并新增
    handleFilerSuccess(res){
      this.show=true
       if (res.code === 1000){ 
                    this.fileattach += res.data;
                    this.fileattach+=';';
                }
                else {
                    this.$message.error('上传失败');
                    this.form.attachID = '';
                }
    },
    handleAvatarSuccess(res) {
                if (res.code === 1000){ 
                    this.attach += res.data;
                    this.attach+=';';
                }
                else {
                    this.$message.error('上传失败');
                    this.form.attachID = '';
                }
    },
    removeFile(){
        this.fileattach='';
    },
    handleRemove() {
        this.$refs.upload.clearFiles();
        this.attach='';
    },
    //放大显示
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible2 = true;
    },
    //选中公司后将公司的nodecode赋值给filterQuery
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
    handleGetPeople() {//获取到成员的名字 即在选择页面显示
        employees().then(res => {
          this.peopleList = JSON.parse(JSON.stringify(res.data));
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    //缓存年份
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
      this.listData=[];
      this.listData=[];

      if(!this.filterQuery.year){//显示年份
        this.filterQuery.year = new Date()
      }
      let nowdata = new Date(this.filterQuery.year);
      this.filterQuery.year = String(nowdata.getFullYear());
      if(this.filterQuery.companyCode==null)
         this.$message.error('请选择公司')
      else{
           this.handleGetInitialData();//更改loading状态
      querryYearElement(this.filterQuery)//获取到叶子节点信息
        .then(res => {
          this.treeData = res.data;
          this.deepTree(this.treeData)
        })
        .catch(err => {
          console.log(err);
          this.message.error(err.message);
        });
      this.loading = false;
         }
      
    },
    //转换年份
    handleGetDate(date) {
      let nowdata = new Date(date);
      return String(nowdata.getFullYear());
    },
    handleGetInitialData() {
      this.loading = true;
    }
    
  },
  mounted() {
    console.log('这里开始录入部分的报错，前面的都不用care')
    this.handleGetCompany();//第一个函数 获取到公司信息
    this.handleGetPeople();
    this.loadFilterParams();
    this.handleGetInitialData();//获取到表单信息
    this.loading = false;
  },
  computed: {
    
            accidentOrEventUploadAddress: function () {
                return  '/api/evidence_upload'
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
         height: 40px;
         margin-bottom: 10px;
     }   
 }
</style>