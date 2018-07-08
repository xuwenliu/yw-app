<template>
  <div>
    <div>
      <TopHeader class="clearfix">
        <div class="clickMe" @click="goBack"><span></span></div>
        确认信息
      </TopHeader>
      <div class="C0 F3 bg0 bt1"
           style="position:fixed; z-index:999;bottom:0;height: 1.17333rem;width:100%;text-align: center;display: flex;justify-content: space-between">

          <span style="flex-grow: 2;height: 1.17333rem;line-height: 1.17333rem;"
                class="C6 F3">实付款 {{data.payAmount}} 元</span>

        <span style="width: 3.52rem;height: 1.17333rem;line-height: 1.17333rem;background-color: #ed316b"
              class="F3 C0" @click="clickListenerPayNow"> 立即支付</span>

      </div>
      <div class="content bg-c7">
        <div class="bg0 bb1" style="padding: 0.4rem 0.53333rem;">

          <div class="F4 C1 fwb" style="margin-bottom:  0.3rem">{{data.groupActivityName}}</div>


          <div class="show-box" style="display:flex;align-items: center; ">
            <img :src="data.picUrl" style="width: 1.86666rem;height: 1.86666rem;margin: 0.26666rem">
            <span class="F4 C1 text3LineRestrist" style="width: 5.57333rem">{{data.description}}</span>
          </div>

        </div>

        <!--输入客户信息-->
        <div style="margin-top: 0.32rem" class="F3 C1 bg0 bb1">

          <div class="group-booking-input-area bb1">

            <img src="../../../assets/img/user_ic@2x.png">
            <span>
              客户姓名
            </span>
            <input type="text" placeholder="输入名称以便联系您" v-model="inputUsername">
          </div>

          <div class="group-booking-input-area">

            <img src="../../../assets/img/telephone_ic@2x.png">
            <span>
              手机号码
            </span>
            <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="inputUserPhone">
          </div>

        </div>


        <!--选择付款方式-->
        <div class="bg0 bb1" style="padding: 0 0.53333rem;margin-top: 0.32rem">
          <div class="F5 C4" style="height: 1.33333rem;display: flex;align-items: center">
            选择付款方式
          </div>


          <div class="group-booking-payway-area F4 C1 bb1 bt1" @click="clickListenerChoosePayWay(0)">
            <img src="../../../assets/img/order_pay_alipay_ico@2x.png" style="width: 0.96rem">
            <span>支付宝支付</span>
            <img :src="(selectedIndex == 0) ? selestedImg : unselestImg" style="width: 0.4rem;">
          </div>

          <div class="group-booking-payway-area F4 C1" @click="clickListenerChoosePayWay(1)">
            <img src="../../../assets/img/order_pay_wechat_ico@2x.png" style="width: 0.96rem">
            <span>微信支付</span>
            <img :src="(selectedIndex == 1) ? selestedImg : unselestImg" style="width: 0.4rem;">
          </div>


        </div>


      </div>
    </div>
  </div>
</template>

