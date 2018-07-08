
$(function() {
	var userType = GC.Lib.GetQueryString("userType");

	if (userType === "e") {
		$(".btn-join").hide();
		$(".btn-case").addClass("btn-case-e");
	}

	// 事件：点击领券
	$(".btn-join").on("click", function() {
		GC.Hybrid.getAccountToken("check");
		GC.Hybrid.getUserInfo();
	});

	// 事件：提交报名信息
	$(".popBox-btn").on("click", function() {
		submit();
	});

	// 输入框
	$(".popBox").on("click", function() {
		$(".popBox").hide();
	});
	$(".popBox").on("touchmove", function(ev) {
		ev.preventDefault();
	});
	$(".popBox-frame").on("click", function(ev) {
		ev.stopPropagation();
	});

	// 提示
	$(".popTip-btn").on("click", function() {
		$(".popTip").hide();
	});
	$(".popTip").on("click", function() {
		$(".popTip").hide();
	});
	$(".popTip-frame").on("click", function(ev) {
		ev.stopPropagation();
	});

	/**
 * [submit 提交表单]
 * @return {[type]} [description]
 */
function submit() {
	var activityId = GC.Lib.GetQueryString("activityId");
		activityId = parseInt(activityId);

	var name = $(".js-name").val();
	var phone = $(".js-phone").val();
	console.log("输入的name为"+name);
	console.log("输入的phone为"+phone);

	if (name.length < 2) {
	    GC.Hybrid.showToast("中文名字长度为2-10位");
	    return false;
	}

	if (!name.match(/^[\u4E00-\u9FA5]+$/)) {
	    GC.Hybrid.showToast("姓名必须是中文");
	    return false;
	}

	if (!phone.match(/^1\d{10}$/)) {
	    GC.Hybrid.showToast("请输入正确的手机号");   
	    return false;
	}

	if ($(".popBox-btn").hasClass("charge")) {
		// 跳转到收银台
		var amount = $(".popBox-btn").find("span").text();
		amount = parseFloat(amount);
		var api = window.Host.customer+"/bill/activity";
		
		$.ajax({
			type: "POST",
			url: api,
			data:JSON.stringify({"activityId":activityId, "amount":amount, "phoneNumber":phone, "name": name}),
			dataType: "json",
			contentType: "application/json",
			beforeSend: function(request) {
				$(".popBox-btn").hide();
				request.setRequestHeader("access-token",GC.Hybrid.accessToken);
				request.setRequestHeader("session-id",GC.Hybrid.sessionId);
			},
			success: function(res) {
				if (res.succ) {
					GC.Hybrid.dismisDialog();
					var data = res.data;
					//GC.Hybrid.toPay(data);
					invokeNative({
						"code":window.jsBridge.CODE_PAY,
						"data":{
							"billId":data,           //帐单id，数值类型
                			"payType":1              //payType默认支付宝、微信  0：不支持易宝支付， 1：支持易宝支付
						}
					});	

					$(".popBox-btn").show();
				}
				else if (res.stateCode === 312) {
					GC.Hybrid.toLogin();
				}
				else if (res.stateCode === 314) {
					GC.Hybrid.showDialog();
					GC.Hybrid.refreshToken("submit");
				}
				else if (res.stateCode === 315) {
					GC.Hybrid.showDialog();
					GC.Hybrid.getAccountToken("submit");
				}
				else {
					GC.Hybrid.showToast(res.message);
					$(".popBox-btn").show();
				}
			}
		});

	}
	else {
		// 提交信息免费领券 POST /activity/coupon/signUp
		var nameUri = encodeURI(name);
		var api = window.Host.customer+"/activity/coupon/signUp?activityId="+activityId+"&userName="+nameUri+"&userPhone="+phone;
		$.ajax({
			type: "POST",
			url: api,
			dataType: "json",
			beforeSend: function(request) {
				$(".popBox-btn").hide();
				request.setRequestHeader("access-token",GC.Hybrid.accessToken);
				request.setRequestHeader("session-id",GC.Hybrid.sessionId);
			},
			success: function(res) {
				if (res.succ) {
					GC.Hybrid.dismisDialog();
					window.location.href = window.Host.local + "activity/activityResult.html";
				}
				else if (res.stateCode === 312) {
					GC.Hybrid.toLogin();
					$(".popBox-btn").show();
				}
				else if (res.stateCode === 314) {
					GC.Hybrid.showDialog();
					GC.Hybrid.refreshToken("submit");
				}
				else if (res.stateCode === 315) {
					GC.Hybrid.showDialog();
					GC.Hybrid.getAccountToken("submit");
				}
				else {
					GC.Hybrid.showToast(res.message);
					$(".popBox-btn").show();
				}
			}
		});
	}
}
});

