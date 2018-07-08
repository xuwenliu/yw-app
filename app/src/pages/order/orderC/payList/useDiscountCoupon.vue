<template>
<div>
	<TopHeader><div class="clickMe" @click="goBack"><span></span></div>优惠券使用说明</TopHeader>
	<div class="content useDiscountCoupon">
		<ul>
			<li class="F3 C1">1.付款用途为“定金”，则不可使用优惠券，“首款、阶段款、尾款”均最多可使用一张优惠券。</li>
			<li class="F3 C1">2.订单只能使用同类型的优惠券，即设计订单使用设计类优惠券，施工订单使用施工类优惠券。</li>
			<li class="F3 C1">3.优惠券需一次性消费，若优惠券金额大于支付金额也视为全部支付。</li>
		</ul>
	</div>
</div>
</template>
<script>
import TopHeader from '../../../../components/Header'
export default{
	name:"useDiscountCoupon",
	components:{
		TopHeader
	},
	methods:{
		goBack(){
			this.$router.go(-1);
		}
	}
}
</script>
<style scoped lang="less">
.useDiscountCoupon{
	ul{
		margin:0.53333rem 0.53333rem 0 0.53333rem;
		li{
			margin-bottom:0.8rem;
			line-height: 1.5;
		}
	}
}
</style>