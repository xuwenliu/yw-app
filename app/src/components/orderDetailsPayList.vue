<template>

  <div>


    <input-reason v-show="isShowInputDialog">
      <div class="show-input-box">
        <div class="inputBox">
          <div class="F2 C1 inputBox-title">取消原因</div>
          <textarea v-model="cancelReasonStr" rows=30 cols="4" class="inputBox-input F4"></textarea>
          <div class="inputBox-btn C6 F3">
            <div style="border-right: solid 0.02666rem #a8a8a8" @click="showCancelReasonInputDialog(false,null)">取消
            </div>
            <div @click="cancelBill">确定</div>
          </div>
        </div>
      </div>
    </input-reason>

    <footer-bottom v-show="resData && resData[0].unpaidAmount>0 && isCustomer && orderStatus!=3">
      <div @click="goPay(resData[0].id)" class="F3 C0">立即支付</div>
    </footer-bottom>

    <NoFile v-show="!resData">
      <img slot="bgimg" src="../assets/img/order/order_details_no_bill_ico@2x.png">
      <span slot="info">暂无可支付账单</span>
    </NoFile>


    <div class="orderDetailsPayList" v-show="resData">
      <div class="content root-content" :class="{'bottom-p':resData && resData[0].unpaidAmount>0}">
        <ul class="bg7 F5 C1">
          <li class="bg7" v-for="(item,index) in resData">
            <div class="item">

              <img class="item-arrow" src="../assets/img/order/order_details_small_arrow@2x.png">

              <ul class="item-content bg0">
                <li>
                  <div class="item-item">
                    <i style="float: left">金额</i><span
                    style="float: right; text-align: right">{{item.totalAmount | currency("",2)}}</span>
                  </div>
                </li>
                <li>
                  <div class="item-item" @click="goPayDetail(item.id)">
                    <i style="float: left">已付金额</i><span
                    style="float: right; text-align: right">{{item.prepaidAmount | currency("",2)}}</span>
                  </div>
                </li>
                <li>
                  <div class="item-item" :class="{'C6':item.unpaidAmount != 0}">
                    <i style="float: left">待付金额</i><span
                    style="float: right; text-align: right">{{item.unpaidAmount | currency("",2)}}</span>
                  </div>
                </li>

                <li
                  v-show="!isCustomer && item.billStatus==1 && item.unpaidAmount == item.totalAmount && orderStatus!=3 && manager!=1">
                  <div class="item-item-operation">
                    <span @click="showCancelReasonInputDialog(true,item.id)">取消账单</span>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>

  import NoFile from './NoFile'
  import FooterBottom from './Footer'
  import InputReason from './InputReason'

  export default{
    name: "orderDetailsPayList",
    data(){
      return {
        isCustomer: false,
        orderId: null,
        inow: 1,
        cancelReasonStr: null,
        isShowInputDialog: false,
        resData: null,
        url: "",
        manager: 0,
        orderStatus: 0,
        currentBillId: null,
        orderBillType: 0//订单下账单类型（int，1 = 定金，2 = 首款，3 = 阶段款，4 = 尾款）
      }
    },
    components: {
      NoFile,
      FooterBottom,
      InputReason
    },
    methods: {

      showCancelReasonInputDialog(show, billId){
        this.currentBillId = billId || 0;
        this.isShowInputDialog = show;
        if (!show) this.cancelReasonStr = ""
      },


      /*取消账单*/
      cancelBill(){

        if (this.cancelReasonStr == null || this.cancelReasonStr == "") {
          invokeNative({"code": window.jsBridge.CODE_TOAST, "data": "请输入取消原因"});
          return false;
        }

        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});

        this.$http.post(this.url + `/order/cancel`,
          {
            "orderId": this.orderId,
            "billId": this.currentBillId,
            "cancelReason": this.cancelReasonStr
          },
          {emulateHTTP: true}).then((res) => {

            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});


            if (res.data.succ) {
              console.log("in :" + res.data.succ);
              window.reloadFun();
              //成功回调
              this.showCancelReasonInputDialog(false, null);
              invokeNative({"code": window.jsBridge.CODE_TOAST, "data": "操作成功"})
            } else {
              invokeNative({"code": window.jsBridge.CODE_TOAST, "data": res.data.message})
            }
          },
          (error) => {
            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
            //失败回调
          })
      },

      /*去支付*/
      goPay(billId){
//        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW, "data": billId})
        this.$router.push({"name": "payList", query: {"orderId": this.orderId, "billId": billId, "inType": 1}})
      },

      /*获取账单列表*/
      getBillListWith(isCustomer, orderId, orderBillType){

        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});
        this.$http.get(this.url + `/order/${orderId}/bill?orderBillType=${orderBillType}`).then((res) => {
          console.log(res);
          invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
          if (res.data.succ) {
            this.resData = res.data.data;
          } else {
            if (res.data.stateCode != 312) {
              invokeNative({"code": window.jsBridge.CODE_TOAST, data: res.data.message});
            }
          }
        },(error)=>{
          invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
        })
      },

      /*去付款明细页面*/
      goPayDetail(billId){
        this.$router.push({
          "name": "billPayDetail",
          query: {"orderId": this.orderId, "billId": billId, "appType": this.isCustomer ? "c" : "e"}
        })
      }
    },
    created(){

      this.orderStatus = this.$route.query.orderStatus * 1;
      this.manager = this.$route.query.manager * 1;

      var b = this.$route.query.isCustomer;

      if (b == "true") {
        this.url = window.Host.customer;
        this.isCustomer = true
      } else {
        this.url = window.Host.employee;
        this.isCustomer = false
      }
      this.orderId = this.$route.query.orderId;

      var routeName = this.$route.name;
      if (routeName == "deposit") {
        this.orderBillType = 8
      } else if (routeName == "first") {
        this.orderBillType = 9
      } else if (routeName == "phase") {
        this.orderBillType = 10
      } else if (routeName == "finalPayment") {
        this.orderBillType = 11
      }

      this.getBillListWith(this.isCustomer, this.orderId, this.orderBillType);
      //模拟数据
//      this.resData = [
//        {
//          "id": 0,
//          "orderId": 0,
//          "orderBillType": "",
//          "billStatus": 1,
//          "orderBillTypeDesc": "",
//          "billPhaseType": "",
//          "billPhaseTypeDesc": "",
//          "totalAmount": 10,
//          "prepaidAmount": 0,
//          "unpaidAmount": 10
//        },
//        {
//          "id": 1,
//          "orderId": 0,
//          "orderBillType": "",
//          "orderBillTypeDesc": "",
//          "billPhaseType": "",
//          "billPhaseTypeDesc": "",
//          "totalAmount": 0,
//          "prepaidAmount": 0,
//          "unpaidAmount": 10
//        }
//      ];
    }

  }


