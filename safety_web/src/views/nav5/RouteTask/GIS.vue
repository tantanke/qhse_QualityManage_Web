
<template>
    <div >
    <div class="page-title">巡检查询</div>
    <div class="page-content">
        <el-form 
        :model="filterQuery"
        :inline="true"
        @submit.native.prevent="handleSearch">
            <el-row>
            <el-form-item>
              <treeselect
              :multiple="false"
              :options="options"
              placeholder="受检单位"
              v-model="filterQuery.companyCode"
              style="width:200px"
              /> 
            </el-form-item>
            <el-form-item >
            <el-select
              v-model="filterQuery.RouteEmpID"
              placeholder="输入姓名搜索负责人"
              :filter-method="handleLeaderSearch"
              clearable
              filterable
              :loading="leaderLoading"
              loading-text="查询中..."
              style="width:200px"
            >
              <el-option
                v-for="item in leaders"
                :key="item.index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                value-format="yyyy-MM-dd-hh-mm-ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:200x">
            </el-date-picker>
            </el-form-item> 
            <el-form-item>
            <el-button type="primary" @click="handleAnalysis1()" style="width:100px">查询</el-button>
            </el-form-item>
            <el-form-item>
            <el-button  type="primary" @click="export2Excel ()" style="width:100px">导出Excel</el-button>
            </el-form-item>
            </el-row>
            <el-row>
          <el-col :span="12" style="padding-right:10px">
            <div style="border: 1px solid black;width:100%;height:650px">
                <el-table
               :data="tableData"
               v-loading="loading"
               border
               style="width:100%;margin-top:10px"
               > 
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="二级单位:">
                                    <span>{{ props.row.parentCompanyName }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="gPSX:">
                                    <span>{{ props.row.gPSX }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="gPSY:">
                                    <span>{{ props.row.gPSY }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="图片附件:">
                                    <img :src="props.row.inspectionAttach" style="width:200px">
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="海拔:">
                                    <span>{{ props.row.altitude }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
            type="index"
            width="50"
            header-align="center"
            label="序号"
            :index="this.indexStartNum"
            align="center">
            </el-table-column>
            <el-table-column
            label="巡检人员"
            prop="routeEmpName"
            width="100%">
            </el-table-column>
            <el-table-column
            label="单位"
            prop="companyName"
            width="100%">
            </el-table-column>
            <el-table-column
            label="巡检时间"
            prop="routeTime"
            width="100%">
            </el-table-column>
            <el-table-column
            label="巡检地点"
            prop="address"
            show-overflow-tooltip
           >
            </el-table-column>
            </el-table>
             <div class="pagination-base">
                <el-pagination
                    @current-change="handlePageChange"
                    :current-page="filterQuery.pageIdx"
                    :page-size="filterQuery.pageSize"
                    :total="total"
                    background
                    layout="total,prev, pager, next,jumper"
                    style="float:right;">
                </el-pagination>
            </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div id="bar-container" style="border: 1px solid black;width:100%;height:650px">  
                <div id="container"></div>
            </div>
          </el-col>
        </el-row>
        </el-form>
    </div>  
    </div>
</template>
<script>
import MapLoader from '@/AMap.js'
// import AMap from 'vue-amap'
import {GetGIStList} from '../../../services/GIS'
import {GetCompany} from  '../../../services/problemRankAnalysis'
import {GetEmployees} from '../../../services/employee'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const DefaultQuery = {
  companyCode:null,
  startDate: '',
  endDate:'',
  RouteEmpID:'',
  pageIdx: 1,
  pageSize: 8,
  inputType :'routing_inspection',

}
const DefaultQueryExcel = {   //************
  pageIdx: 1,
  pageSize: 10,
  type:'all'
}
var map
export default { 
    data(){
        return{
            // map: '',
            // infoWindow: '',
            filterQuery:{},
            filterQueryExcel: {},
            dateRange:[],
            leaders:[],
            options:[],
            leaderLoading: false,
            loading: false,
            tableData: [],
            tableData1: [],
            points: [],
            path: [],
            total:0,
            excelData:[],
            indexStartNum:1 
        }
    },
    mounted () {
        this.loadFilterParams()
        this.init()
        this.handleGetCompany()
        this.handleLeaderSearch()
        this.handleAnalysis()
    },
   methods: {
      handlePageChange (page) {
      this.filterQuery.pageIdx= page
    //   this.initMap()
      this.path = []
      this.handleAnalysis ()
    },
    handleAnalysis1 () {
      this.filterQuery.pageIdx = 1
    //   this.initMap()
      this.path = []
      this.handleAnalysis()
    },
    //导出excel
      export2Excel() {
      this.filterQueryExcel = {...DefaultQueryExcel, ...this.$route.query}
      this.filterQueryExcel = {
        ...this.filterQueryExcel,
      }
      this.excelData=GetGIStList(this.filterQueryExcel).then((data) => {
        console.log(JSON.stringify(data))
        this.excelData = data.data
        this.loading = false
        console.log(JSON.stringify(this.excelData))
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel');
          //************
          const tHeader = ['巡检人员','单位','巡检时间','巡检地点','二级单位','图片附件','gPSX','gPSY','海拔'];
          // 上面设置Excel的表格第一行的标题
          //************
          const filterVal = ['routeEmpName','companyName','routeTime','address','parentCompanyName','inspectionAttach','gPSX','gPSY','altitude'];
          // 上面的index、phone_Num、school_Name是tableData里对象的属性
          const list = this.excelData;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '列表excel');
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    initMap(gpsx,gpsy){
                map = new AMap.Map('container', {
                    center: [gpsx,gpsy],
                    resizeEnable: true,
                    zoom: 10
                })
                AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                    map.addControl(new AMap.ToolBar())
                    map.addControl(new AMap.Scale())
                })
            },
       //地图
       init: function () {
                map = new AMap.Map('container', {
                    center: [104.184767,30.830063],
                    resizeEnable: true,
                    zoom: 10
                })

                AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                    map.addControl(new AMap.ToolBar())
                    map.addControl(new AMap.Scale())
                })
            },
            initMap1 () {
                map = new AMap.Map('container', {
                    center: [104.184767,30.830063],
                    resizeEnable: true,
                    zoom: 10
                })

                AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                    map.addControl(new AMap.ToolBar())
                    map.addControl(new AMap.Scale())
                })
            },
     //获取受检单位列表
    handleGetCompany(){
        GetCompany().then((res) => {
            this.options = res.data 
        }).catch((err) => {
            this.$message.error(err.message)
        })
    },
    //获取员工表
    // handleLeaderSearch (val='',) {
    //   GetEmployees({name: val,inputType :"routing_inspection",type: "all"}).then((res) => {
    // //   alert(JSON.stringify(res))
    //     this.leaders = res.data
    // //   alert(JSON.stringify(this.leaders)) 
    //   }).catch((err) => {
    //     this.$message.error(err.message)
    //   })
    // },

     handleLeaderSearch (val='') {
      this.leaderLoading = true
      GetEmployees({name: val,type: "all"}).then((res) => {
        this.tableData1 = res.data
        //  alert(JSON.stringify(this.tableData1))
         for(let i=0;i<this.tableData1.length;i++)
            {
              this.leaders[i]={"id": this.tableData1[i].employeeID,"name" : this.tableData1[i].name+'('+this.tableData1[i].companyName+')'}        
            }       
        this.leaderLoading = false
      }).catch((err) => {
        this.$message.error(err.message)
        this.leaderLoading = false
      })
    }, 

    handleAnalysis () {
        this.checkFilterParams()
        this.loading = true
        this.$router.push({name: 'GIS', query: this.filterQuery})
        // alert(JSON.stringify(this.filterQuery))
        GetGIStList(this.filterQuery).then((res) => {  
            console.log(JSON.stringify(res.data.list))
            this.tableData = res.data.list
            this.total = res.data.total
            this.filterQuery.pageIdx = res.data.page
            this.indexStartNum = ((this.filterQuery.pageIdx - 1) * this.filterQuery.pageSize) + 1;
            // alert(this.tableData.length)
            if(this.tableData.length > 0){
                this.initMap(this.tableData[0].gPSY,this.tableData[0].gPSX)
            }else{
                this.initMap1()
            }
            for(let i=0;i<this.tableData.length;i++){
                let marker
                if(i == 0){
                   marker = new AMap.Marker({
                    position: new AMap.LngLat(this.tableData[i].gPSY,this.tableData[i].gPSX),
                    icon: new AMap.Icon({            
                        image: "/api/resources/qd.svg",
                        size: new AMap.Size(50, 50),  //图标大小
                        imageSize: new AMap.Size(40,40)
                    }),
                    title: this.tableData[i].address
                    }) 
                }else if(i == this.tableData.length-1){
                    marker = new AMap.Marker({
                    position: new AMap.LngLat(this.tableData[i].gPSY,this.tableData[i].gPSX),
                    icon: new AMap.Icon({            
                        image: "/api/resources/zd.svg",
                        // size: new AMap.Size(50, 50),  //图标大小
                        imageSize: new AMap.Size(50,50)
                    }),
                    title: this.tableData[i].address
                    })
                }else{
                    marker = new AMap.Marker({
                    position: new AMap.LngLat(this.tableData[i].gPSY,this.tableData[i].gPSX),
                    title: this.tableData[i].address
                })
                }
                
                // 折线的节点坐标数组，每个元素为 AMap.LngLat 对象
                this.path.push(new AMap.LngLat(this.tableData[i].gPSY,this.tableData[i].gPSX))
                map.add(marker)
                new AMap.event.addListener(marker,'click',function(){
                    var info = [];
                    var infoWindow = ''
                    
                   info.push("<div><img style=\"width:400px\" src=\""+ this.inspectionAttach +"\"/></div> ");
                   infoWindow = new AMap.InfoWindow({
                        content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
                    });
                    infoWindow.open(map, [this.gPSY,this.gPSX]);
                },this.tableData[i])
            }
             //创建折线实例
             let polyline = new AMap.Polyline({
                path: this.path,  
                // borderWeight: 3, // 线条宽度，默认为 1
                // strokeColor: 'red', // 线条颜色
                // showDir:true,
                // lineJoin: 'round' // 折线拐点连接处样式
                strokeColor: "#3366FF", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 5,        //线宽
                strokeStyle: "solid",   //线样式
                showDir:true,
                strokeDasharray: [10, 5] //补充线样式
            });
            //将折线添加至地图实例
            map.add(polyline);
            this.loading = false
        }).catch((err) => {
            this.$message.error(err.message)
            this.loading = false
        })
    },
    checkFilterParams () {
		//datepicker range 绑定的数据是数组,需要拆成后端识别的2个参数
		if (this.dateRange && this.dateRange.length === 2) {
			this.filterQuery.startDate = this.dateRange[0]
			this.filterQuery.endDate = this.dateRange[1]
		} else {
			this.filterQuery.startDate = ''
			this.filterQuery.endDate = ''
		}
    },
    //为了保存过滤条件,利用路由的history能力,更换url,从子页面返回的时候,能还原当前条件下的内容
    loadFilterParams () {
        //从query读取过滤条件
        this.filterQuery = {...DefaultQuery, ...this.$route.query}
        //从query中取到的参数是string的,要转成element要求的number
        this.filterQuery = {
        ...this.filterQuery,
        pageIdx: parseInt(this.filterQuery.pageIdx, 10),
        pageSize: parseInt(this.filterQuery.pageSize, 10),
        }
         //填充datepicker range组件的内容
      if (this.filterQuery.startDate && this.filterQuery.endDate) {
        this.dateRange = [this.filterQuery.startDate, this.filterQuery.endDate] 
      }
    },
    //在指定位置打开信息窗体
    // openInfo () {
    //     //构建信息窗体中显示的内容
    //     var info = [];
    //     info.push("<div><div><img style=\"float:left;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div> ");
    //     info.push("<div style=\"padding:0px 0px 0px 4px;\"><b>高德软件</b>");
    //     info.push("电话 : 010-84107000   邮编 : 100102");
    //     info.push("地址 :北京市朝阳区望京阜荣街10号首开广场4层</div></div>");
    //     this.infoWindow = new AMap.InfoWindow({
    //         content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
    //     });
    //     this.infoWindow.open(this.map, this.map.getCenter());
    // } 
  }
}
</script>
<style>
#container { height: 650px; } 
</style>
