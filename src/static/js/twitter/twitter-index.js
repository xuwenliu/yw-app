$(function() {
    /*后退*/
    $(".title").find("span").on("click", function() {
        invokeNative({"code":1003});// close view;
    });
});

//初始化数据
var apiUrl=window.Host.customer + "/twitter";

getAccountToken("getTwitterIndexInfo");

/*获取数据方法*/
window.getTwitterIndexInfo=function(){
    invokeNative({"code":1001});//loading
    $.ajax({
        type: "get",
        url: apiUrl,
        dataType:"json",
        beforeSend: function (request) {
            request.setRequestHeader("access-token",userInfo.accessToken);
            request.setRequestHeader("session-id",userInfo.sessionId);
        },
        success: function(res) {
            invokeNative({"code":1002});// loading hide;

            if (res.stateCode===0 && res.data) {

                var twitterStatus=res.data.twitterStatus===0?"待审核":res.data.twitterStatus===1?"已认证":res.data.twitterStatus===2?"已驳回":"";
                var headImg=filterImagesUrl(res.data.twitterHead)+window.Host.imgSize_128_128;

                var str='<li class="fl"><i class="img" style="background-image: url('+headImg+')"></i></li>'
                    +'<li class="fl" style="width: 64%"><span class="block F4 C1">'+res.data.twitterName+'</span><em class=" F5 C4 textcut   cut-txt">邀请码：'+ (res.data.myCode||"--")+'</em></li>'
                    +'<li class="fl"><a href=javascript:void(0)><span class="F6 C6 pa span-staus C1">'+res.data.twitterStatusDesc+'</span></a></li>';

                $(".box-list ul").html(str);

                if(res.data.twitterStatus===1){
                    $(".box-list ul .span-staus").removeClass("C6")
                }

                /*按钮状态*/
                if(res.data.twitterStatus!==1){
                    $(".is-c-add ,.is-reward").css("opacity",0.5).find("a").attr("href","#")
                }else{
                    $(".is-c-add ,.is-reward").css("opacity",1);
                    $(".is-c-add li a").attr("href","customer-add.shtml");
                    $(".is-reward li a").attr("href","promote.shtml?types=0");
                    $(".is-reward-invite li a").attr("href","invite-register.shtml");
                }

            }
            else if (res.stateCode === 312) {
                invokeNative({"code": window.jsBridge.CODE_LOGIN,"callback":"loginReturn","extra":"getTwitterIndexInfo"});
            }
            else if (res.stateCode === 314) {
                invokeNative({"code":1001});//loading
                refreshToken("getTwitterIndexInfo");
            }
            else if (res.stateCode === 315) {
                invokeNative({"code":1001});//loading
                getAccountToken("getTwitterIndexInfo");
            }
            else {
                invokeNative({ "code": 1004,"data": res.message}); //通用提示
            }
        }
    });
};


