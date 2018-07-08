$(function() {
    activityList();
});

/**
 * [activityList 请求活动列表]
 * @return {[type]} [description]
 */
function activityList() { 
    var api = window.Host.customer+"/activity?pageNum=1&pageSize=100";

    $.ajax({
        type: "GET",
        url: api,
        //url:"/api/activity/activityList.json",
        dataType: "json",
        success: function(res) {
            if (!res.succ) {
                var str = '<div class="error-noContent-image"></div>';
                    str+= '<a href="" class="error-noContent-text">访问出错，请点击刷新</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            var oUl = $(".list");
            oUl.find("li").remove();

            var data = res.data;

            if (data.result instanceof Array === false) {
                var str = '<div class="error-noContent-image"></div>';
                str+= '<a href="" class="error-noContent-text">暂无优惠活动，敬请期待</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }
            
            $.each(data.result, function(i, item) {
                var oLi = $('<li><img src="'+item.coverImage+'" alt=""></li>');
                var url = window.Host.local+"activity/activityDetail-h5.html?activityId="+item.id;

                oLi.appendTo(oUl);

                oLi.on("click", function() {
                    window.location.href = url;
                })

            });
        }
    });
}