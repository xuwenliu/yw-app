$(function() {
    var caseId = GetQueryString("caseId"),
        userId = GetQueryString("userId"),
        appe = GetQueryString("appe"),
        twitterId = GetQueryString("uid"),    // 推客id
        twitterType = GetQueryString("type"),    // 推客类型
        isTwitter = GetQueryString("twitter"),  // 是否为twitter
        phaseId = GetQueryString("phaseId");

    var options = {
        'caseId': caseId,
        'userId': userId,
        'appe': appe,
        'twitterId': twitterId,
        'twitterType': twitterType,
        'isTwitter': isTwitter
    };

    var api = window.Host.customer+"/case/app/resume/employee/"+userId+"/"+caseId;

    $.ajax({
        type: "GET",
        url: api,
        //url: "/api/case/personal.json",
        dataType: "json",
        success: function(res) {

            // 判断返回数据是否错误
            if (res.succ === false) {
                $("body").html(res.message+"，稍后请重试!");
                return false;
            }

            var data = res.data;

            // 头像、姓名、头衔、公司名
            $(".personal-portrait").css("backgroundImage", 'url('+data.headImage+window.Host.imgSize_190_190+')');
            $(".personal-name").text(data.name);
            $(".personal-job").text(data.title);
            $(".personal-company").text(data.companyName);
            

            // 简介
            var oSummary = $(".personal-summary");
            var oBtn = $(".personal-btn");

            data.resume = data.resume.replace(/\n/g,'<br />');

            oSummary.find("p").html(data.resume);

            // 是否显示按钮
            if (oSummary.find("p").height() > oSummary.height()) {
                oBtn.show();
            } 
            else {
                oSummary.css("height","auto");
            }
            
            // 显示全部内容
            $(".personal-btn").on("click", function() {
                var _this = $(this);
                if (oSummary.hasClass("personal-summary-active")) {
                    oSummary.removeClass("personal-summary-active");
                    _this.removeClass("personal-btn-active");
                }
                else {
                    oSummary.addClass("personal-summary-active");
                    _this.addClass("personal-btn-active");
                }
            });

            // 业者图片存入本地
            var storage = window.localStorage;
            var arrImg = JSON.stringify(data.presentPics);
            storage.setItem("personal",arrImg);

            // 点击图片跳转
            var url = window.Host.local+"case/scan.html?index=1&caseId="+caseId+"&lastPage=personal"+"&userId="+userId+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
            $(".personal-showPic-url").attr("href", url);
            $(".personal-showPic").attr("src", data.presentPics[0]+window.Host.imgSize_750);

            // 微信链接
            if (!!data.articles) {
                $.each(data.articles, function(i, index) {
                    var oLi = $('<li class="clearfix"><a href="'+index.url+'"><p class="fl personal-article-title">'+index.title+'</p><div class="fr personal-article-thumb"><img src="'+index.thumb+window.Host.imgSize_128_128+'"><div></div></div></a></li>');

                    oLi.appendTo($(".personal-article"));

                    // 文本居中显示
                    var oTitle = oLi.find(".personal-article-title"),
                        oPic = oLi.find(".personal-article-thumb"),
                        h = oLi.height(),
                        oTitle_h = oTitle.height(),
                        oPic_h = oPic.height(),
                        h1,
                        h2;

                    h1 = Math.floor((h - oTitle_h)/2);
                    h2 = Math.floor((h - oPic_h)/2);

                    oTitle.css("margin-top",h1+"px");
                    oPic.css("margin-top",h2+"px");
                });
            }
            else {
                $(".js-personal-article").hide();
            }

            // 服务标准
             if (!!data.serviceStandardDto.serviceStandards && data.serviceStandardDto.serviceStandards.length > 0) {
                $.each(data.serviceStandardDto.serviceStandards, function(i ,item) {
                    if (item.selected) {
                        var oLi = $('<li class="personal-service-item"></li>');
                        var url = window.Host.local + "case/service.html?sourceType=2&serviceType="+item.serviceType+"&userId="+userId+"&caseId="+caseId+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                        var str = '<a href="'+url+'">';
                        str += '<div class="personal-service-title fl">'+item.serviceName+'</div>';
                        str += '<span class="personal-service-arrow fr"></span>';
                        if (typeof item.priceEnd === "number" && item.priceEnd > 0) {
                            str += '<div class="personal-service-price fr"><span>¥ '+item.priceStart+'-'+item.priceEnd+'</span> / ㎡</div>';
                        }
                        str += '</a>';

                        oLi.html(str).appendTo($(".personal-service-list"));
                    }
                });
             }
            else {
                $(".js-personal-service").hide();
            }

            // 所有作品总数
            if (typeof data.casesCount === "number" && data.casesCount !== 0) {
                $(".js-personal-other").text("全部作品 ("+data.casesCount+")");
                $(".personal-slideDown").show();
            }
            else {
                $(".appe").hide();
            }

            //滚动到底部
            (function() {
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

                var api = window.Host.customer+"/case/app/detail/employee/works/"+userId+"/"+pageNum+"/"+pageSize;
                slideDown(api, pageNum, options);
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
                        var api = window.Host.customer+"/case/app/detail/employee/works/"+userId+"/"+pageNum+"/"+pageSize;
                        slideDown(api, pageNum, options);
                        pageNum++;
                    }

                }, false);
            })();

        },
        error: function(error) {
            $("body").html("请求失败，稍后请重试！");
        }
    });

});

/**
 * [slideDown 下拉刷新]
 * @param  {[type]} api     [请求地址]
 * @param  {[type]} pageNum [请求页码]
 * @return {[type]}         [description]
 */
function slideDown(api, pageNum, options) {
    $.ajax({
        type: "GET",
        url: api,
        //url:'/api/case/qitazuopin.json',
        dataType: "json",
        success: function(data) {

            var data = data.data;

            if (!data) {
                return false;
            }

            if (data.length !== 10) {
                $(".personal-slideDown").hide();
            }

            if (data.length > 0) {
                $.each(data, function(i, index) {
                    var oLi = $('<li></li>');
                    
                    var str = '<div class="personal-otherCase-cover" style="background-image:url('+index.caseCover+window.Host.imgSize_330_330+')">';
                    str += '<div class="personal-otherCase-bg"></div>';
                    str += '<div class="personal-otherCase-name">'+index.caseName+'</div>';
                    str += '</div>';

                    oLi.html(str);
                    oLi.appendTo($(".personal-otherCase ul"));

                    oLi.on("click", function() {
                        wxTips(options);
                    });
               });
            }
        }
    });
}

/**
 * [GetQueryString 通过名字查询url参数]
 * @param {[type]} name [description]
 */
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * [statistics 友盟统计]
 * @return {[type]} [description]
 */
function statistics() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        _czc.push(["_trackEvent","个人视频","安卓设备","h5"]);        
    }
    //iOS接口
    if (isiOS) {
        _czc.push(["_trackEvent","个人视频","iOS设备","h5"]);
    }
}