<template>
  <div>
    <TopHeader class="clearfix">
      <div class="clickMe" @click="goBack"><span></span></div>
      活动详情
    </TopHeader>


    <div class="C0 F3"
         style="position:fixed;bottom:0;height: 1.17333rem;width:100%;text-align: center;line-height: 1.17333rem;background-color: #ed316b;z-index: 999"
         @click="clickListenerLaunchGroupBooking">
      发起拼团
    </div>

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
      <div v-if="data.videoUnitDto" class="bg-c7" style="height: 0.4rem"></div>
      <div v-if="data.videoUnitDto" class="short-video bb1" @click="playVideo">
        <div v-show="showPayBtn" class="paly-btn"></div>
        <video id="video" width="100%" :src="data.videoUnitDto.url" :poster="videoThumbnail"></video>
      </div>

      <!--当前拼团-->
      <div class="bb1 bg0" style="margin-top: 0.4rem">

        <div>
          <!--当前拼团人数-->
          <div
            style="height: 1.13333rem;display: flex;align-items: center;justify-content: space-between;margin: 0 0.53333rem">
            <span class="C1 F3">当前拼团 ({{data.groupBaseInfoVos ? data.groupBaseInfoVos.length : 0}})</span>
            <div class="C4 F6" style="display: flex;align-items: center"
                 v-if="data.groupBaseInfoVos && data.groupBaseInfoVos.length > 3" @click="clickListenerMoreGroup">
              <span>查看更多</span>
              <img style="margin-left: 0.2rem" class="more-arrow" src="../../../assets/img/more_ic@2x.png">
            </div>
          </div>

          <!--当前拼团列表-->
          <ul style="padding: 0 0.53333rem" class="bb1" v-if="groupBaseInfoVos">
            <li v-for="(item,index) in groupBaseInfoVos"
                style="display: flex;align-items: center;height: 1.6rem;justify-content: space-between">
              <img :src="item.headImage"
                   style="width: 1.04rem;height: 1.04rem;border-radius: 0.52rem;margin-right: 0.4rem">

              <div style="display: flex;flex-direction: column;">
                <span class="F4 C1 textcut" style="width: 1.28rem">{{item.name}}</span>
                <span class="F6 C4" style="padding-right: 0.36rem">正在拼团</span>
              </div>
              <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                <span style="text-align: center" class="F6 C4">{{item.nowPersonCount}}/{{item.maxPersonCount}}</span>
                <mt-progress style="width: 3rem" :value="(item.nowPersonCount/item.maxPersonCount)*100" :bar-height="5"></mt-progress>
              </div>
              <div class="F4" style="display: flex;justify-content: flex-end;flex-grow: 1">
              <span v-show="item.maxPersonCount != item.nowPersonCount" @click="itemClickListenerJoin(item.groupId)"
                    style="display:block;height: 0.76rem;width: 2rem;border: solid 1px #ed316b;text-align: center;color:#ed316b;border-radius:0.10666rem;line-height: 0.76rem">参团</span>
                <span v-show="item.maxPersonCount == item.nowPersonCount"
                      style="display:block;height: 0.76rem;width: 2rem;background-color: #BBBBBB;text-align: center;color:#FFFFFF;border-radius:0.10666rem;line-height: 0.76rem">拼团已满</span>
              </div>
            </li>
          </ul>
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



    </div>
  </div>
</template>
<script>
  import TopHeader from '../../../components/Header'
  import {Progress} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import $ from "jquery"


  export default {
    name: 'groupBookingActivityDetails',
    components: {
      TopHeader,
      Indicator
    },
    data(){
      return {
        id: this.$route.query.id,
        showPayBtn: true,
        groupBaseInfoVos: [],
        videoThumbnail: "",
        data:{},//http://d.hiphotos.baidu.com/image/pic/item/728da9773912b31bc351745a8c18367adab4e180.jpg
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
        this.$http.get(window.Host.customer + `/group/groupActivity/${this.id}/detail/notEnd`).then(res => {
          console.log(JSON.stringify(res.body.data));
          Indicator.close();
          if (res.body.succ) {
            this.data = res.body.data;
            if (this.data.videoUnitDto) {
              this.videoThumbnail = this.data.videoUnitDto.url + `?vframe/jpg/offset/${this.data.videoUnitDto.second}/w/750`;//视频缩略图
            }

            if (this.data.groupBaseInfoVos) {
              if (this.data.groupBaseInfoVos.length > 3) {
                for (var i = 0; i < 3; i++) {
                  this.groupBaseInfoVos[i] = this.data.groupBaseInfoVos[i]
                }
              }else {
                this.groupBaseInfoVos = this.data.groupBaseInfoVos
              }
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
