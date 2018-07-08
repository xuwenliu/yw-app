<!--status-->
<template>
  <div>


    <input-reason v-show="isShowInputDialog">
      <div class="show-input-box">
        <div class="inputBox">
          <div class="F2 C1 inputBox-title">备忘录</div>
          <textarea placeholder="请输入备注，30字以内" v-model.trim="currentNote" rows=30 cols="4"
                    class="inputBox-input F4"></textarea>
          <div class="inputBox-btn C6 F3">
            <div style="border-right:1px solid #737373" @click="showInputNoteDialog(false,null)">取消
            </div>
            <div @click="changeNote">确定</div>
          </div>
        </div>
      </div>
    </input-reason>

    <NoFile v-show="empty">
      <img slot="bgimg" src="../assets/img/customer/my_customer_no_data_ic@2x.png">
      <span slot="info">当前暂无客户</span>
    </NoFile>


    <div class="orderDetailsPayList" v-show="resData">
      <div class="content root-content">


        <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">

          <div class="mine-customer-topHint" v-show="status == 1 || status == 3">列表按客户价值高低排序（客户未关闭聊天数越多，价值越高）</div>
        <div class="mine-customer-topHint" v-show="status == 2">列表按客户价值高低排序（客户未结束订单数越多，价值越高）</div>
        <div class="mine-customer-topHint" v-show="status == 4">列表按客户价值高低排序（客户订单总数越多，价值越高）</div>
          <ul>
            <li class="mine-customer-item" v-for="(item,index) in resData ">
              <div class=" mine-customer-item-left ">
                <div class="mine-customer-item-left-top clearfix">
                  <img class="mine-customer-portrait fl" :src="item.headImage">
                  <div class="mine-customer-information fl">
                    <div class="F8 C1 ">{{item.nickName}}</div>
                    <h2 v-show="status == 1 || status == 3">
                      <div style="display: inline-block">
                        <div class="mine-customer-customer-dot" style="display: inline-block"></div>
                        聊天总数 {{item.imSessionCount}}
                      </div>
                      <div class="mine-customer-informationPadding" style="display: inline-block">
                        <div class="mine-customer-customer-dot" style="display: inline-block"></div>
                        未关闭聊天 {{item.imSessionOpenCount}}
                      </div>
                    </h2>

                    <h2 v-show="status==2 || status==4">
                      <div style="display: inline-block">
                        <div class="mine-customer-customer-dot" style="display: inline-block"></div>
                        订单总数 {{item.orderCount}}
                      </div>
                      <div class="mine-customer-informationPadding" style="display: inline-block">
                        <div class="mine-customer-customer-dot" style="display: inline-block"></div>
                        未结束订单 {{item.orderGoingCount}}
                      </div>
                    </h2>
                  </div>
                </div>
                <div class="mine-customer-item-left-bottom">
                  <div class="mine-customer-descriptionLayout" @click="showInputNoteDialog(true,item.userId)">
                    <div class="mine-customer-description" v-show="item.description">
                      <div>备忘录: {{item.description}}</div>
                    </div>
                    <div class="mine-customer-editDescription" v-show="!item.description">
                      <div>备忘录: <span class="C5">点击填写备忘录</span></div>
                    </div>
                    <img class="mine-customer-mine-arrow" src="../assets/img/customer/arrows_ic@2x.png">

                  </div>
                </div>
              </div>
              <div class=" mine-customer-item-right">
                <img src="../assets/img/customer/phone_ic@2x.png" @click="callContact(item.userPhone)"/>
                <img src="../assets/img/customer/close_ic@2x.png" v-show="status == 1"
                     @click="changeStatus(3,item.userId)"/>
                <img src="../assets/img/customer/done_ic@2x.png" v-show="status == 2"
                     @click="changeStatus(4,item.userId)"/>
                <img src="../assets/img/customer/remove_ic@2x.png" v-show="status == 3"
                     @click="changeStatus(1,item.userId)"/>
                <img src="../assets/img/customer/success_ic@2x.png" v-show="status == 4"
                     @click="changeStatus(2,item.userId)"/>
              </div>
            </li>
          </ul>
        </v-scroll>
      </div>
    </div>

  </div>
