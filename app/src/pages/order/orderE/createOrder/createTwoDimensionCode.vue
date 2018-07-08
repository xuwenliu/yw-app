<template>
<div class="createTwoDimensionCode">
	<TopHeader><div class="clickMe" @click="goBack"><span></span></div>支付款项</TopHeader>
	<div class="content">
		<div class="title-box bg0 bb1">
			<ul class="F4 C1">
				<li class="bb1">付款用途<span>{{payuse}}</span></li>
				<li>付款金额<span>{{money | currency("",2)}}</span></li>
			</ul>
		</div>
		<div class="twoDimensionCode bg0 bb1">
			<qriously class="qrcode" :value="qrcodeData" size="200"/>

			<div class="saoma">
				<img src="../../../../assets/img/order/sweep_tips@2x.png">
			</div>
		</div>
	</div>
</div>
</template>
<script>
import TopHeader from '../../../../components/Header'
import '../../../../assets/css/orderE-create-twodimensioncode.css'
export default{
	name:"createTwoDimensionCode",
	components:{
		TopHeader
	},
	data(){
		return {
			qrcodeData:"",
			payuse:'',//付款用途8=定金，9=首款
			money:''//多少钱
		}
	},
	methods:{
		goBack(){
			this.$router.go(-1);
		}
	},
	created(){
		if(this.$route.query.payuse==8){
			this.payuse="定金";
		}else{
			this.payuse="首款";
		}
		this.money=this.$route.query.money;

		this.qrcodeData=`http://a.app.qq.com/o/simple.jsp?pkgname=com.yingwumeijia.android.ywmj.client&qrcodeData=`
		+this.$route.query.qrcode;
	}
}
</script>
