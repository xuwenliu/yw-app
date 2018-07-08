<template>
	<div class="customerdetails">
		<y-header><div class="clickMe" @click="goBack"><span></span></div>客户详情</y-header>
		<div class="content">
			<div class="customerdetails-title clearfix bg0 bb1">
				<div class="left">
					<img :src="titleinfo.headImage">
				</div>
				<div class="center"><h1 class="F4 C1">{{titleinfo.customerName}} <span class="F4 C4">{{titleinfo.customerPhone}}</span></h1></div>
				<div class="right">
					<img src="../../../assets/img/twitter/call_ico@2x.png" @click="callPhone(titleinfo.customerPhone)">
				</div>
			</div>
			<div class="customerdetails-list bg0">
				<ul>
					<li v-for="(item,index) in titleinfo.nodeDescDtos" ref="lih" :key="index">
						<div class="div-box">
							<div class="nav-bar">
								<div class="img-circle" :class="{'img-circle-e5':index==0}"></div>
								<div class="line-v" v-show="index!=titleinfo.nodeDescDtos.length-1" ref="lineVh"></div>
							</div>
							
							<div class="div-content bb1">
								<h1 class="F4" :class="[index==0?'C1':'C5']">
								<span v-if="item.nodeType==0">报备客户</span>
								<span v-else-if="item.nodeType==1">客户和公司已洽谈</span>
								<span v-else-if="item.nodeType==2">客户和公司已完成签约</span>
								<span v-else>完成结佣</span>

								<span v-show="item.signContentTypeDesc">{{item.signContentTypeDesc}}</span>
								<span v-show="item.serialNumber">[编号：{{item.serialNumber}}]</span>
								<span v-show="item.postscript">[备注：{{item.postscript}}]</span>
								<span v-show="item.signAmount">金额：{{item.signAmount | currency("",2)}} </span>
								<span v-show="item.settledAmount">佣金：{{item.settledAmount | currency("",2) || "0.00"}}</span>
								<span v-show="item.toSettleAmount">待结佣：{{item.toSettleAmount | currency("",2)}}</span>
								</h1>
								<p class="F6" :class="[index==0?'C1':'C5']">{{item.nodeTime | setTime}}</p>

							</div>
							<!-- signContentTypeDesc serialNumber signAmount postscript备注 settledAmount已结佣 toSettleAmount待结佣-->
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import yHeader from '../../../components/Header'
export default {
  	name: 'customerDetails',
  	data () {
    	return {
    		titleinfo:[],
    		time:"",
    		title:"",
    		routerName:''
    	}
	},
	components:{
  		yHeader
  	},
 	methods:{
	  	goBack(){
	    	this.$router.go(-1);
	   	},
	   	callPhone(phone){
	   		invokeNative({
	   			"code":window.jsBridge.CODE_CALL_PHONE_NUMBER,
	   			"data":phone
	   		});
	   }
  	},
  	created(){
  		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
  		let twitterCustomerId=this.$route.query.id*1;
  		this.$http.get(window.Host.customer+`/twitter/customer/procedures/${twitterCustomerId}`)
  		.then((res)=>{
  			if(res.data.succ){
  				invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
  				if(res.data.data){
  					console.log(res);
	  				this.titleinfo=res.data.data;
	  				switch(res.data.data.nodeDescDtos.nodeType){
	  					case 0:this.title="报备客户";break;
	  					case 1:this.title="洽谈客户";break;
	  					case 2:this.title="签约客户";break;
	  					case 3:this.title="结佣客户";break;
	  				}
	  				this.$nextTick(()=>{
	  					//动态设置每个竖线的高度为右边每个li的高度
	  					let liLength = this.$refs.lih.length;
	  					for(let i=0;i<liLength;i++){
	  						this.$refs.lineVh[i].style.height=this.$refs.lih[i].clientHeight+"px";
	  					}
	  					
	  				})
  				}
  			}else{
				invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
				didApiError(res);
			}
  		})
  	},
}
</script>

<style scoped lang="less">
.customerdetails-title{
	height:1.89333rem;
	line-height:1.89333rem;
	div{
		float:left;

	}
	.left{
        margin:0 0.53333rem;
        width: 1.06666rem;
        height: 1.06666rem;
        border-radius: 0.53333rem;
        img{
          width: 1.06666rem;
          height: 1.06666rem;
          vertical-align: middle;
        }
    }
    .right{
    	float:right;
    	margin-right: 0.53333rem;
    	img{
    		width:0.46667rem;
    		height:0.48rem;
    		vertical-align:middle;
    	}
    }
}
.customerdetails-list{
	margin-top:0.266666rem;
	ul li{
		.div-box{
			margin:0 0.53333rem 0 0.85333rem;
			padding-left: 0.61333rem;
			padding-top:0.66666rem;
			.nav-bar{
				position: relative;
				left: -0.6rem;
				top: 0.4rem;
				.img-circle{
					width: 0.26667rem;
					height: 0.26667rem;
					background-color: #bbb;
					border-radius:0.13333rem;
				}
				.img-circle-e5{
					background-color: #5e5e5e;
				}
				.line-v{
					// height:3.8rem;
					width:1px;
					background-color:#d2d2d2;
					position: absolute;
					left: 0.115rem;
					top: 0.26rem;
				}
			}
			
			.div-content{
				h1{word-spacing: 0.09333rem;}
				p{margin:0.13333rem 0 0.66666rem;}
			}
		}
	}
}

</style>