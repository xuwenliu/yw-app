<template>
<div>
	<TopHeader>支付成功</TopHeader>
	<div class="content btm">
		<div class="paySuccess bg0">
			<img src="../../../assets/img/order/order_details_pay_success_ico@2x.png">
			<h1 class="F1 C6 fwb">支付成功</h1>
			<p class="F6 C5">已收到您的支付信息，并为你实时结清了当前的支付款项</p>
		</div>
		<div class="btn clearfix">
			<div class="success onlySuccess F3 C0" @click="close">完成</div>
		</div>
	</div>
</div>
</template>
<script>
import TopHeader from '../../../components/Header'
export default {
	name:"materialPaySuccess",
	components: {
		TopHeader
	},
	methods: {
		close() {
			console.log("--------close");
			if(this.$route.query.isWxAlipay){
				
				this.$router.go(-1);
			}else{//如果是易宝支付就关闭
				invokeNative({"code":window.jsBridge.CODE_CLOSE});
			}
		}
	},
}
</script>
<style scoped lang="less">
.paySuccess{
	text-align:center;
	padding-bottom: 0.61333rem;
	img{
		width:35%;
		margin:0 auto;
		margin:0.77333rem 0 0 0.34667rem;
	}
	p{
		margin-top: 0.34667rem;
		
	}
}
.btn{
	margin:0.50667rem 0.53333rem 0;
	text-align:center;
	div{
		float:left;
		width:42%;
		border:1px solid #e6e6e6;
		height: 1.2rem;
		line-height: 1.2rem;
	}
	div.success{
		float:right;
		background:#282828;
	}
	div.onlySuccess{
		width:100%;
		margin-left:0;
	}

}
</style>
