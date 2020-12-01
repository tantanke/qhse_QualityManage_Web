<template>
  <el-row
    class="main"
    :style="bg"
    v-loading="screenLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-row class="head">
      <el-col class="company" :span="6">
        <span></span>
        <p>{{ showName }}</p>
      </el-col>
      <el-col class="title" :span="4">
        <p>QHSE看板</p>
      </el-col>
      <el-col class="time" :span="3">
        <span>时间：{{nowdate }}</span>
      </el-col>
      <el-col class="buttons" :span="4">
      <!--使用自定义事件把需要改变的值传给父组件 -->
        <el-col :span="10">
          <i class="el-icon-arrow-right"></i>
          <span @click="safeSwiper">安全管理</span>
        </el-col>
        <el-col :span="9">
          <i class="el-icon-arrow-right"></i>
          <span @click="envirSwiper">环保管理</span>
        </el-col>
      </el-col>
    </el-row>
    <el-row class="main-item1">
      <el-col :span="12" class="rightContent">
        <el-row class="title">【质量管理】</el-row>
        <el-row class="qualityManage" :style="progress">
          <el-row class="contenTitle">质量报告计划进度</el-row>
          <el-row class="content">
            <el-col :span="6">
              <ul>
                <li>总体完成情况</li>
                <li>
                  <img src="./img/jiankong.png" alt />
                </li>
                <li>本年累计完成</li>
                <li>{{ values.qualityzhu2 }}个</li>
                <li>
                  <img src="./img/yunwei.png" alt />
                </li>
                <li>完成进度</li>
                <li>{{ rates.qualityzhu }}</li>
              </ul>
            </el-col>
            <el-col :span="18">
              <el-row class="qualityManageChart">
                <el-col :span="3">
                  <ul v-for="(value, index) in qualitylistdata" :key="index">
                    <li>
                      <span>{{ value }}</span>
                    </li>
                  </ul>
                </el-col>
                <el-col :span="17" class="zhuImage">
                  <el-row>
                    <el-col :span="4" style="color:#021151">.</el-col>
                    <el-col :span="6" class="zhu1" :style="qualityzhu1">
                      <p>{{ values.qualityzhu1 }}</p>
                    </el-col>
                    <el-col :span="4" class="point">
                      <div class="rateArea" :style="qualityzhuRate">
                        <div class="finishrate" plain style="color:#021151">
                          .
                        </div>
                        <div>
                          <span>{{ rates.qualityzhu }}</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6" class="zhu2" :style="qualityzhu2">
                      <p>{{ values.qualityzhu2 }}</p>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <ul v-for="(value, index) in ratedata1" :key="index">
                    <li>
                      <span>{{ value }}</span>
                    </li>
                  </ul>
                </el-col>
              </el-row>
              <el-row class="date">{{ qualityDate }}</el-row>
              <el-row class="tags">
                <el-col :span="7" style="color:#021151">.</el-col>
                <el-col :span="3">
                  <el-button class="will" plain></el-button>
                  <span>计划数</span>
                </el-col>
                <el-col :span="3">
                  <el-button class="finish" plain></el-button>
                  <span>完成数</span>
                </el-col>
                <el-col :span="3">
                  <el-button class="finishrate" plain></el-button>
                  <span>完成率</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="12" class="leftContent">
        <el-row class="title">【记录仪管理】</el-row>
        <el-row class="recording" :style="progress">
          <el-row class="contenTitle">本月记录仪使用情况</el-row>
          <el-row class="recordingManageChart">
            <el-col :span="3">
              <ul v-for="(value, index) in recordinglistdata" :key="index">
                <li>
                  <span>{{ value }}</span>
                </li>
              </ul>
            </el-col>
            <el-col :span="17" class="zhuImage">
              <el-row>
                <el-col :span="4" style="color:#021151">.</el-col>
                <el-col :span="4" class="zhu1" :style="recordingzhu1">
                  <p>{{ values.recordingzhu1 }}</p>
                </el-col>
                <el-col :span="3" class="point">
                  <div class="rateArea" :style="recordingzhuRate">
                    <div class="finishrate" plain style="color:#021151">.</div>
                    <div>
                      <span>{{ rates.recordingzhu }}</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4" class="zhu2" :style="recordingzhu2">
                  <p>{{ values.recordingzhu2 }}</p>
                </el-col>
                <el-col :span="3" style="color:#021151">.</el-col>
                <el-col :span="4" class="zhu3" :style="recordingzhu3">
                  <p>{{ values.recordingzhu3 }}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3">
              <ul v-for="(value, index) in ratedata1" :key="index">
                <li>
                  <span>{{ value }}</span>
                </li>
              </ul>
            </el-col>
          </el-row>
          <el-row class="tags">
            <el-col :span="8" style="color:#021151">.</el-col>
            <el-col :span="4">
              <el-button class="will" plain></el-button>
              <span>领用数</span>
            </el-col>
            <el-col :span="4">
              <el-button class="finish" plain></el-button>
              <span>正常开机数</span>
            </el-col>
            <el-col :span="4">
              <el-button class="jiankong" plain></el-button>
              <span>监控查看数</span>
            </el-col>
            <el-col :span="4">
              <el-button class="finishrate" plain></el-button>
              <span>使用比</span>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="main-item2">
      <el-row class="title">【标准进度管理】</el-row>
      <el-row class="mainContent">
        <el-col class="leftItem" :span="8">
          <el-row class="item-title"></el-row>
          <el-row class="content" :style="progress">
            <el-row class="contenTitle">初稿完成进度</el-row>
            <el-row class="qualityManageChart">
              <el-col :span="3">
                <ul v-for="(value, index) in firstlistdata" :key="index">
                  <li>
                    <span>{{ value }}</span>
                  </li>
                </ul>
              </el-col>
              <el-col :span="17" class="zhuImage">
                <el-row>
                  <el-col :span="4" style="color:#021151">.</el-col>
                  <el-col :span="6" class="zhu1" :style="firstzhu1">
                    <p>{{ values.firstzhu1 }}</p>
                  </el-col>
                  <el-col :span="4" class="point">
                    <div class="rateArea" :style="firstzhuRate">
                      <div class="finishrate" plain style="color:#021151">
                        .
                      </div>
                      <div>
                        <span>{{ rates.firstzhu }}</span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6" class="zhu2" :style="firstzhu2">
                    <p>{{ values.firstzhu2 }}</p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="3">
                <ul v-for="(value, index) in ratedata1" :key="index">
                  <li>
                    <span>{{ value }}</span>
                  </li>
                </ul>
              </el-col>
            </el-row>
            <el-row class="date">{{ standardDate }}</el-row>
            <el-row class="tags">
              <el-col :span="9" style="color:#021151">.</el-col>
              <el-col :span="4">
                <el-button class="will" plain></el-button>
                <span>计划数</span>
              </el-col>
              <el-col :span="4">
                <el-button class="finish" plain></el-button>
                <span>完成数</span>
              </el-col>
              <el-col :span="4">
                <el-button class="finishrate" plain></el-button>
                <span>完成率</span>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
        <el-col class="midItem" :span="8">
          <el-row class="item-title"></el-row>
          <el-row class="content" :style="progress">
            <el-row class="contenTitle">评审通过进度</el-row>
            <el-row class="qualityManageChart">
              <el-col :span="3">
                <ul v-for="(value, index) in firstlistdata" :key="index">
                  <li>
                    <span>{{ value }}</span>
                  </li>
                </ul>
              </el-col>
              <el-col :span="17" class="zhuImage">
                <el-row>
                  <el-col :span="4" style="color:#021151">.</el-col>
                  <el-col :span="6" class="zhu1" :style="passzhu1">
                    <p>{{ values.passzhu1 }}</p>
                  </el-col>
                  <el-col :span="4" class="point">
                    <div class="rateArea" :style="passzhuRate">
                      <div class="finishrate" plain style="color:#021151">
                        .
                      </div>
                      <div>
                        <span>{{ rates.passzhu }}</span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6" class="zhu2" :style="passzhu2">
                    <p>{{ values.passzhu2 }}</p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="3">
                <ul v-for="(value, index) in ratedata1" :key="index">
                  <li>
                    <span>{{ value }}</span>
                  </li>
                </ul>
              </el-col>
            </el-row>
            <el-row class="date">{{ standardDate }}</el-row>
            <el-row class="tags">
              <el-col :span="9" style="color:#021151">.</el-col>
              <el-col :span="4">
                <el-button class="will" plain></el-button>
                <span>计划数</span>
              </el-col>
              <el-col :span="4">
                <el-button class="finish" plain></el-button>
                <span>完成数</span>
              </el-col>
              <el-col :span="4">
                <el-button class="finishrate" plain></el-button>
                <span>完成率</span>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
        <el-col class="rightItem" :span="8">
          <el-row class="item-title"></el-row>
          <el-row class="content" :style="progress">
            <el-row class="contenTitle">标准发布进度</el-row>
            <el-row class="qualityManageChart">
              <el-col :span="3">
                <ul v-for="(value, index) in firstlistdata" :key="index">
                  <li>
                    <span>{{ value }}</span>
                  </li>
                </ul>
              </el-col>
              <el-col :span="17" class="zhuImage">
                <el-row>
                  <el-col :span="4" style="color:#021151">.</el-col>
                  <el-col :span="6" class="zhu1" :style="handoutzhu1">
                    <p>{{ values.handoutzhu1 }}</p>
                  </el-col>
                  <el-col :span="4" class="point">
                    <div class="rateArea" :style="handoutzhuRate">
                      <div class="finishrate" plain style="color:#021151">
                        .
                      </div>
                      <div>
                        <span>{{ rates.handoutzhu }}</span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6" class="zhu2" :style="handoutzhu2">
                    <p>{{ values.handoutzhu2 }}</p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="3">
                <ul v-for="(value, index) in ratedata1" :key="index">
                  <li>
                    <span>{{ value }}</span>
                  </li>
                </ul>
              </el-col>
            </el-row>
            <el-row class="date">{{ standardDate }}</el-row>
            <el-row class="tags">
              <el-col :span="9" style="color:#021151">.</el-col>
              <el-col :span="4">
                <el-button class="will" plain></el-button>
                <span>计划数</span>
              </el-col>
              <el-col :span="4">
                <el-button class="finish" plain></el-button>
                <span>完成数</span>
              </el-col>
              <el-col :span="4">
                <el-button class="finishrate" plain></el-button>
                <span>完成率</span>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import CurrentUser from "../../store/CurrentUser";
