<template>
	<div class="getSubsidy">
		<y-header>
			<div class="clickMe" @click="goBack"><span></span></div>获取补贴</y-header>
		<y-footer style="display:flex;">
			<button class="pay" :disabled="isPayed" :style="{'color':isPayed?'#ebd6c0':'#fff'}" @click="goPay">{{text}}</button>
			<i class="white-line"></i>
			<button class="contact-pepole" @click="callPhone">电话咨询</button>
		</y-footer>

		<!-- 微信下载提示 -->
		<div v-show="showWxtips" @click="showWxtips = false" class="wxTips">
			<div></div>
		</div>

		<!-- 弹窗 -->
		<div class="hint" v-show="showShade" @touchmove.prevent>
			<div class="hint-box" v-show="showSorry">
				<div class="F3">
					<div class="baoqian F4 C1">
						<p>抱歉，您非平台成交支付的客户，不能获得补贴。</p>
						<p>若您是平台合作团队推荐的客户，请输入对方给您的验证码。</p>
					</div>
				</div>
				<div class="toast-btn">
					<div class="F3 C6" @click="iknow">知道了</div>
					<div class="F3 C6" @click="inputCode">输入验证码</div>
				</div>
			</div>

			<div class="hint-box" v-show="showCode" style="margin:4.2rem auto 0;">
				<div class="F3">
					<div class="baoqian F4 C1" style="padding:0.74667rem 0.42667rem;">
						<input type="text" placeholder="请输入验证码" v-model.trim="code" maxlength="6">
					</div>
				</div>
				<div class="toast-btn">
					<div class="F3 C6" @click="iknow">取消</div>
					<div class="F3 C6" @click="sure">确定</div>
				</div>
			</div>

			<div class="hint-box" v-show="showCodeSuccess" style="margin:4.2rem auto 0;">
				<div class="F3">
					<div class="baoqian F4 C1" style="text-align:center;padding:0.69333rem 0 0.50667rem 0;">
						<p class="F4 C1">您已获得主材补贴权益</p>
						<p class="F4 C1">赶快去咨询补贴详情吧!</p>
					</div>
				</div>
				<div class="toast-btn">
					<div class="F3 C6" @click="iknow" style="border-radius:0 0 0 6px;">知道了</div>
				</div>
			</div>

			<div class="hint-box" v-show="showGoPay" style="margin:4.5rem auto 0;">
				<div class="F3">
					<div class="baoqian F4 C1" style="padding:0.69333rem 0 0.50667rem 0.46667rem;">
						<p class="F4 C1">抱歉，请您先致电专员，了解补贴详情，</p>
						<p class="F4 C1">确认获得补贴权益后再进行支付。</p>
					</div>
				</div>
				<div class="toast-btn">
					<div class="F3 C6" @click="iknow" style="border-radius:0 0 0 6px;">知道了</div>
				</div>
			</div>
			<!-- APP外打开引导下载 -->
			<div v-show="showAppBesides" class="hint-box" style="margin:4.5rem auto 0;text-align:center;">
				<div class="F3" style="padding-top:0.5rem;">
					<p class="F1 C1 fwb">下载鹦鹉美家APP</p>
					<div class="baoqian F4 C1" style="padding:0.2rem 0 0.50667rem 0;">
						<p class="F4 C1">查看更多主材优惠</p>
					</div>
				</div>
				<div class="toast-btn">
					<div class="F3 C6" @click="downLoadApp" style="border-radius:0 0 0 6px;">立即下载</div>
				</div>
			</div>
		</div>

		<div class="getSubsidy-main content">
			<!-- 主材LOGO -->
			<div class="getSubsidy-top bb1">

				<!-- 短视频 -->
				<div v-if="materialInfo.video" class="short-video bb1" @click="playVideo">
					<div v-show="showPayBtn" class="paly-btn"></div>
					<video id="video" width="100%" :src="materialInfo.video.url" :poster="videoThumbnail"></video>
				</div>



				<div class="getSubsidy-logo">
					<img :src="materialInfo.logo">
				</div>
				<!-- <div class="line-thick"></div> -->
				<div class="line-fine"></div>
				<h1 class="F5 C1 getSubsidy_depicts" v-html="materialInfo.depicts"></h1>
				<div class="getSubsidy-hint">
					<!-- <img src="../../../assets/img/material/wxts.png" /> -->
					<p>1. 补贴须凭短信到品牌指定门店处兑现</p>
					<p>2. 此补贴不可折现，签约时一次性减扣</p>
					<p>3. 请在工作时间拨打电话（9:30-18:30)</p>
					<p>4. 限平台交易客户或设计师邀请客户参与</p>
				</div>
				<button class="contact-commissioner" @click="callPhone">
                    <img src="../../../assets/img/material/call_custom_service_ic@2x.png">联系主材补贴专员，了解补贴详情
                </button>
			</div>

			<!-- 查看门店 -->
			<div class="look-store bb1">
				<h1 class="look-store-title">查看门店</h1>
				<ul>
					<li class="clearfix" v-for="item in storeDtos" @click="goStoreDetails(item.storeId)">
						<i class="look-store-left fl"><img src="../../../assets/img/material/hqbt_map_ic@2x.png" alt=""></i>
						<div class="look-store-center fl" :class="[!item.pathOf720?'pt5':'']">
							<h1 class="textcut">{{item.storeName}}({{item.storeAddr}})</h1>
							<p v-if="item.pathOf720">可720°观赏</p>
						</div>
						<i class="look-store-right fr"><img src="../../../assets/img/material/more_ic@2x.png" alt=""></i>
					</li>
				</ul>
			</div>
			<!-- 品牌广告 -->
			<div v-if="materialInfo.picAdverts" class="brand-advertising bb1">
				<img class="brand-advertising-img" :src="materialInfo.picAdverts">
			</div>

			<!-- 品牌爆款 -->
			<div v-if="productDtos.length!=0" class="brand-hotStyle bb1">
				<h1 class="brand-hotStyle-title">品牌爆款</h1>
				<ul>
					<li v-for="item in productDtos">
						<a @click="goHot(item.productUrl)">
							<img :src="item.productImg">
							<i class="F5" v-if="item.productUrl">查看详情</i>
						</a>

					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import yHeader from '../../../components/Header'
	import yFooter from '../../../components/Footer'
	import $ from "jquery"
	export default {
		name: 'getSubsidy',
		components: {
			yHeader,
			yFooter
		},
		data() {
			return {
				text: "获取补贴",
				materialId: this.$route.query.materialId || getHashString("materialId"), //主材Id
				materialInfo: {}, //主材信息
				storeDtos: [], //门店
				productDtos: [], //爆款
				isPayed: false, //定金是否支付
				isAllow: false, //是否有权限打电话和支付定金

				showShade: false, //遮罩显示
				showWxtips: false, //APP外微信打开提示去游览器打开
				showAppBesides: false, //APP外打开是否显示
				showSorry: false, //抱歉显示
				showCode: false, //验证码显示
				showCodeSuccess: false, //验证码输入正确显示
				showGoPay: false, //不满足条件打电话的提示
				showPayBtn: true, //显示播放视频按钮

				code: '', //用户输入的验证码
				videoThumbnail: '', //视频缩略图

			}
		},
		created() {
			/*模拟数据-start*/

			/*this.materialInfo= {
            "id": 21,//主材ID,
            "name": "",//主材名,
            "logo": "http://pic.58pic.com/58pic/15/14/14/18e58PICMwt_1024.jpg",//主材LOGO,
            "contact": "王虎",//主材商的联系人,
            "mobilePhone": "15892591500",//主材商联系人手机号,
            "telephone": "028",//主材商联系座机号,
            "areaId": 2252,// 主材商所在城市ID,
            "deposit": 10,// 主材商定金金额,
            "smsMessage": "",//用户成功支付定金后发送的短信内容,
            "extraPhones": [
                {
                    "phone": "",//电话号码,
                    "remarks": ""//备注信息
                }
            ],
            "picAdverts": "http://img.zcool.cn/community/010f87596f13e6a8012193a363df45.jpg@2o.jpg",//图文广告,
            "video": {
            	"duration": 0,//总长
		        "name": "",
		        "second": 5,//缩略图所在秒数//http://ob24y7hrk.bkt.clouddn.com/o_1bvbk22ab1pqmjep1tmg1hvo2rph.mp4?vframe/jpg/offset/5/w/240/h/140
		        "url": "http://ob24y7hrk.bkt.clouddn.com/o_1bvbk22ab1pqmjep1tmg1hvo2rph.mp4",
		        "description": ""
            },
            depicts:"只需10元"

        };
        this.storeDtos=[
            {
                "storeId": 1,// 门店ID,
                "storeName": "瑞士卢森地板瑞士卢森地板瑞士卢森地板瑞士卢森地板瑞士卢森地板",//门店名,
                "storeAddr": "北富森店",//门店地址,
                "storeCover":"http://pic35.photophoto.cn/20150529/0014026744554538_b.jpg",
                "pathOf720": "https://customer.yingwumeijia.com/images/common/index.html?type=720&directory=3719ce0dea8e4cc49d74e934c8d46fa0&subDirectory=LYFc&caseId=1457&appe=null&uid=4020&type=c&twitter=false",//门店720,
            },
            {
                "storeId": 2,// 门店ID,
                "storeName": "瑞士卢森地板",//门店名,
                "storeAddr": "北富森店",//门店地址,
            },
            {
                "storeId": 3,// 门店ID,
                "storeName": "瑞士卢森地板",//门店名,
                "storeAddr": "北富森店",//门店地址,
                "storeCover":"http://pic35.photophoto.cn/20150529/0014026744554538_b.jpg",
                "pathOf720": "https://customer.yingwumeijia.com/images/common/index.html?type=720&directory=3719ce0dea8e4cc49d74e934c8d46fa0&subDirectory=LYFc&caseId=1457&appe=null&uid=4020&type=c&twitter=false",//门店720,
            }
        ];
		this.productDtos=[
	      	{
		        "productId": 0,
		        "materialId": 0,
		        "productImg": "http://pic1.16pic.com/00/07/85/16pic_785034_b.jpg",
		        // "productUrl": "http://pic1.16pic.com/00/07/85/16pic_785034_b.jpg",
		        "available": false,
		        "createTime": "",
		        "updateTime": "",
		        "sortTime": ""
	      	},
	      	{
		        "productId": 0,
		        "materialId": 0,
		        "productImg": "http://pic.58pic.com/58pic/13/74/51/99d58PIC6vm_1024.jpg",
		        "productUrl": "http://pic.58pic.com/58pic/13/74/51/99d58PIC6vm_1024.jpg",
		        "available": false,
		        "createTime": "",
		        "updateTime": "",
		        "sortTime": ""
	      	},
	      	{
		        "productId": 0,
		        "materialId": 0,
		        "productImg": "http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg",
		        // "productUrl": "http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg",
		        "available": false,
		        "createTime": "",
		        "updateTime": "",
		        "sortTime": ""
	      	}


    	]
        this.videoThumbnail = this.materialInfo.video.url+`?vframe/jpg/offset/5/w/240/h/140`;

        /*模拟数据-end*/

			invokeNative({ "code": window.jsBridge.CODE_DIALOG_SHOW });
			this.getMaterialInfo();
		},
		mounted() {
			this.isOpenInApp();
		},
		methods: {
			isOpenInApp() {
				//app外打开
				this.showShade = true;
				this.showAppBesides = true;

				//app内打开
				invokeNative({
					"code": window.jsBridge.CODE_GET_LOGIN_STATUS,
					"callback": "returnisLogin"
				});
				window.returnisLogin = (value) => {
					this.showShade = false;
					this.showAppBesides = false;
					var value = window.atob(value);
					var res = JSON.parse(value);
					if(res.data == 1) { //app内登录了
						this.getMaterialInfo();
					} else { //app内未登录
						invokeNative({ "code": window.jsBridge.CODE_LOGIN });
					}
				}

			},
			goBack() {
				this.$router.go(-1);
			},
			messageHint(data) {
				invokeNative({ "code": window.jsBridge.CODE_TOAST, "data": data });
			},
			downLoadApp() {
				this.wxTips();
			},
			/**
			 * [wxTips 微信提示从浏览器打开]
			 * @return {[type]} [description]
			 */
			wxTips() {
				var u = navigator.userAgent;
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

				// 判断是否为微信
				var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
				// 是否在微信内打开
				if(ua.match(/MicroMessenger/i) == "micromessenger") {
					this.showWxtips = true;
					return false;
				}
				// 是否在微博内打开
				if(ua.match(/WeiBo/i) == "weibo") {
					this.showWxtips = true;
					return false;
				}
				//Android接口
				if(isAndroid) {
					window.location.href = "http://o7zlnyltf.bkt.clouddn.com/app-ywmj-release.apk";
				}
				//iOS接口
				if(isiOS) {
					window.location.href = "http://itunes.apple.com/us/app/id1133878484";
				}
			},
			getMaterialInfo() {
				//https://devcustomer.yingwumeijia.com:443/{version}/material/materialInfo?materialId=123
				this.$http.get(window.Host.customer + `/material/materialInfo?materialId=${this.materialId}`).then((res) => {
					//				 alert(JSON.stringify(res));

					if(res.data.succ) {
						invokeNative({ "code": window.jsBridge.CODE_DIALOG_HIDE });
						var result = res.data.data;
						this.materialInfo = (result.materialDto ? result.materialDto : {});
						this.storeDtos = (result.storeDtos ? result.storeDtos : []);
						this.productDtos = (result.productDtos ? result.productDtos : []);
						this.$nextTick(() => {
							$(".getSubsidy_depicts").find("p").addClass("en-cut-txt");
							$(".getSubsidy_depicts").find("p img").css({
								"width": "100%"
							});
						})
						//					 alert(JSON.stringify(this.productDtos));
						if(this.materialInfo.video) {
							this.videoThumbnail = this.materialInfo.video.url + `?vframe/jpg/offset/${this.materialInfo.video.second}/w/750`; //视频缩略图
						}
						this.isAllow = result.isAllow;
						this.isPayed = result.isPayed;
						if(this.isPayed) {
							this.text = "您已获得补贴资格";
						}
					} else {
						invokeNative({ "code": window.jsBridge.CODE_DIALOG_HIDE });
						didApiError(res);
					}
				})
			},
			/*去门店详情*/
			goStoreDetails(storeId) {
				this.$router.push({ name: 'storeDetails', query: { "storeId": storeId } });
			},

			callPhone() {
				if(this.isAllow) {
					this.$http.get(window.Host.customer + `/material/consultation?materialId=${this.materialId}`).then((res) => {
						if(res.data.succ) {
							console.log(res.data.data.phone)
							invokeNative({ "code": window.jsBridge.CODE_CALL_PHONE_NUMBER, "data": res.data.data.phone });
							/*有资格打电话数据埋点*/
							this.recodeData({
								"materialId": this.materialId,
								"logType": 2
							});
						}
					})
				} else {
					this.showShade = true;
					this.showSorry = true;
					this.showCode = false;
					this.showCodeSuccess = false;
					this.showAppBesides = false;
					/*没有资格打电话数据埋点*/
					this.recodeData({
						"materialId": this.materialId,
						"logType": 1
					});
				}
			},
			iknow() {
				this.showShade = false;
				this.showSorry = false;
				this.showCode = false;
				this.showCodeSuccess = false;
				this.showGoPay = false;
				this.showAppBesides = false;
			},
			inputCode() {
				this.showCode = true;
				this.showSorry = false;
			},
			sure() {
				console.log(this.code)
				if(this.code == "") {
					this.messageHint("请输入验证码");
				} else {
					this.$http.post(window.Host.customer + `/material/invitationCode?code=${this.code}&materialId=${this.materialId}`).then((res) => {
						console.log(res);
						if(res.data.succ) {

							//验证码正确
							this.showCodeSuccess = true;
							this.showCode = false;
							this.getMaterialInfo();
						} else { //验证验证码不正确
							this.messageHint(res.data.message);
						}
					})
				}
			},
			playVideo() {
				var _this = this;
				var myVideo = document.getElementById("video");
				this.showPayBtn = false;
				if(myVideo.paused) {
					myVideo.play();
				} else {
					myVideo.pause();
				}
				myVideo.ontimeupdate = function() {
					if(myVideo.currentTime === myVideo.duration || myVideo.paused) {
						_this.showPayBtn = true;
					}
				}
			},
			/**
			 * [goHot 去品牌爆款]
			 * @param  {[type]} url [description]
			 * @return {[type]}     [description]
			 */
			goHot(url) {
				invokeNative({
	                "code":window.jsBridge.CODE_OPEN,
	                "data":{
	                    "url":url,
	                    "title":"品牌爆款"
	                }
	            });
			},
			goPay() {
				if(this.isAllow) {
					this.$http.post(window.Host.customer + `/material/pay/deposit?materialId=${this.materialId}`).then((res) => {
						//                  alert(JSON.stringify(res))
						if(res.data.succ) {

							var result = res.data.data;
							/*账单总金额为0就提示用户，不去收银台*/
							if(result.totalAmount == 0) {
								this.messageHint("免费获取成功");
								this.isPayed = true;
							} else {
								invokeNative({
									"code": window.jsBridge.CODE_PAY,
									"data": {
										"billId": result.id, //帐单id，数值类型
										"payType": 1 //payType默认支付宝、微信  0：不支持易宝支付， 1：支持易宝支付
									},
									"callback": "paySuccReturn"
								});
								var that = this;
								window.paySuccReturn = function(value) {
									console.log("去主材成功页")
										var value = window.atob(value);
										value = JSON.parse(value);
										if(value.data) {
											that.$router.push({ "name": "materialPaySuccess", query: { "isWxAlipay": true } });
										}
								}
							}

							this.recodeData({
								"materialId": this.materialId,
								"logType": 4
							});
						} else {
							this.messageHint(res.data.message);
						}
					})
				} else {
					this.showShade = true;
					this.showGoPay = true;
					/*没有资格获取补贴数据埋点*/
					this.recodeData({
						"materialId": this.materialId,
						"logType": 3
					});
				}
			},
			recodeData(data) {

				this.$http.post(window.Host.customer + `/material/log`, data).then((res) => {
					console.log(res)
					if(res.data.succ) {
						console.log("主材埋点成功")
					} else {
						this.messageHint(res.data.message);
					}
				})
			},
		},

	}
