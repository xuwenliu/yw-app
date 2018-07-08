$(function() {

    $(".title").find("span").on("click", function() {
        dismisDialog();
        payReturn();
    });

    showDialog();

    payInfo();

});

/**
 * [countDown 倒计时]
 * @return {[type]} [description]
 */
function countDown() {
    var val = 5;
    var timer = setInterval(function() {
        val--;
        if (val === 0) {
            clearInterval(timer);
            // 跳转页面
            payReturn();
        }
        $(".payResult-p").find("span").text(val);
    }, 1000);
}

/**
 * [payInfoReturn app支付页面接口回调方法]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function payInfoReturn(val) {
    var value = window.atob(val);
    value = JSON.parse(value);
    token = value.token;

    var d = GetQueryString("d");

    var api = window.Host.customer+"/case/order/consume/query";
    $.ajax({
        type: "GET",
        url: api,
        data:{"token":token, "d":d},
        dataType: "json",
        success: function(data) {
            dismisDialog();
            if (data.succ) {
                $(".payResult-success").show().find(".payResult-h3").text("支付成功");
                
            }
            else {
                $(".payResult-success").show().find(".payResult-h3").text("支付失败");
            }
            countDown();
        }
    });
}

/**
 * [payInfo app支付页面接口]
 * @return {[type]} [description]
 */
function payInfo() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.payInfo();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.payInfo.postMessage("");
    }
}

/**
 * [showToast 弹出提示信息]
 * @param  {[type]} caseId [description]
 * @return {[type]}        [description]
 */
function showToast(message) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.showToastMessage(message);
    }
    //iOS接口
    if (isiOS) {
        var message = message;
        window.webkit.messageHandlers.toastMessage.postMessage(message);
    }
}

/**
 * [payReturn 跳转到预约详情页面]
 * @return {[type]} [description]
 */
function payReturn() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.payReturn();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.payReturn.postMessage("");
    }
}

/**
 * [showDialog 等待提示]
 * @return {[type]} [description]
 */
function showDialog() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.showDialog();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.showDialog.postMessage("");
    }
}

/**
 * [dismisDialog 隐藏提示]
 * @return {[type]} [description]
 */
function dismisDialog() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

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
 * [GetQueryString 通过名字查询url参数]
 * @param {[type]} name [description]
 */
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
