<template>
  <div>
    <title>主材补贴邀请</title>
    <div>
      <div class="material-invite-first-part">
        <img :src="imgInviteInfo"/>
        <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="phoneNumber">
        <button @click="clickCommitButton">提交</button>
      </div>
      <div class="materialBands">
        <div class="materialBandsTitleView">
          <div class="materialBandsTitleBoxView">
            <span class="materialBandsTitleTextPosition">查看主材补贴品牌</span>
          </div>
        </div>
        <div class="materialBandsListView">
          <ul>
            <li v-for="(item,index) in brandImgList">
              <img :src="item"/>
            </li>
          </ul>
        </div>
        <div class="materialBandsBottom">
          <span>陆续加入中...</span>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="material-Invite-Shadow"  v-if="showPopView">
      <div class="material-invite-regist-box">
        <div class="material-invite-close-parent">
          <div class="material-invite-close" @click="closePopView"><img :src="imgShareClose"/></div>
        </div>
        <div class="C1 material-invite-regist-title" v-show="isRegistPopView">马上注册</div>
        <div class="C1 material-invite-regist-title" v-show="!isRegistPopView">马上加入</div>
        <div class="C1 F6 material-invite-regist-text-detail">已向您的手机 <span
          style="font-weight: bold">{{phoneNumber}}</span> 发送验证码
        </div>
        <div class="input-Phone-Div" v-show="isRegistPopView">
          <input class="input-Phone F4 C5" type="password" placeholder="设置8-20位数字或字母密码" v-model.trim="password">
        </div>
        <div class="input-Phone-Code">
          <input class="input-Code F4 C5" type="text" placeholder="输入验证码" v-model.trim="code">
          <Countdown class="input-code-resend" :start='start' @countDown ='start=false' @click.native='sendCode'></Countdown>
        </div>
        <div class="invite-commit-button" @click="codeCommit"
             :class="isRegistPopView?'invite-commit-button-padding34':'invite-commit-button-padding56'">
          <button class="F4">提交</button>
        </div>
        <div class="F6 c1 invite-accept-agreement" v-show="isRegistPopView" >
          <img @click="acceptAgreement" :src="imgCurrentChoosed"/> <span @click="showAgreement">我同意《用户协议》</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Countdown from '../../../components/Countdown'
  import '../../../assets/css/material-invite.css'

	import $ from "jquery"
  import {} from '../../../assets/js/wxshare'

  export default {
    name: 'inviteMaterial',

    components:{
        Countdown
    },
    data () {
      return {

        start : false,
        firstStart:false,

        cityId:0,
        emplyeeId:0,
        phoneNumber:'',
        code: '',
        password: '',

        showPopView: false,
        isRegistPopView: true,
        isAgreementChoosed: false,
        imgCurrentChoosed: require("../../../assets/img/share/share_agree_box@2x.png"),
        imgNoAcceptAgreement: require("../../../assets/img/share/share_agree_box@2x.png"),
        imgAcceptAgreement: require("../../../assets/img/share/share_agree_right_box@2x.png"),
        imgInviteInfo: require("../../../assets/img/material/zcbt_invite_info@2x.png"),
        imgShareClose: require("../../../assets/img/share/share_close_ic@2x.png"),

        brandImgList: [ require("../../../assets/img/share/brands/abb.jpg"),
                        require("../../../assets/img/share/brands/boshi.jpg"),
                        require("../../../assets/img/share/brands/dinggu.jpg"),
                        require("../../../assets/img/share/brands/jiusheng.jpg"),
                        require("../../../assets/img/share/brands/kangmeishi.jpg"),

                        require("../../../assets/img/share/brands/lianhelihua.jpg"),
                        require("../../../assets/img/share/brands/luolannixi.jpg"),
                        require("../../../assets/img/share/brands/mokeli.jpg"),
                        require("../../../assets/img/share/brands/oushengnuo.jpg"),
                        require("../../../assets/img/share/brands/qiangweijuping.jpg"),

                        require("../../../assets/img/share/brands/shaweier.jpg"),
                        require("../../../assets/img/share/brands/silian.jpg"),
                        require("../../../assets/img/share/brands/tingxihaian.jpg"),
                        require("../../../assets/img/share/brands/yingtushicai.jpg")]
      }
    },

    created(){
      this.getParameterFromHash(location.hash);


    },

    mounted(){

      var api = window.Host.customer + "/case/app/ticket",
        requestUrlData =window.location.href.split("#")[0],
        geturl=window.location.href,
        shareInfo ={
          title:"主材补贴 专享特惠",
          link:geturl,
          desc:"最低成交价基础上的额外补贴",
          imgUrl:"http://o7zlnyltf.bkt.clouddn.com/share-material.jpg?imageView2/1/w/120"
        };

      //vue 通用分享
      var weixin = new WeiXin({api:api,requestUrlData:requestUrlData,shareInfo:shareInfo});
      weixin.share();

    },
    methods: {
      goBack() {
        window.close();
      },
      sendCode (value) {
        if (!this.start) {
          var codeSource = 0;
          if (this.isRegistPopView) {
            codeSource = 1;
          } else  {
            codeSource = 11;
          }
          this.$http.post(window.Host.customer+`/user/sendSmsCode?phone=${this.phoneNumber}&&source=${codeSource}`).then((res)=>{
//          console.log(res);
            /*请求成功后根据返回值弹出对应的框*/
            if(res.body.succ){
              this.start = true;
            } else {
              this.toastAlterMessage(res.body.message);
            }
          },(res)=>{
            this.toastAlterMessage("网络异常");
          });
        }
      },

      /**
       * 弹出消息
       *
       * */
      toastAlterMessage(message) {
        alert(message);
      },
      /**
       *
       * 主页面的确认按钮点击
       *
       * */
      clickCommitButton() {
      	var u = navigator.userAgent;
    		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    		if(isiOS){
    			$("body").css({"position":"fixed","width":"100%"});
    		}

//      console.log("主页面按钮");
//      console.log(this.phoneNumber);
//      console.log(this.cityId);
//      console.log(this.employeeId);
//      console.log(window.Host.customer);

        if (validRule.phone.test(this.phoneNumber)){
          this.$http.post(window.Host.customer+`/share/agreeInvite?phone=${this.phoneNumber}&&cityId=${this.cityId}&employeeId=${this.employeeId}`).then((res)=>{
//          console.log(res);
            /*请求成功后根据返回值弹出对应的框*/
            if(res.body.succ){
                if (res.body.data.isCustomer) {
                  this.isRegistPopView = false;
                } else {
                  this.isRegistPopView = true;

                }
                this.showPopView = true;
                this.start = true;
            } else {
              this.toastAlterMessage(res.body.message);
            }
          },(res)=>{
            this.toastAlterMessage("网络异常");
          });
        } else {
          this.toastAlterMessage("请输入正确的电话号码");
        }
      },
      /**
       * 弹出框的确认按钮点击
       *
       * */
      codeCommit() {

        if (this.isRegistPopView) {
          this.registerAction();
        } else {
          this.joinAction();
        }
      },
      /**
       * 未注册用户注册
       * */
      registerAction() {
        if (!this.isAgreementChoosed) {
          this.toastAlterMessage('请同意用户协议');
          return;
        }
        ;
        if (!validRule.password.test(this.password)) {
          this.toastAlterMessage('请输入正确的密码');
          return;
        }
        if (!validRule.phonecode.test(this.code)) {
          this.toastAlterMessage("请输入正确的验证码");
          return;
        }
        var rsaPassword = this.password;
        rsaPassword = Rsa(rsaPassword);
        this.$http.post(window.Host.customer+`/share/register`,
          {
            "employeeId": this.employeeId,
            "cityId": this.cityId,
            "phone": this.phoneNumber,
            "password": rsaPassword,
            "smsCode": this.code
          }).then((res)=>{
//        console.log(res);
          /*v1.10.0 数据埋点 ACTION_RESOURCE_MATERIAL_SUBSIDY(21, 2, " H5-主材补贴"),*/
            var data = getEquipmentInfo();/*getEquipmentInfo()方法在hybrid.js里面*/
            data.action=dataLog.ACTION_REGISTER;//3 注册
            data.actionResource=dataLog.ACTION_RESOURCE_MATERIAL_SUBSIDY;//21
            data.actionResult=res.data.stateCode;
            this.postDataLog(data);

          /*请求成功后根据返回值弹出对应的框*/
          if (res.body.succ) {
            this.showPopView = false;
            $("body").css("position","relative")
            this.$router.push({"name": "download"});

          } else {
            this.toastAlterMessage(res.body.message);
          }
        },(res)=>{
          this.toastAlterMessage("网络异常");
        });
      },
      /*v1.10.0数据埋点请求*/
      postDataLog(data){
//      console.log(data);
        var api = window.Host.customer+"/datalog/log"
        // https://devcustomer.yingwumeijia.com:443/{version}/datalog/log
        this.$http.post(api,data).then((res) => {
//        console.log(res)
          if(res.data.succ){
            console.log('H5-主材补贴-注册');
          }
        })
    },
      /**
       * 用户加入主材补贴
       *
       * */
      joinAction() {
        if (!validRule.phonecode.test(this.code)) {
          this.toastAlterMessage("请输入正确的验证码");
          return;
        }

        this.$http.post(window.Host.customer+`/share/join?phone=${this.phoneNumber}&&code=${this.code}&&cityId=${this.cityId}&employeeId=${this.employeeId}`).then((res)=>{
//        console.log(res);
          /*请求成功后根据返回值弹出对应的框*/
          if (res.body.succ) {
            this.showPopView = false;
            this.$router.push({"name": "download"});
            $("body").css("position","relative")
          } else {
            this.toastAlterMessage(res.body.message);
          }
        },(res)=>{
          this.toastAlterMessage("网络异常");
        });
      },
      resendCode() {

        this.$http.post(window.Host.customer+`/share/join?phone=${this.phoneNumber}&&code=${this.code}&&cityId=${this.cityId}&employeeId=${this.employeeId}`).then((res)=>{
//        console.log(res);
          /*请求成功后根据返回值弹出对应的框*/
          if(res.body.succ){
            this.showPopView = false;
          } else {
            this.toastAlterMessage(res.body.message);
          }
        },(res)=>{
          this.toastAlterMessage("网络异常");
        });
      },
      /**
       * 关闭弹出框
       * */
      closePopView() {
        this.showPopView = false;
				$("body").css("position","relative")
      },
      /**
       * 同意用户协议
       * */
      acceptAgreement() {
        this.isAgreementChoosed = !this.isAgreementChoosed;
        if (this.isAgreementChoosed) {
          this.imgCurrentChoosed = this.imgAcceptAgreement;
        } else {
          this.imgCurrentChoosed = this.imgNoAcceptAgreement;
        }
      },
      /**
       *
       * 跳转用户协议页面
       *
       * */
      showAgreement() {
        this.$router.push({"name": "userAgreement"});
      },
      /**
       *
       * 从链接获取参数
       * */
      getParameterFromHash(hash) {
//      console.log(hash);
        if (hash.indexOf("?") != -1) {
          var arrayParameters = hash.split("?")[1];
          this.employeeId = arrayParameters.split("&")[0].split("=")[1];
          this.cityId = arrayParameters.split("&")[1].split("=")[1];
//        console.log(this.employeeId);
//        console.log(this.cityId);
        }
      },
    }

  }
</script>
