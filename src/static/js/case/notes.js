$(function() {
    var id = GetQueryString("caseId"); 
    var dataType = GetQueryString("dataType"); // 软装softData还是硬装hardData 
    var orderNum = GetQueryString("orderNum"); // 施工编号
    var appe = GetQueryString("appe");
    var twitterId = GetQueryString("uid");    // 用户id
    var twitterType = GetQueryString("type");    // 用户类型
    var isTwitter = GetQueryString("twitter");  // 是否为twitter

    var storage = window.localStorage;
    var data = null;
    if (dataType === "soft") {
        data = storage.getItem("softData");
    }
    else if (dataType === "hard") {
        data = storage.getItem("hardData");
    }

    data = JSON.parse(data);
    data = data[orderNum];

    // 页面标题
    $("title").text(data.phaseName);

    // 阶段描述
    data.phaseDescription = data.phaseDescription.replace(/\n/g,'<br />');
    $(".notes-desc").html(data.phaseDescription);

    // 视频
    if (data.videos instanceof Array && data.videos.length > 0) {
        $.each(data.videos, function(i, item) {
            var video_cover = item.url+"?vframe/jpg/offset/"+item.second+"/w/240/h/160";
            var oLi = $('<li class="notes-item"></li>');
            var str = '<div class="notes-item-title">'+item.name+'</div>';
            if (typeof item.description === "string") {
                str += '<p class="notes-item-desc">'+item.description+'</p>';
            }
            str += '<div class="personal-video" style="background-image: url('+video_cover+')">';
            str += '<div></div>';
            str += '<span></span>';
            str += '</div>';

            $("#personal-video").attr("src", item.url);
            oLi.html(str);
            oLi.appendTo($(".js-notes-video"));
        });
    }

    // 图片
    if (data.images instanceof Array && data.images.length > 0) {
        $.each(data.images, function(i, item) {
            var index = i+1;
            var url = window.Host.local+"case/scan.html?dataType="+dataType+"&lastPage=notes&orderNum="+orderNum+"&index="+index+"&caseId="+id+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
            var oLi = $('<li class="notes-item"></li>');
            var str = '<div class="notes-item-title">'+item.title+'</div>';
            str += '<p class="notes-item-desc">'+(item.explain||"")+'</p>';
            str += '<a class="realScene-pic" href="'+url+'">';
            str += '<img src="'+item.pics[0]+window.Host.imgSize_750+window.Host.watermark+'">';
            str += '<div class="realScene-bg"></div>';
            str += '</a>';

            
            oLi.html(str);
            oLi.appendTo($(".js-notes-image"));
        });
    }

    // 视频播放
    (function() {

        $(".personal-video").on("tap", function() {
            // 统计视频点击事件次数
            statistics("施工视频");

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
 * [statistics 友盟统计]
 * @return {[type]} [description]
 */
function statistics(name) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        _czc.push(["_trackEvent",name,"安卓设备","h5"]);        
    }
    //iOS接口
    if (isiOS) {
        _czc.push(["_trackEvent",name,"iOS设备","h5"]);
    }
}