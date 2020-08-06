<template>
  <div>
    <div class="page-title" style="width:100%">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a @click="$router.go(-1)">QHSE文件审核</a></el-breadcrumb-item>
            <el-breadcrumb-item>详情查看</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div style="margin:15px 0px">
      <span style="margin-right:15px">请选择文件审核方式:</span>
          <el-radio v-model="checkType" label="树形审核">树形审核</el-radio> 
          <el-radio v-model="checkType" label="列表审核">列表审核</el-radio>
       
    </div>
    <el-row style="padding:8px; border-top: 2px dashed #dddddd;text-align:center"></el-row>
    <div class="page-content">
      <el-row>
        <el-form label-width="100px"  :inline="true" :model="filterQuery">
          <el-form-item label="公司：">
            <el-input v-model="filterQuery.companyName" readonly></el-input>
          </el-form-item>
          <el-form-item label="年份：">
            <el-input v-model="filterQuery.year" readonly></el-input>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-button type="danger" @click="$router.go(-1)">返回前一页</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="padding:10px; border-top: 2px dashed #dddddd;text-align:center" >
        <div v-show="checkType === '树形审核'">
        <el-table
          :data="treeList"
          style="width: 100%"
          ref="treeTable"
          row-key="id"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          @cell-click="handleCellClick"
          v-loading="loading"
          :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="goUpdateFile(scope.row)"
                v-if="scope.row.childNode.length === 0 && scope.row.fileCheckStatus === '未审核'"
              >开始审核</el-button>
              <el-button
              type="success"
              size="mini"
              v-if="scope.row.childNode.length === 0 && scope.row.fileCheckStatus === '已审核'"
              @click="detaileFile(scope.row)"
              >
              审核完成  
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
        <div v-if="checkType === '列表审核'">
         <el-table
          :data="fileList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          ref="listTable"
          style="width: 100%"
          v-loading="loading"
          :indent="30"
          max-height="560"
          highlight-current-row
          border
          >
          <el-table-column prop="name" label="内容"></el-table-column>
          <el-table-column  width="200" align="center">
            <template slot="header" slot-scope="scope">
              <el-input
                :ref="scope.$index"
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="goUpdateFile(scope.row)"
                v-if="scope.row.childNode.length === 0 && scope.row.fileCheckStatus === '未审核'"
              >开始审核</el-button>
              <el-button
              type="success"
              size="mini"
              v-if="scope.row.childNode.length === 0 && scope.row.fileCheckStatus === '已审核'"
              @click="detaileFile(scope.row)"
              >
              查看详情  
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </el-row>
      <el-dialog title="文件审核" :visible.sync="dialogVisible" center width="1200px">
        
        <el-form label-width="140px" :model="detailData" style="width:100%;" >
          <el-row>
            <el-col :span="12">
              <el-form-item label="打分项：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>            
              <el-form-item label="审核方式：" style="margin-bottom:1px">{{detailData.auditMode}}</el-form-item>
              <el-form-item label="初始分数：" style="margin-bottom:1px">{{detailData.initialScore}}</el-form-item>
              <el-form-item label="计算公式：" style="margin-bottom:1px">{{detailData.formula}}</el-form-item>
              <el-form-item label="问题描述：" style="margin-bottom:1px">{{detailData.problemDescription}}</el-form-item>
              <el-form-item label="证据图片：" style="margin-bottom:10px">
                <el-card :body-style="{ padding: '10px' }" style="width:100%;height:200px;text-align:center" >
                  <span v-if="!detailData.pictureFile">无图片文件记录！</span>
                  <el-popover placement="right" title trigger="click" v-else>
                    <div style="max-width:600px;height:auto">
                      <img :src="detailData.pictureFile" style="max-width:600px;height:auto" />
                    </div>
                    <img slot="reference" :src="detailData.pictureFile" :alt="detailData.pictureFile" style="max-height: 180px" />
                  </el-popover>
                </el-card>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <h3 style="margin-left:80px">
                    填写审核内容                
              </h3>
              <el-form :v-model="fileRecord">
              <el-form-item label='分数:' labelWidth='100px' style="width:280px">
                <el-input type="text" v-model="fileRecord.codeScore"></el-input>
              </el-form-item>
              <el-form-item label='通过状态:' labelWidth='100px' >
                <el-select v-model="fileRecord.pass" placeholder="请选择是否通过" style="width:200px">
                <el-option label="通过" value="通过"></el-option>
                <el-option label="不通过" value="不通过"></el-option>
              </el-select>
              </el-form-item>
              <el-form-item label='问题选择:' labelWidth='100px' v-if="fileRecord.pass === '不通过'">
                <el-checkbox-group v-model="proTextarea" >
                  <el-checkbox v-for="(item,index) in problem" :key="index" :label="item">                   
                  </el-checkbox>
                  </el-checkbox-group>
                  <el-checkbox  v-model="elsePro">其他</el-checkbox>
                  <el-input
                    type="textarea"
                    v-if="elsePro"
                    :rows="2"
                    placeholder="请输入具体问题"
                    v-model="proTextarea">
                  </el-input>
              </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updataFileAudit">确定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </div>
      </el-dialog>
      <el-dialog title="文件审核详情查看" :visible.sync="detaildialogVisible" center width="1200px">
        
        <el-form label-width="140px" :model="detailData" style="width:100%;" >
          <el-row>
            <el-col :span="12">
              <el-form-item label="打分项：" style="margin-bottom:1px">{{detailData.name}}</el-form-item>            
              <el-form-item label="审核方式：" style="margin-bottom:1px">{{detailData.auditMode}}</el-form-item>
              <el-form-item label="初始分数：" style="margin-bottom:1px">{{detailData.initialScore}}</el-form-item>
              <el-form-item label="实际得分：" style="margin-bottom:1px">{{detailData.codeScore}}</el-form-item>
              <el-form-item label="计算公式：" style="margin-bottom:1px">{{detailData.formula}}</el-form-item>
              <el-form-item label="审核状态：" style="margin-bottom:1px">{{detailData.pass}}</el-form-item>
              <el-form-item label="问题描述：" style="margin-bottom:1px">{{detailData.problemDescription}}</el-form-item>
              <el-form-item label="证据图片：" style="margin-bottom:10px">
                <el-card :body-style="{ padding: '10px' }" style="width:100%;height:200px;text-align:center" >
                  <span v-if="!detailData.pictureFile">无图片文件记录！</span>
                  <el-popover placement="right" title trigger="click" v-else>
                    <div style="max-width:600px;height:auto">
                      <img :src="detailData.pictureFile" style="max-width:600px;height:auto" />
                    </div>
                    <img slot="reference" :src="detailData.pictureFile" :alt="detailData.pictureFile" style="max-height: 180px" />
                  </el-popover>
                </el-card>
              </el-form-item>
            </el-col>
          </el-row>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
            <!-- <el-button type="primary" @click="updataFileAudit">确定</el-button> -->
            <el-button @click="detaildialogVisible = false">确 定</el-button>
          </div>
      </el-dialog>
      <el-dialog
        :close-on-click-modal='false'
          width="30%"
           title="违章隐患录入"
          :visible.sync="noinnerVisible"
          >
          <el-form>
            <el-form-item  style="margin-bottom:30px;">
               <el-radio v-model="reason" label="不录入">不录入</el-radio> 
               <el-radio v-model="reason" label="违章">录入违章</el-radio>            
               <el-radio v-model="reason" label="隐患">录入隐患</el-radio>
            </el-form-item>
             <el-form-item>
            <el-button type="primary" @click="checkNopass">确定</el-button>
            <el-button @click="cancelInput">取 消</el-button>
           </el-form-item>
          </el-form>
         
        </el-dialog>
    </div>
  </div>