</script>
<style scoped lang="less">
	.pay {
		height: 1.2rem;
		background: #DFAF7D;
		font-size: 0.4rem;
		color: rgba(255, 255, 255, 1);
		flex:1;
	}
	.white-line{
		height: 0.77333rem; /* 58/75 */
		width:2px;
		background: #fff;
		position: absolute;
		left: 50%;
		margin-left: -1px;
		top: 50%;
		margin-top: -0.38667rem /* -29/75 */;
	}
	.contact-pepole {
		flex:1;
		font-size: 0.4rem;
		background:#DFAF7D;
		color: #ffffff;
	}

	.getSubsidy-main {
		padding-bottom: 1.2rem;
		.getSubsidy-top {
			background-color: #fff;
			margin-bottom: 0.37333rem;
			overflow: hidden;
			h1 {
				text-align: center;
				color: #282828;
				font-size:0.48rem /* 36/75 */;
				margin-top: 0.62667rem /* 47/75 */;
			}
			.line-thick {
				margin: 0 auto;
				width: 86%;
				height: 0.06667rem;
				background: rgba(115, 115, 115, 1);
			}
			.line-fine {
				margin: 0 auto;
				width: 86%;
				height: 1px;
				background: #e6e6e6;
				position: relative;
				top: 0.05333rem;
			}
			.getSubsidy-hint {
				color: #737373;
				font-size: 0.32rem /* 24/75 */;
				width:6rem;
				margin:0.46667rem /* 35/75 */ auto 0.64rem /* 48/75 */;
				img {
					width: 100%;
					display: block;
				}
			}
			.getSubsidy-logo {
				width: 6.93333rem;
				height: 2.90667rem;
				margin: 0.29333rem auto;
				img {
					width: 6.93333rem;
					height: 2.90667rem;
					display: block;
				}
			}
			.contact-commissioner {
				width: 7.6rem;
				height: 1.0rem;
				line-height: 1rem;
				color: #fff;
				font-size: 0.34667rem;
				background:#DFAF7D;
				border-radius: 0.50667rem;
				margin: 0.29333rem auto 0.94667rem; /* 71/75 */
				display: block;
				position: relative;
				img {
					position: absolute;
					left: 0.15rem;
					top: 0.2rem;
					width: 0.61333rem;
					height: 0.61333rem;
				}
			}
		}
		.short-video {
			margin-bottom: 0.37333rem;
			position: relative;
			.paly-btn {
				width: 1.73333rem;
				height: 1.73333rem;
				position: absolute;
				top: 50%;
				left: 50%;
				margin-top: -0.86667rem;
				margin-left: -0.86667rem;
				z-index: 1;
				background: url("../../../assets/img/material/pt_play_bt@2x.png") no-repeat center center;
				background-size: 100%;
			}
			video {
				display: block;
			}
		}
		.look-store {
			background-color: #fff;
			margin-bottom: 0.37333rem;
			overflow: hidden;
			.look-store-title {
				text-align: center;
				height: 1.44rem;
				line-height: 1.44rem;
				color: rgba(40, 40, 40, 1);
				font-size: 0.42667rem;
			}
			ul {
				background-color: #fff;
				padding: 0 0.53333rem;
				li {
					border-top: 1px solid #e6e6e6;
					.look-store-left {
						width: 0.53333rem;
						height: 0.73333rem;
						margin: 0.44rem 0.32rem 0.42667rem 0.25333rem;
						img {
							width: 0.53333rem;
							height: 0.73333rem;
							display: block;
						}
					}
					div.pt5 {
						padding-top: 0.5rem;
					}
					.look-store-center {
						padding-top: 0.2rem;
						width: 80%;
						h1 {
							color: rgba(40, 40, 40, 1);
							font-size: 0.37333rem;
							display: block;
						}
						p {
							font-size: 0.32rem;
							color: #DFAF7D;
						}
					}
					.look-store-right {
						line-height: 1.6rem;
						img {
							width: 0.18667rem;
							height: 0.34667rem;
						}
					}
				}
				li:last-child {
					/*border-bottom: 1px solid #e6e6e6;*/
				}
			}
		}
		.brand-advertising {
			background-color: #fff;
			overflow: hidden;
			margin-bottom: 0.37333rem;
			.brand-advertising-img {
				width: 100%;
				display: block;
				margin-bottom: 0.57333rem;
			}
		}
		.brand-hotStyle {
			background-color: #fff;
			margin-bottom: 0.37333rem;
			.brand-hotStyle-title {
				height: 1.57333rem;
				line-height: 1.57333rem;
				text-align: center;
				color: rgba(40, 40, 40, 1);
				font-size: 0.42667rem;
			}
			ul {
				display: flex;
				flex-wrap: wrap;
				padding: 0 0.22667rem;
				justify-content: space-between;
				li {
					width: 48%;
					height: 4.66667rem;
					margin-bottom: 0.29333rem;
					a {
						display: block;
						border: 1px solid #e6e6e6;
						position: relative;
						img {
							width: 100%;
							height: 4.66667rem;
							display: block;
						}
						i{
							position: absolute;
							bottom: 0;
							right: 0;
							display: block;
							width: 100%;
							height:0.85333rem /* 64/75 */;
							text-align: center;
							color: #fff;
							background: rgba(0,0,0,0.4);
							line-height: 0.85333rem;
						}
					}
				}
			}
		}
	}

	.hint {
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		.hint-box {
			width: 7.22667rem;
			background: rgba(255, 255, 255, 0.96);
			margin: 3.25rem auto 0;
			border-radius: 6px;
			.baoqian {
				padding: 0.88rem;
				input {
					width: 6.1rem;
					height: 0.8rem;
					border: 1px solid #282828;
					background-color: #fff;
					padding-left: 0.16rem;
				}
				p {
					line-height: 0.6rem;
				}
			}
			.toast-btn {
				display: flex;
				justify-content: space-between;
				border-radius: 0 0 6px 6px;
				div {
					flex: 1;
					background: rgba(255, 255, 255, 0.5);
					border-radius: 0 0 0 6px;
					border-top: 1px solid #e6e6e6;
					width: 100%;
					height: 36%;
					text-align: center;
					line-height: 1.22666rem;
				}
				div:last-child {
					border-radius: 0 0 6px 0;
					border-left: 1px solid #e6e6e6;
				}
			}
		}
	}
</style>
