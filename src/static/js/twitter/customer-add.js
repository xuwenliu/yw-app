(function (win, $, undefined) {
    /*后退*/
    $(".title").find("span").on("click", function () {
        var closeView = GC.Lib.GetQueryString("close");
        closeView == 1 ? invokeNative({"code": 1003}) : window.history.go(-1);
    });

    var phoneNumber

    ///*获取表单参数*/
    //(function(){
    //    $.fn.getFormKeyValue=function(){
    //        var _t=this,_ar=[],_o={};
    //        var _arr = _t.serializeArray()||[];
    //        for(var  j in  _arr){
    //            if(_arr.length>0){
    //                _o[_arr[j]['name']] = $.trim(_arr[j]['value']);
    //                _ar.push(_o);
    //            }
    //        }
    //        return _o;
    //    };
    //})($);


    /*手机号判断是否可以点击*/
    $("[name='userPhone']").keyup(
        function () {
            var arr = $(this).attr("data-pattern").split("|");
            if (GC.Lib.validRule[arr[0]].test($(this).val()) && $(".get-sms-submit").text().indexOf("s") < 0) {
                $(".get-sms-submit").attr('disabled', false).css({opacity: 1})
            } else {
                $(".get-sms-submit").attr('disabled', true).css({opacity: 0.5})
            }
        }
    );

    /*发送验证码*/
    var isPass2 = true; //防阻塞
    $("body").on("click", ".get-sms-submit:not([disabled=true])", function () {
        phoneNumber = $.trim($("input[name='userPhone']").val());
        var t = $(this);
        countDownTimer(60, t);
        if (!isPass2) {
            return false
        }
        isPass2 = false;
        getSmsCode()
    });


    /*发送验证码*/
    function getSmsCode() {
        $.ajax({
            type: "POST",
            url: window.Host.customer + "/user/sendSmsCode",
            data: {"phone": phoneNumber, "source": 9},
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("access-token", userInfo.accessToken);
                request.setRequestHeader("session-id", userInfo.sessionId);
            },
            success: function (res) {
                isPass2 = true;
                invokeNative({"code": 1002});// loading hide;
                if (res.stateCode === 0) {
                    invokeNative({"code": 1004, "data": "发送成功！"}); //通用提示
                } else if (res.stateCode === 312) {
                    invokeNative({
                        "code": window.jsBridge.CODE_LOGIN,
                        "callback": "loginReturn",
                        "extra": "getSmsCode"
                    });

                }
                else if (res.stateCode === 314) {
                    invokeNative({"code": 1001});//loading
                    refreshToken("getSmsCode");
                }
                else if (res.stateCode === 315) {
                    invokeNative({"code": 1001});//loading
                    getAccountToken("getSmsCode");
                }
                else {
                    invokeNative({"code": 1004, "data": res.message}); //通用提示
                }
            }
        });
    }


    /*倒计时*/
    function countDownTimer(s, o) {
        var s = s || 60;
        o.text(s + "s后重试").attr('disabled', true).css({opacity: 0.5});
        var timerFun = function () {
            s--;
            if (s < 1) {
                o.text("重新获取").attr('disabled', false).css({opacity: 1});
                clearInterval(clearTime);
            } else {
                o.text(s + "s后重试").attr('disabled', true).css({opacity: 0.5});
            }
        };
        var clearTime = window.setInterval(timerFun, 1000)
    }


    /*获取通讯录信息*/
    $(".phone-book-icon").on("click", function () {
        invokeNative({"code": 1013, callback: "codeContactInfoCallBack"}); //调用底层
    });


    /*回调方法名*/
    window.codeContactInfoCallBack = function (res) {
        // var res = window.atob(res);
        var res = utf8to16(base64decode(res));
        res = JSON.parse(res);

        $("input[name='customerName']").val($.trim(res.data.name));
        $("input[name='userPhone']").val(($.trim(res.data.phone)).replace(/\-/g, ""));
        $("[name='userPhone']").trigger("keyup");

    };

    /*按钮是否可以点击*/
    $(".form-box input").keyup(function () {

        var obj = $(".form-submit");
        $(".form-box input:not([name='customerDesc'])").each(function () {
            var t = $(this);
            if (t.val() == "") {
                t.addClass("err")
            } else {
                t.removeClass("err")
            }
        });

        console.log($(".err").length)
        if ($(".err").length > 0) {
            obj.css("opacity", 0.5).removeClass("success");
        } else {
            obj.css("opacity", 1).addClass("success");
        }
    });

    /*提交*/
    var isPass = true; //防阻塞
    $("body").on("click", ".form-submit.success", function () {
        //注意 不能同时提交多个错误类型需要一条条验证
        //$("[data-pattern]").each(function(j){
        //    var t=$(this),val= t.val();
        //    var attr=t.attr("data-pattern");
        //    console.log(j)
        //    if(attr){
        //        var arr = attr.split("|");
        //        if(!GC.Lib.validRule[arr[0]].test(val)){
        //            invokeNative({ "code": 1004,"data": arr[1]}); //通用提示
        //            console.log(arr[1])
        //        }
        //    }
        //})

        /*选择器*/
        function selector(o) {
            var attr = o.attr("data-pattern");
            var arr = attr.split("|");
            return arr
        }

        var customerName = $("[name='customerName']");
        var userPhone = $("[name='userPhone']");
        var smsCode = $("[name='smsCode']");

        if (!GC.Lib.validRule[selector(customerName)[0]].test($.trim(customerName.val()))) {
            invokeNative({"code": 1004, "data": selector(customerName)[1]}); //通用提示
            return false
        }

        if (!GC.Lib.validRule[selector(userPhone)[0]].test($.trim(userPhone.val()))) {
            invokeNative({"code": 1004, "data": selector(userPhone)[1]}); //通用提示
            return false
        }

        if (!GC.Lib.validRule[selector(smsCode)[0]].test($.trim(smsCode.val()))) {
            invokeNative({"code": 1004, "data": selector(smsCode)[1]}); //通用提示
            return false
        }

        if (!isPass) {
            return false
        }
        isPass = false;
        postCustomerAdd();


    });

    /*提交方法*/
    window.postCustomerAdd = function () {

        var userPhone = $.trim($("[name='userPhone']").val());
        var smsCode = $.trim($("[name='smsCode']").val());
        var customerName = $.trim($("[name='customerName']").val());
        var customerDesc = $.trim($("[name='customerDesc']").val());

        var getData = {
            "userPhone": userPhone,
            "smsCode": smsCode,
            "customerName": customerName,
            "customerDesc": customerDesc
        };
        $.ajax({
            type: "POST",
            url: window.Host.customer + "/twitter/customer",
            data: JSON.stringify(getData),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (request) {
                request.setRequestHeader("access-token", userInfo.accessToken);
                request.setRequestHeader("session-id", userInfo.sessionId);
            },
            success: function (res) {
                console.log(res)
                isPass = true;
                invokeNative({"code": 1002});// loading hide;
                if (res.stateCode === 0) {
                    if (res.data === true) {
                        $(function () {
                            $(".add-succ2").show();
                            $(".dialog-btn-close").on("click", function () {
                                window.location.reload();
                            })
                        })
                    } else if (res.data === false) {
                        $(function () {
                            $(".add-succ1").show()
                            $(".dialog-btn-close").on("click", function () {
                                window.location.reload();
                            })
                        })
                    }
                }
                else if (res.stateCode === 312) {
                    invokeNative({
                        "code": window.jsBridge.CODE_LOGIN,
                        "callback": "loginReturn",
                        "extra": "postCustomerAdd"
                    });
                }
                else if (res.stateCode === 314) {
                    invokeNative({"code": 1001});//loading
                    refreshToken("postCustomerAdd");
                }
                else if (res.stateCode === 315) {
                    invokeNative({"code": 1001});//loading
                    getAccountToken("postCustomerAdd");
                }
                else if (res.stateCode === 11) { //验证码
                    invokeNative({"code": 1004, "data": res.message}); //通用提示
                } else {
                    invokeNative({"code": 1004, "data": res.message}); //通用提示
                    window.location.reload();
                }
            }
        });
    }


})(window, Zepto);


