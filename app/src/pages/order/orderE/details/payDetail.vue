<!--/#/payDetail?orderId=9-->
<template>
  <div>
    <TopHeader>
      <div class="clickMe" @click="goBack"><span></span></div>
      打款明细
    </TopHeader>
    <ShowImages v-show="isShow">
      <div class="show-images-box" @click="isShowImg(null,false)"><img :src="imageUrl"/></div>
    </ShowImages>
    <div class="content btm">
      <NoFile v-if=!payDetailData.length><span slot="info">没有打款明细！</span></NoFile>
      <div class="pay-detail-box" v-if=payDetailData.length>
        <ul v-for="g in payDetailData">
          <li><span class="F8 C1">{{- g.transferAmount | currency("")}}</span><em class="F4 C5 block">{{g.transferTime |
            setTime}}</em></li>
          <li><img :src="g.credential+'&imageView2/2/h/128/'" style="width:1.70rem"
                   @click.stop="isShowImg(g.credential,true)"/></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import TopHeader from '../../../../components/Header'
  import NoFile from '../../../../components/NoFile'
  import ShowImages from '../../../../components/ShowImages'
  export default{
    name: "billPayDetail",
    components: {
      TopHeader,
      NoFile,
      ShowImages
    },
    data(){
      return {
        imageUrl: "",
        isShow: false,
        payDetailData: [],
      }
    },
    created(){
      let orderId = this.$route.query.orderId;
      orderId ? this.getPayDetailList(orderId) : "";
    },
    methods: {
      goBack(){
          this.$router.go(-1);
      },
      getPayDetailList(id){
        this.$http.get(window.Host.employee + `/order/${id}/settled`).then(function (res) {
          if (res.data.stateCode === 0) {
            this.payDetailData = res.data.data;
          } else {
            invokeNative({"code": 1004, data: res.data.message});
          }
        })
      },
      isShowImg(dt, bl){
        this.isShow = bl;
        dt ? this.imageUrl = dt : "";
      }
    }
  }
</script>
<style scoped lang="less">
  .pay-detail-box ul {
    background: #fff;
    padding: 0.64rem 0.53333rem;
    height: 2.45333rem;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex; /* Safari */
    line-height: 0.56rem;
    border-bottom: 1px solid #e6e6e6;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
