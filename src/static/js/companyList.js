$(function() {
    var obj = $(".banner");
    new Slider().init(obj);

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

        var api = window.Host.business+"/company/getCompanySimple?pageNum="+pageNum+"&pageSize=20";
        slideDown(api, pageNum);
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
                var api = window.Host.business+"/company/getCompanySimple?pageNum="+pageNum+"&pageSize=20";
                slideDown(api, pageNum);
                pageNum++;
            }

        }, false);
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
        timer: null
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
            if (options.iNow === 0) {
                options.iNow++;
                that.tab();
            }
            else {
                options.iNow--;
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

        options.timer = setInterval(function() {
            var options = that.options;
            if (options.iNow === 0) {
                options.iNow++;
                that.tab();
            }
            else {
                options.iNow--;
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
 * [slideDown 下拉刷新]
 * @param  {[type]} api     [请求地址]
 * @param  {[type]} pageNum [请求页码]
 * @return {[type]}         [description]
 */
function slideDown(api, pageNum) {
    $.ajax({
        type: "GET",
        url: api,
        dataType: "json",
        success: function(data) {

            var data = data.data;

            if (data.totalCount === 10) {
                $(".list-slideDown").show();
            }
            else {
                $(".list-slideDown").hide();
            }

            if (data.totalCount > 0) {
                $.each(data.result, function(i, index) {
                    var url = window.Host.local+"case/company.html?companyId="+index.id+"&caseId=0";
                    index.logoImage = index.logoImage + window.Host.imgSize_80_80;

                    var oLi = $('<li class="listItem"></li>');
                    var str = '<a href='+url+'>';
                    str += '<div class="company-portrait fl" style="background-image:url('+index.logoImage+')">';
                    //str += '<img src="'+index.logoImage+'">';
                    str += '</div>';
                    str += '<div class="company-info fl">';
                    str += '<h4>'+index.name+'</h4>';
                    str += '<p>'+index.address+'</p>';
                    str += '</div>';
                    str += '<span></span>';
                    str += '</a>';

                    oLi.html(str).appendTo($(".list-company"));
                });
            }
        }
    });
}

/**
 * [lazyLoad 滚动延时加载]
 * @param  {[type]} arr [dom类数组]
 * @return {[type]}     [description]
 */
function lazyLoad(arr) {
    var h = window.screen.height;
    
    for (var i=0, len=arr.length; i< len; i++) {
        var _this = arr[i];
        var src = _this.dataset.src;
        var top = _this.getBoundingClientRect().top;

        if ( top < h && _this.style.backgroundImage === "") {
            _this.src = src;
        }
    }
}