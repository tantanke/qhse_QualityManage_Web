<template>
  <div class="problemList">

          <div class="page-title" style="width:100%">质量-问题清单</div>
      <el-radio v-model="listcate" label="QHSE违章清单">质量-违章列表</el-radio>
      <el-radio  v-model="listcate" label="QHSE隐患清单" >质量-隐患列表</el-radio>
      <el-radio  v-model="listcate" label="QHSE问题清单" style="margin-bottom:20px">质量-问题列表</el-radio>
      <el-row v-show="listcate === 'QHSE违章清单'">
          <el-row>
          <el-form :inline="true">
                  <el-form-item label='组件机构：' >
                      <el-cascader
                        v-model="checkForm.companyId"
                        :options="companyList"
                        :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                        @change="handleChange"
                        ref="cascaderAddr"  
                        :show-all-levels="false" 
                        filterable          
                        >             
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label='时间范围：' labelWidth='120px'>
                      <el-date-picker
                        v-model="date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"  
                        :clearable='false'                     
                        >
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                <el-button type="primary" :disabled='regulationBtn' icon="el-icon-search" @click="searchRegulation">查询</el-button>   
                </el-form-item>   
                <el-form-item>
                <el-button type="info" :disabled='regulationBtn' icon='el-icon-download'  @click="downloadRegulation">下载</el-button>   
                </el-form-item>     
          </el-form>
          </el-row>
          <el-row style="height:370px" >
         <el-table
         v-loading='regulationrecordLoading'
          type="expand"
          stripe
          :data='regulationrecord'
          style="width:100%"
          max-height="590">
           <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="table-expand">
                <el-form-item label="检查人员:">
                    <span>{{ props.row.safeStaff_Name }}</span>
                </el-form-item>
                <el-form-item label="施工队伍:">
                    <span>{{ props.row.companyName }}</span>
                </el-form-item>
                <el-form-item label="检查时间:">
                    <span>{{ props.row.supervisionDate.substring(0, 10) }}</span>
                </el-form-item>
                <el-form-item label="作业项目:">
                    <span>{{ props.row.workItem }}</span>
                </el-form-item>
                <el-form-item label="可能后果:">
                    <span>{{ props.row.consequenceID }}</span>
                </el-form-item>
                <el-form-item label="对应体系要素:">
                    <span>{{ props.row.factorHSE }}</span>
                </el-form-item>
                <el-form-item label="对应安全沟通类型:">
                    <span v-if="props.row.factorObserver">{{ props.row.factorObserver }}</span>
                    <span v-else>未录入</span>
                </el-form-item>
                <el-form-item label="原因:">
                    <span>{{ props.row.factorSource }}</span>
                </el-form-item>
                <el-form-item label="归属部门:">
                    <span>{{ props.row.factorDepartment }}</span>
                </el-form-item>
                <el-form-item label="整改负责人:">
                    <span>{{ props.row.punish }}</span>
                </el-form-item>
                <el-form-item label="用工性质:">
                    <span>{{ props.row.employeeCharacter }}</span>
                </el-form-item>
                <el-form-item label="工种年龄:">
                    <span>{{ props.row.workSeniority }}</span>
                </el-form-item>
                <el-form-item label="岗位分类:">
                    <span>{{ props.row.position }}</span>
                </el-form-item>
                <el-form-item label="是否立即验收:">
                    <span>{{ props.row.ok }}</span>
                </el-form-item>
                <el-form-item label="所属专业:">
                    <span>{{ props.row.profession }}</span>
                </el-form-item>
                <el-form-item label="违章性质:">
                    <span>{{ props.row.regulationCharacter }}</span>
                </el-form-item>
                <el-form-item label="违章类别:">
                    <span>{{ props.row.type }}</span>
                </el-form-item>
                <el-form-item label="违章描述:">
                    <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="罚款:">
                    <span>{{ props.row.punish }}</span>
                </el-form-item>
               <el-form-item v-if="props.row.affix1" label="证据图片1:" >
                    <a  :href="'http://39.98.173.131:9000/api' + props.row.affix1" target="_blank">证据图片1</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix2" label="证据图片2:">
                    <a  :href="'http://39.98.173.131:9000/api' + props.row.affix2" target="_blank" >证据图片2</a>
                </el-form-item>
             </el-form>
             </template>
          </el-table-column>
          <el-table-column align='center' prop='safeStaff_Name' label='检查人员'></el-table-column>
          <el-table-column align='center' prop='companyName' label='施工队伍'></el-table-column>
          <el-table-column align='center'  label='检查时间'>
              <template slot-scope="scope">
               <span>{{scope.row.supervisionDate.substring(0, 10)}}</span>
            </template>
              </el-table-column>        
          <el-table-column align='center' prop='regulationName' label='违章人员'></el-table-column>
          <el-table-column align='center' prop='regulationSource' label='隐患来源'></el-table-column>
          <el-table-column align='center' prop='punish' label='罚款'></el-table-column>
        </el-table>
          </el-row>
      </el-row>
      <el-row v-show="listcate === 'QHSE隐患清单'"> 
          <el-row>
          <el-form :inline="true">
                  <el-form-item label='组件机构：' >
                      <el-cascader
                        v-model="checkForm.companyId"
                        :options="companyList"
                        :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                        :show-all-levels="false"
                        @change="handleChange"
                        ref="cascaderAddr"
                         clearable
                        filterable               
                        >             
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label='时间范围：' labelWidth='120px'>
                      <el-date-picker
                        v-model="dateH"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :clearable='false'  
                        >
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                <el-button type="primary" :disabled='dangerBtn' icon="el-icon-search" @click="searchDanger">查询</el-button>   
                </el-form-item>    
                <el-form-item>
                <el-button type="info" :disabled='dangerBtn' icon='el-icon-download'  @click="dowmloadDanger">下载</el-button>   
                </el-form-item>  
          </el-form>
          </el-row>
          <el-row style="height:350px">
          <el-table
          v-loading='dangerLoading'
          :data='dangerrecord'
          stripe
          style="width: 100%"
          max-height="590">
          <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="table-expand">
                <el-form-item label="检查人员:">
                    <span>{{ props.row.safeStaff_Name }}</span>
                </el-form-item>
                <el-form-item label="施工队伍:">
                    <span>{{ props.row.companyName }}</span>
                </el-form-item>
                <el-form-item label="位置区域:">
                    <span>{{ props.row.location }}</span>
                </el-form-item>
                <el-form-item label="作业项目:">
                    <span>{{ props.row.workItem }}</span>
                </el-form-item>
                <el-form-item label="隐患类别:">
                    <span>{{ props.row.type }}</span>
                </el-form-item>
                <el-form-item label="对应体系要素:">
                    <span>{{ props.row.factorHSE }}</span>
                </el-form-item>
                <el-form-item label="原因分析:">
                    <span>{{ props.row.factorSource }}</span>
                </el-form-item>
                <el-form-item label="检查时间:">
                    <span>{{ props.row.recordDate }}</span>
                </el-form-item>
                <el-form-item label="归属部门:">
                    <span>{{ props.row.factorDepartment }}</span>
                </el-form-item>
                <el-form-item label="可能后果:">
                    <span>{{ props.row.consequenceID }}</span>
                </el-form-item>
                <el-form-item label="整改负责人:">
                    <span>{{ props.row.reformPerson }}</span>
                </el-form-item>
                <el-form-item label="所属专业:">
                    <span>{{ props.row.profession }}</span>
                </el-form-item>
                <el-form-item label="限期整改时间:">
                    <span>{{ props.row.limitDate }}</span>
                </el-form-item>
                <el-form-item label="隐患级别:">
                    <span>{{ props.row.rank }}</span>
                </el-form-item>
                <el-form-item label="隐患描述:">
                    <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="隐患状态:">
                <span v-show=" props.row.status === 1" >待整改</span>
                <span v-show=" props.row.status === 3" >待验收</span>
                <span v-show=" props.row.status === 5"  >已验收</span>
                </el-form-item>
                <el-form-item v-if="props.row.affix1" label="证据图片1:" >
                    <a  :href="'http://39.98.173.131:9000/api' + props.row.affix1" target="_blank">证据图片1</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix2" label="证据图片2:">
                    <a  :href="'http://39.98.173.131:9000/api' + props.row.affix2" target="_blank" >证据图片2</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix3" label="整改图片1:" >
                     <a  :href="'http://39.98.173.131:9000/api' + props.row.affix3" target="_blank" >整改图片1</a>
                </el-form-item>
                <el-form-item v-if="props.row.affix4" label="整改图片2:">
                   <a :href="'http://39.98.173.131:9000/api' + props.row.affix4" target="_blank">整改图片2</a>
                </el-form-item>
           </el-form>
           </template>
          </el-table-column>
          <el-table-column align='center' prop='safeStaff_Name' label='检查人员'></el-table-column>
          <el-table-column align='center' prop='companyName' label='施工队伍'></el-table-column>
          <el-table-column align='center' prop='rank' label='隐患级别'></el-table-column>
          <el-table-column align='center' prop='reformPerson' label='整改负责人'></el-table-column>
          <el-table-column align='center' prop='dangerSource' label='隐患来源'></el-table-column>    
          <el-table-column align='center'  prop='supervisionDate' label='检查时间'></el-table-column>
          <el-table-column
            label="隐患状态"
            align='center'
            >
            <template slot-scope="scope">
              <el-button v-show="scope.row.status === 1" style="margin-left:9px" type="primary" icon="el-icon-search" plain size="small">待整改</el-button>
                <el-button v-show="scope.row.status === 3"  type="warning" icon="el-icon-edit" plain size="small" >验收中</el-button>
                <el-button v-show="scope.row.status === 5" type="success" icon="el-icon-check" plain size="small">已验收</el-button>
            </template>
            </el-table-column>     
          </el-table>
          </el-row>
      </el-row>
      <el-dialog :visible.sync="dialogVisible2">
        <img width="100%" :src="dialogImageUrl" alt="暂时没有">
      </el-dialog>
      <el-row v-show="listcate === 'QHSE问题清单'">
          <el-form>
              <el-row>
          <el-form :inline="true">
                  <el-form-item label='组件机构：' >
                      <el-cascader
                        v-model="checkForm.companyId"
                        :options="companyList"
                        :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                        :show-all-levels="false"
                        @change="handleChange"
                        ref="cascaderAddr"    
                         clearable
                        filterable  
                        >             
                      </el-cascader>
                  </el-form-item>
                  <el-form-item label='时间范围：' labelWidth='120px'>
                      <el-date-picker
                        v-model="dateQ"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :clearable='false'  
                        >
                        </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                <el-button type="primary" @click="getProblemDescription" icon='el-icon-search' :disabled='proBtn'>查询</el-button>   
                </el-form-item>   
                 <el-form-item>
                <el-button type="info" :disabled='proBtn' icon='el-icon-download'  @click="downloadPro">下载</el-button>   
                </el-form-item>  
          </el-form>
          </el-row>      
          </el-form>
          <el-row style="height:370px" >
              <el-table
              stripe
            :data='problemrecord'
            v-loading='problemLoading'
            style="width: 100%"
            max-height="590">
             <el-table-column
                    prop="auditTime"
                    label="检查时间">
                </el-table-column>
                    <el-table-column
                    prop="companyName"
                    width='250'
                    label="公司名称">
                </el-table-column>
                <el-table-column
                    prop="itemName"
                    label="检查项">
                </el-table-column>
                <el-table-column
                    prop="auditor"
                    label="检查人">
                </el-table-column>
                  <el-table-column
                    prop="problemDescription"
                    label="问题描述">
                </el-table-column>
                 <el-table-column
                    prop="problemSource"
                    label="问题来源">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="问题状态"
                    align='center'>
                    <template slot-scope="scope">
                        <el-button v-show="scope.row.status === '未整改'" style="margin-left:9px" type="primary" icon="el-icon-search" plain size="small"  >待整改</el-button>
                        <el-button v-show="scope.row.status === '验收中'" type="warning" icon="el-icon-edit"  plain size="small">待验收</el-button>
                        <el-button v-show="scope.row.status === '已整改'" type="success" icon="el-icon-check" plain size="small">已验收</el-button>
                    </template>
                    </el-table-column> 
            </el-table>
          </el-row>
      </el-row>
  </div>
