<!--/#/billpayDetail?orderId=11&billId=12&appType=e-->
<template>
	<div>
		<TopHeader>
			<div class="clickMe" @click="goBack"><span></span></div>付款明细</TopHeader>
		<div class="content btm">
			<div class="pay-detail-box" v-if="billPayDetailData && billPayDetailData.length!=0">
				<ul v-for="g in billPayDetailData">
					<li>
						<span class="F8 C1">{{g.payToolDesc}}</span>
						<em class="F4 C5 block">{{g.createTime | setTime}}</em>
					</li>
					<li><em class="F1 b C1">{{g.amount | currency("",2)}}</em></li>
				</ul>
			</div>
			<NoFile v-else>
				<img slot="bgimg" src="../../../../assets/img/order/order_details_no_bill_ico@2x.png">
				<span slot="info">暂无付款明细！</span>
			</NoFile>
		</div>
	</div>
</template>
<script>
	import TopHeader from '../../../../components/Header'
	import NoFile from '../../../../components/NoFile'
	export default {
		name: "billPayDetail",
		components: {
			TopHeader,
			NoFile
		},
		data() {
			return {
				billPayDetailData: [],
			}

		},
		created() {
			let orderId = this.$route.query.orderId,
				billId = this.$route.query.billId,
				appType = this.$route.query.appType || "c";
			if(!(appType === "c" || appType === "e")) {
				return false
			}
			orderId && billId ? this.getBillPayDetailList(orderId, billId, appType) : "";
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			getBillPayDetailList(id, billId, ty) {
				this.appType = ty;
				this.$http.get((ty == "c" ? window.Host.customer : window.Host.employee) + `/order/${id}/${billId}/journal`).then(function(res) {
					console.log(res);
					if(res.data.succ) {
						this.billPayDetailData = res.data.data;
					} else {
						invokeNative({ "code": 1004, data: res.data.message });
					}
				})
			}
		}
	}
</script>
<style scoped lang="less">
	.pay-detail-box ul {
		background: #fff;
		padding: 0.64rem 0.53333rem;
		height: 2.45333rem;
		box-sizing: border-box;
		display: flex;
		display: -webkit-flex;
		/* Safari */
		line-height: 0.56rem;
		border-bottom: 1px solid #e6e6e6;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.pay-detail-box li {}
</style>
