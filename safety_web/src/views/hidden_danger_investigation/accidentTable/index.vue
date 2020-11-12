<template>
  <div class="problemList">

          <div class="page-title" style="width:100%">事故事件清单</div>
      <el-radio v-model="listcate" label="事件清单">事件清单</el-radio>
      <el-radio  v-model="listcate" label="事故清单">事故清单</el-radio>
      <el-row v-show="listcate === '事件清单'" style="margin-top:20px"> 
          <el-row>
          <el-form :inline="true">
                  <el-form-item label='时间范围：' >
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
                <el-button type="primary" :disabled='dangerBtn' icon="el-icon-search" @click="searchEvent">查询</el-button>   
                </el-form-item>      
          </el-form>
          </el-row>
          <el-row style="height:350px">
          <el-table
          v-loading='dangerLoading'
          :data='dangerrecord'
          stripe
          style="width: 100%"
          max-height="560">
          <el-table-column prop='occurrentTime' label='发生时间' show-overflow-tooltip align="center" ></el-table-column>
          <el-table-column prop='address' label='地点' show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop='emergencyHandler' label='应急处置' show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop='briefDescription' label='简要经过' show-overflow-tooltip align="center"></el-table-column>    
          </el-table>
          </el-row>
          </el-row>
          <el-row v-show="listcate === '事故清单'" style="margin-top:20px"> 
          <el-row>
          <el-form :inline="true">
                  <el-form-item label='时间范围：'>
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
                <el-button type="primary" :disabled='regulationBtn' icon="el-icon-search" @click="searchAccident">查询</el-button>   
                </el-form-item>      
          </el-form>
          </el-row>
          <el-row style="height:350px">
          <el-table
          v-loading='regulationrecordLoading'
          :data='regulationrecord'
          stripe
          style="width: 100%"
          max-height="560">
          <el-table-column prop='occurrentTime' label='发生时间' show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop='address' label='地点' show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop='emergencyHandler' label='应急处置' show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop='briefDescription' label='简要经过' show-overflow-tooltip align="center"></el-table-column>  
          </el-table>
          </el-row>
          </el-row>
      
  </div>
</template>

<script> 
import {query_event,
        query_accident,
} from '../../../services/hidden_danger_investigation/accidentTable'
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
           listcate: '事件清单',
           date30:[],
           // 控制按钮 防止一直点击
           regulationBtn:false,
           proBtn:false,
           dangerBtn:false,
           // 控制频率
           dialogVisible2: false,
           dialogImageUrl:''
       }
   },
   methods: {
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
       searchEvent () {
         // 根据参数的不同选择不同的拼接方式
            let baseurl 
            let form = {}
            let start,end         
            let _this = this
            _this.dangerLoading = true        
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
                form.companyCode = _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
            }
            _this.dangerBtn = true
           baseurl  = _this.getUrl('/api/query_event',form)
           query_accident(baseurl,form).then(res => {
               _this.dangerrecord = res.data.list
               if(res.data.list.length === 0) {
                   this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });

               }
               console.log(res.data.list)
                  _this.dangerLoading = false
                  _this.dangerBtn = false
           }).catch(err => {
              this.$message.error(err)
              _this.dangerLoading = false
              _this.dangerBtn = false
          })
       },
       searchAccident () {
        let baseurl 
            let form = {}
            let start,end         
            let _this = this
            _this.regulationrecordLoading = true
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
                form.companyCode = _this.checkForm.companyId[_this.checkForm.companyId.length - 1]
            }
            _this.regulationBtn = true
           baseurl  = _this.getUrl('/api/query_accident',form)
           query_event(baseurl,form).then(res => {
               if(res.data.list.length === 0) {
                   this.$notify({
                    title: '温馨提示',
                    message: '该条件查询下无数据！请切换条件查询！',
                    type: 'warning',
                    duration:1200
                    });

               }
               
               _this.regulationrecord = res.data.list
                  _this.regulationrecordLoading = false
                   _this.regulationBtn = false
           }).catch(err => {
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
       /* this.searchEvent() */

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