$(function() {
    // 获取url参数
    var id = GetQueryString("caseId");    // 案例id
    var appe = GetQueryString("appe");      // 是否为E端
    var twitterId = GetQueryString("uid");    // 用户id
    var twitterType = GetQueryString("type");    // 用户类型
    var isTwitter = GetQueryString("twitter");  // 是否为twitter
    var indexId = window.location.hash;
    var mySwiper=null;

    var options = {
        'id': id,
        'appe': appe,
        'twitterId': twitterId,
        'twitterType': twitterType,
        'isTwitter': isTwitter
    };

    if (typeof appe === "string" && appe !== "null") {
        $(".appe").hide();
    }
    // 显示对应的tab
    if (indexId === "#index=1") {
        $(".index-nav").find("a").eq(1).addClass("active").siblings("a").removeClass("active");
        $(".index-tab").eq(1).addClass("show").siblings(".index-tab").removeClass("show"); 
    }

    if (indexId === "#index=2") {
        $(".content").addClass("data-active");
        $(".index-nav").find("a").eq(2).addClass("active").siblings("a").removeClass("active");
        $(".index-tab").eq(2).addClass("show").siblings(".index-tab").removeClass("show");
    }
	
    // 加载现场实景
   (function() {
        var url = window.Host.customer+"/case/app/detail/scene/"+id;
        options.url = url;
        // 请求数据
        loadXCSJ(options);
   })();
	
	
   // 加载原创团队
   (function() {
        var url = window.Host.customer+"/case/app/detail/team/"+id;
        options.url = url;
        // 请求数据
        loadYCTD(options);
        

   })();

	
   // 加载详细资料
   (function() {
        var url = window.Host.customer+"/case/app/materials/"+id;
        options.url = url;
        // 请求数据
        loadXXZL(options);

   })();
	
    // 头部标签切换
/*   (function() {
   		//v1.9.0将下面注释的地方换到loadYCTD();下面请求成功后执行以下操作，是为了解决tab切换后轮播图不自动播放需要手动滑一下才能自动播放问题。
        $(".index-nav a").on("click", function() {
            var index = $(this).index();
            if(index===1){
            	mySwiper = new Swiper ('.swiper-container', {
				    loop: true,
				    autoplay:5000,
				    autoplayDisableOnInteraction : false,
				    observer:true,//修改swiper自己或子元素时，自动初始化swiper
    				observeParents:true,//修改swiper的父元素时，自动初始化swiper
				})  
            }
            if (index === 2) {
                $(".content").addClass("data-active");
            }
            else {
                $(".content").removeClass("data-active");
            }

            $(this).addClass("active").siblings("a").removeClass("active");
            $(".index-tab").eq(index).addClass("show").siblings(".index-tab").removeClass("show");

            // 描述是否隐藏
            isShowBtn($(".index-basicInfo-story"),$(".story-btn"));
            isShowBtn($(".plainLayout-desc"),$(".plainLayout-btn"));
            isShowBtn($(".softDecor-desc"),$(".softDecor-btn"));
        });
   })();
*/
    // 视频播放
    (function() {

        $(".personal-video").on("tap", function() {
            // 统计个人视频点击事件次数
            statistics("设计视频");
            $(".personal-mask").addClass("show");
            var video = document.querySelector("#personal-video");
            video.play();

        });

        $(".personal-mask").on("tap", function(ev) {
            ev.stopPropagation();
            $(this).removeClass("show");
        });

        $("#personal-video").on("tap", function(ev) {
            ev.stopPropagation();
        });

    })();

    // PV更新
    (function() {
        var storage = window.localStorage;
        var arr_caseId = storage.getItem("arr_caseId");
        arr_caseId = JSON.parse(arr_caseId);
        var caseId = parseInt(id);
        if (arr_caseId) {
            if (arr_caseId.indexOf(caseId) === -1) {
                var url = window.Host.customer+"/case/app/visit/"+caseId;
                $.ajax({
                    type: "post",
                    url: url,
                    dataType: "json",
                    success: function(res) {
                        arr_caseId.push(caseId);
                        arr_caseId = JSON.stringify(arr_caseId);
                        storage.setItem("arr_caseId",arr_caseId);
                    }
                });
            }
        }
        else {
            arr_caseId = [];
            arr_caseId.push(caseId);
            arr_caseId = JSON.stringify(arr_caseId);
            storage.setItem("arr_caseId",arr_caseId);
        }
    })();

});

