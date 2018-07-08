(function(win, $, undefined) {

    //初始化数据
    var closeView=GC.Lib.GetQueryString("close");
    var id=GC.Lib.GetQueryString("id");
    var apiUrl=window.Host.customer + "/twitter/customer/procedures/"+id;

    /*后退*/
    $(".title").find("span").on("click", function() {
        var closeView=GC.Lib.GetQueryString("close");
        closeView==1? invokeNative({"code":1003}):window.history.go(-1);
    });


    /*获取数据方法*/
    //closeView==1?getAccountToken("getCustomerDataInfo"):""; // "外部跳转"
    getAccountToken("getCustomerDataInfo");

    window.getCustomerDataInfo=function(){
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
                    var arr=res.data.nodeDescDtos||[],
                        htmlStr="",
                        callNode=$(".call-info"),
                        obj=$(".box-time-line ul");

                    var headImg=filterImagesUrl(res.data.headImage)+window.Host.imgSize_128_128;

                    callNode.html('<span class=" F4 C1 ">'+res.data.customerName+' <em class=" F4 C4 ">'+res.data.customerPhone+'</em></span>');
                    $(".header-img i").css({"background-image":"url("+headImg+")"});

                    if(arr.length>0){
                        $.each(arr,function(i,d){
                            var desc="";
                             function descRe(t){
                                 if(t==0){
                                     desc="报备客户"+( d.postscript?"【备注："+d.postscript+"】":"");
                                     return desc;
                                 }else if(t==1){
                                     desc="客户和公司已洽谈【编号："+d.serialNumber+"】"+( d.postscript?"【备注："+d.postscript+"】":"");
                                     return desc;
                                 }else if(t==2){
                                     desc="客户和公司完成签约"+ d.signContentTypeDesc +"【编号："+d.serialNumber+"】"+( d.postscript?"【备注："+d.postscript+"】":"")+" &nbsp&nbsp金额："+ d.signAmount.toFixed(2)+" &nbsp&nbsp待结佣："+d.toSettleAmount.toFixed(2) ;
                                     return desc;
                                 }else if(t==3){
                                     desc=d.signContentTypeDesc + "【编号："+d.serialNumber+"】"+( d.postscript?"【备注："+d.postscript+"】":"")+" &nbsp&nbsp金额："+ d.signAmount.toFixed(2)+" 完成结佣 &nbsp&nbsp佣金："+d.settledAmount .toFixed(2) ;
                                     return desc;
                                 }else{
                                     return ""
                                 }
                             }

                            htmlStr+='<li><i class="icon-time-point fl block"></i><span class="F4 C5 cut-txt">'+ descRe(d.nodeType)+'<em class="block time">'+((d.nodeType==0||d.nodeType==3)?GC.Lib.setTime(d.nodeTime):GC.Lib.setDate(d.nodeTime))+'</em></span></li>'

                        });
                        obj.append(htmlStr);
                    }
                }
                else if (res.stateCode === 312) {
                    invokeNative({"code": window.jsBridge.CODE_LOGIN,"callback":"loginReturn","extra":"getCustomerDataInfo"});

                    var reg='/^[a-zA-Z0-9]{6}$/';
                    if(!reg.test(val)){

                    }
                }
                else if (res.stateCode === 314) {
                    invokeNative({"code":1001});//loading
                    refreshToken("getCustomerDataInfo");
                }
                else if (res.stateCode === 315) {
                    invokeNative({"code":1001});//loading
                    getAccountToken("getCustomerDataInfo");
                }
                else {
                    invokeNative({ "code": 1004,"data": res.message}); //通用提示
                }
            }
        });
    }

    /*打电话*/
    $(".icon-call").on("click",function(){
            var phoneNumber= $.trim($(".call-info em").text());
            invokeNative({ "code": 1015,"data":phoneNumber});
    })

})(window, Zepto);


