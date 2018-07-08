
window.activityDetail = function(val) {
    var activityId = GC.Lib.GetQueryString("activityId");
    getDetail(activityId);
}

$(function() {
    // 返回前一个页面
    $(".title").find("span").on("click", function() {
        GC.Hybrid.closePage();
    });

    var activityId = GC.Lib.GetQueryString("activityId");
    var userType = GC.Lib.GetQueryString("userType");
    if(userType==="e"){
        GC.Hybrid.getAccountToken("activityDetail");
    }else{
        getDetail(activityId);
    }
    

    // 跳转案例列表
    $(".btn-case").on("click", function() {
        window.location.href = window.Host.local + "activity/activityCase.html?activityId="+activityId+"&userType="+userType;
    });
});

/**
 * [getDetail 获取活动详情]
 * @param  {[type]} id [活动Id]
 * @return {[type]}    [description]
 */
function getDetail(id) {
    var userType = GC.Lib.GetQueryString("userType");
    if (userType === "e") {
        var api = window.Host.employee+"/activity/"+id;
    }
    else {
        var api = window.Host.customer+"/activity/"+id;
    }

    $.ajax({
        type: "GET",
        url: api,
        //url:"/api/activity/activityDetail.json",
        dataType: "json",
        headers:{
            'access-token':localStorage.accessToken,
            'session-id':localStorage.sessionId
        },
        success: function(res) {
            if (!res.succ) {
                var str = '<div class="error-noContent-image"></div>';
                    str+= '<a href="" class="error-noContent-text">访问出错，请点击刷新</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                GC.Hybrid.showToast(res.message);
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
                "mShareUrl": window.Host.local+'activity/activityDetail-h5.html?activityId='+id,
                "mShareImg": data.coverImage+"&imageView2/1/w/64/h/64",
                "mDescription": data.subtitle,
                "mShareTitle":data.name
            };

            var storage = window.localStorage;
            _shareInfo = JSON.stringify(shareInfo);
            storage.setItem('shareInfo', _shareInfo);

            // 活动分享
            $(".share").on("click", function() {
                GC.Hybrid.shareActivity(shareInfo);
            });

            // 插入活动内容
            $(".detail-content").html(data.content);
        }
    });
}
