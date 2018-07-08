<!--activityId userType=c/e-->
<template>
  <div class="description">


    <TopHeader><span v-if="share!=1" @click="goBack"></span>活动详情 <img
      v-if="share!=1"
      style="position: absolute;right: 0.2rem; height: 0.53333rem;height: 0.53333rem"
      @click="shareFunc"
      src="../../assets/img/greenbelt/icon-share.png">
    </TopHeader>


    <!-- 微信下载提示 -->
    <div v-show="showWxtips" @click="showWxtips = false" class="wxTips">
      <div></div>
    </div>


    <div class="content bg7">


      <div class="getSubsidy_depicts bg0 bottom-space" v-html="result.content"></div>


      <!--抽奖-->
      <div class="bg0 bottom-space">
        <div
          style="display: flex;align-items: center;flex-direction: column;height: 1.97333rem;padding-top: 0.4rem;box-sizing: border-box">
          <span class="F6 C1">大奖抽取累积用户数已达  <i>{{result.nowPersonCount}}</i> / <i>{{result.maxPersonCount}}</i></span>
          <mt-progress style="width: 6.26666rem" :value="(result.nowPersonCount/result.maxPersonCount)*100"
                       :bar-height="5"></mt-progress>
        </div>
        <div
          @click="clickListenerCheckLottery" class="bt1"
          style="display: flex;align-items: center;height: 1.24rem;justify-content: center;margin: 0 0.50666rem;">
          <span class="F4" style="color:#DFAF7D;margin-right: 0.4rem">查看往期抽奖</span>
          <img class="more-arrow" src="../../assets/img/more_ic@2x.png">
        </div>
      </div>

      <!--活动报名人数-->
      <div style="height: 1.6rem;display: flex;align-items: center;padding: 0 0.69333rem;" class="bg0 bottom-space">
        <span class="C1 F4" style="flex-grow: 2;">活动报名人数</span>
        <i class="F1 C8">{{result.joinPersonCount}}&nbsp;</i>
        <span class="C1 F5">位客户已报名</span>
      </div>

      <!--参与公司-->
      <div class="bg0">
        <!--标题-->
        <div style="display: flex;align-items: center;padding: 0 0.49333rem;height: 1.46666rem"
             v-if="result.activityCompanys">
          <i style="height: 0.4rem;width: 0.08rem;background-color: #DFAF7D"></i>
          <span style="margin-left: 0.49333rem;" class="F4 C1">参与装饰公司</span>
          <span class="C5 F5">（点击图标即可查看公司作品与优惠）</span>
        </div>
        <!--公司列表1-->
        <ul style="display: flex;flex-wrap: wrap;padding: 0.26666rem" class="bg0" v-if="result.activityCompanys">
          <li v-for="(item,index) in result.activityCompanys"
              @click="itemClickCompany(item.companyId)"
              style="margin: 0.2rem;display: flex;flex-direction: column;justify-content: space-between">
            <img :src="item.logo" alt="" style="width: 2.66666rem;height: 2.66666rem;border: #e6e6e6 solid 1px">
            <span
              style="text-align: center;line-height: 0.58666rem; margin-top: 0.13333rem;width: 2.66666rem;height: 0.58666rem;background-color: #DFAF7D;border: #DFAF7D solid 1px;"
              class="F7  C0">{{item.name}}</span>
            <span
              style="border: #e6e6e6 solid 1px;text-align: center;line-height: 0.58666rem; width: 2.66666rem;height: 0.58666rem;font-size: 0.26666rem;"
              class="C4">报名人数 {{item.personCount}}</span>
          </li>
        </ul>
        <!--公司列表1尾部-->
        <div style="display: flex;flex-direction: column;align-items: center;" v-if="result.activityCompanys">
          <span class="F5 C1">有活动楼盘户型设计或完工作品的公司</span>
          <span class="F7 C5" style="margin-top: 0.15rem;margin-bottom: 0.4rem">按作品数量排序</span>
        </div>
        <div v-if="result.activityCompanys" style="background-color:#D9D7D7;margin: 0 0.53333rem;height: 0.4rem"></div>
        <!--公司列表2-->
        <ul style="display: flex;flex-wrap: wrap;padding: 0.26666rem" class="bg0" v-if="result.otherCompanys">
          <li v-for="(item,index) in result.otherCompanys"
              @click="itemClickCompany(item.companyId)"
              style="margin: 0.2rem;display: flex;flex-direction: column;justify-content: space-between">
            <img :src="item.logo" style="width: 2.66666rem;height: 2.66666rem;border: #e6e6e6 solid 1px">
            <span
              style="text-align: center;line-height: 0.58666rem; margin-top: 0.13333rem;width: 2.66666rem;height: 0.58666rem;background-color: #DFAF7D;border: #DFAF7D solid 1px;"
              class="F7  C0">{{item.name}}</span>
            <span
              style="border: #e6e6e6 solid 1px;text-align: center;line-height: 0.58666rem; width: 2.66666rem;height: 0.58666rem;font-size: 0.26666rem;"
              class="C4">报名人数 {{item.personCount}}</span>
          </li>
        </ul>
        <!--公司列表2尾部-->
        <div style="display: flex;flex-direction: column;align-items: center;" v-if="result.otherCompanys">
          <span class="F7 C5" style="margin-bottom: 0.4rem">按作品数量排序</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import TopHeader from '../../components/Header'
  import $ from "jquery"
  import {Progress} from 'mint-ui';


  export default {
    name: 'description',
    components: {
      TopHeader,
    },
    data() {
      return {
        showWxtips: false, //APP外微信打开提示去游览器打开
        activityId: this.$route.query.activityId || 29,
        userType: this.$route.query.userType || 'c',
        share: this.$route.query.share || 0,
        result: {
          "activityId": 0,
          "name": "",
          "coverImage": "",
          "content": "",
          "nowPersonCount": 0,
          "maxPersonCount": 0,
          "joinPersonCount": 0,
          "activityCompanys": [
            {
              "companyId": 0,
              "logo": "",
              "name": "",
              "personCount": 0
            }
          ],
          "otherCompanys": [
            {
              "companyId": 0,
              "logo": "",
              "name": "",
              "personCount": 0
            }
          ]
        },
      }
    },
    created() {
      if (this.userType == 'e') {
        getAccountToken('getTokenOk');
      } else {
        this.getData()
      }


      var that = this;

      window.getTokenOk = (res) => {
        console.log("getTokenOk");
        that.getData()
      }
    },
    mounted() {
      this.$nextTick(() => {
        $(".mt-progress-progress").css('background-color', '#DFAF7D');
        $(".mt-progress-runway").css('border', 'solid #DFAF7D 1px');
        $(".mt-progress-runway").css('background-color', '#FFFFFF');
      })
    },
    methods: {

      /**
       * 关闭当前页面
       */
      goBack() {
        invokeNative({'code': window.jsBridge.CODE_CLOSE})
      },

      /**
       * 分享
       */
      shareFunc() {

        console.log(this.result.coverImage);

        invokeNative({
          "code": window.jsBridge.CODE_SHARE,
          "data": {
            "mShareUrl": location.href + "&share=1",
            "mShareImg": this.result.coverImage + window.Host.imgSize_80_80,
            "mDescription": `快来参加${this.result.name}`,
            "mShareTitle": this.result.name
          }
        })
      },

      /**
       * 查看往期抽奖
       */
      clickListenerCheckLottery() {
        this.$router.push({
          "name": "greenPrizeHistory",
          query: {"activityId": this.activityId, "share": this.share, "userType": this.userType}
        });
      },


      getHost() {
        var host;
        if (this.userType == 'c') {
          host = window.Host.customer
        } else {
          host = window.Host.employee;
        }
        return host;
      },


      /**
       * toast消息
       */
      toast(msg) {
        if (this.share != 1) {
          invokeNative({"code": window.jsBridge.CODE_TOAST, "data": msg});
        }
      },


      /**
       * 查看公司详情
       */
      itemClickCompany(companyId) {
        this.$router.push({
          "name": "greenbeltCommunityCompany",
          query: {"activityId": this.activityId, "companyId": companyId, "userType": this.userType, "share": this.share}
        });
      },


      /**
       * 获取页面数据
       */
      getData() {

        console.log(this.getHost() + `/activity/${this.activityId}/represent`);

        this.$http.get(this.getHost() + `/activity/${this.activityId}/represent`).then(res => {
          console.log(JSON.stringify(res));
          if (res.body.succ) {
            this.result = res.body.data;
            this.$nextTick(() => {
              $(".getSubsidy_depicts").find("p").addClass("en-cut-txt");
              $(".getSubsidy_depicts").find("p img").css({
                "width": "100%"
              });
            })
          } else {
            didApiError(res)
          }
        },error=>{
          console.log("ERROR");
          console.log(JSON.stringify(error));
        })
      }

    }
  }
</script>
<style scoped lang="less">


  .bottom-space {
    margin-bottom: 0.4rem;
  }

  .company-item {

  }

  .mt-progress-progress {
    position: absolute;
    display: block;
    background-color: #DFAF7D !important;
    top: 50%;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    border: solid #DFAF7D 1px;
    width: 0;
  }

</style>
