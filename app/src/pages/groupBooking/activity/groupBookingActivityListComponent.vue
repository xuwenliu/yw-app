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
        <li v-for="(item,index) in dataArray" class="cellTopMarginBottomLine" @click="itemClickListener(item.id)">
          <img :src="item.picUrl" style="width: 100%">
        </li>
      </ul>
      <!--</v-scroll>-->
    </div>
  </div>
</template>

<script>
  import NoFile from '../../../components/NoFile'
  import VScroll from "../../../components/pull-refresh"

  export default {
    name: 'groupBookingListComponent',
    components: {
      NoFile,
      'v-scroll': VScroll
    },
    data () {
      return {
        choosedOrderId: 0,
        currentPageIndex: 1,
        currentOrderType: 1,
        isEmptyList: false,
        dataArray: [

        ],
//        scrollData: {
//          noFlag: false //暂无更多数据显示
//        },
        state: this.$route.query.state,
      }
    },
    methods: {
      getList(){
        this.$http.get(window.Host.customer + `/group/groupActivity/${this.state}`).then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.dataArray = res.body.data;
          } else {
            didApiError(res);
          }
        }, (res) => {
          console.log(res);
        })
      },
      /**
       * 活动列表被点击
       * @param id
       */
      itemClickListener(id){
        if (this.state == 1) {
          this.$router.push({"name": "groupBookingActivityDetails", query: {id: id}});
        } else {
          this.$router.push({"name": "groupBookingActivityDetailsEnd", query: {id: id}});
        }
      },
      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
          "data": message
        });
      }
    },
    created(){
      console.log("state:" + this.state);

      this.getList();

    }
  }
</script>

