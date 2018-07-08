<template>
	<div class="giveADeposit">
		<y-header><div class="clickMe" @click="goBack"><span></span></div>支付定金</y-header>
		<div class="content">
			<div v-show="depositServiceName.deposit" class="payMoney C1">￥<span>{{depositServiceName.deposit | currency("",2)}}</span></div>
			<div class="giveADeposit-service F3 bb1">
				所选服务 <span class="C6 textcut">{{depositServiceName.serviceName}}</span>
			</div>
			<div class="giveADeposit-security F3 C1 bb1">
				<h1><p @click="checkSecurity"><img :src="checkImgDefault">平台保障</p><span>平台四方监管</span> </h1>
				<h1><span>在线安全付款</span></h1>
				<h1><span>资金先行赔付</span></h1>
			</div>
			<div class="giveADeposit-hint F6 C4 bb1" :class="{'C6':checkImgDefault==checkImg[0]}">
				若取消勾选则只是购买独立监理，您将无法获得平台提供的上述保障
			</div>
		</div>
		<y-footer><a class="F3 C0" style="display:block;" @click="goPay">去支付</a></y-footer>
	</div>
</template>

<script>
import yHeader from '../../components/Header'
import yFooter from '../../components/Footer'
export default {
	name: 'giveADeposit',
	components: {
		yHeader,
		yFooter,
	},
	data() {
		return {
			checkImg:[
				require("../../assets/img/safeguard/gray_choice_ic@2x.png"),
				require("../../assets/img/safeguard/choice_light_ic@2x.png")
			],
			checkImgDefault:'',
			serviceId:0,
			depositServiceName:{
			    // "serviceId": 0,
			    // "deposit": 1000,
			    // "serviceName": "监理请问娃娃教红旗街来旗街来旗街来计划我还"
			},
		}
	},
	created() {
		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
		this.checkImgDefault=this.checkImg[1];
		this.serviceId = this.$route.query.serviceId*1;
		this.getDepositServiceName();
	},
	methods: {
		goBack(){
           invokeNative({"code":window.jsBridge.CODE_CLOSE});
        },
        checkSecurity() {
        	if(this.checkImgDefault==this.checkImg[1]){
        		this.checkImgDefault=this.checkImg[0];
        	}else{
        		this.checkImgDefault=this.checkImg[1];
        	}
        },
        getDepositServiceName() {
        	this.$http.get(window.Host.customer+`/v1080/supervisor/generateOrderBase?serviceId=${this.serviceId}`).then((res)=>{
				if(res.data.succ){
					invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
					console.log(res);
					if(res.data.data){
						this.depositServiceName=res.data.data;
					}
				}else{
					invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
					didApiError(res);
				}
			})  
        },
        goPay(){
        	let isChecked=true;
        	(this.checkImgDefault==this.checkImg[1]) ? isChecked=true : isChecked=false;
        	console.log("-------------"+this.serviceId+isChecked)
        	this.$http.post(window.Host.customer+`/v1080/supervisor/goPay?serviceId=${this.serviceId}&supervisor=${isChecked}`).then((res)=> {
        		console.log(JSON.stringify(res));
	    		if(res.data.succ){
//	    			alert(res.data.data);
	    			console.log(res.data.data*1);
	    			localStorage.safeguardBillId=res.data.data*1;
	    			
    				/*invokeNative({
						"code":window.jsBridge.CODE_ORDER_BILL_PAY,
						"data":res.data.data*1,
						"callback":"paySuccReturn"
					});	*/
					invokeNative({
						"code":window.jsBridge.CODE_PAY,
						"data":{
							"billId":res.data.data*1,           	//帐单id，数值类型
	            			"payType":1              						//payType默认支付宝、微信  0：不支持易宝支付， 1：支持易宝支付
						},
						"callback":"paySuccReturn"
					});	
    			}else {
    				didApiError(res);
    			}
    		})
    		var that=this;
			window.paySuccReturn=function(value){
				var value = window.atob(value);
        		value = JSON.parse(value);
        		if(value.data){
        			that.$router.push({"name":"paySuccess",query:{"billId":localStorage.safeguardBillId*1}});
        		}
			}
        },   
	},//methods结束
}
</script>

<style scoped lang="less">
.content{
	bottom:1.2rem;
	.payMoney{
		height: 3.73333rem;
		line-height: 3.73333rem;
		background-color: #fff;
		font-size: 0.77333rem;
		text-align: center;
		span{
			font-size: 1.28rem;
		}
	}
	.giveADeposit-service{
		margin-top: 0.26667rem;
		padding: 0 0.69333rem;
		height: 1.33333rem;
		line-height: 1.33333rem;
		background-color: #fff;
		span{
			width: 78%;
			float: right;
			text-align: right;

		}
	}
	.giveADeposit-security{
		background-color: #fff;
		padding: 0 0.69333rem;
		h1{
			height: 1.09333rem;
			line-height: 1.09333rem;
			p{
				display: inline-block;
				img{
					width: 0.45333rem;
					height: 0.45333rem;
					vertical-align: middle;
					margin-right: 0.21333rem;
				}
			}
			
			span{
				float: right;
			}
		}
	}
	.giveADeposit-hint{
		box-sizing: border-box;
		height: 1.33333rem;
		background-color: #fff;
		padding: 0.2rem 0.69333rem;
	}
}
</style>