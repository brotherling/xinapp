<template>
<div class="div1">
  <v-header :header="head"></v-header>
  <div class="gcheckList_assettop">
      <div style="font-weight:600">资产编号：<span>{{grcheck_assteTag}}</span></div>
      <div style="color:#E96026">{{grcheck_state}}</div>
  </div>
  <section class="gcheckList_Assetcontent">
      <div class="setclass">
          <ul>
              <li v-for="item in assetdata" :key="item.id"><span class="setdistance">{{item.displayName}} : </span><span>{{item.fieldVal}}</span></li>
              <div id="images">
                  <span class="setdistance" style="float:left;font-size:16px;">图片:</span>
                  <div class="appendimg">
                  <img  v-preview="'data:image/jpeg;base64,'+itimg.img" :src="'data:image/jpeg;base64,'+itimg.img" alt="" v-for="itimg in assetImg" :key="itimg.id"  preview-title-enable="false" preview-nav-enable="false">
                  <img  v-preview="itimg.img" :src="itimg.img" alt="" v-for="itimg in uploadimg" :key="itimg.id"  preview-title-enable="true" preview-nav-enable="false">
                  </div>
                </div>
          </ul>
      </div>
  </section>
    <div class="grcheckList_check">
    <yd-button @click.native="grcheckList_click()" size="large" type="primary" bgcolor="#029EE6">核查</yd-button>
    </div>
      <div class="grcheckList_foot">
        <div @click="clickNocheck"><p><i class="grcheckList_imgnocheck"></i><br>未核查</p></div>
        <span></span>
        <div @click="grcheckList_Imgsao"><p><i class="grcheckList_imgsao"></i><br>扫一扫</p></div>
        <span></span>
        <div  @click="clickcheck"><p><i class="grcheckList_imgcheck"></i><br>已核查</p></div>
    </div>
</div>
</template>
<script>
    export default{
        data(){
            return{
                head:"资产核查",
                assetdata:[],
                assetImg:[],
                uploadimg:"",
                grcheck_assteTag:this.$route.query.assetTag,
                grcheck_state:this.$route.query.state,
            }
        },
        methods:{
            clickNocheck(){
                            let name="个人核查",url="grcheck";
                this.$router.push({path:'/grcheck/',query: { name:name, id:"417",url:url}});
            },
            clickcheck(){
                            let name="个人核查",url="grcheck";
                 this.$router.push({path:'/grcheck/',query: { name:name, id:"417",url:url,check:true}});
            },
            grcheckList_Imgsao(){
               this.saoma(this.clicksous);
            },
            clicksous(e){
            let name="个人核查",url="grcheck";
            this.$router.push({path:'/grcheck/',query: { name:name, id:"417",url:url,saoma:e}});
            },
            grcheckList_click(){
            if(this.$route.query.state=="已核查"){
                this.$dialog.alert({mes:"此资产已核查"});
            }else{
                let Data={"pcId":this.$route.query.pcid,"grCheckYY":"1","assetId":this.$route.query.assetid};
                this.$http.post("/API/stockservice/DoHandStock",
                {"pcId":this.$route.query.pcid,"grCheckYY":this.$route.query.grCheckYY,"assetId":this.$route.query.assetid},
                { emulateJSON: true })
                .then(res => {
                     this.$dialog.alert({mes:res.data.resultMsg});
                    if(res.data.resultNum>0){
                        this.$router.go(-1);
                    }
                 })
            }

            },
            assetGetdata(){
            let Data={"pcId":this.$route.query.pcid,"assetId":this.$route.query.assetid};
             this.$http.get("/API/stockservice/GetAssetDetail",
                {params:{data:JSON.stringify(Data)}},
                { emulateJSON: true })
                .then(res => {
                    this.assetdata=res.data.immobilization.data;
                 })
            },
        },
        created() {
            this.assetGetdata();
        },
    }
</script>
<style>
.grcheckList_imgnocheck{
    display:inline-block;
    background:url("../../assets/nocheck.png") no-repeat;
    width:28px;
    height:28px;
    background-size: cover;
}
.grcheckList_imgcheck{
    display:inline-block;
    background:url("../../assets/check.png") no-repeat;
    width:28px;
    height:28px;
    background-size: cover;
}
.grcheckList_imgsao{
    display:inline-block;
    background:url("../../assets/shaoma.png") no-repeat;
    width:28px;
    height:28px;
        background-size: cover;
}
.grcheckList_foot{
    height:10%;
    display:flex;
    align-items: center;
    border-top:1px solid #ccc;/*no*/
}
.grcheckList_foot div{
    color:#666;
    text-align:center;
    /* margin:0 51px; */
    width: 33%;
}
.grcheckList_foot span{
    display:inline-block;
    width:1px /*no*/;
    border: 1px solid #ccc;/*no*/
    height:40px;
    background:#ccc;
}
.grcheckList_check .yd-btn-block{
    margin-top:0;
    font-size:.4rem;
    color:white;
}
.grcheckList_check{
    height:6%;
    width:90%;
    margin:0 auto;
}
.gcheckList_assettop{
    height:6%;
    display:flex;
    align-items: center;
justify-content: space-around;
    font-size:16px;/*no*/
    border-bottom:1px solid #ccc;/*no*/
}
.gcheckList_Assetcontent{
    height:65%;
    width:100%;
    overflow-y: auto;
    letter-spacing: 1px;
}
.setclass{
    width:90%;
    height:auto;
    margin:1% 0;
    margin-left:5%;
    background:white;
    border:0px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 1px 1px #ccc;/*no*/

}
.setclass ul li{
    /*height: 40px;*/
    line-height: 40px;
    font-size:16px;
}
.setdistance{
    width:120px;
    text-align: right;
    display:inline-block;
    margin-right:5px;
    color: #989898;
}
.finally{
    width:100%;
    height:12%;
    position: fixed;
    bottom:11.5%;
}
.finally .assetrule{
    width:90%;
    margin-left:5%;
}
.finally .assetrule .el-input-group__prepend{
    background: white;
    padding:0 10px;

}
.mackimg{
    width:24px;
    height:18px;
  background: url("../../assets/1.png") no-repeat;
  background-size: cover;
      display: inline-block;
    margin-right:3px;
    vertical-align: middle;
}
.photographimg{
    width:24px;
    height:18px;
    background: url("../../assets/2.png") no-repeat;
    background-size: cover;
    display: inline-block;
    margin-right:3px;
    vertical-align: middle;
}
.finally .assetrule .el-button{
    font-size:18px;
}
.imgupload{
    position: absolute;
    right: 22px;
    width: 145px;
    opacity: 0;
    height: 45px;
     bottom: 4px;
}
#images{
    width:100%;
    display: flex;
    flex-grow: grow;
}
#images img{
    width:60px;
    height:60px;
    margin-left:6px;
}
.appendimg{
 float: left;
    flex: 1;
}
</style>

