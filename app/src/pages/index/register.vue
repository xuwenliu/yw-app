<template>
	<div class="">
		<y-header>
			<div class="clickMe" @click="goBack"><span></span></div>注册
		</y-header>
		<y-footer>
			<button class="pay" @click="submitRegister([userPhone,pwd,code])">提交注册</button>
		</y-footer>
		<div class="content">
			<ul class="register F4 C1">
				<li class="bg0"><span>手机号码</span>{{userPhone}}</li>
				<li class="bg0 pr">
					<span>设置密码</span>
					<input type="password" id="pwd" placeholder="请输入8-20位密码" maxlength="20" v-model="pwd"/>
					<button @click="showPwd">
						<img v-show="!isShowPwd" src="../../assets/img/index/password_no_see_ic.png" alt="" />
						<img v-show="isShowPwd" src="../../assets/img/index/password_see_ic.png" alt="" />
					</button>
				
				</li>
				<li class="bg0 pr">
					<span><i style="letter-spacing: 0.5em;">验证</i>码</span>
					<input type="tel" placeholder="请输入6位数字验证码" maxlength="6" v-model="code"/>
					<button class="F4 C0" :class="{'reg-send-text-d':isdisabled}" :disabled="isdisabled" @click="getCode">{{sendBtnText}}</button>
				</li>
			</ul>
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
export default {
	name: 'register',
	components: {
		yHeader,
		yFooter
	},
	data() {
		return {
			sendBtnText: '获取',
			isdisabled:false,
			userPhone:this.$route.query.userPhone,
			isShowPwd:false,
			pwd:"",
			code:"",
		}
	},
	created() {
		
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		},
		showPwd(){
			this.isShowPwd = !this.isShowPwd;
			var dd= document.getElementById("pwd");
			if(this.isShowPwd){
				dd.type="text";

			}else {
				dd.type="password";
			}
		},
		 /*倒计时*/
      	downTime(dt){
	        dt.isdisabled = true;
	        let i = 60;
	        let timer = setInterval(function () {
	          	i--;
	          	dt.sendBtnText = i + "s";
	          	dt.isdisabled = true;
	          	if (i == 0) {
	            	clearInterval(timer);
	            	dt.sendBtnText = "重新获取";
	            	dt.isdisabled = false
	          	}
	        }, 1000)
	    },
		getCode() {

			Indicator.open();
			//https://devcustomer.yingwumeijia.com:443/{version}/user/sendSmsCode?phone=15892591500&source=1
			let api = window.Host.customer+`/user/sendSmsCode?phone=${this.userPhone}&source=1`;

			this.$http.post(api).then((res) => {
				if(res.data.succ){
					console.log(res);
					Indicator.close();
					this.downTime(this);
					
				}else{
					Indicator.close();
					Toast({message: res.data.message});
				}
			})  
		},
		validePwd() {
			if(this.pwd==""){
	        	Toast({message: '请设置密码'});
	          	return false
	       	}else if (!validRule.password.test(this.pwd)) {
	          	Toast({message: '请输入8-20位数字字母密码'});
	          	return false
	        }else {
	        	return true;
	        }
		},
		submitRegister(dt) {
			if(this.validePwd()){
				if(!validRule.phonecode.test(dt[2])){
					Toast({message: '验证码格式不正确'});
	          		return false
				}
		        const data = {
		        	"phone":dt[0].toString(),
		        	"password":dt[1].toString(),
		          	"smsCode":dt[2].toString(),
		        }
		        invokeNative({
		        	"code":window.jsBridge.CODE_REGISTER,
		        	"data":data,
		        	"callback":"returnRegisterResult"
		        })
		        window.returnRegisterResult = function(value) {
		        	var value=window.atob(value);
	                var res = JSON.parse(value);
	                if(res.data.data){
	                	invokeNative({"code":window.jsBridge.CODE_TOAST,"data":"注册成功！免费报价已提交"});
	                	invokeNative({"code":window.jsBridge.CODE_CLOSE});
			        }else {
			        	invokeNative({"code":window.jsBridge.CODE_TOAST,"data":res.data.message});
			        }
	            }
				
			}
		},
	},//methods结束
}
</script>

<style scoped lang="less">
.pay{
    height:1.2rem;
    background:#ED316B;
    font-size: 0.4rem;
    color:rgba(255,255,255,1);
    display: block;
    width: 100%;
}
.register {
	padding: 0.64rem 0.5rem 0 0.5rem;
	li{
		height: 1.17333rem;
		line-height: 1.17333rem;
		margin-bottom: 0.36rem;
		padding-left: 0.33333rem;
		border: 1px solid #e6e6e6;
		input::-webkit-input-placeholder{color:#BBB;}
		span{
			margin-right: 0.38666rem;
		}
		button{
			height: 1.17333rem;
			width: 1.8rem;
			position: absolute;
			top: 0;right: 0;
			background-color: #ED316B;
		}
		button.reg-send-text-d{
			background-color: #bbb;
			border: 1px solid #bbb;
		}
	}
	li:nth-child(2){
		button{
			background-color: #fff;
			border: none;
			img{
				width: 0.50666rem;
				height: 0.34666rem;
			}
		}
		
	}

}
</style>