<template>
	<div class="">
		<y-header>
			<div class="clickMe" @click="goBack"><span></span></div>免费报价
		</y-header>
		<y-footer>
			<button class="pay" @click="getQuote">立即获取</button>
		</y-footer>
		<div class="toast-register" v-show="isShowShade_register">
			<div class="toast-register-box bg0">
				<h1>您尚未注册鹦鹉美家，是否进行注册？</h1>
				<div class="toast-register-box-btn bt1">
					<button @click="nextRegister">下次注册</button>
					<button @click="register">立即注册</button>
				</div>
			</div>
		</div>
		
		
		
		<!--弹窗-start-->
		<transition name="fadeIn">
			<div class="toast" @click="close(isShowCity)"  v-show="isShowShade">
				<!--选择城市-->
				<div class="chooseCity" >
					<transition name="slide">
						<div v-show="isShowCity" class="chooseCity-box bg0 bt1">
							<ul class="province F5">
								<li v-for="(item,index) in allAreas" @click.stop="chooseProvince(item,index)" :class="{'choose':iProvince===index}">{{item.name}}</li>
							</ul>
							<ul class="province-city F5" style="background-color: #f8f8f8;padding-left: 0.48rem;">
								<li v-for="(item,index) in cityArr" @click="chooseCity(item,index)" :class="{'choose':iCity===index}" style="border-right: none;">{{item.name}}</li>
							</ul>
						</div>
					</transition>
				</div>
					
				<!--选择房屋面积-->
				<transition name="zoom">
					<div class="chooseArea bg0" v-show="isShowArea">
						<h1 class="fwb choose-title"><p class="line-h"></p>您的房屋面积<p class="line-h"></p></h1>
						<div class="choose-content F5">
							<ul>
								<li v-for="(item,index) in areaArr" @click="chooseArea(index)" :class="{'chooseClass':iArea===index}">{{item.desc}}</li>
							</ul>
							
						</div>
					</div>
				</transition>
				
				
				
				<!--选择户型-->
				<transition name="zoom">
					<div class="chooseHouse bg0" v-show="isShowHouse">
						<h1 class="fwb choose-title"><p class="line-h"></p>选择你家的户型<p class="line-h"></p></h1>
						<div class="choose-content F5">
							<ul>
								<li v-for="(item,index) in houseObj.houseRoom" @click="chooseRoom(index)" :class="{'chooseClass':iRoom===index}">{{item.desc}}</li>
							</ul>
							<ul>
								<li v-for="(item,index) in houseObj.houseHall" @click="chooseHall(index)" :class="{'chooseClass':iHall===index}">{{item.desc}}</li>
							</ul>
							<ul>
								<li v-for="(item,index) in houseObj.houseToilet" @click="chooseToilet(index)" :class="{'chooseClass':iToilet===index}">{{item.desc}}</li>
							</ul>
							<ul>
								<li v-for="(item,index) in houseObj.houseBalcony" @click="chooseBalcony(index)" :class="{'chooseClass':iBalcony===index}">{{item.desc}}</li>
							</ul>
						</div>
						<div class="choose-sure F3" @click="sure(3)">确定</div>
					</div>
				</transition>
				<!--选择装修预算-->
				<transition name="zoom">
					<div class="chooseMoney bg0" v-show="isShowMoney">
						<h1 class="fwb choose-title"><p class="line-h"></p>您的装修预算<p class="line-h"></p></h1>
						<div class="choose-content F5">
							<ul>
								<li v-for="(item,index) in costRangeArr" @click="chooseMoney(index)" :class="{'chooseClass':iMoney===index}">{{item.desc}}</li>
							</ul>
							
						</div>
					</div>
				</transition>
				<!--选择装修风格-->
				<transition name="zoom">
					<div class="chooseStyle bg0" v-show="isShowStyle">
						<h1 class="fwb choose-title"><p class="line-h"></p>您的装修风格<p class="line-h"></p></h1>
						<div class="choose-content F5">
							<ul>
								<li v-for="(item,index) in decorateStyleArr" @click="chooseStyle(item)" :class="{'chooseClass':chooseStyleList.indexOf(item.desc)>-1}">{{item.desc}}</li>
							</ul>
							
						</div>
						<div class="choose-sure F3" @click="sure(5)">确定</div>
					</div>
				</transition>
			</div>
		</transition>
		<!--弹窗-end-->
		<div class="content bg0">
			<div class="free">
				<img src="../../assets/img/index/free_banner.png" alt="" />
			</div>
			<div class="quotation-main">
				<!--您家的装修预算-->
				<div class="budget">
					<h1 class="F6 fwb"><p class="line-h"></p>您家的装修预算<p class="line-h"></p></h1>
					<div class="gif">
						<img class="jsq" src="../../assets/img/index/jsq.gif" alt="" />
						<div class="x-money F6 fwb">
								<p>
									<span><i>人工费：</i>&nbsp;?&nbsp;元</span>
									<span style="margin-left: 1rem;"><i>材料费：</i>&nbsp;?&nbsp;元</span>
								</p>
								<p>
									<span><i>设计费：</i>&nbsp;?&nbsp;元</span>
									<span style="margin-left: 1rem;"><i>质检费：</i>&nbsp;?&nbsp;元</span>
								</p>
						</div>
					</div>
				</div>
				<!--关于房屋-->
				<div class="house">
					<h1 class="F5 house-title"><img src="../../assets/img/index/free_charge_about_house_ic.png" alt="" />关于房屋</h1>
					<ul class="F4 house-list">
						<!--请选择您所在城市-->
						<li class="clearfix" @click="clickType(1)">
							<p class="fl choose">{{cityStr}}</p>
							<div class="fr">
								<img src="../../assets/img/index/designer_more_ic.png" alt="" />
							</div>
						</li>
						<!--请选择您的房屋面积-->
						<li class="clearfix" @click="clickType(2)">
							<p class="fl">{{areaStr}}</p>
							<div class="fr">
								<img src="../../assets/img/index/designer_more_ic.png" alt="" />
							</div>
						</li>
						<!--请选择您的户型-->
						<li class="clearfix" @click="clickType(3)">
							<p class="fl">{{houseStr}}</p>
							<div class="fr">
								<img src="../../assets/img/index/designer_more_ic.png" alt="" />
							</div>
						</li>
						<!--请选择您的装修预算-->
						<li class="clearfix" @click="clickType(4)">
							<p class="fl">{{moneyStr}}</p>
							<div class="fr">
								<img src="../../assets/img/index/designer_more_ic.png" alt="" />
							</div>
						</li>
						<!--请选择您的装修风格-->
						<li class="clearfix" @click="clickType(5)">
							<p class="fl" :class="{'choose':chooseStyleList.length}">{{styleStr}}</p>
							<div class="fr">
								<i v-show="chooseStyleList.length==0" class="C2" style="margin-right: 0.28rem;">可多选</i>
								<img src="../../assets/img/index/designer_more_ic.png" alt="" />
							</div>
						</li>
					</ul>
				</div>
				<!--联系方式-->
				<div class="house contactWay">
					<h1 class="F5 house-title"><img src="../../assets/img/index/free_charge_contect_ic.png" alt="" />联系方式</h1>
					<ul class="F4 house-list">
						<li>
							<span>
								<input type="text" placeholder="您的称呼（选填）" maxlength="10" v-model='userName'/></span>
						</li>
						<li style="padding: 0 0 0 0.32rem;">
							<span>
								<input type="tel" placeholder="请输入手机号码，计算结果将由专员告知您" maxlength="11" v-model="userPhone"/>
							</span>
						</li>
						
					</ul>
				</div>
				<div class="last F7">
					<p>您的隐私非常重要，我们将竭力保证您的信息安全；</p>
					<p>加入后您将获得专属客服为您家装保驾护航</p>
				</div>
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
import yFooter from '../../components/Footer'
import allAreas from '../../../static/allAreas'
import house from '../../../static/house'
export default {
	name: 'quotation',
	components: {
		yHeader,
		yFooter
	},
	data() {
		return {
			isShowShade_register:false,//显示是否注册弹框
			isShowShade:false,//显示遮罩
			allAreas:allAreas,
			isShowCity:false,//显示选择城市
			isShowArea:false,//显示房屋面积
			isShowHouse:false,//显示选择户型
			isShowMoney:false,//显示装修预算
			isShowStyle:false,//显示装修风格
			
			/*选择城市*/
			cityStr:'请选择您所在城市',
			province:"北京",//显示-省
			city:"",//显示-市
			iProvince:0,
			iCity:0,
			cityId:0,//服务端需要的城市Id,
			cityArr:[{'id':1,'name':'北京市'}],//1默认是北京

			/*选择房屋面积*/
			areaStr:"请选择您的房屋面积",
			iArea:0,
			areaArr:house.areaArr,
			
			
			/*选择户型*/
			houseStr:"请选择您的户型",
			iRoom:0,
			iHall:0,
			iToilet:0,
			iBalcony:0,
			houseObj:house.houseObj,
			
			/*选择装修预算*/
			moneyStr:"请选择您的装修预算",
			iMoney:0,
			costRangeArr:house.costRangeArr,
			
			
			/*选择装修风格-多选*/
			styleStr:"请选择您的装修风格",
			decorateStyleArr:house.decorateStyleArr,
			chooseStyleList:[],//选择的列表
			chooseStyleListCode:[],//提交的列表code
			
			userName:'',//输入的称呼
			userPhone:'',//输入的手机号码
			
			
			
		}
	},
	created() {
		
	},
	mounted() {
		this.$nextTick(()=> {
			 window.addEventListener('resize', function () {
		        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
		            window.setTimeout(function () {
		                document.activeElement.scrollIntoViewIfNeeded();
		            }, 0);
		        }
		    })
		})
	},
	methods: {
		goBack() {
			invokeNative({"code": window.jsBridge.CODE_CLOSE});
		},
		/*选择城市是点击左边遮罩关闭选择城市弹框*/
		close(isShowCity) {
			if(isShowCity){
				this.isShowCity=false;//显示选择城市
				this.isShowShade=false;//显示遮罩
			}
		},
		/*列表点击显示对应的弹窗*/
		clickType(type) {
			this.isShowShade=true;//显示遮罩
			switch (type) {
				case 1:
					this.isShowCity=true;//显示选择城市

					this.isShowArea=false;//显示房屋面积
					this.isShowHouse=false;//显示选择户型
					this.isShowMoney=false;//显示装修预算
					this.isShowStyle=false;//显示装修风格
				break;
				case 2:
					this.isShowArea=true;//显示房屋面积
					
					this.isShowCity=false;//显示选择城市
					this.isShowHouse=false;//显示选择户型
					this.isShowMoney=false;//显示装修预算
					this.isShowStyle=false;//显示装修风格
				break;
				case 3:
					this.isShowHouse=true;//显示选择户型
					
					this.isShowCity=false;//显示选择城市
					this.isShowArea=false;//显示房屋面积
					this.isShowMoney=false;//显示装修预算
					this.isShowStyle=false;//显示装修风格
					break;
				case 4:
					this.isShowMoney=true;//显示装修预算
					
					this.isShowCity=false;//显示选择城市
					this.isShowArea=false;//显示房屋面积
					this.isShowHouse=false;//显示选择户型
					this.isShowStyle=false;//显示装修风格
				break;
				case 5:
					this.isShowStyle=true;//显示装修风格
					
					this.isShowCity=false;//显示选择城市
					this.isShowArea=false;//显示房屋面积
					this.isShowHouse=false;//显示选择户型
					this.isShowMoney=false;//显示装修预算
					
					break;
				
			}
			
		},

		/*选择省*/
		chooseProvince(item,index){
			this.iProvince = index;
			this.iCity = -1;
			this.cityArr = item.cities;
			this.province = item.name;
		},
		/*选择市*/
		chooseCity(item,index){
			this.iCity = index;
			this.city = item.name;
			this.cityId = item.id;
			this.sure(1);
		},
		/*选择房屋面积*/
		chooseArea(index) {
			this.iArea = index;
			this.sure(2);
		},
		/*选择房型-室*/
		chooseRoom(index) {
			this.iRoom = index;
		},
		/*选择房型-厅*/
		chooseHall(index) {
			this.iHall = index;
		},
		/*选择房型-卫*/
		chooseToilet(index) {
			this.iToilet = index;
		},
		/*选择房型-阳台*/
		chooseBalcony(index) {
			this.iBalcony = index;
		},
		/*选择装修预算*/
		chooseMoney(index) {
			this.iMoney = index;
			this.sure(4);
		},
		/*选择装修风格*/
		chooseStyle(item) {
			if (this.chooseStyleList.indexOf(item.desc) > -1) {
	          	let index = this.chooseStyleList.indexOf(item.desc);
	          	this.chooseStyleList.splice(index, 1);
	        } else {
	          	this.chooseStyleList.push(item.desc);
	          	this.chooseStyleListCode.push(item.code);
	        }
		},
		/*确定*/
		sure(type) {
			this.isShowShade=false;//显示遮罩
			this.isShowHouse=false;//显示选择户型
			this.isShowCity=false;//显示选择城市
			this.isShowArea=false;//显示房屋面积
			this.isShowMoney=false;//显示装修预算
			this.isShowStyle=false;//显示装修风格
			switch(type) {
				case 1:this.cityStr=this.province+"-"+this.city;break;
				
				case 2:this.areaStr = this.areaArr[this.iArea].desc;break;
				
				case 3:this.houseStr = this.houseObj.houseRoom[this.iRoom].desc
						+"-"+this.houseObj.houseHall[this.iHall].desc
						+"-"+this.houseObj.houseToilet[this.iToilet].desc
						+"-"+this.houseObj.houseBalcony[this.iBalcony].desc;
						break;
				case 4:this.moneyStr = this.costRangeArr[this.iMoney].desc;break;
				
				case 5:this.styleStr=this.chooseStyleList.join("-");
				
					if(this.chooseStyleList.length===0){
        				this.styleStr='请选择您的装修风格';
        			}
					break;
			}	
		},
		/*获取报价*/
		getQuote(){
			if(this.cityId===0){
				Toast("请选择您所在城市");
				return false;
			}
			if(this.areaStr==="请选择您的房屋面积"){
				Toast("请选择您的房屋面积");
				return false;
			}
			if(this.houseStr==="请选择您的户型"){
				Toast("请选择您的户型");
				return false;
			}
			if(this.moneyStr==="请选择您的装修预算"){
				Toast("请选择您的装修预算");
				return false;
			}
			if(this.styleStr==="请选择您的装修风格"){
				Toast("请选择您的装修风格");
				return false;
			}
			if(this.userName!=""&&!validRule.realname.test(this.userName)){
				Toast("请输入正确的称呼");
				return false;
			}
			if(this.userPhone=="" || !this.userPhone){
				Toast("请输入手机号");
				return false;
			}
			if(!validRule.phone.test(this.userPhone)){
				Toast("请输入正确的手机号");
				return false;
			}
			let data = {
			  	"area":this.cityId,
			  	"houseArea": this.areaArr[this.iArea].code,
			  	"room": this.houseObj.houseRoom[this.iRoom].code,
			  	"hall": this.houseObj.houseHall[this.iHall].code,
			  	"toilet": this.houseObj.houseToilet[this.iToilet].code,
			  	"balcony": this.houseObj.houseHall[this.iBalcony].code,
			  	"cost": this.costRangeArr[this.iMoney].code,
			  	"style": this.chooseStyleListCode,
			  	"phone": this.userPhone,
			  	"name": this.userName
			}
			console.log(data);
			//https://devcustomer.yingwumeijia.com:443/{version}/freeQuote/add
			this.$http.post(window.Host.customer+"/freeQuote/add",data).then((res) => {
//				alert(JSON.stringify(res));
				if(res.data.succ){
					let isNeedRegister = res.data.data;
					let _this = this;
					invokeNative({
		                "code":window.jsBridge.CODE_GET_LOGIN_STATUS,
		                "callback":"returnisLogin" 
		            });
		            window.returnisLogin=function(value){
		                var value=window.atob(value);
		                var res = JSON.parse(value);
		                if(res.data==1){//用户登录了
		                	invokeNative({'code':window.jsBridge.CODE_TOAST,'data':'提交成功'})
		                	_this.goBack();
		                }else {//没有登录
		                	if(isNeedRegister){//没有注册
		                		_this.isShowShade_register = true;
		                	}else {//注册了
		                		invokeNative({'code':window.jsBridge.CODE_TOAST,'data':'提交成功'})
		                		_this.goBack();
		                	}
		                }
		            }
					
				}else{
					didApiError(res);
				}
			})
		},
		nextRegister() {
			this.isShowShade_register = false;
			invokeNative({'code':window.jsBridge.CODE_TOAST,'data':'提交成功'})
			this.goBack();
		},
		register() {
			//https://devcustomer.yingwumeijia.com:443/{version}/freeQuote/updateRegister/15892591588
			this.$http.post(window.Host.customer+`/freeQuote/updateRegister/${this.userPhone}`).then((res) => {
				if(res.data.succ){
					this.$router.push({'name':'register',query:{'userPhone':this.userPhone}});
				}else{
					didApiError(res);
				}
			})
			
		}
	},//methods结束
}
</script>

