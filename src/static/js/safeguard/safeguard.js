(function(win, $, undefined) {

$(function() {
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    window.getAccountTokenReturn = function(val) {
        var value = window.atob(val);
            value = JSON.parse(value);
            var name = value.name;
            localStorage.accessToken=value.token;
            localStorage.sessionId=value.sessionId;
           
    }
//  if (isiOS) {
//      $(".wrap").addClass("ios-blank");
//  }
    //backArrow=1显示保障页面的返回按钮backArrow=0不显示
    console.log("backarrow -------"+GC.Lib.GetQueryString("backArrow"));

    if(GC.Lib.GetQueryString("backArrow")==1){
        $(".title").find("span").show();
        // 返回前一个页面
        $(".title").find("span").on("click", function() {
            GC.Hybrid.closePage();
        });
        $('.title').removeClass('newtitle');
        $('#message').hide();
    }else {
        $(".title").find("span").hide();
    }
    //人工咨询
    $(".helpAndsafeguard").find("a").eq(0).on("click",function(){
        /*v1.10.0数据埋点 ACTION_CLICK_PEOPLE_ASK(15, 5, "点击人工咨询"),   */
        /*A 获取设备信息*/
        invokeNative({
            "code":window.jsBridge.CODE_DEVICE_SYSTEM_INFO,
            "callback":"returnEquipmentInfo"
        });
        window.returnEquipmentInfo=function(value){
            var value = window.atob(value);
            var res = JSON.parse(value);
            var data = res.data;
            data.action = dataLog.ACTION_CLICK_PEOPLE_ASK;//15
            data.actionResult = 200;
            getAccountToken();
            /*B执行提交操作postDataLog方法在common.js里面*/
            postDataLog(data,localStorage.accessToken,localStorage.sessionId);
        }
        /*v1.10.0 直接打电话*/
        invokeNative({
            "code":window.jsBridge.CODE_CALL_PHONE_NUMBER,
            "data":"02885108092"
        });
    })
    //申请保障页
    $(".helpAndsafeguard").find("a").eq(1).on("click",function(){
        /*v1.10.0数据埋点 ACTION_CLICK_APPLY_GUARANTEE(16, 5, "点击申请保障"),*/
        /*A 获取设备信息*/
        invokeNative({
            "code":window.jsBridge.CODE_DEVICE_SYSTEM_INFO,
            "callback":"returnEquipmentInfo"
        });
        window.returnEquipmentInfo=function(value){
            var value = window.atob(value);
            var res = JSON.parse(value);
            var data = res.data;
            data.action = dataLog.ACTION_CLICK_APPLY_GUARANTEE;//16
            data.actionResult = 200;
            /*B执行提交操作postDataLog方法在common.js里面*/
            getAccountToken();
            postDataLog(data,localStorage.accessToken,localStorage.sessionId);
        }
        //console.log("去申请保障页---用户不需要登录也可访问在url后面拼接isNeedToken=0");
        var url=window.Host.localUrl+"/#/applyForSecurity?isNeedToken=0";//本地
        invokeNative({
            "code":window.jsBridge.CODE_OPEN,
            "data":{
                "url":url
            }
        });
    })

    /*点击查看详情和图片列表显示*/
    window.lookDetail=function(i){
       if(i==1){
       		var url=window.Host.localUrl+"/#/acceptanceOfDetails?isNeedToken=0";
            invokeNative({
                "code":window.jsBridge.CODE_OPEN,
                "data":{
                    "url":url
                }
            });
       }else {
            console.log("内容正在陆续上传中，敬请期待...");
            invokeNative({
               "code": window.jsBridge.CODE_TOAST,
               "data":"内容正在陆续上传中，敬请期待..."
            });
       }
    }
});



})(window, Zepto);