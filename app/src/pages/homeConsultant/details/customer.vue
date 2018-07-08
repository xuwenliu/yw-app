<!--userId-->
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
            <li class="details-customer-item" v-for="(item,index) in resData ">
              <div class=" details-customer-item-left ">
                <div class="details-customer-item-left-top">


                  <div class="details-customer-tab1">
                    <img class="details-customer-portrait" :src="item.headImage">
                    <div class="F8 C1 ">{{item.nickName}}</div>
                    <div class="F6 details-customer-item-left-top-status"> {{item.statusDesc}} </div>
                  </div>


                  <div class="details-customer-tab2">
                    <h2>
                      <div style="display: inline-block">
                        <div class="details-customer-customer-dot" style="display: inline-block"></div>
                        聊天总数 {{item.imSessionCount}}
                      </div>
                      <div class="details-customer-informationPadding" style="display: inline-block">
                        <div class="details-customer-customer-dot" style="display: inline-block"></div>
                        未关闭聊天 {{item.imSessionOpenCount}}
                      </div>
                    </h2>
                  </div>

                  <div class="details-customer-tab2">
                    <h2>
                      <div style="display: inline-block">
                        <div class="customer-dot" style="display: inline-block"></div>
                        订单总数 {{item.orderCount}}
                      </div>
                      <div class="informationPadding" style="display: inline-block">
                        <div class="customer-dot" style="display: inline-block"></div>
                        未结束订单 {{item.orderGoingCount}}
                      </div>
                    </h2>
                  </div>

                </div>
                <div class="details-customer-item-left-bottom">
                  <div class="details-customer-descriptionLayout">
                    <div class="details-customer-description">
                      <div>备忘录: {{item.description}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class=" details-customer-item-right">
                <img src="../../../assets/img/customer/phone_ic@2x.png"
                     @click="callContact(item.userPhone)"/>
                <img src="../../../assets/img/customer/change_ic@2x.png"
                     @click="changePeople(item.userId)"/>
              </div>
            </li>
          </ul>
        </v-scroll>
      </div>
    </div>

    <!-- 弹窗 -->
    <div class="consult-customer-shadow" v-if="isShowPopView">
      <div class="consult-customer-pop">
        <div class="consult-customer-pop-title F1 C1"><span>可换家居顾问 {{this.consultsChangeCount}}人</span></div>
        <div class="consult-customer-pop-list">
          <div v-show="false">
            <span class="F4 C5">暂无可更换的家居顾问</span>
          </div>
          <ul v-show="true">
            <li v-for="(item,index) in arrayChangeConsults" @click="chooseConsult(index)">
              <img class="consult-customer-pop-img-choose " :src="item.selectImg"/>
              <img class="consult-customer-pop-img-header" :src="item.headImage"/>
              <span class="F4 C1">{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="consult-customer-pop-bottom">
          <button class="consult-customer-pop-button-cancel" @click="cancelChangeConsult">取消</button>
          <button @click="changeConsult">确定</button>
        </div>
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
        imgNotChoosed: require("../../../assets/img/consultantsList/gray_choice_ic@2x.png"),
        imgChoosed: require("../../../assets/img/consultantsList/choice_light_ic@2x.png"),
        arrayChangeConsults: [],
        consultsChangeCount: 0,
        choosedIndex: -1,
        isShowPopView: false,
        userId: 0,
        inow: 1,
        page: 1,
        pageSize: 10,
        empty: true,
        isRefresh: true,
        status: 1,
        isShowInputDialog: false,
        resData: null,
        currentNote: "",
        currentId: 0,
        chooseCustomerId: 0,
        scrollData: {
          noFlag: false //暂无更多数据显示
        }
      }
    },
    components: {
      NoFile,
      'v-scroll': VScroll
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
      loadCustomerList(){

        this.$http.get(window.Host.employee + `/advisor/${this.userId}/customer?pageNum=${this.page}&pageSize=${this.pageSize}`).then(res => {
          console.log(res);
          if (res.body.succ) {
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
        console.log(result);
        if (this.page == 1) {
          this.resData = result
        } else {
          if (result)
            this.resData = this.resData.concat(result)
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
        this.loadCustomerList();
        done();

      },

      /**
       * 上拉加载回调
       * @param done
       */
      onInfinite(done) {
        this.page++;
        this.isRefresh = false;
        this.loadCustomerList();
        this.$el.querySelector('.load-more').style.display = "none";
        done();
      },

      /**
       * 换人跟单
       * @param userId
       */
      changePeople(userId){
        this.chooseCustomerId = userId;
        this.choosedIndex = -1;
        console.log(userId);
        this.$http.get(window.Host.employee + `/advisor/customer/${userId}/alteration`).then(res => {
          console.log(res);
          if (res.body.succ) {
            this.arrayChangeConsults = [];
            var arr = res.body.data;
            for (var i in arr) {
              let obj = {};
              obj['userId'] = arr[i].userId;
              obj['name'] = arr[i].name;
              obj['headImage'] = arr[i].headImage;
              obj['selectImg'] = this.imgNotChoosed;
              this.arrayChangeConsults.push(obj);
            }
            this.isShowPopView = true;
            this.consultsChangeCount = this.arrayChangeConsults.length;
          } else {
            if (res.body.stateCode != 312)
              this.showToast(res.body.message);
          }
        }, (res) => {
          this.showToast("网络异常");
        })
      },
      /**
       *
       * 取消更换家居顾问
       *
       * */
      cancelChangeConsult() {
        this.isShowPopView = false;
      },
      /**
       *
       *  更换家居顾问执行
       *
       **/
      changeConsult() {
        console.log("更换家居顾问")
        if (this.choosedIndex == -1) {
          this.showToast("请选择需要更换的家居顾问")
          return;
        }

        var choosedConsultId = this.arrayChangeConsults[this.choosedIndex].userId * 1;
        console.log(choosedConsultId);
        this.$http.post(window.Host.employee + `/advisor/customer/${this.chooseCustomerId}/alteration?newAdvisorUserId=${choosedConsultId}`).then((res) => {
          console.log(res);
          /*请求成功后根据返回值弹出对应的框*/
          if (res.body.succ) {
//            window.reloadFun();
            this.isShowPopView = false;
            this.page = 1;
            this.isRefresh = true;

            this.loadCustomerList();

          } else {
            if (res.body.stateCode != 312)
              this.showToast(res.body.message);
          }
        });
      },
      /**
       *
       * 选中需要更换的家居顾问
       *
       * */
      chooseConsult(index) {
        this.choosedIndex = index;
        for (var i = 0; i < this.arrayChangeConsults.length; i++) {
          if (index == i) {
            this.arrayChangeConsults[i].selectImg = this.imgChoosed;
          } else {
            this.arrayChangeConsults[i].selectImg = this.imgNotChoosed;
          }
        }
      }
    }, created(){
      this.userId = this.$route.query.userId * 1;

      this.page = 1;
      this.isRefresh = true;
      this.loadCustomerList();

//      //模拟数据
//      this.resData = [
//        {
//          "userId": 0,
//          "userPhone": "12345678",
//          "nickName": "是多少",
//          "headImage": require("../../../assets/img/share/register_ywmj_logo@2x.png"),
//          "imSessionCount": 22,
//          "imSessionOpenCount": 2,
//          "orderCount": 12,
//          "orderGoingCount": 0,
//          "description": "地方还是地哦是送到家哦撒娇冻死啊董i撒娇冻死啊ID赛我去",
//          "status": "1",
//          "statusDesc": ""
//        },
//        {
//          "userId": 1,
//          "userPhone": "8765434543",
//          "nickName": "尼古拉斯",
//          "headImage": require("../../../assets/img/share/register_ywmj_logo@2x.png"),
//          "imSessionCount": 323,
//          "imSessionOpenCount": 2,
//          "orderCount": 34,
//          "orderGoingCount": 7,
//          "description": "是非口舌帕蒂是可怕的冬季撒娇地哦是记得是i多送i的机票是地ops",
//          "status": "3",
//          "statusDesc": ""
//        },
//        {
//          "userId": 2,
//          "userPhone": "243536576",
//          "nickName": "等会负担",
//          "headImage": require("../../../assets/img/share/register_ywmj_logo@2x.png"),
//          "imSessionCount": 221,
//          "imSessionOpenCount": 111,
//          "orderCount": 354,
//          "orderGoingCount": 344,
//          "description": "带上飞机哦都嫁人了酒店佛i撒u低价撒看到ui撒旦回家撒对撒点击撒",
//          "status": "",
//          "statusDesc": "2"
//        }
//      ]
    }
  }

</script>
<style scoped lang="less">
  .root-content {
    padding-top: 1.2rem;
  }

  .consultantDetail-customer {
    width: 0.33333rem;
    margin-left: 0.4rem;
    margin-right: 0.08rem;
    height: 0.33333rem;
  }
</style>