<script>
  import TopHeader from '../../../components/Header'
  import {Indicator} from 'mint-ui';
  import {MessageBox} from 'mint-ui';
  import {Toast} from 'mint-ui';

  export default {
    name: 'groupBookingActivityConfirm',
    components: {
      TopHeader,
      Indicator,
      MessageBox,
      Toast
    },
    data () {
      return {
        id: this.$route.query.groupActivityId,
        inputUsername: '',
        inputUserPhone: '',
        selestedImg: require("../../../assets/img/pay_choice_ic@2x.png"),
        unselestImg: require("../../../assets/img/log_in_agree_box_ic@2x.png"),
        selectedIndex: 0,
        data: {
          "groupActivityId": this.$route.query.groupActivityId,
          "groupActivityName": this.$route.query.groupActivityName,
          "picUrl": this.$route.query.picUrl,
          "billId": this.$route.query.billId,
          "description": this.$route.query.description,
          "groupId": this.$route.query.groupId,
          "payAmount": this.$route.query.payAmount,
          "userId": this.$route.query.userId
        },
      }
    },
    methods: {
      goBack(){
        this.$router.go(-1)
      },

//      getData(){
//        Indicator.open();
//        this.$http.post(window.Host.customer + `/group/createGroup/${this.id}`).then(res => {
//          console.log(res);
//          Indicator.close();
//          this.data = res.body.data;
//
//          if (this.data.payAmount == 0) {
//            MessageBox({
//              title: '推客免费',
//              message: '当前拼团对推客用户免费,无需进行支付，点击确认即可发起',
//              showCancelButton: true,
//            }).then(action => {
//              console.log(action);
//              if (action == "confirm") {
//                //确认，去支付成功页面
//                this.$router.push({
//                  name: "groupBookingActivityPaySuccess",
//                  query: {
//                    'id': this.id,
//                    'title': this.data.groupActivityName,
//                    'img': this.data.picUrl,
//                    'desc': this.data.description
//                  }
//                })
//              } else {
//                //取消
//                this.goBack();
//              }
//            });
//          }
//
//        }, error => {
//          Indicator.close()
//        })
//      },

      /**
       * 选择付款方式
       * @param index 0=支付宝 ，1=为微信
       */
      clickListenerChoosePayWay(index){
        this.selectedIndex = index;
      },


      /**
       * 立即支付
       */
      clickListenerPayNow(){

        if (!this.checkPassInput()) {
          return false;
        }


        const info = {
          "groupActivityId": this.data.groupActivityId,
          "groupId": this.data.groupId,
          "userName": this.inputUsername,
          "phone": this.inputUserPhone,
          "billId": this.data.billId,
          "userId": this.data.userId,
          "payAmount": this.data.payAmount
        };

        Indicator.open();
        this.$http.post(window.Host.customer + `/group/payGroupActivity`, info).then(res => {
          Indicator.close();
          if (res.body.succ) {


            if (this.data.payAmount == 0) {
              this.didPySuccess();
              return false;
            }


            if (res.body.data.type == 4) {
              this.didPySuccess();
              return false;
            }

            switch (this.selectedIndex) {
              case 0:
                //支付宝支付
                console.log("支付宝支付");
                break;
              case 1:
                //微信支付
                console.log("微信支付");
                break;
            }

            var payData = {
              "billId": this.data.billId * 1,
              "payType": this.selectedIndex * 1,
            };


            invokeNative({
              'code': window.jsBridge.CODE_PAY_ACTION_WITH_TYPE,
              'data': payData,
              'callback': 'groupBookingActivityPaySuccess'
            });

            var that = this;

            window.groupBookingActivityPaySuccess = function (value) {
              var value = window.atob(value);
              var res = JSON.parse(value);

              console.log(JSON.stringify(res));
              if (res.data) {
                that.didPySuccess()
              } else {
                //支付失败
                that.toast("支付失败")
              }
            }


          } else {
            didApiError(res)
          }
        }, error => {
          Indicator.close()

        });


      },


      /**
       * 检查输入数据正确性
       */
      checkPassInput(){
        if (!validRule.realname.test(this.inputUsername)) {
          this.toast("请输入真实姓名");
          return false;
        }
        if (!validRule.phone.test(this.inputUserPhone)) {
          this.toast("请输入正确的手机号");
          return false;
        }
        return true;
      },


      /**
       * 弹窗
       */
      toast(msg){
        Toast({message: msg, position: 'middle', duration: 3000});
      },


      /**
       * 查询账单信息
       */
      checkBill(){
        Indicator.open();
        this.$http.get(window.Host.customer + `/bill/brief/${this.data.billId}`).then(res => {
          console.log(res);
          Indicator.close();
          if (res.body.succ) {
            var data = res.body.data;
            if (data.whetherPayed) {
              this.didPySuccess()
            }
          } else {
            didApiError(res)
          }

        }, error => {
          Indicator.close();

        })
      },


      /**
       * 支付成功操作
       */
      didPySuccess(){
        console.log("支付成功");
        //支付成功
        this.$router.push({
          name: "groupBookingActivityPaySuccess",
          query: {
            'id': this.data.billId,
            'title': this.data.groupActivityName,
            'img': this.data.picUrl,
            'desc': this.data.description
          }
        })
      }
    }
    ,
    created(){
//      this.getData();
      console.log("==================" + this.id);
      this.checkBill()

    }
  }
</script>


<style>

  .show-box {
    -moz-box-shadow: 0px 1px 4px #A8A8A8;
    -webkit-box-shadow: 0px 1px 4px #A8A8A8;
    box-shadow: 0px 1px 4px #A8A8A8;
  }

  .group-booking-input-area {
    display: flex;
    padding: 0 0.53333rem;
    align-items: center;
    justify-content: space-between;
    height: 1.33333rem;
  }

  .group-booking-input-area img {
    width: 0.48rem;
    height: 0.48rem;
  }

  .group-booking-input-area span {
    margin: 0 0.3rem;
  }

  .group-booking-input-area input {
    flex-grow: 1;
    height: 1.33333rem
  }

  .group-booking-payway-area {
    display: flex;
    align-items: center;
    height: 1.6rem;
    justify-content: space-between;
  }

  /*.group-booking-payway-area img{*/
  /*width: 0.96rem;*/
  /*}*/

  .group-booking-payway-area span {
    flex-grow: 1;
    margin: 0 0.3rem;
  }

  /*.group-booking-input-area i{*/
  /**/
  /*}*/

</style>

