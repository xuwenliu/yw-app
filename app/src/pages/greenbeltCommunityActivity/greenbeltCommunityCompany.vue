<!--activityId companyId=c/e-->
<template>
  <div class="description">
    <dialog-window v-show="showApplyDialog" class="show-input-box">
      <div class="dialog-box-apply">
        <div class="dialog-box-apply-line C4 F4 dialog-box-apply-line-space" style="margin-top: 1rem;">
          <span>电话</span>
          <input type="tel" maxlength="11" v-model="result.reporterPhone" disabled placeholder="请输入您的电话">
        </div>
        <div class="dialog-box-apply-line C4 F4 dialog-box-apply-line-space">
          <span>姓名</span>
          <input type="text" maxlength="11" v-model="inputValueName" placeholder="请输入您的姓名">
        </div>
        <div class="dialog-box-apply-line C4 F4 dialog-box-apply-line-space">
          <span>小区名称</span>
          <input type="text" maxlength="11" v-model="inputValueVillage" placeholder="请输入您的小区名称">
        </div>

        <div class="dialog-box-apply-button F4" @click="clickListenerCommitApply">提交报名</div>

        <div class="dialog-box-apply-close" @click="showDialogApplyFunc(false)">
          <img src="../../assets/img/greenbelt/popup_close_ic.png"
               style="display: block; width: 0.33333rem;height: 0.33333rem;">
        </div>

      </div>


    </dialog-window>

    <!-- 微信下载提示 -->
    <div v-show="showWxtips" @click="showWxtips = false" class="wxTips">
      <div></div>
    </div>

    <div v-show="showSuccessApply" class="contractList-popshadow">
      <div class="contractList-popContainer">
        <div class="F2 C1  contractList-popTitle">报名成功</div>
        <div class="F4 contractList-popDesc">到店礼品券已发送到“我的优惠”
          报名后上传设计协议及施工合同金额页、
          签章页后即可参加活动，赢取5万大奖。
        </div>
        <div @click="showApplySuccessFun(false)" class="F3 bt1 contractList-popButton">知道了</div>
      </div>
    </div>


    <TopHeader><span @click="goBack"></span>{{result.simpleName}}
    </TopHeader>
    <div class="content bg7">

      <!--公司基本信息-->
      <div style="display: flex;align-items: center;flex-direction: column" class="bg0 bottom-space">
        <img :src="result.logo"
             style="width: 2.53333rem;height: 2.53333rem;border-radius: 50%;margin-top: 0.53333rem;border: solid #e6e6e6 1px"/>

        <span class="C1 F2" style="text-align: center; width: 5.41333rem;margin-top: 0.2rem">{{result.name}}</span>
        <div class="C4 F5" style="display: flex;flex-direction: column;align-items: center;padding: 0.2rem 0;">
          <div id="desc-box"
               style="padding: 0 0.563333rem;text-align: center; " :class="{'hide-desc':btnImgIndex == 0 && inited}">
            {{result.description}}
          </div>
          <img v-show="showCollapseBtn" :src="btnImgs[btnImgIndex]" @click="expand"
               style="width: 0.4rem;height: 0.2rem;margin-top: 0.2rem"/>
        </div>
      </div>

      <!--公司展示-->
      <div class="bg0 bottom-space" @click="clickListenerCompanyShow">
        <div
          style="height: 1.4666rem;display: flex;padding: 0 0.53333rem;justify-content: space-between;align-items: center">
          <span class="F2 C1">公司展示</span>
          <img v-if="share!=1" class="more-arrow" src="../../assets/img/more_ic@2x.png"/>
        </div>
        <img style="width: 100%;display: block" :src="result.cover" alt="">
      </div>


      <!--公司宣传-->
      <div class="bg0 bottom-space">
        <img :src="result.companyPic" style="width: 100%;display: block">
        <p class="F4 C1" style="padding: 0.53333rem">{{result.companyWord}}</p>
      </div>

      <!--公司作品-->
      <div class="bg0 bb1" v-if="result.cases">
        <div
          style="height: 1.4666rem;display: flex;padding: 0 0.53333rem;justify-content: start;align-items: center">
          <i style="width: 0.08rem;height: 0.4rem;background-color: #DFAF7D;margin-right: 0.2rem"></i>
          <span class="F4 C1">公司作品</span>
        </div>
        <ul>
          <li v-for="(item,index) in result.cases" style="display: flex;flex-direction: column;position: relative"
              @click="clickListenerCase(item.caseId)">
            <!--{{result.cases[0].caseCover}}-->
            <img :src="item.caseCover" style="height: 8.29333rem;width: 100%;display: block;">
            <div
              v-if="item.tag"
              class="F5 C0"
              style="line-height: 0.4rem; padding: 0.1rem;box-sizing: border-box; display: flex;text-align: center;align-items: center;justify-content: center; width:1.4rem;height: 1.4rem;position: absolute; top: 0.4rem;right: 0.4rem;background: url('http://osz2pnx97.bkt.clouddn.com/work_tag_bg.png') no-repeat ;background-size: 100% 100%">
              {{item.tag}}
            </div>

            <div v-if="item.has720" style="position: absolute;bottom: 1.46666rem;right: 0.4rem">
              <img src="../../assets/img/greenbelt/work_details_720_play_ico.png"
                   style="width: 2rem">
            </div>
            <div
              style="display: flex;height: 1.46666rem; align-items: center;justify-content: space-between;padding: 0 0.53333rem;">
              <span class="F4 C1">{{item.caseName}}</span>
              <span class="F7" style="color: #848484">{{item.style}}/{{item.houseType}}/{{item.houseArea}}m²</span>
            </div>
          </li>
        </ul>
      </div>


      <!--在线报名-->
      <div
        class="bg0"
        style="height: 1.4666rem;display: flex;justify-content: center;align-items: center">

        <span
          @click="clickListenerApply"
          style="width: 6.64rem;height: 0.96rem;display: flex;align-items: center;justify-content: center;color: #FFFFFF;background-color: #DFAF7D"
          class="F3">{{bottomButtonText}}</span>
      </div>

    </div>
  </div>
