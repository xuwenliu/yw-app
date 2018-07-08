<template>
	<div>
		<header class="bb1 pr">
			<div class="city" @click="showCity">
				<span>
					<i class="F5 C1">{{selectCity}}</i>
					<img src="../../assets/img/index/home_open_map_ic.png" :class="{'rotate':up}">
				</span>
			</div>

			<div class="quote-btn">
				<a @click="goQuotation" class="clearfix">
					<i class="fl F6"><img src="../../assets/img/index/home_top_jsq_ic.png" alt="" />专家免费装修报价</i>
					<i class="fr F7">立即申请<img src="../../assets/img/index/home_top_more_ic.png" alt="" /></i>
				</a>
			</div>
			<!--<div id="message" @click="cancelMessage" class="message fr">
				<!--<p v-show="haveMessage" class="red-circle"></p>-->
				<!--<img v-show="!haveMessage"	src="../../assets/img/index/message_ic.png" alt="" />
				<img v-show="haveMessage" src="../../assets/img/index/message_bubble_ic.png" alt="" />
			</div>-->
		</header>

		<!-- 弹出城市选择列表 -->
		<div class="toast-city" @touchmove.prevent v-show="isClickCity" @click="isClickCity=false">
			<ul>
				<i class="sanjiao"></i>
				<i class="line"></i>
				<li class="F8 C1"
				:class="{'C6':index==inow}"
				v-for="(item,index) in city"
				@click="chooseCity(index,item.shortName,item.id)"
				:data-cityId="item.id">{{item.shortName | addSpace}}</li>
			</ul>
		</div>
		<!--联系客服-->
		<div class="service" @click="callPhone">
			<img src="../../assets/img/index/home_service_ic.png" alt="" />
		</div>


		<div class="content">
			<!--轮播图-->
			<div class="lunbo">
				<mt-swipe :auto="6000">
				  	<mt-swipe-item v-for="item in lunboImgArr" :key="item.url"><a @click="goLunboUrl(item.url,item.title)"> <img :src="item.image" alt="" /> </a></mt-swipe-item>
				</mt-swipe>
			</div>
			<!--找设计，施工，优惠，保障-->
			<div class="find bg0">
				<div class="find-list">
					<ul>
						<li v-for="(item,index) in findImgArr" @click="goFind(index)">
							<img :src="item.img" alt="" />
							<p>{{item.desc}}</p>
						</li>
					</ul>
				</div>
				<div class="three">
					<img class="three-img" src="../../assets/img/index/home_three_step_banner.png" alt="" />
				</div>
				<!--<div class="prevent-look">
					<a @click="goAvoidFraud" class="clearfix ">
						<span class="fl F6"><img src="../../assets/img/index/home_gray_bookmark_ic.png" alt="" />避坑防骗、省心装修，必看......</span>
						<span class="fr F7">查看详情<img src="../../assets/img/index/home_top_more_ic.png" alt="" /></span>
					</a>
				</div>-->
			</div>
			<div class="fenge" style="height: 0.4rem; background: linear-gradient(#d7d7d7,#f3f3f3, #f5f5f5);">

			</div>
			<!--热门推荐-->
			<div class="hot-recommend bg0">
				<h1 class="hot-recommend-title bb1">
					<img src="../../assets/img/index/home_hot_ic.png" alt="" />
					<span class="F6">热门推荐</span>
				</h1>
				<div class="company-logo bb1">
					<h1 class="company-logo-ranking F4">
						<img src="../../assets/img/index/home_company_left_ic.png" alt="" />
						公司排名
						<img src="../../assets/img/index/home_company_right_ic.png" alt="" />
					</h1>
					<ul class="company-logo-ranking-list clearfix">
						<li v-for="(item,index) in companyRankArr" @click="goCompanyDetails(item.id)">
							<img :src="item.logo" alt="" />
						</li>

					</ul>
					<h2 @click="goFind(1,2)" class="F6">按作品数量和完整度排序<img src="../../assets/img/index/home_more_ic.png" alt="" /></h2>
				</div>
			</div>

			<div class="company-list">
				<ul>
					<li class="bg0 bb1" v-for="(item,index) in hotCaseArr" @click="goCaseDetails(item.caseId)">
						<h1 class="F7">
							<img :src="item.logo" alt="" />{{item.companyName}}
						</h1>
						<div class="company-list-720">
							<img class="company-list-720-bg" :src="item.caseCover" alt="" />
							<img v-show="item.has720" class="company-list-720-btn" src="../../assets/img/index/home_720_play_ico.png" alt="" />
							<img class="company-list-720-bottom" src="../../assets/img/index/home_work_720_bg.png" alt="" />
						</div>
						<h2><span class="F4 fwb">{{item.caseName}}</span><span class="fr">{{item.style}}/{{item.houseType}}/{{item.houseArea}}㎡</span></h2>
					</li>

				</ul>
			</div>
		</div>
	</div>

