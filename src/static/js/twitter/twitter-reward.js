(function(win, $, undefined) {
    //$(function() {

        //初始化数据
        var closeView=GC.Lib.GetQueryString("close");
        var getTypes=GC.Lib.GetQueryString("types");
        var apiUrl=window.Host.customer + "/twitter/award";

       // closeView==1?getAccountToken("callBackFun"):""; // "外部跳转"


        //滚动到底部
        //(function() {
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
            var api = window.Host.customer + "/twitter/children?pageNum="+pageNum+"&pageSize=20";

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

                if (endTop === startTop && bool && userInfo.accessToken) {
                    pageNum++;
                     api = window.Host.customer + "/twitter/children?pageNum="+pageNum+"&pageSize=20";
                    getDataRewardList();

                }

            }, false);
        //})($);








        /*获取统计数据方法*/
        //getDataRewardInfo();
        function getDataRewardInfo(){
            $.ajax({
                type: "get",
                url: apiUrl,
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("access-token",userInfo.accessToken);
                    request.setRequestHeader("session-id",userInfo.sessionId);
                },
                success: function(res) {
                    invokeNative({"code":1002});// loading hide;
                    if (res.stateCode===0 && res.data) {
                        $(".reward-data-all").text(res.data.commissionTotal.toFixed(2)||"0.00");
                        $(".reward-data-push").text((res.data.childrenCount ||0)+"人");
                        $(".reward-data-case").text((res.data.signCount ||0)+"单");
                    } else if (res.stateCode === 312) {
                        invokeNative({"code": window.jsBridge.CODE_LOGIN,"callback":"loginReturn","extra":"getDataRewardInfo"});

                    }
                    else if (res.stateCode === 314) {
                        invokeNative({"code":1001});//loading
                        refreshToken("getDataRewardInfo");
                    }
                    else if (res.stateCode === 315) {
                        invokeNative({"code":1001});//loading
                        getAccountToken("getDataRewardInfo");
                    }
                    else {
                        invokeNative({ "code": 1004,"data": res.message}); //通用提示
                    }
                }
            });
        }



        /*下拉数据*/
       //getDataRewardList();
        function getDataRewardList() {
            console.log(api)
            $.ajax({
                type: "GET",
                url: api,
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("access-token", userInfo.accessToken);
                    request.setRequestHeader("session-id", userInfo.sessionId);
                },
                success: function (res) {
                    //alert(JSON.stringify(res))
                    invokeNative({"code":1002});// loading hide;
                    if (res.stateCode === 0) {

                        var data = res.data.result, str = "";
                        if (data.length > 0) {
                            $.each(data, function (i, d) {
                                var headImg=filterImagesUrl(d.headImage )+window.Host.imgSize_128_128;

                                str +='<ul>'
                                +'<li class="fl"><i class="img" style="background-image: url('+headImg+')"></i></li>'
                                +'<li class="fl"><span class="block F4 C1 no-cut-txt"> <em class="textcut" style="width: 2.6rem; vertical-align: middle">'+ d.twitterName +'</em> <i class="'+(d.childLevel==1?"level-tags1":"level-tags2")+' F7 C0">'+ d.childLevel+'级</i></span>  <em class=" F6 C4 textcut   cut-txt">'+GC.Lib.setDate(d.auditTime )+'</em></li>'
                                +'<li class="fr text-right"><span class="F4 C1">我的奖金：<b class="F4 C6 no-b">'+ (d.totalAward?d.totalAward.toFixed(2):"0.00")+'</b> <em class="block F6 C4" style="margin-top: 0.15rem">已签约：'+ d.signCount +'</em></span></li>'
                                +'</ul>';

                            });
                            $(".push-list").append(str);

                        }
                    }
                    else if (res.stateCode === 312) {
                        invokeNative({"code": window.jsBridge.CODE_LOGIN,"callback":"loginReturn","extra":"getDataRewardList"});

                    }
                    else if (res.stateCode === 314) {
                        invokeNative({"code": 1001});//loading
                        refreshToken("getDataRewardList");
                    }
                    else if (res.stateCode === 315) {
                        invokeNative({"code": 1001});//loading
                        getAccountToken("getDataRewardList");
                    }
                    else {
                        invokeNative({"code": 1004, "data": res.message}); //通用提示
                    }
                }
            });
        }
        window.callBackFun=function(){
            console.log("ok")
            getDataRewardInfo();
            getDataRewardList();
        };

         getAccountToken("callBackFun");
        //callBackFun()
    //});


})(window, Zepto);