<!--userId(家具顾问ID)-->
<template>
  <div>


    <NoFile v-show="empty">
      <img slot="bgimg" src="../../../assets/img/customer/my_customer_no_data_ic@2x.png">
      <span slot="info">当前暂无客户</span>
    </NoFile>

    <div class="orderDetailsPayList" v-show="resData">
      <div class="content root-content">

        <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">

          <ul style="margin-bottom: 0.266666rem">
            <li class="details-order-item" v-for="(item,index) in resData ">
              <div class="details-order-tab1 F5 C1">
                <span>{{item.orderTypeDesc}} {{item.orderNum}}</span>
                <span>{{item.statusDesc}}</span>
              </div>
              <div class="details-order-tab2 F5 C1">
                <div class="details-order-info">
                  <div class="details-order-user">
                    <img class="details-order-portrait" :src="item.headImage">
                    <span class="F8 C1" style="font-weight: bold">{{item.customerName}}</span>
                  </div>
                  <div class="details-order-company textcut">{{item.companyName}}</div>
                </div>
                <div class="details-order-button">
                  <img src="../../../assets/img/customer/phone_ic@2x.png" @click="callContact(item.customerPhone)">
                </div>
              </div>
              <div class="details-order-tab3 F5 C4">
                <span>时间 {{item.createTime*1 | setDate}} - <i
                  v-show="item.finishTime">{{item.finishTime*1 | setDate}} </i></span>
                <span>已付金额 {{item.prepaidAmount | currency("",2)}}</span>
              </div>
            </li>
          </ul>
        </v-scroll>
      </div>
    </div>


  </div>

</template>
<script>

  import NoFile from '../../../components/NoFile'
  import VScroll from "../../../components/pull-refresh"
  import '../../../assets/css/consultant-detail.css'


  export default{
    name: 'done',
    data(){
      return {
        userId: 0,
        inow: 1,
        page: 1,
        pageSize: 10,
        empty: true,
        isRefresh: true,
        status: 1,
        resData: null,
        scrollData: {
          noFlag: false //暂无更多数据显示
        }
      }
    },
    methods: {

      /**
       * 电话联系
       * @param phone
       */
      callContact(phone){
        console.log(phone);
        invokeNative({"code": window.jsBridge.CODE_CALL_PHONE_NUMBER, "data": phone})
      },

      /**
       * 显示空布局
       * @param empty
       */
      showEmptyLayout(empty){
        this.empty = empty
      },

      /**
       * 弹Toast信息
       * @param msg
       */
      showToast(msg){
        invokeNative({code: window.jsBridge.CODE_TOAST, data: msg})
      },

      /**
       * 加载客户列表
       * @param page
       * @param done
       */
      loadList(){

        this.$http.get(window.Host.employee + `/advisor/${this.userId}/order?pageNum=${this.page}&pageSize=${this.pageSize}`).then(res => {
          if (res.body.succ) {
            console.log(res);
            this.showEmptyLayout(!res.body.data.result && this.page == 1);
            this.onResponseList(res.body.data.result);
          } else {
            if (res.body.stateCode != 312)
              this.showToast(res.body.message);
          }
        }, (res) => {
          this.showToast("网络异常");
        })
      },


      /**
       * 响应数据
       * @param result
       */
      onResponseList(result){
        if (this.page == 1) {
          this.resData = result
        } else {
          if (result)
            this.resData = this.resData.concat(result);
          else
            this.scrollData.noFlag = true
        }
      },

      /**
       * 下拉刷新回调
       * @param done
       */
      onRefresh(done) {
        this.page = 1;
        this.isRefresh = true;
        this.loadList();
        done();

      },

      /**
       * 上拉加载回调
       * @param done
       */
      onInfinite(done) {
        this.page++;
        this.isRefresh = false;
        this.loadList();
        this.$el.querySelector('.load-more').style.display = "none";
        done();
      }
    },
    components: {
      NoFile,
      'v-scroll': VScroll
    },
    created(){

      this.userId = this.$route.query.userId * 1;

      this.page = 1;
      this.loadList();

//      //模拟数据
//      this.resData = [
//        {
//          "id": 0,
//          "orderNum": 33443,
//          "orderName": "对方就当减肥",
//          "orderType": "",
//          "orderTypeDesc": "设计订单",
//          "prepaidAmount": 0,
//          "status": "",
//          "statusDesc": "待给钱",
//          "companyId": 0,
//          "companyName": "哪个好地方很多",
//          "createTime": "1499651767",
//          "customerUserId": 0,
//          "customerName": "尼古拉斯.赵四",
//          "customerGender": "",
//          "customerPhone": ""
//        },
//        {
//          "id": 1,
//          "orderNum": 33232,
//          "orderName": "是分开还是",
//          "orderType": "",
//          "orderTypeDesc": "施工订单",
//          "prepaidAmount": 0.01,
//          "status": "",
//          "statusDesc": "待给钱",
//          "companyId": 0,
//          "companyName": "成都业之峰装饰有限公司成都业之峰装饰有限公司成都业之峰装饰有限公司成都业之峰装饰有限公司",
//          "createTime": "1499651767",
//          "finishTime": "1499651767",
//          "customerUserId": 0,
//          "customerName": "尼古拉斯.加明",
//          "customerGender": "",
//          "customerPhone": ""
//        },
//        {
//          "id": 2,
//          "orderNum": 6543232323,
//          "orderName": "是的是的",
//          "orderType": "",
//          "orderTypeDesc": "施工订单",
//          "prepaidAmount": 0,
//          "status": "",
//          "statusDesc": "待给钱",
//          "companyId": 0,
//          "companyName": "名字非常非常长的装修的有限的有责任的公司",
//          "createTime": "1499651767",
//          "finishTime": "1499651767",
//          "customerUserId": 0,
//          "customerName": "尼古拉斯.汤",
//          "customerGender": "",
//          "customerPhone": ""
//        },
//        {
//          "id": 3,
//          "orderNum": 0,
//          "orderName": "第三方的发",
//          "orderType": "",
//          "orderTypeDesc": "设计订单",
//          "prepaidAmount": 2400000,
//          "status": "",
//          "statusDesc": "待给钱",
//          "companyId": 0,
//          "companyName": "",
//          "createTime": "1499651767",
//          "customerUserId": 0,
//          "customerName": "尼古拉斯.X",
//          "customerGender": "",
//          "customerPhone": ""
//        },
//      ]
    }
  }

</script>
