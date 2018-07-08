<!-- http://localhost:8090/#/picPreview?picType=1 1=监理合同，2=四方监管协议-->

<template>
    <div class="picPreview">
    	<y-header><div class="clickMe" @click="goBack"><span></span></div>{{title}}</y-header>
        <imgView :smallImgArray="listImg" :isShowDelBtn="isShowDelBtn" :isShowBottom12="false"></imgView>
    </div>
</template>
<script>

import imgView from './imgPreview'
import yHeader from '../components/Header'
export default {
    components:{
        yHeader,
        imgView
    },
	data() {
        return {
            title:'',
            isShowDelBtn:false,
            listImg: [
                // 'http://covteam.u.qiniudn.com/ka2.jpg?width=650&height=424',
                // 'http://covteam.u.qiniudn.com/poster.png?width=1902&height=706',
                // 'http://covteam.u.qiniudn.com/ka2.jpg?width=650&height=424',
                // 'http://covteam.u.qiniudn.com/poster.png?width=1902&height=706',
            ],
          orderId:0,
          picType:0,
        }
    },
    methods:{
        goBack(){
            this.$router.go(-1);
        },
        loadPictures() {
          this.$http.get(window.Host.customer + `/order/${this.orderId}/orderImage`,
            {
              params:{
                "type": this.picType
              }
            }).then((res) => {
            console.log(res);
            if (res.data.succ) {
              this.listImg = res.body.data;
            } else {
              console.log("error" + res.data.message);
            }
          })
        }
    },
    created() {
        this.orderId = this.$route.query.orderId*1;
        this.picType = this.$route.query.picType;
        this.loadPictures();
        if(this.$route.query.picType==1){
            this.title="监理合同";
        }else{
            this.title="四方监管协议";
        }
    },
}
</script>
<style scoped lang="less">

</style>
