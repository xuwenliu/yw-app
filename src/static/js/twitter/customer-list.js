(function(win, $, undefined) {

    /*后退*/
    $(".title").find("span").on("click", function() {
        var closeView=GC.Lib.GetQueryString("close");
        closeView==1? invokeNative({"code":1003}):window.history.go(-1);
    });

    //初始化数据
    var getTypes=GC.Lib.GetQueryString("types");
    var apiCount=window.Host.customer + "/twitter/customer/statistics";


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
        var types =getTypes>0?getTypes:0;
        var reload;
        var api




        /*选项卡*/
        $(".twitter-tab li").not('hover').on("click",function(){
            var t=$(this);
            types= t.index();
            t.addClass("hover").siblings("li").removeClass("hover");
            api = window.Host.customer+"/twitter/customer?progress="+types+"&pageNum=1&pageSize=20";
            pageNum = 1;
            reload=true;
            slideDown();


        }).first().trigger("click");



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
                pageNum++;
               api = window.Host.customer+"/twitter/customer?progress="+types+"&pageNum="+pageNum+"&pageSize=20";
                reload=false;
                slideDown();

            }

        }, false);
        /*统计*/
        getCustomerCount();
    //})($);


    /*获取统计*/
    function getCustomerCount(){
        $.ajax({
            type: "GET",
            url:apiCount,
            async:false,
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("access-token",userInfo.accessToken);
                request.setRequestHeader("session-id",userInfo.sessionId);
            },
            success: function(res) {
                invokeNative({"code":1002});// loading hide;
                if (res.stateCode===0) {
                    var data=res.data, str="",strDesc;
                    for( var j in data){
                        data[j].code==0?strDesc="客户数":"";
                        data[j].code==1?strDesc="信息数":"";
                        data[j].code==2?strDesc="订单数":"";
                        data[j].code==3?strDesc="订单数":"";

                        str+="<em style='display: none'>"+data[j].desc+strDesc+data[j].count+"</em>";
                    }
                    $(".tab-count").html(str);

                }else if (res.stateCode === 312) {
                    invokeNative({"code": window.jsBridge.CODE_LOGIN,"callback":"loginReturn","extra":"getCustomerCount"});

                }
                else if (res.stateCode === 314) {
                    invokeNative({"code":1001});//loading
                    refreshToken("getCustomerCount");
                }
                else if (res.stateCode === 315) {
                    invokeNative({"code":1001});//loading
                    getAccountToken("getCustomerCount");
                }
                else {
                    invokeNative({ "code": 1004,"data": res.message}); //通用提示
                }
            }
        });
    }

    /*下拉数据*/
    function slideDown() {
        //console.log(api)
        //console.log(types)
        //console.log(reload)
        //console.log(pageNum)
        $.ajax({
            type: "GET",
            url: api,
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("access-token",userInfo.accessToken);
                request.setRequestHeader("session-id",userInfo.sessionId);
            },
            success: function(res) {
                //alert(JSON.stringify(res))
                if (res.stateCode===0) {
                    var data=res.data.result||[], maxPage=res.data.totalPageNum,str="";
                    if(data.length>0){
                        $(".tab-count").show();
                        $(".customer-no-data").hide();
                        $(".tab-count em").eq(types).show().siblings("em").hide();
                        $(".box-list").show();
                        $.each(data,function(i,d){
                            var headImg=filterImagesUrl(d['customerHead'])+window.Host.imgSize_128_128;
                            var cont1= d.chattingCount>1?" 已洽谈*"+d.chattingCount: d.chattingCount==1?" 已洽谈":"",
                                cont2= d.signedCount>1 ?" 已签约*"+d.signedCount :d.signedCount==1?" 已签约":"",
                                cont3= d.settledCount>1 ?" 已结佣*"+d.settledCount :d.settledCount==1?" 已结佣":"";

                            str+='<ul>'
                                +'<li class="fl"><i class="img" style="background-image: url('+headImg+')"></i></li>'
                                +'<li class="fl"><span class="block F4 C1">'+d.customerName+'</span><em class=" F5 C4 textcut cut-txt">'+cont1+cont2+cont3+'</em></li>'
                                +'<li class="fl"><a href="customer-list-info.shtml?id='+d.twitterCustomerId+'&types='+types+'"><i class="icon-go"></i></a></li>'
                                +'</ul>'

                        });

                        if(reload){
                            $(".box-list").html(str)
                        }else if(pageNum<=maxPage&&!reload){
                            $(".box-list").append(str);

                        }

                    }else if(reload){
                        function getText (types){
                            if(types==0){ return "报备" }
                            if(types==1){ return "已洽谈" }
                            if(types==2){ return "已签约" }
                            if(types==3){ return "已结佣" }
                        }

                        $(".customer-no-data").show();
                        $(".customer-no-data em").show().text(getText(types));
                        $(".box-list").hide();
                        $(".tab-count em").hide();
                        $(".tab-count").hide();
                    }

                }
                else if (res.stateCode === 312) {
                    invokeNative({"code": window.jsBridge.CODE_LOGIN,"callback":"loginReturn","extra":"slideDown"});

                }
                else if (res.stateCode === 314) {
                    invokeNative({"code":1001});//loading
                    refreshToken("slideDown");
                }
                else if (res.stateCode === 315) {
                    invokeNative({"code":1001});//loading
                    getAccountToken("slideDown");
                }
                else {
                    invokeNative({ "code": 1004,"data": res.message}); //通用提示
                }
            }
        });
    }
})(window, Zepto);
