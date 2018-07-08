<template>
  <div>
    <div>
      <TopHeader class="clearfix">
        <div class="clickMe" @click="goBack"><span></span></div>我的团队
      </TopHeader>
      <!--选项卡-->
      <div class="status bb1">
        <ul>
          <li v-for="(item,index) in status" @click="goTab(index)">
            <span class="F4 C1" :class="{'active':currentIndex==index}">{{item}}</span>
          </li>
        </ul>
      </div>
      <router-view @refreshTab="refreshTab"></router-view>
    </div>
  </div>
</template>

<script>
  import TopHeader from '../../components/Header'

  export default {
    name: 'consultantList',
    components:{
      TopHeader
    },
    data () {
      return {
        status: ['可派单', '不可派单'],
        currentIndex:0
      }
    },
    methods: {
      goBack(){
        invokeNative({
          "code": window.jsBridge.CODE_CLOSE,
        });
      },
      refreshTab(){
        this.getTotalCount();
      },

      goTab(index){
        this.currentIndex = index;
        switch (index) {
          case 0:
            this.$router.push({"name": "consultantCanSendList", query: {"isAccepted": 1}});
            break;
          case 1:
            this.$router.push({"name": "consultantNotSendList"});
        }
      },
      getTotalCount() {

        this.$http.get(window.Host.employee+`/advisor/count`).then((res)=>{
          console.log(res);
          if(res.body.succ == true){
              var acceptOrder = '可派单(' + res.body.data.acceptDistribution + ')';
              var acceptNotOrder = '不可派单(' + res.body.data.refuseDistribution + ')';
              this.status = [acceptOrder, acceptNotOrder];
          } else  {
            if (res.body.stateCode != 312) {
              this.showToast(res.body.message);
            }
          }
        })
      },
      showToast(message) {
        invokeNative({
          "code": window.jsBridge.CODE_TOAST,
          "data": message
        });
      }
    },
    created(){
      this.goTab(0);
      this.getTotalCount();
    }
  }
</script>
