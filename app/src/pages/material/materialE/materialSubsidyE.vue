<template>
	<div class="materialSubsidyE">
		<TopHeader><div class="clickMe" @click="goBack"><span></span></div>主材补贴</TopHeader>
		<div class="bgimg">
			<img src="../../../assets/img/material/zcbt_info@2x.png">
			<h1 class="F3 fwb">补贴验证码:&nbsp;<span class="C1 nfwb">{{result.invitationCode}}</span></h1>
		</div>
		<footer>
			<img src="../../../assets/img/material/sanjiao.png">
			<div class="line"></div>
			<button class="F3 fwb" @click="copyCode">复制验证码</button>
			<button class="F3 fwb" @click="goShare">立即去分享</button>
		</footer>
	</div>
</template>
<script>
import TopHeader from '../../../components/Header'
export default {
	name: 'materialSubsidyE',
	components: {
		TopHeader,
	},
	data() {
		return {
			result:{},
		}
	},
	created() {
		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
		this.$http.get(window.Host.employee+"/material/subsidy").then((res) => {
			console.log(res)
			if(res.data.succ) {
				invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
				this.result=res.data.data;
			}else{
				invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
				if(res.data.stateCode != 312 && res.data.stateCode != 317) {
					invokeNative({"code": window.jsBridge.CODE_TOAST,"data":res.data.message});
				}
			}
		})
	},
	methods: {
		goBack() {
			invokeNative({"code": window.jsBridge.CODE_CLOSE});
		},
		//复制验证码
		copyCode() {
			invokeNative({
				"code":window.jsBridge.CODE_COPY,
				"data":this.result.invitationCode
			})
			invokeNative({
				"code":window.jsBridge.CODE_TOAST,
				"data":"已复制，请发给你的客户吧！"
			})
		},
		//去分享
		goShare() {
			console.log(this.result.url)
			invokeNative({
                "code":window.jsBridge.CODE_SHARE,
                "data":{
                    "mShareUrl": this.result.url,
                    "mShareImg": "http://o7zlnyltf.bkt.clouddn.com/share-material.jpg"+"?imageView2/1/w/100",
                    "mDescription": "最低成交价基础上的额外补贴",
                    "mShareTitle": "主材补贴 专享特惠"
                }
            });
		},
	}//methods结束
}
</script>
<style scoped lang="less">
.bgimg{
	width: 100%;
	position: absolute;
	bottom: 1.41333rem;
	left: 0;
	top: 1.2rem;
	right: 0;
	background: url("http://osz2pnx97.bkt.clouddn.com/zcbt_bg@2x.png") no-repeat left top;
	background-size: cover;
	overflow: hidden;
	img{
		width: 7.96rem;height: 9.22667rem;
		margin:1.52rem auto 0;
		display: block;
	}
	h1{
		color:#fac087;
		position: absolute;
		bottom: 0.55rem;
		left: 0.6rem;
		span{
			padding:0 0.18667rem;
			font-size: 0.50667rem;
			background-color: rgba(255,255,255,0.7);
		}
	}
}
footer{
	text-align: center;
	width: 100%;
	height: 1.38667rem;
	display: flex;
	background-color: #000;
	position: fixed;
	bottom: 0;
	left: 0;
	border-top: 0.02667rem solid #fac087;
	img{
		width: 0.5rem;
		height: 0.3rem;
	    position: absolute;
	    top: -1px;
	    left: 50%;
	    margin-left: -0.25rem;
	}
	.line{
		width: 0.02667rem;
		height: 0.88rem;
		background-color: #fac087;
		position: absolute;
		bottom: 0.1rem;
		left: 50%;
		margin-left:-1px;
	}
	button{
		color:#fac087;
		flex:1;
		background-color: #000;
	}
}
</style>
