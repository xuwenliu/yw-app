$(function() {
    var userType = GC.Lib.GetQueryString("userType");  // 判断C端还是E端
    var source = GC.Lib.GetQueryString("source");  // 判断来源是推客信息还是资金信息
    var storage = window.localStorage;
    var apiHost = null;

    if (source == "2") {
        // 获取sessionToken
        GC.Hybrid.getToken();
    }

    if (userType) {
        storage.setItem("userType",userType);
    }
    else {
        userType = storage.getItem("userType");
    }

    if (!source) {
        source = storage.getItem("source");
    }

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

    // 返回上一页
    $(".title").find("span").on("click", function() {
        GC.Hybrid.dismisDialog();
        if (source == "2") {
            GC.Hybrid.closePage();
        }
        else {
            window.location.href = window.Host.local + "funds.html?source=1";
        }
    });

    (function() {
        // 从localStorage获取sessionToken
        var storage = window.localStorage;
        var sessionToken = storage.getItem("sessionToken");

        // 添加银行卡
        $(".bankCards-add").on("click", function() {
            GC.Hybrid.showDialog();
            var url = apiHost+"/account/bankCard";

            $.ajax({
                type: "POST",
                url: url,
                data:{"sessionToken":sessionToken},
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

        // 请求银行卡列表
        var api = apiHost+"/account/bankCards";

        GC.Hybrid.showDialog();

        $.ajax({
            type: "GET",
            url: api,
            data:{"sessionToken":sessionToken,"onlyDebitCard": false},
            dataType: "json",
            success: function(res) {
                GC.Hybrid.dismisDialog();
                if (res.succ) {

                    if (!res.data) {
                        $(".bankCards-tips").show();
                        return false;
                    }

                    var arr = res.data;

                    $.each(arr, function(i, index) {
                        var oLi = $('<li></li>');
                        var str = '<div data-bind-id='+index.bindId+' class="bankCards-logo">';
                            str += '<div style="background-image:url('+index.bankLogo+')"></div>';
                            str += '</div>';
                            str += '<div class="bankCards-info">';
                            str += '<h4>'+index.bankName+'</h4>';
                            str += '<p>'+index.bankCardTypeDesc+'</p>';
                            str += '<span>'+index.bankCardNumber+'</span>';
                            str += '</div>';

                        oLi.html(str).appendTo($(".bankCards-list"));

                        oLi.on("click", function() {
                            var storage = window.localStorage;
                            var bankCard=JSON.stringify(index);
                            storage.setItem("bankCard",bankCard);

                            window.location.href = window.Host.local+"funds-bankCardsInfo.html";
                        });
                       
                    });
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
    })();
});

/**
 * [getTokenReturn 获取token]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
function getTokenReturn(token) {
    var sessionToken = token;
    // localStorage存储sessionToken
    var storage = window.localStorage;
    storage.setItem("sessionToken",sessionToken);
    storage.setItem("source", "2");
}