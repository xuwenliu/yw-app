<!--我的佣金页面-->
<template>
	<div class="myCommission">
		<y-header><div class="clickMe" @click="goBack"><span></span></div>我的佣金</y-header>
		<Toast :ishow="isShow" @returnshow="changeShow"></Toast>

		<div class="content">
			<div class="money">
				<p class="F3 C1">总佣金(元) 
				<img src="../../../assets/img/twitter/info_note_ic@3x.png" @click="changeShow"> </p>
				<h1 class="money-total C1 fwb">{{money.commissionTotal | currency('',2)}}</h1> 
				
				<router-link tag="button" :to="{'name':'commissionDetails'}">查看明细</router-link>
			</div>
			<ul class="money-list">
				<router-link tag="li" :to="{'name':'commissionRecord'}">
					<div class="money-list-box clearfix bb1">
						<div class="money-left">
							<img src="../../../assets/img/twitter/money_done_ic@2x.png">
							<span class="C1">已结佣</span>
						</div>
						<div class="money-right">
							<span class="F2 C1 fwb">{{money.settledTotal | currency('',2)}}</span> 
							<img src="../../../assets/img/twitter/more_ico@2x.png" alt="">
						</div>
					</div>
					
					
				</router-link>
				<li class="bb1">
					<div class="money-list-box clearfix">
						<div class="money-left">
							<img src="../../../assets/img/twitter/money_wait_pay_ic@2x.png">
							<span class="C1">待结佣</span>
						</div>
						<div class="money-right-dai">
							<div>
								<span class="F2 C1 fwb">{{money.toSettleTotal | currency('',2)}}</span> 
								<p>平台会在每周二结算佣金</p>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import yHeader from '../../../components/Header'
import Toast from '../../../components/Toast'
export default {
  	name: 'myCommission',
  	data() {
	    return {
	      	isShow:false,
	      	money:{},
	    }
  	},
  	components:{
	  	yHeader,
	  	Toast,
  	},
  	methods:{
	  	goBack(){
	    	this.$router.go(-1);
   	},
	   	changeShow(){
	   		this.isShow=!this.isShow;
	   	}
  	},
  	created(){
  		/*模拟数据start*/
  		/*this.money={
  			"toSettleTotal": 0,
    		"settledTotal": 0,
    		"commissionTotal": 0
  		}*/
  		/*模拟数据end*/
  		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
	  	this.$http.get(window.Host.customer+"/twitter/commission").then((res)=>{
	  		console.log(res)
	  		// alert(JSON.stringify(res))
	  		if(res.data.succ){
	  			invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
	  			if(res.data.data){
	  				this.money=res.data.data;
	  			}
	  		}else{
				invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
				didApiError(res);
			}
	  	})
  	}
}
</script>
<style scoped lang="less">

.money{
	width: 100%;
	background-color: #fff;
	margin-bottom: 0.26666rem;
	border-bottom: 1px solid #e6e6e6;
	text-align: center;
	overflow: hidden;
	p{
		margin-top: 0.72rem;
	}
	img{
		width: 0.4rem;
		height: 0.4rem;
		vertical-align: middle;
		margin-left: 0.37333rem;
	}
	button{
		font-size: 0.34666rem;
		width:3.88rem;
		color:rgba(237,49,107,1);
		line-height:0.94666rem;
		border:1px solid #ED316B;
		background:rgba(255,255,255,1);
		border-radius: 0.08rem; 
		margin-bottom: 0.76rem;
	}
}
.money-total{
	font-size:1.0rem;
}
.money-list li{
	padding:0 0.48rem 0 0.61333rem;
	background: #fff;
}
.money-left{
	float: left;
	line-height: 1.65333rem;
	img{
		vertical-align: middle;
		margin-right: 0.58666rem;
		width: 0.52rem;
		height: 0.58666rem;
	}
	span{
		font-size: 0.42666rem;
	}
}
.money-right{
	float: right;
	line-height: 1.65333rem;
	img{
		margin-left: 0.12rem;
		width: 0.18667rem;
		height: 0.34667rem;
	}
	
	
}
.money-right-dai{
	float: right;
	margin-right:0.37333rem;
	text-align: right;
	display: table;
	height: 1.65333rem;
	div {
		display: table-cell;
		vertical-align: middle;
	}
	p{
		color:rgba(115,115,115,1);
		font-size: 0.29333rem;
	}
}
</style>