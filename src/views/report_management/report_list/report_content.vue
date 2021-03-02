<template>
  <div>
    <div class="page-title">
     <el-breadcrumb separator="/">
      <el-breadcrumb-item><a @click="$router.go(-1)">报告清单</a></el-breadcrumb-item>
        <el-breadcrumb-item>报告详情</el-breadcrumb-item>        
      </el-breadcrumb>  
    </div>
    <div class="page-content">
      <div class="form-content">
        <br />
        <el-form label-width="150px"  :model="formData"  ref="formData" >
        <el-row>          
          <el-col :span="12" align="left">
            <el-form-item label="基层单位：" >
              {{formData.companyName}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="报告编号：" >
              {{formData.reportCode}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="检验负责人：" >
              {{formData.reportCheckPersonName}}
            </el-form-item>
          </el-col>  
          <!-- <el-col :span="12" align="left">
            <el-form-item label="检验时间：" >
              {{formData.reportCheckDate}}
            </el-form-item>
          </el-col>      -->
          <el-col :span="12" align="left">
            <el-form-item label="计划时间：" >
              {{formData.reportPlanDate}}
            </el-form-item>
          </el-col> 
        </el-row>
        <el-row> 
        <el-col :span="12" align="left">
            <el-form-item label="报告类别：" >
              {{formData.reportType}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 样品信息部分 -->
      <div v-for="(item,idx) in formData.sampleList" :key="idx">
        <el-row>
          <p>样品{{idx+1}}</p>
        </el-row>
        
        <hr style="height:1px;border:none;border-top:1px solid #555555;" />
        <el-row>          
          <el-col :span="12" align="left">
            <el-form-item label="样品名称：" >
              {{item.sampleName}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="样品编号：" >
              {{item.sampleNO}}
            </el-form-item>
          </el-col>
          
        </el-row>      
        <el-row> 
        <el-col :span="12" align="left">
            <el-form-item label="样品型号：" >
              {{item.sampleModel}}
            </el-form-item>
          </el-col>         
          <el-col :span="12" align="left">
            <el-form-item label="产品/出厂编号：" >
              {{item.sampleCode}}
            </el-form-item>
          </el-col>
          
        </el-row> 
        <el-row>    
        <el-col :span="12" align="left">
            <el-form-item label="委托单位：" >
              {{item.entrustCompany}}
            </el-form-item>
          </el-col>      
          <el-col :span="12" align="left">
            <el-form-item label="生产/销售单位：" >
              {{item.productCompany}}
            </el-form-item>
          </el-col>
          
        </el-row> 
        <el-row>       
          <el-col :span="12" align="left">
            <el-form-item label="使用单位：" >
              {{item.customerCompany}}
            </el-form-item>
          </el-col>   
          <el-col :span="12">
            <el-form-item label="到样日期：" >
              {{item.arriveDate}}
            </el-form-item>
          </el-col>
          
        </el-row> 
        <el-row>   
          <el-col :span="12">
            <el-form-item label="检测日期：" >
              {{item.checkDate}}
            </el-form-item>
          </el-col>       
          <el-col :span="12">
            <el-form-item label="检测地点：" >
              {{item.checkAddress}}
            </el-form-item>
          </el-col>
          
        </el-row> 
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验检测项目：" >
              {{item.checkProject}}
            </el-form-item>
          </el-col>          
          <el-col :span="12">
            <el-form-item label="检验检测依据：" >
              {{item.checkGist}}
            </el-form-item>
          </el-col>
          
        </el-row> 
        <el-row> 
        <el-col :span="12">
            <el-form-item label="检验检测结果：" >
              {{item.checkResult}}
            </el-form-item>
          </el-col>         
          <el-col :span="12">
            <el-form-item label="检验检测人员：" >
              {{item.sampleCheckPersonName}}
            </el-form-item>
          </el-col>
        </el-row>        
        <hr style="height:1px;border:none;border-top:1px solid #555555;" />
      </div>
      
        <el-row>          
          <el-col :span="12" align="left">
            <el-form-item label="检验检测：" >
              {{formData.seal1}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="资质认定（个）：" >
              {{formData.seal2}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="互认标识（检测）：" >
              {{formData.seal3}}
            </el-form-item>
          </el-col>         
          <el-col :span="12" align="left">
            <el-form-item label="互认标识（校准）：" >
              {{formData.seal4}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="认可标识（检测）：" >
              {{formData.seal5}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="认可标识（机构）：" >
              {{formData.seal6}}
            </el-form-item>
          </el-col>         
        </el-row>
        <!-- 88888888888888 -->
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="报告份数：" >
              {{formData.reportCount}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="其它标识请注明：" >
              {{formData.note}}
            </el-form-item>
          </el-col>         
        </el-row>
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="印章使用人：" >
              {{formData.sealPersonName}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="印章使用时间：" >
              {{formData.sealDate}}
            </el-form-item>
          </el-col>         
        </el-row>
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="鉴印人：" >
              {{formData.authName}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="审核人：" >
              {{formData.auditorName}}
            </el-form-item>
          </el-col>         
        </el-row>
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="审核时间：" >
              {{formData.approverDate}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="批准人：" >
              {{formData.approverName}}
            </el-form-item>
          </el-col>        
        </el-row>
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="批准时间：" >
              {{formData.approverDate}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="归档日期：" >
              {{formData.fileDate}}
            </el-form-item>
          </el-col>         
        </el-row>
        <el-row> 
          <el-col :span="12" align="left">
            <el-form-item label="发送人：" >
              {{formData.senderName}}
            </el-form-item>
          </el-col>
          <el-col :span="12" align="left">
            <el-form-item label="发送日期：" >
              {{formData.sendDate}}
            </el-form-item>
          </el-col>         
        </el-row>
        <el-form-item  align="right">
            <el-button type="danger" @click="$router.go(-1)">返回</el-button>
        </el-form-item> 
      
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetReportDetail} from '../../../services/report_list'
export default {
  data() {
    return {
      formData:{companyName:"",
        reportCode:"",
        reportType:"",
        reportPlanDate:"",
        reportCheckPersonName:"",
        auditorName:"",
        approverName:"",
        fileDate:"",
        senderName:"",
        sendDate:"",
        reportCount:0,
        seal1:0,
        seal2:0,
        seal3:0,
        seal4:0,
        seal5:0,
        seal6:0,
        note:"",
        sealPersonName:"",
        authName:"",
        sealDate:"",
        sampleList:[{sampleName:"",
        sampleNO:"",
        sampleModel:"",
        sampleCode:"",
        entrustCompany:"",
        productCompany:"",
        customerCompany:"",
        arriveDate:"",
        checkDate:"",
        checkAddress:"",
        checkProject:"",
        checkGist:"",
        checkResult:"",
        sampleCheckPersonName:""},
        {sampleName:"",
        sampleNO:"",
        sampleModel:"",
        sampleCode:"",
        entrustCompany:"",
        productCompany:"",
        customerCompany:"",
        arriveDate:"",
        checkDate:"",
        checkAddress:"",
        checkProject:"",
        checkGist:"",
        checkResult:"",
        sampleCheckPersonName:""}]}
        


    }
  },
  mounted () {
    this.getReport()//获取报告详情   

  },
  methods: {
    getReport() {
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
			const id = JSON.parse(localStorage.getItem('data'));
      // const id = this.$route.params.id
      GetReportDetail(id).then((res) => {
        this.formData = res.data
        this.formData.reportCount = !res.data.reportCount ? 0 : res.data.reportCount;
        this.formData.seal1 = !res.data.seal1 ? 0 : res.data.seal1;
        this.formData.seal2 = !res.data.seal2 ? 0 : res.data.seal2;
        this.formData.seal3 = !res.data.seal3 ? 0 : res.data.seal3;
        this.formData.seal4 = !res.data.seal4 ? 0 : res.data.seal4;
        this.formData.seal5 = !res.data.seal5 ? 0 : res.data.seal5;
        this.formData.seal6 = !res.data.seal6 ? 0 : res.data.seal6;
        this.formData.note = !res.data.note ? '无' : res.data.note;
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },

     
  },






   
// }
}
</script>

<style lang="scss" scoped>
.form-content {
  max-width: 1200px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.video-avatar {
  width: 400px;
  height: 200px;
}
</style>