/**
 * [loadXCSJ 现场实景]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function loadXCSJ(options) {
    var options = options;

    $.ajax({
        type: "GET",
        url: options.url,
        //url:'/api/case/xcsj.json',
        dataType: "json",
        success: function(res) {
        	console.log(res);
            var data = res.data;

            // 720背景图
            data.caseCover = data.caseCover + window.Host.imgSize_750_750;
            $(".index-720").css("background-image","url("+data.caseCover+")");
            $(".data-total-bg").css("background-image","url("+data.caseCover+")");


            // 720路径
            if (typeof data.pathOf720 === "string") {
                $(".index-720-btn").addClass("show");
                $("#index-720").on("click", function() {
                    // 统计公司720点击事件次数
                    statistics("案例720");

                    data.pathOf720 = data.pathOf720 + "&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;

                    var weixin = navigator.userAgent.search("Language"),
                        wifi = navigator.userAgent.search("WIFI");
                    if (weixin > 0) {
                        if (wifi > 0) {
                            window.location.href = data.pathOf720;
                        }
                        else {
                            $(".wifi-mask").show();
                            $(".wifi-Lbtn").on("click", function(ev) {
                                ev.stopPropagation();
                                window.location.href = data.pathOf720;
                            });
                            $(".wifi-Rbtn").on("click", function(ev) {
                                ev.stopPropagation();
                                $(".wifi-mask").hide();
                            });
                        }
                    }
                    else {
                        window.location.href = data.pathOf720;
                    }
                });
            }

            // 作品名称
            $(".index-basicInfo-title").text(data.caseName);
            // 作品标签
            if (typeof data.totalCost === "number" && data.totalCost !== 0) {
                data.totalCost = (data.totalCost/10000).toFixed(2);
                $(".index-basicInfo-info").text(data.cityName + " / " + data.decorateStyle + " / " + data.houseType + " / " + data.houseArea + "㎡" + " / " + data.decorateType + data.totalCost + "万" + " / " + data.buildingName);
            }
            else {
                $(".index-basicInfo-info").text(data.cityName + " / " + data.decorateStyle + " / " + data.houseType + " / " + data.houseArea + "㎡" + " / " + data.decorateType + " / " + data.buildingName);
            }
            // 作品故事
            var oSummary = $(".index-basicInfo-story");
            var oBtn = $(".story-btn");

            data.caseStory = data.caseStory.replace(/\n/g,'<br />');

            oSummary.find("p").html(data.caseStory);

            // 是否显示按钮
            if (oSummary.find("p").height() > oSummary.height()) {
                oBtn.show();
            }

            // 显示全部内容
            oBtn.on("click", function() {
                var _this = $(this);
                if (oSummary.hasClass("basicInfo-story-active")) {
                    oSummary.removeClass("basicInfo-story-active");
                    _this.removeClass("story-btn-active");
                }
                else {
                    oSummary.addClass("basicInfo-story-active");
                    _this.addClass("story-btn-active");
                }
            });

            // 实景照片
            if (data.scenes instanceof Array === true && data.scenes.length > 0) {

                // 实景图片存入本地
                var storage = window.localStorage;
                var arrImg = JSON.stringify(data.scenes);
                storage.setItem("realScene",arrImg);

                $.each(data.scenes, function(i, item) {
                    var index = i+1;
                    var url = window.Host.local+"case/scan.html?lastPage=realScene&index="+index+"&caseId="+options.id+"&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
                    var oDiv = $('<div class="realScene-item"></div>');
                    var str = '<a class="realScene-pic" href="'+url+'">';
                    str += '<img src="'+item.pics[0]+window.Host.imgSize_750+window.Host.watermark+'">';
                    str += '<div class="realScene-bg"></div>';
                    str += '</a>';
                    str += '<div class="realScene-title">'+item.title+'</div>';
                    if (typeof item.explain === "string") {
                        str += '<div class="realScene-describe">'+(item.explain||"")+'</div>';
                    }

                    oDiv.html(str);
                    oDiv.appendTo($(".realScene-list"));
                });
            }

            // 视频(1个)
            if (!!data.designVideo) {
                $(".js-video-title").text("讲解视频");
                var video_cover = data.designVideo.url+"?vframe/jpg/offset/"+data.designVideo.second+"/w/240/h/160";
                $(".personal-video").css("background-image", "url("+video_cover+")");
                $("#personal-video").attr("src", data.designVideo.url);
                var oDiv = $('<div></div>');
                var oSpan = $('<span></span>');
                oDiv.appendTo($(".personal-video"));
                oSpan.appendTo($(".personal-video"));
            }
            else {
                $(".js-personal-video").hide();
            }

            // 设计费(软装/硬装)、作品已浏览、作品已收藏
            if(data.designPriceRangeDtos){
                $.each(data.designPriceRangeDtos, function(i, index) {
                    $(".add180").find(".add180-line").show();
                    var name = "";
                   	index.type==1?name = '设计费 (硬装)':name='设计费 (软装)';
                    var oLi='<li class="F3 C1 b stuffDesignFee">'+name+'<span class="C6 fr">￥'+index.priceStart+"-"+index.priceEnd+'元<i class="C1">/㎡</i></span></li>';
                    $(".add180").find("ul").append(oLi);
                })
            }
            if (data.viewCount || data.collectionCount) {
                $(".add180").find(".browse").text(data.viewCount+"次");
                $(".add180").find(".collect").text(data.collectionCount+"次");
            }
			
			//v1.9.0现场实景加入美家保
			var xcsj_meijiabao=data.supportedSupervisor;
            if(xcsj_meijiabao){
                $(".xianchangshijing-meijiabao").show();
            }else {
                $(".xianchangshijing-meijiabao").hide();
            }


            // 相似作品
            if (data.relativeCases) {
                $.each(data.relativeCases, function(i, index) {
                    var oDiv = $('<div class="index-similar-item" data-case-id='+ index.caseId +'></div>');

                    var str = '<div class="index-similar-cover" style="background-image:url('+index.caseCover+window.Host.imgSize_330_330+')">';
                    str += '<div class="index-similar-bg"></div>';
                    str += '<div class="index-similar-name">'+index.caseName+'</div>';
                    str += '</div>';

                    if (i === 0) {
                        oDiv.addClass("fl");
                    }
                    else {
                        oDiv.addClass("fr");
                    }
                    oDiv.html(str);
                    oDiv.appendTo($(".index-similar-frame"));

                    oDiv.on("click", function() {
                        wxTips(options);
                    });
                });
            }
            else {
                $(".appe").hide();
            }

            // 微信内下载提示
            //wxTips(options);
        }
    });
}


function getQueryVal(s){
    var s=s||'';
    var arr=(s.split("?")[1]||s||'').split("&");
    var o={};
    if(arr[0]==''){return o}
    arr.forEach(function(x){
        var ar=x.split("=");
        o[ar[0]]=ar[1]
    });
    return o
}
/**
 * [loadYCTD 原创团队-获取开工/竣工轮播图的图片宽高]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function getImgWH(imgUrl){
    var setImgW,setImgH;//需要图片设置的宽高。
    var getUrlW = getQueryVal(imgUrl).width*1;//图片链接里面的width即图片实际宽。
    var getUrlH = getQueryVal(imgUrl).height*1;//图片链接里面的height即图片实际高。

    // if(getUrlW>=getUrlH&&getUrlW>=750){
    //     setImgW="100%";
    //     setImgH="auto";
    // }
    // if(getUrlW<getUrlH&&getUrlH>=562){
    //     setImgW="auto";
    //     setImgH="100%";
    // }
    // if((getUrlW>=getUrlH&&getUrlW<750) || (getUrlW<getUrlH&&getUrlH<562)){
    //     setImgW="100%";
    //     setImgH= getUrlH/75+"rem";
    // }
    if(getUrlW<750&&getUrlH<562&&getUrlW>=getUrlH){
        setImgW="100%";
        setImgH="auto";
    }else if(getUrlW<750&&getUrlH<562&&getUrlW<getUrlH){
        setImgW="auto";
        setImgH="100%";
    }else {
        setImgW="auto";
        setImgH="auto";
    }
    return {setImgW:setImgW,setImgH:setImgH};
}
/**
 * [loadYCTD 原创团队]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function loadYCTD(options) {
    var options = options;
    $.ajax({
        type: "GET",
        url: options.url,
        //url:'/api/case/yctd.json',
        dataType: "json",
        success: function(res) {
        	console.log(res)
            var data = res.data;
			if(data.surroundingMaterials){
            	// 开工
            	if (data.surroundingMaterials.startCeremony) {
	            	var startParent = $(".js-start-ceremony");
	                var startDate =$(".start-time");
                    var imgUrl = data.surroundingMaterials.startCeremony.pics[0];
                    var w=getImgWH(imgUrl).setImgW;
                    var h=getImgWH(imgUrl).setImgH;
                   
	                var startImg = $('<img src="'+data.surroundingMaterials.startCeremony.pics[0]+'" style="width:'+w+';height:'+h+'"/>');
                    // var startImg = $('<img src="'+data.surroundingMaterials.startCeremony.pics[0]+'"/>');
	                if(data.surroundingMaterials.startDate){
	                    startDate.text(GC.Lib.setDate(data.surroundingMaterials.startDate));
	                }else {
	                    startDate.text("");
	                }
	                startImg.appendTo(startParent);
	                startParent.show();
            	}else {
            		$(".swiper-slide-1").hide();
            	}
            	// 竣工
            	if (data.surroundingMaterials.endCeremony) {
	                var endParent = $(".js-end-ceremony");
	                var endDate =$(".end-time");
                    var imgUrl = data.surroundingMaterials.endCeremony.pics[0];
                    var w=getImgWH(imgUrl).setImgW;
                    var h=getImgWH(imgUrl).setImgH;
	                var endImg = $('<img src="'+data.surroundingMaterials.endCeremony.pics[0]+'" style="width:'+w+';height:'+h+'"/>');
                    // var endImg = $('<img src="'+data.surroundingMaterials.endCeremony.pics[0]+'"/>');
	                if(data.surroundingMaterials.endDate){
	                    endDate.text(GC.Lib.setDate(data.surroundingMaterials.endDate));
	                }else {
	                    endDate.text("");
	                }
	                endImg.appendTo(endParent);
	                endParent.show();
            	}else {
            		$(".swiper-slide-2").hide();
            	}
            }else {
                $(".swiper-slide-1").hide();
                $(".swiper-slide-2").hide();
            }
			//v1.9.0开工、竣工需要轮播
			$(".index-nav a").on("click", function() {
	            var index = $(this).index();
	            if(index===1 && data.surroundingMaterials){
	            	if(data.surroundingMaterials.startCeremony && data.surroundingMaterials.endCeremony){
			          	mySwiper = new Swiper ('.swiper-container', {
						    loop: true,
						    autoplay:5000,
						    autoplayDisableOnInteraction : false,
						    observer:true,//修改swiper自己或子元素时，自动初始化swiper
		  					observeParents:true,//修改swiper的父元素时，自动初始化swiper
						})  
            		}
	            }
	            if (index === 2) {
	                $(".content").addClass("data-active");
	            }
	            else {
	                $(".content").removeClass("data-active");
	            }
	
	            $(this).addClass("active").siblings("a").removeClass("active");
	            $(".index-tab").eq(index).addClass("show").siblings(".index-tab").removeClass("show");
	
	            // 描述是否隐藏
	            isShowBtn($(".index-basicInfo-story"),$(".story-btn"));
	            isShowBtn($(".plainLayout-desc"),$(".plainLayout-btn"));
	            isShowBtn($(".softDecor-desc"),$(".softDecor-btn"));
        	});

            

			//团队成员
            var oUl = $('.team-list');
            $.each(data.employees, function(i, index) {
                var oLi = $('<li></li>');
                var url = window.Host.local+"case/personal.html?userId="+index.userId+"&caseId="+options.id+"&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
                var str = '<a href="'+url+'">';
                str += '<div class="team-portrait fl" style="background-image: url('+index.headImage+window.Host.imgSize_80_80+');">';
                // str += '<img src="'+index.headImage+window.Host.imgSize_80_80+'">';
                str += '</div>';
                str += '<div class="team-member fl">';
                str += '<h4>'+index.name+'</h4>';
                str += '<p>'+index.employeeDetailType+'</p>';
                str += '</div>';
                str += '<span class="team-arrow"></span>';
                str += '</a>';

                oLi.html(str).appendTo(oUl);
            });

            var company = $('<li></li>');
            if (data.company.decorateTypes) {
                var decorateTypes = data.company.decorateTypes.join("<span>|</span>");
            }
            else {
                var decorateTypes = "";
            }
            var url = window.Host.local+"case/company.html?companyId="+data.company.companyId+"&caseId="+options.id+"&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
            var str = '<a href="'+url+'">';
            str += '<div class="team-portrait fl" style="background-image: url('+data.company.companyHeadImage+window.Host.imgSize_80_80+');">';
            //str += '<img src="'+index.company.companyHeadImage+window.Host.imgSize_80_80+'">';
            str += '</div>';
            str += '<div class="team-member fl">';
            str += '<h4>'+data.company.companyName+'</h4>';
            str += '<p>'+decorateTypes+'</p>';
            str += '</div>';
            str += '<span class="team-arrow"></span>';
            str += '</a>';
            company.html(str).appendTo(oUl);

			//加入美家保
            var meijiabao=data.company.supportedSupervisor;
            if(meijiabao){
                $(".meijiabao").show();
            }else {
                $(".meijiabao").hide();
            }
 
        }
    });
}

/**
 * [loadXXZL 请求详细资料数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @return {[type]}     [description]
 */
