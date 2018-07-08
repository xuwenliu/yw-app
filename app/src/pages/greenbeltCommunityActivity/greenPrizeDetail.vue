<template>
  <div class="description">
    <TopHeader><span @click="goBack"></span>抽奖详情</TopHeader>
    <div class="content bg7">
      <div v-html="htmltext"></div>
    </div>
  </div>
</template>

<script>
  import TopHeader from '../../components/Header'

  export default {
    name: 'greenPrizeDetail',
    components: {
      TopHeader
    },
    data() {
      return {
        htmltext:"",
        lotteryId: this.$route.query.lotteryId,
      }
    },
    created() {
      this.loadPrize();
    },
    computed: {
      baseUrl () {
        if (this.$route.query.userType != 'c') {
          return window.Host.employee;
        } else {
          return window.Host.customer;
        }
      },
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      loadPrize() {
        this.$http.get(this.baseUrl+`/activity/lottery/${this.lotteryId}`).then((res)=>{
        console.log(res);
        if(res.body.succ == true){
          this.htmltext = res.body.data.content;
        } else  {
          if (res.body.stateCode != 312) {
            this.showToast(res.body.message);
          }
        }
      })
      },
      showToast(data){
        invokeNative({"code":window.jsBridge.CODE_TOAST,"data":data});
      },
    }
  }
</script>
<style scoped lang="less">

  .prizeHistory-container {
    background-color: red;
    img {
      width: 100%;
      height: 5.626666666rem;
      display: block;
    }
  }

  .prizeHistory-bottom {
    width: 100%;
    height: 2.3733333333rem;
    background-color: white;
    padding-top: 0.466666666rem;
    padding-left: 0.82666666666rem;
    i {
      display: inline-block;
      width: 0.0533333333rem;
      height: 0.3066666666rem;
      background-color: #DFAF7D;
    }
    span {
      margin-left: 0.15rem;
      font-size: 0.38666666666rem;
      color: #272828;
    }
  }

</style>