</template>
<script>

  import NoFile from './NoFile'
  import VScroll from "../components/pull-refresh"
  import '../assets/css/mine-customer.css'
  import InputReason from './InputReason'


  export default{
    name: "mineCustomerList",
    data(){
      return {
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
        scrollData: {
          noFlag: false //暂无更多数据显示
        }
      }
    },
    components: {
      NoFile,
      'v-scroll': VScroll,
      InputReason
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
       * 只能标记为已飞单[1 -> 3]和解除飞单[3 -> 1]; 已成单与已完结转换[2 -> 4] 和 [4 -> 2]
       */
      changeStatus(status, id){
        console.log("==status===" + status);
        console.log("==id===" + id);


        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});
        this.$http.post(window.Host.employee + `/advisor/customer/${id}/status?status=${status}`).then((res) => {

            console.log(res);
            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
            if (res.data.succ) {
              this.refreshParent();
              this.page = 1;
              this.loadCustomerList();


              //成功回调
              this.showToast("操作成功");
            } else {
              this.showToast(res.data.message);
            }
          },
          (error) => {
            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
            this.showToast("网络异常");
          })
      },


      refreshParent(){
        this.$emit("refreshTab")
      },

      /**
       * 显示空布局
       * @param empty
       */
      showEmptyLayout(empty){
        this.empty = empty
      },


      /**
       * 显示填写备忘录dialog
       * @param show
       * @param id
       */
      showInputNoteDialog(show, id){
        this.currentId = id || 0;
        this.isShowInputDialog = show;
        if (!show) this.currentNote = ""
      },


      /**
       * 修改备忘录
       */
      changeNote(){

        if (this.currentNote.length == 0) {
          this.showToast("输入不能为空");
          return false;
        }

        if (this.currentNote.length > 30) {
          this.showToast("备注在30字以内");
          return false;
        }


        invokeNative({"code": window.jsBridge.CODE_DIALOG_SHOW});
        this.$http.post(window.Host.employee + `/advisor/customer/${this.currentId}/description?description=${this.currentNote}`).then((res) => {

            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});

            if (res.data.succ) {
//              window.reloadFun();
//              this.$router.go(0);

              this.page = 1;
              this.loadCustomerList();


              //成功回调
              this.showInputNoteDialog(false, null);
              this.showToast("操作成功");
            } else {
              this.showToast(res.data.message);
            }
          },
          (error) => {
            invokeNative({"code": window.jsBridge.CODE_DIALOG_HIDE});
            this.showToast("网络异常");
          })
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
        this.$http.get(window.Host.employee + `/advisor/customer?status=${this.status}&pageNum=${this.page}&pageSize=${this.pageSize}`).then(res => {
          console.log(res);
          if (res.body.succ) {
            this.showEmptyLayout(!res.body.data.result && this.page == 1);
            this.onResponseList(res.body.data.result);
          } else {
            if (res.body.stateCode != 312)
              this.showToast(res.body.message);
          }
        }, (res) => {
//          this.showToast("网络异常");
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
        done();
        this.page = 1;
        this.isRefresh = true;
        this.loadCustomerList();
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
      }


    },
    created(){
      this.status = this.$route.query.status * 1;

      console.log("status:" + this.status);
      this.page = 1;
      this.loadCustomerList();

     // this.resData = [
     //   {
     //     "userId": 0,
     //     "userPhone": "1234567890",
     //     "nickName": "圣诞节",
     //     "headImage": "http://news.sctv.com/cjxw/tzlc/201105/W020110516546892771012.jpg",
     //     "imSessionCount": 18,
     //     "imSessionOpenCount": 8,
     //     "orderCount": 12,
     //     "orderGoingCount": 2,
     //     "description": "谁的手机大量数据大可乐手机大可乐手机时间倒流开始几点开始谁的手机大量数据大可乐手机大可乐手机时间倒流开始几点开始",
     //     "status": "",
     //     "statusDesc": ""
     //   },
     //   {
     //     "userId": 2,
     //     "userPhone": "87654321",
     //     "nickName": "多少积分是",
     //     "headImage": "http://news.sctv.com/cjxw/tzlc/201105/W020110516546892771012.jpg",
     //     "imSessionCount": 44,
     //     "imSessionOpenCount": 54,
     //     "orderCount": 44,
     //     "orderGoingCount": 2,
     //     "description": "谁的手机几点流开始几点开始",
     //     "status": "",
     //     "statusDesc": ""
     //   },
     //   {
     //     "userId": 3,
     //     "userPhone": "kjhgfds",
     //     "nickName": "多少积分是",
     //     "headImage": "http://news.sctv.com/cjxw/tzlc/201105/W020110516546892771012.jpg",
     //     "imSessionCount": 10,
     //     "imSessionOpenCount": 10,
     //     "orderCount": 44,
     //     "orderGoingCount": 2,
     //     "description": "",
     //     "status": "",
     //     "statusDesc": ""
     //   },
     //   {
     //     "userId": 4,
     //     "userPhone": "asdfghh",
     //     "nickName": "多少积分是",
     //     "headImage": "http://news.sctv.com/cjxw/tzlc/201105/W020110516546892771012.jpg",
     //     "imSessionCount": 444,
     //     "imSessionOpenCount": 54,
     //     "orderCount": 44,
     //     "orderGoingCount": 2,
     //     "description": "",
     //     "status": "",
     //     "statusDesc": ""
     //   }
     // ]
    }

  }


</script>
<style scoped lang="less">
  .root-content {
    padding-top: 1.2rem;
  }

  .inputBox {
    background-color: #FFFFFF;
    text-align: center;
  }

  .inputBox-title {
    margin-top: 0.53333rem;
    margin-bottom: 0.26666rem;
  }

  .inputBox-input {
    width: 70%;
    height: 2rem;
    border: 1px #737373 solid;
    text-align: start;
    padding: 0.13333rem;
    box-sizing: border-box;
    margin-bottom: 0.53333rem;
    resize: none;
  }

  .inputBox-btn {
    border-top: 1px solid #737373;
    height: 1.2rem;
    position: relative;
  }

  .inputBox-btn div {
    float: left;
    width: 49.5%;
    height: 1.2rem;
    line-height: 1.2rem;
  }

</style>
