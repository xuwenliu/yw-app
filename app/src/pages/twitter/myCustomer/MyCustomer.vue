<template>
	<div class="myCustomer">
       <y-header class="noBorder">
            <div class="clickMe" @click="goBack"><span></span></div>我的客户<p @click="changeShow"></p>
        </y-header>
        <Toast :ishow="isShowToast" @returnshow="changeShow"></Toast>
        <!-- 报备，已洽谈，已签约选项卡-->
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
import Toast from '../../../components/Toast'
export default {
    name: 'myCustomer',
    data () {
        return {
            isShowToast:false,
            inow:0,
            status:['报备','已洽谈',"已签约"],
        }
    },
    components:{
  	    yHeader,
        Toast,
    },
    methods:{
      	goBack(){
            this.$router.go(-1);
        },
        changeShow(){
            this.isShowToast=!this.isShowToast;
        },
        goTab(index){
            this.inow=index;
            switch(index){
                case 0:this.$router.replace({"name":"remark"});break;
                case 1:this.$router.replace({"name":"talkOverWith"});break;
                case 2:this.$router.replace({"name":"signAContract"});break;
            }
        }
    },
    created(){
        this.$router.replace({"name":"remark"});
    },

}

</script>
<style scoped lang="less">
.noBorder{
  border-bottom: 0;
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
