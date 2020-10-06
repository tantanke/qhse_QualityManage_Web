<template>
<<<<<<< HEAD
  <div>
    <div class="page-title" style="width:100%">要素证据录入</div>
    <div class="page-content">
      <el-row>
        <el-form label-width="130px" :inline="true" :model="filterQuery">
          <el-form-item label="选择公司：" prop="companyCode">
            <treeselect :disable-branch-nodes="true" :multiple="false" :options="companyList" placeholder="请选择公司单位"
              @select="selectDepart" style="width:200px" />
          </el-form-item>
          <el-form-item label="选择年份：">
            <el-date-picker v-model="filterQuery.year" type="year" placeholder="选择年份" style="width:200px">
            </el-date-picker>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleClick">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" icon="el-icon-s-promotion" @click="confirmSubmit">确认提交</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center">
        <div style="margin:15px 0px">
          <span style="margin-right:15px">请选择录入方式:</span>
          <el-radio v-model="checkType" label="树形录入">树形录入</el-radio>
          <el-radio v-model="checkType" label="列表录入">列表录入</el-radio>
        </div>
        <el-table :cell-style="cellStyle" v-if="checkType=='树形录入'" :data="treeData" style="width: 100%" ref="treeTable"
          row-key="code" :indent="30" max-height="560" highlight-current-row border @cell-click="handleCellClick"
          v-loading="loading" :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateScore(scope.row)"
                v-if="scope.row.childNode.length === 0">{{['备案待查', '未批准'].includes(scope.row.status)? '查看' : '录入'}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="schedule" label="进度" width="80" align="center"></el-table-column>
        </el-table>

        <el-table :cell-style="cellStyle" v-if="checkType=='列表录入'" :data="listData" style="width: 100%" ref="treeTable"
          row-key="code" :indent="30" max-height="560" highlight-current-row border @cell-click="handleCellClick"
          v-loading="loading" :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column prop="status" label="状态" width="80" align="center">
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateScore(scope.row)"
                v-if="scope.row.childNode.length === 0">{{['备案待查', '未批准'].includes(scope.row.status)? '查看' : '录入'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-dialog title="添加附件" :visible.sync="dialogVisible3" center width="1200px" :close-on-click-modal=false
        id="addAttach">
        <el-form label-width="120px" style="width:100%;">
          <el-row>
            <el-col :span="24" class="col_border">
              <el-form-item label="量化名称：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>
              <el-form-item v-if="!unpass" label="驳回原因：" style="margin-bottom:1px">{{form.negativeOpinion}}
              </el-form-item>
              <el-form-item label="证据描述：" prop="desc" style="margin-bottom:1px">
                <el-input type="text" label="证据描述  ：" class="resizeNone" v-model="form.evidenceDescription"
                  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="col_border">
              <el-form-item label="证据图片：" style="margin-bottom:10px">
                <div v-for="(item,index) in attachs" :key="index"
                  style="position: relative;width:100px;height:140px;text-align:center;float:left; margin:10px">
                  <el-card :body-style="{ padding: '10px' }"
                    style="width:100px;height:100px;text-align:center;float:left; margin:10px">
                    <el-popover placement="none" title trigger="click" class="hidbg">
                      <div style="box-shadow: 0 0 2px 4px rgba(0,0,0,0.3);" class="picPosition">
                        <img :src="item" class="picSize" />
                      </div>
                      <img slot="reference" :src="item" :alt="detailData.pictureFile"
                        style="max-height: 180px; width: 100%; height: 80px;" @click="hidBg()" />
                    </el-popover>
                  </el-card>
                  <el-button @click="deletepic(index)" size="mini"
                    style="position: absolute; bottom: -10px; left: 32px;">删除
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item label="证据文件：" style="margin-bottom:10px">
                <div v-for="(item,index) in files" :key="index">
                  <a :href="item" style="max-width:600px;height:auto" :download="strings[index]"
                    target="blank">{{strings[index]}}</a>
                  <el-button @click="deletefile(index)" size="mini" style="margin-left: 10px;">删除11
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="col_border">

              <el-form-item label="上传文件">
                <el-upload :show-file-list="show" :on-remove="removeFile" v-model="form.fileID" :headers="headers"
                  multiple ref="uploads" style="float:left" :on-success="handleFilerSuccess"
                  :action="accidentOrEventUploadAddress">
                  <div class="span1">浏览附件</div>
                </el-upload>
                <!--<div style="float:left;margin-left:10px;line-height:60px">限制上传数量为1</div>-->
              </el-form-item>
              <el-form-item label="上传图片">
                <el-upload :action="accidentOrEventUploadAddress" :headers="headers" list-type="picture-card" clearable
                  ref="upload" :on-success="handleAvatarSuccess" :file-list="fileList"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF">
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    <span class="el-upload-list__item-actions" style="width:100%;">
                      <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in" @click="closeMask()"></i>
                      </span>
                      <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <i class="el-icon-delete"></i>
=======
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
                    <el-form-item style="float: right;">
                        <el-button type="primary" icon="el-icon-s-promotion" @click="confirmCheck">确认录入</el-button>
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
                    <el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="updateScore(scope.row)"
                                    v-if="scope.row.childNode.length === 0"
                            >{{scope.row.checkStatus === 0 ? '录入' : '查看'}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="schedule" label="进度" width="80" align="center"></el-table-column>
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
                                    v-if="scope.row.childNode.length === 0"
                            >{{scope.row.checkStatus === 0 ? '录入' : '查看'}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <el-dialog title="添加附件" :visible.sync="dialogVisible3" center width="1200px" :close-on-click-modal=false
                       id="addAttach">
                <el-form label-width="120px" style="width:100%;">
                    <el-row>
                        <el-col :span="24" class="col_border">
                            <el-form-item label="量化名称：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>
                            <el-form-item v-if="!unpass" label="驳回原因：" style="margin-bottom:1px">{{form.negativeOpinion}}</el-form-item>
                            <el-form-item label="证据描述：" prop="desc" style="margin-bottom:1px">
                                <el-input type="text" label="证据描述  ：" class="resizeNone"
                                          v-model="form.evidenceDescription" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" class="col_border">
                            <el-form-item label="证据图片："
                                          style="margin-bottom:10px"
                            >
                                <div v-for="(item,index) in attachs" :key="index"
                                     style="position: relative;width:100px;height:140px;text-align:center;float:left; margin:10px">
                                    <el-card :body-style="{ padding: '10px' }"
                                             style="width:100px;height:100px;text-align:center;float:left; margin:10px">
                                        <el-popover placement="none" title trigger="click" class="hidbg">
                                            <div style="box-shadow: 0 0 2px 4px rgba(0,0,0,0.3);"
                                                 class="picPosition">
                                                <img :src="item"
                                                     class="picSize"/>
                                            </div>
                                            <img slot="reference" :src="item" :alt="detailData.pictureFile"
                                                 style="max-height: 180px; width: 100%; height: 80px;"
                                                 @click="hidBg()"/>
                                        </el-popover>
                                    </el-card>
                                    <el-button @click="deletepic(index)" size="mini"
                                               style="position: absolute; bottom: -10px; left: 32px;">删除
                                    </el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="证据文件："
                                          style="margin-bottom:10px"
                            >
                                <div v-for="(item,index) in files" :key="index">
                                    <a :href="item" style="max-width:600px;height:auto"
                                       :download="strings[index]">{{strings[index]}}</a>
                                    <el-button @click="deletefile(index)" size="mini" style="margin-left: 10px;">删除11
                                    </el-button>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" class="col_border">

                            <el-form-item label="上传文件">
                                <el-upload
                                        :show-file-list="show"
                                        :on-remove="removeFile"
                                        v-model="form.fileID"
                                        :headers="headers"
                                        multiple
                                        ref="uploads"
                                        style="float:left"
                                        :on-success="handleFilerSuccess"
                                        :action="accidentOrEventUploadAddress">
                                    <div class="span1">浏览附件</div>
                                </el-upload>
                                <!--<div style="float:left;margin-left:10px;line-height:60px">限制上传数量为1</div>-->
                            </el-form-item>
                            <el-form-item label="上传图片">
                                <el-upload
                                        :action="accidentOrEventUploadAddress"
                                        :headers="headers"
                                        list-type="picture-card"
                                        clearable
                                        ref="upload"
                                        :on-success="handleAvatarSuccess"
                                        accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                >
                                    <i slot="default" class="el-icon-plus"></i>
                                    <div slot="file" slot-scope="{file}">
                                        <img
                                                class="el-upload-list__item-thumbnail"
                                                :src="file.url" alt=""
                                        >
                                        <span class="el-upload-list__item-actions"
                                              style="width:100%;">
                      <span
                              class="el-upload-list__item-preview"
                              @click="handlePictureCardPreview(file)"
                      >
                      <i class="el-icon-zoom-in" @click="closeMask()"></i>
>>>>>>> f2b70d3b5e8bca85aeb8caaef94654807ad3d09f
                      </span>
                    </span>
<<<<<<< HEAD
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible2" id="preview">
                  <img style="max-width:100%;" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item label="附件描述：" prop="desc" style="margin-bottom:1px">
                <el-input type="textarea" label="附件描述  ：" class="resizeNone" v-model="form.attachDescrption"
                  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="" style="margin-top:10px;margin-left:380px;float:left" @click="dialogVisible3=false">取消
                </el-button>
                <el-button :disabled="['备案待查', '未批准'].includes(curStatus)" type="primary" style="margin-top:10px;"
                  @click="addEvidenceFile">确定录入
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
=======
                                    </div>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible2" id="preview">
                                    <img style="max-width:100%;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </el-form-item>
                            <el-form-item label="附件描述：" prop="desc" style="margin-bottom:1px">
                                <el-input type="textarea" label="附件描述  ：" class="resizeNone"
                                          v-model="form.attachDescrption" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item>
                                <el-button type="" style="margin-top:10px;margin-left:380px;float:left"
                                           @click="dialogVisible3=false">取消
                                </el-button>
                                <el-button :disabled="curCheckStatus !== 0" type="primary" style="margin-top:10px;" @click="addEvidenceFile">确定录入
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>

>>>>>>> f2b70d3b5e8bca85aeb8caaef94654807ad3d09f

    </div>
  </div>
</template>
<script>
import { qhse_company_tree } from "../../../services/qhse_EvidenceCheck";//获取公司tree
import { querryYearElement } from "../../../services/qhse_QualityCheck";//显示公司所有的证据项节点
import { query_evidence_attach } from "../../../services/qhse_QualityCheck";//显示证据项内容
import { employees } from "../../../services/qhse_QualityCheck";//显示成员
import { addAll_evidence_attach } from "../../../services/qhse_QualityCheck";//添加所有的信息
import { submitInputResult } from "../../../services/qhse_QualityCheck";// 确认提交
import { GetCurrentUser } from '../../../store/CurrentUser';
import { downloadElementFile } from "../../../services/qhse_EvidenceCheck";
// import {querryYearElement}from"../../../services/qhse_EvidenceCheck"


const headers1 = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
}
const newOptions = { ...headers1 }
let user = GetCurrentUser()
if (user) {
  newOptions.headers = { ...newOptions.headers1, Authorization: user.token }
}
const DefaultQuery = {
  year: "",
  companyCode: null,
  status: ""
};
export default {
  data () {
    return {
      unpass: false,
      show: false,
      headers: newOptions.headers,//上传文件时候的请求头 不需要理会用处不大
      strings: null,
      filterQuery: {},
      checkType: '树形录入',//匹配哪一种录入方式
      companyList: [],//公司列表
      peopleList: [],//职员列表
      disabled1: false,//显示框是否可见
      download: [],//
      dialogFormVisible: false,
      loading: true,
      detailData: {},//存储查询到的employe信息
      treeData: [],
      listData: [],
      initData: [],
      node: [],
      nodeData: [],
      dialogImageUrl: '',
      dialogVisible2: false,//下面几个都是显示框是否可见的判断
      uploadDisabled: false,
      disabled: false,
      buttonVisible: false,
      dialogVisible3: false,//证据录入
      fileList: [],//文件列表
      hideUpload: false,//隐藏上传按钮
      attach: '',//存储新增的图片id
      fileattach: '',//存储新增文件的id
      attachs: [],//将attach按照分号转化为数组，是已经上传了的图片文件
      files: [],//保存已经上传的文本文件
      form: {//保存上传的文件
        evidenceID: '',//证据id
        id: '',//年度要素id,
        code: '',//要素编码
        evidenceDescription: '',//证据描述
        attachID: '',//附件id
        attachDescrption: '',//附件描述
        attach: '',//最终上传的列表
        uploadTime: ''//上传时间
      },
      tableID: null,
      curStatus: '', // 通过录入或查看按钮进入录入页面时，保存具体某个要素的状态(不通过、未审核等一系列状态)
    };
<<<<<<< HEAD
  },
  methods: {
    deletepic (data) {//删除图片

      console.log('最开始的', this.form.attach, 111111111)
      console.log(this.files, 22222222)
      console.log(this.attachs, 33333)
      //由于要删除原有的文件，于是要对文件进行重新拼接，此处删除的是图片文件
      this.form.attach = '';//先删除证据录入项存储的attach
      var pics = [];
      for (var i = 0; i < this.attachs.length; i++) {//循环图片数组

        if (i != data) {
          console.log('循环中的', pics);
          pics.push(this.attachs[i]);//把存留的图片添加到pics与form的attach里面
          this.form.attach += this.attachs[i].substring(49, this.attachs[i].length);
          this.form.attach += ';';
        }
      }
      for (i = 0; i < this.files.length; i++) {
        this.form.attach += this.files[i].substring(49, this.files[i].length);
        this.form.attach += ';';
      }
      this.attachs = pics;
      console.log('最后的', this.form.attach, 111111111)
      console.log(this.files, 22222222)
      console.log(this.attachs, 33333)
    },
    async deletefile (data) {//删除文件  逻辑和上面一样的
      //由于要删除原有的文件，于是要对文件进行重新拼接，此处删除的是文件

      console.log('最初的文件名', this.strings);
      console.log(this.form.attach, 111111111)
      console.log(this.files, 22222222)
      console.log(this.attachs, 33333)
      this.form.attach = '';//先删除证据录入项存储的attach
      var pics = [];
      this.download = [];
      for (var i = 0; i < this.files.length; i++) {//循环出最终的文件循环

        if (i != data) {
          await downloadElementFile(this.files[i].substring(49, this.files[i].length))//循环生成名字
            .then(res => {
              this.download.push(JSON.parse(JSON.stringify(res.data)));
            })
          console.log('循环中的文件列表', pics);
          pics.push(this.files[i]);//把存留的图片添加到pics与form的attach里面
          this.form.attach += this.files[i].substring(49, this.files[i].length);
          this.form.attach += ';';
        }
        this.form.filelength = i;
      }
      this.files = pics;

      var strings = JSON.parse(JSON.stringify(this.download))
      this.strings = strings;
      console.log(this.strings);

      for (i = 0; i < this.attachs.length; i++) {
        this.form.attach += this.attachs[i].substring(49, this.attachs[i].length);
        this.form.attach += ';';
      }
      console.log('最后的', this.form.attach, 111111111)
      console.log(this.files, 22222222)
      console.log(this.attachs, 33333)
    },
    cellStyle (row) {//根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === "状态" && row.row.status === "备案待查") {
        return 'color:pink'
      } else if (row.column.label === "状态" && row.row.status === "未提供") {
        return 'color:orange'
      } else if (row.column.label === "状态" && row.row.status === "未批准") {
        return 'color:blue'
      } else if (row.column.label === "状态" && row.row.status === "未审核") {
        return 'color:red'
      }
    },
    gotoEvidence () {
      this.evidence.attach = '';
      this.evidence.attachDescrption = '';
      this.form.fileID = '';
      this.dialogVisible3 = true;
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
    async addEvidenceFile () {
      var datetime = new Date();
      var year = datetime.getFullYear();
      var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      this.form.uploadTime = year + '-' + month + '-' + date;
      this.form.attach += this.attach;//加上图片attach
      this.form.attach += this.fileattach;//加上文件attach
      console.log(this.form);
      if (this.form.attach == '' || this.form.attachDescrption == '' || this.form.evidenceDescription == '') {
        this.$message.error('请录入完全')
      }
      else {
        this.$refs.upload.clearFiles();//清空数据
        this.$refs.uploads.clearFiles();//清空数据
        //上传接口
        await addAll_evidence_attach(this.form).then(res => {
          console.log(res);
          console.log(1);
          //上传后刷新树
          this.dialogVisible3 = false;
        }).catch(err => {
          this.$message.error(err.message);
          console.log('', this.form)
        });
        await querryYearElement(this.filterQuery)//获取到叶子节点信息
          .then(res => {
            this.treeData = res.data;
          })
          .catch(err => {
            console.log(err);
            this.message.error(err.message);
          });
        this.listData = [];
        await this.deepTree(this.treeData);

        this.$message.success('添加成功');

      }

    },
    async updateScore (data) {
      // 点击查看或录入进入某个具体的要素时，保存这个要素的状态
      this.curStatus = data.status

      if (data.status == '不通过')
        this.unpass = false;
      else this.unpass = true;

      this.show = false;
      if (this.$refs.uploads != undefined) {
        this.$refs.uploads.clearFiles();
      }
      if (this.$refs.upload != undefined)
        // this.removeFile();
        this.$refs.upload.clearFiles();//清空数据

      this.form.fileID = '';
      this.attach = '';
      this.fileattach = '';
      this.attachs = [];
      this.files = [];
      this.download = [];
      this.detailData.name = data.name
      this.form.evidenceDescription = '';//初始化证据
      this.form.evidenceID = '';//初始化
      this.form.attachID = '';//初始化
      this.form.attachDescrption = '';//初始化附件描述
      this.form.code = data.code;//赋值要素编码
      this.form.id = data.id;//附件id
      this.form.attach = '';
      this.form.filelength = '';//文件长度
      //获取证据项内容
      await query_evidence_attach(data)
        .then(res => {
          //当数据不为空的时候
          if (res.data != null) {
            this.form.attach = res.data.attach;//赋值附件id
            this.form.attachID = res.data.attachID;//赋值附件id
            this.form.evidenceID = res.data.evidenceID;//赋值证据id
            this.form.attachDescrption = res.data.attachDescrption;//赋值附件描述
            this.form.evidenceDescription = res.data.evidenceDescription;//赋值证据描述
            this.form.negativeOpinion = res.data.negativeOpinion;
            console.log(this.form.attach);
            //辨析图片
            this.node = data;
            //展示attachs图片数组url
            this.attachs = [];//初始化图片数组

            var attach = this.form.attach;//获取地址字符串
            if (attach != null) {
              var arr = attach.split(";");

              for (var i = 0, j = 0, k = 0; i < arr.length - 1; i++) {
                //j代表图片数量，k代表文件数量
                var houzhui = arr[i].substring(arr[i].length - 3);//获取到链接后缀
                if (houzhui == 'jpg' || houzhui == 'png' || houzhui == 'PNG' || houzhui == 'JPG') {
                  this.attachs[j] = 'http://39.98.173.131:7000/resources/QHSEEvidence/' + arr[i];
                  j++;
=======
    export default {
        data() {
            return {
                unpass: false,
                show: false,
                headers: newOptions.headers,//上传文件时候的请求头 不需要理会用处不大
                strings: null,
                filterQuery: {},
                checkType: '树形录入',//匹配哪一种录入方式
                companyList: [],//公司列表
                peopleList: [],//职员列表
                disabled1: false,//显示框是否可见
                download: [],//
                dialogFormVisible: false,
                loading: true,
                detailData: {},//存储查询到的employe信息
                treeData: [],
                listData: [],
                initData: [],
                node: [],
                nodeData: [],
                dialogImageUrl: '',
                dialogVisible2: false,//下面几个都是显示框是否可见的判断
                uploadDisabled: false,
                disabled: false,
                buttonVisible: false,
                dialogVisible3: false,//证据录入
                fileList: [],//文件列表
                hideUpload: false,//隐藏上传按钮
                attach: '',//存储新增的图片id
                fileattach: '',//存储新增文件的id
                attachs: [],//将attach按照分号转化为数组，是已经上传了的图片文件
                files: [],//保存已经上传的文本文件
                form: {//保存上传的文件
                    evidenceID: '',//证据id
                    id: '',//年度要素id,
                    code: '',//要素编码
                    evidenceDescription: '',//证据描述
                    attachID: '',//附件id
                    attachDescrption: '',//附件描述
                    attach: '',//最终上传的列表
                    uploadTime: ''//上传时间
                },
                tableID: null,
                curStatus: '', // 通过录入或查看按钮进入录入页面时，保存具体某个要素的状态(不通过、未审核等一系列状态)
                curCheckStatus: 0 // 通过录入或查看按钮进入录入页面时，保存具体某个要素的状态(0, 1, 2等一系列状态)
            };
        },
        methods: {
            deletepic(data) {//删除图片
                console.log(this.form.attach, 111111111)
                console.log(this.files, 22222222)
                console.log(this.attachs, 33333)
                //由于要删除原有的文件，于是要对文件进行重新拼接，此处删除的是图片文件
                this.form.attach = '';//先删除证据录入项存储的attach
                var pics = [];
                for (var i = 0; i < this.attachs.length; i++) {

                    if (i != data) {
                        console.log('循环中的', pics);
                        pics.push(this.attachs[i]);//把存留的图片添加到pics与form的attach里面
                        this.form.attach += this.attachs[i];
                        this.form.attach += ';';
                    }
                }
                for (var i = 0; i < this.files.length; i++) {
                    this.form.attach += this.attachs[i];
                    this.form.attach += ';';
                }
                this.attachs = pics;
                console.log('最终的', pics)
            },
            deletefile(data) {//删除文件  逻辑和上面一样的
                //由于要删除原有的文件，于是要对文件进行重新拼接，此处删除的是文件

                console.log(this.form.attach, 111111111)
                console.log(this.files, 22222222)
                console.log(this.attachs, 33333)
                this.form.attach = '';//先删除证据录入项存储的attach
                var pics = [];
                for (var i = 0; i < this.files.length; i++) {

                    if (i != data) {
                        console.log('循环中的', pics);
                        pics.push(this.attachs[i]);//把存留的图片添加到pics与form的attach里面
                        this.form.attach += this.attachs[i];
                        this.form.attach += ';';
                    }
                }
                for (var i = 0; i < this.attachs.length; i++) {
                    this.form.attach += this.attachs[i];
                    this.form.attach += ';';
                }
                this.files = pics;
                console.log('最终的', pics)
            },
            cellStyle(row, column, rowIndex, columnIndex) {//根据报警级别显示颜色
                // console.log(row);
                // console.log(row.column);
                if (row.column.label === "状态" && row.row.status === "备案待查") {
                    return 'color:pink'
                } else if (row.column.label === "状态" && row.row.status === "未提供") {
                    return 'color:orange'
                } else if (row.column.label === "状态" && row.row.status === "未批准") {
                    return 'color:blue'
                } else if (row.column.label === "状态" && row.row.status === "未审核") {
                    return 'color:red'
                }
            },
            gotoEvidence() {
                this.evidence.attach = '';
                this.evidence.attachDescrption = '';
                this.form.fileID = '';
                this.dialogVisible3 = true;
            },
            deepTree(treedata) {
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
            async addEvidenceFile() {
                var datetime = new Date();
                var year = datetime.getFullYear();
                var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
                var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
                this.form.uploadTime = year + '-' + month + '-' + date;
                this.form.attach += this.attach;//加上图片attach
                this.form.attach += this.fileattach;//加上文件attach
                console.log(this.form);
                if (this.form.attach == '' || this.form.attachDescrption == '' || this.form.evidenceDescription == '') {
                    this.$message.error('请录入完全')
                }
                else {
                    this.$refs.upload.clearFiles();//清空数据
                    this.$refs.uploads.clearFiles();//清空数据
                    //上传接口
                    await addAll_evidence_attach(this.form).then(res => {
                        console.log(res);
                        console.log(1);
                        //上传后刷新树
                        this.dialogVisible3 = false;
                    }).catch(err => {
                        this.$message.error(err.message);
                        console.log('', this.form)
                    });
                    await querryYearElement(this.filterQuery)//获取到叶子节点信息
                        .then(res => {
                            this.treeData = res.data;
                        })
                        .catch(err => {
                            console.log(err);
                            this.message.error(err.message);
                        });
                    this.listData = [];
                    await this.deepTree(this.treeData);

                    this.$message.success('添加成功');

                }

            },
            async updateScore(data) {
                // 点击查看或录入进入某个具体的要素时，保存这个要素的状态
                this.curStatus = data.status
                // 点击查看或录入进入某个具体的要素时，保存这个要素的状态
                this.curCheckStatus = data.checkStatus
                alert(this.curCheckStatus)


                if (data.status == '不通过')
                    this.unpass = false;
                else this.unpass = true;

                this.show = false;
                if (this.$refs.uploads != undefined) {
                    this.$refs.uploads.clearFiles();
                }
                if (this.$refs.upload != undefined)
                // this.removeFile();
                    this.$refs.upload.clearFiles();//清空数据

                this.form.fileID = '';
                this.attach = '';
                this.fileattach = '';
                this.attachs = [];
                this.files = [];
                this.download = [];
                this.detailData.name = data.name
                this.form.evidenceDescription = '';//初始化证据
                this.form.evidenceID = '';//初始化
                this.form.attachID = '';//初始化
                this.form.attachDescrption = '';//初始化附件描述
                this.form.code = data.code;//赋值要素编码
                this.form.id = data.id;//附件id
                this.form.attach = '';
                this.form.filelength = '';//文件长度
                //获取证据项内容
                await query_evidence_attach(data)
                    .then(res => {
                        //当数据不为空的时候
                        if (res.data != null) {
                            this.form.attach = res.data.attach;//赋值附件id
                            this.form.attachID = res.data.attachID;//赋值附件id
                            this.form.evidenceID = res.data.evidenceID;//赋值证据id
                            this.form.attachDescrption = res.data.attachDescrption;//赋值附件描述
                            this.form.evidenceDescription = res.data.evidenceDescription;//赋值证据描述
                            this.form.negativeOpinion = res.data.negativeOpinion;
                            console.log(this.form.attach);
                            //辨析图片
                            this.node = data;
                            //展示attachs图片数组url
                            this.attachs = [];//初始化图片数组

                            var attach = this.form.attach;//获取地址字符串
                            if (attach != null) {
                                var arr = attach.split(";");

                                for (var i = 0, j = 0, k = 0; i < arr.length - 1; i++) {
                                    //j代表图片数量，k代表文件数量
                                    var houzhui = arr[i].substring(arr[i].length - 3);//获取到链接后缀
                                    if (houzhui == 'jpg' || houzhui == 'png' || houzhui == 'PNG' || houzhui == 'JPG') {
                                        this.attachs[j] = 'http://39.98.173.131:7000/resources/QHSEEvidence/' + arr[i];
                                        j++;
                                    }
                                    else {
                                        if (arr.length != 0)
                                            this.files[k] = 'http://39.98.173.131:7000/resources/QHSEEvidence/' + arr[i];
                                        k++;
                                        this.form.filelength = k;
                                    }
                                }
                            }
                        }
                        else {//为空的时候好像就不怎么地
                        }
                        this.dialogVisible3 = true;
                    })
                    .catch(err => {
                        console.log(err);
                    });//证据表数据
                this.download = [];
                for (var i = 0; i < this.form.filelength; i++) {
                    await downloadElementFile(this.files[i].substring(49, this.files[i].length))
                        .then(res => {
                            console.log(this.download)
                            this.download[i] = JSON.parse(JSON.stringify(res.data))
                        })
                }
                var strings = JSON.parse(JSON.stringify(this.download))
                this.strings = strings;
                this.node = data;

            },
            //限制文件数量并新增
            handleFilerSuccess(res) {
                this.show = true
                if (res.code === 1000) {
                    this.fileattach += res.data;
                    this.$message.success('上传成功');
                    this.fileattach += ';';
                }
                else {
                    this.$message.error('上传失败');
                    this.form.attachID = '';
                }
            },
            handleAvatarSuccess(res) {
                if (res.code === 1000) {
                    this.$message.success('上传成功');
                    this.attach += res.data;
                    this.attach += ';';
                }
                else {
                    this.$message.error('上传失败');
                    this.form.attachID = '';
                }
            },
            removeFile() {
                this.fileattach = '';
            },
            handleRemove(file) {
                this.$refs.upload.clearFiles();
                this.attach = '';
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
                this.filterQuery = {...DefaultQuery, ...this.$route.query};
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
                this.listData = [];
                this.listData = [];

                if (!this.filterQuery.year) {//显示年份
                    this.filterQuery.year = new Date()
>>>>>>> f2b70d3b5e8bca85aeb8caaef94654807ad3d09f
                }
                else {
<<<<<<< HEAD
                  if (arr.length != 0)
                    this.files[k] = 'http://39.98.173.131:7000/resources/QHSEEvidence/' + arr[i];
                  k++;
                  this.form.filelength = k;
=======
                    this.handleGetInitialData();//更改loading状态
                    querryYearElement(this.filterQuery)//获取到叶子节点信息
                        .then(res => {
                            this.treeData = res.data;

                            // 将查询时获取到的tableID保存下来
                            this.tableID = this.treeData[0].tableID

                            this.deepTree(this.treeData)
                        })
                        .catch(err => {
                            console.log(err);
                            this.message.error(err.message);
                        });
                    this.loading = false;
                }

            },
            // 确认录入
            confirmCheck() {
                if (this.tableID) {
                    submitInputResult({
                        tableID: this.tableID,
                        tag: 0
                    });
                    this.$message.success("提交成功")
                }
            },
            //转换年份
            handleGetDate(date) {
                let nowdata = new Date(date);
                return String(nowdata.getFullYear());
            },
            handleGetInitialData() {
                this.loading = true;
            },
            // 预览图移动到中间后，提示框背景还在原位置，需要将其隐藏
            hidBg() {
                let x = document.getElementsByClassName("el-popover el-popper")
                for (let i = 0; i < x.length; i++) {
                    x[i].classList.add('hidbg');
>>>>>>> f2b70d3b5e8bca85aeb8caaef94654807ad3d09f
                }
              }
            }
          }
          else {//为空的时候好像就不怎么地
          }
          this.dialogVisible3 = true;
        })
        .catch(err => {
          console.log(err);
        });//证据表数据
      this.download = [];
      for (var i = 0; i < this.form.filelength; i++) {
        await downloadElementFile(this.files[i].substring(49, this.files[i].length))
          .then(res => {
            console.log(this.download)
            this.download[i] = JSON.parse(JSON.stringify(res.data))
          })
      }
      var strings = JSON.parse(JSON.stringify(this.download))
      this.strings = strings;
      this.node = data;

    },
    //限制文件数量并新增
    handleFilerSuccess (res) {
      this.show = true
      if (res.code === 1000) {
        this.fileattach += res.data;
        this.$message.success('上传成功');
        this.fileattach += ';';
      }
      else {
        this.$message.error('上传失败');
        this.form.attachID = '';
      }
    },
    handleAvatarSuccess (res) {
      if (res.code === 1000) {
        this.$message.success('上传成功');
        this.attach += res.data;
        this.attach += ';';
      }
      else {
        this.$message.error('上传失败');
        this.form.attachID = '';
      }
    },
    removeFile () {
      this.fileattach = '';
    },
    handleRemove () {
      this.$refs.upload.clearFiles();
      this.attach = '';
    },
    //放大显示
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },
    //选中公司后将公司的nodecode赋值给filterQuery
    selectDepart (val) {
      this.filterQuery.companyCode = val.nodeCode;
    },
    handleGetCompany () {//获取到公司的名字 即在选择页面显示
      qhse_company_tree().then(res => {
        this.companyList = JSON.parse(JSON.stringify(res.data));
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    handleGetPeople () {//获取到成员的名字 即在选择页面显示
      employees().then(res => {
        this.peopleList = JSON.parse(JSON.stringify(res.data));
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    //缓存年份
    loadFilterParams () {
      this.filterQuery = { ...DefaultQuery, ...this.$route.query };
      this.filterQuery = {
        ...this.filterQuery
      };
      this.filterQuery.status = ''
      let year = new Date();
      this.filterQuery.year = String(year.getFullYear())
    },
    handleCellClick (row, cell, column) {//展开列表的子节点
      if (row.childNode.length > 0) {
        let els = column.getElementsByClassName("el-icon-arrow-right");
        if (els.length != 0) {
          els[0].click();
        }
      }
    },
    handleClick () {
      this.listData = [];
      this.listData = [];

      if (!this.filterQuery.year) {//显示年份
        this.filterQuery.year = new Date()
      }
      let nowdata = new Date(this.filterQuery.year);
      this.filterQuery.year = String(nowdata.getFullYear());
      if (this.filterQuery.companyCode == null)
        this.$message.error('请选择公司')
      else {
        this.handleGetInitialData();//更改loading状态
        querryYearElement(this.filterQuery)//获取到叶子节点信息
          .then(res => {
            this.treeData = res.data;

            // 将查询时获取到的tableID保存下来
            this.tableID = this.treeData[0].tableID

            this.deepTree(this.treeData)
          })
          .catch(err => {
            console.log(err);
            this.message.error(err.message);
          });
        this.loading = false;
      }

    },
    // 确认提交
    confirmSubmit () {
      if (this.tableID) {
        submitInputResult(this.tableID);
      }
    },
    //转换年份
    handleGetDate (date) {
      let nowdata = new Date(date);
      return String(nowdata.getFullYear());
    },
    handleGetInitialData () {
      this.loading = true;
    },
    // 预览图移动到中间后，提示框背景还在原位置，需要将其隐藏
    hidBg () {
      let x = document.getElementsByClassName("el-popover el-popper")
      for (let i = 0; i < x.length; i++) {
        x[i].classList.add('hidbg');
      }
    },
    // 点击放大按钮后，黑色的遮罩也放大了，导致整个页面被覆盖，因此需要将其隐藏掉
    closeMask () {
      let x = document.getElementsByClassName("v-modal");
      console.log(x);
      for (let i = 0; i < x.length; i++) {
        // 因为下面执行的display: none 比较晚（更早没效果），会导致出现黑影一闪而过
        // 所以，第一步将黑色遮罩颜色改为透明，从视觉上隐藏
        // 第二步再从DOM中真正隐藏。
        x[i].style.backgroundColor = "transparent";
        setTimeout(() => {
          x[i].style.display = 'none';
        }, 0)

      }
    }

  },
  mounted () {
    console.log('这里开始录入部分的报错，前面的都不用care')
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
.input1 {
  margin-top: 10px;
  opacity: 0;
  //   position: absolute;
}

.span1 {
  margin-top: 10px;
  width: 100px;
  border-radius: 5%;
  background: rgb(0, 153, 255);
  color: white;
}

.resizeNone {
  .el-textarea__inner {
    //el_input中的隐藏属性
    resize: none; //主要是这个样式
    height: 40px;
    margin-bottom: 10px;
  }
}

.col_border {
  border: 1px solid gray;
  margin-top: -1px;
  padding: 10px;
}

.hidbg {
  left: -1000px !important;
}

.picSize {
  max-width: 1400px;
  max-height: 750px;
  vertical-align: bottom;
}

.picPosition {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

div.el-dialog__wrapper#preview {
  & > div.el-dialog {
    width: 90%;
    margin: 0px;
    margin-top: 0vh !important;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    div.el-dialog__body {
      text-align: center;
      padding: 10px;
    }
  }
}

div.el-dialog__wrapper#addAttach {
  & > div.el-dialog {
    margin-top: 10vh !important;
    div.el-dialog__body {
      padding: 0px 10px 10px;
      div.el-form-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>