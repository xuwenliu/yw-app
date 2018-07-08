<!--#supervisionOrderDetailsForEmployee?orderId=13&?picType=1 1=监理合同，2=四方监管协议-->
<template>
  <div class="supervisionContract">
    <TopHeader class="noBorder">
      <div class="clickMe" @click="goBack"><span></span></div>
      <i>{{title}}</i>
    </TopHeader>
    <footer-bottom v-show="showUpLoadBtn">
      <div @click="upload" class="F3 C0">立即上传</div>
    </footer-bottom>
    <NoFile v-show="isShowNoPic">
      <img slot="bgimg" src="../../../../../assets/img/supervision/agreement_no_pic_ic@2x.png">
      <span slot="info">暂未上传图片</span>
    </NoFile>
    <!-- <PicView v-show="!isShowNoPic" :listImg="imgList"></PicView> -->
    <imgView v-show="!isShowNoPic" :smallImgArray="imgList" :isShowDelBtn="isShowDelBtn" :isShowBottom12="true"
             @returnImgArray="newImgArray"></imgView>
  </div>
</template>
<script>
  import TopHeader from '../../../../../components/Header'
  import NoFile from '../../../../../components/NoFile'
  import FooterBottom from '../../../../../components/Footer'
  import imgView from '../../../../../components/imgPreview'

  export default{
    name: 'supervisionSupervisionDetailsForEmployee',
    data(){
      return {
        orderId: 0,
        picType: 1,
        customer: false,
        isShowNoPic: false,
        postData: [],
        inow: 0,
        imgList: [
          // "http://o8nljewkg.bkt.clouddn.com/o_1botia7mi1g691hnc14071kg513ne1f.jpg?width=3565&height=5347"
          // 'http://covteam.u.qiniudn.com/ka2.jpg',
          // 'http://covteam.u.qiniudn.com/poster.png',
          // 'http://covteam.u.qiniudn.com/ka2.jpg',
          // 'http://covteam.u.qiniudn.com/poster.png',
        ],
        manager: 0,
        url: "",
        index: 0,
        empty: false,
        title: "",
        showUpLoadBtn: true,//上传按钮是否显示,
        isShowDelBtn: true,//图片预览下面的删除按钮是否显示
      }
    },
    components: {
      TopHeader,
      NoFile,
      FooterBottom,
      imgView
    },
    methods: {
      goBack(){
        // console.log("closeType:" + this.closeType);
        // this.$router.go(-1);
        invokeNative({"code": window.jsBridge.CODE_CLOSE});
      },
      upload(){
        //获取七牛token
        this.$http.get(window.Host.employee + "/upload/getToken").then((res) => {
          if (res.data.succ) {
            if (res.data.data) {
              var uploadToken = res.data.data;
              console.log(uploadToken);
              this.$router.push({"name": "upLoader", query: {"picMaxCount": 10, "uploadToken": uploadToken}})
            }
          }
        })
      },
      downLoadPictures() {
        console.log("================" + "downLoadPictures");
        this.$http.get(window.Host.employee + `/order/supervision/${this.orderId}/images`,
          {
            params: {
              "imageType": this.picType
            }
          }).then((res) => {
          console.log(JSON.stringify(res));
        if (res.data.succ) {
          this.showUpLoadBtn=res.data.data.allow;//是否显示上传按钮
          this.isShowDelBtn=res.data.data.allow;
            this.getArr = res.data.data.images || [];
            if (localStorage.successImgList) {
              console.log(localStorage.successImgList);
              var imgDelayData = JSON.parse(localStorage.successImgList);
              this.postData = this.getArr.concat(imgDelayData);
              this.uploadPictures(this.postData);
            } else {
              this.onResponeLoadPictures(this.getArr);
            }
          } else {
            didApiError(res);
          }
        })
      },
      onResponeLoadPictures(imgArray){
        if(imgArray&&imgArray.length!=0){
          this.isShowNoPic=false;
          this.imgList = imgArray;
        }else {
          this.isShowNoPic=true;
        }
      },
      uploadPictures(imgDelayData){
        console.log(this.postData);
        this.$http.post(window.Host.employee + "/order/supervision/images", {
          "orderId": this.orderId,
          "imageType": this.picType,
          "images": imgDelayData
        }).then(function (res) {
          if (res.body.succ) {
            this.onResponeLoadPictures(this.postData);
            console.log(this.postData)
            localStorage.removeItem("successImgList");
          } else {
            didApiError(res)
          }
        });
      },
      newImgArray(imgArr){
        console.log("----------" + imgArr);
        this.$http.post(window.Host.employee + "/order/supervision/images", {
          "orderId": this.orderId,
          "imageType": this.picType,
          "images": imgArr
        }).then((res) => {
          if (res.body.succ) {
            this.downLoadPictures();
          } else {
            didApiError(res)
          }
        });

      }
    },
    mounted(){
      if (this.$route.query.picType == 1) {
        this.title = "监理合同";
      } else {
        this.title = "四方监管协议";
      }
      this.orderId = this.$route.query.orderId * 1;
      this.picType = this.$route.query.picType * 1;
      this.downLoadPictures();
    }
  }

</script>