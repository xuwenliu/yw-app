$(function() {
    var caseId = GetQueryString("caseId"),
        appe = GetQueryString("appe"),
        twitterId = GetQueryString("uid"),    // 推客id
        twitterType = GetQueryString("type"),    // 推客类型
        isTwitter = GetQueryString("twitter"),  // 是否为twitter
        companyId = GetQueryString("companyId");

    var api = window.Host.customer+"/case/app/present/company/"+companyId;

    $.ajax({
        type: "GET",
        url: api,
        //url:'/api/case/companyShow.json',
        dataType: "json",
        success: function(data) {

            // 判断返回数据是否错误
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }

            var data = data.data;

            data.cover = data.cover + window.Host.imgSize_750_750;
            $(".company-720").css("background-image", "url("+data.cover+")");

            // 720路径
            if (!!data.pathOf720) {
                $(".company-720-btn").addClass("show");
                $("#company-720").on("click", function() {
                    // 统计公司720点击事件次数
                    statistics(1);

                    var weixin = navigator.userAgent.search("Language"),
                        wifi = navigator.userAgent.search("WIFI");
                    if (weixin > 0) {
                        if (wifi > 0) {
                            window.location.href = data.pathOf720;
                        }
                        else {
                            $(".wifi-mask").show();
                            $(".wifi-Lbtn").on("click", function(ev) {
                                ev.stopPropagation();
                                window.location.href = data.pathOf720;
                            });
                            $(".wifi-Rbtn").on("click", function(ev) {
                                ev.stopPropagation();
                                $(".wifi-mask").hide();
                            });
                        }
                    }
                    else {
                        window.location.href = data.pathOf720;
                    }
                });
            }
            else {
                $(".js-company-720").hide();
            }

            // 视频(1个)
            if (!!data.video) {
                var video_cover = data.video.url+"?vframe/jpg/offset/"+data.video.second+"/w/240/h/160";
                $(".company-video").css("background-image", "url("+video_cover+")");
                $("#company-video").attr("src", data.video.url);
                var oDiv = $('<div></div>');
                var oSpan = $('<span></span>');
                oDiv.appendTo($(".company-video"));
                oSpan.appendTo($(".company-video"));
            }
            else {
                $(".js-company-video").hide();
            }

            // 如果720和视频都没有，去掉顶部分割线
            if (!data.pathOf720 && !data.video) {
                $(".line-index").eq(0).hide();
            }

            if (!!data.pics) {
                // 公司图片存入本地
                var storage = window.localStorage;
                var arrImg = JSON.stringify(data.pics);
                storage.setItem("company",arrImg);

                $.each(data.pics, function(i, index) {
                    var num = i+1;
                    var api = window.Host.local+"case/scan.html?companyId="+companyId+"&lastPage=company&index="+num+"&caseId="+caseId+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                    if (num < 10) {
                        var oLi = $('<li class="company-item"><div class="company-item-title">0'+num+'</div><div class="company-item-describe">'+(index.explain||"")+'</div><div class="company-item-box"><a href="'+api+'"><img class="company-item-pic" src="'+index.pics[0]+window.Host.imgSize_750+'" /><div></div></a></div></li>');
                    }
                    else {
                        var oLi = $('<li class="company-item"><div class="company-item-title">'+num+'</div><div class="company-item-describe">'+(index.explain||"")+'</div><div class="company-item-box"><a href="'+api+'"><img class="company-item-pic" src="'+index.pics[0]+window.Host.imgSize_750+'" /><div></div></a></div></li>');
                    }
                    oLi.appendTo($(".company-list"));
                });
            }
            else {
                $(".js-company-pics").hide();
            }

        },
        error: function(error) {
            $("body").html("请求失败，稍后请重试！");
        } 
    });

    // 视频播放
    (function() {

        $(".company-video").on("tap", function() {
            // 统计公司视频点击事件次数
            statistics(2);

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
 * @param  {[type]} type [1代表公司720，2代表公司视频]
 * @return {[type]}      [description]
 */
function statistics(type) {
    var type = type;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        if (type === 1) {
            _czc.push(["_trackEvent","公司720","安卓设备","h5"]);
        }        
        else if (type === 2) {
            _czc.push(["_trackEvent","公司视频","安卓设备","h5"]);
        }
    }
    //iOS接口
    if (isiOS) {
        if (type === 1) {
            _czc.push(["_trackEvent","公司720","iOS设备","h5"]);
        }
        else if (type === 2) {
            _czc.push(["_trackEvent","公司视频","iOS设备","h5"]);
        }
    }
}