<template>
	<div>

		<footer-bottom v-show="resData && resData[0].billStatus == 1">
			<div @click="goToPay" class="F3 C0">去支付</div>
		</footer-bottom>

		<NoFile v-show="!resData">
			<img slot="bgimg" src="../../../../assets/img/order/order_details_no_bill_ico@2x.png">
			<span slot="info">暂无可支付账单</span>
		</NoFile>

		<div class="supervisionBillForEmployee" v-show="resData">
			<div class="content supervision-e-root-content">
				<ul class="bg7 F5 C1" :class="{'supervision-e-bill-bottom-p':resData && resData[0].billStatus == 1}">
					<li class="supervision-e-bill-item " v-for="(item,index) in resData">

						<div class="supervision-e-bill-top-layout" v-show="index==0">

							<div>
								<div class="supervision-e-bill-top-layout-title">合同金额</div>
								<div class="F2 C1">￥ <span class="supervision-e-bill-top-layout-price">{{moneyData.contractAmount | currency("",2)}}</span></div>
							</div>
							<div>
								<div class="supervision-e-bill-top-layout-title">已付金额</div>
								<div class="F2 C1">￥ <span class="supervision-e-bill-top-layout-price">{{moneyData.prepaidAmount | currency("",2)}}</span></div>
							</div>

						</div>

						<ul>
							<li>
								<i>{{item.billContentType == 10 ? item.billPhaseTypeDesc : item.billContentTypeDesc}}</i><span class="textcut">{{item.totalAmount | currency("",2)}}</span>
							</li>
							<li>
								<i>已付金额</i><span class="textcut">{{item.prepaidAmount | currency("",2)}}</span>
							</li>
							<li :class="{'supervision-e-bill-red':item.billStatus == 1}">
								<i>待付金额</i><span class="textcut">{{item.unpaidAmount | currency("",2)}}</span>
							</li>
						</ul>

						<div class="bg0">
							<div class="supervision-e-bill-item-divider"></div>
							<div class="supervision-e-bill-item-button" v-show="item.billStatus != 1" @click="checkPayDetail(item.id)">
								<span>查看已付金额明细</span> <img class="supervision-e-itemArrow" src="../../../../assets/img/supervision/order_details_small_arrow@2x.png">
							</div>
						</div>

					</li>
				</ul>
			</div>
		</div>
	</div>

</template>
<script>
	import '../../../../assets/css/supervisionE-order-detail.css'
	import NoFile from '../../../../components/NoFile'
	import FooterBottom from '../../../../components/Footer'
	import InputReason from '../../../../components/InputReason'

	export default {
		name: 'supervisionBillForCustomer',
		components: {
			NoFile,
			FooterBottom,
			InputReason
		},
		data() {
			return {
				resData: null,
				moneyData: {},
				billId: 0,
				orderId: 0,
			}
		},
		methods: {

			/**
			 *
			 * 付款
			 */
			goToPay() {
				if(!this.resData) return;

				if(this.resData[0].billContentType == 8) {
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
					this.$router.push({ "name": "payList", query: { "orderId": this.orderId, "billId": this.billId, "inType": 1 } })
				}
			},

			/**
			 *
			 * 查看付款明细
			 */
			checkPayDetail(billId) {
				this.$router.push({ "name": "billPayDetail", query: { "orderId": this.orderId, "billId": billId, "appType": "c" } })
			},
			/**
			 *
			 * 加载页面数据
			 *
			 * */
			getOverviewData() {

				this.$http.get(window.Host.customer + `/order/${this.orderId}/bill`).then((res) => {
					console.log(res);
					if(res.data.succ) {
						this.resData = res.body.data;
						this.billId = res.body.data[0].id;
					} else {
						console.log("error" + res.data.message);
					}
				})
			},
			/**
			 *
			 * 获取合同金额
			 * */
			loadContractMoney() {

				this.$http.get(window.Host.customer + `/order/${this.orderId}/getSupervisionMoney`).then((res) => {
					console.log(res);
					if(res.data.succ) {
						this.moneyData = res.body.data;
					} else {
						console.log("error" + res.data.message);
					}
				})
			}
		},
		created() {

			this.orderId = this.$route.query.orderId;
			this.loadContractMoney();
			this.getOverviewData();

			var that = this;
			window.paySuccReturn = function(value) {
				var value = window.atob(value);
				value = JSON.parse(value);
				if(value.data) {
					that.$router.push({ "name": "paySuccess", query: { "billId": that.billId } });
				}
			}

			//      模拟数据
			//      this.resData = [
			//        {
			//          "id": 0,
			//          "orderId": 0,
			//          "orderBillType": "",
			//          "billStatus": 1,
			//          "orderBillTypeDesc": "",
			//          "billPhaseType": "",
			//          "billPhaseTypeDesc": "",
			//          "totalAmount": 10,
			//          "billContentType": 10,
			//          "billContentTypeDesc": "阶段款",
			//          "billPhaseTypeDesc": "二期款",
			//          "prepaidAmount": 100,
			//          "unpaidAmount": 20
			//        },
			//        {
			//          "id": 1,
			//          "orderId": 0,
			//          "orderBillType": "",
			//          "billStatus": 2,
			//          "orderBillTypeDesc": "",
			//          "billPhaseType": "",
			//          "billPhaseTypeDesc": "",
			//          "totalAmount": 0,
			//          "billContentType": 8,
			//          "billContentTypeDesc": "定金",
			//          "billPhaseTypeDesc": "二期款",
			//          "prepaidAmount": 100000,
			//          "unpaidAmount": 10
			//        },
			//
			//        {
			//          "id": 1,
			//          "orderId": 0,
			//          "orderBillType": "",
			//          "billStatus": 2,
			//          "orderBillTypeDesc": "",
			//          "billPhaseType": "",
			//          "billPhaseTypeDesc": "",
			//          "totalAmount": 0,
			//          "billContentType": 10,
			//          "billContentTypeDesc": "阶段款",
			//          "billPhaseTypeDesc": "一期款",
			//          "prepaidAmount": 90,
			//          "unpaidAmount": 10
			//        },
			//        {
			//          "id": 1,
			//          "orderId": 0,
			//          "orderBillType": "",
			//          "billStatus": 2,
			//          "orderBillTypeDesc": "",
			//          "billPhaseType": "",
			//          "billPhaseTypeDesc": "",
			//          "totalAmount": 0,
			//          "billContentType": 10,
			//          "billContentTypeDesc": "阶段款",
			//          "billPhaseTypeDesc": "三期款",
			//          "prepaidAmount": 6,
			//          "unpaidAmount": 10
			//        }
			//      ];
		}
	}
</script>