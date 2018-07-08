<template>
  <div>
    <TopHeader class="clearfix" style="border-bottom: 0">
      <div class="clickMe" @click="goBack"><span></span></div>
      活动详情
      <!--<div class="createOrderDivCss C6 F3" v-show="!isHidenCreateButton" @click="clickListenerMyCroupBooking">我的拼团-->
      <!--</div>-->
    </TopHeader>


    <div class="C0 F3" @click="clickListenerInvite"
         style="position:fixed;z-index: 999; bottom:0;height: 1.17333rem;width:100%;text-align: center;line-height: 1.17333rem;background-color: #ed316b">
      邀请好友
    </div>

    <!--内容区域-->
    <div class="content bg0">
      <img :src="data.picUrl" style="width: 100%">
      <div class="F3 C1" style="margin-left: 0.53333rem;margin-top:0.53333rem; ">拼团券说明</div>
      <div class="F4 C1 getSubsidy_depicts" style="padding: 0.53333rem" v-html="data.description"></div>
      <div class="F5 C4 bg-c7"
           style="height: 1.2rem;padding-left: 0.53333rem;padding-top: 0.5rem;box-sizing: border-box">我的拼团
      </div>


      <!--我的拼团-->
      <div class="bb1">
        <ul style="display: flex;flex-wrap: wrap;padding:0.09333rem 0.24667rem;">
          <li v-for="(item,index) in data.groupPersonBaseInfoVos">
            <img :src="item.headImage"
                 style="width: 1.04rem;height: 1.04rem;border-radius: 0.52rem;margin: 0.18666rem 0.26666rem">
          </li>
        </ul>
        <div style="height: 2px" class="bb1"></div>

        <div
          style="height: 1.6rem;margin-left:  0.53333rem;margin-right:  0.53333rem;margin-bottom:0.2rem;display: flex;align-items: center;">

          <img :src="data.headImage"
               style="width: 1.04rem;height: 1.04rem;border-radius: 0.52rem;margin-right: 0.4rem">

          <div style="display: flex;flex-direction: column;margin-right: 0.36rem">
            <span class="F4 C1 textcut" style="width: 1.28rem">{{data.myName}}</span>
            <span class="F6 C4">我的拼团</span>
          </div>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
            <span style="text-align: center" class="F6 C4">{{data.nowPersonCount}}/{{data.maxPersonCount}}</span>
            <mt-progress style="width: 3.50666rem" :value="(data.nowPersonCount/data.maxPersonCount)*100"
                         :bar-height="5"></mt-progress>
          </div>

        </div>

      </div>

      <div class="bg-c7" style="height: 0.4rem"></div>

      <!--倒计时-->
      <div style="display: flex;align-items: center;height: 3.57333rem;margin-bottom: 1.2rem">

        <img style="width: 1.49333rem;height: 1.49333rem;margin: 0 1.06666rem"
             src="../../../../assets/img/activity_time_ic@2x.png">


        <div style="display: flex;flex-direction: column;align-items: center">
          <div class="last-time"><span class="F6 C4">剩余时间 </span> <em>{{data.day}}</em><i>天</i> <em>{{data.hour}}</em>
            <i>小时</i><em>{{data.min}}</em><i>分</i></div>
          <span class="F3 C1">还差{{data.maxPersonCount - data.nowPersonCount}}人,去邀请好友加入吧</span>
        </div>

      </div>

      <div class="bg-c7" style="height: 0.4rem;margin-bottom: 1.17333rem"></div>


    </div>
    <!--进行中-->
    <!--<group-booking-list-component></group-booking-list-component>-->
  </div>
</template>
<script>
  import TopHeader from '../../../../components/Header'
  import {Progress} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import $ from "jquery"


  export default {
    name: 'groupBookingMineList',
    components: {
      TopHeader,
      Indicator
    },
    data(){
      return {
        id: this.$route.query.id,
        data: {
//          "groupId": 0,
//          "picUrl": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//          "name": "测试",
//          "description": "都是废话考多少分就开始几点开始卡德罗斯卡德罗斯肯定撒",
//          "overTime": "",
//          "myName": "尼古拉斯加明",
//          "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//          "maxPersonCount": 5,
//          "nowPersonCount": 3,
//          "surplusTime": "",
//          "day": 3,
//          "hour": 12,
//          "min": 4,
//          "sec": 0,
//          "groupPersonBaseInfoVos": [
//            {
//              "userId": 0,
//              "name": "尼古拉",
//              "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//              "userType": 0,
//              "userTypeDesc": ""
//            },
//            {
//              "userId": 0,
//              "name": "尼古拉",
//              "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//              "userType": 0,
//              "userTypeDesc": ""
//            },
//            {
//              "userId": 0,
//              "name": "尼古拉",
//              "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//              "userType": 0,
//              "userTypeDesc": ""
//            },
//            {
//              "userId": 0,
//              "name": "尼古拉",
//              "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//              "userType": 0,
//              "userTypeDesc": ""
//            },
//            {
//              "userId": 0,
//              "name": "尼古拉",
//              "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//              "userType": 0,
//              "userTypeDesc": ""
//            },
//            {
//              "userId": 0,
//              "name": "尼古拉",
//              "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//              "userType": 0,
//              "userTypeDesc": ""
//            },
//            {
//              "userId": 0,
//              "name": "尼古拉",
//              "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//              "userType": 0,
//              "userTypeDesc": ""
//            },
//            {
//              "userId": 0,
//              "name": "尼古拉",
//              "headImage": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512887023369&di=01c82819c71c5a1d347fd61efe1c7c33&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F5243fbf2b211931389aae8626f380cd790238d72.jpg",
//              "userType": 0,
//              "userTypeDesc": ""
//            },
//          ]
        }
      }
    },
    methods: {
      goBack(){
        this.$router.go(-1)
      },

      /**
       * 获取拼团活动详情
       */
      getDetailsInfo(){
        Indicator.open();
        this.$http.get(window.Host.customer + `/group/getGroupDetailInfo/${this.id}`).then(res => {
          console.log(JSON.stringify(res.body.data));
          Indicator.close();
          if (res.body.succ) {
            this.data = res.body.data;
            this.$nextTick(() => {
              $(".getSubsidy_depicts").find("p").addClass("en-cut-txt");
              $(".getSubsidy_depicts").find("p img").css({
                "width": "100%"
              });
            })
          } else {
            didApiError(res)
          }
        }, error => {
          console.log("========:" + error);
          Indicator.close();
        })
      },


      /**
       * 邀请好友
       */
      clickListenerInvite(){

        invokeNative({
          'code': window.jsBridge.CODE_SHARE,
          'data': {
            "mShareUrl": window.Host.groupBookingShare + "/#/shareGroupBookingActivityDetails" + `?id=${this.id}`,
            "mShareImg": this.data.picUrl + window.Host.imgSize_80_80,
            "mDescription": this.data.shortDesc,
            "mShareTitle": this.data.name
          }
        })
      }
    },
    created(){
      console.log(this.id);
      this.getDetailsInfo()
    }
  }
</script>
<style>
  .last-time {
    display: flex;
    align-items: baseline;
  }

  .last-time em {
    color: #ed316b;
    font-size: 0.58666rem;
    margin-left: 0.2rem;
  }

  .last-time i {
    color: #282828;
    font-size: 0.32rem;
  }

</style>
