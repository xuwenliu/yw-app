<template>
  <div>
    <footer-bottom v-show="resData && billStatus == 2 && moneyData.orderStatus == 1">
      <div @click="applyPay" class="F3 C0">邀请付款</div>
    </footer-bottom>
    <input-reason v-show="isShowInputDialog">
      <div class="show-input-box">
        <div class="supervision-e-bill-inputBox">
          <div class="F2 C1 supervision-e-bill-inputBox-title">取消原因</div>
          <textarea v-model.trim="cancelReasonStr" rows=30 cols="4" class="supervision-e-bill-inputBox-input F4"></textarea>
          <div class="supervision-e-bill-inputBox-btn C6 F3">
            <div style="border-right: solid 0.02666rem #a8a8a8" @click="showCancelReasonInputDialog(false,null)">取消
            </div>
            <div @click="cancelBill">确定</div>
          </div>
        </div>
      </div>
    </input-reason>


    <NoFile v-show="!resData">
      <img slot="bgimg" src="../../../../assets/img/order/order_details_no_bill_ico@2x.png">
      <span slot="info">暂无可支付账单</span>
    </NoFile>


    <div class="supervisionBillForEmployee" v-show="resData">
      <div class="content supervision-e-root-content">
        <ul class="bg7 F5 C1" :class="{'supervision-e-bill-bottom-p':resData && billStatus == 2}">
          <li class="supervision-e-bill-item " v-for="(item,index) in resData">

            <div class="supervision-e-bill-top-layout" v-show="index==0">
              <div>
                <div class="supervision-e-bill-top-layout-title" >合同金额</div>
                <div class="F2 C1">￥ <span class="supervision-e-bill-top-layout-price">{{moneyData.supervisionAmount | currency("",2)}}</span></div>
              </div>
              <div>
                <div class="supervision-e-bill-top-layout-title" >已付金额</div>
                <div class="F2 C1">￥ <span class="supervision-e-bill-top-layout-price">{{moneyData.prepaidAmount | currency("",2)}}</span></div>
              </div>
            </div>

            <ul>
              <li>
                <i>{{item.billContentType == 10 ? item.billPhaseTypeDesc : item.billContentTypeDesc}}</i>
                <span class="textcut">{{item.totalAmount | currency("",2)}}</span>
              </li>
              <li>
                <i>已付金额</i><span class="textcut">{{item.prepaidAmount | currency("",2)}}</span>
              </li>
              <li :class="{'supervision-e-bill-red':item.billStatus == 1}">
                <i>待付金额</i><span class="textcut">{{item.unpaidAmount | currency("",2)}}</span>
              </li>
            </ul>

            <div class="bg0">
              <div class="supervision-e-bill-item-divider"></div>
              <div class="supervision-e-bill-item-button" v-show="!item.prepaidAmount>0 && item.billContentType != 8"
                   @click="showCancelReasonInputDialog(true,item.id)">
                <span>取消账单</span> <img class="supervision-e-itemArrow"
                                       src="../../../../assets/img/supervision/order_details_small_arrow@2x.png">
              </div>
              <div class="supervision-e-bill-item-button" v-show="item.billStatus != 1"
                   @click="checkPayDetail(item.id)">
                <span>查看已付金额明细</span> <img class="supervision-e-itemArrow"
                                           src="../../../../assets/img/supervision/order_details_small_arrow@2x.png">
              </div>
            </div>

          </li>
        </ul>
      </div>
    </div>
  </div>

