<template>
  <div>
    <TopHeader>
      <div class="clickMe" @click="goBack"><span></span></div>我的订单
    </TopHeader>
    <div class="content">
      <div class="orderList">
        <!-- 没有订单 -->
        <NoFile v-if="isEmptyList">
          <img slot="bgimg" src="../../../../assets/img/order/order_details_no_bill_ico@2x.png">
          <span slot="info">当前暂无订单</span>
        </NoFile>
        <!-- 有订单 -->
        <v-scroll class="hideVScrollTop" :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" v-else>
          <ul>
            <li  v-for="(item,index) in orderListArray" class="cellTopMarginBottomLine" @click="goList(index,item.orderType)">
              <div class="cellTopSection clearfix">
                <div class="cellTopSectionFront">



                  <img src="../../../../assets/img/order/my_order_work_ic@2x.png" alt="" v-if="item.orderType == 2">
                  <img src="../../../../assets/img/order/my_order_design_ic@2x.png" alt="" v-else-if="item.orderType==1">
                  <img src="../../../../assets/img/order/my_order_supervision_ic@2x.png" alt="" v-else>
                  <span class="cellOrderDescLeftPading F4 C1">{{item.orderTypeDesc}}</span>
                    <!-- 四方监管 -->
                  <img v-if="item.supervisionType==1 && item.orderType == 3" class="supervisionOrder" src="../../../../assets/img/order/my_order_sfjg_ic@2x.png">
                  <!--  独立监管-->
                  <img v-if="item.supervisionType==2 && item.orderType == 3" class="supervisionOrder" src="../../../../assets/img/order/my_order_dljl_ic@2x.png">
                </div>
                <div class="cellTopSectionTrailing">
                  <span class="F4 C1">{{item.statusDesc}}</span>
                </div>
              </div>
              <div class="cellDownSection clearfix">
                <div class="cellDownSectionLeft">
                  <div class="cellDownSectionTitleClass F8 C1 textcut" v-if="item.orderType == 3">
                  服务标准：{{item.orderName}}</div>
                  <div v-else class="cellDownSectionTitleClass F8 C1 text2LineRestrist">{{item.orderName}}</div>
                  <div style="margin-bottom: 0.13333rem" ><span class="cellDownSectionTextRestrit textcut F6 C4">{{item.companyName}}</span></div>
                  <div>
                    <div>
                      <span class=" F6 C5">时间：{{item.createTime | setDate}} - </span>
                      <span class=" F6 C5" v-show="item.finishTime">{{item.finishTime | setDate}}</span>
                    </div>
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

  </div>
</template>

<script>
  import NoFile from '../../../../components/NoFile'
  import TopHeader from '../../../../components/Header'
  import VScroll from "../../../../components/pull-refresh"
  import '../../../../assets/css/order-list.css'

  export default {
    name: 'orderList',
    components:{
      NoFile,
      TopHeader,
      'v-scroll': VScroll
    },
    data () {
      return {
        choosedOrderId:0,
        currentPageIndex:1,
        isEmptyList:false,
        orderListArray:[
//          {
//            "id": 0,
//            "orderNum": 0,
//            "orderName": "廊坊楼高",
//            "orderType": 1,
//            "orderTypeDesc": "设计订单",
//            "prepaidAmount": 500,
//            "status": "",
//            "statusDesc": "fqgwerhwrthsfhsfh",
//            "companyId": 0,
//            "companyName": "",
//            "companyLogo": "",
//            "createTime": "",
//            "finishTime": "",
//            "supervisionType": 1,//1=四方监管，2=独立监管
//            "supervisionTypeDesc": ""
//          },
//          {
//            "id": 0,
//            "orderNum": 0,
//            "orderName": "廊坊楼高",
//            "orderType": 2,
//            "orderTypeDesc": "施工订单",
//            "prepaidAmount": 500,
//            "status": "",
//            "statusDesc": "",
//            "companyId": 0,
//            "companyName": "",
//            "companyLogo": "",
//            "createTime": "",
//            "finishTime": "",
//            "supervisionType": "",
//            "supervisionTypeDesc": ""
//          },
//          {
//            "id": 0,
//            "orderNum": 0,
//            "orderName": "廊坊楼高",
//            "orderType": 3,
//            "orderTypeDesc": "监理订单",
//            "prepaidAmount": 500,
//            "status": "",
//            "statusDesc": "",
//            "companyId": 0,
//            "companyName": "",
//            "companyLogo": "",
//            "createTime": "",
//            "finishTime": "",
//            "supervisionType": 1,
//            "supervisionTypeDesc": ""
//          },
//          {
//            "id": 0,
//            "orderNum": 0,
//            "orderName": "廊坊楼高",
//            "orderType": 3,
//            "orderTypeDesc": "监理订单",
//            "prepaidAmount": 500,
//            "status": "",
//            "statusDesc": "",
//            "companyId": 0,
//            "companyName": "",
//            "companyLogo": "",
//            "createTime": "",
//            "finishTime": "",
//            "supervisionType": 2,
//            "supervisionTypeDesc": ""
//          }
        ],
        scrollData: {
          noFlag: false //暂无更多数据显示
        }
      }
    },
    methods: {
      goBack(){
        invokeNative({
          "code": window.jsBridge.CODE_CLOSE
        });
      },
      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
          "data": message
        });
      },
      goList(index,orderType){
        this.choosedOrderId = this.orderListArray[index].id;
        if(orderType==3){//监理订单
          this.$router.push({
              "name": "supervisionOrderDetailsForCustomer",
                query:{
                  orderId:this.choosedOrderId,
                  closeType:1,
                  index:0,
                }
            });
        }else {//设计/施工订单
          this.$router.push({"name": "orderDetails", query: {"orderId": this.choosedOrderId,"isCustomer":"true"}});
        }
      },
      getList(index){
        this.$http.get(window.Host.customer+`/order?pageNum=${index}&pageSize=10`).then((res)=>{
            console.log(res);
          if(res.status==200){
            if(!res.body.data.totalCount){
              this.isEmptyList=true;
            }else{
              this.isEmptyList=false;
              this.orderListArray = this.orderListArray.concat(res.body.data.result);
              this.currentPageIndex = index;
            }
          } else  {
            if (res.body.stateCode != 312) {
              this.showToast(res.body.message);
            }
          }
        },(res)=>{
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
        this.$el.querySelector('.load-more').style.display="none";
        done();
      }
    },
    created(){
       this.isEmptyList = true;
       this.getList(1);
    }
  }
</script>
<style scoped lang="less">
.supervisionOrder{
    width: 1.54667rem;
    height: 0.42667rem;
    margin-left: 0.24rem;
    vertical-align: middle;
}
</style>
