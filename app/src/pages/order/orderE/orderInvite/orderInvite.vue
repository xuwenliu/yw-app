<template>
  <div>
    <TopHeader><div class="clickMe" @click="goBack"><span></span></div>邀请付款</TopHeader>
    <BottomFooter><div class="F3 C0" @click="onConfirmButtonClicked">确定</div></BottomFooter>
    <div class="content btm">
      <div class="paylist-title bg0">
        <div class="img-box">
          <img :src="customerHeadImage">
          <h1 class="F8 C1">{{customerName}}</h1>
        </div>
      </div>
      <div class="paylist-list mg bg0">
        <ul>
          <li class="bb1" v-show="orderType != 3">
            <div class="div-box F4 C1 clearfix">
              <p><span>付款用途</span></p>
              <p>
                <select v-model="selectPayUse">
                  <option v-for="item in payUseList" :value="item.code">{{item.desc}}</option>
                </select>
                <img src="../../../../assets/img/order/order_details_small_arrow@2x.png">
              </p>
            </div>
          </li>
          <li class="bb1">
            <div class="div-box F4 C1 clearfix">
              <p><span>账单金额</span></p>
              <input type="number" placeholder="请输入账单金额" v-model="amount">
            </div>
          </li>
          <li class="bb1">
            <div class="div-box F4 C1 clearfix">
              <p><span>说明&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
              <input type="text" placeholder="请输入用途的详细说明" v-model="postscript">
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import TopHeader from '../../../../components/Header'
  import BottomFooter from '../../../../components/Footer'
  import '../../../../assets/css/order-invite.css'
  export default{
    name:"payList",
    components:{
      TopHeader,
      BottomFooter
    },
    data(){
      return {
        orderId:0,
        orderType:0,
        payUseList:[],
        customerName:'',
        customerHeadImage:'',
        selectPayUse:0,			//选中的付款用途
        amount:'',						//账单金额
        postscript:'',					//账单说明
      }
    },
    methods:{
      goBack(){
        this.$router.go(-1);
      },
      onConfirmButtonClicked() {
          console.log(this.amount);
        if (this.amount) {
          this.$http.post(window.Host.employee+`/order/${this.orderId}/bill`,
            {
              "orderId": this.orderId,
              "billContentType": this.selectPayUse,
              "amount": (this.amount)*1,
              "postscript": this.postscript
            }).then((res)=>{
            // 成功回调
            console.log(res);
            if(res.body.succ){
              invokeNative({
                "code":window.jsBridge.CODE_TOAST,
                "data":"操作成功"
              })
              this.$router.go(-1);
            }else{
              //调用原生提示框
              invokeNative({
                "code":window.jsBridge.CODE_TOAST,
                "data":res.body.message
              })
            }
          });
        } else  {
          invokeNative({
            "code":window.jsBridge.CODE_TOAST,
            "data":"请输入金额"
          })
        }

      },
      loadBillBirefInfo() {
        this.$http.get(window.Host.employee+`/order/${this.orderId}/createBillInfo`).then((res)=>{
          console.log(res);
          if(res.status==200){
            this.payUseList = res.body.data.canCreateBillTypes;
            this.selectPayUse = res.body.data.canCreateBillTypes[0].code;
            this.customerName = res.body.data.orderInfo.customerName;
            this.customerHeadImage = res.body.data.customerHeadImage + '&imageView2/1/w/60/h/60';
            this.orderType = res.body.data.orderInfo.orderType;
          }
        },(res)=>{
          console.log(res);
        })
      }
    },
    created(){
      console.log("打开了邀请页面");
      this.orderId = this.$route.query.orderId;
      this.loadBillBirefInfo();
    }
  }
</script>
