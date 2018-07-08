<template>
  <div class="order-details">

    <TopHeader class="noBorder">
      <div class="clickMe" @click="goBack"><span></span></div>
      <i>{{userName}}</i></TopHeader>
    <!--选项卡-->
    <div class="status bb1">
      <ul>
        <li v-for="(item,index) in status" style="position: relative" @click="goTab(index)">
          <span class="F4 C1" :class="{'active':currentIndex==index}">{{item}}</span>
        </li>
      </ul>
    </div>
    <router-view></router-view>

  </div>
</template>
<script>

  import TopHeader from '../../../components/Header'

  export default{
    name: 'consultantDetail',
    data(){
      return {
        userId: 0,
        currentIndex: 0,
        status: ['总览', '客户', '订单'],
        userName:'家居顾问详情'
      }
    },
    components: {
      TopHeader
    },
    methods: {

      goBack(){
        this.$router.go(-1);
      },

      goTab(index){
        this.currentIndex = index;
        switch (index) {
          case 0://总览
            this.$router.replace({"name": "consultantDetailOverview", query: {"userId": this.userId}});
            break;
          case 1://客户
            this.$router.replace({"name": "consultantDetailCustomer", query: {"userId": this.userId}});
            break;
          case 2://订单
            this.$router.replace({"name": "consultantDetailOrder", query: {"userId": this.userId}});
            break;
        }
      },

    },
    created(){
      this.userId = this.$route.query.userId;
      this.userName = this.$route.query.userName;
      console.log(this.$route.query.userName);
      this.goTab(0);
    }
  }

</script>
<style scoped lang="less">


  .status {
    background-color: #fff;
    height: 1.17333rem;
    position: relative;
    width: 100%;
    z-index: 999;

  ul {
    margin: 0 0.68rem;
    display: flex;
    text-align: center;

  li {
    flex: 1;
    line-height: 1.17333rem;
  }

  }
  .active {
    color: #ed316b;
    border-bottom: 2px solid #ed316b;
    padding-bottom: 0.18666rem;
  }

  }


</style>
