(function(win, $, undefined) {
    // 定义变量
    // var ...

    getAccountToken("");

    // 业务逻辑
    $(function() {

        $(function() {
            $(".title").find("span").on("click", function() {
                invokeNative({"code":window.jsBridge.CODE_CLOSE});
            });
        });

        // 事件：点击复选
        $(".apply-checkbox-box").on("click", function() {
           console.log("shjkls");
            var oSpan = $(this);
            if (!oSpan.hasClass("active")) {
                oSpan.addClass("active");
            }
            else {
                oSpan.removeClass("active");
            }
        });

        $(".apply-checkbox").find("em").on("click", function() {
            window.location.href = window.Host.local + "twitter/twitter-know.shtml";
        });




        // 事件：点击提交按钮
        $(".apply-btn").on("click", function() {
            if ($(".apply-checkbox").find(".active").length > 0) {
                window.location.href = window.Host.local + "twitter/twitter-details-edit.shtml";
            }
            else {
                // showToast
                var data = {
                    "code": 1004,
                    "data": "请先同意推客须知"
                };  
                invokeNative(data);
            }
        });




    });




    // var funcA = function() {
    //     alert(1);
    // }

    // win["funcA"] = funcA;

})(window, Zepto);
