<template>
<div class="div1">
  <v-header :header="parentMsg"></v-header>
    <section class="edit_assetcontent" >
        <div class="conetenttop">
            <div class="Topleft">{{this.descstring}}<span class="LeftImg" @click="clickLeftImg()"></span></div>
            <div class="TopRight">
                 <el-input placeholder=""  class="input-with-select" v-model="SortingData">
                    <el-button slot="append" icon="el-icon-search" @click="sous()"></el-button>
                </el-input>
                <img class="RightImg" src='../assets/shaoma.png' @click="clicksao()">
            </div>           
        </div>
        <div class="seriation">
          <ul>
                <li @click="clickseriation($event)">默认排序<span  class="seriationImg"></span></li>
                <li  @click="clickseriation($event)">编码正序<span class="seriationImg"></span></li>
                <li  @click="clickseriation($event)">编码倒序<span class="seriationImg"></span></li>
                <li  @click="clickseriation($event)">使用人员<span class="seriationImg"></span></li>
                <li  @click="clickseriation($event)">购置日期正序<span class="seriationImg"></span></li>
                <li  @click="clickseriation($event)">购置日期倒序<span class="seriationImg"></span></li>
            </ul>
        </div>
         <div class="statistics">
          <div><span class="origin">总数量:</span>{{quantity}}</div>
          <div><span class="origin">总原值:</span>{{assetOriWorth}}</div>
        </div>
        <div class="edit_assetpagedata" id="assetpage" @scroll="handleScroll($event)">
            <div class="edit_pagedata" @click="clickselect(item.ASM_A1_10,$event)" v-for="item in assetedata" :id="item.ASM_A1_10" :key="item.ASM_A1_10">
                <div class="pagedata_left">
                    <icon id="selectImg" type="circle"></icon>
                    <icon id="selectImgSuccess" type="success" style="display:none;"></icon>
                </div>
                <div class="pagedata_right">
                    <div class="edit_conttop"><span>资产编号:</span><span class="bian">{{item.ASM_A1_20}}</span></div>
                    <div class="edit_showdata">
                        <div><span>资产名称:</span><span class="void">{{item.ASM_A1_50}}</span></div>
                        <div><span>资产分类:</span><span class="void">{{item.ASM_A1_60}}</span></div>
                        <div><span>规格型号:</span><span class="void">{{item.ASM_A1_210}}</span></div>
                        <div v-if="item.ASM_A1_120=='在用'" class="showImg1"></div>
                        <div v-else-if="item.ASM_A1_120=='在库'" class="showImg2"></div>
                        <div v-else-if="item.ASM_A1_120=='维修'" class="showImg3"></div>
                        <div v-else-if="item.ASM_A1_120=='借用'" class="showImg4"></div>
                        <div v-else-if="item.ASM_A1_120=='报废'" class="showImg5"></div>
                        <div v-else-if="item.ASM_A1_120=='待报废'" class="showImg6"></div>
                        <img v-if="item.imgUrl!=''&&item.imgUrl!=null" :src="item.imgUrl" v-preview="item.imgUrl" alt="" class="edit_stockImg" preview-title-enable="false" preview-nav-enable="false">
                    </div>
                </div>                
            </div>
        </div>
         
    </section>
       <div class="edit_foot">
            <div @click="amend()">修改</div>
            <i></i>
            <div @click="delAsset">删除</div>
            <i></i>
            <div>更多</div>
          </div>

      <div id="zhezhao"></div>
