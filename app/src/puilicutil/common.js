//global是nodejs中的全局对象
// window.resUrl ="http://test.shouma.com.cn";
global.saodata=""; //扫码的全局变量
global.cliction=""; //判段尾部点击
global.picth="flase",
global.img="",
//解决自动转化rem的动态大小
window.onresize = setHtmlFontSize;
function setHtmlFontSize(){
    const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const htmlDom = document.getElementsByTagName('html')[0];
    htmlDom.style.fontSize = htmlWidth / 10 + 'px';
};
setHtmlFontSize();
exports.install = function (Vue, options) {
    //扫码
    Vue.prototype.saoma = function (fn){
        let ua = window.navigator.userAgent,
        app = window.navigator.appVersion;
        // alert('浏览器版本: ' + app + '\n' + '用户代理: ' + ua); 
        if (ua.match(/MicroMessenger/i) == 'MicroMessenger') {
            // 微信浏览器 
            console.log('微信浏览器');
            let jsURL=location.href.split('#')[0];
            let that=this;
            this.$http.get("/API/corweixin/GetToken",{params:{'jsURL':jsURL}},{emulateJSON: true}).then(res=>{ 
                var jsondata=res.data;
                wx.config({
                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: jsondata.appid,
                    // 必填，生成签名的时间戳
                    timestamp:jsondata.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: jsondata.noncestr,
                    // 必填，签名
                    signature: jsondata.signature,
                    // 必填，需要使用的JS接口列表，所有JS接口列表
                    jsApiList: ['scanQRCode'],
                    success:function(){
                        console.log("wx config ok");
                    }                
                });
            })
            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: ['scanQRCode'],
                    success: function (res) {
                    }
                });
                    wx.scanQRCode({
                        desc: 'scanQRCode desc',
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        if(result.indexOf("CODE") == -1){
                            fn(result)
                            }else{
                                var boxvlaue=result.slice(9);
                                fn(boxvlaue)
                            }
                        }
                    });
            })
        }else{
            global.bus.$off("global.saodata");
            bus.$emit('saoshowload',true);
            global.bus.$on("global.saodata",function(val){
                fn(val);
              });
        }
    };
    //获取cookie
    Vue.prototype.getCookie=function(name){
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return (arr[2]);
        }else{
            return null;
        }
    };
    //设置cookie
    Vue.prototype.setCookie=function(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    };
    //删除cookie
    Vue.prototype.delCookie=function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval =this.getCookie(name);
        if (cval != null)
         document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
       };
    //安卓和ios图片上传设置
    Vue.prototype.judge=function (){
        let ua = window.navigator.userAgent,
        app = window.navigator.appVersion;
            if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                // ios端 
                console.log('ios端');
            }
            else if(ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
                // android端 
                console.log("weixi")
                if (ua.match(/MicroMessenger/i) != 'MicroMessenger') {
                console.log('android端');
                global.picth=false;
            }   
        }            
        var device_type = navigator.userAgent.toLowerCase();//获取userAgent信息  
        var bIsIphoneOs = device_type.match(/iphone os/i) == "iphone os";
        var bIsAndroid = device_type.match(/android/i) == "android";
        if(bIsAndroid){
        $("input[type='file']").attr("capture","camera");
        }else if(bIsIphoneOs){         
        $("input[type='file']").removeAttr("capture");
        }
      };
      //拍照
      Vue.prototype.getImage=function(){
        var c = plus.camera.getCamera();
        var img="";
        c.captureImage(function(e) {
            plus.io.resolveLocalFileSystemURL(e, function(entry) {
                var s = entry.toLocalURL() + "?version=" + new Date().getTime();
            uploadHead(s);
            }, function(e) {
                console.log("读取拍照文件错误：" + e.message);
            });
        });
      }
      //本地相册选择
      Vue.prototype.galleryImg=function(){
          var img=""
        plus.gallery.pick(function(a) {
            plus.io.resolveLocalFileSystemURL(a, function(entry) {
                plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
                    var s = entry.toLocalURL() + "?version=" + new Date().getTime();                    
                    console.log(s)
                    uploadHead(s);
                }, function(e) {
                    console.log("get _www folder fail");
                })
            }, function(e) {
                console.log("读取拍照文件错误：" + e.message);
            });
        }, function(a) {}, {
            filter: "image"
        })
        //上传头像图片
  };
//上传头像图片
function uploadHead (imgPath) {
    console.log("imgPath = " + imgPath);
    var image = new Image();
    image.src = imgPath;
 image.onload = function() {
         var imgData = getBase64Image(image);
    }
}
//将图片压缩转成base64
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    var width = img.width;
    var height = img.height;
    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > 500) {
            height = Math.round(height *= 500 / width);
            width = 500;
        }
    } else {
        if (height > 500) {
            width = Math.round(width *= 500 / height);
            height = 500;
        }
    }
    canvas.width = width;   /*设置新的图片的宽度*/
    canvas.height = height; /*设置新的图片的长度*/
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height); /*绘图*/
    var dataURL = canvas.toDataURL("image/png", 0.8);
    bus.$emit('global.img',dataURL);
    // return dataURL.replace("data:image/png;base64,", "");
}   
}

