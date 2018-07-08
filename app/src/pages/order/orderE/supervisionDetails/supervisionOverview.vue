<template>
  <div class="supervisionOverviewForEmployee">

    <!-- v-show="resData && resData.canFinishOrder" -->
    <footer-bottom v-show="resData && resData.canFinishOrder">
      <div @click="stopOrderDialog" class="F3 C0">
        结束订单
      </div>
    </footer-bottom>

    <!--编辑合同金额-->
    <input-reason v-show="isShowInputDialog">
      <div class="show-input-box">
        <div class="supervision-e-bill-inputBox">
          <div class="F2 C1 supervision-e-bill-inputBox-title">设置合同金额</div>
          <input v-model="contractInputValue" class="supervision-e-contract-inputBox-input F4"
                 placeholder="请输入监理合同上约定的合同金额" maxlength="11">
          <div class="supervision-e-bill-inputBox-btn C6 F3">
            <div style="border-right: solid 0.02666rem #a8a8a8" @click="showContractInputDialog(false)">取消
            </div>
            <div @click="editContractAmount">确定</div>
          </div>
        </div>
      </div>
    </input-reason>

    <!--取消订单-->
    <input-reason v-show="isShowStopOrderDialog">
      <div class="show-input-box">
        <div class="supervision-e-bill-inputBox">
          <div class="F2 C1 supervision-e-bill-inputBox-title">结束订单</div>
          <div class="supervision-e-stop-order-hint C1 F4">
            <span>此订单会设置成已完成状态,将无法再邀请客户付款和创建监理服务。确定要执行此操作吗？</span>
          </div>
          <div class="supervision-e-bill-inputBox-btn C6 F3">
            <div style="border-right: solid 0.02666rem #a8a8a8" @click="isShowStopOrderDialog=false">取消
            </div>
            <div @click="stopOrder">确定</div>
          </div>
        </div>
      </div>
    </input-reason>


    <div class="content supervision-e-root-content ">
      <div class="supervision-e-title-order F3 C1 bg0">订单信息</div>
      <ul class="bg0 bb1">
        <li>
          <div class="supervision-e-item F5 C1">
            <i>订单编号</i>
            <span class="textcut">{{resData.orderNum}}</span>
          </div>
        </li>
        <li>
          <div class="supervision-e-item F5 C1">
            <i>订单公司</i>
            <span class="textcut">{{resData.companyName}}</span>
          </div>
        </li>
        <!--<li>-->
        <!--<div class="item F5 C1">-->
        <!--<i>项目名称</i>-->
        <!--<span class="textcut">{{resData.orderName}}</span>-->
        <!--</div>-->
        <!--</li>-->
        <li>
          <div class="supervision-e-item F5 C1" @click="editCustomerInfo">
            <i>客户姓名</i>
            <img class="supervision-e-itemArrow" src="../../../../assets/img/order/order_details_small_arrow@2x.png">
            <span class="textcut">{{resData.customerName}}</span>
          </div>
        </li>
        <li>
          <div class="supervision-e-item F5 C1">
            <i>订单状态</i>
            <span class="textcut">{{resData.statusDesc}}</span>
          </div>
        </li>
        <li>
          <div class="supervision-e-item F5 C1">
            <i>订单折扣</i>
            <span class="textcut" v-if="resData.supervisionDiscount && resData.supervisionDiscount<1">
            {{resData.supervisionDiscount | toDiscount}}折</span>
            <span class="textcut" v-else>无折扣</span>
          </div>
        </li>

        <li class="supervision-e-safeguard-layout">

          <i class="F5 C1">所选保障</i>

          <ul class="F5 C1">
            <li v-for="(itemData,index) in safeguard" class="supervision-e-safeguard-item F">
              <img v-show="itemData.support" src="../../../../assets/img/supervision/choice_light_ic@2x.png">
              <img v-show="!itemData.support" src="../../../../assets/img/supervision/gray_choice_ic@2x.png">
              <div>{{itemData.name}}</div>
            </li>
          </ul>

        </li>

        <li class="supervision-e-safeguard-divider"></li>
        <li v-show="resData.supervisionAmount && resData.supervisionAmount > 0">
          <div class="supervision-e-item F5 C1" @click="showContractInputDialog(true)">
            <i>合同金额</i>
            <img class="supervision-e-itemArrow" src="../../../../assets/img/order/order_details_small_arrow@2x.png">
            <span class="textcut">{{resData.supervisionAmount | currency("",2)}}</span>
          </div>
        </li>
        <li v-show="(!resData.supervisionAmount || !resData.supervisionAmount > 0) && resData.status != 2 ">
          <div class="supervision-e-item F5 C1" @click="showContractInputDialog(true)">
            <i>合同金额</i>
            <img class="supervision-e-itemArrow" src="../../../../assets/img/order/order_details_small_arrow@2x.png">
            <span class="textcut C5">设置合同金额</span>
          </div>
        </li>
        <li>
          <div class="supervision-e-item F5 C1">
            <i>已付金额</i>
            <span class="textcut">{{resData.prepaidAmount | currency("",2)}}</span>
          </div>
        </li>


        <!--<div class="item F5 C1 paidAmount">-->
        <!--<i>已付金额</i>-->
        <!--<span class="textcut">{{resData.prepaidAmount}}</span>-->
        <!--</div>-->
        <!--<div class="item F5 C1 paidAmount bt1" @click="toPayDetalis" v-show="!isCustomer">-->
        <!--<i>平台打款</i>-->
        <!--<img class="itemArrow" src="../../../../assets/img/order/order_details_small_arrow@2x.png">-->
        <!--<span class="textcut">{{resData.settledAmount}}</span>-->
        <!--</div>-->
      </ul>

      <ul class="supervision-e-check-button-layout F5 C1">
        <li @click="toUploadPic(1)">
          <span>上传第三方监理合同</span>
          <img src="../../../../assets/img/supervision/order_details_small_arrow@2x.png"></li>
        <li @click="toUploadPic(2)">
          <span>上传四方监管协议</span>
          <img src="../../../../assets/img/supervision/order_details_small_arrow@2x.png"></li>
      </ul>

    </div>

  </div>

