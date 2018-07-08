<!--佣金明细页面-->
<template>
	<div class="commissionDetails">
		<y-header><div class="clickMe" @click="goBack"><span></span></div>佣金明细</y-header>
		<div class="status bb1">
            <ul>
              <li v-for="(item,index) in status" @click="goTab(index)"><span class="F4 C1" :class="{'active':inow==index}">{{item}}</span></li>
            </ul>
        </div>
		<div class="content">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
import yHeader from '../../../components/Header'


export default {
  	name: 'commissionDetails',
  	data() {
	    return {
  			inow:0,
        status:['来自报备客户','来自下级推客'],
	    }
  	},
  	components:{
	  	yHeader
  	},
  	methods:{
	  	goBack(){
	    	this.$router.go(-1);
   		},
   		goTab(index){
            this.inow=index;
            switch(index){
                case 0:this.$router.replace({"name":"fromRemarkCustomer"});break;
                case 1:this.$router.replace({"name":"fromTwitter"});break;
                
            }
        }
  	},
  	created(){
        this.$router.replace({"name":"fromRemarkCustomer"});
    },
}
</script>
<style scoped lang="less">
.content {
	top: 2.37333rem;
}
.status{
  background-color: #fff;
  height: 1.17333rem;
  position: relative;
  width: 100%;
  z-index: 999;
  ul{
    margin: 0 0.68rem;
    display: flex;
    text-align: center;
    li{
      flex: 1;
      line-height: 1.17333rem;
    }
  }
  .active{
    color: #ed316b;
    border-bottom: 2px solid #ed316b;
    padding-bottom: 0.18666rem;
  }
}
</style>