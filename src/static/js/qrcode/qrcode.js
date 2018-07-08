;(function($, window) {
    $(function() {

        var qrcode = {
            api : window.Host.customer + "/case/app/ticket",  // 获取微信ticket接口
            requestUrl : window.location.href,

            handClick : function() {
                this.scanCode();
            },
            scanCode : function() {
                $.ajax({
                    type: "GET",
                    url: this.api,
                    data: {"requestUrl":this.requestUrl},
                    dataType: "json",
                    success: function(data) {

                        var data = data.data;

                        wx.config({
                            debug: false,
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.randomStr,
                            signature: data.ticket,
                            jsApiList: [
                                'scanQRCode',
                            ]
                        });

                        wx.ready(function () {
                            wx.scanQRCode({
                                needResult: 1,
                                desc: 'scanQRCode desc',
                                success: function (res) {
                                    var data = res.resultStr;
                                    var str = "promotion.coupon.code.yingwumeijia.com";
                                    var arr = null;
                                    if (data.indexOf(str) > -1) {
                                        arr = data.split(str);

                                        var api = window.Host.console+"/activity/coupon/use?couponCode="+arr[1];

                                        $.ajax({
                                            type: "POST",
                                            url: api,
                                            dataType: "json",
                                            success: function(res) {
                                                if (res.succ) {
                                                    GC.Lib.showJsToast("签到成功");
                                                }
                                                else {
                                                    GC.Lib.showJsToast(res.message);
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                            wx.error(function (res) {
                                GC.Lib.showJsToast(res);
                            });
                        });
                    }
                });
            }
        }

        $(".qrcode-btn").off().on("click", function() {
            qrcode.handClick();
        });
    });
})(Zepto, window);
