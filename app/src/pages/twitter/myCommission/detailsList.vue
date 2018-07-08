<template>
	<div class="">
		<NoFile v-show="!listData.length">
	        <img slot="bgimg" style="width: 3.44rem;height: 3.44rem;" src="../../../assets/img/twitter/no_money_ic@2x.png">
	        <span slot="info" style="display:block;width: 3.45333rem;">您还没有获得{{title}}的佣金</span>
	    </NoFile> 
	    <div class="page-loadmore" v-show="listData.length">
	            <div class="page-loadmore-wrapper" ref="wrapper">
	                <mt-loadmore
	                :top-method="loadTop" 
	                :bottom-method="loadBottom"
	                :bottom-all-loaded="allLoaded"
	                @bottom-status-change="handleBottomChange"
	                @top-status-change="handleTopChange"
	                ref="loadmore"
	                :auto-fill="false"
	                :maxDistance="80"
	                :topDistance="50"
	                :bottomDistance="50"
	                bottomPullText="加载更多"
	                bottomDropText="释放加载"
	                topDropText="释放刷新"
	                topLoadingText="刷新中..."
	                >
	                <div class="detailsList-list" >
				    	<div class="detailsList-list-total clearfix">
					    	<h1 class="fl fwb">合计 {{totalAmount | currency("",2)}}</h1>
					    	<h1 v-show="routeType===1" class="fr fwb">成交笔数 {{dealCount}}</h1>
				    	</div>
				    	<dl v-for="(item,listDataIndex) in listData">
				    		<dt v-show="routeType===1&&item.monthDate" class="clearfix"><p class="fl">{{item.monthDate}}</p><p class="fr">{{item.monthAmount | currency("",2)}}</p></dt>
				    		
				    		<dt v-show="routeType===2&&item.monthDate" class="clearfix"><p class="fl">{{item.monthDate}}</p><p class="fr">{{item.monthAmount | currency("",2)}}</p></dt>
				    		
				    		<dd v-show="routeType===1" class=" bb1" v-for="(i,index) in item.twitterCustomerAmountInfos">
			    				<div class="clearfix bg0 dd-month">
				    				<h1 class="fl">{{i.createTime | setDate}}</h1>
					    			<div class="spread-box fr" @click="clickSpreadList(i.settlementId,listDataIndex,index)">
					    				<span class="fwb">{{i.gainAmount | currency("",2)}}</span>
					    				<img :src="i.isSpread?spreadListStatusArr[1]:spreadListStatusArr[0]"/>
					    			</div>
				    			</div>
				    			
				    			<div v-show="routeType===1 && i.isSpread" class="signing-content" :style="{'paddingTop':item.monthAmount==0?'0.4rem':'0.2rem'}">
					    			<h1 class="signing-content-title" v-show="item.monthAmount==0" :style="{'lineHeight':item.monthAmount==0?'normal':''}">根据您的团队要求，佣金统一划入了团队账户</h1>
					    			<ul>
					    				<li class="clearfix"><p class="fl">签约客户</p><p class="fr">{{signData.customerName}}</p></li>
					    				<li class="clearfix"><p class="fl">签约日期</p><p class="fr">{{signData.signDate | setDate}}</p></li>
					    				<li class="clearfix"><p class="fl">签约类型</p><p class="fr">{{signData.signTypeDesc}}</p></li>
					    				<li class="clearfix"><p class="fl">签约金额</p><p class="fr">{{signData.signAmount | currency("",2)}}</p></li>
					    			</ul>
					    		</div>
				    		
				    		</dd>
				    		
				    		<dd v-show="routeType===2" v-for="i in item.childTwitterAmountInfoDtos" class="clearfix bb1 fromTwitter" style="line-height: normal;"  >
				    			<div class="fl left"><span><img :src="i.twitterHead?i.twitterHead:i.showHead"/></span></div>
				    			<div class="fl center">
				    				<p>{{i.twitterName}}&nbsp;&nbsp;<span class="F7 C0" :class="[i.level==1?'bg1':'bg2']">{{i.level}}级</span></p>
				    			</div>
				    			<div class="fr right">
				    				<div>
				    					<h2>{{i.gainAmount | currency("",2)}}</h2>
				    					<p>{{i.createDate | setDate}}</p>
				    				</div>
				    				
				    			</div>
				    		</dd>
				    		
				    	</dl>
				    </div>
	              
	                </mt-loadmore>
	            </div>
	        </div>
	    
	    
	    
	</div>
