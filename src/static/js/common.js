var GC = window.GC || {};

/**
 * Hybrid：与移动端的交互方法
 */
GC.Hybrid = (function() {
    // 设备检测
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    this.accessToken = null;
    this.sessionId = null; 
    this.phoneNumber = null;

    /**
     * [getToken 获取资金信息token]
     * @return {[type]} [description]
     */
    var getToken = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.getToken();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.getToken.postMessage("");
        }
    };

    /**
     * [closePage 关闭webview]
     * @return {[type]} [description]
     */
    var closePage = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.closePage();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.closePage.postMessage("");
        }
    };

    /**
     * [showToast 弹出提示信息]
     * @param  {[type]} caseId [description]
     * @return {[type]}        [description]
     */
    var showToast = function (message) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.showToastMessage(message);
        }
        //iOS接口
        if (isiOS) {
            var message = message;
            window.webkit.messageHandlers.toastMessage.postMessage(message);
        }
    };

    /**
     * [showDialog 等待提示]
     * @return {[type]} [description]
     */
    var showDialog = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.showDialog();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.showDialog.postMessage("");
        }
    };

    /**
     * [dismisDialog 隐藏提示]
     * @return {[type]} [description]
     */
    var dismisDialog = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.dismisDialog();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.dismisDialog.postMessage("");
        }
    }

    /**
     * [openWebview 打开webview，渲染指定页面]
     * @param  {[type]} url [需要渲染的页面url]
     * @return {[type]}     [description]
     */
    var openWebview = function(url) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.openWebview(url);
        }
        //iOS接口
        if (isiOS) {
            var message = url;
            window.webkit.messageHandlers.openWebview.postMessage(message);
        }
    }

    /**
     * [getAccountToken 获取登录Token]
     * @param  {[type]} name [回调函数名]
     * @return {[type]}      [description]
     */
    var getAccountToken = function(name) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.getAccountToken(name);
        }
        //iOS接口
        if (isiOS) {
            var message = name;
            window.webkit.messageHandlers.getAccountToken.postMessage(message);
        }
    }

    /**
     * [refreshToken 刷新token]
     * @param  {[type]} name [回调函数名]
     * @return {[type]}      [description]
     */
    var refreshToken = function(name) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.refreshToken(name);
        }
        //iOS接口
        if (isiOS) {
            var message = name;
            window.webkit.messageHandlers.refreshToken.postMessage(message);
        }
    }

    /**
     * [toLogin 跳转登录页面]
     * @return {[type]} [description]
     */
    var toLogin = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.toLogin();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.toLogin.postMessage("");
        }
    }

    /**
     * [shareActivity 分享页面到微信等]
     * @param  {[type]} shareInfo [分享接口所需内容]
     * @return {[type]}           [description]
     */
    var shareActivity = function(shareInfo) {
        //Android接口
        if (isAndroid) {
            var shareInfo_android = JSON.stringify(shareInfo);
            window.jsIntelligencer.shareActivity(shareInfo_android);
        }
        //iOS接口
        if (isiOS) {
            var message = shareInfo;
            window.webkit.messageHandlers.shareActivity.postMessage(message);
        }
    }

    /**
     * [toPay 跳转收银台]
     * @param  {[type]} data [数据]
     * @return {[type]}      [description]
     */
    var toPay = function(data) {
        //Android接口
        if (isAndroid) {
            var data_android = JSON.stringify(data);
            window.jsIntelligencer.toPay(data_android);
        }
        //iOS接口
        if (isiOS) {
            var message = data;
            window.webkit.messageHandlers.toPay.postMessage(message);
        }
    }

    /**
     * [caseSkip 跳转案例]
     * @param  {[type]} caseId [案例ID]
     * @return {[type]}        [description]
     */
    var caseSkip = function(caseId) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.caseSkip(caseId);
        }
        //iOS接口
        if (isiOS) {
            var message = caseId;
            window.webkit.messageHandlers.caseSkip.postMessage(message);
        }
    }

    /**
     * [getUserInfo 获取用户信息]
     * @return {[type]} [description]
     */
    var getUserInfo = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.getUserInfo();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.getUserInfo.postMessage("");
        }
    }

    var payResult = function(bool) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.payResult(bool);
        }
        //iOS接口
        if (isiOS) {
            var message = bool;
            window.webkit.messageHandlers.payResult.postMessage(message);
        }
    }
    return {
        closePage: closePage,
        getToken: getToken,
        showToast: showToast,
        showDialog: showDialog,
        dismisDialog: dismisDialog,
        openWebview: openWebview,
        shareActivity: shareActivity,
        getAccountToken: getAccountToken,
        refreshToken: refreshToken,
        toLogin: toLogin,
        caseSkip: caseSkip,
        getUserInfo: getUserInfo,
        toPay: toPay,
        payResult: payResult,
    };
})();

/**
 * Lib：通用库
 */
