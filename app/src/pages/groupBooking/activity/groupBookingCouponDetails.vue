<!--?groupId=(优惠券Id)source=(来源，没有字段为原生打开)-->
<template>
  <div>
    <TopHeader class="clearfix">
      <div class="clickMe" @click="goBack"><span></span></div>
      活动详情
    </TopHeader>

    <div class="content bg-c7">
      <div class="bg0 bb1"
           style="height: 1.6rem;display: flex;align-items: center;justify-content:space-between;padding: 0 0.53333rem;">

        <span class="F1 C1 fwb">拼团券</span>
        <span class="F3 C6">{{data.ticketNo}} <i v-show="data.state==1">(已使用)</i></span>
      </div>
      <div style="height: 1.2rem;box-sizing:border-box;padding-top: 0.53333rem;padding-left: 0.53333rem" class="F5 C4">
        我的信息
      </div>

      <div class="F4 C1 bg0"
           style="display: flex;align-items: center;justify-content: space-between;height: 1.2rem;padding: 0 0.53333rem">
        <span>客户姓名</span>
        <span>{{data.name}}</span>
      </div>
      <div class="F4 C1 bg0 bb1"
           style="display: flex;align-items: center;justify-content: space-between;height: 1.2rem;padding: 0 0.53333rem">
        <span>联系电话</span>
        <span>{{data.phone}}</span>
      </div>

      <div style="height: 1.2rem;box-sizing:border-box;padding-top: 0.53333rem;padding-left: 0.53333rem" class="F5 C4">
        拼友
      </div>
      <ul class="bb1 bg0" style="display: flex;flex-wrap: wrap;padding:0.09333rem 0;justify-content: flex-start">
        <li v-for="(item,index) in data.groupPersonBaseInfoVos">
          <div style="position: relative">
            <img :src="item.headImage"
                 style="width: 1.04rem;height: 1.04rem;border-radius: 0.52rem;margin: 0.18666rem 0.26666rem">
            <span v-if="index==0"
                  style="display: flex;align-items: center;justify-content: center; position: absolute;top: 0;right: 0;font-size: 0.2rem;background-color: #FAC08B;height: 0.39333rem;width: 0.76666rem;border-radius: 0.18666rem"
                  class="C0">团长</span>
          </div>
        </li>
      </ul>

      <!--公告-->
      <div class="bg0" style="margin-top: 0.4rem" v-if="data.affiche">
        <div style="height: 1.13333rem;display: flex;align-items: center;">

          <img src="../../../assets/img/pt_news_ic@2x.png"
               style="width: 0.58666rem;height: 0.53333rem;margin-left: 0.53333rem;margin-right: 0.4rem">
          <span class="F3 C1">活动公告</span>
        </div>

        <div class="shuibian" style="padding-bottom:  0.53333rem" v-html="data.affiche"></div>

      </div>
      <!--说明-->
      <div class="bg0" style="margin-top: 0.4rem">
        <div style="height: 1.13333rem;display: flex;align-items: center;">

          <img src="../../../assets/img/yhq_rules_info_ic@2x.png"
               style="width: 0.4rem;margin-left: 0.53333rem;margin-right: 0.4rem">
          <span class="F3 C1">拼团券说明</span>
        </div>

        <div class="F4 C1" style="padding-bottom:  0.53333rem;margin: 0 0.53333rem">{{data.ticketDescription}}</div>

      </div>

    </div>
  </div>
</template>
<script>
  import TopHeader from '../../../components/Header'
  import {Indicator} from 'mint-ui';
  import $ from "jquery"

  export default {
    name: 'groupBookingCouponDetails',
    components: {
      TopHeader,
      Indicator
    }, data(){
      return {
        groupId: this.$route.query.groupId,
        source: this.$route.query.source,
        data: {}
      }
    },
    methods: {
      goBack()
      {
        if (this.source) {
          this.$router.go(-1)
        } else {
          invokeNative({'code': window.jsBridge.CODE_CLOSE})
        }
      }
      ,


      /**
       * 获取页面数据
       */
      getData(){
        console.log("拼团详情ID：" + this.groupId);
        Indicator.open();
        this.$http.get(window.Host.customer + `/group/getTicketDetailInfo/${this.groupId}`).then(res => {
          console.log(res);
          Indicator.close();
          if (res.body.succ) {
            this.data = res.body.data;
            this.$nextTick(() => {
              $(".shuibian").find("p").addClass("en-cut-txt");
              $(".shuibian").find("p img").css({
                "width": "100%"
              });
            })
          } else {
            didApiError(res);
          }
        }, error => {
          Indicator.close()
        })
      }
    }
    ,
    created()
    {
      console.log(this.id);
      this.getData()
    }
  }
</script>