</template>

<script>
	import NoFile from '../../../components/NoFile'
export default {
	name: '',
	components: {
		NoFile,
	},
	data() {
		return {
			
			title:"",
			routeType:1,//路由类型 1=来自报备客户，2=来自下级推客
			isSpread:false,
			spreadListStatusArr:[require('../../../assets/img/twitter/close_list_ic@2x.png'),require('../../../assets/img/twitter/open_list_ic@2x.png')],
			
			allLoaded: false,
        	bottomStatus: '',
        	topStatus:"",
        	page:1,					//当前页数
			pageSize:20,			//每页请求的条数
			totalPage:0,			//总页数
			
			totalAmount: 0,//佣金合计
			dealCount: 0,// 成交笔数
			listData:[],
			signData:{},
			iNowSpread:0,
			
		}
	},
	created() {
		/*模拟数据-start*/
		/*this.signData={
		    "settlementId": 0,
		    "customerName": "宁采臣",
		    "signDate": 1511166783000,
		    "signType": 1,
		    "signTypeDesc": "软装设计",
		    "signAmount": 666.36
		}
		/*模拟数据-end*/
		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
		let routeName=this.$route.name;
        if(routeName=="fromRemarkCustomer"){
            this.title="来自报备客户";
            this.routeType=1;
           
        }else if(routeName=="fromTwitter"){
        	this.routeType=2;
        	
            this.title="来自下级推客";
        }
        this.getDataList(this.routeType);
	},
	mounted() {

		this.$nextTick(function () {  

			$(".mint-loadmore").css({
				"overflow":"visible"
			})
            $(".mint-loadmore-top").css({
            	"font-size":"0.37333rem"
            });
            $(".mint-loadmore-bottom").css({
            	"font-size":"0.37333rem"
            }).hide();
			
        });  
	},
	methods: {
		
		getDataList(type) {
			if(type===1){//来自报备客户
				//https://devcustomer.yingwumeijia.com:443/{version}/twitter/commission/customer?pageNum=1&pageSize=20
				var api = window.Host.customer+`/twitter/commission/customer?pageNum=${this.page}&pageSize=${this.pageSize}`;
			}else {//来自下级推客
				//https://devcustomer.yingwumeijia.com:443/{version}/twitter/commission/child?pageNum=1&pageSize=20
				var api = window.Host.customer+`/twitter/commission/child?pageNum=${this.page}&pageSize=${this.pageSize}`;
			}
			this.$http.get(api).then((res)=>{
				console.log(res)
		  		if(res.data.succ){
		  			invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
		  			if(res.data.data){
		  				this.totalAmount = res.data.data.totalAmount;
		  				this.routeType===1?this.dealCount = res.data.data.dealCount:this.dealCount="";
		  				this.routeType===1?this.onResponseList(res.data.data.commisionDtoMap):this.onResponseList(res.data.data.childTwitterCommisionDtoMap);
		  				
		
		  			}
		  		}else{
					invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
					didApiError(res);
				}
		  	})
		},
		clickSpreadList(settlementId,listDataIndex,index) {
			console.log(listDataIndex)
			console.log(index)
			if (this.listData[listDataIndex].twitterCustomerAmountInfos[index].isSpread=="undefined") {
				this.$set(this.listData[listDataIndex].twitterCustomerAmountInfos[index], 'isSpread', true);
			} else {
				this.getNodeInfo(settlementId);
				this.listData[listDataIndex].twitterCustomerAmountInfos[index].isSpread = !this.listData[listDataIndex].twitterCustomerAmountInfos[index].isSpread;
				
			}
		},
		getNodeInfo(settlementId) {
			//https://devcustomer.yingwumeijia.com:443/{version}/twitter/456/nodeInfo
			this.$http.get(window.Host.customer+`/twitter/${settlementId}/nodeInfo`).then((res)=>{
				console.log(res)
		  		if(res.data.succ){
		  			if(res.data.data){
		  				this.signData = res.data.data;
		  			}
		  		}else{
					didApiError(res);
				}
		  	})
		},
		loadTop() {
			this.page = 1;
          	setTimeout(() => {
          		this.getDataList(this.routeType);
                this.$refs.loadmore.onTopLoaded();
                $(".mint-loadmore-bottom").hide();
                this.allLoaded = false;
            }, 1500);
        },
        onResponseList(result) {
			if (this.page == 1) {
				this.listData = result || [];
			}else{
				if(result){
					$(".mint-loadmore-bottom").hide();
					var lastMonth = this.listData[this.listData.length-1].monthDate;
					var firstMonth = result[0].monthDate;
					if(lastMonth==firstMonth){
						delete result[0].monthDate;
					}
					this.listData=this.listData.concat(result);
					this.allLoaded = false;
					
				}else {
					$(".mint-loadmore-bottom").hide();
					this.allLoaded = true;
				}
			}
		},
		handleTopChange(status) {
			this.topStatus = status;
		},
        //mint-ui 上拉加载
		handleBottomChange(status) {
        	this.bottomStatus = status;
        	$(".mint-loadmore-bottom").show();
    	},
    	loadBottom() {
	        this.page += 1;
            setTimeout(() => {
          		this.getDataList(this.routeType);
                this.$refs.loadmore.onBottomLoaded();
            }, 1500);
    	},
	},//methods结束
}
</script>

