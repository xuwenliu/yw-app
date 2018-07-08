$(function() {
    new FastClick(document.body);

    // 判断是否为推客链接
    var twitterId = GetQueryString("uid"),   // 推客id
        twitterType = GetQueryString("type"),    // 推客类型
        isTwitter = GetQueryString("twitter");  // 是否为twitter

    (function() {
        var options = {
            "twitterId": twitterId,
            "twitterType": twitterType,
            "isTwitter": isTwitter
        };
        $(".js-download").on("click", function() {
            wxTips(options);    
        });
    })();

    // 关闭微信提示
    $(".wxTips").on("click", function() {
        $(this).hide();
    });

    // 关闭底部下载提示层
    $(".bottom-close").on("click", function(ev) {
        ev.stopPropagation();
        $(".wrap").find(".bottom").remove();
    });
});

/**
 * [wxTips 微信提示从浏览器打开]
 * @return {[type]} [description]
 */
function wxTips(options) {
    var options = options;

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    // 判断是否为微信
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象

    if (options.isTwitter === "true") {
        window.location.href = window.Host.local+"register.html?uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
        return false;
    }

    // 是否在微信内打开
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        $(".wxTips").show();
        return false;
    }

    // 是否在微博内打开
    if (ua.match(/WeiBo/i) == "weibo") {
        $(".wxTips").show();
        return false;
    }

    //Android接口
    if (isAndroid) {
        _czc.push(["_trackEvent","下载按钮","安卓设备","分享案例"]); 
        window.location.href = "http://o7zlnyltf.bkt.clouddn.com/app-ywmj-release.apk";           
    }
    //iOS接口
    if (isiOS) {
        _czc.push(["_trackEvent","下载按钮","iOS设备","分享案例"]);
        window.location.href = "http://itunes.apple.com/us/app/id1133878484";
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