</template>

<script>
	/*mint-ui*/
import {MessageBox} from 'mint-ui';
import {Indicator} from 'mint-ui';
import {Toast} from 'mint-ui';
	import yHeader from '../../components/Header'

export default {
	name: '',
	components: {
		yHeader,

	},
	data() {
		return {
			isIos:false,
			haveMessage:true,//是否有消息显示小圆点
			city:[{"shortName":"成都","id":2294},{"shortName":"重庆","id":2252}],
			up:false,         		//城市箭头是否旋转
			isClickCity:false,		//控制城市选择
			selectCity:"成都",      //默认成都
			cityId:2294,            //城市id 默认成都
			inow:0,           		//城市列表切换
			isPosition:false,       //是否走定位

			findImgArr:[
				{'img':require('../../assets/img/index/home_find_design_ic.png'),'desc':'找设计'},
				{'img':require('../../assets/img/index/home_find_worker_ic.png'),'desc':'找施工'},
				{'img':require('../../assets/img/index/find_chip_ic.png'),'desc':'找优惠'},
				{'img':require('../../assets/img/index/find_protect_ic.png'),'desc':'找保障'},
			],
			lunboImgArr:[],
			companyRankArr:[],//公司排名
			hotCaseArr:[],//热门作品

		}
	},
	created() {
		/*模拟数据-start-*/
		/*this.lunboImgArr=[
			{'image':'http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg','url':'http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg'},
			{'image':'https://gd3.alicdn.com/imgextra/i3/71225672/TB2VmwXX4PI8KJjSspoXXX6MFXa_!!71225672.jpg_400x400.jpg','url':''},
			{'image':'https://gd1.alicdn.com/imgextra/i4/748267519/TB2q6tRq3JlpuFjSspjXXcT.pXa_!!748267519.jpg_400x400.jpg','url':'https://gd1.alicdn.com/imgextra/i4/748267519/TB2q6tRq3JlpuFjSspjXXcT.pXa_!!748267519.jpg_400x400.jpg'},

		];
		this.hotCaseArr = [
			{
			    "caseId": 0,
			    "caseName": "浪漫小屋",
			    "caseCover": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
			    "houseArea": 160,
			    "style": "现代美式",
			    "houseType": "平层",
			    "cost": 0,
			    "decorateType": "",
			    "collectionCount": 0,
			    "viewCount": 0,
			    "has720": true,
			    "companyName":"景逸空间设计有限公司",
			    "logo":"http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg"
			},
			{
			    "caseId": 2,
			    "caseName": "魔幻森林",
			    "caseCover": "https://gd3.alicdn.com/imgextra/i3/71225672/TB2VmwXX4PI8KJjSspoXXX6MFXa_!!71225672.jpg_400x400.jpg",
			    "houseArea": 150,
			    "style": "日式",
			    "houseType": "楼房",
			    "cost": 0,
			    "decorateType": "",
			    "collectionCount": 0,
			    "viewCount": 0,
			    "has720": false,
			    "companyName":"景逸空间设计有限公司",
			    "logo":"http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg"
			},
		]

		this.companyRankArr = [
			{
			  	"id": 0,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 1,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 2,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 3,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 4,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 5,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 6,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 7,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 8,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			},
			{
			  	"id": 9,
      			"logo": "http://img3.imgtn.bdimg.com/it/u=790260443,3672953132&fm=11&gp=0.jpg",
      			"name": ""
			}
		]
		/*模拟数据-end-*/
		this.getLunboImage();
		this.getCompanyRank();
		this.getHotCase();
	},
	mounted() {
		this.getCity();
	   	this.getPosition();
	   	//不走定位就默认显示成都的数据
	    if(!this.isPosition){
	        this.selectCity=="成都";
	    }
	},
	methods: {

		//点击显示城市列表
		showCity() {
			this.up=!this.up;
			this.isClickCity=!this.isClickCity;
		},
		//选择城市
		chooseCity(idx,text,cityId) {
			this.isClickCity=!this.isClickCity;
			this.up=!this.up;
			this.inow=idx;
			this.selectCity=text;
			this.cityId=cityId;
			console.log("切换城市id"+this.cityId);

			invokeNative({
				"code":window.jsBridge.CODE_STORE,
				"data":{
					"key":"cityId",
					"value":this.cityId
				}
			})
			Indicator.open();
			getAccountToken("1");//给IOS传一个参数,必传，Android可传可不传。
			var _this = this;
			window.getAccountTokenReturn = function(val) {
			    var value = window.atob(val);
			        value = JSON.parse(value);
//			        alert(JSON.stringify(value));
			        _this.$http({
			            url: window.Host.customer+`/user/updateCity/${_this.cityId}`,
			            method: 'POST',
			            // 设置请求头
				        headers:{
					      	'access-token':value.token,
					      	'session-id':value.sessionId
					    }
			        }).then((res) => {
						if(res.data.succ){
//							alert(JSON.stringify(res))
							Indicator.close();
							console.log(res);
						}else{
							Indicator.close();
							didApiError(res);
						}
					})

			}



		},
		//获取城市名称和id
  		getCity(){
  			this.$http.get(window.Host.customer+"/area/citySupport").then((res) => {
				if(res.data.succ) {
					this.city=res.data.data;
				}
			})
  		},
  		//获取当前城市地理位置---百度地图
		getPosition(){
			let _this=this;
			let geolocation = new BMap.Geolocation();
			let gc = new BMap.Geocoder();
			geolocation.getCurrentPosition( function(r) {
			//定位结果对象会传递给r变量
	        	if(this.getStatus() == BMAP_STATUS_SUCCESS) {
	        	//通过Geolocation类的getStatus()可以判断是否成功定位。
		            let pt = r.point;
		            gc.getLocation(pt, function(rs){
		                let addComp = rs.addressComponents;
//		                alert("定位成功------"+addComp.city)
		                console.log("定位成功------"+addComp.city)
		                _this.inow=0;
			            _this.dealWithCity(addComp.city);
		            });
		        }else{
		        	_this.inow=1;
                  	_this.dealWithCity("定位失败");
//                	alert("定位失败");
                  	console.log("定位失败")
		        	console.log('failed'+this.getStatus());
		        }
		        this.isPosition=true;
	    	},{enableHighAccuracy: true});
		},
		//根据城市名--->获取城市id--->获取数据
		dealWithCity(city) {
			for(let i in this.city){
				if(city=="重庆市"){
					this.selectCity="重庆";
					if(this.city[i].name=="重庆市"){
						this.inow=1;
						this.cityId=this.city[i].id;
						invokeNative({
							"code":window.jsBridge.CODE_STORE,
							"data":{
								"key":"cityId",
								"value":this.cityId
							}
						})
						console.log("dealWithCity城市id"+ this.cityId)
						break;
					}
				}else{
					this.selectCity="成都";
					if(this.city[i].name=="成都市"){
						this.inow=0;
						this.cityId=this.city[i].id;
						invokeNative({
							"code":window.jsBridge.CODE_STORE,
							"data":{
								"key":"cityId",
								"value":this.cityId
							}
						})
						console.log("dealWithCity城市id"+ this.cityId)
						break;
					}
				}
			}
		},
		/*去免费报价页*/
		goQuotation() {
        	invokeNative({
				"code":window.jsBridge.CODE_OPEN,
				"data":{
        			"url":window.Host.localUrl+"/#/quotation"
        		}
			})
		},
		isHaveMessage(){
			if(localStorage.message){
				this.haveMessage = true;
			}else {

			}

		},
		cancelMessage() {
			if(this.haveMessage){
				this.haveMessage=false;
			}
		},
		/*获取轮播图*/
		getLunboImage() {
			//https://devcustomer.yingwumeijia.com:443/{version}/banner/getAll
			this.$http.get(window.Host.customer+"/banner/getAll").then((res) => {
				if(res.data.succ){
					console.log(res);
					this.lunboImgArr = res.data.data;
				}else{
					didApiError(res);
				}
			})
		},
		goLunboUrl(url,title) {
			// target =1 打开app内部的页面不需要title,如果url里面没有target字段，target=undefined;
			if(url){
				var target =getQueryVal(url).target;
				if(target==1){
					//http://192.168.28.50:8090/#/materialSubsidy?target=1
					invokeNative({
						"code":window.jsBridge.CODE_OPEN,
						"data":{
							"url":url
						}
					})
				}else {
					if(title){
						invokeNative({
							"code":window.jsBridge.CODE_OPEN,
							"data":{
								"url":url,
								"title":title
							}
						})
					}else {
						invokeNative({
							"code":window.jsBridge.CODE_OPEN,
							"data":{
								"url":url,
								"title":" "
							}
						})
					}
				}
			}
		},
		/*找设计，找施工，找优惠，找保障跳转*/
		goFind(index,sortId) {
			console.log(index)
			switch(index){
				case 0:
						invokeNative({
							"code":window.jsBridge.CODE_OPEN,
							"data":{
		        				"url":window.Host.localUrl+`/#/sameCity?type=1&cityId=${this.cityId}`
		        			}
						})

					break;//找设计
				case 1:
					let url=sortId?window.Host.localUrl+`/#/sameCity?type=2&cityId=${this.cityId}&sortId=${sortId}`:window.Host.localUrl+`/#/sameCity?type=2&cityId=${this.cityId}`;
						invokeNative({
							"code":window.jsBridge.CODE_OPEN,
							"data":{
		        				"url":url
		        			}
						})
					break;//找施工

				case 2://找优惠
					invokeNative({
						"code":window.jsBridge.CODE_NAV_CHANGE,
						"data":2
					});
					break;
				case 3://找保障
					invokeNative({
						"code":window.jsBridge.CODE_NAV_CHANGE,
						"data":3
					});
					break;
			}
		},
		/*避坑防骗*/
		goAvoidFraud() {
			invokeNative({
				"code":window.jsBridge.CODE_OPEN,
				"data":{
    				"url":window.Host.localUrl+"/#/avoidFraud"
    			}
			})
		},
		/*获取公司排名*/
		getCompanyRank() {
			//https://devcustomer.yingwumeijia.com:443/{version}/company/getCompanyRank
			this.$http.get(window.Host.customer+"/company/getCompanyRank").then((res) => {
				if(res.data.succ){
					console.log(res);
					this.companyRankArr = res.data.data;
				}
			})
		},
		/*去公司详情*/
		goCompanyDetails(companyId) {
			invokeNative({
				"code":window.jsBridge.CODE_GO_COMPANY_DETAIL,
				"data":companyId
			});
		},
		/*获取热门作品*/
		getHotCase() {
			//https://devcustomer.yingwumeijia.com:443/{version}/case/app/getHotCase
			this.$http.get(window.Host.customer+"/case/app/getHotCase").then((res) => {
				if(res.data.succ){
					console.log(res);
					this.hotCaseArr = res.data.data;
				}
			})

		},
		/*点击作品去作品详情*/
		goCaseDetails(caseId) {
			invokeNative({
				"code":window.jsBridge.CODE_OPEN_CASE_DETIAL,
				"data":caseId
			});
		},
		callPhone() {
			invokeNative({
				"code":window.jsBridge.CODE_CALL_PHONE_NUMBER,
				"data":"02885108092"
			});
		}
	},//methods结束
}
</script>

