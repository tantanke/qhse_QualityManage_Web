<template>
  <div>
      <div class="page-title" style="width:100%">QHSE隐患排查</div>
      <el-row>
      <el-form :model='checkForm' style="width:90%" :disabled='formControl'>
          <el-col :span='5'>
            <el-form-item label='检查类别：'>
            <el-select v-model="value" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
            
          </el-form-item>
          </el-col>
          <el-col :span='5'> 
          <el-form-item>
            <el-select v-model="value">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span='6'> 
          <el-form-item label='检查单位:' labelWidth="80px">
          <el-cascader
                v-model="checkForm.companyCode"
                :options="companyList"
                :props="{ expandTrigger: 'hover' ,value: 'nodeCode'}"
                :show-all-levels="false"
                @change="handleChange"
                ref="cascaderAddr"
                >
                
                </el-cascader>
          </el-form-item>
          </el-col>
          <el-col :span='6'> 
          <el-form-item label='检查时间:'>
             <el-date-picker
                v-model="checkForm.checkDate"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
             </el-date-picker>
          </el-form-item>          
          </el-col>       
      </el-form>
      </el-row>
      <el-row> 
        <el-button type="primary" @click="addChecklist">生成检查单</el-button>
        <el-button type="danger" @click="cacelCheck">取消并返回</el-button> 
      </el-row>
      <el-row style="margin-top:15px; border-top: 2px dashed #dddddd;text-align:center" v-if="formControl">
          <el-table></el-table>
      </el-row>
        
  </div>
</template>

<script>
import {GetqhseCompanytree} from '../../../services/hidden_danger_investigation/QHSETroubleCheckTable'
export default {
    data() {
        return {
            value2: '',
            companyList: [],
            formControl: false,
            checkForm: {
                companyName: '',
                companyCode: ''
            },
            options: [{
                value: '选项1',
                label: '黄金糕'
                }],
                value: ''
                }
            },
    methods: {
        addChecklist () {
           console.log(this.$refs['cascaderAddr'].inputValue)
           this.formControl = true
        },
        cacelCheck () {
            this.formControl = false
        },
        getCompanyList () {
            GetqhseCompanytree().then(res => {
                this.companyList = res.data
                console.log(res)
            })
        },
        handleChange(value) {
        console.log(value);
        }
    },
    mounted() {
        this.getCompanyList()
    },

}
</script>

<style>

</style>