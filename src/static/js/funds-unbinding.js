$(function() {
    // 返回上一页
    $(".title").find("span").on("click", function() {
        GC.Hybrid.dismisDialog();
        window.history.go(-1);
    });

    // 从localStorage提取当前银行卡信息
    var storage = window.localStorage;
    var sessionToken = storage.getItem("sessionToken");
    var userType = storage.getItem("userType");
    var apiHost = null;

    // 判断APP是C端还是E端
    if (userType === "e") {
        apiHost = window.Host.employee;
    }
    else if (userType === "c") {
        apiHost = window.Host.customer;
    }
    else {
        GC.Hybrid.showToast("访问出错，请重试");
        GC.Hybrid.closePage();
    }

    //　从url参数获取token
    var token = GC.Lib.GetQueryString("token");
    var bindId = GC.Lib.GetQueryString("bindId");
    var requestNo = GC.Lib.GetQueryString("requestNo");
    // 解绑
    var api = apiHost+"/account/bankCard/"+bindId;

    GC.Hybrid.showDialog();

    $.ajax({
        type: "POST",
        url: api,
        data:{"sessionToken":sessionToken, "token":token, "requestNo":requestNo},
        dataType: "json",
        success: function(res) {
            GC.Hybrid.dismisDialog();
            if (res.succ) {
                GC.Hybrid.showToast("解绑成功");
            }
            else {
                GC.Hybrid.showToast(res.message);
                if (res.stateCode == 336) {
                    setTimeout(function() {
                        GC.Hybrid.closePage();
                    }, 3000);
                }
            }
            window.location.href = window.Host.local + "funds-bankCards.html";
        }
    });   
});