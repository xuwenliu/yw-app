<template>
	<div class="supervisionCompanyDetails">
		<y-header><div class="clickMe" @click="goBack"><span></span></div>监理公司详情</y-header>
		<div class="content">
			<ul>
				<li class="bb1" v-for="item in supervisionCompanyService">
					<div class="supervisionCompanyDetails-name F8 C0 fwb textcut">
						<img src="../../assets/img/safeguard/tag_ic@2x.png">{{item.name}}
					</div>
					<div class="supervisionCompanyDetails-box">
						<div v-show="item.original" class="supervisionCompanyDetails-supervisionCost F3 C1 fwb bb1">
							监理费：原价￥{{item.original}}/㎡
						</div>
						<div class="supervisionCompanyDetails-description F4 C1 text3LineRestrist en-cut-txt">
							{{item.description}}
						</div>
						<div class="supervisionCompanyDetails-discountAndPlaceAnOrder clearfix">
							<p class="C6 fwb" v-show="item.discount&&item.discount<1"><span>{{item.discount | toDiscount}}</span>折优惠</p>
							<p class="C0 F3" @click="atOncePlaceAnOrder(item.id)">立即下单</p>
						</div>
					</div>
				</li>
			</ul>
			<div class="look-supervisingContract bb1 F3 C1 fwb" @click="lookSupervisingContract">查看监理合同模板
				<img src="../../assets/img/safeguard/mine_more_ico@2x.png">
			</div>
			<div class="specialVersion" v-show="companyPresent" v-html="companyPresent"></div>

		</div>

	</div>
</template>

<script>
import yHeader from '../../components/Header'
import $ from "jquery"
export default {
	name: 'supervisionCompanyDetails',
	components: {
		yHeader,
	},
	data() {
		return {
			supervisorContractPDFUrl:"",
			companyPresent:"",//m端上传的多张图片/文字
			supervisionCompanyService:[
				// {
			 //      	"id": 0,//服务标准id
			 //      	"name": "我是监理公司1号大咖我是监理公司1号大咖我是监理公司1号大咖我是监理公司1号大咖",//服务标准名称
			 //      	"description": "联合第三方顶级监理公司aaaaaaaaaaaaaaaaaaaaaaa，平台补贴监理费用，下单最多可享受监理费6折优惠，免费提供安全付款、先行赔付服务。",
			 //      	"deposit": 0,// 服务定金
			 //      	"original": 50,//单价（原价（元/㎡））
			 //      	"discount": 0.20,//折扣比例
			 //      	"enable": false//启用禁用状态（新增或修改时此字段无效）
			 //    },
			],
		}
	},
	created() {
		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
		this.getSupervisionCompanyServiceList();
	},
	mounted() {

	},
	methods: {
		goBack(){
           this.$router.go(-1);
        },
        getSupervisionCompanyServiceList() {
        	let supervisionCompanyId=this.$route.query.supervisionCompanyId*1;
        	this.$http.get(window.Host.customer+`/v1080/supervisor/supervisorServices?companyId=${supervisionCompanyId}`).then((res)=>{
        		console.log(res)
				if(res.data.succ){
					invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
					if(res.data.data){
						this.supervisionCompanyService=res.data.data.supervisorServiceStandardDtos;
						this.supervisorContractPDFUrl=res.data.data.supervisorContract;
						this.companyPresent=res.data.data.companyPresent;
						this.$nextTick(()=> {
							$(function(){
								$(".specialVersion p").addClass("cut-txt");
					         	$(".specialVersion").find("img").css({
									width:"100%"
								})
					     	})
						})
					}
				}else{
					invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
					didApiError(res);
				}
			})
        },
        atOncePlaceAnOrder(serviceId){
        	//判断用户是否登录执行回调函数returnisLogin
        	//原生app返回我一个res.data==1用户登录,res.data==0未登录
			invokeNative({
				"code":window.jsBridge.CODE_GET_LOGIN_STATUS,
				"callback":"returnisLogin"
			});
			window.returnisLogin=function(value){
				var value=window.atob(value);
				var res = JSON.parse(value);
		        if(res.data==1){
		        	console.log("进入支付定金页面---需要用户登录才能访问");
		        	getAccountToken(); //为了进入支付定金页面里token同步，需要调用此方法同步token。
		        	var url=window.Host.localUrl+"/#/giveADeposit?serviceId="+serviceId;
		        	invokeNative({
					"code":window.jsBridge.CODE_OPEN,
					"data":{
		        		"url":url
		        		}
					})
		        }else{
		        	/*v1.10.0数据埋点 ACTION_RESOURCE_CREATE_ORDER(15, 2, "APP-保障-立即下单"),*/
					invokeNative({
						"code":window.jsBridge.CODE_LOG_ACTION_RESOURCE,
						"data":dataLog.ACTION_RESOURCE_CREATE_ORDER//15
					});
		        	invokeNative({"code":window.jsBridge.CODE_LOGIN});
		        }
			}

        },
        lookSupervisingContract(){
        	let pdfUrl=this.supervisorContractPDFUrl;
			//调用原生打开pdf的接口
			invokeNative({
				"code":window.jsBridge.CODE_OPEN,
				"data":{
	        		"url":pdfUrl,
	        		"title":"监理合同"
	        	}
			});
        }
	},//methods结束
}
</script>

<style scoped lang="less">
.supervisionCompanyDetails-name{
	display: block;
	height: 1.09333rem;
	background-color: #282828;
	line-height: 1.09333rem;
	padding-left: 0.34667rem;
	img{
		width: 0.4rem;height: 0.4rem;
		margin-right: 0.18667rem;
	}
}
.supervisionCompanyDetails-box{
	padding: 0 1.01333rem 0.72rem;
	background-color: #fff;
	overflow: hidden;
	.supervisionCompanyDetails-supervisionCost{
		height: 0.74667rem;
		line-height: 0.74667rem;
		margin-top: 0.66667rem;
	}
	.supervisionCompanyDetails-description{
		margin:0.34667rem 0 0.66667rem;
	}
	.supervisionCompanyDetails-discountAndPlaceAnOrder{
		line-height: 1;
		p:first-child{
			font-size: 0.56rem;
			float: left;
			span{
				font-size: 0.8rem;
			}
		}
		p:last-child{
			float: right;
			background-color: #ed316b;
			width: 3.54667rem;
			height: 1.01333rem;
			text-align: center;
			line-height: 1.01333rem;
			border-radius: 0.50667rem;
		}
	}
}
.look-supervisingContract{
	height: 1.33333rem;
	line-height: 1.33333rem;
	background-color: #fff;
	margin:0.26667rem 0;
	padding: 0 0.53333rem;
	position: relative;
	img{
		position: absolute;
		width: 0.18667rem;
		height: 0.34667rem;
		top: 50%;
		right: 0.53333rem;
		margin-top: -0.17333rem;
	}
}
.specialVersion{
	width: 100%;
	background-color: #fff;
	padding-top: 0.53333rem;
	p img{
		width: 100%;
	}
}
</style>
