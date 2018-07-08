// v1.7.0新加的开始
var selectCity=$(".city").find("i");
var isPosition=false;//是否进行了定位
var selectLi = $(".toast-city").find("li");
var toastCity = $(".toast-city");
var userType = GC.Lib.GetQueryString("userType");
var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端


window.getAccountTokenReturn = function(val) {
    var value = window.atob(val);
        value = JSON.parse(value);
        var name = value.name;
        localStorage.accessToken=value.token;
        localStorage.sessionId=value.sessionId;
        window[name]();
}

window.start = function(){
    if(localStorage.city){
        selectCity.text(localStorage.city);
        if(localStorage.city=="成都"){
            selectLi.eq(0).addClass("C6");
        }else{
            selectLi.eq(1).addClass("C6");
        }
        getCityId(localStorage.city);
    }else{
        //定位
        getPosition();
    }
}
window.change = function(){
}


// v1.7.0新加的结束
$(function() {
    /*if (isiOS) {
        $(".wrap").addClass("ios-blank");
    }*/
    // v1.8.0 c端加的

    if (userType === "c") {
        $(".list").find("li").addClass("v180");
         	$(".title").addClass("title-c");
        $(".material").css({
            display:"block"
        });
       	 //vue-首页存储的cityId
		invokeNative({
			"code":window.jsBridge.CODE_EXTRACT,
			"data":"cityId",
			"callback":"returnData"
		})
		window.returnData = function(value) {
			var value=window.atob(value);
	        var res = JSON.parse(value);
	//      alert(res.data)
		    activityList(res.data || 2294);
		}

        /*点击主材补贴图片*/
        $(".material").on("click",function(){
            //android设备---判断用户是否登录执行回调函数returnisLogin
            //原生app返回一个res.data==1用户登录,res.data==0未登录
            invokeNative({
                "code":window.jsBridge.CODE_GET_LOGIN_STATUS,
                "callback":"returnisLogin"
            });
            window.returnisLogin=function(value){
                var value=window.atob(value);
                var res = JSON.parse(value);
                if(res.data==1){
                    console.log("打开主材补贴---需要用户登录才能访问");
                    getAccountToken(); //为了进入到主材补贴页面里token同步，需要调用此方法同步token。
                    /*v1.10.0数据埋点 ACTION_SEE_MATERIAL_SUBSIDY(13, 4, "查看主材补贴"),*/
                    /*A 获取设备信息*/
                    invokeNative({
                        "code":window.jsBridge.CODE_DEVICE_SYSTEM_INFO,
                        "callback":"returnEquipmentInformation"
                    });
                    window.returnEquipmentInformation=function(value){
                        var value = window.atob(value);
                        var res = JSON.parse(value);
                        var data = res.data;
                        data.action = dataLog.ACTION_SEE_MATERIAL_SUBSIDY;//13
                        data.actionResult = 200;
                        /*B执行提交操作postDataLog方法在common.js里面*/
                        postDataLog(data,localStorage.accessToken,localStorage.sessionId);
                    }

                    var url=window.Host.localUrl+"/#/materialSubsidy";
                    invokeNative({
                        "code":window.jsBridge.CODE_OPEN,
                        "data":{
                            "url":url
                        }
                    });
                }else {
                     /*v1.10.0数据埋点 ACTION_RESOURCE_SEE_MATERIAL_SUBSIDY(13, 2, "APP-优惠-查看主材补贴")*/
                    invokeNative({
                        "code":window.jsBridge.CODE_LOG_ACTION_RESOURCE,
                        "data":dataLog.ACTION_RESOURCE_SEE_MATERIAL_SUBSIDY//13
                    });
                    GC.Hybrid.toLogin();

                }
            }
        })
        /*v1.11.0拼团入口*/
        $(".groupBooking").css({
            display:"block"
        });
       	$(".groupBooking").on("click",function(){
       		invokeNative({
                "code":window.jsBridge.CODE_GET_LOGIN_STATUS,
                "callback":"isLogin"
            });
            window.isLogin=function(value){
                var value=window.atob(value);
                var res = JSON.parse(value);
                if(res.data==1){
                	getAccountToken(); //为了进入到拼团页面里token同步，需要调用此方法同步token。
                	var url=window.Host.localUrl+"/#/groupBookingActivityList";
                    invokeNative({
                        "code":window.jsBridge.CODE_OPEN,
                        "data":{
                            "url":url
                        }
                    });
                }else {
                	invokeNative({"code":window.jsBridge.CODE_LOGIN});
                }
            }

       	})

    }else { //E端
    	 // v1.8.0 c端加的结束
    	$(".city").show();
	    GC.Hybrid.getAccountToken("start");
	    $(".city").on("click",function(){
	        toastCity.show();
	        $(this).find("img").addClass("rotate");
	    })
	    toastCity.on("click",function(){
	    	$(this).hide();
	    })
	    selectLi.on("click",function(){
	        $(this).addClass("C6").siblings("li").removeClass("C6");
	        $(".city").find("img").removeClass("rotate");
	        var currentSelectCity=$(this).text().split(" ").join("");
	        selectCity.text(currentSelectCity);
	        getCityId(currentSelectCity);
	        toastCity.hide();
	        GC.Hybrid.getAccountToken("change");
	        localStorage.city=currentSelectCity;
	    })
    }

 })

