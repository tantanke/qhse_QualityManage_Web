<template>
  <el-row
    class="main"
    :style="bg"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-row class="head">
      <el-col class="company" :span="6"
        ><span></span>
        <p>{{ showName }}</p>
      </el-col>
      <el-col class="title" :span="4">
        <p>QHSE看板</p>
      </el-col>
      <el-col class="time" :span="3">
        <span>时间：{{ nowdate }}</span>
      </el-col>
      <el-col class="buttons" :span="4">
        <el-col :span="10"
          ><i class="el-icon-arrow-right"></i
          ><span @click="qualitySwiper">质量管理</span></el-col
        >
        <el-col :span="9"
          ><i class="el-icon-arrow-right"></i
          ><span @click="envirSwiper">环保管理</span></el-col
        >
      </el-col>
    </el-row>
    <el-row class="main-item">
      <el-row class="main-item1">
        <el-row class="safeTitle">【安全管理】</el-row>
        <el-col :span="12" class="leftContent">
          <el-row class="safeManage" :style="safeManage">
            <el-row class="contenTitle">事件指标完成进度</el-row>
            <el-row class="content">
              <el-col :span="5" class="conditon">
                <ul class="numbers">
                  <li>总体完成情况</li>
                  <li><img src="./img/jiankong.png" alt="" /></li>
                  <li>本年累计完成</li>
                  <li>{{ eventValues.actualFinishEvent }}个</li>
                  <li><img src="./img/yunwei.png" alt="" /></li>
                  <li>本年累计完成率</li>
                  <li>{{ eventValues.eventFinishRate }}%</li>
                </ul>
              </el-col>
              <el-col :span="19" class="zhuimg1">
                <el-col :span="20" class="left">
                  <el-col class="thingszhu1" :style="eventChart1" :span="5">
                    <p>{{ eventValues.quarterEventIndex }}</p>
                  </el-col>
                  <el-col :span="1" class="ratepoint">
                    <el-row :style="eventpoint">
                      <p>{{ eventValues.eventFinishRate }}%</p>
                      <div></div>
                    </el-row>
                  </el-col>
                  <el-col class="thingszhu2" :style="eventChart2" :span="5">
                    <p>{{ eventValues.actualFinishEvent }}</p>
                  </el-col>
                </el-col>
                <el-col :span="4" class="right">
                  <ul v-for="(v, index) in ratedata" :key="index">
                    <li>{{ v + "%" }}</li>
                  </ul>
                </el-col>
              </el-col>
              <el-row class="tags">
                <el-button class="want"></el-button>
                <span>事件指标</span>
                <el-button class="finish"></el-button>
                <span>实际完成事件</span>
                <el-button class="rate"></el-button>
                <span>完成率</span>
              </el-row>
            </el-row>
          </el-row>
        </el-col>
        <el-col class="rightContent" :span="12" :style="safeManage">
          <el-row class="contenTitle">违章指标完成进度</el-row>
          <el-row class="content">
            <el-col :span="5" class="conditon">
              <ul class="numbers">
                <li>总体完成情况</li>
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计完成</li>
                <li>{{ regulationValues.actualFinishRegulation }}个</li>
                <li><img src="./img/yunwei.png" alt="" /></li>
                <li>本年累计完成率</li>
                <li>{{ regulationValues.finishRegulationRate }}%</li>
              </ul>
            </el-col>
            <el-col :span="19" class="zhuimg1">
              <el-col :span="20" class="left">
                <el-col
                  class="regulationzhu1"
                  :style="regulationChart1"
                  :span="5"
                >
                  <p>{{ regulationValues.quarterRegulationIndex }}</p>
                </el-col>
                <el-col :span="1" class="ratepoint">
                  <!-- 输入top与height即可确定高度-->
                  <el-row :style="regulationpoint">
                    <p>{{ regulationValues.finishRegulationRate }}%</p>
                    <div></div>
                  </el-row>
                </el-col>
                <el-col
                  class="regulationzhu2"
                  :style="regulationChart2"
                  :span="5"
                >
                  <p>{{ regulationValues.actualFinishRegulation }}</p>
                </el-col>
              </el-col>
              <el-col :span="4" class="right">
                <ul v-for="(v, index) in ratedata" :key="index">
                  <li>{{ v + "%" }}</li>
                </ul>
              </el-col>
            </el-col>
            <el-row class="tags">
              <el-button class="want"></el-button>
              <span>违章指标</span>
              <el-button class="finish"></el-button>
              <span>实际完成纠违</span>
              <el-button class="rate"></el-button>
              <span>完成率</span>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="main-item2">
        <el-col class="content1" :span="9" :style="safeManage">
          <el-row class="contenTitle duo">隐患指标完成进度</el-row>
          <el-row class="content">
            <el-col :span="7" class="conditon">
              <ul class="numbers">
                <li>总体完成情况</li>
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计完成</li>
                <li>{{ dangerValues.actualFinishDanger }}个</li>
                <li><img src="./img/yunwei.png" alt="" /></li>
                <li>本年累计完成率</li>
                <li>{{ dangerValues.finishDangerRate }}%</li>
              </ul>
            </el-col>
            <el-col :span="17" class="zhuimg1">
              <el-col :span="24" class="left">
                <el-col class="dangerzhu1" :style="dangerChart1" :span="5">
                  <p>{{ dangerValues.quarterDangerIndex }}</p>
                </el-col>
                <el-col :span="1" :style="dangerpoint" class="ratepoint">
                  <!-- 输入top与height即可确定高度-->
                  <el-row>
                    <p>{{ dangerValues.finishDangerRate }}%</p>
                    <div></div>
                  </el-row>
                </el-col>
                <el-col class="dangerzhu2" :style="dangerChart2" :span="5">
                  <p>{{ dangerValues.actualFinishDanger }}</p>
                </el-col>
              </el-col>
            </el-col>
            <el-row class="tags">
              <el-button class="want"></el-button>
              <span>违章指标</span>
              <el-button class="finish"></el-button>
              <span>实际完成纠违</span>
              <el-button class="rate"></el-button>
              <span>完成率</span>
            </el-row>
          </el-row>
        </el-col>
        <el-col class="content2" :span="9" :style="safeManage">
          <el-row class="contenTitle">安技项目管理</el-row>
          <el-row class="content" @click.native="getDetail()">
            <el-col :span="7" class="conditon">
              <ul class="numbers">
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>项目总体经费</li>
                <li>使用进度</li>
                <li>{{ 11.21 }}%</li>
              </ul>
            </el-col>
            <el-col :span="17" class="zhuimg1"  >
              <el-col :span="24" class="left" >
                <el-col :span="1">
                  <ul v-for="(v, index) in finishrate" :key="index">
                    <li>{{ v }}</li>
                  </ul>
                </el-col>
                <el-col class="finishzhu1" :style="manageChart1" :span="5"
                  ><p>
                    {{
                      project.company.projectLevelCount
                        ? project.company.projectLevelCount
                        : 0
                    }}
                  </p>
                  <p>公司</p></el-col
                >
                <el-col class="finishzhu1" :style="manageChart2"  :span="5"
                  ><p>
                    {{
                      project.kete.projectLevelCount
                        ? project.kete.projectLevelCount
                        : 0
                    }}
                  </p>
                  <p>科特</p></el-col
                >
                <el-col class="finishzhu1" :style="manageChart3"  :span="5"
                  ><p>
                    {{
                      project.safe.projectLevelCount
                        ? project.safe.projectLevelCount
                        : 0
                    }}
                  </p>
                  <p>安检院</p></el-col
                >
              </el-col>
            </el-col>
            <el-row class="tags">
              <el-button class="rate"></el-button>
              <span>项目级别</span>
            </el-row>
          </el-row>
        </el-col>
        <el-col class="content3" :span="6" :style="safeManage">
          <el-row class="contenTitle">百万工时</el-row>
          <el-row class="item1">
            <el-col :span="6" class="ctitle1">
              <p><span>月</span>度</p>
              <p>累计工时</p>
            </el-col>
            <el-col :span="10" class="item2content">
              <p>
                <span>{{ millionData.monthValue }}</span
                ><span>小时</span>
              </p>
            </el-col>
          </el-row>
          <el-row class="item2">
            <el-col :span="6" class="ctitle1">
              <p><span>2020年</span></p>
              <p>累计工时</p>
            </el-col>
            <el-col :span="10" class="item2content">
              <p>
                <span>{{ millionData.yearValue }}</span
                ><span>小时</span>
              </p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <el-dialog
      title="安技项目管理详情"
      :visible.sync="detailshow"
      :modal="false"
      width="60%"
    >
      <safe-index :level='level' />
    </el-dialog>
  </el-row>
