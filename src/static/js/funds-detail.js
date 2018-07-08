$(function() {
    // 返回上一页
    $(".title").find("span").on("click", function() {
        GC.Hybrid.dismisDialog();
        window.history.go(-1);
    });

    //滚动到底部
    (function() {
        // 从localStorage获取sessionToken
        var storage = window.localStorage;
        var sessionToken = storage.getItem("sessionToken");
        var userType = storage.getItem("userType");

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

        // 下拉刷新参数
        var oDiv = document.querySelector(".content");
        var iStartTouchX = 0;
        var iStartTouchY = 0;
        var iEndTouchY = 0;
        var iDisX = 0;
        var iDisY = 0;
        var startTop = 0;
        var endTop = 0;
        var bool = false;
        var pageNum = 1;
        var pageSize = 10;

        var api = apiHost+"/account/details?pageNum="+pageNum+"&pageSize="+pageSize;
        slideDown(api, sessionToken);
        pageNum++;

        oDiv.addEventListener("touchstart", function(ev) {

            var ev = ev || window.event;
            var _ev = ev.changedTouches[0];
            iStartTouchX = _ev.pageX;
            iStartTouchY = _ev.pageY;

            startTop = oDiv.scrollTop;

        }, false);

        oDiv.addEventListener("touchmove", function(ev) {

            var ev = ev || window.event;
            var _ev = ev.changedTouches[0];

            iDisX = _ev.pageX - iStartTouchX;
            iDisY = _ev.pageY - iStartTouchY;

            var X = Math.abs(iDisX);
            var Y = Math.abs(iDisY);

            if (Y > X && iDisY < 0) {
                bool = true;
            }
            else {
                bool = false;
            }

        }, false);

        oDiv.addEventListener("touchend", function(ev) {
            var ev = ev || window.event;
            var _ev = ev.changedTouches[0];
            iEndTouchY = _ev.pageY;

            if (iStartTouchY === iEndTouchY) {
                return false;
            }

            endTop = oDiv.scrollTop;

            if (endTop === startTop && bool) {
                var api = apiHost+"/account/details?pageNum="+pageNum+"&pageSize="+pageSize;
                slideDown(api, sessionToken);
                pageNum++;
            }

        }, false);
    })();
});

/**
 * [slideDown 下拉刷新]
 * @param  {[type]} api [请求接口]
 * @return {[type]}     [description]
 */
function slideDown(api, sessionToken) {
    $.ajax({
        type: "GET",
        url: api,
        data:{"sessionToken":sessionToken},
        dataType: "json",
        success: function(res) {
            if (res.succ) {
                if (!res.data) {
                    GC.Hybrid.showToast("暂无更多明细");
                    return false;
                }

                var data = res.data;

                if (data.length === 10) {
                    $(".list-slideDown").show();
                }
                else {
                    $(".list-slideDown").hide();
                }

                if (data.length > 0) {
                    $.each(data, function(i, index) {
                        var operateTime = GC.Lib.setTime(index.operateTime);
                        var icon = null;
                        if (index.income) {
                            icon = "+";
                        }
                        else {
                            icon = "-";
                        }
                        var oLi = $('<li><p class="detail-type">'+index.detail+'</p><p class="detail-date">'+operateTime+'</p><p class="detail-num">'+icon+''+index.amount+'</p></li>')
                    
                        oLi.appendTo($(".detail-list"));
                    });
                }

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