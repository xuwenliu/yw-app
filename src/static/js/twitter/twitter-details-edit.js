/**
 * Created by jiaminghe on 2017/4/7.
 */
(function (window, $, undefined) {



    // 定义变量
    // var ...

    var commitObj = {
        "name": "",
        "idCard": "",
        "idImageA": "",
        "idHoldImage": "",
        "areaId": 0,
        "industry": "",
        "invitationCode": ""
    };

    var pageReadOnly = false;

    var isPase = true;

    var areaObj = {
        "code": 0,
        "data": {
            "province": {
                "name": null,
                "code": 0
            },
            "city": {
                "name": null,
                "code": 0
            },
            "area": {
                "name": null,
                "code": 0
            }
        },
        "callback": "twitterAddressCallback"
    };

    //推客行业信息
    var industryStatus = [
        {"code": 0, "desc": ""}
    ];


    var industryObj = {
        "code": 0,
        "desc": ""
    };


    /**
     * 选择地址回调
     * @param val
     */
    window.twitterAddressCallback = function (val) {
        console.log(val);
        var res = utf8to16(base64decode(val));
        res = JSON.parse(res);
        console.log("res:" + res);
        areaObj = res;
        var data = areaObj.data;
        $(".form-inline").eq(3).find("em").text(data.province.name + data.city.name + data.area.name);
    };

    /**
     * 选择行业回调
     * @param val
     */
    window.twitterIndustryCallback = function (val) {
        console.log(val);
        var res = utf8to16(base64decode(val));
        res = JSON.parse(res);
        industryObj = res.data;
        $(".form-inline").eq(4).find("em").text(res.data.desc);
    };

    /**
     * 选择身份证正面照回调
     * @param val
     */
    window.twitterIdCardImg = function (val) {
        console.log("val:" + val);
        var res = window.atob(val);
        res = JSON.parse(res);
        console.log("res:" + res);
        console.log("res:" + res.data);
        commitObj.idImageA = res.data;
        $(".from-idCard-icon").eq(0).hide();
        $(".form-idCard-img").css("background-image", "url('" + res.data + "' )");
    };


    window.twitterIdCardImgHold = function (val) {
        var res = window.atob(val);
        res = JSON.parse(res);
        commitObj.idHoldImage = res.data;
        $(".from-idCard-icon").eq(1).hide();
        $(".form-idCard-imghold").css("background-image", "url('" + res.data + "' )");
    }

    // getAccountToken("getCustomerDetail");

    var getTwitterEnumsData = function () {
        $.ajax({
            type: "GET",
            url: window.Host.customer + "/twitter/enums",
            dataType: "json",
            success: function (res) {
                if (res.succ) {
                    industryStatus = res.data.industryStatus;
                }
            }
        })
    }
    /**
     * 获取推客详细信息
     */
    var getCustomerDetail = function () {
        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});
        $.ajax({
            type: "GET",
            url: window.Host.customer + "/twitter/detail",
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("access-token", userInfo.accessToken);
                request.setRequestHeader("session-id", userInfo.sessionId);

                // request.setRequestHeader("access-token", "f7b4de98bb547e7244d32c9554f7c892");
                // request.setRequestHeader("session-id", "c216");
            },
            success: function (res) {
                invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
                if (res.succ) {
                    var data = res.data;
                    console.log(data);
                    initTwitterStatus(data);
                }
                else if (res.stateCode === 312) {
                    invokeNative({"code": window.jsBridge.CODE_LOGIN})
                }
                else if (res.stateCode === 314) {
                    refreshToken("getCustomerDetail");
                }
                else if (res.stateCode === 315) {
                    getAccountToken("getCustomerDetail");
                }
                else {
                    invokeNative({"code": window.jsBridge.CODE_TOAST, "data": res.message})
                }
            },
            error: function (res) {
                invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
            }
        })
    };


    /**
     * 初始化推客信息
     * @param data
     */
    function initTwitterStatus(data) {

        var userAuthInfo = data.userAuthInfo;
        var twitterStatus = -1;
        if (userAuthInfo) {
            if (userAuthInfo.name) {
                $(".form-inline").eq(0).find("input").val(userAuthInfo.name);
            }
            if (userAuthInfo.idCard) {
                $(".form-inline").eq(1).find("input").val(userAuthInfo.idCard);
            }
            if (userAuthInfo.phone) {
                $(".form-inline").eq(2).find("input").val(userAuthInfo.phone);
                $(".form-inline").eq(2).find("input").attr("readonly", true);
            }
            if (userAuthInfo.idImageA) {
                commitObj.idImageA = userAuthInfo.idImageA;
                $(".from-idCard-icon").eq(0).hide();
                $(".form-idCard-img").css("background-image", "url('" + userAuthInfo.idImageA + "' )");
            }
            if (userAuthInfo.idHoldImage) {
                commitObj.idHoldImage = userAuthInfo.idHoldImage;
                $(".from-idCard-icon").eq(1).hide();
                $(".form-idCard-imghold").css("background-image", "url('" + userAuthInfo.idHoldImage + "' )");
            }
        }

        if (data.twitterInfo) {
            var twitterInfo = data.twitterInfo;
            twitterStatus = twitterInfo.status;
            if (twitterInfo.area) {
                var area = twitterInfo.area;
                areaObj.data.area.code = area.id;
                areaObj.data.area.name = area.name;
                areaObj.data.city.code = area.parent.id;
                areaObj.data.city.name = area.parent.name;
                if (area.parent.parent) {
                    areaObj.data.province.code = area.parent.parent.id;
                    areaObj.data.province.name = area.parent.parent.name;
                    var areaName = areaObj.data.province.name + areaObj.data.city.name + areaObj.data.area.name;
                } else {
                    var areaName = areaObj.data.city.name + areaObj.data.area.name;
                }
                if (areaName) {
                    $(".form-inline").eq(3).find("em").text(areaName);
                }
            }


            if (twitterInfo.industryDesc) {
                industryObj.code = twitterInfo.industry;
                industryObj.desc = twitterInfo.industryDesc;
                $(".form-inline").eq(4).find("em").text(twitterInfo.industryDesc);
            }


        }

        if (data.lastApplyInfo) {
            var lastApplyInfo = data.lastApplyInfo;
            if (lastApplyInfo.rejectedReason) {
                $(".from-hint").text("审核结果：" + lastApplyInfo.rejectedReason);
            }

        }

        if (data.invitationCode) {

            $(".form-inline").eq(5).find("input").val(data.invitationCode);
            $(".form-inline").eq(5).find("input").attr("readonly", true);
        }


        /*编辑模式*/
        var pageEditMode = {
            "readOnly": false,
            "showHint": false,
            "showCommit": false
        };

        console.log(twitterStatus);

        //0 = 待审核，1 = 已认证，2 = 被驳回,
        switch (twitterStatus) {
            case -1:
                pageEditMode.showHint = false;
                pageEditMode.readOnly = false;
                break
            case 0:
                $(".from-hint").text("审核结果：待审核");
                $(".form-inline").eq(5).hide();
                pageEditMode.showHint = true;
                pageEditMode.readOnly = true;
                break
            case 1:
                $(".from-hint").text("审核结果：已认证");
                $(".form-inline").eq(5).hide();
                pageEditMode.showHint = false;
                pageEditMode.readOnly = true;
                break
            case 2:
                $(".from-hint").show();
                $(".line-bg").show();
                $(".form-inline").eq(5).hide();
                pageEditMode.showHint = true;
                pageEditMode.readOnly = false;
                break
        }

        pageReadOnly = pageEditMode.readOnly;

        if (pageEditMode.showHint) $(".form-hint").show(); else  $(".form-hint").hide();
        if (pageEditMode.readOnly) $(".form-submit").hide(); else  $(".form-submit").show();

        if (pageEditMode.readOnly) {
            $.each($(".form-inline"), function (i, item) {
                $(".form-inline input").eq(i).attr("readonly", pageEditMode.readOnly);
            });
        }
    }


    /**
     * 提交推客信息
     */
    function commitTwitterInfo() {
        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});
        toastObj = {
            "code": window.jsBridge.CODE_TOAST,
            "data": null
        }
        $.ajax({
            type: "POST",
            url: window.Host.customer + "/twitter",
            data: JSON.stringify(commitObj),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (request) {
                request.setRequestHeader("access-token", userInfo.accessToken);
                request.setRequestHeader("session-id", userInfo.sessionId);
                // request.setRequestHeader("access-token", "33e9f2bfcb887a21313531c9974717d3");
                // request.setRequestHeader("session-id", "c219");
            },
            success: function (res) {
                isPase = true;
                invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
                if (res.succ) {
                    window.location.href = window.Host.local + "twitter/twitter-success.shtml";
                }
                else if (res.stateCode === 312) {
                    invokeNative({
                        "code": window.jsBridge.CODE_LOGIN,
                        "callback": "loginReturn",
                        "extra": "commitTwitterInfo"
                    });
                }
                else if (res.stateCode === 314) {
                    refreshToken("commitTwitterInfo");
                }
                else if (res.stateCode === 315) {
                    getAccountToken("commitTwitterInfo");
                }
                else {
                    toastObj.data = res.message;
                    invokeNative(toastObj);
                }
            },
            error: function (res) {
                isPase = true;
                invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE})
                toastObj.data = "请求网络失败";
                invokeNative(toastObj);
            }
        });
    }

    $(function () {

        getTwitterEnumsData();
        getCustomerDetail();


        //   apply/twitter

        $(".title").find("span").on("click", function () {
            window.history.go(-1);
        });

        /**
         * 选择地址
         */
        $(".form-inline").eq(3).on("click", function () {
            if (pageReadOnly)return false;
            var obj = {
                "code": window.jsBridge.CODE_CHOOSE_ADRESS,
                "callback": "twitterAddressCallback",
                "data": null
            };

            if (areaObj.data.area.name) {
                obj.data = areaObj.data;
            }
            invokeNative(obj)
        });

        /**
         * 选择行业
         */
        $(".form-inline").eq(4).on("click", function () {
            if (pageReadOnly)return false;
            var obj = {
                "code": window.jsBridge.CODE_PICK_SINGLE_STING,
                "callback": "twitterIndustryCallback",
                "data": {"title": "选择类型", "array": industryStatus}
            };
            invokeNative(obj);
        });


        /**
         * 选择身份证正面照
         */
        $(".form-idCard-img").on("click", function () {
            if (pageReadOnly)return false;
            var obj = {
                "code": window.jsBridge.CODE_GET_SINGLE_PHOTO,
                "callback": "twitterIdCardImg"
            };
            invokeNative(obj);
        });


        /**
         * 选择身份证持证照
         */
        $(".form-idCard-imghold").on("click", function () {
            if (pageReadOnly)return false;
            var obj = {
                "code": window.jsBridge.CODE_GET_SINGLE_PHOTO,
                "callback": "twitterIdCardImgHold"
            };
            invokeNative(obj);
        });

        /**
         * 提交
         */
        $(".form-submit").on("click", function () {

            var toastObj = {
                "code": window.jsBridge.CODE_TOAST,
                "data": null
            };

            //真实姓名
            var name = $(".form-inline input").eq(0).val();
            if (!((GC.Lib.validRule.realname).test(name))) {
                toastObj.data = "请输入真实姓名";
                invokeNative(toastObj);
                return false;
            }
            commitObj.name = name;

            //身份证号码
            var idCard = $(".form-inline input").eq(1).val();
            if (!((GC.Lib.validRule.identity).test(idCard))) {
                toastObj.data = "请输入正确的身份证号码";
                invokeNative(toastObj);
                return false;
            }
            commitObj.idCard = idCard;

            //所在地区
            var cityIdName = areaObj.data.area.name;
            if (!cityIdName) {
                toastObj.data = "请选择所在城市";
                invokeNative(toastObj);
                return false;
            }
            commitObj.areaId = areaObj.data.area.code;

            //所属行业
            var type = industryObj.desc;
            if (type.length == 0) {
                toastObj.data = "请选择所属行业";
                invokeNative(toastObj);
                return false;
            }
            commitObj.industry = industryObj.code;

            //邀请码
            var invitationCode = $(".form-inline").eq(5).find("input").val();
            if (invitationCode.length) {
                if (!((GC.Lib.validRule.comcode).test(invitationCode))) {
                    toastObj.data = "邀请码格式不正确";
                    invokeNative(toastObj);
                    return false;
                }
                commitObj.invitationCode = invitationCode;
            }

            if (!(commitObj.idImageA)) {
                toastObj.data = "请完善身份证正面照片";
                invokeNative(toastObj);
                return false;
            }

            if (!(commitObj.idHoldImage)) {
                toastObj.data = "请完善身份证持证照片";
                invokeNative(toastObj);
                return false;
            }

            if (!isPase) {
                return false
            }
            isPase = false;
            commitTwitterInfo();
        })

    });


})(window, Zepto);
