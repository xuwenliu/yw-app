<template>
  <div class="overview">
    <div class="content root-content-overview ">

      <div class="title-order F3 C1 bg0">订单信息</div>
      <ul class="bg0 bb1">
        <li>
          <div class="item F5 C1">
            <i>订单编号</i>
            <span class="textcut">{{resData.orderNum}}</span>
          </div>
        </li>
        <li>
          <div class="item F5 C1">
            <i>公司名称</i>
            <span class="textcut">{{resData.companyName}}</span>
          </div>
        </li>
        <li>
          <div class="item F5 C1">
            <i>项目名称</i>
            <span class="textcut">{{resData.orderName}}</span>
          </div>
        </li>
        <li>
          <ul>
            <li v-for="(itemData,index) in resData.employees">
              <div class="item F5 C1">
                <i>{{itemData.userDetailTypeDesc}}</i>
                <span class="textcut">{{itemData.name}}</span>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div class="item F5 C1 paidAmount" v-show="resData.customerName && !isCustomer && emplyeeType == 10" @click="editCustomerInfo">
            <i>客户姓名</i>
            <img class="itemArrow" src="../../../../assets/img/order/order_details_small_arrow@2x.png">
            <span class="textcut">{{resData.customerName}}</span>
          </div>
          <div class="item F5 C1" v-show="resData.customerName && !isCustomer && emplyeeType != 10">
            <i>客户姓名</i>
            <span class="textcut">{{resData.customerName}}</span>
          </div>
        </li>
        <li>
          <div class="item F5 C1" v-show="resData.orderNum">
            <i>订单状态</i>
            <span class="textcut">{{resData.statusDesc}}</span>
          </div>
        </li>

        <div class="item F5 C1 paidAmount">
          <i>已付金额</i>
          <span class="textcut">{{resData.prepaidAmount}}</span>
        </div>
        <div class="item F5 C1 paidAmount bt1" @click="toPayDetalis" v-show="!isCustomer">
          <i>平台打款</i>
          <img class="itemArrow" src="../../../../assets/img/order/order_details_small_arrow@2x.png">
          <span class="textcut">{{resData.settledAmount}}</span>
        </div>
      </ul>


      <div class="title-order F3 C1 bg0" style="margin-top:0.26666rem ">阶段汇总</div>

      <ul class="bg0 bb1" style="box-sizing: border-box; margin-bottom: 0.26666rem">
        <li>
          <div class="item F5 C1"><i>定金</i><span>{{billStatistics.earnestAmount | currency("",2)}}</span></div>
        </li>
        <li>
          <div class="item F5 C1"><i>首款</i><span>{{billStatistics.firstAmount | currency("",2)}}</span></div>
        </li>
        <li>
          <div class="item F5 C1"><i>阶段款</i><span>{{billStatistics.totalPhaseAmount | currency("",2)}}</span></div>
        </li>
        <li>
          <div class="item F5 C1"><i>尾款</i><span>{{billStatistics.finalAmount | currency("",2)}}</span></div>
        </li>
      </ul>


    </div>
  </div>
</template>

<script>
  export default{
    name: "overview",
    data(){
      return {
        orderBaseInfoTitle: ["订单编号", "公司名称", "项目名称", "设计师", "订单状态"],
        inow: 0,
        resData: {},
        orderId: 0,
        url: "",
        isCustomer: false,
        billStatistics: {},
        emplyeeType:0
      }
    },
    methods: {

      getOverviewData(isCustomer, orderId){

        console.log(this.url);

        this.$http.get(this.url + `/order/${orderId}`).then((res) => {
          console.log(res);
          if (res.data.succ) {
            this.resData = res.data.data;
            this.billStatistics = this.resData.billStatistics
            this.getEmployeeInfo();
          } else {
            console.log("error" + res.data.message);
          }
        })
      },

      getEmployeeInfo(){
        this.$http.get(this.url + `/employee/getEmployeeDetail`).then(function (res) {
          if (res.data.succ) {
            var employeeDto = res.data.data.employeeDto;
            this.emplyeeType = employeeDto.userDetailType;
          }
        }, function (res) {
        })
      },

      /**
       *
       * 编辑客户信息
       */
      editCustomerInfo(){
        this.$router.push({"name": "supervisionEditCustomerInfo", query: {"orderId": this.orderId}});
      },

      toPayDetalis(){
        this.$router.push({"name": "payDetail", query: {"orderId": this.orderId}})
      }
    },
    created(){
      var orderId = this.$route.query.orderId;
      this.orderId = orderId;

      var b = this.$route.query.isCustomer;
      if (b == "true") {
        this.url = window.Host.customer;
        this.isCustomer = true
      } else {
        this.url = window.Host.employee;
        this.isCustomer = false

        this.emplyeeType = this.$route.query.emplyeeType * 1;
        console.log("orderDetail overview emplyeetype:"+this.emplyeeType);
      }


      console.log("details b :" + b);

      this.getOverviewData(this.isCustomer, orderId);


//      /*模拟数据*/
//      this.resData = {
//        "id": 0,
//        "orderNum": 0,
//        "companyId": 0,
//        "companyName": "",
//        "orderName": "",
//        "orderType": "",
//        "orderTypeDesc": "",
//        "status": "",
//        "statusDesc": "",
//        "prepaidAmount": 0,
//        "settledAmount": 0,
//        "employees": [
//          {
//            "employeeUserId": 0,
//            "userDetailType": "",
//            "userDetailTypeDesc": "",
//            "companyId": 0,
//            "name": "",
//            "nickName": "",
//            "headImage": "",
//            "quitJobs": false
//          }
//        ],
//        "customerName": "",
//        "billStatistics": {
//          "earnestAmount": 0,
//          "firstAmount": 0,
//          "totalPhaseAmount": 0,
//          "finalAmount": 0
//        }
//      }

    }
  }
</script>
<style scoped lang="less">
  .root-content-overview {
    padding-top: 1.2rem;
    padding-bottom: 1.2rem;
  }

  .title-order {
    height: 1.2rem;
    width: 100%;
    line-height: 1.2rem;
    padding-left: 0.533rem;
    padding-right: 0.533rem;
    box-sizing: border-box;
    font-weight: bold;
  }

  .item {
    height: 0.8rem;
    margin: 0 0.53333rem;
    line-height: 0.8rem;
    box-sizing: border-box;
  }

  .item i {
    float: left;
  }

  .item span {
    width: 5rem;
    text-align: right;
    float: right;
  }

  .paidAmount {
    height: 1.09333rem;
    line-height: 1.09333rem !important;
  }

  .itemArrow {
    width: 0.13333rem;
    height: 0.25333rem;
    margin-left: 0.13333rem;
    float: right;
    box-sizing: border-box;
    margin-top: 0.43rem;
  }

</style>