</template>
<script>
  import '../../../../assets/css/supervisionE-order-detail.css'
  import FooterBottom from '../../../../components/Footer'
  import InputReason from '../../../../components/InputReason'


  export default{
    name: 'supervisionOverviewForEmployee',
    data(){
      return {
        resData: {},
        orderId: 0,
        contractInputValue: null,
        isShowInputDialog: false,
        isShowStopOrderDialog: false,
        safeguard: [
          {"name": "四方监管", "support": true},
          {"name": "安全支付", "support": true},
          {"name": "先行赔付", "support": true},
          {"name": "独立监理", "support": true}]
      }
    },
    components: {
      FooterBottom,
      InputReason
    },
    methods: {


      toastMsg(msg){
        invokeNative({"code": window.jsBridge.CODE_TOAST, "data": msg})
      },


      /**
       *
       * 获取订单总览数据
       */
      getData(){
        this.$http.get((window.Host.employee + `/order/supervision/${this.orderId}`)).then(function (res) {
          console.log(res);
          if (res.body.succ) {
            this.resData = res.body.data;
            if (this.resData.supervisionType == 1) {//（1：四方监管，2：独立监理）,
              this.safeguard = [
                {"name": "四方监管", "support": true},
                {"name": "安全支付", "support": true},
                {"name": "先行赔付", "support": true},
                {"name": "独立监理", "support": true}]
            } else {
              this.safeguard = [
                {"name": "四方监管", "support": false},
                {"name": "安全支付", "support": false},
                {"name": "先行赔付", "support": false},
                {"name": "独立监理", "support": true}]
            }
          } else {
            didApiError(res);
          }
        }, function (error) {
          this.showToast("网络异常")
        })

      },


      /**
       *
       * 结束订单
       */
      stopOrder(){
        console.log("结束订单");

        this.$http.post(window.Host.employee + `/order/supervision/${this.orderId}/status`).then(function (res) {
          if (res.body.succ) {
              this.isShowStopOrderDialog=false;
              this.getData();
          } else {
            didApiError(res)
          }
        }, function (error) {
          this.showToast("网络异常")
        })
      },

      /**
       *
       * 编辑客户信息
       */
      editCustomerInfo(){
        this.$router.push({"name": "supervisionEditCustomerInfo", query: {"orderId": this.orderId}});
      },

      /**
       *
       * 编辑合同金额
       */
      editContractAmount(){

        if (!this.verifyInputAmount(this.contractInputValue)) return false;

        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});

        this.$http.post(window.Host.employee + `/order/supervision/${this.orderId}/amount?amount=${this.contractInputValue}`).then((res) => {

            console.log(res);

            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});

            if (res.body.succ) {
              this.toastMsg("操作成功");
              this.getData();
              this.showContractInputDialog(false)
            } else {
              this.toastMsg(res.data.message);
            }
          },
          (error) => {
            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
            this.toastMsg("网络异常");
          })
      },

      /**
       *
       * 校验输入金额
       */
      verifyInputAmount(v){
        var a = /^\d{1,12}(\.\d{1,2})?$/;
        if (!a.test(v)) {
          console.log("格式不正确")
          this.toastMsg("格式不正确");
          return false
        }else if(v==0 || v=="") {
          console.log("请填写正确金额")
          this.toastMsg("请填写正确金额");
          return false;
        }else if(v*1>=100000000){
          console.log("合同金额应小于1亿")
          this.toastMsg("合同金额应小于1亿");
          return false;
        }else {
          return true;
        }
      },

      /**
       *
       * 显示结束订单弹窗
       */
      stopOrderDialog(){
        this.isShowStopOrderDialog = true;
      },

      /**
       *
       * 显示编辑合同金额弹窗
       */
      showContractInputDialog(show){
        if (this.resData.status == 2) return false;//已结束订单不能操作
        this.isShowInputDialog = show;
        if (!show) this.contractInputValue
      },

      /**
       * type=1上传第三方监理合同
       * type=2上传第四方监管协议
       */
      toUploadPic(type){
      	var url=window.Host.localUrl+`/#/supervisionContractForEmployee?orderId=${this.orderId}&picType=${type}`;
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    		if(isiOS){
    			invokeNative({
            "code":window.jsBridge.CODE_OPEN,
            "data":{
                "url":url
            }
    			});
    		}else {
    			invokeNative({
            "code":window.jsBridge.CODE_OPEN_UPLOAD,
            "data":{
                "url":url
            }
    			});
    		}
      }
    },
    created(){
      this.orderId = this.$route.query.orderId*1;
      this.getData();


//模拟数据调试用
//      this.resData = {
//        "id": 0,
//        "orderNum": 9527,
//        "companyId": 888,
//        "companyName": "公司名称",
//        "orderName": "订单名称",
//        "orderType": "1",
//        "orderTypeDesc": "订单类型›‹‹››",
//        "status": "2",
//        "statusDesc": "进行中",
//        "customerName": "尼古拉斯.加明",
//        "prepaidAmount": 1000.00,
//        "supervisionType": 1,
//        "supervisionTypeDesc": "",
//        "supervisionContracts": [
//          ""
//        ],
//        "supervisionAgreements": [
//          ""
//        ],
//        "supervisionDiscount": "骨"
//      }
    }
  }

</script>
<style scoped lang="less">


</style>
