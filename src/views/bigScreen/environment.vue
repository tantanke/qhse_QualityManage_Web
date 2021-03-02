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
        <p>{{  showName }}</p>
      </el-col>
      <el-col class="title" :span="4">
        <p>QHSE看板</p>
      </el-col>
      <el-col class="time" :span="3">
        <span>时间：{{ nowdate }}</span>
      </el-col>
      <el-col class="buttons" :span="4">
        <el-col :span="10"
          ><i class="el-icon-arrow-right"></i><span @click="safeSwiper">安全管理</span></el-col
        >
        <el-col :span="9"
          ><i class="el-icon-arrow-right"></i><span @click="qualitySwiper">质量管理</span></el-col
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
                <li>{{ allValues.waterYear}}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="14" class="zhuimgs">
              <el-col :span="5" class="rate">
                <ul v-for="(v, index) in ratedataWater" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="5" class="point">
                <div :style="waterPoint">
                  <p>{{ allValues.waterYear}}</p>
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
          <el-row class="content3">
            <el-col :span="5">
              <ul class="info">
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计消耗量</li>
                <li>{{ allValues.electricityYear }}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="14" class="zhuimgs">
              <el-col :span="5" class="rate">
                <ul v-for="(v, index) in ratedataElectricity" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="5" class="point">
                <div :style="elcPoint">
                  <p>{{ allValues.electricityYear }}</p>
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
          <el-row class="content2">
            <el-col :span="5">
              <ul class="info">
                <li><img src="./img/jiankong.png" alt="" /></li>
                <li>本年累计消耗量</li>
                <li>{{ allValues.gasYear }}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="14" class="zhuimgs">
              <el-col :span="5" class="rate">
                <ul v-for="(v, index) in ratedataGas" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="5" class="point">
                <div :style="o2Point">
                  <p>{{ allValues.gasYear }}</p>
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
                <span class="num">{{pollutionWater.month}}</span><span class="danwei">m3</span>
              </el-col>
            </el-row>

            <el-row class="content1">
              <el-col :span="8" class="left">
                <p>季度</p>
                <p>累计污水量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">{{pollutionWater.quarter}}</span><span class="danwei">m3</span>
              </el-col>
            </el-row>
            <el-row class="content1">
              <el-col :span="8" class="left">
                <p><span style="color:#00FFFF">{{allValues.year}}</span>年度</p>
                <p>累计污水量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">{{pollutionWater.year}}</span><span class="danwei">m3</span>
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
                <span class="num">{{passPollutionWater.month}}</span><span class="danwei">m3</span>
              </el-col>
            </el-row>

            <el-row class="content1">
              <el-col :span="8" class="left">
                <p>季度累计</p>
                <p>污水转运量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">{{passPollutionWater.quarter}}</span><span class="danwei">m3</span>
              </el-col>
            </el-row>
            <el-row class="content1">
              <el-col :span="8" class="left">
                <p><span style="color:#00FFFF">{{allValues.year}}</span>年度累计</p>
                <p>污水转运量</p>
              </el-col>
              <el-col :span="8" class="right">
                <span class="num">{{passPollutionWater.year}}</span><span class="danwei">m3</span>
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
                <li>{{allValues.gasoliYear}}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="14" class="zhuimgs ">
              <el-col :span="5">
                <ul v-for="(v, index) in ratedataGasoli" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="3" class="point">
                <el-row :style="oilPoint1">
                  <p>{{allValues.gasoliYear}}</p>
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
                <li>{{allValues.dieselYear}}<span>m³</span></li>
              </ul>
            </el-col>
            <el-col :span="14" class="zhuimgs ">
              <el-col :span="5">
                <ul v-for="(v, index) in ratedataDiesel" :key="index">
                  <li>{{ v }}</li>
                </ul>
              </el-col>
              <el-col :span="3" class="point">
                <el-row :style="oilPoint2">
                  <p>{{allValues.dieselYear}}</p>
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
import {
  queryDashboardEnvironmentManagement, 
} from "@/services/qhseDashboard/index";
export default {
   props:{
    date: String,
  },
  data() {
    return {
       showName: "安全环保质量监督检测研究院",
      ratedataWater: ["单位：m³", 120,100, 80, 60, 40, 20,0],
      ratedataGas: ["单位：m³", 12000, 10000, 8000, 6000, 4000, 2000,0],
      ratedataElectricity: ["单位：度", 210000, 180000, 150000, 120000, 90000,60000,0],
      ratedataGasoli: ["单位：L", 120, 100, 80, 60, 40, 20, 0],
      ratedataDiesel: ["单位：L", 120, 100, 80, 60, 40, 20, 0],
      bg: {
        backgroundImage: "url(" + require("./img/bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      allValues:{
        water:'',
        electricity:'',
        gas:'',
        gasoli:'',
        diesel:'',
        waterYear:'',
        gasYear:'',
        electricityYear:'',
        gasoliYear:'',
        dieselYear:'',
        year:''
      },
      pollutionWater:{
         month:0,
         quarter:0,
         year:0
      },
      passPollutionWater:{
         month:0,
         quarter:0,
         year:0
      },
      safeManage: {
        backgroundImage: "url(" + require("./img/hdbj.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      //水消耗量
      waterPoint: {
        top: "70%",
      },
      //气消耗量
      o2Point: {
        top: "0%",
      },
      //电消耗量
      elcPoint: {
        top: "0%",
      },
      // 油料
      oilPoint1: {
        top: "0%",
      },
      oilPoint2: {
        top: "0%",
      },
      // 查找表单
      serForm: {
        companyCode: "",
      },
    };
  },
  computed: {
    nowdate(){
    return this.date
  }
  },
  methods: {
    initData(data){
        let _this = this; 
        let {
        sewageVolumeMonth, //	月度累计污水量
        sewageVolumeQuarter, //季度累计污水量
        sewageVolumeYear, //年度累计污水量
        sewageTransferMonth, //月度累计污水处理量
        sewageTransferQuarter, //季度累计污水处理量
        sewageTransferYear, //年度累计污水处理量
        waterMonth, //月度水消耗量
        waterYear, //年度水消耗量
        electricityMonth,  //电月度消耗量
        electricityYear,  //电年度消耗量
        gasMonth,  //气月度消耗量
        gasYear,  //气年度消耗量
        gasolineMonth,  //汽油月累计消耗量
        gasolineYear,  //汽油年累计消耗量
        dieselMonth,  //柴油月累计消耗量
        dieselYear,  //柴油年累计消耗量
        year  //年度
      } = data
      _this.allValues.year = year
      // 水消耗量
      if(waterYear>100) _this.getYnum("单位：m³",waterYear,"ratedataWater",6)
      _this.allValues.water = waterMonth 
      _this.allValues.waterYear = waterYear
      _this.waterPoint.top =(100 -  Math.ceil((waterYear / _this.ratedataWater[1]) * 100)) + "%";
      //电消耗量
      if(electricityYear > 2000) _this.getYnum("单位：度",electricityYear,"ratedataElectricity",300)
      _this.allValues.electricity = electricityMonth
      _this.allValues.electricityYear = electricityYear
      _this.elcPoint.top =(100 -  Math.ceil((electricityYear / _this.ratedataElectricity[1]) * 100)) + "%";
      //气消耗量
      if(gasYear> 2000) _this.getYnum("单位：m³",gasYear,"ratedataGas",120)
      _this.allValues.gas = gasMonth
      _this.allValues.gasYear = gasYear
      _this.o2Point.top =(100 -  Math.ceil((gasYear / _this.ratedataGas[1]) * 100)) + "%";
      //污水量
      _this.pollutionWater.month = sewageVolumeMonth ? sewageVolumeMonth : 0
      _this.pollutionWater.quarter = sewageVolumeQuarter ? sewageVolumeQuarter : 0
      _this.pollutionWater.year = sewageVolumeYear ? sewageVolumeYear : 0
      //污水处理量
      _this.passPollutionWater.month = sewageTransferMonth ? sewageTransferMonth : 0
      _this.passPollutionWater.quarter = sewageTransferQuarter ? sewageTransferQuarter : 0
      _this.passPollutionWater.year = sewageTransferYear ? sewageTransferYear : 0
      // 汽油消耗量
      if(gasolineYear> 0) _this.getYnum("单位：L",gasolineYear,"ratedataGasoli",120)
      _this.allValues.gas = gasolineMonth ? gasolineMonth : 0
      _this.allValues.gasoliYear = gasolineYear ? gasolineYear : 0
      _this.oilPoint1.top =(100 -  Math.ceil((gasolineYear / _this.ratedataGasoli[1]) * 100)) + "%";
      // 柴油消耗量
      if(dieselYear> 0) _this.getYnum("单位：m³",dieselYear,"ratedataDiesel",120)
      _this.allValues.diesel = dieselMonth ? dieselMonth : 0
      _this.allValues.dieselYear = dieselYear ? dieselYear : 0

      _this.oilPoint2.top =(100 -  Math.ceil((dieselYear / _this.ratedataDiesel[1]) * 100)) + "%";
    },
    getYnum(index,data, name, rate) {
      let topdata = Math.ceil((data * 2) / rate/100) * 100 * rate
      let listdata = [
        index,
        topdata,
        topdata * 5/6,
        topdata * 4/6,
        topdata * 3/6,
        topdata * 2/6,
        topdata * 1/6,
        0
      ];
      this[name] = listdata;
    },
    getData(){
       queryDashboardEnvironmentManagement(this.serForm).then(res => {
          this.initData(res.data)
       }).catch((err) => {
          this.$message.error(err.message);
        });
    },
    upDateData(){
      let _this = this
      setInterval(()=>{
        _this.getData()
      },360000)
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
    qualitySwiper(){
        this.$emit('changeQuality', 2);
     },
     safeSwiper(){
        this.$emit('changeSafe', 0);

     },
  },
  
  mounted() {
    this.getcode()
    this.getData()
    this.upDateData()
  },
};
</script>

<style lang="scss" scoped>
@import "./style/environment.scss";
</style>
