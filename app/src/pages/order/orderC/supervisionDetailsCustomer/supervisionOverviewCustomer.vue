<template>
  <div class="supervisionOverviewForEmployee">
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
        <li>
          <div class="supervision-e-item F5 C1">
            <i>订单状态</i>
            <span class="textcut">{{resData.statusDesc}}</span>
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
        <li>
          <div class="supervision-e-item F5 C1">
            <i>合同金额</i>
            <span class="textcut" v-show="resData.contractAmount">{{resData.contractAmount | currency("",2)}}</span>
            <span class="textcut" v-show="!resData.contractAmount">待录入</span>
          </div>
        </li>
        <li>
          <div class="supervision-e-item F5 C1">
            <i>已付金额</i>
            <span class="textcut">{{resData.prepaidAmount | currency("",2)}}</span>
          </div>
        </li>
      </ul>

      <ul class="supervision-e-check-button-layout F5 C1">
        <li @click="checkSupervisionContract" v-show="resData.contract">
          <span>查看第三方监理合同</span>
          <img src="../../../../assets/img/supervision/order_details_small_arrow@2x.png">
        </li>
        <li @click="checkSupervisionAgreement" v-show="resData.supervisorTemplate">
          <span>查看四方监管协议</span>
          <img src="../../../../assets/img/supervision/order_details_small_arrow@2x.png">
        </li>
      </ul>

    </div>

  </div>
</template>
<script>
  import '../../../../assets/css/supervisionE-order-detail.css'
  export default{
    name: 'supervisionOverviewForCustomer',
    data(){
      return {
        resData: {},
        orderId:0,

        safeguard: [
          {"name": "四方监管", "support": true},
          {"name": "安全支付", "support": true},
          {"name": "先行赔付", "support": true},
          {"name": "独立监理", "support": true}]
      }
    },
    components: {},
    methods: {
      /**
       *
       * 查看第三方监理合同
       */
      checkSupervisionContract(){
        this.$router.push({"name": "picPreview", query: {"picType": 1,"orderId": this.orderId}})
      },

      /**
       *
       * 查看第四方监管协议
       */
      checkSupervisionAgreement(){
        this.$router.push({"name": "picPreview", query: {"picType": 2,"orderId": this.orderId}})
      },
      /**
       *
       * 获取订单总览数据
       *
       * */
      getOverviewData(){
        console.log(this.orderId);
        this.$http.get(window.Host.customer + `/order/${this.orderId}`).then((res) => {
          console.log(res);
          if (res.data.succ) {
            this.resData = res.body.data;
            if (res.body.data.supervisionType*1 == 1) {//（1：四方监管，2：独立监理）,
              this.safeguard[0].support = true;
              this.safeguard[1].support = true;
              this.safeguard[2].support = true;
              this.safeguard[3].support = true;
            } else  {
              this.safeguard[0].support = false;
              this.safeguard[1].support = false;
              this.safeguard[2].support = false;
              this.safeguard[3].support = true;
            }
          } else {
            console.log("error" + res.data.message);
          }
        })
      },
    },
    created(){
      this.orderId = this.$route.query.orderId;
//      this.resData = {
//        "id": 0,
//        "orderNum": 12312321,
//        "companyName": "公司名字",
//        "statusDesc": "状态名字",
//        "prepaidAmount": 12,
//        "contractAmount": 13,
//        "contract": false,
//        "supervisorTemplate": false,
//        "supervisionType": 1,
//      }
      this.getOverviewData();
    }
  }

</script>
<style scoped lang="less">


</style>
