/**
 * Created by jiaminghe on 2017/4/11.
 */
(function (win, $, undefined) {

    /*后退*/
    $(".title").find("span").on("click", function () {
        var closeView = GC.Lib.GetQueryString("close");
        closeView == 1 ? invokeNative({"code": 1003}) : window.history.go(-1);
    });

    function getShareUrl() {
        shareObj = {
            "code": window.jsBridge.CODE_SHARE,
            "data": {
                "mShareUrl": null,
                "mShareImg": "http://o7zlnyltf.bkt.clouddn.com/invite_log_in_pic.png",
                "mDescription": "比作品找到满意的家装团队，注册即领装修大礼包。",
                "mShareTitle": "家装精英团队，任您来挑！"
            }
        };

        var data = {
            "shareType": 2
        };

        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});
        $.ajax({
            type: "GET",
            url: window.Host.customer + "/twitter/url",
            data: data,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (request) {
                request.setRequestHeader("access-token", userInfo.accessToken);
                request.setRequestHeader("session-id", userInfo.sessionId);
            },
            success: function (res) {
                invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE})


                console.log(res);
                if (res.succ) {
                    shareObj.data.mShareUrl = res.data;
                    invokeNative(shareObj);
                }
                else if (res.stateCode === 312) {
                    invokeNative({"code": window.jsBridge.LOADING})
                }
                else if (res.stateCode === 314) {
                    refreshToken("getShareUrl");
                }
                else if (res.stateCode === 315) {
                    getAccountToken("getShareUrl");
                }
                else {
                    invokeNative({"code": window.jsBridge.CODE_TOAST, "data": res.message})
                }
            },
            error: function (res) {
                invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE})
            }
        })
    }

    $(function () {
        $(".invite-submit").on("click", function () {
            //立即邀请
            console.log("立即邀请");
            getShareUrl();
        });

        // $(".invite-rule").on("click",function () {
        //     //奖励规则
        //     window.location.href = window.Host.local + "twitter/promote-rule.shtml";
        // });
    });

})(window, Zepto);