<template>
  <div>
    <div class="page-title">修改个人资料</div>
    <div class="page-content">
      <div class="form-content">
        <el-form label-width="150px" :model="information" :rules="rules">     
          <el-row style="padding-bottom:5px">
            <font style="font-size:15px;font-weight:bold">个人资料</font>
          </el-row>
          <el-row style="padding-top:5px; border-top: 2px solid #dddddd">
            <el-col :span="12">
              <el-form-item label="**员工姓名：">
                <el-input style="width:100%" v-model="information.name" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：">
                <el-select v-model="information.sex" placeholder="性别" style="width: 100%;">
                  <el-option
                  v-for="item in sexes"
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
              <el-form-item label="**底层单位：">
                <el-input style="width:100%" v-model="information.companyName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期：">
              <el-date-picker
              v-model="information.birthday"
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
                <el-input v-model="information.employeeCode" placeholder="员工编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参加工作时间：">
                <el-date-picker
                v-model="information.jobTime"
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
              <el-form-item label="**所在科室：">
                <el-input style="width:100%" v-model="information.empGroup" readonly></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文化程度：">
                <el-select  v-model="information.education" placeholder="文化程度" clearable style="width:100%">
                  <el-option 
                  v-for="item in educations" 
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
              <el-form-item  label="**员工类别：">
                <el-input style="width:100%" v-model="information.category" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="information.email" placeholder="邮箱"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注：">
                标 ** 字段不可修改，其余可按需修改！
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="电话：" prop="tel">
                <el-input v-model="information.tel" placeholder="电话"></el-input>
              </el-form-item>
            </el-col>      
          </el-row>
          <el-row class="buttons">
            <el-form-item>
              <el-button type="primary" style="width:100px" @click="handleSubmit" icon="el-icon-check">确认</el-button>   
              <el-button type="danger" style="width:100px" @click="$router.go(-1)" icon="el-icon-refresh-left">取消</el-button>   
            </el-form-item>
          </el-row>
        </el-form>
        <!-- 修改密码表单 -->
        <el-form label-width="150px" :model="password"> 
          <el-row style="padding-bottom:5px">
            <font style="font-size:15px;font-weight:bold">修改密码</font>
          </el-row>
          <el-row style="padding-top:5px; border-top: 2px solid #dddddd">
            <el-col :span="12">
              <el-form-item  label="旧密码：">
                <el-input type="password" style="width:100%" v-model="password.oldPassword" placeholder="请输入旧密码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新密码：">
                <el-input type="password" style="width:100%" v-model="newPassword1" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码：">
                <el-input type="password" style="width:100%" v-model="newPassword2" placeholder="再次确认新密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="buttons">
            <el-form-item>
              <el-button type="primary" style="width:100px" @click="handleSubmitPassword()" icon="el-icon-check">确认</el-button>   
              <el-button type="danger" style="width:100px" @click="$router.go(-1)" icon="el-icon-refresh-left">取消</el-button>   
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {GetStaffDetail,UpdateStaff} from '../../../services/personCenter'
import {GetDictionary} from '../../../services/dictionary'
export default {
  data() {
    return{
      information:{},
      password:{},
      newPassword1:'',
      newPassword2:'',
      sexes:[],
      educations:[],
      rules:{
        email: [{required: false,trigger: 'blur' },{
          validator:function(rule,value,callback){
            if(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value) == false){
                callback(new Error("请输入正确的邮箱格式"));
            }else{
                callback();
            }
        }
         }],
        tel: [{ required: false, trigger: 'blur' },{
          validator:function(rule,value,callback){
            if(/^1[34578]\d{9}$/.test(value) == false){
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
   this.getsex()
   this.geteducation()
  },
  methods: {
    //获取个人数据
    getStaffDetails () {
      GetStaffDetail().then((res) => {
        this.information = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //更新个人资料
    handleSubmit () {
      UpdateStaff(this.information).then(() => {
        this.$message.success('操作成功')
      })
      .catch (err => {
        this.$message.error(err.message)
      })
    },
    //更新个人密码
    handleSubmitPassword() {
      if(this.newPassword1==this.newPassword2){
        this.password.newPassword=this.newPassword1
        UpdateStaff(this.password).then(() => {
        this.$message.success('密码更新成功')
        this.password=[];
        this.newPassword1='';
        this.newPassword2='';
      }, (err) => {
        this.$message.error('密码更新失败，请检查原有密码是否正确')
      })
      }
      else{
        this.$message.error('两次密码输入不一致')
      }
      
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
        this.educations = res.data
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
.buttons{
  padding-top:20px;
  display: flex; 
  justify-content: flex-end;
  height: 100px;
  align-items: center; 
  padding-right: 0%;
}

</style>
