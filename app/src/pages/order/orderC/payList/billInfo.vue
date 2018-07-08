<!-- http://localhost:8090/#/billInfo?orderId=10&billId=207 这个页面需要orderId和billId-->
<template>
	<div>
		<TopHeader><div class="clickMe" @click="goBack"><span></span></div>账单信息</TopHeader>
		<div class="content">
			<div class="paylist-title bg0">
				<div class="img-box">
					<img :src="orderInfo.companyLogo">
					<h1 class="F8 C1">{{orderInfo.companyName}}</h1>
				</div>
			</div>
			<div class="paylist-list bg0">
				<ul>
					<li class="bb1">
						<div class="div-box F4 C1 clearfix">
							<p><span>项目名称</span></p>
							<p class="textcut">{{orderInfo.orderName}}</p>
						</div>
					</li>

					<li class="bb1">
						<div class="div-box F4 C1 clearfix">
							<p><span>订单类型</span></p>
							<p class="textcut">{{orderInfo.orderTypeDesc}}</p>
						</div>
					</li>

					<li class="bb1">
						<div class="div-box F4 C1 clearfix">
							<p><span>付款用途</span></p>
							<!-- <p class="textcut">{{currentBill.orderBillTypeDesc}}</p> -->
							<p class="textcut">{{currentBill.billContentType==10 ? currentBill.billPhaseTypeDesc : currentBill.billContentTypeDesc}}</p>
						</div>
					</li>

					<li class="bb1">
						<div class="div-box F4 C1 clearfix">
							<p><span>账单金额</span></p>
							<p class="textcut">{{currentBill.totalAmount | currency('',2)}}</p>
						</div>
					</li>

					<!-- orderType 1 = 设计订单，2 = 施工订单-->
					<li class="bb1" v-show="orderInfo.orderType==1">
						<div class="div-box F4 C1 clearfix">
							<p><span>设计师</span></p>
							<p class="textcut">{{relationEmployee.name}}</p>
						</div>
					</li>

			        <li class="bb1" v-show="orderInfo.orderType==2">
			            <div class="div-box F4 C1 clearfix">
			              	<p><span>项目经理</span></p>
			              	<p class="textcut">{{relationEmployee.name}}</p>
			            </div>
			          </li>

					<li class="bb1" v-show="currentBill.billPostscript">
						<div class="div-box F4 C1 clearfix">
							<p><span>说明</span></p>
							<p class="textcut">{{currentBill.billPostscript}}</p>
						</div>
					</li>
				</ul>
			</div>

			<!-- billContentType 8 = 定金，9 = 首款，10 = 阶段款，11 = 尾款-->
			<div class="paylist-list mg bg0">
				<ul><!-- 已支付完成的账单，如果没有使用优惠券，不显示优惠券一栏 -->
					<li class="bb1" v-show="currentBill.status==2&&currentBill.couponUsed==true">
						<div class="div-box F4 C1 clearfix">
							<p><span>优惠券</span></p>
							<p class="textcut"><span>-{{amount}}</span></p>
						</div>
					</li>

					<li class="bb1">
						<div class="div-box F4 C1 clearfix">
							<p><span>已付金额</span></p>
							<p class="textcut F4" >{{(currentBill.prepaidAmount) | currency('',2)}}</p>
						</div>
					</li>
					<!-- status 1 = 未支付，2 = 已支付，5 = 已失效，6 = 已取消 -->
					<li class="bb1">
						<div class="div-box F4 C1 clearfix">
							<p><span>状态</span></p>
							<p class="textcut F4" >{{currentBill.statusDesc}}</p>
						</div>
					</li>

					<li class="bb1" v-show="currentBill.finishTime">
						<div class="div-box F4 C1 clearfix">
							<p><span>付款时间</span></p>
							<p class="textcut F4" >{{currentBill.finishTime | setTime}}</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import TopHeader from '../../../../components/Header'
export default{
	name:"billInfo",
	components:{
		TopHeader
	},
  	data(){
	    return {
	      	orderId:'',//订单Id
	      	billId:'',//账单Id
	      	amount:'',//优惠券金额
	      	orderInfo:{},
	      	currentBill:{},
	      	relationEmployee:{}
	    }
  	},
  	created(){
  		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
	    this.orderId=this.$route.query.orderId,
	    this.billId=this.$route.query.billId;
	    this.orderId&&this.billId?this.getOrderInfo(this.orderId,this.billId):"";
	},
	methods:{
		goBack(){
			invokeNative({"code":window.jsBridge.CODE_CLOSE});
		},
	    /*获取订单付款信息*/
	    getOrderInfo(orderId,billId){
	      	this.$http.get(window.Host.customer+`/order/${orderId}/${billId}`).then((res)=>{
            console.log(res);
	      		if(res.data.succ){
	      			invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
	      			this.orderInfo=res.data.data.orderInfo;
	        		this.currentBill=res.data.data.currentBill;
	        		this.relationEmployee=res.data.data.relationEmployee;
	        		this.amount=res.data.data.currentBill.relationCoupon.amount;

	      		}else {
	      			invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
	      			didApiError(res);
	      		}
	    	})
	    }
	}
}
</script>
<style scoped lang="less">
.paylist-title{
	height:4.16rem;
	text-align:center;
	overflow:hidden;
	.img-box{
		margin-top:0.77333rem;
		img{
			width:1.7rem;
			height:1.6rem;
			border-radius:0.8rem;
		}
		h1{
			margin-top:0.42666rem;
		}
	}
}

.paylist-list{
	margin-top:0.26666rem;
	li{
		height:1.57333rem;
		line-height:1.57333rem;
	}
	.div-box{
		margin:0 0.53333rem;
		width:89.3%;
		p:first-child{
			float:left;
		}
		p:last-child{
			float:right;
			text-align:right;
			img{
				width: 0.2rem;
    			vertical-align: middle;
				margin-left:0.16rem;
			}
		}
	}
}
.mg{
	margin-top:0.26666rem;
	margin-bottom:0.8rem;
}
</style>
