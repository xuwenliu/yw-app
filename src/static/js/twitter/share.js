/**
 * Created by jiaminghe on 2017/4/12.
 */
(function (win, $, undefined) {
    var twitterId = GC.Lib.GetQueryString("twitterId");
    var teamName = decodeURI( GC.Lib.GetQueryString("teamName"));
    // var twitterId = 7;
 	var teamId = GC.Lib.GetQueryString("teamId");
    var twitterName =decodeURI( GC.Lib.GetQueryString("twitterName"));
    
    var realName;
    var isNewCustomer;
    var isReSend = false;
    var userPhone;
    var isPass = true;

    /*推客团队分享到朋友圈和分享给微信好友*/
    var share = function(t) {
    	//t===1 就是加入推客分享
    	var api = window.Host.customer + "/case/app/ticket";
    	var requestUrl = window.location.href.split("#")[0];
    	if(t===1){
    		var shareInfo = {
	    		title:"加入鹦鹉美家，安全轻松赚钱，快来加入吧！",
	    		link:location.href,
	    		imgUrl:"http://o7zlnyltf.bkt.clouddn.com/html_share_pic.png?imageView2/1/w/100",
	    		desc:"不影响本职工作，收入轻松破万!",
	    	}
    	}else {
    		var shareInfo = {
	    		title:"加入"+teamName,
	    		link:location.href,
	    		imgUrl:"http://o7zlnyltf.bkt.clouddn.com/html_share_pic.png?imageView2/1/w/100",
	    		desc:"一起赚钱吧！",
	    	}
    	}
    	
    	console.log(shareInfo)
    	$.ajax({
	        type: "GET",
	        url: api,
	        data: {"requestUrl":requestUrl},
	        dataType: "json",
	        success: function(data) {
	            var data = data.data;
	            wx.config({
	                debug: false,
	                appId: data.appId,
	                timestamp: data.timestamp,
	                nonceStr: data.randomStr,
	                signature: data.ticket,
	                jsApiList: [
	                    'onMenuShareTimeline',
	                    'onMenuShareAppMessage',
	                ]
	            });
				wx.error(function (res) {
	                console.log(res);
	            })
	            wx.ready(function () {
	                //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
	                wx.onMenuShareTimeline({
	                    title: shareInfo.title, // 分享标题
	                    link: shareInfo.link, // 分享链接
	                    imgUrl: shareInfo.imgUrl, // 分享图标
	                    success: function () {
	                        // 用户确认分享后执行的回调函数
	
	                    },
	                    cancel: function () {
	                        // 用户取消分享后执行的回调函数
	                    }
	                })
	                
	                //获取“分享给朋友”按钮点击状态及自定义分享内容接口
	                wx.onMenuShareAppMessage({
	                    title: shareInfo.title, // 分享标题
	                    desc: shareInfo.desc, // 分享描述
	                    link: shareInfo.link, // 分享链接
	                    imgUrl: shareInfo.imgUrl, // 分享图标
	                    type: 'link', // 分享类型,music、video或link，不填默认为link
	                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	                    success: function () {
	                        // 用户确认分享后执行的回调函数
	                    },
	                    cancel: function () {
	                        // 用户取消分享后执行的回调函数
	                    }
	                })
	               
	            })

       		}
    	})
    }

    var getTwitterStatisticsData = function () {
        $.ajax({
            type: "GET",
            url: window.Host.customer + "/twitter/statistics",
          	//data: {"twitterId": twitterId},
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
            	console.log(res)
                if (res.succ) {
                    initStatisticsInfo(res.data);
                }
                else {
                    // toastObj.data = res.message;
                    // invokeNative(toastObj)
                }
            },
            error: function (res) {
                // toastObj.data = "网络请求失败";
                // invokeNative(toastObj)
            }
        })
    };

    /**
     * [Rsa 加密]
     * @param {[type]} key [description]
     */
    function Rsa(key) {
        var encrypt = new JSEncrypt(),
            publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBG3UFPAxh+a0NLv6Plvjo5YPDdnlbED8dI4GP21DdFKvXVFcPb0lSRrht5Xrg7ck4PJ/fovfSi7k8MYqPY52g9tnPzkAthVOs99Tw6DVe22vV2hcs7dXvtk+TxKy4IqMjZA77hiH8wMYcJur+o4R770mrVP4fP88x53EQ4PaayQIDAQAB";
        encrypt.setPublicKey(publicKey);
        return encrypt.encrypt(key);
    }

    window.alert = function (name) {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        window.frames[0].window.alert(name);
        iframe.parentNode.removeChild(iframe);
    }

    /**
     * 初始化推客统计信息
     * @param data
     */
    function initStatisticsInfo(data) {
        $(".share-desc-top span").text(data.twitterCount);

        var commissionTotal = data.commissionTotal.toString();

        for (var i = 0; i < 6; i++) {
            $(".share-desc-money li").eq(5 - i).text(commissionTotal[commissionTotal.length - 1 - i] || 0);
        }
    }


    /**
     * 发送短信验证码
     * @param phone
     */
    function sendSmsCode(phone, newCustomer) {

        if (!isPass) {
            return false
        }
        isPass = false;

        isNewCustomer = newCustomer;
        var postData = {
            "phone": phone,
            "source": newCustomer ? 1 : teamId?12:10
        };

        $.ajax({
            type: "POST",
            url: window.Host.customer + "/user/sendSmsCode",
            data: postData,
            dataType: "json",
            success: function (res) {
                isPass = true;
                if (res.succ) {
                    if (isReSend) {
                        //   alert("发送成功");
                    } else {
                        showRegisterDialog(true, isNewCustomer, phone);
                    }
                } else {
                    console.log(res.message);
                }
            },
            error: function (res) {
                isPass = true;
            }
        })
    };

    /**
     * 查询是否是新用户
     */
    function checkIsNewCustomer(phone) {
        $.ajax({
            type: "GET",
            url: window.Host.customer + "/twitter/invitation",
            data: {"userPhone": phone},
            dataType: "json",
            success: function (res) {
            	console.log(res)
                if (res.succ) {
                    if (res.data) {
                    	$(".share-dialog-title").text("马上加入");
                        //老用户
                        isNewCustomer = false;
                        userPhone = phone;
                        console.log("老用户");
                        showRegisterDialog(true,isNewCustomer,userPhone);
                      //sendSmsCode(phone, false);
                    } else {
                        //新用户
                        isNewCustomer = true;
                        userPhone = phone;
                        console.log("新用户");
                        showRegisterDialog(true,isNewCustomer,userPhone);
                      //sendSmsCode(phone, true);
                    }
                }
                else {

                }
            },
            error: function (res) {

            }

        })
    };

    /**
     * 显示弹窗
     * @param show
     */
    function showRegisterDialog(show, isNewCustomer, phone) {
      //countDownTimer(60, $(".share-dialog-input-code span[data-disabled='1']"));
        userPhone = phone;
        $(".share-dialog-hint").css({"opacity": 0,"margin-top": 0})	
        
        if (show) {
            $(".dialog-base").show();
            $(".share-dialog-hint span").text(phone);
            if (isNewCustomer) {
                $(".dialog-checkbox").show();
                $(".share-dialog-content").eq(0).show();
            } else {
                $(".dialog-checkbox").hide();
                $(".share-dialog-content").eq(0).hide();
            }
        }else {
            window.location.reload();
            $(".dialog-base").hide();
            $(".share-dialog-hint span").text("")
        }
    }
    /*v1.10.0数据埋点请求*/
    function postDataLog(data){
        console.log(data);

        var api = window.Host.customer+"/datalog/log";
        console.log(api);
        // https://devcustomer.yingwumeijia.com:443/{version}/datalog/log
        $.ajax({
            type: "POST",
            url: api,
            data:JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(res) {
                console.log(res);
                if(res.succ) {
                    console.log("数据埋点成功！");  
                    showRegisterDialog(false, isNewCustomer);
                    window.location.href = window.Host.local + "twitter/twitter-download.shtml";
                }
            }
        });
    }
    /*v1.10.0获取设备信息*/
    function getEquipmentInfo(){
        var equipmentSystem,equipmentSystemVersion,equipmentVersion;
        var uA = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"); 
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1); 
        var isPC = !/Android|webOS|iPhone|SymbianOS|Windows Phone|iPad|iPod|BlackBerry/i.test(uA);
        var isWin7 = uA.indexOf("Windows NT 6.1") > -1 || uA.indexOf("Windows 7") > -1;
        var isWin8 = uA.indexOf("Windows NT 6.2") > -1 || uA.indexOf("Windows 8") > -1;
        var isWin10 = uA.indexOf("Windows NT 10.0") > -1 || uA.indexOf("Windows 10") > -1;

        if(isPC) {
            if(isWin){
                equipmentSystem="Windows";
                if(isWin7) {
                    equipmentSystemVersion="Win7";
                }
                if(isWin8) {
                    equipmentSystemVersion="Win8";
                }
                if(isWin10) {
                    equipmentSystemVersion="Win10";
                }
            }else if(isMac){
                equipmentSystem="Mac";
                equipmentSystemVersion=uA.split("Intel Mac OS X")[1].split(")")[0].replace(/_/g,".");
            }else if(isUnix){
                equipmentSystem="Unix";
                equipmentSystemVersion="";
            }else if(isLinux){
                equipmentSystem="Linux";
                equipmentSystemVersion="";
            }else {
                equipmentSystem="other";
                equipmentSystemVersion="";
            }
            equipmentVersion="";
        }else if(/Android/i.test(uA)){
            equipmentVersion = uA.split(";")[2].split("Build/")[0];
            equipmentSystem = "Android"; 
            equipmentSystemVersion = uA.split(";")[1].split("Android")[1];
            
        }else  if(/iPhone/i.test(uA)){
            equipmentVersion="iPhone";
            equipmentSystem="IOS";
            var str= uA.toLowerCase(); 
            var ver=str.match(/cpu iphone os (.*?) like mac os/)[1].replace(/_/g,".");
            equipmentSystemVersion=ver;
        }else {
            equipmentVersion="other";
            equipmentSystem="other";
            equipmentSystemVersion="";
        }

        return {
            "equipmentId":"",
            "equipmentVersion":equipmentVersion,
            "equipmentSystem":equipmentSystem,
            "equipmentSystemVersion":equipmentSystemVersion,
        }
    }
    /**
     * 注册用户
     * @param postData
     */
    function registerCustomer(postData) {
    	/*推客团队注册用户*/
    	if(teamId){
    		console.log(postData)
    		var data = {
			  	"userName": postData.name,
			  	"userPhone": postData.userPhone,
			  	"smsCode": postData.smsCode,
			  	"password": postData.password,
			  	"register": postData.register
			}
    		console.log(data);
    		$.ajax({
	            type: "POST",
	            url: window.Host.customer + "/twitter/team/" + teamId + "/invitation",
	            data: JSON.stringify(data),
	            dataType: "json",
	            contentType: "application/json;charset=UTF-8",
	            success: function (res) {
	            	/*成功后干的事情*/
	            	if(res.succ){
	            		showRegisterDialog(false, isNewCustomer);
                    	window.location.href = window.Host.local + "twitter/twitter-download.shtml";
	            	}else {
	                    $(".dialog-input-error").text(res.message);
	                }
	            	
	            },
	            error: function (res) {
	                $(".dialog-input-error").text("网络请求失败");
	            }
            });
    	}else {
    		/*推客注册*/
    		 //console.log(isNewCustomer);
	        $.ajax({
	            type: "POST",
	            url: window.Host.customer + "/twitter/" + twitterId + "/invitation",
	            data: JSON.stringify(postData),
	            dataType: "json",
	            contentType: "application/json;charset=UTF-8",
	            success: function (res) {
	                console.log(res)
	                if (res.succ) {
	                    $(".dialog-input-error").text("");
	                    if (isNewCustomer) {
	                        /*v1.10.0 数据埋点 ACTION_RESOURCE_DEVELOP_TWITTER(19, 2, " H5-发展推客"),*/
	                        var data = getEquipmentInfo();
	                        data.action=3;//注册
	                        data.actionResource=19;
	                        data.actionResult=res.stateCode;
	                        postDataLog(data);
	                    } else {
	                        window.location.href = window.Host.local + "twitter/twitter-download.shtml";
	                    }
	                } else {
	                    $(".dialog-input-error").text(res.message);
	                }
	            },
	            error: function (res) {
	                $(".dialog-input-error").text("网络请求失败");
	            }
	        })
    	}
       
    }

    /*倒计时*/
    function countDownTimer(s, o) {
        var s = s || 60;
        o.text(s + "s后重试").attr('data-disabled', "0").css({opacity: 0.5});
        var timerFun = function () {
            s--;
            if (s < 1) {
                o.text("重新获取").attr('data-disabled', "1").css({opacity: 1});
                clearInterval(clearTime);
            } else {
                o.text(s + "s后重试").attr('data-disabled', "0").css({opacity: 0.5});
            }
        };
        var clearTime = window.setInterval(timerFun, 1000)
    }

    $(function () {
        $("title").text("加入推客");
        getTwitterStatisticsData();
        share(1);
        /*推客团队*/
		if(teamId){
			$("title").text("加入团队");
			share();
			$(".share-bg").css({
				'backgroundImage':'url("../../static/img/twitter/share_addTeam.png")',
			})
			$(".share-addTeam").text("加入"+teamName).show();
		}
		
        

        $(".title").find("span").on("click", function () {
            window.history.go(-1);
        });

        /*如何赚钱-奖金规则*/
        $(".share-money").on("click",function () {
        	if(teamId){
        		window.location.href = window.Host.local + "twitter/promote-rule.shtml?teamId="+teamId;
        	}else {
        		window.location.href = window.Host.local + "twitter/promote-rule.shtml";
        	}
            
        });
		/*接受邀请*/
        $(".share-center").find("button").on("click", function () {
            var name = $(".share-center").find("input").eq(0).val();
            console.log(name);
            if (!((GC.Lib.validRule.realname).test(name))) {
                alert("请输入真实姓名");
                return false;
            }

            realName = name;

            var phone = $(".share-center").find("input").eq(1).val();
            if (!((GC.Lib.validRule.phone).test(phone))) {
                alert("请输入正确的电话号码");
                return false;
            }
            /*是否是新用户*/
            checkIsNewCustomer(phone);
        });


        /*发送验证码*/
        $(".wrap").on("click", ".share-dialog-input-code span[data-disabled='1']", function () {
        	$(".share-dialog-hint").css({"opacity": 1,"margin-top": "0.69333rem"})	
            var phoneNumber = userPhone;
            var t = $(this);
            isReSend = true;
            countDownTimer(60, t);
            sendSmsCode(phoneNumber, isNewCustomer);
            //console.log("发送验证码是否为新用户---"+isNewCustomer);
        });


        // 事件：点击复选
        $(".dialog-checkbox-box").on("click", function () {
            var oSpan = $(this);
            if (!oSpan.hasClass("active")) {
                oSpan.addClass("active");
            }
            else {
                oSpan.removeClass("active");
            }
        });

        $(".dialog-checkbox").find("em").on("click", function () {
            // window.location.href = window.Host.local + "twitter/twitter-user-agreement.shtml";

            $(".share-dialog-useragreement").show();
            // window.open( window.Host.local + "twitter/twitter-user-agreement.shtml","_blank");
        });

        $(".title span").on("click", function () {
            $(".share-dialog-useragreement").hide();
        });

        $(".dialog-close").on("click", function () {
            showRegisterDialog(false, isNewCustomer, userPhone)
        });

        /**
         * 提交注册信息
         */
        $(".dialog-submit").on("click", function () {

			console.log(isNewCustomer)
            if ($(".dialog-checkbox").find(".active").length <= 0 && isNewCustomer) {
                $(".dialog-input-error").text("请先同意《用户协议》");
            } else {

                var code = $(".share-dialog-input-code input").val();

                if (!((GC.Lib.validRule.phonecode).test(code))) {
                    $(".dialog-input-error").text("验证码格式错误");
                    return false;
                }
                $(".dialog-input-error").text("");

                postData = {
                    "invitationType": 1,
                    "name": realName,
                    "userPhone": userPhone,
                    "smsCode": code,
                    "password": null,
                    "register": isNewCustomer
                };

				console.log(isNewCustomer)
                var password = $(".share-dialog-content input").eq(0).val();
                if (isNewCustomer) {
                    if (password.length < 8 || password.length > 20 || !((GC.Lib.validRule.comcode).test(code))) {
                        //   alert("请输入正确格式的密码");
                        $(".dialog-input-error").text("请输入正确格式的密码");
                        return false;
                    }
                    postData.password = Rsa(password);
                }

                $(".dialog-input-error").text("");


                registerCustomer(postData);
            }
        });


    });

})(window, Zepto);