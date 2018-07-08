<template>
  <div class="order-details">

    <TopHeader class="noBorder">
      <div class="clickMe" @click="goBack"><span></span></div>
      <i>我的客户</i></TopHeader>
    <!--选项卡-->
    <div class="status-customer bb1">
      <ul>
        <li class="F4 C1 mgl40" v-for="(item,index) in status" :class="{'active':inow==index,'mgr40':index===3}" @click="goTab(index)">
          {{item}}
        </li>
      </ul>
    </div>
    <router-view @refreshTab="refreshTab"></router-view>

  </div>
</template>
<script>

  import TopHeader from '../../components/Header'

  export default{
    name: 'myCustomer',
    data(){
      return {
        inow: 0,
        index: 0,
        empty: false,
        status: ['谈单中', '已飞单','已成单',  '已完结'],
      }
    },
    components: {
      TopHeader
    },
    methods: {

      refreshTab(){
        this.getCustomerCountData();
      },

      goBack(){
        invokeNative({"code": window.jsBridge.CODE_CLOSE});
      },

      goTab(index){
        this.inow = index;
        console.log(index);

        switch (index) {
          case 0://谈单中
            this.inow = 0;
            this.$router.replace({"name": "talking", query: {"status": 1}});
            break;
          case 1://已飞单
            this.inow = 1;
            this.$router.replace({"name": "failure", query: {"status": 3}});
            break;
          case 2://已成单
            this.inow = 2;
            this.$router.replace({"name": "done", query: {"status": 2}});
            break;
          case 3://已完结
            this.inow = 3;
            this.$router.replace({"name": "finishedOrders", query: {"status": 4}});
            break;
        }
      },

      showToast(data){
        invokeNative({"code":window.jsBridge.CODE_TOAST,"data":data});
      },
      getCustomerCountData(){
        // this.status= ['谈单中(12)', '已飞单(14)','已成单(16)',  '已完结(99999)'];
        this.$http.get(window.Host.employee + `/advisor/customer/count`).then(res => {
          if (res.body.succ) {
            var talkingCount = "谈单中（" + res.body.data.talkingCount + "）";
            var completeCount = "已成单（" + res.body.data.completeCount + "）";
            var refuseCount = "已飞单（" + res.body.data.refuseCount + "）";
            var finishCount = "已完结（" + res.body.data.finishCount + "）";
            this.status = [talkingCount, refuseCount, completeCount, finishCount];
          }else if(res.body.stateCode != 312){
            this.showToast(res.body.message);
          }
        }, (res) => {
//          this.showToast("网络异常");
        })
      }

    },
    created(){
      this.getCustomerCountData();
      this.goTab(this.inow);
    }
  }

</script>
<style scoped lang="less">


  .status-customer {
    background-color: #fff;
    white-space:nowrap;
    overflow-x: auto;
    position: relative;
    z-index: 999;
    ul{
      li {
        min-width: 1.8rem;
        width: auto;
        text-align: center;
        display: inline-block;
        line-height: 1.17333rem;
      }

  }
  .active {
    color: #ed316b;
    border-bottom: 2px solid #ed316b;
  }
  .mgl40{
    margin-left: 0.53333rem;
  }
  .mgr40{
    margin-right: 0.53333rem;
  }

  }


</style>
