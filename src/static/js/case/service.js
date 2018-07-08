$(function() {
    var caseId = GetQueryString("caseId"),
        companyId = GetQueryString("companyId"),
        userId = GetQueryString("userId"),
        sourceType = GetQueryString("sourceType"),
        appe = GetQueryString("appe"),
        twitterId = GetQueryString("uid"),    // 推客id
        twitterType = GetQueryString("type"),    // 推客类型
        isTwitter = GetQueryString("twitter"),  // 是否为twitter
        serviceType = GetQueryString("serviceType");

    var url = null;

    if (sourceType == 1) {
        // 公司入口
        url = window.Host.customer+"/case/app/service?sourceType="+sourceType+"&id="+companyId+"&serviceType="+serviceType;
    }
    else if (sourceType == 2) {
        // 个人入口
        url = window.Host.customer+"/case/app/service?sourceType="+sourceType+"&id="+userId+"&serviceType="+serviceType;
    }

    $.ajax({
        type: "GET",
        url: url,
        //url: '/api/case/service.json',
        dataType: "json",
        success: function(res) {
            var data = res.data;

            $(".service-portrait-img").attr("src", data.employeeVo.headImage);

            $(".service-Info-name").html(data.employeeVo.name + '<span>'+data.employeeVo.title+'</span>')
            
            $(".service-Info-company").text(data.employeeVo.companyName);

            $.each(data.service.items, function(i, item) {
                var index = i+1;
                var oLi = $('<li class="service-item"></li>');
                var str = '';
                if (item.costType == "1") {
                    str += '<div class="service-item-price">占总价'+item.costValue+'%</div>';
                }
                else if (item.costType == "2") {
                    str += '<div class="service-item-price">¥ '+item.costValue+'</div>';
                }
                else if (item.costType == "3") {
                    str += '<div class="service-item-other">免费</div>';
                }
                else if (item.costType == "4") {
                    str += '<div class="service-item-other">另计</div>';
                }
                str += '<div class="service-item-title">【'+index+'】 '+item.title+'</div>';
                str += '<div class="service-item-desc">'+item.description+'</div>';

                oLi.html(str).appendTo($(".service-list"));
            });

            return false;

            $(".service-desc").text(data.procedureDesc);

            if (typeof data.priceRangeEnd === "number" && data.priceRangeEnd !== 0) {
                $(".service-price").text("¥ "+data.priceRangeStart+"-"+data.priceRangeEnd+" ㎡");
            }

            if (data.items instanceof Array === true && data.items.length >0) {
                $.each(data.items, function(i, item) {
                    var index = i+1;
                    var oLi = $('<li class="service-item"></li>');
                    var str = '<div class="service-item-circle">'+index+'</div>';
                    str += '<div class="service-item-name">'+item.title+'</div>';
                    if (typeof item.costPercent !== "string") {
                        str += '<div class="service-item-price">另计</div>';
                    }
                    else if (item.costPercent === "0") {
                        str += '<div class="service-item-price">免费</div>';
                    }
                    else {
                        str += '<div class="service-item-price">总价 '+item.costPercent+'%</div>';
                    }
                    str += '<div class="service-item-title">服务描述</div>';
                    str += '<div class="service-item-desc">'+item.description+'</div>';
                    if (item.serviceContents instanceof Array === true && item.serviceContents.length > 0) {
                        str += '<div class="service-item-title">服务内容</div>';
                        $.each(item.serviceContents, function(i, elem) {
                            var num = i+1;
                            str += '<p class="service-item-content">'+num+'、'+elem.description+'</p>';
                        });
                    }

                    oLi.html(str).appendTo($(".service-list"));
                });
            }

        },
        error: function(res) {

        }

    })

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