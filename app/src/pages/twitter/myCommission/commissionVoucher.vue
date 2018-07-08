<!--结佣凭证页面-->
<template>
	<div class="commissionVoucher">
		<y-header><div class="clickMe" @click="goBack"><span></span></div>结佣凭证</y-header>
		<div class="content">
			<img :src="credential" alt="" />
		</div>
	</div>
</template>
<script>
import yHeader from '../../../components/Header'

export default {
  	name: 'commissionVoucher',
  	data() {
	    return {
			credential:this.$route.query.credential
	    }
  	},
  	components:{
	  	yHeader,
  	},
  	methods:{
	  	goBack(){
	    	this.$router.go(-1);
   		}
  	},
  	created(){

  	}
}
</script>
<style scoped lang="less">
.commissionVoucher {
	img{
		width: 100%;
		display: block;
	}
}
</style>