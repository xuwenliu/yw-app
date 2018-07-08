<template>
<div>
	<TopHeader>支付成功</TopHeader>
	<div class="content btm">
		<div class="paySuccess bg0">
			<img src="../../../../assets/img/order/order_details_pay_success_ico@2x.png">
			<h1 class="F1 C6 fwb">支付成功</h1>
			<p class="F6 C5">已收到您的支付信息，并为你实时结清了当前的支付款项</p>
		</div>
		<div class="box bg0 bb1">
			<ul class="F4 C1">
				<li class="bb1">本次支付金额<span>{{latestPayAmount | currency("",2)}}</span></li>
				<li class="F4 C6">剩余需要支付<span>{{cashAmount | currency("",2)}}</span></li>
			</ul>
		</div>
		<div class="btn clearfix">
			<div class="goOnPay bg0 F3 C1" v-if="showTwo" @click="goPay">继续支付</div>
			<div class="success F3 C0" :class="{'onlySuccess':showTwo==false}" @click="close">完成</div>
		</div>
		<div class="look F4 C5">“订单详情”请查看“我的-我的订单”</div>
	</div>
</div>
</template>
<script>
import TopHeader from '../../../../components/Header'
export default{
	name:"createOrder",
	components:{
		TopHeader
	},
	data(){
		return {
			showTwo:false,//为false就显示完成按钮，为true继续支付和完成两个都显示
			latestPayAmount:'',//本次支付金额
			cashAmount:"",//剩余需要支付金额
			whetherPayed:false,//是否已支付 true=已支付，false=未支付(包含分批支付未付完的)
		}

	},
	created(){
		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
	    window.paySuccReturn=function(){
	    	console.log("回调数据")
	        window.location.reload();
	    }
		this.getData();
	},
	methods:{
		close() {
			invokeNative({"code":window.jsBridge.CODE_CLOSE});
		},
		getData(){
			if(this.$route.query.billId){
			this.$http.get(window.Host.customer+`/bill/brief/${this.$route.query.billId}`).then((res)=>{
				console.log(res)
					if(res.data.succ){
						invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
						this.latestPayAmount=res.data.data.latestPayAmount;
						this.cashAmount=res.data.data.cashAmount;
						this.whetherPayed=res.data.data.whetherPayed;
						if(!this.cashAmount || this.cashAmount==0 || this.cashAmount=="" || this.whetherPayed){
							this.showTwo=false;
						}else{
							this.showTwo=true;
						}
					}else {
		      			invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
		      			didApiError(res);
		      		}
				})
			}
		},
		goPay() {
			//console.log("易宝支付服务端返回的isYeepay"+this.$route.query.isYeepay);
			if(this.$route.query.isYeepay){//服务端返回的是字符串1
				//易宝支付
				console.log("易宝123456")
				invokeNative({"code":window.jsBridge.CODE_CLOSE});
			}else{
				//支付宝或微信
				console.log("去收银台")
				/*invokeNative({
					"code":window.jsBridge.CODE_ORDER_BILL_PAY,
					"data":this.$route.query.billId*1,
					"callback":"paySuccReturn"
				});*/
				invokeNative({
					"code":window.jsBridge.CODE_PAY,
					"data":{
						"billId":this.$route.query.billId*1,           	//帐单id，数值类型
            			"payType":1              						//payType默认支付宝、微信  0：不支持易宝支付， 1：支持易宝支付
					},
					"callback":"paySuccReturn"
				});	
				this.$router.go(-1);
			}
		}
	}
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
.box{
	margin-top: 0.26667rem;
	ul{
		margin-left: 0.53333rem;
		li{
			height: 1.2rem;
			line-height: 1.2rem;
			padding-right: 0.53333rem;
			span{
				float:right;
			}
		}
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
.look{
	height: 1.2rem;
	line-height: 1.2rem;
	text-align: center;
}
</style>