</template>

<script>
import axios from "axios";
import {
  queryDashboardSecurity, // 总管理
  queryDashboardSecurityProjectCount, //安技项目管理
  queryDashboardSecurityMillion, //百万工时
} from "@/services/qhseDashboard/index";
export default {
  components: {
    safeIndex: () => import("./safeindex"),
  },
  props: {
    date: String,
  },
  data() {
    return {
      level:'',
      showName: "安全环保质量监督检测研究院",
      finishrate: [10, 8, 6, 4, 2, 0],
      ratedata: [100, 80, 60, 40, 20, 0],
      bg: {
        backgroundImage: "url(" + require("./img/bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      // 记录各种值
      //安技项目管理
      project: {
        kete: {},
        safe: {},
        company: {},
      },
      //事件指标
      eventValues: {
        actualFinishEvent: "",
        quarterEventIndex: "",
        eventFinishRate: "",
      },
      //违章指标
      regulationValues: {
        actualFinishRegulation: "",
        finishRegulationRate: "",
        quarterRegulationIndex: "",
      },
      //隐患指标
      dangerValues: {
        actualFinishDanger: "",
        quarterDangerIndex: "",
        finishDangerRate: "",
      },
      safeManage: {
        backgroundImage: "url(" + require("./img/hdbj.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      // 事件完成指标
      eventChart1: {
        height: "10%",
        top: "90%",
      },
      eventChart2: {
        height: "10%",
        top: "90%",
      },
      //从最底下开始计算 -100代表100%
      eventpoint: {
        top: "-100%",
      },
      dangerpoint: {
        top: "0%",
      },
      //违章指标完成进度
      regulationChart1: {
        height: "10%",
        top: "90%",
      },
      regulationChart2: {
        height: "30%",
        top: "70%",
      },
      regulationpoint: {
        top: "-100%",
      },
      // 隐患指标完成进度
      dangerChart1: {
        height: "10%",
        top: "90%",
      },
      dangerChart2: {
        height: "10%",
        top: "90%",
      },
      //安技项目管理
      manageChart1: {
        height: "0.1%",
        top: "99.9%",
      },
      manageChart2: {
        height: "0.1%",
        top: "99.9%",
      },
      manageChart3: {
        height: "0.1%",
        top: "99.9%",
      },
      //百万工时
      millionData: {
        monthValue: 0,
        yearValue: 0,
      },
      serForm: {
        companyCode: "",
      },
      detailshow: false,
    };
    //查找表单
  },
  computed: {
    nowdate() {
      return this.date;
    },
  },
  methods: {
    getDetail(data) {
     if(data === 0) this.level = "公司"
      if(data === 1) this.level = "科特"
       if(data === 2) this.level = "安检院"
      this.detailshow = true;
    },
    getcode() {
      this.serForm.companyCode = this.$route.query.companyCode;
      if (this.$route.query.companyName) {
        this.showName =
          this.$route.query.companyName.length > 10
            ? this.$route.query.companyName.split("（")[0]
            : this.$route.query.companyName;
      }
    },
    // 提交自定义事件
    qualitySwiper() {
      this.$emit("changeQuality", 2);
    },
    envirSwiper() {
      this.$emit("changeEnvir", 1);
    },
    initsecurityData(data) {
      //事件
      console.log(data);
      this.eventValues.actualFinishEvent = data.actualFinishEvent
        ? data.actualFinishEvent
        : 0;
      this.eventValues.quarterEventIndex = data.quarterEventIndex
        ? data.quarterEventIndex
        : 0;
      this.eventValues.eventFinishRate = data.eventFinishRate
        ? (data.quarterEventIndex * 100).toFixed(2)
        : "0.00";
      // 违章
      this.regulationValues.actualFinishRegulation = data.actualFinishRegulation
        ? data.actualFinishRegulation
        : 0;
      this.regulationValues.quarterRegulationIndex = data.quarterRegulationIndex
        ? data.quarterRegulationIndex
        : 0;
      this.regulationValues.finishRegulationRate = data.finishRegulationRate
        ? (data.finishRegulationRate * 100).toFixed(2)
        : "0.00";
      // 隐患
      this.dangerValues.actualFinishDanger = data.actualFinishDanger
        ? data.actualFinishDanger
        : 0;
      this.dangerValues.quarterDangerIndex = data.quarterDangerIndex
        ? data.quarterDangerIndex
        : 0;
      this.dangerValues.finishDangerRate = data.finishDangerRate
        ? (data.finishDangerRate * 100).toFixed(2)
        : "0.00";
      // 初始化柱状图
      // 违章
      let regulation1 = Math.ceil(
        (data.quarterRegulationIndex / (data.quarterRegulationIndex * 1.5)) *
          100
      );
      this.regulationChart1.top = 100 - regulation1 + "%";
      this.regulationChart1.height = regulation1 + "%";
      let regulation2 = Math.ceil(
        (data.actualFinishRegulation / (data.quarterRegulationIndex * 1.5)) *
          100
      );
      this.regulationChart2.top = 100 - regulation2 + "%";
      this.regulationChart2.height = regulation2 + "%";
      //事件
      let event1 = Math.ceil(
        (data.quarterEventIndex / (data.quarterEventIndex * 1.4)) * 100
      );
      this.eventChart1.top = 100 - event1 + "%";
      this.eventChart1.height = event1 + "%";
      let event2 = Math.ceil(
        (data.actualFinishEvent / (data.quarterEventIndex * 1.4)) * 100
      );
      this.eventChart2.top = 100 - event2 + "%";
      this.eventChart2.height = event2 + "%";
      //隐患
      let danger1 = Math.ceil(
        (data.quarterDangerIndex / (data.quarterDangerIndex * 1.3)) * 100
      );
      this.dangerChart1.top = 100 - danger1 + "%";
      this.dangerChart1.height = danger1 + "%";

      let danger2 = Math.ceil(
        (data.actualFinishDanger / (data.quarterDangerIndex * 1.3)) * 100
      );
      this.dangerChart2.top = 100 - danger2 + "%";
      this.dangerChart2.height = danger2 + "%";
      // 概率计算
      this.regulationpoint.top =
        -this.regulationValues.finishRegulationRate + "%";
      this.eventpoint.top = -this.eventValues.eventFinishRate + "%";
      this.dangerpoint.top = this.regulationValues.finishRegulationRate + "%";
    },
    initmillionData(data) {
      this.millionData.monthValue = data.monthSubtotal ? data.monthSubtotal : 0;
      this.millionData.yearValue = data.yearSubtotal ? data.yearSubtotal : 0;
    },
    initprojectCountData(data) {
      data.forEach((v) => {
        if (v.projectLevel === "公司") {
          this.project.company = v;
        } else if (v.projectLevel === "安检院") {
          this.project.safe = v;
        } else {
          this.project.kete = v;
        }
      });
      this.changeRate();
      if (this.project.company.projectLevelCount) {
        let company = Math.ceil(
          (this.project.company.projectLevelCount / this.finishrate[0]) * 100
        );
        this.manageChart1.height = company + "%";
        this.manageChart1.top = 100 - company + "%";
      }
      if (this.project.kete.projectLevelCount) {
        let kete = Math.ceil(
          (this.project.company.projectLevelCount / this.finishrate[0]) * 100
        );
        this.manageChart1.height = kete + "%";
        this.manageChart1.top = 100 - kete + "%";
      }
      if (this.project.safe.projectLevelCount) {
        let safe = Math.ceil(
          (this.project.company.projectLevelCount / this.finishrate[0]) * 100
        );
        this.manageChart1.height = safe + "%";
        this.manageChart1.top = 100 - safe + "%";
      }
    },
    changeRate() {
      if (
        this.project.company.projectLevelCount > this.finishrate[0] ||
        this.project.kete.projectLevelCount > this.finishrate[0] ||
        this.project.safe.projectLevelCount > this.finishrate[0]
      ) {
        let rate = this.finishrate[0] * 2;
        this.finishrate = [
          rate,
          rate * 0.8,
          rate * 0.6,
          rate * 0.4,
          rate * 0.2,
          rate * 0,
        ];
      }
    },
     upDateData(){
      let _this = this
      setInterval(()=>{
        _this.getData()
      },360000)
    },
    getData() {
      let _this = this;
      axios
        .all([
          queryDashboardSecurity(this.serForm),
          queryDashboardSecurityMillion(this.serForm),
          queryDashboardSecurityProjectCount(this.serForm),
        ])
        .then(
          axios.spread(function(securityData, millionData, projectCountData) {
            _this.initsecurityData(securityData.data);
            _this.initmillionData(millionData.data);
            _this.initprojectCountData(projectCountData.data);
          })
        )
        .catch((err) => {
          _this.$message.error(err.message);
        });
    },
  },
  mounted() {
    this.getcode();
    this.getData();
    this.upDateData();
  },
};
</script>

<style lang="scss" scoped>
@import "./style/safeManage.scss";
</style>
