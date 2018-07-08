$(function() {
    // 获取sessionToken，设置userType、source
    GC.Hybrid.getToken();
});

/**
 * [getTokenReturn 获取token]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
function getTokenReturn(token) {
    //GC.Hybrid.showToast(token);
    var sessionToken = token;
    // localStorage存储sessionToken
    var storage = window.localStorage;
    storage.setItem("sessionToken",sessionToken);
    storage.setItem("source", "1");

    // 获取APP类型
    var userType = GC.Lib.GetQueryString("userType");

    if (userType) {
        storage.setItem("userType",userType);
    }
    else {
        userType = storage.getItem("userType");
    }

    // 从localStorage获取sessionToken
    //var sessionToken = storage.getItem("sessionToken");
    var apiHost = null;

    // 判断APP是C端还是E端
    if (userType === "e") {
        $(".funds-recharge").hide();
        apiHost = window.Host.employee;
    }
    else if (userType === "c") {
        apiHost = window.Host.customer;
    }
    else {
        GC.Hybrid.showToast("访问出错，请重试");
        GC.Hybrid.closePage();
    }

    // 跳转账户说明
    $(".funds-balanceExplain").on("click", function() {
        window.location.href = window.Host.local + "balanceExplain.html";
    });

    // 跳转冻结资金说明
    $(".funds-frozenFundsExplain").on("click", function() {
        window.location.href = window.Host.local + "frozenFundsExplain.html";
    });

    // 关闭WebView
    $(".title").find("span").on("click", function() {
        GC.Hybrid.closePage();
    });

    // 取消
    $(".funds-btns-cancel").on("click", function() {
        $(".funds-mask").hide();
    });

    // 确认
    $(".funds-btns-confirm").on("click", function() {
        $(".funds-mask").hide();
        GC.Hybrid.showDialog();
        var api = apiHost+"/account/auth"; 

        $.ajax({
            type: "POST",
            url: api,
            data:{"sessionToken":sessionToken, "source":1},
            dataType: "json",
            success: function(res) {
                GC.Hybrid.dismisDialog();
                if (res.succ) {
                    window.location.href = res.data;
                }
                else {
                    GC.Hybrid.showToast(res.message);
                    if (res.stateCode == 336) {
                        setTimeout(function() {
                            GC.Hybrid.closePage();
                        }, 3000);
                    }
                }
            }
        });
    });

    // 关闭弹出框
    $(".funds-mask").on("click", function() {
        $(this).hide();
    });
    $(".funds-frame").on("click", function(ev) {
        ev.stopPropagation();
    });

    // 请求余额
    (function() {
        GC.Hybrid.showDialog();
        var api = apiHost+"/account";

        $.ajax({
            type: "GET",
            url: api,
            data:{"sessionToken":sessionToken},
            dataType: "json",
            success: function(res) {
                GC.Hybrid.dismisDialog();
                if (res.succ) {
                    var data = res.data;

                    storage.setItem("balance", data.balance);
                    $(".js-balance").text(data.balance);
                    $(".js-frozenCapital").text(data.frozenCapital);

                    var authorized = data.authorized;

                    // 跳转明细
                    $(".funds-link").on("click", function() {
                        if (authorized) {
                            window.location.href = window.Host.local + "funds-detail.html";
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                    // 跳转充值
                    $(".funds-recharge").on("click", function() {
                        if (authorized) {
                            window.location.href = window.Host.local + "funds-recharge.html";
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                    // 跳转银行卡
                    $(".funds-banks").on("click", function() {
                        if (authorized) {
                            window.location.href = window.Host.local + "funds-bankCards.html";
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                    // 跳转提现
                    $(".funds-drawCash").on("click", function() {
                        if (authorized) {
                            if (data.balance == 0) {
                                GC.Hybrid.showToast("余额为零，无法提现！")
                            }
                            else {
                                // 需要首先验证支付密码
                                var api = apiHost+"/account/payCode/3";

                                GC.Hybrid.showDialog();

                                $.ajax({
                                    type: "POST",
                                    url: api,
                                    data:{"sessionToken":sessionToken},
                                    dataType: "json",
                                    success: function(res) {
                                        GC.Hybrid.dismisDialog();
                                        if (res.succ) {
                                            // 跳转页面
                                            window.location.href = res.data;
                                        }
                                        else {
                                            GC.Hybrid.showToast(res.message);
                                            if (res.stateCode == 336) {
                                                setTimeout(function() {
                                                    GC.Hybrid.closePage();
                                                }, 3000);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                }
                else {
                    if (res.stateCode == 336) {
                        GC.Hybrid.getToken();
                    }
                    else {
                        GC.Hybrid.showToast(res.message);
                    }
                }
            }
        });
    })();
}