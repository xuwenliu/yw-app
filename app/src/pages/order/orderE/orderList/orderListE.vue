<template>
  <div>
    <div>
      <TopHeader class="clearfix">
        <div class="clickMe" @click="goBack"><span></span></div>
        我的订单
        <div class="createOrderDivCss C6 F3" v-show="!isHidenCreateButton" @click="toCreateOrder">创建订单</div>
      </TopHeader>
      <!--选项卡-->
      <div class="status bb1">
        <ul>
          <li v-for="(item,index) in status" @click="goTab(index)">
            <span class="F4 C1" :class="{'active':currentIndex==index}">{{item}}</span>
          </li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import TopHeader from '../../../../components/Header'

  export default {
    name: 'orderListE',
    components: {
      TopHeader
    },
    data () {
      return {
        isHidenCreateButton: false,
        status: ['设计订单', '施工订单', '监理订单'],
        currentIndex: 0
      }
    },
    methods: {
      goBack(){
        invokeNative({
          "code": window.jsBridge.CODE_CLOSE
        });
      },
      goTab(index){
        this.currentIndex = index;
        switch (index) {
          case 0:
            this.$router.replace({"name": "orderDesignList", query: {"orderType": 1}});
            break;
          case 1:
            this.$router.replace({"name": "orderProjectList", query: {"orderType": 2}});
            break;
          case 2:
            this.$router.replace({"name": "orderSupervisorList", query: {"orderType": 3}});
            break;
        }
      },
      toCreateOrder() {
        this.$router.push({"name": "createOrder", query: {"type": 2}})
      },
      checkEmplyeeInfo() {
        this.$http.get(window.Host.employee + `/employee/getEmployeeInfo`).then((res) => {
          console.log(res);
          if (res.status == 200) {
            if (res.body.data.employeeDto.userDetailType * 1 == 10 || res.body.data.employeeDto.userPhone == "18800000000") {
              this.isHidenCreateButton = true;
              this.status = ['设计订单', '施工订单', '监理订单']
            } else {
              this.isHidenCreateButton = false;
              this.status = ['设计订单', '施工订单']
            }
            goTab()
          } else {
            if (res.body.stateCode != 312) {
              this.showToast(res.body.message);
            }
          }
        }, (res) => {
          console.log(res);
        })
      },
      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
        });
      }
    },
    created(){
      this.goTab(0);
      this.checkEmplyeeInfo();
    }
  }
</script>