</template>

<script>
import {addProblemDescription,querryQhseElement,updateCheckstatus,addFileaduitrecord,getStatus} from "../../../services/qhse_Filecheck";
export default {
  data() {
    return {
      search: '',
      checkType: '树形审核',
      filterQuery: {
        year: "",
        companyCode: null,
        status:''
      },
      querryTree: {
        companyCode: '',
        year: ''
      },
      updateCheckForm: {
        qhseCompanyYearManagerSysElementTableID: '',
        code: '',
        fileCheckStatus:'已审核'
      },
      addformVisible: false,
      fileRecord: {
        fileAuditId: '',
        code: '',
        codeScore: '',
        pass: '',
        additor: '',
        auditTime: ''
      },
      statusForm: {
        fileAuditId: '',
        code: ''
      },
      // 问题描述
      addQuestionForm: {
        qHSE_FileAudit_ID: '',
        qHSE_FileAuditRecord_ID: '',
        code: '',
        problemDescription: ''
      },
      nowcode: null,
      // 控制弹出页面
      detaildialogVisible: false,
      noinnerVisible: false,
      innerVisible: false,
      status:'',
      disabled1:false,
      dialogFormVisible: false,
      loading: true,
      dialogVisible: false,
      // 控制表格数据
      detailData: {},
      treeData: [],
      initData:[],
      reason:'违章',
      editdata: '',
      nodialogVisible: false,
      nopass: {},
      fileList: [],
      treeList: [],
      // 问题列表
      problemForm: {},
      problem: [],
      elsePro: false,
      proTextarea: ''
    };
  },
  methods: {
    getlist() {
      console.log(this.treeData)
      
    },
    // 筛选树形图叶子结点信息
    async deepTree (treedata) {
            let _this = this
            
            treedata.forEach(item => {
                if (item.childNode.length === 0) {
                    _this.fileList.push(item)
                    return
                } else {
                    _this.deepTree(item.childNode)
                }
            })
            return _this.fileList
      },
    loadFilterParams() {
      let _this = this
      _this.$route.params.data && localStorage.setItem('data',JSON.stringify(_this.$route.params.data));
      const initData = JSON.parse(localStorage.getItem('data'));
      console.log(initData)
      _this.filterQuery.year = initData.year
      _this.filterQuery.companyCode = initData.companyCode
      _this.filterQuery.companyName = initData.companyName
      _this.querryTree.year = initData.year
      // 隐患违章表单
      _this.nopass.fileAuditId = initData.fileAuditId
      _this.nopass.companyCode = initData.companyCode
      // 查询单位年度审核表表表单
      _this.querryTree.companyCode = initData.companyCode
      // 新增审核记录表单
      _this.addQuestionForm.qHSE_FileAudit_ID = initData.fileAuditId
      _this.fileRecord.fileAuditId = initData.fileAuditId
      _this.fileRecord.additor = initData.additor
      _this.fileRecord.auditTime = initData.auditTime
      // 获取审核状态表单
      _this.statusForm.fileAuditId = initData.fileAuditId
      console.log(initData)
    },
    handleCellClick(row, cell, column) {
      if (row.code.length < 10) {
        let els = column.getElementsByClassName("el-icon-arrow-right");
        if (els.length != 0) {
          els[0].click();
        }
      }
    },
    cancelInput() {
      this.$confirm('确认不录入隐患违章吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(()=>{
        this.noinnerVisible = false
       })
       
    },
    // 获取已经审核完成的记录的详细信息
    detaileFile(data) {
      let _this = this
      // 获取问题清单
      
      _this.detailData.status = data.status 
      _this.detailData.auditMode = data.auditMode
      _this.detailData.initialScore = data.initialScore
      _this.detailData.formula = data.formula
      _this.detailData.name = data.name
      _this.detailData.problemDescription = data.problemDescription
      // 获取信息表单
      _this.statusForm.code = data.code
      
      getStatus(_this.statusForm).then(res => {
        if(res.data.length > 0){
        _this.detailData.codeScore = res.data[0].codeScore
        _this.detailData.pass = res.data[0].pass
        _this.detaildialogVisible = true}
      }).catch(err => {
        _this.$message.error(err)
      })
      //  获取分数与状态填充
      
    },
    goUpdateFile(data){
      let _this = this
      _this.editdata = data
      // 填充文件审核详情页面
      _this.detailData.status = data.status 
      _this.detailData.auditMode = data.auditMode
      _this.detailData.initialScore = data.initialScore
      _this.detailData.formula = data.formula
      _this.detailData.name = data.name
      _this.detailData.problemDescription = data.problemDescription      
      _this.fileRecord.code = data.code
      _this.updateCheckForm.code = data.code
      _this.nopass.code = data.code
      _this.problem =  _this.filterProblem(data.problemDescription)
      _this.dialogVisible = true
    },
    hasdata(){
      if(this.treeData === [])
        {
          this.$message('请检查要素证据审批是否完成！')
          this.$router.go(-1)
        }
    },
    // 筛选问题列表
    filterProblem(data) {
      let problem
      if(data !== null){
      problem = data.split(/[0-9.]+/)
      problem.pop()
      problem.shift()
      }
      return problem
    },
    handleGetInitialData() {
      let _this = this
      _this.loading = true;
      // 获取单位年度审核表
      querryQhseElement(_this.querryTree).then(res => {
        _this.treeData = res.data;
        _this.treeList = res.data;
        _this.updateCheckForm.qhseCompanyYearManagerSysElementTableID = res.data[0].tableID
        if(res.data.length === 0){
          _this.$message.warning('请检查要素证据审批是否完成！')
          _this.$router.go(-1)
        }
         _this.fileList = []
        return _this.deepTree(_this.treeData)
      })  
      .then(() => {
        _this.loading = false
        })
      .catch(err => {
          _this.$message.error(err.message);
        });   
    },
    updateCompanyStatus(){
        this.dialogFormVisible = true
    },
    addQuestion () { 
       let _this = this
       _this.addQuestionForm.code = _this.fileRecord.code
       _this.addQuestionForm.problemDescription = _this.proTextarea
       console.log(_this.addQuestionForm)
       addProblemDescription(_this.addQuestionForm).then(res => {
         console.log(res)
       }).catch(err => {
        _this.$message.error(err)
      })
    },
    // 删除文件审核记录
    updataFileAudit() {
      // 上传文件审核记录
      let _this = this
      console.log(_this.nopass)
      if((_this.fileRecord.codeScore === '' || _this.fileRecord.pass === ''  ) ) {
        _this.$message.error('请填写审核内容')
        return
        } else if (_this.proTextarea === ''   && _this.fileRecord.pass === '不通过') {
          _this.$message.error('请填写具体问题内容')
          return
        }
      _this.status = _this.fileRecord.pass
      updateCheckstatus(_this.updateCheckForm).then(() => {
        return addFileaduitrecord(_this.fileRecord)
      }).then(() => {
        // 这里应该返回文件审核记录的recordID
        if(_this.status === '不通过') {
         _this.addQuestion()
        }  
        _this.$message.success('添加成功！')
        _this.dialogVisible = false
        _this.fileRecord.pass = ''
        _this.fileRecord.codeScore = ''
        _this.problemList = []
        _this.proTextarea = ''
        _this.elsePro = false
        _this.handleGetInitialData()
      })
      .catch(err => {
        _this.$message.error(err)
      })

    },
    checkNopass () {
      this.noScore()
    },
    noScore() {
      // 不通过时开始录入隐患违章
      let rowdata = this.editdata
      let _this = this
      // 新增不成功
      
      if (_this.reason === '不录入') _this.noinnerVisible = false
      else if (_this.reason === '隐患'){
           _this.$router.push({
            path: '/hidden_danger/input',
            params: {
            data: rowdata
            }
          })
      } else {
            _this.$router.push({
            path: '/hidden_danger/illegal_entry',
            params: {
            data: rowdata
            }
          })
      }
      _this.dialogVisible = false
    }
  },
  mounted() {
    this.loadFilterParams();
    this.handleGetInitialData();
  }
};
</script>

<style lang="scss">

</style>