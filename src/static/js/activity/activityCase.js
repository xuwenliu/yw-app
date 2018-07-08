$(function() {
    // 返回前一个页面
    $(".title").find("span").on("click", function() {
        window.history.go(-1);
    });

    var activityId = GC.Lib.GetQueryString("activityId");
    var layoutId = GC.Lib.GetQueryString("layoutId");
    var userType = GC.Lib.GetQueryString("userType");

    // 我的预案
    if (!!layoutId) {
        $(".js-case").hide().siblings(".js-myCase").show();
        $(".case-filter").hide();
        $(".btn-case").text("全部预案").on("click", function() {
            window.location.href = window.Host.local + "activity/activityCase.html?activityId="+activityId+"&userType="+userType;
        });
        // 加载预案
        getMycaseList(activityId,layoutId);
        return false;
    }

    options = {
        "style": "",
        "bedroom": "",
        "area": "",
        "pageNum": 1,
        "id":activityId,
        "refresh":false
    };

    // 请求：预案筛选条件
    getCaseMenu(activityId);

    // 请求：预案列表
    getCaseList();

    // 跳转我的户型
    $(".btn-case").on("click", function() {
        window.location.href = window.Host.local + "activity/activityLayout.html?activityId="+activityId+"&userType="+userType;
    });

    // 事件：风格筛选
    $(".js-style-btn").on("click", function() {
        var that = $(this);

        $(".filter-mask").show();
        $(".js-style").css({"WebkitTransform":"translateX(0) translateZ(0)", "transform":"translateX(0) translateZ(0)"});
        
        // 事件： 点击筛选
        $(".js-style li").off().on("click", function() {
            var _self = $(this);
            var index = $(this).index();
            _self.addClass("active").siblings("li").removeClass("active");
            if (index != 0) {
                that.text(_self.find(".filter-value").text());
                options.style = parseInt(_self.attr("key"));
            }
            else {
                that.text("风格");
                options.style = "";
            }

            $(".filter-mask").hide();
            $(".filter-frame").css({"WebkitTransform":"translateX(7rem) translateZ(0)", "transform":"translateX(7rem) translateZ(0)"});
        
            options.pageNum = 1;
            options.refresh = true;
            // 加载案例
            getCaseList(); 
        });

    });

    // 事件：户型筛选
    $(".js-layout-btn").on("click", function() {
        var that = $(this);

        $(".filter-mask").show();
        $(".js-layout").css({"WebkitTransform":"translateX(0) translateZ(0)", "transform":"translateX(0) translateZ(0)"});
        
        // 事件： 点击筛选
        $(".js-layout li").off().on("click", function() {
            var _self = $(this);
            var index = $(this).index();
            _self.addClass("active").siblings("li").removeClass("active");
            if (index != 0) {
                that.text(_self.find(".filter-value").text());
                options.bedroom = parseInt(_self.attr("key"));
            }
            else {
                that.text("户型");
                options.bedroom = "";
            }

            $(".filter-mask").hide();
            $(".filter-frame").css({"WebkitTransform":"translateX(7rem) translateZ(0)", "transform":"translateX(7rem) translateZ(0)"});
            
            options.pageNum = 1;
            options.refresh = true;
            // 加载案例
            getCaseList(); 
        });
    });

    // 事件：面积筛选
    $(".js-houseArea-btn").on("click", function() {
        var that = $(this);

        $(".filter-mask").show();
        $(".js-houseArea").css({"WebkitTransform":"translateX(0) translateZ(0)", "transform":"translateX(0) translateZ(0)"});
        
        // 事件： 点击筛选
        $(".js-houseArea li").off().on("click", function() {
            var _self = $(this);
            var index = $(this).index();
            _self.addClass("active").siblings("li").removeClass("active");
            if (index != 0) {
                that.text(_self.find(".filter-value").text());
                options.area = parseInt(_self.attr("key"));
            }
            else {
                that.text("面积");
                options.area = "";
            }

            $(".filter-mask").hide();
            $(".filter-frame").css({"WebkitTransform":"translateX(7rem) translateZ(0)", "transform":"translateX(7rem) translateZ(0)"});
            
            options.pageNum = 1;
            options.refresh = true;
            // 加载案例
            getCaseList(); 
        });
    });

    // 事件：关闭筛选
    $(".filter-mask").on("click", function() {
        $(".filter-mask").hide();
        $(".filter-frame").css({"WebkitTransform":"translateX(7rem) translateZ(0)", "transform":"translateX(7rem) translateZ(0)"});
    });

    // 事件：阻止底层滑动
    $(".filter-mask").on("touchmove", function(ev) {
        ev.preventDefault();
    });

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
                options.refresh = false;
                getCaseList();
            }

        }, false);
    })();
});

