<!--?source=1-->
<template>
  <div>
    <div>
      <TopHeader class="clearfix" style="border-bottom: 0">
        <div class="clickMe" @click="goBack"><span></span></div>
        我的拼团
        <div class="createOrderDivCss C6 F3" v-show="!source" @click="clickListenerMoreCroupBooking">更多拼团
        </div>
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
  import TopHeader from '../../../components/Header'

  export default {
    name: 'groupBookingMineList',
    components: {
      TopHeader
    },
    data () {
      return {
        isHidenCreateButton: false,
        source: this.$route.query.source,
        status: ['进行中', '已结束'],
        currentIndex: 0
      }
    },
    methods: {
      goBack(){
        if (this.source) {
          this.$router.go(-1)
        } else {
          invokeNative({
            "code": window.jsBridge.CODE_CLOSE
          });
        }
      },
      goTab(index){
        this.currentIndex = index;
        switch (index) {
          case 0:
            this.$router.replace({name: "groupBookingMineListUnderway", query: {state: 1}});
            break;
          case 1:
            this.$router.replace({name: "groupBookingMineListFinished", query: {state: 2}});
            break;
        }
      },
      /**
       * 更多拼团
       */
      clickListenerMoreCroupBooking() {
        console.log("MyGroupBookging");
        this.$router.push({name: "groupBookingActivityList", query: {'source': 1}})
      },

      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
        });
      }
    },
    created(){
      this.goTab(0);
    }
  }
</script>


<style>

</style>

