/**
 * Created by jiaminghe on 2017/4/11.
 */
(function (win, $, undefined) {

    function getShareUrl() {

        console.log("twitter   getShare");

        shareObj = {
            "code": window.jsBridge.CODE_SHARE,
            "data": {
                "mShareUrl": null,
                "mShareImg": "http://o7zlnyltf.bkt.clouddn.com/html_share_pic.png",
                "mDescription": "不影响本职工作，收入轻松破万!",
                "mShareTitle": "加入鹦鹉美家，安全轻松赚钱，快来加入吧！"
            }
        };

        var data = {
            "shareType": 1
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
        $(".promote-gift-submit").on("click", function () {
            //立即邀请
            getShareUrl();
        });

        $(".promote-gift-rule").on("click", function () {
            //奖励规则
            window.location.href = window.Host.local + "twitter/promote-rule.shtml";
        });
    });

})(window, Zepto);