</template>

<script>
  import TopHeader from '../../components/Header'
  import $ from "jquery"
  import DialogWindow from '../../components/DialogWindow'
  import {MessageBox} from 'mint-ui';


  export default {
    name: 'description',
    components: {
      TopHeader,
      DialogWindow
    },
    data() {
      return {
        activityId: this.$route.query.activityId,
        companyId: this.$route.query.companyId,
        userType: this.$route.query.userType,
        share: this.$route.query.share,
        inputValueName: '',
        inputValueVillage: '',
        showSuccessApply: false,
        showWxtips: false, //APP外微信打开提示去游览器打开
        showAppBesides: false, //APP外打开是否显示
        bottomButtonText: "在线报名",
        showApplyDialog: false,
        noButton: "",
        btnTxtCollapse: "",
        btnTxtExpand: "",
        showCollapseBtn: false,
        btnImgs: [require("../../assets/img/greenbelt/work_yctd_info_close_ico@2x.png"), require("../../assets/img/greenbelt/work_yctd_info_open_ico@2x.png")],
        btnImgIndex: 0,
        inited: false,
        bottomButtonText: '',
        result: {},
      }
    },
    created() {
      this.$set(this.result, 'btnTxt', this.btnTxtCollapse);

      if (this.share == 1) {
        this.getData()
      } else {
        invokeNative({
          "code": window.jsBridge.CODE_GET_LOGIN_STATUS,
          "callback": "isLogin"
        });
        window.isLogin = (value) => {
          var value = window.atob(value);
          var res = JSON.parse(value);
          this.inApp = true;
          if (res.data == 1) {
            getAccountToken("loginCallBack")
          } else {
            this.getData()
          }
        };

        var that = this;
        window.loginCallBack = function () {
          that.getData()
        };
      }

      console.log(`companyid` + this.companyId * 1);
    },
    mounted() {
      this.isOpenInApp();
    },
    methods: {


      /**
       * 关闭当前页面
       */
      goBack() {
        this.$router.go(-1)
      },

      /**
       * 查看案例
       */
      clickListenerCase(caseId) {
        invokeNative({
          "code": window.jsBridge.CODE_OPEN_CASE_DETIAL, "data": caseId
        })
      },


      /**
       * 显示报名成功弹窗
       */
      showApplySuccessFun(show) {
        this.showSuccessApply = show;
        if (!show) {
          this.getData()
        }
      },


      /**
       * 立即提交报名
       */
      clickListenerCommitApply() {

        if (!validRule.realname.test(this.inputValueName)) {
          this.toast("请输入真实姓名");
          return false
        }
        if (!validRule.backname.test(this.inputValueVillage) || this.inputValueVillage.length > 11 || this.inputValueVillage.length < 2) {
          this.toast("输入2-11个字符的小区名");
          return false
        }


        this.$http.post(this.getHost() + `/activity/${this.activityId}/${this.companyId}/enroll`, {
          "phone": this.result.reporterPhone,
          "name": this.inputValueName,
          "buildingName": this.inputValueVillage,
        }).then((res) => {
          console.log(JSON.stringify(res));
          if (res.body.succ) {
            this.showDialogApplyFunc(false);
            this.showApplySuccessFun(true);
          } else {
            didApiError(res)
          }
        })

      },

      isOpenInApp() {
        //app外打开
        this.showShade = true;
        this.showAppBesides = true;

        // //app内打开
        // invokeNative({
        //   "code": window.jsBridge.CODE_GET_LOGIN_STATUS,
        //   "callback": "returnisLogin"
        // });
        // window.returnisLogin = (value) => {
        //   this.showShade = false;
        //   this.showAppBesides = false;
        //   var value = window.atob(value);
        //   var res = JSON.parse(value);
        //   if(res.data == 1) { //app内登录了
        //     this.getMaterialInfo();
        //   } else { //app内未登录
        //     invokeNative({ "code": window.jsBridge.CODE_LOGIN });
        //   }
        // }

      },

      /**
       * [wxTips 微信提示从浏览器打开]
       * @return {[type]} [description]
       */
      wxTips() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        // 判断是否为微信
        var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
        // 是否在微信内打开
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          this.showWxtips = true;
          return false;
        }
        // 是否在微博内打开
        if (ua.match(/WeiBo/i) == "weibo") {
          this.showWxtips = true;
          return false;
        }
        //Android接口
        if (isAndroid) {
          window.location.href = "http://o7zlnyltf.bkt.clouddn.com/app-ywmj-release.apk";
        }
        //iOS接口
        if (isiOS) {
          window.location.href = "http://itunes.apple.com/us/app/id1133878484";
        }
      },


      getHost() {
        var host;
        if (this.userType == 'c') {
          host = window.Host.customer
        } else {
          host = window.Host.employee;
        }
        return host;
      },


      /**
       * toast消息
       */
      toast(msg) {
        invokeNative({"code": window.jsBridge.CODE_TOAST, "data": msg});
      },

      /**
       * 是否显示报名弹窗
       */
      showDialogApplyFunc(show) {
        this.showApplyDialog = show;
        if (!show) {
          this.inputValueName = '';
          this.inputValueVillage = '';
        }


      },


      /**
       * 去公司图片列表
       */
      clickListenerCompanyShow() {
        invokeNative({
          "code": window.jsBridge.CODE_GO_COMPANY_PICTURE, "data": this.companyId * 1
        })
      },

      expand() {
        // this.$refs.noButton.handleClick();

        // if (this.result.btnTxt == this.btnTxtCollapse) {
        //   this.result.btnTxt = this.btnTxtExpand;
        // } else {
        //   this.result.btnTxt = this.btnTxtCollapse;
        // }

        if (this.btnImgIndex == 0) {
          this.btnImgIndex = 1
        } else {
          this.btnImgIndex = 0
        }


      },


      /**
       * 提交报名  & 上传合同
       */
      clickListenerApply() {

        if (this.share == 1) {
          MessageBox({
            message: '下载鹦鹉美家即可参与活动赢取现金大奖',
            showCancelButton: true,
            confirmButtonText: '立即下载',
            cancelButtonText: '再看看'
          }).then(action => {
            if (action == 'confirm') {
              this.wxTips();
            }
            console.log(action);
          });
          return
        }

        if (this.result.reporterId != 0) {
          this.$router.push({
            "name": "greenActivityContractList",
            query: {
              "reporterId": this.result.reporterId,
              "reporterState": this.result.reporterState,
              "share": this.share,
              "userType": this.userType
            }
          });
          return
        }


        invokeNative({
          "code": window.jsBridge.CODE_GET_LOGIN_STATUS,
          "callback": "isLogin"
        });
        window.isLogin = (value) => {
          var value = window.atob(value);
          var res = JSON.parse(value);
          if (res.data == 1) {

            this.getDataForFunc(this.showDialogApplyFunc(true));
          } else {
            invokeNative({"code": window.jsBridge.CODE_LOGIN});
          }
        };
      },

      /**
       * 获取页面数据
       */
      getData() {
        this.$http.get(window.Host.customer + `/activity/${this.activityId}/company/${this.companyId}`).then(res => {
          console.log(res);
          if (res.body.succ) {
            this.onResponseData(res)
          } else {
            didApiError(res)
          }
        })
      },


      onResponseData(res) {
        this.result = res.body.data;
        this.$nextTick(() => {
          // $(".getSubsidy_depicts").find("p").addClass("en-cut-txt");
          // $(".getSubsidy_depicts").find("p img").css({
          //   "width": "100%"
          // });
          var h = $("#desc-box").innerHeight();
          console.log('xxxxxxxxxxx');
          console.log(h);
          var rr = h / 75;
          console.log(rr);
          if (rr < 0.76) {
            this.showCollapseBtn = false;
          } else {
            this.showCollapseBtn = true;
          }
          this.inited = true;
        });
        if (this.result.reporterId == 0) {
          this.bottomButtonText = '在线报名'
        } else if (this.result.reporterId == 2) {
          this.bottomButtonText = '查看照片'
        } else {
          this.bottomButtonText = '上传协议/合同照片'
        }
      },


      getDataForFunc(f) {
        this.$http.get(window.Host.customer + `/activity/${this.activityId}/company/${this.companyId}`).then(res => {
          console.log(res);
          if (res.body.succ) {
            this.onResponseData(res);
            if (f != undefined) {
              f();
            }
          } else {
            didApiError(res)
          }
        })
      }

    }
  }
