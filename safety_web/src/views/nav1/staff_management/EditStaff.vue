<template>
  <div>
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">员工管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>员工编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="form-content">
        <br/>
          <el-form  :rules="rules"  ref="filterQuery" label-width="150px" :model="filterQuery" >     
               <el-row>
                 <el-col :span="12">
                   <!-- <el-form-item label="员工姓名:" prop="name">
                     <el-select v-model="filterQuery.name" placeholder="员工" clearable style="width:100%">
                       <el-option v-for="item in names" :key="item.id" :label="item.name" :value="item.name"></el-option>
                     </el-select>
                   </el-form-item> -->
                   <el-form-item label="员工姓名："  prop="name">
                     <el-input v-model="filterQuery.name" placeholder="员工" style="width:100%"></el-input>
                   </el-form-item>
                 </el-col>
                 <el-col :span="12">
                   <el-form-item label="性别:">
                     <el-select v-model="filterQuery.sex" placeholder="性别" style="width: 100%;">
                       <el-option
                       v-for="item in sexes"
                       :key="item.id"
                       :label="item.name"
                       :value="item.name">
                       </el-option>
                     </el-select>
                     <!-- <el-input v-model="filterQuery.sex" placeholder="性别"></el-input> -->
                   </el-form-item>
                 </el-col>
               </el-row>
               <el-row>
                 <el-col :span="12">
                   <el-form-item label="底层单位:" prop="companyCode">
                     <treeselect
                     :multiple="false"
                     :options="options"
                     placeholder="请选择单位名称"
                     v-model="filterQuery.companyCode"
                     style="width:100%"
                     /> 
                   </el-form-item>
                 </el-col>
                 <el-col :span="12">
                   <el-form-item label="出生日期:">
                    <el-date-picker
                    v-model="filterQuery.birthday"
                    type="date"
                    style="width:100%"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                   </el-date-picker>             
                   </el-form-item>
                 </el-col>
               </el-row>
               <el-row>
                 <el-col :span="12">
                   <el-form-item label="员工编号：" prop="employeeCode">
                     <el-input v-model="filterQuery.employeeCode" placeholder="输入员工编号"></el-input>
                   </el-form-item>
                 </el-col>
                 <el-col :span="12">
                   <el-form-item label="参加工作时间:">
                     <el-date-picker
                     v-model="filterQuery.jobTime"
                     type="date"
                     style="width:100%"
                     format="yyyy-MM-dd"
                     value-format="yyyy-MM-dd"
                     placeholder="选择日期">
                     </el-date-picker> 
                   </el-form-item>
                 </el-col>
               </el-row>
               <el-row>
                 <el-col :span="12">
                   <el-form-item label="所在科室：" prop="empGroup">
                     <el-autocomplete 
                      v-model="inputEmpGroup"
                      clearable
                      :fetch-suggestions="querySearch2"
                      placeholder="所在科室"
                      style="width:100%"
                      :trigger-on-focus="true">
                      </el-autocomplete>
                  </el-form-item>
                 </el-col>
                 <el-col :span="12">
                   <el-form-item label="文化程度:">
                     <el-select  v-model="filterQuery.education" placeholder="文化程度" clearable style="width:100%">
                       <el-option 
                       v-for="item in education1" 
                       :key="item.id" 
                       :label="item.name" 
                       :value="item.name">
                       </el-option>
                     </el-select>
                   </el-form-item>
                 </el-col>
               </el-row>
               <el-row>
                 <el-col :span="12">
                   <el-form-item label="员工类别："  prop="category">
                     <el-select v-model="filterQuery.category" placeholder="请选择员工类别" style="width:100%">
                      <el-option
                        v-for="item in categorys"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                   </el-form-item>
                 </el-col>
                 <el-col :span="12">
                   <el-form-item label="邮箱:" prop="email">
                     <el-input v-model="filterQuery.email" placeholder="邮箱"></el-input>
                   </el-form-item>
                 </el-col>
               </el-row>
               <el-row>
                 <el-col :span="12">
                   <el-form-item>
                   </el-form-item>
                 </el-col>  
                 <el-col :span="12">
                   <el-form-item label="电话:" prop="tel">
                      <el-input v-model="filterQuery.tel" placeholder="电话"></el-input>
                   </el-form-item>
                 </el-col>      
               </el-row>
               <el-form-item>
              <el-button type="primary" @click="handleSubmit('filterQuery')">确定</el-button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a @click="$router.go(-1)">
              <el-button type="info" native-type="button">取消</el-button>
            </a>
           </el-form-item>  
          </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetStaffDetail,UpdateStaff} from '../../../services/staffmanagement'
