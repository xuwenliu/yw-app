<template>
	<div class="applyForSecurity">
		<y-header>
		<div class="clickMe" @click="goBack"><span></span></div>
		<div>申请保障</div>
		</y-header>

		<div class="content"> 
			<ul class="supervisionCompanyList" v-if="supervisionCompanyList.length!=0">
				<li v-for="item in supervisionCompanyList" class="bb1">
					<router-link :to="{'name':'supervisionCompanyDetails',query:{'supervisionCompanyId':item.id}}">
						<div class="supervisionCompany-logo">
							<img :src="item.logo">
						</div>
						<div class="supervisionCompany-name">
							<h1 class="F4">{{item.name}}</h1>
							<p class="F5 C4">已成单  {{item.orderCount}}</p>
						</div>
						<div class="supervisionCompany-more">
							<img src="../../assets/img/safeguard/mine_more_ico@2x.png">
						</div>
					</router-link>
				</li>
			</ul> 
			<NoFile v-else>
	        	<img slot="bgimg" src="../../assets/img/supervision/agreement_no_pic_ic@2x.png">
	        	<span slot="info">暂无保障</span>
	      	</NoFile>
		</div>
	</div>
</template>

<script>
import yHeader from '../../components/Header'
import NoFile from '../../components/NoFile'
export default {
	name: 'applyForSecurity',
	components: {
		yHeader,
		NoFile
	},
	data() {
		return {
			cityId:2294,
			isShowNoPic:false,      //是否显示没有公司列表
			supervisionCompanyList:[
				// {
			 //      	"id": 1,
			 //      	"name": "四川成都全程无忧工程管理监理控股有限公司",
			 //      	"logo": "",
			 //      	"orderCount": 10
			 //    },
			 //    {
			 //      	"id": 2,
			 //      	"name": "成都网中天红科技有限公司",
			 //      	"logo": "",
			 //      	"orderCount": 20
			 //    },
			 //    {
			 //      	"id": 3,
			 //      	"name": "成都网中天红科技有限公司",
			 //      	"logo": "",
			 //      	"orderCount": 30
			 //    }
			],
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
	        _this.cityId = res.data;
	       //走定位
			invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
			_this.getSupervisionCompanyList();
		}

		
	},
	methods: {
		goBack(){
           invokeNative({"code":window.jsBridge.CODE_CLOSE});
       },
		getSupervisionCompanyList() {
			this.$http.get(window.Host.customer+`/v1080/supervisor/company?areaId=${this.cityId}`).then((res)=>{
				console.log(res);
				if(res.data.succ){
					if(res.data.data){
						invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
						this.supervisionCompanyList=res.data.data; 
						this.isShowNoPic=false;                   
					}else {
						this.isShowNoPic=true;
					}
				}else{
					invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
					didApiError(res);
				}
			})  
		},
	},//methods结束
	beforeRouteEnter (to, from, next) {
    	next(vm => {
			if(from.name=="supervisionCompanyDetails"){
				vm.getSupervisionCompanyList();
			}
		})
  	},
}
</script>

<style scoped lang="less">
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
.howGetSafeguard{
	height: 6.29333rem;
	background-color: #fff;
}
.supervisionCompanyList{
	margin-top: 0.26667rem;
	li{
		height: 2.26667rem;
		background-color: #fff;
		a{
			display: flex;
			color: #000;
			justify-content:space-between;
			height: 2.26667rem;
			align-items:center;
		}
		.supervisionCompany-logo{
			margin: 0 0.53333rem;
			img{
				display: block;
				width: 1.06667rem;
				height: 1.06667rem;
				border-radius: 0.53333rem;
			}
		}
		.supervisionCompany-name{
			width: 6rem;
		}
		.supervisionCompany-more{
			margin:0 0.53333rem;
			img{
				width: 0.18667rem;
				height: 0.34667rem;
			}
		}
	}
}
</style>