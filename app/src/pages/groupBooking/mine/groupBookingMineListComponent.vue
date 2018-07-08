<!--?state=()-->
<template>
  <div class="contentTopMoreSpace content">
    <div class="orderList">
      <!-- 没有订单 -->
      <NoFile v-if="!dataArray">
        <img slot="bgimg" src="../../../assets/img/order/order_details_no_bill_ico@2x.png">
        <span slot="info">当前暂无活动</span>
      </NoFile>
      <!-- 有订单 -->
      <!--<v-scroll class="hideVScrollTop" :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" v-else>-->
      <ul>
        <li v-for="(bigItem,bigIndex) in dataArray" style="margin-top: 0.4rem">

          <div style="position: relative">
            <img :src="bigItem.picUrl" style="width: 100%;display: block">
            <!--background-image: url('http://osz2pnx97.bkt.clouddn.com/mine_pt_list_title_bg@2x.png')-->
            <div
              v-if="bigItem.showCustomer"
              class="F5 C0"
              style="background: rgba(0, 0, 0, 0.3); padding: 0.21333rem 0.53333rem; display: flex;align-items: center;justify-content: space-between;position: absolute;bottom: 0;left: 0;right:0;z-index: 1; ">
              <span>获得报备客户</span>
              <span>{{bigItem.customerCount}}个</span>
            </div>
          </div>


          <div v-for="(item,index) in bigItem.myGroupInfos" class="bb1"
               style="height: 1.33333rem;display: flex;align-items: center;justify-content: space-between;padding: 0 0.53333rem;box-sizing: border-box">
            <span class="F3 C1">已完成</span>
            <div class="F6 C1"
                 style="display: flex;flex-grow: 2; flex-direction: column; align-items: center; margin: 0 0.53333rem;height: 0.8rem">
              <span> {{item.nowPersonCount}}/{{item.maxPersonCount}}</span>
              <mt-progress style="width: 3rem" :value="(item.nowPersonCount/item.maxPersonCount)*100" :bar-height="5"></mt-progress>

            </div>
            <span v-show="item.nowPersonCount == item.maxPersonCount" class="F6 C0"
                  style="height: 0.8rem;width: 2.24rem;background-color: #ed316b;line-height: 0.8rem;text-align: center;border-radius: 0.10666rem"
                  @click="clickListenerCheckCoupon(item.groupId)">查看拼团券</span>
            <span v-show="item.nowPersonCount != item.maxPersonCount" class="F6 C0"
                  style="height: 0.8rem;width: 2.24rem;background-color: #ed316b;line-height: 0.8rem;text-align: center;border-radius: 0.10666rem"
                  @click="clickListenerCheckActivity(item.groupId)">查看详情</span>
          </div>


        </li>
      </ul>
      <!--</v-scroll>-->
    </div>
  </div>
</template>

<script>
  import NoFile from '../../../components/NoFile'
  import VScroll from "../../../components/pull-refresh"
  import {Progress} from 'mint-ui';

  export default {
    name: 'groupBookingMineListComponent',
    components: {
      NoFile,
      'v-scroll': VScroll
    },
    data () {
      return {
        state: this.$route.query.state,
        choosedOrderId: 0,
        currentPageIndex: 1,
        currentOrderType: 1,
        isEmptyList: false,
        dataArray: [],
//        scrollData: {
//          noFlag: false //暂无更多数据显示
//        },
      }
    },
    methods: {
      getList(){
        this.$http.get(window.Host.customer + `/group/myGroupActivity/${this.state}`).then((res) => {
          console.log(res);
          console.log(JSON.stringify(res.body.data));
          if (res.status == 200) {
            this.dataArray = res.body.data;
          } else {
            didApiError(res);
          }
        }, (res) => {
          console.log(res);
        })
      },

      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
          "data": message
        });
      },

      /**
       * 查看拼团券
       * @param groupId
       */
      clickListenerCheckCoupon(groupId){
        console.log("查看拼团券" + groupId);
        this.$router.push({name: "groupBookingCouponDetails", query: {source: 1, groupId: groupId}});
      },


      /**
       * 查看拼团活动
       * @param id
       */
      clickListenerCheckActivity(groupId){
        console.log("----------------------------");
        console.log("----------------------------" + groupId);
        this.$router.push({"name": "groupBookingMineDetails", query: {id: groupId}});
      }
    },
    created(){
      console.log("state:" + this.state);
      this.getList();
    }
  }
</script>

