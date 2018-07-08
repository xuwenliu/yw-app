<template>
	<div class="materialSubsidy">
		<TopHeader>
			<div class="clickMe" @click="goBack"><span></span></div>
			<div>主材补贴</div>
		</TopHeader>

		<!-- 弹出侧边栏 -->
		<slideBar :show="isFade" :choosePosition.sync="choosePosition" :brandTypes.sync="brandTypes"  @returnShow="returnshow" @brandId="brand"></slideBar>
		<!-- 主体内容 -->
		<div class="materialSubsidy-content">
			<div class="materialSubsidy-box">
				<!-- 背景图片和如何获取补贴 -->
				<div class="materialSubsidy-bgbox">
					<img class="img1" src="../../../assets/img/material/zc_info@2x.png">
					<img class="img2" @click="isToast=!isToast" src="../../../assets/img/material/get_zcbt_bt@2x.png">
					<div class="caozuoDes" @touchmove.prevent v-show="isToast">
						<div class="caozuo-box">
							<img class="img3" src="../../../assets/img/material/get_zcbt_details_txt@2x.png">
							<img @click="isToast=!isToast" class="img4" src="../../../assets/img/material/close_ic@2x.png">
						</div>
					</div>
				</div>
				<!-- 吸顶部分 -->
				<div class="xiding-outbox" ref="xid">
					<div class="xiding-innerbox" :class="{'xiding':isFixed}">
						<div class="help" @click="callHandleService(customerServicePhone)">
							<p class="F3 C0">
								<img src="../../../assets/img/material/customer_service_ic@2x.png">
								如需帮助，点击咨询人工服务
							</p>
						</div>
						<div class="search">
							<div class="search-box">
								<div class="search-input">
									<input class="F4 C1" type="text" maxlength="30"
								placeholder="输入品牌名称搜索" v-model.trim="queryKey">
								</div>
								<a class="search-btn F4 C0" @click="search">搜索</a>
							</div>
							<button class="F4 C0 find" @click="isFade=!isFade">查找我要的品类
								<p></p>
							</button>
						</div>
					</div>
				</div>
				<!-- 有数据显示内容 -->
				<div class="list-box" v-if="listData && listData.length!=0">
						<div class="page-loadmore">
				            <div class="page-loadmore-wrapper" ref="wrapper">
				                <mt-loadmore
				                :bottom-method="loadBottom"
				                :bottom-all-loaded="allLoaded"
				                @bottom-status-change="handleBottomChange"
				                ref="loadmore"
				                :max-distance="80"
				                >
				                <ul>
				                    <li v-for="(item,index) in listData" :key="item.id">
				                        <div class="logo-box">
				                            <img :src="item.logo">
				                            <router-link :to="{'name':'getSubsidy',query:{'materialId':item.id}}"
				                            class="F5 C1">获取补贴</router-link>
				                        </div>
				                    </li>
				                </ul>
				                <div slot="bottom" class="mint-loadmore-bottom" style="font-size:0.37333rem;">
				                 	<span v-show="bottomStatus === 'pull'">上拉加载</span>
							      	<span v-show="bottomStatus === 'drop'">释放加载</span>
							      	<span v-show="bottomStatus === 'loading'">
							      		<Spinner type="fading-circle" :size="20"></Spinner>&nbsp;加载中...
							      	</span>
							    </div>
				                </mt-loadmore>
				            </div>
				        </div>
				</div>
				<!-- 无数据显示内容 -->
				<div class="noList" v-else>
					<img src="../../../assets/img/material/search_no_logo_ic@2x.png">
					<p class="F4 C5">抱歉，未找到相关品牌</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import TopHeader from '../../../components/Header'
import slideBar from './slideBar'

