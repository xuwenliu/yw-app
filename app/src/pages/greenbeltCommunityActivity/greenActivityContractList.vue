<template>
  <div class="description">
    <TopHeader><span @click="goBack"></span>协议/合同照片</TopHeader>

    <div v-show="isSucc" class="contractList-popshadow">
      <div class="contractList-popContainer">
        <div class="F2 C1  contractList-popTitle">上传成功</div>
        <div class="F4 contractList-popDesc">照片已成功上传，待客服审核通过即可参与</div>
        <div @click="goBack" class="F3 bt1 contractList-popButton">知道了</div>
      </div>
    </div>

    <div class="content bg7">
      <!--section I-->
      <div class="contract-list-section-header F5">设计协议</div>
      <div class="contract-list-item">
        <span class="contract-list-item-moneytitle F4">金额页</span>
        <div class="contract-list-item-image-content" @click="imageClicked(1)">
          <img :src="showImage1">
          <div v-show="noPassed" class="contract-list-item-updesc F4">{{buttonText}}</div>
        </div>
        <span v-show="noPassed" class="contract-list-item-desc F7">请照此图完整清晰的上传设计协议-金额页</span>
      </div>
      <div class="contract-list-item" style="margin-bottom: 0.8rem">
        <span class="contract-list-item-moneytitle F4">签章页</span>
        <div class="contract-list-item-image-content" @click="imageClicked(2)">
          <img :src="showImage2">
          <div v-show="noPassed" class="contract-list-item-updesc F4">{{buttonText}}</div>
        </div>
        <span v-show="noPassed" class="contract-list-item-desc F7">请照此图完整清晰的上传设计协议-签章页</span>
      </div>
      <!--secction II-->
      <div class="contract-list-section-header F5">施工合同</div>
      <div class="contract-list-item">
        <span class="contract-list-item-moneytitle F4">金额页</span>
        <div class="contract-list-item-image-content" @click="imageClicked(3)">
          <img :src="showImage3">
          <div v-show="noPassed" class="contract-list-item-updesc F4">{{buttonText}}</div>
        </div>
        <span v-show="noPassed" class="contract-list-item-desc F7">请照此图完整清晰的上传施工合同-金额页</span>
      </div>
      <div class="contract-list-item" :class="{ 'extend-Margin-Bottom': !noPassed }">
        <span class="contract-list-item-moneytitle F4">签章页</span>
        <div class="contract-list-item-image-content" @click="imageClicked(4)">
          <img :src="showImage4">
          <div v-show="noPassed" class="contract-list-item-updesc F4">{{buttonText}}</div>
        </div>
        <span v-show="noPassed" class="contract-list-item-desc F7">请照此图完整清晰的上传施工合同-签章页</span>
      </div>

      <!--button-->
      <div v-show="noPassed" class="contract-list-upbutton">
        <button @click="confirmUpload">确认上传</button>
      </div>


    </div>
  </div>
</template>

