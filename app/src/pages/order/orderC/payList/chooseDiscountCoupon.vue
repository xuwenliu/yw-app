<template>

<div>
	<TopHeader><div class="clickMe" @click="goBack"><span></span></div>选择优惠券</TopHeader>
	<BottomFooter><div class="F3 C0" @click="ensure">确认</div></BottomFooter>
	<div class="content btm">
		<div class="use bg0 F4 C1" @click="goUseDiscountCoupon">了解使用说明，玩转平台优惠
			<img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
		</div>
		<div class="discountCoupon">
			<ul>
				<li class="clearfix bg0 " v-for="(item,index) in couponEntryVo" :class="{'choose':index==inow}" @click="tab(index,item.amount,item.id)" :style="{'margin-bottom':'0.48rem'}">
					<div class="left">
						<h1 class="C0 fwb"><span class="F5 C0">￥&nbsp;</span>{{item.amount}}</h1>
						<p class="F4 C0">{{item.typeDesc}}</p>
					</div>
					<div class="right">
						<img class="ok" src="../../../../assets/img/order/choice_ico.png">
						<div>
							<p class="F3 C1 fwb">{{item.name}}</p>
							<h2 class="F6 C4 textcut">{{item.description}}</h2>
							<p class="F6 C1">
								<img src="../../../../assets/img/order/time_ico@2x.png">
								<span v-if="item.endTime">{{item.beginTime | setDate}}-{{item.endTime | setDate}}</span>
								<span v-else>永久有效</span>
							</p>
						</div>
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
export default{
	name:"chooseDiscountCoupon",
	components:{
		TopHeader,
		BottomFooter
	},
	data(){
		return {
			inow:0,
			orderType:'',
			billId:'',			//账单id
			couponEntryVo:[],	//存放优惠券信息
			amount:'',			//优惠券金额
			discountCouponid:'',//优惠券id
			inType:'' 			//1=从订单详情来 2=聊天详情来 无=扫码来
		}
	},
	methods:{
		goBack(){
			if(this.inType==1){
				this.$router.replace({"name":"payList",
					query:{"orderId":this.$route.query.orderId*1,
						"billId":this.$route.query.billId*1,
						"inType":1
					}
				})
			}else{
				this.$router.replace({"name":"payList",
					query:{"orderId":this.$route.query.orderId*1,
						"billId":this.$route.query.billId*1
					}
				})
			}
		},
		goUseDiscountCoupon(){
			this.$router.push({"name":"useDiscountCoupon"});
		},
		ensure(){
			if(this.inType==1){
				this.$router.replace({"name":"payList",
					query:{"orderId":this.$route.query.orderId*1,
						"billId":this.$route.query.billId*1,
						"couponId":this.discountCouponid,
						"amount":this.amount*1,
						"inType":1
					}
				})
			}else{
				this.$router.replace({"name":"payList",
					query:{"orderId":this.$route.query.orderId*1,
						"billId":this.$route.query.billId*1,
						"couponId":this.discountCouponid,
						"amount":this.amount*1
					}
				})
			}
		},
		tab(idx,amount,discountCouponid){
			this.inow=idx;
			this.amount=amount;
			this.discountCouponid=discountCouponid;
		}
	},
	created(){
		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
		this.inType=this.$route.query.inType;
		this.orderType=this.$route.query.orderType;
		this.billId=this.$route.query.billId;
		this.$http.get(window.Host.customer+`/coupon/canPay?orderType=${this.orderType}&billId=${this.billId}`).then((res)=>{
			if(res.data.succ){
				invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
				this.amount=res.data.data[0].amount;
				this.discountCouponid=res.data.data[0].id;
				this.couponEntryVo=res.data.data;
			}else {
      			invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
      			didApiError(res);
      		}
		})
	}
}
</script>
<style scoped lang="less">

.btm{bottom:1.2rem;}
.use{
	height:1.2rem;
	line-height:1.2rem;
	margin:0.4rem 0.4rem 0.48rem;
	text-align:center;
	border: 1px solid #e6e6e6;
	img{
		vertical-align: middle;
		margin-left:0.21333rem;
		width:0.2rem;
	}
}
.discountCoupon{
	margin:0 0.4rem;
	ul li{
		height:3.14666rem;
		border:2px solid transparent;
		.left {
			background-color:#ed316b;
			width:36%;
			float: left;
			text-align:center;
			height:3.14666rem;
			h1{
				font-size:0.74666rem;
				margin:0.74666rem 0 0.56rem 0;
			}
		}
		.right{
			height:3.14666rem;
			width:64%;
			float:right;
			position:relative;
			.ok{
				position:absolute;
				bottom:0;right:0;
				display:none;
			}
			div{
				margin:0.4rem 0.4rem 0 0.34666rem;
				p{
					width:6rem;
					line-height:0.5rem;
					overflow: hidden;
					text-overflow:ellipsis;
				    display: -webkit-box;
				    -webkit-line-clamp: 2;
				    -webkit-box-orient: vertical;
				}
				h2{
					margin:0.32rem 0;
					width:6rem;
				}
				p img{
					width:0.32rem;
					height:0.32rem;
					vertical-align:middle;
					margin-right: 0.13333rem;
				}
			}
		}
	}
	ul li.choose{
		border:2px solid #ed316b;
		.ok{
			display:block;
		}
	}
}
</style>
