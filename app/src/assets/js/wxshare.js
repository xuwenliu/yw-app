/**
 * wxshare.js
 */
;(function(win,wx){
  var weixin=function(config){
    this.apiUrl=config.api;
    this.requestUrlData=config.requestUrlData;
    this.shareInfo=config.shareInfo
  };

  //继承wx
  weixin.prototype.wx = wx;

  //执行分享
  weixin.prototype.share=function(callBack){
    var url = this.apiUrl;
    var that=this;
    var postData={requestUrl:this.requestUrlData};

    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(postData));

    xhr.onload = function() { //status 连接状态
      if(this.status == 200||this.status == 304){}
    };
    xhr.onreadystatechange=function(){ // XMLHttpRequest 的状态。readyState从 0 到 4 发生变化。
      if (xhr.readyState==4){
        var res=JSON.parse(this.responseText);
        var data=res.data;

        that.wx.config(
          {
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
              'onMenuShareQZone'
            ]
          }
        );

        callBack||that.run(); //callBack可自定义分享
      }
    }
  };

  //分享类型
  weixin.prototype.run=function(){
    var shareInfo=this.shareInfo;
    var _this=this;

    this.wx.ready(function () {
      _this.wx.checkJsApi({
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function (res) {
          // 以键值对的形式返回，可用的api值true，不可用为false
          console.log(res);
        }
      });
      _this.wx.error(function (res) {
        console.log(res);
      });

      //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
      _this.wx.onMenuShareTimeline({
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
      _this.wx.onMenuShareAppMessage({
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
      _this.wx.onMenuShareQQ({
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
      _this.wx.onMenuShareWeibo({
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

  };

  win["WeiXin"]=weixin;

})(window ,wx);

  //module.exports=WeiXin; 注意 VUE 不允许混用 module.exports  / import
  export default  WeiXin