/**
 * [check 检测当前用户是否已领券]
 * @return {[type]} [description]
 */
window.check=function() {
	var activityId = GC.Lib.GetQueryString("activityId");
	var api = window.Host.customer+"/activity/coupon/check?activityId="+activityId;
	$.ajax({
		type: "GET",
		url: api,
		dataType: "json",
		beforeSend: function(request) {
			request.setRequestHeader("access-token",GC.Hybrid.accessToken);
			request.setRequestHeader("session-id",GC.Hybrid.sessionId);
		},
		success: function(res) {
			console.log(res);
			console.log(res.stateCode)
			//$(".detail-content").text(JSON.stringify(res.data));
			if (res.succ) {
				// 判断能否领券
				if (res.data.signUp) {
					// 判断是否需要买券
					if (res.data.activityCoupon.charge) {
						$(".popBox-btn").html("购买入场券 ¥<span>"+res.data.activityCoupon.price+"</span>").addClass("charge");
					}

					$(".popBox").show();
				}
				else {
					$(".popTip").show();
				}
			}
			else if (res.stateCode === 312) {
				/*v1.10.0数据埋点 ACTION_RESOURCE_ENROLL(14, 2, " APP-优惠-立即报名"),*/
				invokeNative({
                    "code":window.jsBridge.CODE_LOG_ACTION_RESOURCE,
                    "data":dataLog.ACTION_RESOURCE_ENROLL//14
                });
				GC.Hybrid.toLogin();

			}
			else if (res.stateCode === 314) {
				GC.Hybrid.refreshToken("check");
			}
			else if (res.stateCode === 315) {
				GC.Hybrid.getAccountToken("check");
			}
			else {
				GC.Hybrid.showToast(res.message);
			}
		}
	});
}

/**
 * [getAccountTokenReturn getAccoutToken回调函数]
 * @param  {[type]} val [返回值，name,accessToken,sessionId]
 * @return {[type]}     [description]
 */
function getAccountTokenReturn(val) {
	var value = window.atob(val);
	value = JSON.parse(value);
	var name = value.name;
	GC.Hybrid.accessToken = value.token;
	if (!GC.Hybrid.accessToken) {
		/*v1.10.0数据埋点 ACTION_RESOURCE_ENROLL(14, 2, " APP-优惠-立即报名"),*/
        invokeNative({
            "code":window.jsBridge.CODE_LOG_ACTION_RESOURCE,
            "data":dataLog.ACTION_RESOURCE_ENROLL//14
        });
		GC.Hybrid.toLogin();
		return false;
	}
	GC.Hybrid.sessionId = value.sessionId;
	var userType = GC.Lib.GetQueryString("userType");

	if (userType === "e") {
		localStorage.accessToken=value.token;
		localStorage.sessionId=value.sessionId;
	}
	window[name]();
}

/**
 * [getUserInfoReturn 获取用户信息，手机号]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function getUserInfoReturn(val) {
	var value = window.atob(val);
	value = JSON.parse(value);
	if (value.phone) {
		GC.Hybrid.phone = value.phone;
		$(".js-phone").val(value.phone);
	}
}



/**
 * [paySuccReturn 活动付款成功之后回调]
 * @return {[type]} [description]
 */
function paySuccReturn() {
	window.location.href = window.Host.local + "activity/activityResult.html";
}

