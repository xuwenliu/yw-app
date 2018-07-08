$(function() {
    var caseId = GetQueryString("caseId"),
        appe = GetQueryString("appe"),
        twitterId = GetQueryString("uid"),    // 推客id
        twitterType = GetQueryString("type"),    // 推客类型
        isTwitter = GetQueryString("twitter"),  // 是否为twitter
        companyId = GetQueryString("companyId");

    var options = {
        'caseId': caseId,
        'companyId': companyId,
        'appe': appe,
        'twitterId': twitterId,
        'twitterType': twitterType,
        'isTwitter': isTwitter
    };

    var api = window.Host.customer+"/case/app/resume/company/"+companyId+"/"+caseId;

    $.ajax({
        type: "GET",
        url: api,
        //url: '/api/case/company.json',
        dataType: "json",
        success: function(data) {
			console.log(data)
            // 判断返回数据是否错误
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }

            var data = data.data;

            // 公司logo、公司名称
            $(".company-portrait").css("backgroundImage", "url("+data.logo+window.Host.imgSize_190_190+")");
            $(".company-name").text(data.name);

            // 简介
            var oSummary = $(".company-summary");
            var oBtn = $(".company-btn");

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
            oBtn.on("click", function() {
                var _this = $(this);
                if (oSummary.hasClass("company-summary-active")) {
                    oSummary.removeClass("company-summary-active");
                    _this.removeClass("company-btn-active");
                }
                else {
                    oSummary.addClass("company-summary-active");
                    _this.addClass("company-btn-active");
                }
            });

            // 判断是否有公司展示
            if (data.hasPresent) {
                // 跳转公司展示链接
                var url_companyShow = window.Host.local + "case/companyShow.html?companyId="+companyId+"&caseId="+caseId+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                $("#company-show").attr("href", url_companyShow);
                
                // 如果有封面图    
                if (typeof data.cover === "string") {
                    $(".company-showPic").attr("src", data.cover+window.Host.imgSize_750).addClass("show");
                }
            }
            else {
                $("#company-show").hide();
            }

            // 所有作品总数
            if (typeof data.casesCount === "number" && data.casesCount !== 0) {
                $(".js-personal-other").text("公司作品 ("+data.casesCount+")");
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

                var api = window.Host.customer+"/case/app/detail/company/works/"+companyId+"/"+pageNum+"/"+pageSize;
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
                        var api = window.Host.customer+"/case/app/detail/company/works/"+companyId+"/"+pageNum+"/"+pageSize;
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

    // 视频播放
    (function() {

        $(".company-video").on("tap", function() {

            $(".company-mask").addClass("show");

            var video = document.querySelector("#company-video");
            video.play();

        });

        $(".company-mask").on("tap", function() {
            $(this).removeClass("show");
        });

        $("#company-video").on("tap", function(ev) {
            ev.stopPropagation();
        });
        
    })();

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