</div>
</template>
<script>
export default {
  name: "assetEdit",
  data() {
    return {
      parentMsg: this.$route.query.name,
      assetedata: [],
      fielddata: [],
      SortingData: "",
      page: 1,
      scloll: "true",
      num: "",
      sort:"ASM_A1_20",
      order:"desc",
      descstring:"默认排序",
      Imgshow:"false",
      menuId: this.$route.query.id,
      url: this.$route.query.url,
      assetId:[],
      quantity:"",
      assetOriWorth:""
    };
  },
  methods: {
    amend(){
       let data=this.assetId;
      if(this.assetId.length==1){
         this.$http.post("/API/assetservice/ValidataStatu",{"assetIds":data},{ emulateJSON: true })
          .then(res => {
            if(res.data.resultNum==1){
              this.$http.post("/API/assetservice/ValidataFreeze",{"assetIds":data},{ emulateJSON: true })
                .then(res => {
                  if(res.data.resultNum==1){     
                    this.$router.push({path:'/assetAdd',query:{id:this.assetId}});
                  }else{
                    this.$dialog.alert({mes:res.data.resultMsg+'资产被占用或者冻结，不可以修改！'});
                  }
              })
            }else{
              this.$dialog.alert({mes:res.data.resultMsg+'资产已报废，不可以修改！'});
            }
          })

      }else{
        this.$dialog.alert({mes:'只能选择一条进行修改'});
      }
    },
    delAsset(){
      let data=this.assetId;
      if(data.length!=0){
        this.$http.post("/API/assetservice/ValidataFreeze",{"assetIds":data},{ emulateJSON: true })
          .then(res => {
            if(res.data.resultNum==1){
                  this.$http.post("/API/assetservice/ValidataMainAsset",{"assetIds":data},{ emulateJSON: true })
                  .then(res => {
                    if(res.data.resultNum==1){
                      this.$http.post("/API/assetservice/DeleteAsset",{"assetIds":data},{ emulateJSON: true })
                      .then(res => {
                            this.$dialog.confirm({
                                title: '提示',
                                mes:res.data.resultMsg,
                                opts: [
                                    {
                                        txt: '确定',
                                        color: true,
                                        callback: () => {
                                            this.sous();
                                        }
                                    }
                                ]
                            });
                      })
                    }else{
                      this.$dialog.alert({mes:res.data.resultMsg+'为主资产，将一并删除其下副签资产！'});
                    }
                  });
            }else{
              this.$dialog.alert({mes:res.data.resultMsg+'资产被占用或者冻结，不可以删除！'});
            }
        })
      }else{
        this.$dialog.alert({mes:'请选择要删除的数据'});
        }
    },
    clickselect(assetId,e){ //切换选择点图片和获取id
        let arr=this.assetId
        if(arr.indexOf(assetId)==-1){
          arr.push(assetId)
        }else{
          arr.splice($.inArray(assetId,arr),1);
        }
        let dom=e.currentTarget;
        $(dom).find("#selectImg").toggle();
        $(dom).find("#selectImgSuccess").toggle();
    },
    clicksao(){
      this.saoma(this.sous)
    },
    sous(e){
      console.log(e)
      if(e!=undefined){
      this.SortingData=e
      }
      this.assetId=[];
        this.page=1;
        this.assetedata=[];
        this.UploadData();
    },
    UploadData() {
      this.scloll = false;
      this.$http
        .post(
          "/API/assetservice/GetAssetList",
          {
              menuId: this.menuId,
              pageNumber: this.page,
              pageSize: "10",
              sortName: this.sort,
              order: this.order,
              url: this.url,
              param: this.SortingData
          },
          { emulateJSON: true }
        )
        .then(res => {
          let data = JSON.parse(res.data);
          this.quantity=data.rows[0].quantity;
          this.assetOriWorth=data.rows[0].assetOriWorth;
          this.num = data.total;
           this.scloll = true;
          data.rows.forEach(function(e) {
            this.assetedata.push(e);
          }, this);
        });
    },
    handleScroll(e) {
      let $el = e.target;
      if ($el.scrollTop + $el.offsetHeight == $el.scrollHeight || $el.scrollTop + $el.offsetHeight == $el.scrollHeight-1) {
        this.page += 1;
        if (this.page > (this.num / 10+2)) {
          this.$message({
            message: "数据已经全部加载完",
            type: "warning"
          });
          return;
        }
        if (this.scloll) {
          this.UploadData();
        }
      }
    },
    clickseriation(e){
        let dom=e.target;
        let classimg=document.getElementsByClassName("seriationImg");
        let text =dom.innerText;
        let sort,order;
        for(let i=0;i<classimg.length;i++){
            classimg[i].style.display="none";
        }
        dom.children[0].style.display="block";
        switch(text)
        {
            case "编码正序":sort="ASM_A1_20";order="asc"; break;
            case "编码倒叙":sort="ASM_A1_20";order="desc";break;
            case "使用人员":sort="useUserId" ;order="desc";break;
            case "购置日期正序":sort="ASM_A1_290";order="asc";break;
            case "购置日期倒序":sort="ASM_A1_290";order="desc";break;
            default:sort="ASM_A1_20";order="desc";break;
        }
        this.descstring=text;
        this.sort=sort;this.order=order;
        this.sous();
        this.clickLeftImg();
    },
    clickLeftImg(){
        let dom= document.getElementsByClassName("seriation");
        let zhedom =document.getElementById("zhezhao");
        let domtoggle= dom[0].style.display;
        if(domtoggle=="none"){
        dom[0].style.display="block";
        zhedom.style.display="block";
        }else{
        dom[0].style.display="none";
        zhedom.style.display="none";
        }
    }
  },
  mounted() {
    if(this.$route.query.saodata !=undefined){
    this.SortingData=this.$route.query.saodata;
    }
    this.UploadData();
        let classimg=document.getElementsByClassName("seriationImg");
        classimg[0].style.display="block";
  },
    watch:{
      '$route'(to,from){
          // react to route changes...
          this.parentMsg=to.query.name;
          this.menuId=to.query.id;
          this.url=to.query.url;
          this.sous()
      }
  }
};
</script>
<style>
.statistics{
  display:flex;
  justify-content:space-around;
  align-items: center;
  font-size:20px;
  height:35px;
  font-weight:700;
}
.statistics .origin{
  font-weight:400;
  font-size:16px;
  margin-right: 8px;
}
.edit_foot{
  position:fixed;
  width: 100%;
  background-color: #fff;
  height:46px;/*no*/
  border-top: 1px solid #eee;/*no*/
}
.edit_foot div{
  float: left;
  line-height: 46px;/*no*/
  width: 33.2%;
  text-align: center;
  font-size:14px;/*no*/
  color:#0AA0E7 
}
.edit_foot i{
  position: absolute;
  float: left;
  top: 8px;/*no*/
  width:1px;/*no*/
  height: 30px;
  background:#ccc;
}
.weui-icon-success{
  color:#0AA0E7 !important;
}
.edit_stockImg{
    width:65px;
    height: 70px;
    position: absolute;
    right: 25px;
    bottom:10px;
}
.edit_conttop{
    font-size:14px;/* no*/
    margin-top:3px;
}
.edit_conttop .bian{
     color:#666;
     margin-left: 15px;
}
.edit_showdata{
    margin-top:3px;
}
.edit_showdata div{
    line-height: 28px;
    color:#989898;
    letter-spacing: 2px;
    font-size: 12px;/* no*/
}
.edit_showdata .void{
  color:#000;
  margin-left:12px;
}
.edit_assetcontent {
  width: 100%;
  height: 80%;
  background: #fafafb;

}
.conetenttop {
  width: 100%;
  height: 70px;
  border-bottom: 1px solid #ccc;/*no*/
}
.Topleft {
  width: 35%;
  height: 40px;
  font-size: 19px;
  margin-left: 16px;
  border-right: 1px solid #999; /*no*/
  display: block;
  float: left;
  margin-top:15px;
}
.LeftImg {
  background: url("../assets/xiala.png") no-repeat;
  width: 25px;
  height: 25px;
  display: inline-block;
  background-size: cover;
  position: relative;
  top: 5px;
  left: 6px;
}
.RightImg {
  width: 30px;
  height: 30px;
  position: relative;
  top:13px;
  left:12px;
  float: left;
}
.TopRight {
  width: 56%;
  height: 53px;
  font-size: 24px;
  margin-left: 20px;
  display: block;
    float: left;
}
.edit_assetpagedata {
  /* border-top: 1px solid #ccc; */
  width: 100%;
  height:84%;
  overflow-y:auto;
  /* padding-bottom: 5%; */
}
.edit_pagedata {
  margin-top: 20px;
  height: 115px;
    width: 95%;
    margin-left: 1%;
    display:flex;
}
.edit_assetpagedata .edit_pagedata:nth-of-type(1){
  margin-top:5px;
}
.pagedata_left{
    flex:1;
    display: flex;
    align-items: center;
}
.pagedata_right{
  border: 0px solid #ccc;
  border-radius: 5px;
  box-shadow:1px 1px 1px 2px #eee; /* no*/
  background: white;
  overflow: hidden;
  position: relative;
  flex:10;
  padding-left:10px;
}
.Showmore {
  position: absolute;
  right: 10px;
  bottom: 5px;
  font-size: 14px;
  color: #039ee7;
}
.TopRight .el-input-group {
  width: 80%;
  margin-top:12px;
  float: left;
}
.TopRight .el-input-group__append {
  padding: 0 10px;
  background: white;
}
.TopRight .el-icon-search {
  color: #039ee7;
}
.showImg1 {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 25px;
  background: url("../assets/zaiyong.png") no-repeat;
  background-size: cover;
}
.showImg2 {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 25px;
  background: url("../assets/zaiku.png") no-repeat;
  background-size: cover;
}
.showImg3 {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 25px;
  background: url("../assets/weixiu.png") no-repeat;
  background-size: cover;
}
.showImg4 {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 25px;
  background: url("../assets/jieyong.png") no-repeat;
  background-size: cover;
}
.showImg5 {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 25px;
  background: url("../assets/baofei.png") no-repeat;
  background-size: cover;
}
.showImg6 {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 25px;
  background: url("../assets/daibaofei.png") no-repeat;
  background-size: cover;
}
.seriation{
    width:100%;
    background-color: white;
    position: fixed;
    display:none;
    z-index: 1000;
}
.seriation ul{
    width:100%;
}
.seriation ul li{
    width:80%;
    list-style-type: none;
    height: 40px;
    line-height: 40px;
    font-size:18px;
    margin-left:10%;
    border-bottom:1px dashed #E6E6E6;/*no*/
    padding-left:5px;
    position: relative;
}
.seriation ul li:last-child{
    border:none;
}
.seriationImg{
    width:25px;
    height: 25px;
    background:url("../assets/xuan.png") no-repeat;
    background-size:cover;
    position: absolute;
    right: 20px;
    top:6px;
    display:none;
}
#zhezhao{
    display: none;
    position: fixed;
    left: 0%;
    width: 100%;
    height: 50%;
    background-color: black;
    z-index:999;
    bottom:8%;
    -moz-opacity: 0.8;
    opacity:.80;
    filter: alpha(opacity=80);
}
.Amendfont{
    width:120px;
    text-align: right;
    display:inline-block;
}
.DataImg{
  width:160px;
  height:110px;
  margin-left:15px;
  margin-top:3px 0;
  vertical-align:middle;
}
</style>
