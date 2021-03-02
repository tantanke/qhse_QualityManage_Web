<template>
<div> 
    <div class="page-title" style="width:100%">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a @click="$router.go(-1)">工作量统计</a></el-breadcrumb-item>
            <el-breadcrumb-item>工作量确认单</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div ref="pdf" class="pdfDom" v-for="(item, i) in tableData" :key="i">
        <el-row>
            <span>附件 1 </span>
        </el-row>
        <el-row>
            <span>安检院授权签字人报告工作量确认单</span>
        </el-row>
        <el-row>
            <span>基层单位名称：{{item.companyName}}</span>
        </el-row>
        <el-row>
            <table border="1" cellspacing="0" cellpadding="0" style="width:100%;text-align:center;font-size:16pt;border-color: black" >
                <tr height="50">
                    <th width="60">序号</th>
                    <th>人员名字</th>
                    <th>报告类别</th>
                    <th >单价(元)</th>
                    <th >作用</th>
                    <th >报告数量</th>
                    <th >延迟份数</th>
                    <th >延迟天数</th>
                    <th >奖励金额(元)</th>
                    <th style="min-width:100px">备注</th>
                </tr>
                <tr v-for="(item1, index) in item.data" :key="index" height="35">
                    <td>{{index + 1}}</td>
                    <td>{{item1.personName}}</td>
                    <td>{{item1.reportType}}</td>
                    <td>{{item1.unitPrice}}</td>
                    <td>{{item1.role}}</td>
                    <td>{{item1.typeCount}}</td>
                    <td>{{item1.reportDelayReportNums}}</td>
                    <td>{{item1.reportDelayDays}}</td>
                    <td>{{item1.rewardAmount}}</td>
                    <td>{{item1.remarks}}</td>
                </tr>
            </table>
        </el-row>
        <el-row style="padding: 15px;font-size:18pt">
            <el-col :span="6">
                <span>安全环保质量部：</span>
            </el-col>
            <el-col :span="4">
                <span>时间：</span>
            </el-col>
            <el-col :span="5">
                <span>基层单位领导：</span>
            </el-col>
            <el-col :span="4">
                <span>时间：</span>
            </el-col>
            <el-col :span="3">
                <span>编制：</span>
            </el-col>
            <el-col :span="2">
                <span>时间：</span>
            </el-col>
        </el-row>
    </div>
    <div style="width:100%">
        <el-row style="text-align: right;padding: 15px;">
            <el-button type="primary" icon="el-icon-download" @click="getPdf()">导出PDF</el-button>
            <el-button type="danger" @click="$router.go(-1)">返回前一页</el-button>
        </el-row>
    </div>
</div>
</template>

<script>
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
    data() {
        return {
            tableData:[],
            companyName:'',
            loading:false,
            htmlTitle: '安检院授权签字人报告工作量确认单',
            imgWidths:[],
            imgHeights:[],
            pageDatas:[],
            PDF:new JsPDF('l', 'pt', 'a4'),
            timer:'',
            refss:[]
        }
    },
    mounted(){
        this.getTableData()
        this.$nextTick(function(){
            this.getNodes()
        })
    },
    methods: {
        getTableData(){
            this.$route.params.data && localStorage.setItem('data',JSON.stringify(this.$route.params.data));
            const tableData = JSON.parse(localStorage.getItem('data'));
            let n = Math.ceil(tableData.length / 10)
            for(let i=0; i<n; i++){
                this.tableData.push({companyName:tableData[0].companyName,data:[]})
                if(tableData.length-i*10 >=10){
                    for(let j=0+i*10; j<(1+i)*10;j++){
                        this.tableData[i].data.push(tableData[j])
                    }
                }else{
                    for(let j=0+i*10; j<tableData.length;j++){
                        this.tableData[i].data.push(tableData[j])
                    }
                }
            }
            this.loading = false
        },
        getNodes(){
            this.refss = this.$refs.pdf
            for(let i=0;i<this.refss.length;i++){
                this.getPictures(this.refss[i])
            }    
        },
        getPictures(node){
            html2Canvas(node, {
                allowTaint: true,
                scale:10
            }).then((canvas) => {
                this.imgWidths.push(841.89)
                this.imgHeights.push(841.89 / (canvas.width/10) * (canvas.height/10))
                this.pageDatas.push(canvas.toDataURL('image/jpeg', 1.0))
            })
        },
        getPdf(){
            let n = this.pageDatas.length
            let count = n
            for(let i=0; i<n; i++){
                this.PDF.addImage(this.pageDatas[i], 'JPEG', 0, 0, this.imgWidths[i], this.imgHeights[i])
                count -= 1
                if(count != 0){
                    this.PDF.addPage()
                }
            }
            this.PDF.save(this.htmlTitle + '.pdf')
        },
    }
}
</script>
<style scoped>
.pdfDom {
    font-family: 宋体;
    color: black;
    font-weight: 500;
    padding: 120px;
    background-color:#fff; 
}
.pdfDom > div:nth-child(1){
    font-size:30pt;
    padding:15px;
}
.pdfDom > div:nth-child(2){
    font-size:25pt;
    text-align: center;
    padding: 15px;
}
.pdfDom > div:nth-child(3){
    font-size:18pt;
    text-align:left;
    padding:10px;
}
.pdfDom > div:nth-child(4){
    padding:10px;
}
.grid-content {
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    text-align: center;
    line-height: 40px;
    font-size: 16pt
}

</style>