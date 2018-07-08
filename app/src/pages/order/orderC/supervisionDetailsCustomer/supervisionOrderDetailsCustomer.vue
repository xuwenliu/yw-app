<!--#supervisionOrderDetailsForEmployee?orderId=13&closeType=0&index=0-->
<template>
  <div class="order-details">
    <TopHeader class="noBorder">
      <div class="clickMe" @click="goBack"><span></span></div>
      <i>订单详情</i> <i class="F4 operation" @click="operationLog">操作记录</i></TopHeader>
    <!--选项卡-->
    <div class="status bb1">
      <ul>
        <li v-for="(item,index) in status" style="position: relative" @click="goTab(index)">
          <span class="F4 C1" :class="{'active':inow==index}">{{item}}</span>
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
    name: 'supervisionSupervisionDetailsForCustomer',
    data(){
      return {
        orderId: null,
        customer: false,
        isShow: false,
        inow: 0,
        manager: 0,
        url: "",
        closeType: -1,
        index: 0,
        empty: false,
        status: ['订单总览', '款项支付'],
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

      operationLog(){
        var appType = "e";
        this.$router.push({"name": "operationLog", query: {"orderId": this.orderId, "appType": appType, "isNewLogPage":1}})
      },

      goTab(index){
        this.inow = index;
        console.log(index);

        switch (index) {

          case 0://总览
            console.log("" + index);
            this.$router.replace({
              "name": "supervisionOverviewForCustomer",
              query: {
                "orderId": this.orderId,
                "closeType": this.closeType
              }
            });
            break;
          case 1://定金
            this.$router.replace({
              "name": "supervisionBillForCustomer",
              query: {
                "orderId": this.orderId,
                "closeType": this.closeType,
              }
            });
            break;
        }
      },


    },
    created(){

      this.closeType = this.$route.query.closeType;
      this.orderId = this.$route.query.orderId;
      var i = this.$route.query.index * 1 || this.index;
      this.goTab(i);
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