<style scoped lang="less">
header {
	height: 1.2rem;
}
.city{
	height: 1.2rem;
	position: absolute;
    left: 0;
    padding-left: 0.30666rem;
    display: flex;
    justify-content: center;
    align-items: center;
	span{
		display: flex;
	    justify-content: space-between;
	    align-items: center;

		img{
			margin-left: 0.10666rem;
			width: 0.22666rem;
			height: 0.12rem;
			vertical-align: middle;
		}
		img.rotate{
			transform: rotateZ(180deg);
			transition: all .5s;
		}
	}

}
/*弹框的城市列表*/
.toast-city{
	position: fixed;
	top: 1.2rem;left: 0;right: 0;bottom: 0;
	background-color: rgba(0,0,0,0.6);
	z-index: 999999999999999;
	ul{
		position: absolute;
		top: 0.4rem;
		left: 0.32rem;
		width:3.94666rem;
		background-color: #fff;
		border-radius: 6px;
		li{
			height: 1.17333rem;
			line-height: 1.17333rem;
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
			left: 0.4rem;

		}
		.line{
			width:3.25333rem;
			height: 1px;
			background-color: #e6e6e6;
			position: absolute;
			top: 1.17333rem;
			left: 0.26667rem;
		}
	}
}
.service {
	position: fixed;
	bottom: 0.16rem;
	right: 0.41333rem;
	z-index: 2;
	img{
		width: 1.44rem;
		height: 1.58666rem;
		display: block;
	}
}
.quote-btn {
	width: 68%;
	height: 100%;
    position: absolute;
	right: 1.2rem;
	a{
		position: absolute;
	    top: 50%;
	    left: 0;
	    margin-top: -0.35rem;
		width: 100%;
		height: 0.69333rem;
		line-height: 0.69333rem;
		display: inline-block;
		background: #f2f2f2;
		border-radius: 0.08rem;
		opacity: 0.8;
		i:first-child{
			color: #707070;
			img{
				width: 0.32rem;
				height: 0.37333rem;
				margin: 0 0.13333rem 0 0.25333rem;
				vertical-align: text-bottom;
			}
		}
		i:last-child{
			color: #ed316b;
			img{
				width: 0.32rem;
				height: 0.32rem;
				margin: 0 0.29333rem 0 0.10666rem;
				vertical-align: middle;
			}
		}
	}

}
.message {
	line-height: 1.2rem;
	position: relative;
	img{
		margin-right: 0.41333rem;
		width: 0.53333rem;
		height: 0.56rem;
		vertical-align: middle;
	}
	.red-circle {
		width: 0.24rem;
		height: 0.24rem;
		border-radius: 50%;
		background-color: #ED316B;
		display:inline-block;
		position: absolute;
		top: 0.23333rem;
		right: 0.23333rem;
	}
}
.lunbo {
	height: 6.05333rem;
	width: 100%;
	a{
		display: block;
		img{
			width: 100%;
			height: 6.05333rem;
			display: block;
		}
	}
}
.find {
	.find-list {
		overflow: hidden;
		ul{
			margin-top: 0.42666rem;
			display: flex;
			justify-content: space-around;
			li {
				text-align:center;
				img{
					width: 1.38666rem;
					height: 1.38666rem;
					display: block;
					border-radius: 50%;
					margin-bottom: 0.26666rem;
				}
				p{
					font-size: 0.32rem;
					color: #3c3c3c;
				}
			}
		}
	}
	.three {
		    padding: 0.36rem 0.3rem 0 0.3rem;
		img.three-img{
			width: 100%;
			display: block;
		}
	}
	.prevent-look {
		padding: 0 0.57333rem 0.69333rem 0.50666rem;
		a{
			height: 0.69333rem;
			line-height: 0.69333rem;
			background: #f5f5f5;
			border-radius: 0.08rem;
			opacity: 0.8;
			border: 1px solid #737373;
			display: block;
			span:first-child {
				color: #707070;
				img{
					width: 0.29333rem;
					height: 0.34666rem;
					margin: 0 0.18666rem 0 0.26666rem;
					vertical-align: middle;
				}
			}
			span:last-child{
				color: #ED316B;
				img{
					width: 0.32rem;
					height: 0.32rem;
					margin: 0 0.28rem 0 0.10666rem;vertical-align: middle;
				}
			}
		}

	}

}
.hot-recommend {
	.hot-recommend-title {
		height: 0.82666rem;
		line-height: 0.82666rem;
		padding-left: 0.48rem;
		img{
			width: 0.22666rem;
			height: 0.30666rem;
			vertical-align: middle;
		}
		span {
			color: #3f3f3f;
		}
	}
	.company-logo {
		.company-logo-ranking {
			height: 1.25333rem;
			line-height: 1.25333rem;
			text-align: center;
			img{
				width: 0.22666rem;
				height: 0.25333rem;
				vertical-align: middle;
			}
			img:first-child{
				margin-right: 0.21333rem;
			}
			img:last-child{
				margin-left: 0.24rem;
			}
		}
		.company-logo-ranking-list {
			display: flex;
			flex-wrap: wrap;
			li {
				margin-left: 0.08rem;
				margin-bottom: 0.09333rem;
				border:1px solid #d0d0d0;
				width: 18.4%;
				img{
					width: 100%;
					display: block;
				}

			}
		}
		h2{
			text-align: center;
			color: #343434;
			line-height: 1.25333rem;
			img{
				width: 0.16rem;
				height: 0.29333rem;
				vertical-align: middle;
				margin-left: 0.21333rem;
			}
		}
	}
}
.company-list {
	ul{
		li{
			padding: 0 0.13333rem;
			margin-top: 0.36rem;
			h1{
				height: 1.53333rem;
				line-height: 1.53333rem;
				color: #737373;
				img{
					width: 0.77333rem;
					height: 0.77333rem;
					vertical-align: middle;
					margin:0 0.44rem 0 0.69333rem;
					border-radius: 50%;
				}
			}
			.company-list-720 {
				position: relative;
				.company-list-720-bg{
					width: 100%;
					height: 8.44rem;
					display: block;
				}
				.company-list-720-btn{
					width: 2.54666rem;
					height: 0.77333rem;
					position: absolute;
					right: 0.42666rem;
					bottom: 0.38666rem;
					z-index: 1;
				}
				.company-list-720-bottom {
					width: 100%;
					position: absolute;
					left: 0;
					bottom: 0;
				}
			}
			h2{
				height: 1.30666rem;
				line-height: 1.30666rem;
				span:first-child{
					color: #282828;
					margin-left: 0.54666rem;
				}
				span:last-child{
					color: #848484;
					font-size: 0.26666rem;
					margin-right: 0.45333rem;
				}

			}
		}
		li:last-child{
			margin-bottom: 0.36rem;
		}
	}
}
</style>
