$(function() {
    var id = GetQueryString("caseId");
    var appe = GetQueryString("appe");
    var twitterId = GetQueryString("uid");    // 推客id
    var twitterType = GetQueryString("type");    // 推客类型
    var isTwitter = GetQueryString("twitter");  // 是否为twitter
    var api = window.Host.customer+"/case/app/detail/scene/plan/"+id;

    $.ajax({
        type: "GET",
        url: api,
        dataType: "json",
        success: function(data) {
            var data = data.data;

            $.each(data, function(i, item) {
                var oDiv = $('<div class="plainLayout-item"></div>');
                str = '<div class="plainLayout-title">';
                str += '<h1>'+item.title+'</h1>';
                str += '<h4>原始平面图</h4>';
                str += '</div>';
                str += '<div class="plainLayout-pic">';
                str += '<a href="#" class="plainLayout-link">';
                str += '<img src="'+item.pics[0]+window.Host.imgSize_750+window.Host.watermark+'" alt="原始平面图">';
                str += '<div class="plainLayout-bg"></div>';
                str += '</a>';
                str += '</div>';
                str += '<div class="plainLayout-title">';
                str += '<h4>设计平面图</h4>';
                str += '</div>';
                str += '<div class="plainLayout-pic">';
                str += '<a href="#" class="plainLayout-link">';
                str += '<img src="'+item.pics[1]+window.Host.imgSize_750+window.Host.watermark+'" alt="设计平面图">';
                str += '<div class="plainLayout-bg"></div>';
                str += '</a>';
                str += '</div>';
                str += '<div class="plainLayout-describe">'+(item.explain||"")+'</div>';
            
                oDiv.html(str);
                oDiv.appendTo($(".content"));
            });
    
            var arr_a = $(".plainLayout-link");
            $.each(arr_a, function(i, item) {
                var index = i+1;
                var api = window.Host.local+"scan.html?caseId="+id+"&appe="+appe+"&lastPage=plainLayout&index="+index+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                $(this).attr("href", api);
            });

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