<!-- 订单详情进入 			/#/payList?orderId=10&billId=207&inType=1           go(-1)-->
<!-- 聊天详情中打开账单进入 /#/payList?orderId=10&billId=207&inType=2           关闭页面-->
<!-- 在我的通过扫E端的二维码进入            无                                  关闭页面-->
<!-- 选择优惠券后 			/#/payList?orderId=10&billId=207&inType=1&amount=21 go(-1)-->
<!-- 订单详情-监理订单进入 	/#/payList?orderId=10&billId=207&inType=1           go(-1)-->
<template>
	<div>
		<TopHeader>
			<div class="clickMe" @click="goBack"><span></span></div>支付款项</TopHeader>
		<BottomFooter>
			<div class="F3 C0" @click="goPay">立即支付</div>
		</BottomFooter>
		<div class="content btm">
			<div class="paylist-title bg0">
				<div class="img-box">
					<img :src="orderInfo.companyLogo">
					<h1 class="F8 C1">{{orderInfo.companyName}}</h1>
				</div>
			</div>
			<div class="paylist-list bg0">
				<ul>
					<!--项目名称
				1.从消息>>订单详情中点去支付进入(不显示)-v1.6.0
				2.是监理订单(不显示)-v1.8.0
			-->
					<li class="bb1" v-show="inType!=1 && orderType!=3">
						<div class="div-box F4 C1 clearfix">
							<p><span>项目名称</span></p>
							<p class="textcut">{{orderInfo.orderName}}</p>
						</div>
					</li>
					<!-- 订单类型
				1.从消息>>订单详情中点去支付进入(不显示)-v1.6.0
				2.是监理订单(显示) -v1.8.0
			-->
					<li class="bb1" v-show="inType!=1 || orderType==3">
						<div class="div-box F4 C1 clearfix">
							<p><span>订单类型</span></p>
							<p class="textcut">{{orderInfo.orderTypeDesc}}</p>
						</div>
					</li>

					<!-- 付款用途
					显示内容：
					1.设计订单/施工订单显示- - - 定金/首款(currentBill.billContentTypeDesc) v1.6.0
					2.监理订单的-阶段款(payuse==10)显示- - - 一期款/二期款(currentBill.billPhaseTypeDesc) v1.8.0
				 -->
					<li class="bb1">
						<div class="div-box F4 C1 clearfix">
							<p><span>付款用途</span></p>
							<p class="textcut">{{payuse==10 ? currentBill.billPhaseTypeDesc : currentBill.billContentTypeDesc}}</p>
						</div>
					</li>

					<li class="bb1">
						<div class="div-box F4 C1 clearfix">
							<p><span>账单金额</span></p>
							<p class="textcut">{{currentBill.totalAmount | currency('',2)}}</p>
						</div>
					</li>
					<!-- 设计师
				1.订单类型设计订单(显示)-v1.6.0
				2.从消息>>订单详情中点去支付进入(不显示)-v1.6.0
				3.返回的内容不为空(显示)-v1.6.0
			-->
					<!-- orderType 1 = 设计订单，2 = 施工订单 3 = 监理订单-->
					<li class="bb1" v-show="orderType==1&&inType!=1&&relationEmployeeName!='' ">
						<div class="div-box F4 C1 clearfix">
							<p><span>设计师</span></p>
							<p class="textcut">{{relationEmployeeName}}</p>
						</div>
					</li>
					<!-- 项目经理
				1.订单类型施工订单(显示)-v1.6.0
				2.从消息>>订单详情中点去支付进入(不显示)-v1.6.0
				3.返回的内容不为空(显示)-v1.6.0
			-->
					<li class="bb1" v-show="orderType==2&&inType!=1&&relationEmployeeName!='' ">
						<div class="div-box F4 C1 clearfix">
							<p><span>项目经理</span></p>
							<p class="textcut">{{relationEmployeeName}}</p>
						</div>
					</li>
					<!-- 说明
				1.返回的内容不为空(显示)-v1.6.0
			-->
					<li class="bb1" v-show="currentBill.billPostscript">
						<div class="div-box F4 C1 clearfix">
							<p><span>说明</span></p>
							<p class="textcut">{{currentBill.billPostscript}}</p>
						</div>
					</li>
				</ul>
			</div>

			<div class="paylist-list mg bg0">
				<ul>
					<!-- billContentType 8=定金 9=首款 10=阶段款 11=尾款-->
					<!-- 优惠券
				显示不同内容的条件：
					A:显示===== 无可用：
						1.付款用途不为定金(currentBill.billContentType!=8)  -v1.6.0
						2.后台返回的数据没有可用优惠券(!show) 				-v1.6.0
					B:显示===== 请选择：
						1.付款用途不为定金(currentBill.billContentType!=8)  -v1.6.0
						2.后台返回的数据有可用优惠券(show) 					-v1.6.0
					C:显示===== 选择优惠券后减多少钱(-100)
						1.付款用途不为定金(currentBill.billContentType!=8)  -v1.6.0
						2.后台返回的数据有可用优惠券(show) 					-v1.6.0
						3.去选择了优惠券并且有优惠券金额(amount) 			-v1.6.0
					D:显示===== 已经绑定了的优惠券金额(-100)
						1.付款用途不为定金(currentBill.billContentType!=8)  -v1.6.0
						2.后台返回的数据有可用优惠券(show) 					-v1.6.0
						3.后台返回了已经绑定了的优惠券金额(relationCouponAmount) -v1.6.0

				订单类型为监理订单(不显示)(orderType!=3)					-v1.8.0
			-->
					<li class="bb1" v-show="currentBill.billContentType!=8 && !show && orderType!=3">
						<div class="div-box F4 C1 clearfix">
							<p><span>优惠券</span></p>
							<p class="textcut"><span>无可用</span></p>
						</div>
					</li>

					<li class="bb1" v-if="amount" @click="goChooseDiscountCoupon" v-show="currentBill.billContentType!=8 && show && orderType!=3">
						<div class="div-box F4 C1 clearfix">
							<p><span>优惠券</span></p>
							<p class="textcut">
								<span>-{{amount | currency('',2)}}</span>
								<img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
							</p>

						</div>
					</li>

					<li class="bb1" v-else-if="relationCouponAmount!=-1" v-show="currentBill.billContentType!=8 && show && orderType!=3">
						<div class="div-box F4 C1 clearfix">
							<p><span>优惠券</span></p>

							<p class="textcut">
								<span>-{{relationCouponAmount | currency('',2)}}</span>

							</p>

						</div>
					</li>

					<li class="bb1" v-else @click="goChooseDiscountCoupon" v-show="currentBill.billContentType!=8 && show && orderType!=3">
						<div class="div-box F4 C1 clearfix">
							<p><span>优惠券</span></p>
							<p class="textcut">
								<span>请选择</span>
								<img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
							</p>
						</div>
					</li>
					<!-- 已付金额
					显示条件：
						1.后台返回已付金额不为0(currentBill.prepaidAmount!=0)-v1.6.0，v1.8.0补充上的
				-->
					<li class="bb1" v-show="currentBill.prepaidAmount && currentBill.prepaidAmount>0">
						<div class="div-box F4 C1 clearfix">
							<p><span>已付金额</span></p>
							<p class="textcut F4">{{currentBill.prepaidAmount | currency('',2)}}</p>

						</div>
					</li>
					<!-- 待付金额
					显示条件：
						1.后台返回待付金额不为0(currentBill.unpaidAmount !=0)-v1.6.0
						先显示：后台返回的待付金额(currentBill.unpaidAmount)
						再显示：后台返回的(账单金额-绑定了的优惠券金额)(afterRelationCouponAmount)
						后显示：用户去选择的优惠券金额(账单金额-选择优惠券的金额)(afterAmount)
				-->
					<li class="bb1" v-show="currentBill.unpaidAmount && currentBill.unpaidAmount !=0">
						<div class="div-box F4 C1 clearfix">
							<p><span>待付金额</span></p>
							<p class="textcut F4 C6" v-if="!amount">{{currentBill.unpaidAmount | currency('',2)}}</p>
							<p class="textcut F4 C6" v-else-if="relationCouponAmount!=-1">
								{{afterRelationCouponAmount | currency('',2)}}</p>
							<p class="textcut F4 C6" v-else>{{afterAmount | currency('',2)}}</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import TopHeader from '../../../../components/Header'
	import BottomFooter from '../../../../components/Footer'
	export default {
		name: "payList",
		components: {
			TopHeader,
			BottomFooter
		},
		data() {
			return {
				show: false, //后台获取的优惠券是否有可用的
				orderId: '', //订单Id
				billId: '', //账单Id
				inType: '',
				/*
										      	1.聊天详情中打开账单进入 inType=2;
												2.消息>>订单详情中点去支付进入 inType=1;
												3.我的>>我的订单>>订单详情中点去支付进入 inType=1;
												4.选择优惠券回到这个页面 inType=1;
												5.在我的通过扫E端的二维码进入 无
										  	*/
				orderInfo: {
					// "companyLogo": "",
					// "companyName": "",
					// "orderName": "",
					// "orderType": "",
					// "orderTypeDesc": "",
				},
				orderType: "", //订单类型 1=设计订单 2=施工订单 3=监理订单
				// prepaidAmount:0,				//已付金额

				currentBill: {
					// "billContentType": "",
					// "billConetntTypeDesc": "",
					// "billPhaseTypeDesc": "",
					// "totalAmount": "",
					// "billPostscript": "",
					// "prepaidAmount":0,			//已付金额
					// "unpaidAmount": 0,			//待付金额
				},
				relationEmployeeName: "", //项目经理/设计师 姓名
				billMoney: "", //账单金额
				payuse: "", //付款用途 8=定金 9=首款 10=阶段款 11=尾款

				couponId: -1, //优惠券id
				amount: "", //用户选择的优惠券减多少钱
				afterAmount: "", //待付金额---用户选择的优惠券(账单金额billMoney-选择优惠券的金额amount)
				relationCouponAmount: -1, //后台返回的绑定了优惠券的金额
				afterRelationCouponAmount: "", //待付金额---后台返回绑定优惠券金额(账单金额-绑定了的优惠券金额)

			}
		},

		created() {
			invokeNative({ "code": window.jsBridge.CODE_DIALOG_SHOW });
			this.inType = this.$route.query.inType * 1;
			this.orderId = this.$route.query.orderId * 1,
				this.billId = this.$route.query.billId * 1;

			this.orderId && this.billId ? this.getOrderPayInfo(this.orderId, this.billId) : "";
			var that = this;
			window.paySuccReturn = function(value) {
				var value = window.atob(value);
				value = JSON.parse(value);
				if(value.data) {
					that.$router.push({ "name": "paySuccess", query: { "billId": that.billId } });
				}
			}
		},
		updated() {
			console.log("this.$route.query.amount：" + this.$route.query.amount);
			if(this.$route.query.amount) {
				this.amount = this.$route.query.amount;
				if(this.billMoney > this.$route.query.amount) {
					this.afterAmount = this.billMoney - this.$route.query.amount;
				} else {
					this.afterAmount = 0;
				}
			}
			this.orderId = this.$route.query.orderId * 1,
				this.billId = this.$route.query.billId * 1;
			if(this.$route.query.inType) {
				this.inType = this.$route.query.inType;
			}
		},
		methods: {
			goBack() {
				if(this.inType == 1) {
					this.$router.go(-1);
					console.log("去订单详情页面");
				} else {
					console.log("关闭页面");
					invokeNative({ "code": window.jsBridge.CODE_CLOSE });
				}
			},
			goChooseDiscountCoupon() {
				if(this.inType == 1) { //从订单详情来 去选优惠券。
					this.$router.replace({
						"name": "chooseDiscountCoupon",
						query: {
							'orderId': this.orderId,
							'billId': this.billId,
							"orderType": this.orderType,
							"inType": 1
						}
					})
				} else { //扫码或者聊天详情来 去选优惠券。
					this.$router.replace({
						"name": "chooseDiscountCoupon",
						query: {
							'orderId': this.orderId,
							'billId': this.billId,
							"orderType": this.orderType
						}
					})
				}

			},
			bindCoupon(orderId, billId, couponId, amount, billMoney) {
				this.$http.post(window.Host.customer + `/order/bindingCoupon`, {
					"orderId": orderId,
					"billId": billId,
					"userCouponId": couponId
				}).then((res) => {
					console.log(res);
					if(!res.data.succ) { //1.绑定不成功
						console.log("绑定不成功" + res.data.message);
						invokeNative({ "code": window.jsBridge.CODE_TOAST, "data": res.data.message });
					} else { //2.绑定成功
						if(amount < billMoney) {
							console.log("优惠券金额小于账单金额--去收银台")
							/*invokeNative({
								"code":window.jsBridge.CODE_ORDER_BILL_PAY,
								"data":billId,
								"callback":"paySuccReturn"
							});
							*/
							invokeNative({
								"code": window.jsBridge.CODE_PAY,
								"data": {
									"billId": billId, //帐单id，数值类型
									"payType": 1 //payType默认支付宝、微信  0：不支持易宝支付， 1：支持易宝支付
								},
								"callback": "paySuccReturn"
							});

						} else {
							//去支付成功页面
							console.log("优惠券金额大于账单金额--去支付成功页面")
							this.$router.push({ "name": "paySuccess", query: { "billId": billId } });
						}
					}
				});
			},
			goPay() {

				if(this.$route.query.couponId) {
					this.couponId = this.$route.query.couponId;
				}

				if(this.payuse == 8 || (this.orderType == 3 && this.payuse == 10)) { //监理订单阶段款一期款/二期款v1.8.0
					if(this.payuse == 8) {
						console.log("定金--直接去付款");
					} else {
						console.log("监理订单阶段款一期款/二期款v1.8.0");
					}
					/*invokeNative({
						"code":window.jsBridge.CODE_ORDER_BILL_PAY,
						"data":this.billId,
						"callback":"paySuccReturn"
					});*/
					invokeNative({
						"code": window.jsBridge.CODE_PAY,
						"data": {
							"billId": this.billId, //帐单id，数值类型
							"payType": 1 //payType默认支付宝、微信  0：不支持易宝支付， 1：支持易宝支付
						},
						"callback": "paySuccReturn"
					});

				} else {
					//}else if(this.payuse==9 || this.payuse==11){// 首款/尾款
					//无可用优惠券直接去收银台
					if(this.show === false) {
						console.log("首款/尾款--无可用优惠券--直接去收银台")
						/*invokeNative({
							"code":window.jsBridge.CODE_ORDER_BILL_PAY,
							"data":this.billId,
							"callback":"paySuccReturn"
						});*/
						invokeNative({
							"code": window.jsBridge.CODE_PAY,
							"data": {
								"billId": this.billId, //帐单id，数值类型
								"payType": 1 //payType默认支付宝、微信  0：不支持易宝支付， 1：支持易宝支付
							},
							"callback": "paySuccReturn"
						});
					} else { //有可用优惠券
						//A.用户没有选择直接去收银台
						if(this.couponId == -1) {
							console.log("首款/尾款--有可用优惠券用户没有选--直接去收银台");
							/*invokeNative({
								"code":window.jsBridge.CODE_ORDER_BILL_PAY,
								"data":this.billId,
								"callback":"paySuccReturn"
							});*/
							invokeNative({
								"code": window.jsBridge.CODE_PAY,
								"data": {
									"billId": this.billId, //帐单id，数值类型
									"payType": 1 //payType默认支付宝、微信  0：不支持易宝支付， 1：支持易宝支付
								},
								"callback": "paySuccReturn"
							});
						} else {
							// B用户选择了优惠券
							console.log("首款/尾款--用户选了优惠券--去绑定优惠券");
							this.bindCoupon(this.orderId, this.billId, this.couponId, this.amount, this.billMoney)
						}
					}
				}
			},
			/*获取订单付款信息*/
			getOrderPayInfo(orderId, billId) {
				this.$http.get(window.Host.customer + `/order/${orderId}/${billId}`).then((res) => {
					console.log(res);
					if(res.data.succ) {
						invokeNative({ "code": window.jsBridge.CODE_DIALOG_HIDE });
						this.orderInfo = res.data.data.orderInfo;
						// if(res.data.data.orderInfo.prepaidAmount){
						// 	this.prepaidAmount=res.data.data.orderInfo.prepaidAmount;//账单已支付金额
						// }
						this.currentBill = res.data.data.currentBill;
						if(res.data.data.relationEmployee) {
							this.relationEmployeeName = res.data.data.relationEmployee.name;
						}
						this.orderType = this.orderInfo.orderType; //1=设计订单 2=施工订单 3=监理订单
						this.billMoney = this.currentBill.totalAmount; //账单金额
						this.payuse = this.currentBill.billContentType; //8=定金 9=首款 10=阶段款 11=尾款
						//获取优惠券信息
						var haveCouponMoney = res.data.data.currentBill.relationCoupon;
						if(haveCouponMoney) {
							console.log("返回了这个字段haveCouponMoney")
							this.relationCouponAmount = haveCouponMoney.amount;
							if(this.billMoney > this.relationCouponAmount) {
								this.afterRelationCouponAmount = this.billMoney - this.relationCouponAmount
							} else {
								this.afterRelationCouponAmount = 0;
							}

						} else {
							console.log("没有返回这个字段haveCouponMoney")
						}
						this.$http.get(window.Host.customer + `/coupon/canPay?orderType=${this.orderType}&billId=${billId}`).then((res) => {
							console.log(this.orderType + "··················" + billId);
							if(res.data.succ) {
								if(res.data.data) {
									console.log("有可用优惠券");
									this.show = true;
								} else {
									console.log("无可用优惠券");
									this.show = false;

								}
							} else {
								invokeNative({ "code": window.jsBridge.CODE_TOAST, "data": res.data.message });
							}
						})
					} else {
						invokeNative({ "code": window.jsBridge.CODE_DIALOG_HIDE });
						didApiError(res);
					}
				})
			}
		} //methods结束
	}
</script>
<style scoped lang="less">
	.btm {
		bottom: 1.2rem;
		.paylist-title {
			text-align: center;
			overflow: hidden;
			.img-box {
				margin-top: 0.77333rem;
				img {
					width: 1.7rem;
					height: 1.6rem;
					border-radius: 0.8rem;
				}
				h1 {
					margin: 0.42666rem 0;
				}
			}
		}
	}
	
	.paylist-list {
		margin-top: 0.26666rem;
		li {
			height: 1.57333rem;
			line-height: 1.57333rem;
		}
		.div-box {
			margin: 0 0.53333rem;
			width: 89.3%;
			p:first-child {
				float: left;
			}
			p:last-child {
				float: right;
				text-align: right;
				img {
					width: 0.2rem;
					vertical-align: middle;
					margin-left: 0.16rem;
				}
			}
		}
	}
	
	.mg {
		margin-top: 0.26666rem;
		margin-bottom: 0.8rem;
	}
</style>