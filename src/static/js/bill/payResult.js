$(function() { 

    // 获取权限
    GC.Hybrid.getAccountToken("queryPayResult");

});

/**
 * [getAccountTokenReturn getAccoutToken回调函数]
 * @param  {[type]} val [返回值，name,accessToken,sessionId]
 * @return {[type]}     [description]
 */
function getAccountTokenReturn(val) {
    var value = window.atob(val);
    value = JSON.parse(value);
    var name = value.name;
    GC.Hybrid.accessToken = value.token;
    GC.Hybrid.sessionId = value.sessionId;
    window[name]();
}

/**
 * [queryPayResult 查询支付结果]
 * @return {[type]} [description]
 */
function queryPayResult() {
    var billId = GC.Lib.GetQueryString("billId");
    var serialNumber = GC.Lib.GetQueryString("serialNumber");
    var token = GC.Lib.GetQueryString("token");
    var billType = GC.Lib.GetQueryString("billType");
    var billDetailType = GC.Lib.GetQueryString("billDetailType");

    // 查询支付结果
    var api = window.Host.customer+"/bill/payResult/pay/shortcut?serialNumber="+serialNumber+"&token="+token;
    
    $.ajax({
        type: "GET",
        url: api,
        dataType: "json",
        beforeSend: function(request) {
            request.setRequestHeader("access-token",GC.Hybrid.accessToken);
            request.setRequestHeader("session-id",GC.Hybrid.sessionId);
        },
        success: function(res) {
            if (res.succ) {
                GC.Hybrid.payResult("true");
            }
            else if (res.stateCode === 312) {
                GC.Hybrid.toLogin();
            }
            else if (res.stateCode === 314) {
                GC.Hybrid.refreshToken("queryPayResult");
            }
            else if (res.stateCode === 315) {
                GC.Hybrid.getAccountToken("queryPayResult");
            }
            else {
                GC.Hybrid.payResult("false");
            }
        }
    });
}
