$(function() {
    var activityId = GC.Lib.GetQueryString("activityId");
    getLayoutList(activityId);
});

function getLayoutList(id) {
    var api = window.Host.customer+"/activity/"+id+"/building/layout";

    $.ajax({
        type:"GET",
        url:api,
        //url:"/api/activity/activityLayout.json",
        dataType: "json",
        success: function(res) {
            if (!res.succ) {
                var str = '<div class="error-noContent-image"></div>';
                    str+= '<a href="" class="error-noContent-text">访问出错，请点击刷新</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            var data = res.data;

            $.each(data, function(i, item) {
                var url = window.Host.local+"activity/activityCase-h5.html?activityId="+id+"&layoutId="+item.id;
                var oLi = $('<li class="layout-item"></li>');
                var str = '<a href="'+url+'">';
                str += '<div class="layout-item-image" style="background-image:url('+item.layoutImage+')"></div>';
                str += '<div class="layout-item-info">'+item.bedroom+'室'+item.livingRoom+'厅'+item.toilet+'卫 '+item.houseArea+'㎡</div>';
                str += '<div class="layout-item-btn">查看预案</div>';
                str += '</a>';

                oLi.html(str).appendTo($(".layout-list"));
            });
        }
    })

}