</template>

<script> 
import {queryDangerrecord,
        queryRegulationrecord,
        queryProblemDescription,
} from '../../../services/hidden_danger_investigation/QHSETroubleCheckList'
import ExportJsonExcel from "js-export-excel";
import {GetqhseCompanytree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
export default {
   data() {
       return {
           // 控制加载
           regulationrecordLoading: false,
           problemLoading: false,
           dangerLoading: false,
           date: [],
           dateQ:[],
           dateH:[],
           regulationrecord: [],
           problemrecord: [],
           dangerrecord: [],
           serdata:{},
           companyList: [],
           checkForm: {
                companyId: [],
                startDate: null,
                endDate: null
            },
           listcate: 'QHSE违章清单',
           date30:[],
           // 控制按钮 防止一直点击
           regulationBtn:false,
           proBtn:false,
           dangerBtn:false,
           // 控制频率
           dialogVisible2: false,
           dialogImageUrl:'',
           //map数据 根据不同的数据导出
           regulationMap:'',
           dangerMap:''
       }
   },
   methods: {
       watchImg(data) {
          this.dialogImageUrl = "http://39.98.173.131:9000/api" + data
          this.dialogVisible2 = true
          console.log(this.dialogImageUrl)
       },
       // 根据数据库初始化map数据
       initMap(){
          this.initregulationMap()
          this.initDangerMap()
       },
       initDangerMap(){
           let _this = this
           let m = new Map(
               [
                   ['safeStaff_Name','检查人员'],['companyName','施工队伍'],['safeStaff_ID','检查人员id'],['workItem','作业项目'],['companyId','施工队伍id'],['supervisionDate','检查日期'],['type','隐患类别'],
                   ['description','隐患描述'],['reformPersonID','整改负责人id'],['reformPerson','整改负责人'],['limitDate','限制时间'],['recordDate','记录上传时间'],
                   ['receptionDate','验收时间'],['reformCase','整改情况'],['ok','提交状态'],['consequenceID','可能后果'],['rank','隐患级别'],
                   ['factorSource','原因'],['profession','所属专业'],['factorHSE','对应体系要素'],['factorDepartment','归属职能部门'],['consequence','产生的后果'],['dangerSource','隐患来源'],
                   ['location','位置区域'],['qHSE_CheckCategory','检查类别'],['qHSE_FileAudit_ID','文件审核id'],['qHSE_FileAuditRecord_ID','文件审核记录id'],['code','要素编码'],  
               ]
           )
           //数据库表中的所有字段
           _this.dangerMap = m
       },
       initregulationMap(){
           let _this = this
           let m = new Map(
               [
                   ['safeStaff_ID','检查人员id'],['workItem','作业项目'],['companyId','施工队伍id'],['supervisionDate','检查日期'],['type','违章类别'],
                   ['description','违章描述'],['punish','罚款'],['ok','违章状态'],['consequenceID','后果'],['recordDate','上传记录时间'],
                   ['score','扣分'],['employeeCharacter','用工性质'],['workSeniority','工种工龄'],['position','岗位分类'],['regulationCharacter','违章性质'],
                   ['factorSource','原因'],['profession','所属专业'],['factorHSE','对应体系要素'],['factorDepartment','归属部门'],['factorObserver','安全沟通类型'],
                   ['qHSE_CheckCategory','检查类别'],['qHSE_FileAudit_ID','文件审核id'],['qHSE_FileAuditRecord_ID','文件审核记录id'],['code','要素编码'],['regulationSource','违章来源'],
                   ['regulationID','违章人员ID'],['regulationName','违章人员姓名'],['safeStaff_Name','检查人员'],['companyName','施工队伍'],
               ]
           ) 
           //数据库表中的所有字段
           _this.regulationMap = m
       },
       // 下载模板文件
       downloadRegulation() {
           let _this = this
           if(_this.regulationrecord.length > 0) {
               let option = {}
               let priData = _this.regulationrecord
               let m = _this.regulationMap
               let pData = []
               priData.forEach(item => {
                   let pItem = {}
                   Object.keys(item).forEach(i => {
                       let value  = m.get(i)
                       if(value){
                           if(item[i]){
                              pItem[value] = item[i]
                           }else{
                               pItem[value] = '暂未录入'
                           }
                       }
                   })
                   pData.push(pItem)
               })
               console.log(pData)
               option.fileName = 'QHSE违章清单'
               option.datas = [{
							sheetData: pData,
                            sheetHeader: ['违章类别','检查人员id','检查人员','违章人员ID','违章人员','作业项目','施工队伍id','施工队伍','检查日期',
                            '违章描述','罚款','违章状态','可能后果','上传记录时间','扣分','用工性质','工种工龄',
                            '岗位分类','违章性质','原因','所属专业','对应体系要素','归属部门','安全沟通类型','检查类别'
                            ,'文件审核id','文件审核记录id',
                            '要素编码','违章来源',]
                        }];
                // 导出数据
                var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
           } else {
               _this.$message.warning('无记录可下载！')
           }
       },
       dowmloadDanger() {
            let _this = this
                    if(_this.dangerrecord.length > 0) {
                        let option = {}                 
                        const priData = _this.dangerrecord
                         let m = _this.dangerMap 
                        let pData = []
                        priData.forEach(item => {
                            let pItem = {}
                            Object.keys(item).forEach(i => {
                                let value  = m.get(i)
                                 /* pItem[value] = value */
                                if(value){
                                    if(item[i]){
                                        pItem[value] = item[i]
                                    }else{
                                        pItem[value] = '暂未录入'
                                    }
                                }
                            })
                            pData.push(pItem)
                        })
                        console.log(pData)
                        option.fileName = 'QHSE隐患清单'
                        option.datas = [{
                                        sheetData: pData,
                                        sheetHeader: ['隐患类别','检查人员id','检查人员','作业项目','施工队伍id','施工队伍','检查日期','隐患描述','整改负责人id','整改负责人','限制时间',
                                        '验收时间','整改情况','提交状态','可能后果','记录上传时间','隐患级别','原因','所属专业','对应体系要素',
                                        '归属职能部门','产生的后果','位置区域','检查类别','文件审核id','文件审核记录id','要素编码','隐患来源'
                                        ]
                                    }];
                            // 导出数据
                            var toExcel = new ExportJsonExcel(option);
                            toExcel.saveExcel();
                    } else {
                        _this.$message.warning('无记录可下载！')
                    }
       },
       downloadPro () {

       },
       getRecentTime() {
          let date = new Date().getTime()
          let near = date + 60*60*1000*24*30
          let day = new Date(date).toISOString()
          let nearday = new Date(near).toISOString()
          this.date30.push(day.split('T')[0])
          this.date30.push(nearday.split('T')[0])    
          this.date = [...this.date30]
          this.dateQ = [...this.date30]
          this.dateH = [...this.date30]
       },
       searchDanger () {
         // 根据参数的不同选择不同的拼接方式
            let baseurl 
            let form = {}
            let start,end         
            let _this = this         
            if (_this.date) {
               start = _this.dateH[0]
               end = _this.dateH[1]
               form.startDate = start
               form.endDate = end
            } else{
               form.startDate = _this.date30[0]
               form.endDate = _this.date30[1]
            }
            if (_this.checkForm.companyId.length !== 0) {
                form.companyId = _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
            }
            if(!form.companyId) {
                _this.$message.warning('请选择公司')
                return
            }
            _this.dangerLoading = true       
            _this.dangerBtn = true
           baseurl  = _this.getUrl('/api/query_quality_dangerrecord',form)
           queryDangerrecord(baseurl,form).then(res => {
               _this.dangerrecord = res.data.list
               if(res.data.list.length === 0) {
                   _this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });

               }
               console.log(res.list)
                  _this.dangerLoading = false
                  _this.dangerBtn = false
           }).catch(() => {
              this.$message.error('查询失败')
              _this.dangerLoading = false
              _this.dangerBtn = false
          })
       },
       getMessage() {
         this.searchDanger()
       },
       getProblem() {
         this.getProblemDescription()
       },
       searchRegulation () {
        let baseurl 
            let form = {}
            let start,end         
            let _this = this
           
            if (_this.date) {
               start = _this.date[0]
               end = _this.date[1]
               form.startDate = start
               form.endDate = end
            } else{
               form.startDate = _this.date30[0]
               form.endDate = _this.date30[1]
            }
            if (_this.checkForm.companyId.length !== 0) {
                form.companyId = _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
            }
            if(!form.companyId) {
                _this.$message.warning('请选择公司')
                return
            }
             _this.regulationrecordLoading = true
            _this.regulationBtn = true
           baseurl  = _this.getUrl('/api/query_quality_regulationrecord',form)
           queryRegulationrecord(baseurl,form).then(res => {
               if(res.data.list.length === 0) {
                    this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });

               }
               console.log(res.list)
               _this.regulationrecord = res.data.list
                  _this.regulationrecordLoading = false
                   _this.regulationBtn = false
           }).catch((err) => {
              this.$message.error(err)
              _this.regulationrecordLoading = false
              _this.regulationBtn = false
          })
       },
       getCompanyList () {
            GetqhseCompanytree().then(res => {
                this.companyList = res.data
            }).catch(err => {
              this.$message.error(err)
          })
        },
        handleChange(value) {
        console.log(value);
        },
        getProblemDescription() {
            let baseurl 
            let form = {}
            let start,end         
            let _this = this        
            if (_this.date) {
               start = _this.dateQ[0]
               end = _this.dateQ[1]
               form.startDate = start
               form.endDate = end
            }  else{
               form.startDate = _this.date30[0]
               form.endDate = _this.date30[1]
            }
            if (_this.checkForm.companyId.length !== 0) {
                form.companyCode= _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
            }
             if(!form.companyCode) {
                _this.$message.warning('请选择公司')
                return
            }
             _this.problemLoading = true
            _this.proBtn = true
           baseurl  = _this.getUrl('/api/query_quality_problemDescription',form)
           queryProblemDescription(baseurl,form).then(res => {
               if(res.data.length === 0) {
                   _this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });

               }
               _this.problemrecord = res.data
                _this.problemLoading = false
                _this.proBtn = false
           }).catch(() => {
              this.$message.error('查询失败')
              _this.problemLoading = false
              _this.proBtn = false
          })
        },
        getUrl(baseurl,data) {
            let url = baseurl+'?'
            Object.keys(data).forEach(function (key) {
                 url =  `${url}${key}=${data[key]}&`              
                });
                url = url.substring(0,url.length-1)
            return url
        },
   },
   mounted() {     
       this.getRecentTime()
       this.getCompanyList()
       this.initMap()
   },
}
</script>

<style lang='scss' scoped>

.el-table{
    height: 590px;
    .table-expand {
    font-size: 0;
    
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    color: #99a9bf;
   }
   .imgUrl{
       cursor: pointer;
       color:blue
   }
  }
}

</style>