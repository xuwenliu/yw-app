/**
 * Created by jiaminghe on 2017/4/11.
 * Created by xwl on 2017/11/29.
 */
(function(win, $, undefined) {

    $(function() {
        /*后退*/
        $(".title").find("span").on("click", function() {
            var closeView=GC.Lib.GetQueryString("close");
            closeView==1? invokeNative({"code":1003}):window.history.go(-1);
        });
        /*如果是从加入团队过来就获取teamId*/
        var teamId = GC.Lib.GetQueryString("teamId"); 
		if(teamId){
			/*加入团队金额比例显示*/
			$.ajax({
	            type: "GET",
	            url: window.Host.customer + "/twitter/team/share/ratioInfo?teamId="+teamId,
	            dataType: "json",
	            contentType: "application/json;charset=UTF-8",
	            success: function (res) {
	  				console.log(res);
	                if(res.stateCode===0&&res.data){
		                	if(res.data.buildRatioDto.memberRatio==0&&res.data.buildRatioDto.teamRatio==0 && res.data.designRatioDto.memberRatio==0&&res.data.designRatioDto.teamRatio==0){
		                    	$(".contract-amount").hide();
		                    }
	                	
                    	/*设计*/
                			if(res.data.designRatioDto.memberRatio==0&&res.data.designRatioDto.teamRatio==0){
                				//不显示
                				$("#designProportion").hide();
                			}else if(res.data.designRatioDto.memberRatio==0&&res.data.designRatioDto.teamRatio!=0){
                				$("#designProportion").html("设计：佣金统一划入团队账户"); 
                				$("#designProportion").show();
                			}else {
                				$("#designProportion").html('设计 <span>签约金额的 <i>'+res.data.designRatioDto.memberRatio.toFixed(1)+'%</i></span>'); 
								$("#designProportion").show();
                			}

						/*施工*/
                			if(res.data.buildRatioDto.memberRatio==0&&res.data.buildRatioDto.teamRatio==0){
                				//不显示
                				$("#buildProportion").hide();
                			}else if(res.data.buildRatioDto.memberRatio==0&&res.data.buildRatioDto.teamRatio!=0){
                				$("#buildProportion").html("施工：佣金统一划入团队账户");
                				$("#buildProportion").show();
                			}else {
                				$("#buildProportion").html('施工 <span>签约金额的 <i>'+res.data.buildRatioDto.memberRatio.toFixed(1)+'%</i></span>');
                				$("#buildProportion").show();
                			}

	                    
	                }else {
	                    $(".contract-amount").hide();
	                } 
	            },
	            error: function (res) {
	                
	            }
	        })
		}else {
			/*加入推客金额比例显示*/
			$.ajax({
	            type: "GET",
	            url: window.Host.customer + "/twitter/revenueConfig",
	            dataType: "json",
	            contentType: "application/json;charset=UTF-8",
	            success: function (res) {
	  				console.log(res);
	                if(res.stateCode===0&&res.data){
	                    if(res.data.revenueRule){
	                        var designProportion=res.data.revenueRule.designProportion.toFixed(1);
	                        var buildProportion=res.data.revenueRule.buildProportion.toFixed(1);
	                        if(designProportion==0&&buildProportion==0){
	                        	$(".contract-amount").hide();
	                        }
	                        if(designProportion==0){
	                        	$("#designProportion").hide();
	                        }
	                        if(buildProportion==0){
	                        	$("#buildProportion").hide();
	                        }
	                        $("#designProportion").html('设计 <span>签约金额的 <i>'+designProportion+'%</i></span>');
	                        $("#buildProportion").html('施工 <span>签约金额的 <i>'+buildProportion+'%</i></span>');
	                    }
	                }else {
	                    $(".contract-amount").hide();
	                } 
	            },
	            error: function (res) {
	                
	            }
	        })
		}
        

    });

})(window, Zepto);