<script>
  import TopHeader from '../../components/Header'
  import {Progress} from 'mint-ui';
  import {MessageBox} from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import {Toast} from 'mint-ui';

  export default {
    name: 'greenActivityContractList',
    components: {
      TopHeader
    },
    data() {
      return {
        isSucc:false,
        reporterId: this.$route.query.reporterId,
        returnData: {
          "designMoney": "",
          "designSignature": "",
          "constructionMoney": "",
          "constructionSignature": "",
          "reporterState":0
        },
        isConstructionMoneyEdited:false,
        isConstructionSignatureEdited:false,
      }
    },

    computed: {
      baseUrl () {
        if (this.$route.query.userType != 'c') {
          return window.Host.employee;
        } else {
          return window.Host.customer;
        }
      },
      noPassed() {
        if (this.$route.query.share == 1 || this.$route.query.userType != 'c') return false;

        if (this.returnData.reporterState != 2) {
          return true;
        } else {
          return false;
        }
      },
      buttonText() {
        if (this.returnData.reporterState == 0) {
          return "点击上传";
        } else if (this.returnData.reporterState == 1) {
          return "重新上传";
        } else {
          return "";
        }
      },
      showImage1 () {
        return this.returnData.designMoney + '&imageView2/1/w/400';
      },
      showImage2 () {
        return this.returnData.designSignature + '&imageView2/1/w/400';
      },
      showImage3 () {
        return this.returnData.constructionMoney + '&imageView2/1/w/400';
      },
      showImage4 () {
        return this.returnData.constructionSignature + '&imageView2/1/w/400';
      },
    },
    created() {
      this.initPictureChoose();
      this.loadPictures();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      loadPictures() {
        this.$http.get(this.baseUrl + `/activity/${this.reporterId}/viewPic`).then((res) => {
          console.log(res);
          if (res.body.succ == true) {
            this.returnData = res.body.data;
          } else {
            if (res.body.stateCode != 312) {
              this.showToast(res.body.message);
            }
          }
        })
      },
      showToast(data){
        invokeNative({"code": window.jsBridge.CODE_TOAST, "data": data});
      },
      imageClicked (index) {
        console.log(`noPassed:`+this.noPassed);
        if (this.noPassed) {
          invokeNative({
            "code": window.jsBridge.CODE_GET_SINGLE_PHOTO,
            "callback": "greenActivityContract",
            "extra": index + '',
          })
        }
      },
      initPictureChoose() {
        var _this = this;
        window.greenActivityContract = function (value) {
          var res = utf8to16(base64decode(value));
          res = JSON.parse(res);
          var chooseIndex = res.extra * 1;
          switch (chooseIndex) {
            case 1:
              _this.returnData.designMoney = res.data;
                break;
            case 2:
              _this.returnData.designSignature = res.data;
              break;
            case 3:
              _this.isConstructionMoneyEdited = true;
              _this.returnData.constructionMoney = res.data;
              break;
            case 4:
              _this.isConstructionSignatureEdited = true;
              _this.returnData.constructionSignature = res.data;
              break;
            default:
                break;
          }
        }
      },
      confirmUpload() {

        if (this.returnData.reporterState == 0 && (!this.isConstructionSignatureEdited || !this.isConstructionMoneyEdited)) {
          this.showToast("请上传施工合同");
          return;
        }
        Indicator.open();
        this.$http.post(window.Host.customer + `/activity/${this.reporterId}/submitPic`,
          {
            "designMoney": this.returnData.designMoney,
            "designSignature": this.returnData.designSignature,
            "constructionMoney": this.returnData.constructionMoney,
            "constructionSignature": this.returnData.constructionSignature,
          }).then((res) => {
          Indicator.close();
          console.log(res);
          if (res.body.succ) {
              this.isSucc = true;
          } else {
            if (res.body.stateCode != 312) {
              this.showToast(res.body.message);
            }
          }
        }, error => {
          Indicator.close();
        });
      },
    }
  }
</script>
<style scoped lang="less">

  .contract-list-section-header {
    height: 0.8rem;
    background-color: #DFAF7D;
    line-height: 0.8rem;
    padding-left: 0.426666666rem;
    color: white;
  }

  .contract-list-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .contract-list-item-moneytitle {
    margin-top: 0.5866666666rem;
    color: #282828;
    margin-bottom: 0.266666666rem;
  }

  .contract-list-item-desc {
    margin-top: 0.48rem;
    color: #282828;
    margin-bottom: 0.266666666rem;
  }

  .contract-list-item-updesc {
    width: 100%;
    height: 0.933333333rem;
    line-height: 0.933333333rem;
    position: absolute;
    bottom: 0rem;
    text-align: center;
    color: white;
    background-color: black;
    opacity: 0.7;
  }

  .contract-list-item-image-content {
    width: 5.24rem;
    height: 7.4133333rem;
    background-color: white;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .contract-list-upbutton {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    button {
      width: 7.013333333rem;
      height: 1.1733333333rem;
      margin-top: 1.36rem;
      margin-bottom: 0.9066666666rem;
      background-color: #DFAF7D;
      color: white;
      font-size: 0.3733333333rem;
    }
  }

  .extend-Margin-Bottom {
    margin-bottom: 1rem;
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
  }

</style>
