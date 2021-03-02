<template>
    <div>
        <div class="page-title">事故事件录入</div>
        <div class="page-content">
            <div class="form-content">
                <el-row>
                    <el-col :span="8">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="发生时间">
                                <el-date-picker
                                        v-model="form.date"
                                        type="date"
                                        placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="地点">
                                <el-input v-model="form.address"></el-input>
                            </el-form-item>
                            <el-form-item label="事故/事件">
                                <el-select v-model="form.type">
                                    <el-option label="事故" value="accident"></el-option>
                                    <el-option label="事件" value="event"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="简要经过">
                                <el-input type="textarea" v-model="form.briefDescription"></el-input>
                            </el-form-item>
                            <el-form-item label="应急处置">
                                <el-input type="textarea" v-model="form.emergencyHandler"></el-input>
                            </el-form-item>
                            <el-form-item label="上传文件">
                                <el-upload
                                        drag
                                        v-model="form.fileID"
                                        :limit="1"
                                        :headers="header"
                                        :on-success="handleAvatarSuccess"
                                        :action="accidentOrEventUploadAddress">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submit" icon="el-icon-check">立即创建</el-button>
                                <el-button icon="el-icon-refresh-left">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import {GetCurrentUser} from '@/store/CurrentUser'
    import {addAccident, addEvent} from '@/services/hidden_danger_investigation/accident'

    export default {
        name: "index",
        data() {
            return {
                form: {
                    date: '',
                    address: '',
                    type: 'accident',
                    emergencyHandler: '',
                    briefDescription: '',
                    fileID: ''
                },
                header: {Authorization: GetCurrentUser().token}
            }
        },
        methods: {
            submit() {
                let result = this.type === 'accident' ? addAccident(this.form) : addEvent(this.form);
                result.then((res) => {
                    if (res.code === 1000)
                        this.$message.success('创建成功');
                })
            },
            handleAvatarSuccess(res) {
                if (res.code === 1000)
                    this.form.fileID = res.data;
                else {
                    this.$message.error('上传失败');
                    this.form.fileID = '';
                }
            }
        },
        computed: {
            accidentOrEventUploadAddress: function () {
                return this.type === 'accident' ? '/api/accident_upload' : '/api/event_upload'
            }
        }

    }
</script>

<style scoped>

</style>
