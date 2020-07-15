<template>
    <div>
        <div >
        <el-row>
            <el-col :span='4'>
            <el-breadcrumb separator="/" style="padding-top:10px">
            <el-breadcrumb-item><a @click="$router.go(-1)">QHSE文件审核</a></el-breadcrumb-item>
            <el-breadcrumb-item>隐患基本信息录入</el-breadcrumb-item>    
        </el-breadcrumb>
            </el-col>
            <el-col :span='8'>
                <el-button type="danger" @click="$router.go(-1)">返回前一页</el-button>
                </el-col>
        </el-row>      
    </div>
        <div class="page-title">隐患基本信息</div>
        
        <div class="page-content">
            <el-row>
                <el-col :span="8">
                    <el-form ref="form" :model="form" label-width="150px">
                        <el-form-item label="检查人员">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="施工队伍">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="位置区域">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="隐患类别">
                            <el-select v-model="form.region" >
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="原因分析">
                            <el-select v-model="form.region" >
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="限期整改时间">
                            <el-date-picker
                                    v-model="value1"
                                    type="datetime"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="隐患级别">
                            <el-select v-model="form.region" >
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="隐患描述">
                            <el-input type="textarea" v-model="form.desc" :rows="6"></el-input>
                        </el-form-item>
                        <el-form-item label="整改负责人">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item></el-form-item>
                        <el-form-item></el-form-item>
                        <el-form-item label="上传附件">
                            <el-upload
                                    class="upload-demo"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :before-remove="beforeRemove"
                                    multiple
                                    :limit="1"
                                    :on-exceed="handleExceed"
                                    :file-list="fileList">
                                <el-button size="small" type="primary">浏览文件</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item></el-form-item>
                        <el-form-item></el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width:100px" @click="handleSubmit">确认</el-button>
                            <el-button type="danger" style="width:100px" @click="$router.go(-1)">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="8" :offset="4">
                    <el-form ref="form" :model="form" label-width="150px">
                        <el-form-item label="作业项目">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="检查时间">
                            <el-date-picker
                                    v-model="value1"
                                    type="datetime"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="可能后果">
                            <el-select v-model="form.region" >
                                <el-option label="轻微" value="shanghai"></el-option>
                                <el-option label="一般" value="beijing"></el-option>
                                <el-option label="严重" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对应体系要素">
                            <el-select v-model="form.region" >
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="归属职能部门">
                            <el-select v-model="form.region" >
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否立即验收" style="margin-top: 300px">
                            <el-switch v-model="form.delivery"></el-switch>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                }
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            }
        }
    }
</script>

<style scoped>

</style>