<style scoped lang="less">

.nofile{
	margin: 3.46666rem 0 0 -1.72666rem;
}
.detailsList-list {
	/*padding-top: 1.2rem;*/
	.detailsList-list-total {
		padding: 0 0.42666rem 0 0.64rem;
		line-height: 1.29333rem;
		height: 1.29333rem;
		font-size: 0.42666rem;
		color: #282828;
	}
	dl {
		dt{
			height: 0.65333rem;
			line-height: 0.65333rem;
			background-color: #9E9E9E;
			padding: 0 0.42666rem 0 0.64rem;
			font-size: 0.37333rem;
			color:rgba(255,255,255,1);
		}
		dd.fromTwitter{
			padding: 0 0.42666rem 0 0.64rem;
			background-color: #fff;
		}
		dd{
			
			line-height: 1.33333rem;
			font-size: 0.4rem;
			color:rgba(40,40,40,1);
			.dd-month {
				padding: 0 0.42666rem 0 0.64rem;
			}
			.spread-box {
				img{
					width: 0.34666rem;
					height: 0.18666rem;
					margin-left: 0.29333rem;
					
				}
			}
			.left{
				/*padding-top: 0.28rem;*/
				display: table;
    			height: 1.62666rem;
				margin-right: 0.38666rem;
				span{
					display:table-cell;
					vertical-align: middle;
					img{
						display: block;
						width: 1.08rem;
						height: 1.08rem;
						border-radius: 50%;
					}
				}
				
			}
			.center{
				line-height: 1.62666rem;
				p{
					span{
						padding: 0 0.15rem;
					}
				}
			}
			.right{
				text-align: right;
				display: table;
				height: 1.62666rem;
				div {
					display:table-cell;
					vertical-align: middle;
					h2{
						color:rgba(40,40,40,1);
						font-size: 0.4rem;	
						}
					p{
						color:rgba(115,115,115,1);
						font-size: 0.32rem;
					}
				
				}
				
			}
			.signing-content{
				margin: 0.29333rem 0.28rem 0.26666rem 0.29333rem;
				padding-top: 0.4rem;
				background-color: #fff;
				.signing-content-title{
					text-align: center;
					font-size: 0.29333rem;
					color:rgba(115,115,115,1);
				}
				ul{
					padding: 0 0.37333rem 0.41333rem 0.4rem;
					font-size: 0.37333rem;
					color:rgba(40,40,40,1);
					li{
						margin-top: 0.29333rem;
						    line-height: normal;
					}
				}
			}
			
		}
		
	}
}
.bg1{
	background:rgba(253,65,127,1);
	opacity:0.38;
}
.bg2{
	background:rgba(206,126,207,1);
	opacity:0.38;

}
</style>