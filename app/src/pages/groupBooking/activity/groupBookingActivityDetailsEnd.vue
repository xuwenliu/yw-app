<template>
  <div>
    <TopHeader class="clearfix" style="border-bottom: 0">
      <div class="clickMe" @click="goBack"><span></span></div>
      活动详情
    </TopHeader>

    <!--内容区域-->
    <div class="content bg-c7">

      <!--广-告-区域-->
      <div class="bb1 bg0">
        <img :src="data.picUrl" style="width: 100%;display: block">
        <div class="F3 C1" style="margin-left: 0.53333rem;margin-top:0.53333rem; ">{{data.name}}</div>
        <div class="F4 C1 getSubsidy_depicts" style="padding: 0.53333rem" v-html="data.description"></div>
        <!--<img :src="data.picUrl" style="width: 100%;margin-bottom: 0.2rem">-->
      </div>

      <!--video-->
      <div v-if="data.videoUnitDto" class="short-video bb1" @click="playVideo" style="margin-top: 0.4rem">
        <div v-show="showPayBtn" class="paly-btn"></div>
        <video id="video" width="100%" :src="data.videoUnitDto.url" :poster="videoThumbnail"></video>
      </div>


      <div class="bb1 bg0">

        <div v-if="data.groupEndInfoVos" v-for="(bigItem,bigIndex) in data.groupEndInfoVos" style="margin-top: 0.4rem">

          <div class="F4 C1 bg0" style="display: flex;align-items: center;height: 1.2rem;padding-left: 0.53333rem">
            一起拼团的用户
          </div>
          <div class="bb1">
            <ul style="display: flex;flex-wrap: wrap;padding:0.09333rem  0.34667rem;">
              <li v-for="(item,index) in bigItem.groupPersonBaseInfoVos">
                <img :src="item.headImage"
                     style="width: 1.04rem;height: 1.04rem;border-radius: 0.52rem;margin: 0.18666rem 0.26666rem">
              </li>
            </ul>
            <div style="height: 2px" class="bb1"></div>

            <!--<div-->
            <!--style="height: 1.6rem;margin-left:  0.53333rem;margin-right:  0.53333rem;margin-bottom:0.2rem;display: flex;align-items: center;">-->

            <!--<img :src="data.headImage"-->
            <!--style="width: 1.04rem;height: 1.04rem;border-radius: 0.52rem;margin-right: 0.4rem">-->

            <!--<div style="display: flex;flex-direction: column;margin-right: 0.36rem">-->
            <!--<span class="F4 C1 textcut" style="width: 1.28rem">{{data.myName}}</span>-->
            <!--<span class="F6 C4">我的拼团</span>-->
            <!--</div>-->
            <!--<div style="display: flex;flex-direction: column;justify-content: center;align-items: center">-->
            <!--<span style="text-align: center" class="F6 C4">1/2</span>-->
            <!--<mt-progress style="width: 3.50666rem" :value="20" :bar-height="5"></mt-progress>-->
            <!--</div>-->

            <!--</div>-->

            <div v-show="bigItem.maxPersonCount == bigItem.nowPersonCount"
                 @click="clickListenerCheckCoupon(bigItem.groupId)"
                 class="F4 C0"
                 style="background-color: #ed316b;height: 1rem;margin: 0.2rem 0.53333rem;display: flex;justify-content: center;align-items: center;">
              查看拼团券
            </div>

          </div>
        </div>


      </div>

      <div class="bg-c7" style="height: 0.4rem"></div>

      <!--公告-->
      <div v-if="data.affiche">
        <div style="height: 1.13333rem;display: flex;align-items: center">

          <img src="../../../assets/img/pt_news_ic@2x.png"
               style="width: 0.58666rem;height: 0.53333rem;margin-left: 0.53333rem;margin-right: 0.4rem">
          <span class="F3 C1">活动公告</span>
        </div>

        <div style="padding-bottom:  0.53333rem" class="getSubsidy_depicts" v-html="data.affiche"></div>

      </div>

      <div class="bg-c7" style="height: 0.4rem;margin-bottom: 1.17333rem"></div>


      <!--<div class="C0 F3"-->
      <!--style="position:fixed;bottom:0;height: 1.17333rem;width:100%;text-align: center;line-height: 1.17333rem;background-color: #ed316b;z-index: 999"-->
      <!--@click="clickListenerLaunchGroupBooking">-->
      <!--发起拼团-->
      <!--</div>-->

    </div>
  </div>
