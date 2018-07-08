<template>
	<div class="moneyRule">
		<y-header><div class="clickMe" @click="goBack"><span></span></div>奖金规则</y-header>
		<div class="content">
			<!--该推客没有加入团队-->
			<div class="contract-amount" v-show="!result.joinTeam">
				<h1  v-show="designRatio && designRatio!=0">设计&nbsp;&nbsp;<span>签约金额的  <i>{{designRatio | currency("",1)}}%</i></span></h1>
				<h1  v-show="buildRatio && buildRatio!=0">施工&nbsp;&nbsp;<span>签约金额的 <i>{{buildRatio | currency("",1)}}%</i></span></h1>
			</div>
            <!--该推客加入团队-->
			<div class="contract-amount" v-show="result.joinTeam&&(result.designRatioDto.memberRatio!=0||result.designRatioDto.teamRatio!=0||result.buildRatioDto.memberRatio!=0||result.buildRatioDto.teamRatio!=0)">
  				<h1 v-show="showDesign" v-html="designRatio"></h1>
  				<h1 v-show="showBuild" v-html="buildRatio"></h1>
			 </div>
			<img :src="img">
		</div>
	</div>
</template>
<script>
import yHeader from '../../../components/Header'
export default{
	name:'moneyRule',
	data(){
		return {
			img:require("../../../assets/img/twitter/reward_info_page.png"),
			result:{},
			designRatio:"",//设计比例
    		buildRatio:"",//施工比例
    		showDesign:true,//显示设计
    		showBuild:true,//显示施工
			
		}
	},
	components:{
	  	yHeader
	},
	created(){
		/*模拟数据start*/
		/*this.result = {
		    "designRatio": 1,//设计分配比例
		    "buildRatio": 2,//施工分配比例
		    
		    "designRatioDto": {//设计
		      	"teamRatio": 0,//团队分配比例,
		      	"memberRatio": 0//成员分配比例
		    },
		    "buildRatioDto": {//施工
		      	"teamRatio": 6,
		      	"memberRatio": 3
		    },
		    "joinTeam":false,//是否加入团队
		};
		/*模拟数据end*/
		this.getRetioInfo();
	},
  	methods:{
	  	goBack(){
	   		this.$router.go(-1);
	   	},
	     getRetioInfo() {
	   		invokeNative({"code":window.jsBridge.CODE_DIALOG_SHOW});
		  	//https://devcustomer.yingwumeijia.com:443/{version}/twitter/ratioInfo
		  	this.$http.get(window.Host.customer+`/twitter/ratioInfo`).then((res)=> {
				//alert(JSON.stringify(res));
		    	if(res.data.succ) {
	      			invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE});
	              	if(res.data.data) {
	                	this.result =  res.data.data;
	                	if(this.result.joinTeam){//入团
	                		/*设计*/
	                		if(this.result.designRatioDto){
	                			if(this.result.designRatioDto.memberRatio==0&&this.result.designRatioDto.teamRatio==0){
	                				//不显示
	                				this.showDesign = false;
	                			}else if(this.result.designRatioDto.memberRatio==0&&this.result.designRatioDto.teamRatio!=0){
	                				this.designRatio = `设计 <span class="F3 fwb">佣金统一划入团队账户</span>`;
	                				this.showDesign = true;
	                			}else {
	                				this.showDesign = true;
	                				this.designRatio =`设计 <span class="F3 fwb">签约金额的 <i class="Cy">${this.result.designRatioDto.memberRatio.toFixed(1)}%</i></span>`;
	                				
	                			}
	                		}
							/*施工*/
	                		if(this.result.buildRatioDto){
	                			if(this.result.buildRatioDto.memberRatio==0&&this.result.buildRatioDto.teamRatio==0){
	                				//不显示
	                				this.showBuild = false;
	                			}else if(this.result.buildRatioDto.memberRatio==0&&this.result.buildRatioDto.teamRatio!=0){
	                				this.buildRatio = `施工 <span class="F3 fwb">佣金统一划入团队账户</span>`;
	                				this.showBuild = true;
	                			}else {
	                				this.buildRatio = `施工 <span class="F3 fwb">签约金额的 <i class="Cy">${this.result.buildRatioDto.memberRatio.toFixed(1)}%</i></span>`;
	                				this.showBuild = true;
	                			}
	                		}
                		}else {//未入团
	                		this.designRatio = this.result.designRatio?this.result.designRatio:"";
	                		this.buildRatio = this.result.buildRatio?this.result.buildRatio:"";
	                	}
              		}
		       	}else{
		          	invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
		          	didApiError(res);
		      	}
			})
	   	},
  	}
}
</script>
<style scoped lang="less">
.content{
	background-color: #fff;
	img{
		width:100%;
	}
}
/*动态设计合同、施工合同样式*/
.contract-amount{
	position: absolute;
	top: 16%;
	left: 50%;
	margin-left: -35%;
	width: 70%;
	border: 2px dotted #ffaa07;
	border-radius: 0.08rem;
	text-align: center;
	padding: 0.17333rem 0;
	h1{
		font-size: 0.32rem;
		color: #1f1f1f;
		span{
			font-size: 0.4rem;
			font-weight: bold;
		}
		i{
			font-size: 0.4rem;
			color: #FFAA07;
			font-weight: bold;
		}
	}
}
</style>