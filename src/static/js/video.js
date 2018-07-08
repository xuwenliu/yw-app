$(function() {
    var type = GetQueryString("type");

    switch (type) {
        case "personal":
            var userId = GetQueryString("userId"),
                caseId = GetQueryString("caseId"),
                phaseId = GetQueryString("phaseId");

            var api = window.Host.customer+"/case/app/resume/employee/"+userId+"/"+caseId+"/"+phaseId;
            
            $.ajax({
                type: "GET",
                url: api,
                dataType: "json",
                success: function(data) {
                    // 判断返回数据是否错误
                    if (data.succ === false) {
                        $("body").html(data.message+"，稍后请重试!");
                        return false;
                    }

                    var data = data.data;

                    if (!!data.videos) {
                        var video_cover = data.videos[0].videoInfo.url+"?vframe/jpg/offset/"+data.videos[0].videoInfo.second+"/w/240/h/160";
                        $("#video").css("background-image", "url("+video_cover+")");
                        $("#video").attr("src", data.videos[0].videoInfo.url);
                        document.querySelector("#video").play();
                    }
                },
                error: function(error) {
                    $("body").html("请求失败，稍后请重试！");
                }
            });

            break;
        case "company":
            var companyId = GetQueryString("companyId");

            var api = window.Host.customer+"/case/app/present/company/"+companyId;

            $.ajax({
                type: "GET",
                url: api,
                dataType: "json",
                success: function(data) {
                    // 判断返回数据是否错误
                    if (data.succ === false) {
                        $("body").html(data.message+"，稍后请重试!");
                        return false;
                    }

                    var data = data.data;

                    if (!!data.video) {
                        var video_cover = data.video.url+"?vframe/jpg/offset/"+data.video.second+"/w/240/h/160";
                        $("#video").css("background-image", "url("+video_cover+")");
                        $("#video").attr("src", data.video.url);
                        document.querySelector("#video").play();
                    }
                },
                error: function(error) {
                    $("body").html("请求失败，稍后请重试！");
                }
            });
            break;
    }

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