// v1.7.0新加的开始
function getPosition(){
    var geolocation = new BMap.Geolocation();
    var gc = new BMap.Geocoder();
    geolocation.getCurrentPosition( function(r) {
    //定位结果对象会传递给r变量
        if(this.getStatus() == BMAP_STATUS_SUCCESS) {
        //通过Geolocation类的getStatus()可以判断是否成功定位。
            var pt = r.point;
            gc.getLocation(pt, function(rs){
                var addComp = rs.addressComponents;
                console.log(addComp)
                if(addComp.city=="成都市"){
//              	alert("定位成功+++"+addComp);
                    selectCity.text("成都");
                    getCityId(selectCity.text());
                    selectLi.eq(0).addClass("C6");
                }else{
                    selectCity.text("重庆");
                    getCityId(selectCity.text());
                    selectLi.eq(1).addClass("C6");
                }
                localStorage.city=selectCity.text();
            });
        }else{
//      	alert("定位失败");
            selectCity.text("成都");
            getCityId(selectCity.text());
            selectLi.eq(0).addClass("C6");
            console.log('failed'+this.getStatus());
        }
        isPosition=true;
    },{enableHighAccuracy: true});

    setTimeout(function(){
        if(!isPosition){
            //不走定位就默认显示成都的数据
            selectCity.text("成都");
            getCityId("成都");
            selectLi.eq(0).addClass("C6");
        }
    },10000)

}
//获取城市id
function getCityId(city){
    $.ajax({
            type: "GET",
            url:window.Host.customer+"/area/citySupport",
            dataType: "json",
            success:function(res){
                var data = res.data;
                if(res.succ){
                    for(var i in data){
                        if(data[i].shortName==city){
                            activityList(data[i].id);
                            break;
                        }
                    }
                }
            }
    });
}
// v1.7.0新加的结束
function activityList(cityId) {
  	console.log("请求数据的"+cityId);
    var userType = GC.Lib.GetQueryString("userType");
    var api='';
    if (userType === "c") {
        api = window.Host.customer+"/activity?cityId="+cityId+"&pageNum=1&pageSize=100";
    }else {
        api = window.Host.employee+"/activity?cityId="+cityId+"&pageNum=1&pageSize=100";
    }
    $.ajax({
        type: "GET",
        url: api,
        //url:"/api/activity/activityList.json",
        dataType: "json",
        headers:{
            'access-token':localStorage.accessToken,
            'session-id':localStorage.sessionId
        },
        success: function(res) {

            console.log(JSON.stringify(res));
            $(".activity-noContent").hide();
            var oUl = $(".list");
            oUl.find("li").remove();
            var data = res.data;
            if(userType==="e"){
                if (!res.succ) {
                    $(".activity-noContent").show().find(".error-noContent-text").text("访问出错，请点击刷新");
                    return false;
                }
                if (data.result instanceof Array === false) {
                    $(".activity-noContent").show().find(".error-noContent-text").text("暂无优惠活动，敬请期待");
                    return false;
                }
            }
            $.each(data.result, function(i, item) {
                console.log(item);
                var oLi = $('<li><img src="'+item.coverImage+'"></li>');
                var urlActivityList = '';
                if(item.type==1){//楼盘活动
                    urlActivityList = window.Host.localUrl+"/#/greenbeltCommunityActivityDetail?activityId="+item.id+"&userType="+userType;
                    // urlActivityList = "http://192.168.28.115:8090/#/greenbeltCommunityActivityDetail?activityId="+item.id+"&userType="+userType;
                }else {//基本活动
                    urlActivityList = window.Host.local+"activity/activityDetail.html?activityId="+item.id+"&userType="+userType;
                }
                oLi.appendTo(oUl);
                /*E端楼盘活动不显示*/
                if(userType==="e"&&item.type==1){

                    oLi.hide();

                }
                oLi.on("click", function() {
                    /*v1.10.0数据埋点 ACTION_SEE_DISCOUNT_DETAIL(12, 4, "查看优惠详情"),*/
                    if(userType==="c"){

                        getAccountToken();
                        /*A 获取设备信息*/
                        invokeNative({
                            "code":window.jsBridge.CODE_DEVICE_SYSTEM_INFO,
                            "callback":"returnEquipmentInfo"
                        });
                        window.returnEquipmentInfo=function(value){
                            var value = window.atob(value);
                            var res = JSON.parse(value);
                            var data = res.data;
                            data.action = dataLog.ACTION_SEE_DISCOUNT_DETAIL;//12
                            data.actionResult = 200;
                            /*B执行提交操作postDataLog方法在common.js里面*/
                            postDataLog(data,localStorage.accessToken,localStorage.sessionId);
                        }
                    }


                    // 打开新的webview，传入详情页面url
                    // alert(urlActivityList);
                    console.log("打开新的webview，传入详情页面url"+urlActivityList);
                    // GC.Hybrid.openWebview(url);
                    invokeNative({
                        "code":window.jsBridge.CODE_OPEN,
                        "data":{
                            "url":urlActivityList
                        }
                    });

                })

            });
        }
    });
}
/**
 * [reloadList 每次进入活动页面重新请求活动列表]
 * @return {[type]} [description]
 */
window.reloadList=function() {
	if (userType === "c") {
		var cityId = "";
		invokeNative({
			"code":window.jsBridge.CODE_EXTRACT,
			"data":"cityId",
			"callback":"returnData"
		})
		window.returnData = function(value) {
			var value=window.atob(value);
	        var res = JSON.parse(value);
	        cityId = res.data || 2294;
//		    alert(cityId);
		    activityList(cityId);
		}
	}else {
		getCityId(localStorage.city);
	}

}