import axios from "axios";
import {
  queryDashboardQualityManagement,
  queryDashboardRecorderManagement,
  queryDashboardScheduleManagement,
} from "@/services/qhseDashboard/index";
export default {
   props:{
    date: String,

  },
  data() {
    
    return {
      // 背景样式
      // Y轴计算
      qualitylistdata: [],
      recordinglistdata: [],
      firstlistdata: [],
      //百分比样式
      ratedata1: ["100%", "80%", "60%", "40%", "20%", "0%"],
      bg: {
        backgroundImage: "url(" + require("./img/bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      // 质量管理背景
      quality: {
        backgroundImage: "url(" + require("./img/hdbj.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      //日期记录
      qualityDate: "",
      standardDate: "",
      //所有的值记录
      values: {
        qualityzhu1: "",
        qualityzhu2: "",
        recordingzhu1: "",
        recordingzhu2: "",
        recordingzhu3: "",
        firstzhu1: "",
        firstzhu2: "",
        passzhu1: "",
        passzhu2: "",
        handoutzhu1: "",
        handoutzhu2: "",
      },
      rates: {
        qualityzhu: "",
        recordingzhu: "",
        firstzhu: "",
        passzhu: "",
        handoutzhu: "",
      },
      // 质量柱状图数据 只需要获得已使用占总数的百分比填入
      qualityzhu1: {
        height: "",
        top: "",
      },
      qualityzhu2: {
        height: "",
        top: "",
      },
      qualityzhuRate: {
        top: "",
      },
      // 记录管理
      recording: {
        backgroundImage: "url(" + require("./img/hdbj.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      // 记录管理柱状图
      recordingzhu1: {
        height: "",
        top: "",
      },
      recordingzhu2: {
        height: "",
        top: "",
      },
      recordingzhu3: {
        height: "",
        top: "",
      },
      recordingzhuRate: {
        height: "",
        top: "",
      },
      // 进度管理背景
      progress: {
        backgroundImage: "url(" + require("./img/mbox1.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },

      //初稿完成进度
      firstzhu1: {
        height: "",
        top: "",
      },
      firstzhu2: {
        height: "",
        top: "",
      },
      firstzhuRate: {
        top: "",
      },
      //评审通过进度
      passzhu1: {
        height: "",
        top: "",
      },
      passzhu2: {
        height: "",
        top: "",
      },
      passzhuRate: {
        top: "",
      },
      //标准发布进度
      handoutzhu1: {
        height: "",
        top: "",
      },
      handoutzhu2: {
        height: "",
        top: "",
      },
      handoutzhuRate: {
        top: "",
      },
      icon1: {
        backgroundImage: "url(" + require("./img/jiankong.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      icon2s: {
        backgroundImage: "url(" + require("./img/yunwei.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      time: "加载中...",
      // 公司编码
      serForm: {
        companycode: "",
      },
      screenLoading: true,
      finishnum: 1,
      // 公司名称
      showName: "安全环保质量监督检测研究院",
    };
  },
  methods: {
    // 采用动态生成游标的方式 避免太低
    getYnum(data, name, rate) {
      let topdata = Math.ceil((data * 1.5) / rate) * rate;
      let listdata = [
        topdata,
        topdata * 0.8,
        topdata * 0.6,
        topdata * 0.4,
        topdata * 0.2,
        0,
      ];
      this[name] = listdata;
    },
    // 初始化柱状图
    initQualityBarchart(data) {
      let _this = this;
      let {
        monthFinishRate,
        updateTime,
        monthFinishNum,
        monthPlanNum,
      } = data[0];
      // 数值
      _this.getYnum(monthPlanNum, "qualitylistdata", 10);
      monthFinishRate = monthFinishRate > 100 ? 100 : monthFinishRate;
      _this.rates.qualityzhu = monthFinishRate.toFixed(2) + "%";
      _this.values.qualityzhu1 = monthPlanNum;
      _this.values.qualityzhu2 = monthFinishNum;
      // 计算柱状图1
      let zhuheight1 = Math.ceil(
        (monthPlanNum / _this.qualitylistdata[0]) * 100
      ); // 至少保留1
      let zhutop1 = 100 - zhuheight1;
      _this.qualityzhu1.height = zhuheight1 + "%";
      _this.qualityzhu1.top = zhutop1 + "%";
      // 计算柱状图2
      let zhuheight2 = Math.ceil(
        (monthFinishNum / _this.qualitylistdata[0]) * 100
      ); // 至少保留1
      let zhutop2 = 100 - zhuheight2;
      _this.qualityzhu2.height = zhuheight2 + "%";
      _this.qualityzhu2.top = zhutop2 + "%";
      //计算点位
      if (monthFinishRate < 15) monthFinishRate = 15;
      _this.qualityzhuRate.top = 100 - monthFinishRate + 15 + "%";
      _this.qualityDate = updateTime;
      if (!--this.finishnum) {
        this.screenLoading = false;
      }
    },
    initRecordingBarchart(data) {
      let _this = this;
      let {
        weeklyCollectNum,
        weeklyNormalNum,
        weeklySupervisionNum,
        weeklyUsageRate,
      } = data[0];
      // 数值
      _this.getYnum(weeklyCollectNum, "recordinglistdata", 10);
      weeklyUsageRate = weeklyUsageRate * 100 > 100 ? 1 : weeklyUsageRate;
      _this.rates.recordingzhu = (weeklyUsageRate * 100).toFixed(2) + "%";
      _this.values.recordingzhu1 = weeklyCollectNum;
      _this.values.recordingzhu2 = weeklyNormalNum;
      _this.values.recordingzhu3 = weeklySupervisionNum;
      // 计算柱状图1
      let zhuheight1 = Math.ceil(
        (weeklyCollectNum / _this.recordinglistdata[0]) * 100
      ); // 至少保留1
      let zhutop1 = 100 - zhuheight1;
      _this.recordingzhu1.height = zhuheight1 + "%";
      _this.recordingzhu1.top = zhutop1 + "%";
      // 计算柱状图2
      let zhuheight2 = Math.ceil(
        (weeklyNormalNum / _this.recordinglistdata[0]) * 100
      ); // 至少保留1
      let zhutop2 = 100 - zhuheight2;
      _this.recordingzhu2.height = zhuheight2 + "%";
      _this.recordingzhu2.top = zhutop2 + "%";
      // 计算柱状图3
      let zhuheight3 = Math.ceil(
        (weeklySupervisionNum / _this.recordinglistdata[0]) * 100
      ); // 至少保留1
      let zhutop3 = 100 - zhuheight3;
      _this.recordingzhu3.height = zhuheight3 + "%";
      _this.recordingzhu3.top = zhutop3 + "%";
      //计算点位
      if (weeklyUsageRate < 0.14) weeklyUsageRate = 0.14;
      _this.recordingzhuRate.top = 100 - weeklyUsageRate * 100 + 14 + "%";
      if (!--this.finishnum) {
        this.screenLoading = false;
      }
    },
    initProgresstBarchart(data) {
      let _this = this;
      let {
        planNum,
        firstDraftFinishNum,
        firstDraftFinishRate,
        reviewPassNum,
        reviewPassRate,
        standardReleaseNum,
        standardReleaseRate,
        updateTime,
      } = data[0];
      _this.getYnum(planNum, "firstlistdata", 10);
      //百分比
      _this.standardDate = updateTime;
      firstDraftFinishRate =
        firstDraftFinishRate * 100 > 100 ? 1 : firstDraftFinishRate;
      reviewPassRate = reviewPassRate * 100 > 100 ? 1 : reviewPassRate;
      standardReleaseRate =
        standardReleaseRate * 100 > 100 ? 1 : standardReleaseRate;
      _this.rates.firstzhu = (firstDraftFinishRate * 100).toFixed(2) + "%";
      _this.rates.passzhu = (reviewPassRate * 100).toFixed(2) + "%";
      _this.rates.handoutzhu = (standardReleaseRate * 100).toFixed(2) + "%";
      //柱状图的值
      _this.values.firstzhu1 = planNum;
      _this.values.handoutzhu1 = planNum;
      _this.values.passzhu1 = planNum;
      _this.values.firstzhu2 = firstDraftFinishNum;
      _this.values.passzhu2 = reviewPassNum;
      _this.values.handoutzhu2 = standardReleaseNum;
      // 计算柱状图1
      let zhuheight1 = Math.ceil((planNum / _this.firstlistdata[0]) * 100); // 至少保留1
      let zhutop1 = 100 - zhuheight1;
      _this.firstzhu1.height = zhuheight1 + "%";
      _this.firstzhu1.top = zhutop1 + "%";
      _this.passzhu1.height = zhuheight1 + "%";
      _this.passzhu1.top = zhutop1 + "%";
      _this.handoutzhu1.height = zhuheight1 + "%";
      _this.handoutzhu1.top = zhutop1 + "%";
      // 计算柱状图1-2
      let zhuheight12 = Math.ceil(
        (firstDraftFinishNum / _this.firstlistdata[0]) * 100
      ); // 至少保留1
      let zhutop12 = 100 - zhuheight12;
      _this.firstzhu2.height = zhuheight12 + "%";
      _this.firstzhu2.top = zhutop12 + "%";
      // 计算柱状图2-2
      let zhuheight22 = Math.ceil(
        (reviewPassNum / _this.firstlistdata[0]) * 100
      ); // 至少保留1
      let zhutop22 = 100 - zhuheight22;
      _this.passzhu2.height = zhuheight22 + "%";
      _this.passzhu2.top = zhutop22 + "%";
      // 计算柱状图3-2
      let zhuheight32 = Math.ceil(
        (standardReleaseNum / _this.firstlistdata[0]) * 100
      ); // 至少保留1
      let zhutop32 = 100 - zhuheight32;
      _this.handoutzhu2.height = zhuheight32 + "%";
      _this.handoutzhu2.top = zhutop32 + "%";
      //计算点位
      if (standardReleaseRate < 0.14) standardReleaseRate = 0.14;
      if (reviewPassRate < 0.14) reviewPassRate = 0.14;
      if (firstDraftFinishRate < 0.14) firstDraftFinishRate = 0.14;
      _this.firstzhuRate.top = 100 - firstDraftFinishRate * 100 + 14 + "%";
      _this.passzhuRate.top = 100 - reviewPassRate * 100 + 14 + "%";
      _this.handoutzhuRate.top = 100 - standardReleaseRate * 100 + 14 + "%";
      if (!--this.finishnum) {
        this.screenLoading = false;
      }
    },
    confirmToken() {
      if (!CurrentUser.get()) {
        this.$message.error("请登录!");
        this.$router.push({ name: "Login" });
      }
      this.serForm.companyCode = this.$route.query.companyCode;
    },
    getdata() {
      let _this = this;
      _this.confirmToken();
      axios
        .all([
          queryDashboardScheduleManagement(_this.serForm),
          queryDashboardQualityManagement(_this.serForm),
          queryDashboardRecorderManagement(_this.serForm),
        ])
        .then(
          axios.spread(function(progressData, qualityData, recordData) {
            // 两个请求现在都执行完成
            if (
              qualityData.data.length > 0 &&
              recordData.data.length > 0 &&
              progressData.data.length > 0
            ) {
              _this.initQualityBarchart(qualityData.data);
              _this.initRecordingBarchart(recordData.data);
              _this.initProgresstBarchart(progressData.data);
            } else {
              _this.$alert(
                "该单位数据未录入完全！请录入之后重试！",
                "温馨提示",
                {
                  confirmButtonText: "确定",
                  type: "warning",
                  showClose: false,
                  callback: () => {
                    window.open("about:blank", "_self").close();
                  },
                }
              );
            }
          })
        )
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    updateData() {
      setInterval(() => {
        this.getdata();
      }, 10000);
    },
    // 提交自定义事件
     safeSwiper(){
        this.$emit('changeSafe', 0);

     },
     envirSwiper(){
        this.$emit('changeEnvir', 1);
     }
  },

  computed: {
    nowdate(){
    return this.date
  }
  },
  mounted() {
    if (this.$route.query.companyName) {
      this.showName =
        this.$route.query.companyName.length > 10
          ? this.$route.query.companyName.split("（")[0]
          : this.$route.query.companyName;
    }
    let _this = this;
    _this.confirmToken();
    _this.getdata();
    /* _this.updateData(); */
  },
};
</script>

<style lang="scss" scoped>
@import "./style/qualityBoard.scss";
</style>
