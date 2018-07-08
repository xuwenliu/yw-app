$(function() {
    // 判断是否为推客链接
    var twitterId = GetQueryString("uid"),   // 推客id
        twitterType = GetQueryString("type"),    // 推客类型
        isTwitter = GetQueryString("twitter");  // 是否为twitter
    twitterId = parseInt(twitterId);

    // 注册信息
    var data = null;

    // 选择用户协议
    $(".checkBox-icon").on("click", function() {
        if ($(this).hasClass("checkBox-icon-active")) {
            $(this).removeClass("checkBox-icon-active");
        }
        else {
            $(this).addClass("checkBox-icon-active");
        }
    });

    // 发送验证码
    $(".sendCode").on("click", function() {
        var self = $(this);
        var phoneNumber = $(".phoneNumber").val();

        if (!self.hasClass("sendCode-invalid")) {
            // 判断手机号是否正确
            if (!phoneNumber.match(/^1\d{10}$/)) {
                showJsToast("请输入正确的手机号");   
                return false;
            }

            self.text("60秒").addClass("sendCode-invalid");

            // 倒计时
            var num = 60;
            var timer = setInterval(function() {
                num--;
                if (num === 0) {
                    clearInterval(timer);
                    self.text("重新获取").removeClass("sendCode-invalid");
                }
                else {
                    self.text(num+"秒");
                }
            }, 1000);

             // 请求发送验证码
            (function() {
                var api = window.Host.customer + "/user/sendSmsCode";

                $.ajax({
                    type: "POST",
                    url: api,
                    data:{"phone":phoneNumber, "source":1},
                    dataType: "json",
                    success: function(res) {
                        if (!res.succ) {
                            showJsToast(res.message);
                        }
                    }
                });

            })();   
        }
    });

    // 点击注册
    $(".submit").on("click", function() {
        var self = $(this);

        // 判断手机号是否正确
        if (!$(".phoneNumber").val().match(/^1\d{10}$/)) {
            showJsToast("请输入正确的手机号");   
            return false;
        }
        // 判断短信验证码是否正确
        if (!$(".msg").val().match(/^\d{6}$/)) {
            showJsToast("请输入正确的短信验证码");  
            return false;
        }
        // 判断密码是否正确
        if (!$(".password").val().match(/^[0-9A-Za-z]{8,20}$/)) {
            showJsToast("请输入正确的密码");  
            return false;
        }
        // 判断是否勾选用户协议
        if (!$(".checkBox-icon").hasClass("checkBox-icon-active")) {
            showJsToast("请先勾选我同意《用户协议》");
            return false;
        }

        // 通过验证，提交申请
        (function() {
            var phoneNumber = $(".phoneNumber").val();
            var msgCode = $(".msg").val();
            var password = $(".password").val();
            password = Rsa(password);

            var api = window.Host.customer + "/user/register";
            data = {
                "identityInfo": {
                    "phone": phoneNumber,
                    "password":password,
                    "smsCode":msgCode
                },
                "recommendId": twitterId,
                "recommendType": twitterType
            };

            $.ajax({
                type: "POST",
                url: api,
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json",
                success: function(res) {
                    if (res.succ) {
                        // 是否需要确认开通账户
                        if (res.data.needConfirm) {
                            $(".funds-mask").show();
                            data.identityInfo.token = res.data.token;
                        }
                        else {
                            succCallBack();
                        }
                    }
                    else {
                        showJsToast(res.message);
                    }
                }
            });
        })();
    });
    
    // 取消开通
    $(".funds-btns-cancel").on("click", function() {
        $(".funds-mask").hide();
    });

    // 确认开通
    $(".funds-btns-confirm").on("click", function() {
        $(".funds-mask").hide();
        var api = window.Host.customer + "/user/confirm"; 
 
        $.ajax({
            type: "POST",
            url: api,
            data:JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(res) {
                if (res.succ) {
                    succCallBack();
                }
                else {
                    showJsToast(res.message);
                }
            }
        });
    });
});

/**
 * [showJsToast 仿ios提示]
 * @param  {[type]} text [提示文本]
 * @return {[type]}      [description]
 */
function showJsToast(text) {
    $("body").find(".js-toast").remove();

    var timer =null;
    var oDiv = $('<div class="js-toast"><p>'+text+'</p></div>');
    oDiv.appendTo($("body"));

    timer = setTimeout(function() {
        $("body").find(".js-toast").remove();
    }, 3000);
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

/**
 * [Rsa 加密]
 * @param {[type]} key [description]
 */
function Rsa(key) {
    var encrypt = new JSEncrypt(),
        publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBG3UFPAxh+a0NLv6Plvjo5YPDdnlbED8dI4GP21DdFKvXVFcPb0lSRrht5Xrg7ck4PJ/fovfSi7k8MYqPY52g9tnPzkAthVOs99Tw6DVe22vV2hcs7dXvtk+TxKy4IqMjZA77hiH8wMYcJur+o4R770mrVP4fP88x53EQ4PaayQIDAQAB";
    encrypt.setPublicKey(publicKey);
    return  encrypt.encrypt(key);
}

/**
 * [succCallBack 成功之后的回调]
 * @return {[type]} [description]
 */
function succCallBack() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    // 判断是否为微信
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象

    // 是否在微信内打开
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        $(".succTip").show();
        return false;
    }

    //Android接口
    if (isAndroid) { 
        window.location.href = "http://o7zlnyltf.bkt.clouddn.com/app-ywmj-release.apk";           
    }
    //iOS接口
    if (isiOS) {
        window.location.href = "http://itunes.apple.com/us/app/id1133878484";
    }
}
