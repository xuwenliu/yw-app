$(function() {
    var brandId = GetQueryString("brandId"),
        twitterId = GetQueryString("uid"),   // 推客id
        twitterType = GetQueryString("type"),    // 推客类型
        isTwitter = GetQueryString("twitter"),  // 是否为twitter
        caseId = GetQueryString("caseId");

    var api = window.Host.customer+"/case/app/detail/brand/"+brandId+"/"+caseId;
    $.ajax({
        type: "GET",
        url: api,
        dataType: "json",
        success: function(data) {
            // 返回数据错误
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }
            var data=data.data;
            $("title").text(data.name+"品牌");

            $.each(data.brands, function(i, index) {
                var oDiv = $('<div class="material-module"><div class="material-title">'+index.name+'</div><div class="material-list"><ul></ul></div></div>');
                $.each(index.brands, function(i, index) {
                    var oLi = $('<li><div style="background-image: url('+index.logo+window.Host.imgSize_200_84+');"></div><p>'+index.name+'</p></li>');
                    oLi.appendTo(oDiv.find("ul"));
                })

                var oLine = $('<div class="line-index"></div>');
                oDiv.appendTo($(".content"));
                oLine.appendTo($(".content"));
            })
        },
        error: function(error) {
            $("body").html("请求失败，稍后请重试！");
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
