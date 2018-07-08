$(function() {
    var id = GetQueryString("caseId");
    var appe = GetQueryString("appe");
    var twitterId = GetQueryString("uid");
    var twitterType = GetQueryString("type");
    var isTwitter = GetQueryString("twitter");
    var api = window.Host.customer + "/case/app/ticket";
    var sharetitle = null,
        sharedesc = null,
        sharelink = null,
        shareimgUrl = null;

    var requestUrl = window.location.href.split("#")[0];

    // 获取分享链接和title
    var share_url = window.Host.customer+"/case/app/detail/banner/"+id;
    if(!id){
        return false;
    }
    $.ajax({
        type: "GET",
        url: share_url,
        dataType: "json",
        async: false,
        success: function(data) {
            // 判断返回数据是否错误
            if (data.succ === true) {
                var data = data.data.shareInfo;

                var href = window.location.href;
                var result = href.search(/template\/index.html/);

                if (result > 0) {
                    $("title").text(data.caseName);
                }

                // 分享信息
                sharetitle = data.caseName,
                sharedesc = data.caseStory,
                sharelink = data.url,
                shareimgUrl = data.cover;

                //// 判断是否为推客链接
                //if (isTwitter==="true") {
                //    $(".bottom-btn").text("立即注册");
                //}
                //else {
                //    if (twitterType === "e") {
                //        $(".bottom").find(".bottom-btn").hide();
                //    }
                //}
                sharelink = sharelink + "&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
            }
            else {
                return false
            }
        }
    });

    $.ajax({
        type: "GET",
        url: api,
        data: {"requestUrl":requestUrl},
        dataType: "json",
        success: function(data) {

            var data = data.data;

            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.randomStr,
                signature: data.ticket,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                ]
            });

            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        console.log(res);
                    }
                });
                wx.error(function (res) {
                    console.log(res);
                })
                //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                wx.onMenuShareTimeline({
                    title: sharetitle, // 分享标题
                    link: sharelink, // 分享链接
                    imgUrl: shareimgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数

                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                    title: sharetitle, // 分享标题
                    desc: sharedesc, // 分享描述
                    link: sharelink, // 分享链接
                    imgUrl: shareimgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //获取“分享到QQ”按钮点击状态及自定义分享内容接口
                wx.onMenuShareQQ({
                    title: sharetitle, // 分享标题
                    desc: sharedesc, // 分享描述
                    link: sharelink, // 分享链接
                    imgUrl: shareimgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        //alert(shareimgUrl);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
                wx.onMenuShareWeibo({
                    title: sharetitle, // 分享标题
                    desc: sharedesc, // 分享描述
                    link: sharelink, // 分享链接
                    imgUrl: shareimgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
                wx.onMenuShareQZone({
                    title: sharetitle, // 分享标题
                    desc: sharedesc, // 分享描述
                    link: sharelink, // 分享链接
                    imgUrl: shareimgUrl, // 分享图标
                    success: function () {
                       // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

            })

        }
    });
});

/**
 * [GetQueryString 通过名字查询url参数]
 * @param {[type]} name [description]
 */
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
