<!--?billId=1-->
<template>
  <div>
    <div>
      <TopHeader class="clearfix">
        <div class="clickMe" @click="goBack"><span></span></div>
        支付成功
      </TopHeader>
      <!--选项卡-->
      <div class="content bg-c7">

        <div class="paysuccess-content">

          <img style="width: 3.48rem;margin-top: 0.8rem;margin-bottom: 0.4rem" :src="imgs[currentIndex]">


          <h2 class="F1 C6">{{titles[currentIndex]}}</h2>


          <span class="F3 C1" v-show="currentIndex != 0"
                style="margin-top: 0.5rem;margin-left:1.6rem;margin-right: 1.6rem">{{decs[currentIndex]}}</span>


          <span class="F3 C1" v-show="currentIndex == 0"
                style="margin-top: 0.5rem;margin-left:1.6rem;margin-right: 1.6rem">还差{{data.surplusCount || 0}}人，去邀请好友加入吧</span>


        </div>
        <div style="margin-left: 0.53333rem;margin-right: 0.53333rem;margin-top: 1.68rem">
          <button class="F3 C0" style="width: 100%;height: 1.18666rem;background-color: #ed316b"
                  @click="clickListenerButtonEvent">{{btnTests[currentIndex]}}
          </button>

        </div>


      </div>
    </div>
  </div>
</template>

<script>
  import TopHeader from '../../../components/Header'
  import {Indicator} from 'mint-ui';

  export default {
    name: 'groupBookingActivityPaySuccess',
    components: {
      TopHeader,
      Indicator
    },
    data () {
      return {
        id: this.$route.query.id,
        isHidenCreateButton: false,
        groupId: 0,
        status: ['进行中', '已结束'],
        currentIndex: -1,
        imgs: [require("../../../assets/img/pt_pay_success_ic@2x.png"), require("../../../assets/img/pt_pay_success_ic2@2x.png"), require("../../../assets/img/pt_success_ic@2x.png"), require("../../../assets/img/pt_pay_success_ic@2x.png")],
        titles: ["支付成功", "支付成功", "发起拼团成功", "发起拼团成功"],
        decs: ["还差三人去邀请好友加入吧", "恭喜,拼团成功", "当前拼团已满，以为你发起新的拼团,您已成为团主,去邀请好友吧", "快去邀请好友加入拼团吧",],
        btnTests: ["去邀请好友吧", "查看拼团券", "邀请好友", "邀请好友"],
        data: {}
      }
    },
    methods: {
      goBack(){
        this.$router.go(-2)
      },


      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
        });
      },

      /**
       * 点击事件
       */
      clickListenerButtonEvent(){
        console.log("this.currentIndex:" + this.currentIndex);
        switch (this.currentIndex) {
          case 0:
            this.share();
            break;
          case 1:
            this.$router.push({name: "groupBookingCouponDetails", query: {source: 1, groupId: this.data.groupId}});
            break;
          case 2:
            this.share();
            break;
          case 3:
            this.share();
            break;
        }
      },

      /**
       * 分享
       */
      share(){
        console.log("===========groupId===============:" + this.data.groupId);
        invokeNative({
          'code': window.jsBridge.CODE_SHARE,
          'data': {
            "mShareUrl": window.Host.groupBookingShare + "/#/shareGroupBookingActivityDetails" + `?id=${this.data.groupId}`,
            "mShareImg": this.$route.query.img + window.Host.imgSize_80_80,
            "mDescription": this.$route.query.desc,
            "mShareTitle": this.$route.query.title
          }
        })
      },


      /**
       * 获取页面显示数据
       */
      getData(){
        Indicator.open();
        this.$http.get(window.Host.customer + `/group/payResult/${this.id}`).then(res => {
          Indicator.close();
          if (res.body.succ) {
            console.log("xxx:" + JSON.stringify(res.body.data));
            this.data = res.body.data;
            this.currentIndex = this.data.type - 1;
          } else {
            didApiError(res)
          }
        }, error => {
          Indicator.close()
        })
      }
    },
    created(){
      console.log("billid:" + this.id);
      this.getData()
    }
  }
</script>


<style>

  .paysuccess-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

</style>