GC.Lib = (function() {

    /**
     * [GetQueryString 获取url参数]
     * @param {[type]} name [参数名称]
     */
    var GetQueryString = function(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    };

    /**
     * [toDouble 个位数字添0]
     * @param  {[type]} iNum [数字参数]
     */
    var toDouble = function(iNum) {
        if (iNum < 10) {
            return '0' + iNum;
        } else {
            return '' + iNum;
        }
    };

    /**
     * [setTime 通用时间格式转换]
     * @param {[type]} para [时间戳]
     */
    var setTime = function (para) {
        var newTime = new Date(para);
        var result=newTime.getFullYear()+"."+toDouble(newTime.getMonth()+1)+"."+toDouble(newTime.getDate()) + " " + toDouble(newTime.getHours()) + ":" + toDouble(newTime.getMinutes()) + ":" + toDouble(newTime.getSeconds());
        return result;
    };

    /**
     * [setDate 通用日期格式转换]
     * @param {[type]} para [时间戳]
     */
    var setDate = function (para) {
        var newTime = new Date(para);
        var result=newTime.getFullYear()+"."+toDouble(newTime.getMonth()+1)+"."+toDouble(newTime.getDate());
        return result;
    };

    /**
     * [showToast 提示]
     * @param  {[type]} text [提示文本]
     * @return {[type]}      [description]
     */
    var showJsToast = function (text) {
        $("body").find(".js-toast").remove();

        var timer =null;
        var oDiv = $('<div class="js-toast"><p>'+text+'</p></div>');
        oDiv.appendTo($("body"));

        timer = setTimeout(function() {
            $("body").find(".js-toast").remove();
        }, 3000);
    };

    /**
     * validRule
     */
    var validRule={
        price: /^\d{1,12}(\.\d{1,2})?$/,
        short_number: /^[0-9]{1,50}$/,//数字
        number: /^[0-9]{15}$/,//数字
        phonecode: /^[0-9]{6}$/,//验证码
        reNumber: /^.*[^\d].*$/,//非数字
        username:/^[a-zA-Z0-9]{8,20}$/, ///^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{8,20}$/,//数字字母组合用户名
        password:/^[a-zA-Z0-9]{8,20}$/, // //密码
        phone: /0?(13|14|15|18|17)[0-9]{9}$/,//手机号
        identity: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)|(^\d{14}(\d|X|x)$)/,//身份证
        realname: /^[\u4e00-\u9fa5]{2,10}$/,// 真实姓名
        backname: /^[\u4e00-\u9fa5]{2,50}$/,// 银行、公司姓名
        mergeCert: /(\w{2})(\d{6})(\w{10})/,//三证合一
        comcode: /^[a-zA-Z0-9]/ //数字字母
    };



    return {
        GetQueryString: GetQueryString,
        toDouble: toDouble,
        setTime: setTime,
        setDate: setDate,
        showJsToast: showJsToast,
        validRule: validRule
    }
})();

/**
 * 通用方法
 * **/

$(function() {
    /*打开dialog*/
    $(".qa-info").on("click",function(){
        $(".dialog-base").show();
    });

    /*关闭dialog*/
    $(".dialog-btn-close").on("click",function(){
        $(".dialog-base").hide();
    });
});


/*过滤图片大小参数*/

function filterImagesUrl(u){
    var url=u||"";
    //return url.split("?")[0];//实际能作废
    return url;


}

/*v1.10.0数据埋点请求*/
function postDataLog(data,accessToken,sessionId){
    console.log("accessToken----"+accessToken);
    console.log("sessionId----"+sessionId)
    console.log("字符串------"+JSON.stringify(data));
    console.log(data);
    var api = window.Host.customer+"/datalog/log"
    // https://devcustomer.yingwumeijia.com:443/{version}/datalog/log
    $.ajax({
        type: "POST",
        url: api,
        data:JSON.stringify(data),
        headers:{
            'access-token':accessToken,
            'session-id':sessionId
        },
        dataType: "json",
        contentType: "application/json",
        success: function(res) {
            if(res.succ) {
             console.log("数据埋点成功！");  
            }
        }
    });
}
/*v1.10.0获取设备信息*/
function getEquipmentInfo(){
    var equipmentSystem,equipmentSystemVersion,equipmentVersion;
    var uA = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"); 
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1); 
    var isPC = !/Android|webOS|iPhone|SymbianOS|Windows Phone|iPad|iPod|BlackBerry/i.test(uA);
    var isWin7 = uA.indexOf("Windows NT 6.1") > -1 || uA.indexOf("Windows 7") > -1;
    var isWin8 = uA.indexOf("Windows NT 6.2") > -1 || uA.indexOf("Windows 8") > -1;
    var isWin10 = uA.indexOf("Windows NT 10.0") > -1 || uA.indexOf("Windows 10") > -1;

    if(isPC) {
        if(isWin){
            equipmentSystem="Windows";
            if(isWin7) {
                equipmentSystemVersion="Win7";
            }
            if(isWin8) {
                equipmentSystemVersion="Win8";
            }
            if(isWin10) {
                equipmentSystemVersion="Win10";
            }
        }else if(isMac){
            equipmentSystem="Mac";
            equipmentSystemVersion=uA.split("Intel Mac OS X")[1].split(")")[0].replace(/_/g,".");
        }else if(isUnix){
            equipmentSystem="Unix";
            equipmentSystemVersion="";
        }else if(isLinux){
            equipmentSystem="Linux";
            equipmentSystemVersion="";
        }else {
            equipmentSystem="other";
            equipmentSystemVersion="";
        }
        equipmentVersion="";
    }else if(/Android/i.test(uA)){
        equipmentVersion = uA.split(";")[2].split("Build/")[0];
        equipmentSystem = "Android"; 
        equipmentSystemVersion = uA.split(";")[1].split("Android")[1];
        
    }else  if(/iPhone/i.test(uA)){
        equipmentVersion="iPhone";
        equipmentSystem="IOS";
        var str= uA.toLowerCase(); 
        var ver=str.match(/cpu iphone os (.*?) like mac os/)[1].replace(/_/g,".");
        equipmentSystemVersion=ver;
    }else {
        equipmentVersion="other";
        equipmentSystem="other";
        equipmentSystemVersion="";
    }

    return {
        "equipmentId":"",
        "equipmentVersion":equipmentVersion,
        "equipmentSystem":equipmentSystem,
        "equipmentSystemVersion":equipmentSystemVersion,
    }
}