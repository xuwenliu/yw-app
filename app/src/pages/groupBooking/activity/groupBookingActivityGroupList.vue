<template>
  <div>
    <TopHeader class="clearfix">
      <div class="clickMe" @click="goBack"><span></span></div>
      拼团列表
      <!--<div class="createOrderDivCss C6 F3" v-show="!isHidenCreateButton" @click="clickListenerMyCroupBooking">我的拼团-->
      <!--</div>-->
    </TopHeader>

    <!--内容区域-->
    <div class="content bg-c7">

      <!--当前拼团-->
      <div class="bb1 bg0">
        <!--当前拼团列表-->
        <ul>
          <li v-for="(item,index) in data.groupBaseInfoVos" class="bb1"
              style="padding: 0 0.53333rem;display: flex;align-items: center;height: 1.6rem;justify-content: space-between">
            <img :src="item.headImage"
                 style="width: 1.04rem;height: 1.04rem;border-radius: 0.52rem;margin-right: 0.4rem">

            <div style="display: flex;flex-direction: column;">
              <span class="F4 C1 textcut" style="width: 1.28rem">{{item.name}}</span>
              <span class="F6 C4" style="padding-right: 0.36rem">正在拼团</span>
            </div>
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
              <span style="text-align: center" class="F6 C4">{{item.nowPersonCount}}/{{item.maxPersonCount}}</span>
              <mt-progress style="width: 3rem" :value="(item.nowPersonCount / item.maxPersonCount) * 100" :bar-height="5"></mt-progress>
            </div>
            <div class="F4" style="display: flex;justify-content: flex-end;flex-grow: 1">
              <span v-show="item.maxPersonCount != item.nowPersonCount" @click="itemClickListenerJoin(item.groupId)"
                    style="display:block;height: 0.76rem;width: 2rem;border: solid 1px #ed316b;text-align: center;color:#ed316b;border-radius:0.10666rem;line-height: 0.76rem">参团</span>
              <span v-show="item.maxPersonCount == item.nowPersonCount"
                    style="display:block;height: 0.76rem;width: 2rem;background-color: #BBBBBB;text-align: center;color:#FFFFFF;border-radius:0.10666rem;line-height: 0.76rem">拼团达成</span>
            </div>
          </li>
        </ul>


      </div>

    </div>
  </div>
</template>
<script>
  import TopHeader from '../../../components/Header'
  import {Progress} from 'mint-ui';
  import { Indicator } from 'mint-ui';
  export default {
    name: 'groupBookingActivityGroupList',
    components: {
      TopHeader,
      Progress,
      Indicator
    },
    data(){
      return {
        id: this.$route.query.id,
        showPayBtn: true,
        videoThumbnail: "",
        data: {},//http://d.hiphotos.baidu.com/image/pic/item/728da9773912b31bc351745a8c18367adab4e180.jpg
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
          Indicator.close();
          console.log(res);
          if (res.body.succ) {
            this.data = res.body.data;
            this.data.groupPersonBaseInfoVos = this.testInfoVos;
            if (this.data.videoUnitDto) {
              this.videoThumbnail = this.data.videoUnitDto.url + `?vframe/jpg/offset/${this.data.videoUnitDto.second}/w/750`;//视频缩略图
            }
          } else {
            didApiError(res)
          }
        }, error => {
          Indicator.close();
        })
      },

      /**
       * 参加拼团
       */
      itemClickListenerJoin(groupId){
        console.log(groupId);
        Indicator.open();
        this.$http.post(window.Host.customer + `/group/joinGroup/${groupId}`).then(res => {
          Indicator.close();
          if (res.body.succ) {
            const info = res.body.data;
            this.$router.push({
              name: "groupBookingActivityConfirm", query: {
                "groupActivityId": info.groupActivityId,
                "groupActivityName": info.groupActivityName,
                "picUrl": info.picUrl,
                "billId": info.billId,
                "description": info.shortDesc,
                "groupId": info.groupId,
                "payAmount": info.payAmount,
                "userId": info.userId
              }
            })
          } else {
            didApiError(res)
          }
        }, error => {
          Indicator.close();

        })

      },

    },
    created(){
//      console.log(this.id);
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
