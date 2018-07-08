$(function() {
    orderId = null;
    token = null;
    phase = null;

    payInfo();
    showDialog();

    // 返回上一页
    $(".title").find("span").on("click", function() {
        dismisDialog();
        closePage();
    });

    // 选择支付方式
    $(".pay-list").on("click", "li" ,function() {
        if (!$(this).hasClass("pay-item-wait") && !$(this).hasClass("pay-item-active")) {
            $(this).addClass("pay-item-active").siblings("li").removeClass("pay-item-active");
        }
    });

    // 点击分批支付
    $(".pay-batch").on("click", function() {
        var payToolType = $(".pay-item-active").data("payToolType");
        payToolType = parseInt(payToolType);
        var payAmount = $(".js-overplus").text();
        payAmount = parseFloat(payAmount);
        var balance = $(".pay-balance-value").text();
        balance = parseFloat(balance);

        if (typeof payToolType !== "number" || isNaN(payToolType)) {
            showToast("请选择付款方式！");
            return false;
        }

        if (payAmount < 300) {
            showToast("金额小于300元，请直接点击去支付！");
            return false;
        }

        var message = null;
        if (payToolType === 2) {
            message = {"payToolType":payToolType, "payAmount":payAmount, "balance":balance};
        }
        else {
            message = {"payToolType":payToolType, "payAmount":payAmount, "balance":0};
        }

        payBatch(message);

    });

    // 点击支付
    $(".pay-btn").on("click", function() {
        var payToolType = $(".pay-item-active").data("payToolType");
        payToolType = parseInt(payToolType);
        var payAmount = $(".js-overplus").text();
        payAmount = parseFloat(payAmount);
        var balance = $(".pay-balance-value").text();
        balance = parseFloat(balance);

        if (typeof payToolType !== "number" || isNaN(payToolType)) {
            showToast("请选择付款方式");
            return false;
        }

        if (payToolType === 1 &&  balance < payAmount && balance >= 300) {
            showToast("余额不足，请选择分批支付");
        }
        
        if (payToolType === 2) {
            var bindId = $(".pay-item-active").data("bindId");
            var data = {"orderId":orderId,"phase":phase, "payToolType":payToolType, "token":token, "payAmount":payAmount, "bindId":bindId};
        }
        else {
            var data = {"orderId":orderId,"phase":phase, "payToolType":payToolType, "token":token, "payAmount":payAmount};
        }

        var api = window.Host.customer+"/case/order/pay";
        $.ajax({
            type: "POST",
            url: api,
            data:JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            beforeSend: function() {
                showDialog();
            },
            success: function(data) {
                dismisDialog();
                
                if (data.succ) {
                    window.location.href = data.data;
                }
                else {
                    showToast("付款失败，请返回重试！");
                }
            }
        });

    });


});

/**
 * [payInfoReturn app支付页面接口回调方法]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function payInfoReturn(val) {
    var value = window.atob(val);
    value = JSON.parse(value);
    orderId = parseInt(value.orderId);
    token = value.token;
    phase = parseInt(value.payStep);

    // 请求订单金额，待付金额
    (function() {
        var api = window.Host.customer+"/case/order/cashier/"+orderId+"/"+phase;
        $.ajax({
            type: "GET",
            url: api,
            data:{"token":token},
            dataType: "json",
            success: function(data) {

                if (data.succ) {
                    $(".js-total").text(data.data.totalAmount);
                    $(".js-overplus").text(data.data.dueToPayAmount);
                    $(".js-phase").text(data.data.phaseName);
                }
                else {
                    showToast(data.message);
                }
            }
        });
    })();

    // 请求余额，判断是否身份验证
    (function() {
        var api = window.Host.customer + "/account";

        $.ajax({
            type: "GET",
            url: api,
            data:{"sessionToken":token},
            dataType: "json",
            success: function(res) {
                // 接口请求是否成功
                if (res.succ) {
                    // 该用户是否已认证
                    if (res.data.authorized) {
                        var data = res.data;
                        var balance = data.balance;
                        var payAmount = $(".js-overplus").text();
                        balance = parseFloat(balance);
                        payAmount = parseFloat(payAmount);

                        $(".pay-balance-value").text(balance);

                        if (balance < payAmount && balance < 300) {
                            $(".pay-balance").addClass("pay-item-wait");
                        }

                        $(".pay-balance").show();
                        //$(".pay-newCard").show();

                        // 已绑定的新卡
                        (function() {
                            // 请求已绑定的银行卡
                            var api = window.Host.customer + "/account/bankCards";

                            $.ajax({
                                type: "GET",
                                url: api,
                                data:{"sessionToken":token,"onlyDebitCard": false},
                                dataType: "json",
                                success: function(res) {
                                    dismisDialog();
                                    if (res.succ) {

                                        if (!res.data) {
                                            return false;
                                        }

                                        var arr = res.data;

                                        $.each(arr, function(i, index) {
                                            var number = index.bankCardNumber.substr(-4);

                                            var oLi = $('<li class="pay-bindCard" data-pay-tool-type="2" data-bind-id="'+index.bindId+'"></li>');
                                            var str = '<span class="pay-newCard-logo fl" style="background-image:url('+index.bankLogo+')"></span>';
                                                str += '<span class="pay-item-text fl">'+index.bankName+' （尾号'+number+'）</span>';
                                                str += '<span class="pay-item-radio fr"></span>';

                                            oLi.html(str).insertBefore($(".pay-newCard"));
                                        });
                                    }
                                    else {
                                        showToast(res.message);
                                    }
                                }
                            });
                        })();
                    }
                    else{
                        dismisDialog();
                    }
                }
                else {
                    dismisDialog();
                    showToast(res.message);
                }
            }
        });
    })();
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
 * [payBatch 调用原生分批支付弹出框]
 * @param  {[type]} message [arguments]
 * @return {[type]}         [description]
 */
function payBatch(message) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        var payToolType = message.payToolType;
        var payAmount = message.payAmount;
        var balance = message.balance;
        window.jsIntelligencer.payBatch(payToolType, payAmount, balance);
    }
    //iOS接口
    if (isiOS) {
        var message = message;
        window.webkit.messageHandlers.payBatch.postMessage(message);
    }
}

/**
 * [showToast 弹出提示信息]
 * @param  {[type]} message [description]
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
 * [closePage 关闭h5页面]
 * @return {[type]} [description]
 */
function closePage() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.closePage();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.closePage.postMessage("");
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