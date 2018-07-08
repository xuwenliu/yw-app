<template>
	<div class="twitter-info">
		<y-header>
			<div class="clickMe" @click="goBack"><span></span></div>推客信息
			<p @click="toDescription"></p>
		</y-header>
		<div class="content">
			<div class="twitter-user">
				<div class="twitter-user-left">
					<img :src="twitterTitle.twitterHead">
				</div>
				<div class="twitter-user-center">
					<p class="nickName F4 C1">{{twitterTitle.twitterName}}</p>
					<p class="invite-code F6 C5">邀请码:
						<span v-if="twitterTitle.myCode">{{twitterTitle.myCode}}</span>
						<span v-else>--</span>
					</p>
				</div>
				<div class="twitter-user-right">
					<span class="status F6" :class="{C6:twitterTitle.twitterStatus!=1}">{{twitterTitle.twitterStatusDesc}}</span>
					<img v-show="twitterTitle.twitterStatus!=1" class="right-bracket" src="../../assets/img/twitter/more_ico@2x.png" alt="">
				</div>
			</div>

			<div class="twitter-list bb1">
				<ul>
					<li>

						<router-link :to="{'name':'myCommission'}" class="border-B1 list-box">
							<span class="list F4 C1">我的佣金明细</span>
							<img class="right-bracket" src="../../assets/img/twitter/more_ico@2x.png">
						</router-link>

					</li>
					<li>
						<router-link :to="{'name':'myCustomer'}" class="border-B1 list-box">
							<span class="list F4 C1">我的客户信息</span>
							<img class="right-bracket" src="../../assets/img/twitter/more_ico@2x.png">
						</router-link>
					</li>
					<li v-show="isAllow">
						<router-link :to="{'name':'developTwitter',query: { type: 1}}" class="border-B1 list-box">
							<span class="list F4 C1">发展下线推客</span>
							<img class="right-bracket" src="../../assets/img/twitter/more_ico@2x.png">
						</router-link>
					</li>
					<li>
						<router-link :to="{'name':'inviteCustomerRegister'}" class="border-B1 list-box noBorder">
							<span class="list F4 C1">邀请客户注册</span>
							<img class="right-bracket" src="../../assets/img/twitter/more_ico@2x.png">
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import yHeader from '../../components/Header'
	export default {
		name: 'twitterInfo',
		components: {
			yHeader
		},
		data() {
			return {
				twitterList: ['我的佣金明细', '我的客户信息', '发展下线推客', '邀请客户注册'],
				twitterTitle: [],
				isAllow: true, //是否允许 显示发展下线推客这一栏
			}
		},
		created() {
			
			this.getTwitterImplementationNotes();
		},
		methods: {
			toDescription() { //点击问号去说明页面
				this.$router.push({ "name": "description"})
			},
			goBack() {
				invokeNative({ "code": window.jsBridge.CODE_CLOSE });
			},
			getTwitterImplementationNotes() {
				invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW });
				this.$http.get(window.Host.customer + "/twitter").then((res) => {
					// console.log(res);
//					 alert(JSON.stringify(res))
					if(res.data.succ) {
						invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
						if(res.data.data) {
							this.twitterTitle = res.data.data;
							this.isAllow = res.data.data.allow;
						}
					}else{
						invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
						didApiError(res);
					}
				})

	
			}
		},
		
	}
</script>
<style scoped lang="less">
	.twitter-user {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0.26666rem 0;
		background: #fff;
		height: 1.89333rem;
		border-bottom: 1px solid #e6e6e6;
	}
	
	.twitter-user-left {
		display: inline-flex;
		margin: 0 0.66666rem 0 0.64rem;
		img {
			width: 1.06666rem;
			height: 1.06666rem;
			border-radius: 50%;
		}
	}
	
	.twitter-user-center {
		flex: 1.5;
	}
	
	.nickName {}
	
	.invite-code {
		span {
			margin-left: 0.2rem;
		}
	}
	
	.twitter-user-right {
		margin-right: 0.53333rem;
		img {
			margin-left: 0.21333rem;
			vertical-align: middle;
			height: 0.32rem;
		}
	}
	
	.status {}
	
	.twitter-list {
		ul li {
			background: #fff;
			line-height: 1.65333rem;
		}
		.list-box {
			position: relative;
			display: block;
			img {
				position: absolute;
				top: 50%;
				margin-top: -0.16rem;
				right: 0.53333rem;
				height: 0.32rem;
			}
		}
	}
	
	.border-B1 {
		border-bottom: 1px solid #e6e6e6;
		margin-left: 0.64rem;
	}
	
	.noBorder {
		border-bottom: none;
	}
</style>