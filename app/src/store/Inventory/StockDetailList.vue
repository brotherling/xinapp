<template>
<div class="div1">
  <v-header :header="'批次编号 : '+head"></v-header>
   <searchbar :serial="serial" :clicksearch="clicksearch" :data="data" :titledata="titledata"></searchbar>
    <section class="stcok" @scroll="handleScroll($event)">
        <div @click="stockclick(item.pcId,item.ASM_C4_10,item.ASM_C4_20,item.ASM_C4_1225)" class="stockcontent" v-for="item in reviewdata" :key="item.ASM_C4_01">
            <div class="conttop"><span>资产编号:</span><span class="bian">{{item.ASM_C4_20}}</span></div>
            <div class="showdata">
                <div><span>资产名称:</span><span class="void">{{item.ASM_C4_50}}</span></div>
                <div><span>资产分类:</span><span class="void">{{item.ASM_C4_85}}</span></div>
                <div><span>规格型号:</span><span class="void">{{item.ASM_C4_210}}</span></div>
            </div>
            <div v-if="item.ASM_C4_1225=='已盘'" class="stockImg1"></div>
            <div v-else-if="item.ASM_C4_1225=='盘亏'" class="stockImg2"></div>
            <div v-else-if="item.ASM_C4_1225=='盘盈'" class="stockImg4"></div>
            <div v-else-if="item.ASM_C4_1225=='盘溢'" class="stockImg3"></div>
            <img v-if="item.imgUrl!=''&&item.imgUrl!=null" :src="item.imgUrl" v-preview="item.imgUrl" alt="" class="stockImg" preview-title-enable="false" preview-nav-enable="false">
        </div>
    </section>
    <stockfoot :pcId="data.pcId" :planId="planId" :toggleIndex="5"></stockfoot>
</div>
</template>
<script>
import searchbar from "../../components/searchbar.vue"
import stockfoot from "../../components/stockfoot.vue"
    export default{
        name:"StockDetailList",
        components:{searchbar,stockfoot},
        data(){
            return{
                head:"",
                serial:[{name:"全部"},{name:"已盘"},{name:"盘亏"}],
                data:{
                filter:"",
                param:"",
                pageNumber:0,
                pcId:this.$route.query.pcid
             },
                sclocl:true,
                reviewdata:[],
                RecordCount:"",
                titledata:"盘点状态",
                planId:"",
            }
        },
        methods:{
            stockclick(pcid,assetid,serial,state){
                this.$router.push({path:'/assetInventory/',query:{pcid:pcid,planId:this.planId,assetid:assetid,serial:serial,state:state}})
            },
         getdata(){
             this.scloll=false;
                let Data= {
                    pcId: this.data.pcId,
                    pageNumber:this.data.pageNumber,
                    pageSize: "10",
                    sortName: "ASM_C4_20",
                    order:"desc",
                    filter:this.data.filter,
                    param:this.data.param
                };
            this.$http.get("/API/stockservice/GetStockAssetDetailList",
                {params:{data:JSON.stringify(Data)}},
                { emulateJSON: true })
                .then(res => {
                    this.RecordCount=res.data.RecordCount;
                        res.data.List.forEach(function(element) {
                        this.reviewdata.push(element);
                        }, this);
                this.scloll=true;
                
                if(this.reviewdata[0]!=undefined){
                this.planId=this.reviewdata[0].planId;
                this.head=this.reviewdata[0].pcCode;
                }
            })
         },
            clicksearch(){
            this.data.pageNumber=0;
             this.reviewdata=[];
             if(this.data.filter.indexOf("ASM_C4_1225") ==-1){
                this.data.filter=JSON.stringify({"ASM_C4_1225":this.data.filter});
             }
            this.getdata()
            },
        handleScroll(e) {
            let $el = e.target;
            let num=this.data.pageNumber;
            if ($el.scrollTop + $el.offsetHeight == $el.scrollHeight) {
                num += 10;
                if (num > this.RecordCount+10) {
                this.$message({
                    message: "数据已经全部加载完",
                    type: "warning"
                });
                return;
                }
                if (this.scloll) {
                    this.data.pageNumber=num;
                    this.getdata();
                }
            }
        },
        },
        created() {
            this.getdata()
        },
    }
</script>
<style>
.stcok{
    height:65%;
    overflow-y: auto;
    letter-spacing: 1px;
}
.stockImg{
    width:80px;
    height: 80px;
    position: absolute;
    right: 20px;
    bottom:20px;
}
.stockcontent{
    width:90%;
    margin-left:5%;
    height: 150px;
    background:white;
    margin-top:15px;
    padding:2% 3%;
      border: 0px solid #ccc;
  border-radius: 5px;
  box-shadow: 1px 1px 1px 2px #eee; /* no*/
  font-size:17px;
  padding-bottom:0px;
  position: relative;
}
.stockcontent .bian{
    margin-left: 12px;
    color: #666;
}
.stockcontent:last-child{
    margin-bottom:15px;
}
.showdata{
    margin-top:10px;
}
.showdata div{
    line-height: 32px;
    color:#989898;
    font-size: 15px;
}
.showdata .void{
    color: #000;
}
.stockImg1{
  position: absolute;
  top: 0;
  right: 0;
  width: 70px;
  height: 25px;
  background: url("../../assets/yipan.png") no-repeat;
  background-size: cover;
}
.stockImg2{
  position: absolute;
  top: 0;
  right: 0;
  width: 70px;
  height: 25px;
  background: url("../../assets/pankui.png") no-repeat;
  background-size: cover;
}
.stockImg3{
  position: absolute;
  top: 0;
  right: 0;
  width: 70px;
  height: 25px;
  background: url("../../assets/panying.png") no-repeat;
  background-size: cover;
}
.stockImg4{
  position: absolute;
  top: 0;
  right: 0;
  width: 70px;
  height: 25px;
  background: url("../../assets/panyi.png") no-repeat;
  background-size: cover;
}
.void{
    margin-left:5px;
}
</style>