import {GetDictionary} from '../../../services/dictionary'
import {GetStaffList} from '../../../services/staffmanagement'
// import {GetEmployees} from '../../../services/employee'
import {GetCompany} from  '../../../services/problemRankAnalysis'
// import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data() {
    return{
      filterQuery:{
        name:'',
        sex:'',
        companyCode:null,
        topFourCompanyCode:null,
        birthday:'',
        jobTime:'',
        empGroup:'',
        education:'',
        position:'',
        email:'',
        station:'',
        tel:''
      },
        inputEmpGroup:'',
        names:[],
        empGroups:[],
        positions:[],
        options:[],
        sexes:[],
        education1:[],
        stations:[],
        ID:"",
        categorys:[{value: 'ERP',label: 'ERP'},{value: '非ERP',label: '非ERP'}],
        rules:{
        name :[{required: true, message: '请填写员工姓名', trigger: 'blur' }],
        companyCode :[{required: true, message: '请选择单位名称', trigger:'change' }],
        // employeeCode :[{required: true, message: '请填写员工编号', trigger: 'blur' }],
        // empGroup :[{required: true, message: '请选择员工组', trigger: ['blur', 'change'] }],
        // position :[{required: true, message: '请选择职位', trigger: ['blur', 'change']}],
        // station :[{required: true, message: '请选择岗位', trigger: ['blur', 'change'] }],
        category :[{required: true, message: '请选择员工类别', trigger: ['blur', 'change'] }],
        email: [{required: false,trigger: 'blur' },{
          validator:function(rule,value,callback){
            if(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value) == false && ' ' != value && '' != value){
                console.log(JSON.stringify(value))
                callback(new Error("请输入正确的邮箱格式"));
            }else{
                callback();
            }
        }
         }],
        tel: [{ required: false, trigger: 'blur' },{
          validator:function(rule,value,callback){
            if(/^1[34578]\d{9}$/.test(value) == false && ' ' != value && '' != value){
                callback(new Error("请输入正确的手机号"));
            }else{
                callback();
            }
        }
        }],

      }
    } 
  },
  mounted(){
   this.getStaffDetails()
   this.getempGroups()
   this.getpositions()
  //  this.handelgetEmployees()
   this.handleGetCompany()
   this.getsex()
   this.geteducation()
   this.getstation()

   

  },
  methods: {
    //更新
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.filterQuery.empGroup = this.inputEmpGroup
            UpdateStaff(this.ID,this.filterQuery).then(() => {
              this.$message.success('操作成功')
              this.$router.go(-1) //返回上一url
              }, (err) => {
                this.$message.error(err.message)
                })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //获取数据
    getStaffDetails () {
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      const id = JSON.parse(localStorage.getItem('data'));
      GetStaffDetail(id).then((res) => {
         this.ID = id
         this.filterQuery = res.data
         this.inputEmpGroup = res.data.empGroup
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取单位
      handleGetCompany(){
      GetCompany().then((res) => {
        this.options = res.data 
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    getempGroups(){
      GetStaffList({type:"all"}).then((res) => {  
        for(let i=0;i<res.data.length;i++){
          if(this.empGroups.indexOf(res.data[i]) === -1){
            this.empGroups.push({"value": res.data[i].empGroup}) 
          }
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    querySearch2(queryString, cb) {
      let results = queryString ? this.empGroups.filter(this.createStateFilter2(queryString)) : this.empGroups;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter2(queryString) {
      return (inputEmpGroup) => {
        return (inputEmpGroup.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1); 
      };
    },
    //获取职位表字典
    getpositions () {
      GetDictionary({name:'职位'}).then((res) => {
        this.positions = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取性别
    getsex(){
      GetDictionary({name:'性别'}).then((res) => {
        this.sexes = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取文化程度
    geteducation(){
      GetDictionary({name:'文化程度'}).then((res) => {
        this.education1 = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取岗位
    getstation(){
      GetDictionary({name:'岗位'}).then((res) => {
        this.stations = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }


  }
}

 
</script>
<style lang="scss" scoped>
.form-content {
  max-width: 800px;
}


</style>
