$(function() {
    var shareInfo ={
        title:"家装精英团队，任你来挑！",
        link:location.href,
        desc:"比作品找到满意的家装团队，注册即领取装修大礼包。",
        imgUrl:"http://o7zlnyltf.bkt.clouddn.com/invite_log_in_pic.png?imageView2/1/w/240/h/240"
    }
    var api = window.Host.customer + "/case/app/ticket";
    var requestUrl = window.location.href.split("#")[0];

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
                    title: shareInfo.title, // 分享标题
                    link: shareInfo.linek, // 分享链接
                    imgUrl: shareInfo.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数

                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                    title: shareInfo.title, // 分享标题
                    desc: shareInfo.desc, // 分享描述
                    link: shareInfo.link, // 分享链接
                    imgUrl: shareInfo.imgUrl, // 分享图标
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
                    title: shareInfo.title, // 分享标题
                    desc: shareInfo.desc, // 分享描述
                    link: shareInfo.link, // 分享链接
                    imgUrl: shareInfo.imgUrl, // 分享图标
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
                    title: shareInfo.title, // 分享标题
                    desc: shareInfo.desc, // 分享描述
                    link: shareInfo.link, // 分享链接
                    imgUrl: shareInfo.imgUrl, // 分享图标
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