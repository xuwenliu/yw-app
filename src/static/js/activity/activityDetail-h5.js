$(function() {
    var activityId = GC.Lib.GetQueryString("activityId");
    getDetail(activityId);

    // 跳转案例列表
    $(".btn-case").on("click", function() {
        window.location.href = window.Host.local + "activity/activityCase-h5.html?activityId="+activityId;
    });
});

/**
 * [getDetail 获取活动详情]
 * @param  {[type]} id [活动Id]
 * @return {[type]}    [description]
 */
function getDetail(id) {
    var api = window.Host.customer+"/activity/"+id;

    $.ajax({
        type: "GET",
        url: api,
        //url:"/api/activity/activityDetail.json",
        "async":false,
        dataType: "json",
        success: function(res) {
            if (!res.succ) {
                var str = '<div class="error-noContent-image"></div>';
                    str+= '<a href="" class="error-noContent-text">访问出错，请点击刷新</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            var data = res.data;

            // 判断有无预案
            if (!data.hasAvailableCase) {
                $(".btn-case").hide();
                $(".btn-join").addClass("btn-join-active");
            }
            
            // 分享接口参数
            var shareInfo = {
                "link": window.Host.local+'activity/activityDetail-h5.html?activityId='+id,
                "imgUrl": data.coverImage+"&imageView2/1/w/64/h/64",
                "desc": data.subtitle,
                "title":data.name
            };

            var storage = window.localStorage;
            shareInfo = JSON.stringify(shareInfo);
            storage.setItem('shareInfo', shareInfo);

            // 插入活动内容
            $(".detail-content").html(data.content);
        }
    });
}