</script>
<style scoped lang="less">
  .root-content {
    padding-top: 1.2rem;
  }

  .item {
    position: relative;
    width: 100%;
    margin-top: 0.26666rem
  }

  .item-content {
    padding: 0.213333rem 0;
  }

  .item-item {
    height: 0.8rem;
    line-height: 0.8rem;
    margin: 0 0.53333rem;
  }

  .item-item-operation {
    height: 1.2rem;
    margin: 0 0.53333rem;
    position: relative;
  }

  .item-item-operation span {
    width: 1.97333rem;
    height: 0.66666rem;
    text-align: center;
    float: right;
    line-height: 0.66666rem;
    border: 1px solid #a8a8a8;
  }

  .item-arrow {
    height: 0.26666rem;
    position: absolute;
    background-repeat: no-repeat;
    top: 50%;
    left: 100%;
    margin-left: -0.39999rem;
    margin-top: -0.13333rem;
  }

  .pay {
    width: 100%;
    text-align: center;
    height: 1.2rem;
    position: fixed;
  }

  .bottom-p {
    bottom: 1.2rem;
  }

  .inputBox {
    background-color: #FFFFFF;
    text-align: center;
  }

  .inputBox-title {
    margin-top: 0.53333rem;
    margin-bottom: 0.26666rem;
  }

  .inputBox-input {
    width: 70%;
    height: 2rem;
    border: 0.026666rem #a8a8a8 solid;
    text-align: start;
    padding: 0.13333rem;
    box-sizing: border-box;
    margin-bottom: 0.53333rem;
  }

  .inputBox-btn {
    border-top: 0.026666rem solid #a8a8a8;
    height: 1.2rem;
    position: relative;
  }

  .inputBox-btn div {
    float: left;
    width: 49.5%;
    height: 1.2rem;
    line-height: 1.2rem;;
  }

</style>