function loadXXZL(options) {
    var options = options;

    $.ajax({
        type: "GET",
        url: options.url,
        //url:'/api/case/data1.json',
        dataType: "json",
        success: function(res) {
            console.log(res)
            var data = res.data;

            // 总造价
            if ( typeof data.totalPrice === "number") {
                data.totalPrice = (data.totalPrice/10000).toFixed(2);
                $(".data-total-value").find("span").text(data.totalPrice);
            }
            else {
                $(".data-total").hide();
            }
            
            
            //施工面积
            $(".data-total-value").find(".house-area").text(data.houseArea);

            /* 设计土建基装 */
            if (data.costs instanceof Array && data.costs.length > 0) {
                $.each(data.costs, function(i, item) {
                    item.cost = (item.cost/10000).toFixed(2);
                    var oLi = $('<li class="data-materialItem"></li>');
                    var str = '<div class="data-materialItem-show">';
                    str += '<span class="data-materialItem-name">'+item.name+'</span>';
                    str += '<span class="data-materialItem-cost">'+item.cost+'万</span>';

                    oLi.html(str).appendTo($(".data-materialList"));
                });
            }

            /* 主要物料设备 */
            if (data.costBrands instanceof Array && data.costBrands.length > 0) {
                $.each(data.costBrands, function(i, item) {
                    if (item.costInfo.id == 7) {
                        item.costInfo.name = "家具陈列";
                    }
                    else if (item.costInfo.id == 8) {
                        item.costInfo.name = "家用电器";
                    }
                    item.costInfo.cost = (item.costInfo.cost/10000).toFixed(2);
                    var oLi = $('<li class="data-materialItem"></li>');
                    var str = '<div class="data-materialItem-show">';
                    str += '<span class="data-materialItem-name">'+item.costInfo.name+'</span>';
                    str += '<span class="data-materialItem-cost">'+item.costInfo.cost+'万</span>';
                    str += '<span class="data-materialItem-arrow"></span>';
                    str += '<div class="data-materialItem-brief clearfix">';
                    str += '</div>';
                    str += '</div>';
                    str += '<div class="data-materialItem-hide">';
                    str += '<ul class="data-materialItem-brandList clearfix">';
                    str += '</ul>';
                    str += '</div>';

                    oLi.html(str);
                    var oList1 = oLi.find(".data-materialItem-brief");
                    var oList2 = oLi.find(".data-materialItem-brandList");
                    var brandList = [];

                    if (item.brands instanceof Array && item.brands.length > 0) {
                        // 所有品牌
                        $.each(item.brands, function(i, elem) {
                            if (i < 3) {
                                brandList.push(elem)
                            }
                            var oLi = $('<li class="data-materialItem-brandItem"><div class="data-materialItem-brandImg" style="background-image:url('+elem.logo+')"></div><div class="data-materialItem-brandName"><p>'+elem.brandClasses[0].subTypeName+'</p></div></li>');
                            oLi.appendTo(oList2);
                        });
                        // 三个品牌
                        $.each(brandList, function(i, elem) {
                            var oDiv = $('<div class="data-materialItem-briefItem fl"><div style="background-image:url('+elem.logo+')"></div><p>'+elem.brandClasses[0].subTypeName+'</p></div>');
                            oDiv.appendTo(oList1);
                        });
                    }
                    else {
                        oLi.find(".data-materialItem-arrow").hide();
                    }

                    var oArrow = oLi.find(".data-materialItem-arrow");
                    var oHide = oLi.find(".data-materialItem-hide");
                    oArrow.on("click", function() {
                        if ($(this).hasClass("data-materialItem-active")) {
                            $(this).removeClass("data-materialItem-active");
                            oList1.show();
                            oHide.hide();
                        }
                        else {
                            $(this).addClass("data-materialItem-active");
                            oList1.hide();
                            oHide.show();
                        }
                    });

                    oLi.appendTo($(".data-materialList"));

                });
            }
            else {
                $(".data-cost-title").eq(1).hide();
                //$(".data-materialList").hide();
            }

            /* 软装陈列 */
            if (data.designMaterials.displayImages instanceof Array === true && data.designMaterials.displayImages.length > 0) {
                var displayImages = data.designMaterials.displayImages;

                // 描述
                (function() {
                    if (typeof data.designMaterials.displayIllustration === "string") {
                        var oSummary = $(".softDecor-desc");
                        var oBtn = $(".softDecor-btn");

                        var displayIllustration = data.designMaterials.displayIllustration.replace(/\n/g,'<br />');

                        oSummary.find("p").html(displayIllustration);

                        // 是否显示按钮
                        if (oSummary.find("p").height() > oSummary.height()) {
                            oBtn.show();
                        }
                        else {
                            var height = oSummary.find("p").height();
                            oSummary.height(height);
                        }

                        // 显示全部内容
                        oBtn.on("click", function() {
                            var _this = $(this);
                            if (oSummary.hasClass("softDecor-desc-active")) {
                                oSummary.removeClass("softDecor-desc-active");
                                _this.removeClass("softDecor-btn-active");
                            }
                            else {
                                oSummary.addClass("softDecor-desc-active");
                                _this.addClass("softDecor-btn-active");
                            }
                        });
                    }
                    else {
                        $(".softDecor-desc").hide();
                    }
                })();

                var storage = window.localStorage;
                var arrImg = JSON.stringify(displayImages);
                storage.setItem("softDisplay",arrImg);

                $.each(displayImages, function(i, item) {
                    var index = i+1;
                    var url = window.Host.local+"case/scan.html?lastPage=softDisplay&index="+index+"&caseId="+options.id+"&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
                    var oLi = $('<li class="softDecor-listItem"></li>');
                    var str = '';
                    str += '<a class="realScene-pic" href="'+url+'">';
                    str += '<img src="'+item.pics[0]+window.Host.imgSize_750+window.Host.watermark+'">';
                    str += '<div class="realScene-bg"></div>';
                    str += '</a>';
                    if (typeof item.explain === "string") {
                        str += '<div class="softDecor-listItem-desc">'+(item.explain||"")+'</div>';
                    }


                    oLi.html(str);
                    oLi.appendTo($(".softDecor-list"));
                });
            }
            else {
                $(".js-softDecor").hide();
            }

            /* 户型改造 */
            // 描述
            (function() {
                if (typeof data.designMaterials.totalRemakeIllustration === "string") {
                    var oSummary = $(".plainLayout-desc");
                    var oBtn = $(".plainLayout-btn");

                    var totalRemakeIllustration = data.designMaterials.totalRemakeIllustration.replace(/\n/g,'<br />');

                    oSummary.find("p").html(totalRemakeIllustration);

                    // 是否显示按钮
                    if (oSummary.find("p").height() > oSummary.height()) {
                        oBtn.show();
                    }
                    else {
                        var height = oSummary.find("p").height();
                        oSummary.height(height);
                    }

                    // 显示全部内容
                    oBtn.on("click", function() {
                        var _this = $(this);
                        if (oSummary.hasClass("plainLayout-desc-active")) {
                            oSummary.removeClass("plainLayout-desc-active");
                            _this.removeClass("plainLayout-btn-active");
                        }
                        else {
                            oSummary.addClass("plainLayout-desc-active");
                            _this.addClass("plainLayout-btn-active");
                        }
                    });
                }
                else {
                    $(".plainLayout-desc").hide();
                }
            })();

            if (data.designMaterials.houseImages instanceof Array === true && data.designMaterials.houseImages.length > 0) {
                // 户型改造图片存入本地
                var storage = window.localStorage;
                var plainLayout = JSON.stringify(data.designMaterials.houseImages);
                storage.setItem("plainLayout",plainLayout);

                // 图片顺序
                var index= 0;

                $.each(data.designMaterials.houseImages, function(i, item) {
                    index++;
                    var url = window.Host.local+"case/scan.html?lastPage=plainLayout&index="+index+"&caseId="+options.id+"&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
                    var oLi = $('<li class="plainLayout-item"></li>');
                    var str = '<div class="plainLayout-item-title">';
                    str += '<span>'+item.originHouseImage.title+'</span> 原始平面图';
                    str += '</div>';
                    str += '<a class="realScene-pic" href="'+url+'">';
                    str += '<img src="'+item.originHouseImage.pics[0]+window.Host.imgSize_750+window.Host.watermark+'">';
                    str += '<div class="realScene-bg"></div>';
                    str += '</a>';

                    index++;
                    url = window.Host.local+"case/scan.html?lastPage=plainLayout&index="+index+"&caseId="+options.id+"&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
                    str += '<div class="plainLayout-item-title">';
                    str += '<span>'+item.designHouseImage.title+'</span> 设计平面图';
                    str += '</div>';
                    str += '<a class="realScene-pic" href="'+url+'">';
                    str += '<img src="'+item.designHouseImage.pics[0]+window.Host.imgSize_750+window.Host.watermark+'">';
                    str += '<div class="realScene-bg"></div>';
                    str += '</a>';
                    if (typeof item.remakeIllustration === "string") {
                        str += '<div class="plainLayout-item-describe">'+item.remakeIllustration+'</div>';
                    }

                    oLi.html(str);
                    oLi.appendTo($(".plainLayout-list"));
                });
            }
            else {
                $(".js-plainLayout").hide();
            }

            /* 施工资料 */
            (function() {
                var oHard = $(".js-process-hard");
                var oSoft = $(".js-process-soft");

                // 硬装施工
                if (data.hardChecks instanceof Array === true && data.hardChecks.length > 0) {
                    var hardChecks = data.hardChecks;
                    var hardLength = hardChecks.length;

                    // 存入storage
                    var storage = window.localStorage;
                    var hardData = JSON.stringify(data.hardChecks);
                    storage.setItem("hardData",hardData);

                    // 内容
                    $.each(hardChecks, function(i, item) {
                        var index = i+1;

                        var videoLength = null;
                        var imageLength = null;
                        if (item.videos instanceof Array === true && item.videos.length > 0) {
                            videoLength = item.videos.length;
                        }
                        else {
                            videoLength = 0;
                        }
                        if (item.images instanceof Array === true && item.images.length > 0) {
                            imageLength = item.images.length;
                        }
                        else {
                            imageLength = 0;
                        }

                        var oDiv = $('<div class="process-listItem"></div>');
                        var url = window.Host.local+"case/notes.html?dataType=hard&orderNum="+i+"&caseId="+options.id+"&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
                        var str = '<a href="'+url+'">';
                        str += '<div class="process-listItem-logo" style="background-image:url(/static/img/step_'+index+'.png)"></div>';
                        str += '<div class="process-listItem-title">'+item.phaseName+'</div>';
                        str += '<div class="process-listItem-data clearfix">';
                        str += '<span class="process-listItem-video">视频 '+videoLength+'</span><span> · </span><span class="process-listItem-image">图片 '+imageLength+'</span>';
                        str += '</div>';
                        str += '<span class="process-listItem-arrow"></span>';
                        str += '</a>';

                        oDiv.html(str);
                        oDiv.appendTo(oHard.find(".process-list"));

                    });
                }
                else {
                    oHard.hide();
                }

                // 软装施工
                if (data.softChecks instanceof Array === true && data.softChecks.length > 0) {
                    var softChecks = data.softChecks;
                    var softLength = softChecks.length;

                    // 存入storage
                    var storage = window.localStorage;
                    var softData = JSON.stringify(data.softChecks);
                    storage.setItem("softData",softData);

                    // 内容
                    $.each(softChecks, function(i, item) {
                        isHide = false;
                        var index = i+1;

                        var videoLength = null;
                        var imageLength = null;
                        if (item.videos instanceof Array === true && item.videos.length > 0) {
                            videoLength = item.videos.length;
                        }
                        else {
                            videoLength = 0;
                        }
                        if (item.images instanceof Array === true && item.images.length > 0) {
                            imageLength = item.images.length;
                        }
                        else {
                            imageLength = 0;
                        }

                        var oDiv = $('<div class="process-listItem"></div>');
                        var url = window.Host.local+"case/notes.html?dataType=hard&orderNum="+i+"&caseId="+options.id+"&appe="+options.appe+"&uid="+options.twitterId+"&type="+options.twitterType+"&twitter="+options.isTwitter;
                        var str = '<a href="'+url+'">';
                        str += '<div class="process-listItem-logo" style="background-image:url(/static/img/step_'+index+'.png)"></div>';
                        str += '<div class="process-listItem-title">'+item.phaseName+'</div>';
                        str += '<div class="process-listItem-data clearfix">';
                        str += '<span class="process-listItem-video">视频 '+videoLength+'</span><span> · </span><span class="process-listItem-image">图片 '+imageLength+'</span>';
                        str += '</div>';
                        str += '<span class="process-listItem-arrow"></span>';
                        str += '</a>';

                        oDiv.html(str);
                        oDiv.appendTo(oSoft.find(".process-list"));
                    });
                }
                else {
                    oSoft.hide();
                }
            })();
        }
    });
}