export default{
	name: 'materialSubsidy',
	components: {
		TopHeader,
		slideBar
	},
	data() {
		return {
			//首页轮播图点击链接过来加了source=1，表示该页面不需要title，因为原生的有title了。
			source:this.$route.query.source*1 || getHashString("source"),
			cityId:"",//首页存储的cityId
			isFade:false, 			//控制侧边导航
			isFixed:false,			//控制吸顶菜单
			isClick:false,			//控制城市选择
			isToast:false,			//控制操作说明

			customerServicePhone:"",//客服电话
			listData:[],			//列表数据
			brandTypes:[],			//品牌数据


			queryKey:"",			//搜索关键字品牌
			brandId:0,				//品牌Id
			page:1,					//当前页数
			pageSize:10,			//每页请求的条数
			totalPage:0,			//总页数

			allLoaded: false,
        	bottomStatus: '',
        	isSearch:false,			//搜索按钮是否点击
        	isBrand:false,			//筛选按钮是否点击
        	isPosition:false,    	//是否走定位
          	choosePosition:0,		//1表示点击切换城市将筛选里面的品牌按钮选择为全部选中
		}
	},
	mounted() {
		var _this = this;
	    //vue-首页存储的cityId
		invokeNative({
			"code":window.jsBridge.CODE_EXTRACT,
			"data":"cityId",
			"callback":"returnData"
		})
		window.returnData = function(value) {
			var value=window.atob(value);
	        var res = JSON.parse(value);
//	        alert(JSON.stringify(res));
	        _this.cityId = res.data;
	        invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
			_this.getDataList();
			_this.getBrandTypeList();
		}



		this.$nextTick(() => {
			window.addEventListener('scroll',this.ceiling);
		})
	},
	methods: {
  		messageHint(data){
  			invokeNative({"code":window.jsBridge.CODE_TOAST,"data":data});
  		},
		goBack() {
			// v1.7.0、v1.8.0
			invokeNative({"code": window.jsBridge.CODE_CLOSE});
		},
		//打电话人工服务
		callHandleService(phone) {
			invokeNative({"code":window.jsBridge.CODE_CALL_PHONE_NUMBER,"data":phone});
		},
		//搜索
		search() {
			this.isSearch=true;
			this.brandId = 0;
			this.page = 1;
			this.getDataList();
		},
		//点击侧边菜单栏组件-->隐藏菜单栏
		returnshow() {
			this.isFade=!this.isFade;
		},
		//筛选品牌
		brand(bid) {
			this.isBrand=true;
			this.brandId = bid;
			this.queryKey="";
			this.page = 1;
		    this.choosePosition=0;
		    this.getDataList();
		},
		//吸顶
		ceiling() {
			//获取body滚动高度
			var bodyTop=window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			//获取被吸顶元素距离顶部的高度
			var xidH=this.$refs.xid.offsetTop;
			if(bodyTop>=xidH) {
				this.isFixed=true;
			}else{
				this.isFixed=false;
			}
		},
		//处理搜索和筛选吸顶菜单是否吸顶
		dealWithFixed(result){
			if(!result) return;
			if(this.isFixed==true&&result.length>3){
				this.isFixed=true;
			}else{
				this.isFixed=false;
			}
		},
		//获取主材品牌数据
		getBrandTypeList() {
	    	this.$http.get(window.Host.customer + `/material/brandType?cityId=${this.cityId}`).then((res) => {
		        console.log(res);
		        if(res.data.succ) {
		        	if(res.data.data){
		        		this.brandTypes = res.data.data;
		        	}else{
		        		this.brandTypes = [];
		        	}

		        }else{
		            if(res.data.stateCode != 312 && res.data.stateCode != 317) {
		              	this.messageHint(res.data.message);
		            }
		        }
		    })
	    },
		//获取主材列表数据
		getDataList() {
			this.$http.get(window.Host.customer+"/material/query/material",{
				params:{
					cityId:this.cityId,
					queryKey:this.queryKey,
					brandId:this.brandId,
					pageNum:this.page,
					pageSize:this.pageSize
				}
			}).then((res) => {
				console.log(res)
				if(res.data.succ){
					var data=res.data.data;
						this.customerServicePhone=data.phone;
						this.totalPage=data.materialDtos.totalPageNum;
						this.onResponseList(data.materialDtos.result);
						if(this.isSearch==true || this.isBrand==true){
							this.dealWithFixed(data.materialDtos.result);
						}
				}else{
					if(res.data.stateCode != 312 && res.data.stateCode != 317) {
		              	this.messageHint(res.data.message);
					}
		        }
			})
		},
		//处理主材列表数据、上拉加载更多数据处理
		onResponseList(result) {
			if (this.page == 1) {
				this.listData = result;
			}else{
				if(this.totalPage>1) {
					this.listData=this.listData.concat(result);
				}
			}
		},
		//mint-ui 上拉加载
		handleBottomChange(status) {
        	this.bottomStatus = status;
    	},
    	loadBottom() {
			// if(this.totalPage==1){
			// 	this.allLoaded = true;
			// }
	        this.page += 1;
	        // if(this.page == this.totalPage) {
	        //     this.allLoaded = true;
	        // }
            setTimeout(() => {
            	this.getDataList();
                this.$refs.loadmore.onBottomLoaded();
            }, 1500);
    	},
	},//methods结束
	//下面路由处理是去获取补贴页面后返回到主材补贴页面之前点击的位置
	beforeRouteLeave(to,from,next) {
		//离开的时候保存body的滚动高度
		this.scroll=document.body.scrollTop;
		to.meta.keepAlive = false;
		next();
	},
	beforeRouteEnter(to,from,next){
		//进入的时候设置body的滚动高度
		next(vm => {
			if(from.name=="getSubsidy"){
				document.body.scrollTop=vm.scroll;
			}
		})
	},


}
</script>
<style scoped lang="less">
/*覆盖样式start*/
.title{position: fixed;}
.mint-loadmore-bottom span {
    display: inline-block;
    vertical-align: middle
}
/*覆盖样式end*/
/*header里面的城市按钮*/
.city{
	position: absolute;
	display: inline-block;
	margin-left: 0.21333rem;
	i{
		margin-right: 0.08rem;
	}
	img.rotate{
		transform: rotateZ(180deg);
		transition: all .5s;
	}
}
/*弹框的城市列表*/
.toast-city{
	position: fixed;
	top: 0;left: 0;right: 0;bottom: 0;
	background-color: rgba(0,0,0,0.6);
	z-index: 999999999999999;
	ul{
		position: absolute;
		top: 1.7rem;
		left: 50%;
		margin-left: -2.41333rem;
		width: 4.82667rem;
		background-color: #fff;
		border-radius: 6px;
		li{
			height: 1.48rem;
			line-height: 1.48rem;
			text-align: center;
		}
		.sanjiao{
		    width:0;
		    height:0;
		    overflow:hidden;
		    border-width:10px;
		    border-color:transparent transparent #fff transparent;
		    border-style: dashed dashed solid dashed;
			position: absolute;
			top: -20px;
			left: 50%;
			margin-left: -10px;
		}
		.line{
			width: 4.29333rem;
			height: 1px;
			background-color: #e6e6e6;
			position: absolute;
			top: 1.48rem;
			left: 0.26667rem;
		}
	}
}
/*主材内容*/
.materialSubsidy-content{
	position: absolute;
	top: 1.2rem;
	left: 0;
	width: 100%;
	.materialSubsidy-box{
		.materialSubsidy-bgbox{
			width: 100%;
			height: 12.32rem;
			background: url("http://osz2pnx97.bkt.clouddn.com/zc_bg@2x.png") no-repeat left center;
			background-size: cover;
			position: relative;
			.img1{
				width: 7.97333rem;
				position: absolute;
				top: 1.92rem;
				left: 50%;
				margin-left: -3.98667rem;
			}
			.img2{
				width: 5.16rem;
				position: absolute;
				top: 8.52rem;
				left: 50%;
				margin-left: -2.58rem;
			}
			.caozuoDes{
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 999;
				background: rgba(0,0,0,0.7);
				.caozuo-box{
					position: relative;
					background-color: #fff;
					width: 90.6%;
					border-radius: 0.06667rem;
					margin: 1.84rem auto 0;
					border: 1px solid transparent;
					.img3{
						width: 80%;
						display: block;
						margin:0.93333rem auto;
					}
					.img4{
						position: absolute;
						width: 0.8rem;height: 0.8rem;
						top: -0.3rem;
						right: -0.3rem;
					}
				}

			}
		}
	}
	/*吸顶部分*/
	.xiding-outbox{
		height: 3.68rem;
		.xiding-innerbox{
			.help{
				width: 100%;
				height: 1.78667rem;
				line-height: 1.78667rem;
				background-color: #282828;
				p{
					display: inline-block;
					position: absolute;
					left: 50%;
					margin-left: -3.04rem;
					img{
						width: 0.92rem;
						height: 0.74667rem;
						position: relative;
						top: 0.2rem;
						margin-right: 0.21333rem;
					}
				}
			}
			.search{
				background-color: #fff;
				padding: 0.50667rem 0.29333rem;
				border-bottom: 1px solid #e6e6e6;
				display: flex;
				justify-content:space-between;
				.search-box{
						display: flex;
						width:58%;
					.search-input{
						border:1px solid #282828;
						border-right: none;

						height: 0.8rem;
						border-radius: 0.08rem 0 0 0.08rem;
						overflow: hidden;
						input{
							display: block;
							box-sizing: border-box;
							width: 100%;
							height: 0.8rem;
							padding-left: 0.21333rem;
							border-radius: 0.08rem 0 0 0.08rem;
						}
					}
					.search-btn{
						border-radius: 0 0.08rem 0.08rem 0;
						border:1px solid #282828;
						height: 0.8rem;
						line-height: 0.8rem;
						width: 1.2rem;
						text-align: center;
						background-color: #282828;
					}
					.search-btn:active {
		  				opacity: 0.5;
					}
				}

				.find{
					background-color: #ed316b;
					height: 0.85rem;
					width: 40%;
					border-radius: 0.08rem;
					border:1px solid #ed316b;
					p{
						display: inline-block;
						width: 0.21333rem;
			            height: 0.21333rem;
			            border:1px solid ;
			            background: transparent;
			            border-color: #fff #fff transparent transparent;
			            transform:rotateZ(45deg);
					}
				}
			}
		}
		.xiding{
			position: fixed;
			top: 1.2rem;
			left: 0;
			z-index: 99;
			width: 100%;
		}
	}
	/*有数据列表+加载更多*/
	.list-box{
		padding:0.24rem;
		background-color: #f5f5f5;
		.page-loadmore{
			    ul{
			        li{
			            background-color: #fff;
			            width: 99%;
			            text-align: center;
			            overflow-y: hidden;
			            border:1px solid #e6e6e6;
			            margin-bottom: 0.24rem;
			            .logo-box{
			                margin:0.4rem auto 0.53333rem;
			                width: 5.01333rem;
			                img{
			                    width: 5.01333rem;
			                    height: 2.10667rem;
			                    display: block;
			                }
			                a{
			                    padding:0.13333rem 0.4rem;
			                    border: 1px solid #a8a8a8;
			                    border-radius: 0.8rem;
			                    margin-top: 0.18667rem;
			                    display: inline-block;
			                }
			            }
			        }
			        li:last-child{
			           	margin-bottom:0;
			        }
			    }
			}
	}
/*	没有数据*/
	.noList{
			text-align: center;
			margin:1.52rem auto 6.4rem;
			width: 3.8rem;
			img{
				width: 100%;
				display: block;
				margin-bottom: 0.74667rem;
			}
	}
}
</style>
