<template>
  <div class="contentTopMoreSpace content">
    <div class="orderList">
      <!-- 没有订单 -->
      <NoFile v-if="isEmptyList">
        <img slot="bgimg" src="../../../../assets/img/order/order_details_no_bill_ico@2x.png">
        <span slot="info">当前暂无订单</span>
      </NoFile>
      <!-- 有订单 -->
      <v-scroll class="hideVScrollTop" :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" v-else>
        <ul>
          <li v-for="(item,index) in orderListArray" class="cellTopMarginBottomLine" @click="goList(index)">
            <div class="cellTopSection clearfix">
              <div class="cellTopSectionFront">
                <span class="F4 C1">{{item.prepaidAmount | currency('',2)}}</span>
                <img v-show="currentOrderType == 3" class="orderListESupervision"
                     :src="supervisionIcon[item.supervisionType-1]">
              </div>
              <div class="cellTopSectionTrailing">
                <span class="F4 C1">{{item.statusDesc}}</span>
              </div>
            </div>
            <div class="cellDownSection clearfix">
              <div class="cellDownSectionLeft">
                <div v-show="currentOrderType!=3" class="cellDownSectionTitleClass F8 C1 text2LineRestrist">
                  {{item.orderName}}
                </div>
                <div v-show="currentOrderType==3" class="cellDownSectionTitleClass F8 C1 textcut">
                  服务标准：{{item.orderName}}
                </div>
                <div style="margin-bottom: 0.13333rem"><span class="cellDownSectionTextRestrit textcut F6 C4">{{item.companyName}}</span>
                </div>
                <div>
                  <span class=" F6 C5">时间：{{item.createTime | setDate}} - </span>
                  <span class=" F6 C5" v-show="item.finishTime">{{item.finishTime | setDate}}</span>
                </div>
              </div>
              <div class="cellDownSectionRight">
                <img src="../../../../assets/img/twitter/more_ico@2x.png" alt="">
              </div>
            </div>
          </li>
        </ul>
      </v-scroll>
    </div>
  </div>
</template>

<script>
  import NoFile from '../../../../components/NoFile'
  import VScroll from "../../../../components/pull-refresh"
  import '../../../../assets/css/order-list.css'

  export default {
    name: 'orderListTableContent',
    components: {
      NoFile,
      'v-scroll': VScroll
    },
    data () {
      return {
        supervisionIcon: [require("../../../../assets/img/supervision/my_order_sfjg_ic@2x.png"), require("../../../../assets/img/supervision/my_order_dljl_ic@2x.png")],
        choosedOrderId: 0,
        currentPageIndex: 1,
        currentOrderType: 1,
        isEmptyList: false,
        orderListArray: [],
        scrollData: {
          noFlag: false //暂无更多数据显示
        }
      }
    },
    methods: {
      goBack(){
        //调用app端的关闭当前页面code为1003
        invokeNative({
          "code": 1003
        });
      },
      /**
       * 去订单详情
       *
       * @param index
       */
      goList(index){
        this.choosedOrderId = this.orderListArray[index].id;
        if (this.currentOrderType == 3) {//监理订单
          this.$router.push({"name": "supervisionOrderDetailsForEmployee", query: {"orderId": this.choosedOrderId, "closeType": -1}
          });
        } else {//设计订单和施工订单
          this.$router.push({"name": "orderDetails", query: {"orderId": this.choosedOrderId, "isCustomer": "false"}});
        }
      },
      getList(index){
        this.$http.get(window.Host.employee + `/order?pageNum=${index}&pageSize=10&orderType=${this.currentOrderType}`).then((res) => {
          console.log(res);
          if (res.status == 200) {
            if (res.body.data.totalCount <= 0) {
              this.isEmptyList = true;
            } else {
              this.isEmptyList = false;
              this.orderListArray = this.orderListArray.concat(res.body.data.result);
              this.currentPageIndex = index;
            }
          } else {
            if (res.body.stateCode != 312) {
              this.showToast(res.body.message);
            }
          }
        }, (res) => {
          console.log(res);
        })
      },
      onRefresh(done) {
        this.orderListArray = [];
        this.getList(1);
        done();
      },
      onInfinite(done) {
        var nextPageIndex = this.currentPageIndex + 1;
        this.getList(nextPageIndex);
        this.$el.querySelector('.load-more').style.display = "none";
        done();
      },
      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
          "data": message
        });
      }
    },
    created(){
      this.currentOrderType = this.$route.query.orderType;
      this.isEmptyList = false;
      this.getList(1);

      /*模拟数据 调试用*/
//      this.orderListArray = [
//        {
//          "id": 0,
//          "orderNum": 0,
//          "orderName": "是多少",
//          "orderType": "1",
//          "orderTypeDesc": "设计订单",
//          "prepaidAmount": 0,
//          "status": "1",
//          "statusDesc": " 订单状态描述",
//          "companyId": 0,
//          "companyName": "公司名称",
//          "createTime": "1501840123",
//          "finishTime": "1501840161",
//          "supervisionType": "2",
//          "supervisionTypeDesc": ""
//        },
//        {
//          "id": 0,
//          "orderNum": 0,
//          "orderName": "阿萨",
//          "orderType": "1",
//          "orderTypeDesc": "设计订单",
//          "prepaidAmount": 0,
//          "status": "1",
//          "statusDesc": " 订单状态描述",
//          "companyId": 0,
//          "companyName": "公司名称",
//          "createTime": "1501840123",
//          "finishTime": "1501840123",
//          "supervisionType": "1",
//          "supervisionTypeDesc": ""
//        }
//      ]
    }
  }
</script>