function showBrand(arr, obj1, obj2) {
    $.each(arr, function(i, item) {
        // 简介品牌
        if (i < 3) {
            var oDiv = $('<div class="data-materialItem-briefItem fr"></div>');
            var str = '<div style="background-image:url('+item.logo+')"></div>';
            str += '<p>'+item.name+'</p>';

            oDiv.html(str);
            oDiv.appendTo(obj1);
        }

        var oLi = $('<li class="data-materialItem-brandItem"></li>');
        var str = '<div class="data-materialItem-brandImg" style="background-image:url('+item.logo+')"></div>';
        str += '<div class="data-materialItem-brandName"><p>'+item.name+'</p></div>';

        oLi.html(str);
        oLi.appendTo(obj2);
    });
}

/**
 * [lazyLoad 滚动延时加载]
 * @param  {[type]} arr [dom类数组]
 * @return {[type]}     [description]
 */
function lazyLoad(arr) {
    for (var i=0, len=arr.length; i< len; i++) {
        var _this = arr[i];
        var src = _this.dataset.src;
        var top = _this.getBoundingClientRect().top;

        if ( top < 666 && _this.style.backgroundImage === "") {
            _this.style.backgroundImage = "url("+src+")";
        }
    }
}

/**
 * [GetQueryString 通过名字查询url参数]
 * @param {[type]} name [description]
 */
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * [statistics 友盟统计]
 * @return {[type]} [description]
 */
function statistics(name) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        _czc.push(["_trackEvent",name,"安卓设备","h5"]);
    }
    //iOS接口
    if (isiOS) {
        _czc.push(["_trackEvent",name,"iOS设备","h5"]);
    }
}

function isShowBtn(obj,oBtn) {
    if (obj.find("p").height() > obj.height()) {
        oBtn.show();
    }
    else {
        var height = obj.find("p").height();
        obj.height(height);
    }
}