</template>
<script>

  import '../../../../assets/css/supervisionE-order-detail.css'
  import NoFile from '../../../../components/NoFile'
  import FooterBottom from '../../../../components/Footer'
  import InputReason from '../../../../components/InputReason'

  export default{
    name: 'supervisionBillForEmployee',
    orderId: 0,
    components: {
      NoFile,
      FooterBottom,
      InputReason
    },
    data(){
      return {
        resData: [],
        isShowInputDialog: false,
        currentBillId: 0,
        moneyData:{
          "supervisionAmount":0,
          "prepaidAmount":0,
          "orderStatus":0
        },
        cancelReasonStr:"",
        billStatus:"",

      }
    },
    methods: {


      toastMsg(msg){
        invokeNative({"code": window.jsBridge.CODE_TOAST, "data": msg});
      },

      /**
       *
       * 邀请付款
       */
      applyPay(){
        if (!this.isShowInputDialog)
          this.$router.push({"name": "orderInvite", query: {"orderId": this.orderId}})
      },

      /**
       *
       * 显示取消账单对话框
       */
      showCancelReasonInputDialog(show, billId){
        this.currentBillId = billId || 0;
        this.isShowInputDialog = show;
        if (!show) this.cancelReasonStr = ""
      },

      /**
       *
       * 处理网路请求错误
       */
      didError(res){
        if (res.body.stateCode != 317 && res.body != 312) {
          this.toastMsg(res.body.message)
        }
      },


      /**
       *
       * 取消账单
       */
      cancelBill(){

        if (this.cancelReasonStr == null || this.cancelReasonStr == "") {
          this.toastMsg("请输入取消原因");
          return false;
        }

        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});

        this.$http.post(window.Host.employee + `/order/cancel`,
          {
            "orderId": this.orderId,
            "billId": this.currentBillId,
            "cancelReason": this.cancelReasonStr
          },
          {emulateHTTP: true}).then((res) => {
            console.log(res);
            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});


            if (res.data.succ) {

              window.reloadFun();
              //成功回调
              this.showCancelReasonInputDialog(false, null);
              this.toastMsg("操作成功")
            } else {
              this.didError(res)
            }
          },
          (error) => {
            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
            //失败回调
          })
      },

      /**
       *
       * 查看付款明细
       */
      checkPayDetail(billId){
        if (!this.isShowInputDialog)
          this.$router.push({
            "name": "billPayDetail",
            query: {"orderId": this.orderId, "billId": billId, "appType": "e"}
          })
      },


      /**
       *
       * 获取合同金额
       * */
      loadContractMoney() {

        this.$http.get(window.Host.employee + `/order/${this.orderId}/unpaidBill`).then((res) => {
          console.log(res);
          if (res.data.succ) {
            this.moneyData = res.body.data;
          } else {
            console.log("error" + res.data.message);
          }
        })
      },
      getResData() {
        this.$http.get(window.Host.employee + `/order/${this.orderId}/bill`).then((res) => {
          if(res.data.succ){
            console.log(res)
            this.resData = res.data.data;
            this.billStatus=this.resData[0].billStatus;
          }
        })

      },
    },
    created(){
      this.orderId = this.$route.query.orderId;
      this.loadContractMoney();
      this.getResData();

//      模拟数据
      this.resData = [
        // {
        //   "id": 0,
        //   "orderId": 0,
        //   "orderBillType": "",
        //   "billStatus": 1,
        //   "orderBillTypeDesc": "",
        //   "billPhaseType": "",
        //   "billPhaseTypeDesc": "",
        //   "totalAmount": 10,
        //   "billContentType": 10,
        //   "billContentTypeDesc": "阶段款",
        //   "billPhaseTypeDesc": "二期款",
        //   "prepaidAmount": 100,
        //   "unpaidAmount": 20
        // },
        // {
        //   "id": 1,
        //   "orderId": 0,
        //   "orderBillType": "",
        //   "billStatus": 2,
        //   "orderBillTypeDesc": "",
        //   "billPhaseType": "",
        //   "billPhaseTypeDesc": "",
        //   "totalAmount": 0,
        //   "billContentType": 8,
        //   "billContentTypeDesc": "定金",
        //   "billPhaseTypeDesc": "二期款",
        //   "prepaidAmount": 100000,
        //   "unpaidAmount": 10
        // },

        // {
        //   "id": 1,
        //   "orderId": 0,
        //   "orderBillType": "",
        //   "billStatus": 2,
        //   "orderBillTypeDesc": "",
        //   "billPhaseType": "",
        //   "billPhaseTypeDesc": "",
        //   "totalAmount": 0,
        //   "billContentType": 10,
        //   "billContentTypeDesc": "阶段款",
        //   "billPhaseTypeDesc": "一期款",
        //   "prepaidAmount": 90,
        //   "unpaidAmount": 10
        // },
        // {
        //   "id": 1,
        //   "orderId": 0,
        //   "orderBillType": "",
        //   "billStatus": 2,
        //   "orderBillTypeDesc": "",
        //   "billPhaseType": "",
        //   "billPhaseTypeDesc": "",
        //   "totalAmount": 0,
        //   "billContentType": 10,
        //   "billContentTypeDesc": "阶段款",
        //   "billPhaseTypeDesc": "三期款",
        //   "prepaidAmount": 6,
        //   "unpaidAmount": 10
        // }
      ];
    }
  }

</script>
