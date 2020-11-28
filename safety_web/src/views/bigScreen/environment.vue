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
        <p>{{ 11 }}</p>
      </el-col>
      <el-col class="title" :span="4">
        <p>QHSE看板</p>
      </el-col>
      <el-col class="time" :span="3">
        <span>时间：{{ 11 }}</span>
      </el-col>
      <el-col class="buttons" :span="4">
        <el-col :span="10"
          ><i class="el-icon-arrow-right"></i><span>安全管理</span></el-col
        >
        <el-col :span="9"
          ><i class="el-icon-arrow-right"></i><span>环保管理</span></el-col
        >
      </el-col>
    </el-row>
    <el-row class="mainContent">
      <el-row class="title">【环保节能管理】</el-row>
      <el-col :span="9" class="leftContent">
        <el-row class="item" :style="safeManage">
          <el-row class="contenTitle">水消耗量</el-row>
          <el-row class="content">
            <el-col :span="5">
              <ul class="info">
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计消耗量</li>
                <li>{{ 11 }}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="15" class="zhuimgs">
              <el-col :span="5" class="rate">
                <ul v-for="(v, index) in ratedata1" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="5" class="point">
                <div :style="waterPoint">
                  <p>1</p>
                  <el-button></el-button>
                </div>
              </el-col>
              <el-row class="date">
                2020-06
              </el-row>
            </el-col>
          </el-row>
        </el-row>
        <el-row class="item" :style="safeManage">
          <el-row class="contenTitle">气消耗量</el-row>
          <el-row class="content">
            <el-col :span="5">
              <ul class="info">
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计消耗量</li>
                <li>{{ 11 }}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="15" class="zhuimgs">
              <el-col :span="5" class="rate">
                <ul v-for="(v, index) in ratedata1" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="5" class="point">
                <div :style="o2Point">
                  <p>1</p>
                  <el-button></el-button>
                </div>
              </el-col>
              <el-row class="date">
                2020-06
              </el-row>
            </el-col>
          </el-row>
        </el-row>
        <el-row class="item" :style="safeManage">
          <el-row class="contenTitle">电消耗量</el-row>
          <el-row class="content">
            <el-col :span="5">
              <ul class="info">
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计消耗量</li>
                <li>{{ 11 }}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="15" class="zhuimgs">
              <el-col :span="5" class="rate">
                <ul v-for="(v, index) in ratedata1" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="5" class="point">
                <div :style="elcPoint">
                  <p>1</p>
                  <el-button></el-button>
                </div>
              </el-col>
              <el-row class="date">
                2020-06
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="6" class="midContent">
        <el-row class="item" :style="safeManage">
          <el-row class="contenTitle">污水量</el-row>
          <el-row class="content">
            <el-row class="content1">
              <el-col :span="8" class="left">
                <p>月度</p>
                <p>累计污水量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">1</span><span class="danwei">m3</span>
              </el-col>
            </el-row>

            <el-row class="content1">
              <el-col :span="8" class="left">
                <p>季度</p>
                <p>累计污水量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">1</span><span class="danwei">m3</span>
              </el-col>
            </el-row>
            <el-row class="content1">
              <el-col :span="8" class="left">
                <p><span style="color:#00FFFF">2020</span>年度</p>
                <p>累计污水量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">1</span><span class="danwei">m3</span>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
        <el-row class="item" :style="safeManage">
          <el-row class="contenTitle contenTitleduo">污水转运处置量</el-row>
          <el-row class="content">
            <el-row class="content1">
              <el-col :span="8" class="left">
                <p>月度累计</p>
                <p>污水转运量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">1</span><span class="danwei">m3</span>
              </el-col>
            </el-row>

            <el-row class="content1">
              <el-col :span="8" class="left">
                <p>季度累计</p>
                <p>污水转运量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">1</span><span class="danwei">m3</span>
              </el-col>
            </el-row>
            <el-row class="content1">
              <el-col :span="8" class="left">
                <p><span style="color:#00FFFF">2020</span>年度累计</p>
                <p>污水转运量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">1</span><span class="danwei">m3</span>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="9" class="rightContent">
        <el-row class="item" :style="safeManage">
          <el-row class="contenTitle">油料（汽油）消耗量</el-row>
          <el-row class="content">
            <el-col :span="5">
              <ul class="info">
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计消耗量</li>
                <li>{{ 11 }}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="15" class="zhuimgs ">
              <el-col :span="5">
                <ul v-for="(v, index) in ratedata2" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="3" class="point">
                <el-row :style="oilPoint1">
                  <p>1158</p>
                  <el-button></el-button>
                </el-row>
              </el-col>
              <p class="date">2020-06</p>
            </el-col>
          </el-row>
        </el-row>
        <el-row class="item" :style="safeManage">
          <el-row class="contenTitle">油料（柴油）消耗量</el-row>
          <el-row class="content">
            <el-col :span="5">
              <ul class="info">
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计消耗量</li>
                <li>{{ 11 }}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="15" class="zhuimgs ">
              <el-col :span="5">
                <ul v-for="(v, index) in ratedata2" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="3" class="point">
                <el-row :style="oilPoint2">
                  <p>1158</p>
                  <el-button></el-button>
                </el-row>
              </el-col>
              <p class="date">2020-06</p>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      ratedata1: ["单位：m³", 100, 80, 60, 40, 20, 0],
      ratedata2: ["单位：m³", 120, 100, 80, 60, 40, 20, 0],
      ratedata3: ["单位：m³", 120, 100, 80, 60, 40, 20, 0],
      ratedata4: ["单位：m³", 120, 100, 80, 60, 40, 20, 0],
      ratedata5: ["单位：m³", 120, 100, 80, 60, 40, 20, 0],
      bg: {
        backgroundImage: "url(" + require("./img/bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      safeManage: {
        backgroundImage: "url(" + require("./img/hdbj.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      //水消耗量
      waterPoint: {
        top: "100%",
      },
      //气消耗量
      o2Point: {
        top: "0%",
      },
      //电消耗量
      elcPoint: {
        top: "20%",
      },
      //污水
      noobWater: {
        month: "",
        month3: "",
        year: "",
      },
      //污水处理
      useNoobWater: {
        month: "",
        month3: "",
        year: "",
      },
      // 油料
      oilPoint1: {
        top: "0%",
      },
      oilPoint2: {
        top: "100%",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./style/environment.scss";
</style>
