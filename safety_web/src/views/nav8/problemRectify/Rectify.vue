<template>
<div v-if="this.client === 'android'" style="width:750px;">
    <div style="width:100%">
      <div class="page-title" style="width:100%;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><a @click="$router.go(-1)">问题详情</a></el-breadcrumb-item>
          <el-breadcrumb-item>问题整改</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 问题详情 -->
      <div class="page-content" style="font-size:20px;width:100%;border-top: 1px solid #dddddd;">
        <el-form label-width="150px" :model="problem">
          <el-row  style="padding-bottom:5px">
            <font style="font-size:15px;font-weight:bold">问题详情</font>
          </el-row> 
          <el-row style="padding-top:10px; border-top: 2px solid #dddddd">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label=" 受检单位：" style="height:20px">{{problem.companyName}}</el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
              <el-form-item label="受检二级单位：" style="height:20px">{{problem.parentCompanyName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查时间：" style="height:20px">{{problem.checkDate}}</el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
            <el-form-item label="检查人员：" style="height:20px">{{problem.checkPersonName}}</el-form-item>
        </el-row>
        <el-row>
          <div class="grid-content bg-purple">
            <el-form-item label="问题标准描述：">
              <el-input type="textarea" style="width:96%" v-model="problem.description" :autosize="{ minRows: 2}" readonly></el-input>
            </el-form-item>
          </div>
        </el-row>
        <el-row>
          <el-form-item label="问题细节描述：">
              <el-input type="textarea" style="width:96%" v-model="problem.descriptionDetail" :autosize="{ minRows: 2}" readonly></el-input>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="建议整改措施：">
              <el-input type="textarea" style="width:96%" v-model="problem.recommendRectiMeasure" :autosize="{ minRows: 2}" readonly></el-input>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="限定整改完成日期：" style="height:20px">{{problem.limtRectDate}}</el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查项1：" style="height:20px">{{problem.checkItemName1}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人名称：" style="height:20px">{{problem.responsePersonName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查项2：" style="height:20px">{{problem.checkItemName2}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人性质：" style="height:20px">{{problem.responseEmpGroup}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查项3：" style="height:20px">{{problem.checkItemName3}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题所属岗位：" style="height:20px">{{problem.companyName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="问题级别：" style="height:20px">{{problem.problemRank}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题原因：" style="height:20px">{{problem.source}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务：" style="height:20px">{{problem.task}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题类别1：" style="height:20px">{{problem.problemClass1}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工序：" style="height:20px">{{problem.process}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题类别2：" style="height:20px">{{problem.problemClass2}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="违章扣款：" style="height:20px">{{problem.penalty}}</el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
            <el-form-item label="违章扣分：" style="height:20px">{{problem.lostScore}}</el-form-item>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="问题重复性：" style="height:20px">{{problem.problemRepeat}}</el-form-item>
          </el-col>
        </el-row> -->
        <!-- 检查附件 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查附件1： ">
              <el-card :body-style="{ padding: '10px' }" style="height:251px;width:90%">
                <el-popover placement="right" title="" trigger="click">
                  <div style="max-width:600px;height:auto"><img :src="problem.checkAttach1" style="max-width:600px;height:auto"/></div>
                  <img slot="reference" :src="problem.checkAttach1" :alt="problem.checkAttach1" style="max-height: 200px">
                </el-popover>
              </el-card>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查附件2：">
              <el-card :body-style="{ padding: '10px' }" style="height:251px;width:90%">
                <el-popover placement="center" title="" trigger="click">
                  <div style="max-width:600px;height:auto"><img :src="problem.checkAttach2" style="max-width:600px;height:auto"/></div>
                  <img slot="reference" :src="problem.checkAttach2" :alt="problem.checkAttach2" style="max-height: 200px">
                </el-popover>
                <!-- <br/>
                <span>检查图片2</span>
                <div class="bottom clearfix">
                  <time class="time">{{problem.checkDate}}</time>
                </div> -->
              </el-card>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查附件3：">
              <el-card :body-style="{ padding: '10px' }" style="height:251px;width:90%">
                <el-popover placement="right" title="" trigger="click">
                  <div style="max-width:600px;height:auto"><img :src="problem.checkAttach3" style="max-width:600px;height:auto"/></div>
                  <img slot="reference" :src="problem.checkAttach3" :alt="problem.checkAttach3" style="max-height: 200px">
                </el-popover>
              </el-card>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查附件4：">
              <el-card :body-style="{ padding: '10px' }" style="height:251px;width:90%">
                <el-popover placement="right" title="" trigger="click">
                  <div style="max-width:600px;height:auto"><img :src="problem.checkAttach4" style="max-width:600px;height:auto"/></div>
                  <img slot="reference" :src="problem.checkAttach4" :alt="problem.checkAttach4" style="max-height: 200px">
                </el-popover>
              </el-card>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <el-form-item label="视频附件：">
              <el-card 
              v-model="problem.checkVideo"
              :show-file-list="false"
              accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
              :headers="{Authorization:currentUser.token}"
              style="height:251px;width:90%"
              >
              <video v-if="problem.checkVideo !='' && videoFlag1 == false"
                               :src="problem.checkVideo"
                               class="avatar video-avatar"
                               controls="controls">您的浏览器不支持视频播放</video> 
                        <i v-if="problem.checkVideo =='' && videoFlag1 == false"></i>
                    </el-card>
               </el-form-item>
          </el-col>
          </el-row>
      </el-form>
    
      <!-- 整改 -->
        <font style="font-size:15px;font-weight:bold">问题整改</font>
        <div style="width:100%;margin-left:0px;height:10px;border-top:2px solid #ddd"></div>
        <el-form :model="problem" label-width="150px" :rules="rules" ref="problem">
          <el-row>
             <el-form-item label="整改问题描述：">
              <el-input type="textarea" style="width:96%" v-model="problem.rectiMeasure"></el-input>
            </el-form-item>
           </el-row>
           <el-row>
             <el-col :span="12">
               <el-form-item label="是否延期：" prop="isPostpone">
                <el-select  v-model="problem.isPostpone" placeholder="请选择" style="width:200px;">
                    <el-option
                    v-for="item in problemisPostpone"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                    </el-option>
                </el-select>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="整改完成时间："  prop="rectiFinishDate">
                <el-date-picker
                  v-model="problem.rectiFinishDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期" 
                  style="width:200px"
                  :editable="false">
                </el-date-picker>
              </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <!-- <el-col :span="12">
               <el-form-item label="问题状态："  prop="status">
                  <el-select  style="width:200px;" v-model="problem.status" placeholder="请选择" >
                  <el-option 
                  v-for="item in rectiStatusValues"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                  </el-option>
                </el-select>
               </el-form-item>
             </el-col> -->
             <el-col :span="12">
               <el-form-item label="整改负责人：" prop="rectiPersonId">
                 <el-select
                    v-model="problem.rectiPersonId"
                    placeholder="输入姓名搜索负责人"
                    :filter-method="handleLeaderSearch"
                    clearable
                    filterable
                    loading-text="查询中..."
                    style="width: 200px;"    
                    @change="onChanged"            
                   >
                   <el-option
                    v-for="item in leaders"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID">
                   </el-option>
               </el-select>
               </el-form-item>
             </el-col>
           </el-row>
           <!-- <el-row>
             <el-col :span="12">
               <el-form-item label="违章扣款：" prop="penalty">
                <el-select  v-model="problem.penalty" placeholder="请选择" style="width:200px;">
                    <el-option
                    v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                    </el-option>
                </el-select>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="违章记分：" prop="lostScore">
                <el-select v-model="problem.lostScore" placeholder="请选择"  style="width:200px;">
                <el-option
                  v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
               </el-form-item>
             </el-col>
           </el-row> -->
           <el-row>
             <el-col :span="12">
             <el-form-item label="整改附件：">
               图片大小不能超过12M，视频大小不能超过12M
             </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="12">
               <el-form-item label="整改附件1：">
                <el-upload
              v-model="problem.rectAttach1" 
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
              :before-upload="handleBeforeUpload"
              :file-list="fileList1"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess1"
              >
              <el-button  type="success" circle ><i class="el-icon-plus " ></i></el-button>
            </el-upload>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="整改附件2：">
                 <el-upload
                  v-model="problem.rectAttach2"
                  :action="`/api/file_upload`"
                  list-type="picture"
                  :limit="1"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove2"
                  :before-upload="handleBeforeUpload"
                  :file-list="fileList2"
                  :auto-upload='true'
                  :headers="{Authorization:currentUser.token}"
                  name="file"
                  :on-success="handleSuccess2"
                  style="width:90%"
                  >
                  <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
                </el-upload>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="12">
               <el-form-item label="整改附件3：">
                 <el-upload
              v-model="problem.rectAttach3"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove3"
              :before-upload="handleBeforeUpload"
              :file-list="fileList3"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess3"
              style="width:90%"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
            </el-upload>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="整改附件4：">
                 <el-upload
                  v-model="problem.rectAttach4"
                  :action="`/api/file_upload`"
                  list-type="picture"
                  :limit="1"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove4"
                  :before-upload="handleBeforeUpload"
                  :file-list="fileList4"
                  :auto-upload='true'
                  :headers="{Authorization:currentUser.token}"
                  name="file"
                  :on-success="handleSuccess4"
                  style="width:90%"
                  >
                  <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
                </el-upload>
               </el-form-item>
             </el-col>
           </el-row>
         <el-row>
             <el-col :span="12">
             <el-form-item label="视频附件：">
              <el-upload class="avatar-uploader el-upload--text"
              v-model="problem.rectVideo"
              :action="`/api/file_upload`"
              :file-list="videoList1"
              :limit="1"
              accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
              :before-upload="beforeUploadVideo1"
              :on-progress="uploadVideoProcess1"
              :headers="{Authorization:currentUser.token}"
              :on-success="handleVideoSuccess1"
              :on-remove="handlevideoRemove1"
              style="width:100%"
              >
              <video v-if="problem.rectVideo !='' && videoFlag1 == false"
                :src="checkVideourl"
                class="avatar video-avatar"
                controls="controls">您的浏览器不支持视频播放</video> 
                <i v-if="problem.rectVideo =='' && videoFlag1 == false" class="el-icon-plus avatar-uploader-icon"></i>
                <el-progress v-if="videoFlag1 == true"
                  type="circle"
                  :percentage="videoUploadPercent1"
                  style="margin-top:30px;"></el-progress>
              </el-upload>
              </el-form-item>
             </el-col>
           </el-row>

          <el-row class="buttons">
            <el-button type="primary"  @click="handleSubmit('problem')">确认</el-button>
            <el-button type="danger" @click="$router.go(-1)">取消</el-button>
          </el-row>
        </el-form> 
      </div>
    </div>
  </div>
  <div v-else>
    <div style="width:1000px">
      <div class="page-title" style="width:100%;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><a @click="$router.go(-1)">问题详情</a></el-breadcrumb-item>
          <el-breadcrumb-item>问题整改</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 问题详情 -->
      <div class="page-content" style="font-size:20px;width:100%;border-top: 1px solid #dddddd;">
        <el-form label-width="150px" :model="problem">
          <el-row  style="padding-bottom:5px">
            <font style="font-size:15px;font-weight:bold">问题详情</font>
          </el-row> 
          <el-row style="padding-top:10px; border-top: 2px solid #dddddd">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label=" 受检单位：" style="height:20px">{{problem.companyName}}</el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
              <el-form-item label="受检二级单位：" style="height:20px">{{problem.parentCompanyName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查时间：" style="height:20px">{{problem.checkDate}}</el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
            <el-form-item label="检查人员：" style="height:20px">{{problem.checkPersonName}}</el-form-item>
        </el-row>
        <el-row>
          <div class="grid-content bg-purple">
            <el-form-item label="问题标准描述：">
              <el-input type="textarea" style="width:96%" v-model="problem.description" :autosize="{ minRows: 2}" readonly></el-input>
            </el-form-item>
          </div>
        </el-row>
        <el-row>
          <el-form-item label="问题细节描述：">
              <el-input type="textarea" style="width:96%" v-model="problem.descriptionDetail" :autosize="{ minRows: 2}" readonly></el-input>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="建议整改措施：">
              <el-input type="textarea" style="width:96%" v-model="problem.recommendRectiMeasure" :autosize="{ minRows: 2}" readonly></el-input>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="限定整改完成日期：" style="height:20px">{{problem.limtRectDate}}</el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查项1：" style="height:20px">{{problem.checkItemName1}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人名称：" style="height:20px">{{problem.responsePersonName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查项2：" style="height:20px">{{problem.checkItemName2}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人性质：" style="height:20px">{{problem.responseEmpGroup}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查项3：" style="height:20px">{{problem.checkItemName3}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题所属岗位：" style="height:20px">{{problem.companyName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="问题级别：" style="height:20px">{{problem.problemRank}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题原因：" style="height:20px">{{problem.source}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务：" style="height:20px">{{problem.task}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题类别1：" style="height:20px">{{problem.problemClass1}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工序：" style="height:20px">{{problem.process}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题类别2：" style="height:20px">{{problem.problemClass2}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="违章扣款：" style="height:20px">{{problem.penalty}}</el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
            <el-form-item label="违章扣分：" style="height:20px">{{problem.lostScore}}</el-form-item>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="问题重复性：" style="height:20px">{{problem.problemRepeat}}</el-form-item>
          </el-col>
        </el-row> -->
        <!-- 检查附件 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查附件1： ">
              <el-card :body-style="{ padding: '10px' }" style="height:251px;width:90%">
                <el-popover placement="right" title="" trigger="click">
                  <div style="max-width:600px;height:auto"><img :src="problem.checkAttach1" style="max-width:600px;height:auto"/></div>
                  <img slot="reference" :src="problem.checkAttach1" :alt="problem.checkAttach1" style="max-height: 200px">
                </el-popover>
              </el-card>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查附件2：">
              <el-card :body-style="{ padding: '10px' }" style="height:251px;width:90%">
                <el-popover placement="center" title="" trigger="click">
                  <div style="max-width:600px;height:auto"><img :src="problem.checkAttach2" style="max-width:600px;height:auto"/></div>
                  <img slot="reference" :src="problem.checkAttach2" :alt="problem.checkAttach2" style="max-height: 200px">
                </el-popover>
                <!-- <br/>
                <span>检查图片2</span>
                <div class="bottom clearfix">
                  <time class="time">{{problem.checkDate}}</time>
                </div> -->
              </el-card>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查附件3：">
              <el-card :body-style="{ padding: '10px' }" style="height:251px;width:90%">
                <el-popover placement="right" title="" trigger="click">
                  <div style="max-width:600px;height:auto"><img :src="problem.checkAttach3" style="max-width:600px;height:auto"/></div>
                  <img slot="reference" :src="problem.checkAttach3" :alt="problem.checkAttach3" style="max-height: 200px">
                </el-popover>
              </el-card>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查附件4：">
              <el-card :body-style="{ padding: '10px' }" style="height:251px;width:90%">
                <el-popover placement="right" title="" trigger="click">
                  <div style="max-width:600px;height:auto"><img :src="problem.checkAttach4" style="max-width:600px;height:auto"/></div>
                  <img slot="reference" :src="problem.checkAttach4" :alt="problem.checkAttach4" style="max-height: 200px">
                </el-popover>
              </el-card>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <el-form-item label="视频附件：">
              <el-card 
              v-model="problem.checkVideo"
              :show-file-list="false"
              accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
              :headers="{Authorization:currentUser.token}"
              style="height:251px;width:90%"
              >
              <video v-if="problem.checkVideo !='' && videoFlag1 == false"
                               :src="problem.checkVideo"
                               class="avatar video-avatar"
                               controls="controls">您的浏览器不支持视频播放</video> 
                        <i v-if="problem.checkVideo =='' && videoFlag1 == false"></i>
                    </el-card>
               </el-form-item>
          </el-col>
          </el-row>
      </el-form>
    
      <!-- 整改 -->
        <font style="font-size:15px;font-weight:bold">问题整改</font>
        <div style="width:1000px;margin-left:0px;height:10px;border-top:2px solid #ddd"></div>
        <el-form :model="problem" label-width="150px" :rules="rules" ref="problem">
          <el-row>
             <el-form-item label="整改问题描述：">
              <el-input type="textarea" style="width:96%" v-model="problem.rectiMeasure"></el-input>
            </el-form-item>
           </el-row>
           <el-row>
             <el-col :span="12">
               <el-form-item label="是否延期：" prop="isPostpone">
                <el-select  v-model="problem.isPostpone" placeholder="请选择" style="width:200px;">
                    <el-option
                    v-for="item in problemisPostpone"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                    </el-option>
                </el-select>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="整改完成时间："  prop="rectiFinishDate">
                <el-date-picker
                  v-model="problem.rectiFinishDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期" style="width:200px">
                </el-date-picker>
              </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="12">
               <el-form-item label="整改负责人：" prop="rectiPersonId">
                 <el-select
                    v-model="problem.rectiPersonId"
                    placeholder="输入姓名搜索负责人"
                    :filter-method="handleLeaderSearch"
                    clearable
                    filterable
                    loading-text="查询中..."
                    style="width: 200px;"    
                    @change="onChanged"            
                   >
                   <el-option
                    v-for="item in leaders"
                    :key="item.employeeID"
                    :label="`${item.name}(${item.companyName})`"
                    :value="item.employeeID">
                   </el-option>
               </el-select>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="12">
             <el-form-item label="整改附件：">
               图片大小不能超过12M，视频大小不能超过12M
             </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="12">
               <el-form-item label="整改附件1：">
                <el-upload
              v-model="problem.rectAttach1" 
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
              :before-upload="handleBeforeUpload"
              :file-list="fileList1"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess1"
              >
              <el-button  type="success" circle ><i class="el-icon-plus " ></i></el-button>
            </el-upload>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="整改附件2：">
                 <el-upload
                  v-model="problem.rectAttach2"
                  :action="`/api/file_upload`"
                  list-type="picture"
                  :limit="1"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove2"
                  :before-upload="handleBeforeUpload"
                  :file-list="fileList2"
                  :auto-upload='true'
                  :headers="{Authorization:currentUser.token}"
                  name="file"
                  :on-success="handleSuccess2"
                  style="width:90%"
                  >
                  <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
                </el-upload>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="12">
               <el-form-item label="整改附件3：">
                 <el-upload
              v-model="problem.rectAttach3"
              :action="`/api/file_upload`"
              list-type="picture"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove3"
              :before-upload="handleBeforeUpload"
              :file-list="fileList3"
              :auto-upload='true'
              :headers="{Authorization:currentUser.token}"
              name="file"
              :on-success="handleSuccess3"
              style="width:90%"
              >
              <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
            </el-upload>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="整改附件4：">
                 <el-upload
                  v-model="problem.rectAttach4"
                  :action="`/api/file_upload`"
                  list-type="picture"
                  :limit="1"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove4"
                  :before-upload="handleBeforeUpload"
                  :file-list="fileList4"
                  :auto-upload='true'
                  :headers="{Authorization:currentUser.token}"
                  name="file"
                  :on-success="handleSuccess4"
                  style="width:90%"
                  >
                  <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
                </el-upload>
               </el-form-item>
             </el-col>
           </el-row>
         <el-row>
             <el-col :span="12">
              <el-form-item label="视频附件：">
              <el-upload class="avatar-uploader el-upload--text"
              v-model="problem.rectVideo"
              :action="`/api/file_upload`"
              :file-list="videoList1"
              :limit="1"
              accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'
              :before-upload="beforeUploadVideo1"
              :on-progress="uploadVideoProcess1"
              :headers="{Authorization:currentUser.token}"
              :on-success="handleVideoSuccess1"
              :on-remove="handlevideoRemove1"
              style="width:100%"
              >
              <video v-if="problem.rectVideo !='' && videoFlag1 == false"
                :src="checkVideourl"
                class="avatar video-avatar"
                controls="controls">您的浏览器不支持视频播放</video> 
                <i v-if="problem.rectVideo =='' && videoFlag1 == false" class="el-icon-plus avatar-uploader-icon"></i>
                <el-progress v-if="videoFlag1 == true"
                  type="circle"
                  :percentage="videoUploadPercent1"
                  style="margin-top:30px;"></el-progress>
              </el-upload>
              </el-form-item>
             </el-col>
           </el-row>

          <el-row class="buttons">
            <el-button type="primary"  @click="handleSubmit('problem')">确认</el-button>
            <el-button type="danger" @click="$router.go(-1)">取消</el-button>
          </el-row>
        </el-form> 
      </div>
    </div>
  </div>
</template>

<script>
import {GetProblemDetail} from '../../../services/problem'
import {UpdateRectifyProblem} from '../../../services/verify'
import {GetCurrentUser } from '../../../store/CurrentUser'
import {GetEmployees} from '../../../services/employee'
import {GetDictionary} from '../../../services/dictionary'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

export default {
  data() {
    
    return {
      client:VueCookies.get("client"),
      rules: {
        rectiPersonId:[{required: true, message: '请输入', trigger: 'blur'}],
        rectiFinishDate :[{required: true, message: '请选择', trigger: ['blur', 'change'] }],
        status :[{required: true, message: '请选择', trigger: ['blur', 'change'] }],
        isPostpone :[{required: true, message: '请选择', trigger: ['blur', 'change']}],
        penalty :[{required: true, message: '请选择', trigger: ['blur', 'change']}],
        lostScore :[{required: true, message: '请选择', trigger: ['blur', 'change']}]
      },
      
      videoFlag1:false,
      videoUploadPercent1:0,
      isShowUploadVideo1:false,

      statusValues:[], //获取整改状态
      leaders:[], //负责人、
      fileList:[],//附件列表
      fileList1:[],//图片附件1
      fileList2:[],//图片附件2
      fileList3:[],//图片附件3
      fileList4:[],//图片附件4
      rectVideo:'',
      
      //是否延期
      problemisPostpone:[
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],

      problem: {
        // rectiStatus:'已整改',//整改状态
        rectiPerson:'',//整改负责人
        rectiPersonId:'',
        rectVideo:'',
        // penalty: "", //违章扣款 
        lostScore: null, //违章记分
        rectAttach1: "", //整改附件1234
        rectAttach2: "", 
        rectAttach3: "", 
        rectAttach4: "", 
        rectiMeasure: "", // 整改问题描述
      },
    
    };
    
  },
  mounted () {
    this.handleGetProblemDetail()
    this.handleLeaderSearch()
    this.getTime() //获取当前时间
    this.handleGetrectiStatus () //获取整改状态
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    }
  },

  methods: {
    //上传视频
    beforeUploadVideo1(file) {          //视频上传之前判断他的大小
      const isLt50M = file.size / 1024 / 1024  < 50;
      if (!isLt50M) {
        this.$message.error('上传视频大小不能超过50MB哦!');
        return false;
      }
      this.isShowUploadVideo1 = false;
    },
    uploadVideoProcess1(event, file){    //视频上传的时候获取上传进度传给进度条
      this.videoFlag1 = true;
      this.videoUploadPercent1 = parseInt(file.percentage);
      // console.log(this.videoUploadPercent)
    },
     handleVideoSuccess1(res) {           //视频上传成功之后返回视频地址
      this.isShowUploadVideo1 = true;
      this.videoFlag1 = false;
      this.videoUploadPercent1 = 0;
       this.problem.rectVideo = res.data;
      this.checkVideourl='http://39.98.173.131:7000/resources/'+  this.problem.rectVideo
      
    },
    handlevideoRemove1(file, videoList1) {
        this.problem.rectVideo="";
        console.log(file, videoList1);
      },

    //数据字典获取“验证状态”。
    handleGetrectiStatus () {
      GetDictionary({name: '问题状态'}).then((res) => {
        this.rectiStatusValues = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取当前时间，显示在验证时间选择器
    getTime(){
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() +1
      let date1 = date.getDate()
      this.problem.rectiFinishDate = year.toString()+'-'+'0'+month.toString()+'-'+'0'+date1.toString()
      // alert(this.problem.rectiFinishDate)
    },
    //获取负责人
    handleLeaderSearch (val='') {
      // this.leaderLoading = true
      GetEmployees({name: val, type: "all",inputType:"problem_rectification"}).then((res) => {
        this.leaders = res.data
        // this.leaderLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        // this.leaderLoading = false
      })
    },
    onChanged(selectValue) {
      let obj = {}
         //遍历下拉数组中的item
        obj = this.leaders.find((item)=>{
          return item.employeeID === selectValue
        })
        this.problem.rectiPersonId = obj.employeeID     
        this.problem.rectiPerson = obj.name   
    },
    //上传图片之前
    handleBeforeUpload(file){
      const isJPG =(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg');
      const isLt5M = file.size / 1024 / 1024 < 12;
      if(!isJPG){
        this.$message.error('请检查图片格式!');
      }
      if(!isLt5M) {
        this.$message.error('上传图片大小不能超过 12MB!');
      }
      return isJPG && isLt5M;
    },

    // 上传图片
    handleRemove1(file, fileList1) {
        this.problem.rectAttach1=null;
        console.log(file, fileList1);
      },
    handleRemove2(file, fileList2) {
        this.problem.rectAttach2=null;
        console.log(file, fileList2);
      },
    handleRemove3(file, fileList3) {
        this.problem.rectAttach3=null;
        console.log(file, fileList3);
      },
    handleRemove4(file, fileList4) {
        this.problem.rectAttach4=null;
        console.log(file, fileList4);
      },
    handleSuccess1(response){
     console.log(response)
      this.problem.rectAttach1 = response.data
      console.log(this.problem.rectAttach1)
    },
    handleSuccess2(response){
       console.log(response)
      this.problem.rectAttach2 = response.data
    },
    handleSuccess3(response){
       console.log(response)
      this.problem.rectAttach3 = response.data
    },
    handleSuccess4(response){
      console.log(response)
      this.problem.rectAttach4 = response.data
      // alert(this.problem.rectAttach4)
    },
    // 图片处理
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
    
    //根据problemID获取单个问题详细信息
    handleGetProblemDetail () {
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
			const id = JSON.parse(localStorage.getItem('data'));
      // let id = this.$route.params.id
      GetProblemDetail(id).then((res) => {
        // alert(JSON.stringify(res.data))
        this.problem = res.data
        // this.problem.status='已整改'
        this.problem.rectAttach1=null,
        this.problem.rectAttach2=null,
        this.problem.rectAttach3=null,
        this.problem.rectAttach4=null,
        this.problem.rectVideo=""
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }, 

    //确认验证，提交修改
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.problem.status='未验证',
          // alert(JSON.stringify(this.problem))
          // alert(JSON.stringify(this.problem.problemID))
          UpdateRectifyProblem(this.problem.problemID, this.problem).then(() => {
            // alert('00')
            this.$message.success('操作成功')
            this.$router.go(-1) //返回上一url
          }, (err) => {
            this.$message.error(err.message)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
      
    },

  }
};
</script>

<style>
#main{
  /* position: relative; */
  width:1000px;
  height: 100%;
  margin-left: 2%;
  margin-right: 5%;
}
.above{
margin-top: 20px;
width: 1000px;
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
  font-size: 30px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: buttom;
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