/**
 * [getCaseMenu 获取筛选条件]
 * @param  {[type]} id [活动ID]
 * @return {[type]}    [description]
 */
function getCaseMenu(id) {
    var userType = GC.Lib.GetQueryString("userType");
    if (userType === "e") {
        var api = window.Host.employee + "/activity/"+id+"/case/menu";
    }
    else {
        var api = window.Host.customer + "/activity/"+id+"/case/menu";
    }

    $.ajax({
        type: "GET",
        url: api,
        //url:"/api/activity/activityCaseMenu.json",
        dataType: "json",
        headers:{
                    'access-token':localStorage.accessToken || "",
                    'session-id':localStorage.sessionId || ""
                },
        success: function(res) {
            if (!res.succ) {
                var str = '<div class="error-noContent-image"></div>';
                    str+= '<a href="" class="error-noContent-text">访问出错，请点击刷新</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            var data = res.data;

            // 总额
            if (data.totalCount == 0) {
                var str = '<div class="error-noContent-image"></div>';
                str+= '<a href="" class="error-noContent-text">该活动暂无预案，敬请期待</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }
            else {
                $(".filter-totalCount").text(data.totalCount);
            }

            // 风格
            $.each(data.caseStyles, function(i, item) {
                var oLi = $('<li key='+item.code+'><span class="filter-value">'+item.desc+'</span><span class="filter-count">'+item.count+'</span></li>');
                oLi.appendTo($(".js-style").find(".filter-list"));
            });

            // 户型
            for (key in data.bedrooms) {
                var value = fontTrans(key);
                var oLi = $('<li key='+key+'><span class="filter-value">'+value+'居</span><span class="filter-count">'+data.bedrooms[key]+'</span></li>');
                oLi.appendTo($(".js-layout").find(".filter-list"));
            }

            // 面积
            for (key in data.houseAreas) {
                var oLi = $('<li key='+key+'><span class="filter-value">'+key+'</span><span class="filter-count">'+data.houseAreas[key]+'</span></li>');
                oLi.appendTo($(".js-houseArea").find(".filter-list"));
            }
        }
    });
}

function fontTrans(num) {
    var arr = ["零","一","二","三","四","五","六","七","八","九"];
    return arr[num];
}

function getCaseList() {
    var userType = GC.Lib.GetQueryString("userType");
    if (userType === "e") {
        var api = window.Host.employee+"/activity/"+options.id+"/case?pageNum="+options.pageNum+"&pageSize=20&style="+options.style+"&bedroom="+options.bedroom+"&area="+options.area; 
    }
    else {
        var api = window.Host.customer+"/activity/"+options.id+"/case?pageNum="+options.pageNum+"&pageSize=20&style="+options.style+"&bedroom="+options.bedroom+"&area="+options.area; 
    }

    $.ajax({
        type: "GET",
        url: api,
        //url:"/api/activity/activityCaseList.json",
        dataType: "json",
        headers:{
                    'access-token':localStorage.accessToken || "",
                    'session-id':localStorage.sessionId || ""
                },
        success: function(res) {
            if (!res.succ) {
                var str = '<div class="error-noContent-image"></div>';
                    str+= '<a href="" class="error-noContent-text">访问出错，请点击刷新</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            $(".case-noContent").hide();

            if (options.refresh) {
                $(".case-list").find("li").remove();
            }

            if (res.data.result instanceof Array === false && options.pageNum === 1) {
                $(".case-noContent").show();
                return false;
            }

            options.pageNum++;

            var data = res.data.result;

            if (data.length === 10) {
                $(".case-slideDown").show();
            }
            else {
                $(".case-slideDown").hide();
            }

            if (data.length > 0) {
                $.each(data, function(i, index) {
                    index.caseCover = index.caseCover + window.Host.imgSize_750_750;
                    index.companyLogo = index.companyLogo + window.Host.imgSize_80_80;
                    index.bedroom = fontTrans(index.bedroom);

                    var oLi = $('<li class="case-item" data-case-id='+index.caseId+'></li>');
                    var str = '<div class="index-720" style="background-image:url('+index.caseCover+')">';
                    str += '<div class="index-720-bg"></div>';
                    if (index.has720) {
                        str += '<div class="index-720-btn"></div>';
                    }
                    str += '</div>';
                    str += '<div class="case-item-info">';
                    str += '<div class="case-item-companyLogo" style="background-image:url('+index.companyLogo+')"></div>';
                    str += '<div class="case-item-name">'+index.caseName+'</div>';
                    str += '<div class="case-item-label">'+index.caseStyleDesc+' / '+index.bedroom+'居 / '+index.houseArea+'㎡</div>';
                    str += '</div>';
                    str += '<div class="line-index"></div>';

                    oLi.html(str).appendTo($(".case-list"));

                    oLi.on("click", function() {
                        var caseId = $(this).data("case-id");
                        GC.Hybrid.caseSkip(caseId);
                    });
                });
            }
        }
    });
}

function getMycaseList(activityId, layoutId) {
    var userType = GC.Lib.GetQueryString("userType");
    if (userType === "e") {
        var api = window.Host.employee+"/activity/"+activityId+"/building/layout/"+layoutId+"/case";
    }
    else {
        var api = window.Host.customer+"/activity/"+activityId+"/building/layout/"+layoutId+"/case";
    }

    $.ajax({
        type: "GET",
        url: api,
        //url:"/api/activity/activityMyCaseList.json",
        dataType: "json",
        headers:{
                    'access-token':localStorage.accessToken || "",
                    'session-id':localStorage.sessionId || ""
                },
        success: function(res) {
            if (!res.succ) {
                var str = '<div class="error-noContent-image"></div>';
                    str+= '<a href="" class="error-noContent-text">访问出错，请点击刷新</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            if (res.data instanceof Array === false || res.data.length == 0) {
                var str = '<div class="error-noContent-image"></div>';
                str+= '<a href="" class="error-noContent-text">该户型暂无预案，敬请期待</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            var data = res.data;

            $.each(data, function(i, index) {
                index.caseCover = index.caseCover + window.Host.imgSize_750_750;
                index.companyLogo = index.companyLogo + window.Host.imgSize_80_80;
                index.bedroom = fontTrans(index.bedroom);

                var oLi = $('<li class="case-item" data-case-id='+index.caseId+'></li>');
                var str = '<div class="index-720" style="background-image:url('+index.caseCover+')">';
                str += '<div class="index-720-bg"></div>';
                if (index.has720) {
                    str += '<div class="index-720-btn"></div>';
                }
                str += '</div>';
                str += '<div class="case-item-info">';
                str += '<div class="case-item-companyLogo" style="background-image:url('+index.companyLogo+')"></div>';
                str += '<div class="case-item-name">'+index.caseName+'</div>';
                str += '<div class="case-item-label">'+index.caseStyleDesc+' / '+index.bedroom+'居 / '+index.houseArea+'㎡</div>';
                str += '</div>';
                str += '<div class="line-index"></div>';

                oLi.html(str).appendTo($(".case-list"));

                oLi.on("click", function() {
                    var caseId = $(this).data("case-id");
                    GC.Hybrid.caseSkip(caseId);
                });
            });
        }
    });
}