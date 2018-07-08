(function(win, $, undefined) {
    $(function() {
        /*后退*/
        $(".title").find("span").on("click", function() {
            var closeView=GC.Lib.GetQueryString("close");
            closeView==1? invokeNative({"code":1003}):window.history.go(-1);
        });
    });

    //初始化数据
    var apiUrl=window.Host.customer + "/twitter/commission";


    /*获取统计数据方法*/
    getTwitterFundsIndexDataInfo();
    function getTwitterFundsIndexDataInfo(){
        $.ajax({
            type: "get",
            url: apiUrl,
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("access-token",userInfo.accessToken);
                request.setRequestHeader("session-id",userInfo.sessionId);
            },
            success: function(res) {
                invokeNative({"code":1002});// loading hide;

                if (res.stateCode===0 && res.data) {
                    $(".funds-data-all").text((res.data.commissionTotal).toFixed(2)||"0.00");
                    $(".funds-data-pre").text(res.data.toSettleTotal.toFixed(2)||"0.00");
                    $(".funds-data-after").text(res.data.settledTotal.toFixed(2)||"0.00");
                }
                else if (res.stateCode === 312) {
                    invokeNative({"code": window.jsBridge.CODE_LOGIN,"callback":"loginReturn","extra":"getTwitterFundsIndexDataInfo"});
                }
                else if (res.stateCode === 314) {
                    invokeNative({"code":1001});//loading
                    refreshToken("getTwitterFundsIndexDataInfo");
                }
                else if (res.stateCode === 315) {
                    invokeNative({"code":1001});//loading
                    getAccountToken("getTwitterFundsIndexDataInfo");
                }
                else {
                    invokeNative({ "code": 1004,"data": res.message});
                }
            }
        });
    }



})(window, Zepto);