<template>
  <div v-if="this.client === 'android'" style="width:750px;">
    <div class="page-title" style="width:100%">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">个人问题验证</a></el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 受检单位的问题详情 -->
    <div class="page-content" style="font-size:20px;width:100%;border-top: 1px solid #dddddd;">
      <el-form label-width="140px">
        <el-row  style="padding-bottom:5px">
          <font style="font-size:15px;font-weight:bold">问题详情</font>
        </el-row>
        <el-row style="padding-top:5px; border-top: 2px solid #dddddd;">
          <el-col :span="12">
            <el-form-item style="height:20px" label="受检单位：">{{problem.companyName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="受检二级单位：">{{problem.parentCompanyName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查人员：">{{problem.checkPersonName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查时间：">{{problem.checkDate}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="问题标准描述：">
            <el-input type="textarea" style="width:96%" v-model="problem.description" :autosize="{ minRows: 2}" readonly></el-input>
          </el-form-item>
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
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查项1：">{{problem.checkItemName1}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="责任人姓名：">{{problem.responsePersonName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查项2：">{{problem.checkItemName2}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="责任人性质：">{{problem.responseEmpGroup}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查项3：">{{problem.checkItemName3}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题所属岗位：">{{problem.problemStation}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题级别：">{{problem.problemRank}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题原因：">{{problem.source}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="任务：">{{problem.task}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题类别1：">{{problem.problemClass1}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="工序：">{{problem.process}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题类别2：">{{problem.problemClass2}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="违章扣款：">{{problem.penalty}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="违章记分：">{{problem.lostScore}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="检查图片：" v-if="problem.checkAttach1 === '' &&problem.checkAttach2 === ''&&problem.checkAttach3 === ''&&problem.checkAttach4 === ''">此问题无检查图片！</el-form-item>
          <el-form-item label="检查图片：" v-else>
            <el-row>
              <span v-if="problem.checkAttach1 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:400px;height:auto"><img :src="problem.checkAttach1" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.checkAttach1" :alt="problem.checkAttach1" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.checkAttach2 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:400px;height:auto"><img :src="problem.checkAttach2" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.checkAttach2" :alt="problem.checkAttach2" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.checkAttach3 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:400px;height:auto"><img :src="problem.checkAttach3" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.checkAttach3" :alt="problem.checkAttach3" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.checkAttach4 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:400px;height:auto"><img :src="problem.checkAttach4" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.checkAttach4" :alt="problem.checkAttach4" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="检查视频："> 
            <el-col :span="12">
              <span v-if="problem.checkVideo === ''">此问题无检查视频！</span>
              <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px" v-else>
                <video width="100%" height="230" :src="problem.checkVideo" controls preload="none" ></video>
              </el-card>
            </el-col>
          </el-form-item>
        </el-row>

    <!-- 整改情况 -->
        <el-row style="padding-bottom:5px">
          <font style="font-size:15px;font-weight:bold">问题整改</font>
        </el-row>
        <el-row style="padding-top:5px; border-top: 2px solid #dddddd">
          <el-form-item label="整改描述：">
            <el-input type="textarea" style="width:96%" v-model="problem.rectiMeasure" :autosize="{ minRows: 2}" readonly></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="限定整改完成日期：">{{problem.limtRectDate}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="整改完成时间：">{{problem.rectiFinishDate}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="是否延期：">{{problem.isPostpone}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="整改负责人：">{{problem.rectiPerson}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="整改图片：" v-if="problem.rectAttach1 === '' &&problem.rectAttach2 === ''&&problem.rectAttach3 === ''&&problem.rectAttach4 === ''">此问题无整改图片！</el-form-item>
          <el-form-item label="整改图片：" v-else>
            <el-row>
              <span v-if="problem.rectAttach1 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:400px;height:auto"><img :src="problem.rectAttach1" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.rectAttach1" :alt="problem.rectAttach1" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.rectAttach2 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:400px;height:auto"><img :src="problem.rectAttach2" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.rectAttach2" :alt="problem.rectAttach2" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.rectAttach3 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:400px;height:auto"><img :src="problem.rectAttach3" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.rectAttach3" :alt="problem.rectAttach3" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.rectAttach4 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:400px;height:auto"><img :src="problem.rectAttach4" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.rectAttach4" :alt="problem.rectAttach4" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="整改视频："> 
            <el-col :span="12">
              <span v-if="problem.rectVideo === ''">此问题无整改视频！</span>
              <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px" v-else>
                <video width="100%" height="230" controls preload="none" :src="problem.rectVideo"></video>
              </el-card>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <!-- 验证情况 -->
      <el-form label-width="140px" :model="updataProblem" ref="updataProblem" :rules="rules">
        <el-row style="padding-bottom:5px">
          <font style="font-size:15px;font-weight:bold">问题验证</font>
        </el-row>
        <el-row style="padding-top:5px; border-top: 2px solid #dddddd">
          <el-col :span="12">
            <el-form-item label="验证人：" prop="verifyPersonEmpID">
              <el-select
                v-model="updataProblem.verifyPersonEmpID"
                placeholder="输入姓名搜索验证人"
                :filter-method="handleGetLeaderSearch"
                clearable
                filterable
                :loading="leaderLoading"
                loading-text="查询中..."
                style="width: 90%;"
                @change="onChanged">
                <el-option
                  v-for="item in leaders"
                  :key="item.employeeID"
                  :label="`${item.name}(${item.companyName})`"
                  :value="item.employeeID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验证时间：">
              <el-date-picker
              v-model="updataProblem.verifyDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择验证日期"
              style="width:90%"
              :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="验证描述：">
            <el-input type="textarea" style="width:96%" v-model="updataProblem.verifyDescription" :autosize="{ minRows: 2}" placeholder="请输入验证结果描述"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="整改效果：" prop="rectEffect">
              <el-select style="width:90%" v-model="updataProblem.rectEffect" placeholder="请选择整改效果" clearable>
                <el-option 
                v-for="item in rectEffects"
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
            <el-form-item label="验证图片：" >
              <el-upload
                v-model="updataProblem.verifyAttach"
                :action="`/api/file_upload`"
                list-type="picture"
                :limit="1"
                :before-upload="handleBeforeUpload"
                :on-remove="handleRemove"
                :auto-upload='true'
                :headers="{Authorization:currentUser.token}"
                :on-success="handleSuccess">
                <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
                <div slot="tip" class="el-upload__tip">请上传一张验证图片，且不大于12M。</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="buttons">
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('updataProblem')">通过验证</el-button>  
            <el-button type="primary" @click="dialogFormVisible = true">未通过验证</el-button> 

            <el-dialog title="验证不通过建议" :visible.sync="dialogFormVisible">
              <el-form label-width="140px" :model="updataProblem" style="width:80%">
                <el-form-item label="验证不通过建议：">
                  <el-input v-model="updataProblem.verifyModification" type="textarea" style="width:100%" :autosize="{ minRows: 4}" placeholder="请输入验证未通过意见,200字以内。"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitFail('updataProblem')">确 定</el-button>
              </div>
            </el-dialog>  
            &nbsp;
            <el-button type="danger" style="width:100px" @click="$router.go(-1)">取消</el-button>   
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>  
  
  <div style="width:1000px;" v-else>
    <div class="page-title" style="width:100%">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="$router.go(-1)">个人问题验证</a></el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 受检单位的问题详情 -->
    <div class="page-content" style="font-size:20px;width:100%;border-top: 1px solid #dddddd;">
      <el-form label-width="140px">
        <el-row  style="padding-bottom:5px">
          <font style="font-size:15px;font-weight:bold">问题详情</font>
        </el-row>
        <el-row style="padding-top:5px; border-top: 2px solid #dddddd;">
          <el-col :span="12">
            <el-form-item style="height:20px" label="受检单位：">{{problem.companyName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="受检二级单位：">{{problem.parentCompanyName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查人员：">{{problem.checkPersonName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查时间：">{{problem.checkDate}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="问题标准描述：">
            <el-input type="textarea" style="width:96%" v-model="problem.description" :autosize="{ minRows: 2}" readonly></el-input>
          </el-form-item>
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
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查项1：">{{problem.checkItemName1}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="责任人姓名：">{{problem.responsePersonName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查项2：">{{problem.checkItemName2}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="责任人性质：">{{problem.responseEmpGroup}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="检查项3：">{{problem.checkItemName3}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题所属岗位：">{{problem.problemStation}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题级别：">{{problem.problemRank}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题原因：">{{problem.source}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="任务：">{{problem.task}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题类别1：">{{problem.problemClass1}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="工序：">{{problem.process}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="问题类别2：">{{problem.problemClass2}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="违章扣款：">{{problem.penalty}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="违章记分：">{{problem.lostScore}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="检查图片：" v-if="problem.checkAttach1 === '' &&problem.checkAttach2 === ''&&problem.checkAttach3 === ''&&problem.checkAttach4 === ''">此问题无检查图片！</el-form-item>
          <el-form-item label="检查图片：" v-else>
            <el-row>
              <span v-if="problem.checkAttach1 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="problem.checkAttach1" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.checkAttach1" :alt="problem.checkAttach1" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.checkAttach2 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="problem.checkAttach2" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.checkAttach2" :alt="problem.checkAttach2" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
            <!-- </el-row>
            <el-row> -->
              <span v-if="problem.checkAttach3 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="problem.checkAttach3" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.checkAttach3" :alt="problem.checkAttach3" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.checkAttach4 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="problem.checkAttach4" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.checkAttach4" :alt="problem.checkAttach4" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="检查视频："> 
            <el-col :span="12">
              <span v-if="problem.checkVideo === ''">此问题无检查视频！</span>
              <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px" v-else>
                <video width="100%" height="230" :src="problem.checkVideo" controls preload="none" ></video>
              </el-card>
            </el-col>
          </el-form-item>
        </el-row>

    <!-- 整改情况 -->
        <el-row style="padding-bottom:5px">
          <font style="font-size:15px;font-weight:bold">问题整改</font>
        </el-row>
        <el-row style="padding-top:5px; border-top: 2px solid #dddddd">
          <el-form-item label="整改描述：">
            <el-input type="textarea" style="width:96%" v-model="problem.rectiMeasure" :autosize="{ minRows: 2}" readonly></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="限定整改完成日期：">{{problem.limtRectDate}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="整改完成时间：">{{problem.rectiFinishDate}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="height:20px" label="是否延期：">{{problem.isPostpone}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="height:20px" label="整改负责人：">{{problem.rectiPerson}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="整改图片：" v-if="problem.rectAttach1 === '' &&problem.rectAttach2 === ''&&problem.rectAttach3 === ''&&problem.rectAttach4 === ''">此问题无整改图片！</el-form-item>
          <el-form-item label="整改图片：" v-else>
            <el-row>
              <span v-if="problem.rectAttach1 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="problem.rectAttach1" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.rectAttach1" :alt="problem.rectAttach1" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.rectAttach2 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="problem.rectAttach2" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.rectAttach2" :alt="problem.rectAttach2" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.rectAttach3 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="problem.rectAttach3" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.rectAttach3" :alt="problem.rectAttach3" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
              <span v-if="problem.rectAttach4 === ''"></span>
              <el-col :span="12" v-else>
                <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px">
                  <el-popover placement="right" title="" trigger="click">
                    <div style="max-width:600px;height:auto"><img :src="problem.rectAttach4" style="max-width:600px;height:auto"/></div>
                    <img slot="reference" :src="problem.rectAttach4" :alt="problem.rectAttach4" style="max-height: 230px">
                  </el-popover><br/>
                </el-card>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="整改视频："> 
            <el-col :span="12">
              <span v-if="problem.rectVideo === ''">此问题无整改视频！</span>
              <el-card :body-style="{ padding: '10px' }" style="width:90%;height:250px" v-else>
                <video width="100%" height="230" controls preload="none" :src="problem.rectVideo"></video>
              </el-card>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <!-- 验证情况 -->
      <el-form label-width="140px" :model="updataProblem" ref="updataProblem" :rules="rules">
        <el-row style="padding-bottom:5px">
          <font style="font-size:15px;font-weight:bold">问题验证</font>
        </el-row>
        <el-row style="padding-top:5px; border-top: 2px solid #dddddd">
          <el-col :span="12">
            <el-form-item label="验证人：" prop="verifyPersonEmpID">
              <el-select
                v-model="updataProblem.verifyPersonEmpID"
                placeholder="输入姓名搜索验证人"
                :filter-method="handleGetLeaderSearch"
                clearable
                filterable
                :loading="leaderLoading"
                loading-text="查询中..."
                style="width: 90%;"
                @change="onChanged">
                <el-option
                  v-for="item in leaders"
                  :key="item.employeeID"
                  :label="`${item.name}(${item.companyName})`"
                  :value="item.employeeID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验证时间：">
              <el-date-picker
              v-model="updataProblem.verifyDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择验证日期"
              style="width:90%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="验证描述：">
            <el-input type="textarea" style="width:96%" v-model="updataProblem.verifyDescription" :autosize="{ minRows: 2}" placeholder="请输入验证结果描述"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="整改效果：" prop="rectEffect">
              <el-select style="width:90%" v-model="updataProblem.rectEffect" placeholder="请选择整改效果" clearable>
                <el-option 
                v-for="item in rectEffects"
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
            <el-form-item label="验证图片：" >
              <el-upload
                v-model="updataProblem.verifyAttach"
                :action="`/api/file_upload`"
                list-type="picture"
                :limit="1"
                :before-upload="handleBeforeUpload"
                :on-remove="handleRemove"
                :auto-upload='true'
                :headers="{Authorization:currentUser.token}"
                :on-success="handleSuccess">
                <el-button  type="success" circle><i class="el-icon-plus"></i></el-button>
                <div slot="tip" class="el-upload__tip">请上传一张验证图片，且不大于12M。</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="buttons">
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('updataProblem')">通过验证</el-button>  
            <el-button type="primary" @click="dialogFormVisible = true">未通过验证</el-button> 

            <el-dialog title="验证不通过建议" :visible.sync="dialogFormVisible">
              <el-form label-width="140px" :model="updataProblem" style="width:80%">
                <el-form-item label="验证不通过建议：">
                  <el-input v-model="updataProblem.verifyModification" type="textarea" style="width:100%" :autosize="{ minRows: 4}" placeholder="请输入验证未通过意见,200字以内。"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitFail('updataProblem')">确 定</el-button>
              </div>
            </el-dialog>  
            &nbsp;
            <el-button type="danger" style="width:100px" @click="$router.go(-1)">取消</el-button>   
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>  
</template>


<script type="text/javascript">
import {GetPersonalProblemDetail,UpdateVerifyProblem} from '../../../services/personCenter'
import {GetDictionary} from '../../../services/dictionary'
import {GetEmployees} from '../../../services/employee'
import {GetCurrentUser} from '../../../store/CurrentUser'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

export default {
  data(){
    return{
      client:VueCookies.get("client"),
      loading: true,
      leaders: [],            //“验证人”下拉框
      leaderLoading: false,
      rectEffects: [],        //“整改效果”下拉框
      verifyStatusValues:[],  //“验证状态”下拉框
      problem:[],
      updataProblem: {
        verifyPersonEmpID:'',
        verifyPerson:'',
        verifyDate:'',
        verifyDescription:'',
      },
      rules:{
        verifyPersonEmpID :[{required: true, message: '请输入验证人姓名', trigger: ['blur', 'change']}],
        verifyDate :[{type:'date',required: true, message: '请选择验证时间', trigger: ['blur', 'change']}],
        rectEffect :[{required: true, message: '请选择整改效果', trigger: ['blur', 'change'] }],
      },
      dialogFormVisible: false,
    }
  },
  computed:{
    currentUser(){
      return GetCurrentUser()
    },
  },
  mounted () {
    this.handleGetLeaderSearch()
    this.handleGetProblemDetail() 
    this.handleGetRectEffects()
    this.getTime()
  },
    
  methods:{
    //初始获取验证人，下拉框
    handleGetLeaderSearch (val='') {
      this.leaderLoading = true
      GetEmployees({name: val, type: "all",inputType:'problem_verification'}).then((res) => {
        this.leaders = res.data
        this.leaderLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading = false
      })
    },
    onChanged(selectValue) {
      if(selectValue === ''){
        this.handleGetLeaderSearch()
      }else{
        let obj = {}
         //遍历下拉数组中的item
        obj = this.leaders.find((item)=>{
          return item.employeeID === selectValue
        })
        this.updataProblem.verifyPersonEmpID = obj.employeeID     
        this.updataProblem.verifyPerson = obj.name  
      }
    },
    //根据problemID获取单个问题详细信息
    handleGetProblemDetail () {
      // const id = this.$route.params.id
      //以下两句话，刷新页面时，数据不会丢失，保存了id
      this.$route.params.id && localStorage.setItem('data',JSON.stringify(this.$route.params.id));
      const id = JSON.parse(localStorage.getItem('data'));
      GetPersonalProblemDetail(id).then((res) => {
        this.problem = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    //获取当前时间，显示在验证时间选择器
    getTime(){
      let showDate = new Date();
      let seperator ='-';
      let year = showDate.getFullYear();
      let month = showDate.getMonth() + 1;
      var strDate = showDate.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 1 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      this.updataProblem.verifyDate = year + seperator + month + seperator + strDate;
    },
    // 上传文件之前
    handleBeforeUpload(file){
      let size = file.size / 1024 / 1024 / 12
      if(size > 12) {
        this.$notify.warning({
          title: '警告',
          message: '文件大小必须小于12M'
        })
      }
    },
    //文档图片
    handleRemove() {
      this.formData.attach = null
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response){
      if(response) {
        this.$notify.success({
          body:{
            style:{width:'300px',height:'500px'}
          },
          title:'提示',
          message: '文件上传成功'
        })
        this.updataProblem.verifyAttach = response.data
      }
    },
//确认验证，提交修改,验证通过。
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updataProblem.inputType = 'problem_verification'
          this.updataProblem.status = '已验证'
          this.updataProblem.rectiPersonId = this.problem.rectiPersonId
          this.$message.success('操作成功')
          UpdateVerifyProblem(this.problem.problemID, this.updataProblem).then(() => {
            this.$router.go(-1)     //返回上一url
          }, (err) => {
            this.$message.error(err.message)
          })
        } else {
          this.$notify.warning({
            title: '温馨提示',
            message: '请检查必填项'
          })
          return false;
        }
      })
    },
  //确认验证，提交修改,验证为通过。
    handleSubmitFail (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updataProblem.inputType = 'problem_verification'
          this.updataProblem.status = '验证未通过'
          this.updataProblem.rectiPersonId = this.problem.rectiPersonId
          this.$message.success('操作成功')
          console.log(JSON.stringify( this.updataProblem))
          UpdateVerifyProblem(this.problem.problemID, this.updataProblem).then(() => {
            this.$router.go(-1)     //返回上一url
          }, (err) => {
            this.$message.error(err.message)
          })
        } else {
          this.$notify.warning({
            title: '温馨提示',
            message: '请检查必填项'
          })
          return false;
        }
      })
    },
    //数据字典获取“整改效果”。
    handleGetRectEffects () {
      GetDictionary({name: '整改效果'}).then((res) => {
        this.rectEffects = res.data
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }
  },
}
</script>


<style>
.buttons{
  padding-top:20px;
  display: flex; 
  justify-content: flex-end;
  height: 100px;
  align-items: center; 
  padding-right: 4%;
}
</style>


<style>
/* 图片卡片样式 */
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    height: 100%;
    width: 100%;
    display: block;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
