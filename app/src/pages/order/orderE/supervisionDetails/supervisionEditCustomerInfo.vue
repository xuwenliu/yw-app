<template>
  <div>

    <footer-bottom
      v-show="true">
      <div @click="confirm" class="F3 C0">
        确认
      </div>
    </footer-bottom>
    <TopHeader>
      <div class="clickMe" @click="goBack"><span></span></div>
      客户基本信息
    </TopHeader>
    <div class="content btm">
      <ul class="supervision-e-edit-layout F3 C1">
        <li>
          <div>
            <span>客户姓名</span>
            <input style="flex-grow: 2" maxlength="10" v-model.trim="resData.userName">
          </div>
        </li>
        <li>
          <div><span>客户性别</span>
          </div>
          <select v-model="resData.genderDesc" style="flex-grow: 2">
            <option v-for="item in genderDescArray" :value="item">{{item}}
            </option>
          </select>
          <img src="../../../../assets/img/supervision/order_details_small_arrow@2x.png" class="supervision-e-arrow">
        </li>
        <li>
          <div><span>客户电话</span><span>{{resData.userPhone}}</span></div>
        </li>
        <li>
          <div><span>所在地区</span></div>
          <span class="F3" style="flex-grow: 2" :class="{'C4':!chooseAddressAreaDesc}"
                @click="chooseAddress">{{chooseAddressAreaDesc ? chooseAddressAreaDesc : "选择省市"}}</span>
          <img src="../../../../assets/img/supervision/order_details_small_arrow@2x.png" class="supervision-e-arrow">
        </li>
        <li>
          <div><span>楼盘名称</span></div>
          <input style="flex-grow: 2" maxlength="50" v-model.trim="resData.buildingName" placeholder="最多50个字符">
        </li>
        <li>
          <div><span>房屋面积</span><input type="number" v-model.trim="resData.houseArea" placeholder="0.00">
            <span>m²</span>
          </div>
        </li>
        <li>
          <div><span><i style="letter-spacing: 2em">房</i>型</span></div>

          <select v-model="checkedHouseType" style="flex-grow: 2" :class="{'C4':!checkedHouseType}">
            <option value="" v-show="resData.houseTypeDesc" disabled class="C4">选择房型</option>
            <option v-for="item in houseTypeArray" :value="item.code">{{item.desc}}
            </option>
          </select>
          <!--<span class="F3" style="flex-grow: 2" :class="{'C4':!chooseAddressArea}" @click="chooseHouseType">选择房型</span>-->
          <img src="../../../../assets/img/supervision/order_details_small_arrow@2x.png" class="supervision-e-arrow">
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

  import '../../../../assets/css/supervisionE-order-detail.css'
  import TopHeader from '../../../../components/Header'
  import FooterBottom from '../../../../components/Footer'

  export default{
    name: "supervisionEditCustomerInfo",
    components: {
      TopHeader,
      FooterBottom
    },
    data(){
      return {
        orderId: 0,
        imageUrl: "",
        isShow: false,
        checkedHouseType: "",
        resData: {},
        chooseAddressAreaDesc: "",
        genderDescArray: ["保密", "男", "女"],
        houseTypeArray: []
      }
    },
    methods: {

      goBack(){
        this.$router.go(-1);
      },

      toastMsg(msg){
        invokeNative({"code": window.jsBridge.CODE_TOAST, "data": msg})
      },

      /**
       *
       * 选择地址
       */
      chooseAddress(){
        var addressData = {
          "province": {
            "name": "四川",
            "code": 11
          },
          "city": {
            "name": "成都",
            "code": 22
          },
          "area": {
            "name": "高新区",
            "code": 33
          }
        };
        if (this.resData.areaLevelDto) {
          var areaLevelDto = this.resData.areaLevelDto;
          addressData.province.name = areaLevelDto.levelOneName;
          addressData.province.code = areaLevelDto.buildingLevelOne;
          addressData.city.name = areaLevelDto.levelTwoName;
          addressData.city.code = areaLevelDto.buildingLevelTwo;
          addressData.area.name = areaLevelDto.levelThreeName;
          addressData.area.code = areaLevelDto.buildingLevelThree;
        } else {
          addressData = null;
        }
        invokeNative({
          "code": window.jsBridge.CODE_CHOOSE_ADRESS,
          "data": addressData,
          "callback": "addressInfoCallBack"
        })
      },

      /**
       *
       * 选择房型
       */
      chooseHouseType(){

      },


      /**
       *
       * 确认修改
       */
      confirm(){

        if (this.resData.userName.length < 2) {
          invokeNative({
            "code":window.jsBridge.CODE_TOAST,
            "data":"请输入2~10个字符"
          });
          return;
        }

        console.log("房屋输入面积："+this.resData.houseArea);
        if (this.resData.houseArea) {
          if (!validRule.price.test(this.resData.houseArea)) {
            invokeNative({
              "code":window.jsBridge.CODE_TOAST,
              "data":"房屋面积请输入最多两位小数的数字"
            });
            return;
          } else if (this.resData.houseArea > 100000 || this.resData.houseArea <= 0) {
            invokeNative({
              "code":window.jsBridge.CODE_TOAST,
              "data":"房屋面积大于0，小于等于100000"
            });
            return;
          }
        }

        this.resData.gender = this.genderDescArray.indexOf(this.resData.genderDesc);
        this.resData.houseType = this.checkedHouseType;


        this.$http.post(window.Host.employee + `/order/${this.orderId}/customer`, this.resData).then(function (res) {
          console.log(res);
          if (res.body.succ) {
            this.goBack()
          } else {
            didApiError(res)
          }
        }, function (error) {
          this.toastMsg("网络异常")
        })
      },

      /**
       *
       * 获取客户信息数据
       */
      getData(){
        this.$http.get(window.Host.employee + `/order/${this.orderId}/customer`).then(function (res) {
          if (res.body.succ) {
            this.resData = res.body.data;
            this.checkedHouseType = this.resData.houseType;
            var areaLevelDto = this.resData.areaLevelDto;
            this.chooseAddressAreaDesc = areaLevelDto.levelOneName + areaLevelDto.levelTwoName + areaLevelDto.levelThreeName;
          } else {
            didApiError(res)
          }
        }, function (error) {
          this.toastMsg("网络异常");
        })
      },


      /**
       *
       * 获取房型枚举数组
       */
      getHouseArray(){
        this.$http.get(window.Host.employee + `/common/enum?enumType=1`).then(function (res) {
           console.log(JSON.stringify(res));
          if (res.body.succ) {

            this.houseTypeArray = res.body.data;
            console.log(this.houseTypeArray);

          } else {
            didApiError(res)
          }
        }, function (error) {
          console.log(JSON.stringify(error));
          this.toastMsg("网络异常");
        })
      }
    },
    created(){

      this.orderId = this.$route.query.orderId;
      this.getData();
      this.getHouseArray();

//      this.resData = {
//        "userId": 0,
//        "userName": "尼古拉斯",
//        "gender": 1,
//        "genderDesc": "男",
//        "userPhone": "1388888888888",
//        "buildingName": "",
//        "houseArea": 0,
//        "houseType": 0,
//        "houseTypeDesc": "别墅",
//        "areaId": 0,
//        "areaLevelDto": {
//          "buildingLevelOne": 0,
//          "levelOneName": "",
//          "buildingLevelTwo": 0,
//          "levelTwoName": "",
//          "buildingLevelThree": 0,
//          "levelThreeName": ""
//        }
//      };
      var that = this;
      /**
       *
       * 选择地址的回调
       */
      window.addressInfoCallBack = function (value) {

        var res = utf8to16(base64decode(value));
        res = JSON.parse(res);
        var data = res.data;
        that.chooseAddressAreaDesc = data.province.name + data.city.name + data.area.name;
        that.resData.areaId = data.area.code;
        console.log(that.chooseAddressAreaDesc)
      }
    }
  }
</script>