<style scoped lang="less">
.content{
	bottom:1.2rem;
}
.fadeIn-enter-active {
  	animation: fadeIn .3s;
}
.fadeIn-leave-active {
  	animation: fadeIn .3s reverse;
}
@keyframes fadeIn {
    0% {
        opacity: 0
    }

    100% {
        opacity: 1
    }
}
.slide-enter-active {
  	animation: slideInRight .3s;
}
.slide-leave-active {
  	animation: slideInRight .3s reverse;
}
@keyframes slideInRight {
    0% {
        -webkit-transform: translateX(100%);
        -ms-transform: translateX(100%);
        transform: translateX(100%);
        visibility: visible
    }

    100% {
        -webkit-transform: translateX(0);
        -ms-transform: translateX(0);
        transform: translateX(0)
    }
}
.zoom-enter-active {
  	animation: zoomIn .3s;
}
.zoom-leave-active {
  	animation: zoomIn .3s reverse;
}
@keyframes zoomIn {
    0% {
        opacity: 0;
        -webkit-transform: scale3d(.3,.3,.3);
        -ms-transform: scale3d(.3,.3,.3);
        transform: scale3d(.3,.3,.3)
    }

    50% {
        opacity: 1
    }
}
.toast-register{
	position: fixed;
	top: 0;left: 0;right: 0;bottom: 0;
	background-color: rgba(0,0,0,0.6);
	z-index: 99999;
	    padding: 4.18666rem 1rem 0 1rem;
	.toast-register-box{
		border-radius:0.13333rem;
		h1{
			height: 2.33333rem;
			line-height: 2.33333rem;
			text-align: center;
			color: #000;
			font-size: 0.37333rem;
		}
		.toast-register-box-btn{
			
			height: 1.2rem;
			display: flex;
			button{
				flex: 1;
				background-color: #fff;
				font-size: 0.4rem;
				color: #ED316B;
				border-radius: 0  0 0.13333rem 0.13333rem;
			}
			button:first-child{
				border-right: 1px solid #e6e6e6;
				border-radius: 0  0 0 0.13333rem;
			}
		}
	}
}
.toast{
	position: fixed;
	top: 1.2rem;left: 0;right: 0;bottom: 0;
	background-color: rgba(0,0,0,0.6);
	z-index: 999;
	padding: 4rem 0.8rem 0 0.8rem;
	
	.chooseCity{
		.chooseCity-box{
			position: absolute;
			top: 0;left: 2.173333rem;
			bottom: 0;right: 0;
			display: flex;
			justify-content: space-between;
			.province,.province-city {
				width: 50%;
				height: 100%;
				overflow-y:auto;
				li{
					height: 1.04rem;
					line-height: 1.04rem;
					text-align: center;
					border-bottom: 1px solid #e6e6e6;
					border-right: 1px solid #e6e6e6;
					overflow: hidden;
				}
				li.choose{
					color: #ED316B;
					border-right: none;
					background-color: #f8f8f8;
				}
			}
		}
		
	}
	
	.chooseHouse,.chooseArea,.chooseMoney,.chooseStyle {
		border-radius: 0.08rem;
		.choose-title{
			color: #282828;
			font-size: 0.42666rem;
			height: 1.53333rem;
			line-height: 1.53333rem;
			text-align: center;
		    display: flex;
		    align-items: center;
		    justify-content: center;
		    color: #2E354E;
			.line-h {
				width: 1.18666rem;
				height: 1px;
				background-color: #e6e6e6;
				display: inline-block;
			}
			.line-h:first-child{
				margin-right: 0.44rem;
				
			}
			.line-h:last-child{
				margin-left: 0.44rem;
			}
		}
		.choose-content {
			padding: 0 1.13333rem;
			display: flex;
			justify-content: space-between;
			ul{
				
				li{
					margin-bottom: 0.22666rem;
					width: 1.36rem;
					height: 0.66666rem;
					text-align: center;
					line-height: 0.66666rem;
					color: #5b5b5b;
					background-color: #f4f4f4;
					border-radius: 0.08rem;
				}
				li.chooseClass {
					background-color: #ED316B;
					color: #fff;
				}
			}
			
		}
		.choose-sure {
			height: 1.08rem;
			line-height: 1.08rem;
			text-align: center;
			color: #ED316B;
			border-top:1px solid #e6e6e6;
		}
	}
	.chooseHouse {
		.choose-content {
			ul{
				width:22%;
				li{
					width: 100%;
				}
			}
		}
	}
	.chooseArea,.chooseMoney,.chooseStyle{
		padding-bottom: 0.93333rem;
		.choose-content{
			padding: 0 0.62666rem 0 0.69333rem;
			ul{
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				li{
					margin-bottom: 0;
					width: 45%;
					height: 1.04rem;
					text-align: center;
					line-height: 1.04rem;
					color: #5b5b5b;
					background-color: #fff;
					border-radius: 0;
					border-bottom: 1px solid #e6e6e6;
					color: #282828;
				}
				li.chooseClass {
					color: #ED316B;
					background-color: #fff;
				}
			}
		}
	}
	.chooseMoney {
		.choose-content{
			height: 4.26666rem;
			overflow-y: auto;
		}
	}
	.chooseStyle {
		padding-bottom: 0;
		.choose-content{
			height: 4.26666rem;
			overflow-y: auto;
		}
		.choose-sure {
			height: 1.08rem;
			line-height: 1.08rem;
			text-align: center;
			color: #ED316B;
			border-top:1px solid #e6e6e6;
			margin-top: 0.49333rem;
		}
	}
}
.pay{
    height:1.2rem;
    background:#ED316B;
    font-size: 0.4rem;
    color:rgba(255,255,255,1);
    display: block;
    width: 100%;
}
.free {
	padding-top: 0.28rem;
	img{
		width: 100%;
		display: block;
	}
	img:first-child{
		height: 2.17333rem;
		
	}
}
.quotation-main {
	overflow: hidden;
	margin: 0.32rem 0.24rem 0;
	border-radius: 0.13333rem;
	box-shadow:-1px 1px 10px #aaa,1px -1px 10px #aaa;
	.budget{
		padding-top:0.61333rem;
		h1{
			height: 0.73333rem;
			line-height: 0.73333rem;
			text-align: center;
		    display: flex;
		    align-items: center;
		    justify-content: center;
		    color: #2E354E;
			.line-h {
				width: 1.82666rem;
				height: 1px;
				background-color: #dfdfdf;
				display: inline-block;
			}
			.line-h:first-child{
				margin-right: 0.70666rem;
				
			}
			.line-h:last-child{
				margin-left: 0.70666rem;
			}
		}
		.gif {
			
			margin: 0 0.4rem;
			img.jsq {
				width: 100%;
				display: block;
			}
			.x-money {
				padding: 0.22666rem 0 0.29333rem;
				text-align: center;
				border: 1px solid #e6e6e6;
				border-radius:0 0 0.10666rem 0.10666rem;
				border-top: none;
				p{
					color: #5c5c5c;
					span{
						color: #5a5a5a;
					}
				}
			}
		}
	}
	.house {
		padding: 0 0.37333rem 0 0.41333rem;
		.house-title {
			margin-top: 0.2rem;
			height: 1rem;
			line-height: 1rem;
			color: #ED316B;
			img{
				width: 0.37333rem;
				height: 0.32rem;
				vertical-align: middle;
				margin-right: 0.16rem;
			}
		}
		.house-list {
			li{
				line-height: 1.17333rem;
				background-color: #f2f2f2;
				padding:0 0.46666rem 0 0.32rem;
				border: 1px solid #e6e6e6;
				margin-bottom: 0.29333rem;
				p{
					color: #737373;
				}
				p.choose{
					width: 94%;
					overflow: hidden;
					white-space: nowrap;
				}
				img{
					width: 0.18666rem;
					height: 0.34666rem;
					vertical-align: middle;
				}
			}
		}
	}
	.contactWay {
		.house-title {
			img{
				width: 0.34666rem;
				height: 0.34666rem;
			}
		}
		li {
			span{
				input {
					width: 100%;
					background-color: #f2f2f2;
				}
			}
		}
	}
	.last {
		margin-top: 0.57333rem;
		margin-bottom: 2.29333rem;
		text-align: center;
		color: #737373;
	}
	
}
</style>