<!--#orderDetails?orderId=13&isCustomer=false&closeType=0-->
<template>
  <div class="order-details">
    <footer-bottom
      v-show="!customer && orderStatusData && (orderStatusData.orderStatus == 1 || orderStatusData.orderStatus == 0) && orderStatus !=3 && manager!=1">
      <div @click="applyPay(orderId)" class="F3 C0"
           :class="{'apply-unenabled':(orderStatusData&&orderStatusData.unpaidEarnest || orderStatusData.unpaidFirst || orderStatusData.unpaidPhase || orderStatusData.unpaidFinal)}">
        邀请付款
      </div>
    </footer-bottom>
    <footer-bottom
      v-show="manager==1">
      <div @click="callService" v-show="manager==1" class="F3 C0">
        联系客户
      </div>
    </footer-bottom>
    <TopHeader class="noBorder">
      <div class="clickMe" @click="goBack"><span></span></div>
      <i>订单详情</i> <i class="F4 operation" @click="operationLog">操作记录</i></TopHeader>
    <!--选项卡-->
    <div class="status bb1">
      <ul>
        <li v-for="(item,index) in status" style="position: relative" @click="goTab(index)">
          <span class="F4 C1" :class="{'active':inow==index}">{{item}}</span>
          <i :class="{'redPoint':dotShow[index]}"></i>
        </li>
      </ul>
    </div>
    <router-view></router-view>

  </div>
</template>
<script>
  import TopHeader from '../../../../components/Header'
  import Toast from '../../../../components/Toast'
  import NoFile from '../../../../components/NoFile'
  import FooterBottom from '../../../../components/Footer'
  export default{
    name: 'order-details',
    data(){
      return {
        applyBtnEnabled: false,
        orderId: null,
        isCustomer: "false",
        customer: false,
        isShow: false,
        inow: 0,
        manager: 0,
        url: "",
        closeType: -1,
        index: 0,
        empty: false,
        status: ['总览', '定金', '首款', '阶段款', '尾款'],
        dotShow: [false, false, false, false, false],
        totalCount: 0,
        list: [],
        customerPhone: "",
        orderStatus: 0,
        orderStatusData: {}
      }
    },
    components: {
      TopHeader,
      Toast,
      NoFile,
      FooterBottom
    },
    methods: {

      goBack(){


        console.log("closeType:" + this.closeType);
        if (this.closeType == 0) {
          invokeNative({"code": window.jsBridge.CODE_CLOSE});
        } else {
          this.$router.go(-1);
        }
      },

      /**
       *
       *联系客服
       */
      callService(){
        invokeNative({"code": window.jsBridge.CODE_CALL_PHONE_NUMBER, "data": this.customerPhone})
      },

      operationLog(){
        var appType;
        if (this.customer) {
          appType = "c"
        } else {
          appType = "e"
        }
        this.$router.push({"name": "operationLog", query: {"orderId": this.orderId, "appType": appType, "isNewLogPage":0}})
      },

      goTab(index){
        this.inow = index;
        console.log(index);

        switch (index) {

          case 0://总览
            console.log("" + index);
            this.$router.replace({
              "name": "overview",
              query: {
                "orderId": this.orderId,
                "isCustomer": this.isCustomer,
                "orderStatus": this.orderStatus,
                "closeType": this.closeType,
              }
            });
            break;
          case 1://定金
            this.$router.replace({
              "name": "deposit",
              query: {
                "orderId": this.orderId,
                "isCustomer": this.isCustomer,
                "orderStatus": this.orderStatus,
                "closeType": this.closeType,
                "manager": this.manager
              }
            });
            break;
          case 2://首付款
            this.$router.replace({
              "name": "first",
              query: {
                "orderId": this.orderId,
                "isCustomer": this.isCustomer,
                "orderStatus": this.orderStatus,
                "closeType": this.closeType,
                "manager": this.manager
              }
            });
            break;
          case 3://isCustomer
            this.$router.replace({
              "name": "phase",
              query: {
                "orderId": this.orderId,
                "isCustomer": this.isCustomer,
                "orderStatus": this.orderStatus,
                "closeType": this.closeType,
                "manager": this.manager
              }
            });
            break;
          case 4://尾款
            this.$router.replace({
              "name": "finalPayment",
              query: {
                "orderId": this.orderId,
                "isCustomer": this.isCustomer,
                "orderStatus": this.orderStatus,
                "closeType": this.closeType,
                "manager": this.manager
              }
            });
            break;
        }
      },

      /*邀请付款*/
      applyPay(orderId){
        var orderStatusData = this.orderStatusData;
        if (orderStatusData.unpaidEarnest || orderStatusData.unpaidFirst || orderStatusData.unpaidPhase || orderStatusData.unpaidFinal) {
        } else {
          this.$router.push({"name": "orderInvite", query: {"orderId": orderId}})
        }
      },

      /*查询订单状态和是否有未支付的账单（邀请付款按钮和小红点）*/
      checkUnpaidBillInfo(){
        this.$http.get(this.url + `/order/${this.orderId}/unpaidBill`).then(function (res) {
          console.log(res);
          if (res.data.stateCode === 0) {
            this.orderStatusData = res.data.data;
            this.dotShow[1] = this.orderStatusData.unpaidEarnest;
            this.dotShow[2] = this.orderStatusData.unpaidFirst;
            this.dotShow[3] = this.orderStatusData.unpaidPhase;
            this.dotShow[4] = this.orderStatusData.unpaidFinal;
            this.orderStatus = this.orderStatusData.orderStatus;
            this.customerPhone = this.orderStatusData.customerPhone

          } else {
            if (res.data.stateCode != 312) {
              invokeNative({"code": window.jsBridge.CODE_TOAST, data: res.data.message});
            }
          }
        })
      },

      /**
       * 查询业者是否为客服经理
       */
      getEmployeeDetail(){
        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});
        this.$http.get(this.url + `/employee/getEmployeeDetail`).then(function (res) {
          invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
          if (res.data.succ) {
            var employeeDto = res.data.data.employeeDto;
            if (employeeDto.userDetailType == 10) {
              this.manager = 1
            }
          }
        }, function (res) {
          invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
        })
      }

    },
    created(){


      this.closeType = this.$route.query.closeType;

      var b = this.$route.query.isCustomer;


      if (b == "true") {
        this.url = window.Host.customer;
        this.isCustomer = "true";
        this.customer = true
      } else {
        this.customer = false;
        this.url = window.Host.employee;
        this.isCustomer = "false";
        this.getEmployeeDetail()
      }

      this.orderId = this.$route.query.orderId;
      var i = this.$route.query.index || this.index;

      i = parseInt(i);
      this.goTab(i);
      this.checkUnpaidBillInfo()
    }
  }

</script>
<style scoped lang="less">
  .noBorder {
    border-bottom: 0;
  }

  div.apply-unenabled {
    background-color: #C3C3C3;
  }

  .status {
    background-color: #fff;
    height: 1.17333rem;
    position: relative;
    width: 100%;
    z-index: 999;

  ul {
    margin: 0 0.68rem;
    display: flex;
    text-align: center;

  li {
    flex: 1;
    line-height: 1.17333rem;
  }

  }
  .active {
    color: #ed316b;
    border-bottom: 2px solid #ed316b;
    padding-bottom: 0.18666rem;
  }

  }

  .operation {
    position: absolute;
    right: 0.53333rem;
  }

  .redPoint {
    width: 0.15rem;
    height: 0.15rem;
    background-color: #ed316b;
    border-radius: 0.075rem;
    position: absolute;
    top: 0.25rem;
    right: 0.15rem;
  }

</style>
