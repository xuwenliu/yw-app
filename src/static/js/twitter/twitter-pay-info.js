(function(win, $, undefined) {

    //初始化数据
    var closeView=GC.Lib.GetQueryString("close");
    var getTypes=GC.Lib.GetQueryString("types");
    var apiUrl=window.Host.customer + "/twitter/commission/list?settleStatus="+getTypes;
    getTypes==1?$(".title em").text("待结佣明细"):"";


    $(function() {
        /*后退*/
        $(".title").find("span").on("click", function() {
            var closeView=GC.Lib.GetQueryString("close");
            closeView==1? invokeNative({"code":1003}):window.history.go(-1);
        });

    });


    /*获取数据方法*/
    //closeView==1?getAccountToken("getDataPayDataInfo"):""; // "外部跳转"
    getAccountToken("getDataPayDataInfo")

    //getDataPayDataInfo();
    window.getDataPayDataInfo=function(){
        $.ajax({
            type: "get",
            url: apiUrl,
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("access-token",userInfo.accessToken);
                request.setRequestHeader("session-id",userInfo.sessionId);
            },
            success: function(res) {
                invokeNative({"code":1002});// hide loading
                if (res.stateCode===0) {
                    if(res.data.length<1){
                        $(".box-list-info ").hide();
                        $(".base-no-data").show();
                    } else{
                        $(".box-list-info ").show();
                        $(".base-no-data").hide();
                        var str="";
                        $.each(res.data,function(i,d){
                            str+='<dl>'
                                +'<dt class="block F4 C1">编号：'+ d.serialNumber+'<span class="fr">'+( getTypes==2 ? '佣金：':'待结佣：')+'<em class="b F4 C6">'+d.settleAmount.toFixed(2)+'</em></span></dt>'
                                +'<dd class="F4 C4">签约客户<span class="fr">'+ d.customerName+'</span></dd>'
                                +'<dd class="F4 C4">签约时间<span class="fr">'+GC.Lib.setDate(d.signTime)+'</span></dd>'
                                +'<dd class="F4 C4">签约类型<span class="fr">'+ d.signTypeDesc +'</span></dd>'
                                +'<dd class="F4 C4">结佣方式<span class="fr">'+d.settlementTypeDesc +((d.signType==1||d.signType==2)&&d.settlementRatio? d.settlementRatio+'%':'')+'</span></dd>'
                                + ((d.signType==3||d.signType ==4||d.signType==5)?'<dd class="F4 C4">房屋面积<span class="fr">'+ d.houseArea+' m<sup>2</sup></span></dd>':"")+''
                                +'<dd class="F4 C4">结佣时间<span class="fr">'+(d.settledTime?GC.Lib.setTime(d.settledTime):'--')+'</span></dd>'
                                +'</dl>';
                        });

                        $(".box-list-info").append(str);

                    }


                }else if (res.stateCode === 312) {
                    invokeNative({"code": window.jsBridge.CODE_LOGIN,"callback":"loginReturn","extra":"getDataPayDataInfo"});

                }
                else if (res.stateCode === 314) {
                    invokeNative({"code":1001});//loading
                    refreshToken("getDataPayDataInfo");
                }
                else if (res.stateCode === 315) {
                    invokeNative({"code":1001});//loading
                    getAccountToken("getDataPayDataInfo");
                }
                else {
                    invokeNative({ "code": 1004,"data": res.message}); //通用提示
                }
            }
        });
    }

})(window, Zepto);