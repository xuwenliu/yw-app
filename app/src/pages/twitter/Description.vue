<template>
    <div class="description">
  	    <TopHeader><span @click="goBack"></span>说明</TopHeader>
  	    <div class="content bg0">
            <div class="userAgreement">
                <h4>平台将于每周二（节假日除外）集中发放佣金及奖金，会有专门客服提前与您联系，客服电话：028-85108092
                </h4>
                <h4>一、佣金计算公式：</h4>
                <p class="ti2">推荐客户成功签定装修合同并付款后，佣金按下列规则发放：</p>
                <!--该推客没有加入团队-->
        				<div v-show="!result.joinTeam">
        					<h4 class="ti2" v-show="designRatio && designRatio!=0">设计：签约金额的 {{designRatio | currency("",1)}}%</h4>
        					<h4 class="ti2" v-show="buildRatio && buildRatio!=0">施工：签约金额的 {{buildRatio | currency("",1)}}%</h4>
        				</div>
                <!--该推客加入团队-->
        			<div  v-show="result.joinTeam">
          				<h4 class="ti2" v-show="showDesign">{{designRatio}}</h4>
          				<h4 class="ti2" v-show="showBuild">{{buildRatio}}</h4>
        			 </div>

                        
                <br/>
                <h4>二、推荐成单流程</h4>
                <p class="ti2">1、进入“我的推客”页面。</p>
                <p class="ti2">2、进入“邀请客户注册”，点击”立即邀请”，分享给微信好友，或拷贝链接用短信发送给客户。</p>
                <p class="ti2">3、客户通过您的分享页面填写信息并下载APP使用。</p>
                <p class="ti2">4、推客应积极了解客户的需求，并告知客户平台上的优惠政策与保障方式。</p>
                <p class="ti2">5、客户和平台上的公司签约成功后，系统会自动推送系统消息和手机短信至推客，推客可以“我的客户信息中”查看客户的当前进度状态。</p>
                <p class="ti2">6、客户与装修公司签定正式装修施工合同后，平台于每周二（节假日除外）集中发放佣金及奖金，推客可以在“我的佣金明细”里查看佣金明细。</p>
            </div>
        </div>
    </div>
</template>

<script>
import TopHeader from '../../components/Header'
export default {
    name: 'description',
    components:{
  	    TopHeader
    },
    data() {
    	return {
    		result:{},
    		designRatio:"",//设计比例
    		buildRatio:"",//施工比例
    		showDesign:true,//显示设计
    		showBuild:true,//显示施工
    	}
    },
    created(){
		/*模拟数据start*/
		/*this.result = {
		    "designRatio": 15,//设计分配比例
		    "buildRatio": 22,//施工分配比例
		    
		    "designRatioDto": {//设计
		      	"teamRatio": 90,//团队分配比例,
		      	"memberRatio": 5//成员分配比例
		    },
		    "buildRatioDto": {//施工
		      	"teamRatio": 80,
		      	"memberRatio": 2
		    },
        "joinTeam": false
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
//			alert(JSON.stringify(res));
			    if(res.data.succ) {
	      			invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE});
	              	if(res.data.data) {
	                	this.result =  res.data.data;
	                	// alert(JSON.stringify(this.result));
	                	if(res.data.data.joinTeam){//入团
	                		/*设计*/
	                		if(res.data.data.designRatioDto){
	                			if(res.data.data.designRatioDto.memberRatio==0&&res.data.data.designRatioDto.teamRatio==0){
	                				//不显示
	                				this.showDesign = false;
	                			}else if(res.data.data.designRatioDto.memberRatio==0&&res.data.data.designRatioDto.teamRatio!=0){
	                				this.designRatio = "设计：佣金统一划入团队账户";
	                				this.showDesign = true;
	                			}else {
	                				this.designRatio ="设计：签约金额的"+res.data.data.designRatioDto.memberRatio.toFixed(1)+"%";
	                				this.showDesign = true;
	                			}
	                		}
							/*施工*/
	                		if(res.data.data.buildRatioDto){
	                			if(res.data.data.buildRatioDto.memberRatio==0&&res.data.data.buildRatioDto.teamRatio==0){
	                				//不显示
	                				this.showBuild = false;
	                			}else if(res.data.data.buildRatioDto.memberRatio==0&&res.data.data.buildRatioDto.teamRatio!=0){
	                				this.buildRatio = "施工：佣金统一划入团队账户";
	                				this.showBuild = true;
	                			}else {
	                				this.buildRatio ="施工：签约金额的"+res.data.data.buildRatioDto.memberRatio.toFixed(1)+"%";
	                				this.showBuild = true;
	                			}
	                		}
	                		
	                	}else {//未入团
	                		this.designRatio = res.data.data.designRatio?res.data.data.designRatio:"";
	                		this.buildRatio = res.data.data.buildRatio?res.data.data.buildRatio:"";
	                	}
	              		//alert(JSON.stringify(this.result));
	              	}
		       	}else{
		          	invokeNative({"code":window.jsBridge.CODE_DIALOG_HIDE });
		          	didApiError(res);
		      	}
			})
	   	}
    }
}
</script>
<style scoped lang="less">
.ti2 {
  text-indent: 2em;
}
.userAgreement {
  width: auto;
  height: auto;
  margin: 0.64rem 0.64rem;
  font-size: 0.37333rem;
  color: #414141;
  p{
    line-height: 0.61333rem;
  }
  h4 {
    font-size: 0.42667rem;
    line-height: 0.48rem;
    padding: 0.2rem 0;
    font-weight: bold;
  }
}
</style>