</script>
<style scoped lang="less">


  .bottom-space {
    margin-bottom: 0.4rem;
  }

  .company-item {

  }

  .dialog-box-apply {
    padding-left: 0.76rem;
    padding-right: 0.93333rem;
    padding-bottom: 0.76rem;
    background-color: #FFFFFF;
    position: relative;
    box-sizing: border-box;
  }

  .dialog-box-apply-close {
    position: absolute;
    padding: 0.2rem;
    top: 0;
    right: 0;

  }

  .dialog-box-apply-button {
    height: 1.17333rem;
    background-color: #DFAF7D;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dialog-box-apply-line {
    height: 1.17333rem;
    background-color: #f2f2f2;
    display: flex;
    align-items: center;
  }

  .dialog-box-apply-line span {
    margin-right: 0.26666rem;
    width: 1.6rem;
    margin-left: 0.33333rem;
  }

  .dialog-box-apply-line input {
    flex-grow: 2;
    background-color: transparent;
  }

  .dialog-box-apply-line-space {
    margin-bottom: 0.4rem;
  }

  .contractList-popshadow {
    display: flex;
    background-color: rgba(0, 0, 0, 0.65);
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .contractList-popContainer {
    border-radius: 0.08rem;
    width: 8.32rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .contractList-popButton {
    color: #DFAF7D;
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
  }

  .contractList-popTitle {
    margin-top: 1rem;
    margin-bottom: 0.3rem;
  }

  .contractList-popDesc {
    margin-bottom: 0.5rem;
    padding: 0 0.4rem;
  }

  .hide-desc {
    word-break: break-all;

    text-overflow: ellipsis;

    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/

    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/

    -webkit-line-clamp: 3; /** 显示的行数 **/

    overflow: hidden; /** 隐藏超出的内容 **/
  }

</style>
