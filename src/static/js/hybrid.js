//localStorage.accessToken="3f935c661269bc0a3db15f8ee4b1db71";
//localStorage.sessionId="c275";

(function (win, GC, undefined) {
    // 设备检测
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    win.userInfo = {
        "accessToken": !localStorage.accessToken ? null : localStorage.accessToken,
        "sessionId": !localStorage.sessionId ? null : localStorage.sessionId
    };


    //// 用户信息
    //var userInfo = {
    //    "accessToken": !localStorage.accessToken?null:localStorage.accessToken,
    //    "sessionId": !localStorage.sessionId?null:localStorage.sessionId,
    //};

    var invokeNative = function (data) {
        //Android接口
        if (isAndroid) {
            var data_android = JSON.stringify(data);
            window.jsIntelligencer.invokeNative(data_android);
        }
        //iOS接口
        if (isiOS) {
            var message = data;
            window.webkit.messageHandlers.invokeNative.postMessage(message);
        }
    };

    var getAccountToken = function (name) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.getAccountToken(name);
        }
        //iOS接口
        if (isiOS) {
            var message = name;
            window.webkit.messageHandlers.getAccountToken.postMessage(message);
        }
    };

    var refreshToken = function (name) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.refreshToken(name);
        }
        //iOS接口
        if (isiOS) {
            var message = name;
            window.webkit.messageHandlers.refreshToken.postMessage(message);
        }
    };

    var getAccountTokenReturn = function (val) {
        var value = window.atob(val);
        value = JSON.parse(value);
        var name = value.name;
        localStorage.accessToken = value.token;
        localStorage.sessionId = value.sessionId;
        userInfo.accessToken = localStorage.accessToken;
        userInfo.sessionId = localStorage.sessionId;
        if(!!name) {
            window[name]();
        }
    };

    var loginReturn = function (val) {

        var value = window.atob(val);
        res = JSON.parse(value);

        if (res.data === true) {
            getAccountToken(res.data.extra || "")
        }
    };
    /*
    *
    *  数据埋点字段 
    */
    var dataLog = {
        /*(2,"账号相关")action*/
        ACTION_LOGIN:2,                             //登录
        ACTION_REGISTER:3,                          //注册
        ACTION_FIND_PASSWORD:4,                     //找回密码
        /*账号相关来源actionResource*/
        ACTION_RESOURCE_SEE_MATERIAL_SUBSIDY:13,    //(13, 2, "APP-优惠-查看主材补贴")
        ACTION_RESOURCE_ENROLL:14,                  //(14, 2, " APP-优惠-立即报名"),                                 
        ACTION_RESOURCE_CREATE_ORDER:15,            //(15, 2, "APP-保障-立即下单"),                        
        ACTION_RESOURCE_DEVELOP_TWITTER:19,         //(19, 2, " H5-发展推客"),                           
        ACTION_RESOURCE_REPORT_CUSTOMER:20,         //(20, 2, " H5-报备客户"),                                                 
        ACTION_RESOURCE_MATERIAL_SUBSIDY:21,        //(21, 2, " H5-主材补贴"),    

        /*(4, "优惠相关")action*/
        ACTION_SEE_DISCOUNT_DETAIL:12,              //(12, 4, "查看优惠详情"),                                  
        ACTION_SEE_MATERIAL_SUBSIDY:13,             //(13, 4, "查看主材补贴"),  

        /*(5, "保障相关")action*/
        ACTION_CLICK_PEOPLE_ASK:15,                 //(15, 5, "点击人工咨询"),                                             
        ACTION_CLICK_APPLY_GUARANTEE:16,            //(16, 5, "点击申请保障"),
    }

    //win["userInfo"] = userInfo;
    win["loginReturn"] = loginReturn;
    win["invokeNative"] = invokeNative;
    win["getAccountToken"] = getAccountToken;
    win["refreshToken"] = refreshToken;
    win["getAccountTokenReturn"] = getAccountTokenReturn;
    win["dataLog"]=dataLog;

})(window, GC);