</template>
<script>
  import TopHeader from '../../../components/Header'
  import {Progress} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import $ from "jquery"


  export default {
    name: 'groupBookingActivityDetailsEnd',
    components: {
      TopHeader,
      Indicator
    },
    data(){
      return {
        id: this.$route.query.id,
        state: this.$route.query.state,
        showPayBtn: true,
        groupEndInfoVos: {},
        groupBaseInfoVos: {},
        videoThumbnail: "",
        data:{}
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
        this.$http.get(window.Host.customer + `/group/groupActivity/${this.id}/detail/end`).then(res => {
          console.log(res);
          Indicator.close();
          if (res.body.succ) {
            this.data = res.body.data;
            if (this.data.videoUnitDto) {
              this.videoThumbnail = this.data.videoUnitDto.url + `?vframe/jpg/offset/${this.data.videoUnitDto.second}/w/750`;//视频缩略图
            }
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
          Indicator.close();

        })
      },


      /**
       * 查看更多拼团lk
       */
      clickListenerMoreGroup(){
        this.$router.push({name: 'groupBookingActivityGroupList', query: {id: this.id}})
      },

      /**
       * 参加拼团
       */
      itemClickListenerJoin(groupId){
        console.log("参与拼团");
        Indicator.open();
        this.$http.post(window.Host.customer + `/group/joinGroup/${groupId}`).then(res => {
          Indicator.close();
          console.log("xxxxxxxxxxxxxx:" + JSON.stringify(res.body));
          if (res.body.succ) {
            this.didGroupBookingSuccess(res.body.data);
          } else {
            didApiError(res)
          }
        }, error => {
          console.log("xxxxxxxxxxxxxx:error" + JSON.stringify(error));
          Indicator.close();
        })

      },

      /**
       * 发起拼团
       */
      clickListenerLaunchGroupBooking(){
        console.log("发起拼团");
        Indicator.open();
        this.$http.post(window.Host.customer + `/group/createGroup/${this.id}`).then(res => {
          console.log(res);
          Indicator.close();
          if (res.body.succ) {
            this.didGroupBookingSuccess(res.body.data);
          } else {
            didApiError(res)
          }
        }, error => {
          Indicator.close();

        })
      },

      /**
       * 播放视屏
       */
      playVideo() {
        var _this = this;
        var myVideo = document.getElementById("video");
        this.showPayBtn = false;
        if (myVideo.paused) {
          myVideo.play();
        } else {
          myVideo.pause();
        }
        myVideo.ontimeupdate = function () {
          if (myVideo.currentTime === myVideo.duration || myVideo.paused) {
            _this.showPayBtn = true;
          }
        }
      },


      /**
       * 拼团成功
       * @param info
       */
      didGroupBookingSuccess(info){
        this.$router.push({
          name: "groupBookingActivityConfirm", query: {
            "groupActivityId": info.groupActivityId,
            "groupActivityName": info.groupActivityName,
            "picUrl": info.picUrl,
            "billId": info.billId,
            "description": this.data.shortDesc,
            "groupId": info.groupId,
            "payAmount": info.payAmount,
            "userId": info.userId
          }
        })
      },


      /**
       * 查看拼团券
       */
      clickListenerCheckCoupon(groupId){
        this.$router.push({name: "groupBookingCouponDetails", query: {source: 1, groupId: groupId}});
      }

    },
    created(){
      console.log(this.id);
      this.getDetailsInfo()
    }
  }
</script>
<style lang="less" scoped>
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

  .short-video {
    margin-bottom: 0.37333rem;
    position: relative;

  .paly-btn {
    width: 1.73333rem;
    height: 1.73333rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -0.86667rem;
    margin-left: -0.86667rem;
    z-index: 1;
    background: url("../../../assets/img/material/pt_play_bt@2x.png") no-repeat center center;
    background-size: 100%;
  }

  video {
    display: block;
  }

  }


</style>
