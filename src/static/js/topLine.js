$(function() {
    if ($("body").find("a").eq(0).text() == "站长统计") {
        $("body").find("a").eq(0).hide();
    }

    var obj = $(".frame");
    var obj_w = obj.width();
    obj.find("li").width(obj_w);
    new Slider().init(obj);

    var source = GetQueryString("source");
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    // 判断是否为微信
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    var isWeixin = false;
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //在微信浏览器打开
        isWeixin = true;
    }

    $("#btn").on("click", function() {
        if (source === "jinritoutiao") {
            //Android接口
            if (isAndroid) {
                if (isWeixin) {
                    //在微信浏览器打开
                    _czc.push(["_trackEvent","下载按钮","微信Android","今日头条",0,"btn"]); 
                    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yingwumeijia.android.ywmj.client";
                }
                else {
                    _czc.push(["_trackEvent","下载按钮","安卓设备","今日头条",0,"btn"]); 
                    window.location.href = "http://o7zlnyltf.bkt.clouddn.com/app-toutiao-release.apk";
                }               
            }
            //iOS接口
            if (isiOS) {
                if (isWeixin) {
                    //在微信浏览器打开
                    _czc.push(["_trackEvent","下载按钮","微信ios","今日头条",0,"btn"]); 
                    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yingwumeijia.android.ywmj.client";
                }
                else {
                    _czc.push(["_trackEvent","下载按钮","iOS设备","今日头条",0,"btn"]);
                    window.location.href = "http://itunes.apple.com/us/app/id1133878484";
                }
            }
        }
    });

    $(".href720").on("click", function() {
        if (source === "jinritoutiao") {
            //Android接口
            if (isAndroid) {
                _czc.push(["_trackEvent","查看720","安卓设备","今日头条",0,"btn"]);               
            }
            //iOS接口
            if (isiOS) {
                _czc.push(["_trackEvent","查看720","iOS设备","今日头条",0,"btn"]);
            }
        }
    });

    // 视频播放
    (function() {

        $(".video").on("tap", function() {

            $(".personal-mask").addClass("show");

            var video = document.querySelector("#personal-video");
            video.play();

        });

        $(".personal-mask").on("tap", function(ev) {
            ev.stopPropagation();
            $(this).removeClass("show");
        });

        $("#personal-video").on("tap", function(ev) {
            ev.stopPropagation();
        });
        
    })();
});

/**
 * [Slider 幻灯片]
 */
function Slider() {
    this.options = {
        oTab : null,
        oList : null,
        aLi : null,
        iNow : 0,
        iX : 0,
        iW : 0,
        iStartTouchX : 0,
        iStartX : 0,
        iDis : 0,
        iStartTouchY : 0,
        iStartY : 0,
        iDisY : 0,
        timer: null,
        bool: true
    }
}

Slider.prototype = {
    init: function(obj) {
        var options = this.options;
        options.oTab = $(obj);
        options.oList = options.oTab.find("ul").eq(0);
        options.aLi = options.oList.find("li");
        options.iW = options.aLi.eq(0).width();
        var that = this;

        options.oTab.on("touchstart", function(ev) { 
            clearInterval(options.timer);
            that.fnStart(ev);
        });

        options.oTab.on("touchmove", function(ev) {
            that.fnMove(ev);
        });    

        options.oTab.on("touchend", function(ev) {
            that.fnEnd();
        });

        options.timer = setInterval(function() {
            var options = that.options;
            if (options.bool) {
                options.iNow++;
                if (options.iNow === options.aLi.length-1) {
                    options.bool = !options.bool;
                }
                that.tab();
            }
            else {
                options.iNow--;
                if (options.iNow === 0) {
                    options.bool = !options.bool;
                }
                that.tab();
            }
        }, 3000);
    },
    fnStart: function(ev) {
        var options = this.options;

        options.oList.css("transition", "none");
        var _ev = ev.changedTouches[0];
        options.iStartTouchX = _ev.pageX;
        options.iStartX = options.iX;

        options.iStartTouchY = _ev.pageY;

    },
    fnMove: function(ev) {
        var options = this.options;

        var _ev = ev.changedTouches[0];
        options.iDis = _ev.pageX - options.iStartTouchX;
        options.iDisY = _ev.pageY - options.iStartTouchY;

        //判断是竖直滑动还是横向滑动
        var Y = Math.abs(options.iDisY);
        var X = Math.abs(options.iDis);

        if (X > Y) {
            ev.stopPropagation();
            ev.preventDefault();
            options.iX = options.iStartX + options.iDis;
            options.oList.css({"WebkitTransform":"translateX("+options.iX+"px) translateZ(0)", "transform":"translateX("+options.iX+"px) translateZ(0)"});
        }
    },
    fnEnd: function() {
        var options = this.options;
        var that = this;
        var val = Math.abs(options.iDis) * 4;
        if (val > options.iW) {
            options.iDis < 0 ? options.iNow++ : options.iNow--;  
        }
        if (options.iNow < 0) {
            options.iNow = 0;
        }
        if (options.iNow > options.aLi.length-1) {
            options.iNow = options.aLi.length-1;
        }
        this.tab();

        if (options.iNow === 0) {
            options.bool = true;
        }
        else if (options.iNow === options.aLi.length-1) {
            options.bool = false;
        }

        options.timer = setInterval(function() {
            var options = that.options;
            if (options.bool) {
                options.iNow++;
                if (options.iNow === options.aLi.length-1) {
                    options.bool = !options.bool;
                }
                that.tab();
            }
            else {
                options.iNow--;
                if (options.iNow === 0) {
                    options.bool = !options.bool;
                }
                that.tab();
            }
        }, 3000);

    },
    tab: function() {
        var options = this.options;
        options.oTab.find("span").eq(0).text(options.iNow+1);
        options.iX = -options.iNow*options.iW;
     
        options.oList.css("transition", "0.5s");
        options.oList.css({"WebkitTransform":"translateX("+options.iX+"px) translateZ(0)", "transform":"translateX("+options.iX+"px) translateZ(0)"});
    }
   
};

/**
 * [GetQueryString 通过名字查询url参数]
 * @param {[type]} name [description]
 */
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}